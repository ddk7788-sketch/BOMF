const medicalTeam = [
  {
    name: "신범희",
    title: "대표원장",
    photo: "사진/원장.png",
    alt: "신범희 대표원장",
    intro: "불편한 곳과 생활의 맥락을 충분히 듣고, 환자 한 분 한 분이 이해할 수 있는 말로 진료 방향을 안내합니다.",
    sections: [
      { title: "학력 및 주요 경력", items: [
        "공주중학교 55회 졸업", "공주고등학교 82회 차석 졸업", "서울대학교·고려대학교·육군사관학교·서남대 의예과 합격", "대전대학교 한의과대학 졸업", "前) 대전대학교 한의과대학 ‘황제’ 회장", "前) 세종시 제일한의원 진료원장", "前) 아산시 공중보건의사", "現) 공주시 봄꽃한의원 대표원장",
      ] },
      { title: "학회 활동", items: [
        "척추신경추나학회 정회원", "대한고금의학회 정회원", "대한약침학회 정회원", "대한족부교정학회 정회원", "바른약침학회 정회원", "한방비만학회 정회원", "한방관절재활학회 정회원", "청아인초음파연구회 정회원", "대한통합대체의학회 정회원",
      ] },
    ],
  },
  {
    name: "오태권",
    title: "진료원장",
    photo: "사진/부원장1.png",
    alt: "오태권 진료원장",
    intro: "",
    sections: [
      { title: "학력 및 주요 경력", items: [
        "대전대학교 한의과대학 졸업", "대전대학교 한방병원 임상과정 수료", "대한한의사협회 추나교육과정 이수", "前) 대전대학교 한의과대학 ‘황제’ 회장", "現) 공주시 봄꽃한의원 진료원장",
      ] },
      { title: "학회 활동", items: [
        "대한약침학회 정회원", "대한침구의학회 정회원", "척추신경추나학회 정회원", "대한한방내과학회 정회원",
      ] },
    ],
  },
  {
    name: "민길주",
    title: "진료원장",
    photo: "사진/부원장2.png",
    alt: "민길주 진료원장",
    intro: "",
    sections: [
      { title: "학력 및 주요 경력", items: [
        "연세대학교 전기전자공학부 졸업", "부산대학교 한의학전문대학원 졸업", "부산대학교 한방병원 임상실습", "강남 자생한방병원 학생인턴", "부산대학교 한의전 침구학과 학생인턴", "대한한의사협회 공식 미용의료 안정성 교육수료", "現) 공주시 봄꽃한의원 진료원장",
      ] },
      { title: "학회 활동", items: [
        "대한통합레이저학회 정회원", "대한침구의학회 정회원", "대한약침학회 정회원", "한방비만학회 정회원",
      ] },
    ],
  },
];

const slidesRoot = document.querySelector("[data-team-slides]");
const pagination = document.querySelector("[data-team-pagination]");
const position = document.querySelector("[data-team-position]");
if (slidesRoot && pagination && position) {
  let activeIndex = 0;
  const escapeHTML = (value) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

  slidesRoot.innerHTML = medicalTeam.map((doctor, index) => `
    <article class="team-slide" data-team-slide="${index}" aria-label="${index + 1} / ${medicalTeam.length}: ${escapeHTML(doctor.name)} ${escapeHTML(doctor.title)}" hidden>
      <div class="team-profile-copy">
        <p class="team-doctor-label">${escapeHTML(doctor.title)}</p>
        <h2>${escapeHTML(doctor.name)} ${escapeHTML(doctor.title)}</h2>
        ${doctor.intro ? `<p class="team-doctor-intro">${escapeHTML(doctor.intro)}</p>` : ""}
        <div class="team-credentials">${doctor.sections.map((section) => `
          <section class="team-credential-group">
            <h3>${escapeHTML(section.title)}</h3>
            <ul>${section.items.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>
          </section>`).join("")}
        </div>
      </div>
      <figure class="team-photo"><img src="${escapeHTML(doctor.photo)}" alt="${escapeHTML(doctor.alt)}" loading="lazy" decoding="async"></figure>
    </article>`).join("");

  pagination.innerHTML = medicalTeam.map((doctor, index) => `<button class="team-dot" type="button" data-team-go="${index}" aria-label="${index + 1}번: ${escapeHTML(doctor.name)} ${escapeHTML(doctor.title)}"></button>`).join("");
  const slides = [...slidesRoot.querySelectorAll("[data-team-slide]")];
  const dots = [...pagination.querySelectorAll("[data-team-go]")];

  function showSlide(index) {
    activeIndex = (index + medicalTeam.length) % medicalTeam.length;
    slides.forEach((slide, i) => {
      slide.hidden = i !== activeIndex;
      slide.setAttribute("aria-hidden", String(i !== activeIndex));
    });
    dots.forEach((dot, i) => {
      if (i === activeIndex) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
    position.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(medicalTeam.length).padStart(2, "0")}`;
  }

  document.querySelector("[data-team-prev]")?.addEventListener("click", () => showSlide(activeIndex - 1));
  document.querySelector("[data-team-next]")?.addEventListener("click", () => showSlide(activeIndex + 1));
  pagination.addEventListener("click", (event) => {
    const button = event.target.closest("[data-team-go]");
    if (button) showSlide(Number(button.dataset.teamGo));
  });
  document.querySelector("[data-team-carousel]")?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") { event.preventDefault(); showSlide(activeIndex - 1); }
    if (event.key === "ArrowRight") { event.preventDefault(); showSlide(activeIndex + 1); }
  });
  showSlide(0);
}
