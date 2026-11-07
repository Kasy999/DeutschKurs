'use strict';
// Konto mit Benutzername + Passwort und Abgleich des Lernstands (Port von Cloud.kt / AccountScreen.kt).

/* ---------------- Lernstand als Schnappschuss (gleiches JSON wie die Android-App) ---------------- */
const SNAP_MODES = () => GameMode.entries.map((m) => m.name);

function readSnapshot() {
  const best = {};
  SNAP_MODES().forEach((m) => { const v = Prefs.getInt('best_' + m, 0); if (v > 0) best[m] = v; });
  const mistakes = {};
  const raw = Prefs.getString(Progress.KEY_MISTAKES, '') || '';
  raw.split(Progress.SEP_ENTRY).forEach((en) => {
    const i = en.lastIndexOf(Progress.SEP_VALUE);
    if (i > 0) { const n = parseInt(en.substring(i + 1), 10); if (!isNaN(n)) mistakes[en.substring(0, i)] = n; }
  });
  return {
    total_points: Prefs.getInt(Progress.KEY_TOTAL, 0), peak_points: Prefs.getInt(Progress.KEY_PEAK, 0),
    answered: Prefs.getInt(Progress.KEY_ANSWERED, 0), correct: Prefs.getInt(Progress.KEY_CORRECT, 0),
    best_streak: Prefs.getInt(Progress.KEY_STREAK, 0), best, mistakes,
    placement_level: Prefs.getInt('placement_level', 0),
    placement_time: parseInt(Prefs.getString('placement_time', '0'), 10) || 0,
    difficulty_level: Prefs.getInt('difficulty_level', 0),
  };
}

function writeSnapshot(s) {
  Prefs.put(Progress.KEY_TOTAL, s.total_points); Prefs.put(Progress.KEY_PEAK, s.peak_points);
  Prefs.put(Progress.KEY_ANSWERED, s.answered); Prefs.put(Progress.KEY_CORRECT, s.correct);
  Prefs.put(Progress.KEY_STREAK, s.best_streak);
  Prefs.put(Progress.KEY_MISTAKES, Object.entries(s.mistakes).map(([k, v]) => k + Progress.SEP_VALUE + v).join(Progress.SEP_ENTRY));
  SNAP_MODES().forEach((m) => Prefs.put('best_' + m, s.best[m] || 0));
  Prefs.put('placement_level', s.placement_level); Prefs.put('placement_time', s.placement_time);
  Prefs.put('difficulty_level', s.difficulty_level);
}

/** Fehlende/ungültige Felder auffüllen (Daten aus dem Konto). */
function normalizeSnapshot(o) {
  o = o && typeof o === 'object' ? o : {};
  const int = (v) => (Number.isFinite(+v) ? Math.trunc(+v) : 0);
  const map = (m) => { const r = {}; if (m && typeof m === 'object') Object.entries(m).forEach(([k, v]) => { if (int(v) > 0) r[k] = int(v); }); return r; };
  return {
    total_points: int(o.total_points), peak_points: int(o.peak_points), answered: int(o.answered), correct: int(o.correct),
    best_streak: int(o.best_streak), best: map(o.best), mistakes: map(o.mistakes),
    placement_level: int(o.placement_level), placement_time: int(o.placement_time), difficulty_level: int(o.difficulty_level),
  };
}

/** Wie mergeSnapshots in Cloud.kt: Seite mit mehr Antworten gewinnt, Höchstwerte bleiben, neuerer Test zählt. */
function mergeSnapshots(local, remote) {
  const base = remote.answered > local.answered ? remote : local;
  const pl = remote.placement_time > local.placement_time ? remote : local;
  const best = {};
  new Set([...Object.keys(local.best), ...Object.keys(remote.best)]).forEach((k) => { best[k] = Math.max(local.best[k] || 0, remote.best[k] || 0); });
  return {
    ...base, mistakes: { ...base.mistakes },
    peak_points: Math.max(local.peak_points, remote.peak_points, base.total_points),
    best_streak: Math.max(local.best_streak, remote.best_streak),
    best, placement_level: pl.placement_level, placement_time: pl.placement_time,
  };
}
/** Vergleich unabhängig von der Reihenfolge der Schlüssel (die Datenbank sortiert sie um). */
function canonical(v) {
  if (v && typeof v === 'object') return '{' + Object.keys(v).sort().map((k) => JSON.stringify(k) + ':' + canonical(v[k])).join(',') + '}';
  return JSON.stringify(v);
}
const sameSnapshot = (a, b) => canonical(normalizeSnapshot(a)) === canonical(normalizeSnapshot(b));

