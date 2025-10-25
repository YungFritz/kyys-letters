/* public/js/search.js
   Recherche et filtres pour la grille des séries.
   Attends:
     - <input id="q">
     - <div id="series-grid"></div>
     - fonction renderSeriesGrid(items) que TU fournis (rend les cards)
*/
(function(){
  const qEl = document.getElementById("q");
  const gridEl = document.getElementById("series-grid");
  if (!qEl || !gridEl) return;

  const base = KyyStore.allSeries();
  const fuse = new Fuse(base, { keys: ["title","tags","chapters.lang"], threshold: .32 });

  function update(items){ 
    if (typeof window.renderSeriesGrid === "function") {
      window.renderSeriesGrid(items);
    } else {
      // fallback ultra simple si t’as rien branché
      gridEl.innerHTML = items.map(s=>`<div class="card">${s.title}</div>`).join("");
    }
  }

  qEl.addEventListener("input", e=>{
    const q = e.target.value.trim();
    update(q ? fuse.search(q).map(r=>r.item) : base);
  });

  // Filtre par tag (expose une API globale)
  window.filterByTag = function(tag){
    update(base.filter(s => (s.tags||[]).includes(tag)));
    qEl.value = "";
  };

  // init
  update(base);
})();
