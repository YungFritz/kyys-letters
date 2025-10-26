<!-- /public/js/pages-db.js -->
<script>
/* DB des pages chapitres (blobs) = IndexedDB.
   Clé: `${seriesId}:${chapterId}:${index}`  -> blob image
*/
window.PagesDB = (function () {
  const DB_NAME = 'kyys_pages_db';
  const STORE = 'pages';

  const withDB = () =>
    new Promise((res, rej) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE);
      req.onsuccess = () => res(req.result);
      req.onerror = () => rej(req.error);
    });

  const put = async (key, blob) => {
    const db = await withDB();
    return new Promise((res, rej) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(blob, key);
      tx.oncomplete = () => res(true);
      tx.onerror = () => rej(tx.error);
    });
  };

  const get = async (key) => {
    const db = await withDB();
    return new Promise((res, rej) => {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(key);
      req.onsuccess = () => res(req.result || null);
      req.onerror  = () => rej(req.error);
    });
  };

  const delRange = async (prefix) => {
    const db = await withDB();
    return new Promise((res, rej) => {
      const tx = db.transaction(STORE, 'readwrite');
      const store = tx.objectStore(STORE);
      const req = store.openCursor();
      req.onsuccess = () => {
        const cur = req.result;
        if (!cur) return;
        const key = String(cur.key || '');
        if (key.startsWith(prefix)) store.delete(cur.key);
        cur.continue();
      };
      tx.oncomplete = () => res(true);
      tx.onerror = () => rej(tx.error);
    });
  };

  return { put, get, delRange };
})();
</script>
