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

// --- Jeu de données vide par défaut (affiche les messages "Aucune série...")
const LIBRARY: Series[] = [];

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
    <header className="header">
      <div className="header-inner">
        <a className="brand" href="/">
          <span className="brand-dot">K</span>
        </a>

        <nav className="top-nav">
          <a className="pill" href="#">Perso</a>
          <a className="pill" href="#">Recrutement</a>
          <a className="pill pill--accent" href="/admin.html">
            Admin
          </a>
          <a className="pill" href="#">Connexion</a>
        </nav>

        <div className="search-wrap">
          <input
            className="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une série, un tag, une langue..."
          />
        </div>
      </div>
    </header>
  );
}

function Card({ s }: { s: Series }) {
  return (
    <a className="card" href={`/series/${s.slug}`}>
      <div className="card-cover">COVER</div>
      <div className="card-body">
        <div className="card-title">{s.title}</div>
        <div className="card-meta">
          <div className="meta-left">
            <span className="eye">👁️</span>
            <span className="muted">{fmtViews(s.views)}</span>
          </div>
          <span className="muted">{s.tags?.slice(0, 2).join(" • ")}</span>
        </div>
      </div>
    </a>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");

  const popular = useMemo(
    () => LIBRARY.slice().sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 8),
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

  const stats = {
    series: LIBRARY.length,
    chapters: LIBRARY.reduce((n, s) => n + s.chapters.length, 0),
  };

  return (
    <div className="page">
      <Header query={query} setQuery={setQuery} />

      <main className="container">
        {/* HERO */}
        <section className="grid grid--hero">
          <div className="panel panel--xl">
            <h1 className="h1">Bienvenue</h1>
            <p className="muted">
              Message d&apos;accueil / accroche. Remplace par ton texte.
            </p>
          </div>

          <div className="stack">
            <div className="panel">
              <div className="panel-title">Rejoindre</div>
              <p className="muted">Lien discord / contact / bouton</p>
              <a className="btn" href="#">Ouvrir</a>
            </div>

            <div className="panel">
              <div className="panel-title">Statistiques</div>
              <p className="muted">
                Séries: {stats.series} • Chapitres: {stats.chapters}
              </p>
            </div>
          </div>
        </section>

        {/* POPULAIRE */}
        <section className="panel panel--section">
          <div className="section-head">
            <div className="section-title">
              <span className="flame">🔥</span> Populaire aujourd&apos;hui
            </div>
            <button className="pill">Tendances</button>
          </div>

          {filtered.length === 0 ? (
            <div className="empty">Aucune série ajoutée pour le moment.</div>
          ) : (
            <div className="grid grid--cards">
              {filtered.map((s) => (
                <Card key={s.id} s={s} />
              ))}
            </div>
          )}
        </section>

        {/* DERNIERS CHAPITRES + STATS */}
        <section className="grid grid--below">
          <div className="panel panel--lg">
            <div className="subtitle">DERNIERS CHAPITRES POSTÉS</div>

            {latest.length === 0 ? (
              <div className="empty">Aucun chapitre publié pour le moment.</div>
            ) : (
              <div className="grid grid--cards">
                {latest.map(({ series, chapter }) => (
                  <div key={chapter.id} className="card">
                    <div className="card-cover">PAGE</div>
                    <div className="card-body">
                      <div className="card-title">{series.title}</div>
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
          </div>

          <aside className="panel">
            <div className="panel-title">Statistiques</div>
            <div className="kv">
              <span className="muted">Visites totales (exemple)</span>
              <strong>0</strong>
            </div>
            <div className="kv">
              <span className="muted">Séries</span>
              <strong>{stats.series}</strong>
            </div>
            <div className="kv">
              <span className="muted">Chapitres</span>
              <strong>{stats.chapters}</strong>
            </div>
            <div className="kv">
              <span className="muted">Langue</span>
              <strong>FR</strong>
            </div>
          </aside>
        </section>

        <footer className="footer">
          © {new Date().getFullYear()} — Tous droits réservés
        </footer>
      </main>
    </div>
  );
}
