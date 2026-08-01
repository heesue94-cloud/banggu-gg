const LEVELS=[1,10,20,30];
const MAGIC_DATA={
  fp:{job:"불독",spell:"메테오",modes:{
    M:[
      ["후회의 사제",106,[1399,1213,1067,958],[926,796,687,605]],
      ["후회의 신관",109,[1489,1292,1137,1023],[988,852,739,653]],
      ["후회의 수호병",113,[1605,1394,1228,1105],[1067,921,805,713]],
      ["후회의 수호대장",116,[1695,1474,1300,1170],[1130,976,856,761]],
      ["네스트 골렘",110,[1897,1649,1456,1313],[1269,1098,964,865]]
    ],
    3:[
      ["후회의 사제",106,[1685,1465,1292,1163],null],
      ["후회의 신관",109,[1793,1559,1376,1239],[1198,1036,909,813]],
      ["후회의 수호병",113,[1933,1679,1483,1337],null],
      ["후회의 수호대장",116,[2041,1775,1567,1414],[1366,1184,1041,935]],
      ["다크 코니언",105,[1713,1488,1312,1181],null],
      ["네스트 골렘",110,[2278,1985,1755,1583],[1531,1329,1170,1052]]
    ]
  }},
  il:{job:"썬콜",spell:"블리자드",modes:{
    M:[
      ["붉은 켄타우로스",88,[947,816,705,636],[601,501,421,371]],
      ["검은 켄타우로스",88,[1210,1047,919,841],[796,674,577,517]],
      ["리셀 스퀴드",97,[1428,1238,1089,999],[946,815,704,635]],
      ["다크 코니언",105,[1713,1488,1312,1205],[1141,986,865,787]],
      ["네스트 골렘",110,[1897,1649,1456,1339],[1269,1098,964,883]],
      ["망각의 사제",121,[1852,1609,1421,1306],[1237,1070,940,860]],
      ["망각의 수호병",131,[2080,1811,1598,1471],[1393,1207,1062,973]]
    ],
    3:[
      ["붉은 켄타우로스",88,[1149,993,871,794],[751,634,541,483]],
      ["검은 켄타우로스",88,[1462,1268,1116,1023],[970,836,724,654]],
      ["리셀 스퀴드",97,[1721,1495,1319,1211],[1148,992,870,793]],
      ["다크 코니언",105,[2059,1791,1582,1455],null],
      ["네스트 골렘",110,[2278,1985,1755,1614],[1531,1329,1170,1073]],
      ["망각의 사제",121,[2224,1938,1712,1574],[1493,1296,1141,1046]],
      ["망각의 수호병",131,[2492,2175,1925,1771],[1678,1458,1286,1181]]
    ]
  }},
  bishop:{job:"비숍",spell:"제네시스",modes:{genesis:[
    ["검은 켄타우로스",88,[1031,918,823,781],[664,578,505,474]],
    ["붉은 켄타우로스",88,[1315,1174,1056,1007],[868,769,681,643]],
    ["리셀 스퀴드",97,[1551,1387,1250,1194],[1031,917,815,772]],
    ["스켈로스",113,[1685,1509,1361,1300],[1124,1001,896,850]],
    ["폭렬 망둥이집",90,[1710,1530,1380,1319],null],
    ["콜드 샤크",102,[1719,1538,1388,1326],null],
    ["다크 코니언",105,[1858,1663,1502,1435],null],
    ["네스트 골렘",110,[2058,1845,1664,1591],[1379,1232,1109,1058]],
    ["후회의 수호대장",116,[2322,2084,1884,1802],[1560,1396,1258,1201]]
  ]}}
};
const jobTabs=document.querySelectorAll("[data-job]"),ampTabs=document.querySelectorAll("[data-amp]");
const ampWrap=document.querySelector("#ampTabs"),genesisTab=document.querySelector("#genesisTab"),search=document.querySelector("#magicSearch"),currentMagic=document.querySelector("#currentMagic"),rows=document.querySelector("#magicRows"),empty=document.querySelector("#magicEmpty");
let jobKey="fp",ampKey="M";
function cell(value,index){return `<td class="cut ${value==null?'missing':index===3?'best':''}">${value==null?'—':value.toLocaleString()}</td>`}
function render(){
  const data=MAGIC_DATA[jobKey],mode=jobKey==="bishop"?"genesis":ampKey,list=data.modes[mode];
  const query=search.value.trim().replace(/\s+/g,"").toLowerCase(),mine=Number(currentMagic.value)||0;
  const filtered=list.filter(monster=>monster[0].replace(/\s+/g,"").toLowerCase().includes(query));
  const html=[];
  filtered.forEach(monster=>{
    [["one","1킬",monster[2]],["two","2킬",monster[3]]].forEach(([kind,label,cuts],index)=>{
      const target=cuts?.filter(v=>v!=null).at(-1); const state=!mine||!target?"마력 입력 시 판정":mine>=target?`가능 · ${mine-target} 여유`:`부족 · ${target-mine}`; const stateClass=!mine||!target?"":mine>=target?"pass":"fail";
      html.push(`<tr class="${index===0?'monster-start':''}">${index===0?`<td class="monster-cell" rowspan="2"><strong>${monster[0]}</strong><small>LV ${monster[1]}</small></td>`:''}<td><span class="kill-badge ${kind}">${label}</span></td>${LEVELS.map((_,i)=>cell(cuts?.[i]??null,i)).join('')}<td class="state-cell"><span class="magic-state ${stateClass}">${state}</span></td></tr>`);
    });
  });
  rows.innerHTML=html.join(''); rows.closest('table').hidden=!html.length; empty.hidden=!!html.length;
  ampWrap.hidden=jobKey==="bishop"; genesisTab.hidden=jobKey!=="bishop";
  document.querySelector("#selectedJob").textContent=data.job; document.querySelector("#selectedSpell").textContent=data.spell; document.querySelector("#selectedAmp").textContent=jobKey==="bishop"?"제네시스":`앰플리피케이션 ${ampKey}`; document.querySelector("#rowCount").textContent=`${filtered.length}종`; document.querySelector("#tableTitle").textContent=`${data.job} · ${data.spell}`; document.querySelector("#tableCaption").textContent=jobKey==="bishop"?"제네시스 스킬 레벨 기준":`앰플리피케이션 ${ampKey} 기준`;
}
jobTabs.forEach(tab=>tab.addEventListener("click",()=>{jobKey=tab.dataset.job;jobTabs.forEach(item=>item.classList.toggle("active",item===tab));render()}));
ampTabs.forEach(tab=>tab.addEventListener("click",()=>{ampKey=tab.dataset.amp;ampTabs.forEach(item=>item.classList.toggle("active",item===tab));render()}));
search.addEventListener("input",render);currentMagic.addEventListener("input",render);render();
