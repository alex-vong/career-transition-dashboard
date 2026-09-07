
const stateKey = "career-dashboard-state-v1";
let data;
let state = JSON.parse(localStorage.getItem(stateKey) || '{"tasks":{}}');

const glossary={
  "capm":{
    title:"CAPM",
    subtitle:"Certified Associate in Project Management",
    simple:"A foundational project management certification from PMI. It is designed for people building project-management knowledge and does not require prior project-management work experience.",
    example:"For your career plan, CAPM helps prove that you understand project terminology, predictive planning, Agile concepts, and business analysis even though your official job title has not been Project Manager.",
    visual:["PMI","↓","CAPM","↓","FOUNDATIONAL PM KNOWLEDGE","↓","Project Coordinator / PM-track roles"],
    capmInfo:true,
    question:{text:"A project team member wants to understand who is responsible for completing a task and who has final ownership of the result. Which project-management tool would BEST provide this information?",choices:["Risk register","RACI matrix","Issue log","Milestone list"],answer:1,explanation:"A RACI matrix identifies who is Responsible, Accountable, Consulted, and Informed for work or decisions."}
  },
  "workstream":{title:"Workstream",simple:"A major category of related work inside a larger project. It helps split a big goal into manageable areas that can run at the same time.",example:"For a restaurant opening, IT, Construction, Operations, Marketing, and Training can each be separate workstreams.",visual:["PROJECT","↓","WORKSTREAMS","↓","DELIVERABLES → TASKS"],question:{text:"A large project is divided into IT, Training, Construction, and Marketing groups that perform related sets of work in parallel. What is the BEST term for these major areas of work?",choices:["Milestones","Workstreams","Issues","Constraints"],answer:1,explanation:"Workstreams are major related areas of work within a larger project or program."}},
  "deliverable":{title:"Deliverable",simple:"A specific result, product, document, or outcome the project is expected to produce.",example:"A completed Mikan project charter, configured POS system, or finished training guide can be a deliverable.",visual:["Workstream","↓","Deliverable","↓","Tasks that create it"],question:{text:"The project plan requires the team to produce a completed user-training guide before launch. How should the training guide be classified?",choices:["Deliverable","Dependency","Risk","Assumption"],answer:0,explanation:"A deliverable is a specific verifiable output or result produced by the project."}},
  "dependency":{title:"Dependency",simple:"Something that must happen, arrive, or be completed before another piece of work can move forward.",example:"POS installation may depend on the network and internet connection being ready first.",visual:["Network ready","→","POS install","→","Testing"],question:{text:"The POS team cannot begin installation until the network is operational. What does the network-readiness relationship represent?",choices:["A risk","A dependency","A stakeholder","A milestone"],answer:1,explanation:"A dependency is a relationship where one activity relies on another activity or event."}},
  "milestone":{title:"Milestone",simple:"An important checkpoint or event in a project. It marks significant progress but usually does not represent work with a duration.",example:"Go-live day, CAPM exam day, or completing your PM portfolio can be milestones.",visual:["Tasks","→","◆ MILESTONE","→","Next phase"],question:{text:"The project schedule identifies 'Restaurant Go-Live' as a zero-duration event marking completion of implementation. What is this?",choices:["Milestone","Issue","Work package","Risk response"],answer:0,explanation:"A milestone is a significant point or event in a project and commonly has zero duration."}},
  "stakeholder":{title:"Stakeholder",simple:"A person or group that can affect the project, is affected by it, or cares about its outcome.",example:"For a restaurant technology project: IT, operations, restaurant managers, vendors, and leadership are stakeholders.",visual:["IT  Operations  Vendors","↘   ↓   ↙","PROJECT","↓","Managers / Leadership"],question:{text:"A vendor will install the network, restaurant managers will use the system, and leadership approves the budget. How should these people and groups be classified?",choices:["Stakeholders","Dependencies","Deliverables","Constraints"],answer:0,explanation:"Stakeholders are people or groups who can affect, are affected by, or perceive themselves to be affected by the project."}},
  "risk":{title:"Risk",simple:"An uncertain event or condition that might happen and could affect the project. A risk is different from an issue because the event has not happened yet.",example:"The ISP might miss its installation date. That is a risk until the delay actually happens.",visual:["MIGHT happen = RISK","↓ if it happens","IS happening = ISSUE"],question:{text:"The project manager learns that the ISP may miss its scheduled installation date next month. The delay has not occurred. Where should this be recorded?",choices:["Issue log","Risk register","Lessons learned register","Change log"],answer:1,explanation:"Because the event is uncertain and has not happened, it is a risk and belongs in the risk register."}},
  "scope":{title:"Scope",simple:"The boundaries of the project: what work and outcomes are included, and what is not included.",example:"If your project covers network, POS, printers and go-live testing, those items are in scope.",visual:["PROJECT BOUNDARY","[ Included work ]","Outside = not in scope"],question:{text:"A stakeholder asks the team to add security cameras even though the approved project only includes POS, networking, and printers. What should the team consider first?",choices:["Whether the request changes project scope","Whether the task is a milestone","Whether it belongs in the risk register","Whether the stakeholder is accountable"],answer:0,explanation:"The request may add work beyond the approved project boundaries, so its effect on scope should be evaluated first."}},
  "raci":{title:"RACI",simple:"A responsibility chart showing who does the work, who owns the final decision, who is consulted, and who is kept informed.",example:"R = Responsible, A = Accountable, C = Consulted, I = Informed.",visual:["R = Does it","A = Owns it","C = Gives input","I = Kept updated"],question:{text:"A project coordinator needs a quick way to show who performs each activity, who owns the final result, who provides input, and who receives updates. What should be created?",choices:["Risk matrix","RACI matrix","Burndown chart","Issue log"],answer:1,explanation:"RACI maps Responsible, Accountable, Consulted, and Informed roles to work or decisions."}}
};

