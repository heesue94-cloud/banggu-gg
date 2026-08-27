const $ = (selector) => document.querySelector(selector);
const number = new Intl.NumberFormat("ko-KR");
const dateTime = new Intl.DateTimeFormat("ko-KR", {
  year: "2-digit", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
});

let dataset = null;
let itemNames = [];
let selectedName = "";
let tradeSort = "newest";
let chartPoints = [];
let optionRanges = {};
let attackMainStat = "STR";
let derivedFilterModes = { __totalAttack: "exact", __totalMagic: "exact" };
let filteredRecords = [];
let selectedRecords = [];
let tradePage = 1;
let useKoreanPriceUnits = false;
const TRADE_PAGE_SIZE = 50;
const bucketCache = new Map();
const itemImageCache = new Map();
let itemIconIndexPromise = null;
let itemDetailsPromise = null;
let catalogData = null;
const catalogState = {
  mode: "scroll",
  scrollGroup: "무기",
  scrollTarget: "전체",
  equipmentJob: "전사",
  equipmentSlot: "전체",
  equipmentLevel: "전체",
};

const els = {
  search: $("#searchInput"), suggestions: $("#suggestions"), popular: $("#popular"),
  result: $("#result"), empty: $("#emptyState"), name: $("#itemName"),
  itemIcon: $("#itemIcon"), itemIconWrap: $("#itemIconWrap"),
  itemInfo: $("#itemInfo"), itemInfoButton: $("#itemInfoButton"),
  itemInfoTooltip: $("#itemInfoTooltip"),
  median: $("#medianPrice"), average: $("#averagePrice"), range: $("#priceRange"),
  count: $("#tradeCount"), quantity: $("#quantityTotal"), rows: $("#tradeRows"),
  dailyAverage: $("#dailyAverage"),
  weeklyComparison: $("#weeklyComparison"), averagePeriod: $("#averagePeriod"),
  distribution: $("#distribution"), chart: $("#priceChart"), tooltip: $("#chartTooltip"),
  chartPanel: $("#chartPanel"), chartContent: $("#chartContent"), chartToggle: $("#chartToggle"),
  distributionPanel: $(".distribution-panel"),
  status: $("#headerStatus"), footer: $("#footerMeta"), toast: $("#toast"),
  latest: $("#headerLatest"),
  optionPanel: $("#optionPanel"), optionFilters: $("#optionFilters"),
  filterSummary: $("#filterSummary"), tradesCaption: $("#tradesCaption"),
  tradePagination: $("#tradePagination"),
  catalogPanel: $("#catalogPanel"), catalogPrimary: $("#catalogPrimary"),
  catalogSecondary: $("#catalogSecondary"), catalogLevels: $("#catalogLevels"),
  catalogItems: $("#catalogItems"), catalogSummary: $("#catalogSummary"),
  catalogBody: $("#catalogBody"), catalogToggle: $("#catalogToggle"),
  resultHeading: $(".result-heading"), resultStickySentinel: $("#resultStickySentinel"),
  stickySearch: $("#stickySearchInput"), stickySuggestions: $("#stickySuggestions"),
};

const won = (value) => number.format(Math.round(value));
const koreanPrice = (value) => {
  let remaining = Math.round(value);
  const parts = [];
  const billions = Math.floor(remaining / 100000000);
  if (billions) {
    parts.push(`${billions}억`);
    remaining %= 100000000;
  }
  const tenThousands = Math.floor(remaining / 10000);
  if (tenThousands) {
    parts.push(`${tenThousands}만`);
    remaining %= 10000;
  }
  if (remaining || !parts.length) parts.push(String(remaining));
  return parts.join(" ");
};
const tradePrice = (value) => useKoreanPriceUnits ? koreanPrice(value) : won(value);
const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

async function loadBuiltIn() {
  try {
    if (location.protocol === "file:") {
      throw new Error("실행.bat으로 사이트를 열어주세요.");
    }
    els.status.textContent = "전체 옥션 로그 색인 불러오는 중…";
    const response = await fetch("data/index.json", { cache: "no-store" });
    if (response.ok) {
      applyDataset(await response.json());
      await loadCatalog();
      return;
    }
    const files = await discoverLogFiles();
    if (!files.length) throw new Error("전체 로그 색인을 읽지 못했습니다.");
    const responses = await Promise.all(files.map(async (file) => {
      const logResponse = await fetch(file, { cache: "no-store" });
      if (!logResponse.ok) throw new Error(`${file} 파일을 읽지 못했습니다.`);
      return logResponse.text();
    }));
    applyDataset(parseLog(responses.join("\n"), files.join(", ")));
    await loadCatalog();
  } catch (error) {
    els.status.textContent = "로그 파일 확인 필요";
    els.search.placeholder = "기간별 TXT 파일을 확인하세요";
    showToast(error.message);
  }
}

async function loadCatalog() {
  try {
    const response = await fetch("data/catalog.json?v=20260828-1", { cache: "no-store" });
    if (!response.ok) return;
    catalogData = await response.json();
    els.catalogPanel.hidden = false;
    renderCatalog();
  } catch {}
}

function catalogButton(label, key, value, active) {
  return `<button type="button" class="${active ? "active" : ""}" data-catalog-key="${key}" data-catalog-value="${escapeHtml(value)}">${escapeHtml(label)}</button>`;
}

function renderCatalog() {
  if (!catalogData) return;
  const scrollMode = catalogState.mode === "scroll";
  document.querySelectorAll("[data-catalog-mode]").forEach((button) => {
    const active = button.dataset.catalogMode === catalogState.mode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });

  if (scrollMode) renderScrollCatalog();
  else renderEquipmentCatalog();
}

