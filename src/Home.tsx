import { useMemo, useState } from "react";
import "./index.css";

type Chapter = { id: string; name: string; number: number; lang: string; releaseDate: string; pages: string[] };
type Series = { id: string; title: string; slug: string; tags: string[]; cover?: string; description?: string; chapters: Chapter[]; views?: number; hot?: boolean };

// ====== Sample data (remplace par tes vrais séries plus tard) ======
const LIBRARY: Series[] = [
  { id: "s1", title: "Série A", slug: "serie-a", tags: ["FR","Action"], description: "Petit résumé A", chapters: [{id:"s1c1",name:"Chap 1",number:1,lang:"FR",releaseDate:"2025-10-01",pages:[]}], views: 2400, hot:true },
  { id: "s2", title: "Série B", slug: "serie-b", tags: ["FR","Comédie"], description: "Petit résumé B", chapters: [{id:"s2c1",name:"Chap 1",number:1,lang:"FR",releaseDate:"2025-10-02",pages:[]}], views: 1800, hot:true },
  { id: "s3", title: "Série C", slug: "serie-c", tags: ["JP"], description: "Petit résumé C", chapters: [{id:"s3c1",name:"Chap 1",number:1,lang:"JP",releaseDate:"2025-09-29",pages:[]}], views: 1200 },
  { id: "s4", title: "Série D", slug: "serie-d", tags: ["KR"], description: "Petit résumé D", chapters: [{id:"s4c1",name:"Chap 1",number:1,lang:"KR",releaseDate:"2025-09-30",pages:[]}], views: 900 },
  { id: "s5", title: "Série E", slug: "serie-e", tags: ["EN"], description: "Petit résumé E", chapters: [{id:"s5c1",name:"Chap 1",number:1,lang:"EN",releaseDate:"2025-09-28",pages:[]}], views: 650 },
  { id: "s6", title: "Série F", slug: "serie-f", tags: ["FR"], description: "Petit résumé F", chapters: [{id:"s6c1",name:"Chap 1",number:1,lang:"FR",releaseDate:"2025-09-20",pages:[]}], views: 430 },
];

// helper petites chaines
const fmtViews = (n?: number) => {
  if (!n) return "0 vues";
  if (n >= 1000) return `${(n/1000).toFixed(1)}k vues`;
  return `${n} vues`;
};

function Header({ query, setQuery }: { query: string; setQuery: (v:string)=>void }) {
  return (
    <div className="header">
      <div className="header-inner">
        {/* left: placeholder logo */}
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:"linear-gradient(90deg,#111113,#0d0d0e)", display:"grid", placeItems:"center", color:"#fff", fontWeight:800 }}>K</div>
        </div>

        {/* two small nav buttons */}
        <a className="nav-btn" href="#">Perso</a>
        <a className="nav-btn" href="#">Recrutement</a>

        {/* search */}
        <input className="search-input" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Rechercher une série, un tag, une langue..." />

        {/* right: placeholder */}
        <div style={{ display:"flex", gap:8 }}>
          <a className="nav-btn" href="#">Connexion</a>
        </div>
      </div>
    </div>
  );
}

/* Card placeholder (no image) */
function Card({ s }: { s: Series }) {
  return (
    <a style={{ textDecoration:"none", color:"inherit" }} href={`/series/${s.slug}`}>
      <div className="card">
        <div className="cover">COVER</div>
        <div className="card-body">
          <div className="card-title">{s.title}</div>
          <div className="card-meta">
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <div style={{ width:18, height:18, display:"grid", placeItems:"center", borderRadius:6, background:"#0b0b0b", border:"1px solid rgba(255,255,255,0.02)" }}>👁️</div>
              <div style={{ color:"var(--muted)" }}>{fmtViews(s.views)}</div>
            </div>
            <div style={{ marginLeft:"auto", color:"var(--muted)" }}>{s.tags?.slice(0,2).join(" • ")}</div>
          </div>
        </div>
      </div>
    </a>
  );
}

