const MAGIC_DATA = {
  meteor: {
    name: "메테오", levels: [1, 10, 20, 30], power: [330, 420, 520, 620], mp: [1725, 2760, 3910, 3335],
    monsters: [
      ["후회의 사제",106,[1685,1465,1292,1163],[926,796,687,605]],
      ["후회의 신관",109,[1793,1559,1376,1239],[1198,1036,909,813]],
      ["후회의 수호병",113,[1609,1394,1228,1105],[1067,921,805,713]],
      ["후회의 수호대장",116,[2041,1775,1567,1414],[1366,1184,1041,935]],
      ["다크 코니언",105,[1713,1488,1312,1181],null],
      ["네스트 골렘",110,[2278,1985,1755,1583],[1269,1098,964,865]]
    ]
  },
  blizzard: {
    name: "블리자드", levels: [1, 10, 20, 30], power: [330, 420, 520, 600], mp: [1725, 2760, 3910, 3335],
    monsters: [
      ["붉은 켄타우로스",88,[1149,993,871,794],[751,634,541,483]],
      ["검은 켄타우로스",88,[1462,1268,1116,1023],[970,836,724,654]],
      ["레쉬스톤",97,[1721,1495,1319,1211],[1148,992,870,793]],
      ["다크 코니언",105,[1713,1488,1312,1205],[1141,986,865,787]],
      ["네스트 골렘",110,[2278,1985,1755,1614],[1531,1329,1170,1073]],
      ["망각의 사제",121,[2224,1938,1712,1574],[1493,1296,1141,1046]],
      ["망각의 수호병",131,[2492,2175,1925,1771],[1678,1458,1286,1181]],
      ["변형된 주황버섯",134,[2857,2499,2217,2043],[2281,1988,1758,1617]]
    ]
  },
  genesis: {
    name: "제네시스", levels: [1, 10, 20, 30], power: [430, 520, 620, 670], mp: [2100, 3000, 4000, 3500],
    monsters: [
      ["검은 켄타우로스",88,[1031,918,823,781],[664,578,505,474]],
      ["붉은 켄타우로스",88,[1315,1174,1056,1007],[868,769,681,643]],
      ["레쉬스톤",97,[1551,1387,1250,1194],[1033,917,815,772]],
      ["스켈로스",113,[1685,1509,1361,1300],[1124,1001,896,850]],
      ["폭렬 망둥이",90,[1710,1530,1380,1319],null],
      ["콜드 샤크",102,[1719,1538,1388,1326],null],
      ["다크 코니언",105,[1858,1663,1502,1435],[1141,986,865,787]],
      ["네스트 골렘",110,[2058,1845,1664,1591],[1379,1232,1109,1058]]
    ]
  }
};

const tabs = document.querySelectorAll("[data-spell]");
const levelSelect = document.querySelector("#skillLevel");
const search = document.querySelector("#magicSearch");
const currentMagic = document.querySelector("#currentMagic");
const rows = document.querySelector("#magicRows");
const empty = document.querySelector("#magicEmpty");
let spellKey = "meteor";

function selectedIndex() {
  return MAGIC_DATA[spellKey].levels.indexOf(Number(levelSelect.value));
}

function renderLevels() {
  levelSelect.innerHTML = MAGIC_DATA[spellKey].levels.map(level => `<option value="${level}">${level}레벨</option>`).join("");
  levelSelect.value = MAGIC_DATA[spellKey].levels.at(-1);
}

function render() {
  const data = MAGIC_DATA[spellKey];
  const index = selectedIndex();
  const query = search.value.trim().replace(/\s+/g, "").toLowerCase();
  const mine = Number(currentMagic.value) || 0;
  const filtered = data.monsters.filter(monster => monster[0].replace(/\s+/g, "").toLowerCase().includes(query));
  const resultRows = [];
  filtered.forEach(monster => {
    [["1킬",monster[2],"one"],["2킬",monster[3],"two"]].forEach(([kill,values,klass]) => {
      if (!values) return;
      const required = values[index];
      const state = !mine ? "마력 입력 시 판정" : mine >= required ? `가능 · ${mine-required} 여유` : `부족 · ${required-mine}`;
      const stateClass = !mine ? "" : mine >= required ? "pass" : "fail";
      resultRows.push(`<tr><td class="monster-name">${monster[0]}</td><td>Lv.${monster[1]}</td><td><span class="kill-badge ${klass}">${kill}</span></td><td class="required">${required.toLocaleString()}</td><td><span class="magic-state ${stateClass}">${state}</span></td></tr>`);
    });
  });
  rows.innerHTML = resultRows.join("");
  rows.closest("table").hidden = resultRows.length === 0;
  empty.hidden = resultRows.length > 0;
  document.querySelector("#selectedSpell").textContent = data.name;
  document.querySelector("#spellPower").textContent = data.power[index].toLocaleString();
  document.querySelector("#spellMp").textContent = `MP ${data.mp[index].toLocaleString()}`;
  document.querySelector("#rowCount").textContent = `${filtered.length}종`;
  document.querySelector("#tableTitle").textContent = `${data.name} 마력표`;
}

tabs.forEach(tab => tab.addEventListener("click", () => {
  spellKey = tab.dataset.spell;
  tabs.forEach(item => item.classList.toggle("active", item === tab));
  renderLevels();
  render();
}));
levelSelect.addEventListener("change", render);
search.addEventListener("input", render);
currentMagic.addEventListener("input", render);
renderLevels();
render();
