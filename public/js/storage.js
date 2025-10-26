/* public/js/storage.js
   Store minimal unifié pour Kyy’s Letters (LocalStorage + IndexedDB pour les pages).
*/
(function (global) {
  const KEYS = {
    series: "kl_series",
    chapters: "kl_chapters",
    members: "kl_members",
    history: "kl_history",
    fav: "kl_fav",
  };

  const safeParse = (txt, def) => {
    try { return JSON.parse(txt ?? "") ?? def; } catch { return def; }
  };
  const get = (k, def=[]) => safeParse(localStorage.getItem(k), def);
  const set = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  // --------- Séries ---------
  function allSeries() { return get(KEYS.series); }
  function saveSeries(arr) { set(KEYS.series, arr); }
  function upsertSeries(serie) {
    const list = allSeries();
    const i = list.findIndex(s => s.id === serie.id);
    if (i >= 0) list[i] = serie; else list.push(serie);
    saveSeries(list);
  }
  function deleteSeries(id) {
    saveSeries(allSeries().filter(s => s.id !== id));
    // supprime aussi les chapitres liés
    saveChapters(allChapters().filter(c => c.seriesId !== id));
  }

  // --------- Chapitres ---------
  function allChapters() { return get(KEYS.chapters); }
  function saveChapters(arr) { set(KEYS.chapters, arr); }
  function addChapter(ch) { saveChapters([...allChapters(), ch]); }
  function deleteChapter(id) { saveChapters(allChapters().filter(c => c.id !== id)); }

  // --------- Membres (profils) ---------
  function allMembers() { return get(KEYS.members); }
  function saveMembers(arr) { set(KEYS.members, arr); }
  function upsertMember(m) {
    const list = allMembers();
    const i = list.findIndex(x => x.id === m.id);
    if (i >= 0) list[i] = m; else list.push(m);
    saveMembers(list);
  }
  function deleteMember(id) { saveMembers(allMembers().filter(m => m.id !== id)); }

  // --------- Divers ---------
  function uid(prefix="id") { return `${prefix}_${Math.random().toString(36).slice(2,10)}`; }
  function slugify(s) {
    return (s || "").toString().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
      .replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80);
  }

  // Historique / fav basiques si tu veux t’en servir plus tard
  function getHistory() { return get(KEYS.history); }
  function pushHistory(entry) {
    const arr = getHistory().filter(e => e.key !== entry.key);
    arr.unshift(entry);
    set(KEYS.history, arr.slice(0,200));
  }
  function getFav() { return get(KEYS.fav); }
  function toggleFav(key) {
    let arr = getFav();
    arr = arr.includes(key) ? arr.filter(x=>x!==key) : [...arr, key];
    set(KEYS.fav, arr);
    return arr.includes(key);
  }

  // --------- Pages (images) ---------
  // Stocke un fichier image dans IndexedDB via KyyDB et retourne son ID.
  async function addPageBlob(file) {
    const id = uid("page");
    await KyyDB.putBlob(id, file);
    return id;
  }

  // Transforme un ID de page en URL utilisable dans <img src="">
  async function pageURL(id) {
    return KyyDB.blobURL(id);
  }

  global.KyyStore = {
    KEYS,
    // séries
    allSeries, saveSeries, upsertSeries, deleteSeries,
    // chapitres
    allChapters, saveChapters, addChapter, deleteChapter,
    // profils
    allMembers, saveMembers, upsertMember, deleteMember,
    // utilitaires
    uid, slugify,
    // bonus
    getHistory, pushHistory, getFav, toggleFav,
    // pages (IndexedDB)
    addPageBlob,
    pageURL,
  };
})(window);
