'use strict';
// Oberfläche (Port von GameScreen.kt): Start, Quiz, Feier, Ergebnis, Auszeichnungen, Einstellungen.

const Screen = { HOME: 'HOME', PLAYING: 'PLAYING', FINISHED: 'FINISHED', REWARDS: 'REWARDS', SETTINGS: 'SETTINGS', PLACEMENT: 'PLACEMENT' };

const App = {
  screen: Screen.HOME,
  round: null,
  placement: null, // laufender Einstufungstest
  progress: null,
  // Zustand der aktuellen Aufgabe (entspricht remember(task) { … })
  ui: { picked: [], spellText: '', showDe: false, showLoc: false, shake: false },
  finish: null, // { oldBest, newBest }
  root: null,
};

const isWide = () => window.innerWidth > window.innerHeight && window.innerWidth >= 560;

function start(mode) {
  App.round = new GameRound(mode, App.progress);
  resetTaskUi();
  go(Screen.PLAYING);
}
function resetTaskUi() {
  const t = App.round ? App.round.task : null;
  App.ui = { picked: [], spellText: t && t.type === 'spell' ? t.wrong : '', showDe: false, showLoc: false, shake: false };
}
function go(screen) {
  const fromHome = App.screen === Screen.HOME;
  App.screen = screen;
  if (screen === Screen.FINISHED) {
    const oldBest = App.progress.best(App.round.mode);
    App.finish = { oldBest, newBest: App.progress.saveBest(App.round.mode, App.round.score) };
  }
  // Zurück-Taste (Android-BackHandler): ein Verlaufseintrag für alle Unterseiten
  if (screen !== Screen.HOME && fromHome) { try { history.pushState({ s: 1 }, ''); } catch (e) { /* */ } }
  render({ scrollTop: true });
}
function goHome() {
  Speaker.stop();
  App.screen = Screen.HOME;
  render({ scrollTop: true });
}
window.addEventListener('popstate', () => { if (App.screen !== Screen.HOME) goHome(); });
function backHome() { if (history.state && history.state.s) history.back(); else goHome(); }

/* =====================================================================
   Start
   ===================================================================== */
