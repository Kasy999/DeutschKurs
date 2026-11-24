'use strict';
// Regelbuch-Oberfläche: Kapitelliste mit Suche und Niveau-Filter, Kapitelseite, Link „Regel nachlesen“ nach jeder Antwort.
// Inhalte stehen in grammarbook_data.js (GB_CHAPTERS).

/* ---------------- Oberflächentexte ---------------- */
const GB_UI = {
  RU: { title: 'Справочник по грамматике', teaser: 'Все правила A1–B2 с примерами и таблицами', search: 'Поиск…', all: 'Все', chapters: 'Главы', expl: 'Объяснение', tip: 'Совет', tables: 'Таблицы', examples: 'Примеры', mistakes: 'Типичные ошибки', rules: 'Короткие правила из упражнений', open: 'Открыть правило', prev: 'Назад', next: 'Дальше', none: 'Ничего не найдено', practice: 'Потренироваться', chapter: 'Глава' },
  UK: { title: 'Довідник з граматики', teaser: 'Усі правила A1–B2 з прикладами й таблицями', search: 'Пошук…', all: 'Усі', chapters: 'Розділи', expl: 'Пояснення', tip: 'Порада', tables: 'Таблиці', examples: 'Приклади', mistakes: 'Типові помилки', rules: 'Короткі правила з вправ', open: 'Відкрити правило', prev: 'Назад', next: 'Далі', none: 'Нічого не знайдено', practice: 'Потренуватися', chapter: 'Розділ' },
  HY: { title: 'Քերականության ուղեցույց', teaser: 'Բոլոր կանոնները A1–B2՝ օրինակներով և աղյուսակներով', search: 'Որոնում…', all: 'Բոլորը', chapters: 'Գլուխներ', expl: 'Բացատրություն', tip: 'Խորհուրդ', tables: 'Աղյուսակներ', examples: 'Օրինակներ', mistakes: 'Տիպիկ սխալներ', rules: 'Կարճ կանոններ վարժություններից', open: 'Բացել կանոնը', prev: 'Նախորդ', next: 'Հաջորդ', none: 'Ոչինչ չի գտնվել', practice: 'Վարժվել', chapter: 'Գլուխ' },
  KA: { title: 'გრამატიკის ცნობარი', teaser: 'ყველა წესი A1–B2, მაგალითებითა და ცხრილებით', search: 'ძიება…', all: 'ყველა', chapters: 'თავები', expl: 'ახსნა', tip: 'რჩევა', tables: 'ცხრილები', examples: 'მაგალითები', mistakes: 'ტიპური შეცდომები', rules: 'მოკლე წესები სავარჯიშოებიდან', open: 'წესის გახსნა', prev: 'წინა', next: 'შემდეგი', none: 'ვერაფერი მოიძებნა', practice: 'ვარჯიში', chapter: 'თავი' },
  HU: { title: 'Nyelvtani kézikönyv', teaser: 'Minden szabály A1–B2, példákkal és táblázatokkal', search: 'Keresés…', all: 'Mind', chapters: 'Fejezetek', expl: 'Magyarázat', tip: 'Tipp', tables: 'Táblázatok', examples: 'Példák', mistakes: 'Gyakori hibák', rules: 'Rövid szabályok a gyakorlatokból', open: 'Szabály megnyitása', prev: 'Előző', next: 'Következő', none: 'Nincs találat', practice: 'Gyakorlás', chapter: 'Fejezet' },
};
const GBS = () => GB_UI[AppLang.current.name] || GB_UI.RU;
const gbKey = () => AppLang.current.name.toLowerCase(); // ru, uk, hy, ka, hu

