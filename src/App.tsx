import { useEffect, useMemo, useState } from "react";
import "./index.css";

/* ========= Types ========= */
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

/* ========= Données (seed) — structure simple ========= */
const SEED: Series[] = [
  {
    id: "s1",
    title: "Série A",
    slug: "serie-a",
    tags: ["FR", "Action"],
    description: "Petit résumé A",
    chapters: [
      { id: "s1c1", name: "Chap 1", number: 1, lang: "FR", releaseDate: "2025-10-01", pages: [] },
    ],
    views: 2400,
    hot: true,
  },
  {
    id: "s2",
    title: "Série B",
    slug: "serie-b",
    tags: ["FR", "Comédie"],
    description: "Petit résumé B",
    chapters: [
      { id: "s2c1", name: "Chap 1", number: 1, lang: "FR", releaseDate: "2025-10-02", pages: [] },
    ],
    views: 1800,
    hot: true,
  },
  {
    id: "s3",
    title: "Série C",
    slug: "serie-c",
    tags: ["JP"],
    description: "Petit résumé C",
    chapters: [
      { id: "s3c1", name: "Chap 1", number: 1, lang: "JP", releaseDate: "2025-09-29", pages: [] },
    ],
    views: 1200,
  },
  {
    id: "s4",
    title: "Série D",
    slug: "serie-d",
    tags: ["KR"],
    description: "Petit résumé D",
    chapters: [
      { id: "s4c1", name: "Chap 1", number: 1, lang: "KR", releaseDate: "2025-09-30", pages: [] },
    ],
    views: 900,
  },
  {
    id: "s5",
    title: "Série E",
    slug: "serie-e",
    tags: ["EN"],
    description: "Petit résumé E",
    chapters: [
      { id: "s5c1", name: "Chap 1", number: 1, lang: "EN", releaseDate: "2025-09-28", pages: [] },
    ],
    views: 650,
  },
  {
    id: "s6",
    title: "Série F",
    slug: "serie-f",
    tags: ["FR"],
    description: "Petit résumé F",
    chapters: [
      { id: "s6c1", name: "Chap 1", number: 1, lang: "FR", releaseDate: "2025-09-20", pages: [] },
    ],
    views: 430,
  },
];

/* ========= Storage ========= */
const LS_KEY = "kyysletters.library.v1";
const load = (): Series[] => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as Series[]) : SEED;
  } catch {
    return SEED;
  }
};
const save = (lib: Series[]) => localStorage.setItem(LS_KEY, JSON.stringify(lib));

/* ========= Helpers ========= */
const fmtViews = (n?: number) => (!n ? "0 vues" : n >= 1000 ? `${(n / 1000).toFixed(1)}k vues` : `${n} vues`);

/* ========= Mini-router en hash ========= */
type Route =
  | { name: "home" }
  | { name: "admin" }
  | { name: "admin-new" }
  | { name: "admin-edit"; slug: string };

const parseRoute = (hash: string): Route => {
  const h = hash.replace(/^#/, "");
  if (h === "/admin") return { name: "admin" };
  if (h === "/admin/manga/new") return { name: "admin-new" };
  if (h.startsWith("/admin/manga/") && h.endsWith("/edit")) {
    const slug = h.slice("/admin/manga/".length, -"/edit".length);
    return { name: "admin-edit", slug };
  }
  return { name: "home" };
};
const nav = (to: string) => {
  window.location.hash = to;
};

/* ========= Header (même vibe que ton original) ========= */
function Header({ query, setQuery }: { query: string; setQuery: (v: string) => void }) {
  return (
    <div className="header">
      <div className="header-inner">
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
        <a className="nav-btn" href="#">
          Perso
        </a>
        <a className="nav-btn" href="#">
          Recrutement
        </a>

        <input
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une série, un tag, une langue..."
        />

        <div style={{ display: "flex", gap: 8 }}>
          <a
            className="nav-btn"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              nav("/admin");
            }}
          >
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

/* ========= Carte ========= */
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
            <div style={{ marginLeft: "auto", color: "var(--muted)" }}>{s.tags?.slice(0, 2).join(" • ")}</div>
          </div>
        </div>
      </div>
    </a>
  );
}

