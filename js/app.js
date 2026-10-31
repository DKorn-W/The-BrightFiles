/* THE BRIGHT FILES — app logic (no dependencies) */
(() => {
'use strict';

const PROJECTS = window.PROJECTS;
const GALLERY = window.GALLERY;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const app = $('#app');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pad = n => String(n).padStart(2, '0');
const byId = id => PROJECTS.find(p => p.id === id);
const sectionLabel = { docs: 'Documentation', process: 'Process' };

/* ─────────── inline markup: **bold**, `code`, $tex$, [[doc:id|label]], [[p:path|label]] ─────────── */
function inline(text, pid) {
  let s = esc(text);
  s = s.replace(/\[\[(doc|p):([^|\]]+)\|([^\]]+)\]\]/g, (_, kind, target, label) => {
    const href = kind === 'doc' ? `#/p/${pid}/docs/${target}` : `#/p/${target}`;
    return `<a class="xref" href="${href}">${label}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\$([^$]+)\$/g, '<span class="tex">$1</span>');
  return s;
}
// the tex source was HTML-escaped; textContent gives it back unescaped.
function renderMath(root = app) {
  if (!window.katex) return;
  $$('.tex:not([data-done])', root).forEach(el => {
    const src = el.textContent;
    try { katex.render(src, el, { throwOnError: false, displayMode: el.classList.contains('block') }); }
    catch (e) { el.textContent = src; }
    el.dataset.done = '1';
  });
}
window.addEventListener('load', () => { renderMath(); });
document.addEventListener('DOMContentLoaded', () => { const k = $('script[src*="katex"]'); k && k.addEventListener('load', () => renderMath()); });

/* ─────────── generated artwork ─────────── */
let uid = 0;
function rng(seed) {
  let h = 2166136261;
  for (const c of seed) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  return () => { h += 0x6D2B79F5; let t = Math.imul(h ^ (h >>> 15), 1 | h); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function art(seed, a, b, style = 'orbs') {
  const r = rng(seed), id = 'g' + (++uid);
  const defs = `<defs>
    <radialGradient id="${id}a" cx="35%" cy="30%"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".35" stop-color="${a}"/><stop offset="1" stop-color="${b}" stop-opacity=".85"/></radialGradient>
    <radialGradient id="${id}b" cx="40%" cy="35%"><stop offset="0" stop-color="#fff" stop-opacity=".8"/><stop offset=".45" stop-color="${b}"/><stop offset="1" stop-color="${a}" stop-opacity=".7"/></radialGradient>
    <filter id="${id}f" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14"/></filter>
    <clipPath id="${id}c"><circle cx="200" cy="150" r="112"/></clipPath></defs>`;
  let body = '<rect width="400" height="300" fill="#07070b"/>';
  const orb = (cx, cy, rad, g) => `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="url(#${id}${g})"/>`;
  if (style === 'orbs') {
    body += `<circle cx="${150 + r() * 100}" cy="150" r="90" fill="${a}" opacity=".35" filter="url(#${id}f)"/>`;
    body += orb(165 + r() * 20, 140, 62 + r() * 14, 'a') + orb(250 + r() * 20, 120 + r() * 30, 42 + r() * 12, 'b') + orb(110, 210, 22, 'b') + orb(300, 215, 14, 'a');
    body += `<circle cx="200" cy="150" r="125" fill="none" stroke="#fff" stroke-opacity=".18"/><circle cx="200" cy="150" r="140" fill="none" stroke="#fff" stroke-opacity=".08" stroke-dasharray="2 6"/>`;
  } else if (style === 'waves') {
    let lines = '';
    for (let i = 0; i < 26; i++) {
      const y0 = 40 + i * 8.5, amp = 8 + r() * 6, ph = r() * 6;
      let d = `M70 ${y0}`;
      for (let x = 70; x <= 330; x += 10) d += ` L${x} ${(y0 + Math.sin(x / 22 + ph + i * .35) * amp).toFixed(1)}`;
      lines += `<path d="${d}" fill="none" stroke="#fff" stroke-width="2.6"/>`;
    }
    body += `<g clip-path="url(#${id}c)"><rect x="80" y="30" width="240" height="240" fill="#000"/>${lines}</g>`;
    body += orb(235, 120, 54, 'a') + orb(150, 190, 30, 'b');
    body += `<circle cx="200" cy="150" r="125" fill="none" stroke="#fff" stroke-opacity=".25"/>`;
  } else if (style === 'grid') {
    let g = '';
    for (let i = -10; i <= 10; i++) g += `<line x1="${200 + i * 14}" y1="170" x2="${200 + i * 60}" y2="300" stroke="${a}" stroke-opacity=".5"/>`;
    for (let j = 0; j < 8; j++) { const y = 170 + Math.pow(j / 7, 1.8) * 130; g += `<line x1="0" y1="${y}" x2="400" y2="${y}" stroke="${a}" stroke-opacity=".45"/>`; }
    body += g + `<circle cx="200" cy="120" r="70" fill="${b}" opacity=".3" filter="url(#${id}f)"/>` + orb(200, 118, 52, 'b') + orb(290, 70, 14, 'a');
    body += `<line x1="0" y1="170" x2="400" y2="170" stroke="#fff" stroke-opacity=".3"/>`;
  } else { // rings
    let ring = '';
    for (let i = 0; i < 7; i++) ring += `<ellipse cx="200" cy="150" rx="${50 + i * 20}" ry="${18 + i * 7}" fill="none" stroke="${i % 2 ? b : a}" stroke-opacity="${.75 - i * .09}" transform="rotate(${-18 + r() * 8} 200 150)"/>`;
    body += ring + `<circle cx="200" cy="150" r="70" fill="${a}" opacity=".3" filter="url(#${id}f)"/>` + orb(200, 150, 46, 'a') + orb(268, 108, 12, 'b');
  }
  return `<svg class="art" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${defs}${body}</svg>`;
}

/* ─────────── figures (diagrams) ─────────── */
const camR = deg => { // cam radius at profile angle (deg, 0 = lobe centre)
  let d = ((deg + 540) % 360) - 180;
  return 40 + (Math.abs(d) < 70 ? 24 * 0.5 * (1 + Math.cos(Math.PI * d / 70)) : 0);
};
const figures = {
  cam() {
    let pts = '';
    for (let a = 0; a < 360; a += 3) { const r = camR(a), t = (a - 90) * Math.PI / 180; pts += `${(150 + r * Math.cos(t)).toFixed(1)},${(150 + r * Math.sin(t)).toFixed(1)} `; }
    return `<svg viewBox="0 0 400 260" class="fig-cam" role="img" aria-label="Rotating cam with follower">
      <g class="cam-shape"><polygon points="${pts}" fill="var(--accent)" fill-opacity=".18" stroke="var(--accent)" stroke-width="2"/><circle cx="150" cy="150" r="5" fill="#fff"/><line x1="150" y1="150" x2="150" y2="86" stroke="#fff" stroke-opacity=".5" stroke-dasharray="3 4"/></g>
      <circle cx="150" cy="150" r="40" fill="none" stroke="#fff" stroke-opacity=".3" stroke-dasharray="3 5"/>
      <g class="cam-follower"><rect x="143" y="20" width="14" height="60" rx="3" fill="#fff" fill-opacity=".85"/><circle class="cam-tip" cx="150" cy="80" r="4" fill="var(--accent2)"/></g>
      <text x="230" y="70" class="fig-t">follower</text><line x1="226" y1="66" x2="160" y2="56" class="fig-l"/>
      <text x="230" y="170" class="fig-t">base circle r₀</text><line x1="226" y1="166" x2="180" y2="160" class="fig-l"/>
      <text x="230" y="215" class="fig-t">lift h = lobe − base</text></svg>`;
  },
  fin() {
    let fins = '', arrows = '';
    for (let i = 0; i < 9; i++) { const x = 70 + i * 32; fins += `<rect x="${x}" y="70" width="10" height="110" rx="2" fill="var(--accent)" fill-opacity=".35" stroke="var(--accent)"/>`; arrows += `<path class="heat" style="animation-delay:${i * .18}s" d="M${x + 5} 62 q-6 -12 0 -24 q6 -12 0 -24" fill="none" stroke="var(--accent2)" stroke-width="2"/>`; }
    return `<svg viewBox="0 0 400 260" role="img" aria-label="Heat sink fins"><rect x="52" y="180" width="300" height="26" rx="4" fill="var(--accent)" fill-opacity=".6" stroke="var(--accent)"/>${fins}${arrows}<text x="52" y="236" class="fig-t">base (chip contact)</text><text x="300" y="236" class="fig-t">fin: L × t × w</text><line x1="368" y1="70" x2="368" y2="180" class="fig-l"/><text x="376" y="130" class="fig-t">L</text></svg>`;
  },
  nn() {
    const L = [4, 6, 6, 3], xs = [70, 150, 250, 330], pos = L.map((n, i) => Array.from({ length: n }, (_, j) => [xs[i], 130 + (j - (n - 1) / 2) * 34]));
    let lines = '', nodes = '';
    for (let i = 0; i < L.length - 1; i++) pos[i].forEach(a => pos[i + 1].forEach(b => lines += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" class="nn-l"/>`));
    pos.flat().forEach(p => nodes += `<circle cx="${p[0]}" cy="${p[1]}" r="8" fill="#0b0b10" stroke="var(--accent)" stroke-width="2"/>`);
    return `<svg viewBox="0 0 400 260" role="img" aria-label="Neural network">${lines}${nodes}<text x="40" y="245" class="fig-t">input</text><text x="140" y="245" class="fig-t">hidden</text><text x="310" y="245" class="fig-t">output</text></svg>`;
  },
  chassis() {
    const s = 38, iso = (x, y, z) => [200 + (x - y) * .866 * s * .8, 150 + (x + y) * .5 * s * .8 - z * s * .9 - 40];
    const X = 5, Y = 2.4, Z = 1.2, pts = [];
    const ln = (a, b) => { const p = iso(...a), q = iso(...b); return `<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}" stroke="var(--accent)" stroke-width="1.6"/>`; };
    let out = '';
    [0, 1.8, 3.2, 5].forEach(x => { // hoops
      out += ln([x, 0, 0], [x, Y, 0]) + ln([x, 0, Z], [x, Y, Z]) + ln([x, 0, 0], [x, 0, Z]) + ln([x, Y, 0], [x, Y, Z]); pts.push([x, 0, 0], [x, Y, 0], [x, 0, Z], [x, Y, Z]);
    });
    [[0, 0], [0, 1], [1, 0], [1, 1]].forEach(([a, b]) => { out += ln([0, a * Y, b * Z], [5, a * Y, b * Z]); });
    out += ln([0, 0, 0], [1.8, 0, Z]) + ln([1.8, 0, 0], [3.2, 0, Z]) + ln([3.2, 0, 0], [5, 0, Z]);
    out += ln([0, Y, 0], [1.8, Y, Z]) + ln([1.8, Y, 0], [3.2, Y, Z]) + ln([3.2, Y, 0], [5, Y, Z]);
    const nodes = pts.map(p => { const q = iso(...p); return `<circle cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="3.4" fill="#fff"/>`; }).join('');
    return `<svg viewBox="0 0 400 260" role="img" aria-label="Chassis wireframe"><g class="chassis">${out}${nodes}</g></svg>`;
  },
  orbit() {
    let d = '', last;
    for (let i = 0; i <= 240; i++) { const t = i / 240, th = t * Math.PI * 7, r = 150 - 88 * Math.pow(t, 1.7); last = [200 + r * Math.cos(th), 130 + r * .62 * Math.sin(th)]; d += (i ? 'L' : 'M') + last[0].toFixed(1) + ' ' + last[1].toFixed(1) + ' '; }
    return `<svg viewBox="0 0 400 260" role="img" aria-label="Decaying orbit"><defs><radialGradient id="earth" cx="35%" cy="30%"><stop offset="0" stop-color="#fff"/><stop offset=".4" stop-color="var(--accent2)"/><stop offset="1" stop-color="#05204a"/></radialGradient></defs><path d="${d}" fill="none" stroke="var(--accent)" stroke-width="1.4" stroke-opacity=".9"/><circle cx="200" cy="130" r="46" fill="url(#earth)"/><circle cx="${last[0]}" cy="${last[1]}" r="5" fill="#fff"/><text x="30" y="245" class="fig-t">start: 400 km</text><text x="270" y="245" class="fig-t">re-entry</text></svg>`;
  }
};
function initCam(root) {
  const svg = $('.fig-cam', root); if (!svg || reduceMotion) return;
  const shape = $('.cam-shape', svg), fol = $('.cam-follower', svg); let a = 0;
  (function tick() {
    if (!svg.isConnected) return;
    a = (a + 1.2) % 360;
    shape.setAttribute('transform', `rotate(${a} 150 150)`);
    fol.setAttribute('transform', `translate(0 ${(66 - camR(-a)).toFixed(2)})`); // tip rests on the profile point at the top
    requestAnimationFrame(tick);
  })();
}

