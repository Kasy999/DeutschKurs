'use strict';
// Spiellogik: Fortschritt, Runde, Aufgabengenerator (Port von GameEngine.kt).

const ROUND_SIZE = 12;

class Progress {
  constructor() {
    this.total = Prefs.getInt(Progress.KEY_TOTAL, 0);
    this.peak = Math.max(Prefs.getInt(Progress.KEY_PEAK, 0), this.total);
    this.answered = Prefs.getInt(Progress.KEY_ANSWERED, 0);
    this.correct = Prefs.getInt(Progress.KEY_CORRECT, 0);
    this.bestStreak = Prefs.getInt(Progress.KEY_STREAK, 0);
    this.mistakes = this.loadMistakes();
  }
  get level() { return levelFor(this.total); }
  get openMistakes() { return this.mistakes.size; }
  unlocked(b) { return this.peak >= b.points; }
  nextBadge() { return badges.find((b) => this.peak < b.points) || null; }
  best(mode) { return Prefs.getInt('best_' + mode.name, 0); }
  saveBest(mode, score) {
    if (score <= this.best(mode)) return false;
    Prefs.put('best_' + mode.name, score);
    return true;
  }
  add(delta, right, streak) {
    const oldPeak = this.peak;
    this.total = Math.max(0, this.total + delta);
    if (this.total > this.peak) this.peak = this.total;
    this.answered++;
    if (right) this.correct++;
    if (streak > this.bestStreak) this.bestStreak = streak;
    Prefs.put(Progress.KEY_TOTAL, this.total); Prefs.put(Progress.KEY_PEAK, this.peak);
    Prefs.put(Progress.KEY_ANSWERED, this.answered); Prefs.put(Progress.KEY_CORRECT, this.correct);
    Prefs.put(Progress.KEY_STREAK, this.bestStreak);
    return badges.filter((b) => b.points >= oldPeak + 1 && b.points <= this.peak);
  }
  addBonus(points) {
    if (points <= 0) return [];
    const oldPeak = this.peak;
    this.total += points;
    if (this.total > this.peak) this.peak = this.total;
    Prefs.put(Progress.KEY_TOTAL, this.total); Prefs.put(Progress.KEY_PEAK, this.peak);
    return badges.filter((b) => b.points >= oldPeak + 1 && b.points <= this.peak);
  }
  mistakeWeights() { return new Map(this.mistakes); }
  recordResult(key, right) {
    if (!key) return;
    if (right) {
      const wgt = this.mistakes.get(key);
      if (wgt === undefined) return;
      if (wgt <= 1) this.mistakes.delete(key); else this.mistakes.set(key, wgt - 1);
    } else {
      this.mistakes.set(key, Math.min((this.mistakes.get(key) || 0) + 2, 6));
      while (this.mistakes.size > Progress.MAX_MISTAKES) {
        let drop = null, min = Infinity;
        for (const [k, val] of this.mistakes) if (val < min) { min = val; drop = k; }
        if (drop === null) break;
        this.mistakes.delete(drop);
      }
    }
    Prefs.put(Progress.KEY_MISTAKES, [...this.mistakes].map(([k, val]) => k + Progress.SEP_VALUE + val).join(Progress.SEP_ENTRY));
  }
  loadMistakes() {
    const raw = Prefs.getString(Progress.KEY_MISTAKES, '') || '';
    const map = new Map();
    raw.split(Progress.SEP_ENTRY).forEach((en) => {
      const i = en.lastIndexOf(Progress.SEP_VALUE);
      if (i > 0) { const n = parseInt(en.substring(i + 1), 10); if (!isNaN(n)) map.set(en.substring(0, i), n); }
    });
    return map;
  }
}
Object.assign(Progress, {
  KEY_MISTAKES: 'mistakes', SEP_ENTRY: '\u0001', SEP_VALUE: '\u0002', MAX_MISTAKES: 300,
  KEY_TOTAL: 'total_points', KEY_PEAK: 'peak_points', KEY_ANSWERED: 'answered', KEY_CORRECT: 'correct', KEY_STREAK: 'best_streak',
});

/** Eine Runde. */
class GameRound {
  constructor(mode, progress) {
    this.mode = mode;
    this.progress = progress;
    this.total = ROUND_SIZE;
    this.generator = new TaskGenerator();
    this.startLevel = progress.level;
    this.fixedLevel = AppDifficulty.fixed;
    this.index = 0; this.score = 0; this.streak = 0; this.bestStreak = 0; this.correctCount = 0;
    this.lastAwarded = 0; this.lastStreakBonus = 0; this.roundBonus = 0;
    this.task = this.generator.next(mode, this.effectiveLevel, progress.mistakeWeights());
    this.currentKey = this.generator.lastKey;
    this.isReview = this.generator.lastWasReview;
    this.retries = [];
    this.retryCount = new Map();
    this.answered = false; this.lastRight = false; this.pickedIndex = null;
    this.celebration = null;
    this.earnedBadges = [];
    this.spellAttempts = 0;
  }
  get streakBoost() { return this.fixedLevel == null ? Math.floor(this.streak / 3) : 0; }
  get effectiveLevel() { return this.fixedLevel != null ? this.fixedLevel : Math.min(this.progress.level + this.streakBoost, MAX_LEVEL); }

