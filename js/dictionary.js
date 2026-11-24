'use strict';
// Wörterbuch Deutsch ↔ Übersetzungssprache.
// Es wird nur die Datei der in den Einstellungen gewählten Sprache geladen (dict/ru.txt, uk.txt, hy.txt, ka.txt, hu.txt)
// und in einem eigenen Cache gespeichert. Beim Sprachwechsel wird das alte Wörterbuch gelöscht.
// Die Dateien erzeugt tools/build_dictionary.py (GitHub-Action "Wörterbuch erstellen").

const DICT_CACHE = 'deutschkurs-dict';

const DICT_UI = {
  RU: { title: 'Словарь', lang: 'русский', teaser: 'Немецкий ↔ русский: введите слово на любом из двух языков', ph: 'Слово по-немецки или по-русски…', loading: 'Загрузка словаря…', fail: 'Не удалось загрузить словарь. Проверьте подключение к интернету.', missing: 'Словарь ещё не создан.', none: 'Ничего не найдено', deTo: 'Немецкий → русский', toDe: 'Русский → немецкий', viaEn: 'через английский', words: 'слов', retry: 'Повторить', hint: 'Словарь загружается один раз и потом работает без интернета.', saved: 'Сохранено на устройстве', del: 'Удалить', start: 'Введите слово, чтобы начать поиск.' },
  UK: { title: 'Словник', lang: 'українська', teaser: 'Німецька ↔ українська: введіть слово будь-якою з двох мов', ph: 'Слово німецькою або українською…', loading: 'Завантаження словника…', fail: 'Не вдалося завантажити словник. Перевірте підключення до інтернету.', missing: 'Словник ще не створено.', none: 'Нічого не знайдено', deTo: 'Німецька → українська', toDe: 'Українська → німецька', viaEn: 'через англійську', words: 'слів', retry: 'Повторити', hint: 'Словник завантажується один раз і потім працює без інтернету.', saved: 'Збережено на пристрої', del: 'Видалити', start: 'Введіть слово, щоб почати пошук.' },
  HY: { title: 'Բառարան', lang: 'հայերեն', teaser: 'Գերմաներեն ↔ հայերեն. մուտքագրեք բառը երկու լեզուներից որևէ մեկով', ph: 'Բառ գերմաներեն կամ հայերեն…', loading: 'Բառարանը բեռնվում է…', fail: 'Չհաջողվեց բեռնել բառարանը։ Ստուգեք ինտերնետ կապը։', missing: 'Բառարանը դեռ ստեղծված չէ։', none: 'Ոչինչ չի գտնվել', deTo: 'Գերմաներեն → հայերեն', toDe: 'Հայերեն → գերմաներեն', viaEn: 'անգլերենի միջոցով', words: 'բառ', retry: 'Կրկնել', hint: 'Բառարանը բեռնվում է մեկ անգամ, հետո աշխատում է առանց ինտերնետի։', saved: 'Պահված է սարքում', del: 'Ջնջել', start: 'Մուտքագրեք բառը՝ որոնումը սկսելու համար։' },
  KA: { title: 'ლექსიკონი', lang: 'ქართული', teaser: 'გერმანული ↔ ქართული: შეიყვანეთ სიტყვა ორიდან ნებისმიერ ენაზე', ph: 'სიტყვა გერმანულად ან ქართულად…', loading: 'ლექსიკონი იტვირთება…', fail: 'ლექსიკონის ჩატვირთვა ვერ მოხერხდა. შეამოწმეთ ინტერნეტი.', missing: 'ლექსიკონი ჯერ არ შექმნილა.', none: 'ვერაფერი მოიძებნა', deTo: 'გერმანული → ქართული', toDe: 'ქართული → გერმანული', viaEn: 'ინგლისურის გავლით', words: 'სიტყვა', retry: 'ხელახლა', hint: 'ლექსიკონი ერთხელ იტვირთება და შემდეგ ინტერნეტის გარეშე მუშაობს.', saved: 'შენახულია მოწყობილობაზე', del: 'წაშლა', start: 'ძიების დასაწყებად შეიყვანეთ სიტყვა.' },
  HU: { title: 'Szótár', lang: 'magyar', teaser: 'Német ↔ magyar: írja be a szót bármelyik nyelven', ph: 'Szó németül vagy magyarul…', loading: 'A szótár betöltése…', fail: 'Nem sikerült betölteni a szótárt. Ellenőrizze az internetkapcsolatot.', missing: 'A szótár még nincs elkészítve.', none: 'Nincs találat', deTo: 'Német → magyar', toDe: 'Magyar → német', viaEn: 'angolon keresztül', words: 'szó', retry: 'Újra', hint: 'A szótár egyszer töltődik le, utána internet nélkül is működik.', saved: 'Az eszközön tárolva', del: 'Törlés', start: 'Írjon be egy szót a kereséshez.' },
};
const DS = () => DICT_UI[AppLang.current.name] || DICT_UI.RU;
const dictColors = ['#F59E0B', '#EF4444'];
const DICT_POS = { n: 'Nomen', name: 'Name', v: 'Verb', adj: 'Adjektiv', adv: 'Adverb', 'präp': 'Präposition', pron: 'Pronomen', konj: 'Konjunktion', num: 'Zahlwort', interj: 'Interjektion', wend: 'Wendung', abk: 'Abkürzung', art: 'Artikel', part: 'Partikel' };

