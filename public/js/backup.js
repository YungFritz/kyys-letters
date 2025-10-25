/* public/js/backup.js
   Export / Import JSON (series, chapters, members)
*/
(function(){
  const expBtn = document.getElementById("kl-exp");
  const openImpBtn = document.getElementById("kl-imp-open");
  const impInput = document.getElementById("kl-imp");

  if (expBtn) expBtn.onclick = ()=>{
    const dump = {
      series: KyyStore.allSeries(),
      chapters: KyyStore.allChapters(),
      members: KyyStore.allMembers()
    };
    const blob = new Blob([JSON.stringify(dump,null,2)], {type:"application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `kyys-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
  };

  if (openImpBtn) openImpBtn.onclick = ()=> impInput.click();

  if (impInput) impInput.onchange = async (e)=>{
    const file = e.target.files?.[0];
    if (!file) return;
    const json = JSON.parse(await file.text());
    if (json.series) KyyStore.saveSeries(json.series);
    if (json.chapters) KyyStore.saveChapters(json.chapters);
    if (json.members) KyyStore.saveMembers(json.members);
    alert("Import terminé"); location.reload();
  };
})();