function homeHeader() {
  const level = AppDifficulty.fixed ? cefrLabels[AppDifficulty.fixed - 1] : 'Auto';
  return `<div class="row">
    <div class="grow">${gradTitle('DeutschKurs', [...Palette.primary, Palette.cyan])}
      <div class="dim t14">Lernen · Üben · Aufsteigen   —   ${esc(S.tagline)}</div></div>
    <div style="width:10px"></div>
    <button class="lang-chip" data-act="settings">${AppLang.current.flag} ${esc(level)} ⚙</button>
  </div>`;
}
function profileCard() {
  const p = App.progress;
  const level = p.level;
  const lo = levelThresholds[level - 1];
  const hi = levelThresholds[level];
  const frac = hi == null ? 1 : (p.total - lo) / (hi - lo);
  const quote = p.answered === 0 ? 0 : Math.floor((p.correct * 100) / p.answered);
  return `<div class="card strong">
    <div class="row">
      ${ring(frac, [...Palette.primary, Palette.cyan], 96, 9, `<div class="col" style="align-items:center"><div class="faint bold" style="font-size:10px;letter-spacing:1px">STUFE</div><div class="black" style="font-size:34px;line-height:1">${level}</div></div>`)}
      <div style="width:16px"></div>
      <div class="grow col">
        <div class="bold" style="font-size:18px">${esc(levelNames[level - 1].de)}</div>
        <div class="dim t13">${esc(levelNames[level - 1].loc)}</div>
        <div style="height:8px"></div>
        <div class="black" style="color:var(--amber);font-size:22px">${p.total} Punkte</div>
        <div style="height:6px"></div>
        ${progressBar(frac, Palette.primary, 8)}
        <div style="height:4px"></div>
        <div class="faint t12">${hi == null ? 'Höchste Stufe erreicht! · ' + esc(S.maxLevel) : `Noch ${hi - p.total} Punkte bis Stufe ${level + 1} · ${esc(S.pointsLeft(hi - p.total))}`}</div>
      </div>
    </div>
    <div style="height:14px"></div>
    <div class="row">
      ${stat(String(p.answered), 'Antworten\n' + S.answers)}
      ${stat(quote + ' %', 'Trefferquote\n' + S.accuracy)}
      ${stat('🔥 ' + p.bestStreak, 'Beste Serie\n' + S.bestStreak)}
    </div>
    ${p.openMistakes > 0 ? `<div style="height:10px"></div>
      <div class="t13 semi" style="color:var(--pink)">🔁 ${p.openMistakes} Fehler zum Wiederholen · ${esc(S.toReview(p.openMistakes))}</div>
      <div class="faint t12">Falsch beantwortete Fragen kommen öfter wieder, bis sie sitzen.</div>` : ''}
  </div>`;
}
function rewardsTeaser() {
  const p = App.progress;
  const count = badges.filter((b) => p.unlocked(b)).length;
  const next = p.nextBadge();
  const shown = next || badges[badges.length - 1];
  return `<div class="card click" data-act="rewards">
    <div class="row">
      ${medal(shown, next == null, 64)}
      <div style="width:12px"></div>
      <div class="grow col">
        <div class="bold" style="font-size:16px">Auszeichnungen · ${esc(S.rewards)}</div>
        <div class="dim t13">${count} von ${badges.length} freigeschaltet</div>
        ${next ? `<div style="height:6px"></div>${progressBar(p.peak / next.points, Palette.fire, 6)}
          <div class="faint t12" style="padding-top:4px">Nächste: ${esc(next.de)} bei ${next.points} Punkten</div>` : ''}
      </div>
      <div class="dim" style="font-size:30px">›</div>
    </div>
    <div style="height:10px"></div>
    <div class="hscroll gap6">${badges.map((b) => medal(b, p.unlocked(b), 40)).join('')}</div>
  </div>`;
}
function modeGrid(columns) {
  const cards = GameMode.entries.map((m) => {
    const g2 = modeGradient(m);
    return `<div class="card click mode-card" data-act="start" data-mode="${m.name}">
      <div class="row">
        ${iconCircle(m.emoji, g2)}
        <div style="width:14px"></div>
        <div class="grow col">
          <div class="bold" style="font-size:17px">${esc(m.de)}</div>
          <div class="t12 semi" style="color:${g2[0]}">${esc(m.loc)}</div>
          <div class="faint t12" style="padding-top:2px">${esc(m.desc)}</div>
        </div>
        <div class="col" style="align-items:flex-end">
          <div class="faint" style="font-size:10px">Rekord</div>
          <div class="black" style="color:var(--amber);font-size:18px">${App.progress.best(m)}</div>
        </div>
      </div>
    </div>`;
  }).join('');
  return `<div class="mode-grid" style="grid-template-columns:repeat(${columns}, minmax(0, 1fr))">${cards}</div>`;
}
function homeScreen() {
  if (isWide()) {
    return `<div class="wide-row">
      <div class="scroll col gap14" style="flex:0.44 1 0">${homeHeader()}${profileCard()}${placementTeaser()}${rewardsTeaser()}</div>
      <div class="scroll col gap12" style="flex:0.56 1 0">${sectionLabel('Übungsmodus', S.mode)}${modeGrid(2)}</div>
    </div>`;
  }
  return `<div class="scroll col gap14 pad16" style="flex:1">
    ${homeHeader()}${profileCard()}${placementTeaser()}${rewardsTeaser()}${sectionLabel('Übungsmodus', S.mode)}${modeGrid(window.innerWidth >= 600 ? 2 : 1)}<div style="height:8px;flex:none"></div>
  </div>`;
}

/* =====================================================================
   Quiz
   ===================================================================== */
