
const stateKey = "career-dashboard-state-v1";
let data;
let state = JSON.parse(localStorage.getItem(stateKey) || '{"tasks":{}}');

const glossary={
  "workstream":{title:"Workstream",simple:"A major category of related work inside a larger project. It helps split a big goal into manageable areas that can run at the same time.",example:"For a restaurant opening, IT, Construction, Operations, Marketing, and Training can each be separate workstreams.",visual:["PROJECT","↓","WORKSTREAMS","↓","DELIVERABLES → TASKS"]},
  "deliverable":{title:"Deliverable",simple:"A specific result or thing the project is expected to produce.",example:"A completed Mikan project charter, configured POS system, or finished training guide can be a deliverable.",visual:["Workstream","↓","Deliverable","↓","Tasks that create it"]},
  "dependency":{title:"Dependency",simple:"Something that must happen, arrive, or be completed before another piece of work can move forward.",example:"POS installation may depend on the network and internet connection being ready first.",visual:["Network ready","→","POS install","→","Testing"]},
  "milestone":{title:"Milestone",simple:"An important checkpoint or event in a project. It marks progress but usually is not a task itself.",example:"Go-live day, CAPM exam day, or completing your PM portfolio can be milestones.",visual:["Tasks","→","◆ MILESTONE","→","Next phase"]},
  "stakeholder":{title:"Stakeholder",simple:"A person or group that can affect the project, is affected by it, or cares about its outcome.",example:"For a restaurant technology project: IT, operations, restaurant managers, vendors, and leadership are stakeholders.",visual:["IT  Operations  Vendors","↘   ↓   ↙","PROJECT","↓","Managers / Leadership"]},
  "risk":{title:"Risk",simple:"An uncertain event that might happen and affect the project. A risk is different from an issue because it has not happened yet.",example:"The ISP might miss its installation date. That is a risk until the delay actually happens.",visual:["MIGHT happen = RISK","↓ if it happens","IS happening = ISSUE"]},
  "scope":{title:"Scope",simple:"The boundaries of the project: what work and outcomes are included, and what is not included.",example:"If your project covers network, POS, printers and go-live testing, those items are in scope.",visual:["PROJECT BOUNDARY","[ Included work ]","Outside = not in scope"]},
  "raci":{title:"RACI",simple:"A responsibility chart showing who does the work, who owns the final decision, who is consulted, and who is kept informed.",example:"R = Responsible, A = Accountable, C = Consulted, I = Informed.",visual:["R = Does it","A = Owns it","C = Gives input","I = Kept updated"]}
};

function save(){ localStorage.setItem(stateKey, JSON.stringify(state)); }
function ensureTask(id){ if(!state.tasks[id]) state.tasks[id]={done:false,checks:{},notes:""}; return state.tasks[id]; }
function formatDate(task){ if(!task.date) return task.day; const d=new Date(`${task.date}T12:00:00`); return d.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"}); }
function termButton(term,label){return `<button type="button" class="term" data-term="${term}">${label||glossary[term].title}</button>`;}
function openTerm(term){
  const g=glossary[term]; if(!g)return;
  let modal=document.getElementById("termModal");
  if(!modal){ modal=document.createElement("div");modal.id="termModal";modal.className="term-modal hidden";modal.innerHTML='<div class="term-backdrop"></div><section class="term-dialog" role="dialog" aria-modal="true" aria-labelledby="termTitle"><button type="button" class="term-close" aria-label="Close">×</button><div class="kicker">Industry term · simple definition</div><h2 id="termTitle"></h2><p class="term-simple"></p><div class="term-example"></div><div class="term-visual"></div></section>';document.body.appendChild(modal);modal.querySelector(".term-close").addEventListener("click",closeTerm);modal.querySelector(".term-backdrop").addEventListener("click",closeTerm); }
  modal.querySelector("#termTitle").textContent=g.title;modal.querySelector(".term-simple").textContent=g.simple;modal.querySelector(".term-example").innerHTML=`<strong>Example:</strong> ${g.example}`;modal.querySelector(".term-visual").innerHTML=g.visual.map(x=>`<div>${x}</div>`).join("");modal.classList.remove("hidden");modal.querySelector(".term-close").focus();
}
function closeTerm(){document.getElementById("termModal")?.classList.add("hidden");}
document.addEventListener("click",e=>{const b=e.target.closest(".term");if(b)openTerm(b.dataset.term);});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeTerm();});

function renderStats(){ const cats=["PM / CAPM","Technical","Portfolio","Job Search"]; const stats=document.getElementById("stats");stats.innerHTML="";for(const cat of cats){const tasks=data.tasks.filter(t=>t.category===cat);const done=tasks.filter(t=>ensureTask(t.id).done).length;const pct=tasks.length?Math.round(done/tasks.length*100):0;const el=document.createElement("div");el.className="stat";el.innerHTML=`<div class="stat-label">${cat}</div><div class="bar"><div class="fill" style="width:${pct}%"></div></div><div class="stat-pct">${pct}%</div>`;stats.appendChild(el);}}

