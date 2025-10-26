import { useMemo, useState } from "react";
import "./index.css";

/* ----------------------------------------------------------------
   Types de données
----------------------------------------------------------------- */
type Chapter = {
  id: string;
  name: string;
  number: number;
  lang: string;
  releaseDate: string;
  pages: string[];
  seriesId: string; // pour relier le chapitre à sa série
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
   Fonctions utilitaires pour charger la bibliothèque
----------------------------------------------------------------- */
function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/** Construit la bibliothèque à partir des clés kl_series et kl_chapters */
function loadLibrary(): Series[] {
  const seriesArr = readJSON<any[]>("kl_series", []);
  const chaptersArr = readJSON<any[]>("kl_chapters", []);

  // Indexation des chapitres par série
  const bySerie: Record<string, Chapter[]> = {};
  for (const ch of chaptersArr) {
    const c: Chapter = {
      id: ch.id,
      name: ch.title || ch.name || "",
      number: Number(ch.number ?? 0),
      lang: ch.lang || ch.language || "FR",
      releaseDate: ch.releaseDate || ch.date || "",
      pages: ch.pages || [],
      seriesId: ch.seriesId,
    };
    (bySerie[c.seriesId] ||= []).push(c);
  }

  // Construction des séries avec leurs chapitres triés
  return seriesArr.map((s) => {
    const chs = (bySerie[s.id] || []).sort(
      (a, b) => (a.number || 0) - (b.number || 0)
    );
    return {
      id: s.id,
      title: s.title || s.name || "Sans titre",
      slug: s.slug,
      tags: s.tags || [],
      cover: s.cover || "",
      description: s.description || "",
      chapters: chs,
      views: s.views || 0,
      hot: !!s.hot,
    };
  });
}

/* ----------------------------------------------------------------
   Données — chargement réel depuis localStorage
----------------------------------------------------------------- */
const LIBRARY: Series[] = loadLibrary();

/* ----------------------------------------------------------------
   Utils
----------------------------------------------------------------- */
const fmtViews = (n?: number) => {
  if (!n) return "0 vues";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k vues`;
  return `${n} vues`;
};

/* ----------------------------------------------------------------
   Header (desktop)
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
          <a className="nav-btn" href="/personnelle.html">
            Perso
          </a>
          <a className="nav-btn" href="/recrutement.html">
            Recrutement
          </a>
          <a className="nav-btn" href="/admin.html">
            Admin
          </a>
          <a className="nav-btn" href="/connexion.html">
            Connexion
          </a>
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
   Carte (liens corrigés vers manga.html?slug=...)
----------------------------------------------------------------- */
function Card({ s }: { s: Series }) {
  return (
    <a className="card-link" href={`/manga.html?slug=${s.slug}`}>
      <div className="card">
        <div className="cover">
          {s.cover ? (
            <img
              src={s.cover}
              alt={s.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            "COVER"
          )}
        </div>
        <div className="card-body">
          <div className="card-title">{s.title}</div>
          <div className="card-meta">
            <div className="meta-left">
              <div className="eye">👁️</div>
              <div className="muted">{fmtViews(s.views)}</div>
            </div>
            <div className="muted">
              {s.tags?.slice(0, 2).join(" • ")}
            </div>
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
          <a className="sheet-item" href="/personnelle.html">
            Perso
          </a>
          <a className="sheet-item" href="/recrutement.html">
            Recrutement
          </a>
          <a className="sheet-item" href="/admin.html">
            Admin
          </a>
          <a className="sheet-item" href="/connexion.html">
            Connexion
          </a>

          <div className="sheet-divider" />
          <input
            className="sheet-search"
            placeholder="Rechercher…"
            aria-label="Recherche mobile"
            // pas de binding sur recherche mobile pour l’instant
          />

          <div className="sheet-stats">
            <div className="muted">
              Séries: {LIBRARY.length} • Chapitres:{" "}
              {LIBRARY.reduce(
                (n, s) => n + (s.chapters?.length || 0),
                0
              )}
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
      <a href="/" className="tab-item">
        <span className="tab-emoji">🏠</span>
        <span>Accueil</span>
      </a>
      <a href="/recherche.html" className="tab-item">
        <span className="tab-emoji">🔎</span>
        <span>Recherche</span>
      </a>
      <a href="/tendances.html" className="tab-item">
        <span className="tab-emoji">🔥</span>
        <span>Tendances</span>
      </a>
      <a href="/admin.html" className="tab-item">
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
          +new Date(b.chapter.releaseDate) -
          +new Date(a.chapter.releaseDate)
      )
      .slice(0, 8);
  }, []);

  // filtrage par requête
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
              <div className="muted">
                Séries: {LIBRARY.length} • Chapitres:{" "}
                {LIBRARY.reduce(
                  (n, s) => n + (s.chapters?.length || 0),
                  0
                )}
              </div>
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
              <div className="empty">
                Aucune série ajoutée pour le moment.
              </div>
            ) : (
              filtered.map((s) => <Card key={s.id} s={s} />)
            )}
          </div>
        </section>

        {/* Derniers chapitres + Stats (encadrements) */}
        <div className="bottom-grid">
          <section className="latest card-like">
            <div className="latest-title">
              DERNIERS CHAPITRES POSTÉS
            </div>

            {latest.length === 0 ? (
              <div className="empty">
                Aucun chapitre publié pour le moment.
              </div>
            ) : (
              <div className="latest-grid">
                {latest.map(({ series, chapter }) => (
                  <div key={chapter.id} className="card">
                    <div className="cover">PAGE</div>
                    <div className="card-body">
                      <div className="card-title">
                        {series.title}
                      </div>
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
                <span className="muted">
                  Visites totales (exemple)
                </span>
                <strong>0</strong>
              </div>
              <div className="row">
                <span className="muted">Séries</span>
                <strong>{LIBRARY.length}</strong>
              </div>
              <div className="row">
                <span className="muted">Chapitres</span>
                <strong>
                  {LIBRARY.reduce(
                    (n, s) => n + (s.chapters?.length || 0),
                    0
                  )}
                </strong>
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