/* ---------------- Konto ---------------- */
class CloudError extends Error { constructor(code) { super(code); this.code = code; } }

const Account = {
  username: null,
  token: null,
  lastSync: 0,
  syncing: false,
  syncError: null,
  onApplied: () => {},
  onChange: () => {},
  get loggedIn() { return !!this.token; },

  load() {
    this.token = Prefs.getString('account_token', null);
    this.username = this.token ? Prefs.getString('account_name', null) : null;
    this.lastSync = parseInt(Prefs.getString('account_sync_time', '0'), 10) || 0;
  },
  forget() {
    this.token = null; this.username = null;
    try { localStorage.removeItem(Prefs.prefix + 'account_token'); localStorage.removeItem(Prefs.prefix + 'account_name'); } catch (e) { /* */ }
  },

  async rpc(fn, body) {
    if (!CloudConfig.configured) throw new CloudError('not_configured');
    let res;
    try {
      res = await fetch(CloudConfig.SUPABASE_URL.replace(/\/+$/, '') + '/rest/v1/rpc/' + fn, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: CloudConfig.SUPABASE_ANON_KEY, Authorization: 'Bearer ' + CloudConfig.SUPABASE_ANON_KEY },
        body: JSON.stringify(body),
      });
    } catch (e) { throw new CloudError('network'); }
    if (!res.ok) throw new CloudError('server');
    let json;
    try { json = await res.json(); } catch (e) { throw new CloudError('server'); }
    if (json && json.error) throw new CloudError(json.error);
    return json;
  },

  async signIn(fn, name, password) {
    const r = await this.rpc(fn, { p_username: name.trim(), p_password: password });
    this.token = r.token;
    this.username = r.username || name.trim();
    Prefs.put('account_token', this.token);
    Prefs.put('account_name', this.username);
    await this.mergeAndSave(normalizeSnapshot(r.data));
  },
  register(name, pw) { return this.signIn('dk_register', name, pw); },
  login(name, pw) { return this.signIn('dk_login', name, pw); },

  /** Abgleich; Fehler nur vermerken (offline geht es weiter). */
  async sync() {
    if (!this.loggedIn || !CloudConfig.configured || this.syncing) return;
    try {
      const r = await this.rpc('dk_load', { p_token: this.token });
      if (r.username) this.username = r.username;
      await this.mergeAndSave(normalizeSnapshot(r.data));
    } catch (e) {
      if (e.code === 'session_expired') this.forget();
      this.syncError = e.code || 'server';
      this.syncing = false;
      this.onChange();
    }
  },

  async mergeAndSave(remote) {
    this.syncing = true; this.onChange();
    try {
      const local = normalizeSnapshot(readSnapshot());
      const merged = mergeSnapshots(local, remote);
      if (!sameSnapshot(merged, local)) { writeSnapshot(merged); this.onApplied(); }
      if (!sameSnapshot(merged, remote)) await this.rpc('dk_save', { p_token: this.token, p_data: merged });
      this.lastSync = Date.now();
      Prefs.put('account_sync_time', this.lastSync);
      this.syncError = null;
    } finally {
      this.syncing = false; this.onChange();
    }
  },

  async logout() {
    const t = this.token;
    if (!t) return;
    await this.sync();
    if (this.syncError && this.syncError !== 'session_expired') throw new CloudError(this.syncError);
    try { await this.rpc('dk_logout', { p_token: t }); } catch (e) { /* Token verfällt ohnehin */ }
    this.forget();
    writeSnapshot(normalizeSnapshot({}));
    this.onApplied();
  },

  async deleteAccount(password) {
    await this.rpc('dk_delete_account', { p_token: this.token, p_password: password });
    this.forget();
  },
};

