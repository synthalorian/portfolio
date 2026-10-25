"use strict";
/* Scroll reveal: content below the fold fades and slides up once as it enters the viewport.
   Nothing is hidden before this script runs, nothing in view at load is touched, and with
   prefers-reduced-motion (or no IntersectionObserver) nothing is hidden at all. */
(function () {
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var vh = innerHeight;
  var sel = "main section .wrap > *, main .cards > .card, main .hub-grid > *, main .project-list > *, main .mod-list > *";
  var items = [].slice.call(document.querySelectorAll(sel)).filter(function (el, i, all) { return all.indexOf(el) === i; });
  var seen = new Set();
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      e.target.classList.add("rv-in");
      var done = function () { e.target.classList.remove("rv", "rv-in"); e.target.style.removeProperty("--rv-i"); };
      e.target.addEventListener("transitionend", done, {once: true});
      setTimeout(done, 1400);
    });
  }, {rootMargin: "0px 0px -6% 0px", threshold: 0.06});
  items.forEach(function (el, n) {
    if (el.getBoundingClientRect().top < vh) return;       // already on screen: leave alone
    var sib = el.parentElement ? [].indexOf.call(el.parentElement.children, el) : 0;
    el.style.setProperty("--rv-i", String(Math.min(sib % 3, 2)));
    el.classList.add("rv"); io.observe(el);
  });
  // A fast jump or fling can carry the viewport past items without IntersectionObserver ever seeing them:
  // anything that is now above the viewport is shown straight away (no animation needed off screen).
  var tick = false;
  addEventListener("scroll", function () {
    if (tick) return; tick = true;
    requestAnimationFrame(function () {
      tick = false;
      document.querySelectorAll(".rv").forEach(function (el) {
        if (el.getBoundingClientRect().bottom < 0) { io.unobserve(el); el.classList.remove("rv", "rv-in"); el.style.removeProperty("--rv-i"); }
      });
    });
  }, {passive: true});
  function all() { document.querySelectorAll(".rv").forEach(function (el) { el.classList.remove("rv", "rv-in"); }); }
  addEventListener("beforeprint", all);
  // Safety net: anything still hidden after a long idle (e.g. a background tab) is shown.
  setTimeout(function () { if (document.hidden) all(); }, 8000);
})();
