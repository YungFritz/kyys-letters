<script>
/* KyyStore — baseline fiable (localStorage + compression images)
   Séries = meta + cover compressée
   Chapitres = meta + pages compressées (JPEG), safe contre QuotaExceeded
*/
(function(){
  const KEY_SERIES   = "kl_series";
  const KEY_CHAPTERS = "kl_chapters";

  const read = (k, fallback=[]) => {
    try { return JSON.parse(localStorage.getItem(k)||"[]") } catch { return fallback }
  };
  const write = (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
      return true;
    } catch(e){
      console.warn("Stockage plein:", e);
      alert("Stockage local saturé. Les images seront gardées plus légères ou ignorées.");
      return false;
    }
  };

  // ---------- outils ----------
  function slugify(s){
    return (s||"").toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
      .replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
  }

  // compression image vers dataURL (JPEG)
  async function compressImage(file, maxW, maxH, quality=0.72){
    const bitmap = await createImageBitmap(file);
    let {width:w, height:h} = bitmap;
    const ratio = Math.min(maxW/w, maxH/h, 1);
    const nw = Math.round(w*ratio), nh = Math.round(h*ratio);

    const canvas = document.createElement("canvas");
    canvas.width = nw; canvas.height = nh;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0, nw, nh);
    return canvas.toDataURL("image/jpeg", quality);
  }

  // ---------- public API ----------
  const KyyStore = {
    // séries
    allSeries(){ return read(KEY_SERIES) },
    saveSeries(arr){ return write(KEY_SERIES, arr) },
    addSeries: async ({title, tags, status, description, coverFile})=>{
      const series = read(KEY_SERIES);
      const id = crypto.randomUUID();
      const slug = slugify(title);

      let cover = null;
      if (coverFile) {
        try { cover = await compressImage(coverFile, 520, 740, 0.78) } catch{}
      }

      series.push({ id, title, slug, tags, status, description, cover, createdAt: Date.now() });
      write(KEY_SERIES, series);
      return { id, slug };
    },

    // chapitres
    allChapters(){ return read(KEY_CHAPTERS) },
    saveChapters(arr){ return write(KEY_CHAPTERS, arr) },
    addChapter: async ({seriesId, number, name, lang, pageFiles})=>{
      const chapters = read(KEY_CHAPTERS);
      const id = crypto.randomUUID();

      // compresser chaque page; si quota tombe, on arrête et garde ce qu’on a
      const pages = [];
      for (const f of pageFiles||[]) {
        try {
          const data = await compressImage(f, 1080, 2000, 0.72);
          pages.push({ name: f.name, data });
        } catch (e) {
          console.warn("Compression page échouée:", e);
        }
        // tester quota périodiquement
        if (pages.length % 10 === 0) {
          const test = chapters.concat([{id:"__test__", pages:[{data:"x"}]}]);
          if (!write(KEY_CHAPTERS, test)) break;
          chapters.pop();
        }
      }

      chapters.push({
        id, seriesId, number, name, lang,
        pages, createdAt: Date.now()
      });
      write(KEY_CHAPTERS, chapters);
      return id;
    }
  };

  // exposer global
  window.KyyStore = KyyStore;
})();
</script>
