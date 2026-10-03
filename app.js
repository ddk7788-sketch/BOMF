const toast = document.querySelector("#toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function closeDropdowns(except = null) {
  document.querySelectorAll(".dropdown-trigger").forEach((trigger) => {
    if (trigger === except) return;
    trigger.setAttribute("aria-expanded", "false");
    document.getElementById(trigger.getAttribute("aria-controls")).hidden = true;
  });
}

const treatmentAreas = window.BomkkotCareCatalog || [];

const treatmentMenu = document.querySelector("#treatmentMenu");
if (treatmentMenu) {
  treatmentMenu.classList.add("treatment-mega-menu");
  treatmentMenu.setAttribute("aria-label", "진료 분야");
  treatmentMenu.replaceChildren(...treatmentAreas.map((category) => {
    const column = document.createElement("section");
    column.className = "treatment-menu-column";
    const heading = document.createElement("h2");
    heading.className = "treatment-menu-label";
    heading.textContent = category.title;
    const list = document.createElement("ul");
    list.className = "treatment-menu-links";
    category.items.forEach(([label, slug]) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = `care/${slug}.html`;
      link.textContent = label;
      item.append(link);
      list.append(item);
    });
    column.append(heading, list);
    return column;
  }));
}

const mobileMenu = document.querySelector("#mobileMenu");
if (mobileMenu) {
  const doctorLink = [...mobileMenu.children].find((item) => item.textContent.trim() === "의료진 소개");
  const firstLink = [...mobileMenu.children].find((item) => item.textContent.trim() === "진료 분야");
  if (doctorLink && firstLink) {
    let item = firstLink;
    while (item && item !== doctorLink) {
      const next = item.nextElementSibling;
      item.remove();
      item = next;
    }
    treatmentAreas.forEach((category) => {
      const group = document.createElement("details");
      group.className = "mobile-care-group";
      const heading = document.createElement("summary");
      heading.textContent = category.title;
      const list = document.createElement("div");
      list.className = "mobile-care-links";
      category.items.forEach(([label, slug]) => {
        const link = document.createElement("a");
        link.href = `care/${slug}.html`;
        link.textContent = label;
        list.append(link);
      });
      group.append(heading, list);
      mobileMenu.insertBefore(group, doctorLink);
    });
  }
}

document.querySelectorAll(".dropdown-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const menu = document.getElementById(trigger.getAttribute("aria-controls"));
    const willOpen = trigger.getAttribute("aria-expanded") !== "true";
    closeDropdowns(trigger);
    trigger.setAttribute("aria-expanded", String(willOpen));
    menu.hidden = !willOpen;
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".nav-dropdown")) closeDropdowns();
  const opener = event.target.closest("[data-open-dialog]");
  if (opener) {
    document.getElementById(opener.dataset.openDialog)?.showModal();
    document.querySelector("#mobileMenu").hidden = true;
    document.querySelector(".menu-toggle").setAttribute("aria-expanded", "false");
    closeDropdowns();
  }
  if (event.target.matches("[data-close-dialog]")) event.target.closest("dialog")?.close();
});

document.querySelectorAll(".dropdown-menu a, .mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    closeDropdowns();
    const menu = document.querySelector("#mobileMenu");
    menu.hidden = true;
    document.querySelector(".menu-toggle").setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll("dialog").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});

const clinicPhotoDialog = document.querySelector("#clinicPhotoDialog");
const clinicPhotoPreview = clinicPhotoDialog?.querySelector("[data-clinic-photo-preview]");
const clinicPhotoCaption = clinicPhotoDialog?.querySelector("#clinicPhotoDialogCaption");
let clinicPhotoOpener = null;