function quizTopBar() {
  const r = App.round, p = App.progress;
  const done = r.index + (r.answered ? 1 : 0);
  const qn = Math.min(r.index + 1, r.total);
  const boost = r.effectiveLevel - p.level;
  return `<div class="col" style="padding:10px 16px;flex:none">
    <div class="row">
      <button class="circle-btn" data-act="exit">✕</button>
      <div style="width:12px"></div>
      <div class="grow col">
        ${progressBar(done / r.total, [...Palette.primary, Palette.cyan])}
        <div class="faint t11" style="padding-top:4px">Frage ${qn} von ${r.total} · ${esc(S.question(qn, r.total))}</div>
      </div>
      <div style="width:12px"></div>
      ${pill('★ ' + r.score, Palette.amber)}
    </div>
    <div class="hscroll gap8" style="padding-top:8px">
      ${pill('🔥 Serie ' + r.streak, r.streak >= 3 ? Palette.pink : Palette.textDim)}
      ${pill('⚡ ' + cefrLabels[r.effectiveLevel - 1] + (r.fixedLevel != null ? ' (fest)' : '') + (boost > 0 ? ` (+${boost} Serie)` : ''), Palette.cyan)}
      ${pill('Σ ' + p.total, Palette.violet)}
    </div>
  </div>`;
}
function levelDots(level) {
  let h = '';
  for (let i = 0; i < MAX_LEVEL; i++) {
    const on = i < level;
    h += `<i style="width:${on ? 9 : 7}px;height:${on ? 9 : 7}px;background:${on ? Palette.amber : 'rgba(255,255,255,.18)'}"></i>`;
  }
  return `<div class="dots">${h}</div>`;
}
function speakRow(text) {
  if (Speaker.missingGerman) {
    return `<button class="btn-ghost" style="width:100%" data-act="voicehelp">🔇 Deutsche Stimme installieren · ${esc(S.installVoice)}</button>`;
  }
  return `<div class="row gap10">
    <button class="btn-ghost speak-btn${Speaker.speaking ? ' active' : ''}" style="flex:1.4 1 0" data-act="speak" data-text="${esc(text)}">🔊 Anhören · ${esc(S.listen)}</button>
    <button class="btn-ghost" style="flex:1 1 0" data-act="speakslow" data-text="${esc(text)}">🐢 Langsam</button>
  </div>`;
}
function questionCard(task, review) {
  let body = '';
  if (task.type === 'choice') {
    body = `<div class="q-prompt">${esc(task.prompt.split('___').join('＿＿＿'))}</div>`;
    const hint = task.hint;
    if (hint != null) body += `<div class="dim t14" style="padding-top:8px">${esc(hint)}</div>`;
    if (task.promptSpeech != null) body += `<div style="height:10px"></div>${speakRow(task.promptSpeech)}`;
  } else if (task.type === 'order') {
    body = `<div class="dim t13">Bilde den deutschen Satz · ${esc(S.buildSentence)}</div>
      <div class="q-prompt" style="padding-top:6px">„${esc(tr(task.ru))}“</div>`;
  } else {
    body = `<div class="dim t13">Finde den Fehler und schreibe den Satz richtig.</div>
      <div class="faint t12">${esc(S.findError)}</div>
      <div class="q-prompt" style="padding-top:10px;user-select:text;-webkit-user-select:text">${esc(task.wrong)}</div>`;
  }
  const anim = App.ui.appeared ? '' : ' appear';
  return `<div class="card strong${anim}" data-qcard>
    <div class="row">${pill(`${task.category.emoji} ${task.category.de} · ${task.category.loc}`, categoryColor(task.category))}<div class="grow"></div>${levelDots(task.level)}</div>
    ${review ? `<div style="height:8px"></div>${pill('🔁 Wiederholung · ' + S.review, Palette.pink)}` : ''}
    <div style="height:14px"></div>
    ${body}
  </div>`;
}
function answerArea(task) {
  const r = App.round;
  if (task.type === 'choice') {
    return `<div class="col gap10">${task.options.map((_, i) => {
      let st = 'idle';
      if (r.answered) st = i === task.correctIndex ? 'correct' : i === r.pickedIndex ? 'wrong' : 'dim';
      const letter = st === 'correct' ? '✓' : st === 'wrong' ? '✗' : 'ABCDEFG'[i];
      return `<button class="opt ${st === 'idle' ? '' : st}" data-act="choice" data-i="${i}" ${st === 'idle' ? '' : 'disabled'}>
        <span class="letter">${letter}</span><span class="txt">${esc(task.optionText(i))}</span></button>`;
    }).join('')}</div>`;
  }
  if (task.type === 'order') {
    const picked = App.ui.picked;
    const color = !r.answered ? Palette.violet : r.lastRight ? Palette.green : Palette.red;
    const chip = (idx, filled) => `<button class="chip" data-act="${filled ? 'unpick' : 'pick'}" data-i="${idx}" ${r.answered && filled ? 'disabled' : ''}
      style="${filled ? `background:${hexA(color, 0.28)};border-color:${hexA(color, 0.8)}` : ''}">${esc(task.chunks[idx])}</button>`;
    let h = `<div class="col gap12"><div class="card">
      <div class="faint t12">Dein Satz · ${esc(S.yourSentence)}</div><div style="height:8px"></div>
      ${picked.length === 0 ? '<div class="faint t14" style="min-height:40px">Tippe die Satzteile in der richtigen Reihenfolge an …</div>' : ''}
      <div class="flow">${picked.map((idx) => chip(idx, true)).join('')}</div></div>`;
    if (!r.answered) {
      h += `<div class="flow">${task.chunks.map((_, idx) => idx).filter((idx) => !picked.includes(idx)).map((idx) => chip(idx, false)).join('')}</div>
        <div class="row gap10">
          <button class="btn-ghost" style="flex:1 1 0" data-act="orderreset">↺ Neu · ${esc(S.reset)}</button>
          <button class="btn-grad" style="flex:1.6 1 0;background:${linGrad(Palette.primary)}" data-act="ordercheck" ${picked.length === task.chunks.length ? '' : 'disabled'}>Prüfen · ${esc(S.check)}</button>
        </div>`;
    }
    return h + '</div>';
  }
  // Rechtschreibung
  let h = `<div class="col gap10${App.ui.shake ? ' shake' : ''}" data-spellwrap>
    <div class="spell-field${r.answered ? ' done' : ''}">
      <label for="spellInput">Korrigierter Satz · ${esc(S.correctedSentence)}</label>
      <textarea id="spellInput" rows="1" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" enterkeyhint="done" ${r.answered ? 'disabled' : ''}>${esc(App.ui.spellText)}</textarea>
    </div>`;
  if (!r.answered) {
    if (r.spellAttempts > 0) {
      h += `<div class="card expand" style="padding:12px">
        <div class="bold t14" style="color:var(--red)">✗ Noch nicht richtig — versuch es noch einmal! (Fehlversuche: ${r.spellAttempts})</div>
        <div class="dim t13">${esc(S.notYet)}</div></div>`;
    }
    h += `<div class="row gap10">
      <button class="btn-ghost" style="flex:1 1 0" data-act="spellreset">↺ Original</button>
      <button class="btn-grad" style="flex:1.6 1 0;background:${linGrad(Palette.primary)}" data-act="spellcheck">Prüfen · ${esc(S.check)}</button>
    </div>`;
  }
  return h + '</div>';
}
function feedbackCard(task) {
  const r = App.round;
  if (!r.answered) return '';
  const right = r.lastRight;
  const spellRetry = task.type === 'spell' && r.spellAttempts > 0;
  const title = spellRetry ? 'Geschafft! · ' + S.done
    : right ? ['Richtig!', 'Super!', 'Klasse!', 'Genau!'][r.index % 4] + ' · ' + S.praise[r.index % 4]
      : 'Leider falsch · ' + S.wrong;
  const sub = spellRetry ? `Nach ${r.spellAttempts} Fehlversuch(en) — keine Punkte für diese Aufgabe`
    : r.lastAwarded >= 0 ? `+${r.lastAwarded} Punkte` + (r.streak >= 2 ? `  ·  🔥 ${r.streak}er-Serie` : '') +
      (r.lastStreakBonus > 0 ? `\n🎁 Serienbonus +${r.lastStreakBonus} · ${S.streakBonus(r.lastStreakBonus)}` : '')
      : `${r.lastAwarded} Punkte · Serie verloren`;
  const last = r.index === r.total - 1;
  const fbAnim = App.ui.fbShown ? '' : ' expand';
  return `<div class="card strong${fbAnim}" data-feedback>
    <div class="row">
      ${iconCircle(right ? '✓' : '✗', right ? Palette.success : Palette.error, 46)}
      <div style="width:12px"></div>
      <div class="grow col">
        <div class="black" style="font-size:19px;color:${right ? Palette.green : Palette.red}">${esc(title)}</div>
        <div class="dim t13" style="white-space:pre-line">${esc(sub)}</div>
      </div>
    </div>
    <div style="height:14px"></div>
    <div class="faint t12">Richtig ist · ${esc(S.correctIs)}</div>
    <div class="bold" style="font-size:18px;line-height:25px;padding-top:2px;overflow-wrap:anywhere;user-select:text;-webkit-user-select:text">${esc(task.solution)}</div>
    <div style="height:12px"></div>
    ${speakRow(task.speech)}
    <div style="height:10px"></div>
    <div class="row gap10">
      <button class="btn-ghost${App.ui.showDe ? ' active' : ''}" style="flex:1 1 0" data-act="showde">🇩🇪 Erklärung</button>
      <button class="btn-ghost${App.ui.showLoc ? ' active' : ''}" style="flex:1 1 0" data-act="showloc">${AppLang.current.flag} ${esc(S.explanation)}</button>
    </div>
    ${App.ui.showDe ? `<div class="expl-box${App.ui.animDe ? ' expand' : ''}"><div class="lbl">Deutsch</div><div class="txt">${esc(task.explanation.de)}</div></div>` : ''}
    ${App.ui.showLoc ? `<div class="expl-box${App.ui.animLoc ? ' expand' : ''}"><div class="lbl">${esc(AppLang.current.nativeName)}</div><div class="txt">${esc(task.explanation.loc)}</div></div>` : ''}
    <div style="height:14px"></div>
    <button class="btn-grad" style="width:100%;background:${linGrad(right ? Palette.success : Palette.primary)}" data-act="next">${last ? `Ergebnis ansehen · ${esc(S.result)} 🏁` : `Weiter · ${esc(S.next)}  ›`}</button>
  </div>`;
}
function quizScreen() {
  const r = App.round, task = r.task;
  let body;
  if (isWide()) {
    body = `<div class="row gap16" style="flex:1;min-height:0;align-items:stretch;padding:0 16px">
      <div class="scroll grow" style="padding-bottom:16px" data-scroll="left">${questionCard(task, r.isReview)}</div>
      <div class="scroll grow col gap12" style="padding-bottom:16px" data-scroll="main">${answerArea(task)}${feedbackCard(task)}</div>
    </div>`;
  } else {
    body = `<div class="scroll col gap12" style="flex:1;padding:0 16px 16px" data-scroll="main">
      ${questionCard(task, r.isReview)}${answerArea(task)}${feedbackCard(task)}</div>`;
  }
  return `<div class="screen">${quizTopBar()}${body}</div>${r.celebration ? celebrationOverlay(r.celebration) : ''}`;
}

