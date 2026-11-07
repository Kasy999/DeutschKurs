'use strict';
// Einstufungstest (Port von Placement.kt / PlacementScreen.kt).

/* ---------------- Logik ---------------- */
const PLACEMENT_PER_LEVEL = 4;   // Fragen je Stufe
const PLACEMENT_PASS = 3;        // richtige Antworten zum Bestehen einer Stufe
const PLACEMENT_MAX_FAILS = 2;   // nach so vielen nicht bestandenen Stufen endet der Test

/** Kursgruppe zur Stufe: A1/A1+ → A1, A2/A2+ → A2, B1, B2. */
const cefrGroup = (level) => ['A1', 'A1', 'A2', 'A2', 'B1', 'B2'][coerceIn(level - 1, 0, MAX_LEVEL - 1)];

/** Aufgabe für den Einstufungstest: immer genau aus der Stufe, nur Multiple Choice. */
TaskGenerator.prototype.placement = function (level) {
  for (let n = 0; n < 40; n++) {
    const made = this.placementMake(level);
    if (!this.used.has(made[0])) { this.used.add(made[0]); this.lastKey = made[0]; return made[1]; }
  }
  const made = this.placementMake(level);
  this.lastKey = made[0];
  return made[1];
};
TaskGenerator.prototype.placementMake = function (level) {
  if (!this.usedRules) this.usedRules = new Set();
  if (level <= 4 && randInt(4) === 0) {
    const w = this.pickByLevel(vocabulary, level, (x) => x.level);
    return Math.random() < 0.5 ? ['rude:' + w.de, this.ruToDe(w, level)] : ['art:' + w.de, this.article(w, level)];
  }
  let atLevel = choiceItems.filter((x) => x.level === level);
  if (!atLevel.length) atLevel = choiceItems;
  let fresh = atLevel.filter((x) => !this.usedRules.has(x.rule));
  if (!fresh.length) fresh = atLevel;
  const item = fresh[randInt(fresh.length)];
  this.usedRules.add(item.rule);
  return ['gr:' + item.sentence, this.grammar(item)];
};

class PlacementTest {
  constructor() {
    this.generator = new TaskGenerator();
    this.level = 1;
    this.indexInLevel = 0;
    this.asked = 0;
    this.finished = false;
    this.results = []; // { level, correct, asked, passed }
    this.correctInLevel = 0;
    this.wrongInLevel = 0;
    this.task = this.generator.placement(1);
  }
  answerChoice(i) { this.answer(i === this.task.correctIndex); }
  answer(right) {
    if (this.finished) return;
    this.asked++;
    this.indexInLevel++;
    if (right) this.correctInLevel++; else this.wrongInLevel++;
    const failedEarly = this.wrongInLevel > PLACEMENT_PER_LEVEL - PLACEMENT_PASS;
    if (this.indexInLevel >= PLACEMENT_PER_LEVEL || failedEarly) {
      this.results.push({ level: this.level, correct: this.correctInLevel, asked: this.indexInLevel, passed: this.correctInLevel >= PLACEMENT_PASS });
      if (this.results.filter((x) => !x.passed).length >= PLACEMENT_MAX_FAILS || this.level >= MAX_LEVEL) { this.finished = true; return; }
      this.level++;
      this.indexInLevel = 0;
      this.correctInLevel = 0;
      this.wrongInLevel = 0;
    }
    this.task = this.generator.placement(this.level);
  }
  /** Empfohlene Stufe 1–6: höchste bestandene Stufe, mindestens A1. */
  get recommended() { return this.results.filter((x) => x.passed).reduce((m, x) => Math.max(m, x.level), 1); }
}

/** Gespeichertes Ergebnis des letzten Tests. */
const PlacementResult = {
  level: null,
  time: 0,
  load() {
    const v = Prefs.getInt('placement_level', 0);
    this.level = v >= 1 && v <= MAX_LEVEL ? v : null;
    this.time = parseInt(Prefs.getString('placement_time', '0'), 10) || 0;
  },
  save(level) {
    this.level = level;
    this.time = Date.now();
    Prefs.put('placement_level', level);
    Prefs.put('placement_time', this.time);
  },
};