/* ─────────── charts ─────────── */
function chartLine(b) {
  const W = 560, H = 280, m = { l: 46, r: 16, t: 14, b: 40 };
  const all = b.series.flatMap(s => s.points), xs = all.map(p => p[0]), ys = all.map(p => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(0, Math.min(...ys)), y1 = Math.max(...ys) * 1.08;
  const X = v => m.l + (v - x0) / (x1 - x0) * (W - m.l - m.r), Y = v => H - m.b - (v - y0) / (y1 - y0) * (H - m.t - m.b);
  let g = '';
  for (let i = 0; i <= 4; i++) { const v = y0 + (y1 - y0) * i / 4, y = Y(v); g += `<line x1="${m.l}" x2="${W - m.r}" y1="${y}" y2="${y}" class="gl"/><text x="${m.l - 8}" y="${y + 4}" text-anchor="end" class="ax">${+v.toPrecision(3)}</text>`; }
  for (let i = 0; i <= 5; i++) { const v = x0 + (x1 - x0) * i / 5; g += `<text x="${X(v)}" y="${H - m.b + 18}" text-anchor="middle" class="ax">${+v.toPrecision(3)}</text>`; }
  const lines = b.series.map((s, i) => {
    const d = s.points.map((p, j) => (j ? 'L' : 'M') + X(p[0]).toFixed(1) + ' ' + Y(p[1]).toFixed(1)).join(' ');
    const dots = s.points.map(p => `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="3.5" class="s${i}f"><title>${esc(s.name)}: ${p[0]}, ${p[1]}</title></circle>`).join('');
    return `<path d="${d}" class="line s${i}"/>${dots}`;
  }).join('');
  const legend = b.series.length > 1 ? `<div class="legend">${b.series.map((s, i) => `<span><i class="sw s${i}f"></i>${esc(s.name)}</span>`).join('')}</div>` : '';
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(b.title)}">${g}${lines}<text x="${W / 2}" y="${H - 4}" text-anchor="middle" class="ax">${esc(b.xlabel || '')}</text><text transform="translate(12 ${H / 2}) rotate(-90)" text-anchor="middle" class="ax">${esc(b.ylabel || '')}</text></svg>${legend}`;
}
function chartBars(b) {
  const max = Math.max(...b.data.map(d => d[1]));
  return `<div class="bars">${b.data.map(([k, v]) => `<div class="bar-row"><span>${esc(k)}</span><div class="bar-track"><div class="bar-fill" style="--w:${(v / max * 100).toFixed(1)}%"></div></div><b>${v}</b></div>`).join('')}</div>`;
}