function renderScrollCatalog() {
  const groups = ["무기", "방어구", "특수"];
  els.catalogPrimary.innerHTML = groups.map((group) =>
    catalogButton(group, "scrollGroup", group, catalogState.scrollGroup === group)).join("");

  const groupItems = catalogData.scrolls.filter((item) => item.group === catalogState.scrollGroup);
  const targets = [...new Set(groupItems.map((item) => item.target))].sort((a, b) => a.localeCompare(b, "ko"));
  if (catalogState.scrollTarget !== "전체" && !targets.includes(catalogState.scrollTarget)) {
    catalogState.scrollTarget = "전체";
  }
  els.catalogSecondary.innerHTML = [
    catalogButton("전체", "scrollTarget", "전체", catalogState.scrollTarget === "전체"),
    ...targets.map((target) => catalogButton(target, "scrollTarget", target, catalogState.scrollTarget === target)),
  ].join("");
  els.catalogLevels.hidden = true;

  const items = groupItems.filter((item) =>
    catalogState.scrollTarget === "전체" || item.target === catalogState.scrollTarget);
  renderCatalogItems(items, (item) => item.percent ? `${item.percent}% · ${number.format(item.trades)}건` : `${number.format(item.trades)}건`);
}

function renderEquipmentCatalog() {
  const jobs = ["전사", "마법사", "궁수", "도적", "해적", "공용", "기타"];
  const availableJobs = jobs.filter((job) => catalogData.equipment.some((item) => item.job === job));
  if (!availableJobs.includes(catalogState.equipmentJob)) catalogState.equipmentJob = availableJobs[0];
  els.catalogPrimary.innerHTML = availableJobs.map((job) =>
    catalogButton(job, "equipmentJob", job, catalogState.equipmentJob === job)).join("");

  const jobItems = catalogData.equipment.filter((item) => item.job === catalogState.equipmentJob);
  const slots = [...new Set(jobItems.map((item) => item.slot))].sort((a, b) => a.localeCompare(b, "ko"));
  if (catalogState.equipmentSlot !== "전체" && !slots.includes(catalogState.equipmentSlot)) {
    catalogState.equipmentSlot = "전체";
  }
  els.catalogSecondary.innerHTML = [
    catalogButton("전체", "equipmentSlot", "전체", catalogState.equipmentSlot === "전체"),
    ...slots.map((slot) => catalogButton(slot, "equipmentSlot", slot, catalogState.equipmentSlot === slot)),
  ].join("");

  const slotItems = jobItems.filter((item) =>
    catalogState.equipmentSlot === "전체" || item.slot === catalogState.equipmentSlot);
  const levels = [...new Set(slotItems.map((item) => Math.floor(item.level / 10) * 10))].sort((a, b) => a - b);
  const levelValues = levels.map(String);
  if (catalogState.equipmentLevel !== "전체" && !levelValues.includes(catalogState.equipmentLevel)) {
    catalogState.equipmentLevel = "전체";
  }
  els.catalogLevels.hidden = false;
  els.catalogLevels.innerHTML = [
    catalogButton("전체 레벨", "equipmentLevel", "전체", catalogState.equipmentLevel === "전체"),
    ...levels.map((level) => {
      const label = level === 120 ? "리버스" : level === 0 ? "Lv.0–9" : `Lv.${level}–${level + 9}`;
      return catalogButton(label, "equipmentLevel", String(level), catalogState.equipmentLevel === String(level));
    }),
  ].join("");

  const items = slotItems.filter((item) =>
    catalogState.equipmentLevel === "전체"
      || Math.floor(item.level / 10) * 10 === Number(catalogState.equipmentLevel));
  renderCatalogItems(items, (item) => `Lv.${item.level} · ${number.format(item.trades)}건`);
}

function renderCatalogItems(items, detail) {
  els.catalogSummary.textContent = `${number.format(items.length)}개 아이템`;
  els.catalogItems.innerHTML = items.map((item) => `
    <button type="button" class="catalog-item" data-catalog-item="${escapeHtml(item.name)}">
      <span>${escapeHtml(item.name)}</span>
      <small>${escapeHtml(detail(item))}</small>
    </button>
  `).join("");
}

