import type { Series, Chapter } from "./types";

export const STORAGE_KEY = "kyys.library";

export function loadLibrary(): Series[] {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? (JSON.parse(s) as Series[]) : [];
  } catch {
    return [];
  }
}

export function saveLibrary(arr: Series[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  // notifie les autres onglets
  window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY, newValue: JSON.stringify(arr) }));
}

export function nextId(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function slugify(t: string) {
  return t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function addSeries(partial: Omit<Series, "id" | "chapters" | "slug"> & { slug?: string }) {
  const lib = loadLibrary();
  const exists = lib.some((s) => s.title.trim().toLowerCase() === partial.title.trim().toLowerCase());
  const slug = partial.slug ? slugify(partial.slug) : slugify(partial.title);
  const s: Series = {
    id: nextId("serie"),
    title: partial.title.trim(),
    slug,
    tags: partial.tags ?? [],
    cover: partial.cover,
    description: partial.description,
    views: partial.views ?? 0,
    hot: !!partial.hot,
    chapters: [],
  };
  if (exists) {
    // autorisé mais on change un peu le slug
    s.slug = `${s.slug}-${Math.random().toString(36).slice(2, 4)}`;
  }
  lib.push(s);
  saveLibrary(lib);
  return s.id;
}

export function addChapter(seriesId: string, chap: Omit<Chapter, "id" | "releaseDate"> & { releaseDate?: string }) {
  const lib = loadLibrary();
  const s = lib.find((x) => x.id === seriesId);
  if (!s) throw new Error("Série introuvable");
  const c: Chapter = {
    id: nextId("chap"),
    name: chap.name ?? "",
    number: Number(chap.number ?? 0) || 0,
    lang: chap.lang || "FR",
    releaseDate: chap.releaseDate || new Date().toISOString().slice(0, 10),
    pages: chap.pages ?? [],
  };
  s.chapters.push(c);
  // tri par numéro
  s.chapters.sort((a, b) => a.number - b.number);
  saveLibrary(lib);
  return c.id;
}

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}
