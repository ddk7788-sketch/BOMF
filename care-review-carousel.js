(() => {
  const carousels = document.querySelectorAll("[data-review-carousel]");
  if (!carousels.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const intervalMs = 5000;

  carousels.forEach((carousel) => {
    const slides = [...carousel.querySelectorAll("[data-review-slide]")];
    const count = carousel.querySelector("[data-review-count]");
    const previous = carousel.querySelector("[data-review-previous]");
    const next = carousel.querySelector("[data-review-next]");
    const toggle = carousel.querySelector("[data-review-toggle]");
    const toggleIcon = toggle?.querySelector(".material-symbols-outlined");
    if (slides.length < 2 || !count || !previous || !next || !toggle || !toggleIcon) return;

    let activeIndex = 0;
    let timer = null;
    let isVisible = false;
    let isHovered = false;
    let isPaused = reducedMotion.matches;

    const stop = () => {
      window.clearInterval(timer);
      timer = null;
    };

    const updateToggle = () => {
      const isPlaying = !isPaused && !reducedMotion.matches;
      toggleIcon.textContent = isPlaying ? "pause" : "play_arrow";
      toggle.disabled = reducedMotion.matches;
      toggle.setAttribute("aria-label", reducedMotion.matches
        ? "움직임 줄이기 설정으로 자동 재생이 꺼져 있습니다"
        : isPlaying ? "후기 자동 재생 일시 정지" : "후기 자동 재생 시작");
      toggle.setAttribute("aria-pressed", String(!isPlaying));
    };

    const show = (index) => {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === activeIndex;
        slide.hidden = !isActive;
        slide.setAttribute("aria-label", `${slideIndex + 1} / ${slides.length}`);
        slide.classList.toggle("is-entering", isActive);
      });
      count.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    };

    const start = () => {
      stop();
      if (isPaused || !isVisible || isHovered || reducedMotion.matches || document.hidden) {
        updateToggle();
        return;
      }
      timer = window.setInterval(() => show(activeIndex + 1), intervalMs);
      updateToggle();
    };

    show(0);
    carousel.classList.add("has-review-carousel");
    updateToggle();

    previous.addEventListener("click", () => {
      show(activeIndex - 1);
      start();
    });
    next.addEventListener("click", () => {
      show(activeIndex + 1);
      start();
    });
    toggle.addEventListener("click", () => {
      isPaused = !isPaused;
      start();
    });

    carousel.addEventListener("pointerenter", () => {
      isHovered = true;
      stop();
      updateToggle();
    });
    carousel.addEventListener("pointerleave", () => {
      isHovered = false;
      start();
    });
    carousel.addEventListener("focusin", (event) => {
      if (!event.target.matches(":focus-visible")) return;
      isPaused = true;
      stop();
      updateToggle();
    });
    document.addEventListener("visibilitychange", start);
    reducedMotion.addEventListener("change", (event) => {
      isPaused = event.matches;
      start();
    });

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
        start();
      }, { threshold: 0.2 });
      observer.observe(carousel);
    } else {
      isVisible = true;
      start();
    }
  });
})();
