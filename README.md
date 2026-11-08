# Poosapati Harshini — Portfolio

A "marginalia" style portfolio: big Playfair display type on warm paper, periwinkle
handwritten annotations and ruled doodles, one fixed marginal bar that tracks how far
you've read.

Static site — no build step. Open `index.html`, or serve the folder:

```bash
npx serve .          # or: python3 -m http.server 5173
```

## Pages

| file | what it is |
| --- | --- |
| `index.html` | the portfolio (cover → hello → education → skills → projects → fun facts → thank you) |
| `cv.html` | the plain curriculum vitae, print-friendly (`⌘/Ctrl + P` → save as PDF) |

## Structure

```
assets/fonts/   Playfair Display, Inter, Caveat, IBM Plex Mono (self-hosted woff2)
assets/img/     portrait, project shots, QR code, favicon
css/style.css   all styling — design tokens live in :root
js/main.js      scroll reveal, doodle draw-in, reading progress, section label
```

## Editing content

- Text lives directly in `index.html` / `cv.html`.
- Colours, type scale and spacing are CSS custom properties at the top of `css/style.css`
  (`--paper`, `--ink`, `--violet`, `--serif`, `--hand`, `--mono`).
- The handwritten annotations are ordinary markup: `.lbl` + an inline SVG arrow that
  uses the shared `.stroke` / `.draw` classes.
- Project images were generated as mockups and can be swapped for real screenshots by
  replacing files in `assets/img/` (keep the same names).

Fonts are vendored from `@fontsource`, so the page works offline.
