import React, { useState, useEffect } from "react";
import "./App.css";

// --- Types ---
export interface Chapter {
  id: string;
  title: string;
  number: number;
  date: string;
}

export interface Series {
  id: string;
  title: string;
  slug: string;
  altTitles?: string;
  synopsis?: string;
  authors?: string;
  artists?: string;
  genres?: string[];
  status?: "en-cours" | "terminer" | "drop";
  language?: string;
  tags?: string[];
  cover?: string;
  chapters?: Chapter[];
}

// --- Fonctions de stockage local ---
const STORAGE_KEY = "kyys_letters_library";

const load = (): Series[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const save = (library: Series[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
};

// --- Routes ---
type Route =
  | { name: "home" }
  | { name: "admin" }
  | { name: "admin-new" }
  | { name: "admin-edit"; slug: string };

// --- Pages (importées plus tard si tu veux séparer) ---
const Home = ({ library }: { library: Series[] }) => {
  return (
    <div className="home-page">
      <header className="header">
        <h1>Kyy’s letters</h1>
        <nav>
          <a href="#/">Accueil</a>
          <a href="#/admin">Admin</a>
        </nav>
      </header>

      <section className="library">
        <h2>Bibliothèque</h2>
        <div className="cards">
          {library.map((serie) => (
            <div key={serie.id} className="card">
              <img src={serie.cover || "/placeholder.jpg"} alt={serie.title} />
              <h3>{serie.title}</h3>
              <p>{serie.synopsis || "Aucun synopsis disponible."}</p>
            </div>
          ))}
        </div>
      </section>

      <footer>© 2025 Kyy’s letters — Privé (usage interne).</footer>
    </div>
  );
};

const AdminDashboard = ({
  library,
  onDelete,
}: {
  library: Series[];
  onDelete: (slug: string) => void;
}) => {
  return (
    <div className="admin-page">
      <header className="header">
        <h1>Panel d’administration</h1>
        <nav>
          <a href="#/">Accueil</a>
          <a href="#/admin/manga/new">+ Nouveau Manga</a>
        </nav>
      </header>

      <section>
        <h2>Liste des séries</h2>
        {library.length === 0 ? (
          <p>Aucune série enregistrée.</p>
        ) : (
          <ul>
            {library.map((serie) => (
              <li key={serie.slug}>
                <strong>{serie.title}</strong>
                <div className="actions">
                  <a href={`#/admin/manga/${serie.slug}/edit`}>Modifier</a>
                  <button onClick={() => onDelete(serie.slug)}>Supprimer</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

const AdminAdd = ({ onCreate }: { onCreate: (s: Series) => void }) => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newSerie: Series = {
      id: crypto.randomUUID(),
      title,
      slug: title.toLowerCase().replace(/\s+/g, "-"),
      chapters: [],
    };
    onCreate(newSerie);
    window.location.hash = "/admin";
  };

  return (
    <div className="admin-add">
      <h2>Ajouter un manga</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Titre du manga"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Créer</button>
      </form>
    </div>
  );
};

const AdminEdit = ({
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
}) => {
  const serie = library.find((s) => s.slug === slug);
  const [title, setTitle] = useState(serie?.title || "");

  if (!serie) return <p>Série introuvable.</p>;

  const handleSave = () => {
    const updated = { ...serie, title };
    onSave(slug, updated);
    window.location.hash = "/admin";
  };

  const handleAddChapter = () => {
    const newChap: Chapter = {
      id: crypto.randomUUID(),
      title: `Chapitre ${serie.chapters?.length || 1}`,
      number: (serie.chapters?.length || 0) + 1,
      date: new Date().toISOString(),
    };
    onAddChapter(slug, newChap);
  };

  return (
    <div className="admin-edit">
      <h2>Modifier : {serie.title}</h2>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <div className="buttons">
        <button onClick={handleSave}>💾 Sauvegarder</button>
        <button onClick={handleAddChapter}>+ Ajouter un chapitre</button>
        <button onClick={() => onDelete(slug)}>🗑 Supprimer</button>
      </div>

      <h3>Chapitres :</h3>
      <ul>
        {serie.chapters?.map((ch) => (
          <li key={ch.id}>
            {ch.title} — {new Date(ch.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- Routeur corrigé ---
const parseRoute = (hash: string): Route => {
  const clean = hash.replace(/^#/, "").trim();
  console.log("ROUTE:", clean); // debug

  if (clean === "/admin") {
    return { name: "admin" };
  }

  if (clean === "/admin/manga/new") {
    return { name: "admin-new" };
  }

  if (clean.startsWith("/admin/manga/") && clean.endsWith("/edit")) {
    const slug = clean.slice("/admin/manga/".length, -"/edit".length);
    return { name: "admin-edit", slug };
  }

  return { name: "home" };
};

// --- Composant principal ---
export default function App() {
  const [route, setRoute] = useState<Route>(parseRoute(window.location.hash));
  const [library, setLibrary] = useState<Series[]>(() => load());

  useEffect(() => {
    const handleRouteChange = () => {
      setRoute(parseRoute(window.location.hash));
    };
    window.addEventListener("hashchange", handleRouteChange);
    handleRouteChange();
    return () => window.removeEventListener("hashchange", handleRouteChange);
  }, []);

  // Fonctions de gestion
  const createSeries = (serie: Series) => {
    setLibrary((prev) => {
      const updated = [...prev, serie];
      save(updated);
      return updated;
    });
  };

  const updateSeries = (slug: string, updatedSerie: Series) => {
    setLibrary((prev) => {
      const updated = prev.map((s) => (s.slug === slug ? updatedSerie : s));
      save(updated);
      return updated;
    });
  };

  const addChapter = (slug: string, chapter: Chapter) => {
    setLibrary((prev) => {
      const updated = prev.map((s) =>
        s.slug === slug ? { ...s, chapters: [...(s.chapters || []), chapter] } : s
      );
      save(updated);
      return updated;
    });
  };

  const deleteSeries = (slug: string) => {
    setLibrary((prev) => {
      const updated = prev.filter((s) => s.slug !== slug);
      save(updated);
      return updated;
    });
  };

  // --- Affichage des pages ---
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