/* =====================================================================
   Feier (neue Auszeichnung / neue Stufe)
   ===================================================================== */
function celebrationOverlay(cel) {
  const wide = isWide();
  const medalSize = wide ? 120 : 170;
  const badge = cel.badges.length ? cel.badges[cel.badges.length - 1] : null;
  const center = badge ? medal(badge, true, medalSize)
    : ring(1, [...Palette.fire, Palette.pink], medalSize, 12, `<div class="col" style="align-items:center"><div class="dim bold t12">STUFE</div><div class="black" style="font-size:56px;line-height:1">${cel.newLevel}</div></div>`);
  let h = `<div class="overlay" data-overlay><canvas data-confetti></canvas><div class="content">
    <div style="position:relative;width:${medalSize * 1.7}px;height:${medalSize * 1.7}px;display:flex;align-items:center;justify-content:center;flex:none">
      ${sunburst(badge ? badge.colors[badge.colors.length - 1] : Palette.amber)}
      <div class="pop" style="position:relative">${center}</div>
    </div>`;
  if (badge) {
    h += `<div class="black t14" style="color:var(--amber);letter-spacing:2px">NEUE AUSZEICHNUNG!</div>
      <div class="dim t13">${esc(S.newBadge)}</div><div style="height:6px"></div>
      ${gradTitle(badge.de, [...badge.colors.slice().reverse(), '#fff'], 30)}
      <div class="semi" style="font-size:17px">${esc(badge.loc)}</div>
      <div class="faint t13" style="padding-top:4px">für ${badge.points} Punkte · ${esc(S.forPoints(badge.points))}</div>
      ${cel.badges.length > 1 ? `<div class="dim t13">+ ${cel.badges.length - 1} weitere Auszeichnung(en)</div>` : ''}`;
  } else {
    h += `<div class="black" style="color:var(--amber);font-size:16px;letter-spacing:2px">AUFGESTIEGEN!</div>
      <div class="dim t13">${esc(S.newLevel)}</div>`;
  }
  if (cel.newLevel) {
    const lvl = cel.newLevel;
    h += `<div style="height:14px"></div><div class="card strong" style="width:calc(100% - 16px);text-align:left">
      <div class="bold" style="font-size:16px">⬆ Stufe ${lvl}: ${esc(levelNames[lvl - 1].de)}</div>
      <div class="dim t13">${esc(S.levelN(lvl, levelNames[lvl - 1].loc))}</div>
      <div class="faint t13" style="padding-top:6px;white-space:pre-line">Die Aufgaben werden jetzt schwieriger — und bringen mehr Punkte!\n${esc(S.harder)}</div></div>`;
  }
  h += `<div style="height:20px"></div><button class="btn-grad" style="width:calc(100% - 16px);background:${linGrad(Palette.primary)}" data-act="celebrated">Weiter · ${esc(S.next)}</button>
    </div></div>`;
  return h;
}