function save(){localStorage.setItem(stateKey,JSON.stringify(state));}
function ensureTask(id){if(!state.tasks[id])state.tasks[id]={done:false,checks:{},notes:""};return state.tasks[id];}
function formatDate(task){if(!task.date)return task.day;const d=new Date(`${task.date}T12:00:00`);return d.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"});}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
function termButton(term,label){return `<button type="button" class="term" data-term="${term}">${label||glossary[term].title}</button>`;}
function linkifyTerms(text){
  let s=escapeHtml(text);
  const replacements=[
    [/\bCAPM\b/g,()=>termButton("capm","CAPM")],
    [/\bworkstreams?\b/gi,m=>termButton("workstream",m)],
    [/\bdeliverables?\b/gi,m=>termButton("deliverable",m)],
    [/\bdependencies\b|\bdependency\b/gi,m=>termButton("dependency",m)],
    [/\bmilestones?\b/gi,m=>termButton("milestone",m)],
    [/\bstakeholders?\b/gi,m=>termButton("stakeholder",m)],
    [/\brisks?\b/gi,m=>termButton("risk",m)],
    [/\bscope\b/gi,m=>termButton("scope",m)],
    [/\bRACI\b/g,()=>termButton("raci","RACI")]
  ];
  replacements.forEach(([re,fn])=>{s=s.replace(re,fn);});
  return s;
}

function openTerm(term){
  const g=glossary[term];if(!g)return;
  let modal=document.getElementById("termModal");
  if(!modal){
    modal=document.createElement("div");modal.id="termModal";modal.className="term-modal hidden";
    modal.innerHTML='<div class="term-backdrop"></div><section class="term-dialog" role="dialog" aria-modal="true" aria-labelledby="termTitle"><button type="button" class="term-close" aria-label="Close">×</button><div class="kicker">Interactive learning card</div><h2 id="termTitle"></h2><div class="term-subtitle"></div><p class="term-simple"></p><div class="term-example"></div><div class="term-visual"></div><div class="capm-facts hidden"></div><section class="exam-card"><div class="exam-label">CAPM practice-style question</div><p class="exam-note">Original practice question for learning. Not an actual PMI exam question.</p><p class="exam-question"></p><div class="exam-choices"></div><div class="exam-feedback hidden" aria-live="polite"></div></section></section>';
    document.body.appendChild(modal);
    modal.querySelector(".term-close").addEventListener("click",closeTerm);
    modal.querySelector(".term-backdrop").addEventListener("click",closeTerm);
  }
  modal.querySelector("#termTitle").textContent=g.title;
  const subtitle=modal.querySelector(".term-subtitle");subtitle.textContent=g.subtitle||"";subtitle.classList.toggle("hidden",!g.subtitle);
  modal.querySelector(".term-simple").textContent=g.simple;
  modal.querySelector(".term-example").innerHTML=`<strong>Simple example:</strong> ${g.example}`;
  modal.querySelector(".term-visual").innerHTML=g.visual.map(x=>`<div>${x}</div>`).join("");
  const facts=modal.querySelector(".capm-facts");
  if(g.capmInfo){
    facts.classList.remove("hidden");
    facts.innerHTML='<h3>Current CAPM exam snapshot</h3><div class="fact-grid"><div><strong>150</strong><span>questions</span></div><div><strong>180 min</strong><span>exam time</span></div><div><strong>23 hrs</strong><span>PM education required</span></div><div><strong>4</strong><span>content domains</span></div></div><ul><li>Project Management Fundamentals and Core Concepts: 36%</li><li>Predictive, Plan-Based Methodologies: 17%</li><li>Agile Frameworks/Methodologies: 20%</li><li>Business Analysis Frameworks: 27%</li></ul><p class="exam-note">Eligibility also requires a secondary degree or equivalent. Exam structure can change, so this dashboard should be treated as a study aid rather than the official exam authority.</p>';
  }else facts.classList.add("hidden");
  const q=g.question;modal.querySelector(".exam-question").textContent=q.text;
  const choices=modal.querySelector(".exam-choices");choices.innerHTML="";
  const feedback=modal.querySelector(".exam-feedback");feedback.classList.add("hidden");feedback.textContent="";
  q.choices.forEach((choice,i)=>{const b=document.createElement("button");b.type="button";b.className="exam-choice";b.textContent=`${String.fromCharCode(65+i)}. ${choice}`;b.addEventListener("click",()=>{choices.querySelectorAll("button").forEach(x=>x.disabled=true);b.classList.add(i===q.answer?"correct":"incorrect");if(i!==q.answer)choices.children[q.answer].classList.add("correct");feedback.classList.remove("hidden");feedback.innerHTML=`<strong>${i===q.answer?"Correct":"Not quite"}.</strong> ${q.explanation}`;});choices.appendChild(b);});
  modal.classList.remove("hidden");modal.querySelector(".term-close").focus();
}
function closeTerm(){document.getElementById("termModal")?.classList.add("hidden");}
document.addEventListener("click",e=>{const b=e.target.closest(".term");if(b)openTerm(b.dataset.term);});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeTerm();});

