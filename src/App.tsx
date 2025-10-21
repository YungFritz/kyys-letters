import { useEffect, useMemo, useState } from "react";

/* =============== Types =============== */
type Chapter = {
  id: string;
  name: string;          // ex: "Chapitre 1"
  number: number;        // ex: 1
  nameExtend?: string;   // ex: "Le commencement"
  lang: string;          // ex: "FR"
  releaseDate: string;   // "YYYY-MM-DD"
  pages: string[];       // URLs des pages (structure)
};

type Series = {
  id: string;
  title: string;
  slug: string;
  altTitles?: string;
  synopsis?: string;
  authors?: string;
  artists?: string;
  genres?: string[];
  status?: "en-cours" | "terminer" | "drop";
  type?: string;          // Manga / Manhwa / etc
  year?: string;          // "2024"
  cover?: string;         // URL cover (structure, pas d’upload côté client)
  views?: number;
  hot?: boolean;
  chapters: Chapter[];
};

/* =============== Storage (localStorage) =============== */
const LS_KEY = "kyysletters.library.v1";

function loadLibrary(): Series[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return seedLibrary();
    const parsed = JSON.parse(raw) as Series[];
    return Array.isArray(parsed) ? parsed : seedLibrary();
  } catch {
    return seedLibrary();
  }
}
function saveLibrary(lib: Series[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(lib));
}

/* Petit seed de démo (tu peux vider si tu veux partir de 0) */
function seedLibrary(): Series[] {
  const demo: Series[] = [
    {
      id: "s1",
      title: "TRIBUTS — One-shot",
      slug: "tributs-oneshot",
      genres: ["FR", "One-shot", "Team Kyy"],
      cover: "",
      synopsis: "One-shot de démo (remplace par tes données).",
      views: 1200,
      hot: true,
      chapters: [
        {
          id: "s1c1",
          name: "One-shot",
          number: 1,
          lang: "FR",
          releaseDate: "2025-10-18",
          pages: [],
        },
      ],
    },
  ];
  return demo;
}

/* =============== Utils =============== */
const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "2-digit" });

