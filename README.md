# synth — portfolio

Personal portfolio for **synth** ([@synthalorian](https://github.com/synthalorian)).
Plain static files — HTML, CSS, a little vanilla JS. No build step, no frameworks, no trackers, no runtime API calls.

## Structure

```
index.html              the whole site (all project data is hardcoded here)
404.html                not-found page
favicon.svg             shield + claw mark
apple-touch-icon.png    180×180 icon
assets/css/style.css    all styles (palette variables at the top)
assets/js/main.js       mobile nav, section highlight, scroll reveal, "More work" expand/collapse
assets/fonts/           self-hosted Cinzel, Inter, JetBrains Mono (SIL OFL 1.1)
assets/img/             avatar + Open Graph card
assets/img/mods/        Skyrim mod cover thumbnails (640×360, WebP + JPEG fallback)
_headers                Cloudflare Pages security and cache headers
robots.txt, sitemap.xml
```

## Run locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

Paths are root-relative (`/assets/...`), so serve from the repo root and don't open the file directly.

## Editing projects

Everything lives in `index.html`:

- **Featured projects**: the six `<article class="card panel">` blocks under `<section id="work">`. To swap one, copy a card and
  edit the title, repo link, description, three bullet points, tags, and the meta line (language · stars · version or date).
  Each card has an `id` (e.g. `#project-voidengine`) so you can deep-link to it.
- **More work**: the `<details class="work-group">` blocks. Each repo is one line:
  ```html
  <li><a href="https://github.com/synthalorian/REPO">REPO</a><span class="w-desc">One-line description.</span><span class="w-lang">Rust</span></li>
  ```
  Update the number in `<span class="wg-count">` and the "N more public repositories" line if you add or remove entries.
- **Skyrim mods**: `<section id="mods">`. A spec panel, then three waves of five `<article class="card panel mod-card">` cards. The
  first card of each wave has `is-lead` (spans two columns, art beside the text, three bullet points). Each card links to its Nexus
  page and GitHub repo. Thumbnails live in `assets/img/mods/<repo>.webp` and `.jpg`, 640×360, lazy-loaded. Cards say "early beta"
  instead of a version number on purpose, so they don't go stale when a mod is updated. The mod repos are not repeated in "More work".
- **Stack**: language bars use `style="--w:NN%"` (relative to the largest count); chips and domains are plain lists.
- **Contact**: the `contact-links` list near the bottom.

Data came from public GitHub metadata and READMEs as of October 2026. Star counts and versions are static. Update them by hand when you want to.

## Animations

All motion is CSS (transform, opacity, clip-path only) with small helpers in `assets/js/main.js`:

- **Hero intro** (~1.1s, once per load): the shield mark strikes in, a blood slash cuts the name in, a steel glint passes over it, and the rest of the hero follows.
- **Section headings**: a diagonal cut with a spark at the edge, then the red rule draws in.
- **Project cards**: lock in with a slight rotation and settle. On hover or keyboard focus they lift, glow, and get one steel shine pass.
- **"More work"**: groups reveal on scroll and their labels type on.
- **Scroll progress**: a rail on the left edge (a top bar on small screens).
- **Hero smoke and embers**: drift a few pixels with the mouse (fine pointers only) and pause when off screen.

Everything is disabled under `prefers-reduced-motion`, and nothing is hidden without JavaScript.

A one-line inline script in `<head>` adds the `js` class before first paint. `_headers` allows it by its SHA-256 hash, so if you
change that script, update the `'sha256-…'` value in the Content-Security-Policy. If the hash doesn't match, the browser blocks the
script, and the site still works but reveals start slightly later.

## Cache busting

`_headers` caches `/assets/*` for a day, so the CSS and JS URLs in `index.html` and `404.html` carry a `?v=` token. Change it
whenever `style.css` or `main.js` changes (any fresh value works; the current one is the first 7 hex characters of
`cat assets/css/style.css assets/js/main.js | sha256sum`).

## Deploying (Cloudflare Pages)

Connect this repo in Cloudflare Pages. Use framework preset **None** and leave the build command **empty**. Set the output directory to `/`.
If your project ends up with a different `*.pages.dev` address (or a custom domain), replace `https://synthalorian.pages.dev/`
in `index.html` (canonical, Open Graph, JSON-LD), `robots.txt`, and `sitemap.xml`.
