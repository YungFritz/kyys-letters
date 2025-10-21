import { useMemo, useState } from "react";

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

// ====== Lib vide par défaut (donc messages “Aucune série…”) ======
const LIBRARY: Series[] = [];

// Helper
const fmt = {
  views(n?: number) {
    if (!n) return "0 vues";
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k vues`;
    return `${n} vues`;
  },
};

// Header (desktop + bouton Admin)
function Header({
  query,
  setQuery,
  onOpenDrawer,
}: {
  query: string;
  setQuery: (v: string) => void;
  onOpenDrawer: () => void;
}) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="/" className="brand">K</a>

        <nav className="top-nav">
          <a className="chip" href="#">Perso</a>
          <a className="chip" href="#">Recrutement</a>
          <a className="chip chip-accent" href="/admin.html">Admin</a>
          <a className="chip" href="#">Connexion</a>
        </nav>

        <div className="search-wrap">
          <input
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une série, un tag, une langue..."
          />
        </div>

        <button className="burger" onClick={onOpenDrawer} aria-label="Open menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
  );
}

// Drawer mobile (menu 3 barres) — recouvre la zone sous le header
function Drawer({
  open,
  onClose,
  query,
  setQuery,
}: {
  open: boolean;
  onClose: () => void;
  query: string;
  setQuery: (v: string) => void;
}) {
  return (
    <>
      {open && <div className="drawer-overlay" onClick={onClose} />}
      <aside className={`drawer ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="drawer-header">
          <div className="brand small">K</div>
          <button className="drawer-close" onClick={onClose}>✕</button>
        </div>

        <div className="drawer-list">
          <a className="drawer-link" href="#">Perso</a>
          <a className="drawer-link" href="#">Recrutement</a>
          <a className="drawer-link accent" href="/admin.html">Admin</a>
          <a className="drawer-link" href="#">Connexion</a>
        </div>

        <div className="drawer-search">
          <input
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher…"
          />
        </div>
      </aside>
    </>
  );
}

// Card placeholder (si on met des séries plus tard)
function Card({ s }: { s: Series }) {
  return (
    <a className="card-link" href={`/series/${s.slug}`}>
      <div className="card">
        <div className="card-cover">COVER</div>
        <div className="card-body">
          <div className="card-title">{s.title}</div>
          <div className="card-meta">
            <span className="pill">{fmt.views(s.views)}</span>
            <span className="muted">{s.tags.slice(0, 2).join(" • ")}</span>
          </div>
        </div>
      </div>
    </a>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [drawer, setDrawer] = useState(false);

  const popular = useMemo(
    () => LIBRARY.slice().sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 6),
    []
  );

  const latest = useMemo(() => {
    const all = LIBRARY.flatMap((s) => s.chapters.map((c) => ({ series: s, chapter: c })));
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
    <>
      <Header query={query} setQuery={setQuery} onOpenDrawer={() => setDrawer(true)} />
      <Drawer open={drawer} onClose={() => setDrawer(false)} query={query} setQuery={setQuery} />

      <main className="container main">
        {/* HERO */}
        <div className="grid-hero">
          <section className="panel hero">
            <h1 className="hero-title">Bienvenue</h1>
            <p className="hero-sub">
              Message d'accueil / accroche. Remplace par ton texte.
            </p>
          </section>

          <div className="stack">
            <section className="panel">
              <div style={{ fontWeight: 800, marginBottom: 8 }}>Rejoindre</div>
              <div className="muted" style={{ marginBottom: 12 }}>
                Lien discord / contact / bouton
              </div>
              <a className="btn-accent" href="#">Ouvrir</a>
            </section>

            <section className="panel">
              <div style={{ fontWeight: 800, marginBottom: 8 }}>Statistiques</div>
              <div className="stats-list">
                <div className="stats-row">
                  <span className="muted">Séries</span>
                  <b>{LIBRARY.length}</b>
                </div>
                <div className="stats-row">
                  <span className="muted">Chapitres</span>
                  <b>{LIBRARY.reduce((n, s) => n + s.chapters.length, 0)}</b>
                </div>
                <div className="stats-row">
                  <span className="muted">Langue</span>
                  <b>FR</b>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* POPULAIRE */}
        <section className="section panel">
          <div className="section-header">
            <div className="section-title">🔥 Populaire aujourd'hui</div>
            <button className="chip">Tendances</button>
          </div>

          {filtered.length === 0 ? (
            <div className="empty">Aucune série ajoutée pour le moment.</div>
          ) : (
            <div className="grid-cards">
              {filtered.map((s) => (
                <Card key={s.id} s={s} />
              ))}
            </div>
          )}
        </section>

        {/* DERNIERS CHAPITRES */}
        <div className="grid-latest">
          <section className="panel">
            <div className="section-caption" style={{ marginBottom: 8 }}>
              DERNIERS CHAPITRES POSTÉS
            </div>

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
                      <div className="muted" style={{ marginTop: 6 }}>
                        {chapter.lang} • {chapter.releaseDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <aside className="panel">
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Statistiques</div>
            <div className="stats-list">
              <div className="stats-row">
                <span className="muted">Visites totales (exemple)</span>
                <b>0</b>
              </div>
              <div className="stats-row">
                <span className="muted">Séries</span>
                <b>{LIBRARY.length}</b>
              </div>
              <div className="stats-row">
                <span className="muted">Chapitres</span>
                <b>{LIBRARY.reduce((n, s) => n + s.chapters.length, 0)}</b>
              </div>
              <div className="stats-row">
                <span className="muted">Langue</span>
                <b>FR</b>
              </div>
            </div>
          </aside>
        </div>

        <footer className="footer">
          © {new Date().getFullYear()} — Tous droits réservés
        </footer>
      </main>
    </>
  );
}
