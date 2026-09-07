
const stateKey = "career-dashboard-state-v1";
let data;
let state = JSON.parse(localStorage.getItem(stateKey) || '{"tasks":{}}');

function save(){ localStorage.setItem(stateKey, JSON.stringify(state)); }
function ensureTask(id){ if(!state.tasks[id]) state.tasks[id]={done:false,checks:{},notes:""}; return state.tasks[id]; }

function renderStats(){
  const cats=["PM / CAPM","Technical","Portfolio","Job Search"];
  const stats=document.getElementById("stats");
  stats.innerHTML="";
  for(const cat of cats){
    const tasks=data.tasks.filter(t=>t.category===cat);
    const done=tasks.filter(t=>ensureTask(t.id).done).length;
    const pct=tasks.length?Math.round(done/tasks.length*100):0;
    const el=document.createElement("div"); el.className="stat";
    el.innerHTML=`<div class="stat-label">${cat}</div><div class="bar"><div class="fill" style="width:${pct}%"></div></div><div class="stat-pct">${pct}%</div>`;
    stats.appendChild(el);
  }
}

function makeTask(task){
  const tpl=document.getElementById("taskTemplate");
  const el=tpl.content.firstElementChild.cloneNode(true);
  const s=ensureTask(task.id);
  el.dataset.id=task.id;
  el.classList.toggle("done",s.done);
  el.querySelector(".task-title").textContent=task.title;
  el.querySelector(".minutes").textContent=`${task.minutes} min`;
  el.querySelector(".meta").textContent=`${task.day} · ${task.category}`;
  el.querySelector(".details").textContent=task.details;
  const main=el.querySelector(".task-check");
  main.checked=s.done;
  main.addEventListener("change",()=>{s.done=main.checked;save();renderAll();});
  const list=el.querySelector(".checklist");
  task.checklist.forEach((item,i)=>{
    const row=document.createElement("label");row.className="checkrow";
    const cb=document.createElement("input");cb.type="checkbox";cb.className="subcheck";cb.checked=!!s.checks[i];
    cb.addEventListener("change",()=>{s.checks[i]=cb.checked;save();});
    const span=document.createElement("span");span.textContent=item;
    row.append(cb,span);list.appendChild(row);
  });
  const notes=el.querySelector(".notes");notes.value=s.notes||"";
  notes.addEventListener("input",()=>{s.notes=notes.value;save();});
  return el;
}

function renderDaily(){
  const root=document.getElementById("daily");root.innerHTML="";
  const firstUndone=data.tasks.find(t=>!ensureTask(t.id).done) || data.tasks[0];
  const hero=document.createElement("div");hero.className="today-hero";
  hero.innerHTML=`<div class="kicker">Next recommended task</div><h2>${firstUndone.title}</h2><div>${firstUndone.day} · ${firstUndone.minutes} min · ${firstUndone.category}</div>`;
  root.appendChild(hero);
  root.appendChild(makeTask(firstUndone));
}

function renderWeekly(){
  const root=document.getElementById("weekly");root.innerHTML="";
  const days=[...new Set(data.tasks.map(t=>t.day))];
  days.forEach(day=>{
    const block=document.createElement("div");block.className="day-block";
    const h=document.createElement("div");h.className="day-label";h.textContent=day;block.appendChild(h);
    const grid=document.createElement("div");grid.className="grid";
    data.tasks.filter(t=>t.day===day).forEach(t=>grid.appendChild(makeTask(t)));
    block.appendChild(grid);root.appendChild(block);
  });
}

function renderMonthly(){
  const root=document.getElementById("monthly");root.innerHTML='<div class="grid two"></div>';
  const grid=root.firstElementChild;
  data.months.forEach(m=>{
    const el=document.createElement("article");el.className="card month-card";
    el.innerHTML=`<div class="kicker">${m.month}</div><h3>${m.focus}</h3><ul>${m.items.map(x=>`<li>${x}</li>`).join("")}</ul>`;
    grid.appendChild(el);
  });
}

function renderAll(){renderStats();renderDaily();renderWeekly();renderMonthly();}

document.querySelectorAll(".tab").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  document.querySelectorAll(".view").forEach(v=>v.classList.add("hidden"));
  document.getElementById(btn.dataset.view).classList.remove("hidden");
}));

document.getElementById("resetBtn").addEventListener("click",()=>{
  if(confirm("Reset all checkboxes and notes?")){
    state={tasks:{}};save();renderAll();
  }
});

fetch("roadmap.json")
  .then(r=>r.json())
  .then(d=>{data=d;renderAll();})
  .catch(()=>{document.querySelector("main").innerHTML='<div class="empty">Could not load roadmap.json. Run this site from a web server or GitHub Pages instead of opening index.html directly.</div>';});