/* ---------------- Texte ---------------- */
const AccountTexts = {
  RU: {
    account: 'Аккаунт', login: 'Войти', register: 'Создать аккаунт', username: 'Имя пользователя', password: 'Пароль', logout: 'Выйти',
    syncNow: 'Синхронизировать', synced: 'Прогресс сохранён в аккаунте', deleteAccount: 'Удалить аккаунт',
    hint: 'Войдите, чтобы сохранять прогресс и продолжать на другом устройстве. Нужны только имя и пароль.',
    errors: { invalid_username: 'Имя: 3–20 символов (буквы, цифры, _ . -).', invalid_password: 'Пароль: минимум 6 символов.', username_taken: 'Это имя уже занято.', invalid_login: 'Неверное имя или пароль.', locked: 'Слишком много попыток. Подождите 10 минут.', session_expired: 'Сессия истекла. Войдите снова.', network: 'Нет соединения с интернетом.' },
  },
  UK: {
    account: 'Акаунт', login: 'Увійти', register: 'Створити акаунт', username: "Ім'я користувача", password: 'Пароль', logout: 'Вийти',
    syncNow: 'Синхронізувати', synced: 'Прогрес збережено в акаунті', deleteAccount: 'Видалити акаунт',
    hint: "Увійдіть, щоб зберігати прогрес і продовжувати на іншому пристрої. Потрібні лише ім'я та пароль.",
    errors: { invalid_username: "Ім'я: 3–20 символів (літери, цифри, _ . -).", invalid_password: 'Пароль: щонайменше 6 символів.', username_taken: "Це ім'я вже зайняте.", invalid_login: "Неправильне ім'я або пароль.", locked: 'Забагато спроб. Зачекайте 10 хвилин.', session_expired: 'Сесія закінчилася. Увійдіть знову.', network: "Немає з'єднання з інтернетом." },
  },
  HY: {
    account: 'Հաշիվ', login: 'Մուտք', register: 'Ստեղծել հաշիվ', username: 'Օգտանուն', password: 'Գաղտնաբառ', logout: 'Ելք',
    syncNow: 'Համաժամեցնել', synced: 'Առաջընթացը պահված է հաշվում', deleteAccount: 'Ջնջել հաշիվը',
    hint: 'Մուտք գործեք՝ առաջընթացը պահելու և այլ սարքում շարունակելու համար։ Պետք է միայն անուն և գաղտնաբառ։',
    errors: { invalid_username: 'Անուն՝ 3–20 նիշ (տառեր, թվեր, _ . -)։', invalid_password: 'Գաղտնաբառ՝ առնվազն 6 նիշ։', username_taken: 'Այս անունն արդեն զբաղված է։', invalid_login: 'Սխալ անուն կամ գաղտնաբառ։', locked: 'Չափազանց շատ փորձեր։ Սպասեք 10 րոպե։', session_expired: 'Սեսիան ավարտվել է։ Կրկին մուտք գործեք։', network: 'Ինտերնետ կապ չկա։' },
  },
  KA: {
    account: 'ანგარიში', login: 'შესვლა', register: 'ანგარიშის შექმნა', username: 'მომხმარებლის სახელი', password: 'პაროლი', logout: 'გასვლა',
    syncNow: 'სინქრონიზაცია', synced: 'პროგრესი შენახულია ანგარიშში', deleteAccount: 'ანგარიშის წაშლა',
    hint: 'შედით, რომ შეინახოთ პროგრესი და გააგრძელოთ სხვა მოწყობილობაზე. საჭიროა მხოლოდ სახელი და პაროლი.',
    errors: { invalid_username: 'სახელი: 3–20 სიმბოლო (ასოები, ციფრები, _ . -).', invalid_password: 'პაროლი: მინიმუმ 6 სიმბოლო.', username_taken: 'ეს სახელი უკვე დაკავებულია.', invalid_login: 'არასწორი სახელი ან პაროლი.', locked: 'ძალიან ბევრი მცდელობა. დაელოდეთ 10 წუთს.', session_expired: 'სესია ამოიწურა. შედით თავიდან.', network: 'ინტერნეტ კავშირი არ არის.' },
  },
};
const AS = () => AccountTexts[AppLang.current.name] || AccountTexts.RU;
const accountErrorsDe = {
  invalid_username: 'Benutzername: 3–20 Zeichen (Buchstaben, Ziffern, _ . -).',
  invalid_password: 'Passwort: mindestens 6 Zeichen.',
  username_taken: 'Dieser Benutzername ist schon vergeben.',
  invalid_login: 'Benutzername oder Passwort falsch.',
  locked: 'Zu viele Fehlversuche. Bitte 10 Minuten warten.',
  session_expired: 'Sitzung abgelaufen. Bitte neu anmelden.',
  network: 'Keine Internetverbindung.',
  server: 'Server nicht erreichbar. Später noch einmal versuchen.',
  not_configured: 'Die Konto-Datenbank ist noch nicht eingerichtet.',
  mismatch: 'Die Passwörter stimmen nicht überein.',
};
function accountError(code) {
  const de = accountErrorsDe[code] || accountErrorsDe.server;
  const loc = AS().errors[code];
  return loc ? de + '\n' + loc : de;
}

