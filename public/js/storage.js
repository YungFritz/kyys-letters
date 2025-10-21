<script>
/* ======= storage.js — helpers localStorage ======= */
(function (win) {
  const KEY_SERIES = "kyys_series";
  const KEY_CHAPTERS = "kyys_chapters";

  function read(key) {
    try { return JSON.parse(localStorage.getItem(key) || "[]"); }
    catch { return []; }
  }
  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function allSeries() { return read(KEY_SERIES); }
  function saveSeries(list) { write(KEY_SERIES, list); }
  function allChapters() { return read(KEY_CHAPTERS); }
  function saveChapters(list) { write(KEY_CHAPTERS, list); }

  function uid(prefix="id") {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;
  }
  function slugify(s) {
    return (s||"")
      .toLowerCase()
      .normalize("NFD").replace(/\p{Diacritic}/gu,"")
      .replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
  }

  // Expose
  win.KyyStore = {
    allSeries, saveSeries, allChapters, saveChapters, uid, slugify
  };
})(window);
</script>

