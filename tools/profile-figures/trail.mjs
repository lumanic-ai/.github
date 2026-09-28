// Fig. 4 — an Explain Trail: every output walks back to the exact quote. Illustrative.
import { beginDoc, glyphDefs, fonts, text, measure, themes, write, r } from './lib.mjs';

const W = 900;
const M = 28;
const IW = W - M * 2;

function head(x, y, dir, color, s = 6) {
  const p = dir === 'right'
    ? [[x, y], [x - s, y - s * 0.62], [x - s, y + s * 0.62]]
    : [[x, y], [x + s, y - s * 0.62], [x + s, y + s * 0.62]];
  return `<path d="M${p.map((q) => q.map(r).join(' ')).join(' L')} Z" fill="${color}"/>`;
}

function lines(str, font, size, maxW) {
  const out = [];
  let line = '';
  for (const w of str.split(' ')) {
    const tt = line ? line + ' ' + w : w;
    if (measure(tt, font, size) > maxW && line) {
      out.push(line);
      line = w;
    } else line = tt;
  }
  out.push(line);
  return out;
}

export function trail(themeName) {
  beginDoc();
  const t = themes[themeName];
  const o = [];
  const add = (s) => o.push(typeof s === 'string' ? s : s.svg);

  const n = 5;
  const gap = 16;
  const cw = (IW - gap * (n - 1)) / n;
  const top = 22;
  const ch = 218;

  const cards = [
    { k: 'SOURCE', id: 'u-0412' },
    { k: 'MEANING', id: 'F · S · T labels' },
    { k: 'REASONING', id: 'graph + rule' },
    { k: 'SIGNAL', id: 'scored' },
    { k: 'ACTION', id: 'for Finance review' },
  ];

  cards.forEach((c, i) => {
    const x = M + i * (cw + gap);
    const hi = i === 0 || i === n - 1;
    add(`<rect x="${r(x)}" y="${top}" width="${r(cw)}" height="${ch}" rx="11" fill="${t.card}" stroke="${hi ? t.accent : t.line}" stroke-opacity="${hi ? 0.7 : 1}"/>`);
    add(text(String(i + 1).padStart(2, '0'), { font: fonts.mono600, size: 11, x: x + 14, y: top + 26, fill: hi ? t.accent : t.text3 }));
    add(text(c.k, { font: fonts.mono600, size: 11, x: x + 36, y: top + 26, fill: t.text2, tracking: 0.1 }));
    if (i < n - 1) {
      const ax = x + cw + 3;
      add(`<path d="M${r(ax)} ${top + 22} H${r(ax + gap - 9)}" stroke="${t.text3}" stroke-width="1.4"/>`);
      add(head(ax + gap - 4, top + 22, 'right', t.text3, 4.5));
    }
  });

  const cx = (i) => M + i * (cw + gap);
  const inner = cw - 28;

  const foot = (x, a, b) => {
    add(text(a, { font: fonts.mono400, size: 10.5, x, y: top + ch - 32, fill: t.text3, tracking: 0.02 }));
    if (b) add(text(b, { font: fonts.mono400, size: 10.5, x, y: top + ch - 16, fill: t.text3, tracking: 0.02 }));
  };
  const lab = (s2, x, y) => add(text(s2, { font: fonts.mono500, size: 10, x, y, fill: t.text3, tracking: 0.1 }));

  // 1 SOURCE
  {
    const x = cx(0) + 14;
    add(text('u-0412', { font: fonts.mono600, size: 12, x, y: top + 54, fill: t.accent, tracking: 0.03 }));
    lines('\u201c\u2026Finance won\u2019t sign off without the savings case.\u201d', fonts.serif, 17.5, inner).forEach((l, j) =>
      add(text(l, { font: fonts.serif, size: 17.5, x, y: top + 82 + j * 22, fill: t.text })),
    );
    foot(x, 'steering mtg', 'ops lead \u00b7 Jun');
  }
  // 2 MEANING
  {
    const x = cx(1) + 14;
    const rows = [
      ['F', t.F, 'economy', 'not yet funded'],
      ['S', t.S, 'approval line', 'conditional'],
      ['T', t.T, 'deferred to Q3', 'uncertain'],
    ];
    rows.forEach(([k, c, a, b], j) => {
      const y = top + 48 + j * 42;
      add(`<rect x="${r(x)}" y="${y}" width="20" height="20" rx="5" fill="${c}" fill-opacity="0.15" stroke="${c}" stroke-opacity="0.6"/>`);
      add(text(k, { font: fonts.mono600, size: 11.5, x: x + 10, y: y + 14.3, fill: c, anchor: 'middle' }));
      add(text(a, { font: fonts.sans500, size: 13.5, x: x + 28, y: y + 10, fill: t.text }));
      add(text(b, { font: fonts.sans400, size: 12.5, x: x + 28, y: y + 26, fill: t.text2 }));
    });
    foot(x, 'model v0.3', 'confidence 0.87');
  }
  // 3 REASONING
  {
    const x = cx(2) + 14;
    add(text('Third deferral', { font: fonts.sans600, size: 15.5, x, y: top + 58, fill: t.text }));
    add(text('of the same issue', { font: fonts.sans400, size: 13, x, y: top + 78, fill: t.text2 }));
    add(text('since March', { font: fonts.sans400, size: 13, x, y: top + 95, fill: t.text2 }));
    lab('LINKED', x, top + 124);
    add(text('u-0291 deferral', { font: fonts.mono400, size: 10.5, x, y: top + 141, fill: t.text2 }));
    add(text('u-0377 objection', { font: fonts.mono400, size: 10.5, x, y: top + 157, fill: t.text2 }));
    foot(x, 'graph path', '3 hops');
  }
  // 4 SIGNAL
  {
    const x = cx(3) + 14;
    add(text('Stalled decision', { font: fonts.sans600, size: 15.5, x, y: top + 58, fill: t.text }));
    lab('SEVERITY', x, top + 86);
    [0, 1, 2].forEach((j) =>
      add(`<rect x="${r(x + j * 27)}" y="${top + 94}" width="22" height="7" rx="3.5" fill="${j < 2 ? t.accent : t.line}"/>`),
    );
    add(text('2 / 3', { font: fonts.mono400, size: 10.5, x: x + 86, y: top + 101, fill: t.text2 }));
    lab('DEADLINE', x, top + 130);
    add(text('renewal Sep 30', { font: fonts.sans400, size: 13, x, y: top + 148, fill: t.text2 }));
    foot(x, 'rule stalled', 'v1.2');
  }
  // 5 ACTION
  {
    const x = cx(4) + 14;
    lines('Put the savings case on the July Finance review.', fonts.sans600, 14.5, inner).forEach((l, j) =>
      add(text(l, { font: fonts.sans600, size: 14.5, x, y: top + 58 + j * 20, fill: t.text })),
    );
    lab('EVIDENCE', x, top + 130);
    add(text('3 utterances,', { font: fonts.sans400, size: 13, x, y: top + 148, fill: t.text2 }));
    add(text('1 contract date', { font: fonts.sans400, size: 13, x, y: top + 165, fill: t.text2 }));
    foot(x, 'human sign-off', 'pending');
  }

  // trace-back arrow under the chain
  const by = top + ch + 30;
  const x1 = cx(4) + cw / 2;
  const x0 = cx(0) + cw / 2;
  add(`<path d="M${r(x1)} ${top + ch + 2} V${by} H${r(x0 + 8)}" fill="none" stroke="${t.accent}" stroke-width="1.5" stroke-dasharray="5 4"/>`);
  add(`<path d="M${r(x0)} ${by} V${top + ch + 8}" fill="none" stroke="${t.accent}" stroke-width="1.5"/>`);
  add(`<path d="M${r(x0)} ${top + ch + 2} L${r(x0 - 4)} ${top + ch + 9} L${r(x0 + 4)} ${top + ch + 9} Z" fill="${t.accent}"/>`);
  add(`<path d="M${r(x0 + 8)} ${by} H${r(x0)}" stroke="${t.accent}" stroke-width="1.5"/>`);
  const msg = 'any output traces back to the exact quote, its labels, the rule, and versions';
  const mw = measure(msg, fonts.mono400, 11, 0.02);
  add(`<rect x="${r(W / 2 - mw / 2 - 12)}" y="${by - 11}" width="${r(mw + 24)}" height="22" rx="11" fill="${t.bg}"/>`);
  add(text(msg, { font: fonts.mono400, size: 11, x: W / 2, y: by + 4, fill: t.accent, anchor: 'middle', tracking: 0.02 }));

  const H = by + 42;
  add(text('fig. 4 — an Explain Trail, illustrative', {
    font: fonts.mono400, size: 10.5, x: W - M, y: H - 8, fill: t.text3, anchor: 'end', tracking: 0.02,
  }));

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Explain Trail: source utterance, meaning labels, reasoning, signal and recommendation, each traceable back to the exact quote."><!--GLYPHS-->
<rect width="${W}" height="${H}" fill="none"/>
${o.join('\n')}
</svg>`.replace('<!--GLYPHS-->', glyphDefs());
}