  answerChoice(i) {
    if (this.task.type !== 'choice' || this.answered) return;
    this.pickedIndex = i;
    this.register(i === this.task.correctIndex);
  }
  answerOrder(picked) {
    if (this.task.type !== 'order' || this.answered) return;
    this.register(this.task.isCorrect(picked));
  }
  answerSpell(input) {
    if (this.task.type !== 'spell') return false;
    if (this.answered) return true;
    const right = this.task.isCorrect(input);
    if (right) {
      if (this.spellAttempts === 0) this.register(true);
      else { this.lastAwarded = 0; this.lastStreakBonus = 0; this.lastRight = true; this.answered = true; }
    } else {
      if (this.spellAttempts === 0) this.book(false);
      this.spellAttempts++;
    }
    return right;
  }
  register(right) { this.book(right); this.lastRight = right; this.answered = true; }
  book(right) {
    const oldLevel = this.progress.level;
    const lvl = this.task.level;
    this.lastStreakBonus = 0;
    if (right) {
      const points = answerPoints(lvl, this.streak, this.task.type === 'order' || this.task.type === 'spell');
      this.streak++;
      this.correctCount++;
      if (this.streak > this.bestStreak) this.bestStreak = this.streak;
      this.lastStreakBonus = streakBonus(this.streak);
      this.lastAwarded = points + this.lastStreakBonus;
    } else {
      this.lastAwarded = -(3 + lvl);
      this.streak = 0;
    }
    this.score += this.lastAwarded;
    this.progress.recordResult(this.currentKey, right);
    if (!right) {
      const n = this.retryCount.get(this.currentKey) || 0;
      const due = Math.min(this.index + 3, this.total - 1);
      if (n < 2 && due > this.index && !this.retries.some((x) => x.key === this.currentKey)) {
        this.retries.push({ key: this.currentKey, due });
        this.retryCount.set(this.currentKey, n + 1);
      }
    }
    const newBadges = this.progress.add(this.lastAwarded, right, this.streak);
    this.earnedBadges.push(...newBadges);
    const newLevel = this.progress.level;
    if (newBadges.length || newLevel > oldLevel) {
      this.celebration = { badges: newBadges, newLevel: newLevel > oldLevel ? newLevel : null };
    }
  }
  advance() {
    this.index++;
    this.answered = false; this.lastRight = false; this.pickedIndex = null; this.spellAttempts = 0;
    if (!this.isFinished()) {
      const due = this.retries.find((x) => x.due <= this.index);
      let retried = null;
      if (due) { this.retries.splice(this.retries.indexOf(due), 1); retried = this.generator.remake(due.key, this.effectiveLevel); }
      if (due && retried) {
        this.task = retried; this.currentKey = due.key; this.isReview = true;
      } else {
        this.task = this.generator.next(this.mode, this.effectiveLevel, this.progress.mistakeWeights());
        this.currentKey = this.generator.lastKey;
        this.isReview = this.generator.lastWasReview;
      }
    } else if (this.roundBonus === 0) {
      this.roundBonus = roundBonus(this.correctCount, this.total, this.effectiveLevel);
      this.score += this.roundBonus;
      this.earnedBadges.push(...this.progress.addBonus(this.roundBonus));
    }
  }
  isFinished() { return this.index >= this.total; }
}

const Kind = Object.fromEntries([
  'DE_RU', 'RU_DE', 'ARTICLE', 'PLURAL', 'PRAESENS', 'PERF_AUX', 'PERF_PART', 'GRAMMAR', 'ORDER', 'SPELL',
  'KASUS_AKK', 'KASUS_DAT', 'PRAET', 'FUTUR_AUX', 'FUTUR_INF', 'GRAMMAR_CASE', 'GRAMMAR_TENSE', 'REFLEX',
  'MODAL_PRAET', 'MODAL_PERF_INF', 'MODAL_PERF_AUX', 'KONJ_WUERDE', 'KONJ_COND', 'KONJ_PAST', 'GRAMMAR_KONJ',
].map((k) => [k, k]));

const prefixKinds = new Map([
  ['deru', Kind.DE_RU], ['rude', Kind.RU_DE], ['art', Kind.ARTICLE], ['pl', Kind.PLURAL],
  ['pr', Kind.PRAESENS], ['pa', Kind.PERF_AUX], ['pp', Kind.PERF_PART], ['or', Kind.ORDER],
  ['sp', Kind.SPELL], ['pt', Kind.PRAET], ['rf', Kind.REFLEX],
  ['mp', Kind.MODAL_PRAET], ['mi', Kind.MODAL_PERF_INF], ['ma', Kind.MODAL_PERF_AUX],
  ['kw', Kind.KONJ_WUERDE], ['kc', Kind.KONJ_COND], ['kv', Kind.KONJ_PAST],
]);

// associateBy: bei doppelten Schlüsseln gewinnt der letzte Eintrag (wie in Kotlin)
const associateBy = (list, f) => { const m = new Map(); list.forEach((x) => m.set(f(x), x)); return m; };
const modalByInf = associateBy(modalPast, (x) => x.inf);
const wordByDe = associateBy(vocabulary, (x) => x.de);
const verbByInf = associateBy(verbs, (x) => x.inf);
const reflexByInf = associateBy(reflexiveVerbs, (x) => x.inf);
const subjectByText = associateBy(subjects, (x) => x.text);
const choiceBySentence = associateBy(choiceItems, (x) => x.sentence);
const orderByChunks = associateBy(orderItems, (x) => x.chunks.join(' '));
const spellByCorrect = associateBy(spellItems, (x) => x.correct);

const replaceDouble = (str) => str.split('  ').join(' ');
const substringAfter = (str, d) => { const i = str.indexOf(d); return i < 0 ? str : str.substring(i + d.length); };
const substringBefore = (str, d) => { const i = str.indexOf(d); return i < 0 ? str : str.substring(0, i); };
const toIntOrNull = (x) => { if (x == null || !/^-?\d+$/.test(x)) return null; return parseInt(x, 10); };

class TaskGenerator {
  constructor() {
    this.used = new Set();
    this.lastKey = '';
    this.lastWasReview = false;
  }

  next(mode, level, review = new Map()) {
    this.lastWasReview = false;
    const pool = [...review].filter(([k]) => !this.used.has(k) && this.allowed(k, mode, level));
    if (pool.length && Math.random() < Math.min(0.4, 0.1 * pool.length)) {
      let roll = randInt(pool.reduce((a, [, val]) => a + val, 0));
      const key = pool.find(([, val]) => { roll -= val; return roll < 0; })[0];
      const tk = this.remake(key, level);
      if (tk) { this.used.add(key); this.lastWasReview = true; return tk; }
    }
    for (let n = 0; n < 40; n++) {
      const kind = this.pickKind(mode, level);
      const made = this.make(kind, level);
      if (made && !this.used.has(made[0])) {
        this.used.add(made[0]);
        this.lastKey = made[0];
        return made[1];
      }
    }
    const made = this.make(this.pickKind(mode, level), level);
    this.lastKey = made[0];
    return made[1];
  }

  allowed(key, mode, level) {
    const kinds = new Set(this.weightsFor(mode, level).map((x) => x[0]));
    const p = substringBefore(key, ':');
    switch (p) {
      case 'gr': case 'gc': case 'gt': case 'gk': {
        const item = choiceBySentence.get(substringAfter(key, ':'));
        if (!item) return false;
        return kinds.has(Kind.GRAMMAR) || (kinds.has(Kind.GRAMMAR_CASE) && caseRules.has(item.rule)) ||
          (kinds.has(Kind.GRAMMAR_TENSE) && tenseRules.has(item.rule)) || (kinds.has(Kind.GRAMMAR_KONJ) && item.rule === 'konj2');
      }
      case 'ka': return kinds.has(Kind.KASUS_AKK) || kinds.has(Kind.KASUS_DAT);
      case 'fu': return kinds.has(Kind.FUTUR_AUX) || kinds.has(Kind.FUTUR_INF);
      default: { const k = prefixKinds.get(p); return k ? kinds.has(k) : false; }
    }
  }

