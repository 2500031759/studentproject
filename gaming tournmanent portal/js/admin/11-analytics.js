function renderAdminAnalytics(range){
  Object.keys(adminCharts).forEach(k=>{ if(adminCharts[k]){ adminCharts[k].destroy(); delete adminCharts[k]; } });
  const gridColor = "rgba(230,236,248,0.07)", textColor = "#8D96AC";

  adminCharts.c1 = new Chart(document.getElementById("cPlayerGrowth"), {
    type:"line", data:{labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],datasets:[{data:[120,240,310,480,720,1100,1400],borderColor:"#C9A24D",fill:true,backgroundColor:"rgba(201,162,77,0.12)"}]},
    options:{plugins:{legend:{display:false}},scales:{x:{grid:{color:gridColor},ticks:{color:textColor}},y:{grid:{color:gridColor},ticks:{color:textColor}}}}
  });
  adminCharts.c2 = new Chart(document.getElementById("cTourneyGrowth"), {
    type:"bar", data:{labels:["May","Jun","Jul","Aug","Sep"],datasets:[{label:"Completed",data:[12,24,38,52,64],backgroundColor:"#3FB77E"}]},
    options:{plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{color:textColor}},y:{grid:{color:gridColor},ticks:{color:textColor}}}}
  });
  adminCharts.c3 = new Chart(document.getElementById("cRegGrowth"), {
    type:"line", data:{labels:["D-7","D-5","D-3","D-1","Kickoff"],datasets:[{data:[10,24,40,58,64],borderColor:"#3FB77E",stepped:true}]},
    options:{plugins:{legend:{display:false}},scales:{x:{grid:{color:gridColor},ticks:{color:textColor}},y:{grid:{color:gridColor},ticks:{color:textColor}}}}
  });
  adminCharts.c4 = new Chart(document.getElementById("cGameShare"), {
    type:"doughnut", data:{labels:["Valorant","CS2","PUBG","Free Fire"],datasets:[{data:[40,25,20,15],backgroundColor:["#C9A24D","#3FB77E","#E0A63C","#E5555C"],borderWidth:0}]}
  });
  adminCharts.c5 = new Chart(document.getElementById("cMatchActivity"), {
    type:"bar", data:{labels:["Groups","Ro16","QF","SF","Final"],datasets:[{data:[64,32,16,8,2],backgroundColor:"rgba(201,162,77,0.7)"}]},
    options:{plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{color:textColor}},y:{grid:{color:gridColor},ticks:{color:textColor}}}}
  });
  adminCharts.c6 = new Chart(document.getElementById("cPrizeDist"), {
    type:"pie", data:{labels:["Valorant ₹12L","CS2 ₹8.5L","PUBG ₹6L","Others ₹14.5L"],datasets:[{data:[12,8.5,6,14.5],backgroundColor:["#C9A24D","#3FB77E","#E0A63C","#6366f1"],borderWidth:0}]}
  });
  adminCharts.c7 = new Chart(document.getElementById("cUserActivity"), {
    type:"line", data:{labels:["02:00","06:00","10:00","14:00","18:00","22:00"],datasets:[{data:[400,200,1200,3400,8600,4200],borderColor:"#3FB77E",fill:true,backgroundColor:"rgba(63,183,126,0.1)"}]},
    options:{plugins:{legend:{display:false}},scales:{x:{grid:{color:gridColor},ticks:{color:textColor}},y:{grid:{color:gridColor},ticks:{color:textColor}}}}
  });
}
document.getElementById("analyticsRangeChips").addEventListener("click", e=>{
  const chip = e.target.closest(".chip"); if(!chip) return;
  document.querySelectorAll("#analyticsRangeChips .chip").forEach(c=>c.classList.remove("active"));
  chip.classList.add("active");
  renderAdminAnalytics(chip.dataset.orange);
  toast("Analytics timeframe updated.","info");
});

/* 11. Audit Logs */
