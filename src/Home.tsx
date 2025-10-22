import { useMemo, useState } from "react";
import "./index.css";

type Chapter = { id: string; name: string; number: number; lang: string; releaseDate: string; pages: string[] };
type Series = { id: string; title: string; slug: string; tags: string[]; cover?: string; description?: string; chapters: Chapter[]; views?: number; hot?: boolean };

// ====== Démo data minimale (tu remplaceras par tes vraies données) ======
const LIBRARY: Series[] = [];

const fmtViews = (n?: number) => {
  if (!n) return "0 vues";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k vues`;
  return `${n} vues`;
};

// --------------------------------------
// Header (avec vrais liens + renommage)
// --------------------------------------
function Header({
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
        <a href="/" className="logo-chip" aria-label="Accueil">
          K
        </a>

        {/* Boutons : maintenant de vrais liens */}
        <a className="nav-btn" href="/personnelle.html">Personnelle</a>
        <a className="nav-btn" href="/recrutement.html">Recrutement</a>
        <a className="nav-btn" href="/admin.html">Admin</a>
        <a className="nav-btn" href="/connexion.html">Connexion</a>

        {/* Recherche */}
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

/* Card placeholder (utile si tu remets des séries plus tard) */
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

export default function Home() {
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

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "inherit" }}>
      {/* HEADER */}
      <Header query={query} setQuery={setQuery} />

      <main className="container">
        {/* HERO */}
        <div className="hero" style={{ gap: 18 }}>
          <div className="hero-card">
            <div className="hero-message">
              <h1 style={{ margin: "0 0 8px 0" }}>Bienvenue</h1>
              <p style={{ margin: 0, color: "var(--muted)" }}>
                Message d&apos;accueil / accroche. Remplace par ton texte.
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

        {/* POPULAIRE */}
        <section className="section" style={{ marginTop: 20 }}>
          <div className="section-header">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 18 }}>🔥</div>
              <div className="section-title">Populaire aujourd&apos;hui</div>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <button className="nav-btn">Tendances</button>
            </div>
          </div>

          <div className="grid-cards">
            {filtered.length === 0 ? (
              <div className="empty-block">Aucune série ajoutée pour le moment.</div>
            ) : (
              filtered.map((s) => <Card key={s.id} s={s} />)
            )}
          </div>
        </section>

        {/* Derniers chapitres + Stats droite */}
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
            <div className="latest-grid">
              {latest.length === 0 ? (
                <div className="empty-block">
                  Aucun chapitre publié pour le moment.
                </div>
              ) : (
                latest.map(({ series, chapter }) => (
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
                ))
              )}
            </div>
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
                  <strong>
                    {LIBRARY.reduce((n, s) => n + s.chapters.length, 0)}
                  </strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--muted)" }}>Langue</span>
                  <strong>FR</strong>
                </div>
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

      {/* BARRE D’ONGLETS MOBILE — liens sûrs */}
      <nav className="mobile-tabbar">
        <a className="tab-item" href="/">
          <div className="tab-ico">🏠</div>
          <div className="tab-txt">Accueil</div>
        </a>
        <a className="tab-item" href="/recherche.html">
          <div className="tab-ico">🔍</div>
          <div className="tab-txt">Recherche</div>
        </a>
        <a className="tab-item" href="/tendances.html">
          <div className="tab-ico">🔥</div>
          <div className="tab-txt">Tendances</div>
        </a>
        <a className="tab-item" href="/admin.html">
          <div className="tab-ico">⚙️</div>
          <div className="tab-txt">Admin</div>
        </a>
      </nav>
    </div>
  );
}
