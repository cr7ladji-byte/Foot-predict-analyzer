
const $=id=>document.getElementById(id);

function rows(id, arr){
  $(id).innerHTML=arr.map(([n,v])=>`<div class="row"><div class="top"><span>${n}</span><b>${v}%</b></div><div class="bar"><div class="fill" style="width:${Math.min(v,100)}%"></div></div></div>`).join("");
}

$("readBtn").onclick=async()=>{
  const f=$("file").files[0];
  if(!f){alert("Choisissez une capture.");return;}
  const fd=new FormData();fd.append("screenshot",f);
  $("ocrBox").classList.remove("hidden");$("ocrBox").textContent="Lecture de la capture…";
  const r=await fetch("/api/read-capture",{method:"POST",body:fd});
  const d=await r.json();
  $("ocrBox").textContent=d.ocr_text ? `Texte détecté :\n${d.ocr_text}` : "OCR non activé ou aucun texte détecté. Confirmez les équipes manuellement.";
};

$("form").onsubmit=async(e)=>{
  e.preventDefault();
  $("loading").classList.remove("hidden");$("report").classList.add("hidden");
  const fd=new FormData();
  fd.append("home",$("home").value);fd.append("away",$("away").value);fd.append("competition",$("competition").value);
  try{
    const r=await fetch("/api/analyze",{method:"POST",body:fd});const d=await r.json();const a=d.analysis;
    $("compOut").textContent=d.match.competition;
    $("matchOut").textContent=`${d.match.home}  VS  ${d.match.away}`;
    $("confidence").textContent=a.confidence+"%";
    rows("result",[[`Victoire ${d.match.home}`,a.result.home_win],["Match nul",a.result.draw],[`Victoire ${d.match.away}`,a.result.away_win]]);
    rows("goals",[["Plus de 1,5",a.goals.over_1_5],["Plus de 2,5",a.goals.over_2_5],["Moins de 3,5",a.goals.under_3_5],["BTTS Oui",a.goals.btts_yes]]);
    rows("corners",[["Plus de 7,5",a.corners.over_7_5],["Plus de 8,5",a.corners.over_8_5],["Plus de 9,5",a.corners.over_9_5]]);
    $("scores").innerHTML=a.exact_scores.map((x,i)=>`<div class="score"><span>#${i+1} — <b>${x.score}</b></span><b>${x.probability}%</b></div>`).join("");
    $("expected").innerHTML=`<span class="pill">Buts ${d.match.home}: ${a.expected.home_goals}</span><span class="pill">Buts ${d.match.away}: ${a.expected.away_goals}</span><span class="pill">Total buts: ${a.expected.total_goals}</span><span class="pill">Corners: ${a.expected.total_corners}</span>`;
    $("sources").innerHTML=d.sources.map(x=>`<div class="source"><b>${x.name}</b><br><small>${x.status}</small></div>`).join("");
    $("disclaimer").textContent=d.disclaimer;
    $("report").classList.remove("hidden");$("report").scrollIntoView({behavior:"smooth"});
  }catch(err){alert("Erreur : "+err.message)}finally{$("loading").classList.add("hidden")}
};

$("historyBtn").onclick=async()=>{
 const r=await fetch("/api/history");const d=await r.json();
 $("history").innerHTML=d.length?d.map(x=>`<div class="source"><b>${x.match.home} vs ${x.match.away}</b> — ${x.match.competition}<br><small>${x.saved_at}</small></div>`).join(""):"Aucune analyse enregistrée.";
};


// PWA: installation Android / navigateur compatible
let deferredPrompt = null;
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  const btn = $("installBtn");
  if (btn) btn.classList.remove("hidden");
});

const installBtn = $("installBtn");
if (installBtn) {
  installBtn.onclick = async () => {
    if (!deferredPrompt) {
      alert("Pour installer l'application, utilisez le menu du navigateur puis « Installer l'application » ou « Ajouter à l'écran d'accueil ».");
      return;
    }
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.classList.add("hidden");
  };
}

window.addEventListener("appinstalled", () => {
  if (installBtn) installBtn.classList.add("hidden");
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/static/service-worker.js");
  });
}