/* ---------------- Oberfläche ---------------- */
// Formularzustand (bleibt beim Neuaufbau der Seite erhalten)
const AccUi = { register: false, name: '', pw: '', pw2: '', busy: false, error: null, deleting: false, deletePw: '' };

function accountTeaser() {
  if (!CloudConfig.configured) return '';
  const name = Account.username;
  const status = Account.syncing ? '☁ wird gespeichert …' : Account.syncError ? '⚠ Offline – wird später gespeichert' : '✓ Fortschritt im Konto gespeichert';
  return `<div class="card click" style="padding:14px" data-act="account">
    <div class="row">
      ${iconCircle(name ? '☁️' : '👤', Palette.primary, 44)}
      <div style="width:12px"></div>
      <div class="grow col">
        ${name ? `<div class="bold" style="font-size:16px">${esc(name)}</div><div class="t13" style="color:${Account.syncError ? Palette.amber : Palette.textDim}">${status}</div>`
          : `<div class="bold" style="font-size:16px">Anmelden · ${esc(AS().login)}</div><div class="dim t13">Fortschritt im Konto speichern</div>`}
      </div>
      <div class="dim" style="font-size:30px">›</div>
    </div>
  </div>`;
}

function accField(id, label, value, type, autocomplete) {
  return `<div class="spell-field"><label for="${id}">${esc(label)}</label>
    <input id="${id}" type="${type}" value="${esc(value)}" autocomplete="${autocomplete}" autocapitalize="off" autocorrect="off" spellcheck="false" maxlength="${type === 'password' ? 72 : 20}"
      style="width:100%;background:transparent;border:0;outline:0;color:#fff;font-size:18px;font-weight:600;padding:0"></div>`;
}

function accountScreen() {
  const head = `<div class="row"><button class="circle-btn" data-act="back">‹</button><div style="width:14px"></div>
    <div class="col">${gradTitle('Konto', [...Palette.primary, Palette.cyan], 26)}<div class="dim t13">${esc(AS().account)}</div></div></div>`;
  return `<div class="scroll col gap14 pad16" style="flex:1">${head}${Account.username ? accountInfo() : signInForm()}</div>`;
}

function signInForm() {
  const u = AccUi;
  const ready = !u.busy && u.name.trim() && u.pw && (!u.register || u.pw2);
  return `<div class="card">
      <div class="t14" style="line-height:20px">Melde dich an, um deinen Fortschritt zu speichern und auf einem anderen Gerät weiterzulernen. Du brauchst nur einen Benutzernamen und ein Passwort.</div>
      <div class="dim t13" style="line-height:19px;padding-top:6px">${esc(AS().hint)}</div>
    </div>
    <div class="row gap10">
      <button class="btn-ghost${u.register ? '' : ' active'}" style="flex:1 1 0" data-act="accmode" data-val="0">Anmelden · ${esc(AS().login)}</button>
      <button class="btn-ghost${u.register ? ' active' : ''}" style="flex:1 1 0" data-act="accmode" data-val="1">Neues Konto · ${esc(AS().register)}</button>
    </div>
    <form class="col gap14" data-accform>
      ${accField('accName', 'Benutzername · ' + AS().username, u.name, 'text', 'username')}
      ${accField('accPw', 'Passwort · ' + AS().password, u.pw, 'password', u.register ? 'new-password' : 'current-password')}
      ${u.register ? accField('accPw2', 'Passwort wiederholen', u.pw2, 'password', 'new-password') + `
        <div class="faint t12" style="line-height:17px">3–20 Zeichen (Buchstaben, Ziffern, _ . -) · Passwort mind. 6 Zeichen. Es gibt keine E-Mail – merke dir dein Passwort gut, es kann nicht zurückgesetzt werden.</div>` : ''}
      ${u.error ? `<div class="semi t14" style="color:var(--red);white-space:pre-line">${esc(u.error)}</div>` : ''}
      <button type="submit" class="btn-grad" style="width:100%;background:${linGrad(Palette.primary)}" data-accsubmit ${ready ? '' : 'disabled'}>${u.busy ? 'Bitte warten …' : u.register ? 'Konto erstellen · ' + esc(AS().register) : 'Anmelden · ' + esc(AS().login)}</button>
    </form>
    <div class="faint t12">Dein bisheriger Fortschritt auf diesem Gerät wird ins Konto übernommen.</div>`;
}