/* ─────────── interactive calculator ─────────── */
const calcs = {
  fin() {
    const f = [['h', 'Convection h', 5, 250, 25, 'W/m²K'], ['k', 'Conductivity k', 10, 400, 205, 'W/mK'], ['L', 'Fin length L', 5, 80, 30, 'mm'], ['t', 'Fin thickness t', .5, 6, 1.5, 'mm'], ['w', 'Fin width w', 20, 120, 60, 'mm'], ['N', 'Number of fins', 4, 40, 24, ''], ['dT', 'Base ΔT', 5, 80, 40, 'K']];
    return `<div class="calc" data-calc="fin"><div class="calc-in">${f.map(([id, l, mn, mx, v, u]) => `<label>${l}<output id="o-${id}">${v}</output><small>${u}</small><input type="range" id="c-${id}" min="${mn}" max="${mx}" step="${mx > 100 ? 1 : .5}" value="${v}"></label>`).join('')}</div>
      <div class="calc-out"><div class="gauge"><div class="gauge-fill" id="g-eta"></div><span id="r-eta">–</span><small>fin efficiency</small></div>
      <dl><dt>Heat per fin</dt><dd id="r-q1">–</dd><dt>Total heat Q</dt><dd id="r-q">–</dd><dt>mL</dt><dd id="r-ml">–</dd></dl>
      <p class="hint" id="r-hint"></p></div></div>`;
  }
};
function initCalc(root) {
  const el = $('[data-calc="fin"]', root); if (!el) return;
  const v = id => +$('#c-' + id, el).value;
  const run = () => {
    ['h', 'k', 'L', 't', 'w', 'N', 'dT'].forEach(id => $('#o-' + id, el).textContent = v(id));
    const h = v('h'), k = v('k'), L = v('L') / 1000, t = v('t') / 1000, w = v('w') / 1000, N = v('N'), dT = v('dT');
    const P = 2 * (w + t), Ac = w * t, m = Math.sqrt(h * P / (k * Ac)), ml = m * L, th = Math.tanh(ml);
    const q1 = Math.sqrt(h * P * k * Ac) * dT * th, eta = th / ml;
    $('#r-eta', el).textContent = (eta * 100).toFixed(0) + ' %';
    $('#g-eta', el).style.setProperty('--w', (eta * 100) + '%');
    $('#r-q1', el).textContent = q1.toFixed(2) + ' W';
    $('#r-q', el).textContent = (q1 * N).toFixed(1) + ' W';
    $('#r-ml', el).textContent = ml.toFixed(2);
    $('#r-hint', el).textContent = eta < .8 ? 'Efficiency under 80 %: extra length adds little. Try thicker fins or shorter length.' : 'Efficient fins: adding fins helps more than making them longer.';
  };
  $$('input', el).forEach(i => i.addEventListener('input', run)); run();
}

