# FLASH Research Website

A professional, responsive project website for:

> FLASH: A “Generate Once, Synthesize Many” Framework for Synthetic Anomaly Generation in Industrial Anomaly Detection

The site contains the paper-grounded project overview, five-stage methodology, benchmark results, qualitative figures, per-category synthesis sheets, resources, and review-stage citation.

## Important review status

The included manuscript is labeled as a confidential WACV 2027 Applications Track review copy (Paper #2035). Share this package only with an authorized recipient. Update the anonymous author and venue metadata when the paper's review status changes.

## Requirements

- Node.js 20 or newer
- npm 10 or newer

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production build

```bash
npm run build
npm run test:sites
```

The production client is generated in `dist/client`. The build also creates the worker files required by the included hosting configuration.

## Project structure

```text
src/
  App.jsx          Pages, routing, components, and research content
  styles.css       Responsive visual system and layouts
public/
  figures/         Figures extracted from the supplied manuscript
  FLASH-research-paper.pdf
scripts/           Production packaging helper
tests/             Hosting-worker tests
worker/            Static hosting worker
```

## Push to a Git repository

After extracting the archive:

```bash
git init
git add .
git commit -m "Initial FLASH research website"
git branch -M main
git remote add origin <your-repository-url>
git push -u origin main
```

Before publishing publicly, confirm that the manuscript, anonymous repository link, author information, and confidential-review notice are appropriate for the intended audience.

## Development notes

- The application uses React and Vite.
- Routes are implemented client-side: `/`, `/method`, `/results`, `/visuals`, and `/resources`.
- Research figures open in reusable lightbox components.
- The layout is verified for desktop and 390px mobile viewports.
- Replace review-stage metadata in `src/App.jsx` when final publication details become available.
