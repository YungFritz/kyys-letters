/* shell.js — header + drawer + bottom tabbar pour toutes les pages HTML */

function renderShell(opts){
  const page = (opts && opts.page) || "home";
  const render = (opts && opts.render) || (()=>{});

  // ===== Header =====
  const header = document.createElement("header");
  header.className = "shell-header";
  header.innerHTML = `
    <div class="shell-inner">
      <button class="burger" id="burger" aria-label="Ouvrir le menu"><span></span></button>
      <a class="logo" href="/" aria-label="Accueil">K</a>

      <input id="topSearch" class="search" placeholder="Rechercher une série, un tag, une langue..." />

      <a class="nav-btn ${page==="personnelle" ? "active":""}" href="/personnelle.html">Personnelle</a>
      <a class="nav-btn ${page==="recrutement" ? "active":""}" href="/recrutement.html">Recrutement</a>
      <a class="nav-btn ${page==="admin" ? "active":""}" href="/admin.html">Admin</a>
      <a class="nav-btn" href="/connexion.html">Connexion</a>
    </div>
  `;
  document.body.prepend(header);

  // ===== Drawer (mobile) =====
  const drawer = document.createElement("div");
  drawer.className = "drawer";
  drawer.innerHTML = `
    <div class="drawer-dim" id="drawerClose"></div>
    <div class="drawer-panel">
      <div class="row center" style="justify-content: space-between;">
        <div class="logo">K</div>
        <button class="nav-btn" id="drawerCloseBtn">✕</button>
      </div>

      <div class="drawer-row">
        <a class="nav-btn ${page==="personnelle" ? "active":""}" href="/personnelle.html">Personnelle</a>
        <a class="nav-btn ${page==="recrutement" ? "active":""}" href="/recrutement.html">Recrutement</a>
        <a class="nav-btn ${page==="admin" ? "active":""}" href="/admin.html">Admin</a>
        <a class="nav-btn" href="/connexion.html">Connexion</a>
        <input class="search" id="drawerSearch" placeholder="Rechercher..." />
      </div>
    </div>
  `;
  document.body.append(drawer);

  // Toggle drawer
  const openDrawer = ()=> drawer.classList.add("open");
  const closeDrawer = ()=> drawer.classList.remove("open");
  header.querySelector("#burger").addEventListener("click", openDrawer);
  drawer.querySelector("#drawerClose").addEventListener("click", closeDrawer);
  drawer.querySelector("#drawerCloseBtn").addEventListener("click", closeDrawer);

  // ===== Tabbar (mobile bottom) =====
  const tabbar = document.createElement("nav");
  tabbar.className = "tabbar";
  tabbar.innerHTML = `
    <div class="tabbar-inner">
      <a class="tab ${page==="home" ? "active":""}" href="/">🏠<div style="font-size:12px;opacity:.85;">Accueil</div></a>
      <a class="tab" href="/#search">🔍<div style="font-size:12px;opacity:.85;">Recherche</div></a>
      <a class="tab" href="/#tendances">🔥<div style="font-size:12px;opacity:.85;">Tendances</div></a>
      <a class="tab ${page==="admin" ? "active":""}" href="/admin.html">⚙️<div style="font-size:12px;opacity:.85;">Admin</div></a>
    </div>
  `;
  document.body.append(tabbar);

  // ===== Page content =====
  const root = document.getElementById("page-root");
  if(!root){
    const m = document.createElement("main");
    m.id = "page-root";
    m.className = "with-shell";
    document.body.append(m);
  }
  render(document.getElementById("page-root"));
}