/* ---------------- Texte in der Übersetzungssprache ---------------- */
const PlacementTexts = {
  RU: {
    title: 'Тест на уровень',
    intro: 'Узнайте, какая группа вам подходит: A1, A2, B1 или B2. Тест начинается с простых вопросов и становится сложнее. Займёт 3–8 минут.',
    start: 'Начать тест',
    levelQuestion: (l, n, t) => `Уровень ${l} · вопрос ${n} из ${t}`,
    noFeedback: 'Во время теста правильные ответы не показываются.',
    yourLevel: 'Ваш уровень', levelPassed: 'сдан', levelFailed: 'не сдан',
    apply: 'Установить как уровень сложности', applied: 'Уровень установлен', again: 'Пройти ещё раз',
    lastResult: (x) => `Последний результат: ${x}`,
  },
  UK: {
    title: 'Тест на рівень',
    intro: 'Дізнайтеся, яка група вам підходить: A1, A2, B1 чи B2. Тест починається з простих питань і стає складнішим. Займе 3–8 хвилин.',
    start: 'Почати тест',
    levelQuestion: (l, n, t) => `Рівень ${l} · питання ${n} з ${t}`,
    noFeedback: 'Під час тесту правильні відповіді не показуються.',
    yourLevel: 'Ваш рівень', levelPassed: 'складено', levelFailed: 'не складено',
    apply: 'Встановити як рівень складності', applied: 'Рівень встановлено', again: 'Пройти ще раз',
    lastResult: (x) => `Останній результат: ${x}`,
  },
  HY: {
    title: 'Մակարդակի թեստ',
    intro: 'Պարզեք, թե որ խումբն է ձեզ համապատասխանում՝ A1, A2, B1, թե B2։ Թեստը սկսվում է հեշտ հարցերով և աստիճանաբար բարդանում։ Կտևի 3–8 րոպե։',
    start: 'Սկսել թեստը',
    levelQuestion: (l, n, t) => `Մակարդակ ${l} · հարց ${n} / ${t}`,
    noFeedback: 'Թեստի ընթացքում ճիշտ պատասխանները չեն ցուցադրվում։',
    yourLevel: 'Ձեր մակարդակը', levelPassed: 'հանձնված է', levelFailed: 'հանձնված չէ',
    apply: 'Սահմանել որպես բարդության մակարդակ', applied: 'Մակարդակը սահմանված է', again: 'Կրկին անցնել',
    lastResult: (x) => `Վերջին արդյունքը՝ ${x}`,
  },
  KA: {
    title: 'დონის ტესტი',
    intro: 'გაიგეთ, რომელი ჯგუფი გიხდებათ: A1, A2, B1 თუ B2. ტესტი იწყება მარტივი კითხვებით და თანდათან რთულდება. დასჭირდება 3–8 წუთი.',
    start: 'ტესტის დაწყება',
    levelQuestion: (l, n, t) => `დონე ${l} · კითხვა ${n} / ${t}`,
    noFeedback: 'ტესტის დროს სწორი პასუხები არ ჩანს.',
    yourLevel: 'თქვენი დონე', levelPassed: 'ჩაბარებულია', levelFailed: 'არ არის ჩაბარებული',
    apply: 'დაყენება სირთულის დონედ', applied: 'დონე დაყენებულია', again: 'თავიდან გავლა',
    lastResult: (x) => `ბოლო შედეგი: ${x}`,
  },
};
const PS = () => PlacementTexts[AppLang.current.name] || PlacementTexts.RU;

/* ---------------- Oberfläche ---------------- */
const placementColors = () => [...Palette.success, Palette.cyan];

function placementTeaser() {
  const last = PlacementResult.level;
  return `<div class="card click" data-act="placement">
    <div class="row">
      ${iconCircle('🧭', placementColors())}
      <div style="width:14px"></div>
      <div class="grow col">
        <div class="bold" style="font-size:16px">Einstufungstest · ${esc(PS().title)}</div>
        <div class="dim t13">${last == null ? 'Welche Gruppe passt zu dir? A1, A2, B1 oder B2'
          : `Dein Ergebnis: ${cefrGroup(last)} (${cefrLabels[last - 1]}) · erneut testen`}</div>
      </div>
      <div class="dim" style="font-size:30px">›</div>
    </div>
  </div>`;
}

function placementHeader(title, sub) {
  return `<div class="row" style="flex:none"><button class="circle-btn" data-act="exit">✕</button><div style="width:14px"></div>
    <div class="col">${gradTitle(title, placementColors(), 26)}<div class="dim t13">${esc(sub)}</div></div></div>`;
}

function placementScreen() {
  const t = App.placement;
  if (!t) return placementIntro();
  if (t.finished) return placementResultView(t);
  return placementQuiz(t);
}

function placementIntro() {
  const last = PlacementResult.level;
  const rules = [
    `📈 Je Stufe ${PLACEMENT_PER_LEVEL} Fragen – mit ${PLACEMENT_PASS} richtigen ist die Stufe bestanden.`,
    `🛑 Nach ${PLACEMENT_MAX_FAILS} nicht bestandenen Stufen endet der Test.`,
    '🤫 Keine Lösungen während des Tests, keine Punkte, keine Fehlerliste.',
    '🎯 Am Ende kannst du das Ergebnis als Schwierigkeitsgrad übernehmen.',
  ];
  return `<div class="scroll col gap14 pad16" style="flex:1">
    ${placementHeader('Einstufungstest', PS().title)}
    <div class="card strong">
      <div class="t15" style="line-height:22px">Finde heraus, welche Gruppe am besten zu dir passt: A1, A2, B1 oder B2. Der Test beginnt leicht und wird Stufe für Stufe schwerer. Er dauert etwa 3–8 Minuten.</div>
      <div class="dim t13" style="line-height:19px;padding-top:8px">${esc(PS().intro)}</div>
    </div>
    <div class="card">
      <div class="bold t15">So funktioniert der Test</div>
      <div style="height:6px"></div>
      ${rules.map((x) => `<div class="dim t14" style="line-height:21px;padding-top:4px">${esc(x)}</div>`).join('')}
      <div class="faint t12" style="padding-top:8px">${esc(PS().noFeedback)}</div>
    </div>
    ${last != null ? `<div class="semi t13" style="color:var(--cyan)">Letztes Ergebnis: ${cefrGroup(last)} (${cefrLabels[last - 1]}) · ${esc(PS().lastResult(cefrGroup(last)))}</div>` : ''}
    <button class="btn-grad" style="width:100%;background:${linGrad(placementColors())}" data-act="pstart">Test starten · ${esc(PS().start)}</button>
  </div>`;
}