  remake(key, level) {
    this.lastKey = key;
    const parts = key.split(':');
    const word = () => wordByDe.get(parts[1]);
    const verb = () => verbByInf.get(parts[1]);
    const anySubject = () => subjects[randInt(subjects.length)];
    const subj = () => subjectByText.get(parts[2]) || anySubject();
    const after = (pre) => removePrefix(key, pre);
    const ifv = (x, f) => (x ? f(x) : null);
    switch (parts[0]) {
      case 'deru': return ifv(word(), (x) => this.deToRu(x, level));
      case 'rude': return ifv(word(), (x) => this.ruToDe(x, level));
      case 'art': return ifv(word(), (x) => this.article(x, level));
      case 'pl': { const x = word(); return x && x.plural ? this.plural(x, level) : null; }
      case 'pr': return ifv(verb(), (x) => this.praesens(x, subj(), level));
      case 'pa': { const x = verb(); return x && x.aux != null ? this.perfAux(x, anySubject(), level) : null; }
      case 'pp': { const x = verb(); return x && x.aux != null ? this.perfPart(x, anySubject(), level) : null; }
      case 'gr': return ifv(choiceBySentence.get(after('gr:')), (x) => this.grammar(x));
      case 'gc': return ifv(choiceBySentence.get(after('gc:')), (x) => this.grammar(x, Category.KASUS));
      case 'gt': return ifv(choiceBySentence.get(after('gt:')), (x) => this.grammar(x, Category.ZEIT));
      case 'gk': return ifv(choiceBySentence.get(after('gk:')), (x) => this.grammar(x, Category.KONJ));
      case 'kw': case 'kc': return ifv(konjActivities.find((x) => x.inf === parts[1]), (vb) => {
        const si = coerceIn(toIntOrNull(parts[2]) ?? 0, 0, konjSubjects.length - 1);
        const ci = coerceIn(toIntOrNull(parts[3]) ?? 0, 0, konjConditions.length - 1);
        return this.konjPresent(vb, konjSubjects[si], ci, parts[0] === 'kw', level);
      });
      case 'kv': return ifv(konjPastVerbs.find((x) => x.inf === parts[1]), (vb) =>
        this.konjPast(vb, konjSubjects[coerceIn(toIntOrNull(parts[2]) ?? 0, 0, konjSubjects.length - 1)], level));
      case 'or': return ifv(orderByChunks.get(after('or:')), (x) => this.order(x));
      case 'sp': return ifv(spellByCorrect.get(after('sp:')), (x) => this.spell(x));
      case 'ka': return ifv(word(), (x) => {
        const frames = caseFrames.filter((f) => f.dativ === (parts[2] === 'true'));
        return this.kasus(x, frames[randInt(frames.length)], level);
      });
      case 'pt': { const x = verb(); return x && praeteritum.has(x.inf) ? this.praet(x, subj(), level) : null; }
      case 'fu': { const x = verb(); return x && x.aux != null ? this.futur(x, subj(), level, parts[3] === Kind.FUTUR_AUX) : null; }
      case 'mp': case 'mi': case 'ma': return ifv(modalByInf.get(parts[1]), (m) => {
        const fi = coerceIn(toIntOrNull(parts[3]) ?? 0, 0, m.frames.length - 1);
        return parts[0] === 'mp' ? this.modalPraet(m, subj(), fi, level) : this.modalPerf(m, subj(), fi, parts[0] === 'ma', level);
      });
      case 'rf': return ifv(reflexByInf.get(parts[1]), (x) => this.reflex(x, subj(), toIntOrNull(parts[3]) ?? 0, level));
      default: return null;
    }
  }

  pickKind(mode, level) {
    const weights = this.weightsFor(mode, level);
    let roll = randInt(weights.reduce((a, x) => a + x[1], 0));
    for (const [k, wgt] of weights) {
      if (roll < wgt) return k;
      roll -= wgt;
    }
    return weights[weights.length - 1][0];
  }

  weightsFor(mode, level) {
    const perf = level >= 3;
    let wts;
    switch (mode) {
      case GameMode.VOKABELN: wts = [[Kind.DE_RU, 3], [Kind.RU_DE, 3], [Kind.ARTICLE, 3], [Kind.PLURAL, 2]]; break;
      case GameMode.VERBEN: wts = [
        [Kind.PRAESENS, 5], [Kind.PERF_AUX, perf ? 2 : 0], [Kind.PERF_PART, perf ? 3 : 0],
        [Kind.PRAET, perf ? 2 : 0], [Kind.FUTUR_AUX, perf ? 1 : 0], [Kind.FUTUR_INF, perf ? 1 : 0],
        [Kind.REFLEX, 3],
        [Kind.MODAL_PRAET, level >= 2 ? 2 : 0],
        [Kind.MODAL_PERF_INF, level >= 4 ? 1 : 0], [Kind.MODAL_PERF_AUX, level >= 4 ? 1 : 0],
      ]; break;
      case GameMode.FAELLE: wts = [[Kind.KASUS_AKK, 3], [Kind.KASUS_DAT, 3], [Kind.GRAMMAR_CASE, 5], [Kind.REFLEX, 1]]; break;
      case GameMode.ZEITEN: wts = [
        [Kind.PRAESENS, 1], [Kind.PERF_AUX, 2], [Kind.PERF_PART, 2], [Kind.PRAET, 3],
        [Kind.FUTUR_AUX, 2], [Kind.FUTUR_INF, 1], [Kind.GRAMMAR_TENSE, 4], [Kind.REFLEX, 1],
        [Kind.MODAL_PRAET, 2], [Kind.MODAL_PERF_INF, 1], [Kind.MODAL_PERF_AUX, 1],
      ]; break;
      case GameMode.KONJUNKTIV: wts = [[Kind.KONJ_WUERDE, 3], [Kind.KONJ_COND, 3], [Kind.KONJ_PAST, 2], [Kind.GRAMMAR_KONJ, 3]]; break;
      case GameMode.GRAMMATIK: wts = [[Kind.GRAMMAR, 1]]; break;
      case GameMode.SATZBAU: wts = [[Kind.ORDER, 1]]; break;
      case GameMode.RECHTSCHREIBUNG: wts = [[Kind.SPELL, 1]]; break;
      default: wts = [
        [Kind.DE_RU, 1], [Kind.RU_DE, 1], [Kind.ARTICLE, 1], [Kind.PLURAL, 1],
        [Kind.PRAESENS, 2], [Kind.PERF_AUX, perf ? 1 : 0], [Kind.PERF_PART, perf ? 1 : 0],
        [Kind.GRAMMAR, 4], [Kind.ORDER, 3], [Kind.SPELL, 2],
        [Kind.KASUS_AKK, 1], [Kind.KASUS_DAT, 1], [Kind.PRAET, perf ? 1 : 0],
        [Kind.FUTUR_AUX, level >= 4 ? 1 : 0], [Kind.REFLEX, 1],
        [Kind.MODAL_PRAET, level >= 3 ? 1 : 0],
        [Kind.KONJ_WUERDE, level >= 4 ? 1 : 0],
      ];
    }
    return wts.filter((x) => x[1] > 0);
  }

