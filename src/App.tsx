import { useState, useEffect, ChangeEvent } from "react";
import "./App.css";

/* -------------------- TYPES -------------------- */
interface Chapter {
  id: string;
  title: string;
  number: number;
  date: string;
}

interface Series {
  id: string;
  title: string;
  slug: string;
  cover?: string; // base64 image
  chapters: Chapter[];
}

/* -------------------- LOCALSTORAGE -------------------- */
const STORAGE_KEY = "kyys_letters_library_v2";

const loadLibrary = (): Series[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveLibrary = (lib: Series[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lib));
};

/* -------------------- ROUTER -------------------- */
type Route =
  | { name: "home" }
  | { name: "admin" }
  | { name: "admin-new" }
  | { name: "admin-edit"; slug: string };

const parseRoute = (hash: string): Route => {
  const clean = hash.replace(/^#/, "").trim();
  if (clean === "/admin") return { name: "admin" };
  if (clean === "/admin/manga/new") return { name: "admin-new" };
  if (clean.startsWith("/admin/manga/") && clean.endsWith("/edit")) {
    const slug = clean.slice("/admin/manga/".length, -"/edit".length);
    return { name: "admin-edit", slug };
  }
  return { name: "home" };
};

const nav = (to: string) => (window.location.hash = to);

/* -------------------- PAGE ACCUEIL -------------------- */
function Home({ library }: { library: Series[] }) {
  return (
    <div className="home">
      <header className="header">
        <h1>Kyy’s Letters</h1>
        <nav>
          <a href="#/">Accueil</a>
          <a href="#/admin">Admin</a>
        </nav>
      </header>

      <main className="container">
        <section>
          <h2>Derniers mangas ajoutés</h2>
          <div className="grid">
            {library.length === 0 && (
              <p style={{ color: "#999" }}>Aucun manga ajouté pour le moment.</p>
            )}
            {library.map((serie) => (
              <div key={serie.id} className="card">
                <div className="cover">
                  {serie.cover ? (
                    <img src={serie.cover} alt={serie.title} />
                  ) : (
                    <div className="no-cover">Pas de cover</div>
                  )}
                </div>
                <div className="info">
                  <h3>{serie.title}</h3>
                  <p>{serie.chapters.length} chapitres</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Kyy’s Letters — Tous droits réservés</p>
      </footer>
    </div>
  );
}

/* -------------------- ADMIN DASHBOARD -------------------- */
function AdminDashboard({
  library,
  onDelete,
}: {
  library: Series[];
  onDelete: (slug: string) => void;
}) {
  return (
    <div className="admin">
      <header className="header">
        <h1>Panel d’administration</h1>
        <nav>
          <a href="#/">Accueil</a>
          <button onClick={() => nav("/admin/manga/new")}>+ Nouveau Manga</button>
        </nav>
      </header>

      <main className="container">
        <h2>Liste des séries</h2>
        {library.length === 0 && <p>Aucune série ajoutée.</p>}
        {library.map((s) => (
          <div key={s.slug} className="admin-card">
            <div className="cover-mini">
              {s.cover ? <img src={s.cover} alt={s.title} /> : "—"}
            </div>
            <div className="details">
              <strong>{s.title}</strong>
              <p>{s.chapters.length} chapitres</p>
            </div>
            <div className="actions">
              <button onClick={() => nav(`/admin/manga/${s.slug}/edit`)}>Modifier</button>
              <button onClick={() => onDelete(s.slug)} className="danger">
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

/* -------------------- ADMIN ADD -------------------- */
function AdminAdd({ onCreate }: { onCreate: (s: Series) => void }) {
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState<string | undefined>(undefined);

  const handleCoverUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCover(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCreate = () => {
    if (!title.trim()) return;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newSerie: Series = {
      id: crypto.randomUUID(),
      title,
      slug,
      cover,
      chapters: [],
    };
    onCreate(newSerie);
    nav("/admin");
  };

  return (
    <div className="admin">
      <header className="header">
        <h1>Ajouter un manga</h1>
        <nav>
          <a href="#/admin">Retour</a>
        </nav>
      </header>

      <main className="container">
        <div className="form">
          <label>Titre du manga :</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />

          <label>Image de couverture :</label>
          <input type="file" accept="image/*" onChange={handleCoverUpload} />

          {cover && (
            <div className="preview">
              <img src={cover} alt="preview" />
            </div>
          )}

          <button onClick={handleCreate}>Créer</button>
        </div>
      </main>
    </div>
  );
}

/* -------------------- ADMIN EDIT -------------------- */
function AdminEdit({
  library,
  slug,
  onSave,
  onAddChapter,
  onDelete,
}: {
  library: Series[];
  slug: string;
  onSave: (slug: string, serie: Series) => void;
  onAddChapter: (slug: string, chapter: Chapter) => void;
  onDelete: (slug: string) => void;
}) {
  const serie = library.find((s) => s.slug === slug);
  const [title, setTitle] = useState(serie?.title || "");

  if (!serie) return <p style={{ padding: 20 }}>Série introuvable.</p>;

  const handleSave = () => {
    const updated = { ...serie, title };
    onSave(slug, updated);
    nav("/admin");
  };

  const handleAddChapter = () => {
    const newChap: Chapter = {
      id: crypto.randomUUID(),
      title: `Chapitre ${serie.chapters.length + 1}`,
      number: serie.chapters.length + 1,
      date: new Date().toISOString(),
    };
    onAddChapter(slug, newChap);
  };

  return (
    <div className="admin">
      <header className="header">
        <h1>Modifier : {serie.title}</h1>
        <nav>
          <a href="#/admin">Retour</a>
        </nav>
      </header>

      <main className="container">
        <label>Titre :</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />

        <div className="buttons">
          <button onClick={handleSave}>💾 Sauvegarder</button>
          <button onClick={handleAddChapter}>+ Ajouter un chapitre</button>
          <button onClick={() => onDelete(slug)} className="danger">
            🗑 Supprimer
          </button>
        </div>

        <h3>Chapitres :</h3>
        <ul>
          {serie.chapters.map((ch) => (
            <li key={ch.id}>
              {ch.title} — {new Date(ch.date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

/* -------------------- APP PRINCIPAL -------------------- */
export default function App() {
  const [route, setRoute] = useState<Route>(parseRoute(window.location.hash));
  const [library, setLibrary] = useState<Series[]>(() => loadLibrary());

  useEffect(() => {
    const handleRouteChange = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener("hashchange", handleRouteChange);
    handleRouteChange();
    return () => window.removeEventListener("hashchange", handleRouteChange);
  }, []);

  const createSeries = (serie: Series) => {
    const updated = [...library, serie];
    setLibrary(updated);
    saveLibrary(updated);
  };

  const updateSeries = (slug: string, serie: Series) => {
    const updated = library.map((s) => (s.slug === slug ? serie : s));
    setLibrary(updated);
    saveLibrary(updated);
  };

  const addChapter = (slug: string, chapter: Chapter) => {
    const updated = library.map((s) =>
      s.slug === slug ? { ...s, chapters: [...s.chapters, chapter] } : s
    );
    setLibrary(updated);
    saveLibrary(updated);
  };

  const deleteSeries = (slug: string) => {
    const updated = library.filter((s) => s.slug !== slug);
    setLibrary(updated);
    saveLibrary(updated);
  };

  return (
    <>
      {route.name === "home" && <Home library={library} />}
      {route.name === "admin" && (
        <AdminDashboard library={library} onDelete={deleteSeries} />
      )}
      {route.name === "admin-new" && <AdminAdd onCreate={createSeries} />}
      {route.name === "admin-edit" && route.slug && (
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