/* ─────────── block renderer ─────────── */
function blocks(list, pid) {
  return list.map(b => {
    switch (b.t) {
      case 'p': return `<p class="lead">${inline(b.text, pid)}</p>`;
      case 'stats': return `<div class="stats">${b.items.map(i => `<div class="stat"><b>${esc(i.v)}</b><span>${esc(i.l)}</span></div>`).join('')}</div>`;
      case 'formula': return `<figure class="formula"><div class="tex block">${esc(b.tex)}</div>${b.caption ? `<figcaption>${inline(b.caption, pid)}</figcaption>` : ''}${b.vars ? `<dl class="vars">${b.vars.map(([s, d]) => `<dt>${esc(s)}</dt><dd>${esc(d)}</dd>`).join('')}</dl>` : ''}</figure>`;
      case 'callout': return `<aside class="callout"><h4>${esc(b.title)}</h4><p>${inline(b.text, pid)}</p>${b.link ? `<a class="btn" href="${b.link.to.startsWith('doc:') ? `#/p/${pid}/docs/${b.link.to.slice(4)}` : '#/p/' + b.link.to}">${esc(b.link.label)} →</a>` : ''}</aside>`;
      case 'steps': return `<ol class="steps">${b.items.map(i => `<li><h5>${esc(i.h)}</h5><p>${inline(i.text, pid)}</p></li>`).join('')}</ol>`;
      case 'parts': return `<section class="parts"><h3>${esc(b.title)}</h3><div class="parts-grid">${b.items.map(p => { const sf = p.yield / p.stress, pct = Math.min(100, p.stress / p.yield * 100); return `<a class="part" href="#/p/${pid}/docs/${p.doc}"><h4>${esc(p.name)}</h4><small>${esc(p.material)}</small><div class="meter ${sf < 1.6 ? 'warn' : ''}"><i style="--w:${pct.toFixed(0)}%"></i></div><div class="part-row"><span>${p.stress} / ${p.yield} MPa</span><b>SF ${sf.toFixed(2)}</b></div><p>${esc(p.note)}</p></a>`; }).join('')}</div></section>`;
      case 'chart': return `<figure class="chart"><figcaption class="chart-t">${esc(b.title)}</figcaption>${b.kind === 'bars' ? chartBars(b) : chartLine(b)}</figure>`;
      case 'figure': return `<figure class="figure">${figures[b.art]()}<figcaption>${esc(b.caption)}</figcaption></figure>`;
      case 'image': return b.src ? `<figure class="figure"><img src="${esc(b.src)}" alt="${esc(b.caption || '')}"><figcaption>${esc(b.caption || '')}</figcaption></figure>` : `<figure class="figure placeholder"><div>＋ image slot</div><figcaption>${esc(b.caption || '')}</figcaption></figure>`;
      case 'calc': return `<section class="calc-wrap"><h3>Try it: fin calculator</h3>${calcs[b.id]()}</section>`;
      default: return '';
    }
  }).join('');
}