function renderStats(){const cats=["PM / CAPM","Technical","Portfolio","Job Search"];const stats=document.getElementById("stats");stats.innerHTML="";for(const cat of cats){const tasks=data.tasks.filter(t=>t.category===cat);const done=tasks.filter(t=>ensureTask(t.id).done).length;const pct=tasks.length?Math.round(done/tasks.length*100):0;const el=document.createElement("div");el.className="stat";el.innerHTML=`<div class="stat-label">${linkifyTerms(cat)}</div><div class="bar"><div class="fill" style="width:${pct}%"></div></div><div class="stat-pct">${pct}%</div>`;stats.appendChild(el);}}

function addWorkstreamLesson(list,task){
  if(task.id!=="sep-w1-1-design-career-project-structure")return;
  const panel=document.createElement("details");panel.className="learning-panel";
  panel.innerHTML=`<summary>Learn: What are the 4 ${termButton("workstream","workstreams")}?</summary><div class="lesson-body"><p>A ${termButton("workstream")} is a major category of related work within a larger project. Your overall project is <strong>Career Transition 2026–27</strong>, and these four areas run at the same time toward the same goal.</p><div class="workstream-grid"><div><strong>PM / ${termButton("capm","CAPM")}</strong><span>Project management capability</span><small>${termButton("capm","CAPM")} · lifecycle · Agile · ${termButton("risk","risk")} · scheduling · Jira · Confluence</small></div><div><strong>Technical Skills</strong><span>Strengthen your technical resume</span><small>Network+ · M365 · Entra ID · AD · Intune · PowerShell · SQL · APIs</small></div><div><strong>Portfolio</strong><span>Prove you can apply the skills</span><small>Mikan · ORB · charter · ${termButton("raci","RACI")} · timeline · risk register</small></div><div><strong>Job Search</strong><span>Turn the work into a new job</span><small>Applications · resumes · government exams · interviews · job tracking</small></div></div><div class="career-flow" aria-label="Career transition workstream visual"><div class="flow-goal"><strong>CAREER TRANSITION 2026–27</strong><span>Goal: New position by March 2027</span></div><div class="flow-arrow">↓</div><div class="flow-streams"><span>PM / CAPM</span><span>TECHNICAL</span><span>PORTFOLIO</span></div><div class="flow-arrow">↓</div><div class="flow-search">JOB SEARCH<br><small>Applications + Interviews</small></div><div class="flow-arrow">↓</div><div class="flow-new">★ NEW POSITION ★</div></div><p class="lesson-note"><strong>PM thinking:</strong> Project → ${termButton("workstream","Workstreams")} → ${termButton("deliverable","Deliverables")} → Tasks → ${termButton("dependency","Dependencies")} → ${termButton("milestone","Milestones")}. Click any underlined industry term for a simple definition, visual, and CAPM-style practice question.</p></div>`;
  list.parentElement.insertBefore(panel,list.nextSibling);
}

