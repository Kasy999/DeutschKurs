'use strict';
// Gezeichnete Elemente: Medaille, Ring, Fortschritt, Konfetti, Strahlenkranz (Port von Rewards.kt / Ui.kt).

const Palette = {
  violet: '#8B5CF6', pink: '#EC4899', cyan: '#22D3EE', green: '#34D399', red: '#FB7185', amber: '#FBBF24',
  text: '#fff', textDim: 'rgba(255,255,255,.72)', textFaint: 'rgba(255,255,255,.5)',
  primary: ['#8B5CF6', '#EC4899'], cool: ['#22D3EE', '#6366F1'], success: ['#34D399', '#059669'],
  error: ['#FB7185', '#E11D48'], fire: ['#FBBF24', '#F97316'],
};
const modeGradient = (m) => ({
  MIX: ['#F472B6', '#8B5CF6'], VOKABELN: ['#22D3EE', '#3B82F6'], VERBEN: ['#FBBF24', '#F97316'], FAELLE: ['#2DD4BF', '#0F766E'],
  ZEITEN: ['#FDBA74', '#DC2626'], KONJUNKTIV: ['#C4B5FD', '#DB2777'], GRAMMATIK: ['#34D399', '#0EA5E9'],
  SATZBAU: ['#A78BFA', '#6366F1'], RECHTSCHREIBUNG: ['#FB7185', '#EC4899'],
}[m.name]);
const categoryColor = (cat) => ({
  VOKABEL: Palette.cyan, ARTIKEL: Palette.cyan, PLURAL: Palette.cyan, VERB: Palette.amber, PERFEKT: Palette.amber, ZEIT: Palette.amber,
  KASUS: '#2DD4BF', REFLEXIV: '#60A5FA', KONJ: '#C4B5FD', GRAMMATIK: Palette.green, SATZBAU: '#A78BFA', SCHREIBUNG: Palette.pink,
}[cat.name]);

const esc = (x) => String(x).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const hexA = (hex, a) => {
  if (hex.startsWith('rgb')) return withAlpha(hex, a);
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};
const linGrad = (colors, deg = 90) => `linear-gradient(${deg}deg, ${colors.join(', ')})`;
let _uid = 0;
const uid = () => 'g' + (++_uid);

function pill(text, color) {
  return `<span class="pill" style="color:${color};background:${hexA(color, 0.18)};border:1px solid ${hexA(color, 0.45)}">${esc(text)}</span>`;
}
function progressBar(p, colors, h = 10) {
  const v = Math.max(0, Math.min(1, p)) * 100;
  return `<div class="progress" style="height:${h}px"><i style="width:${v}%;background:${linGrad(colors)}"></i></div>`;
}
function gradTitle(text, colors, size = 34) {
  return `<div class="grad-title" style="font-size:${size}px;background-image:${linGrad(colors, 120)}">${esc(text)}</div>`;
}
function iconCircle(emoji, colors, size = 52) {
  return `<div class="icon-circle" style="width:${size}px;height:${size}px;background:${linGrad(colors, 135)};font-size:${size * 0.45}px">${esc(emoji)}</div>`;
}
function sectionLabel(de, ru) { return `<div class="section-label"><b>${esc(de)}</b><span>  ·  ${esc(ru)}</span></div>`; }
function stat(value, label) { return `<div class="stat"><div class="v">${esc(value)}</div><div class="l">${esc(label)}</div></div>`; }

/** Ring mit Verlauf (SVG). */
function ring(progress, colors, size, stroke, inner) {
  const id = uid();
  const p = Math.max(0, Math.min(1, progress));
  const rr = (size - stroke) / 2;
  const circ = 2 * Math.PI * rr;
  const stops = colors.map((cc, i) => `<stop offset="${colors.length === 1 ? 0 : (i / (colors.length - 1)) * 100}%" stop-color="${cc}"/>`).join('');
  return `<div style="position:relative;width:${size}px;height:${size}px;flex:none">
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="position:absolute;inset:0">
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">${stops}</linearGradient></defs>
      <circle cx="${size / 2}" cy="${size / 2}" r="${rr}" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="${stroke}"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${rr}" fill="none" stroke="url(#${id})" stroke-width="${stroke}" stroke-linecap="round"
        stroke-dasharray="${circ}" stroke-dashoffset="${circ}" transform="rotate(-90 ${size / 2} ${size / 2})" data-ring="${circ * (1 - p)}"
        style="transition:stroke-dashoffset .9s ease-out;${p === 0 ? 'opacity:0' : ''}"/>
    </svg>
    <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${inner}</div>
  </div>`;
}
/** Animiert Ringe nach dem Einfügen ins DOM. */
function animateRings(root) {
  requestAnimationFrame(() => requestAnimationFrame(() => {
    root.querySelectorAll('[data-ring]').forEach((el) => { el.style.strokeDashoffset = el.dataset.ring; });
  }));
}