/* =====================================================================
   Ergebnis
   ===================================================================== */
function finishScreen() {
  const r = App.round, p = App.progress;
  const { oldBest, newBest } = App.finish;
  const accuracy = r.correctCount / r.total;
  const pct = Math.floor(accuracy * 100);
  const rateIndex = pct >= 90 ? 0 : pct >= 70 ? 1 : pct >= 50 ? 2 : 3;
  const rateDe = ['Perfekt! 🏆', 'Sehr gut! 👏', 'Gut gemacht! 💪', 'Dranbleiben! 📚'][rateIndex];
  const summary = `<div class="card strong"><div class="col" style="align-items:center">
    ${ring(accuracy, [...Palette.success, Palette.cyan], 150, 12, `<div class="col" style="align-items:center"><div class="black" style="font-size:34px;line-height:1.1">${pct} %</div><div class="faint t11">Treffer · ${esc(S.accuracy.toLowerCase())}</div></div>`)}
    <div style="height:12px"></div>
    <div class="black" style="font-size:24px">${rateDe}</div>
    <div class="dim t14">${esc(S.rates[rateIndex])}</div>
    <div style="height:14px"></div>
    <div class="row" style="width:100%">
      <div class="stat"><div class="v" data-counter="${r.score}">0</div><div class="l">Punkte\n${esc(S.points)}</div></div>
      ${stat(`${r.correctCount}/${r.total}`, 'Richtig\n' + S.right)}
      ${stat('🔥 ' + r.bestStreak, 'Beste Serie\n' + S.streak)}
    </div></div></div>`;
  let details = '<div class="col gap12">';
  if (r.roundBonus > 0) {
    details += `<div class="card strong"><div class="black" style="color:var(--amber);font-size:17px">${r.correctCount === r.total ? '🌟 Perfekte Runde! ' : '🎁 '}Rundenbonus +${r.roundBonus} Punkte</div>
      <div class="dim t13">${esc(S.roundBonus(r.roundBonus))}</div></div>`;
  }
  details += `<div class="card">
    <div class="bold" style="font-size:16px;color:${newBest ? Palette.amber : Palette.text}">${newBest ? `🎉 Neuer Rekord im Modus ${esc(r.mode.de)}!` : `Rekord ${esc(r.mode.de)}: ${Math.max(oldBest, r.score)} Punkte`}</div>
    <div class="dim t13">${esc(newBest ? S.newRecord : S.modeRecord)}</div>
    <div style="height:8px"></div>
    <div class="semi t14" style="color:var(--cyan)">Σ ${p.total} Punkte · Stufe ${p.level} (${esc(levelNames[p.level - 1].de)})</div></div>`;
  if (r.earnedBadges.length) {
    details += `<div class="card"><div class="bold" style="color:var(--amber)">Neue Auszeichnungen · ${esc(S.newBadges)}</div><div style="height:10px"></div>
      <div class="hscroll gap14">${r.earnedBadges.map((b) => `<div class="col" style="align-items:center;flex:none">${medal(b, true, 72)}<div class="semi t12">${esc(b.de)}</div></div>`).join('')}</div></div>`;
  }
  details += `<button class="btn-grad" style="width:100%;background:${linGrad(Palette.primary)}" data-act="replay">Nochmal spielen · ${esc(S.again)}</button>
    <button class="btn-ghost" style="width:100%" data-act="menu">Zum Menü · ${esc(S.menu)}</button></div>`;
  if (isWide()) {
    return `<div class="row gap16" style="flex:1;min-height:0;align-items:stretch;padding:16px">
      <div class="scroll grow">${summary}</div><div class="scroll grow">${details}</div></div>`;
  }
  return `<div class="scroll col gap12 pad16" style="flex:1">${gradTitle('Runde geschafft!', [...Palette.primary, Palette.cyan], 28)}${summary}${details}</div>`;
}

