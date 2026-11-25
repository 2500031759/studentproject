function renderAdminTournaments(status = "all", q = ""){
  q = q.trim().toLowerCase();
  const list = state.tournaments.filter(t=>{
    if(status!=="all" && t.status!==status) return false;
    if(q && !t.name.toLowerCase().includes(q)) return false;
    return true;
  });
  document.getElementById("adminTourneyCountLabel").textContent = list.length + " tournaments";
  document.getElementById("adminTourneyTableBody").innerHTML = list.map(t=>`
    <tr>
      <td><b>${t.name}</b></td><td>${t.game}</td><td>${t.organizer}</td>
      <td><span class="badge ${badgeInfo(t.status).cls}">${t.status}</span></td>
      <td>${t.teams} slots</td><td style="color:var(--accent);font-weight:700">${money(t.prize)}</td><td>${formatDate(t.start)}</td>
      <td>
        <div class="table-actions">
          <button class="btn btn-secondary btn-xs" onclick="editTourneyModal(${t.id})">Edit</button>
          <button class="btn btn-danger-line btn-xs" onclick="toggleTourneyLive(${t.id})">${t.status==='live'?'End':'Go Live'}</button>
        </div>
      </td>
    </tr>`).join("");
}
function editTourneyModal(id){
  const t = state.tournaments.find(x=>x.id===id);
  document.getElementById("atId").value = t.id;
  document.getElementById("atName").value = t.name;
  document.getElementById("atGame").value = t.game;
  document.getElementById("atStatus").value = t.status;
  document.getElementById("atPrize").value = t.prize;
  document.getElementById("atTeams").value = t.teams;
  openOverlay("adminTourneyModal");
}
document.getElementById("adminTourneyCreateBtn").addEventListener("click",()=>{
  document.getElementById("createTourneyForm").reset();
  openOverlay("createOverlay");
});
document.getElementById("closeAdminTourneyModalBtn").addEventListener("click", ()=>closeOverlay("adminTourneyModal"));
document.getElementById("adminTourneyForm").addEventListener("submit", e=>{
  e.preventDefault();
  const id = parseInt(document.getElementById("atId").value,10);
  const t = state.tournaments.find(x=>x.id===id);
  const previous = {...t};
  t.name = document.getElementById("atName").value.trim();
  t.game = document.getElementById("atGame").value.trim();
  t.status = document.getElementById("atStatus").value;
  t.prize = parseInt(document.getElementById("atPrize").value,10)||0;
  t.teams = parseInt(document.getElementById("atTeams").value,10)||16;
  if(!saveTournaments()){
    Object.assign(t,previous);
    return;
  }
  logAudit("UPDATE", "Tournament: "+t.name, "Parameters updated");
  renderAdminTournaments(); renderHomeGrid(); renderDiscovery(); closeOverlay("adminTourneyModal"); toast("Tournament updated.","success");
});
function toggleTourneyLive(id){
  const t = state.tournaments.find(x=>x.id===id);
  const previousStatus = t.status;
  t.status = t.status==="live" ? "finished" : "live";
  if(!saveTournaments()){
    t.status = previousStatus;
    return;
  }
  logAudit("UPDATE", "Tournament: "+t.name, "Status set to "+t.status);
  renderAdminTournaments(); renderHomeGrid(); renderDiscovery(); renderAdminDashboard();
  toast(t.name+" is now "+t.status,"success");
}

/* 4. Registrations */
