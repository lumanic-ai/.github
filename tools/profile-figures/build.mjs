// Regenerates every figure used by profile/README.md, plus the brand files.
//   cd tools/profile-figures && npm install && npm run build
// The "Build profile figures" workflow runs the same build on every change to this folder.
import fs from 'node:fs';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import { write } from './lib.mjs';
import { hero } from './hero.mjs';
import { fst } from './fst.mjs';
import { arch } from './arch.mjs';
import { trail } from './trail.mjs';
import { markSvg, lockupSvg, avatarSvg } from './brand.mjs';

const root = path.resolve(process.argv[2] || '../..');
const assets = path.join(root, 'profile/assets');
const brand = path.join(root, 'brand');

for (const theme of ['dark', 'light']) {
  write(path.join(assets, `hero-${theme}.svg`), hero(theme));
  write(path.join(assets, `fst-${theme}.svg`), fst(theme));
  write(path.join(assets, `arch-${theme}.svg`), arch(theme));
  write(path.join(assets, `trail-${theme}.svg`), trail(theme));
  write(path.join(brand, `lumanic-mark-on-${theme}.svg`), markSvg(theme));
  write(path.join(brand, `lumanic-lockup-on-${theme}.svg`), lockupSvg(theme));
}

const avatar = avatarSvg({ projections: false });
write(path.join(brand, 'lumanic-avatar.svg'), avatar);
const png = new Resvg(avatar, { fitTo: { mode: 'width', value: 512 } }).render().asPng();
fs.writeFileSync(path.join(brand, 'lumanic-avatar.png'), png);

console.log(`figures written to ${assets}\nbrand files written to ${brand}`);
