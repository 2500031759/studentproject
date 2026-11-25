function renderAdminRegistrations(filter = "all"){
  const list = state.registrations.filter(r=> filter==="all" || r.status===filter);
  document.getElementById("adminRegCountLabel").textContent = list.length + " entries";
  document.getElementById("adminRegTableBody").innerHTML = list.map(r=>`
    <tr>
      <td><code>${r.id}</code></td><td><b>${r.team}</b></td><td>${r.tournament}</td><td>${r.captain}</td><td>${r.game}</td><td>${r.submitted}</td>
      <td><span class="badge ${r.status==='approved'?'badge-approved':'badge-pending'}">${r.status.toUpperCase()}</span></td>
      <td>
        <div class="table-actions">
          ${r.status==='pending'?`<button class="btn btn-success-line btn-xs" onclick="adminApproveReg('${r.id}')">Approve</button><button class="btn btn-danger-line btn-xs" onclick="adminRejectReg('${r.id}')">Reject</button>`:`<button class="btn btn-secondary btn-xs" onclick="adminFlagReg('${r.id}')">Flag</button>`}
        </div>
      </td>
    </tr>`).join("");
}
function adminApproveReg(id){
  const r = state.registrations.find(x=>x.id===id);
  r.status = "approved";
  logAudit("APPROVE", "Registration "+id, "Approved for "+r.tournament);
  renderAdminRegistrations(); renderRegistrations(); renderAdminDashboard(); toast("Registration approved.","success");
}
function adminRejectReg(id){
  const r = state.registrations.find(x=>x.id===id);
  r.status = "rejected";
  logAudit("REJECT", "Registration "+id, "Rejected entry");
  renderAdminRegistrations(); renderRegistrations(); renderAdminDashboard(); toast("Registration rejected.","danger");
}
function adminFlagReg(id){
  const r = state.registrations.find(x=>x.id===id);
  r.status = "flagged";
  logAudit("UPDATE", "Registration "+id, "Flagged for investigation");
  renderAdminRegistrations(); toast("Registration flagged.","info");
}
document.getElementById("adminRegFilterChips").addEventListener("click", e=>{
  const chip = e.target.closest(".chip"); if(!chip) return;
  document.querySelectorAll("#adminRegFilterChips .chip").forEach(c=>c.classList.remove("active"));
  chip.classList.add("active");
  renderAdminRegistrations(chip.dataset.rfilter);
});

/* 5. Matches */
