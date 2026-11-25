function renderAdminDashboard(){
  document.getElementById("astat-players").textContent = (state.players.length * 2630).toLocaleString("en-IN");
  document.getElementById("astat-active-players").textContent = (state.players.filter(p=>p.status==="Active"||p.status==="Verified").length * 2140).toLocaleString("en-IN");
  document.getElementById("astat-teams").textContent = (state.teams.length * 345).toLocaleString("en-IN");
  document.getElementById("astat-tournaments").textContent = state.tournaments.length;
  document.getElementById("astat-active-tourneys").textContent = state.tournaments.filter(t=>t.status==="live"||t.status==="open").length;
  document.getElementById("astat-live-matches").textContent = state.matches.today.filter(m=>m.status==="live").length;
  document.getElementById("badgeLiveMatches").textContent = state.matches.today.filter(m=>m.status==="live").length;
  
  const pendingRegs = state.registrations.filter(r=>r.status==="pending").length;
  document.getElementById("astat-pending-regs").textContent = pendingRegs;
  document.getElementById("badgePendingRegs").textContent = pendingRegs;
  
  const openReports = state.reports.filter(r=>r.status==="Open").length;
  document.getElementById("astat-reports").textContent = openReports;
  document.getElementById("badgeReportsCount").textContent = openReports;

  document.getElementById("badgePlayerCount").textContent = state.players.length;
  document.getElementById("badgeTeamCount").textContent = state.teams.length;
  document.getElementById("badgeTourneyCount").textContent = state.tournaments.length;

  document.getElementById("dashLiveTourneyBody").innerHTML = state.tournaments.slice(0,4).map(t=>`
    <tr>
      <td><b>${t.name}</b></td><td>${t.game}</td><td>${t.type}</td>
      <td><span class="badge ${badgeInfo(t.status).cls}">${t.status}</span></td>
      <td><button class="btn btn-secondary btn-xs" onclick="openTournament(${t.id})">Inspect</button></td>
    </tr>`).join("");

  renderDashAuditStream();
  lucide.createIcons();
}

function renderDashAuditStream(){
  document.getElementById("dashAuditStream").innerHTML = state.auditLogs.slice(0,5).map(l=>`
    <div class="event-item">
      <b style="color:var(--accent)">${l.action}</b>
      <span>${l.target} — ${l.details} <i style="color:var(--text-faint)">(${l.time})</i></span>
    </div>`).join("");
}

/* 1. Players */
