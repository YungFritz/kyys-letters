/* /public/js/storage.js
   Storage simple pour Kyy's Letters (localStorage).
   Fournit window.KyyStore : { allSeries, saveSeries, allChapters, saveChapters, mergeChaptersIntoSeries, slugify }
*/
(function (w) {
  const SERIES_KEY = 'kl_series';
  const CHAPS_KEY  = 'kl_chapters';

  function safeParse(str, fallback) {
    try { return JSON.parse(str); } catch { return fallback; }
  }

  function slugify(txt) {
    return String(txt || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'item';
  }

  // Séries
  function allSeries() {
    return safeParse(localStorage.getItem(SERIES_KEY), []);
  }
  function saveSeries(arr) {
    localStorage.setItem(SERIES_KEY, JSON.stringify(arr || []));
  }

  // Chapitres (optionnel si tu veux stocker séparément)
  function allChapters() {
    return safeParse(localStorage.getItem(CHAPS_KEY), []);
  }
  function saveChapters(arr) {
    localStorage.setItem(CHAPS_KEY, JSON.stringify(arr || []));
  }

  // Merge chapitres isolés -> series[].chapters (au cas où)
  function mergeChaptersIntoSeries() {
    const series = allSeries();
    const chaps = allChapters();
    if (!series.length || !chaps.length) return series;

    const bySerie = new Map(series.map(s => [s.id, s]));
    for (const c of chaps) {
      const s = bySerie.get(c.seriesId);
      if (!s) continue;
      s.chapters = s.chapters || [];
      if (!s.chapters.find(x => x.id === c.id)) s.chapters.push(c);
    }
    for (const s of series) {
      if (s.chapters) s.chapters.sort((a, b) => a.number - b.number);
    }
    saveSeries(series);
    return series;
  }

  w.KyyStore = {
    allSeries,
    saveSeries,
    allChapters,
    saveChapters,
    mergeChaptersIntoSeries,
    slugify,
  };
})(window);
