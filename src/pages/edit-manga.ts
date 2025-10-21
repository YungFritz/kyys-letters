// src/pages/edit-manga.ts

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

const STORAGE_KEY = "series";

// ---------- utils localStorage ----------
function loadSeries(): Series[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Series[]) : [];
  } catch {
    return [];
  }
}

function saveSeries(list: Series[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function slugify(v: string) {
  return v
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function getParam(name: string) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function goBack() {
  if (window.history.length > 1) window.history.back();
  else window.location.href = "/";
}

// ---------- DOM ----------
document.addEventListener("DOMContentLoaded", () => {
  // éléments
  const form = document.getElementById("edit-manga-form") as HTMLFormElement;
  const titleInput = document.getElementById("title") as HTMLInputElement;
  const slugInput = document.getElementById("slug") as HTMLInputElement;
  const tagsInput = document.getElementById("tags") as HTMLInputElement;
  const coverInput = document.getElementById("cover") as HTMLInputElement;
  const descInput = document.getElementById("description") as HTMLTextAreaElement;
  const backBtn = document.getElementById("back-btn") as HTMLButtonElement;

  const series = loadSeries();
  const editingId = getParam("id"); // ?id=xxx si on édite

  // Préremplir si édition
  if (editingId) {
    const s = series.find((x) => x.id === editingId);
    if (s) {
      titleInput.value = s.title ?? "";
      slugInput.value = s.slug ?? "";
      tagsInput.value = (s.tags ?? []).join(", ");
      coverInput.value = s.cover ?? "";
      descInput.value = s.description ?? "";
    }
  }

  // Génération de slug auto si vide
  titleInput.addEventListener("input", () => {
    if (!slugInput.value.trim()) slugInput.value = slugify(titleInput.value);
  });

  // Bouton retour
  backBtn.addEventListener("click", (e) => {
    e.preventDefault();
    goBack();
  });

  // Submit = créer / mettre à jour
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const slug = (slugInput.value.trim() || slugify(title)).toLowerCase();
    const tags = tagsInput.value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const cover = coverInput.value.trim();
    const description = descInput.value.trim();

    if (!title) {
      alert("Le titre est obligatoire.");
      return;
    }

    if (editingId) {
      // update
      const idx = series.findIndex((x) => x.id === editingId);
      if (idx !== -1) {
        series[idx] = {
          ...series[idx],
          title,
          slug,
          tags,
          cover,
          description,
        };
      }
    } else {
      // create
      const newItem: Series = {
        id: crypto.randomUUID(),
        title,
        slug,
        tags,
        cover,
        description,
        chapters: [],
        views: 0,
      };
      series.unshift(newItem);
    }

    saveSeries(series);
    alert("Enregistré !");
    goBack();
  });
});