if (clinicPhotoDialog && clinicPhotoPreview && clinicPhotoCaption) {
function openClinicPhoto(frame) {
  const pageScrollX = window.scrollX;
  const pageScrollY = window.scrollY;
  clinicPhotoOpener = frame;
  const image = frame.querySelector(".home-photo-image");
  const label = frame.querySelector("[data-home-photo-label]");
  const caption = frame.querySelector("[data-home-photo-caption]");
  clinicPhotoPreview.replaceChildren();

  if (image) {
    const enlargedImage = image.cloneNode();
    enlargedImage.className = "clinic-photo-dialog-image";
    clinicPhotoPreview.append(enlargedImage);
  } else {
    const placeholder = document.createElement("div");
    placeholder.className = "clinic-photo-dialog-placeholder";
    const icon = document.createElement("span");
    icon.className = "material-symbols-outlined";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "image";
    const message = document.createElement("span");
    message.textContent = label?.textContent.trim() || "사진 준비 중";
    placeholder.append(icon, message);
    clinicPhotoPreview.append(placeholder);
  }

  clinicPhotoCaption.textContent = caption?.textContent.trim() || "봄꽃한의원 내부 공간";
  clinicPhotoDialog.showModal();
  requestAnimationFrame(() => {
    clinicPhotoDialog.querySelector("[data-close-dialog]").focus({ preventScroll: true });
    window.scrollTo({ left: pageScrollX, top: pageScrollY, behavior: "instant" });
  });
}

clinicPhotoDialog.addEventListener("close", () => {
  clinicPhotoOpener?.focus({ preventScroll: true });
});

const clinicGallery = document.querySelector(".clinic-gallery-grid");
if (clinicGallery) {
  const photos = [...clinicGallery.querySelectorAll(":scope > .clinic-gallery-photo")];
  if (photos.length > 1) {
    const track = document.createElement("div");
    track.className = "clinic-gallery-track";
    const originalGroup = document.createElement("div");
    originalGroup.className = "clinic-gallery-group";
    const duplicateGroup = document.createElement("div");
    duplicateGroup.className = "clinic-gallery-group clinic-gallery-group-duplicate";
    duplicateGroup.setAttribute("aria-hidden", "true");
    photos.forEach((photo) => {
      originalGroup.append(photo);
      const duplicate = photo.cloneNode(true);
      duplicate.removeAttribute("data-home-photo");
      duplicate.removeAttribute("role");
      duplicate.removeAttribute("tabindex");
      duplicate.querySelectorAll("[data-home-photo-label], [data-home-photo-caption]").forEach((node) => node.removeAttribute("data-home-photo-label"));
      duplicateGroup.append(duplicate);
    });
    track.append(originalGroup, duplicateGroup);
    clinicGallery.replaceChildren(track);
  }
}

document.querySelectorAll(".clinic-gallery-photo").forEach((frame) => {
  frame.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openClinicPhoto(frame);
  });
  frame.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openClinicPhoto(frame);
    }
  });
});
}

const menuToggle = document.querySelector(".menu-toggle");
menuToggle.addEventListener("click", () => {
  const menu = document.querySelector("#mobileMenu");
  const willOpen = menu.hidden;
  menu.hidden = !willOpen;
  menuToggle.setAttribute("aria-expanded", String(willOpen));
  closeDropdowns();
});

document.querySelector("#appointmentForm").addEventListener("submit", (event) => {
  event.preventDefault();
  event.currentTarget.reset();
  document.querySelector("#appointmentDialog").close();
  showToast("정적 미리보기입니다. 입력 내용은 전송되지 않았어요.");
});

document.querySelector("#siteSearchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const query = document.querySelector("#siteSearchInput").value.trim().toLocaleLowerCase();
  if (!query) {
    document.querySelector("#siteSearchInput").focus();
    return;
  }
  const match = [...document.querySelectorAll("main h1, main h2, main h3, main p, main summary")]
    .find((element) => element.textContent.toLocaleLowerCase().includes(query));
  document.querySelector("#searchDialog").close();
  if (match) {
    match.scrollIntoView({ behavior: "smooth", block: "center" });
    showToast(`“${query}” 관련 안내를 찾았어요.`);
  } else {
    showToast("일치하는 안내를 찾지 못했어요.");
  }
});

