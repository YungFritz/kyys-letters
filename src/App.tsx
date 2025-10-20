import React, { useEffect, useMemo, useRef, useState } from "react";

/* ==========================================================
   Kyy's letters — Site de scan sombre
   Auteur : Chris (Team Kyy)
   Stack : React + Tailwind (Vite)
   ========================================================== */

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
        pages: Array.from({ length: 10 }).map(
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
    description:
      "Série factice pour test. Ajoutez vos chapitres et pages.",
    chapters: [
      {
        id: "kyy-002-c01",
        name: "Chapitre 1",
        number: 1,
        lang: "FR",
        releaseDate: "2025-10-10",
        pages: Array.from({ length: 16 }).map(
          (_, i) => `https://picsum.photos/seed/kansuke-c1-${i + 1}/1200/1800`
        ),
      },
      {
        id: "kyy-002-c02",
        name: "Chapitre 2",
        number: 2,
        lang: "FR",
        releaseDate: "2025-10-19",
        pages: Array.from({ length: 14 }).map(
          (_, i) => `https://picsum.photos/seed/kansuke-c2-${i + 1}/1200/1800`
        ),
      },
    ],
  },
];

const cls = (...arr: (string | false | undefined)[]) =>
  arr.filter(Boolean).join(" ");
const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

function TopBar({ onNavigateHome }: { onNavigateHome: () => void }) {
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur border-b border-zinc-800">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
        <button
          onClick={onNavigateHome}
          className="shrink-0 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-zinc-200 hover:bg-zinc-800"
        >
          ← Accueil
        </button>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100">
          Kyy's letters
        </h1>
        <div className="ml-auto text-xs text-zinc-400">
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
    <div className="relative">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Rechercher une série, un tag, une langue..."
        className="w-full rounded-2xl bg-zinc-900 border border-zinc-800 px-4 py-3 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
        ⌘K
      </span>
    </div>
  );
}

function SeriesCard({
  series,
  onOpen,
}: {
  series: Series;
  onOpen: (s: Series) => void;
}) {
  const totalCh = series.chapters.length;
  const latest = series.chapters.reduce((a, b) =>
    a.releaseDate > b.releaseDate ? a : b
  );
  return (
    <button
      onClick={() => onOpen(series)}
      className="text-left rounded-2xl border border-zinc-800 bg-zinc-925 hover:bg-zinc-900 overflow-hidden group"
    >
      <div className="aspect-[2/3] w-full overflow-hidden">
        <img
          src={series.cover}
          alt={series.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
