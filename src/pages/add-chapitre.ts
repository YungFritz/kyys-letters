import { addChapter, fileToDataUrl, loadLibrary } from "../lib/storage";

const select = document.getElementById("series-select") as HTMLSelectElement;
const form = document.getElementById("chap-form") as HTMLFormElement;
const msg = document.getElementById("msg")!;

// Remplir la liste des séries
const lib = loadLibrary();
if (lib.length === 0) {
  select.innerHTML = `<option value="">( aucune série — va d'abord en créer une )</option>`;
  select.disabled = true;
} else {
  select.innerHTML = lib.map((s) => `<option value="${s.id}">${s.title}</option>`).join("");
}

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "Enregistrement…";
  const fd = new FormData(form);

  const seriesId = String(fd.get("series") || select.value);
  const number = Number(fd.get("number") || 0);
  const name = String(fd.get("name") || "");
  const lang = String(fd.get("lang") || "FR");
  const files = (fd.getAll("pages") as File[]).filter((f) => f && f.size > 0);

  if (!seriesId) {
    msg.textContent = "Sélectionne une série.";
    return;
  }
  if (!number) {
    msg.textContent = "Numéro de chapitre invalide.";
    return;
  }
  if (files.length === 0) {
    msg.textContent = "Ajoute au moins une image de page.";
    return;
  }

  // convertit toutes les pages en dataURL
  const pages: string[] = [];
  for (const f of files) {
    const data = await fileToDataUrl(f);
    pages.push(data);
  }

  addChapter(seriesId, { number, name, lang, pages });
  msg.textContent = "✅ Chapitre enregistré ! Redirection…";
  setTimeout(() => (window.location.href = "/admin.html"), 600);
});

// pour le select "name=series"
select.name = "series";