  targetLevel(level, max) {
    const l = Math.random() < 0.65 ? level : Math.max(1, level - 2) + randInt(level + 1 - Math.max(1, level - 2));
    return coerceIn(l, 1, max);
  }

  pickByLevel(items, target, levelOf) {
    const exact = items.filter((x) => levelOf(x) === target);
    let pool = exact;
    if (!pool.length) pool = items.filter((x) => levelOf(x) <= target);
    if (!pool.length) pool = items;
    return pool[randInt(pool.length)];
  }

  make(kind, level) {
    const lv = (x) => x.level;
    switch (kind) {
      case Kind.DE_RU: { const x = this.pickWord(level); return ['deru:' + x.de, this.deToRu(x, level)]; }
      case Kind.RU_DE: { const x = this.pickWord(level); return ['rude:' + x.de, this.ruToDe(x, level)]; }
      case Kind.ARTICLE: { const x = this.pickWord(level); return ['art:' + x.de, this.article(x, level)]; }
      case Kind.PLURAL: {
        const withPlural = vocabulary.filter((x) => x.plural);
        const x = this.pickByLevel(withPlural, this.targetLevel(level, 4), lv);
        return ['pl:' + x.de, this.plural(x, level)];
      }
      case Kind.PRAESENS: {
        const vb = this.pickByLevel(verbs, this.targetLevel(level, 3), lv);
        const su = subjects[randInt(subjects.length)];
        return [`pr:${vb.inf}:${su.text}`, this.praesens(vb, su, level)];
      }
      case Kind.PERF_AUX: case Kind.PERF_PART: {
        const vb = this.pickByLevel(verbs.filter((x) => x.aux != null), this.targetLevel(level, 3), lv);
        const su = subjects[randInt(subjects.length)];
        return kind === Kind.PERF_AUX ? ['pa:' + vb.inf, this.perfAux(vb, su, level)] : ['pp:' + vb.inf, this.perfPart(vb, su, level)];
      }
      case Kind.GRAMMAR: {
        const item = this.pickByLevel(choiceItems, this.targetLevel(level, MAX_LEVEL), lv);
        return ['gr:' + item.sentence, this.grammar(item)];
      }
      case Kind.ORDER: {
        const item = this.pickByLevel(orderItems, this.targetLevel(level, MAX_LEVEL), lv);
        return ['or:' + item.chunks.join(' '), this.order(item)];
      }
      case Kind.SPELL: {
        const item = this.pickByLevel(spellItems, this.targetLevel(level, MAX_LEVEL), lv);
        return ['sp:' + item.correct, this.spell(item)];
      }
      case Kind.KASUS_AKK: case Kind.KASUS_DAT: {
        const dativ = kind === Kind.KASUS_DAT;
        const x = this.pickByLevel(caseWords, this.targetLevel(level, 4), lv);
        const frames = caseFrames.filter((f) => f.dativ === dativ);
        const f = frames[randInt(frames.length)];
        return [`ka:${x.de}:${dativ}`, this.kasus(x, f, level)];
      }
      case Kind.PRAET: {
        const vb = this.pickByLevel(verbs.filter((x) => x.aux != null && praeteritum.has(x.inf)), this.targetLevel(level, 3), lv);
        const su = subjects[randInt(subjects.length)];
        return [`pt:${vb.inf}:${su.text}`, this.praet(vb, su, level)];
      }
      case Kind.FUTUR_AUX: case Kind.FUTUR_INF: {
        const vb = this.pickByLevel(verbs.filter((x) => x.aux != null), this.targetLevel(level, 3), lv);
        const su = subjects[randInt(subjects.length)];
        return [`fu:${vb.inf}:${su.text}:${kind}`, this.futur(vb, su, level, kind === Kind.FUTUR_AUX)];
      }
      case Kind.KONJ_WUERDE: case Kind.KONJ_COND: {
        const vb = this.pickByLevel(konjActivities, this.targetLevel(level, 3), lv);
        const si = randInt(konjSubjects.length);
        const ci = randInt(konjConditions.length);
        const prefix = kind === Kind.KONJ_WUERDE ? 'kw' : 'kc';
        return [`${prefix}:${vb.inf}:${si}:${ci}`, this.konjPresent(vb, konjSubjects[si], ci, kind === Kind.KONJ_WUERDE, level)];
      }
      case Kind.KONJ_PAST: {
        const vb = this.pickByLevel(konjPastVerbs, this.targetLevel(level, 3), lv);
        const si = randInt(konjSubjects.length);
        return [`kv:${vb.inf}:${si}`, this.konjPast(vb, konjSubjects[si], level)];
      }
      case Kind.GRAMMAR_KONJ: {
        const item = this.pickByLevel(choiceItems.filter((x) => x.rule === 'konj2'), this.targetLevel(level, MAX_LEVEL), lv);
        return ['gk:' + item.sentence, this.grammar(item, Category.KONJ)];
      }
      case Kind.MODAL_PRAET: case Kind.MODAL_PERF_INF: case Kind.MODAL_PERF_AUX: {
        const m = this.pickByLevel(modalPast, this.targetLevel(level, 3), lv);
        const su = subjects[randInt(subjects.length)];
        const fi = randInt(m.frames.length);
        const prefix = kind === Kind.MODAL_PRAET ? 'mp' : kind === Kind.MODAL_PERF_INF ? 'mi' : 'ma';
        const tk = kind === Kind.MODAL_PRAET ? this.modalPraet(m, su, fi, level) : this.modalPerf(m, su, fi, kind === Kind.MODAL_PERF_AUX, level);
        return [`${prefix}:${m.inf}:${su.text}:${fi}`, tk];
      }
      case Kind.REFLEX: {
        const vb = this.pickByLevel(reflexiveVerbs, this.targetLevel(level, 4), lv);
        const su = subjects[randInt(subjects.length)];
        const tense = level >= 3 ? randInt(3) : 0;
        return [`rf:${vb.inf}:${su.text}:${tense}`, this.reflex(vb, su, tense, level)];
      }
      case Kind.GRAMMAR_CASE: case Kind.GRAMMAR_TENSE: {
        const rls = kind === Kind.GRAMMAR_CASE ? caseRules : tenseRules;
        const item = this.pickByLevel(choiceItems.filter((x) => rls.has(x.rule)), this.targetLevel(level, MAX_LEVEL), lv);
        const prefix = kind === Kind.GRAMMAR_CASE ? 'gc' : 'gt';
        return [`${prefix}:${item.sentence}`, this.grammar(item, kind === Kind.GRAMMAR_CASE ? Category.KASUS : Category.ZEIT)];
      }
    }
    return null;
  }

