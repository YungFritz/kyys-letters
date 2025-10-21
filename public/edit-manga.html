<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Modifier un manga — Kyy’s Letters</title>
<style>
  :root{--bg:#0b0b0d;--panel:#101116;--stroke:#1b1c22;--text:#e5e7eb;--muted:#9aa0a6;--accent:#9ef9b3;}
  body{margin:0;background:var(--bg);color:var(--text);font-family:Inter,system-ui,Segoe UI,Roboto,Ubuntu,Helvetica,Arial}
  .header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--stroke);background:#0d0e12}
  .container{padding:16px;max-width:820px;margin:0 auto}
  .label{margin:12px 0 6px;color:var(--muted)}
  input[type="text"]{width:100%;background:#11131a;border:1px solid var(--stroke);border-radius:10px;padding:10px;color:var(--text)}
  input[type="file"]{color:var(--muted)}
  .btn{color:#a7f3d0;font-weight:600;border:1px solid #2b4c18;background:#0c1409;padding:8px 14px;border-radius:10px;text-decoration:none;cursor:pointer}
  .btn:hover{background:#18361c}
  .danger{border:1px solid #7f1d1d;background:#1a0b0b;color:#fca5a5;padding:8px 14px;border-radius:10px;cursor:pointer}
  .preview{margin-top:10px;border:1px solid var(--stroke);border-radius:12px;overflow:hidden;background:#12131a}
  .preview img{display:block;width:100%;height:auto}
  ul{list-style:none;padding:0;margin:0}
  li{border:1px solid var(--stroke);background:var(--panel);border-radius:12px;padding:10px;margin-top:8px;display:flex;justify-content:space-between;align-items:center}
  .footer{padding:14px 16px;border-top:1px solid var(--stroke);color:var(--muted);background:#0b0c10;margin-top:20px}
</style>
</head>
<body>
  <div class="header">
    <div>Modifier un manga</div>
    <div style="display:flex;gap:10px">
      <a class="btn" href="#/admin" onclick="parent.location.hash='#/admin'">← Retour admin</a>
    </div>
  </div>

  <div class="container">
    <div id="notfound" style="display:none;color:#fca5a5;border:1px solid #7f1d1d;background:#1a0b0b;padding:12px;border-radius:10px">Série introuvable.</div>

    <div id="editor" style="display:none">
      <label class="label">Titre</label>
      <input id="title" type="text"/>

      <label class="label">Cover (image)</label>
      <input id="file" type="file" accept="image/*"/>
      <div id="preview" class="preview" style="display:none"></div>

      <div style="display:flex;gap:10px;margin-top:14px">
        <button class="btn" onclick="saveSerie()">💾 Sauvegarder</button>
        <button class="danger" onclick="deleteSerie()">🗑 Supprimer la série</button>
        <button class="btn" onclick="addChapter()">+ Ajouter un chapitre</button>
      </div>

      <h3 style="margin-top:18px">Chapitres</h3>
      <ul id="chapters"></ul>
    </div>
  </div>

  <div class="footer">© <span id="year"></span> — Kyy’s Letters</div>

<script>
const STORAGE_KEY="kyys_letters_library_v2";
const EDIT_KEY="kyys_edit_slug";
document.getElementById("year").textContent = new Date().getFullYear();

let current=null; // série en édition
let coverData=null;

function load(){ try{const raw=localStorage.getItem(STORAGE_KEY);return raw?JSON.parse(raw):[]}catch{return[]} }
function save(lib){ localStorage.setItem(STORAGE_KEY, JSON.stringify(lib)); }
function getSlug(){
  const s=localStorage.getItem(EDIT_KEY);
  return s||null;
}

function hydrate(){
  const slug=getSlug();
  const lib=load();
  current = lib.find(x=>x.slug===slug) || null;

  const nf=document.getElementById("notfound");
  const ed=document.getElementById("editor");
  if(!current){ nf.style.display="block"; ed.style.display="none"; return; }
  nf.style.display="none"; ed.style.display="block";

  document.getElementById("title").value = current.title;
  const pv=document.getElementById("preview");
  if(current.cover){ pv.style.display="block"; pv.innerHTML=`<img src="${current.cover}" alt="cover"/>`; } else { pv.style.display="none"; pv.innerHTML=""; }
  renderChapters();
}

document.getElementById("file").addEventListener("change", e=>{
  const f=e.target.files?.[0]; if(!f) return;
  const rd=new FileReader();
  rd.onload=()=>{
    coverData=rd.result;
    const pv=document.getElementById("preview");
    pv.style.display="block";
    pv.innerHTML=`<img src="${coverData}" alt="cover"/>`;
  };
  rd.readAsDataURL(f);
});

function saveSerie(){
  if(!current) return;
  const lib=load();
  const idx=lib.findIndex(x=>x.slug===current.slug);
  if(idx<0) return;
  const newTitle = (document.getElementById("title").value||"").trim();
  if(!newTitle){ alert("Titre vide."); return; }
  // slug immuable pour simplicité; si tu veux le régénérer: slugify(newTitle)
  lib[idx] = { ...current, title:newTitle, cover: coverData || current.cover };
  save(lib);
  alert("Sauvegardé.");
  hydrate();
}

function deleteSerie(){
  if(!current) return;
  if(!confirm("Supprimer définitivement cette série ?")) return;
  const lib=load().filter(x=>x.slug!==current.slug);
  save(lib);
  parent.location.hash="#/admin";
}

function addChapter(){
  if(!current) return;
  const lib=load();
  const idx=lib.findIndex(x=>x.slug===current.slug);
  if(idx<0) return;
  const nextNum = (lib[idx].chapters?.length || 0) + 1;
  const ch = {
    id: crypto.randomUUID(),
    title: `Chapitre ${nextNum}`,
    number: nextNum,
    date: new Date().toISOString()
  };
  lib[idx].chapters = [...(lib[idx].chapters||[]), ch];
  save(lib);
  hydrate();
}

function renderChapters(){
  const ul=document.getElementById("chapters");
  ul.innerHTML="";
  (current.chapters||[]).slice().sort((a,b)=>a.number-b.number).forEach(c=>{
    const li=document.createElement("li");
    li.innerHTML=`<div><strong>${c.title}</strong> — <span style="color:#9aa0a6">${new Date(c.date).toLocaleDateString()}</span></div>
      <div style="display:flex;gap:8px">
        <button class="danger" onclick="deleteChapter('${c.id}')">Supprimer</button>
      </div>`;
    ul.appendChild(li);
  });
}

function deleteChapter(id){
  if(!current) return;
  if(!confirm("Supprimer ce chapitre ?")) return;
  const lib=load();
  const idx=lib.findIndex(x=>x.slug===current.slug);
  if(idx<0) return;
  lib[idx].chapters = (lib[idx].chapters||[]).filter(c=>c.id!==id);
  save(lib);
  hydrate();
}

hydrate();
</script>
</body>
</html>
