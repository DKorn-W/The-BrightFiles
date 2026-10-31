# The Bright Files

A personal hub for projects (CAD, analysis, code, science, papers). Static site, no build step: open `index.html`.

## Add a project
Open `js/data.js`, copy one object in `PROJECTS`, change `id`, texts and colours. Sections:
- `overview`: the graphical landing page of the project
- `docs`: theory pages (Project > Documentation > 1, 2, 3…)
- `process`: how it was done

Link from any text to a theory page: `[[doc:cam|what is a cam?]]`
Link to another project: `[[p:heliox/docs/fin-efficiency|fin efficiency]]`
Inline math `$x^2$`, bold `**x**`.

Block types: `p`, `stats`, `formula`, `callout`, `steps`, `parts`, `chart`, `figure`, `image`, `calc` (see top of `data.js`).

## Gallery
Add entries to `GALLERY`. Set `src: 'images/file.png'` to use a real image (put it in an `images/` folder); otherwise generated art is shown.

## Notes
- Projects flagged `template: true` hold sample data, so delete or replace them.
- Formulas use KaTeX from a CDN (needs internet); fonts come from Google Fonts.
- The chat button only opens a window. It is a visual placeholder and does not respond.
- Search: press `/` or `Ctrl+K`.
