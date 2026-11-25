function renderAdminReports(cat = "all", status = "all"){
  const list = state.reports.filter(r=> (cat==="all"||r.category===cat) && (status==="all"||r.status===status));
  document.getElementById("adminReportBody").innerHTML = list.map(r=>`
    <tr>
      <td><code>${r.id}</code></td><td>${r.reporter}</td><td><b>${r.target}</b></td><td>${r.category}</td><td>${r.desc}</td>
      <td><span class="badge badge-critical">${r.priority}</span></td><td>${r.date}</td><td><span class="badge badge-approved">${r.status}</span></td>
      <td>${r.status==='Open'?`<button class="btn btn-success-line btn-xs" onclick="resolveReport('${r.id}')">Resolve</button>`:'—'}</td>
    </tr>`).join("");
}
function resolveReport(id){
  const r = state.reports.find(x=>x.id===id);
  r.status = "Resolved";
  logAudit("RESOLVE", "Report "+id, "Resolved ticket");
  renderAdminReports(); renderAdminDashboard(); toast("Report resolved.","success");
}

/* 9. Announcements */
