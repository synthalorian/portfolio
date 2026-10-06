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
- **Stack**: language bars use `style="--w:NN%"` (relative to the largest count); chips and domains are plain lists.
- **Contact**: the `contact-links` list near the bottom.

Data came from public GitHub metadata and READMEs as of October 2026. Star counts and versions are static. Update them by hand when you want to.

## Deploying (Cloudflare Pages)

Connect this repo in Cloudflare Pages. Use framework preset **None** and leave the build command **empty**. Set the output directory to `/`.
If your project ends up with a different `*.pages.dev` address (or a custom domain), replace `https://synthalorian.pages.dev/`
in `index.html` (canonical, Open Graph, JSON-LD), `robots.txt`, and `sitemap.xml`.
