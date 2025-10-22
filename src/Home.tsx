import { useMemo, useState } from "react";
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

const fmtViews = (n?: number) => {
  if (!n) return "0 vues";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k vues`;
  return `${n} vues`;
};

// ======================= HEADER ===========================
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
    // force une redirection complète (contourne React)
    window.location.replace(path);
  };

  return (
    <div className="header">
      <div className="header-inner">
        <button className="burger" aria-label="Ouvrir le menu" onClick={openMenu}>
          <span />
          <span />
          <span />
        </button>

        <a className="logo-badge" href="/" aria-label="Accueil">
          K
        </a>

        <input
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une série, un tag, une langue..."
        />

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

// ======================= MENU MOBILE ===========================
function MobileSheet({
  query,
  setQuery,
  onClose,
}: {
  query: string;
  setQuery: (v: string) => void;
  onClose: () => void;
}) {
  const goTo = (path: string) => {
    window.location.replace(path);
  };

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet-card" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <div className="logo-badge">K</div>
          <button className="sheet-close" onClick={onClose} aria-label="Fermer">
            ×
          </button>
        </div>

        <button className="sheet-link" onClick={() => goTo("/personnelle.html")}>
          Personnelle
        </button>
        <button className="sheet-link" onClick={() => goTo("/recrutement.html")}>
          Recrutement
        </button>
        <button className="sheet-link" onClick={() => goTo("/admin.html")}>
          Admin
        </button>
        <button className="sheet-link" onClick={() => goTo("/connexion.html")}>
          Connexion
        </button>

        <input
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher…"
        />
      </div>
    </div>
  );
}

// ======================= CARD ===========================
function Card({ s }: { s: Series }) {
  return (
    <a style={{ textDecoration: "none", color: "inherit" }} href={`/series/${s.slug}`}>
      <div className="card">
        <div className="cover">COVER</div>
        <div className="card-body">
          <div className="card-title">{s.title}</div>
          <div className="card-meta">
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div
                style={{
                  width: 18,
                  height: 18,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 6,
                  background: "#0b0b0b",
                  border: "1px solid rgba(255,255,255,0.02)",
                }}
              >
                👁️
              </div>
              <div style={{ color: "var(--muted)" }}>{fmtViews(s.views)}</div>
            </div>
            <div style={{ marginLeft: "auto", color: "var(--muted)" }}>
              {s.tags?.slice(0, 2).join(" • ")}
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

// ======================= HOME ===========================
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

  const filtered = popular.filter((s) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      s.title.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "inherit" }}>
      <DesktopHeader query={query} setQuery={setQuery} openMenu={() => setMenuOpen(true)} />

      {menuOpen && (
        <MobileSheet query={query} setQuery={setQuery} onClose={() => setMenuOpen(false)} />
      )}

      <main className="container">
        <div className="hero" style={{ gap: 18 }}>
          <div className="hero-card">
            <div className="hero-message">
              <h1 style={{ margin: "0 0 8px 0" }}>Bienvenue</h1>
              <p style={{ margin: 0, color: "var(--muted)" }}>
                Message d'accueil / accroche. Remplace par ton texte.
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            <div className="side-card">
              <div style={{ fontWeight: 800, marginBottom: 8 }}>Rejoindre</div>
              <div style={{ color: "var(--muted)", marginBottom: 10 }}>
                Lien discord / contact / bouton
              </div>
              <a className="nav-btn" href="#" style={{ display: "inline-block" }}>
                Ouvrir
              </a>
            </div>
            <div className="side-card">
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Statistiques</div>
              <div style={{ color: "var(--muted)" }}>
                Séries: {LIBRARY.length} • Chapitres:{" "}
                {LIBRARY.reduce((n, s) => n + s.chapters.length, 0)}
              </div>
            </div>
          </div>
        </div>

        <section className="section" style={{ marginTop: 20 }}>
          <div className="section-header">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 18 }}>🔥</div>
              <div className="section-title">Populaire aujourd'hui</div>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <button className="nav-btn">Tendances</button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-box">Aucune série ajoutée pour le moment.</div>
          ) : (
            <div className="grid-cards">
              {filtered.map((s) => (
                <Card key={s.id} s={s} />
              ))}
            </div>
          )}
        </section>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "3fr 1fr",
            gap: 18,
            marginTop: 20,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 14,
                color: "var(--muted)",
                marginBottom: 10,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Derniers chapitres postés
            </div>

            {latest.length === 0 ? (
              <div className="empty-box">Aucun chapitre publié pour le moment.</div>
            ) : (
              <div className="latest-grid">
                {latest.map(({ series, chapter }) => (
                  <div key={chapter.id} className="card">
                    <div className="cover">PAGE</div>
                    <div style={{ padding: 12 }}>
                      <div style={{ fontWeight: 800 }}>{series.title}</div>
                      <div style={{ color: "var(--muted)", marginTop: 6 }}>
                        Chapitre {chapter.number} — {chapter.name}
                      </div>
                      <div style={{ marginTop: 8, color: "var(--muted)" }}>
                        {chapter.lang} • {chapter.releaseDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside>
            <div className="stats">
              <div style={{ fontWeight: 800, marginBottom: 8 }}>Statistiques</div>
              <div style={{ color: "var(--muted)" }}>Visites totales (exemple)</div>
              <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--muted)" }}>Séries</span>
                  <strong>{LIBRARY.length}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--muted)" }}>Chapitres</span>
                  <strong>{LIBRARY.reduce((n, s) => n + s.chapters.length, 0)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--muted)" }}>Langue</span>
                  <strong>FR</strong>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className="footer">
          <div style={{ color: "var(--muted)" }}>
            © {new Date().getFullYear()} — Tous droits réservés
          </div>
        </div>
      </main>
    </div>
  );
}
