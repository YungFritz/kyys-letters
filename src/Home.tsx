// src/Home.tsx
import { useEffect, useMemo, useState } from "react";

/* ---------- Types ---------- */
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
  createdAt?: number;
};

/* ---------- Helpers ---------- */
const getLS = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const fmtViews = (n?: number) => {
  if (!n) return "0 vues";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k vues`;
  return `${n} vues`;
};

/* ---------- Header (structure conservée) ---------- */
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
        {/* Logo / K left */}
        <a className="nav-btn k" href="/">K</a>

        {/* liens (même ordre, mêmes classes) */}
        <a className="nav-btn" href="/personnelle.html">Personnelle</a>
        <a className="nav-btn" href="/recrutement.html">Recrutement</a>
        <a className="nav-btn" href="/admin.html">Admin</a>

        {/* champ recherche (inchangé) */}
        <input
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une série, un tag, une langue..."
        />

        {/* bouton Connexion (placeholder) */}
        <a className="nav-btn" href="#">Connexion</a>
      </div>
    </div>
  );
}

/* ---------- Card (structure conservée) ---------- */
function Card({ s }: { s: Series }) {
  return (
    <a
      style={{ textDecoration: "none", color: "inherit" }}
      href={`/manga/${s.slug}`}
    >
      <div className="card">
        <div className="cover">
          {/* si pas d'image → placeholder COVER comme avant */}
          {s.cover ? (
            <img
              src={s.cover}
              alt={s.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          ) : (
            "COVER"
          )}
        </div>
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

/* ---------- Home (structure conservée) ---------- */
export default function Home() {
  const [query, setQuery] = useState("");

  // Récupération de la “librairie” depuis localStorage (si vide, tableau vide)
  const library = useMemo<Series[]>(() => getLS<Series[]>("mangas", []), []);

  // Populaire par vues (structure conservée)
  const popular = useMemo(
    () =>
      library
        .slice()
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 8),
    [library]
  );

  // Derniers chapitres (triés par date) (structure conservée)
  const latest = useMemo(() => {
    const all = library.flatMap((s) =>
      (s.chapters || []).map((c) => ({ series: s, chapter: c }))
    );
    return all
      .sort(
        (a, b) =>
          +new Date(b.chapter.releaseDate) - +new Date(a.chapter.releaseDate)
      )
      .slice(0, 8);
  }, [library]);

  // filtrage simple (appliqué uniquement à la liste populaire pour démo)
  const filtered = popular.filter((s) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      s.title.toLowerCase().includes(q) ||
      (s.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  });

  const totalSeries = library.length;
  const totalChapters = library.reduce((n, s) => n + (s.chapters?.length || 0), 0);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "inherit" }}>
      {/* Header (structure et classes intactes) */}
      <Header query={query} setQuery={setQuery} />

      {/* Contenu principal : mêmes sections et classes que ton accueil */}
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

        {/* POPULAIRE AUJOURD'HUI */}
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

          {/* si pas de séries → message (structure gardée) */}
          {filtered.length === 0 ? (
            <div
              className="card"
              style={{
                padding: 16,
                color: "var(--muted)",
                borderRadius: 14,
                marginTop: 8,
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

        {/* Derniers chapitres + stats (même structure) */}
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
                className="card"
                style={{
                  padding: 16,
                  color: "var(--muted)",
                  borderRadius: 14,
                }}
              >
                Aucun chapitre publié pour le moment.
              </div>
            ) : (
              <div className="latest-grid">
                {latest.map(({ series, chapter }) => (
                  <div key={chapter.id} className="card">
                    <div className="cover">
                      {/* On affiche la 1ère page si dispo */}
                      {chapter.pages?.[0] ? (
                        <img
                          src={chapter.pages[0]}
                          alt={series.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "10px",
                          }}
                        />
                      ) : (
                        "PAGE"
                      )}
                    </div>
                    <div style={{ padding: 12 }}>
                      <div style={{ fontWeight: 800 }}>{series.title}</div>
                      <div style={{ color: "var(--muted)", marginTop: 6 }}>
                        Chapitre {chapter.number} — {chapter.name || "Sans titre"}
                      </div>
                      <div style={{ marginTop: 8, color: "var(--muted)" }}>
                        {chapter.lang || "FR"} • {chapter.releaseDate}
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

        {/* Footer (inchangé) */}
        <div className="footer">
          <div style={{ color: "var(--muted)" }}>
            © {new Date().getFullYear()} — Tous droits réservés
          </div>
        </div>
      </main>
    </div>
  );
}
