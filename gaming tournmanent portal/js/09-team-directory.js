const teamDirectory = document.getElementById("view-teams");
const teamSearch = document.getElementById("teamsSearch");
const teamCards = [...document.querySelectorAll("#teamsGrid .teams-card")];
const teamFilters = [...document.querySelectorAll("#view-teams .teams-filter")];
const teamEmpty = document.getElementById("teamsEmpty");
let activeTeamFilter = "all";

function renderTeamDirectory(){
  const query = teamSearch.value.toLowerCase().trim();
  let visibleCount = 0;

  teamCards.forEach(card=>{
    const matchesGame = activeTeamFilter === "all" || card.dataset.game === activeTeamFilter;
    const matchesQuery = !query || card.dataset.name.includes(query) || (card.dataset.gameName || card.dataset.game).includes(query);
    const visible = matchesGame && matchesQuery;
    card.hidden = !visible;
    if(visible) visibleCount++;
  });

  teamEmpty.style.display = visibleCount ? "none" : "block";
}

function renderMyTeam(team){
  const maxMembers = Number(team.maxMembers) || 5;
  const teamName = team.name || "Elite Academy";
  const tag = team.tag || "EA";
  const captain = team.captain || "You";
  const game = team.game || "CS2";
  const logo = document.getElementById("myTeamLogo");

  document.getElementById("myTeamName").textContent = teamName;
  document.getElementById("myTeamEyebrow").textContent = `MY TEAM · ${game.toUpperCase()}`;
  document.getElementById("myTeamDescription").textContent = team.description || "Competitive squad focused on improving performance, winning tournaments, and building a strong esports community.";
  document.getElementById("myTeamRank").textContent = team.rank || (team.createdAt ? "NEW" : "#47");
  document.getElementById("myTeamWinRate").textContent = team.winRate || "--";
  document.getElementById("myTeamMemberCount").textContent = `1/${maxMembers}`;
  document.getElementById("myTeamTournaments").textContent = team.tournaments || "0";
  logo.textContent = tag;
  logo.style.backgroundImage = team.logo ? `url("${team.logo}")` : "";

  const members = document.getElementById("myTeamMembers");
  members.replaceChildren();
  const captainCard = document.createElement("article");
  captainCard.className = "my-team-member";
  const avatar = document.createElement("div");
  avatar.className = "my-team-member-icon";
  avatar.textContent = captain.split(/\s+/).map(part=>part[0]).join("").slice(0,2).toUpperCase();
  const details = document.createElement("div");
  const name = document.createElement("h3");
  name.textContent = captain;
  const role = document.createElement("small");
  role.textContent = "CAPTAIN";
  details.append(name,role);
  const status = document.createElement("span");
  status.className = "my-team-member-status";
  status.setAttribute("aria-label","Active");
  captainCard.append(avatar,details,status);
  members.append(captainCard);

  for(let slot=1;slot<maxMembers;slot++){
    const recruit = document.createElement("div");
    recruit.className = "my-team-recruit";
    recruit.textContent = "+ Open Recruitment Slot";
    members.append(recruit);
  }
}

const defaultMyTeam = {
  name:"Elite Academy",
  tag:"EA",
  game:"CS2",
  maxMembers:5,
  captain:"You",
  description:"Competitive squad focused on improving performance, winning tournaments, and building a strong esports community.",
  rank:"#47",
  winRate:"--",
  tournaments:0
};
let currentMyTeam = defaultMyTeam;

teamFilters.forEach(filter=>{
  filter.addEventListener("click",()=>{
    teamFilters.forEach(button=>{
      const active = button === filter;
      button.classList.toggle("active",active);
      button.setAttribute("aria-pressed",String(active));
    });
    activeTeamFilter = filter.dataset.teamFilter;
    renderTeamDirectory();
  });
});

