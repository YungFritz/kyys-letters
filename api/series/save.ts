import { put } from "@vercel/blob";

export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  try {
    const { slug, data, access = "public" } = await req.json();
    if (!slug) return new Response("Missing slug", { status: 400 });

    const token = process.env.KYYS_BLOB_READ_WRITE_TOKEN!;
    const key = `series/${slug}.json`;

    const { url } = await put(key, JSON.stringify(data ?? {}, null, 2), {
      token,
      access,
      contentType: "application/json; charset=utf-8",
      addRandomSuffix: false
    });

    return new Response(JSON.stringify({ ok: true, key, url }), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message || String(e) }), {
      status: 500,
      headers: { "content-type": "application/json" }
    });
  }
}
