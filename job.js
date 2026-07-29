const QUIZ = [
  ["각 직업별로 1차 전직을 하기 위한 요구 능력치가 올바르게 짝지어진 것은?", "궁수 - DEX 25 이상"],
  ["각 직업별로 1차 전직을 하기 위한 요구 능력치가 올바르지 않은 것은?", "도적 - LUK 20 이상"],
  ["메이플스토리에서 제일 처음 만나는 NPC 이름은?", "히나"],
  ["메이플 아일랜드에서 만날 수 없는 NPC는?", "테오"],
  ["빅토리아 아일랜드를 구성하는 마을이 아닌 것은?", "암허스트"],
  ["페리온에서 만날 수 없는 NPC는?", "에뜨랑"],
  ["헤네시스에서 만날 수 없는 NPC는?", "테오"],
  ["엘리니아에서 만날 수 없는 NPC는?", "로엘"],
  ["커닝시티에서 만날 수 없는 NPC는?", "루크"],
  ["오르비스에서 만날 수 없는 NPC는?", "소피아"],
  ["엘나스에서 만날 수 없는 NPC는?", "엘마"],
  ["합성·제련·제작을 해주는 NPC가 아닌 사람은?", "쉐인"],
  ["펫과 관련되지 않은 NPC는?", "비셔스"],
  ["천지의 원수는 누구인가?", "만지"],
  ["주먹펴고 일어서의 모자에 달린 깃털 개수는?", "13개"],
  ["헬레나의 눈 색깔은?", "초록색"],
  ["하인즈가 들고 있는 구슬의 색깔은?", "파란색"],
  ["다크로드가 있는 맵의 이름은?", "도둑의 아지트"],
  ["카이린이 있는 항해실 모니터에 보이는 NPC는?", "김박사"],
  ["상태이상과 설명이 바르게 짝지어지지 않은 것은?", "허약 - 이동속도 감소"],
  ["레벨 1에서 2로 레벨업할 때 필요한 경험치는?", "15"],
  ["여러 번 반복해서 수행할 수 있는 퀘스트는?", "아르웬의 유리구두"],
  ["2차 전직 후 가질 수 있는 직업 명칭이 아닌 것은?", "메이지 / 버커니어"],
  ["요구 레벨이 가장 높은 퀘스트는?", "알케스터와 암흑의 크리스탈"],
  ["낡은 글라디우스를 각성시킬 때 필요하지 않은 것은?", "요정의 날개"],
  ["가출소년 알렉스의 아버지는?", "장로 스탄"],
  ["오시리아의 알파소대원이 아닌 사람은?", "피터중사"],
  ["2차 전직 검은 구슬 30개를 모은 뒤 받는 물건은?", "영웅의 증거"],
  ["마야가 병을 고치기 위해 구해달라고 한 물건은?", "이상한 약"],
  ["빅토리아 아일랜드 개미굴에서 볼 수 없는 몬스터는?", "스톤볼"],
  ["메이플 아일랜드에서 볼 수 없는 몬스터는?", "리본돼지"],
  ["오르비스행·엘리니아행 배에 나오는 몬스터는?", "크림슨발록"],
  ["초록버섯·스텀프·버블링·엑스텀프·옥토퍼스 중 레벨이 가장 높은 몬스터는?", "엑스텀프"],
  ["오시리아 대륙에서 만날 수 없는 몬스터는?", "크로코"],
  ["공중을 날아다니는 몬스터는?", "멜러디"],
  ["몬스터와 전리품이 바르게 짝지어진 것은?", "스티지 - 스티지의 날개"],
  ["몬스터와 전리품이 바르게 짝지어지지 않은 것은?", "네펜데스 - 네펜데스의 꽃잎"],
  ["물약과 기능이 올바르게 짝지어진 것은?", "피자 - HP 400 회복"],
  ["물약과 기능이 올바르게 짝지어지지 않은 것은?", "새벽의 이슬 - MP 3000 회복"],
  ["운영자 이벤트에서 과일생크림케이크는 몇 개를 주는가?", "5개"],
  ["언데드 몬스터가 아닌 것은?", "주니어부기"],
  ["메이플스토리 모바일 출시일은?", "2004년 7월 16일"],
  ["메이플스토리 공식 가이드북 가격은?", "12,000원"],
  ["몬스터 공격에 관한 설명 중 틀린 것은?", "독 - 보스 몬스터에게 강한 데미지"],
  ["적중률에 가장 많이 의존하는 직업은?", "궁수"],
  ["몬스터 드롭 아이템으로 틀린 것은? (레이스)", "레이스 - 식탁보"],
  ["몬스터 드롭 아이템으로 틀린 것은? (엑스텀프)", "엑스텀프 - 나뭇가지"],
  ["HP와 MP를 50% 회복하는 아이템은?", "엘릭서"],
  ["메이플 아일랜드에서 볼 수 없는 몬스터는? (스톤볼)", "아이스 스톤볼"],
  ["빅토리아 아일랜드에서 볼 수 없는 몬스터는?", "헥터"],
  ["엘나스에서 볼 수 없는 몬스터는?", "리게이터"],
  ["오시리아 대륙에서 볼 수 없는 몬스터는? (리게이터)", "리게이터"],
  ["메이플 아일랜드에서 볼 수 없는 몬스터는? (파이어보어)", "파이어보어"],
  ["스텀프 50마리를 잡는 퀘스트는?", "스텀프가 무서워요"],
  ["알을 모아오는 퀘스트를 주는 NPC는?", "네미"],
  ["인기도를 주는 퀘스트를 가진 NPC는?", "슈미"],
  ["하인즈가 있는 마을은?", "엘리니아"],
  ["알케스터가 있는 마을은?", "엘나스"],
  ["엘나스에서 신발을 만드는 NPC는?", "고든"],
  ["장난감공장은 어느 대륙에 있는가?", "루디브리엄"],
  ["네미가 있는 마을은?", "루디브리엄"],
  ["다음 중 메이플 아일랜드에서 볼 수 없는 몬스터는? (달팽이·파란 달팽이·주황버섯)", "아이스 센티넬"]
];

