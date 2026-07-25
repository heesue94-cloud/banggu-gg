const $ = (selector) => document.querySelector(selector);
const number = new Intl.NumberFormat("ko-KR");
const dateTime = new Intl.DateTimeFormat("ko-KR", {
  year: "2-digit", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
});

let dataset = null;
let itemNames = [];
let selectedName = "";
let sortNewest = true;
let chartPoints = [];
let optionRanges = {};
let filteredRecords = [];
let selectedRecords = [];
const bucketCache = new Map();

const els = {
  search: $("#searchInput"), suggestions: $("#suggestions"), popular: $("#popular"),
  result: $("#result"), empty: $("#emptyState"), name: $("#itemName"),
  median: $("#medianPrice"), average: $("#averagePrice"), range: $("#priceRange"),
  count: $("#tradeCount"), quantity: $("#quantityTotal"), rows: $("#tradeRows"),
  dailyAverage: $("#dailyAverage"),
  distribution: $("#distribution"), chart: $("#priceChart"), tooltip: $("#chartTooltip"),
  status: $("#headerStatus"), footer: $("#footerMeta"), toast: $("#toast"),
  latest: $("#headerLatest"),
  optionPanel: $("#optionPanel"), optionFilters: $("#optionFilters"),
  filterSummary: $("#filterSummary"), tradesCaption: $("#tradesCaption"),
};

const won = (value) => number.format(Math.round(value));
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
  } catch (error) {
    els.status.textContent = "로그 파일 확인 필요";
    els.search.placeholder = "기간별 TXT 파일을 확인하세요";
    showToast(error.message);
  }
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

function findMatches(query) {
  const q = query.trim().toLocaleLowerCase("ko");
  if (!q) return [];
  return itemNames
    .filter((name) => name.toLocaleLowerCase("ko").includes(q))
    .sort((a, b) => {
      const ax = a.toLocaleLowerCase("ko").startsWith(q) ? 0 : 1;
      const bx = b.toLocaleLowerCase("ko").startsWith(q) ? 0 : 1;
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

async function selectItem(name) {
  if (!dataset?.items[name]) return;
  const requestedName = name;
  selectedName = name;
  els.search.value = name;
  els.suggestions.hidden = true;
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

  setupOptionFilters(selectedRecords);
  applyFilters();
  els.result.scrollIntoView({ behavior: "smooth", block: "start" });
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
  const keys = [...valuesByKey.keys()].sort((a, b) =>
    optionDisplayRank(a) - optionDisplayRank(b) ||
    a.localeCompare(b, "ko") ||
    valuesByKey.get(b).length - valuesByKey.get(a).length);
  els.optionPanel.hidden = !keys.length;
  els.optionFilters.innerHTML = keys.map((key) => {
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
  }).join("");
}

function applyFilters() {
  const source = selectedRecords;
  const active = Object.entries(optionRanges).filter(([, range]) =>
    range.min !== undefined || range.max !== undefined);
  filteredRecords = source.filter((record) => {
    const options = record[3] || {};
    return active.every(([key, range]) => {
      const value = options[key];
      if (value === undefined) return false;
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
    els.rows.innerHTML = `<tr><td colspan="5" class="no-results">선택한 옵션 조건에 맞는 거래가 없습니다.</td></tr>`;
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
  els.median.textContent = recentQuantity ? won(recentValue / recentQuantity) : "—";
  els.average.textContent = won(totalValue / totalQuantity);
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
  const records = [...filteredRecords].sort((a, b) =>
    sortNewest ? b[0] - a[0] : a[0] - b[0]).slice(0, 50);
  els.tradesCaption.textContent = `필터 결과 ${number.format(filteredRecords.length)}건 · 최대 50건 표시`;
  els.rows.innerHTML = records.map(([time, quantity, total, options]) => `
    <tr>
      <td>${dateTime.format(new Date(time * 1000))}</td>
      <td>${renderOptionTags(options)}</td>
      <td>${number.format(quantity)}개</td>
      <td>${number.format(total)}</td>
      <td>${won(total / quantity)}</td>
    </tr>`).join("");
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
  gradient.addColorStop(0, "rgba(226,255,100,.24)");
  gradient.addColorStop(1, "rgba(226,255,100,0)");
  ctx.beginPath();
  chartPoints.forEach((point, i) => i ? ctx.lineTo(xAt(i), yAt(point.value)) : ctx.moveTo(xAt(i), yAt(point.value)));
  ctx.lineTo(xAt(chartPoints.length - 1), height - pad.bottom);
  ctx.lineTo(xAt(0), height - pad.bottom);
  ctx.closePath(); ctx.fillStyle = gradient; ctx.fill();

  ctx.beginPath();
  chartPoints.forEach((point, i) => i ? ctx.lineTo(xAt(i), yAt(point.value)) : ctx.moveTo(xAt(i), yAt(point.value)));
  ctx.strokeStyle = "#e2ff64"; ctx.lineWidth = 2; ctx.stroke();
  chartPoints.forEach((point, i) => {
    const x = xAt(i), y = yAt(point.value);
    ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = "#0b0f14"; ctx.fill(); ctx.strokeStyle = "#e2ff64"; ctx.lineWidth = 2; ctx.stroke();
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
els.search.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const match = findMatches(els.search.value)[0];
    if (match) selectItem(match);
  }
  if (event.key === "Escape") els.suggestions.hidden = true;
});
document.addEventListener("keydown", (event) => {
  if (event.key === "/" && document.activeElement !== els.search) {
    event.preventDefault(); els.search.focus();
  }
});
document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-name]");
  if (target) selectItem(target.dataset.name);
  else if (!event.target.closest(".search-shell")) els.suggestions.hidden = true;
});
$("#sortButton").addEventListener("click", (event) => {
  sortNewest = !sortNewest;
  event.currentTarget.textContent = sortNewest ? "최신순 ↓" : "오래된순 ↑";
  renderTrades();
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
$("#resetFilters").addEventListener("click", () => {
  optionRanges = {};
  els.optionFilters.querySelectorAll("input").forEach((input) => { input.value = ""; });
  applyFilters();
});
$("#copyButton").addEventListener("click", async () => {
  await navigator.clipboard.writeText(location.href);
  showToast("검색 링크를 복사했습니다.");
});
window.addEventListener("resize", drawChart);
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
