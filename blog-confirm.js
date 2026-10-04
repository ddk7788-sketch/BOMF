(() => {
  const dialogId = "blogConfirmDialog";
  if (document.getElementById(dialogId)) return;

  const dialog = document.createElement("dialog");
  dialog.id = dialogId;
  dialog.className = "blog-confirm-dialog";
  dialog.setAttribute("aria-labelledby", "blogConfirmTitle");
  dialog.setAttribute("aria-describedby", "blogConfirmDescription");
  dialog.innerHTML = `
    <div class="blog-confirm-content">
      <p class="eyebrow">BOMKKOT · EXTERNAL LINK</p>
      <h2 id="blogConfirmTitle">네이버 블로그로 이동할까요?</h2>
      <p id="blogConfirmDescription">새 창에서 봄꽃한의원 네이버 블로그가 열립니다.</p>
      <div class="blog-confirm-actions">
        <button class="blog-confirm-cancel" type="button">취소</button>
        <a class="blog-confirm-continue" href="https://blog.naver.com/bom-kkot" target="_blank" rel="noopener noreferrer">블로그로 이동</a>
      </div>
    </div>`;
  document.body.append(dialog);

  const continueLink = dialog.querySelector(".blog-confirm-continue");
  dialog.querySelector(".blog-confirm-cancel").addEventListener("click", () => dialog.close());
  continueLink.addEventListener("click", () => dialog.close());

  document.addEventListener("click", (event) => {
    const clickedElement = event.target instanceof Element ? event.target : null;
    const link = clickedElement?.closest("a[data-blog-confirm]");
    if (!link) return;
    event.preventDefault();
    continueLink.href = link.href;
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
      dialog.querySelector(".blog-confirm-cancel").focus();
    } else if (window.confirm("네이버 블로그로 이동할까요?")) {
      window.open(link.href, "_blank", "noopener,noreferrer");
    }
  });
})();