  // ---------------- Fälle ----------------
  kasus(wd, f, level) {
    const correct = f.dativ ? dativeArticle(wd.article) : accusativeArticle(wd.article);
    const distract = shuffled(['der', 'die', 'das', 'den', 'dem'].filter((x) => x !== correct)).slice(0, 3);
    const prompt = f.pattern.split('{x}').join(`___ ${wd.de}`);
    const sentence = f.pattern.split('{x}').join(`${correct} ${wd.de}`);
    const nom = `${wd.article} ${wd.de}`;
    const form = `${correct} ${wd.de}`;
    const caseName = f.dativ ? 'Dativ' : 'Akkusativ';
    return this.choice(Math.max(level, wd.level), Category.KASUS, () => prompt, () => `Nominativ: ${nom} (${tr(wd.ru)}) → ${caseName}?`, correct, distract, {
      solution: () => sentence,
      explanation: Bi(
        () => (f.dativ ? `„${f.verbPrep}“: Die Präposition verlangt den Dativ: der/das → dem, die → der. ${nom} → ${form}.`
          : `„${f.verbPrep}“ verlangt den Akkusativ: der → den; die und das bleiben gleich. ${nom} → ${form}.`),
        () => (f.dativ ? S.caseDat(f.verbPrep, nom, form) : S.caseAkk(f.verbPrep, nom, form)),
      ),
    });
  }

  // ---------------- Konjunktiv II ----------------
  konjPresent(vb, su, ci, askWuerde, level) {
    const p = su.person;
    const [cond, withHaben] = konjConditions[ci];
    const condAux = (withHaben ? haetteForms : waereForms)[p];
    const wuerde = wuerdeForms[p];
    const main = replaceDouble(`${su.pronoun} ${vb.complement} ${vb.inf}`);
    const sentence = `Wenn ${su.inClause} ${cond} ${condAux}, ${wuerde} ${main}.`;
    let prompt, correct, distract;
    if (askWuerde) {
      prompt = `Wenn ${su.inClause} ${cond} ${condAux}, ___ ${main}.`; correct = wuerde;
      distract = distinct([werdenForms[p], wurdeForms[p], ...shuffled(wuerdeForms)]).filter((x) => x !== wuerde).slice(0, 3);
    } else {
      const indicative = withHaben ? [hatteForms[p], habenForms[p]] : [warForms[p], seinForms[p]];
      const cross = (withHaben ? waereForms : haetteForms)[p];
      prompt = `Wenn ${su.inClause} ${cond} ___, ${wuerde} ${main}.`; correct = condAux;
      distract = distinct([...indicative, cross]).filter((x) => x !== condAux).slice(0, 3);
    }
    const rr = rule('konj2');
    return this.choice(Math.max(level, 3), Category.KONJ, () => prompt, () => `Konjunktiv II · ${vb.inf} (${tr(vb.ru)})`, correct, distract, {
      solution: () => sentence,
      explanation: Bi(
        () => (askWuerde
          ? `Irreale Bedingung (Konjunktiv II): Im Hauptsatz steht würde + Infinitiv am Ende: ${su.label} → „${wuerde}“. Formen: ich würde, du würdest, er würde, wir würden, ihr würdet, sie würden. ${rr.de}`
          : `Im wenn-Satz drückt man die irreale Bedingung mit hätte bzw. wäre aus (nicht hatte/war!): ${su.label} → „${condAux}“. hätte: ich hätte, du hättest, er hätte, wir hätten, ihr hättet, sie hätten; wäre: ich wäre, du wärst, er wäre, wir wären, ihr wärt, sie wären. ${rr.de}`),
        () => (askWuerde ? S.konjWuerdeExpl(su.label, wuerde) : S.konjCondExpl(su.label, condAux)) + rr.loc,
      ),
    });
  }

  konjPast(vb, su, level) {
    const p = su.person;
    const sein = vb.aux === 'sein';
    const correct = (sein ? waereForms : haetteForms)[p];
    const other = (sein ? haetteForms : waereForms)[p];
    const indicative = (sein ? warForms : hatteForms)[p];
    const prompt = replaceDouble(`Wenn ${su.inClause} ${vb.perfComplement} ${vb.partizip} ___, wäre alles anders gewesen.`);
    const sentence = prompt.split('___').join(correct);
    const distract = distinct([other, indicative, wuerdeForms[p]]).filter((x) => x !== correct);
    const aux = vb.aux || '';
    const rr = rule('konj2');
    return this.choice(Math.max(level, 5), Category.KONJ, () => prompt, () => `Konjunktiv II Vergangenheit · ${vb.inf} (${tr(vb.ru)})`, correct, distract, {
      solution: () => sentence,
      explanation: Bi(
        () => `Irreale Bedingung in der Vergangenheit: hätte/wäre + Partizip II. „${vb.inf}“ bildet das Perfekt mit „${aux}“ → „${correct}“. ${rr.de}`,
        () => S.konjPastExpl(vb.inf, tr(vb.ru), aux, correct) + rr.loc,
      ),
    });
  }

  // ---------------- Modalverben in der Vergangenheit ----------------
  modalPraet(m, su, fi, level) {
    const [comp, inf] = m.frames[fi];
    const correct = m.praet[su.person];
    const vb = verbByInf.get(m.inf);
    const present = vb ? vb.forms[su.person] : null;
    const prompt = `${su.text} ___ ${comp} ${inf}.`;
    const sentence = `${su.text} ${correct} ${comp} ${inf}.`;
    const distract = shuffled(distinct([...m.praet, ...(present != null ? [present] : []), m.partizip]).filter((x) => x !== correct)).slice(0, 3);
    const conj = personLabels.map((pl, i) => `${pl} ${m.praet[i]}`).join(', ');
    const meaning = vb ? vb.ru : '';
    const rr = rule('modal_vergangenheit');
    return this.choice(Math.max(level, m.level), Category.ZEIT, () => prompt, () => `Präteritum: ${m.inf} (${tr(meaning)})`, correct, distract, {
      solution: () => sentence,
      explanation: Bi(
        () => `Präteritum von „${m.inf}“: ${su.label} → „${correct}“ — ohne Umlaut! Alle Formen: ${conj}. Der Infinitiv steht am Ende. ${rr.de}`,
        () => S.modalPraetExpl(m.inf, tr(meaning), su.label, correct, conj) + rr.loc,
      ),
    });
  }