/** Suchschlüssel: klein, ohne Akzente/Umlautpunkte, ß = ss, ё = е. */
const dictFold = (s) => String(s).toLowerCase().replace(/ß/g, 'ss').normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

const Dict = {
  lang: null,        // geladene Sprache (ru, uk …)
  state: 'idle',     // idle | loading | ready | error | missing | cleared
  loaded: 0, total: 0,
  bytes: 0,
  query: '',
  de: null,          // [{ w, art, pl, pos, tr, src }]
  xs: null,          // [{ w, pos, gl }]
  deKeys: null,      // sortiert: [schlüssel, index]
  rvKeys: null,      // sortiert: [schlüssel, 'd'|'x', index, originalwort]
  run: 0,

  code() { return AppLang.current.name.toLowerCase(); },

  /** Wörterbuch der aktuellen Sprache bereitstellen (aus dem Cache oder einmalig herunterladen). */
  async ensure() {
    const code = this.code();
    if ((this.state === 'ready' || this.state === 'loading') && this.lang === code) return;
    const run = ++this.run;
    Object.assign(this, { lang: code, state: 'loading', loaded: 0, total: 0, de: null, xs: null, deKeys: null, rvKeys: null });
    dictRefresh();
    try {
      let meta = null;
      try {
        const r = await fetch('dict/index.json', { cache: 'no-cache' });
        if (r.ok) { meta = await r.json(); Prefs.put('dict_meta', JSON.stringify(meta)); }
        else if (r.status === 404) meta = 'missing';
      } catch (e) { /* offline */ }
      if (meta == null || meta === 'missing') { try { meta = JSON.parse(Prefs.getString('dict_meta', 'null')) || meta; } catch (e) { /* */ } }
      const info = meta && meta !== 'missing' && meta.langs ? meta.langs[code] : null;
      const cache = typeof caches !== 'undefined' ? await caches.open(DICT_CACHE).catch(() => null) : null;
      let text = null;
      let url = info ? `dict/${info.file}?v=${meta.version}` : null;
      if (cache) {
        const keys = await cache.keys();
        const mine = keys.filter((k) => new URL(k.url).pathname.endsWith(`/dict/${code}.txt`));
        const exact = url && mine.find((k) => k.url.endsWith(url));
        const use = exact || (!info ? mine[0] : null); // offline oder ohne index.json: vorhandene Version nehmen
        if (use) { const res = await cache.match(use); if (res) { text = await res.text(); url = use.url; } }
      }
      if (text == null) {
        if (!info) { if (run === this.run) { this.state = meta === 'missing' || (meta && meta.langs) ? 'missing' : 'error'; dictRefresh(); } return; }
        this.total = info.bytes || 0;
        text = await this.download(url, run);
        if (text == null) return;
        if (cache) { try { await cache.put(url, new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })); } catch (e) { /* Speicher voll */ } }
      }
      // Nur dieses eine Wörterbuch behalten
      if (cache) {
        const keep = new URL(url, location.href).href;
        for (const k of await cache.keys()) if (k.url !== keep) await cache.delete(k);
      }
      if (run !== this.run) return;
      this.bytes = new Blob([text]).size;
      this.parse(text);
      this.state = 'ready';
    } catch (e) {
      if (run === this.run) this.state = 'error';
    }
    if (run === this.run) dictRefresh();
  },

  async download(url, run) {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    if (!res.body || !window.TextDecoder) return res.text();
    const reader = res.body.getReader();
    const dec = new TextDecoder('utf-8');
    let out = '', last = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (run !== this.run) { try { reader.cancel(); } catch (e) { /* */ } return null; }
      if (done) break;
      out += dec.decode(value, { stream: true });
      this.loaded += value.length;
      const now = Date.now();
      if (now - last > 200) { last = now; dictProgress(); }
    }
    return out + dec.decode();
  },

  parse(text) {
    const de = [], xs = [], deKeys = [], rvKeys = [];
    const lines = text.split('\n');
    for (const line of lines) {
      if (!line) continue;
      const f = line.split('\t');
      if (f[0] === 'D' && f.length >= 6) {
        const i = de.length;
        de.push({ w: f[1], art: f[2], pl: f[3], pos: f[4], tr: f[5], src: f[6] || 'w' });
        deKeys.push([dictFold(f[1]), i]);
        const seen = new Set();
        for (const t of f[5].split(/\s*[;,]\s*/)) {
          const tt = t.replace(/\s*\(.*?\)\s*/g, ' ').trim();
          const k = dictFold(tt);
          if (k && !seen.has(k)) { seen.add(k); rvKeys.push([k, 'd', i, tt]); }
        }
      } else if (f[0] === 'X' && f.length >= 4) {
        const i = xs.length;
        xs.push({ w: f[1], pos: f[2], gl: f[3] });
        rvKeys.push([dictFold(f[1]), 'x', i, f[1]]);
      }
    }
    const cmp = (a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
    deKeys.sort(cmp); rvKeys.sort(cmp);
    Object.assign(this, { de, xs, deKeys, rvKeys });
  },

  /** Alle Schlüssel, die mit q beginnen (binäre Suche), exakte Treffer zuerst. */
  prefix(keys, q, limit) {
    let lo = 0, hi = keys.length;
    while (lo < hi) { const m = (lo + hi) >> 1; if (keys[m][0] < q) lo = m + 1; else hi = m; }
    const out = [];
    for (let i = lo; i < keys.length && out.length < limit && keys[i][0].startsWith(q); i++) out.push(keys[i]);
    return out.sort((a, b) => (a[0] !== q) - (b[0] !== q) || a[0].length - b[0].length);
  },

  search(query) {
    const q = dictFold(query);
    if (!q || this.state !== 'ready') return null;
    const deHits = this.prefix(this.deKeys, q, 400).slice(0, 25).map((k) => this.de[k[1]]);
    // Rückrichtung: nach Wort in der Zielsprache gruppieren
    const groups = new Map();
    for (const k of this.prefix(this.rvKeys, q, 600)) {
      const g = groups.get(k[0]) || { word: k[3], exact: k[0] === q, des: [], xs: [] };
      if (k[1] === 'd') { if (g.des.length < 12) g.des.push(this.de[k[2]]); } else g.xs.push(this.xs[k[2]]);
      groups.set(k[0], g);
      if (groups.size > 20) break;
    }
    return { de: deHits, rv: [...groups.values()].slice(0, 15) };
  },

  /** Sprache in den Einstellungen gewechselt: altes Wörterbuch aus Speicher und Cache entfernen. */
  langChanged() {
    if (this.lang === this.code()) return;
    this.run++;
    Object.assign(this, { lang: null, state: 'idle', de: null, xs: null, deKeys: null, rvKeys: null, bytes: 0 });
    if (typeof caches !== 'undefined') caches.delete(DICT_CACHE).catch(() => {});
  },

  async clear() {
    this.run++;
    Object.assign(this, { lang: null, state: 'cleared', de: null, xs: null, deKeys: null, rvKeys: null, bytes: 0 });
    if (typeof caches !== 'undefined') await caches.delete(DICT_CACHE).catch(() => {});
  },
};

