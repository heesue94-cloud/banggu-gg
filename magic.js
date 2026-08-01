const LEVELS = [1, 10, 20, 30];

const monster = (name, level, targets) => ({ name, level, targets });
const target = (label, cuts) => ({ label, cuts });

const MAGIC_DATA = {
  fp: {
    job: "불독",
    spell: "메테오",
    modes: {
      M: [
        monster("후회의 사제", 106, [target("2킬", [926, 796, 687, 605]), target("1킬", [1399, 1213, 1067, 958])]),
        monster("후회의 신관", 109, [target("2킬", [988, 852, 739, 653]), target("1킬", [1489, 1292, 1137, 1023])]),
        monster("후회의 수호병", 113, [target("2킬", [1067, 921, 805, 713]), target("1킬", [1605, 1394, 1228, 1105])]),
        monster("후회의 수호대장", 116, [target("2킬", [1130, 976, 856, 761]), target("1킬", [1695, 1474, 1300, 1170])]),
        monster("네스트 골렘", 110, [target("2킬", [1269, 1098, 964, 865]), target("1킬", [1897, 1649, 1456, 1313])]),
        monster("변형된 주황버섯", 134, [target("3킬", [1502, 1303, 1147, 1031])]),
        monster("변형된 티구르", 137, [target("3킬", [1537, 1335, 1175, 1057]), target("2킬", [1944, 1689, 1492, 1345]), target("1킬", [2868, 2509, 2225, 2013])])
      ],
      3: [
        monster("후회의 사제", 106, [target("2킬", null), target("1킬", [1685, 1465, 1292, 1163])]),
        monster("후회의 신관", 109, [target("2킬", [1198, 1036, 909, 813]), target("1킬", [1793, 1559, 1376, 1239])]),
        monster("후회의 수호병", 113, [target("2킬", null), target("1킬", [1933, 1679, 1483, 1337])]),
        monster("후회의 수호대장", 116, [target("2킬", [1366, 1184, 1041, 935]), target("1킬", [2041, 1775, 1567, 1414])]),
        monster("다크 코니언", 105, [target("2킬", null), target("1킬", [1713, 1488, 1312, 1181])]),
        monster("네스트 골렘", 110, [target("2킬", [1531, 1329, 1170, 1052]), target("1킬", [2278, 1985, 1755, 1583])]),
        monster("변형된 주황버섯", 134, [target("3킬", [1810, 1571, 1387, 1250]), target("2킬", [2278, 1986, 1755, 1584]), target("1킬", null)]),
        monster("변형된 티구르", 137, [target("3킬", [1852, 1609, 1420, 1280]), target("2킬", [2332, 2033, 1796, 1622]), target("1킬", null)])
      ]
    }
  },
  il: {
    job: "썬콜",
    spell: "블리자드",
    modes: {
      M: [
        monster("붉은 켄타우로스", 88, [target("2킬", [601, 501, 421, 371]), target("1킬", [947, 816, 705, 636])]),
        monster("검은 켄타우로스", 88, [target("2킬", [796, 674, 577, 517]), target("1킬", [1210, 1047, 919, 841])]),
        monster("리셀 스퀴드", 97, [target("2킬", [946, 815, 704, 635]), target("1킬", [1428, 1238, 1089, 999])]),
        monster("다크 코니언", 105, [target("2킬", [1141, 986, 865, 787]), target("1킬", [1713, 1488, 1312, 1205])]),
        monster("네스트 골렘", 110, [target("2킬", [1269, 1098, 964, 883]), target("1킬", [1897, 1649, 1456, 1339])]),
        monster("망각의 사제", 121, [target("2킬", [1237, 1070, 940, 860]), target("1킬", [1852, 1609, 1421, 1306])]),
        monster("망각의 신관", 124, [target("2킬", [1287, 1114, 979, 897]), target("1킬", [1926, 1673, 1478, 1358])]),
        monster("망각의 수호병", 128, [target("2킬", null), target("1킬", [2013, 1750, 1545, 1421])]),
        monster("망각의 수호대장", 131, [target("2킬", [1393, 1207, 1062, 973]), target("1킬", [2080, 1811, 1598, 1471])]),
        monster("변형된 주황버섯", 134, [target("3킬", [1902, 1652, 1459, 1341]), target("2킬", [2393, 2086, 1846, 1697])])
      ],
      3: [
        monster("붉은 켄타우로스", 88, [target("2킬", [751, 634, 541, 483]), target("1킬", [1149, 993, 871, 794])]),
        monster("검은 켄타우로스", 88, [target("2킬", [970, 836, 724, 654]), target("1킬", [1462, 1268, 1116, 1023])]),
        monster("리셀 스퀴드", 97, [target("2킬", [1148, 992, 870, 793]), target("1킬", [1721, 1495, 1319, 1211])]),
        monster("다크 코니언", 105, [target("2킬", null), target("1킬", [2059, 1791, 1582, 1455])]),
        monster("네스트 골렘", 110, [target("2킬", [1531, 1329, 1170, 1073]), target("1킬", [2278, 1985, 1755, 1614])]),
        monster("망각의 사제", 121, [target("2킬", [1493, 1296, 1141, 1046]), target("1킬", [2224, 1938, 1712, 1574])]),
        monster("망각의 신관", 124, [target("2킬", [1553, 1348, 1187, 1090]), target("1킬", [2311, 2015, 1780, 1637])]),
        monster("망각의 수호병", 128, [target("2킬", [1622, 1409, 1242, 1140]), target("1킬", [2412, 2105, 1861, 1713])]),
        monster("망각의 수호대장", 131, [target("2킬", [1678, 1458, 1286, 1181]), target("1킬", [2492, 2175, 1925, 1771])]),
        monster("변형된 주황버섯", 134, [target("3킬", [2281, 1988, 1758, 1617]), target("2킬", [2857, 2499, 2217, 2043])])
      ]
    }
  },
  bishop: {
    job: "비숍",
    spell: "제네시스",
    modes: {
      genesis: [
        monster("검은 켄타우로스", 88, [target("2킬", [664, 578, 505, 474]), target("1킬", [1031, 918, 823, 781])]),
        monster("붉은 켄타우로스", 88, [target("2킬", [868, 769, 681, 643]), target("1킬", [1315, 1174, 1056, 1007])]),
        monster("리셀 스퀴드", 97, [target("2킬", [1031, 917, 815, 772]), target("1킬", [1551, 1387, 1250, 1194])]),
        monster("스켈로스", 113, [target("2킬", [1124, 1001, 896, 850]), target("1킬", [1685, 1509, 1361, 1300])]),
        monster("폭렬 망둥이집", 90, [target("1킬", [1710, 1530, 1380, 1319])]),
        monster("콜드 샤크", 102, [target("1킬", [1719, 1538, 1388, 1326])]),
        monster("동굴 다크 와이번", 103, [target("바하뮤트 M + 제네시스 연계 1킬", [1604, 1489, 1384, 1338]), target("1킬", [2057, 1844, 1664, 1590])]),
        monster("다크 코니언", 105, [target("2킬", null), target("1킬", [1858, 1663, 1502, 1435])]),
        monster("네스트 골렘", 110, [target("2킬", [1379, 1232, 1109, 1058]), target("1킬", [2058, 1845, 1664, 1591])]),
        monster("후회의 수호대장", 116, [target("2킬", [1560, 1396, 1258, 1201]), target("1킬", [2322, 2084, 1884, 1802])]),
        monster("변형된 주황버섯", 134, [target("3킬", [2062, 1848, 1667, 1594]), target("2킬", [2588, 2327, 2107, 2015])])
      ]
    }
  }
};

