'use strict';
// Lernstatistik pro Tag (Port von Stats.kt): Speicher, Zeitmessung, Abgleich und Bildschirm „Statistik“.
// JSON-Format im Schnappschuss (Feld "daily") identisch mit der Android-App:
// { "yyyy-mm-dd": { s: Sekunden, n: Übungen, ok: richtig, p: Punkte, r: Runden, c/cok: je Kategorie, m: je Modus, h: je Stunde } }

const STATS_KEY = 'daily_stats';
const STATS_KEEP_DAYS = 100;       // etwas mehr als 3 Monate
const STATS_MAX_GAP_MS = 180000;   // längere Pausen zählen nicht als Lernzeit

/* ---------------- Datum ---------------- */
const pad2 = (n) => String(n).padStart(2, '0');
const dayKey = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const today0 = () => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); };
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
/** Wie LocalDate.minusMonths: Tag wird auf das Monatsende gekappt. */
function minusMonths(d, m) {
  const first = new Date(d.getFullYear(), d.getMonth() - m, 1);
  const last = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  return new Date(first.getFullYear(), first.getMonth(), Math.min(d.getDate(), last));
}
const dayDiff = (a, b) => Math.round((b - a) / 86400000);
const isoWeekday = (d) => (d.getDay() + 6) % 7; // 0 = Montag
const parseKey = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };

/* ---------------- Daten ---------------- */
function emptyDay() { return { s: 0, n: 0, ok: 0, p: 0, r: 0, c: {}, cok: {}, m: {}, h: {} }; }
const dayActive = (d) => !!d && (d.n > 0 || d.s > 0);

/** Fehlende/ungültige Werte auffüllen (wie dailyFromJson in Stats.kt). */
function normalizeDaily(o) {
  const out = {};
  if (!o || typeof o !== 'object') return out;
  const int = (v) => (Number.isFinite(+v) ? Math.trunc(+v) : 0);
  const map = (m) => { const r = {}; if (m && typeof m === 'object') Object.entries(m).forEach(([k, v]) => { if (int(v) > 0) r[k] = int(v); }); return r; };
  Object.keys(o).sort().forEach((k) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(k)) return;
    const d = o[k];
    if (!d || typeof d !== 'object') return;
    const n = Math.max(0, int(d.n)), s = Math.max(0, int(d.s));
    if (n === 0 && s === 0) return;
    out[k] = { s, n, ok: coerceIn(int(d.ok), 0, n), p: int(d.p), r: Math.max(0, int(d.r)), c: map(d.c), cok: map(d.cok), m: map(d.m), h: map(d.h) };
  });
  return out;
}

/** Je Tag gewinnt der Eintrag mit mehr Übungen (bei Gleichstand mehr Lernzeit). */
function mergeDaily(a, b) {
  const out = {};
  [...new Set([...Object.keys(a), ...Object.keys(b)])].sort().forEach((k) => {
    const x = a[k], y = b[k];
    out[k] = !x ? y : !y ? x : (y.n > x.n || (y.n === x.n && y.s > x.s)) ? y : x;
  });
  return out;
}

function pruneDaily(d, today) {
  const min = dayKey(addDays(today, -STATS_KEEP_DAYS));
  const out = {};
  Object.keys(d).sort().forEach((k) => { if (k >= min) out[k] = d[k]; });
  return out;
}

function readDaily() {
  try { return normalizeDaily(JSON.parse(Prefs.getString(STATS_KEY, '{}') || '{}')); } catch (e) { return {}; }
}
function writeDaily(d) { Prefs.put(STATS_KEY, JSON.stringify(d)); }

