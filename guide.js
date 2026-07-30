const ROUTE = [
  ["커닝시티","페티트","맵이동(커닝시티) 이후 오른쪽 이동","메이플멤버샵 퀘스트 클리어"],
  ["커닝시티","커닝시티공사장","맵이동(커닝시티) 이후 왼쪽 포탈","LV.16까지 스포아 사냥"],
  ["리스항구","리더 알","맵이동(리스항구) 후 오른쪽 상단","리더 알 퀘스트 끝까지 수행"],
  ["커닝시티","커닝시티공사장","맵이동 후 왼쪽 포탈","LV.20까지 스포아 사냥"],
  ["SECTION","","","1차 전직"],
  ["커닝시티","알렉스","커닝시티 맵 중앙 높은 곳","알렉스의 부탁 퀘스트 받기"],
  ["노틸러스 선착장","아벨","맵이동 후 좌측 이동","안경을 찾아줘 퀘스트 클리어"],
  ["노틸러스호","샤를","하층복도","빛나는 돌 클리어"],
  ["노틸러스호","포쉐","동력실","포쉐의 편지 퀘스트 수령"],
  ["노틸러스호","리드","상층복도","노틸러스호 깨끗이하기 1 클리어"],
  ["노틸러스호","무라트","상층복도","쓰다가 버려진 편지 퀘스트 수령"],
  ["헤네시스","장로스탄","마을","어머니 금시계까지 받기"],
  ["헤네시스","피아","헤네시스 공원","피아와 파란버섯"],
  ["헤네시스","헬레나","헤네시스 공원","오르골까지 받기"],
  ["커닝시티","알렉스","","금시계 돌려주기"],
  ["페리온","만지","","만지와 비밀조직 퀘스트 수령"],
  ["페리온","맵이동","오른쪽 맨 아래 깊은골짜기 → 던전입구","이동"],
  ["페리온","마이크","","졸음을 쫓는 방법 퀘스트 클리어"],
  ["페리온","만지","","만지와 비밀조직 퀘스트 클리어"],
  ["슬리피우드","기억하고 있는 자","","연구용뿔버섯의 갓 클리어"],
  ["노틸러스","바르톨","중앙복도","게으른 캘리코 퀘스트 클리어"],
  ["노틸러스","샤를","하층복도","바다의 성기 퀘스트 수령"],
  ["노틸러스","탕윤","상층복도","이상한 요리1 퀘스트 클리어"],
  ["노틸러스","리드","","노틸러스호 깨끗이하기 3가지 클리어"],
  ["아쿠아리움","켄타","","포쉐의 편지 퀘스트 클리어"],
  ["아쿠아리움","뮤즈","","마법의 병 받을 때까지 대화"],
  ["노틸러스","샤를","하층복도","동력실 → 진주파밍"],
  ["노틸러스","무라트","상층복도","커다란 진주 퀘스트 클리어"],
  ["노틸러스","카이린","상층복도","헬레나의 선물 클리어"],
  ["노틸러스","보니","하층복도","이동"],
  ["노틸러스","클로네","중앙복도","김박사님에게 보낼정보 퀘스트 수령"],
  ["노틸러스","블랙바크","중앙복도","블랙바크의 근심 퀘스트 수령"],
  ["SECTION","","","2차 전직"],
  ["머쉬킹왕국","전구 아이콘","좌측 전구 아이콘 클릭","위기의 머쉬킹 왕국 퀘스트 수령 후 이동"],
  ["머쉬킹왕국","경호대장","","경호대장 계속 대화"],
  ["머쉬킹왕국","내무대신","","내무대신 계속 대화"],
  ["머쉬킹왕국","맵이동","깊숙한 버섯의 숲","우측 끝까지 이동 후 대화창 뜨면 마을귀환주문서"],
  ["머쉬킹왕국","마법대신","","마법대신 계속 대화"],
  ["머쉬킹왕국","스카스","","스카스 계속 대화, 브루스와의 우정 나중에 받기"],
  ["머쉬킹왕국","맵이동","깊숙한 버섯의 숲","선택의 갈림길 우상단 포탈 입장 후 대화"],
  ["머쉬킹왕국","맵이동","성벽의 가장자리","덩굴가시 제거제 사용 후 마을귀환주문서"],
  ["머쉬킹왕국","마법대신","","퀘스트 클리어"],
  ["머쉬킹왕국","스카스","","브루스와의 우정 퀘스트 수령"],
  ["아쿠아리움","로빈슨","","로빈슨 계속 대화"],
  ["헤네시스","브루스","","브루스와의 우정 퀘스트 클리어"],
  ["헤네시스","밍밍부인","","카이린을 위한 드레스 퀘스트 클리어"],
  ["헤네시스","장로스탄","","장로스탄의 편지 퀘스트 수령"],
  ["지구방위본부","김박사","","2개 퀘스트 클리어"],
  ["지구방위본부","케이","3번방(격납고) 제일 하단","워프캡슐까지 받기"],
  ["아쿠아리움","로빈슨 클리어","","퀘스트 클리어"],
  ["아쿠아리움","태공","","태공의 아내사랑 퀘스트 수락"],
  ["아랫마을","칠성칠남","","퀘완료"],
  ["아랫마을","제비","","잃어버린 박씨 퀘스트"],
  ["아랫마을","놀부","","놀부의 박따기 퀘스트"],
  ["아랫마을","연이할머니","","태공의 아내사랑 퀘스트 클리어"],
  ["아랫마을","콩쥐","","밑빠진독 퀘스트 클리어"],
  ["아랫마을","사서 위즈","도서관","흥부놀부 위즈 요청지"],
  ["노틸러스","블랙바크","중앙복도","카이린을 위한 드레스"],
  ["노틸러스","탕윤","상층복도","이상한요리 2~3"],
  ["커닝스퀘어","전구 아이콘","좌측 전구 아이콘 클릭","혁이의 소원 퀘스트 후 커닝스퀘어 퀘스트 43까지"]
];