  modalPerf(m, su, fi, askAux, level) {
    const [comp, inf] = m.frames[fi];
    const aux = habenForms[su.person];
    const sentence = `${su.text} ${aux} ${comp} ${inf} ${m.inf}.`;
    const vb = verbByInf.get(m.inf);
    const present = vb ? vb.forms : [];
    let prompt, correct, distract;
    if (askAux) {
      prompt = `${su.text} ___ ${comp} ${inf} ${m.inf}.`; correct = aux;
      distract = distinct([seinForms[su.person], ...shuffled([...habenForms, ...seinForms])]).filter((x) => x !== aux).slice(0, 3);
    } else {
      prompt = `${su.text} ${aux} ${comp} ${inf} ___.`; correct = m.inf;
      distract = distinct([m.partizip, m.praet[su.person], m.praet[2], ...present]).filter((x) => x !== m.inf).slice(0, 3);
    }
    const meaning = vb ? vb.ru : '';
    const rr = rule('modal_vergangenheit');
    return this.choice(Math.max(level, 4), Category.ZEIT, () => prompt, () => `Perfekt: ${m.inf} (${tr(meaning)}) + ${inf}`, correct, distract, {
      solution: () => sentence,
      explanation: Bi(
        () => `Perfekt von Modalverben mit einem anderen Verb: haben + zwei Infinitive am Ende (Ersatzinfinitiv): „${sentence}“ ` +
          `Das Hilfsverb ist immer „haben“, auch bei Bewegungsverben. Das Partizip (${m.partizip}) benutzt man nur ohne zweites Verb. ` +
          `Im Gespräch nimmt man meist das Präteritum: ${su.label} ${m.praet[su.person]} … ${inf}.`,
        () => S.modalPerfExpl(m.inf, tr(meaning), sentence) + rr.loc,
      ),
    });
  }

  // ---------------- Reflexive Verben ----------------
  reflex(vb, su, tense, level) {
    const own = vb.dativ ? reflexDat : reflexAkk;
    const other = vb.dativ ? reflexAkk : reflexDat;
    const pron = own[su.person];
    const pre = vb.prefix ? ' ' + vb.prefix : '';
    let verbPart, tail;
    if (tense === 1) { verbPart = habenForms[su.person]; tail = `${vb.perfComplement} ${vb.partizip}`; }
    else if (tense === 2) { verbPart = vb.praet[su.person]; tail = `${vb.perfComplement}${pre}`; }
    else { verbPart = vb.forms[su.person]; tail = `${vb.complement}${pre}`; }
    const prompt = `${su.text} ${verbPart} ___ ${tail}.`;
    const sentence = `${su.text} ${verbPart} ${pron} ${tail}.`;
    const distract = distinct([other[su.person], ...shuffled([...reflexAkk, ...reflexDat, 'ihn', 'ihm', 'ihr'])]).filter((x) => x !== pron).slice(0, 3);
    const tenseName = ['Präsens', 'Perfekt', 'Präteritum'][coerceIn(tense, 0, 2)];
    const rr = rule('reflexiv');
    const caseDe = vb.dativ
      ? 'Es gibt noch ein Akkusativobjekt, deshalb steht das Reflexivpronomen im Dativ: mir, dir, sich, uns, euch, sich.'
      : 'Reflexivpronomen im Akkusativ: mich, dich, sich, uns, euch, sich.';
    return this.choice(Math.max(level, vb.level), Category.REFLEXIV, () => prompt, () => `${vb.inf} (${tr(vb.ru)}) · ${tenseName}`, pron, distract, {
      solution: () => sentence,
      explanation: Bi(
        () => `„${vb.inf}“ ist reflexiv: ${su.label} → „${pron}“. ${caseDe} ${rr.de}`,
        () => S.reflexExpl(vb.inf, tr(vb.ru), su.label, pron) + rr.loc,
      ),
    });
  }

  // ---------------- Präteritum & Futur ----------------
  praet(vb, su, level) {
    const forms = praeteritum.get(vb.inf);
    const correct = forms[su.person];
    const tail = [vb.perfComplement, vb.prefix].filter((x) => x).join(' ');
    const prompt = replaceDouble(`${su.text} ___ ${tail}.`);
    const sentence = replaceDouble(`${su.text} ${correct} ${tail}.`);
    const distract = shuffled(distinct([...forms, vb.forms[su.person], removePrefix(vb.partizip, vb.prefix)]).filter((x) => x !== correct && x.trim())).slice(0, 3);
    const conj = personLabels.map((pl, i) => `${pl} ${forms[i]}` + (vb.prefix ? ' ' + vb.prefix : '')).join(', ');
    const rr = rule('praet_stark');
    return this.choice(Math.max(level, 3), Category.ZEIT, () => prompt, () => `Präteritum: ${vb.inf} (${tr(vb.ru)})`, correct, distract, {
      solution: () => sentence,
      explanation: Bi(
        () => `Präteritum von „${vb.inf}“: ${su.label} → „${correct}“. Alle Formen: ${conj}. ${rr.de}`,
        () => S.praetExpl(vb.inf, tr(vb.ru), su.label, correct, conj) + rr.loc,
      ),
    });
  }

  futur(vb, su, level, askAux) {
    const aux = werdenForms[su.person];
    const head = [vb.complement].filter((x) => x).join(' ');
    const sentence = replaceDouble(`${su.text} ${aux} ${head} ${vb.inf}.`);
    let prompt, correct, distract;
    if (askAux) {
      prompt = replaceDouble(`${su.text} ___ ${head} ${vb.inf}.`); correct = aux;
      distract = shuffled(distinct([...werdenForms, 'wurde']).filter((x) => x !== aux)).slice(0, 3);
    } else {
      const pf = praeteritum.get(vb.inf);
      const praet = pf ? vb.prefix + pf[2] : null;
      prompt = replaceDouble(`${su.text} ${aux} ${head} ___.`); correct = vb.inf;
      distract = shuffled(distinct([vb.prefix + vb.forms[2], vb.partizip, praet, vb.prefix + vb.forms[0]].filter((x) => x != null)).filter((x) => x !== vb.inf)).slice(0, 3);
    }
    const rr = rule('futur');
    return this.choice(Math.max(level, 3), Category.ZEIT, () => prompt, () => `Futur I: ${vb.inf} (${tr(vb.ru)})`, correct, distract, {
      solution: () => sentence,
      explanation: Bi(
        () => `Futur I = werden + Infinitiv am Satzende: ${su.label} ${aux} … ${vb.inf}. ` +
          `Formen von werden: ich werde, du wirst, er wird, wir werden, ihr werdet, sie werden. ${rr.de}`,
        () => S.futurExpl(vb.inf, tr(vb.ru), su.label, aux) + ' ' + rr.loc,
      ),
    });
  }

