const fs = require("node:fs");
const path = require("node:path");
const catalog = require("../care-catalog.js");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "진료항목별-상세원고.md"), "utf8");
const pageItems = catalog.flatMap((category) => category.items.map(([label, slug]) => ({ category, label, slug })));
const headings = [...source.matchAll(/^##\s+\d+\.\s+(.+)$/gm)];

if (headings.length !== pageItems.length) {
  throw new Error(`진료 원고 ${headings.length}개와 메뉴 항목 ${pageItems.length}개의 수가 다릅니다.`);
}

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function inlineMarkdown(value) {
  return escapeHtml(value).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function renderBlocks(markdown) {
  const lines = markdown.trim().split(/\r?\n/);
  const blocks = [];
  let paragraph = [];
  let listType = null;
  let listItems = [];
  let listIsWorkflow = false;
  let checklistNext = false;
  const flushParagraph = () => {
    if (paragraph.length) {
      const text = paragraph.join(" ");
      const isCallout = /^\*\*.+\*\*$/.test(text);
      blocks.push(`<p${isCallout ? ' class="care-callout"' : ""}>${inlineMarkdown(text.replace(/^\*\*(.+)\*\*$/, "$1"))}</p>`);
    }
    paragraph = [];
  };
  const flushList = () => {
    if (listItems.length) {
      if (listIsWorkflow) {
        const items = listItems.map((item) => {
          const match = item.match(/^(\d{2})\s+\*\*(.+?)\*\*\s*[—–-]\s*(.+)$/);
          if (!match) return `<li><span class="care-step-number">${String(listItems.indexOf(item) + 1).padStart(2, "0")}</span><div><strong>${inlineMarkdown(item)}</strong></div></li>`;
          return `<li><span class="care-step-number">${match[1]}</span><div><strong>${inlineMarkdown(match[2])}</strong><p>${inlineMarkdown(match[3])}</p></div></li>`;
        }).join("");
        blocks.push(`<ol class="care-steps">${items}</ol>`);
      } else if (checklistNext && listType === "ul") {
        blocks.push(`<ul class="care-check-list">${listItems.map((item) => `<li>${inlineMarkdown(item)}</li>`).join("")}</ul>`);
      } else {
        blocks.push(`<${listType}>${listItems.map((item) => `<li>${inlineMarkdown(item)}</li>`).join("")}</${listType}>`);
      }
    }
    if (listItems.length) {
      listItems = [];
      listType = null;
      listIsWorkflow = false;
      checklistNext = false;
    }
  };

  for (const line of lines) {
    if (!line.trim()) {
      flushParagraph();
      flushList();
      continue;
    }
    const topic = line.match(/^###\s+(.+)$/);
    if (topic) {
      flushParagraph();
      flushList();
      const isWorkflow = topic[1].includes("치료는 이렇게 진행됩니다");
      checklistNext = topic[1].includes("이런 분께 진료 상담을 권합니다");
      blocks.push(`<h2${checklistNext ? ' class="care-check-heading"' : ""}>${inlineMarkdown(topic[1])}</h2>`);
      if (isWorkflow) listIsWorkflow = true;
      continue;
    }
    const numbered = line.match(/^\d{2}\s+(.+)$/);
    const bullet = line.match(/^[-*]\s+(.+)$/);
    if (numbered || bullet) {
      flushParagraph();
      const type = numbered ? "ol" : "ul";
      if (listType && listType !== type) flushList();
      listType = type;
      if (numbered) listIsWorkflow = true;
      const text = numbered ? line.trim() : bullet[1];
      listItems.push(text);
      continue;
    }
    flushList();
    paragraph.push(line.trim());
  }
  flushParagraph();
  flushList();
  return blocks.join("\n");
}

const careDir = path.join(root, "care");
fs.mkdirSync(careDir, { recursive: true });

pageItems.forEach((item, index) => {
  const heading = headings[index];
  const sectionStart = heading.index + heading[0].length;
  const nextTopHeading = source.slice(sectionStart).search(/^#{1,2}\s/m);
  const rawSection = source.slice(sectionStart, nextTopHeading < 0 ? source.length : sectionStart + nextTopHeading).trim();
  const rawLines = rawSection.split(/\r?\n/);
  const topicIndex = rawLines.findIndex((line) => /^###\s+/.test(line));
  const summaryLines = rawLines.slice(0, topicIndex < 0 ? rawLines.length : topicIndex).filter((line) => line.trim());
  const summary = summaryLines.join(" ").trim();
  const detailsMarkdown = topicIndex < 0 ? "" : rawLines.slice(topicIndex).join("\n");
  const description = summary.slice(0, 158);
  const title = `${item.label} 진료 안내`;
  const html = `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#ebe1d0" />
    <meta name="description" content="${escapeHtml(description)}" />
    <title>${escapeHtml(title)} | 봄꽃한의원</title>
    <link rel="stylesheet" href="../styles.css" />
    <link rel="stylesheet" href="../care-detail.css" />
    <script src="../care-catalog.js" defer></script>
    <script src="../care-nav.js" defer></script>
  </head>
  <body class="care-detail-page">
    <a class="skip-link" href="#main">본문으로 바로가기</a>
    <header class="site-header care-site-header">
      <div class="header-inner">
        <a class="wordmark" href="../index.html#top" aria-label="봄꽃한의원 홈"><img src="../assets/bomkkot-wordmark.png" alt="봄꽃한의원" /></a>
        <a class="clinic-hours" href="../index.html#visit"><span class="hours-mark" aria-hidden="true"></span><span><strong>방문 안내</strong><small>운영 정보 확인</small></span></a>
        <nav class="main-nav" aria-label="주 메뉴">
          <div class="nav-dropdown"><button class="nav-link dropdown-trigger" type="button" aria-expanded="false" aria-controls="treatmentMenu">진료 <span class="chevron" aria-hidden="true"></span></button><div class="dropdown-menu treatment-mega-menu" id="treatmentMenu" aria-label="진료 분야" hidden></div></div>
          <div class="nav-dropdown"><button class="nav-link dropdown-trigger" type="button" aria-expanded="false" aria-controls="doctorMenu">의료진 <span class="chevron" aria-hidden="true"></span></button><div class="dropdown-menu" id="doctorMenu" hidden><a href="../index.html#doctors">의료진 소개</a><a href="../index.html#promise">진료 원칙</a></div></div>
          <div class="nav-dropdown"><button class="nav-link dropdown-trigger" type="button" aria-expanded="false" aria-controls="guideMenu">안내 <span class="chevron" aria-hidden="true"></span></button><div class="dropdown-menu" id="guideMenu" hidden><a href="../index.html#visit">진료시간·오시는 길</a><a href="../index.html#faq">자주 묻는 질문</a></div></div>
          <div class="nav-dropdown"><button class="nav-link dropdown-trigger" type="button" aria-expanded="false" aria-controls="storyMenu">봄꽃 이야기 <span class="chevron" aria-hidden="true"></span></button><div class="dropdown-menu" id="storyMenu" hidden><a href="../index.html#story">병원 소개</a><a href="../index.html#notice">소식과 안내</a></div></div>
        </nav>
        <div class="header-actions"><a class="button button-soft" href="../index.html#constitution-quiz">체질 테스트</a><a class="button button-dark" href="https://booking.naver.com/booking/13/bizes/439953" target="_blank" rel="noopener noreferrer">진료 예약</a></div>
        <button class="menu-toggle" type="button" aria-label="메뉴 열기" aria-expanded="false" aria-controls="mobileMenu">메뉴</button>
      </div>
      <div class="mobile-menu" id="mobileMenu" hidden><a href="../index.html#services">진료 분야</a><div class="mobile-care-groups"></div><a href="../index.html#doctors">의료진 소개</a><a href="../index.html#visit">이용 안내</a><a href="../index.html#story">봄꽃 이야기</a><a href="../index.html#constitution-quiz">체질 테스트</a><a href="https://booking.naver.com/booking/13/bizes/439953" target="_blank" rel="noopener noreferrer">진료 예약</a></div>
    </header>
    <main id="main" class="care-detail-main">
      <section class="care-detail-hero">
        <div class="care-detail-hero-inner">
          <nav class="care-breadcrumb" aria-label="현재 위치"><a href="../index.html">홈</a><span aria-hidden="true">›</span><a href="../index.html#services">진료 분야</a><span aria-hidden="true">›</span><span>${escapeHtml(item.category.title)}</span></nav>
          <p class="eyebrow">${escapeHtml(item.category.title)} · CARE GUIDE</p><h1>${escapeHtml(item.label)}</h1><p class="care-detail-summary">${escapeHtml(summary)}</p>
          <div class="care-detail-actions"><a class="button button-dark" href="https://booking.naver.com/booking/13/bizes/439953" target="_blank" rel="noopener noreferrer">진료 예약 안내 <span aria-hidden="true">↗</span></a><a class="care-back-link" href="../index.html#services">전체 진료 분야 보기</a></div>
        </div>
      </section>
      <article class="care-detail-article">
        <div class="care-detail-body">${renderBlocks(detailsMarkdown)}</div>
        <aside class="care-detail-notice"><strong>진료 안내</strong><p>이 페이지는 일반적인 건강 정보와 진료 상담 방향을 안내합니다. 증상만으로 진단할 수 없으며, 실제 진료 가능 항목과 검사·치료 방법은 현재 상태를 확인한 뒤 의료진과 상담해 주세요. 개인별 경과와 결과는 다를 수 있습니다.</p></aside>
        <div class="care-detail-actions"><a class="care-back-link" href="../index.html#services">다른 진료 분야 살펴보기</a></div>
      </article>
    </main>
    <footer class="care-detail-footer"><a href="../index.html">봄꽃한의원</a><span>정확한 진료 범위와 운영 정보는 병원에 확인해 주세요.</span></footer>
  </body>
</html>
`;
  fs.writeFileSync(path.join(careDir, `${item.slug}.html`), html, "utf8");
});

console.log(`${pageItems.length}개의 진료 세부 안내 페이지를 생성했습니다.`);
