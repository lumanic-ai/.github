// Lumanic mark: Spencer-Brown's sign of distinction turned into an "L",
// with a lit point in the marked space (a communication located by its coordinates).
import { themes, write } from './lib.mjs';

// Geometry on a 512 grid.
export const MARK = {
  stroke: 36,
  corner: { x: 150, y: 392 },
  top: 116,
  right: 396,
  dot: { x: 312, y: 202, r: 33 },
};

let uid = 0;
export function markGroup({ ink, accent, glow = 0.5, projections = true, id } = {}) {
  const m = MARK;
  const gid = id || `lmg${++uid}`;
  const half = m.stroke / 2;
  const L = `M${m.corner.x} ${m.top} V${m.corner.y} H${m.right}`;
  const proj = projections
    ? `<g stroke="${ink}" stroke-opacity="0.38" stroke-width="7" stroke-dasharray="13 11" fill="none">
         <path d="M${m.corner.x + half + 14} ${m.dot.y} H${m.dot.x - m.dot.r - 14}"/>
         <path d="M${m.dot.x} ${m.dot.y + m.dot.r + 14} V${m.corner.y - half - 14}"/>
       </g>`
    : '';
  return `
  <defs>
    <radialGradient id="${gid}" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${accent}" stop-opacity="${glow}"/>
      <stop offset="0.45" stop-color="${accent}" stop-opacity="${glow * 0.28}"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="${m.dot.x}" cy="${m.dot.y}" r="${m.dot.r * 3.6}" fill="url(#${gid})"/>
  ${proj}
  <path d="${L}" fill="none" stroke="${ink}" stroke-width="${m.stroke}" stroke-linecap="butt" stroke-linejoin="miter"/>
  <circle cx="${m.dot.x}" cy="${m.dot.y}" r="${m.dot.r}" fill="${accent}"/>`;
}

export function avatarSvg({ projections = true } = {}) {
  const t = themes.dark;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1024" height="1024">
  <rect width="512" height="512" fill="${t.bg}"/>
  <g transform="translate(-6 -4)">${markGroup({ ink: t.text, accent: t.accent, glow: 0.5, projections, id: 'av' })}</g>
</svg>`;
}
