# synth: portfolio

Personal portfolio for **synth** ([@synthalorian](https://github.com/synthalorian)), live at https://synthalorian.pages.dev. Synthwave look: deep violet plate, electric purple, cyan, an animated outrun sun and grid floor (CSS only, off under reduced motion), and a helm sprite dock.

Plain static files: HTML, CSS and a little vanilla JS (sprite dock and scroll reveal). No build step, no frameworks, no trackers, no runtime API calls.

## Structure

```
index.html            the whole site (project data is written into the page)
404.html              not-found page
assets/css/site.css   frame, scene, components
assets/css/motion.css all animation, inside prefers-reduced-motion
assets/js/            sprites.js (dock), reveal.js (scroll reveal)
assets/fonts/         self-hosted Space Grotesk, Inter, JetBrains Mono (SIL OFL, licences included)
assets/img/           official helm and warship art, cropped and resized only; sprite strips in sprites/synth/
_headers              Cloudflare Pages security and cache headers (no inline scripts)
```

## Run locally

```sh
python3 -m http.server 8000
```

Facts about each project were checked against its repository on Oct 25, 2026.