/* ---------------- Darstellung ---------------- */
const dictMB = (b) => (b / 1048576).toFixed(b > 10485760 ? 0 : 1) + ' MB';
function dictSenses(tr) {
  const parts = tr.split(' ; ').filter(Boolean);
  if (parts.length === 1) return `<div class="t15 dict-sel">${esc(parts[0])}</div>`;
  return `<ol class="dict-senses dict-sel">${parts.map((p) => `<li>${esc(p)}</li>`).join('')}</ol>`;
}
function dictPos(pos) {
  const list = pos ? pos.split(',') : [];
  if (list.includes('n')) { const i = list.indexOf('name'); if (i >= 0) list.splice(i, 1); } // „Nomen“ reicht
  return list.map((p) => `<span class="dict-pos">${esc(DICT_POS[p] || p)}</span>`).join('');
}
function dictDeHead(e) {
  const noun = e.art ? `${e.art} ` : '';
  const pl = e.pl ? `<span class="faint t13">, die ${esc(e.pl)}</span>` : '';
  const sp = Speaker.missingGerman ? '' : `<button class="circle-btn dict-say" data-act="speak" data-text="${esc((e.art ? e.art.split('/')[0] + ' ' : '') + e.w)}">🔊</button>`;
  return `<div class="row gap8"><div class="grow"><span class="dict-art">${esc(noun)}</span><span class="bold t17 dict-sel">${esc(e.w)}</span>${pl} ${dictPos(e.pos)}</div>${sp}</div>`;
}
function dictResults() {
  const D = Dict, T = DS();
  if (D.state === 'loading') {
    const p = D.total ? Math.min(1, D.loaded / D.total) : 0;
    return `<div class="card col gap10"><div class="t14">${esc(T.loading)} · Wörterbuch wird geladen …</div>
      <div data-dictbar>${progressBar(p, dictColors, 8)}</div>
      <div class="faint t12" data-dictmb>${dictMB(D.loaded)}${D.total ? ' / ' + dictMB(D.total) : ''}</div>
      <div class="faint t12">${esc(T.hint)}</div></div>`;
  }
  if (D.state === 'cleared') return `<div class="card col gap10"><div class="t14">🗑 Gelöscht.</div><button class="btn-ghost" data-act="dictretry">⬇ Wörterbuch laden · ${esc(T.retry)}</button><div class="faint t12">${esc(T.hint)}</div></div>`;
  if (D.state === 'missing') return `<div class="card t14">${esc(T.missing)}<div class="faint t12" style="padding-top:6px">Das Wörterbuch wurde noch nicht erstellt. Auf GitHub: Actions → „Wörterbuch erstellen“ → Run workflow.</div></div>`;
  if (D.state === 'error') return `<div class="card col gap10"><div class="t14">${esc(T.fail)}</div><button class="btn-ghost" data-act="dictretry">↻ Erneut versuchen · ${esc(T.retry)}</button></div>`;
  if (D.state !== 'ready') return '';
  const r = D.search(D.query);
  if (!r) return `<div class="faint t13" style="text-align:center;padding:10px">${esc(T.start)} · Gib ein Wort ein.</div>`;
  if (!r.de.length && !r.rv.length) return `<div class="card dim t14" style="text-align:center">Nichts gefunden · ${esc(T.none)}</div>`;
  let h = '';
  if (r.de.length) {
    h += sectionLabel('Deutsch → ' + AppLang.current.germanName, T.deTo);
    h += `<div class="col gap10">${r.de.map((e) => `<div class="card dict-card">${dictDeHead(e)}
      <div style="height:6px"></div>${dictSenses(e.tr)}
      ${e.src === 'e' ? `<div class="faint t11" style="padding-top:4px">≈ über Englisch · ${esc(T.viaEn)}</div>` : ''}</div>`).join('')}</div>`;
  }
  if (r.rv.length) {
    h += sectionLabel(AppLang.current.germanName + ' → Deutsch', T.toDe);
    h += `<div class="col gap10">${r.rv.map((g) => `<div class="card dict-card">
      <div><span class="bold t17 dict-sel">${esc(g.word)}</span> ${g.xs.length ? dictPos(g.xs[0].pos) : ''}</div>
      ${g.xs.map((x) => `<div style="padding-top:6px">${dictSenses(x.gl)}</div>`).join('')}
      ${g.des.length ? `<div class="col gap6" style="padding-top:8px">${g.des.map((e) => dictDeHead(e)).join('')}</div>` : ''}
    </div>`).join('')}</div>`;
  }
  return h;
}
function dictionaryScreen() {
  const T = DS();
  if (Dict.state !== 'cleared' && (Dict.state === 'idle' || Dict.lang !== Dict.code())) setTimeout(() => Dict.ensure(), 0);
  return `<div class="scroll pad16" style="flex:1"><div class="gb-wrap col gap12">
    <div class="row"><button class="circle-btn" data-act="back">‹</button><div style="width:14px"></div>
      <div class="col grow">${gradTitle('Wörterbuch', dictColors, 26)}<div class="dim t13">${esc(T.title)} · Deutsch ↔ ${esc(T.lang)} ${AppLang.current.flag}</div></div></div>
    <input id="dictSearch" class="gb-search" type="search" value="${esc(Dict.query)}" placeholder="🔍 Wort auf Deutsch oder ${esc(AppLang.current.germanName)} · ${esc(T.ph)}" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="search">
    <div id="dictOut" class="col gap10">${dictResults()}</div>
    <div class="faint t11" style="line-height:16px;padding-top:6px">${Dict.state === 'ready' ? `${esc(T.saved)}: ${dictMB(Dict.bytes)} · ${(Dict.de.length + Dict.xs.length).toLocaleString('de-DE')} Einträge · <button class="dict-link" data-act="dictclear">🗑 ${esc(T.del)}</button><br>` : ''}
      Quelle: Wiktionary (de, ru, en) über kaikki.org / Wiktextract · Lizenz CC BY-SA 4.0 · Wiktionary-Autoren</div>
    <div style="height:8px;flex:none"></div>
  </div></div>`;
}
function dictionaryTeaser() {
  return `<div class="card click" data-act="dicthome">
    <div class="row">
      ${iconCircle('📕', dictColors)}
      <div style="width:14px"></div>
      <div class="grow col">
        <div class="bold" style="font-size:16px">Wörterbuch · ${esc(DS().title)}</div>
        <div class="dim t13">Deutsch ↔ ${esc(AppLang.current.germanName)} · ${esc(DS().teaser)}</div>
      </div>
      <div class="dim" style="font-size:30px">›</div>
    </div>
  </div>`;
}

