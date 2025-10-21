import { useMemo, useState } from "react";

/* Kyy's letters — page d'accueil style scan
   - Navbar (nom du site, liens, recherche)
   - Hero (message + image) + carte Discord
   - Manga populaires (ligne)
   - Derniers chapitres postés (grille)
   - Stats (colonne droite)
*/

type Chapter = { id: string; name: string; number: number; lang: string; releaseDate: string; pages: string[]; };
type Series  = { id: string; title: string; slug: string; tags: string[]; cover: string; description: string; chapters: Chapter[]; };

// ====== Démo (remplace par tes données) ======
const LIBRARY: Series[] = [
  {
    id: "kyy-001",
    title: "TRIBUTS — One-shot",
    slug: "tributs-oneshot",
    tags: ["FR", "One-shot", "Team Kyy"],
    cover: "https://picsum.photos/seed/tributs/600/850",
    description: "One-shot de démonstration. Remplacez par votre propre synopsis.",
    chapters: [
      {
        id: "kyy-001-c01",
        name: "One-shot",
        number: 1,
        lang: "FR",
        releaseDate: "2025-10-18",
        pages: Array.from({ length: 6 }).map((_, i) => `https://picsum.photos/seed/tributs-${i + 1}/1200/1800`),
      },
    ],
  },
  {
    id: "kyy-002",
    title: "Kansuke — Chapitres",
    slug: "kansuke",
    tags: ["FR", "Action", "Team Kyy"],
    cover: "https://picsum.photos/seed/kansuke/600/850",
    description: "Série factice pour test. Ajoutez vos chapitres et pages.",
    chapters: [
      {
        id: "kyy-002-c01",
        name: "Chapitre 1",
        number: 1,
        lang: "FR",
        releaseDate: "2025-10-10",
        pages: Array.from({ length: 8 }).map((_, i) => `https://picsum.photos/seed/kansuke-c1-${i + 1}/1200/1800`),
      },
      {
        id: "kyy-002-c02",
        name: "Chapitre 2",
        number: 2,
        lang: "FR",
        releaseDate: "2025-10-19",
        pages: Array.from({ length: 7 }).map((_, i) => `https://picsum.photos/seed/kansuke-c2-${i + 1}/1200/1800`),
      },
    ],
  },
];

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "2-digit" });

// ====== Composants UI ======
function Navbar({
  value,
  setValue,
}: {
  value: string;
  setValue: (v: string) => void;
}) {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 20, background: "#0a0a0a", borderBottom: "1px solid #27272a" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "12px 16px", display: "grid", gridTemplateColumns: "auto auto auto 1fr", gap: 12, alignItems: "center" }}>
        <a href="/" style={{ fontWeight: 800, color: "#fafafa", textDecoration: "none", fontSize: 22 }}>
          Kyy’s <span style={{ color: "#60a5fa" }}>letters</span>
        </a>
        <a href="#" style={navLink}>Personnelle du site</a>
        <a href="#" style={navLink}>Recrutement</a>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Rechercher une série, un tag, une langue…"
          style={{ width: "100%", border: "1px solid #27272a", background: "#111113", color: "#e4e4e7", padding: "10px 14px", borderRadius: 999 }}
        />
      </div>
    </header>
  );
}
const navLink: React.CSSProperties = { color: "#e4e4e7", textDecoration: "none", padding: "6px 10px", border: "1px solid #3f3f46", borderRadius: 10, background: "#18181b", fontSize: 14 };

function Hero() {
  return (
    <section style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 16 }}>
      {/* Message + image manga (grand bloc arrondi) */}
      <div style={{ gridColumn: "1 / 3", display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, border: "1px solid #27272a", background: "#0f0f12", borderRadius: 24, padding: 16 }}>
        <div style={{ border: "1px solid #27272a", background: "#101013", borderRadius: 18, padding: 16 }}>
          <h2 style={{ marginTop: 0 }}>Bienvenue, équipe Kyy</h2>
          <p style={{ color: "#b4b4bb" }}>
            Message d’accueil ici. Tu peux annoncer les nouvelles sorties, un planning, ou un mot de la team.
          </p>
        </div>
        <div style={{ border: "1px solid #27272a", background: "#101013", borderRadius: 18, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src="https://picsum.photos/seed/hero-kyy/800/600" alt="Image du manga" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>

      {/* Carte Discord cliquable */}
      <a
        href="https://discord.com/invite/TON_INVITE" target="_blank" rel="noreferrer"
        style={{ border: "1px solid #374151", background: "#0b1220", borderRadius: 24, padding: 16, textDecoration: "none" }}
      >
        <div style={{ border: "1px solid #1f2937", background: "#111827", borderRadius: 18, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 10 }}>
          <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4ac.svg" alt="Discord" width={48} height={48} />
          <div style={{ color: "#c7d2fe", fontWeight: 700, textAlign: "center" }}>Rejoindre le Discord</div>
          <div style={{ color: "#9ca3af", fontSize: 12, textAlign: "center" }}>Clique pour nous rejoindre</div>
          <div style={{ marginTop: 10, border: "1px solid #4f46e5", color: "#c7d2fe", borderRadius: 10, padding: "6px 10px" }}>Ouvrir</div>
        </div>
      </a>
    </section>
  );
}