export default function App(){
  const [query, setQuery] = useState("");
  // populaire par vues
  const popular = useMemo(()=> LIBRARY.slice().sort((a,b)=> (b.views||0)-(a.views||0)).slice(0,8), []);

  // derniers chapitres (trié desc par date)
  const latest = useMemo(()=>{
    const all = LIBRARY.flatMap(s => s.chapters.map(c => ({series:s, chapter:c})));
    return all.sort((a,b)=> +new Date(b.chapter.releaseDate) - +new Date(a.chapter.releaseDate)).slice(0,8);
  },[]);

  // filtrage simple (appliqué uniquement à la liste populaire pour démo)
  const filtered = popular.filter(s => {
    const q = query.trim().toLowerCase();
    if(!q) return true;
    return s.title.toLowerCase().includes(q) || s.tags.some(t=>t.toLowerCase().includes(q));
  });

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", color:"inherit" }}>
      <Header query={query} setQuery={setQuery} />

      <main className="container">
        {/* HERO */}
        <div className="hero" style={{ gap:18 }}>
          <div className="hero-card">
            <div className="hero-message">
              <h1 style={{ margin:"0 0 8px 0" }}>Bienvenue</h1>
              <p style={{ margin:0, color:"var(--muted)" }}>Message d'accueil / accroche. Remplace par ton texte.</p>
            </div>
          </div>

          <div style={{ display:"grid", gap:12 }}>
            <div className="side-card">
              <div style={{ fontWeight:800, marginBottom:8 }}>Rejoindre</div>
              <div style={{ color:"var(--muted)", marginBottom:10 }}>Lien discord / contact / bouton</div>
              <a className="nav-btn" href="#" style={{ display:"inline-block" }}>Ouvrir</a>
            </div>
            <div className="side-card">
              <div style={{ fontWeight:700, marginBottom:6 }}>Statistiques</div>
              <div style={{ color:"var(--muted)" }}>Séries: {LIBRARY.length} • Chapitres: {LIBRARY.reduce((n,s)=>n+s.chapters.length,0)}</div>
            </div>
          </div>
        </div>

        {/* POPULAIRE */}
        <section className="section" style={{ marginTop:20 }}>
          <div className="section-header">
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ fontSize:18 }}>🔥</div>
              <div className="section-title">Populaire aujourd'hui</div>
            </div>
            <div style={{ marginLeft:"auto" }}>
              <button className="nav-btn">Tendances</button>
            </div>
          </div>

          <div className="grid-cards">
            {filtered.map(s => <Card key={s.id} s={s} />)}
          </div>
        </section>

        {/* Derniers chapitres */}
        <div style={{ display:"grid", gridTemplateColumns:"3fr 1fr", gap:18, marginTop:20 }}>
          <div>
            <div style={{ fontSize:14, color:"var(--muted)", marginBottom:10, textTransform:"uppercase", letterSpacing:1 }}>Derniers chapitres postés</div>
            <div className="latest-grid">
              {latest.map(({series,chapter}) => (
                <div key={chapter.id} className="card">
                  <div className="cover">PAGE</div>
                  <div style={{ padding:12 }}>
                    <div style={{ fontWeight:800 }}>{series.title}</div>
                    <div style={{ color:"var(--muted)", marginTop:6 }}>Chapitre {chapter.number} — {chapter.name}</div>
                    <div style={{ marginTop:8, color:"var(--muted)" }}>{chapter.lang} • {chapter.releaseDate}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside>
            <div className="stats">
              <div style={{ fontWeight:800, marginBottom:8 }}>Statistiques</div>
              <div style={{ color:"var(--muted)" }}>Visites totales (exemple)</div>
              <div style={{ marginTop:12, display:"grid", gap:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between" }}><span style={{ color:"var(--muted)" }}>Séries</span><strong>{LIBRARY.length}</strong></div>
                <div style={{ display:"flex", justifyContent:"space-between" }}><span style={{ color:"var(--muted)" }}>Chapitres</span><strong>{LIBRARY.reduce((n,s)=>n+s.chapters.length,0)}</strong></div>
                <div style={{ display:"flex", justifyContent:"space-between" }}><span style={{ color:"var(--muted)" }}>Langue</span><strong>FR</strong></div>
              </div>
            </div>
          </aside>
        </div>

        <div className="footer">
          <div style={{ color:"var(--muted)" }}>© {new Date().getFullYear()} — Tous droits réservés (structure demo)</div>
        </div>
      </main>
    </div>
  );
}
