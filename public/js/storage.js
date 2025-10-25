<!-- /public/js/storage.js -->
<script>
(function (w) {
  // Clés de stockage
  const K_SERIES  = 'kl_series';
  const K_CHAPS   = 'kl_chapters';

  // Parse sécurisé: renvoie toujours un tableau
  const safeParse = (raw, fallback = []) => {
    try {
      if (!raw) return fallback;
      const v = JSON.parse(raw);
      return Array.isArray(v) ? v : fallback;
    } catch {
      return fallback;
    }
  };

  const allSeries     = () => safeParse(localStorage.getItem(K_SERIES), []);
  const saveSeries    = (arr) => localStorage.setItem(K_SERIES, JSON.stringify(arr || []));
  const allChapters   = () => safeParse(localStorage.getItem(K_CHAPS), []);
  const saveChapters  = (arr) => localStorage.setItem(K_CHAPS, JSON.stringify(arr || []));

  w.KyyStore = { allSeries, saveSeries, allChapters, saveChapters };
})(window);
</script>