class StatsLog {
  constructor() { this.days = readDaily(); }
  reload() { this.days = readDaily(); }
  update(f) {
    const today = today0();
    const key = dayKey(today);
    const cur = this.days[key] ? JSON.parse(JSON.stringify(this.days[key])) : emptyDay();
    this.days = pruneDaily({ ...this.days, [key]: f(cur) }, today);
    writeDaily(this.days);
  }
  answer(category, mode, right, points, seconds) {
    const inc = (m, k) => { m[k] = (m[k] || 0) + 1; };
    this.update((d) => {
      d.s += Math.max(0, seconds); d.n++; if (right) d.ok++; d.p += points;
      inc(d.c, category.name); if (right) inc(d.cok, category.name);
      inc(d.m, mode.name); inc(d.h, String(new Date().getHours()));
      return d;
    });
  }
  roundDone(bonus, seconds) {
    this.update((d) => { d.r++; d.p += bonus; d.s += Math.max(0, seconds); return d; });
  }
}

/** Misst aktive Lernzeit; lange Pausen werden gekappt. */
class StudyTimer {
  constructor() { this.mark = performance.now(); this.carry = 0; }
  take() {
    const t = performance.now();
    this.carry += coerceIn(t - this.mark, 0, STATS_MAX_GAP_MS);
    this.mark = t;
    const s = Math.floor(this.carry / 1000);
    this.carry -= s * 1000;
    return s;
  }
}

/* ---------------- Texte in der Übersetzungssprache ---------------- */
const ST_TEXT = {
  RU: ['Статистика', 'Когда, сколько и что ты учил', 'дни, время и упражнения за 3 месяца', 'Обзор', 'Дни учёбы', 'Время', 'Упражнения', 'Точность', 'Раунды', 'Очки', 'в среднем за день учёбы', 'Серия дней', 'Лучшая серия', 'Календарь', 'Нажми на день, чтобы увидеть подробности', 'Минут в день', 'Упражнений в день', 'Дни недели', 'Время суток', 'Темы', 'Режимы', 'По дням', 'Пока нет данных — начни раунд!', 'верно', 'неверно', '7 дней', '30 дней', '3 месяца', 'Нажми на столбик'],
  UK: ['Статистика', 'Коли, скільки і що ти вчив', 'дні, час і вправи за 3 місяці', 'Огляд', 'Дні навчання', 'Час', 'Вправи', 'Точність', 'Раунди', 'Бали', 'у середньому за день навчання', 'Серія днів', 'Найкраща серія', 'Календар', 'Натисни на день, щоб побачити деталі', 'Хвилин на день', 'Вправ на день', 'Дні тижня', 'Час доби', 'Теми', 'Режими', 'По днях', 'Ще немає даних — почни раунд!', 'правильно', 'неправильно', '7 днів', '30 днів', '3 місяці', 'Натисни на стовпчик'],
  HY: ['Վիճակագրություն', 'Երբ, որքան և ինչ ես սովորել', 'օրեր, ժամանակ և վարժություններ 3 ամսվա ընթացքում', 'Ընդհանուր', 'Ուսման օրեր', 'Ժամանակ', 'Վարժություններ', 'Ճշտություն', 'Ռաունդներ', 'Միավորներ', 'միջինը ուսման օրում', 'Օրերի շարք', 'Լավագույն շարք', 'Օրացույց', 'Սեղմիր օրվա վրա՝ մանրամասները տեսնելու համար', 'Րոպե օրական', 'Վարժություն օրական', 'Շաբաթվա օրեր', 'Օրվա ժամ', 'Թեմաներ', 'Ռեժիմներ', 'Ըստ օրերի', 'Դեռ տվյալներ չկան — սկսիր ռաունդ։', 'ճիշտ', 'սխալ', '7 օր', '30 օր', '3 ամիս', 'Սեղմիր սյունակի վրա'],
  KA: ['სტატისტიკა', 'როდის, რამდენი და რა ისწავლე', 'დღეები, დრო და სავარჯიშოები 3 თვის განმავლობაში', 'მიმოხილვა', 'სწავლის დღეები', 'დრო', 'სავარჯიშოები', 'სიზუსტე', 'რაუნდები', 'ქულები', 'საშუალოდ სწავლის დღეში', 'დღეების სერია', 'საუკეთესო სერია', 'კალენდარი', 'დააჭირე დღეს დეტალების სანახავად', 'წუთი დღეში', 'სავარჯიშო დღეში', 'კვირის დღეები', 'დღის დრო', 'თემები', 'რეჟიმები', 'დღეების მიხედვით', 'ჯერ მონაცემები არ არის — დაიწყე რაუნდი!', 'სწორი', 'არასწორი', '7 დღე', '30 დღე', '3 თვე', 'დააჭირე სვეტს'],
};
const ST_FIELDS = ['title', 'sub', 'openHint', 'overview', 'days', 'time', 'exercises', 'accuracy', 'rounds', 'points', 'perDay', 'streak', 'bestStreak', 'calendar', 'calendarHint', 'minutesPerDay', 'exercisesPerDay', 'weekdays', 'timeOfDay', 'categories', 'modes', 'dayList', 'noData', 'right', 'wrong', 'range7', 'range30', 'range90', 'tapHint'];
const ST = new Proxy({}, { get(_, k) { const i = ST_FIELDS.indexOf(k); return i < 0 ? '' : (ST_TEXT[AppLang.current.name] || ST_TEXT.RU)[i]; } });

