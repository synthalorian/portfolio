/* synth — portfolio. Small progressive enhancements only; the page works without JS. */
(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.remove("no-js");

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

  // Gentle reveal on scroll (skipped entirely for reduced motion).
  if (!reduceMotion && "IntersectionObserver" in window) {
    root.classList.add("js");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  }

  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
})();
