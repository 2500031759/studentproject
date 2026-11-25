function renderAdminAnnouncements(){
  document.getElementById("adminAnnounceList").innerHTML = state.announcements.map((a,i)=>`
    <div class="roster-row">
      <div><b>${a.title}</b> <span class="badge badge-critical">${a.priority}</span><div style="font-size:12px;color:var(--text-faint)">${a.body}</div></div>
      <button class="btn btn-danger-line btn-xs" onclick="delAnnounce(${i})">Delete</button>
    </div>`).join("");
}
function delAnnounce(i){ state.announcements.splice(i,1); renderAdminAnnouncements(); toast("Announcement deleted.","info"); }
document.getElementById("adminAnnounceForm").addEventListener("submit", e=>{
  e.preventDefault();
  const title = document.getElementById("annTitle").value.trim();
  const body = document.getElementById("annBody").value.trim();
  state.announcements.unshift({id:Date.now(), title:title, priority:document.getElementById("annPriority").value, author:"Alex Vance", body:body});
  state.notifications.unshift({icon:"megaphone", text:"Official Announcement: "+title, time:"Just now"});
  document.getElementById("notifDot").style.display = "block";
  document.getElementById("adminNotifDot").style.display = "block";
  state.community.unshift({tag:"Announcement", author:"Arena Elite Official", body:title+" — "+body, likes:10, replies:0, time:"Just now", status:"Approved"});
  logAudit("ANNOUNCE", "Broadcast: "+title, "Dispatched notice");
  renderAdminAnnouncements(); renderNotifications(); renderCommunity(); e.target.reset(); toast("Announcement broadcasted!","success");
});

/* 10. Analytics (7 Charts) */