/* ---------------- Auswertung ---------------- */
const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const MONTHS = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
function fmtDuration(sec) {
  if (sec <= 0) return '0 min';
  if (sec < 60) return '<1 min';
  if (sec < 3600) return Math.floor(sec / 60) + ' min';
  return `${Math.floor(sec / 3600)} h ${pad2(Math.floor((sec % 3600) / 60))} min`;
}
const fmtDay = (d) => `${WEEKDAYS[isoWeekday(d)]}, ${d.getDate()}.${d.getMonth() + 1}.`;
const fmtDayLong = (d) => fmtDay(d) + d.getFullYear();
const pct = (ok, n) => (n === 0 ? 0 : Math.floor((ok * 100) / n));

const STATS_RANGES = [
  { id: 'WEEK', de: '7 Tage', loc: () => ST.range7, start: (t) => addDays(t, -6) },
  { id: 'MONTH', de: '30 Tage', loc: () => ST.range30, start: (t) => addDays(t, -29) },
  { id: 'QUARTER', de: '3 Monate', loc: () => ST.range90, start: (t) => addDays(minusMonths(t, 3), 1) },
];

function daysBetween(days, from, to) {
  const out = [];
  for (let i = 0; i <= dayDiff(from, to); i++) { const d = addDays(from, i); out.push([d, days[dayKey(d)] || emptyDay()]); }
  return out;
}

function summarize(list) {
  const s = { sec: 0, n: 0, ok: 0, pts: 0, rounds: 0, active: 0, cat: {}, catOk: {}, mode: {}, hour: new Array(24).fill(0), wdSec: new Array(7).fill(0), wdN: new Array(7).fill(0), wdCount: new Array(7).fill(0) };
  const add = (into, m) => Object.entries(m).forEach(([k, v]) => { into[k] = (into[k] || 0) + v; });
  list.forEach(([day, d]) => {
    s.sec += d.s; s.n += d.n; s.ok += d.ok; s.pts += d.p; s.rounds += d.r; if (dayActive(d)) s.active++;
    add(s.cat, d.c); add(s.catOk, d.cok); add(s.mode, d.m);
    Object.entries(d.h).forEach(([h, v]) => { const i = parseInt(h, 10); if (i >= 0 && i < 24) s.hour[i] += v; });
    const w = isoWeekday(day); s.wdSec[w] += d.s; s.wdN[w] += d.n; s.wdCount[w]++;
  });
  return s;
}

