'use strict';
// Grundlagen: Datenmodelle, Übersetzung, Schwierigkeitsgrad (Port von Model.kt, Lang.kt, Difficulty.kt …).

/* ---------------- Speicher (entspricht SharedPreferences "lernspiel") ---------------- */
const Prefs = {
  prefix: 'lernspiel.',
  getInt(key, def) {
    try { const v = localStorage.getItem(this.prefix + key); if (v === null) return def; const n = parseInt(v, 10); return isNaN(n) ? def : n; } catch (e) { return def; }
  },
  getString(key, def) {
    try { const v = localStorage.getItem(this.prefix + key); return v === null ? def : v; } catch (e) { return def; }
  },
  put(key, value) { try { localStorage.setItem(this.prefix + key, String(value)); } catch (e) { /* privat/voll */ } },
};

/* ---------------- Hilfsfunktionen (Kotlin-Standardbibliothek) ---------------- */
Map.prototype.mapValues = function (f) { return new Map([...this].map(([k, v]) => [k, f({ key: k, value: v })])); };
const shuffled = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const distinct = (arr) => [...new Set(arr)];
const randInt = (n) => Math.floor(Math.random() * n);
const coerceIn = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const removePrefix = (s, p) => (p && s.startsWith(p) ? s.slice(p.length) : s);
const removeSuffix = (s, p) => (p && s.endsWith(p) ? s.slice(0, -p.length) : s);
const col = (argb) => { const a = ((argb >>> 24) & 255) / 255, r = (argb >>> 16) & 255, g = (argb >>> 8) & 255, b = argb & 255; return a >= 1 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${a.toFixed(3)})`; };
const withAlpha = (c, a) => { const m = c.match(/\d+(\.\d+)?/g); return `rgba(${m[0]},${m[1]},${m[2]},${a})`; };

/* ---------------- Sprache ---------------- */
const Lang = {
  RU: { name: 'RU', nativeName: 'Русский', germanName: 'Russisch', flag: '🇷🇺' },
  UK: { name: 'UK', nativeName: 'Українська', germanName: 'Ukrainisch', flag: '🇺🇦' },
  HY: { name: 'HY', nativeName: 'Հայերեն', germanName: 'Armenisch', flag: '🇦🇲' },
  KA: { name: 'KA', nativeName: 'ქართული', germanName: 'Georgisch', flag: '🇬🇪' },
};
const LangEntries = [Lang.RU, Lang.UK, Lang.HY, Lang.KA];
const AppLang = {
  KEY: 'translation_lang',
  current: Lang.RU,
  load() { this.current = LangEntries.find((l) => l.name === Prefs.getString(this.KEY, null)) || Lang.RU; },
  set(lang) { this.current = lang; Prefs.put(this.KEY, lang.name); },
};

function Tr(uk, hy, ka) { return { uk, hy, ka, get(lang) { return lang === Lang.RU ? null : lang === Lang.UK ? uk : lang === Lang.HY ? hy : ka; } }; }
const t = (ru, uk, hy, ka) => [ru, Tr(uk, hy, ka)];
const r = (id, uk, hy, ka) => [id, Tr(uk, hy, ka)];

let translations = null; // wird in data_lazy.js gesetzt
let ruleTranslations = null;
function tr(ru, lang = AppLang.current) {
  if (lang === Lang.RU) return ru;
  const x = translations.get(ru);
  return (x && x.get(lang)) || ru;
}

/** Zweisprachiger Text: Deutsch + gewählte Übersetzungssprache (erst beim Anzeigen ausgewertet). */
class BiC {
  constructor(deFn, locFn) { this._de = deFn; this._loc = locFn; }
  get de() { return this._de(); }
  get loc() { return this._loc(); }
}
function Bi(a, b) {
  if (typeof a === 'function') return new BiC(a, b);
  return new BiC(() => a, () => tr(b));
}

/* ---------------- Schwierigkeitsgrad ---------------- */
const AppDifficulty = {
  KEY: 'difficulty_level',
  fixed: null,
  load() { const v = Prefs.getInt(this.KEY, 0); this.fixed = v >= 1 && v <= MAX_LEVEL ? v : null; },
  set(level) { this.fixed = level; Prefs.put(this.KEY, level || 0); },
};
const answerPoints = (level, streak, bigTask) => 10 + 5 * (level - 1) + 3 * Math.min(streak, 10) + (bigTask ? 8 : 0);
const streakBonus = (streak) => (streak > 0 && streak % 5 === 0 ? 10 * Math.min(Math.floor(streak / 5), 5) + 15 : 0);
function roundBonus(correct, total, level) {
  let base;
  if (correct === total) base = 100; else if (correct * 4 >= total * 3) base = 40; else if (correct * 2 >= total) base = 15; else base = 0;
  return Math.floor((base * (4 + level)) / 5);
}

/* ---------------- Kategorien & Modi ---------------- */
function enumOf(list, fields) {
  const obj = {};
  list.forEach((vals, i) => {
    const e = { name: vals[0], ordinal: i };
    fields.forEach((f, k) => { e[f] = vals[k + 1]; });
    Object.defineProperty(e, 'loc', { get() { return tr(this.ru); } });
    obj[vals[0]] = e;
  });
  obj.entries = list.map((v) => obj[v[0]]);
  return obj;
}
const Category = enumOf([
  ['VOKABEL', 'Vokabeln', 'Слова', '📚'],
  ['ARTIKEL', 'Artikel', 'Артикль', '🔤'],
  ['PLURAL', 'Plural', 'Множ. число', '👥'],
  ['VERB', 'Verbform', 'Спряжение', '⚡'],
  ['PERFEKT', 'Perfekt', 'Перфект', '⏪'],
  ['KASUS', 'Fälle', 'Падежи', '🎯'],
  ['ZEIT', 'Zeitformen', 'Времена', '⏳'],
  ['REFLEXIV', 'Reflexiv', 'Возвратные', '🪞'],
  ['KONJ', 'Konjunktiv II', 'Сослагательное', '💭'],
  ['GRAMMATIK', 'Grammatik', 'Грамматика', '🧩'],
  ['SATZBAU', 'Satzbau', 'Порядок слов', '🧱'],
  ['SCHREIBUNG', 'Rechtschreibung', 'Орфография', '✍️'],
], ['de', 'ru', 'emoji']);

const GameMode = enumOf([
  ['MIX', 'Mix', 'Всё вместе', '🎲', 'Alle Übungsarten gemischt'],
  ['VOKABELN', 'Vokabeln', 'Слова', '📚', 'Übersetzung, Artikel, Plural'],
  ['VERBEN', 'Verben', 'Глаголы', '⚡', 'Präsens und Perfekt im Satz'],
  ['FAELLE', 'Fälle', 'Падежи', '🎯', 'Nominativ, Akkusativ, Dativ, Genitiv'],
  ['ZEITEN', 'Zeitformen', 'Времена', '⏳', 'Präsens, Präteritum, Perfekt, Futur …'],
  ['KONJUNKTIV', 'Konjunktiv II', 'Сослагательное', '💭', 'Wünsche, Bitten, „Wenn ich … hätte“'],
  ['GRAMMATIK', 'Grammatik', 'Грамматика', '🧩', 'Fälle, Präpositionen, Nebensätze …'],
  ['SATZBAU', 'Satzbau', 'Порядок слов', '🧱', 'Sätze aus Bausteinen bauen'],
  ['RECHTSCHREIBUNG', 'Rechtschreibung', 'Орфография', '✍️', 'Fehler finden und korrigieren — ohne Hinweis'],
], ['de', 'ru', 'emoji', 'desc']);

/* ---------------- Aufgaben ---------------- */
class ChoiceTask {
  constructor(level, category, promptText, hintText, options, correctIndex, solutionText, explanation, speech, promptSpeech = null, localizedOptions = false) {
    Object.assign(this, { level, category, promptText, hintText, options, correctIndex, solutionText, explanation, speech, promptSpeech, localizedOptions });
    this.type = 'choice';
  }
  get prompt() { return this.promptText(); }
  get hint() { return this.hintText ? this.hintText() : null; }
  get solution() { return this.solutionText(); }
  optionText(i) { return this.localizedOptions ? tr(this.options[i]) : this.options[i]; }
}

class SpellTask {
  constructor({ level, category, wrong, solution, explanation }) {
    Object.assign(this, { level, category, wrong, solution, explanation });
    this.type = 'spell';
    this.promptSpeech = null;
  }
  get speech() { return this.solution; }
  isCorrect(input) { return SpellTask.normalize(input) === SpellTask.normalize(this.solution); }
  static normalize(s) {
    let x = s.trim().replace(/\s+/g, ' ').replace(/’/g, "'");
    x = x.replace(/[.!?]+$/, '');
    return x.trim();
  }
}

class OrderTask {
  constructor({ level, category, ru, chunks, accepted, solution, explanation }) {
    Object.assign(this, { level, category, ru, chunks, accepted, solution, explanation });
    this.type = 'order';
    this.promptSpeech = null;
  }
  get speech() { return this.solution; }
  isCorrect(picked) {
    const p = picked.map((x) => x.toLowerCase());
    return this.accepted.some((a) => a.length === p.length && a.every((v, i) => v === p[i]));
  }
}

/* ---------------- Datensätze ---------------- */
const SpellItem = (level, rule, wrong, correct, ru) => ({ level, rule, wrong, correct, ru });
const s = SpellItem;
const ChoiceItem = (level, rule, sentence, answer, wrong, ru) => ({ level, rule, sentence, answer, wrong, ru });
const c = (level, rule, sentence, answer, wrong, ru) => ChoiceItem(level, rule, sentence, answer, wrong.split('|'), ru);
const OrderItem = (level, rule, chunks, end, ru, alternatives) => ({ level, rule, chunks, end, ru, alternatives });
function o(level, rule, chunks, end, ru, ...alt) {
  const raw = chunks.split('|');
  const clean = raw.map((x) => removePrefix(x, '*'));
  const alternatives = [];
  raw.forEach((part, k) => {
    if (part.startsWith('*') && k >= 2) {
      const rest = clean.filter((_, i) => i !== k && i !== 1);
      alternatives.push([clean[k], clean[1], ...rest]);
    }
  });
  alt.forEach((a) => alternatives.push(a.split('|')));
  return OrderItem(level, rule, clean, end, ru, alternatives);
}
// Einträge mit Übersetzung (GrammarExtra, SentencesExtra, SpellingExtra)
const g = (level, rule, sentence, answer, wrong, ru, uk, hy, ka) => ({ item: c(level, rule, sentence, answer, wrong, ru), tr: Tr(uk, hy, ka) });
const so = (level, rule, chunks, end, ru, uk, hy, ka, ...alt) => ({ item: o(level, rule, chunks, end, ru, ...alt), tr: Tr(uk, hy, ka) });
const sp = (level, rule, wrong, correct, ru, uk, hy, ka) => ({ item: SpellItem(level, rule, wrong, correct, ru), tr: Tr(uk, hy, ka) });

const Word = (de, article, plural, ru, level) => ({ de, article, plural, ru, level });
const w = (de, article, plural, ru, level) => Word(de, article, plural, ru, level);
const e = (level, article, de, plural, ru, uk, hy, ka) => ({ word: Word(de, article, plural, ru, level), tr: Tr(uk, hy, ka) });

const Verb = (inf, ru, forms, complement, aux, partizip, perfComplement, level, prefix = '') => ({ inf, ru, forms, complement, aux, partizip, perfComplement, level, prefix });
const v = (inf, ru, forms, complement, aux, partizip, perf, level, prefix = '') => Verb(inf, ru, forms.split(','), complement, aux, partizip, perf, level, prefix);
const Subject = (text, person, label) => ({ text, person, label });

const ReflexVerb = (inf, ru, forms, complement, partizip, perfComplement, praet, dativ, level, prefix = '') => ({ inf, ru, forms, complement, partizip, perfComplement, praet, dativ, level, prefix });
const rv = (inf, ru, forms, complement, partizip, perf, praet, dativ, level, prefix = '') => ReflexVerb(inf, ru, forms.split(','), complement, partizip, perf, praet.split(','), dativ, level, prefix);

const ModalPast = (inf, praet, partizip, frames, level) => ({ inf, praet, partizip, frames, level });
const CaseFrame = (pattern, verbPrep, dativ) => ({ pattern, verbPrep, dativ });
const KonjSubject = (inClause, pronoun, person, label) => ({ inClause, pronoun, person, label });

function weak(stem) {
  const ee = stem.endsWith('t') || stem.endsWith('d') ? 'e' : '';
  return ['te', 'test', 'te', 'ten', 'tet', 'ten'].map((x) => stem + ee + x).join(',');
}
const accusativeArticle = (article) => (article === 'der' ? 'den' : article);
const dativeArticle = (article) => (article === 'die' ? 'der' : 'dem');

const Badge = (points, de, ru, emoji, colors, ribbon) => ({ points, de, ru, emoji, colors, ribbon, get loc() { return tr(this.ru); } });
const MAX_LEVEL = 6;
