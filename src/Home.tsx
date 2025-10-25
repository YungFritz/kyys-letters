import { useMemo, useState, useEffect } from "react";
import "./index.css";

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

// ====== Données placeholders ======
const LIBRARY: Series[] = [];

// Petite fonction utilitaire
const fmtViews = (n?: number) => {
  if (!n) return "0 vues";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k vues`;
  return `${n} vues`;
};

/* ======================= HEADER =========================== */
function DesktopHeader({
  query,
  setQuery,
  openMenu,
}: {
  query: string;
  setQuery: (v: string) => void;
  openMenu: () => void;
}) {
  const goTo = (path: string) => {
    window.location.replace(path);
  };

  return (
    <div className="header">
      <div className="header-inner">
        {/* Burger mobile */}
        <button
          className="hamburger"
          aria-label="Ouvrir le menu"
          onClick={openMenu}
        >
          <span />
          <span />
          <span />
        </button>

        {/* Logo */}
        <a className="logoK" href="/" aria-label="Accueil">
          K
        </a>

        {/* Barre de recherche */}
        <input
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une série, un tag, une langue..."
        />

        {/* Boutons nav */}
        <nav className="desktop-nav">
          <button className="nav-btn" onClick={() => goTo("/personnelle.html")}>
            Personnelle
          </button>
          <button className="nav-btn" onClick={() => goTo("/recrutement.html")}>
            Recrutement
          </button>
          <button className="nav-btn" onClick={() => goTo("/admin.html")}>
            Admin
          </button>
          <button className="nav-btn" onClick={() => goTo("/connexion.html")}>
            Connexion
          </button>
        </nav>
      </div>
    </div>
  );
}

/* ======================= MENU MOBILE =========================== */
function MobileSheet({
  query,
  setQuery,
  isOpen,
  onClose,
}: {
  query: string;
  setQuery: (v: string) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const goTo = (path: string) => {
    onClose();
    window.location.replace(path);
  };

  return (
    <>
      <div className={`sheet-backdrop ${isOpen ? "show" : ""}`} onClick={onClose} />
      <aside className={`sheet ${isOpen ? "open" : ""}`} aria-hidden={!isOpen}>
        <div className="sheet-header">
          <div className="logoK">K</div>
          <button className="sheet-close" onClick={onClose} aria-label="Fermer">
            ×
          </button>
        </div>

        <div className="sheet-content">
          <a className="sheet-item" onClick={() => goTo("/personnelle.html")}>
            Personnelle
          </a>
          <a className="sheet-item" onClick={() => goTo("/recrutement.html")}>
            Recrutement
          </a>
          <a className="sheet-item" onClick={() => goTo("/admin.html")}>
            Admin
          </a>
          <a className="sheet-item" onClick={() => goTo("/connexion.html")}>
            Connexion
          </a>

          <div className="sheet-divider" />

          <input
            className="sheet-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher…"
          />
        </div>
      </aside>
    </>
  );
}

/* ======================= CARD =========================== */
function Card({ s }: { s: Series }) {
  return (
    <a className="card-link" href={`/series/${s.slug}`}>
      <div className="card">
        <div className="cover">COVER</div>
        <div className="card-body">
          <div className="card-title">{s.title}</div>
          <div className="card-meta">
            <div className="meta-left">
              <div className="eye">👁️</div>
              <div className="muted">{fmtViews(s.views)}</div>
            </div>
            <div style={{ marginLeft: "auto" }} className="muted">
              {s.tags?.slice(0, 2).join(" • ")}
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

/* ======================= HOME =========================== */
export default function Home() {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const popular = useMemo(
    () => LIBRARY.slice().sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 8),
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

  const [qDebounced, setQDebounced] = useState(query);
  useEffect(() => {
    const t = setTimeout(() => setQDebounced(query), 200);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = popular.filter((s) => {
    const q = qDebounced.trim().toLowerCase();
    if (!q) return true;
    return (
      s.title.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "inherit" }}>
      <DesktopHeader query={query} setQuery={setQuery} openMenu={() => setMenuOpen(true)} />
      <MobileSheet
        query={query}
        setQuery={setQuery}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <main className="container">
        {/* HERO */}
        <div className="hero">
          <div className="card-like hero-card">
            <div className="hero-message">
              <h1>Bienvenue</h1>
              <p className="muted">
                Message d'accueil / accroche. Remplace par ton texte.
              </p>
            </div>
          </div>

          <div className="hero-side">
            <div className="card-like side-card">
              <div className="side-title">Rejoindre</div>
              <div className="muted" style={{ marginBottom: 10 }}>
                Lien discord / contact / bouton
              </div>
              <a className="btn" href="#">
                Ouvrir
              </a>
            </div>

            <div className="card-like side-card">
              <div className="side-title">Statistiques</div>
              <div className="muted">
                Séries: {LIBRARY.length} • Chapitres:{" "}
                {LIBRARY.reduce((n, s) => n + s.chapters.length, 0)}
              </div>
            </div>
          </div>
        </div>

        {/* POPULAIRE */}
<section className="section">
  <div className="section-header">
    <div className="section-left">
      <div style={{ fontSize: 18 }}>❤️‍🔥</div>
      <div className="section-title">Populaire aujourd'hui</div>
    </div>
    <a className="pill" href="/tendances.html">Tendances</a>
  </div>

  {filtered.length === 0 ? (
    // ❗ Mettre la boîte vide DANS la grille, et la faire span toutes les colonnes
    <div className="grid-cards">
      <div
        className="empty"
        style={{
          gridColumn: "1 / -1",
          minHeight: 140,
          display: "grid",
          placeItems: "center"
        }}
      >
        Aucune série ajoutée pour le moment.
      </div>
    </div>
  ) : (
    <div className="grid-cards">
      {filtered.map((s) => (
        <Card key={s.id} s={s} />
      ))}
    </div>
  )}
</section>

        {/* DERNIERS CHAPITRES */}
        <div className="bottom-grid">
          <div>
            <div className="latest-title muted">
              Derniers chapitres postés
            </div>

            {latest.length === 0 ? (
              <div className="empty" style={{ minHeight: 120 }}>
                Aucun chapitre publié pour le moment.
              </div>
            ) : (
              <div className="latest-grid">
                {latest.map(({ series, chapter }) => (
                  <div key={chapter.id} className="card">
                    <div className="cover">PAGE</div>
                    <div className="card-body">
                      <div style={{ fontWeight: 800 }}>{series.title}</div>
                      <div className="muted" style={{ marginTop: 6 }}>
                        Chapitre {chapter.number} — {chapter.name}
                      </div>
                      <div className="muted" style={{ marginTop: 8 }}>
                        {chapter.lang} • {chapter.releaseDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="card-like stats">
            <div style={{ fontWeight: 800, marginBottom: 6 }}>Statistiques</div>
            <div className="muted">Visites totales (exemple)</div>
            <div className="stats-grid">
              <div className="row">
                <span className="muted">Séries</span>
                <strong>{LIBRARY.length}</strong>
              </div>
              <div className="row">
                <span className="muted">Chapitres</span>
                <strong>
                  {LIBRARY.reduce((n, s) => n + s.chapters.length, 0)}
                </strong>
              </div>
              <div className="row">
                <span className="muted">Langue</span>
                <strong>FR</strong>
              </div>
            </div>
          </aside>
        </div>

        <div className="footer">
          © {new Date().getFullYear()} — Tous droits réservés
        </div>
      </main>

      {/* BARRE MOBILE */}
      <nav className="mobile-tabbar">
        <a className="tab-item" href="/">
          <span className="tab-emoji">🏠</span>
          Accueil
        </a>
        <a className="tab-item" href="/recherche.html">
          <span className="tab-emoji">🔍</span>
          Recherche
        </a>
        <a className="tab-item" href="/tendances.html">
          <span className="tab-emoji">🔥</span>
          Tendances
        </a>
        <a className="tab-item" href="/admin.html">
          <span className="tab-emoji">⚙️</span>
          Admin
        </a>
      </nav>
    </div>
  );
}