function streaks(days, today) {
  const active = (d) => dayActive(days[dayKey(d)]);
  let cur = 0;
  let d = active(today) ? today : addDays(today, -1);
  while (active(d)) { cur++; d = addDays(d, -1); }
  let best = 0, run = 0, prev = null;
  Object.keys(days).filter((k) => dayActive(days[k])).sort().forEach((k) => {
    const day = parseKey(k);
    run = prev && dayDiff(prev, day) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = day;
  });
  return [cur, Math.max(best, cur)];
}

/* ---------------- Bildschirm ---------------- */
const StatsUi = { range: 'QUARTER', selected: null, expanded: null, picked: {} };
function resetStatsUi() { StatsUi.selected = null; StatsUi.expanded = null; StatsUi.picked = {}; }

function heatLevel(d) {
  if (!dayActive(d)) return 0;
  const min = Math.floor(d.s / 60);
  return min < 5 ? 1 : min < 15 ? 2 : min < 30 ? 3 : 4;
}

function heatmap(days, start, today) {
  const gridStart = addDays(start, -isoWeekday(start));
  const weeks = Math.floor(dayDiff(gridStart, today) / 7) + 1;
  let months = '<span></span>';
  for (let w = 0; w < weeks; w++) {
    const first = addDays(gridStart, w * 7);
    let label = null;
    for (let i = 0; i < 7; i++) { const d = addDays(first, i); if (d.getDate() === 1 && d <= today) label = MONTHS[d.getMonth()]; }
    if (!label && w === 0) label = MONTHS[start.getMonth()];
    months += `<span>${label || ''}</span>`;
  }
  let cells = '';
  for (let i = 0; i < 7; i++) {
    cells += `<span class="hm-wd">${i % 2 === 0 ? WEEKDAYS[i] : ''}</span>`;
    for (let w = 0; w < weeks; w++) {
      const d = addDays(gridStart, w * 7 + i);
      const k = dayKey(d);
      if (d < start || d > today) { cells += '<span class="hm-cell off"></span>'; continue; }
      const cls = ['hm-cell', 'l' + heatLevel(days[k])];
      if (k === StatsUi.selected) cls.push('sel'); else if (d.getTime() === today.getTime()) cls.push('today');
      cells += `<button class="${cls.join(' ')}" data-act="sday" data-val="${k}" title="${esc(fmtDayLong(d))}"></button>`;
    }
  }
  return `<div class="heatmap" style="--weeks:${weeks}">
    <div class="hm-months">${months}</div>
    <div class="hm-grid">${cells}</div>
  </div>`;
}

/** Säulendiagramm (auch gestapelt); Antippen zeigt den Wert. */
function barChart(id, values, colors, axis, describe, opts = {}) {
  const picked = StatsUi.picked[id];
  const max = Math.max(1, ...values.map((v) => v.reduce((a, b) => a + b, 0)));
  const bars = values.map((parts, i) => {
    const total = parts.reduce((a, b) => a + b, 0);
    const segs = total <= 0 ? '<i class="zero"></i>' : parts.map((v, k) => (v > 0 ? `<i style="height:${(v / max) * 100}%;background:${colors[k % colors.length]}"></i>` : '')).reverse().join('');
    return `<button class="bar${picked != null && picked !== i ? ' dim' : ''}" data-act="sbar" data-chart="${id}" data-i="${i}">${segs}</button>`;
  }).join('');
  const axisHtml = opts.perBar
    ? `<div class="bar-axis per">${axis.map((a) => `<span>${esc(a)}</span>`).join('')}</div>`
    : `<div class="bar-axis">${axis.map((a) => `<span>${esc(a)}</span>`).join('')}</div>`;
  return `<div class="t12 ${picked != null ? 'semi' : 'faint'}" style="padding-bottom:8px">${esc(picked != null ? describe(picked) : 'Tippe auf eine Säule · ' + ST.tapHint)}</div>
    <div class="bars${values.length > 40 ? ' dense' : ''}" style="height:${opts.height || 130}px">${bars}</div>${axisHtml}`;
}

