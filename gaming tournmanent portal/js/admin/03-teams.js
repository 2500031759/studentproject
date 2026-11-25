function renderAdminTeams(game = "all", q = "", status = "all"){
  q = q.trim().toLowerCase();
  const list = state.teams.filter(t=>{
    if(game!=="all" && t.game!==game) return false;
    if(status!=="all" && t.status!==status) return false;
    if(q && !t.name.toLowerCase().includes(q)) return false;
    return true;
  });
  document.getElementById("adminTeamCountLabel").textContent = list.length + " teams";
  document.getElementById("adminTeamTableBody").innerHTML = list.map(t=>`
    <tr>
      <td><b>${t.name}</b></td><td>${t.captain}</td><td>${t.game}</td><td>${t.members}</td><td>${t.tournaments}</td><td>${t.wins}</td>
      <td><b style="color:var(--accent)">${t.ranking}</b></td>
      <td><span class="badge ${t.status==='Suspended'?'badge-suspended':'badge-active'}">${t.status}</span></td>
      <td><button class="btn btn-secondary btn-xs" onclick="toggleTeamStatus(${t.id})">${t.status==='Suspended'?'Reinstate':'Suspend'}</button></td>
    </tr>`).join("");
}
function toggleTeamStatus(id){
  const t = state.teams.find(x=>x.id===id);
  t.status = t.status==="Suspended" ? "Active" : "Suspended";
  logAudit("UPDATE", "Team: "+t.name, "Status changed to "+t.status);
  renderAdminTeams();
  toast(t.name+" status updated.","info");
}
document.getElementById("adminTeamSearch").addEventListener("input", e=>renderAdminTeams("all", e.target.value));

/* 3. Tournaments */
