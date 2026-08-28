(() => {
  const nav = document.querySelector(".site-tabs");
  if (!nav || nav.querySelector(".desktop-nav-toggle")) return;

  const activeLink = nav.querySelector(".header-link.active") || nav.querySelector(".header-link");
  if (!activeLink) return;

  nav.classList.add("desktop-nav-collapsed");
  const toggle = document.createElement("button");
  toggle.className = "desktop-nav-toggle";
  toggle.type = "button";
  toggle.setAttribute("aria-label", "상단 메뉴 펼치기");
  toggle.setAttribute("aria-expanded", "false");
  toggle.innerHTML = '<span aria-hidden="true">⌄</span>';
  nav.append(toggle);

  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "상단 메뉴 접기" : "상단 메뉴 펼치기");
  };

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    setOpen(!nav.classList.contains("is-open"));
  });
  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target)) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
})();
