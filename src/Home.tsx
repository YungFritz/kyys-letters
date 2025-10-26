// src/Home.tsx
import { useMemo, useState } from "react";
import "./index.css";

/* ---------------------- Types ---------------------- */
type ChapterMeta = {
  id: string;
  seriesId: string;
  number: number;
  name?: string;
  lang?: string;
  releaseDate?: string; // ISO yyyy-mm-dd
  pages?: string[];     // clés IndexedDB (côté reader)
};

type Series = {
  id: string;
  title: string;
  slug: string;
  tags: string[];
  status?: string;
  description?: string;
  coverKey?: string;   // stock interne (IndexedDB)
  coverUrl?: string;   // URL créée dans le pont index.html
  views?: number;
  hot?: boolean;
  chapters?: { id: string }[]; // références
};

/* ---------------------------------------------------
   Données exposées par le pont index.html
   (voir le script qui pose window.__LIBRARY et __CHAPTERS)
--------------------------------------------------- */
const LIBRARY: Series[] = (window as any).__LIBRARY || [];
const CHAPTERS: ChapterMeta[] = (window as any).__CHAPTERS || [];

/* ---------------------- Helpers ---------------------- */
const fmtViews = (n?: number) => {
  if (!n) return "0 vues";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k vues`;
  return `${n} vues`;
};

function Cover({ url }: { url?: string }) {
  return (
    <div className="cover">
      {url ? (
        // l’URL vient d’IndexedDB via createObjectURL (pont index.html)
        <img
          src={url}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <span style={{ color: "var(--muted)" }}>COVER</span>
      )}
    </div>
  );
}

function Card({ s }: { s: Series }) {
  return (
    <a
      className="card-link"
      href={`/manga/${encodeURIComponent(s.slug)}`}
      title={s.title}
    >
      <div className="card">
        <Cover url={s.coverUrl} />
        <div className="card-body">
          <div className="card-title">{s.title}</div>
          <div className="card-meta">
            <div className="meta-left">
              <div className="eye">👁️</div>
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

/* ---------------------- Header ---------------------- */
function DesktopHeader({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (v: string) => void;
}) {
  return (
    <div className="header">
      <div className="header-inner">
        {/* Logo */}
        <a className="logo-badge" href="/" aria-label="Accueil">
          K
        </a>

        {/* Recherche */}
        <input
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une série, un tag, une langue..."
        />

        {/* Liens: vrais href (aucun onClick qui casse la nav) */}
        <nav className="desktop-nav">
          <a className="nav-btn" href="/personnelle.html">Personnelle</a>
          <a className="nav-btn" href="/recrutement.html">Recrutement</a>
          <a className="nav-btn" href="/admin.html">Admin</a>
          <a className="nav-btn" href="/connexion.html">Connexion</a>
        </nav>
      </div>
    </div>
  );
}

/* ---------------------- Home ---------------------- */
export default function Home() {
  const [query, setQuery] = useState("");

  // Populaire = séries triées par vues
  const popular = useMemo(() => {
    return LIBRARY.slice()
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 12);
  }, []);

  // Derniers chapitres: on s'appuie sur __CHAPTERS (pont)
  const latest = useMemo(() => {
    if (!CHAPTERS.length) return [];
    const mapSeries = new Map(LIBRARY.map((s) => [s.id, s]));
    return CHAPTERS.slice()
      .sort(
        (a, b) =>
          +new Date(b.releaseDate || 0) - +new Date(a.releaseDate || 0)
      )
      .slice(0, 12)
      .map((c) => ({ series: mapSeries.get(c.seriesId), chapter: c }))
      .filter((x) => !!x.series);
  }, []);

  // Recherche
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return popular;
    return popular.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }, [popular, query]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "inherit" }}>
      {/* Header */}
      <DesktopHeader query={query} setQuery={setQuery} />

      <main className="container">
        {/* HERO */}
        <div className="hero" style={{ gap: 18 }}>
          <div className="hero-card card-like">
            <div className="hero-message">
              <h1 style={{ margin: "0 0 8px 0" }}>Bienvenue</h1>
              <p style={{ margin: 0, color: "var(--muted)" }}>
                Message d'accueil / accroche. Remplace par ton texte.
              </p>
            </div>
          </div>

          <div className="hero-side">
            <div className="card-like">
              <div style={{ fontWeight: 800, marginBottom: 8 }}>Rejoindre</div>
              <div style={{ color: "var(--muted)", marginBottom: 10 }}>
                Lien discord / contact / bouton
              </div>
              <a className="nav-btn" href="#" style={{ display: "inline-block" }}>
                Ouvrir
              </a>
            </div>
            <div className="card-like">
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Statistiques</div>
              <div style={{ color: "var(--muted)" }}>
                Séries: {LIBRARY.length} • Chapitres: {CHAPTERS.length}
              </div>
            </div>
          </div>
        </div>

        {/* POPULAIRE */}
        <section className="section" style={{ marginTop: 20 }}>
          <div className="section-header">
            <div className="section-left">
              <div style={{ fontSize: 18 }}>🔥</div>
              <div className="section-title">Populaire aujourd'hui</div>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <a className="pill" href="/tendances.html">Tendances</a>
            </div>
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

        {/* Derniers chapitres + Stats */}
        <div className="bottom-grid">
          <div className="card-like">
            <div className="latest-title">Derniers chapitres postés</div>

            {latest.length === 0 ? (
              <div className="empty">Aucun chapitre publié pour le moment.</div>
            ) : (
              <div className="latest-grid">
                {latest.map(({ series, chapter }) => (
                  <a
                    key={chapter.id}
                    className="card-link"
                    href={`/reader/${encodeURIComponent(series!.slug)}/${chapter.number}`}
                    title={`${series!.title} — Chapitre ${chapter.number}`}
                  >
                    <div className="card">
                      <div className="cover">
                        {/* Placeholder visuel pour la vignette du chapitre */}
                        <span style={{ color: "var(--muted)" }}>PAGE</span>
                      </div>
                      <div style={{ padding: 12 }}>
                        <div style={{ fontWeight: 800 }}>{series!.title}</div>
                        <div style={{ color: "var(--muted)", marginTop: 6 }}>
                          Chapitre {chapter.number} {chapter.name ? `— ${chapter.name}` : ""}
                        </div>
                        <div style={{ marginTop: 8, color: "var(--muted)" }}>
                          {chapter.lang || "FR"} • {chapter.releaseDate || ""}
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          <aside className="card-like">
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Statistiques</div>
            <div style={{ color: "var(--muted)" }}>Visites totales (exemple)</div>
            <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--muted)" }}>Séries</span>
                <strong>{LIBRARY.length}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--muted)" }}>Chapitres</span>
                <strong>{CHAPTERS.length}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--muted)" }}>Langue</span>
                <strong>FR</strong>
              </div>
            </div>
          </aside>
        </div>

        {/* Footer */}
        <div className="footer">
          <div style={{ color: "var(--muted)" }}>
            © {new Date().getFullYear()} — Tous droits réservés
          </div>
        </div>
      </main>

      {/* Barre d’onglets mobile — REELS href */}
      <nav className="mobile-tabbar">
        <a className="tab" href="/">
          <span>🏠</span>
          <span>Accueil</span>
        </a>
        <a className="tab" href="/recherche.html">
          <span>🔍</span>
          <span>Recherche</span>
        </a>
        <a className="tab" href="/tendances.html">
          <span>🔥</span>
          <span>Tendances</span>
        </a>
        <a className="tab" href="/admin.html">
          <span>⚙️</span>
          <span>Admin</span>
        </a>
      </nav>
    </div>
  );
}