/* ─────────── pages ─────────── */
const catCounts = () => PROJECTS.reduce((m, p) => (m[p.category] = (m[p.category] || 0) + 1, m), {});
const docCount = p => p.docs.length + p.process.length;

function projectCard(p, i) {
  return `<a class="card" href="#/p/${p.id}" style="--accent:${p.accent};--accent2:${p.accent2}">
    <div class="card-art">${art(p.id, p.accent, p.accent2, p.art)}<span class="chip">${esc(p.category)}</span>${p.template ? '<span class="chip ghost">template</span>' : ''}</div>
    <div class="card-body"><small>${pad(i + 1)} · ${esc(p.status)} · ${p.year}</small><h3>${esc(p.title)}</h3><p>${esc(p.tagline)}</p>
    <div class="card-foot"><span>${p.docs.length} docs · ${p.process.length} process</span><span class="go">Open →</span></div></div></a>`;
}

function pageHome() {
  const c = catCounts();
  const latest = PROJECTS[0];
  app.innerHTML = `
  <section class="hero">
    <aside class="rail" aria-hidden="true">
      <div class="rail-dots"><i></i><i></i><i></i><i></i><i></i><i></i></div>
      <small>${PROJECTS.length} projects</small>
      <div class="rail-line"><i></i></div>
      <button data-scroll="up" aria-label="Scroll up">↑</button><button data-scroll="down" class="light" aria-label="Scroll down">↓</button>
    </aside>
    <div class="hero-text">
      <h1><span class="spark">✳</span> A futuristic archive<span class="c">©</span><br><em>of everything I build</em></h1>
      <p>CAD, analysis, code, science and papers, collected in one place, with the theory linked right next to the result.</p>
      <div class="hero-cta"><a class="btn solid" href="#/projects">Explore projects →</a><a class="btn" href="#/gallery">Open gallery</a></div>
      <div class="hero-cats">${Object.entries(c).map(([k, v]) => `<a href="#/projects?cat=${encodeURIComponent(k)}"><b>${pad(v)}</b>${esc(k)}</a>`).join('')}</div>
    </div>
    <div class="hero-orb" style="--accent:${latest.accent};--accent2:${latest.accent2}">
      <div class="ring r1"></div><div class="ring r2"></div>
      <div class="orb-art">${art('hero', '#8b6cff', '#ff5a3c', 'orbs')}</div>
      <a class="orb-tag" href="#/p/${latest.id}"><small>Latest</small>${esc(latest.title)}</a>
    </div>
  </section>
  <section class="section"><div class="section-h"><h2>Projects</h2><a href="#/projects">View all →</a></div><div class="grid">${PROJECTS.map(projectCard).join('')}</div></section>
  <section class="section"><div class="section-h"><h2>From the gallery</h2><a href="#/gallery">View all →</a></div><div class="strip">${GALLERY.slice(0, 5).map((g, i) => galleryTile(g, i)).join('')}</div></section>`;
  $$('[data-scroll]', app).forEach(b => b.onclick = () => window.scrollTo({ top: b.dataset.scroll === 'down' ? innerHeight * .8 : 0, behavior: 'smooth' }));
  bindTiles();
}

