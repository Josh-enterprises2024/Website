# Josh Enterprises — Website

React + Vite rebuild of the original static HTML/CSS/JS site.

## Structure

```
src/
  assets/              images (logo, cctv, ro, tv, inverter)
  Components/
    Landing/           navbar, hero, parallax CTA, about, contact, footer, floating widgets
      landing.jsx
      landing.css
    Items/              (left for you to build — products/services cards + spec modals)
  App.jsx               renders <Landing /> (add <Items /> here once ready)
  App.css
  index.css              global CSS variables, resets, shared buttons/animations
  main.jsx               React entry point
```

## Getting started

```bash
npm install
npm run dev
```

## Notes on the Items component

The old "Products" section (CCTV / RO / TV cards + the spec modals) was intentionally left
out of `Landing` so you can build it yourself in `src/Components/Items`.

- `Landing` renders an empty `<div id="products"></div>` placeholder so the navbar's
  "Products" link still scrolls to the right spot — put your `<Items />` markup there
  (in `App.jsx`) and give its wrapping element `id="products"` instead (then you can remove
  the placeholder div in `landing.jsx`).
- The product images (`cctv.png`, `ro.png`, `tv.png`, `inverter.png`) are already in
  `src/assets/` for you to import into `items.jsx`.
- Shared styles like `.btn-primary`, `.btn-text`, `.highlight`, and the CSS variables
  (`--primary-color`, `--shadow`, etc.) live in `src/index.css`, so `items.css` only needs
  product-card-specific styles (`.product-grid`, `.product-card`, `.modal`, etc. from the
  original `style.css`).