const jobTabs = document.querySelectorAll("[data-job]");
const ampTabs = document.querySelectorAll("[data-amp]");
const ampWrap = document.querySelector("#ampTabs");
const genesisTab = document.querySelector("#genesisTab");
const search = document.querySelector("#magicSearch");
const currentMagic = document.querySelector("#currentMagic");
const rows = document.querySelector("#magicRows");
const empty = document.querySelector("#magicEmpty");
let jobKey = "fp";
let ampKey = "M";

function cell(value, index) {
  return `<td class="cut ${value == null ? "missing" : index === 3 ? "best" : ""}">${value == null ? "—" : value.toLocaleString()}</td>`;
}

function render() {
  const data = MAGIC_DATA[jobKey];
  const mode = jobKey === "bishop" ? "genesis" : ampKey;
  const list = data.modes[mode];
  const query = search.value.trim().replace(/\s+/g, "").toLowerCase();
  const mine = Number(currentMagic.value) || 0;
  const filtered = list.filter(item => item.name.replace(/\s+/g, "").toLowerCase().includes(query));
  const html = [];

  filtered.forEach(item => {
    item.targets.forEach((entry, index) => {
      const targetMagic = entry.cuts?.filter(value => value != null).at(-1);
      const state = !mine || !targetMagic
        ? "마력 입력 후 판정"
        : mine >= targetMagic
          ? `가능 · ${mine - targetMagic} 여유`
          : `부족 · ${targetMagic - mine}`;
      const stateClass = !mine || !targetMagic ? "" : mine >= targetMagic ? "pass" : "fail";
      html.push(`<tr class="${index === 0 ? "monster-start" : ""}">
        ${index === 0 ? `<td class="monster-cell" rowspan="${item.targets.length}"><strong>${item.name}</strong><small>LV ${item.level}</small></td>` : ""}
        <td><span class="kill-badge ${entry.label === "3킬" ? "three" : entry.label.includes("1킬") ? "one" : "two"}">${entry.label}</span></td>
        ${LEVELS.map((_, levelIndex) => cell(entry.cuts?.[levelIndex] ?? null, levelIndex)).join("")}
        <td class="state-cell"><span class="magic-state ${stateClass}">${state}</span></td>
      </tr>`);
    });
  });

  rows.innerHTML = html.join("");
  rows.closest("table").hidden = !html.length;
  empty.hidden = Boolean(html.length);
  ampWrap.hidden = jobKey === "bishop";
  genesisTab.hidden = jobKey !== "bishop";
  document.querySelector("#selectedJob").textContent = data.job;
  document.querySelector("#selectedSpell").textContent = data.spell;
  document.querySelector("#selectedAmp").textContent = jobKey === "bishop" ? "제네시스" : `앰플리피케이션 ${ampKey}`;
  document.querySelector("#rowCount").textContent = `${filtered.length}종 · ${filtered.reduce((sum, item) => sum + item.targets.length, 0)}행`;
  document.querySelector("#tableTitle").textContent = `${data.job} · ${data.spell}`;
  document.querySelector("#tableCaption").textContent = jobKey === "bishop" ? "제네시스 스킬 레벨 기준" : `앰플리피케이션 ${ampKey} 기준`;
}

jobTabs.forEach(tab => tab.addEventListener("click", () => {
  jobKey = tab.dataset.job;
  jobTabs.forEach(item => item.classList.toggle("active", item === tab));
  render();
}));

ampTabs.forEach(tab => tab.addEventListener("click", () => {
  ampKey = tab.dataset.amp;
  ampTabs.forEach(item => item.classList.toggle("active", item === tab));
  render();
}));

search.addEventListener("input", render);
currentMagic.addEventListener("input", render);
render();
