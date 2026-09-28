// Shared helpers: fonts -> outlined SVG text, themes, small drawing utilities.
import fs from 'node:fs';
import path from 'node:path';
import opentype from 'opentype.js';

const F = (pkg, file) =>
  path.join(process.cwd(), 'node_modules/@fontsource', pkg, 'files', file);

const load = (p) => opentype.parse(fs.readFileSync(p).buffer);

export const fonts = {
  sans400: load(F('instrument-sans', 'instrument-sans-latin-400-normal.woff')),
  sans500: load(F('instrument-sans', 'instrument-sans-latin-500-normal.woff')),
  sans600: load(F('instrument-sans', 'instrument-sans-latin-600-normal.woff')),
  sans700: load(F('instrument-sans', 'instrument-sans-latin-700-normal.woff')),
  serif: load(F('instrument-serif', 'instrument-serif-latin-400-normal.woff')),
  serifItalic: load(F('instrument-serif', 'instrument-serif-latin-400-italic.woff')),
  mono400: load(F('jetbrains-mono', 'jetbrains-mono-latin-400-normal.woff')),
  mono500: load(F('jetbrains-mono', 'jetbrains-mono-latin-500-normal.woff')),
  mono600: load(F('jetbrains-mono', 'jetbrains-mono-latin-600-normal.woff')),
};

const r2 = (n) => Math.round(n * 100) / 100;

// Measure text width (px) with kerning and tracking (tracking in em).
export function measure(str, font, size, tracking = 0) {
  const glyphs = [...str].map((ch) => font.charToGlyph(ch));
  const scale = size / font.unitsPerEm;
  let w = 0;
  for (let i = 0; i < glyphs.length; i++) {
    w += glyphs[i].advanceWidth * scale;
    if (i < glyphs.length - 1) {
      w += kern(font, glyphs[i], glyphs[i + 1]) * scale;
      w += tracking * size;
    }
  }
  return w;
}

function kern(font, a, b) {
  try {
    if (font.position && typeof font.position.getKerningValue === 'function') {
      const k = font.position.getKerningValue(
        font.position.getKerningTables?.('latn') ?? [],
        a.index,
        b.index,
      );
      if (k) return k;
    }
  } catch (_) {}
  try {
    return font.getKerningValue(a, b) || 0;
  } catch (_) {
    return 0;
  }
}

// ---- glyph registry: each glyph outline is defined once per SVG (in font units) and reused via <use>.
const fontKey = new Map(Object.entries(fonts).map(([k, f], i) => [f, 'abcdefghijklmnop'[i]]));
let defs = new Map();
export function beginDoc() {
  defs = new Map();
}
export function glyphDefs() {
  if (!defs.size) return '';
  return `<defs>${[...defs.entries()].map(([id, d]) => `<path id="${id}" d="${d}"/>`).join('')}</defs>`;
}
function relPath(p) {
  // integer font units, relative commands
  let d = '';
  let cx = 0, cy = 0, sx = 0, sy = 0;
  const R = (n) => Math.round(n);
  for (const c of p.commands) {
    if (c.type === 'M') {
      const x = R(c.x), y = R(c.y);
      d += `m${x - cx} ${y - cy}`;
      cx = sx = x; cy = sy = y;
    } else if (c.type === 'L') {
      const x = R(c.x), y = R(c.y);
      d += `l${x - cx} ${y - cy}`;
      cx = x; cy = y;
    } else if (c.type === 'Q') {
      const x1 = R(c.x1), y1 = R(c.y1), x = R(c.x), y = R(c.y);
      d += `q${x1 - cx} ${y1 - cy} ${x - cx} ${y - cy}`;
      cx = x; cy = y;
    } else if (c.type === 'C') {
      const x1 = R(c.x1), y1 = R(c.y1), x2 = R(c.x2), y2 = R(c.y2), x = R(c.x), y = R(c.y);
      d += `c${x1 - cx} ${y1 - cy} ${x2 - cx} ${y2 - cy} ${x - cx} ${y - cy}`;
      cx = x; cy = y;
    } else if (c.type === 'Z') {
      d += 'z';
      cx = sx; cy = sy;
    }
  }
  if (/NaN/.test(d)) throw new Error('NaN in glyph path');
  return d.replace(/ -/g, '-');
}
function glyphRef(font, g) {
  const id = fontKey.get(font) + g.index;
  if (!defs.has(id)) {
    const p = g.getPath(0, 0, font.unitsPerEm);
    if (!p.commands.length) return null;
    defs.set(id, relPath(p));
  }
  return id;
}