async function discoverLogFiles() {
  const periodPattern = /^\d{1,2}\.\d{1,2}-\d{1,2}\.\d{1,2}\.txt$/;

  // 로컬/일반 정적 서버에서는 logs.json을 사용합니다.
  try {
    const manifest = await fetch("db/logs.json", { cache: "no-store" });
    if (manifest.ok) {
      const files = await manifest.json();
      return files
        .filter((file) => periodPattern.test(file))
        .sort(periodFileSort)
        .map((file) => `db/${file}`);
    }
  } catch {}

  // GitHub Pages에서는 공개 저장소의 루트 파일 목록을 자동으로 조회합니다.
  if (location.hostname.endsWith(".github.io")) {
    const owner = location.hostname.split(".")[0];
    const repo = location.pathname.split("/").filter(Boolean)[0] || `${owner}.github.io`;
    const api = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/db`, {
      headers: { Accept: "application/vnd.github+json" },
      cache: "no-store",
    });
    if (api.ok) {
      const contents = await api.json();
      return contents
        .filter((entry) => entry.type === "file" && periodPattern.test(entry.name))
        .map((entry) => `db/${entry.name}`)
        .sort(periodFileSort);
    }
  }
  return [];
}

function periodFileSort(a, b) {
  const parts = (value) => value.match(/\d+/g).map(Number);
  const aa = parts(a), bb = parts(b);
  return aa[0] - bb[0] || aa[1] - bb[1] || aa[2] - bb[2] || aa[3] - bb[3];
}

function applyDataset(data) {
  dataset = data;
  itemNames = Object.keys(data.items);
  els.search.disabled = false;
  els.search.placeholder = "아이템 이름을 입력하세요";
  els.status.textContent = `${number.format(data.meta.recordCount)}건 분석 완료`;
  const from = new Date(data.meta.from * 1000);
  const to = new Date(data.meta.to * 1000);
  const yearMonth = (date) =>
    `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}`;
  els.averagePeriod.textContent = `${yearMonth(from)} ~ ${yearMonth(to)}`;
  els.latest.textContent = `최신 로그 ${to.getFullYear()}.${to.getMonth() + 1}.${to.getDate()}`;
  const sourceCount = data.meta.sourceFiles?.length || String(data.meta.source || "").split(",").filter(Boolean).length;
  els.footer.textContent = `${sourceCount}개 로그 · ${from.getFullYear()}.${from.getMonth() + 1}.${from.getDate()} — ${to.getFullYear()}.${to.getMonth() + 1}.${to.getDate()} · ${number.format(data.meta.itemCount)}개 아이템`;
  renderPopular();

  const requested = decodeURIComponent(location.hash.slice(1));
  if (requested && data.items[requested]) selectItem(requested);
}

function renderPopular() {
  const tradeCount = (name) => dataset.items[name].count ?? dataset.items[name].length;
  const names = [...itemNames]
    .sort((a, b) => tradeCount(b) - tradeCount(a))
    .slice(0, 5);
  els.popular.innerHTML = `<span>거래 많은 아이템</span>${names.map((name) =>
    `<button class="chip" data-name="${escapeHtml(name)}">${escapeHtml(name)}</button>`).join("")}`;
}

const normalizeItemSearch = (value) => value.toLocaleLowerCase("ko").replace(/\s+/g, "");

function findMatches(query) {
  const q = normalizeItemSearch(query);
  if (!q) return [];
  return itemNames
    .filter((name) => normalizeItemSearch(name).includes(q))
    .sort((a, b) => {
      const ax = normalizeItemSearch(a).startsWith(q) ? 0 : 1;
      const bx = normalizeItemSearch(b).startsWith(q) ? 0 : 1;
      return ax - bx || (dataset.items[b].count ?? dataset.items[b].length) - (dataset.items[a].count ?? dataset.items[a].length);
    })
    .slice(0, 12);
}

function renderSuggestions() {
  const matches = findMatches(els.search.value);
  if (!matches.length) {
    els.suggestions.hidden = true;
    return;
  }
  els.suggestions.innerHTML = matches.map((name, index) =>
    `<button class="suggestion${index === 0 ? " active" : ""}" data-name="${escapeHtml(name)}">
      <span>${highlight(name, els.search.value)}</span>
      <small>${number.format(dataset.items[name].count ?? dataset.items[name].length)}건</small>
    </button>`).join("");
  els.suggestions.hidden = false;
}

function renderStickySuggestions() {
  const matches = findMatches(els.stickySearch.value).slice(0, 6);
  if (!matches.length) {
    els.stickySuggestions.hidden = true;
    return;
  }
  els.stickySuggestions.innerHTML = matches.map((name, index) =>
    `<button class="suggestion${index === 0 ? " active" : ""}" data-sticky-name="${escapeHtml(name)}">
      <span>${highlight(name, els.stickySearch.value)}</span>
      <small>${number.format(dataset.items[name].count ?? dataset.items[name].length)}건</small>
    </button>`).join("");
  els.stickySuggestions.hidden = false;
}

function moveSuggestionSelection(container, direction) {
  const suggestions = [...container.querySelectorAll(".suggestion")];
  if (!suggestions.length || container.hidden) return false;
  const currentIndex = suggestions.findIndex((suggestion) => suggestion.classList.contains("active"));
  const nextIndex = currentIndex < 0
    ? (direction > 0 ? 0 : suggestions.length - 1)
    : (currentIndex + direction + suggestions.length) % suggestions.length;
  suggestions.forEach((suggestion, index) => suggestion.classList.toggle("active", index === nextIndex));
  suggestions[nextIndex].scrollIntoView({ block: "nearest" });
  return true;
}

function selectActiveSuggestion(container, fallbackInput) {
  const active = container.querySelector(".suggestion.active");
  const name = active?.dataset.name || active?.dataset.stickyName || findMatches(fallbackInput.value)[0];
  if (name) selectItem(name);
}

function updateStickyHeaderState() {
  const stuck = !els.result.hidden && els.resultStickySentinel.getBoundingClientRect().bottom <= 0;
  els.resultHeading.classList.toggle("is-stuck", stuck);
  if (!stuck) els.stickySuggestions.hidden = true;
}

async function selectItem(name) {
  if (!dataset?.items[name]) return;
  const requestedName = name;
  selectedName = name;
  els.search.value = name;
  els.stickySearch.value = name;
  els.suggestions.hidden = true;
  els.stickySuggestions.hidden = true;
  els.search.disabled = true;
  els.status.textContent = `${name} 거래 불러오는 중…`;
  try {
    const descriptor = dataset.items[name];
    if (Array.isArray(descriptor)) {
      selectedRecords = descriptor;
    } else {
      let bucket = bucketCache.get(descriptor.bucket);
      if (!bucket) {
      const filename = String(descriptor.bucket).padStart(2, "0");
      const version = encodeURIComponent(dataset.meta.generatedAt || dataset.meta.recordCount);
      const response = await fetch(`data/buckets/${filename}.json?v=${version}`, { cache: "no-store" });
      if (!response.ok) throw new Error("아이템 거래 데이터를 읽지 못했습니다.");
      bucket = await response.json();
      bucketCache.set(descriptor.bucket, bucket);
      }
      selectedRecords = bucket[name] || [];
    }
    if (selectedName !== requestedName) return;
  } catch (error) {
    showToast(error.message);
    return;
  } finally {
    els.search.disabled = false;
    els.status.textContent = `${number.format(dataset.meta.recordCount)}건 분석 완료`;
  }
  els.empty.hidden = true;
  els.result.hidden = false;
  history.replaceState(null, "", `#${encodeURIComponent(name)}`);
  loadItemImage(name);
  loadItemDetails(name);

  tradePage = 1;
  setupOptionFilters(selectedRecords);
  applyFilters();
  els.result.scrollIntoView({ behavior: "smooth", block: "start" });
  requestAnimationFrame(updateStickyHeaderState);
}

