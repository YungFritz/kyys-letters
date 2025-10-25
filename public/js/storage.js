<!-- /public/js/storage.js -->
<script>
/* Mini store unique pour Kyy's Letters (front only) */
(function (global) {
  const LS_KEYS = {
    series: 'kl_series',
    chapters: 'kl_chapters',
    members: 'kl_members',
  };

  // Sécurité anti-null/JSON foireux
  function safeGet(key, fallback = []) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  }
  function safeSet(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Helpers
  const uid = () => Math.random().toString(36).slice(2, 10);
  const slugify = (s = '') =>
    s.toLowerCase()
     .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
     .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  // Séries
  const allSeries    = () => safeGet(LS_KEYS.series, []);
  const saveSeries   = (arr) => safeSet(LS_KEYS.series, arr);

  // Chapitres
  const allChapters  = () => safeGet(LS_KEYS.chapters, []);
  const saveChapters = (arr) => safeSet(LS_KEYS.chapters, arr);

  // Membres (équipe)
  const allMembers   = () => safeGet(LS_KEYS.members, []);
  const saveMembers  = (arr) => safeSet(LS_KEYS.members, arr);

  global.KyyStore = {
    LS_KEYS, uid, slugify,
    allSeries, saveSeries,
    allChapters, saveChapters,
    allMembers, saveMembers,
  };
})(window);
</script>
