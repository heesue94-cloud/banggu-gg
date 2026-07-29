const MAGIC_DATA = {
  meteor: {
    name: "메테오", levels: [1, 10, 20, 30], power: [330, 420, 520, 620],
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
    name: "블리자드", levels: [1, 10, 20, 30], power: [330, 420, 520, 600],
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
    name: "제네시스", levels: [1, 10, 20, 30], power: [430, 520, 620, 670],
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
const ampSelect = document.querySelector("#ampLevel");
const ampControl = document.querySelector("#ampControl");
const search = document.querySelector("#magicSearch");
const currentMagic = document.querySelector("#currentMagic");
const rows = document.querySelector("#magicRows");
const empty = document.querySelector("#magicEmpty");
let spellKey = "meteor";

function scale(values, factor) {
  return values ? values.map(value => Math.round(value * factor)) : null;
}

function cutsFor(monster, kill) {
  if (spellKey === "genesis") return kill === "one" ? monster[2] : monster[3];
  const amp = ampSelect.value;
  if (amp === "3") return kill === "one" ? monster[2] : scale(monster[2], 2 / 3);
  return kill === "two" ? monster[3] : scale(monster[3] || monster[2], monster[3] ? 1.5 : .82);
}

function render() {
  const data = MAGIC_DATA[spellKey];
  const query = search.value.trim().replace(/\s+/g, "").toLowerCase();
  const mine = Number(currentMagic.value) || 0;
  const filtered = data.monsters.filter(monster => monster[0].replace(/\s+/g, "").toLowerCase().includes(query));
  const resultRows = [];

  filtered.forEach(monster => {
    [["one","1킬"],["two","2킬"]].forEach(([kind,label], rowIndex) => {
      const cuts = cutsFor(monster, kind);
      if (!cuts) return;
      const bestCut = cuts.at(-1);
      const state = !mine ? "마력 입력 시 판정" : mine >= bestCut ? `가능 · ${mine-bestCut} 여유` : `부족 · ${bestCut-mine}`;
      const stateClass = !mine ? "" : mine >= bestCut ? "pass" : "fail";
      resultRows.push(`<tr class="${rowIndex === 0 ? "monster-start" : ""}">
        ${rowIndex === 0 ? `<td class="monster-cell" rowspan="2"><strong>${monster[0]}</strong><small>LV ${monster[1]}</small></td>` : ""}
        <td><span class="kill-badge ${kind}">${label}</span></td>
        ${cuts.map((cut,index) => `<td class="cut ${index === cuts.length-1 ? "best" : ""}">${cut.toLocaleString()}</td>`).join("")}
        <td class="state-cell"><span class="magic-state ${stateClass}">${state}</span></td>
      </tr>`);
    });
  });

  rows.innerHTML = resultRows.join("");
  rows.closest("table").hidden = resultRows.length === 0;
  empty.hidden = resultRows.length > 0;
  const hasAmp = spellKey !== "genesis";
  ampSelect.disabled = !hasAmp;
  ampControl.classList.toggle("amp-disabled", !hasAmp);
  const ampText = hasAmp ? (ampSelect.value === "M" ? "마스터 (M)" : "3레벨") : "해당 없음";
  document.querySelector("#selectedSpell").textContent = data.name;
  document.querySelector("#ampSummary").textContent = ampText;
  document.querySelector("#rowCount").textContent = `${filtered.length}종`;
  document.querySelector("#tableTitle").textContent = `${data.name} 마력표`;
  document.querySelector("#tableCaption").textContent = hasAmp ? `엘리먼트 앰플리피케이션 ${ampText} 기준` : "제네시스 스킬 레벨 기준";
}

tabs.forEach(tab => tab.addEventListener("click", () => {
  spellKey = tab.dataset.spell;
  tabs.forEach(item => item.classList.toggle("active", item === tab));
  render();
}));
ampSelect.addEventListener("change", render);
search.addEventListener("input", render);
currentMagic.addEventListener("input", render);
render();
