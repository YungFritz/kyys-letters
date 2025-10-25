export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  if (!key) return new Response("Missing key", { status: 400 });

  const base = process.env.KYYS_BLOB_URL?.replace(/\/+$/, "") || "";
  const url = `${base}/${key}`;

  const r = await fetch(url);
  if (!r.ok) return new Response("Not found", { status: 404 });
  const json = await r.text();
  return new Response(json, { status: 200, headers: { "content-type": "application/json" } });
}
