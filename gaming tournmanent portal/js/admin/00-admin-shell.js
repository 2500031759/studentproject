/* ======================================================================
   ADMIN OPERATIONS & 13 PANELS
====================================================================== */
let adminCharts = {};

function initAdminPortal(){
  renderAdminDashboard();
  renderAdminPlayers("all", "");
  renderAdminTeams("all", "", "all");
  renderAdminTournaments("all", "");
  renderAdminRegistrations("all");
  renderAdminMatches("all", "");
  renderAdminLeaderboard("");
  renderAdminCommunity("all");
  renderAdminReports("all", "all");
  renderAdminAnnouncements();
  renderAdminAuditLogs("all", "");
  setupAdminGlobalSearch();
  lucide.createIcons();
}

document.getElementById("adminSideNav").addEventListener("click", e=>{
  const item = e.target.closest(".admin-side-item"); if(!item) return;
  e.preventDefault();
  document.querySelectorAll(".admin-side-item").forEach(i=>i.classList.remove("active"));
  item.classList.add("active");
  const panelKey = item.dataset.adminpanel;
  document.querySelectorAll(".admin-panel").forEach(p=>p.style.display="none");
  const target = document.getElementById("adminp-"+panelKey);
  if(target){
    target.style.display="block";
    if(panelKey==="analytics") setTimeout(()=>renderAdminAnalytics("7d"), 50);
  }
  lucide.createIcons();
});

function triggerAdminPanel(key){
  document.querySelectorAll(".admin-side-item").forEach(i=>{
    i.classList.toggle("active", i.dataset.adminpanel===key);
  });
  document.querySelectorAll(".admin-panel").forEach(p=>p.style.display="none");
  const target = document.getElementById("adminp-"+key);
  if(target) target.style.display="block";
  if(key==="analytics") setTimeout(()=>renderAdminAnalytics("7d"), 50);
  lucide.createIcons();
}

document.getElementById("qaManagePlayers").addEventListener("click", ()=>triggerAdminPanel("players"));
document.getElementById("qaReviewRegs").addEventListener("click", ()=>triggerAdminPanel("registrations"));
document.getElementById("qaPublishAnnounce").addEventListener("click", ()=>triggerAdminPanel("announcements"));
document.getElementById("qaReviewReports").addEventListener("click", ()=>triggerAdminPanel("reports"));
document.getElementById("qaUpdateResults").addEventListener("click", ()=>triggerAdminPanel("matches"));

document.getElementById("dashViewAllTourneysBtn").addEventListener("click", ()=>triggerAdminPanel("tournaments"));
document.getElementById("dashViewAllAuditBtn").addEventListener("click", ()=>triggerAdminPanel("audit"));
document.getElementById("adminSyncDataBtn").addEventListener("click", ()=>{ renderAdminDashboard(); toast("Telemetry synchronized.","success"); });
