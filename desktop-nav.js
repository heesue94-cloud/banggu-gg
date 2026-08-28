(() => {
  const nav = document.querySelector(".site-tabs");
  if (!nav) return;

  const activeLink = nav.querySelector(".header-link.active") || nav.querySelector(".header-link");
  if (!activeLink) return;

  nav.classList.add("desktop-nav-collapsed");
})();
