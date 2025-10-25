import { del } from "@vercel/blob";

export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  if (req.method !== "POST" && req.method !== "DELETE")
    return new Response("Method Not Allowed", { status: 405 });

  try {
    const { slug } = await req.json();
    if (!slug) return new Response("Missing slug", { status: 400 });

    const token = process.env.KYYS_BLOB_READ_WRITE_TOKEN!;
    await del(`series/${slug}.json`, { token });

    return new Response(JSON.stringify({ ok: true }), {
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
