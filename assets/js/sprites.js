"use strict";
document.querySelectorAll(".sprite-btn").forEach(button => {
  const states = JSON.parse(button.dataset.states);
  const image = button.querySelector("img");
  const label = button.querySelector(".sprite-label");
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const cache = new Map();
  let current = 0, next = 1, revision = 0, animation;
  function load(state) {
    if (!cache.has(state.src)) {
      const strip = new Image();
      strip.src = state.src;
      cache.set(state.src, strip.decode().catch(() => {}));
    }
    return cache.get(state.src);
  }
  async function show(index) {
    current = index;
    const token = ++revision;
    if (animation) animation.cancel();
    const state = states[index];
    const name = state.name.replace(/_/g, " ");
    const title = name[0].toUpperCase() + name.slice(1);
    label.textContent = title;
    button.setAttribute("aria-label", `Play next animation, current: ${title}`);
    await load(state);
    if (token !== revision) return;
    image.src = state.src;
    if (motion.matches) return;
    const duration = state.frames * state.frame_ms;
    // The resting loop plays for about five seconds, then holds the first frame. A click plays it again.
    animation = image.animate([
      {transform: "translateX(0)"}, {transform: "translateX(-100%)"}
    ], {duration, easing: `steps(${state.frames}, end)`, iterations: index ? 2 : Math.max(1, Math.ceil(5000 / duration))});
    animation.finished.then(() => {
      if (index && token === revision) show(0);
    }).catch(() => {});
  }
  button.addEventListener("click", () => {
    states.forEach(load);
    const index = next;
    next = (next + 1) % states.length;
    show(index);
  });
  motion.addEventListener("change", () => show(current));
  show(0);
});
