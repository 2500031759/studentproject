document.getElementById("adminSettingsForm").addEventListener("submit", e=>{
  e.preventDefault();
  state.settings.orgName = document.getElementById("cfgOrgName").value.trim() || state.settings.orgName;
  state.settings.supportEmail = document.getElementById("cfgSupportEmail").value.trim() || state.settings.supportEmail;
  state.settings.disputeWindow = parseInt(document.getElementById("cfgDisputeWindow").value,10) || 30;
  state.settings.minRoster = parseInt(document.getElementById("cfgMinRoster").value,10) || 5;
  state.settings.require2fa = document.getElementById("cfgRequire2fa").checked;
  state.settings.ipBind = document.getElementById("cfgIpBind").checked;
  state.settings.autoFlagReports = document.getElementById("cfgAutoFlagReports").checked;
  state.settings.maintenanceMode = document.getElementById("cfgMaintMode").checked;
  logAudit("UPDATE", "Settings", "Updated global platform parameters");
  toast("Settings saved.","success");
});
document.getElementById("adminResetSettingsBtn").addEventListener("click", ()=>{
  state.settings = {
    orgName: "Arena Elite Esports Federation",
    supportEmail: "admin@arenaelite.gg",
    disputeWindow: 30,
    minRoster: 5,
    require2fa: true,
    ipBind: true,
    autoFlagReports: true,
    maintenanceMode: false
  };
  document.getElementById("cfgOrgName").value = state.settings.orgName;
  document.getElementById("cfgSupportEmail").value = state.settings.supportEmail;
  document.getElementById("cfgDisputeWindow").value = state.settings.disputeWindow;
  document.getElementById("cfgMinRoster").value = state.settings.minRoster;
  document.getElementById("cfgRequire2fa").checked = state.settings.require2fa;
  document.getElementById("cfgIpBind").checked = state.settings.ipBind;
  document.getElementById("cfgAutoFlagReports").checked = state.settings.autoFlagReports;
  document.getElementById("cfgMaintMode").checked = state.settings.maintenanceMode;
  toast("Settings restored to defaults.","info");
});

/* 13. Global Search */
function setupAdminGlobalSearch(){
  const input = document.getElementById("adminGlobalSearch");
  const drop = document.getElementById("adminSearchDropdown");
  input.addEventListener("input", e=>{
    const q = e.target.value.trim().toLowerCase();
    if(!q){ drop.style.display = "none"; return; }
    let html = "";
    state.players.filter(p=>p.name.toLowerCase().includes(q)).slice(0,2).forEach(p=>{ html += `<div class="roster-row" onclick="triggerAdminPanel('players')"><span>Player: <b>${p.name}</b> (@${p.username})</span></div>`; });
    state.tournaments.filter(t=>t.name.toLowerCase().includes(q)).slice(0,2).forEach(t=>{ html += `<div class="roster-row" onclick="triggerAdminPanel('tournaments')"><span>Tournament: <b>${t.name}</b></span></div>`; });
    drop.innerHTML = html || '<div style="padding:10px;color:var(--text-faint)">No entity found</div>';
    drop.style.display = "block";
  });
  document.addEventListener("click", e=>{ if(!input.contains(e.target)) drop.style.display = "none"; });
}

