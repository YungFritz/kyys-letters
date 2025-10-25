import { list } from "@vercel/blob";

export const config = { runtime: "edge" };

export default async function handler() {
  try {
    const token = process.env.KYYS_BLOB_READ_WRITE_TOKEN!;
    const { blobs } = await list({ prefix: "series/", token });

    return new Response(JSON.stringify({
      ok: true,
      items: blobs.map(b => ({
        key: b.pathname,
        url: b.url,
        size: b.size,
        uploadedAt: b.uploadedAt
      }))
    }), {
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
