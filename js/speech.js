'use strict';
// Vorlesen mit der Sprachausgabe des Browsers (Web Speech API), Fokus Deutsch (Port von Speech.kt).
// Wählt die menschlichste verfügbare deutsche Stimme: bevorzugt de-DE, neuronale/„natural“ Stimmen und lokale (offline) Stimmen.

const Speaker = {
  ready: false,
  missingGerman: false,
  speaking: false,
  voice: null,
  onChange: null,

  init() {
    if (!('speechSynthesis' in window)) { this.missingGerman = true; return; }
    const pick = () => {
      const voices = speechSynthesis.getVoices() || [];
      if (!voices.length) return false;
      const german = voices.filter((vo) => (vo.lang || '').toLowerCase().replace('_', '-').startsWith('de'));
      if (!german.length) { this.missingGerman = true; this.ready = false; this.changed(); return true; }
      german.sort((a, b) => this.score(b) - this.score(a));
      this.voice = german[0];
      this.missingGerman = false;
      this.ready = true;
      this.changed();
      return true;
    };
    if (!pick()) {
      speechSynthesis.addEventListener('voiceschanged', pick);
      // Manche Browser liefern Stimmen verzögert; ohne Ereignis nach kurzer Zeit erneut prüfen.
      setTimeout(() => { if (!pick()) { this.missingGerman = true; this.changed(); } }, 2500);
    }
  },

  score(vo) {
    const name = (vo.name || '').toLowerCase();
    let sc = 300;
    if (/de[-_]de/i.test(vo.lang)) sc += 60;
    if (/neural|natural|wavenet|studio|premium|enhanced|online/.test(name)) sc += 80;
    if (name.includes('google')) sc += 40;
    if (vo.localService) sc += 30;
    if (/compact|legacy|espeak/.test(name)) sc -= 100;
    return sc;
  },

  changed() { if (this.onChange) this.onChange(); },

  /** Liest deutschen Text vor; langsam = deutlich langsamer zum Mitsprechen. */
  speak(text, slow = false) {
    if (!this.ready) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.voice = this.voice;
    u.lang = this.voice ? this.voice.lang : 'de-DE';
    u.rate = slow ? 0.65 : 0.92;
    u.pitch = 1.0;
    u.onstart = () => { this.speaking = true; this.changed(); };
    u.onend = u.onerror = () => { this.speaking = false; this.changed(); };
    speechSynthesis.speak(u);
  },

  stop() {
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    if (this.speaking) { this.speaking = false; this.changed(); }
  },
};
