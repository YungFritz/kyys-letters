/* public/js/storage.js
   Store minimal unifié pour Kyy’s Letters (LocalStorage) avec support
   des images stockées dans IndexedDB via KyyDB (voir db.js).
 */
(function (global) {
  const KEYS = {
    series: "kl_series",
    chapters: "kl_chapters",
    members: "kl_members",
    history: "kl_history",
    fav: "kl_fav",
    accounts: "kl_accounts",
    session: "kl_session",
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

  // --------- Comptes (auth) ---------
  /**
   * Retourne la liste de tous les comptes enregistrés.
   * Chaque compte a la forme { id, username, password }.
   */
  function allAccounts() {
    return get(KEYS.accounts);
  }

  /**
   * Enregistre la liste complète des comptes en localStorage.
   */
  function saveAccounts(arr) {
    set(KEYS.accounts, arr);
  }

  /**
   * Ajoute un compte. Le username doit être unique (non sensible à la casse).
   * Retourne true si ajouté, false si déjà existant.
   * @param {{ username: string, password: string }} account
   */
  function addAccount(account) {
    const list = allAccounts();
    const exists = list.some(acc => acc.username.toLowerCase() === account.username.toLowerCase());
    if (exists) return false;
    list.push({ id: uid("acc"), username: account.username, password: account.password });
    saveAccounts(list);
    return true;
  }

  /**
   * Supprime un compte par son identifiant.
   */
  function deleteAccount(id) {
    saveAccounts(allAccounts().filter(acc => acc.id !== id));
  }

  /**
   * Vérifie les identifiants et connecte l’utilisateur si correspondance.
   * Si réussite, enregistre le compte dans la session et retourne true.
   * Sinon, retourne false.
   */
  function login(username, password) {
    const list = allAccounts();
    const acc = list.find(a => a.username.toLowerCase() === username.toLowerCase() && a.password === password);
    if (acc) {
      localStorage.setItem(KEYS.session, acc.id);
      return true;
    }
    return false;
  }

  /**
   * Déconnecte l’utilisateur actuellement connecté.
   */
  function logout() {
    localStorage.removeItem(KEYS.session);
  }

  /**
   * Retourne true si un utilisateur est connecté.
   */
  function isLogged() {
    return !!localStorage.getItem(KEYS.session);
  }

  /**
   * Retourne les informations du compte actuellement connecté ou null.
   */
  function currentAccount() {
    const id = localStorage.getItem(KEYS.session);
    if (!id) return null;
    return allAccounts().find(acc => acc.id === id) || null;
  }

  // --------- Pages (images) ---------
  /**
   * Enregistre une image (Blob/File) dans IndexedDB via KyyDB.putBlob()
   * et renvoie un identifiant unique.
   * @param {Blob|File} file
   * @returns {Promise<string>} identifiant généré
   */
  async function addPageBlob(file) {
    const id = uid("page");
    // KyyDB est défini dans db.js et exposé sur window
    await KyyDB.putBlob(id, file);
    return id;
  }

  /**
   * Retourne une URL temporaire pour afficher l’image stockée en IndexedDB.
   * Utilise KyyDB.blobURL() qui renvoie un objet URL ou null si inexistant.
   * @param {string} id
   * @returns {Promise<string|null>}
   */
  async function pageURL(id) {
    return KyyDB.blobURL(id);
  }

  // Expose l’API KyyStore
  global.KyyStore = {
    KEYS,
    // séries
    allSeries, saveSeries, upsertSeries, deleteSeries,
    // chapitres
    allChapters, saveChapters, addChapter, deleteChapter,
    // profils
    allMembers, saveMembers, upsertMember, deleteMember,
    // util
    uid, slugify,
    // bonus
    getHistory, pushHistory, getFav, toggleFav,
    // pages
    addPageBlob, pageURL,
    // comptes
    allAccounts, saveAccounts, addAccount, deleteAccount, login, logout, isLogged, currentAccount
  };
})(window);