async function loadItemImage(name) {
  els.itemIconWrap.hidden = true;
  els.itemIcon.removeAttribute("src");
  els.itemIcon.alt = "";

  if (itemImageCache.has(name)) {
    showItemImage(name, itemImageCache.get(name));
    return;
  }

  try {
    itemIconIndexPromise ||= fetch("data/item-icons.json", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : {});
    const itemEntry = (await itemIconIndexPromise)[name];
    const itemId = typeof itemEntry === "object" ? itemEntry.id : itemEntry;
    const region = typeof itemEntry === "object" ? itemEntry.region || "gms" : "gms";
    const version = typeof itemEntry === "object" ? itemEntry.version || "62" : "62";
    const source = `maplestory.io/api/${region}/${version}/item/${encodeURIComponent(itemId)}/icon`;
    const iconUrl = itemId == null
      ? null
      : `https://images.weserv.nl/?url=${encodeURIComponent(source)}&output=png`;
    itemImageCache.set(name, iconUrl);
    if (selectedName === name) showItemImage(name, iconUrl);
  } catch {
    itemImageCache.set(name, null);
  }
}

function showItemImage(name, iconUrl) {
  if (!iconUrl || selectedName !== name) return;
  els.itemIcon.onload = () => {
    if (selectedName === name) els.itemIconWrap.hidden = false;
  };
  els.itemIcon.onerror = () => {
    els.itemIconWrap.hidden = true;
    els.itemIcon.removeAttribute("src");
  };
  els.itemIcon.alt = `${name} 아이템 이미지`;
  els.itemIcon.src = iconUrl;
}

async function loadItemDetails(name) {
  els.itemInfo.hidden = true;
  els.itemInfo.classList.remove("is-open");
  els.itemInfoButton.setAttribute("aria-expanded", "false");
  els.itemInfoTooltip.replaceChildren();

  try {
    itemDetailsPromise ||= fetch("data/item-details.json", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : {});
    const detail = (await itemDetailsPromise)[name];
    if (!detail || selectedName !== name) return;

    const equipment = catalogData?.equipment?.find((item) => item.name === name);
    const statEntries = Object.entries(detail.stats || {});
    const category = equipment?.slot || detail.category || "아이템";
    const badge = detail.level ? `Lv.${detail.level}` : category;
    const meta = [
      ...(detail.job ? [["직업", detail.job]] : []),
      ["분류", category],
    ];
    const sourceText = detail.source === "mapledb"
      ? "MapleDB 기준 · 괄호 안은 가능한 옵션 범위"
      : "옥션 로그 기준 분류 · 공개된 기본 옵션 없음";

    els.itemInfoTooltip.innerHTML = `
      <div class="item-tooltip-head">
        <div>
          <small>ITEM INFORMATION</small>
          <strong>${escapeHtml(name)}</strong>
        </div>
        <span class="item-tooltip-level">${escapeHtml(badge)}</span>
      </div>
      <dl class="item-tooltip-meta">
        ${meta.map(([label, value]) =>
          `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(String(value))}</dd></div>`).join("")}
      </dl>
      ${statEntries.length ? `
        <div class="item-tooltip-divider"><span>기본 옵션</span></div>
        <dl class="item-tooltip-stats">
          ${statEntries.map(([label, value]) =>
            `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(String(value))}</dd></div>`).join("")}
        </dl>` : `<p class="item-tooltip-empty">표시할 기본 옵션이 없습니다.</p>`}
      <p class="item-tooltip-source">${escapeHtml(sourceText)}</p>`;
    els.itemInfo.hidden = false;
  } catch {
    els.itemInfo.hidden = true;
  }
}

function setupOptionFilters(records) {
  const valuesByKey = new Map();
  records.forEach((record) => {
    const options = record[3] || {};
    Object.entries(options).forEach(([key, value]) => {
      if (!valuesByKey.has(key)) valuesByKey.set(key, []);
      valuesByKey.get(key).push(value);
    });
  });
  optionRanges = {};
  attackMainStat = "STR";
  derivedFilterModes = { __totalAttack: "exact", __totalMagic: "exact" };
  const keys = [...valuesByKey.keys()].sort((a, b) =>
    optionDisplayRank(a) - optionDisplayRank(b) ||
    a.localeCompare(b, "ko") ||
    valuesByKey.get(b).length - valuesByKey.get(a).length);
  els.optionPanel.hidden = !keys.length;
  const derivedFilters = [];
  if (valuesByKey.has("마력")) {
    derivedFilters.push(`<label class="option-filter derived-option-filter">
      <span>합마력 <small>마력 + INT + 주스텟</small></span>
      <span class="derived-filter-input">
        <input type="number" step="any" data-option="__totalMagic" data-bound="exact" placeholder="합마력 입력" aria-label="합마력">
        <button type="button" class="derived-mode-toggle" data-derived-mode="__totalMagic" aria-pressed="false">정확히 일치</button>
      </span>
    </label>`);
  }
  if (valuesByKey.has("공격력")) {
    derivedFilters.push(`<label class="option-filter derived-option-filter">
      <span class="derived-filter-title">
        <b>합공격력</b>
        <select id="attackMainStat" aria-label="합공격력 주스텟">
          <option value="STR">STR</option>
          <option value="DEX">DEX</option>
          <option value="LUK">LUK</option>
        </select>
        <small>× 0.2 + 공격력</small>
      </span>
      <span class="derived-filter-input">
        <input type="number" step="any" data-option="__totalAttack" data-bound="exact" placeholder="공격력급 입력" aria-label="공격력급">
        <button type="button" class="derived-mode-toggle" data-derived-mode="__totalAttack" aria-pressed="false">정확히 일치</button>
      </span>
    </label>`);
  }
  const regularFilters = keys.map((key) => {
    const values = valuesByKey.get(key);
    const min = Math.min(...values);
    const max = Math.max(...values);
    return `<label class="option-filter">
      <span>${escapeHtml(key)} <small>(${strip(min)}–${strip(max)})</small></span>
      <span class="range-inputs">
        <input type="number" step="any" data-option="${escapeHtml(key)}" data-bound="min" placeholder="최소 ${strip(min)}" aria-label="${escapeHtml(key)} 최솟값">
        <span>–</span>
        <input type="number" step="any" data-option="${escapeHtml(key)}" data-bound="max" placeholder="최대 ${strip(max)}" aria-label="${escapeHtml(key)} 최댓값">
      </span>
    </label>`;
  });
  els.optionFilters.innerHTML = [...derivedFilters, ...regularFilters].join("");
}