/* ---------------- Zustand ---------------- */
const Book = { ch: null, level: null, query: '', showDe: false, from: null, fromList: false };
const gbColors = ['#38BDF8', '#8B5CF6'];
const gbLevelColor = { A1: '#34D399', A2: '#22D3EE', B1: '#FBBF24', B2: '#F472B6' };
// Passender Übungsmodus je Kapitel (Knopf „Üben“)
const gbPracticeMode = {
  satzbau: 'SATZBAU', praesens: 'VERBEN', artikel: 'VOKABELN', verneinung: 'GRAMMATIK', faelle: 'FAELLE', pronomen: 'FAELLE',
  praepositionen: 'FAELLE', modalverben: 'GRAMMATIK', vergangenheit: 'ZEITEN', werden: 'KONJUNKTIV', nebensaetze: 'SATZBAU', adjektive: 'FAELLE',
};

/* ---------------- Verbindung Übung → Kapitel ---------------- */
const gbRuleChapter = new Map();
GB_CHAPTERS.forEach((c) => c.rules.forEach((id) => gbRuleChapter.set(id, c)));
// Aufgaben ohne Regel-ID (z. B. Artikel-Vokabeln) über ihre Kategorie zuordnen
const gbCategoryChapter = { ARTIKEL: 'artikel', PLURAL: 'artikel', VERB: 'praesens', PERFEKT: 'vergangenheit', ZEIT: 'vergangenheit', KASUS: 'faelle', REFLEXIV: 'pronomen', KONJ: 'werden', SATZBAU: 'satzbau', SATZGLIED: 'satzbau' };
const gbById = (id) => GB_CHAPTERS.find((c) => c.id === id) || null;

/* Merkt sich, welche Regeln beim Erzeugen einer Aufgabe benutzt werden (engine.js bleibt unverändert). */
const RuleTrace = { ids: null };
(function traceRules() {
  const origRule = rule;
  // eslint-disable-next-line no-global-assign
  rule = function (id) { if (RuleTrace.ids) RuleTrace.ids.push(id); return origRule(id); };
  const wrap = (name, pick) => {
    const orig = TaskGenerator.prototype[name];
    if (typeof orig !== 'function') return;
    TaskGenerator.prototype[name] = function (...args) {
      const outer = RuleTrace.ids === null;
      if (outer) RuleTrace.ids = [];
      try {
        const res = orig.apply(this, args);
        const task = pick(res);
        if (outer && task && typeof task === 'object') task.rules = RuleTrace.ids.slice();
        return res;
      } finally { if (outer) RuleTrace.ids = null; }
    };
  };
  wrap('make', (res) => (Array.isArray(res) ? res[1] : null));
  wrap('remake', (res) => res);
})();

function gbChapterForTask(task) {
  if (!task) return null;
  for (const id of task.rules || []) { const c = gbRuleChapter.get(id); if (c) return c; }
  const cat = task.category && task.category.name;
  return cat && gbCategoryChapter[cat] ? gbById(gbCategoryChapter[cat]) : null;
}

/* ---------------- Hilfen ---------------- */
const gbPlain = (s) => String(s).replace(/[[\]]/g, '');
const gbHl = (s) => esc(s).replace(/\[([^\]]+)\]/g, '<mark class="gb-hl">$1</mark>');
const gbNum = (c) => GB_CHAPTERS.indexOf(c) + 1;
const gbLoc = (c) => c.text[gbKey()] || c.text.ru;
const gbText = (c) => (Book.showDe ? c.text.de : gbLoc(c));
const gbLevels = (c) => c.levels.map((l) => `<span class="gb-lv" style="color:${gbLevelColor[l]};border-color:${hexA(gbLevelColor[l], 0.5)}">${l}</span>`).join('');