teamSearch.addEventListener("input",renderTeamDirectory);
teamDirectory.addEventListener("click",event=>{
  const button = event.target.closest("[data-team-action]");
  if(!button) return;

  const teamName = button.dataset.teamName;
  switch(button.dataset.teamAction){
    case "view":
      toast("Opening "+teamName+" team profile.");
      break;
    case "join":
      toast("Join request sent to "+teamName+".","success");
      break;
    case "create":
      document.getElementById("createTeamError").hidden = true;
      openOverlay("createTeamOverlay");
      document.getElementById("newTeamName").focus();
      break;
  }
});

const createTeamForm = document.getElementById("createTeamForm");
const createTeamError = document.getElementById("createTeamError");
const createTeamLogo = document.getElementById("newTeamLogo");
const createTeamLogoMaxBytes = 2 * 1024 * 1024;

function addCreatedTeam(team){
  const card = document.createElement("article");
  card.className = "teams-card";
  card.dataset.createdTeam = "true";
  card.dataset.game = team.game === "Apex Legends"
    ? "apex"
    : team.game.toLowerCase().replace(/\s+/g,"-");
  card.dataset.gameName = team.game.toLowerCase();
  card.dataset.name = team.name.toLowerCase();

  const top = document.createElement("div");
  top.className = "team-card-top";
  const logo = document.createElement("div");
  logo.className = "team-logo";
  logo.textContent = team.tag || "EA";
  if(team.logo){
    logo.textContent = "";
    logo.style.backgroundImage = `url("${team.logo}")`;
    logo.style.backgroundSize = "cover";
    logo.style.backgroundPosition = "center";
  }

  const identity = document.createElement("div");
  const name = document.createElement("h2");
  name.className = "team-name";
  name.textContent = team.name;
  const game = document.createElement("div");
  game.className = "team-game";
  game.textContent = `${team.game.toUpperCase()} · ${team.tag}`;
  identity.append(name,game);
  const rank = document.createElement("div");
  rank.className = "team-rank";
  rank.textContent = "NEW";
  top.append(logo,identity,rank);

  const members = document.createElement("div");
  members.className = "team-members";
  const captain = document.createElement("div");
  captain.className = "team-member";
  const captainName = document.createElement("b");
  captainName.textContent = team.captain;
  const captainRole = document.createElement("small");
  captainRole.textContent = "CAPTAIN";
  captain.append(captainName,captainRole);
  const openSlots = document.createElement("div");
  openSlots.className = "team-member";
  const slotsLabel = document.createElement("b");
  const maxMembers = Number(team.maxMembers) || 5;
  slotsLabel.textContent = `${maxMembers - 1} open`;
  const slotsRole = document.createElement("small");
  slotsRole.textContent = "RECRUITING";
  openSlots.append(slotsLabel,slotsRole);
  members.append(captain,openSlots);

  const meta = document.createElement("div");
  meta.className = "team-meta";
  const region = document.createElement("span");
  region.textContent = `Region ${team.region}`;
  const memberCount = document.createElement("span");
  const memberCountValue = document.createElement("strong");
  memberCountValue.textContent = `1/${maxMembers}`;
  memberCount.append("Members ",memberCountValue);
  meta.append(region,memberCount);
  card.append(top,members,meta);
  return card;
}

function displayCreatedTeam(team){
  const card = addCreatedTeam(team);
  document.getElementById("teamsGrid").prepend(card);
  teamCards.unshift(card);
  renderTeamDirectory();
}

function readCreatedTeam(){
  try{
    const savedTeam = localStorage.getItem("eliteArenaTeam");
    return savedTeam ? JSON.parse(savedTeam) : null;
  }catch(error){
    console.error("Could not load the saved team.",error);
    toast("Could not load your saved team from browser storage.","error");
    return null;
  }
}

const savedCreatedTeam = readCreatedTeam();
if(savedCreatedTeam && typeof savedCreatedTeam.name === "string" && typeof savedCreatedTeam.game === "string"){
  currentMyTeam = savedCreatedTeam;
  displayCreatedTeam(savedCreatedTeam);
}
renderMyTeam(currentMyTeam);

