import { useMemo, useState } from "react";
import "./index.css";

/* ----------------------------------------------------------------
   Types de données (inchangés)
----------------------------------------------------------------- */
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

/* ----------------------------------------------------------------
   Données de démo (tu mettras les vraies plus tard)
----------------------------------------------------------------- */
const LIBRARY: Series[] = []; // => force l’affichage “Aucune série ajoutée …”

/* ----------------------------------------------------------------
   Utils
----------------------------------------------------------------- */
const fmtViews = (n?: number) => {
  if (!n) return "0 vues";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k vues`;
  return `${n} vues`;
};

/* ----------------------------------------------------------------
   Header (desktop) — structure conservée
----------------------------------------------------------------- */
function HeaderDesktop({
  query,
  setQuery,
  onOpenMobile,
}: {
  query: string;
  setQuery: (v: string) => void;
  onOpenMobile: () => void;
}) {
  return (
    <div className="header">
      <div className="header-inner">
        {/* Bouton hamburger (visible mobile uniquement) */}
        <button
          className="hamburger"
          aria-label="Ouvrir le menu"
          onClick={onOpenMobile}
        >
          <span />
          <span />
          <span />
        </button>

        {/* Logo K */}
        <div className="logoK">K</div>

        {/* nav desktop */}
        <nav className="desktop-nav">
          <a className="nav-btn" href="#">Perso</a>
          <a className="nav-btn" href="#">Recrutement</a>
          <a className="nav-btn active" href="#">Admin</a>
          <a className="nav-btn" href="#">Connexion</a>
        </nav>

        {/* Recherche (visible desktop) */}
        <input
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une série, un tag, une langue..."
        />
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
   Carte (tu avais cette esthétique — on la garde)
----------------------------------------------------------------- */
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
            <div className="muted">{s.tags?.slice(0, 2).join(" • ")}</div>
          </div>
        </div>
      </div>
    </a>
  );
}

/* ----------------------------------------------------------------
   Mobile sheet (menu coulissant)
----------------------------------------------------------------- */
function MobileSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      <div
        className={`sheet-backdrop ${open ? "show" : ""}`}
        onClick={onClose}
      />
      <aside className={`sheet ${open ? "open" : ""}`}>
        <div className="sheet-header">
          <div className="logoK">K</div>
          <button className="sheet-close" onClick={onClose} aria-label="Fermer">
            ×
          </button>
        </div>

        <div className="sheet-content">
          <a className="sheet-item" href="#">Perso</a>
          <a className="sheet-item" href="#">Recrutement</a>
          <a className="sheet-item" href="#">Admin</a>
          <a className="sheet-item" href="#">Connexion</a>

          <div className="sheet-divider" />
          <input
            className="sheet-search"
            placeholder="Rechercher…"
            aria-label="Recherche mobile"
          />

          <div className="sheet-stats">
            <div className="muted">
              Séries: 0 • Chapitres: 0
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ----------------------------------------------------------------
   Barre d’onglets bas (mobile)
----------------------------------------------------------------- */
function MobileTabBar() {
  return (
    <nav className="mobile-tabbar">
      <a href="#" className="tab-item">
        <span className="tab-emoji">🏠</span>
        <span>Accueil</span>
      </a>
      <a href="#" className="tab-item">
        <span className="tab-emoji">🔎</span>
        <span>Recherche</span>
      </a>
      <a href="#" className="tab-item">
        <span className="tab-emoji">🔥</span>
        <span>Tendances</span>
      </a>
      <a href="#" className="tab-item">
        <span className="tab-emoji">⚙️</span>
        <span>Admin</span>
      </a>
    </nav>
  );
}

/* ----------------------------------------------------------------
   Page
----------------------------------------------------------------- */
export default function App() {
  const [query, setQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);

  // populaires par vues
  const popular = useMemo(
    () =>
      LIBRARY.slice()
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 8),
    []
  );

  // derniers chapitres
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

  // filtrage (démo)
  const filtered = popular.filter((s) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      s.title.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="app">
      <HeaderDesktop
        query={query}
        setQuery={setQuery}
        onOpenMobile={() => setSheetOpen(true)}
      />

      {/* ---- MENU MOBILE ---- */}
      <MobileSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />

      <main className="container">
        {/* HERO / encadrement */}
        <div className="hero">
          <div className="hero-card card-like">
            <div className="hero-message">
              <h1>Bienvenue</h1>
              <p className="muted">
                Message d'accueil / accroche. Remplace par ton texte.
              </p>
            </div>
          </div>

          <div className="hero-side">
            <div className="side-card card-like">
              <div className="side-title">Rejoindre</div>
              <div className="muted">Lien discord / contact / bouton</div>
              <a className="btn" href="#" style={{ marginTop: 10 }}>
                Ouvrir
              </a>
            </div>

            <div className="side-card card-like">
              <div className="side-title">Statistiques</div>
              <div className="muted">Séries: 0 • Chapitres: 0</div>
            </div>
          </div>
        </div>

        {/* POPULAIRE / encadrement */}
        <section className="section card-like">
          <div className="section-header">
            <div className="section-left">
              <span className="flame">🔥</span>
              <div className="section-title">Populaire aujourd'hui</div>
            </div>
            <button className="pill">Tendances</button>
          </div>

          <div className="grid-cards">
            {filtered.length === 0 ? (
              <div className="empty">Aucune série ajoutée pour le moment.</div>
            ) : (
              filtered.map((s) => <Card key={s.id} s={s} />)
            )}
          </div>
        </section>

        {/* Derniers chapitres + Stats (encadrements) */}
        <div className="bottom-grid">
          <section className="latest card-like">
            <div className="latest-title">DERNIERS CHAPITRES POSTÉS</div>

            {latest.length === 0 ? (
              <div className="empty">Aucun chapitre publié pour le moment.</div>
            ) : (
              <div className="latest-grid">
                {latest.map(({ series, chapter }) => (
                  <div key={chapter.id} className="card">
                    <div className="cover">PAGE</div>
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
          </section>

          <aside className="stats card-like">
            <div className="side-title">Statistiques</div>
            <div className="stats-grid">
              <div className="row">
                <span className="muted">Visites totales (exemple)</span>
                <strong>0</strong>
              </div>
              <div className="row">
                <span className="muted">Séries</span>
                <strong>0</strong>
              </div>
              <div className="row">
                <span className="muted">Chapitres</span>
                <strong>0</strong>
              </div>
              <div className="row">
                <span className="muted">Langue</span>
                <strong>FR</strong>
              </div>
            </div>
          </aside>
        </div>

        <footer className="footer">
          © {new Date().getFullYear()} — Tous droits réservés
        </footer>
      </main>

      {/* ---- TABBAR MOBILE (seulement <860px) ---- */}
      <MobileTabBar />
    </div>
  );
}