function addWorkstreamLesson(list,task){
  if(task.id!=="sep-w1-1-design-career-project-structure")return;
  const panel=document.createElement("details");panel.className="learning-panel";
  panel.innerHTML=`<summary>Learn: What are the 4 ${termButton("workstream","workstreams")}?</summary>
  <div class="lesson-body"><p>A ${termButton("workstream")} is a major category of related work within a larger project. Your overall project is <strong>Career Transition 2026–27</strong>, and these four areas run at the same time toward the same goal.</p>
  <div class="workstream-grid">
    <div><strong>PM / CAPM</strong><span>Project management capability</span><small>CAPM · lifecycle · Agile · ${termButton("risk","risk")} · scheduling · Jira · Confluence</small></div>
    <div><strong>Technical Skills</strong><span>Strengthen your technical resume</span><small>Network+ · M365 · Entra ID · AD · Intune · PowerShell · SQL · APIs</small></div>
    <div><strong>Portfolio</strong><span>Prove you can apply the skills</span><small>Mikan · ORB · charter · ${termButton("raci","RACI")} · timeline · risk register</small></div>
    <div><strong>Job Search</strong><span>Turn the work into a new job</span><small>Applications · resumes · government exams · interviews · job tracking</small></div>
  </div>
  <div class="career-flow" aria-label="Career transition workstream visual"><div class="flow-goal"><strong>CAREER TRANSITION 2026–27</strong><span>Goal: New position by March 2027</span></div><div class="flow-arrow">↓</div><div class="flow-streams"><span>PM / CAPM</span><span>TECHNICAL</span><span>PORTFOLIO</span></div><div class="flow-arrow">↓</div><div class="flow-search">JOB SEARCH<br><small>Applications + Interviews</small></div><div class="flow-arrow">↓</div><div class="flow-new">★ NEW POSITION ★</div></div>
  <p class="lesson-note"><strong>PM thinking:</strong> Project → ${termButton("workstream","Workstreams")} → ${termButton("deliverable","Deliverables")} → Tasks → ${termButton("dependency","Dependencies")} → ${termButton("milestone","Milestones")}. Click any underlined industry term for a simple definition and visual.</p></div>`;
  list.parentElement.insertBefore(panel,list.nextSibling);
}

function makeTask(task){ const tpl=document.getElementById("taskTemplate");const el=tpl.content.firstElementChild.cloneNode(true);const s=ensureTask(task.id);el.dataset.id=task.id;el.classList.toggle("done",s.done);el.querySelector(".task-title").textContent=task.title;el.querySelector(".minutes").textContent=`${task.minutes} min`;el.querySelector(".meta").textContent=`${formatDate(task)} · ${task.category}`;el.querySelector(".details").textContent=task.details;const main=el.querySelector(".task-check");main.checked=s.done;main.addEventListener("change",()=>{s.done=main.checked;save();renderAll();});const list=el.querySelector(".checklist");task.checklist.forEach((item,i)=>{const row=document.createElement("label");row.className="checkrow";const cb=document.createElement("input");cb.type="checkbox";cb.className="subcheck";cb.checked=!!s.checks[i];cb.addEventListener("change",()=>{s.checks[i]=cb.checked;save();});const span=document.createElement("span");span.textContent=item;row.append(cb,span);list.appendChild(row);});addWorkstreamLesson(list,task);const notes=el.querySelector(".notes");notes.value=s.notes||"";notes.addEventListener("input",()=>{s.notes=notes.value;save();});return el; }
function renderDaily(){const root=document.getElementById("daily");root.innerHTML="";const firstUndone=data.tasks.find(t=>!ensureTask(t.id).done)||data.tasks[0];const hero=document.createElement("div");hero.className="today-hero";hero.innerHTML=`<div class="kicker">Next recommended task</div><h2>${firstUndone.title}</h2><div>${formatDate(firstUndone)} · ${firstUndone.minutes} min · ${firstUndone.category}</div>`;root.appendChild(hero);root.appendChild(makeTask(firstUndone));}
function renderWeekly(){const root=document.getElementById("weekly");root.innerHTML="";const days=[...new Set(data.tasks.map(t=>t.day))];days.forEach(day=>{const block=document.createElement("div");block.className="day-block";const h=document.createElement("div");h.className="day-label";h.textContent=day;block.appendChild(h);const grid=document.createElement("div");grid.className="grid";data.tasks.filter(t=>t.day===day).forEach(t=>grid.appendChild(makeTask(t)));block.appendChild(grid);root.appendChild(block);});}
function renderMonthly(){const root=document.getElementById("monthly");root.innerHTML='<div class="grid two"></div>';const grid=root.firstElementChild;data.months.forEach(m=>{const el=document.createElement("article");el.className="card month-card";el.innerHTML=`<div class="kicker">${m.month}</div><h3>${m.focus}</h3><ul>${m.items.map(x=>`<li>${x}</li>`).join("")}</ul>`;grid.appendChild(el);});}
function renderAll(){renderStats();renderDaily();renderWeekly();renderMonthly();}
document.querySelectorAll(".tab").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active"));btn.classList.add("active");document.querySelectorAll(".view").forEach(v=>v.classList.add("hidden"));document.getElementById(btn.dataset.view).classList.remove("hidden");}));
document.getElementById("resetBtn").addEventListener("click",()=>{if(confirm("Reset all checkboxes and notes?")){state={tasks:{}};save();renderAll();}});
fetch("roadmap.json").then(r=>r.json()).then(d=>{data=d;renderAll();}).catch(()=>{document.querySelector("main").innerHTML='<div class="empty">Could not load roadmap.json.</div>';});