function openTeamEditor(team){
  createTeamForm.reset();
  createTeamError.hidden = true;
  document.getElementById("newTeamName").value = team.name || "";
  document.getElementById("newTeamTag").value = team.tag || "";
  document.getElementById("newTeamGame").value = team.game || "";
  document.getElementById("newTeamMaxMembers").value = String(Number(team.maxMembers) || 5);
  document.getElementById("newTeamCaptain").value = team.captain || "";
  document.getElementById("newTeamRegion").value = team.region || "India";
  document.getElementById("newTeamDescription").value = team.description || "";
  openOverlay("createTeamOverlay");
  document.getElementById("newTeamName").focus();
}

document.getElementById("editMyTeamBtn").addEventListener("click",()=>openTeamEditor(currentMyTeam));

document.getElementById("closeCreateTeamBtn").addEventListener("click",()=>closeOverlay("createTeamOverlay"));
document.getElementById("cancelCreateTeamBtn").addEventListener("click",()=>closeOverlay("createTeamOverlay"));

createTeamLogo.addEventListener("change",()=>{
  const file = createTeamLogo.files[0];
  if(file && (!file.type.startsWith("image/") || file.size > createTeamLogoMaxBytes)){
    createTeamError.textContent = file.type.startsWith("image/")
      ? "The team logo must be 2 MB or smaller."
      : "Choose a valid image file for the team logo.";
    createTeamError.hidden = false;
    createTeamLogo.value = "";
    return;
  }
  createTeamError.hidden = true;
});

createTeamForm.addEventListener("submit",event=>{
  event.preventDefault();
  createTeamError.hidden = true;

  const logoFile = createTeamLogo.files[0];
  if(logoFile && (!logoFile.type.startsWith("image/") || logoFile.size > createTeamLogoMaxBytes)){
    createTeamError.textContent = "Choose an image file that is 2 MB or smaller.";
    createTeamError.hidden = false;
    return;
  }

  const team = {
    name:document.getElementById("newTeamName").value.trim(),
    tag:document.getElementById("newTeamTag").value.trim().toUpperCase(),
    game:document.getElementById("newTeamGame").value,
    maxMembers:Number(document.getElementById("newTeamMaxMembers").value),
    captain:document.getElementById("newTeamCaptain").value.trim(),
    region:document.getElementById("newTeamRegion").value,
    description:document.getElementById("newTeamDescription").value.trim(),
    createdAt:new Date().toISOString()
  };

  const saveTeam = logoData=>{
    team.logo = logoData || currentMyTeam.logo || "";
    try{
      localStorage.setItem("eliteArenaTeam",JSON.stringify(team));
    }catch(error){
      console.error("Could not save the new team.",error);
      createTeamError.textContent = "Could not save your team. Check available browser storage and try again.";
      createTeamError.hidden = false;
      return;
    }

    const previousCard = document.querySelector("#teamsGrid .teams-card[data-created-team='true']");
    if(previousCard){
      const index = teamCards.indexOf(previousCard);
      if(index !== -1) teamCards.splice(index,1);
      previousCard.remove();
    }
    const card = addCreatedTeam(team);
    document.getElementById("teamsGrid").prepend(card);
    teamCards.unshift(card);
    currentMyTeam = team;
    renderMyTeam(currentMyTeam);
    createTeamForm.reset();
    closeOverlay("createTeamOverlay");
    renderTeamDirectory();
    toast("Your team was created successfully.","success");
  };

  if(logoFile){
    const reader = new FileReader();
    reader.addEventListener("load",()=>{
      if(typeof reader.result !== "string"){
        createTeamError.textContent = "Could not read the selected team logo.";
        createTeamError.hidden = false;
        return;
      }
      saveTeam(reader.result);
    });
    reader.addEventListener("error",()=>{
      createTeamError.textContent = "Could not read the selected team logo.";
      createTeamError.hidden = false;
    });
    reader.readAsDataURL(logoFile);
    return;
  }

  saveTeam("");
});