const fmtViews = (n?: number) => {
  if (!n) return "0 vues";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k vues`;
  return `${n} vues`;
};

const containerStyle: React.CSSProperties = { maxWidth: 1280, margin: "0 auto", padding: "24px 16px" };

/* =============== Mini Router (hash-based) =============== */
type Route =
  | { name: "home" }
  | { name: "admin" }
  | { name: "admin-new" }
  | { name: "admin-edit"; slug: string };

function parseRoute(hash: string): Route {
  const h = hash.replace(/^#/, "");
  if (h.startsWith("/admin/manga/") && h.endsWith("/edit")) {
    const slug = h.slice("/admin/manga/".length, -"/edit".length);
    return { name: "admin-edit", slug };
  }
  if (h === "/admin/manga/new") return { name: "admin-new" };
  if (h === "/admin") return { name: "admin" };
  return { name: "home" };
}
function navigate(to: string) {
  window.location.hash = to;
}

/* =============== UI de base  =============== */
function AdminEditManga({
  library,
  slug,
  onUpdate,
  onDelete,
  onAddChapter
}: {
  library: Series[];
  slug: string;
  onUpdate: (s: Series) => void;
  onDelete: (slug: string) => void;
  onAddChapter: (slug: string, ch: Chapter) => void;
}) {
  const series = library.find(s => s.slug === slug);

  // si la série n'existe pas -> page introuvable, pas de state nullable
  if (!series) {
    return (
      <AdminLayout title="Introuvable">
        <div>Cette série n’existe pas.</div>
      </AdminLayout>
    );
  }

  // state non-nullable (TS ne se plaint plus)
  const [s, setS] = useState<Series>(series);

  // quand le slug change, on resynchronise
  useEffect(() => {
    const found = library.find(x => x.slug === slug);
    if (found) setS(found);
  }, [slug, library]);

  // form chapitre
  const [chNumber, setChNumber] = useState<number>(1);
  const [chName, setChName] = useState("");
  const [chNameExt, setChNameExt] = useState("");
  const [chLang, setChLang] = useState("FR");
  const [chDate, setChDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [chPages, setChPages] = useState<string>("");

  function update<K extends keyof Series>(key: K, value: Series[K]) {
    setS(prev => ({ ...prev, [key]: value }));
  }

  function save() {
    onUpdate(s); // s est un Series strict
  }

  function postChapter() {
    const pages = chPages.split("\n").map(l => l.trim()).filter(Boolean);
    const chap: Chapter = {
      id: `c-${crypto.randomUUID()}`,
      name: chName.trim() || `Chapitre ${chNumber}`,
      number: chNumber,
      nameExtend: chNameExt.trim() || undefined,
      lang: chLang,
      releaseDate: chDate,
      pages,
    };
    onAddChapter(s.slug, chap);
    setChName(""); setChNameExt(""); setChPages("");
  }

  return (
    <AdminLayout
      title={`Modifier : ${s.title}`}
      right={
        <div style={{ display: "flex", gap: 8 }}>
          <a href={`#/`} style={btnGray}>Voir</a>
          <button onClick={() => onDelete(s.slug)} style={btnRed}>Supprimer</button>
          <button onClick={save} style={{ border:"1px solid #2b4c18", background:"#0c1409", color:"#a7f3d0", padding:"8px 14px", borderRadius:10, fontWeight:700 }}>
            Save
          </button>
        </div>
      }
    >
      <div style={{ display: "grid", gap: 16 }}>
        {/* Form série */}
        <div style={{ display:"grid", gap:12 }}>
          <input value={s.title} onChange={e=>update("title", e.target.value)} placeholder="Titre…" style={inp}/>
          <input value={s.altTitles ?? ""} onChange={e=>update("altTitles", e.target.value)} placeholder="Titres alternatifs…" style={inp}/>
          <textarea value={s.synopsis ?? ""} onChange={e=>update("synopsis", e.target.value)} placeholder="Synopsis…" rows={5} style={ta}/>
          <div style={{ display:"grid", gap:12, gridTemplateColumns:"2fr 1fr", alignItems:"start" }}>
            <div style={{ display:"grid", gap:12 }}>
              <input value={s.authors ?? ""} onChange={e=>update("authors", e.target.value)} placeholder="Auteur(s) — virgules" style={inp}/>
              <input value={s.artists ?? ""} onChange={e=>update("artists", e.target.value)} placeholder="Artiste(s) — virgules" style={inp}/>
              <input value={(s.genres ?? []).join(", ")} onChange={e=>update("genres", e.target.value.split(",").map(x=>x.trim()).filter(Boolean))} placeholder="Genres — virgules" style={inp}/>
              <div style={{ display:"grid", gap:12, gridTemplateColumns:"1fr 1fr 1fr" }}>
                <select value={s.status ?? "en-cours"} onChange={e=>update("status", e.target.value as Series["status"])} style={inp}>
                  <option value="en-cours">En cours</option>
                  <option value="terminer">Terminé</option>
                  <option value="drop">Drop</option>
                </select>
                <input value={s.type ?? "Manga"} onChange={e=>update("type", e.target.value)} placeholder="Type" style={inp}/>
                <input value={s.year ?? ""} onChange={e=>update("year", e.target.value)} placeholder="Sortie (ex: 2024)" style={inp}/>
              </div>
            </div>
            <div style={{ display:"grid", gap:8 }}>
              <div style={{ fontSize:12, color:"#9aa0a6" }}>Cover (URL)</div>
              <input value={s.cover ?? ""} onChange={e=>update("cover", e.target.value)} placeholder="https://…" style={inp}/>
              <div style={{ border:"1px solid #27272a", borderRadius:12, overflow:"hidden", background:"#0f1112", height:220, display:"grid", placeItems:"center", color:"#9aa0a6" }}>
                {s.cover ? <img src={s.cover} alt="cover" style={{width:"100%", height:"100%", objectFit:"cover"}}/> : "Aperçu"}
              </div>
            </div>
          </div>
        </div>

        {/* Ajouter un chapitre */}
        <div style={{ borderTop:"1px solid #1d1d22", paddingTop:12 }}>
          <h3 style={{ margin:"0 0 8px 0" }}>Ajouter un chapitre</h3>
          <div style={{ display:"grid", gap:12, gridTemplateColumns:"1fr 1fr 1fr 1fr" }}>
            <input type="number" min={0} value={chNumber} onChange={e=>setChNumber(parseInt(e.target.value || "0"))} placeholder="Numéro (1)" style={inp}/>
            <input value={chName} onChange={e=>setChName(e.target.value)} placeholder="Nom (ex: Chapitre 1)" style={inp}/>
            <input value={chNameExt} onChange={e=>setChNameExt(e.target.value)} placeholder="Nom étendu (optionnel)" style={inp}/>
            <select value={chLang} onChange={e=>setChLang(e.target.value)} style={inp}>
              <option>FR</option><option>EN</option><option>JP</option><option>PT</option>
            </select>
          </div>
          <div style={{ display:"grid", gap:12, gridTemplateColumns:"1fr 3fr" , marginTop:12}}>
            <input type="date" value={chDate} onChange={e=>setChDate(e.target.value)} style={inp}/>
            <textarea value={chPages} onChange={e=>setChPages(e.target.value)} placeholder={"Pages (URLs), une par ligne\nhttps://...\nhttps://...\n"} rows={6} style={ta}/>
          </div>
          <div style={{ display:"flex", gap:8, marginTop:12 }}>
            <button onClick={postChapter} style={btnAccent}>+ Ajouter le chapitre</button>
            <span style={{ color:"#9aa0a6", fontSize:12 }}>Colle des URLs (structure seule).</span>
          </div>
        </div>

        {/* Liste chapitres */}
        <div>
          <h3 style={{ margin:"12px 0 8px 0" }}>Chapitres ({s.chapters.length})</h3>
          <div style={{ display:"grid", gap:10 }}>
            {s.chapters.slice().sort((a,b)=> b.number - a.number).map(c=>(
              <div key={c.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", border:"1px solid #27272a", background:"#0f0f12", borderRadius:12, padding:"10px 12px" }}>
                <div>
                  <strong>Chapitre {c.number}</strong> — {c.name}{c.nameExtend ? ` · ${c.nameExtend}`:""} <span style={{ color:"#9aa0a6" }}>({c.lang} • {formatDate(c.releaseDate)})</span>
                </div>
                <div style={{ color:"#9aa0a6", fontSize:12 }}>{c.pages.length} pages</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

/* ======= Add Manga ======= */
function AdminAddManga({ onCreate }: { onCreate: (s: Series) => void }) {
  const [title, setTitle] = useState("");
  const [alt, setAlt] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [authors, setAuthors] = useState("");
  const [artists, setArtists] = useState("");
  const [genres, setGenres] = useState<string>("");
  const [status, setStatus] = useState<Series["status"]>("en-cours");
  const [type, setType] = useState("Manga");
  const [year, setYear] = useState("");
  const [cover, setCover] = useState("");

  function makeSlug(s: string) {
    return s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu,"").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
  }
  function handlePost() {
    if (!title.trim()) return;
    const slug = makeSlug(title);
    const series: Series = {
      id: `s-${crypto.randomUUID()}`,
      title: title.trim(),
      slug,
      altTitles: alt.trim() || undefined,
      synopsis: synopsis.trim() || undefined,
      authors: authors.trim() || undefined,
      artists: artists.trim() || undefined,
      genres: genres.split(",").map(s=>s.trim()).filter(Boolean),
      status,
      type,
      year: year.trim() || undefined,
      cover: cover.trim() || undefined,
      chapters: [],
      views: 0,
    };
    onCreate(series);
    navigate(`/admin/manga/${slug}/edit`);
  }

  return (
    <AdminLayout
      title="Ajouter une série"
      right={
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={()=>navigate("/admin")} style={btnGray}>Annuler</button>
          <button onClick={handlePost} style={{ border:"1px solid #2b4c18", background:"#0c1409", color:"#a7f3d0", padding:"8px 14px", borderRadius:10, fontWeight:700 }}>
            Post
          </button>
        </div>
      }
    >
      <div style={{ display:"grid", gap:12 }}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Titre…" style={inp}/>
        <input value={alt} onChange={e=>setAlt(e.target.value)} placeholder="Titres alternatifs (séparés par virgules)…" style={inp}/>
        <textarea value={synopsis} onChange={e=>setSynopsis(e.target.value)} placeholder="Synopsis…" rows={5} style={ta}/>
        <div style={{ display:"grid", gap:12, gridTemplateColumns:"2fr 1fr", alignItems:"start" }}>
          <div style={{ display:"grid", gap:12 }}>
            <input value={authors} onChange={e=>setAuthors(e.target.value)} placeholder="Auteur(s) — séparés par virgules" style={inp}/>
            <input value={artists} onChange={e=>setArtists(e.target.value)} placeholder="Artiste(s) — séparés par virgules" style={inp}/>
            <input value={genres} onChange={e=>setGenres(e.target.value)} placeholder="Genres — séparés par virgules (Action, Romance…)" style={inp}/>
            <div style={{ display:"grid", gap:12, gridTemplateColumns:"1fr 1fr 1fr" }}>
              <select value={status} onChange={e=>setStatus(e.target.value as any)} style={inp}>
                <option value="en-cours">En cours</option>
                <option value="terminer">Terminé</option>
                <option value="drop">Drop</option>
              </select>
              <input value={type} onChange={e=>setType(e.target.value)} placeholder="Type (Manga/Manhwa…)" style={inp}/>
              <input value={year} onChange={e=>setYear(e.target.value)} placeholder="Sortie (ex: 2024)" style={inp}/>
            </div>
          </div>
          <div style={{ display:"grid", gap:8 }}>
            <div style={{ fontSize:12, color:"#9aa0a6" }}>Cover (URL)</div>
            <input value={cover} onChange={e=>setCover(e.target.value)} placeholder="https://…" style={inp}/>
            <div style={{ border:"1px solid #27272a", borderRadius:12, overflow:"hidden", background:"#0f1112", height:220, display:"grid", placeItems:"center", color:"#9aa0a6" }}>
              {cover ? <img src={cover} alt="cover" style={{width:"100%", height:"100%", objectFit:"cover"}}/> : "Aperçu"}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
const inp: React.CSSProperties = { width:"100%", border:"1px solid #27272a", background:"#141519", color:"#e5e7eb", padding:"10px 12px", borderRadius:10 };
const ta: React.CSSProperties  = { ...inp, minHeight:140 };

/* ======= Edit Manga + Add Chapter ======= */
function AdminEditManga({
  library,
  slug,
  onUpdate,
  onDelete,
  onAddChapter
}: {
  library: Series[];
  slug: string;
  onUpdate: (s: Series) => void;
  onDelete: (slug: string) => void;
  onAddChapter: (slug: string, ch: Chapter) => void;
}) {
  const series = library.find(s=>s.slug===slug);
  const [s, setS] = useState<Series | null>(series ?? null);

  // Chapter form
  const [chNumber, setChNumber] = useState<number>(1);
  const [chName, setChName] = useState("");
  const [chNameExt, setChNameExt] = useState("");
  const [chLang, setChLang] = useState("FR");
  const [chDate, setChDate] = useState<string>(new Date().toISOString().slice(0,10));
  const [chPages, setChPages] = useState<string>(""); // textarea URLs \n

  useEffect(()=>{ setS(series ?? null); },[slug]);

  if(!s){
    return <AdminLayout title="Introuvable"><div>Cette série n’existe pas.</div></AdminLayout>;
  }

  function update<K extends keyof Series>(key: K, value: Series[K]) {
    const next = { ...s, [key]: value };
    setS(next);
  }
  function save() {
    if (!s) return;
    onUpdate(s);
  }
  function postChapter() {
    const pages = chPages.split("\n").map(l=>l.trim()).filter(Boolean);
    const chap: Chapter = {
      id: `c-${crypto.randomUUID()}`,
      name: chName.trim() || `Chapitre ${chNumber}`,
      number: chNumber,
      nameExtend: chNameExt.trim() || undefined,
      lang: chLang,
      releaseDate: chDate,
      pages,
    };
    onAddChapter(s.slug, chap);
    // reset léger
    setChName(""); setChNameExt(""); setChPages("");
  }

  return (
    <AdminLayout
      title={`Modifier : ${s.title}`}
      right={
        <div style={{ display:"flex", gap:8 }}>
          <a href={`#/`} style={btnGray}>Voir</a>
          <button onClick={()=>onDelete(s.slug)} style={btnRed}>Supprimer</button>
          <button onClick={save} style={{ border:"1px solid #2b4c18", background:"#0c1409", color:"#a7f3d0", padding:"8px 14px", borderRadius:10, fontWeight:700 }}>Save</button>
        </div>
      }
    >
      <div style={{ display:"grid", gap:16 }}>
        {/* Form série */}
        <div style={{ display:"grid", gap:12 }}>
          <input value={s.title} onChange={e=>update("title", e.target.value)} placeholder="Titre…" style={inp}/>
          <input value={s.altTitles ?? ""} onChange={e=>update("altTitles", e.target.value)} placeholder="Titres alternatifs…" style={inp}/>
          <textarea value={s.synopsis ?? ""} onChange={e=>update("synopsis", e.target.value)} placeholder="Synopsis…" rows={5} style={ta}/>
          <div style={{ display:"grid", gap:12, gridTemplateColumns:"2fr 1fr", alignItems:"start" }}>
            <div style={{ display:"grid", gap:12 }}>
              <input value={s.authors ?? ""} onChange={e=>update("authors", e.target.value)} placeholder="Auteur(s) — virgules" style={inp}/>
              <input value={s.artists ?? ""} onChange={e=>update("artists", e.target.value)} placeholder="Artiste(s) — virgules" style={inp}/>
              <input value={(s.genres ?? []).join(", ")} onChange={e=>update("genres", e.target.value.split(",").map(x=>x.trim()).filter(Boolean))} placeholder="Genres — virgules" style={inp}/>
              <div style={{ display:"grid", gap:12, gridTemplateColumns:"1fr 1fr 1fr" }}>
                <select value={s.status ?? "en-cours"} onChange={e=>update("status", e.target.value as any)} style={inp}>
                  <option value="en-cours">En cours</option>
                  <option value="terminer">Terminé</option>
                  <option value="drop">Drop</option>
                </select>
                <input value={s.type ?? "Manga"} onChange={e=>update("type", e.target.value)} placeholder="Type" style={inp}/>
                <input value={s.year ?? ""} onChange={e=>update("year", e.target.value)} placeholder="Sortie (ex: 2024)" style={inp}/>
              </div>
            </div>
            <div style={{ display:"grid", gap:8 }}>
              <div style={{ fontSize:12, color:"#9aa0a6" }}>Cover (URL)</div>
              <input value={s.cover ?? ""} onChange={e=>update("cover", e.target.value)} placeholder="https://…" style={inp}/>
              <div style={{ border:"1px solid #27272a", borderRadius:12, overflow:"hidden", background:"#0f1112", height:220, display:"grid", placeItems:"center", color:"#9aa0a6" }}>
                {s.cover ? <img src={s.cover} alt="cover" style={{width:"100%", height:"100%", objectFit:"cover"}}/> : "Aperçu"}
              </div>
            </div>
          </div>
        </div>

        {/* Ajouter un chapitre */}
        <div style={{ borderTop:"1px solid #1d1d22", paddingTop:12 }}>
          <h3 style={{ margin:"0 0 8px 0" }}>Ajouter un chapitre</h3>
          <div style={{ display:"grid", gap:12, gridTemplateColumns:"1fr 1fr 1fr 1fr" }}>
            <input type="number" min={0} value={chNumber} onChange={e=>setChNumber(parseInt(e.target.value || "0"))} placeholder="Numéro (1)" style={inp}/>
            <input value={chName} onChange={e=>setChName(e.target.value)} placeholder="Nom (ex: Chapitre 1)" style={inp}/>
            <input value={chNameExt} onChange={e=>setChNameExt(e.target.value)} placeholder="Nom étendu (optionnel)" style={inp}/>
            <select value={chLang} onChange={e=>setChLang(e.target.value)} style={inp}>
              <option>FR</option>
              <option>EN</option>
              <option>JP</option>
              <option>PT</option>
            </select>
          </div>
          <div style={{ display:"grid", gap:12, gridTemplateColumns:"1fr 3fr" , marginTop:12}}>
            <input type="date" value={chDate} onChange={e=>setChDate(e.target.value)} style={inp}/>
            <textarea value={chPages} onChange={e=>setChPages(e.target.value)} placeholder={"Pages (URLs), une par ligne\nhttps://...\nhttps://...\n"} rows={6} style={ta}/>
          </div>
          <div style={{ display:"flex", gap:8, marginTop:12 }}>
            <button onClick={postChapter} style={btnAccent}>+ Ajouter le chapitre</button>
            <span style={{ color:"#9aa0a6", fontSize:12 }}>Astuce : colle des URLs d’images — structure uniquement.</span>
          </div>
        </div>

        {/* Liste chapitres */}
        <div>
          <h3 style={{ margin:"12px 0 8px 0" }}>Chapitres ({s.chapters.length})</h3>
          <div style={{ display:"grid", gap:10 }}>
            {s.chapters
              .slice()
              .sort((a,b)=> b.number - a.number)
              .map(c=>(
              <div key={c.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", border:"1px solid #27272a", background:"#0f0f12", borderRadius:12, padding:"10px 12px" }}>
                <div>
                  <strong>Chapitre {c.number}</strong> — {c.name}{c.nameExtend ? ` · ${c.nameExtend}`:""} <span style={{ color:"#9aa0a6" }}>({c.lang} • {formatDate(c.releaseDate)})</span>
                </div>
                <div style={{ color:"#9aa0a6", fontSize:12 }}>{c.pages.length} pages</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

/* =============== Accueil =============== */
function Home({ library }: { library: Series[] }) {
  const popular = useMemo(
    () => library.slice().sort((a,b)=>(b.views ?? 0)-(a.views ?? 0)).slice(0,8),
    [library]
  );
  const latest = useMemo(()=>{
    const all = library.flatMap(s=> s.chapters.map(c => ({ series:s, chapter:c })));
    return all.sort((a,b)=> +new Date(b.chapter.releaseDate) - +new Date(a.chapter.releaseDate)).slice(0,8);
  }, [library]);

  return (
    <>
      <main style={containerStyle}>
        {/* Hero */}
        <div style={{ border: "1px solid #26262b", background: "linear-gradient(180deg,#121214 0%,#0e0e10 100%)", borderRadius: 20, padding: "28px 24px", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, display: "grid", placeItems: "center", background: "#1f1f26", border: "1px solid #2b2b33", fontSize: 22 }}>
              📚
            </div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>Bienvenue sur <span style={{ color: "#ffd15c" }}>Kyy’s letters</span></h1>
          </div>
          <p style={{ margin: 0, color: "#a9aab4" }}>Lecteur privé — structure de démo. Admin inclus.</p>
        </div>

        {/* Populaire */}
        <section style={{ border:"1px solid #26262b", background:"linear-gradient(180deg,#121214 0%,#0e0e10 100%)", borderRadius:20, padding:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:18 }}>🔥</span>
              <h2 style={{ margin:0, fontSize:18 }}>Populaire aujourd&apos;hui</h2>
            </div>
            <div style={{ marginLeft:"auto" }}>
              <button style={{ border:"1px solid #3a2d12", background:"#1d1405", color:"#ffb74d", borderRadius:999, padding:"6px 12px", fontWeight:600 }}>
                Tendances
              </button>
            </div>
          </div>
          <div style={{ display:"grid", gap:14, gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))" }}>
            {popular.map(s => <Card key={s.id} s={s}/>)}
          </div>
        </section>

        {/* Derniers chapitres */}
        <section style={{ marginTop:20 }}>
          <div style={{ color:"#a1a1aa", fontSize:12, letterSpacing:1, textTransform:"uppercase", margin:"0 0 10px 0" }}>
            Derniers chapitres postés
          </div>
          <div style={{ display:"grid", gap:16, gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))" }}>
            {latest.map(({series,chapter})=>(
              <div key={chapter.id} style={{ border:"1px solid #27272a", background:"#0f0f12", borderRadius: 20, overflow:"hidden" }}>
                <div style={{ aspectRatio:"2/3", width:"100%", overflow:"hidden", background:"linear-gradient(180deg,#141516,#0f1112)", display:"grid", placeItems:"center", color:"#9aa0a6" }}>
                  {chapter.pages[0] ? <img src={chapter.pages[0]} alt={chapter.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/> : "PAGE"}
                </div>
                <div style={{ padding: 12 }}>
                  <div style={{ fontWeight: 700 }}>{series.title}</div>
                  <div style={{ color: "#e5e7eb" }}>
                    Chapitre {chapter.number} — <span style={{ color: "#a1a1aa" }}>{chapter.name}</span>
                  </div>
                  <div style={{ marginTop: 6, display: "flex", gap: 8, alignItems: "center", fontSize: 12, color: "#a1a1aa" }}>
                    <span>{chapter.lang}</span>
                    <span style={{ opacity: .5 }}>•</span>
                    <span>{formatDate(chapter.releaseDate)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer style={{ borderTop: "1px solid #18181b", background: "#0a0a0a", marginTop: 24 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px", color: "#a1a1aa", fontSize: 12 }}>
          © {new Date().getFullYear()} Kyy’s letters — Public (structure)
        </div>
      </footer>
    </>
  );
}

/* =============== App (router + state partagé) =============== */
export default function App() {
  const [route, setRoute] = useState<Route>(parseRoute(window.location.hash));
  const [query, setQuery] = useState("");
  const [library, setLibrary] = useState<Series[]>(() => loadLibrary());

  useEffect(() => {
    const onHash = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => { saveLibrary(library); }, [library]);

  // actions
  function createSeries(s: Series) {
    setLibrary(prev => {
      if (prev.some(x => x.slug === s.slug)) {
        // slug déjà pris => suffixe aléatoire
        s.slug = `${s.slug}-${Math.random().toString(36).slice(2,5)}`;
      }
      return [s, ...prev];
    });
  }
  function updateSeries(next: Series) {
    setLibrary(prev => prev.map(s => s.id === next.id ? next : s));
  }
  function deleteSeries(slug: string) {
    setLibrary(prev => prev.filter(s => s.slug !== slug));
    navigate("/admin");
  }
  function addChapter(slug: string, ch: Chapter) {
    setLibrary(prev => prev.map(s => {
      if (s.slug !== slug) return s;
      return { ...s, chapters: [...s.chapters, ch] };
    }));
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b0c", color: "#eaeaf0" }}>
      <Navbar query={query} setQuery={setQuery} />

      {route.name === "home" && <Home library={library} />}

      {route.name === "admin" && (
        <AdminDashboard
          library={library}
          onDelete={deleteSeries}
        />
      )}

      {route.name === "admin-new" && (
        <AdminAddManga onCreate={createSeries} />
      )}

      {route.name === "admin-edit" && (
        <AdminEditManga
          library={library}
          slug={route.slug}
          onUpdate={updateSeries}
          onDelete={deleteSeries}
          onAddChapter={addChapter}
        />
      )}
    </div>
  );
}