const lockedColors = [col(0xFF6B7280), col(0xFF1F2937)];
/** Gezeichnete Medaille mit Band, Rosette, Verlauf und Glanz (SVG, Koordinaten 0–100). */
function medal(badge, unlocked, size) {
  const W = 100, H = 100, cx = W / 2, cy = H * 0.58, R = W * 0.34;
  const colors = unlocked ? badge.colors : lockedColors;
  const ribbon = unlocked ? badge.ribbon : col(0xFF374151);
  const id1 = uid(), id2 = uid(), id3 = uid();
  const strip = (x0, x1, bx0, bx1, fill) => `<path d="M${x0},0 L${x1},0 L${bx1},${cy} L${bx0},${cy} Z" fill="${fill}"/>`;
  let ros = '';
  const spikes = 20;
  for (let i = 0; i < spikes * 2; i++) {
    const ang = (Math.PI * i) / spikes;
    const rad = i % 2 === 0 ? R * 1.12 : R * 0.98;
    ros += (i === 0 ? 'M' : 'L') + (cx + rad * Math.cos(ang)).toFixed(2) + ',' + (cy + rad * Math.sin(ang)).toFixed(2);
  }
  ros += 'Z';
  const grad = (id, cols) => `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${cx - R}" y1="${cy - R}" x2="${cx + R}" y2="${cy + R}">${cols.map((cc, i) => `<stop offset="${cols.length === 1 ? 0 : i / (cols.length - 1)}" stop-color="${cc}"/>`).join('')}</linearGradient>`;
  const first = colors[0];
  // Glanzbogen: Start 200°, 70°
  const ar = R * 0.66;
  const a0 = (200 * Math.PI) / 180, a1 = (270 * Math.PI) / 180;
  const arc = `M${(cx + ar * Math.cos(a0)).toFixed(2)},${(cy + ar * Math.sin(a0)).toFixed(2)} A${ar},${ar} 0 0 1 ${(cx + ar * Math.cos(a1)).toFixed(2)},${(cy + ar * Math.sin(a1)).toFixed(2)}`;
  const svg = `<svg viewBox="0 0 100 100" width="${size}" height="${size}" style="position:absolute;inset:0">
    <defs>${grad(id1, colors.slice().reverse())}${grad(id2, colors)}
      <radialGradient id="${id3}" gradientUnits="userSpaceOnUse" cx="${cx - R * 0.3}" cy="${cy - R * 0.35}" r="${R * 1.1}">
        <stop offset="0" stop-color="rgba(255,255,255,.55)"/><stop offset=".5" stop-color="${hexA(first, 0.2)}"/><stop offset="1" stop-color="rgba(0,0,0,0)"/>
      </radialGradient></defs>
    ${strip(W * 0.22, W * 0.40, cx - R * 0.15, cx + R * 0.25, ribbon)}
    ${strip(W * 0.60, W * 0.78, cx - R * 0.25, cx + R * 0.15, hexA(ribbon, 0.85))}
    ${strip(W * 0.29, W * 0.33, cx - R * 0.02, cx + R * 0.06, 'rgba(255,255,255,.25)')}
    ${strip(W * 0.67, W * 0.71, cx - R * 0.06, cx + R * 0.02, 'rgba(255,255,255,.25)')}
    <path d="${ros}" fill="url(#${id1})"/>
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#${id2})"/>
    <circle cx="${cx}" cy="${cy}" r="${R * 0.8}" fill="url(#${id3})"/>
    <circle cx="${cx}" cy="${cy}" r="${R * 0.84}" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="${R * 0.05}"/>
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="${R * 0.04}"/>
    <path d="${arc}" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="${R * 0.07}"/>
  </svg>`;
  return `<div style="position:relative;width:${size}px;height:${size}px;flex:none">${svg}
    <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding-top:${size * 0.16}px;font-size:${size * 0.26}px;line-height:1;${unlocked ? '' : 'opacity:.7'}">${unlocked ? badge.emoji : '🔒'}</div></div>`;
}

