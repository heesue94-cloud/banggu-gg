const experience = [
  15,34,57,92,135,372,560,840,1242,1716,2360,3216,4200,5460,7050,8840,11040,13716,16680,20216,
  24402,28980,34320,40512,54900,57210,63666,73080,83270,95700,108480,122760,138666,155540,174216,
  194832,216600,240550,266682,294216,324240,356916,391160,428280,468450,510420,555680,604416,655200,
  709716,748608,789631,832902,878545,926689,977471,1031036,1087536,1147132,1209904,1276301,1346242,
  1420016,1497832,1579913,1666492,1757185,1854143,1955750,2062925,2175973,2295216,2420993,2553663,
  2693603,2841212,2996910,3161140,3334370,3517903,3709827,3913127,4127556,4353756,4592341,4844001,
  5109452,5389449,5684790,5996316,6324914,6617519,7037118,7422752,7829518,8258575,8711144,9188514,
  9620440,10223168,10783397,11374327,11997640,12655110,13348610,14080113,14851703,15665576,16524049,
  17429566,18384706,19392187,20454878,21575805,22758159,24005306,25320796,26708375,28171993,29715818,
  31344244,33061908,34873700,36784778,38800583,40926854,43169645,45535341,48030677,50662758,53439077,
  56367538,59456479,62714694,66151459,69776558,73600313,77633610,81887931,86375389,91108760,96101520,
  101367883,106922842,112782213,118962678,125481832,132358236,139611467,147262175,155332142,163844343,
  172823012,182293713,192283408,202820538,213935103,225658746,238024845,251068606,264827165,279339693,
  294647508,310794191,327825712,345790561,364739883,384727628,405810702,428049128,451506220,476248760,
  502347192,529875818,558913012,589541445,621848316,655925603,691870326,729784819,769777027,811960808,
  856456260,903390063,952895838,1005114529,1060194805,1118293480,1179575962,1244216724,1312399800,
  1384319309,1460180007,1540197871,1624600714,1713628833,1807535693,1906588648,2011069705,2121276324,
];

const rows = document.querySelector("#expRows");
const search = document.querySelector("#levelSearch");
const format = new Intl.NumberFormat("ko-KR");
const currentLevel = document.querySelector("#currentLevel");
const targetLevel = document.querySelector("#targetLevel");
const expPerTenMinutes = document.querySelector("#expPerTenMinutes");
const calculatorResult = document.querySelector("#calculatorResult");
const calculatorError = document.querySelector("#calculatorError");

rows.innerHTML = experience.map((value, index) => {
  const level = index + 1;
  return `<tr id="level-${level}" data-level="${level}">
    <td>${level}</td>
    <td>${level} → ${level + 1}</td>
    <td>${format.format(value)}</td>
  </tr>`;
}).join("");

function goToLevel(rawLevel) {
  const level = Math.max(1, Math.min(200, Number(rawLevel) || 1));
  search.value = level;
  document.querySelector(".exp-table tr.highlight")?.classList.remove("highlight");
  const row = document.querySelector(`#level-${level}`);
  row.classList.add("highlight");
  row.scrollIntoView({ behavior: "smooth", block: "center" });
}

document.querySelector("#findLevel").addEventListener("click", () => goToLevel(search.value));
search.addEventListener("keydown", (event) => {
  if (event.key === "Enter") goToLevel(search.value);
});
document.querySelector(".exp-jumps").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-level]");
  if (button) goToLevel(button.dataset.level);
});

