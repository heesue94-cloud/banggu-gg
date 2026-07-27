const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const index = JSON.parse(fs.readFileSync(path.join(root, "data", "index.json"), "utf8"));
const icons = JSON.parse(fs.readFileSync(path.join(root, "data", "item-icons.json"), "utf8"));
const equipmentSource = JSON.parse(
  fs.readFileSync(path.join(root, "data", "mapledb-equipment.json"), "utf8"),
);
const auctionNames = new Set(Object.keys(index.items));
const equipmentByName = new Map(equipmentSource.map((item) => [item.name, item]));

const slotNames = {
  100: "투구", 101: "얼굴장식", 102: "눈장식", 103: "귀고리",
  104: "상의", 105: "전신", 106: "하의", 107: "신발",
  108: "장갑", 109: "방패", 110: "망토", 111: "반지",
  112: "펜던트", 113: "벨트", 114: "훈장", 115: "어깨장식",
  118: "뱃지", 121: "무기", 122: "무기", 123: "무기", 124: "무기",
  125: "무기", 126: "무기", 127: "무기", 128: "무기", 129: "무기",
  130: "한손검", 131: "한손도끼", 132: "한손둔기", 133: "단검",
  134: "블레이드", 136: "무기", 137: "완드", 138: "스태프",
  140: "두손검", 141: "두손도끼", 142: "두손둔기", 143: "창",
  144: "폴암", 145: "활", 146: "석궁", 147: "아대",
  148: "너클", 149: "건", 190: "펫장비", 191: "안장",
};
const jobNames = { 법사: "마법사", 전사: "전사", 궁수: "궁수", 도적: "도적", 해적: "해적", 공용: "공용" };

const equipment = Object.entries(icons)
  .filter(([name, id]) => auctionNames.has(name) && id >= 1000000 && id < 2000000)
  .map(([name, id]) => {
    const source = equipmentByName.get(name);
    return {
      name,
      id,
      job: jobNames[source?.job] || "기타",
      slot: slotNames[Math.floor(id / 10000)] || "기타",
      level: source?.level || 0,
      trades: index.items[name].count,
    };
  })
  .sort((a, b) => a.job.localeCompare(b.job, "ko") || a.slot.localeCompare(b.slot, "ko")
    || a.level - b.level || a.name.localeCompare(b.name, "ko"));

const weaponTargets = new Set([
  "건", "너클", "단검", "두손검", "두손도끼", "두손둔기", "블레이드",
  "석궁", "스태프", "아대", "완드", "창", "폴암", "한손검",
  "한손도끼", "한손둔기", "활",
]);
const armorTargets = [
  "귀 장식", "전신 갑옷", "악세서리", "펫장비", "망토", "반지", "방패",
  "뱃지", "벨트", "상의", "신발", "장갑", "투구", "하의",
];

const scrolls = Object.entries(index.items)
  .filter(([name]) => name.includes("주문서"))
  .map(([name, descriptor]) => {
    const percent = Number((name.match(/(\d+)%$/) || [])[1] || 0);
    const withoutSuffix = name.replace(/\s+주문서(?:\s+\d+%)?$/, "");
    let target = "";
    let effect = "";
    for (const candidate of [...armorTargets, ...weaponTargets]) {
      if (withoutSuffix === candidate || withoutSuffix.startsWith(`${candidate} `)) {
        target = candidate;
        effect = withoutSuffix.slice(candidate.length).trim() || "기타";
        break;
      }
    }
    const group = weaponTargets.has(target) ? "무기" : armorTargets.includes(target) ? "방어구" : "특수";
    return {
      name,
      group,
      target: target || "특수 주문서",
      effect: effect || withoutSuffix,
      percent,
      trades: descriptor.count,
    };
  })
  .sort((a, b) => a.group.localeCompare(b.group, "ko") || a.target.localeCompare(b.target, "ko")
    || a.effect.localeCompare(b.effect, "ko") || a.percent - b.percent);

fs.writeFileSync(
  path.join(root, "data", "catalog.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), equipment, scrolls }),
);
console.log(`Built catalog: ${scrolls.length} scrolls, ${equipment.length} equipment items.`);
