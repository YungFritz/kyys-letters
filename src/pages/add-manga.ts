import { addSeries, fileToDataUrl } from "../lib/storage";

const form = document.getElementById("add-form") as HTMLFormElement;
const msg = document.getElementById("msg")!;

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "Enregistrement…";

  const fd = new FormData(form);
  const title = String(fd.get("title") || "").trim();
  const tagsRaw = String(fd.get("tags") || "");
  const description = String(fd.get("description") || "").trim();
  const coverFile = (fd.get("cover") as File) || null;

  if (!title) {
    msg.textContent = "Titre requis.";
    return;
  }

  let cover: string | undefined = undefined;
  if (coverFile && coverFile.size > 0) {
    cover = await fileToDataUrl(coverFile);
  }

  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  addSeries({ title, tags, description, cover });
  msg.textContent = "✅ Série enregistrée ! Redirection…";
  setTimeout(() => (window.location.href = "/admin.html"), 600);
});
