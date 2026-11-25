function renderAdminPlayers(filter = "all", q = ""){
  q = q.trim().toLowerCase();
  const list = state.players.filter(p=>{
    if(filter!=="all" && p.status!==filter) return false;
    if(q && !p.name.toLowerCase().includes(q) && !p.username.toLowerCase().includes(q)) return false;
    return true;
  });
  document.getElementById("adminPlayerCountLabel").textContent = list.length + " players";
  document.getElementById("adminPlayerTableBody").innerHTML = list.map(p=>`
    <tr>
      <td><b>${p.name}</b></td>
      <td><span style="color:var(--accent)">@${p.username}</span></td>
      <td>${p.email}</td><td><b>${p.team}</b></td><td>${p.game}</td><td>${p.matches}</td><td>${p.wins}</td>
      <td><span class="badge ${p.status==='Suspended'?'badge-suspended':'badge-active'}">${p.status}</span></td>
      <td>${p.joined}</td>
      <td>
        <div class="table-actions">
          <button class="btn btn-secondary btn-xs" onclick="viewPlayerModal(${p.id})">View</button>
          <button class="btn btn-${p.status==='Suspended'?'success':'danger'}-line btn-xs" onclick="togglePlayerStatus(${p.id})">${p.status==='Suspended'?'Activate':'Suspend'}</button>
        </div>
      </td>
    </tr>`).join("");
  lucide.createIcons();
}
document.getElementById("adminPlayerSearch").addEventListener("input", e=>renderAdminPlayers("all", e.target.value));

function viewPlayerModal(id){
  const p = state.players.find(x=>x.id===id);
  document.getElementById("apmTitle").textContent = p.name + " (@" + p.username + ")";
  document.getElementById("apmBody").innerHTML = `
    <div class="team-stats-row">
      <div class="team-stat-box"><b>${p.matches}</b><span>Matches</span></div>
      <div class="team-stat-box"><b>${p.wins}</b><span>Wins</span></div>
      <div class="team-stat-box"><b>${p.kda}</b><span>Rating</span></div>
      <div class="team-stat-box"><b>${money(p.earnings)}</b><span>Earnings</span></div>
    </div>
    <div class="panel" style="margin-top:16px">
      <div class="roster-row"><span>Team:</span><b>${p.team}</b></div>
      <div class="roster-row"><span>Email:</span><b>${p.email}</b></div>
      <div class="roster-row"><span>Joined Platform:</span><b>${p.joined}</b></div>
    </div>`;
  openOverlay("adminPlayerModal");
}
document.getElementById("closeAdminPlayerModalBtn").addEventListener("click", ()=>closeOverlay("adminPlayerModal"));

function togglePlayerStatus(id){
  const p = state.players.find(x=>x.id===id);
  p.status = p.status==="Suspended" ? "Active" : "Suspended";
  logAudit(p.status==="Suspended"?"SUSPEND":"APPROVE", "Player: "+p.username, "Updated status to "+p.status);
  renderAdminPlayers();
  toast(p.username+" status: "+p.status, "info");
}

/* 2. Teams */
