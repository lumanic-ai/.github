// Hero banner: wordmark + thesis on the left, a communication located in F·S·T space on the right.
import { beginDoc, glyphDefs, fonts, text, themes, write, r } from './lib.mjs';
import { markGroup } from './mark.mjs';

const W = 1000;
const H = 380;

// Deterministic pseudo-random for stable layouts.
function rng(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

// Oblique (cabinet) projection. origin bottom-left; T → right, F ↑ up, S ↗ depth.
const O = { x: 604, y: 318 };
const LEN = { T: 262, F: 176, S: 124 };
const K = Math.SQRT1_2;
const P = (f, s, t) => ({
  x: O.x + t * LEN.T + s * LEN.S * K,
  y: O.y - f * LEN.F - s * LEN.S * K,
});

function scene() {
  const rand = rng(20260929);
  const pts = [];
  // communications cluster into a few "episodes" (meetings / threads)
  const centers = [
    [0.62, 0.3, 0.22],
    [0.35, 0.62, 0.46],
    [0.7, 0.55, 0.72],
    [0.3, 0.25, 0.86],
  ];
  for (const c of centers) {
    const n = 5;
    for (let i = 0; i < n; i++) {
      pts.push({
        f: Math.min(0.95, Math.max(0.06, c[0] + (rand() - 0.5) * 0.36)),
        s: Math.min(0.95, Math.max(0.04, c[1] + (rand() - 0.5) * 0.4)),
        t: Math.min(0.97, Math.max(0.05, c[2] + (rand() - 0.5) * 0.2)),
      });
    }
  }
  // highlighted communication
  const hi = { f: 0.64, s: 0.36, t: 0.56, hi: true };
  pts.push(hi);
  // edges: 2 nearest neighbours in meaning space
  const d = (a, b) => Math.hypot(a.f - b.f, a.s - b.s, (a.t - b.t) * 1.2);
  const edges = new Set();
  pts.forEach((a, i) => {
    pts
      .map((b, j) => [j, d(a, b)])
      .filter(([j]) => j !== i)
      .sort((x, y) => x[1] - y[1])
      .slice(0, a.hi ? 4 : 2)
      .forEach(([j]) => edges.add(i < j ? `${i}-${j}` : `${j}-${i}`));
  });
  return { pts, hi, edges: [...edges].map((e) => e.split('-').map(Number)) };
}

export function hero(themeName) {
  beginDoc();
  const t = themes[themeName];
  const { pts, hi, edges } = scene();
  const hiIdx = pts.indexOf(hi);

  // --- left: identity + thesis
  const markScale = 44 / 512;
  const word = text('Lumanic', { font: fonts.sans600, size: 27, x: 48 + 48, y: 79, fill: t.text, tracking: -0.01 });
  const eyebrow = text('THE CONTEXT ENGINE FOR THE ENTERPRISE', {
    font: fonts.mono500, size: 12.5, x: 48, y: 150, fill: t.accent, tracking: 0.12,
  });
  const h1a = text('From what was said', { font: fonts.serif, size: 54, x: 46, y: 212, fill: t.text, tracking: -0.012 });
  const h1b1 = text('to ', { font: fonts.serif, size: 54, x: 46, y: 268, fill: t.text, tracking: -0.012 });
  const h1b2 = text('why', { font: fonts.serifItalic, size: 54, x: 46 + h1b1.width + 3, y: 268, fill: t.accent, tracking: -0.01 });
  const h1b3 = text(' it was decided.', {
    font: fonts.serif, size: 54, x: 46 + h1b1.width + 3 + h1b2.width + 2, y: 268, fill: t.text, tracking: -0.012,
  });
  const sub1 = text('Every communication placed on Factual · Social · Temporal coordinates.', {
    font: fonts.sans400, size: 16.5, x: 48, y: 312, fill: t.text2,
  });
  const sub2 = text('Every answer traceable to the utterance it came from.', {
    font: fonts.sans400, size: 16.5, x: 48, y: 336, fill: t.text2,
  });

  // --- right: meaning space
  const o = P(0, 0, 0);
  const ax = {
    T: P(0, 0, 1.08),
    F: P(1.08, 0, 0),
    S: P(0, 1.1, 0),
  };
  // faint back planes
  const plane = (a, b, c, d) =>
    `M${r(a.x)} ${r(a.y)} L${r(b.x)} ${r(b.y)} L${r(c.x)} ${r(c.y)} L${r(d.x)} ${r(d.y)} Z`;
  const back = [
    plane(P(0, 1, 0), P(0, 1, 1), P(1, 1, 1), P(1, 1, 0)), // back wall S = 1
    plane(P(0, 0, 0), P(0, 1, 0), P(0, 1, 1), P(0, 0, 1)), // floor F = 0
  ];
  const seg = (a, b) => `<path d="M${r(a.x)} ${r(a.y)} L${r(b.x)} ${r(b.y)}"/>`;
  let grid = '';
  for (let i = 1; i < 6; i++) grid += seg(P(0, 0, i / 6), P(0, 1, i / 6)) + seg(P(0, 1, i / 6), P(1, 1, i / 6));
  for (let i = 1; i < 4; i++) grid += seg(P(0, i / 4, 0), P(0, i / 4, 1));
  for (let i = 1; i < 4; i++) grid += seg(P(i / 4, 1, 0), P(i / 4, 1, 1));

  const proj = pts.map((p) => ({ ...P(p.f, p.s, p.t), ...p }));
  const edgeSvg = edges
    .map(([i, j]) => {
      const a = proj[i], b = proj[j];
      const isHi = i === hiIdx || j === hiIdx;
      const depth = 1 - (a.s + b.s) / 2;
      return `<path d="M${r(a.x)} ${r(a.y)} L${r(b.x)} ${r(b.y)}" ${
        isHi
          ? `class="flow" stroke="${t.accent}" stroke-opacity="0.75" stroke-width="1.3" stroke-dasharray="3 5"`
          : `stroke="${t.text2}" stroke-opacity="${r(0.16 + depth * 0.2)}" stroke-width="1"`
      }/>`;
    })
    .join('');
  const ptSvg = proj
    .filter((p) => !p.hi)
    .map((p, i) => {
      const depth = 1 - p.s;
      const rad = 2.6 + depth * 1.6;
      const tw = i % 5 === 1 ? ` class="tw" style="animation-delay:${(i % 7) * 0.6}s"` : '';
      return `<circle cx="${r(p.x)}" cy="${r(p.y)}" r="${r(rad)}" fill="${t.text}" fill-opacity="${r(0.35 + depth * 0.45)}"${tw}/>`;
    })
    .join('');

  const H0 = proj[hiIdx];
  const floor = P(0, hi.s, hi.t);
  const onT = P(0, 0, hi.t);
  const onS = P(0, hi.s, 0);
  const onF = P(hi.f, 0, 0);
  const lift = P(hi.f, 0, hi.t);
  const dash = `fill="none" stroke-width="1.25" stroke-dasharray="4 4"`;
  const projections = `
    <path d="M${r(H0.x)} ${r(H0.y)} L${r(floor.x)} ${r(floor.y)}" stroke="${t.F}" ${dash}/>
    <path d="M${r(floor.x)} ${r(floor.y)} L${r(onT.x)} ${r(onT.y)}" stroke="${t.T}" ${dash}/>
    <path d="M${r(floor.x)} ${r(floor.y)} L${r(onS.x)} ${r(onS.y)}" stroke="${t.S}" ${dash}/>
    <path d="M${r(H0.x)} ${r(H0.y)} L${r(lift.x)} ${r(lift.y)} L${r(onF.x)} ${r(onF.y)}" stroke="${t.F}" ${dash} stroke-opacity="0.45"/>
    <circle cx="${r(onT.x)}" cy="${r(onT.y)}" r="3.2" fill="${t.T}"/>
    <circle cx="${r(onF.x)}" cy="${r(onF.y)}" r="3.2" fill="${t.F}"/>
    <circle cx="${r(onS.x)}" cy="${r(onS.y)}" r="3.2" fill="${t.S}"/>`;

  const axis = (to, color) =>
    `<path d="M${r(o.x)} ${r(o.y)} L${r(to.x)} ${r(to.y)}" stroke="${color}" stroke-width="1.6" fill="none"/>`;
  const arrow = (to, from, color) => {
    const ang = Math.atan2(to.y - from.y, to.x - from.x);
    const l = 7, w = 3.6;
    const p1 = { x: to.x - l * Math.cos(ang) + w * Math.sin(ang), y: to.y - l * Math.sin(ang) - w * Math.cos(ang) };
    const p2 = { x: to.x - l * Math.cos(ang) - w * Math.sin(ang), y: to.y - l * Math.sin(ang) + w * Math.cos(ang) };
    return `<path d="M${r(to.x)} ${r(to.y)} L${r(p1.x)} ${r(p1.y)} L${r(p2.x)} ${r(p2.y)} Z" fill="${color}"/>`;
  };
  const lab = (letter, word, x, y, color, anchor = 'start') => {
    const a = text(letter, { font: fonts.mono600, size: 15, x, y, fill: color, anchor });
    const b = text(word, {
      font: fonts.mono400, size: 11.5, x: anchor === 'start' ? x + a.width + 7 : x - a.width - 7, y: y - 0.5,
      fill: t.text3, anchor, tracking: 0.04,
    });
    return a.svg + b.svg;
  };

  const caption = text('fig. 1 \u2014 one utterance, located in meaning space', {
    font: fonts.mono400, size: 10.5, x: 954, y: H - 22, fill: t.text3, anchor: 'end', tracking: 0.02,
  });

  const glowId = `hg-${t.name}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Lumanic AI — The Context Engine for the enterprise. From what was said to why it was decided."><!--GLYPHS-->
<style>
  .flow{animation:flow 2.4s linear infinite}
  @keyframes flow{to{stroke-dashoffset:-32}}
  .pulse{transform-box:fill-box;transform-origin:center;animation:pulse 3.2s ease-out infinite}
  @keyframes pulse{0%{transform:scale(1);opacity:.7}80%,100%{transform:scale(3.4);opacity:0}}
  .tw{animation:tw 4.8s ease-in-out infinite}
  @keyframes tw{0%,100%{opacity:1}50%{opacity:.35}}
  @media (prefers-reduced-motion: reduce){.flow,.pulse,.tw{animation:none}}
</style>
<defs>
  <radialGradient id="${glowId}" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="${t.accentSoft}" stop-opacity="${t.glow}"/>
    <stop offset="1" stop-color="${t.accentSoft}" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="fade-${t.name}" x1="0" x2="1" y1="0" y2="0">
    <stop offset="0" stop-color="${t.bg}" stop-opacity="0"/>
    <stop offset="1" stop-color="${t.bg}" stop-opacity="0"/>
  </linearGradient>
</defs>
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="14" fill="${t.bg}" stroke="${t.lineSoft}"/>
<g transform="translate(48 ${54 - 4}) scale(${r(markScale * 1)})">${markGroup({ ink: t.text, accent: t.accent, glow: t.glow, projections: false, id: `hm-${t.name}` })}</g>
${word.svg}
${eyebrow.svg}
${h1a.svg}${h1b1.svg}${h1b2.svg}${h1b3.svg}
${sub1.svg}${sub2.svg}

<g>
  ${back.map((d) => `<path d="${d}" fill="${t.text}" fill-opacity="${t.name === 'dark' ? 0.022 : 0.03}" stroke="${t.line}" stroke-opacity="0.55" stroke-width="1"/>`).join('')}
  <g stroke="${t.line}" stroke-opacity="0.42" stroke-width="1" fill="none">${grid}</g>
  ${axis(ax.T, t.T)}${arrow(ax.T, o, t.T)}
  ${axis(ax.F, t.F)}${arrow(ax.F, o, t.F)}
  ${axis(ax.S, t.S)}${arrow(ax.S, o, t.S)}
  ${lab('T', 'TEMPORAL', ax.T.x + 2, ax.T.y + 24, t.T, 'end')}
  ${lab('F', 'FACTUAL', ax.F.x - 5, ax.F.y - 12, t.F)}
  ${lab('S', 'SOCIAL', ax.S.x - 12, ax.S.y + 4, t.S, 'end')}
  <g>${edgeSvg}</g>
  ${projections}
  <g>${ptSvg}</g>
  <circle cx="${r(H0.x)}" cy="${r(H0.y)}" r="34" fill="url(#${glowId})"/>
  <circle class="pulse" cx="${r(H0.x)}" cy="${r(H0.y)}" r="7" fill="none" stroke="${t.accent}" stroke-width="1.4"/>
  <circle cx="${r(H0.x)}" cy="${r(H0.y)}" r="6.5" fill="${t.accent}"/>
</g>
${caption.svg}
</svg>`.replace('<!--GLYPHS-->', glyphDefs());
}
