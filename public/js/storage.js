<!-- /public/js/storage.js -->
<script>
/* ===========================
   KyyStore v2 (localStorage + IndexedDB)
   - Métadonnées (séries/chapitres) : localStorage
   - Blobs (covers/pages)           : IndexedDB (kl_db/images)
   =========================== */

window.KyyStore = (function () {
  const LS_SERIES   = "kl_series";
  const LS_CHAPTERS = "kl_chapters";

  // ---------- LocalStorage minimal ----------
  const loadJSON = (k, fallback) => {
    try { return JSON.parse(localStorage.getItem(k) || "null") ?? fallback; }
    catch { return fallback; }
  };
  const saveJSON = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  const allSeries    = () => loadJSON(LS_SERIES,   []);
  const allChapters  = () => loadJSON(LS_CHAPTERS, []);
  const saveSeries   = (arr) => saveJSON(LS_SERIES,   arr);
  const saveChapters = (arr) => saveJSON(LS_CHAPTERS, arr);

  // ---------- IndexedDB (images/blobs) ----------
  let dbPromise = null;
  function openDB () {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open("kl_db", 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains("images")) {
          const store = db.createObjectStore("images", { keyPath: "id" });
          store.createIndex("id", "id", { unique: true });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror   = () => reject(req.error);
    });
    return dbPromise;
  }

  async function putImage(id, blob) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("images", "readwrite");
      tx.objectStore("images").put({ id, blob });
      tx.oncomplete = () => resolve();
      tx.onerror    = () => reject(tx.error);
    });
  }

  async function getImageURL(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx  = db.transaction("images", "readonly");
      const req = tx.objectStore("images").get(id);
      req.onsuccess = () => {
        const rec = req.result;
        if (!rec) return resolve(null);
        resolve(URL.createObjectURL(rec.blob));
      };
      req.onerror = () => reject(req.error);
    });
  }

  async function deleteImage(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("images", "readwrite");
      tx.objectStore("images").delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror    = () => reject(tx.error);
    });
  }

  return {
    // data
    allSeries, allChapters, saveSeries, saveChapters,
    // blobs
    putImage, getImageURL, deleteImage,
  };
})();
</script>