const input = document.querySelector("#quizSearch");
const clearButton = document.querySelector("#clearQuizSearch");
const results = document.querySelector("#quizResults");
const empty = document.querySelector("#quizEmpty");
const title = document.querySelector("#quizTitle");
const summary = document.querySelector("#quizSummary");
const count = document.querySelector("#quizCount");

const normalize = (value) => value.toLocaleLowerCase("ko-KR").replace(/\s+/g, "");
const escapeHtml = (value) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

function highlight(value, query) {
  if (!query) return escapeHtml(value);
  const escaped = escapeHtml(value);
  const compactQuery = query.trim();
  const index = value.toLocaleLowerCase("ko-KR").indexOf(compactQuery.toLocaleLowerCase("ko-KR"));
  if (index < 0) return escaped;
  return `${escapeHtml(value.slice(0, index))}<mark>${escapeHtml(value.slice(index, index + compactQuery.length))}</mark>${escapeHtml(value.slice(index + compactQuery.length))}`;
}

function render() {
  const query = input.value.trim();
  const normalizedQuery = normalize(query);
  const matches = QUIZ.map((item, index) => ({ item, index })).filter(({ item }) =>
    !normalizedQuery || normalize(`${item[0]} ${item[1]}`).includes(normalizedQuery)
  );

  title.textContent = query ? `"${query}" 검색 결과` : "3차 전직 족보";
  summary.textContent = query ? `질문과 정답을 함께 검색했습니다.` : `3차 전직 퀴즈 ${QUIZ.length}문항`;
  count.textContent = matches.length;
  clearButton.hidden = !query;
  empty.hidden = matches.length > 0;
  results.hidden = matches.length === 0;
  results.innerHTML = matches.map(({ item, index }) => `
    <article class="quiz-card">
      <span class="quiz-number">Q${index + 1}</span>
      <p class="quiz-question">${highlight(item[0], query)}</p>
      <strong class="quiz-answer">${highlight(item[1], query)}</strong>
    </article>
  `).join("");
}

input.addEventListener("input", render);
clearButton.addEventListener("click", () => {
  input.value = "";
  render();
  input.focus();
});
document.querySelectorAll("[data-keyword]").forEach((button) => {
  button.addEventListener("click", () => {
    input.value = button.dataset.keyword;
    render();
    document.querySelector(".quiz-panel").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
document.addEventListener("keydown", (event) => {
  if (event.key === "/" && document.activeElement !== input) {
    event.preventDefault();
    input.focus();
  }
  if (event.key === "Escape" && document.activeElement === input) {
    input.value = "";
    render();
  }
});

render();