function optionValueForFilter(options, key) {
  if (key === "__totalMagic") {
    if (options.마력 === undefined) return undefined;
    const commonMainStat = options.주스텟 ?? 0;
    return options.마력 + (options.INT || 0) + commonMainStat;
  }
  if (key === "__totalAttack") {
    if (options.공격력 === undefined) return undefined;
    const mainStat = options.주스텟 ?? options[attackMainStat] ?? 0;
    return options.공격력 + mainStat * 0.2;
  }
  return options[key];
}

function applyFilters() {
  tradePage = 1;
  const source = selectedRecords;
  const active = Object.entries(optionRanges).filter(([, range]) =>
    range.min !== undefined || range.max !== undefined || range.exact !== undefined);
  filteredRecords = source.filter((record) => {
    const options = record[3] || {};
    return active.every(([key, range]) => {
      const value = optionValueForFilter(options, key);
      if (value === undefined) return false;
      if (range.exact !== undefined) {
        return derivedFilterModes[key] === "minimum"
          ? value >= range.exact
          : Math.abs(value - range.exact) < 0.000001;
      }
      return (range.min === undefined || value >= range.min) &&
        (range.max === undefined || value <= range.max);
    });
  });
  els.filterSummary.textContent = active.length
    ? `${active.length}개 옵션 적용 · 전체 ${number.format(source.length)}건 중 ${number.format(filteredRecords.length)}건`
    : `전체 ${number.format(source.length)}건`;
  renderResult(filteredRecords);
}

function renderResult(records) {
  const unitPrices = records.map(([, quantity, total]) => total / quantity);
  const totalQuantity = records.reduce((sum, [, quantity]) => sum + quantity, 0);
  const totalValue = records.reduce((sum, [, , total]) => sum + total, 0);
  const latestDay = new Date(dataset.meta.to * 1000);
  const recentWeekEnd = new Date(
    latestDay.getFullYear(),
    latestDay.getMonth(),
    latestDay.getDate() + 1,
  ).getTime() / 1000;
  const recentWeekStart = recentWeekEnd - (7 * 24 * 60 * 60);
  const recentRecords = records.filter(([time]) =>
    time >= recentWeekStart && time < recentWeekEnd);
  const recentQuantity = recentRecords.reduce((sum, [, quantity]) => sum + quantity, 0);
  const recentValue = recentRecords.reduce((sum, [, , total]) => sum + total, 0);

  els.name.textContent = selectedName;
  if (!records.length) {
    els.median.textContent = "—"; els.average.textContent = "—"; els.range.textContent = "—";
    els.count.textContent = "0"; els.quantity.textContent = "조건에 맞는 거래 없음";
    els.dailyAverage.textContent = "0건";
    els.weeklyComparison.hidden = true;
    els.rows.innerHTML = `<tr><td colspan="5" class="no-results">선택한 옵션 조건에 맞는 거래가 없습니다.</td></tr>`;
    els.tradePagination.hidden = true;
    els.distribution.innerHTML = "";
    chartPoints = []; drawChart();
    return;
  }
  let min = Infinity;
  let max = -Infinity;
  for (const price of unitPrices) {
    if (price < min) min = price;
    if (price > max) max = price;
  }
  const recentAverage = recentQuantity ? recentValue / recentQuantity : null;
  const allTimeAverage = totalValue / totalQuantity;
  els.median.textContent = recentAverage === null ? "—" : won(recentAverage);
  els.average.textContent = won(allTimeAverage);
  if (recentAverage === null) {
    els.weeklyComparison.hidden = true;
  } else {
    const differenceRate = (recentAverage - allTimeAverage) / allTimeAverage * 100;
    const direction = Math.abs(differenceRate) < .05 ? "same" : differenceRate > 0 ? "up" : "down";
    const icon = direction === "up" ? "▲" : direction === "down" ? "▼" : "―";
    const wording = direction === "up" ? "비쌈" : direction === "down" ? "쌈" : "동일";
    els.weeklyComparison.className = `comparison-badge ${direction}`;
    els.weeklyComparison.textContent =
      `${icon} ${Math.abs(differenceRate).toLocaleString("ko-KR", { maximumFractionDigits: 1 })}% ${wording} (평균가 대비)`;
    els.weeklyComparison.hidden = false;
  }
  els.range.textContent = `${compact(min)} — ${compact(max)}`;
  els.count.textContent = number.format(records.length);
  els.quantity.textContent = `총 ${number.format(totalQuantity)}개 거래`;
  const recentWeekCount = recentRecords.length;
  els.dailyAverage.textContent = `${(recentWeekCount / 7).toLocaleString("ko-KR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}건`;
  renderTrades();
  renderDistribution(unitPrices);
  renderChart(records);
}

function renderTrades() {
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / TRADE_PAGE_SIZE));
  tradePage = Math.min(Math.max(1, tradePage), totalPages);
  const start = (tradePage - 1) * TRADE_PAGE_SIZE;
  const records = [...filteredRecords].sort(compareTrades)
    .slice(start, start + TRADE_PAGE_SIZE);
  const firstRecord = filteredRecords.length ? start + 1 : 0;
  const lastRecord = Math.min(start + TRADE_PAGE_SIZE, filteredRecords.length);
  els.tradesCaption.textContent =
    `필터 결과 ${number.format(filteredRecords.length)}건 · ${number.format(firstRecord)}–${number.format(lastRecord)}건 표시`;
  els.rows.innerHTML = records.map(([time, quantity, total, options]) => `
    <tr>
      <td>${dateTime.format(new Date(time * 1000))}</td>
      <td>${renderOptionTags(options)}</td>
      <td>${number.format(quantity)}개</td>
      <td>${tradePrice(total)}</td>
      <td>${tradePrice(total / quantity)}</td>
    </tr>`).join("");
  renderTradePagination(totalPages);
}

