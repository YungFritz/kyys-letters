import { useMemo } from "react";

/** Kyy's letters — Home style "Scan Reader"
 *  - Hero (gros titre + sous-titre + icône)
 *  - Section "Populaire aujourd'hui" (flamme + bouton Tendances)
 *  - Grille de cartes (badge Hot, titre, vues)
 */

type Chapter = { id: string; name: string; number: number; lang: string; releaseDate: string; pages: string[] };
type Series  = { id: string; title: string; slug: string; tags: string[]; cover: string; description: string; chapters: Chapter[]; views?: number; hot?: boolean };

// ==== Démo : remplace par tes vraies séries ====
const LIBRARY: Series[] = [
  {
    id: "s1",
    title: "La présidente…",
    slug: "presidente",
    tags: ["FR"],
    cover: "https://picsum.photos/seed/presidente/600/800",
    description: "…",
    views: 3241,
    hot: true,
    chapters: [{ id: "s1c1", name: "Chapitre 1", number: 1, lang: "FR", releaseDate: "2025-10-10", pages: [] }],
  },
  {
    id: "s2",
    title: "What Can I Do Alone ?",
    slug: "alone",
    tags: ["FR"],
    cover: "https://picsum.photos/seed/alone/600/800",
    description: "…",
    views: 2387,
    hot: true,
    chapters: [{ id: "s2c1", name: "Chapitre 1", number: 1, lang: "FR", releaseDate: "2025-10-12", pages: [] }],
  },
  {
    id: "s3",
    title: "Sensei Life",
    slug: "sensei-life",
    tags: ["FR"],
    cover: "https://picsum.photos/seed/sensei/600/800",
    description: "…",
    views: 1085,
    hot: true,
    chapters: [{ id: "s3c1", name: "Chapitre 1", number: 1, lang: "FR", releaseDate: "2025-10-14", pages: [] }],
  },
  {
    id: "s4",
    title: "Exilio",
    slug: "exilio",
    tags: ["FR"],
    cover: "https://picsum.photos/seed/exilio/600/800",
    description: "…",
    views: 816,
    hot: true,
    chapters: [{ id: "s4c1", name: "Chapitre 1", number: 1, lang: "FR", releaseDate: "2025-10-15", pages: [] }],
  },
  {
    id: "s5",
    title: "Anita to Osananajimi…",
    slug: "anita",
    tags: ["FR"],
    cover: "https://picsum.photos/seed/anita/600/800",
    description: "…",
    views: 771,
    chapters: [{ id: "s5c1", name: "Chapitre 1", number: 1, lang: "FR", releaseDate: "2025-10-11", pages: [] }],
  },
  {
    id: "s6",
    title: "Mob Shidai Nendai…",
    slug: "mob",
    tags: ["FR"],
    cover: "https://picsum.photos/seed/mob/600/800",
    description: "…",
    views: 742,
    chapters: [{ id: "s6c1", name: "Chapitre 1", number: 1, lang: "FR", releaseDate: "2025-10-09", pages: [] }],
  },
  {
    id: "s7",
    title: "Temple Of Dragon King",
    slug: "todk",
    tags: ["FR"],
    cover: "https://picsum.photos/seed/todk/600/800",
    description: "…",
    views: 642,
    chapters: [{ id: "s7c1", name: "Chapitre 1", number: 1, lang: "FR", releaseDate: "2025-10-08", pages: [] }],
  },
  {
    id: "s8",
    title: "Un sommeil entre tes bras",
    slug: "bras",
    tags: ["FR"],
    cover: "https://picsum.photos/seed/bras/600/800",
    description: "…",
    views: 627,
    chapters: [{ id: "s8c1", name: "Chapitre 1", number: 1, lang: "FR", releaseDate: "2025-10-07", pages: [] }],
  },
];

const fmtViews = (n?: number) => {
  if (!n) return "0 vues";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k vues`;
  return `${n} vues`;
};

const container: React.CSSProperties = { maxWidth: 1280, margin: "0 auto", padding: "24px 16px" };

export default function App() {
  // tri popularité : vues desc puis récence
  const popular = useMemo(
    () =>
      LIBRARY.slice().sort((a, b) => (b.views ?? 0) - (a.views ?? 0) || +new Date(b.chapters[0]?.releaseDate ?? 0) - +new Date(a.chapters[0]?.releaseDate ?? 0)),
    []
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b0c", color: "#eaeaf0" }}>
      {/* HERO */}
      <main style={container}>
        <div
          style={{
            border: "1px solid #26262b",
            background: "linear-gradient(180deg,#121214 0%,#0e0e10 100%)",
            borderRadius: 20,
            padding: "28px 24px",
            marginBottom: 18,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                display: "grid",
                placeItems: "center",
                background: "#1f1f26",
                border: "1px solid #2b2b33",
                fontSize: 22,
              }}
            >
              📚
            </div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>Bienvenue sur <span style={{ color: "#ffd15c" }}>Scan Reader</span></h1>
          </div>
          <p style={{ margin: 0, color: "#a9aab4" }}>Découvrez les derniers mangas, manhwas et webtoons en ligne</p>
        </div>

        {/* POPULAIRE AUJOURD’HUI */}
        <section
          style={{
            border: "1px solid #26262b",
            background: "linear-gradient(180deg,#121214 0%,#0e0e10 100%)",
            borderRadius: 20,
            padding: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>🔥</span>
              <h2 style={{ margin: 0, fontSize: 18 }}>Populaire aujourd&apos;hui</h2>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <button
                style={{
                  border: "1px solid #3a2d12",
                  background: "#1d1405",
                  color: "#ffb74d",
                  borderRadius: 999,
                  padding: "6px 12px",
                  fontWeight: 600,
                }}
              >
                Tendances
              </button>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: 14,
              gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))",
            }}
          >
            {popular.map((s) => (
              <Card key={s.id} s={s} />
            ))}
          </div>
        </section>
      </main>

      <footer style={{ borderTop: "1px solid #16161a", marginTop: 24 }}>
        <div style={{ ...container, paddingTop: 14, paddingBottom: 14, color: "#8b8c96", fontSize: 12 }}>
          © {new Date().getFullYear()} Kyy’s letters — Scan Reader
        </div>
      </footer>
    </div>
  );
}

function Card({ s }: { s: Series }) {
  return (
    <a
      href={`/series/${s.slug}`}
      style={{
        textDecoration: "none",
        color: "inherit",
        border: "1px solid #26262b",
        background: "#111114",
        borderRadius: 16,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ position: "relative" }}>
        <div style={{ aspectRatio: "3/4", width: "100%", overflow: "hidden" }}>
          <img src={s.cover} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>

        {/* Badge HOT */}
        {s.hot && (
          <div
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              background: "linear-gradient(90deg,#ff4d4d,#ff8a4d)",
              color: "#0b0b0c",
              fontWeight: 800,
              fontSize: 12,
              padding: "4px 8px",
              borderRadius: 999,
              border: "1px solid #3a1512",
            }}
          >
            HOT
          </div>
        )}
      </div>

      {/* Titre + vues */}
      <div style={{ padding: 12, display: "grid", gap: 6 }}>
        <div style={{ fontWeight: 800, lineHeight: 1.2 }}>{s.title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#a9aab4", fontSize: 12 }}>
          <span style={{ width: 18, height: 18, borderRadius: 999, display: "grid", placeItems: "center", background: "#1b1b21", border: "1px solid #282830" }}>
            👁️
          </span>
          <span>{fmtViews(s.views)}</span>
        </div>
      </div>
    </a>
  );
}
