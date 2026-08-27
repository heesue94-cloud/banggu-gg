(() => {
  const tabs = document.querySelector(".patch-filter-tabs");
  const entries = [...document.querySelectorAll(".timeline-entry")];
  if (!tabs || !entries.length) return;
  const select = (filter) => {
    tabs.querySelectorAll("button[data-patch-filter]").forEach((button) => {
      const active = button.dataset.patchFilter === filter;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });
    entries.forEach((entry, index) => entry.classList.toggle("mobile-patch-hidden", filter === "recent" && index >= 5));
  };
  tabs.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-patch-filter]");
    if (button) select(button.dataset.patchFilter);
  });
  select("recent");
})();
