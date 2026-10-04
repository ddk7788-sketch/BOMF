(() => {
  const categories = window.BomkkotCareCatalog || [];
  const overviewHref = location.pathname.includes("/care/") ? "index.html" : "care/index.html";
  const careDetailPrefix = location.pathname.includes("/care/") ? "" : "care/";
  const doctorProfileHref = location.pathname.includes("/care/") ? "../doctors.html" : "doctors.html";
  document.querySelectorAll(".dropdown-menu a, .mobile-menu a").forEach((link) => {
    if (link.textContent.trim() === "의료진 소개") link.href = doctorProfileHref;
  });
  const guideMenuLink = document.querySelector("#guideMenu > a");
  const mobileGuideLink = document.querySelector('#mobileMenu > a[href$="visit.html"]');
  const clinicHoursLabel = document.querySelector(".clinic-hours small");
  if (guideMenuLink) guideMenuLink.textContent = "진료시간 및 오시는길";
  if (mobileGuideLink) mobileGuideLink.textContent = "진료시간 및 오시는길";
  if (clinicHoursLabel) {
    const updateClinicHoursLabel = () => {
      const weekday = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "Asia/Seoul" }).format(new Date());
      clinicHoursLabel.textContent = weekday === "Sat" || weekday === "Sun" ? "토·일 08:00–14:00" : "월–금 08:00–18:00";
    };
    updateClinicHoursLabel();
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) updateClinicHoursLabel();
    });
  }
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
    if (!document.querySelector('link[href*="Material+Symbols+Outlined"]')) {
      const iconFont = document.createElement("link");
      iconFont.rel = "stylesheet";
      iconFont.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,500,0,0";
      document.head.append(iconFont);
    }
    const featuredSection = document.createElement("section");
    featuredSection.className = "mobile-care-featured";
    const featuredHeading = document.createElement("h2");
    featuredHeading.className = "mobile-care-section-label";
    featuredHeading.textContent = "대표 진료과목";
    const featuredLinks = document.createElement("div");
    featuredLinks.className = "mobile-care-featured-links";
    (window.BomkkotFeaturedCare || []).forEach((item) => {
      const link = document.createElement("a");
      link.href = `${careDetailPrefix}${item.slug}.html`;
      const icon = document.createElement("span");
      icon.className = "material-symbols-outlined mobile-care-featured-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = item.icon;
      const label = document.createElement("span");
      label.textContent = item.title;
      link.append(icon, label);
      featuredLinks.append(link);
    });
    featuredSection.append(featuredHeading, featuredLinks);
    groups.parentElement.insertBefore(featuredSection, groups);

    const allCareLink = document.createElement("a");
    allCareLink.className = "mobile-care-all-link";
    allCareLink.href = overviewHref;
    allCareLink.textContent = "전체 진료 안내 보기 →";
    const allCareHeading = document.createElement("h2");
    allCareHeading.className = "mobile-care-section-label mobile-care-all-heading";
    allCareHeading.textContent = "전체 진료과목";
    groups.replaceChildren(allCareHeading, ...categories.map((category) => {
    const group = document.createElement("div");
    group.className = "mobile-care-group";
    const heading = document.createElement("div");
    heading.className = "mobile-care-group-heading";
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "mobile-care-toggle";
    toggle.setAttribute("aria-controls", `mobile-care-panel-${category.slug}`);
    toggle.setAttribute("aria-label", `세부 진료 항목 펼치기: ${category.title}`);
    const title = document.createElement("a");
    title.className = "mobile-care-title-link";
    title.href = `${careDetailPrefix}${category.slug}.html`;
    title.textContent = category.title;
    heading.append(title, toggle);
    const panel = document.createElement("div");
    panel.className = "mobile-care-links-panel";
    panel.id = `mobile-care-panel-${category.slug}`;
    const links = document.createElement("div");
    links.className = "mobile-care-links";
    let isCurrentCategory = false;
    category.items.forEach(([label, slug]) => {
      const link = document.createElement("a");
      link.href = `${careDetailPrefix}${slug}.html`;
      link.textContent = label;
      if (location.pathname.endsWith(`/${slug}.html`)) {
        link.setAttribute("aria-current", "page");
        isCurrentCategory = true;
      }
      links.append(link);
    });
    panel.append(links);
    toggle.setAttribute("aria-expanded", String(isCurrentCategory));
    panel.setAttribute("aria-hidden", String(!isCurrentCategory));
    panel.inert = !isCurrentCategory;
    group.classList.toggle("is-expanded", isCurrentCategory);
    group.append(heading, panel);
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(expanded));
      panel.setAttribute("aria-hidden", String(!expanded));
      panel.inert = !expanded;
      group.classList.toggle("is-expanded", expanded);
    });
    return group;
    }), allCareLink);
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
  let mobileMenuCloseTimer = 0;
  let mobileMenuTransitionHandler = null;
  let mobileMenuOpenFrame = 0;
  const setMobileMenuOpen = (open) => {
    if (!mobileMenu || !toggle) return;
    window.cancelAnimationFrame(mobileMenuOpenFrame);
    window.clearTimeout(mobileMenuCloseTimer);
    if (mobileMenuTransitionHandler) {
      mobileMenu.removeEventListener("transitionend", mobileMenuTransitionHandler);
      mobileMenuTransitionHandler = null;
    }
    toggle.setAttribute("aria-expanded", String(open));
    if (open) {
      mobileMenu.hidden = false;
      mobileMenu.classList.remove("is-open");
      void mobileMenu.offsetHeight;
      mobileMenuOpenFrame = requestAnimationFrame(() => {
        mobileMenuOpenFrame = 0;
        if (!mobileMenu.hidden && toggle.getAttribute("aria-expanded") === "true") mobileMenu.classList.add("is-open");
      });
      return;
    }
    if (mobileMenu.hidden) return;
    mobileMenu.classList.remove("is-open");
    const finishClose = () => {
      mobileMenu.hidden = true;
      mobileMenuTransitionHandler = null;
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishClose();
      return;
    }
    mobileMenuTransitionHandler = (event) => {
      if (event.target !== mobileMenu || event.propertyName !== "opacity") return;
      window.clearTimeout(mobileMenuCloseTimer);
      mobileMenu.removeEventListener("transitionend", mobileMenuTransitionHandler);
      finishClose();
    };
    mobileMenu.addEventListener("transitionend", mobileMenuTransitionHandler);
    mobileMenuCloseTimer = window.setTimeout(() => {
      if (mobileMenuTransitionHandler) mobileMenu.removeEventListener("transitionend", mobileMenuTransitionHandler);
      finishClose();
    }, 260);
  };
  toggle?.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    setMobileMenuOpen(open);
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav-dropdown")) closeDropdowns();
    if (event.target.closest(".mobile-menu a")) {
      setMobileMenuOpen(false);
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDropdowns();
      if (mobileMenu && toggle) {
        setMobileMenuOpen(false);
        toggle.focus();
      }
    }
  });
})();