function compareTrades(a, b) {
  if (tradeSort === "oldest") return a[0] - b[0];
  if (tradeSort === "price-high") return (b[2] / b[1]) - (a[2] / a[1]) || b[0] - a[0];
  if (tradeSort === "price-low") return (a[2] / a[1]) - (b[2] / b[1]) || b[0] - a[0];
  return b[0] - a[0];
}

function renderTradePagination(totalPages) {
  els.tradePagination.hidden = totalPages <= 1;
  if (totalPages <= 1) {
    els.tradePagination.innerHTML = "";
    return;
  }

  els.tradePagination.innerHTML = `
    <button type="button" data-page="${tradePage - 1}" ${tradePage === 1 ? "disabled" : ""} aria-label="이전 페이지">←</button>
    <span class="pagination-status">${number.format(tradePage)} / ${number.format(totalPages)}</span>
    <button type="button" data-page="${tradePage + 1}" ${tradePage === totalPages ? "disabled" : ""} aria-label="다음 페이지">→</button>`;
}

function renderOptionTags(options = {}) {
  const entries = Object.entries(options)
    .filter(([key]) => key !== "물리방어력")
    .sort(([a], [b]) =>
      optionDisplayRank(a) - optionDisplayRank(b) || a.localeCompare(b, "ko"));
  if (!entries.length) return '<span class="option-tags">—</span>';
  return `<span class="option-tags">${entries.map(([key, value]) =>
    `<span class="option-tag">${escapeHtml(key)} ${strip(value)}</span>`).join("")}</span>`;
}

function optionDisplayRank(key) {
  const fixedOrder = {
    STR: 10,
    DEX: 20,
    INT: 30,
    LUK: 40,
    HP: 50,
    MP: 60,
    공격력: 70,
    마력: 80,
    명중률: 90,
    회피율: 100,
    이동속도: 110,
    점프력: 120,
    마법방어력: 130,
    "업그레이드 가능 횟수": 1000,
  };
  return fixedOrder[key] ?? 500;
}

function renderDistribution(prices) {
  const sorted = [...prices].sort((a, b) => a - b);
  const lower = sorted[Math.floor((sorted.length - 1) * .02)];
  const upper = sorted[Math.floor((sorted.length - 1) * .98)];
  const span = Math.max(upper - lower, 1);
  const buckets = Array.from({ length: 6 }, (_, index) => ({
    from: lower + span * index / 6,
    to: lower + span * (index + 1) / 6,
    count: 0,
  }));
  prices.forEach((price) => {
    const index = Math.min(5, Math.max(0, Math.floor((price - lower) / span * 6)));
    buckets[index].count++;
  });
  const peak = Math.max(...buckets.map((bucket) => bucket.count), 1);
  els.distribution.innerHTML = buckets.map((bucket) => `
    <div class="dist-row">
      <span>${compact(bucket.from)}–${compact(bucket.to)}</span>
      <div class="dist-track"><div class="dist-bar" style="width:${bucket.count / peak * 100}%"></div></div>
      <strong>${number.format(bucket.count)}</strong>
    </div>`).join("");
}

function renderChart(records) {
  const groups = new Map();
  records.forEach(([time, quantity, total]) => {
    const date = new Date(time * 1000);
    const key = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
    if (!groups.has(key)) {
      groups.set(key, {
        time: new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(),
        label: `${String(date.getFullYear()).slice(-2)}.${date.getMonth() + 1}.${date.getDate()}`,
        values: [],
      });
    }
    groups.get(key).values.push(total / quantity);
  });
  chartPoints = [...groups.values()]
    .sort((a, b) => a.time - b.time)
    .map(({ label, values }) => ({
      label,
      value: median(values),
      count: values.length,
    }));
  drawChart();
}

function drawChart() {
  if (!chartPoints.length || els.result.hidden) return;
  const canvas = els.chart;
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  const width = rect.width;
  const height = rect.height;
  const pad = { left: 8, right: 38, top: 18, bottom: 28 };
  const values = chartPoints.map((point) => point.value);
  const maxCount = Math.max(...chartPoints.map((point) => point.count), 1);
  let min = Math.min(...values);
  let max = Math.max(...values);
  const range = Math.max(max - min, max * .08, 1);
  min -= range * .15; max += range * .15;

  ctx.strokeStyle = "#24303a";
  ctx.lineWidth = 1;
  ctx.font = "10px IBM Plex Sans KR";
  ctx.fillStyle = "#6f7b85";
  for (let i = 0; i < 4; i++) {
    const y = pad.top + (height - pad.top - pad.bottom) * i / 3;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(width - pad.right, y); ctx.stroke();
  }
  const xAt = (i) => pad.left + (width - pad.left - pad.right) * (chartPoints.length === 1 ? .5 : i / (chartPoints.length - 1));
  const yAt = (value) => pad.top + (max - value) / (max - min) * (height - pad.top - pad.bottom);
  const countYAt = (count) => pad.top + (1 - count / maxCount) * (height - pad.top - pad.bottom);

  ctx.fillStyle = "#8a7469";
  ctx.textAlign = "right";
  for (let i = 0; i < 4; i++) {
    const count = Math.round(maxCount * (3 - i) / 3);
    const y = pad.top + (height - pad.top - pad.bottom) * i / 3;
    ctx.fillText(`${number.format(count)}건`, width - 3, y + 3);
  }

  ctx.beginPath();
  chartPoints.forEach((point, i) =>
    i ? ctx.lineTo(xAt(i), countYAt(point.count)) : ctx.moveTo(xAt(i), countYAt(point.count)));
  ctx.strokeStyle = "#ff9a62";
  ctx.lineWidth = 1.8;
  ctx.stroke();
  chartPoints.forEach((point, i) => {
    const x = xAt(i), y = countYAt(point.count);
    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = "#ff9a62";
    ctx.fill();
  });

  const gradient = ctx.createLinearGradient(0, pad.top, 0, height - pad.bottom);
  gradient.addColorStop(0, "rgba(117,217,255,.24)");
  gradient.addColorStop(1, "rgba(117,217,255,0)");
  ctx.beginPath();
  chartPoints.forEach((point, i) => i ? ctx.lineTo(xAt(i), yAt(point.value)) : ctx.moveTo(xAt(i), yAt(point.value)));
  ctx.lineTo(xAt(chartPoints.length - 1), height - pad.bottom);
  ctx.lineTo(xAt(0), height - pad.bottom);
  ctx.closePath(); ctx.fillStyle = gradient; ctx.fill();

  ctx.beginPath();
  chartPoints.forEach((point, i) => i ? ctx.lineTo(xAt(i), yAt(point.value)) : ctx.moveTo(xAt(i), yAt(point.value)));
  ctx.strokeStyle = "#75d9ff"; ctx.lineWidth = 2; ctx.stroke();
  chartPoints.forEach((point, i) => {
    const x = xAt(i), y = yAt(point.value);
    ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = "#070c14"; ctx.fill(); ctx.strokeStyle = "#75d9ff"; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = "#74808a"; ctx.textAlign = "center";
    ctx.fillText(point.label, x, height - 7);
  });
  canvas._chart = { xAt, yAt, countYAt };
}

