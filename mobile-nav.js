(() => {
  if (document.querySelector(".mobile-menu-button")) return;

  const links = [
    ["./", "옥션 검색", "index.html"],
    ["exp.html", "경험치 계산", "exp.html"],
    ["job.html", "전직 관련", "job.html"],
    ["guide.html", "1~43 육성", "guide.html"],
    ["magic.html", "마력표", "magic.html"],
    ["patchnotes.html", "패치노트", "patchnotes.html"],
  ];
  const current = location.pathname.split("/").pop() || "index.html";
  const header = document.querySelector(".topbar");
  if (!header) return;

  const button = document.createElement("button");
  button.className = "mobile-menu-button";
  button.type = "button";
  button.setAttribute("aria-label", "메뉴 열기");
  button.setAttribute("aria-controls", "mobileDrawer");
  button.setAttribute("aria-expanded", "false");
  button.innerHTML = "<span></span><span></span><span></span>";
  header.append(button);

  const backdrop = document.createElement("div");
  backdrop.className = "mobile-menu-backdrop";
  backdrop.hidden = true;

  const drawer = document.createElement("aside");
  drawer.id = "mobileDrawer";
  drawer.className = "mobile-drawer";
  drawer.setAttribute("aria-label", "모바일 메뉴");
  drawer.setAttribute("aria-hidden", "true");
  drawer.innerHTML = `
    <div class="mobile-drawer-head">
      <a class="brand" href="./"><span class="brand-mark"><img src="assets/time-shard.png" alt="" /></span><span>방구지지</span></a>
      <button class="mobile-menu-close" type="button" aria-label="메뉴 닫기">×</button>
    </div>
    <nav class="mobile-drawer-nav" aria-label="주요 메뉴">
      ${links.map(([href, label, page]) => `<a class="${current === page ? "active" : ""}" href="${href}"${current === page ? ' aria-current="page"' : ""}>${label}</a>`).join("")}
    </nav>`;

  document.body.append(backdrop, drawer);
  const setOpen = (open) => {
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    button.setAttribute("aria-expanded", String(open));
    backdrop.hidden = !open;
    document.body.classList.toggle("mobile-menu-open", open);
  };
  button.addEventListener("click", () => setOpen(true));
  drawer.querySelector(".mobile-menu-close").addEventListener("click", () => setOpen(false));
  backdrop.addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
})();
