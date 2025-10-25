// public/js/api.js

export async function apiSaveSeries(slug, data) {
  const r = await fetch("/api/series/save", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ slug, data, access: "public" })
  });
  const j = await r.json();
  if (!r.ok || !j.ok) throw new Error(j.error || "save failed");
  return j; // { ok, key, url }
}

export async function apiListSeries() {
  const r = await fetch("/api/series/list");
  const j = await r.json();
  if (!r.ok || !j.ok) throw new Error(j.error || "list failed");
  return j.items; // [{key,url,...}]
}

export async function apiReadSeries(keyOrSlug) {
  const key = keyOrSlug.endsWith(".json") ? keyOrSlug : `series/${keyOrSlug}.json`;
  const r = await fetch(`/api/series/read?key=${encodeURIComponent(key)}`);
  if (!r.ok) return null;
  return r.json();
}

export async function apiDeleteSeries(slug) {
  const r = await fetch("/api/series/delete", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ slug })
  });
  const j = await r.json();
  if (!r.ok || !j.ok) throw new Error(j.error || "delete failed");
  return true;
}
