function renderAdminLeaderboard(q = ""){
  document.getElementById("adminLeaderboardBody").innerHTML = state.leaderboard.filter(t=>!q||t.team.toLowerCase().includes(q)).map(r=>`
    <tr>
      <td><b>#${r.rank}</b></td><td><b>${r.team}</b></td><td>${r.matches}</td><td>${r.wins}</td><td>${r.losses}</td>
      <td><b style="color:var(--accent)">${r.points}</b></td><td>${Math.round((r.wins/r.matches)*100)}%</td><td>${r.status}</td>
      <td><button class="btn btn-secondary btn-xs" onclick="adjustPointsModal('${r.team}')">Adjust Points</button></td>
    </tr>`).join("");
}
function recalculateLeaderboard(showToast = true){
  state.leaderboard.sort((a,b)=>b.points - a.points);
  state.leaderboard.forEach((t,i)=>{ t.rank = i+1; });
  renderAdminLeaderboard(); renderFullLeaderboard(); renderHomeLeaderboard();
  if(showToast){ logAudit("UPDATE", "Leaderboard", "Recalculated full rankings"); toast("Leaderboard rankings recalculated!","success"); }
}
document.getElementById("adminRecalcLeaderboardBtn").addEventListener("click", ()=>recalculateLeaderboard(true));

function adjustPointsModal(team){
  document.getElementById("adjTeamName").value = team;
  document.getElementById("adjDisplayTeam").value = team;
  openOverlay("adminAdjustPointsModal");
}
document.getElementById("closeAdminAdjustPointsBtn").addEventListener("click", ()=>closeOverlay("adminAdjustPointsModal"));
document.getElementById("adminAdjustPointsForm").addEventListener("submit", e=>{
  e.preventDefault();
  const team = state.leaderboard.find(t=>t.team===document.getElementById("adjTeamName").value);
  const delta = parseInt(document.getElementById("adjPointsVal").value,10);
  team.points += delta;
  logAudit("UPDATE", "Points: "+team.team, (delta>=0?"+":"")+delta+" points ("+document.getElementById("adjReason").value+")");
  recalculateLeaderboard(false); closeOverlay("adminAdjustPointsModal"); toast("Points adjusted for "+team.team,"success");
});

/* 7. Community Moderation */