/* ========= HOME — layout d’accueil ========= */
function Home({ library }: { library: Series[] }) {
  const [query, setQuery] = useState("");
  const popular = useMemo(
    () => library.slice().sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 8),
    [library]
  );

  const filtered = popular.filter((s) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return s.title.toLowerCase().includes(q) || s.tags.some((t) => t.toLowerCase().includes(q));
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "inherit" }}>
      <Header query={query} setQuery={setQuery} />

      <main className="container">
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
              <div style={{ color: "var(--muted)", marginBottom: 10 }}>Lien discord / contact / bouton</div>
              <a className="nav-btn" href="#">
                Ouvrir
              </a>
            </div>
            <div className="side-card">
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Statistiques</div>
              <div style={{ color: "var(--muted)" }}>
                Séries: {library.length} • Chapitres:{" "}
                {library.reduce((n, s) => n + s.chapters.length, 0)}
              </div>
            </div>
          </div>
        </div>

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
            {filtered.map((s) => (
              <Card key={s.id} s={s} />
            ))}
          </div>
        </section>

        <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 18, marginTop: 20 }}>
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
              {library
                .flatMap((series) => series.chapters.map((chapter) => ({ series, chapter })))
                .sort(
                  (a, b) =>
                    +new Date(b.chapter.releaseDate) - +new Date(a.chapter.releaseDate)
                )
                .slice(0, 8)
                .map(({ series, chapter }) => (
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
          </div>

          <aside>
            <div className="stats">
              <div style={{ fontWeight: 800, marginBottom: 8 }}>Statistiques</div>
              <div style={{ color: "var(--muted)" }}>Visites totales (exemple)</div>
              <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--muted)" }}>Séries</span>
                  <strong>{library.length}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--muted)" }}>Chapitres</span>
                  <strong>
                    {library.reduce((n, s) => n + s.chapters.length, 0)}
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

        <div className="footer">
          <div style={{ color: "var(--muted)" }}>
            © {new Date().getFullYear()} — Tous droits réservés (structure demo)
          </div>
        </div>
      </main>
    </div>
  );
}

/* ========= Admin (structure légère, sans polluer ton CSS) ========= */
function AdminLayout({
  title,
  right,
  children,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>{title}</h1>
        <div>{right}</div>
      </div>
      <div
        style={{
          border: "1px solid #26262b",
          background: "linear-gradient(180deg,#121214 0%,#0e0e10 100%)",
          borderRadius: 20,
          padding: 16,
        }}
      >
        {children}
      </div>
    </main>
  );
}

const btn = (b: string, c: string) => ({
  border: `1px solid ${b}`,
  background: c,
  color: "#e5e7eb",
  padding: "8px 12px",
  borderRadius: 10,
});

// ✅ Styles communs pour les inputs (corrige l’erreur "Cannot find name 'inp'")
const inp = {
  width: "100%",
  border: "1px solid #27272a",
  background: "#141519",
  color: "#e5e7eb",
  padding: "10px 12px",
  borderRadius: 10,
};

/* Liste séries */
function AdminDashboard({
  library,
  onDelete,
}: {
  library: Series[];
  onDelete: (slug: string) => void;
}) {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const k = q.trim().toLowerCase();
    return !k
      ? library
      : library.filter(
          (s) =>
            s.title.toLowerCase().includes(k) ||
            s.tags.some((t) => t.toLowerCase().includes(k))
        );
  }, [q, library]);

  return (
    <AdminLayout
      title="Séries"
      right={
        <button onClick={() => nav("/admin/manga/new")} style={btn("#3a2d12", "#1d1405")}>
          + Nouvelle série
        </button>
      }
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Rechercher"
        style={{
          width: "100%",
          border: "1px solid #27272a",
          background: "#0f1012",
          color: "#e5e7eb",
          padding: "10px 12px",
          borderRadius: 12,
          marginBottom: 12,
        }}
      />

      <div style={{ display: "grid", gap: 12 }}>
        {list.map((s) => (
          <div
            key={s.id}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              border: "1px solid #27272a",
              background: "#0f0f12",
              borderRadius: 14,
              padding: 12,
            }}
          >
            <div
              style={{
                width: 82,
                height: 110,
                borderRadius: 8,
                background: "#141516",
                display: "grid",
                placeItems: "center",
                color: "#9aa0a6",
              }}
            >
              COVER
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800 }}>{s.title}</div>
              <div style={{ color: "#9aa0a6", fontSize: 13 }}>
                {s.tags.join(" • ")} • {s.chapters.length} chap.
              </div>
            </div>
            <button onClick={() => nav(`/admin/manga/${s.slug}/edit`)} style={btn("#3f3f46", "#18181b")}>
              Modifier
            </button>
            <button onClick={() => onDelete(s.slug)} style={btn("#7f1d1d", "#1a0b0b")}>
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