  spell(item) {
    const rr = rule(item.rule);
    return new SpellTask({
      level: item.level, category: Category.SCHREIBUNG, wrong: item.wrong, solution: item.correct,
      explanation: Bi(
        () => `Fehler: „${item.wrong}“ → richtig: „${item.correct}“.\n\n${rr.de}`,
        () => `${S.translation(tr(item.ru))}\n\n${S.spellError(item.wrong, item.correct)}\n\n${rr.loc}`,
      ),
    });
  }

  pickWord(level) { return this.pickByLevel(vocabulary, this.targetLevel(level, 4), (x) => x.level); }
  distractorCount(level) { return level >= 4 ? 4 : 3; }

  // ---------------- Vokabeln ----------------
  deToRu(wd, level) {
    const near = vocabulary.filter((x) => x.ru !== wd.ru && Math.abs(x.level - wd.level) <= 1);
    const distract = distinct(shuffled(near).map((x) => x.ru)).slice(0, this.distractorCount(level));
    const pl = wd.plural ? ` (Pl.: die ${wd.plural})` : '';
    return this.choice(level, Category.VOKABEL, () => `Was bedeutet „${wd.article} ${wd.de}“?`, null, wd.ru, distract, {
      solution: () => `${wd.article} ${wd.de} — ${tr(wd.ru)}`,
      speech: `${wd.article} ${wd.de}`,
      promptSpeech: `${wd.article} ${wd.de}`,
      localizedOptions: true,
      explanation: Bi(
        () => `„${wd.article} ${wd.de}“${pl} bedeutet auf ${AppLang.current.germanName} „${tr(wd.ru)}“. Lerne Nomen immer zusammen mit dem Artikel!`,
        () => S.wordMeans(`${wd.article} ${wd.de}`, pl, tr(wd.ru)),
      ),
    });
  }

  ruToDe(wd, level) {
    const correct = `${wd.article} ${wd.de}`;
    const near = vocabulary.filter((x) => x.ru !== wd.ru && x.de !== wd.de && Math.abs(x.level - wd.level) <= 1);
    const distract = distinct(shuffled(near).map((x) => `${x.article} ${x.de}`)).slice(0, this.distractorCount(level));
    const pl = wd.plural || null;
    return this.choice(level, Category.VOKABEL, () => `Wie heißt „${tr(wd.ru)}“ auf Deutsch?`, null, correct, distract, {
      solution: () => `${tr(wd.ru)} — ${correct}`,
      speech: correct + (pl == null ? '' : `. Die ${pl}.`),
      explanation: Bi(
        () => `„${tr(wd.ru)}“ heißt auf Deutsch „${correct}“` + (pl == null ? '.' : `, Plural: die ${pl}.`),
        () => S.inGerman(tr(wd.ru), correct, pl),
      ),
    });
  }

  article(wd, level) {
    const hint = articleHint(wd);
    const genusDe = { der: 'maskulin', die: 'feminin', das: 'neutral' }[wd.article];
    return this.choice(level, Category.ARTIKEL, () => `Welcher Artikel passt: „___ ${wd.de}“?`, () => `(${tr(wd.ru)})`, wd.article,
      ['der', 'die', 'das'].filter((x) => x !== wd.article), {
        solution: () => `${wd.article} ${wd.de}`,
        explanation: Bi(
          () => `„${wd.de}“ ist ${genusDe}: ${wd.article} ${wd.de}. ` + (hint ? hint.de : 'Hier hilft keine Regel — einfach mit Artikel auswendig lernen.'),
          () => S.articleIs(wd.de, S.genus.get(wd.article), wd.article) + (hint ? hint.loc : S.noRule),
        ),
      });
  }

  plural(wd, level) {
    const correct = `die ${wd.plural}`;
    const distract = shuffled(this.wrongPlurals(wd)).slice(0, this.distractorCount(level)).map((x) => `die ${x}`);
    const same = wd.plural === wd.de;
    return this.choice(level, Category.PLURAL, () => `Was ist der Plural von „${wd.article} ${wd.de}“?`, () => `(${tr(wd.ru)})`, correct, distract, {
      solution: () => `${wd.article} ${wd.de} → die ${wd.plural}`,
      speech: `${wd.article} ${wd.de}. Die ${wd.plural}.`,
      explanation: Bi(
        () => `Plural: ${wd.article} ${wd.de} → die ${wd.plural}. Im Plural ist der Artikel immer „die“.` + (same ? ' Bei diesem Wort ändert sich die Form nicht.' : ''),
        () => S.pluralExpl(wd.article, wd.de, wd.plural) + (same ? S.pluralSame : ''),
      ),
    });
  }

  wrongPlurals(wd) {
    const b = wd.de;
    const um = this.umlaut(b);
    const cands = b.endsWith('e')
      ? [b + 's', b + 'r', um + 'n', b, um, b.slice(0, -1) + 'er', b + 'n']
      : [b + 'e', b + 'en', b + 'er', b + 's', um + 'e', um + 'er', b, um, b + 'n'];
    return distinct(cands).filter((x) => x !== wd.plural && !x.endsWith('ee') && !x.endsWith('enen'));
  }

  umlaut(str) {
    const iAu = str.lastIndexOf('au');
    if (iAu >= 0) return str.substring(0, iAu) + 'äu' + str.substring(iAu + 2);
    const iAuCap = str.indexOf('Au');
    if (iAuCap === 0) return 'Äu' + str.substring(2);
    let idx = -1;
    for (let i = str.length - 1; i >= 0; i--) if ('aouAOU'.includes(str[i])) { idx = i; break; }
    if (idx < 0) return str;
    const repl = { a: 'ä', o: 'ö', u: 'ü', A: 'Ä', O: 'Ö', U: 'Ü' }[str[idx]];
    return str.substring(0, idx) + repl + str.substring(idx + 1);
  }

  // ---------------- Verben ----------------
  conjugationLine(vb) { return personLabels.map((pl, i) => `${pl} ${vb.forms[i]}` + (vb.prefix ? ' ' + vb.prefix : '')).join(', '); }

