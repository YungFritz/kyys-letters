// /public/js/storage.js
(function () {
  const keySeries = 'kl_series';
  const keyChaps  = 'kl_chapters';

  const load = (k) => {
    try { return JSON.parse(localStorage.getItem(k) || '[]'); }
    catch { return []; }
  };
  const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  function uid(prefix='id') {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;
  }

  // Séries (ne pas mettre d’images ici)
  function allSeries() { return load(keySeries); }
  function saveSeries(arr) { save(keySeries, arr); }

  // Chapitres (ne pas mettre d’images ici)
  function allChapters() { return load(keyChaps); }
  function saveChapters(arr) { save(keyChaps, arr); }

  // Images dans IndexedDB
  async function storeCover(file) {
    const id = uid('cover');
    await KyyDB.putBlob(id, file);
    return id; // coverRef
  }
  async function storePages(files) {
    const out = [];
    for (const f of files) {
      const id = uid('page');
      await KyyDB.putBlob(id, f);
      out.push(id);
    }
    return out; // pagesRef
  }

  async function coverURL(coverRef) {
    if (!coverRef) return null;
    return KyyDB.blobURL(coverRef);
  }
  async function pageURL(pageRef) {
    if (!pageRef) return null;
    return KyyDB.blobURL(pageRef);
  }

  // LIBRARY pour la Home (résout seulement les covers)
  async function buildLibraryForHome() {
    const series = allSeries();
    const chaps  = allChapters();
    const grouped = series.map(s => ({ ...s, chapters: [] }));
    for (const c of chaps) {
      const idx = grouped.findIndex(s => s.id === c.seriesId);
      if (idx >= 0) grouped[idx].chapters.push(c);
    }
    for (const s of grouped) {
      s.cover = s.coverRef ? await coverURL(s.coverRef) : undefined;
    }
    return grouped;
  }

  window.KyyStore = {
    uid,
    allSeries, saveSeries,
    allChapters, saveChapters,
    storeCover, storePages,
    coverURL, pageURL,
    buildLibraryForHome,
  };
})();