function SeriesCard({ s }: { s: Series }) {
  const latest = s.chapters.reduce((a, b) => (a.releaseDate > b.releaseDate ? a : b));
  return (
    <div style={{ textAlign: "left", background: "#0f0f12", border: "1px solid #27272a", borderRadius: 16, overflow: "hidden" }}>
      <div style={{ aspectRatio: "2/3", width: "100%", overflow: "hidden" }}>
        <img src={s.cover} alt={s.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ padding: 12 }}>
        <div style={{ color: "#fafafa", fontWeight: 700 }}>{s.title}</div>
        <div style={{ color: "#a1a1aa", fontSize: 12, marginTop: 4 }}>{s.description}</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
          {s.tags.map((t) => (
            <span key={t} style={chipGray}>{t}</span>
          ))}
          <span style={chipGreen}>{s.chapters.length} chap.</span>
          <span style={chipBlue}>Maj {formatDate(latest.releaseDate)}</span>
        </div>
      </div>
    </div>
  );
}
const chipGray: React.CSSProperties  = { fontSize: 10, color: "#a1a1aa", border: "1px solid #3f3f46", padding: "4px 8px", borderRadius: 999 };
const chipGreen: React.CSSProperties = { fontSize: 10, color: "#a7f3d0", border: "1px solid #065f46", padding: "4px 8px", borderRadius: 999 };
const chipBlue: React.CSSProperties  = { fontSize: 10, color: "#93c5fd", border: "1px solid #1d4ed8", padding: "4px 8px", borderRadius: 999 };

function PopularRow({ items }: { items: Series[] }) {
  return (
    <section>
      <h3 style={sectionTitle}>Manga populaire</h3>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))" }}>
        {items.map((s) => <SeriesCard key={s.id} s={s} />)}
      </div>
    </section>
  );
}

function LatestGrid({ items }: { items: { chapter: Chapter; series: Series }[] }) {
  return (
    <section>
      <h3 style={sectionTitle}>Derniers chapitres postés</h3>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))" }}>
        {items.map(({ chapter, series }) => (
          <div key={chapter.id} style={{ border: "1px solid #27272a", background: "#0f0f12", borderRadius: 20, overflow: "hidden" }}>
            <div style={{ aspectRatio: "2/3", width: "100%", overflow: "hidden" }}>
              <img src={chapter.pages[0] ?? series.cover} alt={chapter.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ padding: 12 }}>
              <div style={{ fontWeight: 700 }}>{series.title}</div>
              <div style={{ color: "#e5e7eb" }}>
                Chapitre {chapter.number} — <span style={{ color: "#a1a1aa" }}>{chapter.name}</span>
              </div>
              <div style={{ marginTop: 6, display: "flex", gap: 8, alignItems: "center", fontSize: 12, color: "#a1a1aa" }}>
                <span>{chapter.lang}</span>
                <span style={{ opacity: .5 }}>•</span>
                <span>{formatDate(chapter.releaseDate)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatsPanel() {
  // démo statique — branche ensuite à tes vraies métriques
  const stats = [
    { k: "Séries", v: LIBRARY.length },
    { k: "Chapitres", v: LIBRARY.reduce((n, s) => n + s.chapters.length, 0) },
    { k: "Langue", v: "FR" },
  ];
  return (
    <aside style={{ border: "1px solid #27272a", background: "#0f0f12", borderRadius: 24, padding: 16, position: "sticky", top: 84 }}>
      <h3 style={{ marginTop: 4 }}>Les statistiques</h3>
      <div style={{ marginTop: 8, display: "grid", gap: 10 }}>
        {stats.map((s) => (
          <div key={s.k} style={{ display: "flex", justifyContent: "space-between", border: "1px solid #1f2937", background: "#0b0f18", borderRadius: 12, padding: "10px 12px" }}>
            <span style={{ color: "#a1a1aa" }}>{s.k}</span>
            <span style={{ fontWeight: 800, color: "#e5e7eb" }}>{s.v}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

const sectionTitle: React.CSSProperties = { color: "#a1a1aa", fontSize: 12, letterSpacing: 1, textTransform: "uppercase", margin: "16px 0 10px" };

// ====== Page ======
export default function App() {
  const [query, setQuery] = useState("");

  // populaires (ex: plus de chapitres) — prends les 4 premiers
  const popular = useMemo(() => {
    return LIBRARY.slice().sort((a, b) => b.chapters.length - a.chapters.length).slice(0, 4);
  }, []);

  // derniers chapitres (triés par date)
  const latest = useMemo(() => {
    const all = LIBRARY.flatMap((s) => s.chapters.map((c) => ({ series: s, chapter: c })));
    return all.sort((a, b) => +new Date(b.chapter.releaseDate) - +new Date(a.chapter.releaseDate)).slice(0, 8);
  }, []);

  // recherche (filtre la rangée populaire uniquement pour la démo)
  const filteredPopular = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return popular;
    return popular.filter(
      (s) => s.title.toLowerCase().includes(q) || s.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [popular, query]);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#e5e7eb" }}>
      <Navbar value={query} setValue={setQuery} />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 16px" }}>
        <Hero />

        <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 20, marginTop: 20 }}>
          <div>
            <PopularRow items={filteredPopular} />
            <LatestGrid items={latest} />
          </div>
          <StatsPanel />
        </div>
      </main>

      <footer style={{ borderTop: "1px solid #18181b", background: "#0a0a0a", marginTop: 40 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px", color: "#a1a1aa", fontSize: 12 }}>
          © {new Date().getFullYear()} Kyy’s letters — Team Kyy · Public
        </div>
      </footer>
    </div>
  );
}
