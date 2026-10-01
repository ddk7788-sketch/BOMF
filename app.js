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
const clinicPhotoPreview = clinicPhotoDialog.querySelector("[data-clinic-photo-preview]");
const clinicPhotoCaption = clinicPhotoDialog.querySelector("#clinicPhotoDialogCaption");
let clinicPhotoOpener = null;

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