document.querySelectorAll("[data-scroll-frames]").forEach((frameCanvas) => {
  const frameSlot = frameCanvas.closest(".hero-video-slot, .philosophy-video-slot");
  const framePlaceholder = frameSlot.querySelector(".hero-video-placeholder");
  const frameSection = frameCanvas.closest(".hero, .philosophy-feature");
  const frameCount = Number(frameCanvas.dataset.frameCount) || 40;
  const columns = Number(frameCanvas.dataset.frameColumns) || 6;
  const frameWidth = Number(frameCanvas.dataset.frameWidth) || 512;
  const frameHeight = Number(frameCanvas.dataset.frameHeight) || 432;
  const fit = frameCanvas.dataset.frameFit || "cover";
  const frameImage = new Image();
  let currentFrame = -1;
  let frameUpdateRequest = 0;

  const drawScrollFrame = () => {
    frameUpdateRequest = 0;
    if (!frameImage.complete || !frameImage.naturalWidth) return;

    const bounds = frameSection.getBoundingClientRect();
    const scrollRange = window.innerHeight + bounds.height;
    const progress = Math.min(1, Math.max(0, (window.innerHeight - bounds.top) / scrollRange));
    const nextFrame = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : Math.min(frameCount - 1, Math.floor(progress * frameCount));

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = frameCanvas.clientWidth;
    const height = frameCanvas.clientHeight;
    if (!width || !height) return;
    const canvasWidth = Math.round(width * pixelRatio);
    const canvasHeight = Math.round(height * pixelRatio);
    if (frameCanvas.width !== canvasWidth || frameCanvas.height !== canvasHeight) {
      frameCanvas.width = canvasWidth;
      frameCanvas.height = canvasHeight;
      currentFrame = -1;
    }
    if (nextFrame === currentFrame) return;
    currentFrame = nextFrame;

    const sourceX = (nextFrame % columns) * frameWidth;
    const sourceY = Math.floor(nextFrame / columns) * frameHeight;
    const sourceRatio = frameWidth / frameHeight;
    const targetRatio = width / height;
    let cropX = 0;
    let cropY = 0;
    let cropWidth = frameWidth;
    let cropHeight = frameHeight;
    if (fit === "contain") {
      const scale = Math.min(width / frameWidth, height / frameHeight);
      const drawWidth = frameWidth * scale;
      const drawHeight = frameHeight * scale;
      const context = frameCanvas.getContext("2d", { alpha: false });
      context.fillStyle = getComputedStyle(frameSlot).backgroundColor;
      context.fillRect(0, 0, canvasWidth, canvasHeight);
      context.drawImage(frameImage, sourceX, sourceY, frameWidth, frameHeight,
        Math.round((width - drawWidth) / 2 * pixelRatio), Math.round((height - drawHeight) / 2 * pixelRatio),
        Math.round(drawWidth * pixelRatio), Math.round(drawHeight * pixelRatio));
      return;
    }
    if (sourceRatio > targetRatio) {
      cropWidth = frameHeight * targetRatio;
      cropX = (frameWidth - cropWidth) / 2;
    } else {
      cropHeight = frameWidth / targetRatio;
      cropY = (frameHeight - cropHeight) / 2;
    }

    const context = frameCanvas.getContext("2d", { alpha: false });
    context.drawImage(frameImage, sourceX + cropX, sourceY + cropY, cropWidth, cropHeight, 0, 0, canvasWidth, canvasHeight);
  };

  const requestFrameUpdate = () => {
    if (!frameUpdateRequest) frameUpdateRequest = window.requestAnimationFrame(drawScrollFrame);
  };

  frameImage.addEventListener("load", () => {
    frameSlot.classList.add("is-video-ready");
    requestFrameUpdate();
  }, { once: true });
  frameImage.addEventListener("error", () => {
    if (framePlaceholder) framePlaceholder.textContent = "영상을 불러오지 못했습니다";
  }, { once: true });
  const loadFrameAtlas = () => {
    if (frameImage.src) return;
    frameImage.src = frameCanvas.dataset.scrollFrames;
  };
  if ("IntersectionObserver" in window) {
    const atlasObserver = new IntersectionObserver(([entry], observer) => {
      if (!entry.isIntersecting) return;
      loadFrameAtlas();
      observer.disconnect();
    }, { rootMargin: "160px" });
    atlasObserver.observe(frameSlot);
  } else {
    loadFrameAtlas();
  }
  window.addEventListener("scroll", requestFrameUpdate, { passive: true });
  window.addEventListener("resize", requestFrameUpdate, { passive: true });
  window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", requestFrameUpdate);
  requestFrameUpdate();
});

const revealMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
if (!revealMotionPreference.matches && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -4% 0px" });

  document.querySelectorAll("main > section").forEach((section) => {
    section.querySelectorAll("h1, h2, h3, p, summary, figcaption").forEach((element, index) => {
      element.classList.add("scroll-reveal");
      element.style.setProperty("--reveal-delay", `${Math.min(index * 55, 220)}ms`);
      revealObserver.observe(element);
    });
  });
}
