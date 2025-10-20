import { useMemo, useState } from "react";

/* Kyy's letters — version large (centrée, pro)
   Thème sombre + bibliothèque de scans
   Auteur : Chris (Team Kyy)
*/

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
  cover: string;
  description: string;
  chapters: Chapter[];
};

const LIBRARY: Series[] = [
  {
    id: "kyy-001",
    title: "TRIBUTS — One-shot",
    slug: "tributs-oneshot",
    tags: ["FR", "One-shot", "Team Kyy"],
    cover: "https://picsum.photos/seed/tributs/400/560",
    description:
      "One-shot de démonstration. Remplacez par votre propre synopsis.",
    chapters: [
      {
        id: "kyy-001-c01",
        name: "One-shot",
        number: 1,
        lang: "FR",
        releaseDate: "2025-10-18",
        pages: Array.from({ length: 3 }).map(
          (_, i) => `https://picsum.photos/seed/tributs-${i + 1}/1200/1800`
        ),
      },
    ],
  },
  {
    id: "kyy-002",
    title: "Kansuke — Chapitres",
    slug: "kansuke",
    tags: ["FR", "Action", "Team Kyy"],
    cover: "https://picsum.photos/seed/kansuke/400/560",
    description: "Série factice pour test. Ajoutez vos chapitres et pages.",
    chapters: [
      {
        id: "kyy-002-c01",
        name: "Chapitre 1",
        number: 1,
        lang: "FR",
        releaseDate: "2025-10-10",
        pages: Array.from({ length: 3 }).map(
          (_, i) => `https://picsum.photos/seed/kansuke-c1-${i + 1}/1200/1800`
        ),
      },
    ],
  },
];

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

function TopBar({ onHome }: { onHome: () => void }) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "#0a0a0a",
        borderBottom: "1px solid #27272a",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "12px 16px",
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        <button
          onClick={onHome}
          style={{
            border: "1px solid #3f3f46",
            background: "#18181b",
            color: "#e4e4e7",
            padding: "8px 12px",
            borderRadius: 10,
          }}
        >
          ← Accueil
        </button>
        <h1
          style={{
            color: "#fafafa",
            fontWeight: 800,
            fontSize: 24,
            margin: 0,
          }}
        >
          Kyy&apos;s <span style={{ color: "#60a5fa" }}>letters</span>
        </h1>
        <div style={{ marginLeft: "auto", color: "#a1a1aa", fontSize: 12 }}>
          Site de scan — Team Kyy
        </div>
      </div>
    </header>
  );
}

function SearchBar({
  value,
  setValue,
}: {
  value: string;
  setValue: (v: string) => void;
}) {
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Rechercher une série, un tag, une langue..."
      style={{
        width: "100%",
        border: "1px solid #27272a",
        background: "#18181b",
        color: "#e4e4e7",
        padding: "12px 14px",
        borderRadius: 14,
      }}
    />
  );
}

function SeriesCard({ s, onOpen }: { s: Series; onOpen: (s: Series) => void }) {
  const latest = s.chapters.reduce((a, b) =>
    a.releaseDate > b.releaseDate ? a : b
  );
  return (
    <button
      onClick={() => onOpen(s)}
      style={{
        textAlign: "left",
        background: "#0f0f12",
        border: "1px solid #27272a",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      <div style={{ aspectRatio: "2/3", width: "100%", overflow: "hidden" }}>
        <img
          src={s.cover}
          alt={s.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div style={{ padding: 12 }}>
        <div style={{ color: "#fafafa", fontWeight: 700 }}>{s.title}</div>
        <div style={{ color: "#a1a1aa", fontSize: 12, marginTop: 4 }}>
          {s.description}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
          {s.tags.map((t) => (
            <span
              key={t}
              style={{
                fontSize: 10,
                color: "#a1a1aa",
                border: "1px solid #3f3f46",
                padding: "4px 8px",
                borderRadius: 999,
              }}
            >
              {t}
            </span>
          ))}
          <span
            style={{
              fontSize: 10,
              color: "#a7f3d0",
              border: "1px solid #065f46",
              padding: "4px 8px",
              borderRadius: 999,
            }}
          >
            {s.chapters.length} chap.
          </span>
          <span
            style={{
              fontSize: 10,
              color: "#93c5fd",
              border: "1px solid #1d4ed8",
              padding: "4px 8px",
              borderRadius: 999,
            }}
          >
            Maj {formatDate(latest.releaseDate)}
          </span>
        </div>
      </div>
    </button>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [current, setCurrent] = useState<Series | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LIBRARY;
    return LIBRARY.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#e5e7eb" }}>
      <TopBar onHome={() => setCurrent(null)} />

      {!current && (
        <main
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "24px 16px",
          }}
        >
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
            <div style={{ gridColumn: "span 1 / span 1" }}>
              <SearchBar value={query} setValue={setQuery} />
            </div>
            <div
              style={{
                border: "1px solid #27272a",
                background: "#0f0f12",
                borderRadius: 16,
                padding: 12,
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 6 }}>
                Bienvenue sur Kyy&apos;s letters
              </div>
              <div style={{ color: "#a1a1aa", fontSize: 14 }}>
                Lecteur de scans privé (Team Kyy).
              </div>
            </div>
          </div>

          <h2
            style={{
              color: "#a1a1aa",
              fontSize: 12,
              marginTop: 24,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Bibliothèque
          </h2>
          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
            }}
          >
            {filtered.map((s) => (
              <SeriesCard key={s.id} s={s} onOpen={setCurrent} />
            ))}
          </div>
        </main>
      )}

      <footer
        style={{
          borderTop: "1px solid #18181b",
          background: "#0a0a0a",
          marginTop: 40,
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "16px",
            color: "#a1a1aa",
            fontSize: 12,
          }}
        >
          © {new Date().getFullYear()} Kyy&apos;s letters — Team Kyy · Privé
          (usage interne).
        </div>
      </footer>
    </div>
  );
}