function gbHaystack(c) {
  const k = gbKey();
  const parts = [];
  for (const t of [c.text.de, c.text[k]]) if (t) parts.push(t.title, t.sum, t.tip, ...t.pts, ...t.why);
  c.examples.forEach((e) => parts.push(e.de, e[k] || ''));
  c.mistakes.forEach((m) => parts.push(m.w, m.r));
  c.tables.forEach((tb) => { parts.push(...tb.head); tb.rows.forEach((r) => parts.push(...r)); });
  c.rules.forEach((id) => { const rr = rule(id); parts.push(rr.de, rr.loc); });
  return gbPlain(parts.join('\n')).toLowerCase();
}
let gbIndex = null; let gbIndexLang = null;
function gbSearch(q) {
  if (gbIndexLang !== gbKey()) { gbIndex = new Map(GB_CHAPTERS.map((c) => [c, gbHaystack(c)])); gbIndexLang = gbKey(); }
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  return GB_CHAPTERS.filter((c) => words.every((w) => gbIndex.get(c).includes(w)));
}
function gbSnippet(c, q) {
  const w = q.toLowerCase().split(/\s+/).filter(Boolean)[0];
  if (!w) return '';
  const t = gbLoc(c);
  const cands = [...t.pts, t.tip, ...c.text.de.pts, ...c.examples.map((e) => e.de)];
  const hit = cands.find((s) => gbPlain(s).toLowerCase().includes(w));
  if (!hit) return '';
  const s = gbPlain(hit); const i = s.toLowerCase().indexOf(w);
  const from = Math.max(0, i - 40), to = Math.min(s.length, i + w.length + 60);
  return (from > 0 ? '…' : '') + esc(s.slice(from, i)) + '<mark class="gb-hl">' + esc(s.slice(i, i + w.length)) + '</mark>' + esc(s.slice(i + w.length, to)) + (to < s.length ? '…' : '');
}

/* ---------------- Startseite ---------------- */
function bookTeaser() {
  return `<div class="card click" data-act="gbhome">
    <div class="row">
      ${iconCircle('📖', gbColors)}
      <div style="width:14px"></div>
      <div class="grow col">
        <div class="bold" style="font-size:16px">Regelbuch · ${esc(GBS().title)}</div>
        <div class="dim t13">${GB_CHAPTERS.length} Kapitel A1–B2 · ${esc(GBS().teaser)}</div>
      </div>
      <div class="dim" style="font-size:30px">›</div>
    </div>
  </div>`;
}

/* ---------------- Liste ---------------- */
function gbListItems() {
  const q = Book.query.trim();
  let list = q ? gbSearch(q) : GB_CHAPTERS;
  if (Book.level) list = list.filter((c) => c.levels.includes(Book.level));
  if (!list.length) return `<div class="card dim t14" style="text-align:center">Keine Treffer · ${esc(GBS().none)}</div>`;
  return list.map((c) => {
    const snip = q ? gbSnippet(c, q) : '';
    return `<div class="card click gb-item" data-act="gbopen" data-val="${c.id}">
      <div class="row">
        ${iconCircle(c.icon, gbColors, 46)}
        <div style="width:12px"></div>
        <div class="grow col">
          <div class="bold t15">${gbNum(c)}. ${esc(c.text.de.title)}</div>
          <div class="dim t13">${esc(gbLoc(c).title)}</div>
          <div class="row gap6" style="padding-top:6px">${gbLevels(c)}</div>
          ${snip ? `<div class="faint t12" style="padding-top:6px;line-height:17px">${snip}</div>` : ''}
        </div>
        <div class="dim" style="font-size:26px">›</div>
      </div>
    </div>`;
  }).join('');
}
function gbListScreen() {
  const chip = (val, label) => `<button class="gb-chip${(Book.level || '') === val ? ' sel' : ''}" data-act="gblevel" data-val="${val}">${esc(label)}</button>`;
  return `<div class="scroll pad16" style="flex:1"><div class="gb-wrap col gap12">
    <div class="row"><button class="circle-btn" data-act="back">‹</button><div style="width:14px"></div>
      <div class="col">${gradTitle('Regelbuch', gbColors, 26)}<div class="dim t13">${esc(GBS().title)} · A1–B2</div></div></div>
    <input id="gbSearch" class="gb-search" type="search" value="${esc(Book.query)}" placeholder="🔍 Suchen · ${esc(GBS().search)}" autocomplete="off" autocapitalize="off" spellcheck="false">
    <div class="hscroll gap8">${chip('', 'Alle · ' + GBS().all)}${['A1', 'A2', 'B1', 'B2'].map((l) => chip(l, l)).join('')}</div>
    <div id="gbList" class="col gap10">${gbListItems()}</div>
    <div style="height:8px;flex:none"></div>
  </div></div>`;
}

