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
        monster("다크 코니언", 105, [target("2킬", null), target("1킬", [1713, 1488, 1312, 1181])]),
        monster("네스트 골렘", 110, [target("2킬", [1269, 1098, 964, 865]), target("1킬", [1897, 1649, 1456, 1313])]),
        monster("변형된 주황버섯", 134, [target("3킬", [1502, 1303, 1147, 1031]), target("2킬", [1988, 1650, 1457, 1313]), target("1킬", [2805, 2452, 2173, 1965])]),
        monster("변형된 티구르", 137, [target("3킬", [1537, 1335, 1175, 1057]), target("2킬", [1944, 1689, 1492, 1345]), target("1킬", [2868, 2509, 2225, 2013])])
      ],
      3: [
        monster("후회의 사제", 106, [target("2킬", [1124, 971, 851, 757]), target("1킬", [1685, 1465, 1292, 1163])]),
        monster("후회의 신관", 109, [target("2킬", [1198, 1036, 909, 813]), target("1킬", [1793, 1559, 1376, 1239])]),
        monster("후회의 수호병", 113, [target("2킬", [1067, 921, 805, 713]), target("1킬", [1605, 1394, 1228, 1105])]),
        monster("후회의 수호대장", 116, [target("2킬", [1366, 1184, 1041, 935]), target("1킬", [2041, 1775, 1567, 1414])]),
        monster("다크 코니언", 105, [target("2킬", null), target("1킬", [2059, 1791, 1582, 1428])]),
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
        monster("망각의 수호병", 128, [target("2킬", [1346, 1166, 1025, 939]), target("1킬", [2013, 1750, 1545, 1421])]),
        monster("망각의 수호대장", 131, [target("2킬", [1393, 1207, 1062, 973]), target("1킬", [2080, 1811, 1598, 1471])]),
        monster("변형된 주황버섯", 134, [target("2킬", [1902, 1652, 1459, 1341]), target("1킬", [2392, 2086, 1846, 1697])])
      ],
      3: [
        monster("붉은 켄타우로스", 88, [target("2킬", [751, 634, 541, 483]), target("1킬", [1149, 993, 871, 794])]),
        monster("검은 켄타우로스", 88, [target("2킬", [970, 836, 724, 654]), target("1킬", [1462, 1268, 1116, 1023])]),
        monster("리셀 스퀴드", 97, [target("2킬", [1148, 992, 870, 793]), target("1킬", [1721, 1495, 1319, 1211])]),
        monster("다크 코니언", 105, [target("2킬", [1380, 1196, 1051, 964]), target("1킬", [2059, 1791, 1582, 1455])]),
        monster("네스트 골렘", 110, [target("2킬", [1531, 1329, 1170, 1073]), target("1킬", [2278, 1985, 1755, 1614])]),
        monster("망각의 사제", 121, [target("2킬", [1493, 1296, 1141, 1046]), target("1킬", [2224, 1938, 1712, 1574])]),
        monster("망각의 신관", 124, [target("2킬", [1553, 1348, 1187, 1090]), target("1킬", [2311, 2015, 1780, 1637])]),
        monster("망각의 수호병", 128, [target("2킬", [1622, 1409, 1242, 1140]), target("1킬", [2412, 2105, 1861, 1713])]),
        monster("망각의 수호대장", 131, [target("2킬", [1678, 1458, 1286, 1181]), target("1킬", [2492, 2175, 1925, 1771])]),
        monster("변형된 주황버섯", 134, [target("2킬", [2281, 1988, 1758, 1617]), target("1킬", [2857, 2499, 2217, 2043])])
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
        monster("폭렬 망둥이집", 90, [target("2킬", [1141, 1018, 911, 865]), target("1킬", [1710, 1530, 1380, 1319])]),
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

const MONSTER_IMAGES = {
  "후회의 사제": "https://blogfiles.pstatic.net/MjAyNTA4MTRfMjg0/MDAxNzU1MTczODY1MTc5.tA7ww5v6NMW2laGk58hqAZHZjuO0BkTHyUU6dkezAFEg.GEZpWpolUVBWI8AhzOVkMHYZwYWrP3DVh58oEugP9Ewg.PNG/%ED%9B%84%ED%9A%8C%EC%9D%98_%EC%82%AC%EC%A0%9C.png?type=w1",
  "후회의 신관": "https://blogfiles.pstatic.net/MjAyNTA4MTRfMjgx/MDAxNzU1MTczODgzNjg3.kmxrsSZ6R6aClwHK8dy_i3kvXSEbQP5y6Muf7xQPP0Ig.oGp19URKvZkP9uHefRupXm0_nVRvcSCNwzrEXYoluNkg.PNG/%ED%9B%84%ED%9A%8C%EC%9D%98_%EC%8B%A0%EA%B4%80.png?type=w1",
  "후회의 수호병": "https://blogfiles.pstatic.net/MjAyNTA4MTRfNjgg/MDAxNzU1MTczOTMzNzQ2.kcgVMqzN86uBqjmH1Mxk8gf9gRBLVEky_2ceXrZd4tYg.XNTbFdVju22qfvwiV8XggenPgE-eqU8_B0i00GpRXQ4g.PNG/%ED%9B%84%ED%9A%8C%EC%9D%98_%EC%88%98%ED%98%B8%EB%B3%91.png?type=w1",
  "후회의 수호대장": "https://blogfiles.pstatic.net/MjAyNTA4MTRfMjgy/MDAxNzU1MTc0MDUxNTY5.fkU86M4lAySme0j38CVV0VtiJZV5JjRFsZIajFo6Nn8g.2km3EmqOKNSjp9d-kn8AgiLrt1KlV5RZPpHuP-ekkwAg.PNG/%ED%9B%84%ED%9A%8C%EC%9D%98_%EC%88%98%ED%98%B8%EB%8C%80%EC%9E%A5.png?type=w1",
  "다크 코니언": "https://blogfiles.pstatic.net/MjAyNTA5MjdfMjgw/MDAxNzU4OTMzMTI3NDIx.--_dzA15saJXnwrYpIKha4Y_JRWDfnWlmghniKJJeiog.N0Ocz-ql-BEnZwVD6cgG_OfWp0rugfiPTuYRrgSqICAg.PNG/%EB%8B%A4%ED%81%AC_%EC%BD%94%EB%8B%88%EC%96%B8.png?type=w1",
  "네스트 골렘": "https://blogfiles.pstatic.net/MjAyNTA4MTRfMzAg/MDAxNzU1MTc0NDczNzAz.DJf-dG0MP_Y4QvCoUZgbXoZZBpI3P2n9pqS8AO9aq2wg.8FlLlmkw9XEUrOvtds2F2bormcGzwb9StcmJr6luy0Ag.PNG/%EB%84%A4%EC%8A%A4%ED%8A%B8_%EA%B3%A8%EB%A0%98.png?type=w1",
  "변형된 주황버섯": "https://blogfiles.pstatic.net/MjAyNTA4MTRfNTkg/MDAxNzU1MTY5Nzg2MTIz.SMn3PQK1hxEhPYc-zyTlXKEy23rQt5KScr7QSkCiCQ4g.157V543T-lzZdKn_gx-ODIDSFVg8wrBUjBvssAkj_4Ug.PNG/%EB%B3%80%ED%98%95%EB%90%9C_%EC%A3%BC%ED%99%A9%EB%B2%84%EC%84%AF.png?type=w1",
  "변형된 티구르": "https://blogfiles.pstatic.net/MjAyNTA4MTRfMTY2/MDAxNzU1MTY5OTg3Mjg2.Fr8pqluABLGoxgngB-bhMTVRlLJwy4jVJH8gS__PiD8g.sI0aLw8cApkjjVVuEPtl1rjDn8KoMCutP-qWVTDg2gUg.PNG/%EB%B3%80%ED%98%95%EB%90%9C_%ED%8B%B0%EA%B5%AC%EB%A5%B4.png?type=w1",
  "붉은 켄타우로스": "https://blogfiles.pstatic.net/MjAyNTA4MTRfMjg5/MDAxNzU1MTc0NjUzOTgx.UOHJpmfiNKudNkk-09FRRXKNLVd5eTS74sI7tZ7U1kUg.BUN6hKmLpCONfUCBnuJ4u3lge0aFWDbMeFcx4rezjRkg.PNG/%EB%B6%89%EC%9D%80_%EC%BC%84%ED%83%80%EC%9A%B0%EB%A1%9C%EC%8A%A4.png?type=w1",
  "검은 켄타우로스": "https://blogfiles.pstatic.net/MjAyNTA4MTRfMTY3/MDAxNzU1MTc0Njk1NDM5.L7dAYTsrkS-4y6Zk2m37XD6E4wH-E3a13D4ttFB5wH0g.bzsfj_l9lkwgPgP8CVNSeiBk6DrZB8ArTBoV6vtaTN0g.PNG/%EA%B2%80%EC%9D%80_%EC%BC%84%ED%83%80%EC%9A%B0%EB%A1%9C%EC%8A%A4.png?type=w1",
  "리셀 스퀴드": "https://blogfiles.pstatic.net/MjAyNTA4MTRfMTIy/MDAxNzU1MTc1NTY5ODgy.CqJHT3ns0uy4AkV6XEUoXZzEP6BjS8ivrBad73Wk2zIg.OtTtGiPs4Xd6VU-g9vq3y-jmBA4KFnfe2Ece8ho2s00g.PNG/%EB%A6%AC%EC%85%80_%EC%8A%A4%ED%80%B4%EB%93%9C.png?type=w1",
  "망각의 사제": "https://blogfiles.pstatic.net/MjAyNTA4MTRfMzAw/MDAxNzU1MTc1Nzc5NzE2.bweREz1WGs3PyNQbgIRy6snXq6pxpmYgD4ThPTeWqvIg.PVCg0FBNb2PuJzRd4pykLsjzy9yANkOmpKAfniVTIokg.PNG/%EB%A7%9D%EA%B0%81%EC%9D%98_%EC%82%AC%EC%A0%9C.png?type=w1",
  "망각의 신관": "https://blogfiles.pstatic.net/MjAyNTA4MTRfMjc5/MDAxNzU1MTc1ODA3NzUx.nV2VdD9LUMaqOzqqGCky2MpOXe-6RNXURami91M0hogg.tAxaRCKUkumnjk1YDMW4firw7CqV2KW_YLbtJioHQYcg.PNG/%EB%A7%9D%EA%B0%81%EC%9D%98_%EC%8B%A0%EA%B4%80.png?type=w1",
  "망각의 수호병": "https://blogfiles.pstatic.net/MjAyNTA4MTRfMTEg/MDAxNzU1MTc1ODE4MDAx.EzU7FpY5TpkD7rc2c8apTW-Dcu5LYNUH75p4-_3PneQg.yG7NKEIjEGhiG0_RYMsm6UTYV_6Nvh11yswb8lipfnEg.PNG/%EB%A7%9D%EA%B0%81%EC%9D%98_%EC%88%98%ED%98%B8%EB%B3%91.png?type=w1",
  "망각의 수호대장": "https://blogfiles.pstatic.net/MjAyNTA4MTRfMTMz/MDAxNzU1MTc1ODM5MTA4.FDzFROoBK_Gvkoy893GXaE7XRjwLkP2pnpu60-TMuvgg.Cb9x-89smRRG1RFn9C18FYh7MZoeT4qT2AXDrHkHQzwg.PNG/%EB%A7%9D%EA%B0%81%EC%9D%98_%EC%88%98%ED%98%B8%EB%8C%80%EC%9E%A5.png?type=w1",
  "스켈로스": "https://blogfiles.pstatic.net/MjAyNTA4MTRfNDMg/MDAxNzU1MTc2MDE1NTc5.2O9GNum-udR_6up6GDGZApYm3WX-bM8kvVdQuFkNVZMg.K8bZWu75dPq3jFlbsE1Gtyzff1idn5ESJOzDCL5GZ9kg.PNG/%EC%8A%A4%EC%BC%88%EB%A1%9C%EC%8A%A4.png?type=w1",
  "폭렬 망둥이집": "https://blogfiles.pstatic.net/MjAyNTA4MTRfMjcx/MDAxNzU1MTc2MDI4NDY5.nKwYcSUN4Fjao_2RGb7079JJ4l9_nBARVQMBlKN-Jnkg.SqcwLb1Fv_sElZbjfZRjV9RhSSk8jdgyFfXHayFfc0wg.PNG/%ED%8F%AD%EB%A0%AC_%EB%A7%9D%EB%91%A5%EC%9D%B4%EC%A7%91.png?type=w1",
  "콜드 샤크": "https://blogfiles.pstatic.net/MjAyNTA4MTRfMjU3/MDAxNzU1MTc2MDgzMTYx.op-U9TzuOVk7os_J9PrW9AxMF_QViXpVFeb1wLzR5-cg.NYfzyg8A76xHBNWuQsdHuvDMcHzG5LNyLV7ZhOrS1qAg.PNG/%EC%BD%9C%EB%93%9C_%EC%83%A4%ED%81%AC.png?type=w1",
  "동굴 다크 와이번": "https://blogfiles.pstatic.net/MjAyNTA4MTRfNDYg/MDAxNzU1MTc2MjAwMjI2.ZWbN-A8KyNQ41e9Uf4B2N1d_-SfYArXrvQuiSmJGdGMg.L72v-B7GGZOwB8HDEJ2NdTzeaNc00izdDBp-8XUl1SYg.PNG/%EB%8B%A4%ED%81%AC_%EC%99%80%EC%9D%B4%EB%B2%88.png?type=w1"
};

const jobTabs = document.querySelectorAll("[data-job]");
const ampToggle = document.querySelector("#ampToggle");
const ampWrap = document.querySelector("#ampTabs");
const genesisTab = document.querySelector("#genesisTab");
const search = document.querySelector("#magicSearch");
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
  const filtered = list.filter(item => item.name.replace(/\s+/g, "").toLowerCase().includes(query));
  const html = [];

  filtered.forEach(item => {
    item.targets.forEach((entry, index) => {
      html.push(`<tr class="${index === 0 ? "monster-start" : ""}">
        ${index === 0 ? `<td class="monster-cell" rowspan="${item.targets.length}"><div class="monster-cell-content"><img class="monster-image" src="${MONSTER_IMAGES[item.name] || ""}" alt="${item.name}" loading="lazy" referrerpolicy="no-referrer" /><div class="monster-name-text"><strong>${item.name}</strong><small>LV ${item.level}</small></div></div></td>` : ""}
        <td><span class="kill-badge ${entry.label === "3킬" ? "three" : entry.label.includes("1킬") ? "one" : "two"}">${entry.label}</span></td>
        ${LEVELS.map((_, levelIndex) => cell(entry.cuts?.[levelIndex] ?? null, levelIndex)).join("")}
      </tr>`);
    });
  });

  rows.innerHTML = html.join("");
  rows.closest("table").hidden = !html.length;
  empty.hidden = Boolean(html.length);
  ampWrap.hidden = jobKey === "bishop";
  genesisTab.hidden = jobKey !== "bishop";
  document.querySelector("#tableTitle").textContent = `${data.job} · ${data.spell}`;
  document.querySelector("#tableCaption").textContent = jobKey === "bishop" ? "제네시스 스킬 레벨 기준" : `앰플리피케이션 ${ampKey} 기준`;
}

jobTabs.forEach(tab => tab.addEventListener("click", () => {
  jobKey = tab.dataset.job;
  jobTabs.forEach(item => item.classList.toggle("active", item === tab));
  render();
}));

ampToggle.addEventListener("change", () => {
  ampKey = ampToggle.checked ? "M" : "3";
  render();
});

search.addEventListener("input", render);
render();