function makeTask(task){
  const tpl=document.getElementById("taskTemplate");const el=tpl.content.firstElementChild.cloneNode(true);const s=ensureTask(task.id);el.dataset.id=task.id;el.classList.toggle("done",s.done);
  el.querySelector(".task-title").innerHTML=linkifyTerms(task.title);
  el.querySelector(".minutes").textContent=`${task.minutes} min`;
  el.querySelector(".meta").innerHTML=`${formatDate(task)} · ${linkifyTerms(task.category)}`;
  el.querySelector(".details").innerHTML=linkifyTerms(task.details);
  const main=el.querySelector(".task-check");main.checked=s.done;main.addEventListener("change",()=>{s.done=main.checked;save();renderAll();});
  const list=el.querySelector(".checklist");task.checklist.forEach((item,i)=>{const row=document.createElement("label");row.className="checkrow";const cb=document.createElement("input");cb.type="checkbox";cb.className="subcheck";cb.checked=!!s.checks[i];cb.addEventListener("change",()=>{s.checks[i]=cb.checked;save();});const span=document.createElement("span");span.innerHTML=linkifyTerms(item);row.append(cb,span);list.appendChild(row);});
  addWorkstreamLesson(list,task);
  const notes=el.querySelector(".notes");notes.value=s.notes||"";notes.addEventListener("input",()=>{s.notes=notes.value;save();});return el;
}

function renderDaily(){const root=document.getElementById("daily");root.innerHTML="";const firstUndone=data.tasks.find(t=>!ensureTask(t.id).done)||data.tasks[0];const hero=document.createElement("div");hero.className="today-hero";hero.innerHTML=`<div class="kicker">Next recommended task</div><h2>${linkifyTerms(firstUndone.title)}</h2><div>${formatDate(firstUndone)} · ${firstUndone.minutes} min · ${linkifyTerms(firstUndone.category)}</div>`;root.appendChild(hero);root.appendChild(makeTask(firstUndone));}
function renderWeekly(){const root=document.getElementById("weekly");root.innerHTML="";const days=[...new Set(data.tasks.map(t=>t.day))];days.forEach(day=>{const block=document.createElement("div");block.className="day-block";const h=document.createElement("div");h.className="day-label";h.textContent=day;block.appendChild(h);const grid=document.createElement("div");grid.className="grid";data.tasks.filter(t=>t.day===day).forEach(t=>grid.appendChild(makeTask(t)));block.appendChild(grid);root.appendChild(block);});}
function renderMonthly(){const root=document.getElementById("monthly");root.innerHTML='<div class="grid two"></div>';const grid=root.firstElementChild;data.months.forEach(m=>{const el=document.createElement("article");el.className="card month-card";el.innerHTML=`<div class="kicker">${m.month}</div><h3>${linkifyTerms(m.focus)}</h3><ul>${m.items.map(x=>`<li>${linkifyTerms(x)}</li>`).join("")}</ul>`;grid.appendChild(el);});}
function renderAll(){renderStats();renderDaily();renderWeekly();renderMonthly();}
document.querySelectorAll(".tab").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active"));btn.classList.add("active");document.querySelectorAll(".view").forEach(v=>v.classList.add("hidden"));document.getElementById(btn.dataset.view).classList.remove("hidden");}));
document.getElementById("resetBtn").addEventListener("click",()=>{if(confirm("Reset all checkboxes and notes?")){state={tasks:{}};save();renderAll();}});
fetch("roadmap.json").then(r=>r.json()).then(d=>{data=d;renderAll();}).catch(()=>{document.querySelector("main").innerHTML='<div class="empty">Could not load roadmap.json.</div>';});
