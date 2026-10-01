(() => {
  const root = document.querySelector("[data-quiz]");
  if (!root) return;

  const types = {
    taeyang: { name: "태양인", description: "새로운 방향을 먼저 떠올리고, 주도적으로 일을 이끄는 성향에 응답이 가까웠어요." },
    taeeum: { name: "태음인", description: "차분하게 살피고, 익숙한 흐름을 꾸준히 이어가는 성향에 응답이 가까웠어요." },
    soyang: { name: "소양인", description: "생각을 빠르게 행동으로 옮기고, 활발하게 변화를 맞는 성향에 응답이 가까웠어요." },
    soeum: { name: "소음인", description: "세부를 꼼꼼히 살피고, 신중하게 준비한 뒤 움직이는 성향에 응답이 가까웠어요." },
  };
  const questions = [
    { prompt: "새로운 일을 맡으면 나는 보통…", options: [
      { label: "먼저 큰 방향과 가능성을 그려봐요", type: "taeyang" }, { label: "전체를 살피고 차근차근 시작해요", type: "taeeum" }, { label: "일단 움직이며 빠르게 익혀요", type: "soyang" }, { label: "필요한 정보를 충분히 확인한 뒤 시작해요", type: "soeum" },
    ] },
    { prompt: "계획이 갑자기 바뀌면 나는…", options: [
      { label: "새로운 기회로 보고 방향을 제안해요", type: "taeyang" }, { label: "상황을 파악하고 현실적인 대안을 찾아요", type: "taeeum" }, { label: "우선 바로 대응하고 다음을 생각해요", type: "soyang" }, { label: "변경된 내용을 확인하고 순서를 다시 정리해요", type: "soeum" },
    ] },
    { prompt: "여럿이 함께 일할 때 나는 주로…", options: [
      { label: "아이디어를 내고 방향을 잡아요", type: "taeyang" }, { label: "맡은 일을 꾸준히 챙기며 흐름을 지켜요", type: "taeeum" }, { label: "분위기를 북돋우고 실행을 이끌어요", type: "soyang" }, { label: "빠진 부분을 세심하게 확인해요", type: "soeum" },
    ] },
    { prompt: "결정을 내려야 할 때 더 편한 방식은요?", options: [
      { label: "가능성을 보고 과감하게 선택해요", type: "taeyang" }, { label: "충분히 따져보고 안정적으로 선택해요", type: "taeeum" }, { label: "직감이 오면 빠르게 결정해요", type: "soyang" }, { label: "작은 조건까지 비교하고 신중히 결정해요", type: "soeum" },
    ] },
    { prompt: "바쁜 날을 보내고 나면 보통…", options: [
      { label: "하고 싶었던 일을 떠올리며 다음 계획을 세워요", type: "taeyang" }, { label: "익숙한 휴식으로 천천히 페이스를 회복해요", type: "taeeum" }, { label: "가볍게 움직이거나 사람을 만나 기분을 바꿔요", type: "soyang" }, { label: "조용한 시간을 가지며 하루를 정리해요", type: "soeum" },
    ] },
    { prompt: "주변 사람에게 자주 듣는 말은 무엇인가요?", options: [
      { label: "생각이 크고 자기 주관이 뚜렷해요", type: "taeyang" }, { label: "든든하고 한결같아요", type: "taeeum" }, { label: "활기차고 행동이 빨라요", type: "soyang" }, { label: "꼼꼼하고 차분해요", type: "soeum" },
    ] },
    { prompt: "내가 더 편안함을 느끼는 생활 방식은요?", options: [
      { label: "정해진 틀보다 내가 선택할 여지가 있는 생활", type: "taeyang" }, { label: "무리 없이 이어갈 수 있는 안정된 생활", type: "taeeum" }, { label: "새로운 경험과 활동이 있는 생활", type: "soyang" }, { label: "일정과 순서가 잘 정돈된 생활", type: "soeum" },
    ] },
  ];

  const stage = root.querySelector("[data-quiz-stage]");
  const result = root.querySelector("[data-quiz-result]");
  const controls = root.querySelector("[data-quiz-controls]");
  const label = root.querySelector("[data-progress-label]");
  const bar = root.querySelector("[data-progress-bar]");
  const back = root.querySelector("[data-quiz-back]");
  const next = root.querySelector("[data-quiz-next]");
  const answers = Array(questions.length).fill(null);
  let current = 0;

  function renderQuestion() {
    const question = questions[current];
    label.textContent = `질문 ${current + 1} / ${questions.length}`;
    bar.style.width = `${((current + 1) / questions.length) * 100}%`;
    back.disabled = current === 0;
    next.disabled = answers[current] === null;
    next.innerHTML = current === questions.length - 1 ? '체질 결과 보기 <span aria-hidden="true">→</span>' : '다음 질문 <span aria-hidden="true">→</span>';
    stage.innerHTML = `<h3 id="quizQuestion">${question.prompt}</h3><div class="quiz-options" role="radiogroup" aria-labelledby="quizQuestion">${question.options.map((option, index) => `<label class="quiz-option"><input type="radio" name="quiz-answer-${current}" value="${index}" ${answers[current] === index ? "checked" : ""} /><span>${option.label}</span></label>`).join("")}</div>`;
    stage.querySelectorAll('input[type="radio"]').forEach((radio) => {
      radio.addEventListener("change", () => {
        answers[current] = Number(radio.value);
        next.disabled = false;
      });
    });
    stage.hidden = false;
    controls.hidden = false;
    result.hidden = true;
  }

  function showResult() {
    const scores = Object.fromEntries(Object.keys(types).map((type) => [type, 0]));
    answers.forEach((answer, index) => { scores[questions[index].options[answer].type] += 1; });
    const highScore = Math.max(...Object.values(scores));
    const matched = Object.keys(types).filter((type) => scores[type] === highScore);
    const matchedNames = matched.map((type) => types[type].name);
    const description = matched.length === 1
      ? types[matched[0]].description
      : `여러 유형의 응답이 비슷하게 나타났어요 (${matchedNames.join("·")}). 한 가지 결과로 단정하기 어려운 응답입니다.`;
    label.textContent = "체질 체크 결과";
    bar.style.width = "100%";
    stage.hidden = true;
    controls.hidden = true;
    result.innerHTML = `<p class="eyebrow">나와 가까운 응답 유형</p><h3>${matchedNames.join(" · ")}</h3><p>${description}</p><p>간단한 성향 질문만으로 사상체질을 진단할 수는 없습니다. 실제 체질 판단과 건강 상담은 한의사와 진행해 주세요.</p><button class="button button-outline" type="button" data-quiz-restart>다시 테스트하기</button>`;
    result.hidden = false;
    result.querySelector("[data-quiz-restart]").addEventListener("click", () => {
      answers.fill(null);
      current = 0;
      renderQuestion();
    });
  }

  back.addEventListener("click", () => {
    if (current === 0) return;
    current -= 1;
    renderQuestion();
  });
  next.addEventListener("click", () => {
    if (answers[current] === null) return;
    if (current === questions.length - 1) showResult();
    else { current += 1; renderQuestion(); }
  });
  renderQuestion();
})();