function legend(items) {
  return `<div class="row gap14" style="padding-top:8px">${items.map(([c, t]) => `<span class="row t11 dim"><i class="lg-dot" style="background:${c}"></i>&nbsp;${esc(t)}</span>`).join('')}</div>`;
}

function categoryList(cat, catOk) {
  const entries = Category.entries.filter((c) => (cat[c.name] || 0) > 0).sort((a, b) => (cat[b.name] || 0) - (cat[a.name] || 0));
  if (!entries.length) return '<div class="faint t13">—</div>';
  return entries.map((c) => {
    const n = cat[c.name] || 0, ok = catOk[c.name] || 0, color = categoryColor(c);
    return `<div class="row" style="padding:6px 0 3px">
        <div class="grow col"><span class="semi t14">${esc(c.emoji + ' ' + c.de)}</span><span class="faint t11">${esc(c.loc)}</span></div>
        <div class="col" style="align-items:flex-end"><span class="black t15" style="color:${color}">${pct(ok, n)} %</span><span class="faint t11">${ok} / ${n} richtig</span></div>
      </div>${progressBar(ok / Math.max(1, n), [color, hexA(color, 0.6)], 6)}`;
  }).join('');
}

function statRow(items) { return `<div class="row" style="align-items:flex-start">${items.map(([v, l]) => stat(v, l)).join('')}</div>`; }

function dayDetail(day, d, showTitle = true) {
  let h = '<div class="day-detail">';
  if (showTitle) h += `<div class="bold t15" style="padding-bottom:8px">${esc(fmtDayLong(day))}</div>`;
  if (!dayActive(d)) return h + '<div class="dim t13">An diesem Tag wurde nicht gelernt.</div></div>';
  h += statRow([[fmtDuration(d.s), 'Lernzeit\n' + ST.time], [String(d.n), 'Übungen\n' + ST.exercises], [pct(d.ok, d.n) + ' %', 'Richtig\n' + ST.accuracy]]);
  h += '<div style="height:10px"></div>';
  h += statRow([[`${d.ok} / ${d.n - d.ok}`, '✅ / ❌\n' + ST.right + ' / ' + ST.wrong], [String(d.r), 'Runden\n' + ST.rounds], [String(d.p), 'Punkte\n' + ST.points]]);
  const hours = Object.keys(d.h).map(Number).filter((x) => x >= 0 && x < 24).sort((a, b) => a - b);
  if (hours.length) h += `<div class="dim t12" style="padding-top:10px">🕒 Gelernt um: ${hours.map((x) => `${x}–${x + 1} Uhr`).join(', ')}</div>`;
  const modes = GameMode.entries.filter((m) => (d.m[m.name] || 0) > 0);
  if (modes.length) h += `<div class="dim t12" style="padding-top:4px">🎮 ${esc(modes.map((m) => `${m.emoji} ${m.de} ${d.m[m.name]}`).join('  ·  '))}</div>`;
  if (Object.keys(d.c).length) h += '<div style="height:4px"></div>' + categoryList(d.c, d.cok);
  return h + '</div>';
}

