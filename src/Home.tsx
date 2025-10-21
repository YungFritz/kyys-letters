import { useEffect, useState } from "react";
import "./index.css";

type Chapter = { id: string; title: string; number: number; date: string };
type Series  = { id: string; title: string; slug: string; cover?: string; chapters: Chapter[] };

const STORAGE_KEY = "kyys_letters_library_v2";

export default function Home() {
  const [library, setLibrary] = useState<Series[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setLibrary(raw ? JSON.parse(raw) : []);
    } catch {
      setLibrary([]);
    }
  }, []);

  return (
    <div className="site">
      {/* HEADER */}
      <header className="header">
        <div className="brand">
          <div className="logo">K</div>
          <div className="title">Kyy’s Letters</div>
        </div>
        <nav className="nav">
          <a className="nav-link" href="#/">Accueil</a>
          <a className="nav-btn" href="#/admin">Admin</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <h1 className="hero-title">Bienvenue</h1>
          <p className="hero-sub">Espace lecture — privé, clean, sombre. 🌑</p>
        </div>
        <aside className="hero-right">
          <div className="side-card">
            <div className="side-title">Statistiques</div>
            <div className="side-line">
              Séries <strong>{library.length}</strong>
            </div>
            <div className="side-line">
              Chapitres <strong>{library.reduce((n,s)=>n+(s.chapters?.length||0),0)}</strong>
            </div>
          </div>
        </aside>
      </section>

      {/* POPULAIRE / GRID */}
      <main className="container">
        <div className="section-header">
          <div className="section-title">Derniers ajouts</div>
        </div>

        <div className="grid-cards">
          {library.length === 0 && (
            <div className="empty">Aucune série ajoutée pour le moment.</div>
          )}
          {library.map((s) => (
            <div key={s.id} className="card">
              <div className="cover">
                {s.cover ? <img src={s.cover} alt={s.title} /> : <div className="no-cover">—</div>}
              </div>
              <div className="card-body">
                <div className="card-title">{s.title}</div>
                <div className="card-meta">
                  <div className="eye">👁️</div>
                  <div className="muted">{s.chapters?.length || 0} chapitres</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        © {new Date().getFullYear()} — Kyy’s Letters (privé)
      </footer>
    </div>
  );
}
