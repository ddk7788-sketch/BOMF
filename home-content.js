// 사진 교체는 이 파일의 src만 수정하면 됩니다.
// 예: src: "assets/bomkkot-clinic.jpg"처럼 assets 안의 이미지 경로를 입력하세요.
// src를 빈 문자열로 두면 요청에 따라 회색 사진 대기 영역이 표시됩니다.
// 한의원 내부 사진 경로를 01–10 순서대로 입력하세요. 비워 두면 회색 대기 영역을 유지합니다.
const clinicPhotoSources = ["", "", "", "", "", "", "", "", "", ""];

function setPhotoPlaceholder(label, text) {
  const icon = document.createElement("span");
  icon.className = "material-symbols-outlined photo-placeholder-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "image";
  label.replaceChildren(icon, document.createTextNode(text));
}

const homePhotos = {
  landing: {
    src: "assets/bomkkot-landing-flower.png",
    animatedSrc: "assets/bomkkot-landing-animation.webp",
    alt: "따뜻한 빛을 받은 흰 꽃과 한방 재료, 차가 놓인 이미지",
    placeholder: "대표 이미지 준비 중",
    caption: "",
  },
  hero: {
    src: "",
    alt: "봄꽃한의원 실제 공간 사진",
    placeholder: "사진 준비 중",
    caption: "실제 봄꽃한의원 사진으로 교체해 주세요.",
  },
  philosophy: {
    src: "",
    alt: "봄꽃한의원의 진료 철학을 담은 사진",
    placeholder: "사진 준비 중",
    caption: "봄꽃의 이야기를 담을 사진으로 교체해 주세요.",
  },
  director: {
    src: "",
    alt: "봄꽃한의원 대표원장 프로필 사진",
    placeholder: "대표원장 사진 준비 중",
    caption: "대표원장 프로필 사진으로 교체해 주세요.",
  },
  ...Object.fromEntries(clinicPhotoSources.map((src, index) => {
    const number = String(index + 1).padStart(2, "0");
    return [`clinic-${number}`, {
      src,
      alt: `봄꽃한의원 내부 공간 사진 ${number}`,
      placeholder: `내부 사진 ${number} 준비 중`,
      caption: `공간 사진 ${number}`,
    }];
  })),
};

Object.entries(homePhotos).forEach(([slot, photo]) => {
  const frame = document.querySelector(`[data-home-photo="${slot}"]`);
  if (!frame) return;

  const label = frame.querySelector("[data-home-photo-label]");
  const caption = frame.querySelector("[data-home-photo-caption]");

  if (photo.src.trim()) {
    const image = document.createElement("img");
    image.className = "home-photo-image";
    image.src = photo.src;
    image.alt = photo.alt;
    image.loading = slot === "hero" || slot === "landing" ? "eager" : "lazy";
    image.decoding = "async";
    image.addEventListener("error", () => {
      image.remove();
      frame.classList.remove("has-photo");
      frame.classList.add("is-placeholder");
      if (label) {
        setPhotoPlaceholder(label, "사진을 불러오지 못했습니다");
        label.hidden = false;
      }
    }, { once: true });
    if (photo.animatedSrc) {
      const picture = document.createElement("picture");
      const animation = document.createElement("source");
      picture.className = "home-photo-picture";
      animation.type = "image/webp";
      animation.srcset = photo.animatedSrc;
      animation.media = "(prefers-reduced-motion: no-preference)";
      picture.append(animation, image);
      frame.prepend(picture);
    } else {
      frame.prepend(image);
    }
    frame.classList.add("has-photo");
    if (label) label.hidden = true;
  } else {
    frame.classList.add("is-placeholder");
    if (label) {
      setPhotoPlaceholder(label, photo.placeholder);
      label.hidden = false;
    }
  }

  if (caption) {
    caption.textContent = photo.caption;
    caption.hidden = !photo.caption.trim();
  }
});
