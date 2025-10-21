import { useMemo, useState, useEffect } from "react";
import "./index.css";

/** ---------- Types ---------- */
type Chapter = {
  id: string;
  name: string;
  number: number;
  lang: string;
  releaseDate: string;
  pages: string[];
};

type Series = {
  id: string;
  title: string;
  slug: string;
  tags: string[];
  cover?: string;
  description?: string;
  chapters: Chapter[];
  views?: number;
  hot?: boolean;
};

/** ---------- Données démo (laisse vide si tu veux les états “aucune série/chapitre…”) ---------- */
const LIBRARY: Series[] = [
  // Exemple si tu veux tester avec des cartes :
  // {
  //   id: "s1",
  //   title: "Série A",
  //   slug: "serie-a",
  //   tags: ["FR", "Action"],
  //   description: "Petit résumé A",
  //   cover: "",
  //   views: 2400,
  //   hot: true,
  //   chapters: [
  //     { id: "s1c1", name: "Chap 1", number: 1, lang: "FR", releaseDate: "2025-10-01", pages: [] },
  //   ],
  // },
];

/** ---------- Helpers ---------- */
const fmtViews = (n?: number) => {
  if (!n) return "0 vues";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k vues`;
  return `${n} vues`;
};

/** ---------- Header (desktop + mobile) ---------- */
function Header({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (v: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Empêche le scroll de la page quand le drawer est ouvert (iOS friendly)
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <button
          className="burger"
          aria-label="Menu"
          onClick={() => setMenuOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className="brand">K</div>

        <nav className="top-nav">
          <a className="chip" href="#">
            Perso
          </a>
          <a className="chip" href="#">
            Recrutement
          </a>
          <a className="chip chip-accent" href="#/admin">
            Admin
          </a>
          <a className="chip" href="#">
            Connexion
          </a>
        </nav>

        <div className="search-wrap">
          <input
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une série, un tag, une langue..."
          />
        </div>
      </div>

      {/* Drawer mobile */}
      <div className={`drawer ${menuOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <div className="brand small">K</div>
          <button
            className="drawer-close"
            aria-label="Fermer"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* liens dans une zone scrollable */}
        <div className="drawer-list">
          <a className="drawer-link" href="#" onClick={() => setMenuOpen(false)}>
            Perso
          </a>
          <a className="drawer-link" href="#" onClick={() => setMenuOpen(false)}>
            Recrutement
          </a>
          <a
            className="drawer-link accent"
            href="#/admin"
            onClick={() => setMenuOpen(false)}
          >
            Admin
          </a>
          <a className="drawer-link" href="#" onClick={() => setMenuOpen(false)}>
            Connexion
          </a>
        </div>

        <div className="drawer-search">
          <input
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher…"
          />
        </div>
      </div>

      {/* Overlay mobile */}
      {menuOpen && (
        <div
          className="drawer-overlay"
          onClick={() => setMenuOpen(false)}
          aria-hidden
        />
      )}
    </header>
  );
}

/** ---------- Carte série ---------- */
function SeriesCard({ s }: { s: Series }) {
  return (
    <a className="card-link" href={`/series/${s.slug}`}>
      <div className="card">
        <div className="card-cover">
          {s.cover ? <img src={s.cover} alt={s.title} /> : "COVER"}
        </div>
        <div className="card-body">
          <div className="card-title">{s.title}</div>
          <div className="card-meta">
            <span className="pill">{fmtViews(s.views)}</span>
            <span className="muted">{s.tags.slice(0, 2).join(" • ")}</span>
          </div>
        </div>
      </div>
    </a>
  );
}

/** ---------- Bottom nav (mobile) ---------- */
function MobileBottomNav() {
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Navigation mobile">
      <a href="#" className="bottom-item">
        <div className="bi">🏠</div>
        <div className="bt">Accueil</div>
      </a>
      <a href="#" className="bottom-item">
        <div className="bi">🔎</div>
        <div className="bt">Rechercher</div>
      </a>
      <a href="#" className="bottom-item">
        <div className="bi">🔥</div>
        <div className="bt">Tendances</div>
      </a>
      <a href="#/admin" className="bottom-item">
        <div className="bi">⚙️</div>
        <div className="bt">Admin</div>
      </a>
    </nav>
  );
}