function calculateEstimatedTime() {
  const current = Number(currentLevel.value);
  const target = Number(targetLevel.value);
  const gain = Number(expPerTenMinutes.value.replace(/[^0-9]/g, ""));

  calculatorError.textContent = "";
  if (!Number.isInteger(current) || current < 1 || current > 199) {
    calculatorError.textContent = "현재 레벨은 1~199 사이로 입력하세요.";
    calculatorResult.hidden = true;
    return;
  }
  if (!Number.isInteger(target) || target <= current || target > 200) {
    calculatorError.textContent = "목표 레벨은 현재 레벨보다 높고 200 이하여야 합니다.";
    calculatorResult.hidden = true;
    return;
  }
  if (!Number.isFinite(gain) || gain <= 0) {
    calculatorError.textContent = "10분당 획득 경험치를 입력하세요.";
    calculatorResult.hidden = true;
    return;
  }

  const required = experience.slice(current - 1, target - 1)
    .reduce((sum, value) => sum + value, 0);
  const sessions = required / gain;
  const totalMinutes = sessions * 10;
  const hours = totalMinutes / 60;
  const days = hours / 24;

  document.querySelector("#requiredExp").textContent = format.format(required);
  document.querySelector("#requiredSessions").textContent = sessions.toLocaleString("ko-KR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  document.querySelector("#estimatedTime").textContent = formatDuration(totalMinutes);
  document.querySelector("#estimatedDetail").textContent =
    `${hours.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}시간 · ${days.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}일`;
  calculatorResult.hidden = false;
}

function formatDuration(totalMinutes) {
  const rounded = Math.ceil(totalMinutes);
  const days = Math.floor(rounded / 1440);
  const hours = Math.floor((rounded % 1440) / 60);
  const minutes = rounded % 60;
  return [
    days ? `${format.format(days)}일` : "",
    hours ? `${hours}시간` : "",
    minutes || (!days && !hours) ? `${minutes}분` : "",
  ].filter(Boolean).join(" ");
}

expPerTenMinutes.addEventListener("input", () => {
  const digits = expPerTenMinutes.value.replace(/[^0-9]/g, "");
  expPerTenMinutes.value = digits ? format.format(Number(digits)) : "";
});
document.querySelector("#calculateTime").addEventListener("click", calculateEstimatedTime);
[currentLevel, targetLevel, expPerTenMinutes].forEach((input) => {
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") calculateEstimatedTime();
  });
});

const monsterData = Array.isArray(window.MONSTER_ACCURACY_DATA)
  ? window.MONSTER_ACCURACY_DATA
  : [];
const accuracyLevel = document.querySelector("#accuracyLevel");
const monsterSearch = document.querySelector("#monsterSearch");
const monsterOptions = document.querySelector("#monsterOptions");
const accuracyResult = document.querySelector("#accuracyResult");
const accuracyError = document.querySelector("#accuracyError");
const accuracyBuffs = [...document.querySelectorAll(".buff-toggle input")];

monsterOptions.innerHTML = monsterData.map((monster) =>
  `<option value="${monster.name}" label="Lv.${monster.level} · 회피율 ${monster.avoid}"></option>`
).join("");

function normalizeMonsterName(value) {
  return String(value || "").replace(/\s+/g, "").toLocaleLowerCase("ko-KR");
}

function calculateRequiredAccuracy() {
  const playerLevel = Number(accuracyLevel.value);
  const query = normalizeMonsterName(monsterSearch.value);
  const monster = monsterData.find((candidate) =>
    normalizeMonsterName(candidate.name) === query
  );

  accuracyError.textContent = "";
  if (!Number.isInteger(playerLevel) || playerLevel < 1 || playerLevel > 200) {
    accuracyError.textContent = "내 레벨은 1~200 사이로 입력하세요.";
    accuracyResult.hidden = true;
    return;
  }
  if (!monster) {
    accuracyError.textContent = "목록에서 몬스터를 선택하세요. 이름을 입력하면 검색할 수 있습니다.";
    accuracyResult.hidden = true;
    return;
  }

  const levelGap = Math.max(0, monster.level - playerLevel);
  const baseAccuracy = monster.avoid * 55 / 15;
  const rawPenalty = levelGap * monster.avoid * 2 / 15;
  const required = Math.round(baseAccuracy + rawPenalty);
  const buffTotal = accuracyBuffs
    .filter((buff) => buff.checked)
    .reduce((sum, buff) => sum + Number(buff.value), 0);
  const adjustedRequired = Math.max(0, required - buffTotal);
  const buffReduction = document.querySelector("#buffReduction");

  document.querySelector("#requiredAccuracy").textContent = format.format(adjustedRequired);
  buffReduction.textContent = `(-${format.format(buffTotal)})`;
  buffReduction.hidden = buffTotal === 0;
  document.querySelector("#selectedMonster").textContent = monster.name;
  document.querySelector("#monsterStats").textContent =
    `Lv.${monster.level} · 회피율 ${monster.avoid}`;
  document.querySelector("#accuracyPenalty").textContent =
    levelGap ? `+${rawPenalty.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}` : "없음";
  document.querySelector("#accuracyFormula").textContent = levelGap
    ? `레벨 차이 ${levelGap} × 패널티 ${(monster.avoid * 2 / 15).toLocaleString("ko-KR", { maximumFractionDigits: 3 })}`
    : "내 레벨이 몬스터 레벨 이상";
  accuracyResult.hidden = false;
}

document.querySelector("#calculateAccuracy").addEventListener("click", calculateRequiredAccuracy);
[accuracyLevel, monsterSearch].forEach((input) => {
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") calculateRequiredAccuracy();
  });
});
accuracyBuffs.forEach((buff) => {
  buff.addEventListener("change", () => {
    if (!accuracyResult.hidden) calculateRequiredAccuracy();
  });
});