const MATERIALS = [
  ["뿔버섯의 갓",30],["초록버섯의 갓",40],["파란버섯의 갓",40],["돼지의 리본",110],
  ["이블아이의 꼬리",80],["커즈아이의 꼬리",50],["콜드아이의 꼬리",50],["식탁보",40],
  ["단단한 뿔",50],["쥐덫",50],["변종포자",100],["독버섯의 갓",100],
  ["중독된 돼지꼬리",100],["체리버블",30],["멜론버블",30],["망고버블",40],
  ["새우살",20],["예티 키홀더",50],["주니어 페페 키홀더",50],["주황버섯 인형",20],
  ["남자마네킹의 페도라",50],["여자마네킹의 가발",50],["아이마네킹의 토끼의상",50],["SOS 구조요청 편지",1]
];

const CONSUMABLES = [
  ["빨간포션",1],["파란포션",1],["주황포션",1],["하얀포션",1],
  ["마나 엘릭서",1],["맑은 물",2],["마을귀환주문서",3]
];

const routeRows = document.querySelector("#routeRows");

function saved(key) { try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; } }
function store(key,value) { localStorage.setItem(key,JSON.stringify(value)); }

function renderRoute() {
  const done = new Set(saved("banggu-guide-route"));
  const filtered = ROUTE.map((row,index)=>({row,index}));
  let group = -1;
  let previousMap = "";
  const grouped = filtered.map(item => {
    if (item.row[0] === "SECTION") {
      previousMap = "";
      return {...item, group: null};
    }
    if (item.row[0] !== previousMap) group += 1;
    previousMap = item.row[0];
    return {...item, group};
  });
  const groupSizes = grouped.reduce((sizes,item)=>{
    if (item.group !== null) sizes[item.group] = (sizes[item.group] || 0) + 1;
    return sizes;
  },{});
  const firstInGroup = new Set();
  routeRows.innerHTML = grouped.map(({row,index,group}) => {
    if (row[0] === "SECTION") return `<tr class="section-row"><td colspan="5">${row[3]}</td></tr>`;
    const isFirst = !firstInGroup.has(group);
    firstInGroup.add(group);
    const checked = done.has(index);
    const mapCell = isFirst
      ? `<td class="route-map-cell" rowspan="${groupSizes[group]}">${row[0]}</td>`
      : "";
    return `<tr class="${checked ? "done" : ""}">${mapCell}<td>${row[1] || "—"}</td><td>${row[2] || "—"}</td><td>${row[3]}</td><td><input class="route-check" type="checkbox" data-route="${index}" ${checked ? "checked" : ""} aria-label="${row[3]} 완료"></td></tr>`;
  }).join("");
  document.querySelector("#routeEmpty").hidden = filtered.length > 0;
}

function renderSupplyTable(target,data,key) {
  const checked = new Set(saved(key));
  target.innerHTML = data.map(([name,count],index)=>`<tr class="${checked.has(index) ? "checked" : ""}">
    <td><input class="supply-check" type="checkbox" data-item="${index}" ${checked.has(index) ? "checked" : ""} aria-label="${name} 준비 완료"></td>
    <td>${name}</td><td>${count}개</td>
    <td><button class="copy-item" type="button" data-copy="${name}" data-copy-index="${index}">복사</button></td>
  </tr>`).join("");
  target.querySelectorAll("[data-item]").forEach(input=>input.addEventListener("change",()=>{
    const next = new Set(saved(key)); const index = Number(input.dataset.item);
    input.checked ? next.add(index) : next.delete(index); store(key,[...next]); renderSupplyTable(target,data,key);
  }));
  target.querySelectorAll("[data-copy]").forEach(button=>button.addEventListener("click",async()=>{
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      const next = new Set(saved(key));
      const index = Number(button.dataset.copyIndex);
      next.add(index);
      store(key,[...next]);
      renderSupplyTable(target,data,key);
      const copiedButton = target.querySelector(`[data-copy-index="${index}"]`);
      copiedButton.textContent = "복사됨"; copiedButton.classList.add("copied");
      setTimeout(()=>{copiedButton.textContent="복사";copiedButton.classList.remove("copied");},1200);
    } catch {
      button.textContent = "실패";
      setTimeout(()=>button.textContent="복사",1200);
    }
  }));
}

routeRows.addEventListener("change",event=>{
  if (!event.target.matches("[data-route]")) return;
  const done = new Set(saved("banggu-guide-route")); const index=Number(event.target.dataset.route);
  event.target.checked ? done.add(index) : done.delete(index); store("banggu-guide-route",[...done]); renderRoute();
});
document.querySelector("#resetRoute").addEventListener("click",()=>{
  store("banggu-guide-route",[]);
  renderRoute();
});
document.querySelector("#resetMaterials").addEventListener("click",()=>{
  store("banggu-guide-materials",[]); store("banggu-guide-consumables",[]);
  renderSupplyTable(document.querySelector("#materialRows"),MATERIALS,"banggu-guide-materials");
  renderSupplyTable(document.querySelector("#consumableRows"),CONSUMABLES,"banggu-guide-consumables");
});

renderRoute();
renderSupplyTable(document.querySelector("#materialRows"),MATERIALS,"banggu-guide-materials");
renderSupplyTable(document.querySelector("#consumableRows"),CONSUMABLES,"banggu-guide-consumables");