function parseLog(text, source) {
  const pattern = /^(\d{4})\.(\d{1,2})\.(\d{1,2})\/(\d{1,2}):(\d{1,2}):(\d{1,2}) \[(.*)\] (\d+)개 총합 ([\d,]+) 메소\s*$/;
  const items = {};
  const seen = new Set();
  let count = 0, minTime = Infinity, maxTime = -Infinity;
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    const m = line.match(pattern);
    if (!m) return;
    const time = Math.floor(new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]).getTime() / 1000);
    const quantity = +m[8], total = +m[9].replaceAll(",", "");
    const followingLine = lines[index + 1] || "";
    const optionSource = followingLine && !pattern.test(followingLine) ? followingLine : "";
    const identity = `${time}|${m[7]}|${quantity}|${total}|${optionSource}`;
    if (seen.has(identity)) return;
    seen.add(identity);
    const options = {};
    const optionLine = optionSource;
    if (optionLine && !pattern.test(optionLine)) {
      optionLine.split(/,\s*/).forEach((part) => {
        const option = part.match(/^(.+?)\s*:\s*(-?[\d.]+)$/);
        if (option) options[option[1].trim()] = Number(option[2]);
      });
    }
    const record = [time, quantity, total];
    if (Object.keys(options).length) record.push(options);
    (items[m[7]] ||= []).push(record);
    minTime = Math.min(minTime, time); maxTime = Math.max(maxTime, time); count++;
  });
  if (!count) throw new Error("인식 가능한 거래 기록이 없습니다.");
  return { meta: { source, recordCount: count, itemCount: Object.keys(items).length, from: minTime, to: maxTime }, items };
}