/** Rotierender Strahlenkranz hinter einer neuen Medaille. */
function sunburst(color) {
  const id = uid(), id2 = uid();
  let rays = '';
  const n = 16;
  for (let i = 0; i < n; i++) {
    const a0 = (2 * Math.PI * i) / n, a1 = a0 + Math.PI / n;
    rays += `<path d="M50,50 L${50 + 50 * Math.cos(a0)},${50 + 50 * Math.sin(a0)} L${50 + 50 * Math.cos(a1)},${50 + 50 * Math.sin(a1)} Z" fill="url(#${id})"/>`;
  }
  return `<div class="sunburst-pulse"><svg class="sunburst" viewBox="0 0 100 100" width="100%" height="100%">
    <defs><radialGradient id="${id}" cx="50" cy="50" r="50" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${hexA(color, 0.55)}"/><stop offset="1" stop-color="rgba(0,0,0,0)"/></radialGradient>
    <radialGradient id="${id2}" cx="50" cy="50" r="30" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="rgba(255,255,255,.35)"/><stop offset="1" stop-color="rgba(255,255,255,0)"/></radialGradient></defs>
    ${rays}<circle cx="50" cy="50" r="30" fill="url(#${id2})"/></svg></div>`;
}

const confettiColors = [col(0xFFF472B6), col(0xFFFBBF24), col(0xFF34D399), col(0xFF60A5FA), col(0xFFA78BFA), col(0xFFF87171), col(0xFF22D3EE)];
/** Fallendes Konfetti (ca. 4 Sekunden, dann Wiederholung). */
function startConfetti(canvas, count = 90) {
  const ctx = canvas.getContext('2d');
  const pieces = Array.from({ length: count }, () => ({
    x: Math.random(), speed: 0.5 + Math.random() * 0.8, drift: Math.random() * 2 - 1,
    rot: Math.random() * 720 - 360, size: 6 + Math.random() * 10, color: confettiColors[randInt(confettiColors.length)], delay: Math.random() * 0.5,
  }));
  let start = performance.now();
  let raf = 0;
  const dpr = window.devicePixelRatio || 1;
  const frame = (now) => {
    const wv = canvas.clientWidth, hv = canvas.clientHeight;
    if (canvas.width !== wv * dpr) { canvas.width = wv * dpr; canvas.height = hv * dpr; }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, wv, hv);
    let p = (now - start) / 4200;
    if (p >= 1) { start = now; p = 0; }
    pieces.forEach((pc) => {
      const local = Math.max(0, Math.min(1, (p - pc.delay) / (1 - pc.delay))) * pc.speed * 1.6;
      if (local <= 0) return;
      const y = -30 + local * (hv + 60);
      if (y > hv + 30) return;
      const x = pc.x * wv + Math.sin(local * 10 + pc.drift * 6) * 30 * pc.drift;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(((pc.rot * local) * Math.PI) / 180);
      ctx.fillStyle = pc.color;
      ctx.fillRect(-pc.size / 2, -pc.size / 4, pc.size, pc.size / 2);
      ctx.restore();
    });
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}

/** Hintergrund mit weichen Farbflecken. */
function drawBlobs() {
  const el = document.getElementById('blobs');
  const wv = window.innerWidth, hv = window.innerHeight, m = Math.min(wv, hv);
  const blob = (x, y, rr, color) => `<i style="left:${x}px;top:${y}px;width:${rr * 2}px;height:${rr * 2}px;background:radial-gradient(circle, ${hexA(color, 0.35)} 0%, rgba(0,0,0,0) 70%)"></i>`;
  el.innerHTML = blob(wv * 0.1, hv * 0.08, m * 0.7, Palette.violet) + blob(wv * 0.95, hv * 0.35, m * 0.6, Palette.pink) + blob(wv * 0.2, hv * 0.95, m * 0.7, Palette.cyan);
}
