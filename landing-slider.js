(() => {
  const carousel = document.querySelector("[data-home-carousel]");
  if (!carousel) return;

  const slides = [...carousel.querySelectorAll("[data-landing-slide]")];
  const current = carousel.querySelector("[data-slide-current]");
  const progress = carousel.querySelector("[data-slide-progress]");
  const toggle = carousel.querySelector("[data-slide-toggle]");
  const toggleIcon = toggle?.querySelector(".material-symbols-outlined");
  const previous = carousel.querySelector("[data-slide-previous]");
  const next = carousel.querySelector("[data-slide-next]");
  if (!slides.length) return;

  const duration = 3000;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
  let elapsed = 0;
  let startedAt = 0;
  let timer = 0;
  let paused = reducedMotion.matches;
  let pointerInside = false;
  let focusedInside = false;

  const paintProgress = (value) => {
    if (progress) progress.style.width = `${Math.min(100, Math.max(0, value))}%`;
  };

  const updateToggle = () => {
    if (!toggle) return;
    toggle.setAttribute("aria-label", paused ? "자동 재생 시작" : "자동 재생 일시 정지");
    if (toggleIcon) toggleIcon.textContent = paused ? "play_arrow" : "pause";
  };

  const render = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === activeIndex;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
      slide.setAttribute("aria-label", `${String(i + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`);
    });
    if (current) current.textContent = String(activeIndex + 1).padStart(2, "0");
    elapsed = 0;
    paintProgress(0);
    if (!paused) start();
  };

  const stop = () => {
    if (timer) cancelAnimationFrame(timer);
    timer = 0;
    if (startedAt) elapsed = Math.min(duration, elapsed + performance.now() - startedAt);
    startedAt = 0;
  };

  const tick = (now) => {
    if (paused || pointerInside || focusedInside || document.hidden) {
      stop();
      return;
    }
    if (!startedAt) startedAt = now;
    const value = elapsed + now - startedAt;
    paintProgress((value / duration) * 100);
    if (value >= duration) {
      stop();
      render(activeIndex + 1);
      return;
    }
    timer = requestAnimationFrame(tick);
  };

  function start() {
    if (paused || pointerInside || focusedInside || document.hidden || timer) return;
    startedAt = 0;
    timer = requestAnimationFrame(tick);
  }

  const setPaused = (value) => {
    if (paused === value) return;
    if (value) stop();
    paused = value;
    updateToggle();
    if (!paused) start();
  };

  previous?.addEventListener("click", () => render(activeIndex - 1));
  next?.addEventListener("click", () => render(activeIndex + 1));
  toggle?.addEventListener("click", () => setPaused(!paused));
  carousel.addEventListener("mouseenter", () => { pointerInside = true; stop(); });
  carousel.addEventListener("mouseleave", () => { pointerInside = false; start(); });
  carousel.addEventListener("focusin", () => { focusedInside = true; stop(); });
  carousel.addEventListener("focusout", (event) => {
    if (!carousel.contains(event.relatedTarget)) {
      focusedInside = false;
      start();
    }
  });
  document.addEventListener("visibilitychange", () => document.hidden ? stop() : start());
  reducedMotion.addEventListener?.("change", (event) => setPaused(event.matches));
  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") { event.preventDefault(); render(activeIndex - 1); }
    if (event.key === "ArrowRight") { event.preventDefault(); render(activeIndex + 1); }
  });

  let touchStartX = null;
  carousel.addEventListener("touchstart", (event) => { touchStartX = event.changedTouches[0]?.clientX ?? null; }, { passive: true });
  carousel.addEventListener("touchend", (event) => {
    if (touchStartX === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 48) render(activeIndex + (delta < 0 ? 1 : -1));
    touchStartX = null;
  }, { passive: true });

  updateToggle();
  if (!paused) start();
})();
