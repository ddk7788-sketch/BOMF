(() => {
  const filters = [...document.querySelectorAll("[data-faq-filter]")];
  const groups = [...document.querySelectorAll(".faq-group[data-category]")];
  if (!filters.length || !groups.length) return;

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      const selected = filter.dataset.faqFilter;
      filters.forEach((item) => {
        const active = item === filter;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      groups.forEach((group) => {
        const visible = selected === "all" || group.dataset.category === selected;
        group.hidden = !visible;
        if (!visible) group.querySelectorAll("details[open]").forEach((item) => item.removeAttribute("open"));
      });
    });
  });
})();