function compact(value) {
  if (value >= 100000000) return `${strip(value / 100000000)}억`;
  if (value >= 10000) return `${strip(value / 10000)}만`;
  return number.format(Math.round(value));
}
function strip(value) { return Number(value.toFixed(value >= 10 ? 1 : 2)).toLocaleString("ko-KR"); }
function escapeHtml(value) { return value.replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" })[c]); }
function highlight(value, query) {
  const index = value.toLocaleLowerCase("ko").indexOf(query.trim().toLocaleLowerCase("ko"));
  if (index < 0) return escapeHtml(value);
  return `${escapeHtml(value.slice(0,index))}<mark>${escapeHtml(value.slice(index,index + query.trim().length))}</mark>${escapeHtml(value.slice(index + query.trim().length))}`;
}
function showToast(message) {
  els.toast.textContent = message; els.toast.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer = setTimeout(() => els.toast.classList.remove("show"), 2400);
}

els.search.addEventListener("input", renderSuggestions);
els.stickySearch.addEventListener("input", renderStickySuggestions);
els.stickySearch.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    if (els.stickySuggestions.hidden) renderStickySuggestions();
    moveSuggestionSelection(els.stickySuggestions, event.key === "ArrowDown" ? 1 : -1);
    return;
  }
  if (event.key === "Enter") {
    event.preventDefault();
    selectActiveSuggestion(els.stickySuggestions, els.stickySearch);
  }
  if (event.key === "Escape") els.stickySuggestions.hidden = true;
});
els.search.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    if (els.suggestions.hidden) renderSuggestions();
    moveSuggestionSelection(els.suggestions, event.key === "ArrowDown" ? 1 : -1);
    return;
  }
  if (event.key === "Enter") {
    event.preventDefault();
    selectActiveSuggestion(els.suggestions, els.search);
  }
  if (event.key === "Escape") els.suggestions.hidden = true;
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !els.itemInfo.hidden) {
    els.itemInfo.classList.remove("is-open");
    els.itemInfoButton.setAttribute("aria-expanded", "false");
  }
  if (event.key === "/" && document.activeElement !== els.search && document.activeElement !== els.stickySearch) {
    event.preventDefault();
    (els.resultHeading.classList.contains("is-stuck") ? els.stickySearch : els.search).focus();
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".item-info")) {
    els.itemInfo.classList.remove("is-open");
    els.itemInfoButton.setAttribute("aria-expanded", "false");
  }
  const target = event.target.closest("[data-name]");
  if (target) selectItem(target.dataset.name);
  const stickyTarget = event.target.closest("[data-sticky-name]");
  if (stickyTarget) selectItem(stickyTarget.dataset.stickyName);
  if (!event.target.closest(".search-shell")) els.suggestions.hidden = true;
  if (!event.target.closest(".sticky-search")) els.stickySuggestions.hidden = true;
});
window.addEventListener("scroll", updateStickyHeaderState, { passive: true });
window.addEventListener("resize", updateStickyHeaderState);
els.itemInfoButton.addEventListener("click", () => {
  const isOpen = els.itemInfo.classList.toggle("is-open");
  els.itemInfoButton.setAttribute("aria-expanded", String(isOpen));
});
$("#sortSelect").addEventListener("change", (event) => {
  tradeSort = event.currentTarget.value;
  tradePage = 1;
  renderTrades();
});
$("#unitToggle").addEventListener("click", (event) => {
  useKoreanPriceUnits = !useKoreanPriceUnits;
  event.currentTarget.setAttribute("aria-pressed", String(useKoreanPriceUnits));
  event.currentTarget.textContent = `한글 단위 ${useKoreanPriceUnits ? "ON" : "OFF"}`;
  renderTrades();
});
els.tradePagination.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-page]");
  if (!button || button.disabled) return;
  tradePage = Number(button.dataset.page);
  renderTrades();
  els.rows.closest(".trades-panel").scrollIntoView({ behavior: "smooth", block: "start" });
});
els.optionFilters.addEventListener("input", (event) => {
  const input = event.target.closest("input[data-option]");
  if (!input) return;
  const key = input.dataset.option;
  const bound = input.dataset.bound;
  optionRanges[key] ||= {};
  if (input.value === "") delete optionRanges[key][bound];
  else optionRanges[key][bound] = Number(input.value);
  applyFilters();
});
els.optionFilters.addEventListener("change", (event) => {
  if (event.target.matches("#attackMainStat")) {
    attackMainStat = event.target.value;
    applyFilters();
  }
});
els.optionFilters.addEventListener("click", (event) => {
  const toggle = event.target.closest("button[data-derived-mode]");
  if (!toggle) return;
  const key = toggle.dataset.derivedMode;
  const useMinimum = derivedFilterModes[key] !== "minimum";
  derivedFilterModes[key] = useMinimum ? "minimum" : "exact";
  toggle.setAttribute("aria-pressed", String(useMinimum));
  toggle.textContent = useMinimum ? "이상 포함" : "정확히 일치";
  applyFilters();
});
document.querySelector(".catalog-tabs").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-catalog-mode]");
  if (!button || !catalogData) return;
  catalogState.mode = button.dataset.catalogMode;
  renderCatalog();
});
els.catalogPanel.addEventListener("click", (event) => {
  const filter = event.target.closest("button[data-catalog-key]");
  if (filter) {
    catalogState[filter.dataset.catalogKey] = filter.dataset.catalogValue;
    if (filter.dataset.catalogKey === "scrollGroup") catalogState.scrollTarget = "전체";
    if (filter.dataset.catalogKey === "equipmentJob") {
      catalogState.equipmentSlot = "전체";
      catalogState.equipmentLevel = "전체";
    }
    if (filter.dataset.catalogKey === "equipmentSlot") catalogState.equipmentLevel = "전체";
    renderCatalog();
    return;
  }
  const item = event.target.closest("button[data-catalog-item]");
  if (item) selectItem(item.dataset.catalogItem);
});
els.catalogToggle.addEventListener("click", () => {
  const collapsed = !els.catalogBody.hidden;
  els.catalogBody.hidden = collapsed;
  els.catalogToggle.textContent = collapsed ? "펼치기" : "접기";
  els.catalogToggle.setAttribute("aria-expanded", String(!collapsed));
});
$("#resetFilters").addEventListener("click", () => {
  optionRanges = {};
  attackMainStat = "STR";
  derivedFilterModes = { __totalAttack: "exact", __totalMagic: "exact" };
  els.optionFilters.querySelectorAll("input").forEach((input) => { input.value = ""; });
  const mainStatSelect = els.optionFilters.querySelector("#attackMainStat");
  if (mainStatSelect) mainStatSelect.value = attackMainStat;
  els.optionFilters.querySelectorAll("button[data-derived-mode]").forEach((button) => {
    button.setAttribute("aria-pressed", "false");
    button.textContent = "정확히 일치";
  });
  applyFilters();
});
$("#copyButton").addEventListener("click", async () => {
  await navigator.clipboard.writeText(location.href);
  showToast("검색 링크를 복사했습니다.");
});
window.addEventListener("resize", drawChart);
els.chartToggle.addEventListener("click", () => {
  const isExpanded = els.chartToggle.getAttribute("aria-expanded") === "true";
  els.chartToggle.setAttribute("aria-expanded", String(!isExpanded));
  els.chartToggle.textContent = isExpanded ? "펼치기" : "접기";
  els.chartContent.hidden = isExpanded;
  els.distributionPanel.hidden = isExpanded;
  els.chartPanel.classList.toggle("is-collapsed", isExpanded);
  els.chartPanel.parentElement.classList.toggle("is-chart-collapsed", isExpanded);
  els.tooltip.hidden = true;
  if (!isExpanded) requestAnimationFrame(drawChart);
});
els.chart.addEventListener("mousemove", (event) => {
  if (!els.chart._chart || !chartPoints.length) return;
  const rect = els.chart.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const rawIndex = chartPoints.length === 1 ? 0 : Math.round((x - 8) / (rect.width - 46) * (chartPoints.length - 1));
  const index = Math.max(0, Math.min(chartPoints.length - 1, rawIndex));
  const point = chartPoints[index];
  const px = els.chart._chart.xAt(index);
  const priceY = els.chart._chart.yAt(point.value);
  const countY = els.chart._chart.countYAt(point.count);
  const showCount = Math.abs(y - countY) < Math.abs(y - priceY);
  const py = showCount ? countY : priceY;
  els.tooltip.classList.toggle("count-tooltip", showCount);
  els.tooltip.textContent = showCount
    ? `${point.label} · 거래 ${number.format(point.count)}건`
    : `${point.label} · ${won(point.value)} 메소`;
  els.tooltip.style.left = `${px}px`; els.tooltip.style.top = `${py}px`; els.tooltip.hidden = false;
});
els.chart.addEventListener("mouseleave", () => {
  els.tooltip.hidden = true;
  els.tooltip.classList.remove("count-tooltip");
});

loadBuiltIn();
