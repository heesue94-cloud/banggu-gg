(() => {
  document.querySelectorAll(".mobile-content-tabs[data-tab-group]").forEach((tabs) => {
    const group = tabs.dataset.tabGroup;
    const buttons = [...tabs.querySelectorAll("button[data-mobile-tab]")];
    const panes = [...document.querySelectorAll(`[data-pane-group="${group}"]`)];
    const select = (value) => {
      buttons.forEach((button) => {
        const active = button.dataset.mobileTab === value;
        button.classList.toggle("active", active);
        button.setAttribute("aria-selected", String(active));
      });
      panes.forEach((pane) => pane.classList.toggle("mobile-pane-hidden", pane.dataset.mobilePane !== value));
    };
    tabs.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-mobile-tab]");
      if (button) select(button.dataset.mobileTab);
    });
    select(tabs.dataset.defaultTab || buttons[0]?.dataset.mobileTab);
  });
})();
