(() => {
  const categories = window.BomkkotCareCatalog || [];
  const overviewHref = location.pathname.includes("/care/") ? "index.html" : "care/index.html";
  const careDetailPrefix = location.pathname.includes("/care/") ? "" : "care/";
  const doctorProfileHref = location.pathname.includes("/care/") ? "../doctors.html" : "doctors.html";
  document.querySelectorAll(".dropdown-menu a, .mobile-menu a").forEach((link) => {
    if (link.textContent.trim() === "의료진 소개") link.href = doctorProfileHref;
  });
  const careOverview = document.querySelector("[data-care-overview]");
  if (careOverview) {
    careOverview.replaceChildren(...categories.map((category, index) => {
      const section = document.createElement("section");
      section.className = "care-overview-category";
      const heading = document.createElement("h2");
      heading.id = `care-category-${index + 1}`;
      heading.textContent = category.title;
      const list = document.createElement("ul");
      list.className = "care-overview-links";
      category.items.forEach(([label, slug]) => {
        const item = document.createElement("li");
        const link = document.createElement("a");
        link.href = `${careDetailPrefix}${slug}.html`;
        link.textContent = label;
        item.append(link);
        list.append(item);
      });
      section.append(heading, list);
      return section;
    }));
  }

  const categoryGrid = document.querySelector("[data-care-category]");
  if (categoryGrid) {
    const category = categories.find((item) => item.slug === categoryGrid.dataset.careCategory);
    if (category) {
      categoryGrid.replaceChildren(...category.items.map(([label, slug], index) => {
        const link = document.createElement("a");
        link.className = "care-category-card";
        link.href = `${careDetailPrefix}${slug}.html`;
        const number = document.createElement("span");
        number.className = "care-category-number";
        number.textContent = `진료 항목 · ${String(index + 1).padStart(2, "0")}`;
        const title = document.createElement("h3");
        title.textContent = label;
        const more = document.createElement("span");
        more.className = "care-category-more";
        more.textContent = "세부 안내 보기 →";
        link.append(number, title, more);
        return link;
      }));
    }
  }

  const treatmentMenu = document.querySelector("#treatmentMenu");
  if (treatmentMenu) {
    treatmentMenu.replaceChildren(...categories.map((category) => {
      const column = document.createElement("section");
      column.className = "treatment-menu-column";
      const heading = document.createElement("h2");
      heading.className = "treatment-menu-label";
      const categoryLink = document.createElement("a");
      categoryLink.href = `${careDetailPrefix}${category.slug}.html`;
      categoryLink.textContent = category.title;
      heading.append(categoryLink);
      const list = document.createElement("ul");
      list.className = "treatment-menu-links";
      category.items.forEach(([label, slug]) => {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.href = `${slug}.html`;
        link.textContent = label;
        if (location.pathname.endsWith(`/${slug}.html`)) link.setAttribute("aria-current", "page");
        li.append(link);
        list.append(li);
      });
      column.append(heading, list);
      return column;
    }));
    const overviewLink = document.createElement("a");
    overviewLink.className = "treatment-menu-overview";
    overviewLink.href = overviewHref;
    overviewLink.textContent = "전체 진료 안내 보기 →";
    treatmentMenu.append(overviewLink);
  }

  const groups = document.querySelector(".mobile-care-groups");
  if (groups) {
    const allCareLink = document.createElement("a");
    allCareLink.className = "mobile-care-all-link";
    allCareLink.href = overviewHref;
    allCareLink.textContent = "전체 진료 안내 보기 →";
    groups.replaceChildren(allCareLink, ...categories.map((category) => {
    const group = document.createElement("details");
    group.className = "mobile-care-group";
    const summary = document.createElement("summary");
    const title = document.createElement("span");
    title.textContent = category.title;
    const overviewLink = document.createElement("a");
    overviewLink.className = "mobile-care-overview-link";
    overviewLink.href = `${careDetailPrefix}${category.slug}.html`;
    overviewLink.textContent = "전체 보기";
    summary.append(title, overviewLink);
    const links = document.createElement("div");
    links.className = "mobile-care-links";
    category.items.forEach(([label, slug]) => {
      const link = document.createElement("a");
      link.href = `${careDetailPrefix}${slug}.html`;
      link.textContent = label;
      if (location.pathname.endsWith(`/${slug}.html`)) {
        link.setAttribute("aria-current", "page");
        group.open = true;
      }
      links.append(link);
    });
    group.append(summary, links);
    return group;
    }));
  }

  const closeDropdowns = (except) => document.querySelectorAll(".dropdown-trigger").forEach((trigger) => {
    if (trigger === except) return;
    trigger.setAttribute("aria-expanded", "false");
    const menu = document.getElementById(trigger.getAttribute("aria-controls"));
    if (menu) menu.hidden = true;
  });

  document.querySelectorAll(".dropdown-trigger").forEach((trigger) => trigger.addEventListener("click", () => {
    const menu = document.getElementById(trigger.getAttribute("aria-controls"));
    if (!menu) return;
    const open = trigger.getAttribute("aria-expanded") !== "true";
    closeDropdowns(trigger);
    trigger.setAttribute("aria-expanded", String(open));
    menu.hidden = !open;
  }));

  const mobileMenu = document.querySelector("#mobileMenu");
  const toggle = document.querySelector(".menu-toggle");
  toggle?.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    mobileMenu.hidden = !open;
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav-dropdown")) closeDropdowns();
    if (event.target.closest(".mobile-menu a")) {
      mobileMenu.hidden = true;
      toggle?.setAttribute("aria-expanded", "false");
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDropdowns();
      if (mobileMenu && toggle) {
        mobileMenu.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    }
  });
})();