/* =====================================================================
   Auszeichnungen
   ===================================================================== */
function rewardsScreen() {
  const p = App.progress;
  const count = badges.filter((b) => p.unlocked(b)).length;
  return `<div class="screen">
    <div class="row" style="padding:16px;flex:none">
      <button class="circle-btn" data-act="back">‹</button><div style="width:14px"></div>
      <div class="col">${gradTitle('Auszeichnungen', [...Palette.fire, Palette.pink], 26)}<div class="dim t13">${esc(S.rewards)} · ${count} von ${badges.length} freigeschaltet</div></div>
    </div>
    <div class="scroll" style="flex:1"><div class="badge-grid">${badges.map((b) => {
      const un = p.unlocked(b);
      return `<div class="card${un ? ' strong' : ''}" style="padding:14px">
        <div style="display:flex;justify-content:center">${medal(b, un, 96)}</div>
        <div style="height:6px"></div>
        <div class="bold t15" style="text-align:center;color:${un ? '#fff' : Palette.textDim}">${esc(b.de)}</div>
        <div class="faint t12" style="text-align:center">${esc(b.loc)}</div>
        <div style="height:8px"></div>
        ${un ? `<div style="display:flex;justify-content:center">${pill('✓ ' + b.points + ' Punkte', Palette.green)}</div>`
          : `${progressBar(p.peak / b.points, Palette.fire, 6)}<div class="faint t11" style="text-align:center;padding-top:4px">noch ${b.points - p.peak} Punkte</div>`}
      </div>`;
    }).join('')}</div></div>
  </div>`;
}

/* =====================================================================
   Einstellungen
   ===================================================================== */
