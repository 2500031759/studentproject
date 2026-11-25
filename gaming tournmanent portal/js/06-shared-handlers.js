/* ======================================================================
   CREATE TOURNAMENT SHARED HANDLER
====================================================================== */
const heroCreateBtn = document.getElementById("heroCreateBtn");
const closeCreateBtn = document.getElementById("closeCreateBtn");
if(heroCreateBtn) heroCreateBtn.addEventListener("click", ()=>openOverlay("createOverlay"));
if(closeCreateBtn) closeCreateBtn.addEventListener("click", ()=>closeOverlay("createOverlay"));
document.getElementById("createTourneyForm").addEventListener("submit", e=>{
  e.preventDefault();
  const name = document.getElementById("ctName").value.trim();
  const prize = parseInt(document.getElementById("ctPrize").value,10)||0;
  const newT = {
    id: state.tournaments.length+1, name: name, game: document.getElementById("ctGame").value,
    code: shortCode(name), platform: "PC", type: document.getElementById("ctType").value,
    status: "upcoming", prize: prize, teams: parseInt(document.getElementById("ctTeams").value,10)||16,
    start: document.getElementById("ctDate").value || "2026-10-01", location: document.getElementById("ctLocation").value,
    organizer: state.isAdmin ? "Arena Elite Admin" : "You", fee: "free", desc: "Newly created tournament."
  };
  state.tournaments.unshift(newT);
  if(!saveTournaments()){
    state.tournaments.shift();
    return;
  }
  logAudit("CREATE", "Tournament: "+name, "Prize pool: "+money(prize));
  renderHomeGrid("all"); renderDiscovery();
  if(state.isAdmin){ renderAdminTournaments(); renderAdminDashboard(); }
  closeOverlay("createOverlay"); e.target.reset(); toast('"'+name+'" published!',"success");
  if(state.isAdmin){
    switchView("admin");
    triggerAdminPanel("tournaments");
  }else{
    switchView("discovery");
  }
});

const uploadLogoBtn = document.getElementById("uploadLogoBtn");
const logoFileInput = document.getElementById("logoFileInput");
const teamCrest = document.getElementById("teamCrest");

if(uploadLogoBtn && logoFileInput && teamCrest){
  uploadLogoBtn.addEventListener("click", ()=>logoFileInput.click());
  logoFileInput.addEventListener("change", e=>{
  const file = e.target.files[0];
  if(!file) return;
  if(!file.type.startsWith("image/")){
    toast("Please choose an image file.","error");
    e.target.value = "";
    return;
  }
  if(file.size > 5 * 1024 * 1024){
    toast("Logo must be smaller than 5 MB.","error");
    e.target.value = "";
    return;
  }
  const reader = new FileReader();
  reader.addEventListener("load", ()=>{
    teamCrest.textContent = "";
    teamCrest.style.backgroundImage = `url(${reader.result})`;
    teamCrest.style.backgroundSize = "cover";
    teamCrest.style.backgroundPosition = "center";
    teamCrest.style.color = "transparent";
    toast("Team logo uploaded.","success");
  });
  reader.readAsDataURL(file);
  });
}
