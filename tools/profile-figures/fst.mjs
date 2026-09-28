// Fig. 2 — one utterance decomposed into Factual / Social / Temporal meaning,
// then linked into the context graph. Illustrative enterprise example.
import { beginDoc, glyphDefs, fonts, text, measure, themes, write, r } from './lib.mjs';

const W = 900;

export function fst(themeName) {
  beginDoc();
  const t = themes[themeName];
  const out = [];
  const add = (s) => out.push(typeof s === 'string' ? s : s.svg);

  // ---------- utterance card
  const cx = 28, cy = 20, cw = W - 56, ch = 150;
  add(`<rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" rx="12" fill="${t.card}" stroke="${t.line}"/>`);
  add(text('u-0412', { font: fonts.mono600, size: 12.5, x: cx + 24, y: cy + 32, fill: t.accent, tracking: 0.04 }));
  add(text('WEEKLY STEERING MEETING  ·  SPEAKER: OPERATIONS LEAD', {
    font: fonts.mono400, size: 12, x: cx + 24 + 62, y: cy + 32, fill: t.text3, tracking: 0.06,
  }));

  // quote as colored spans (dimension underlines)
  const QS = 29;
  const lines = [
    [
      ['“Let’s hold the ', null],
      ['vendor switch', 'F'],
      [' ', null],
      ['until Q3', 'T'],
      [' —', null],
    ],
    [
      ['Finance won’t sign off', 'S'],
      [' without the savings case.”', null],
    ],
  ];
  lines.forEach((spans, li) => {
    let x = cx + 22;
    const y = cy + 80 + li * 40;
    for (const [s, dim] of spans) {
      const w = measure(s, fonts.serif, QS, -0.005);
      add(text(s, { font: fonts.serif, size: QS, x, y, fill: t.text, tracking: -0.005 }));
      if (dim) {
        add(`<rect x="${r(x)}" y="${y + 7}" width="${r(w)}" height="3" rx="1.5" fill="${t[dim]}"/>`);
      }
      // keep a little air between spans (the space glyph already provides it)
      x += w + measure(' ', fonts.serif, QS) * 0;
    }
  });

  // ---------- three columns
  const top = cy + ch + 34;
  const gap = 18;
  const colW = (W - 56 - gap * 2) / 3;
  const colH = 262;
  const cols = [
    {
      k: 'F', name: 'Factual', q: 'What is at stake?',
      rows: [
        ['ISSUE', 'Vendor switch'],
        ['FUNCTION SYSTEM', 'Economy'],
        ['POSITION ON ITS CODE', 'Non-payment: not yet funded'],
        ['DECISION ON THE MATTER', 'Deferred'],
      ],
    },
    {
      k: 'S', name: 'Social', q: 'Who stands where, and why?',
      rows: [
        ['RELATION', 'Operations reports to Finance'],
        ['STANCE', 'Conditional compliance'],
        ['GROUNDS OF JUDGMENT', 'Procedure: sign-off rule'],
        ['DECISION ON THE RELATION', 'Accepts Finance’s veto'],
      ],
    },
    {
      k: 'T', name: 'Temporal', q: 'What changes, and when?',
      rows: [
        ['BEFORE', 'Switch planned for Q2'],
        ['AFTER', 'Moved to Q3'],
        ['OUTLOOK', 'Uncertain, conditional'],
        ['TRIGGER', 'The savings case'],
      ],
    },
  ];

  cols.forEach((c, i) => {
    const x = cx + i * (colW + gap);
    const color = t[c.k];
    // connector from quote card to column
    const midx = x + colW / 2;
    add(`<path d="M${r(midx)} ${cy + ch} V${top}" stroke="${color}" stroke-width="1.5" stroke-dasharray="3 4"/>`);
    add(`<circle cx="${r(midx)}" cy="${cy + ch}" r="3.5" fill="${color}"/>`);
    const clip = `fc-${t.name}-${c.k}`;
    add(`<clipPath id="${clip}"><rect x="${r(x)}" y="${top}" width="${r(colW)}" height="${colH}" rx="12"/></clipPath>`);
    add(`<rect x="${r(x)}" y="${top}" width="${r(colW)}" height="${colH}" rx="12" fill="${t.card}"/>`);
    add(`<rect x="${r(x)}" y="${top}" width="${r(colW)}" height="4" fill="${color}" clip-path="url(#${clip})"/>`);
    add(`<rect x="${r(x) + 0.5}" y="${top + 0.5}" width="${r(colW) - 1}" height="${colH - 1}" rx="11.5" fill="none" stroke="${t.line}"/>`);
    // badge
    add(`<rect x="${r(x + 20)}" y="${top + 22}" width="30" height="30" rx="7" fill="${color}" fill-opacity="0.14" stroke="${color}" stroke-opacity="0.6"/>`);
    add(text(c.k, { font: fonts.mono600, size: 16, x: x + 35, y: top + 43, fill: color, anchor: 'middle' }));
    add(text(c.name, { font: fonts.sans600, size: 18, x: x + 62, y: top + 43, fill: t.text }));
    add(text(c.q, { font: fonts.serifItalic, size: 19.5, x: x + 20, y: top + 80, fill: t.text2 }));
    c.rows.forEach(([k, v], j) => {
      const y = top + 118 + j * 38;
      add(text(k, { font: fonts.mono500, size: 10.5, x: x + 20, y, fill: t.text3, tracking: 0.07 }));
      add(text(v, { font: fonts.sans500, size: 15, x: x + 20, y: y + 19, fill: t.text }));
    });
  });

  // ---------- context strip: this utterance in the graph
  const sy = top + colH + 34;
  add(text('IN THE CONTEXT GRAPH', { font: fonts.mono500, size: 11, x: cx, y: sy, fill: t.text3, tracking: 0.12 }));
  const nodes = [
    ['u-0291', 'Mar', 'First deferral'],
    ['u-0377', 'May', 'Finance objection'],
    ['u-0412', 'Jun', 'This utterance', true],
    ['contract', 'Sep 30', 'Vendor renewal date'],
  ];
  const ny = sy + 38;
  const span = W - 56;
  const nx = (k) => cx + 70 + (k * (span - 140)) / (nodes.length - 1);
  add(`<path d="M${r(nx(0))} ${ny} H${r(nx(nodes.length - 1))}" stroke="${t.line}" stroke-width="1.5"/>`);
  // edge labels
  const edges = ['NEXT', 'NEXT', 'DEADLINE'];
  edges.forEach((e, k) => {
    const mx = (nx(k) + nx(k + 1)) / 2;
    add(text(e, { font: fonts.mono400, size: 10, x: mx, y: ny - 8, fill: t.text3, anchor: 'middle', tracking: 0.08 }));
  });
  nodes.forEach(([id, when, label, hi], k) => {
    const x = nx(k);
    if (hi) {
      add(`<circle cx="${r(x)}" cy="${ny}" r="14" fill="${t.accentSoft}" fill-opacity="${t.glow * 0.45}"/>`);
      add(`<circle cx="${r(x)}" cy="${ny}" r="6.5" fill="${t.accent}"/>`);
    } else {
      add(`<circle cx="${r(x)}" cy="${ny}" r="5.5" fill="${t.card}" stroke="${t.text2}" stroke-width="1.5"/>`);
    }
    add(text(`${id} · ${when}`, { font: fonts.mono500, size: 11, x, y: ny + 30, fill: hi ? t.accent : t.text2, anchor: 'middle', tracking: 0.03 }));
    add(text(label, { font: fonts.sans500, size: 13.5, x, y: ny + 50, fill: t.text, anchor: 'middle' }));
  });

  const H = ny + 92;
  add(text('fig. 2 — illustrative example', {
    font: fonts.mono400, size: 10.5, x: W - 28, y: H - 14, fill: t.text3, anchor: 'end', tracking: 0.02,
  }));

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="One utterance decomposed into Factual, Social and Temporal meaning, then linked into the context graph."><!--GLYPHS-->
${out.join('\n')}
</svg>`.replace('<!--GLYPHS-->', glyphDefs());
}
