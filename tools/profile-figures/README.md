# profile-figures

Generates the figures in `profile/assets/` and the files in `brand/`.

```sh
npm install
npm run build
```

You rarely need to run it by hand: the **Build profile figures** workflow (`.github/workflows/profile-figures.yml`) runs the same build on every push that touches this folder and commits the regenerated files.

Every figure is written twice, once per GitHub theme (`-dark`, `-light`), and the profile README switches between them with `<picture>` and `prefers-color-scheme`. Text is converted to outlines, so the figures look the same on every machine without web fonts. Each glyph is defined once per file and reused, which keeps a figure under 90 KB.

| File | Figure |
|---|---|
| `hero.mjs` | Banner: thesis and one utterance located in F·S·T space |
| `fst.mjs` | Fig. 2: one utterance decomposed into three dimensions, then placed in the context graph |
| `arch.mjs` | Fig. 3: Lumanic Engine to Enterprise Context Engine |
| `trail.mjs` | Fig. 4: an Explain Trail |
| `brand.mjs`, `mark.mjs` | Mark, lockups and avatar source |
| `lib.mjs` | Fonts, outlined text, color tokens for both themes |

To change copy, edit the strings in the figure's file and rebuild. Colors live in `themes` in `lib.mjs`. The avatar PNG in `brand/` is a 512 px render of `brand/lumanic-avatar.svg`, made with resvg.

Fonts: Instrument Sans and Instrument Serif (Rodrigo Fuenzalida, Jordan Egstad) and JetBrains Mono, all under the SIL Open Font License, installed from Fontsource.
