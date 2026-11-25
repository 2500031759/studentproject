function renderAdminAuditLogs(action = "all", q = ""){
  const list = state.auditLogs.filter(l=> (action==="all" || l.action===action) && (!q || l.target.toLowerCase().includes(q)));
  document.getElementById("adminAuditTableBody").innerHTML = list.map(l=>`
    <tr>
      <td>${l.time}</td><td><b>${l.admin}</b></td><td><span class="audit-pill audit-pill-${l.action.toLowerCase()}">${l.action}</span></td>
      <td><b>${l.target}</b></td><td>${l.details}</td><td><code>${l.ip}</code></td><td><span class="badge badge-approved">${l.status}</span></td>
    </tr>`).join("");
}
document.getElementById("adminAuditSearch").addEventListener("input", e=>renderAdminAuditLogs("all", e.target.value));
document.getElementById("adminExportAuditBtn").addEventListener("click", ()=>{
  const csv = "Time,Admin,Action,Target,Details,IP\\n" + state.auditLogs.map(l=>`"${l.time}","${l.admin}","${l.action}","${l.target}","${l.details}","${l.ip}"`).join("\\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
  a.download = "arena-elite-audit.csv"; a.click();
  toast("Audit logs downloaded.","success");
});

/* 12. Settings */
document.querySelectorAll(".settings-nav-btn").forEach(btn=>{
  btn.addEventListener("click", e=>{
    e.preventDefault();
    document.querySelectorAll(".settings-nav-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    ["general","tournament","security","moderation"].forEach(k=>{
      document.getElementById("setpanel-"+k).style.display = (k===btn.dataset.settab) ? "block" : "none";
    });
  });
});