/** ---------- App ---------- */
export default function App() {
  const [query, setQuery] = useState("");

  const popular = useMemo(
    () =>
      LIBRARY.slice()
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 8),
    []
  );

  const latest = useMemo(() => {
    const all = LIBRARY.flatMap((s) =>
      s.chapters.map((c) => ({ series: s, chapter: c }))
    );
    return all
      .sort(
        (a, b) =>
          +new Date(b.chapter.releaseDate) - +new Date(a.chapter.releaseDate)
      )
      .slice(0, 8);
  }, []);

  const filtered = popular.filter((s) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      s.title.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const totalChapters = LIBRARY.reduce((n, s) => n + s.chapters.length, 0);

  return (
    <div className="page-root">
      <Header query={query} setQuery={setQuery} />

      <main className="container main">
        {/* HERO + SIDE */}
        <section className="grid-hero">
          <div className="panel hero">
            <h1 className="hero-title">Bienvenue</h1>
            <p className="hero-sub">
              Message d'accueil / accroche. Remplace par ton texte.
            </p>
          </div>

          <aside className="stack side">
            <div className="panel">
              <div className="panel-title">Rejoindre</div>
              <p className="muted">Lien discord / contact / bouton</p>
              <a className="btn-accent" href="#">
                Ouvrir
              </a>
            </div>

            <div className="panel">
              <div className="panel-title">Statistiques</div>
              <p className="muted">
                Séries: {LIBRARY.length} • Chapitres: {totalChapters}
              </p>
            </div>
          </aside>
        </section>

        {/* POPULAIRE */}
        <section className="panel section">
          <div className="section-header">
            <div className="section-title">
              <span className="emoji">🔥</span> Populaire aujourd'hui
            </div>
            <button className="chip">Tendances</button>
          </div>

          {filtered.length === 0 ? (
            <div className="empty">Aucune série ajoutée pour le moment.</div>
          ) : (
            <div className="grid-cards">
              {filtered.map((s) => (
                <SeriesCard key={s.id} s={s} />
              ))}
            </div>
          )}
        </section>

        {/* DERNIERS CHAPITRES + STATS */}
        <section className="grid-latest">
          <div className="panel">
            <div className="section-caption">DERNIERS CHAPITRES POSTÉS</div>

            {latest.length === 0 ? (
              <div className="empty">Aucun chapitre publié pour le moment.</div>
            ) : (
              <div className="grid-latest-cards">
                {latest.map(({ series, chapter }) => (
                  <div key={chapter.id} className="card">
                    <div className="card-cover">PAGE</div>
                    <div className="card-body">
                      <div className="card-title">{series.title}</div>
                      <div className="muted">
                        Chapitre {chapter.number} — {chapter.name}
                      </div>
                      <div className="muted">
                        {chapter.lang} • {chapter.releaseDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="panel">
            <div className="panel-title">Statistiques</div>
            <div className="stats-list">
              <div className="stats-row">
                <span className="muted">Visites totales (exemple)</span>
                <strong>0</strong>
              </div>
              <div className="stats-row">
                <span className="muted">Séries</span>
                <strong>{LIBRARY.length}</strong>
              </div>
              <div className="stats-row">
                <span className="muted">Chapitres</span>
                <strong>{totalChapters}</strong>
              </div>
              <div className="stats-row">
                <span className="muted">Langue</span>
                <strong>FR</strong>
              </div>
            </div>
          </aside>
        </section>

        <footer className="footer muted">
          © {new Date().getFullYear()} — Tous droits réservés
        </footer>
      </main>

      {/* Barre mobile (auto masquée sur desktop) */}
      <MobileBottomNav />
    </div>
  );
}