/* ---------------- Kapitel ---------------- */
function gbTable(tb) {
  return `<div class="gb-table-wrap"><table class="gb-table">
    <thead><tr>${tb.head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead>
    <tbody>${tb.rows.map((r) => `<tr>${r.map((x, i) => (i === 0 ? `<th>${esc(x)}</th>` : `<td>${esc(x)}</td>`)).join('')}</tr>`).join('')}</tbody>
  </table></div>`;
}
function gbChapterScreen(c) {
  const t = gbText(c), loc = gbLoc(c), k = gbKey(), S2 = GBS();
  const i = GB_CHAPTERS.indexOf(c);
  const prev = GB_CHAPTERS[i - 1], next = GB_CHAPTERS[i + 1];
  const canSpeak = !Speaker.missingGerman;
  const mode = gbPracticeMode[c.id];
  const examples = c.examples.map((e) => `<div class="gb-ex">
      <div class="grow col">
        <div class="t15 semi gb-sel">${gbHl(e.de)}</div>
        ${Book.showDe ? '' : `<div class="dim t13 gb-sel" style="padding-top:3px">${esc(e[k] || '')}</div>`}
      </div>
      ${canSpeak ? `<button class="circle-btn" style="width:40px;height:40px;font-size:16px" data-act="speak" data-text="${esc(gbPlain(e.de))}">🔊</button>` : ''}
    </div>`).join('');
  const mistakes = c.mistakes.map((m, j) => `<div class="gb-mis">
      <div class="gb-wrong">✗ ${esc(m.w)}</div>
      <div class="gb-right">✓ ${esc(m.r)}</div>
      <div class="dim t13 gb-sel" style="padding-top:4px;line-height:19px">${esc(t.why[j] || '')}</div>
    </div>`).join('');
  const rules = c.rules.map((id) => { const rr = rule(id); const txt = Book.showDe ? rr.de : rr.loc; return txt ? `<li>${esc(txt)}</li>` : ''; }).join('');
  return `<div class="scroll pad16" style="flex:1"><div class="gb-wrap col gap12">
    <div class="row" style="align-items:flex-start"><button class="circle-btn" data-act="gbback">‹</button><div style="width:14px"></div>
      <div class="col grow">
        <div class="faint t12 bold" style="letter-spacing:1px">KAPITEL ${i + 1} / ${GB_CHAPTERS.length} · ${esc(S2.chapter)} ${i + 1}</div>
        ${gradTitle(c.text.de.title, gbColors, 22)}
        <div class="dim t14" style="padding-top:2px">${esc(loc.title)}</div>
        <div class="row gap6" style="padding-top:8px">${gbLevels(c)}</div>
      </div>
    </div>
    <div class="row gap10">
      <button class="btn-ghost${Book.showDe ? '' : ' active'}" style="flex:1 1 0" data-act="gbde" data-val="0">${AppLang.current.flag} ${esc(AppLang.current.nativeName)}</button>
      <button class="btn-ghost${Book.showDe ? ' active' : ''}" style="flex:1 1 0" data-act="gbde" data-val="1">🇩🇪 Deutsch</button>
    </div>
    <div class="card strong gb-sel" style="font-size:16px;line-height:23px">${esc(t.sum)}</div>
    ${sectionLabel('Erklärung', S2.expl)}
    <div class="card"><ul class="gb-pts gb-sel">${t.pts.map((p) => `<li>${esc(p)}</li>`).join('')}</ul></div>
    <div class="gb-tip gb-sel">💡 <b>${Book.showDe ? 'Tipp' : esc(S2.tip)}:</b> ${esc(t.tip)}</div>
    ${sectionLabel('Tabellen', S2.tables)}
    ${c.tables.map(gbTable).join('')}
    ${sectionLabel('Beispiele', S2.examples)}
    <div class="card col gap10" style="padding:12px 14px">${examples}</div>
    ${sectionLabel('Typische Fehler', S2.mistakes)}
    <div class="col gap10">${mistakes}</div>
    ${rules ? `${sectionLabel('Kurzregeln', S2.rules)}<div class="card"><ul class="gb-pts gb-sel t14">${rules}</ul></div>` : ''}
    ${mode && Book.from !== Screen.PLAYING ? `<button class="btn-grad" style="background:${linGrad(gbColors)}" data-act="gbpractice" data-val="${mode}">${GameMode[mode].emoji} Üben · ${esc(S2.practice)}: ${esc(GameMode[mode].de)}</button>` : ''}
    <div class="row gap10">
      ${prev ? `<button class="btn-ghost" style="flex:1 1 0" data-act="gbgo" data-val="${prev.id}">‹ ${esc(prev.text.de.title.split(':')[0])}</button>` : '<div style="flex:1 1 0"></div>'}
      ${next ? `<button class="btn-ghost" style="flex:1 1 0" data-act="gbgo" data-val="${next.id}">${esc(next.text.de.title.split(':')[0])} ›</button>` : '<div style="flex:1 1 0"></div>'}
    </div>
    <div style="height:8px;flex:none"></div>
  </div></div>`;
}
function bookScreen() {
  const c = Book.ch ? gbById(Book.ch) : null;
  return c ? gbChapterScreen(c) : gbListScreen();
}

