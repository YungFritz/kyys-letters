import { useEffect, useMemo, useState } from "react";
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

const STORAGE_KEY = "kyys_letters_library_v2";

// helper petites chaines
const fmtViews = (n?: number) => {
  if (!n) return "0 vues";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k vues`;
  return `${n} vues`;
};

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
        {/* left: placeholder logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "linear-gradient(90deg,#111113,#0d0d0e)",
              display: "grid",
              placeItems: "center",
              color: "#fff",
              fontWeight: 800,
            }}
          >
            K
          </div>
        </div>

        {/* two small nav buttons */}
        <a className="nav-btn" href="#">
          Perso
        </a>
        <a className="nav-btn" href="#">
          Recrutement
        </a>

        {/* search */}
        <input
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une série, un tag, une langue..."
        />

        {/* right: boutons */}
        <div style={{ display: "flex", gap: 8 }}>
          <a className="nav-btn" href="#/admin">
            Admin
          </a>
          <a className="nav-btn" href="#">
            Connexion
          </a>
        </div>
      </div>
    </div>
  );
}

/* Card placeholder (no image) */
function Card({ s }: { s: Series }) {
  return (
    <a
      style={{ textDecoration: "none", color: "inherit" }}
      href={`/series/${s.slug}`}
    >
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

export default function App() {
  const [query, setQuery] = useState("");

  // ==== bibliothèque depuis localStorage (et pas de données mock) ====
  const [library, setLibrary] = useState<Series[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setLibrary(raw ? JSON.parse(raw) : []);
    } catch {
      setLibrary([]);
    }
  }, []);

  // populaire par vues
  const popular = useMemo(() => {
    const base = library.slice().sort((a, b) => (b.views || 0) - (a.views || 0));
    return base.slice(0, 8);
  }, [library]);

  // derniers chapitres (trié desc par date)
  const latest = useMemo(() => {
    const all = library.flatMap((s) =>
      (s.chapters || []).map((c) => ({ series: s, chapter: c }))
    );
    return all
      .sort(
        (a, b) =>
          +new Date(b.chapter.releaseDate || 0) -
          +new Date(a.chapter.releaseDate || 0)
      )
      .slice(0, 8);
  }, [library]);

  // filtrage simple (appliqué uniquement à la liste populaire pour démo)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return popular;
    return popular.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        (s.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  }, [popular, query]);

  const totalSeries = library.length;
  const totalChapters = library.reduce((n, s) => n + (s.chapters?.length || 0), 0);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "inherit" }}>
      <Header query={query} setQuery={setQuery} />

      <main className="container">
        {/* HERO */}
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
                Séries: {totalSeries} • Chapitres: {totalChapters}
              </div>
            </div>
          </div>
        </div>

        {/* POPULAIRE */}
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

          {/* si vide → message propre */}
          {filtered.length === 0 ? (
            <div
              style={{
                border: "1px dashed var(--stroke)",
                background: "#0f1014",
                color: "var(--muted)",
                padding: 16,
                borderRadius: 12,
              }}
            >
              Aucune série ajoutée pour le moment.
            </div>
          ) : (
            <div className="grid-cards">
              {filtered.map((s) => (
                <Card key={s.id} s={s} />
              ))}
            </div>
          )}
        </section>

        {/* Derniers chapitres */}
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
              <div
                style={{
                  border: "1px dashed var(--stroke)",
                  background: "#0f1014",
                  color: "var(--muted)",
                  padding: 16,
                  borderRadius: 12,
                }}
              >
                Aucun chapitre publié pour le moment.
              </div>
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
                  <strong>{totalSeries}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--muted)" }}>Chapitres</span>
                  <strong>{totalChapters}</strong>
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
            © {new Date().getFullYear()} — Tous droits réservés (structure)
          </div>
        </div>
      </main>
    </div>
  );
}
