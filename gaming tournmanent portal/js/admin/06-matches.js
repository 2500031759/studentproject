function renderAdminMatches(filter = "all", q = ""){
  const allM = state.matches.today.concat(state.matches.tomorrow, state.matches.completed);
  const list = allM.filter(m=> (filter==="all" || m.status===filter) && (!q || m.a.toLowerCase().includes(q) || m.b.toLowerCase().includes(q)));
  document.getElementById("adminMatchTableBody").innerHTML = list.map(m=>`
    <tr>
      <td><code>${m.num}</code></td><td>${m.game}</td><td><b>${m.a}</b></td><td><b>${m.b}</b></td><td>${m.t}</td>
      <td><b>${m.scoreA!==undefined?m.scoreA+"–"+m.scoreB:(m.score||'—')}</b></td>
      <td><span class="badge ${m.status==='live'?'badge-live':'badge-upcoming'}">${m.status}</span></td>
      <td>${m.referee}</td>
      <td>
        <div class="table-actions">
          <button class="btn btn-secondary btn-xs" onclick="adminScoreMatch('${m.num}')">Score</button>
          ${m.status==='upcoming'?`<button class="btn btn-primary btn-xs" onclick="adminStartMatch('${m.num}')">Start</button>`:''}
        </div>
      </td>
    </tr>`).join("");
}
function adminStartMatch(num){
  const m = state.matches.today.concat(state.matches.tomorrow).find(x=>x.num===num);
  m.status = "live";
  logAudit("UPDATE", "Match "+num, "Started fixture");
  renderAdminMatches(); renderMatchesView("today"); renderAdminDashboard(); toast("Match is live!","success");
}
function adminScoreMatch(num){
  const m = state.matches.today.concat(state.matches.tomorrow, state.matches.completed).find(x=>x.num===num);
  document.getElementById("asmMatchNum").value = m.num;
  document.getElementById("asmMatchTitle").textContent = m.a + " vs " + m.b;
  document.getElementById("asmLabelA").textContent = m.a + " Score";
  document.getElementById("asmLabelB").textContent = m.b + " Score";
  document.getElementById("asmScoreA").value = m.scoreA || 13;
  document.getElementById("asmScoreB").value = m.scoreB || 10;
  document.getElementById("asmStatus").value = m.status;
  openOverlay("adminScoreModal");
}
document.getElementById("closeAdminScoreModalBtn").addEventListener("click", ()=>closeOverlay("adminScoreModal"));
document.getElementById("adminScoreForm").addEventListener("submit", e=>{
  e.preventDefault();
  const num = document.getElementById("asmMatchNum").value;
  const m = state.matches.today.concat(state.matches.tomorrow, state.matches.completed).find(x=>x.num===num);
  m.scoreA = parseInt(document.getElementById("asmScoreA").value,10);
  m.scoreB = parseInt(document.getElementById("asmScoreB").value,10);
  m.status = document.getElementById("asmStatus").value;
  m.score = m.scoreA + "–" + m.scoreB;
  if(m.status==="completed"){
    const win = m.scoreA > m.scoreB ? m.a : m.b;
    const team = state.leaderboard.find(t=>t.team===win);
    if(team){ team.points += 30; team.wins += 1; team.matches += 1; }
    recalculateLeaderboard(false);
  }
  logAudit("UPDATE", "Match "+num, "Result recorded: "+m.score);
  renderAdminMatches(); renderMatchesView("today"); closeOverlay("adminScoreModal"); toast("Match score recorded.","success");
});

/* 6. Leaderboard Control */