function accountInfo() {
  const u = AccUi;
  const t = Account.lastSync;
  const when = t ? new Date(t).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' }) : null;
  return `<div class="card strong"><div class="row">
      ${iconCircle('👤', Palette.primary)}<div style="width:14px"></div>
      <div class="grow col">
        <div class="black" style="font-size:20px">${esc(Account.username)}</div>
        <div class="dim t13">${when ? 'Zuletzt gespeichert: ' + when : 'Noch nicht gespeichert'}</div>
        <div class="faint t12">${esc(AS().synced)}</div>
      </div></div></div>
    ${Account.syncError && !u.error ? `<div class="t13" style="color:var(--amber);white-space:pre-line">${esc(accountError(Account.syncError))}</div>` : ''}
    ${u.error ? `<div class="semi t14" style="color:var(--red);white-space:pre-line">${esc(u.error)}</div>` : ''}
    <button class="btn-grad" style="width:100%;background:${linGrad(Palette.primary)}" data-act="accsync" ${u.busy || Account.syncing ? 'disabled' : ''}>${u.busy || Account.syncing ? 'Bitte warten …' : '☁ Jetzt speichern · ' + esc(AS().syncNow)}</button>
    <button class="btn-ghost" style="width:100%" data-act="acclogout" ${u.busy ? 'disabled' : ''}>Abmelden · ${esc(AS().logout)}</button>
    <div class="faint t12">Beim Abmelden wird der Fortschritt im Konto gespeichert und von diesem Gerät entfernt.</div>
    <div style="height:8px"></div>
    ${!u.deleting ? `<button class="btn-ghost" style="width:100%" data-act="accdelete">🗑 Konto löschen · ${esc(AS().deleteAccount)}</button>`
      : `<div class="card">
        <div class="bold t15" style="color:var(--red)">Konto endgültig löschen?</div>
        <div class="dim t13" style="line-height:18px;padding:6px 0">Alle im Konto gespeicherten Daten werden gelöscht. Der Fortschritt auf diesem Gerät bleibt. Zur Bestätigung Passwort eingeben.</div>
        ${accField('accDelPw', 'Passwort · ' + AS().password, u.deletePw, 'password', 'current-password')}
        <div style="height:10px"></div>
        <div class="row gap10">
          <button class="btn-ghost" style="flex:1 1 0" data-act="accdelcancel">Abbrechen</button>
          <button class="btn-grad" style="flex:1 1 0;background:linear-gradient(90deg,#FB7185,#9F1239)" data-act="accdelconfirm" ${u.busy ? 'disabled' : ''}>Löschen</button>
        </div></div>`}`;
}

/** Aktion ausführen und Fehler im Formular anzeigen. */
async function accountRun(fn, after) {
  if (AccUi.busy) return;
  AccUi.busy = true; AccUi.error = null; render();
  try { await fn(); if (after) after(); } catch (e) { AccUi.error = accountError(e.code || 'server'); } finally { AccUi.busy = false; render(); }
}

function accountSubmit() {
  const u = AccUi;
  if (u.busy) return;
  if (u.register && u.pw !== u.pw2) { u.error = accountError('mismatch'); render(); return; }
  accountRun(() => (u.register ? Account.register(u.name, u.pw) : Account.login(u.name, u.pw)), () => { u.pw = ''; u.pw2 = ''; });
}

/** Klicks im Konto-Bereich; true, wenn behandelt. */
function accountClick(act, el) {
  const u = AccUi;
  switch (act) {
    case 'account': Object.assign(u, { register: false, error: null, deleting: false, deletePw: '', pw: '', pw2: '' }); go(Screen.ACCOUNT); return true;
    case 'accmode': u.register = el.dataset.val === '1'; u.error = null; render(); return true;
    case 'accsync': u.error = null; Account.sync(); return true;
    case 'acclogout': accountRun(() => Account.logout(), () => goHome()); return true;
    case 'accdelete': u.deleting = true; u.deletePw = ''; render(); return true;
    case 'accdelcancel': u.deleting = false; u.deletePw = ''; render(); return true;
    case 'accdelconfirm': if (u.deletePw) accountRun(() => Account.deleteAccount(u.deletePw), () => { u.deleting = false; u.deletePw = ''; goHome(); }); return true;
    default: return false;
  }
}

/** Eingaben ohne Neuaufbau mitschreiben; Knopf freischalten. */
function accountInput(el) {
  const u = AccUi;
  const map = { accName: 'name', accPw: 'pw', accPw2: 'pw2', accDelPw: 'deletePw' };
  if (!map[el.id]) return false;
  u[map[el.id]] = el.value;
  const btn = App.root.querySelector('[data-accsubmit]');
  if (btn) btn.disabled = !(!u.busy && u.name.trim() && u.pw && (!u.register || u.pw2));
  return true;
}
