import { useMemo, useState } from "react";
import "./index.css";

/* ---------------- Types ---------------- */
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

/* ---------- Données de démo (vide par défaut) ---------- */
const LIBRARY: Series[] = []; // laisse vide pour afficher “Aucune série…”

/* ---------- Helpers ---------- */
const fmtViews = (n?: number) => {
  if (!n) return "0 vues";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k vues`;
  return `${n} vues`;
};

function Card({ s }: { s: Series }) {
  return (
    <a className="card-link" href={`/series/${s.slug}`}>
      <div className="card">
        <div className="cover">COVER</div>
        <div className="card-body">
          <div className="card-title">{s.title}</div>
          <div className="card-meta">
            <div className="card-views">
              <div className="eye">👁️</div>
              <div className="muted">{fmtViews(s.views)}</div>
            </div>
            <div className="muted">{s.tags?.slice(0, 2).join(" • ")}</div>
          </div>
        </div>
      </div>
    </a>
  );
}

export default function App() {
  const [isSheetOpen, setSheetOpen] = useState(false);

  // on garde la structure que tu avais
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

  const go = (href: string) => {
    window.location.href = href;
  };

  return (
    <>
      {/* ======= HEADER ======= */}
      <header className="site-header">
        <div className="header-inner">
          {/* Left : burger + K */}
          <div className="left">
            <button
              className="burger"
              aria-label="Ouvrir le menu"
              onClick={() => setSheetOpen(true)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            <div className="logo-k">K</div>
          </div>

          {/* Search (desktop seulement) */}
          <div className="header-search desktop-only">
            <input placeholder="Rechercher une série, un tag, une langue…" />
          </div>

          {/* Liens top (desktop seulement) */}
          <nav className="top-links desktop-only">
            <a className="chip" href="#">Perso</a>
            <a className="chip" href="#">Recrutement</a>
            <button className="chip chip-accent" onClick={() => go("/admin.html")}>
              Admin
            </button>
            <a className="chip" href="#">Connexion</a>
          </nav>
        </div>
      </header>

      {/* ======= SHEET MOBILE ======= */}
      {isSheetOpen && (
        <>
          <div className="sheet-backdrop" onClick={() => setSheetOpen(false)} />
          <div className="sheet-card" role="dialog" aria-modal="true">
            <div className="sheet-head">
              <div className="sheet-logo">K</div>
              <button
                className="sheet-close"
                onClick={() => setSheetOpen(false)}
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>
            <div className="sheet-body">
              <button className="sheet-item">Perso</button>
              <button className="sheet-item">Recrutement</button>
              <button
                className="sheet-item sheet-item-accent"
                onClick={() => go("/admin.html")}
              >
                Admin
              </button>
              <button className="sheet-item">Connexion</button>

              <div className="sheet-search">
                <input placeholder="Rechercher…" />
              </div>

              <div className="sheet-stats muted">Séries: 0 • Chapitres: 0</div>
            </div>
          </div>
        </>
      )}

      {/* ======= CONTENU PRINCIPAL (inchangé) ======= */}
      <main className="container">
        {/* HERO */}
        <div className="hero" style={{ gap: 18 }}>
          <div className="hero-card">
            <div className="hero-message">
              <h1 style={{ margin: "0 0 8px 0" }}>Bienvenue</h1>
              <p className="muted" style={{ margin: 0 }}>
                Message d'accueil / accroche. Remplace par ton texte.
              </p>
            </div>
          </div>

          <div className="side-col">
            <div className="side-card">
              <div className="side-title">Rejoindre</div>
              <div className="muted">Lien discord / contact / bouton</div>
              <a className="chip chip-accent" href="#" style={{ marginTop: 10 }}>
                Ouvrir
              </a>
            </div>
            <div className="side-card">
              <div className="side-title">Statistiques</div>
              <div className="muted">
                Séries: {LIBRARY.length} • Chapitres:{" "}
                {LIBRARY.reduce((n, s) => n + s.chapters.length, 0)}
              </div>
            </div>
          </div>
        </div>

        {/* POPULAIRE */}
        <section className="section" style={{ marginTop: 20 }}>
          <div className="section-header">
            <div className="flame">🔥</div>
            <div className="section-title">Populaire aujourd'hui</div>
            <div className="push" />
            <button className="chip">Tendances</button>
          </div>

          <div className="grid-cards">
            {popular.length === 0 ? (
              <div className="empty-block">
                Aucune série ajoutée pour le moment.
              </div>
            ) : (
              popular.map((s) => <Card key={s.id} s={s} />)
            )}
          </div>
        </section>

        {/* DERNIERS CHAPITRES + STATSBLOC */}
        <div className="latest-wrap">
          <div>
            <div className="latest-title">DERNIERS CHAPITRES POSTÉS</div>
            <div className="latest-grid">
              {latest.length === 0 ? (
                <div className="empty-block">
                  Aucun chapitre publié pour le moment.
                </div>
              ) : (
                latest.map(({ series, chapter }) => (
                  <div key={chapter.id} className="card">
                    <div className="cover">PAGE</div>
                    <div className="card-pad">
                      <div className="bold">{series.title}</div>
                      <div className="muted mt6">
                        Chapitre {chapter.number} — {chapter.name}
                      </div>
                      <div className="muted mt6">
                        {chapter.lang} • {chapter.releaseDate}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <aside>
            <div className="stats">
              <div className="side-title">Statistiques</div>
              <div className="muted">Visites totales (exemple)</div>
              <div className="stats-list">
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
            </div>
          </aside>
        </div>

        {/* FOOTER */}
        <footer className="footer">
          <div className="muted">
            © {new Date().getFullYear()} — Tous droits réservés
          </div>
        </footer>
      </main>

      {/* ======= TAB BAR MOBILE (inchangé sauf CSS) ======= */}
      <nav className="mobile-tabbar">
        <button className="tab-btn" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div className="ico">🏠</div>
          <div>Accueil</div>
        </button>
        <button className="tab-btn">
          <div className="ico">🔍</div>
          <div>Recherche</div>
        </button>
        <button className="tab-btn">
          <div className="ico">🔥</div>
          <div>Tendances</div>
        </button>
        <button className="tab-btn" onClick={() => go("/admin.html")}>
          <div className="ico">⚙️</div>
          <div>Admin</div>
        </button>
      </nav>
    </>
  );
}