function assertGlyphs(str, font) {
  for (const ch of str) {
    const g = font.charToGlyph(ch);
    if (!g || g.index === 0) throw new Error(`missing glyph ${JSON.stringify(ch)} (U+${ch.codePointAt(0).toString(16)}) in "${str}"`);
  }
}

const n2 = (v) => String(Math.round(v * 100) / 100);

// Outlined text: <g transform=translate+scale> of <use> glyph refs. anchor: start | middle | end
export function text(str, o) {
  assertGlyphs(str, o.font);
  const { font, size, x = 0, y = 0, anchor = 'start', tracking = 0, fill = '#000', opacity, cls } = o;
  const glyphs = [...str].map((ch) => font.charToGlyph(ch));
  const scale = size / font.unitsPerEm;
  const width = measure(str, font, size, tracking);
  const x0 = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x;
  let u = 0; // font units
  let uses = '';
  for (let i = 0; i < glyphs.length; i++) {
    const g = glyphs[i];
    const id = glyphRef(font, g);
    if (id) uses += `<use xlink:href="#${id}"${u ? ` x="${Math.round(u)}"` : ''}/>`;
    u += g.advanceWidth;
    if (i < glyphs.length - 1) u += kern(font, g, glyphs[i + 1]) + tracking * font.unitsPerEm;
  }
  const attrs = [
    `transform="translate(${n2(x0)} ${n2(y)}) scale(${Number(scale.toFixed(6))})"`,
    `fill="${fill}"`,
    opacity !== undefined ? `fill-opacity="${opacity}"` : '',
    cls ? `class="${cls}"` : '',
  ].filter(Boolean).join(' ');
  return { svg: `<g ${attrs}>${uses}</g>`, width };
}

// Wrap text into lines that fit maxWidth.
export function wrap(str, font, size, maxWidth, tracking = 0) {
  const words = str.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const t = line ? line + ' ' + w : w;
    if (measure(t, font, size, tracking) <= maxWidth || !line) line = t;
    else {
      lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function paragraph(str, o) {
  const { maxWidth, lineHeight, font, size, tracking = 0 } = o;
  const lines = wrap(str, font, size, maxWidth, tracking);
  return {
    svg: lines
      .map((l, i) => text(l, { ...o, y: o.y + i * lineHeight }).svg)
      .join(''),
    lines: lines.length,
    height: lines.length * lineHeight,
  };
}

export const themes = {
  dark: {
    name: 'dark',
    bg: '#0A0D12',
    card: '#0F141B',
    cardAlt: '#131A23',
    line: '#27303C',
    lineSoft: '#1B222C',
    text: '#E9ECF1',
    text2: '#A3ADBB',
    text3: '#6E7887',
    accent: '#F5B83D',
    accentSoft: '#F5B83D',
    F: '#7DB0FF',
    S: '#FF8FA6',
    T: '#62D6B4',
    glow: 0.55,
  },
  light: {
    name: 'light',
    bg: '#FBFAF7',
    card: '#FFFFFF',
    cardAlt: '#F5F3EE',
    line: '#DAD6CC',
    lineSoft: '#E9E6DE',
    text: '#12151A',
    text2: '#4A5260',
    text3: '#7A8290',
    accent: '#D9900F',
    accentSoft: '#F2B544',
    F: '#2F6BE0',
    S: '#D23A60',
    T: '#12906F',
    glow: 0.35,
  },
};

export const r = r2;

export function write(file, svg) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, svg.replace(/\n\s+/g, '\n'));
  return file;
}