/* ---------------- Link nach der Antwort ---------------- */
function gbFeedbackLink(task) {
  const c = gbChapterForTask(task);
  if (!c) return '';
  return `<div style="height:10px"></div>
    <button class="btn-ghost" style="width:100%" data-act="gbopen" data-val="${c.id}">📖 Regel nachlesen · ${esc(GBS().open)}: ${esc(c.text.de.title.split(':')[0])}</button>`;
}

/* ---------------- Navigation ---------------- */
function gbOpenChapter(id) {
  if (App.screen !== Screen.BOOK) { Book.from = App.screen; Book.fromList = false; App.screen = Screen.BOOK; }
  else Book.fromList = Book.ch == null;
  Book.ch = id;
  Book.showDe = false;
  try { history.pushState({ s: 3 }, ''); } catch (e) { /* */ }
  render({ scrollTop: true });
}
/** Zurück aus dem Regelbuch (auch Zurück-Taste des Browsers/Handys). */
function gbPop() {
  if (Book.ch && Book.fromList) { Book.ch = null; render({ scrollTop: true }); return; }
  Book.ch = null;
  if (Book.from === Screen.PLAYING && App.round) {
    App.screen = Screen.PLAYING; render({ scrollTop: true });
    if (App.round.answered) autoScrollAfterAnswer();
    return;
  }
  goHome();
}
function gbBack() {
  if (history.state && history.state.s === 3) history.back();
  else gbPop();
}

/** Klicks im Regelbuch; true = erledigt. */
function bookClick(act, el) {
  switch (act) {
    case 'gbhome': Book.ch = null; Book.from = Screen.HOME; go(Screen.BOOK); return true;
    case 'gbopen': gbOpenChapter(el.dataset.val); return true;
    case 'gbgo': Book.ch = el.dataset.val; render({ scrollTop: true }); return true;
    case 'gbback': gbBack(); return true;
    case 'gbde': Book.showDe = el.dataset.val === '1'; render(); return true;
    case 'gblevel': Book.level = el.dataset.val || null; render(); return true;
    case 'gbpractice': {
      // Runde starten, ohne einen weiteren Verlaufseintrag anzulegen: Zurück führt dann zur Startseite.
      Book.ch = null;
      App.round = new GameRound(GameMode[el.dataset.val], App.progress);
      resetTaskUi();
      App.screen = Screen.PLAYING;
      render({ scrollTop: true });
      return true;
    }
    default: return false;
  }
}
/** Suchfeld: nur die Liste neu zeichnen, damit die Tastatur offen bleibt. */
function bookInput(el) {
  if (el.id !== 'gbSearch') return;
  Book.query = el.value;
  const list = App.root.querySelector('#gbList');
  if (list) list.innerHTML = gbListItems();
}
