/* public/js/reader-keys.js
   Brancher nextPage() / prevPage() / toggleFullscreen()
   Ces fonctions doivent exister côté lecteur.
*/
(function(){
  function onKey(e){
    const k = e.key.toLowerCase();
    if (k === "arrowright" && typeof window.nextPage === "function") { e.preventDefault(); nextPage(); }
    if (k === "arrowleft"  && typeof window.prevPage === "function") { e.preventDefault(); prevPage(); }
    if (k === "f"          && typeof window.toggleFullscreen === "function") { e.preventDefault(); toggleFullscreen(); }
  }
  document.addEventListener("keydown", onKey);
})();
