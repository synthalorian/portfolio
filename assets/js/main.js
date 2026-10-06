/* synth — portfolio. Small progressive enhancements only; the page works without JS. */
(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.remove("no-js");
  window.__synthReveal = true; // tells the <head> boot script's failsafe that reveals are wired up

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Mobile navigation
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      nav.classList.toggle("is-open", open);
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  // "More work": start with the first few groups open (all open without JS),
  // and offer a single expand/collapse-all control.
  var groups = Array.prototype.slice.call(document.querySelectorAll(".work-group"));
  var moreToggle = document.querySelector(".more-toggle");
  if (groups.length) {
    var keepOpen = window.matchMedia("(max-width: 640px)").matches ? 1 : 2;
    groups.forEach(function (g, i) { g.open = i < keepOpen; });
    if (moreToggle) {
      var sync = function () {
        var allOpen = groups.every(function (g) { return g.open; });
        moreToggle.textContent = allOpen ? "Collapse all" : "Expand all";
        moreToggle.setAttribute("aria-pressed", String(allOpen));
      };
      moreToggle.hidden = false;
      moreToggle.addEventListener("click", function () {
        var open = !groups.every(function (g) { return g.open; });
        groups.forEach(function (g) { g.open = open; });
        sync();
      });
      groups.forEach(function (g) { g.addEventListener("toggle", sync); });
      sync();
    }
  }

  // Highlight the nav link for the section in view.
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  if ("IntersectionObserver" in window && links.length) {
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute("aria-current"); });
        var a = byId[entry.target.id];
        if (a) a.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  // Reveal on scroll: fade + slide up once, with a light stagger for items that
  // enter together. The hidden state only exists under html.js (set in <head>),
  // which is never set for reduced motion, so content is visible without JS.
  var canAnimate = !reduceMotion && "IntersectionObserver" in window;
  if (canAnimate) {
    root.classList.add("js"); // no-op if the boot script already ran
    var byDomOrder = function (a, b) {
      return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    };
    var io = new IntersectionObserver(function (entries) {
      var batch = [];
      entries.forEach(function (entry) { if (entry.isIntersecting) batch.push(entry.target); });
      batch.sort(byDomOrder).forEach(function (el, i) {
        el.style.setProperty("--rd", Math.min(i, 5) * 70 + "ms");
        el.classList.add("is-in");
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.01 });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

    // Pause the hero smoke/embers while the hero is off screen.
    var hero = document.querySelector(".hero");
    if (hero) {
      new IntersectionObserver(function (entries) {
        hero.classList.toggle("is-offscreen", !entries[0].isIntersecting);
      }).observe(hero);
    }

    // Scroll progress (left rail on desktop, top bar on small screens).
    var bar = document.querySelector(".scroll-progress");
    if (bar) {
      var barQueued = false;
      var paintBar = function () {
        barQueued = false;
        var max = document.documentElement.scrollHeight - window.innerHeight;
        var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        bar.style.setProperty("--p", p.toFixed(4));
      };
      var queueBar = function () {
        if (!barQueued) { barQueued = true; window.requestAnimationFrame(paintBar); }
      };
      window.addEventListener("scroll", queueBar, { passive: true });
      window.addEventListener("resize", queueBar, { passive: true });
      paintBar();
    }

    // Smoke/embers drift a few px with the pointer. Fine pointers only, rAF-throttled,
    // ignored while the hero is off screen.
    var portrait = document.querySelector(".hero-portrait");
    if (portrait && hero && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      var px = 0, py = 0, pQueued = false;
      var paintParallax = function () {
        pQueued = false;
        portrait.style.setProperty("--px", px.toFixed(3));
        portrait.style.setProperty("--py", py.toFixed(3));
      };
      document.addEventListener("pointermove", function (e) {
        if (e.pointerType !== "mouse" || hero.classList.contains("is-offscreen")) return;
        var r = portrait.getBoundingClientRect();
        px = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)));
        py = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2)));
        if (!pQueued) { pQueued = true; window.requestAnimationFrame(paintParallax); }
      }, { passive: true });
    }

    // Step count for the "More work" label type-on.
    document.querySelectorAll(".wg-title").forEach(function (t) {
      t.style.setProperty("--n", String(Math.max(8, t.textContent.trim().length)));
    });
  } else {
    root.classList.remove("js");
  }

  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
})();