function placementQuiz(t) {
  const task = t.task;
  const label = cefrLabels[t.level - 1];
  const frac = ((t.level - 1) * PLACEMENT_PER_LEVEL + t.indexInLevel) / (PLACEMENT_PER_LEVEL * MAX_LEVEL);
  const n = t.indexInLevel + 1;
  const options = task.options.map((_, i) => `<button class="opt" data-act="pchoice" data-i="${i}">
      <span class="letter">${'ABCDEFG'[i]}</span><span class="txt">${esc(task.optionText(i))}</span></button>`).join('');
  return `<div class="row" style="padding:10px 16px;flex:none">
      <button class="circle-btn" data-act="exit">✕</button>
      <div style="width:12px"></div>
      <div class="grow col">
        ${progressBar(frac, placementColors())}
        <div class="faint t11" style="padding-top:4px">Stufe ${label} · Frage ${n} von ${PLACEMENT_PER_LEVEL} · ${esc(PS().levelQuestion(label, n, PLACEMENT_PER_LEVEL))}</div>
      </div>
      <div style="width:12px"></div>
      ${pill('🧭 ' + label, Palette.cyan)}
    </div>
    <div class="scroll col gap12" data-scroll="main" style="flex:1;padding:0 16px 16px">
      ${questionCard(task, false)}
      <div class="col gap10">${options}</div>
      <div class="faint t12" style="text-align:center">Keine Lösungen während des Tests · ${esc(PS().noFeedback)}</div>
    </div>`;
}

function placementResultView(t) {
  const level = t.recommended;
  const applied = AppDifficulty.fixed === level;
  const correct = t.results.reduce((a, x) => a + x.correct, 0);
  const rows = cefrLabels.map((label, i) => {
    const r = t.results.find((x) => x.level === i + 1);
    const res = !r ? '<span class="faint t13">nicht getestet</span>'
      : r.passed ? `<span class="semi t14" style="color:var(--green)">✓ ${r.correct}/${r.asked} · ${esc(PS().levelPassed)}</span>`
        : `<span class="semi t14" style="color:var(--pink)">✗ ${r.correct}/${r.asked} · ${esc(PS().levelFailed)}</span>`;
    return `<div class="row" style="padding:4px 0"><span class="black t15" style="color:var(--cyan);width:52px;flex:none">${label}</span>${res}</div>`;
  }).join('');
  return `<div class="scroll col gap14 pad16" style="flex:1">
    ${placementHeader('Dein Ergebnis', PS().yourLevel)}
    <div class="card strong"><div class="col" style="align-items:center">
      ${ring(level / MAX_LEVEL, placementColors(), 150, 12, `<div class="col" style="align-items:center"><div class="faint bold" style="font-size:10px;letter-spacing:1px">GRUPPE</div><div class="black" style="font-size:42px;line-height:1.1">${cefrGroup(level)}</div></div>`)}
      <div style="height:12px"></div>
      <div class="black" style="font-size:22px">${esc(levelNames[level - 1].de)}</div>
      <div class="dim t14">${esc(levelNames[level - 1].loc)}</div>
      <div style="height:6px"></div>
      <div class="faint t13">${correct} von ${t.asked} Fragen richtig</div>
    </div></div>
    <div class="card"><div class="bold t15">Stufen im Überblick</div><div style="height:8px"></div>${rows}</div>
    ${applied
      ? `<div>${pill(`✓ Schwierigkeitsgrad ${cefrLabels[level - 1]} eingestellt · ${PS().applied}`, Palette.green)}</div>`
      : `<button class="btn-grad" style="width:100%;background:${linGrad(placementColors())}" data-act="papply" data-val="${level}">Als Schwierigkeitsgrad übernehmen (${cefrLabels[level - 1]}) · ${esc(PS().apply)}</button>`}
    <button class="btn-ghost" style="width:100%" data-act="pstart">Nochmal testen · ${esc(PS().again)}</button>
    <button class="btn-ghost" style="width:100%" data-act="menu">Zum Menü · ${esc(S.menu)}</button>
  </div>`;
}

/** Antwort im Test; true, wenn der Test damit beendet ist. */
function placementAnswer(i) {
  const t = App.placement;
  if (!t || t.finished) return;
  Speaker.stop();
  t.answerChoice(i);
  if (t.finished) PlacementResult.save(t.recommended);
  App.ui.appeared = false;
}
