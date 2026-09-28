// Fig. 3 — Lumanic Engine (shared) → Enterprise Context Engine (one per organization).
import { beginDoc, glyphDefs, fonts, text, measure, themes, write, r } from './lib.mjs';

const W = 900;
const M = 28; // outer margin
const IW = W - M * 2;

function arrowHead(x, y, dir, color, s = 6) {
  // dir: 'down' | 'left' | 'right' | 'up'
  const pts = {
    down: [[x, y], [x - s * 0.62, y - s], [x + s * 0.62, y - s]],
    up: [[x, y], [x - s * 0.62, y + s], [x + s * 0.62, y + s]],
    right: [[x, y], [x - s, y - s * 0.62], [x - s, y + s * 0.62]],
    left: [[x, y], [x + s, y - s * 0.62], [x + s, y + s * 0.62]],
  }[dir];
  return `<path d="M${pts.map((p) => p.map(r).join(' ')).join(' L')} Z" fill="${color}"/>`;
}

export function arch(themeName) {
  beginDoc();
  const t = themes[themeName];
  const o = [];
  const add = (s) => o.push(typeof s === 'string' ? s : s.svg);
  const label = (s, x, y, color = t.text3, opts = {}) =>
    add(text(s, { font: fonts.mono500, size: 11, x, y, fill: color, tracking: 0.12, ...opts }));

  // ---------- sources
  let y = 26;
  label('SOURCES', M, y);
  const sources = ['Meetings', 'Reports & policies', 'Approvals', 'Complaints & tickets', 'Email & chat'];
  const sg = 12;
  const sw = (IW - sg * 4) / 5;
  const sy = y + 14;
  const sh = 40;
  sources.forEach((s, i) => {
    const x = M + i * (sw + sg);
    add(`<rect x="${r(x)}" y="${sy}" width="${r(sw)}" height="${sh}" rx="9" fill="${t.card}" stroke="${t.line}"/>`);
    add(text(s, { font: fonts.sans500, size: 14, x: x + sw / 2, y: sy + 25, fill: t.text, anchor: 'middle' }));
  });

  // converge into engine
  const aTop = sy + sh + 34;
  const cxm = W / 2;
  let conv = '';
  sources.forEach((_, i) => {
    const x = M + i * (sw + sg) + sw / 2;
    conv += `<path d="M${r(x)} ${sy + sh} V${sy + sh + 12} Q${r(x)} ${sy + sh + 18} ${r(x + (cxm - x) * 0.12)} ${sy + sh + 18} H${r(cxm)}" />`;
  });
  add(`<g fill="none" stroke="${t.line}" stroke-width="1.4">${conv}<path d="M${cxm} ${sy + sh + 18} V${aTop - 2}"/></g>`);
  add(arrowHead(cxm, aTop, 'down', t.text3));

  // ---------- Lumanic Engine (shared core)
  const aH = 150;
  add(`<rect x="${M}" y="${aTop}" width="${IW}" height="${aH}" rx="14" fill="${t.card}" stroke="${t.accent}" stroke-opacity="0.75" stroke-width="1.4"/>`);
  const tagA = 'LUMANIC ENGINE';
  const tagAW = measure(tagA, fonts.mono600, 11, 0.12) + 20;
  add(`<rect x="${M + 20}" y="${aTop - 11}" width="${r(tagAW)}" height="22" rx="11" fill="${t.bg}" stroke="${t.accent}" stroke-opacity="0.75"/>`);
  add(text(tagA, { font: fonts.mono600, size: 11, x: M + 30, y: aTop + 4, fill: t.accent, tracking: 0.12 }));
  add(text('shared core', { font: fonts.mono400, size: 11, x: W - M - 20, y: aTop + 28, fill: t.text3, anchor: 'end', tracking: 0.06 }));

  add(text('01', { font: fonts.mono600, size: 13, x: M + 22, y: aTop + 44, fill: t.accent }));
  add(text('F·S·T Semantic Representation', { font: fonts.sans600, size: 19, x: M + 50, y: aTop + 45, fill: t.text }));
  add(text('Segments communication into utterances and places each one on meaning coordinates.', {
    font: fonts.sans400, size: 14.5, x: M + 50, y: aTop + 69, fill: t.text2,
  }));

  // pipeline
  const py = aTop + 96;
  const chip = (s, x, w) => {
    add(`<rect x="${r(x)}" y="${py}" width="${r(w)}" height="34" rx="8" fill="${t.cardAlt}" stroke="${t.line}"/>`);
    add(text(s, { font: fonts.mono500, size: 11.5, x: x + w / 2, y: py + 21.5, fill: t.text2, anchor: 'middle', tracking: 0.02 }));
  };
  const steps = [
    ['utterances', 112],
    ['speakers & metadata', 172],
    ['FST', 168],
    ['meaning vectors', 142],
    ['semantic graph', 134],
  ];
  const totalW = steps.reduce((a, [, w]) => a + w, 0);
  const pg = (IW - 44 - totalW) / (steps.length - 1);
  let px = M + 22;
  steps.forEach(([s, w], i) => {
    if (s === 'FST') {
      add(`<rect x="${r(px)}" y="${py}" width="${r(w)}" height="34" rx="8" fill="${t.cardAlt}" stroke="${t.line}"/>`);
      [t.F, t.S, t.T].forEach((c, j) =>
        add(`<rect x="${r(px + 12)}" y="${py + 9 + j * 6.5}" width="16" height="3.5" rx="1.75" fill="${c}"/>`),
      );
      add(text('F\u00b7S\u00b7T in parallel', { font: fonts.mono500, size: 11.5, x: px + 36, y: py + 21.5, fill: t.text, tracking: 0.02 }));
    } else chip(s, px, w);
    if (i < steps.length - 1) {
      const ax = px + w + 5;
      add(`<path d="M${r(ax)} ${py + 17} H${r(ax + pg - 14)}" stroke="${t.text3}" stroke-width="1.3"/>`);
      add(arrowHead(ax + pg - 9, py + 17, 'right', t.text3, 5));
    }
    px += w + pg;
  });

  // ---------- into the Enterprise Context Engine
  const bTop = aTop + aH + 40;
  add(`<path d="M${cxm} ${aTop + aH} V${bTop - 2}" stroke="${t.text3}" stroke-width="1.4"/>`);
  add(arrowHead(cxm, bTop, 'down', t.text3));

  const bH = 222;
  add(`<rect x="${M}" y="${bTop}" width="${IW}" height="${bH}" rx="14" fill="${t.text}" fill-opacity="${t.name === 'dark' ? 0.025 : 0.02}" stroke="${t.text2}" stroke-opacity="0.55" stroke-width="1.3" stroke-dasharray="5 4"/>`);
  const tagB = 'ENTERPRISE CONTEXT ENGINE';
  const tagBW = measure(tagB, fonts.mono600, 11, 0.12) + 20;
  add(`<rect x="${M + 20}" y="${bTop - 11}" width="${r(tagBW)}" height="22" rx="11" fill="${t.bg}" stroke="${t.text2}" stroke-opacity="0.7"/>`);
  add(text(tagB, { font: fonts.mono600, size: 11, x: M + 30, y: bTop + 4, fill: t.text, tracking: 0.12 }));
  add(text('one per organization', { font: fonts.mono400, size: 11, x: W - M - 20, y: bTop + 28, fill: t.text3, anchor: 'end', tracking: 0.06 }));

  const cards = [
    ['02', 'Context Graph Reasoning', 'Graph and vector retrieval restore the context behind a question.', 'evidence paths'],
    ['03', 'Enterprise Decision Ontology', 'Units, roles, policies, actions, events and the rules that bind them.', 'shared decision vocabulary'],
    ['04', 'Adaptive Decision Intelligence', 'Weighs issues, stakeholders, impact, risk and priority.', 'interventions & scenarios'],
  ];
  const cg = 14;
  const cw = (IW - 40 - cg * 2) / 3;
  const cTop = bTop + 44;
  const cH = bH - 62;
  cards.forEach(([n, title, body, out], i) => {
    const x = M + 20 + i * (cw + cg);
    add(`<rect x="${r(x)}" y="${cTop}" width="${r(cw)}" height="${cH}" rx="11" fill="${t.card}" stroke="${t.line}"/>`);
    add(text(n, { font: fonts.mono600, size: 12.5, x: x + 18, y: cTop + 30, fill: t.text3 }));
    // title may need 2 lines
    const words = title.split(' ');
    const l1 = words.slice(0, 2).join(' ');
    const l2 = words.slice(2).join(' ');
    add(text(l1, { font: fonts.sans600, size: 16.5, x: x + 18, y: cTop + 54, fill: t.text }));
    if (l2) add(text(l2, { font: fonts.sans600, size: 16.5, x: x + 18, y: cTop + 74, fill: t.text }));
    // body wrap
    const bodyLines = [];
    let line = '';
    for (const w of body.split(' ')) {
      const tt = line ? line + ' ' + w : w;
      if (measure(tt, fonts.sans400, 13.5) > cw - 36 && line) {
        bodyLines.push(line);
        line = w;
      } else line = tt;
    }
    bodyLines.push(line);
    bodyLines.forEach((bl, j) =>
      add(text(bl, { font: fonts.sans400, size: 13.5, x: x + 18, y: cTop + 100 + j * 19, fill: t.text2 })),
    );
    // output tag
    const ow = measure(out, fonts.mono500, 10.5, 0.04) + 22;
    add(`<rect x="${r(x + 18)}" y="${cTop + cH - 30}" width="${r(ow)}" height="20" rx="10" fill="${t.accentSoft}" fill-opacity="${t.name === 'dark' ? 0.12 : 0.16}"/>`);
    add(text(out, { font: fonts.mono500, size: 10.5, x: x + 29, y: cTop + cH - 16.5, fill: t.accent, tracking: 0.04 }));
  });

  // ---------- consumers
  const kTop = bTop + bH + 40;
  add(`<path d="M${cxm} ${bTop + bH} V${kTop - 20}" stroke="${t.text3}" stroke-width="1.4"/>`);
  const consumers = [
    ['Decision-makers', 'briefs, alerts, scenarios'],
    ['AI agents', 'organizational context over API'],
    ['Audit & compliance', 'Explain Trail export'],
  ];
  const kw = (IW - cg * 2) / 3;
  const kH = 58;
  const fan = consumers.map((_, i) => M + i * (kw + cg) + kw / 2);
  add(`<path d="M${r(fan[0])} ${kTop - 8} V${kTop - 20} H${r(fan[2])} V${kTop - 8} M${cxm} ${kTop - 20} V${kTop - 8}" fill="none" stroke="${t.text3}" stroke-width="1.4"/>`);
  consumers.forEach(([a, b], i) => {
    const x = M + i * (kw + cg);
    add(arrowHead(fan[i], kTop - 1, 'down', t.text3, 5.5));
    add(`<rect x="${r(x)}" y="${kTop}" width="${r(kw)}" height="${kH}" rx="10" fill="${t.card}" stroke="${t.line}"/>`);
    add(text(a, { font: fonts.sans600, size: 15, x: x + kw / 2, y: kTop + 25, fill: t.text, anchor: 'middle' }));
    add(text(b, { font: fonts.sans400, size: 13, x: x + kw / 2, y: kTop + 44, fill: t.text2, anchor: 'middle' }));
  });

  // ---------- explain trail rail
  const rTop = kTop + kH + 22;
  const rH = 46;
  add(`<rect x="${M}" y="${rTop}" width="${IW}" height="${rH}" rx="10" fill="${t.accentSoft}" fill-opacity="${t.name === 'dark' ? 0.08 : 0.1}" stroke="${t.accent}" stroke-opacity="0.55"/>`);
  add(text('EXPLAIN TRAIL', { font: fonts.mono600, size: 12, x: M + 20, y: rTop + 28, fill: t.accent, tracking: 0.12 }));
  add(text('attached to every output: source utterances · labels · rules and models · versions', {
    font: fonts.sans400, size: 14, x: M + 150, y: rTop + 28.5, fill: t.text2,
  }));

  // ---------- feedback loop (right margin): consumers → engine
  const fx = W - 12;
  const fy1 = kTop + kH / 2;
  const fy2 = aTop + aH / 2;
  add(`<path d="M${W - M} ${fy1} H${fx} V${fy2} H${W - M + 7}" fill="none" stroke="${t.text3}" stroke-width="1.3" stroke-dasharray="4 4"/>`);
  add(arrowHead(W - M + 1, fy2, 'left', t.text3, 5.5));
  add(text('expert review feeds back as labels', {
    font: fonts.mono400, size: 10.5, x: W - M - 16, y: bTop - 14, fill: t.text3, anchor: 'end', tracking: 0.04,
  }));

  const H = rTop + rH + 36;
  add(text('fig. 3 — from the shared engine to one organization’s context engine', {
    font: fonts.mono400, size: 10.5, x: W - M, y: H - 12, fill: t.text3, anchor: 'end', tracking: 0.02,
  }));

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Architecture: sources flow into the Lumanic Engine (F·S·T semantic representation), then into an Enterprise Context Engine (context graph reasoning, decision ontology, decision intelligence), serving decision-makers, AI agents and auditors, with an Explain Trail on every output."><!--GLYPHS-->
${o.join('\n')}
</svg>`.replace('<!--GLYPHS-->', glyphDefs());
}