function selectOption(icon, title, subtitle, selected, act, val, iconSize = 28) {
  return `<button class="select-opt${selected ? ' sel' : ''}" data-act="${act}" data-val="${val}">
    <span class="ic" style="font-size:${iconSize}px">${esc(icon)}</span>
    <span class="grow col"><span class="bold" style="font-size:18px">${esc(title)}</span><span class="faint t12">${esc(subtitle)}</span></span>
    ${selected ? '<span class="black" style="color:var(--green);font-size:22px">✓</span>' : ''}
  </button>`;
}
function settingsScreen() {
  const diff = AppDifficulty.fixed;
  return `<div class="scroll pad16" style="flex:1">
    <div class="row"><button class="circle-btn" data-act="back">‹</button><div style="width:14px"></div>
      <div class="col">${gradTitle('Einstellungen', [...Palette.primary, Palette.cyan], 26)}<div class="dim t13">${esc(S.settings)}</div></div></div>
    <div style="height:18px"></div>
    ${sectionLabel('Schwierigkeitsgrad', S.difficulty)}
    <div class="card" style="padding:14px">
      <div class="t14" style="line-height:20px">Wähle ein festes Niveau — dann kommen alle Aufgaben aus dieser Stufe. Höhere Stufen bringen mehr Punkte.</div>
      <div class="dim t13" style="line-height:19px;padding-top:6px">${esc(S.difficultyHint)}</div>
    </div>
    <div style="height:12px"></div>
    <div class="col gap10">
      ${selectOption('✨', 'Automatisch', 'nach Punkten · ' + S.difficultyAuto, diff == null, 'diff', 0)}
      ${cefrLabels.map((label, i) => selectOption(label, levelNames[i].de, levelNames[i].loc, diff === i + 1, 'diff', i + 1, 18)).join('')}
    </div>
    <div style="height:22px"></div>
    ${sectionLabel('Übersetzungssprache', S.translationLang)}
    <div class="card" style="padding:14px">
      <div class="t14" style="line-height:20px">Du lernst Deutsch. Übersetzungen, Hinweise und Erklärungen erscheinen in der gewählten Sprache.</div>
      <div class="dim t13" style="line-height:19px;padding-top:6px">${esc(S.settingsHint)}</div>
    </div>
    <div style="height:12px"></div>
    <div class="col gap10">${LangEntries.map((l) => selectOption(l.flag, l.nativeName, l.germanName, l === AppLang.current, 'lang', l.name)).join('')}</div>
    <div style="height:16px"></div>
  </div>`;
}

/* =====================================================================
   Rendern & Ereignisse
   ===================================================================== */
let stopConfetti = null;
function render(opts = {}) {
  const root = App.root;
  const prevScroll = {};
  root.querySelectorAll('[data-scroll]').forEach((el) => { prevScroll[el.dataset.scroll] = el.scrollTop; });
  const homeScroll = root.querySelector('.scroll');
  const keepTop = homeScroll ? homeScroll.scrollTop : 0;
  if (stopConfetti) { stopConfetti(); stopConfetti = null; }
  let html;
  switch (App.screen) {
    case Screen.PLAYING: html = quizScreen(); break;
    case Screen.FINISHED: html = finishScreen(); break;
    case Screen.REWARDS: html = rewardsScreen(); break;
    case Screen.SETTINGS: html = settingsScreen(); break;
    case Screen.PLACEMENT: html = placementScreen(); break;
    default: html = homeScreen();
  }
  root.innerHTML = `<div class="screen">${html}</div>`;
  animateRings(root);
  // Scroll-Positionen erhalten (nur Neuaufbau, kein Seitenwechsel)
  if (!opts.scrollTop) {
    root.querySelectorAll('[data-scroll]').forEach((el) => { if (prevScroll[el.dataset.scroll] != null) el.scrollTop = prevScroll[el.dataset.scroll]; });
    if (App.screen !== Screen.PLAYING) { const sc = root.querySelector('.scroll'); if (sc) sc.scrollTop = keepTop; }
  }
  const cv = root.querySelector('[data-confetti]');
  if (cv) stopConfetti = startConfetti(cv);
  const counter = root.querySelector('[data-counter]');
  if (counter) animateCounter(counter, parseInt(counter.dataset.counter, 10));
  const ta = root.querySelector('#spellInput');
  if (ta) { autoGrow(ta); }
  if (App.screen === Screen.PLAYING) { App.ui.appeared = true; if (App.round.answered) App.ui.fbShown = true; }
}
function animateCounter(el, target) {
  const t0 = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - t0) / 1200);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = String(Math.trunc(target * eased));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
function autoGrow(ta) { ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 'px'; }

/** Nach der Antwort automatisch zur Erklärung scrollen; bei neuer Frage nach oben. */
function autoScrollAfterAnswer() {
  setTimeout(() => {
    const sc = App.root.querySelector('[data-scroll="main"]');
    if (sc) sc.scrollTo({ top: sc.scrollHeight, behavior: 'smooth' });
  }, 250);
}
function scrollQuizTop() { App.root.querySelectorAll('[data-scroll]').forEach((el) => { el.scrollTop = 0; }); }

let toastTimer = 0;
function toast(msg) {
  document.querySelectorAll('.toast').forEach((el) => el.remove());
  const d = document.createElement('div');
  d.className = 'toast';
  d.textContent = msg;
  document.body.appendChild(d);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => d.remove(), 6000);
}

function nextTask() {
  Speaker.stop();
  App.round.advance();
  if (App.round.isFinished()) { go(Screen.FINISHED); return; }
  resetTaskUi();
  render({ scrollTop: true });
  scrollQuizTop();
}

function checkSpell() {
  const r = App.round;
  if (r.answered) return;
  const ta = App.root.querySelector('#spellInput');
  if (ta) App.ui.spellText = ta.value;
  if (r.answerSpell(App.ui.spellText)) {
    if (ta) ta.blur();
    render();
    autoScrollAfterAnswer();
  } else {
    App.ui.shake = true;
    render();
    App.ui.shake = false;
  }
}