/* Ajouter une série */
function AdminAdd({ onCreate }: { onCreate: (s: Series) => void }) {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("FR");
  const [slug, setSlug] = useState("");

  const makeSlug = (t: string) =>
    t
      .toLowerCase()
      .normalize("NFD")
      // @ts-expect-error: Unicode property escapes supported in modern TS targets
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const post = () => {
    if (!title.trim()) return;
    const sg = slug || makeSlug(title);
    onCreate({
      id: `s-${crypto.randomUUID()}`,
      title: title.trim(),
      slug: sg,
      tags: tags.split(",").map((x) => x.trim()).filter(Boolean),
      chapters: [],
      views: 0,
    });
    nav(`/admin/manga/${sg}/edit`);
  };

  return (
    <AdminLayout
      title="Ajouter une série"
      right={<button onClick={post} style={btn("#2b4c18", "#0c1409")}>Post</button>}
    >
      <div style={{ display: "grid", gap: 12 }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre…" style={inp} />
        <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Slug (optionnel)" style={inp} />
        <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (séparés par virgules)" style={inp} />
      </div>
    </AdminLayout>
  );
}

/* Modifier série + ajouter chapitre */
function AdminEdit({
  library,
  slug,
  onSave,
  onAddChapter,
  onDelete,
}: {
  library: Series[];
  slug: string;
  onSave: (s: Series) => void;
  onAddChapter: (slug: string, ch: Chapter) => void;
  onDelete: (slug: string) => void;
}) {
  const base = library.find((s) => s.slug === slug);
  if (!base) return <AdminLayout title="Introuvable">Cette série n’existe pas.</AdminLayout>;

  const [s, setS] = useState<Series>(base);
  const [num, setNum] = useState(1);
  const [name, setName] = useState("");
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [lang, setLang] = useState("FR");

  useEffect(() => {
    const f = library.find((x) => x.slug === slug);
    if (f) setS(f);
  }, [slug, library]);

  const save = () => onSave(s);
  const add = () => {
    const ch: Chapter = {
      id: `c-${crypto.randomUUID()}`,
      name: name || `Chapitre ${num}`,
      number: num,
      lang,
      releaseDate: date,
      pages: [],
    };
    onAddChapter(s.slug, ch);
    setName("");
  };

  return (
    <AdminLayout
      title={`Modifier : ${s.title}`}
      right={<button onClick={save} style={btn("#2b4c18", "#0c1409")}>Save</button>}
    >
      <div style={{ display: "grid", gap: 12 }}>
        <input value={s.title} onChange={(e) => setS({ ...s, title: e.target.value })} style={inp} />
        <input
          value={s.tags.join(", ")}
          onChange={(e) => setS({ ...s, tags: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })}
          style={inp}
        />

        <div style={{ borderTop: "1px solid #1d1d22", paddingTop: 12, marginTop: 6 }}>
          <h3 style={{ margin: "0 0 8px 0" }}>Ajouter un chapitre</h3>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
            <input type="number" value={num} onChange={(e) => setNum(parseInt(e.target.value || "0"))} placeholder="Numéro" style={inp} />
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom" style={inp} />
            <select value={lang} onChange={(e) => setLang(e.target.value)} style={inp}>
              <option>FR</option>
              <option>EN</option>
              <option>JP</option>
            </select>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inp} />
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button onClick={add} style={btn("#1d4ed8", "#0b1220")}>+ Ajouter</button>
            <button onClick={() => onDelete(s.slug)} style={btn("#7f1d1d", "#1a0b0b")}>Supprimer la série</button>
          </div>
        </div>

        <div>
          <h3 style={{ margin: "12px 0 8px 0" }}>Chapitres ({s.chapters.length})</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {s.chapters
              .slice()
              .sort((a, b) => b.number - a.number)
              .map((c) => (
                <div
                  key={c.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: "1px solid #27272a",
                    background: "#0f0f12",
                    borderRadius: 12,
                    padding: "10px 12px",
                  }}
                >
                  <div>
                    <strong>Chapitre {c.number}</strong> — {c.name}{" "}
                    <span style={{ color: "#9aa0a6" }}>
                      ({c.lang} • {c.releaseDate})
                    </span>
                  </div>
                  <div style={{ color: "#9aa0a6", fontSize: 12 }}>{c.pages.length} pages</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

/* ========= App ========= */
export default function App() {
  const [route, setRoute] = useState<Route>(parseRoute(window.location.hash));
  const [library, setLibrary] = useState<Series[]>(() => load());

  useEffect(() => {
    const h = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener("hashchange", h);
    return () => window.removeEventListener("hashchange", h);
  }, []);

  useEffect(() => {
    save(library);
  }, [library]);

  const createSeries = (s: Series) => setLibrary((prev) => [s, ...prev]);
  const updateSeries = (next: Series) => setLibrary((prev) => prev.map((x) => (x.id === next.id ? next : x)));
  const deleteSeries = (slug: string) => {
    setLibrary((prev) => prev.filter((s) => s.slug !== slug));
    nav("/admin");
  };
  const addChapter = (slug: string, ch: Chapter) =>
    setLibrary((prev) => prev.map((s) => (s.slug === slug ? { ...s, chapters: [...s.chapters, ch] } : s)));

  return (
    <>
      {route.name === "home" && <Home library={library} />}
      {route.name === "admin" && <AdminDashboard library={library} onDelete={deleteSeries} />}
      {route.name === "admin-new" && <AdminAdd onCreate={createSeries} />}
      {route.name === "admin-edit" && (
        <AdminEdit
          library={library}
          slug={route.slug}
          onSave={updateSeries}
          onAddChapter={addChapter}
          onDelete={deleteSeries}
        />
      )}
    </>
  );
}