function pageProjects(q) {
  const cat = new URLSearchParams(q).get('cat') || 'All';
  const cats = ['All', ...Object.keys(catCounts())];
  const list = PROJECTS.filter(p => cat === 'All' || p.category === cat);
  app.innerHTML = `<section class="section pt"><div class="crumbs"><a href="#/">Home</a> / <span>Projects</span></div><h1 class="h1">All projects</h1>
    <div class="filters">${cats.map(k => `<a class="${k === cat ? 'on' : ''}" href="#/projects${k === 'All' ? '' : '?cat=' + encodeURIComponent(k)}">${esc(k)}</a>`).join('')}</div>
    <div class="grid">${list.map(p => projectCard(p, PROJECTS.indexOf(p))).join('')}</div></section>`;
}

function pageLibrary() {
  app.innerHTML = `<section class="section pt"><div class="crumbs"><a href="#/">Home</a> / <span>Library</span></div><h1 class="h1">Library</h1><p class="sub">Every theory and process page across all projects.</p>
  ${PROJECTS.map(p => `<div class="lib" style="--accent:${p.accent}"><h3><i></i><a href="#/p/${p.id}">${esc(p.title)}</a></h3>
    ${['docs', 'process'].map(s => `<div class="lib-col"><h5>${sectionLabel[s]}</h5>${p[s].map((d, i) => `<a href="#/p/${p.id}/${s}/${d.id}"><b>${pad(i + 1)}</b><span>${esc(d.title)}<small>${esc(d.summary)}</small></span></a>`).join('')}</div>`).join('')}</div>`).join('')}</section>`;
}

function galleryTile(g, i) {
  const p = byId(g.project);
  return `<button class="tile" data-g="${GALLERY.indexOf(g)}" style="--accent:${g.a}">${g.src ? `<img src="${esc(g.src)}" alt="${esc(g.title)}">` : art(g.title, g.a, g.b, g.style)}<span class="tile-cap"><b>${esc(g.title)}</b><small>${esc(p ? p.title : '')} · ${esc(g.cat)}</small></span></button>`;
}
function pageGallery(q) {
  const cat = new URLSearchParams(q).get('cat') || 'All';
  const cats = ['All', ...new Set(GALLERY.map(g => g.cat))];
  app.innerHTML = `<section class="section pt"><div class="crumbs"><a href="#/">Home</a> / <span>Gallery</span></div><h1 class="h1">Gallery</h1><p class="sub">Final results of the projects.</p>
    <div class="filters">${cats.map(k => `<a class="${k === cat ? 'on' : ''}" href="#/gallery${k === 'All' ? '' : '?cat=' + encodeURIComponent(k)}">${esc(k)}</a>`).join('')}</div>
    <div class="masonry">${GALLERY.filter(g => cat === 'All' || g.cat === cat).map(galleryTile).join('')}</div></section>`;
  bindTiles();
}
function bindTiles() { $$('.tile', app).forEach(t => t.onclick = () => openLightbox(GALLERY[+t.dataset.g])); }
function openLightbox(g) {
  const p = byId(g.project);
  $('#lbBody').innerHTML = `<div class="lb-art" style="--accent:${g.a}">${g.src ? `<img src="${esc(g.src)}" alt="${esc(g.title)}">` : art(g.title, g.a, g.b, g.style)}</div><div class="lb-cap"><h3>${esc(g.title)}</h3><p>${esc(g.caption || '')}</p>${p ? `<a class="btn" href="#/p/${p.id}">Open ${esc(p.title)} →</a>` : ''}</div>`;
  $('#lightbox').hidden = false;
  $('#lbBody a')?.addEventListener('click', closeLightbox);
}
const closeLightbox = () => { $('#lightbox').hidden = true; };