  praesens(vb, su, level) {
    const correct = vb.forms[su.person];
    const tail = [vb.complement, vb.prefix].filter((x) => x).join(' ');
    const prompt = `${su.text} ___ ${tail}.`;
    const sentence = `${su.text} ${correct} ${tail}.`;
    const others = shuffled(distinct(vb.forms.filter((x) => x !== correct)));
    if (vb.prefix) others.push(vb.prefix + correct);
    const distract = distinct(others).filter((x) => x !== correct).slice(0, 3);
    const stem = removeSuffix(removeSuffix(removePrefix(vb.inf, vb.prefix), 'en'), 'n');
    const vowelChange = vb.aux != null && !['sein', 'haben'].includes(vb.inf) &&
      vb.forms[0] === stem + 'e' && vb.forms[2] !== stem + 't' && vb.forms[2] !== stem + 'et';
    const extraRules = [];
    if (vb.prefix) extraRules.push(rule('trennbar'));
    if (vb.aux == null) extraRules.push(rule('modal'));
    const conj = this.conjugationLine(vb);
    return this.choice(level, Category.VERB, () => prompt, () => `Infinitiv: ${vb.inf} (${tr(vb.ru)})`, correct, distract, {
      solution: () => sentence,
      explanation: Bi(
        () => `Subjekt „${su.text}“ = ${su.label} → „${correct}“. Konjugation von „${vb.inf}“: ${conj}.` +
          (vowelChange ? ' Achtung: Vokalwechsel bei du und er/sie/es.' : '') + extraRules.map((x) => ' ' + x.de).join(''),
        () => S.praesensExpl(su.text, su.label, correct, vb.inf, tr(vb.ru), conj) + (vowelChange ? S.vowelChange : '') + extraRules.map((x) => ' ' + x.loc).join(''),
      ),
    });
  }

  auxForms(vb) { return vb.aux === 'sein' ? seinForms : habenForms; }

  perfAux(vb, su, level) {
    const forms = this.auxForms(vb);
    const other = vb.aux === 'sein' ? habenForms : seinForms;
    const correct = forms[su.person];
    const distract = distinct([other[su.person], ...shuffled(forms.filter((x) => x !== correct)).slice(0, 1),
      ...shuffled(other.filter((x) => x !== other[su.person])).slice(0, 1)]).filter((x) => x !== correct);
    const mid = vb.perfComplement;
    const prompt = replaceDouble(`${su.text} ___ ${mid} ${vb.partizip}.`);
    const sentence = replaceDouble(`${su.text} ${correct} ${mid} ${vb.partizip}.`);
    const rr = rule(vb.aux === 'sein' ? 'perfekt_sein' : 'perfekt_haben');
    const aux = vb.aux || '';
    return this.choice(level, Category.PERFEKT, () => prompt, () => `Perfekt von „${vb.inf}“ (${tr(vb.ru)})`, correct, distract, {
      solution: () => sentence,
      explanation: Bi(
        () => `„${vb.inf}“ bildet das Perfekt mit „${aux}“: ${su.label} ${correct} … ${vb.partizip}. ${rr.de}`,
        () => S.perfAuxExpl(vb.inf, tr(vb.ru), aux, su.label, correct, vb.partizip) + rr.loc,
      ),
    });
  }

  perfPart(vb, su, level) {
    const auxForm = this.auxForms(vb)[su.person];
    const prompt = replaceDouble(`${su.text} ${auxForm} ${vb.perfComplement} ___.`);
    const sentence = replaceDouble(`${su.text} ${auxForm} ${vb.perfComplement} ${vb.partizip}.`);
    const distract = shuffled(this.wrongPartizips(vb)).slice(0, 3);
    const rr = rule('partizip');
    const aux = vb.aux || '';
    return this.choice(level, Category.PERFEKT, () => prompt, () => `Infinitiv: ${vb.inf} (${tr(vb.ru)})`, vb.partizip, distract, {
      solution: () => sentence,
      explanation: Bi(
        () => `Partizip II von „${vb.inf}“: ${vb.partizip} (Perfekt mit „${aux}“). ${rr.de}`,
        () => S.partizipExpl(vb.inf, tr(vb.ru), vb.partizip, aux) + rr.loc,
      ),
    });
  }

  wrongPartizips(vb) {
    const p = vb.partizip;
    const pre = vb.prefix;
    const baseInf = removePrefix(vb.inf, pre);
    const stem = removeSuffix(removeSuffix(baseInf, 'en'), 'n');
    const hasGe = p.startsWith(pre + 'ge');
    const cands = [vb.inf];
    cands.push(p.endsWith('en') ? pre + 'ge' + stem + 't' : pre + 'ge' + stem + 'en');
    if (!hasGe) cands.push('ge' + p);
    else if (pre) cands.push('ge' + pre + removePrefix(p, pre + 'ge'));
    else cands.push(removePrefix(p, 'ge'));
    cands.push(pre + vb.forms[2]);
    cands.push(p.endsWith('en') ? p.slice(0, -2) + 't' : p + 'en');
    return distinct(cands).filter((x) => x !== p && x.trim());
  }

  // ---------------- Grammatik & Satzbau ----------------
  grammar(item, category = Category.GRAMMATIK) {
    const rr = rule(item.rule);
    const sentence = item.sentence.split('___').join(item.answer);
    return this.choice(item.level, category, () => item.sentence, item.level <= 3 ? () => tr(item.ru) : null, item.answer, item.wrong, {
      solution: () => sentence,
      explanation: Bi(() => rr.de, () => `${S.translation(tr(item.ru))}\n\n${rr.loc}`),
    });
  }

  order(item) {
    const accepted = [item.chunks, ...item.alternatives].map((l) => l.map((x) => x.toLowerCase()));
    const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
    let sh = shuffled(item.chunks);
    let tries = 0;
    while (accepted.some((a) => same(a, sh.map((x) => x.toLowerCase()))) && tries++ < 20) sh = shuffled(item.chunks);
    const rr = rule(item.rule);
    const alt = item.alternatives.length ? assemble(item.alternatives[0], item.end) : null;
    return new OrderTask({
      level: item.level, category: Category.SATZBAU, ru: item.ru, chunks: sh,
      accepted, solution: assemble(item.chunks, item.end),
      explanation: Bi(
        () => rr.de + (alt != null ? `\n\nAuch richtig: „${alt}“` : ''),
        () => `${S.translation(tr(item.ru))}\n\n${rr.loc}` + (alt != null ? `\n\n${S.alsoCorrect(alt)}` : ''),
      ),
    });
  }

  choice(level, category, prompt, hint, correct, distractors, { solution, explanation, speech, promptSpeech = null, localizedOptions = false }) {
    const opts = shuffled(distinct([correct, ...distractors.filter((x) => x !== correct)]));
    return new ChoiceTask(level, category, prompt, hint, opts, opts.indexOf(correct), solution, explanation,
      speech !== undefined ? speech : solution(), promptSpeech, localizedOptions);
  }
}

/** Setzt Satzteile zu einem Satz zusammen: Großschreibung am Anfang, Kommas ohne Leerzeichen davor. */
function assemble(chunks, end = '') {
  const str = chunks.join(' ').split(' ,').join(',');
  return (str.charAt(0).toUpperCase() + str.slice(1)) + end;
}
