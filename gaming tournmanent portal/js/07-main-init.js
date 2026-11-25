/* ======================================================================
   INIT
====================================================================== */
function init(){
  renderHomeGrid("all");
  renderDiscovery();
  renderHomeLeaderboard();
  renderFullLeaderboard();
  renderRoster();
  renderMatchesView("today");
  renderCommunity("all");
  renderOrgDashboard();
  lucide.createIcons();
  animateCounters();
  if(new URLSearchParams(window.location.search).get("view")==="admin") switchView("admin");
}
init();