function pageProject(pid, section, did) {
  const p = byId(pid);
  if (!p) return page404();
  section = section || 'overview';
  const order = [{ s: 'overview', id: '', title: 'Overview', url: `#/p/${p.id}` }, ...['docs', 'process'].flatMap(s => p[s].map(d => ({ s, id: d.id, title: d.title, url: `#/p/${p.id}/${s}/${d.id}` })))];
  let cur = order.findIndex(o => o.s === section && o.id === (did || ''));
  if (cur < 0) return page404();
  const page = section === 'overview' ? { title: 'Overview', summary: p.tagline, blocks: p.overview } : p[section].find(d => d.id === did);
  const tree = ['docs', 'process'].map(s => `<div class="t-group"><div class="t-h">${sectionLabel[s]}<span>${p[s].length}</span></div>${p[s].map((d, i) => `<a href="#/p/${p.id}/${s}/${d.id}" class="${section === s && did === d.id ? 'on' : ''}"><b>${pad(i + 1)}</b>${esc(d.title)}</a>`).join('')}</div>`).join('');
  const prev = order[cur - 1], next = order[cur + 1];
  app.innerHTML = `<div class="proj" style="--accent:${p.accent};--accent2:${p.accent2}">
    <aside class="tree"><a class="t-back" href="#/projects">← All projects</a><div class="t-title"><span>${esc(p.category)}</span>${esc(p.title)}</div>
      <a class="t-root ${section === 'overview' ? 'on' : ''}" href="#/p/${p.id}">Overview</a>${tree}</aside>
    <article class="doc">
      <div class="crumbs"><a href="#/projects">Projects</a> / <a href="#/p/${p.id}">${esc(p.title)}</a>${section !== 'overview' ? ` / <span>${sectionLabel[section]}</span>` : ''} / <span>${esc(page.title)}</span></div>
      <header class="doc-h">${section === 'overview'
        ? `<div class="doc-art">${art(p.id, p.accent, p.accent2, p.art)}</div><div><small>${esc(p.status)} · ${p.year}${p.template ? ' · template data' : ''}</small><h1>${esc(p.title)}</h1><p class="sub">${esc(p.subtitle)}. ${esc(p.tagline)}</p><div class="tags">${p.tags.map(t => `<span>#${esc(t)}</span>`).join('')}</div></div>`
        : `<div><small>${sectionLabel[section]} ${pad(p[section].findIndex(d => d.id === did) + 1)}</small><h1>${esc(page.title)}</h1><p class="sub">${esc(page.summary)}</p></div>`}</header>
      <div class="doc-body">${blocks(page.blocks, p.id)}</div>
      <nav class="pager">${prev ? `<a href="${prev.url}"><small>← Previous</small>${esc(prev.title)}</a>` : '<span></span>'}${next ? `<a class="r" href="${next.url}"><small>Next →</small>${esc(next.title)}</a>` : '<span></span>'}</nav>
    </article></div>`;
  initCam(app); initCalc(app); renderMath();
}
function page404() { app.innerHTML = `<section class="section pt"><h1 class="h1">Page not found</h1><p class="sub">That page does not exist (yet).</p><a class="btn" href="#/">Go home</a></section>`; }

/* ─────────── router ─────────── */
function route() {
  const [path, q = ''] = location.hash.replace(/^#/, '').split('?');
  const seg = path.split('/').filter(Boolean);
  $$('#nav a').forEach(a => a.classList.remove('on'));
  const nav = k => $(`#nav [data-nav="${k}"]`)?.classList.add('on');
  closeMenu(); closeResults(); closeLightbox();
  if (!seg.length) { nav('home'); pageHome(); }
  else if (seg[0] === 'projects') pageProjects(q);
  else if (seg[0] === 'library') { nav('library'); pageLibrary(); }
  else if (seg[0] === 'gallery') { nav('gallery'); pageGallery(q); }
  else if (seg[0] === 'p') pageProject(seg[1], seg[2] === 'overview' ? '' : seg[2], seg[3]);
  else page404();
  window.scrollTo(0, 0);
  renderMath();
}
addEventListener('hashchange', route);

/* ─────────── projects menu ─────────── */
const menuPanel = $('#menuPanel'), menuBtn = $('#menuBtn');
menuPanel.innerHTML = PROJECTS.map(p => `<a href="#/p/${p.id}" style="--accent:${p.accent}"><i></i><span>${esc(p.title)}<small>${esc(p.category)} · ${esc(p.subtitle)}</small></span></a>`).join('') + '<a class="all" href="#/projects">View all projects →</a>';
function closeMenu() { menuPanel.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); }
menuBtn.onclick = e => { e.stopPropagation(); closeResults(); const o = menuPanel.hidden; menuPanel.hidden = !o; menuBtn.setAttribute('aria-expanded', String(o)); };

