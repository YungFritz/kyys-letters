import { loadLibrary, saveLibrary, fileToDataUrl } from "../lib/storage";
import type { Series } from "../lib/types";

const list = document.getElementById("list")!;
const tpl = document.getElementById("card-tpl") as HTMLTemplateElement;

function render() {
  const lib = loadLibrary();
  list.innerHTML = "";
  if (lib.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "Aucune série dans la bibliothèque.";
    list.appendChild(empty);
    return;
  }

  for (const s of lib) {
    const node = tpl.content.cloneNode(true) as DocumentFragment;
    const el = node.querySelector(".card") as HTMLElement;
    const cover = node.querySelector(".card-cover") as HTMLElement;
    const title = node.querySelector(".card-title") as HTMLElement;
    const tags = node.querySelector(".series-tags") as HTMLElement;
    const chap = node.querySelector(".series-chap") as HTMLElement;
    const btnEdit = node.querySelector(".btn-edit") as HTMLButtonElement;
    const btnDel = node.querySelector(".btn-del") as HTMLButtonElement;

    if (s.cover) {
      cover.innerHTML = `<img src="${s.cover}" alt="${s.title}" />`;
    } else {
      cover.textContent = "COVER";
    }
    title.textContent = s.title;
    tags.textContent = s.tags.join(" • ") || "—";
    chap.textContent = `${s.chapters.length} chapitres`;

    btnDel.addEventListener("click", () => onDelete(s.id));
    btnEdit.addEventListener("click", () => onEdit(s));

    list.appendChild(node);
  }
}

async function onEdit(s: Series) {
  const newTitle = prompt("Nouveau titre :", s.title)?.trim();
  if (!newTitle) return;
  const newTags = prompt("Tags (séparés par des virgules) :", s.tags.join(", ")) ?? "";
  const lib = loadLibrary();
  const idx = lib.findIndex((x) => x.id === s.id);
  if (idx < 0) return;

  lib[idx].title = newTitle;
  lib[idx].tags = newTags.split(",").map((t) => t.trim()).filter(Boolean);

  if (confirm("Changer la cover ?")) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();
    input.onchange = async () => {
      const f = input.files?.[0];
      if (f) lib[idx].cover = await fileToDataUrl(f);
      saveLibrary(lib);
      render();
    };
  } else {
    saveLibrary(lib);
    render();
  }
}

function onDelete(id: string) {
  if (!confirm("Supprimer cette série et tous ses chapitres ?")) return;
  const lib = loadLibrary().filter((s) => s.id !== id);
  saveLibrary(lib);
  render();
}

render();
