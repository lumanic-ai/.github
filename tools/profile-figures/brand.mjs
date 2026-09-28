// Brand files: avatar source, mark, and mark + wordmark lockups for light and dark backgrounds.
import { beginDoc, glyphDefs, fonts, text, themes } from './lib.mjs';
import { markGroup, avatarSvg } from './mark.mjs';

export function markSvg(themeName) {
  const t = themes[themeName];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="96 64 352 384" width="352" height="384" role="img" aria-label="Lumanic mark">
${markGroup({ ink: t.text, accent: t.accent, glow: t.glow, projections: false, id: `bm-${t.name}` })}
</svg>`;
}

export function lockupSvg(themeName) {
  beginDoc();
  const t = themes[themeName];
  const s = 0.143;
  const word = text('Lumanic', { font: fonts.sans600, size: 46, x: 55, y: 56, fill: t.text, tracking: -0.01 });
  const W = Math.ceil(55 + word.width + 4);
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${W} 72" width="${W}" height="72" role="img" aria-label="Lumanic"><!--GLYPHS-->
<g transform="translate(-17 -2.6) scale(${s})">${markGroup({ ink: t.text, accent: t.accent, glow: t.glow, projections: false, id: `bl-${t.name}` })}</g>
${word.svg}
</svg>`.replace('<!--GLYPHS-->', glyphDefs());
}

export { avatarSvg };