function statsScreen() {
  const days = App.progress.stats.days;
  const today = today0();
  const range = STATS_RANGES.find((r) => r.id === StatsUi.range) || STATS_RANGES[2];
  const from = range.start(today);
  const calStart = STATS_RANGES[2].start(today);
  const list = daysBetween(days, from, today);
  const s = summarize(list);
  const [curStreak, bestStreak] = streaks(days, today);
  const avgSec = s.active ? Math.floor(s.sec / s.active) : 0;
  const avgN = s.active ? Math.floor(s.n / s.active) : 0;

  let h = `<div class="scroll pad16" style="flex:1">
    <div class="row"><button class="circle-btn" data-act="sback">‹</button><div style="width:14px"></div>
      <div class="col">${gradTitle('Statistik', [...Palette.cool, Palette.violet], 26)}<div class="dim t13">Wann, wie lange und was du gelernt hast · ${esc(ST.sub)}</div></div></div>
    <div style="height:16px"></div>
    <div class="row gap8">${STATS_RANGES.map((r) => `<button class="range-chip${r.id === range.id ? ' sel' : ''}" data-act="srange" data-val="${r.id}">${esc(r.de)}<br><span>${esc(r.loc())}</span></button>`).join('')}</div>
    <div class="faint t12" style="text-align:center;padding-top:8px">${esc(fmtDayLong(from))} – ${esc(fmtDayLong(today))}</div>
    <div style="height:14px"></div>
    ${sectionLabel('Überblick', ST.overview)}
    <div class="card strong" style="padding:14px">
      ${statRow([['📅 ' + s.active, `Lerntage von ${list.length}\n${ST.days}`], ['⏱ ' + fmtDuration(s.sec), 'Lernzeit\n' + ST.time], ['✏️ ' + s.n, 'Übungen\n' + ST.exercises]])}
      <div style="height:14px"></div>
      ${statRow([[`🎯 ${pct(s.ok, s.n)} %`, 'Richtig\n' + ST.accuracy], ['✅ ' + s.ok, 'Richtig\n' + ST.right], ['❌ ' + (s.n - s.ok), 'Falsch\n' + ST.wrong]])}
      <div style="height:14px"></div>
      ${statRow([['🏁 ' + s.rounds, 'Runden\n' + ST.rounds], ['Σ ' + s.pts, 'Punkte\n' + ST.points], ['🔥 ' + curStreak, 'Tage in Folge\n' + ST.streak]])}
      <div style="height:14px"></div>
      ${statRow([['⌀ ' + fmtDuration(avgSec), 'Zeit pro Lerntag\n' + ST.perDay], ['⌀ ' + avgN, 'Übungen pro Lerntag\n' + ST.perDay], ['🏆 ' + bestStreak, 'Längste Serie\n' + ST.bestStreak]])}
    </div>
    <div style="height:18px"></div>
    ${sectionLabel('Kalender · 3 Monate', ST.calendar)}
    <div class="card" style="padding:12px">
      ${heatmap(days, calStart, today)}
      <div class="row" style="padding-top:8px;gap:3px">
        <span class="grow faint t11">Tippe auf einen Tag · ${esc(ST.calendarHint)}</span>
        <span class="faint" style="font-size:10px">weniger</span>${[0, 1, 2, 3, 4].map((l) => `<i class="hm-cell l${l} lg"></i>`).join('')}<span class="faint" style="font-size:10px">mehr</span>
      </div>
      ${StatsUi.selected ? '<div style="height:10px"></div>' + dayDetail(parseKey(StatsUi.selected), days[StatsUi.selected] || emptyDay()) : ''}
    </div>
    <div style="height:18px"></div>`;

  if (s.n === 0 && s.sec === 0) {
    return h + `<div class="card" style="text-align:center"><div class="t15">Noch keine Daten in diesem Zeitraum — starte eine Runde!</div><div class="dim t13" style="padding-top:4px">${esc(ST.noData)}</div></div><div style="height:16px"></div></div>`;
  }

  const axis = [fmtDay(from), fmtDay(list[Math.floor(list.length / 2)][0]), fmtDay(today)];
  h += `${sectionLabel('Lernzeit pro Tag', ST.minutesPerDay)}
    <div class="card" style="padding:14px">${barChart('min', list.map(([, d]) => [d.s / 60]), [Palette.violet], axis, (i) => `${fmtDayLong(list[i][0])}: ${fmtDuration(list[i][1].s)}`)}</div>
    <div style="height:18px"></div>
    ${sectionLabel('Übungen pro Tag', ST.exercisesPerDay)}
    <div class="card" style="padding:14px">${barChart('ex', list.map(([, d]) => [d.ok, d.n - d.ok]), [Palette.green, Palette.red], axis, (i) => { const d = list[i][1]; return `${fmtDayLong(list[i][0])}: ${d.n} Übungen · ✅ ${d.ok} · ❌ ${d.n - d.ok}`; })}
      ${legend([[Palette.green, 'richtig · ' + ST.right], [Palette.red, 'falsch · ' + ST.wrong]])}</div>
    <div style="height:18px"></div>
    ${sectionLabel('Wochentage (Durchschnitt)', ST.weekdays)}
    <div class="card" style="padding:14px">${barChart('wd', WEEKDAYS.map((_, i) => [s.wdCount[i] ? s.wdSec[i] / 60 / s.wdCount[i] : 0]), [Palette.cyan], WEEKDAYS,
      (i) => { const c = Math.max(1, s.wdCount[i]); return `${WEEKDAYS[i]}: ⌀ ${fmtDuration(Math.floor(s.wdSec[i] / c))} · ⌀ ${Math.floor(s.wdN[i] / c)} Übungen`; }, { perBar: true, height: 110 })}</div>
    <div style="height:18px"></div>
    ${sectionLabel('Tageszeit (Übungen)', ST.timeOfDay)}
    <div class="card" style="padding:14px">${barChart('hr', s.hour.map((v) => [v]), [Palette.amber], ['0 Uhr', '6', '12', '18', '23'], (i) => `${i}–${i + 1} Uhr: ${s.hour[i]} Übungen`, { height: 110 })}`;
  const peak = s.hour.indexOf(Math.max(...s.hour));
  if (s.hour[peak] > 0) h += `<div class="dim t12" style="padding-top:6px">Am aktivsten: ${peak}–${peak + 1} Uhr</div>`;
  h += `</div>
    <div style="height:18px"></div>
    ${sectionLabel('Themen', ST.categories)}
    <div class="card" style="padding:14px">${categoryList(s.cat, s.catOk)}</div>
    <div style="height:18px"></div>
    ${sectionLabel('Übungsmodi', ST.modes)}
    <div class="card" style="padding:14px">`;
  const maxMode = Math.max(1, ...Object.values(s.mode));
  GameMode.entries.filter((m) => (s.mode[m.name] || 0) > 0).sort((a, b) => s.mode[b.name] - s.mode[a.name]).forEach((m) => {
    h += `<div class="row" style="padding:4px 0"><span class="grow semi t14">${esc(m.emoji + ' ' + m.de)}</span><span class="dim t12">${s.mode[m.name]} Übungen</span></div>${progressBar(s.mode[m.name] / maxMode, modeGradient(m), 6)}`;
  });
  h += `</div>
    <div style="height:18px"></div>
    ${sectionLabel('Tag für Tag', ST.dayList)}
    <div class="col gap8">`;
  list.filter(([, d]) => dayActive(d)).reverse().forEach(([day, d]) => {
    const k = dayKey(day);
    const open = StatsUi.expanded === k;
    const yesterday = addDays(today, -1);
    const title = day.getTime() === today.getTime() ? 'Heute · ' + fmtDay(day) : day.getTime() === yesterday.getTime() ? 'Gestern · ' + fmtDay(day) : fmtDayLong(day);
    h += `<div class="card click${open ? ' strong' : ''}" style="padding:12px" data-act="sexp" data-val="${k}">
      <div class="row"><div class="grow col"><span class="bold t15">${esc(title)}</span>
        <span class="dim t12">⏱ ${esc(fmtDuration(d.s))}  ·  ✏️ ${d.n}  ·  🎯 ${pct(d.ok, d.n)} %  ·  🏁 ${d.r}</span></div>
        <span class="faint">${open ? '▴' : '▾'}</span></div>
      ${open ? '<div style="height:10px"></div>' + dayDetail(day, d, false) : ''}
    </div>`;
  });
  return h + '</div><div style="height:16px"></div></div>';
}