/* ─────────── search ─────────── */
const strings = (v, out = []) => { if (typeof v === 'string') out.push(v); else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => { if (k !== 't' && k !== 'art' && k !== 'tex' && k !== 'doc') strings(x, out); }); return out; };
const plain = s => s.replace(/\[\[(?:doc|p):[^|\]]+\|([^\]]+)\]\]/g, '$1').replace(/[*`$]/g, '');
const INDEX = PROJECTS.flatMap(p => [
  { p, title: p.title, where: p.category, url: `#/p/${p.id}`, head: p.title, text: plain([p.subtitle, p.tagline, ...p.tags, ...strings(p.overview)].join(' ')) },
  ...['docs', 'process'].flatMap(s => p[s].map(d => ({ p, title: d.title, where: `${p.title} › ${sectionLabel[s]}`, url: `#/p/${p.id}/${s}/${d.id}`, head: d.title, text: plain([d.title, d.summary, ...strings(d.blocks)].join(' ')) })))
]);
const input = $('#searchInput'), results = $('#results');
function closeResults() { results.hidden = true; }
function doSearch() {
  const q = input.value.trim().toLowerCase();
  if (!q) return closeResults();
  const terms = q.split(/\s+/);
  const hits = INDEX.map(e => {
    const low = e.text.toLowerCase(), h = e.head.toLowerCase();
    if (!terms.every(t => low.includes(t))) return null;
    return { e, score: terms.reduce((s, t) => s + (h.includes(t) ? 5 : 0) + Math.min(3, low.split(t).length - 1), 0) };
  }).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, 8);
  const mark = s => terms.reduce((acc, t) => acc.replace(new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>'), esc(s));
  results.innerHTML = hits.length ? hits.map(({ e }) => {
    const i = e.text.toLowerCase().indexOf(terms[0]), snip = e.text.slice(Math.max(0, i - 40), i + 90);
    return `<a href="${e.url}" style="--accent:${e.p.accent}"><i></i><span><b>${mark(e.title)}</b><small>${esc(e.where)}</small><em>${i > 40 ? '…' : ''}${mark(snip)}…</em></span></a>`;
  }).join('') : `<div class="none">No matches for “${esc(input.value)}”</div>`;
  results.hidden = false;
}
input.addEventListener('input', doSearch);
input.addEventListener('focus', () => { closeMenu(); doSearch(); });
input.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeResults(); input.blur(); }
  if (e.key === 'Enter') { const a = $('a', results); if (a) { location.hash = a.getAttribute('href'); input.blur(); } }
});
results.addEventListener('click', () => { closeResults(); });
document.addEventListener('keydown', e => {
  const typing = /input|textarea/i.test(document.activeElement.tagName);
  if ((e.key === '/' && !typing) || (e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey))) { e.preventDefault(); input.focus(); input.select(); }
  if (e.key === 'Escape') { closeLightbox(); closeMenu(); closeChat(); }
});
document.addEventListener('click', e => {
  if (!e.target.closest('.menu')) closeMenu();
  if (!e.target.closest('.search')) closeResults();
});

/* ─────────── lightbox ─────────── */
$('#lbClose').onclick = closeLightbox;
$('#lightbox').addEventListener('click', e => { if (e.target.id === 'lightbox') closeLightbox(); });

/* ─────────── chat (visual only, intentionally does nothing) ─────────── */
const chat = $('#chat'), fab = $('#chatFab');
function closeChat() { chat.hidden = true; fab.setAttribute('aria-expanded', 'false'); }
fab.onclick = () => { const open = chat.hidden; chat.hidden = !open; fab.setAttribute('aria-expanded', String(open)); if (open) $('input', chat).focus(); };
$('#chatClose').onclick = closeChat;
$('#chatForm').addEventListener('submit', e => e.preventDefault());

$('#year').textContent = new Date().getFullYear();
route();
})();