/* ---------------- Aktualisieren ohne Neuaufbau (Tastatur bleibt offen) ---------------- */
function dictRefresh() {
  if (App.screen !== Screen.DICT) return;
  const out = App.root.querySelector('#dictOut');
  if (!out) return;
  if (Dict.state !== 'loading') {
    // Fußzeile (Größe, Löschen) braucht einen Neuaufbau, außer während der Eingabe
    if (document.activeElement && document.activeElement.id === 'dictSearch') out.innerHTML = dictResults();
    else render();
  } else out.innerHTML = dictResults();
}
function dictProgress() {
  const bar = App.root && App.root.querySelector('[data-dictbar]');
  const mb = App.root && App.root.querySelector('[data-dictmb]');
  if (bar) bar.innerHTML = progressBar(Dict.total ? Math.min(1, Dict.loaded / Dict.total) : 0, dictColors, 8);
  if (mb) mb.textContent = dictMB(Dict.loaded) + (Dict.total ? ' / ' + dictMB(Dict.total) : '');
}

let dictTimer = 0;
function dictionaryInput(el) {
  if (el.id !== 'dictSearch') return;
  Dict.query = el.value;
  clearTimeout(dictTimer);
  dictTimer = setTimeout(() => { const out = App.root.querySelector('#dictOut'); if (out) out.innerHTML = dictResults(); }, 120);
}
function dictionaryClick(act) {
  switch (act) {
    case 'dicthome': go(Screen.DICT); setTimeout(() => { const i = App.root.querySelector('#dictSearch'); if (i && Dict.state === 'ready') i.focus(); }, 50); return true;
    case 'dictretry': Dict.state = 'idle'; Dict.lang = null; Dict.ensure(); return true;
    case 'dictclear': Dict.clear().then(() => render()); return true;
    default: return false;
  }
}