function onClick(ev) {
  const el = ev.target.closest('[data-act]');
  if (!el || el.disabled) return;
  const act = el.dataset.act;
  const r = App.round;
  switch (act) {
    case 'settings': go(Screen.SETTINGS); break;
    case 'rewards': go(Screen.REWARDS); break;
    case 'placement': App.placement = null; go(Screen.PLACEMENT); break;
    case 'pstart': App.placement = new PlacementTest(); App.ui.appeared = false; render({ scrollTop: true }); scrollQuizTop(); break;
    case 'pchoice': placementAnswer(parseInt(el.dataset.i, 10)); render({ scrollTop: true }); scrollQuizTop(); break;
    case 'papply': AppDifficulty.set(parseInt(el.dataset.val, 10) || null); render(); break;
    case 'start': start(GameMode[el.dataset.mode]); break;
    case 'back': case 'menu': backHome(); break;
    case 'exit': Speaker.stop(); backHome(); break;
    case 'replay': start(r.mode); break;
    case 'choice': if (!r.answered) { r.answerChoice(parseInt(el.dataset.i, 10)); render(); autoScrollAfterAnswer(); } break;
    case 'pick': if (!r.answered) { App.ui.picked.push(parseInt(el.dataset.i, 10)); render(); } break;
    case 'unpick': if (!r.answered) { const i = parseInt(el.dataset.i, 10); App.ui.picked = App.ui.picked.filter((x) => x !== i); render(); } break;
    case 'orderreset': App.ui.picked = []; render(); break;
    case 'ordercheck': if (!r.answered && App.ui.picked.length === r.task.chunks.length) { r.answerOrder(App.ui.picked.map((i) => r.task.chunks[i])); render(); autoScrollAfterAnswer(); } break;
    case 'spellreset': App.ui.spellText = r.task.wrong; render(); break;
    case 'spellcheck': checkSpell(); break;
    case 'speak': Speaker.speak(el.dataset.text); break;
    case 'speakslow': Speaker.speak(el.dataset.text, true); break;
    case 'voicehelp': toast('Keine deutsche Stimme gefunden. Installiere in den Systemeinstellungen (Sprache / Text-in-Sprache bzw. Bedienungshilfen › Gesprochene Inhalte) eine deutsche Stimme und lade die Seite neu. · ' + S.installVoice); break;
    case 'showde': App.ui.showDe = !App.ui.showDe; App.ui.animDe = App.ui.showDe; App.ui.animLoc = false; render(); App.ui.animDe = false; break;
    case 'showloc': App.ui.showLoc = !App.ui.showLoc; App.ui.animLoc = App.ui.showLoc; App.ui.animDe = false; render(); App.ui.animLoc = false; break;
    case 'next': nextTask(); break;
    case 'celebrated': r.celebration = null; render(); break;
    case 'diff': AppDifficulty.set(parseInt(el.dataset.val, 10) || null); render(); break;
    case 'lang': AppLang.set(Lang[el.dataset.val]); document.documentElement.lang = 'de'; render(); break;
  }
}

function boot() {
  AppLang.load();
  AppDifficulty.load();
  PlacementResult.load();
  App.progress = new Progress();
  App.root = document.getElementById('app');
  drawBlobs();
  Speaker.onChange = () => {
    // nur den Zustand der Vorlese-Knöpfe aktualisieren (kein Neuaufbau während der Eingabe)
    if (App.screen !== Screen.PLAYING) return;
    const needVoiceBtn = Speaker.missingGerman !== !!App.root.querySelector('[data-act="voicehelp"]') && App.root.querySelector('[data-act="speak"],[data-act="voicehelp"]');
    if (needVoiceBtn) { render(); return; }
    App.root.querySelectorAll('.speak-btn').forEach((b) => b.classList.toggle('active', Speaker.speaking));
  };
  Speaker.init();
  App.root.addEventListener('click', onClick);
  App.root.addEventListener('input', (ev) => {
    if (ev.target.id === 'spellInput') { App.ui.spellText = ev.target.value; autoGrow(ev.target); }
  });
  App.root.addEventListener('keydown', (ev) => {
    if (ev.target.id === 'spellInput' && ev.key === 'Enter') { ev.preventDefault(); checkSpell(); }
  });
  let lastWide = isWide();
  window.addEventListener('resize', () => {
    drawBlobs();
    const wide = isWide();
    // Neu aufbauen bei Wechsel Hoch-/Querformat, aber nicht wenn die Bildschirmtastatur aufgeht
    if (wide !== lastWide && document.activeElement?.id !== 'spellInput') { lastWide = wide; render(); }
  });
  render({ scrollTop: true });
}
document.addEventListener('DOMContentLoaded', boot);
