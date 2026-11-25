function renderAdminCommunity(filter = "all"){
  document.getElementById("adminCommunityFeedList").innerHTML = state.community.filter(c=> filter==="all" || c.status===filter).map((c,i)=>`
    <div class="roster-row" style="margin-bottom:10px">
      <div><b>${c.author}</b> (${c.tag}): <span style="color:var(--text-muted)">${c.body}</span></div>
      <div class="table-actions">
        ${c.status!=='Hidden'?`<button class="btn btn-secondary btn-xs" onclick="hidePost(${i})">Hide</button>`:`<button class="btn btn-success-line btn-xs" onclick="showPost(${i})">Show</button>`}
        <button class="btn btn-danger-line btn-xs" onclick="delPost(${i})">Delete</button>
      </div>
    </div>`).join("");
}
function hidePost(i){ state.community[i].status = "Hidden"; logAudit("SUSPEND", "Post by "+state.community[i].author, "Hid content"); renderAdminCommunity(); renderCommunity(); toast("Post hidden.","info"); }
function showPost(i){ state.community[i].status = "Approved"; logAudit("APPROVE", "Post by "+state.community[i].author, "Approved content"); renderAdminCommunity(); renderCommunity(); toast("Post approved.","success"); }
function delPost(i){ askConfirm("Delete post?", "Remove content?", ()=>{ state.community.splice(i,1); renderAdminCommunity(); renderCommunity(); toast("Post deleted.","danger"); }); }

/* 8. Reports */
