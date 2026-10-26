(function(){
"use strict";
var store={
  get:function(k){try{return localStorage.getItem(k)}catch(e){return null}},
  set:function(k,v){try{localStorage.setItem(k,v)}catch(e){}},
  del:function(k){try{localStorage.removeItem(k)}catch(e){}}
};
/* parse stored JSON; anything that is not a plain object (null, array, number, string) counts as empty */
function loadObj(k){try{var v=JSON.parse(store.get(k)||"{}");return(v&&typeof v==="object"&&!Array.isArray(v))?v:{}}catch(e){return{}}}
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e}
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
function perm(n){var a=[];for(var i=0;i<n;i++)a.push(i);return shuffle(a)}

/* ================= QUESTIONS ================= */
/* Every item has a stable id. Saved answers store the ORIGINAL option indices, so the display order
   can be reshuffled on every attempt (practice: each page load or retry; exam: each run). */
var Q=window.CCAP_Q||{};
var BYID={};
Object.keys(Q).forEach(function(k){Q[k].forEach(function(q){q.k=k;BYID[q.id]=q})});
function stemText(q){return q.s+(q.m&&q.s.indexOf("Select")<0?" (Select "+(q.a.length===2?"two":"all that apply")+".)":"")}
function same(sel,a){return sel.length===a.length&&sel.every(function(x){return a.indexOf(x)>-1})}
function letters(idxs,order){return idxs.map(function(o){return String.fromCharCode(65+order.indexOf(o))}).sort().join(", ")||"none"}
var uid=0;
/* one question card: optional meta row, stem, options grouped and labelled by the stem */
function buildQ(q,num,name,order,meta){
  var d=el("div","q");
  if(meta)d.appendChild(meta);
  if(q.src)d.appendChild(el("span","src",q.src));
  var sid="qs"+(++uid);
  var st=el("div","stem",(num?num+". ":"")+stemText(q));st.id=sid;d.appendChild(st);
  var g=el("div","opts");g.setAttribute("role",q.m?"group":"radiogroup");g.setAttribute("aria-labelledby",sid);
  var opts=[];
  order.forEach(function(orig,pos){
    var l=el("label","opt"),i=document.createElement("input");
    i.type=q.m?"checkbox":"radio";i.name=name;i.value=String(orig);
    l.appendChild(i);l.appendChild(el("span",null,String.fromCharCode(65+pos)+". "+q.o[orig]));
    g.appendChild(l);opts.push({l:l,i:i,orig:orig});
  });
  d.appendChild(g);
  return {box:d,opts:opts};
}
function picked(opts){return opts.filter(function(o){return o.i.checked}).map(function(o){return o.orig})}
function mark(opts,q,sel){
  opts.forEach(function(o){
    o.i.disabled=true;o.l.classList.remove("ok","no","miss");
    var r=q.a.indexOf(o.orig)>-1,c=sel.indexOf(o.orig)>-1;
    if(c&&r)o.l.classList.add("ok");else if(c)o.l.classList.add("no");else if(r)o.l.classList.add("miss");
  });
}

/* ================= NAV + PROGRESS ================= */
var chaps=[].slice.call(document.querySelectorAll("section.chap"));
var nav=document.getElementById("nav");
chaps.forEach(function(c){
  var li=document.createElement("li"),a=document.createElement("a");
  a.href="#"+c.id;a.dataset.id=c.id;
  a.appendChild(el("span","dot"));a.appendChild(el("span",null,c.dataset.title));
  if(c.dataset.w)a.appendChild(el("span","wt",c.dataset.w));
  li.appendChild(a);nav.appendChild(li);
});
var links=[].slice.call(nav.querySelectorAll("a"));
function spy(){var y=window.scrollY+140,cur=chaps[0];chaps.forEach(function(c){if(c.offsetTop<=y)cur=c});links.forEach(function(a){a.classList.toggle("on",a.dataset.id===cur.id)})}
window.addEventListener("scroll",spy,{passive:true});spy();

/* reading plan tiles */
var plan=document.getElementById("plan");
chaps.forEach(function(c){
  if(!c.dataset.min||!plan)return;
  var d=el("div"),bar=el("div","bar"),i=el("i");
  d.appendChild(el("b",null,c.dataset.min+" min"));d.appendChild(el("span",null,c.dataset.title+" · "+c.dataset.w));
  i.style.width=Math.round(parseFloat(c.dataset.w)/19*100)+"%";bar.appendChild(i);d.appendChild(bar);plan.appendChild(d);
});

/* recall toggle */
var hb=document.getElementById("hidebtn"),rt=document.getElementById("recall");
if(hb&&rt){hb.addEventListener("click",function(){var on=rt.classList.toggle("hide");hb.setAttribute("aria-pressed",on?"true":"false");hb.textContent=on?"Show answers":"Hide answers"})}

/* ================= PRACTICE ================= */
var RK="ccprep_ccap_results_v2";   /* v1 was keyed by array index; it is ignored */
var results=loadObj(RK);
Object.keys(results).forEach(function(id){var r=results[id];if(!BYID[id]||!r||typeof r!=="object"||!Array.isArray(r.sel))delete results[id]});
var total=0;Object.keys(Q).forEach(function(k){total+=Q[k].length});
function save(){store.set(RK,JSON.stringify(results))}
function paint(){
  var ans=0,cor=0,setsDone=0;
  Object.keys(Q).forEach(function(k){
    var n=0,c=0;Q[k].forEach(function(q){var r=results[q.id];if(r){n++;if(r.ok)c++}});
    ans+=n;cor+=c;if(n===Q[k].length)setsDone++;
    var e=document.getElementById("ds_"+k);if(e)e.textContent=n+"/"+Q[k].length+" answered · "+c+" correct";
    var a=nav.querySelector('a[data-id="'+k+'"]');if(a)a.classList.toggle("done",n===Q[k].length);
  });
  document.getElementById("progbar").style.width=(total?Math.round(100*ans/total):0)+"%";
  document.getElementById("progtxt").textContent=setsDone+" of "+Object.keys(Q).length+" question sets done";
  document.getElementById("qtotal").textContent=ans+" of "+total+" questions · "+(ans?Math.round(100*cor/ans):0)+"% correct";
}
function practiceCard(q,num){
  var wrap=el("div"),order=perm(q.o.length);
  function render(focus){
    var c=buildQ(q,num,"p_"+q.id,order);
    var row=el("div","qrow");
    var b=el("button","btn primary","Check answer");b.type="button";
    var rb=el("button","btn","Try again");rb.type="button";rb.hidden=true;
    row.appendChild(b);row.appendChild(rb);c.box.appendChild(row);
    var ex=el("div","exp");ex.setAttribute("aria-live","polite");c.box.appendChild(ex);
    function show(sel,ok){
      mark(c.opts,q,sel);ex.textContent="";
      ex.appendChild(el("b",null,ok?"Correct. ":"Not quite. Answer: "+letters(q.a,order)+". "));
      ex.appendChild(document.createTextNode(q.e));
      b.disabled=true;rb.hidden=false;
    }
    b.addEventListener("click",function(){
      var sel=picked(c.opts);
      if(!sel.length){ex.textContent="Select an answer first.";return}
      var ok=same(sel,q.a);results[q.id]={ok:ok,sel:sel};save();paint();show(sel,ok);
    });
    rb.addEventListener("click",function(){delete results[q.id];save();paint();order=perm(q.o.length);render(true)});
    var r=results[q.id];
    if(r){c.opts.forEach(function(o){o.i.checked=r.sel.indexOf(o.orig)>-1});show(r.sel,!!r.ok)}
    wrap.textContent="";wrap.appendChild(c.box);
    if(focus&&c.opts[0])c.opts[0].i.focus();
  }
  render(false);
  return {box:wrap,reset:function(){order=perm(q.o.length);render(false)}};
}
[].forEach.call(document.querySelectorAll(".practice"),function(box){
  var k=box.dataset.domain,list=Q[k];if(!list)return;
  var h=el("h3",null,"Practice questions ");var ds=el("span","ds");ds.id="ds_"+k;h.appendChild(ds);box.appendChild(h);
  box.appendChild(el("p","srcl","Original practice questions written with AI assistance for this playbook. Not official, not real exam items and not a prediction of the exam. Option order changes on each attempt."));
  var cards=[];
  list.forEach(function(q,qi){var c=practiceCard(q,qi+1);box.appendChild(c.box);cards.push(c)});
  var tb=el("div","toolbar"),rs=el("button","btn","Reset this set");rs.type="button";
  rs.addEventListener("click",function(){
    if(!confirm("Clear your saved answers for this question set?"))return;
    list.forEach(function(q){delete results[q.id]});save();cards.forEach(function(c){c.reset()});paint();
  });
  tb.appendChild(rs);box.appendChild(tb);
});

/* ================= OBJECTIVE MAP ================= */
var OBJ=[
["D1","Solution Design & Architecture · 17%"],
["1.1","Translate business problems into Claude solutions","Job → constraints → success metric with baseline and target → solution shape. Rules, thresholds and exact maths stay in code.","d1-frame"],
["1.2","Design end-to-end architectures","Input → validate → process → validate output → act → feedback. Output is untrusted until checked; retries idempotent; fail loudly.","d1-e2e"],
["1.3","Select workflow, agentic or augmented LLM patterns","Least autonomy that works. Workflows (chain, route, parallelize, orchestrator-workers, evaluator-optimizer) when steps are known; an agent only when they can't be listed and errors are recoverable.","d1-patterns"],
["1.4","Design multi-agent systems and orchestration","Orchestrator briefs each worker with objective, scope, schema and limits, then reconciles coverage. Subagents report to a parent; agent teams talk peer to peer at higher cost; workflows fan out at scale. Multi-agent ≈ 15× chat tokens.","d1-teams"],
["1.5","Apply decomposition techniques","Owner per step: Claude (language), systems (rules, records, live state), humans (approvals). Fixed steps → chain; run-time subtasks → orchestrator; per-unit passes plus an integration pass.","d1-decomp"],
["1.6","Align to business value pillars","Baseline vs pilot on the business metric plus a guardrail metric; cost per task, not per token; p95 SLAs.","d1-e2e"],
["D2","Models, Prompting & Context · 13%"],
["2.1","Select Claude models on trade-offs","Start on the balanced default; move only on per-segment eval evidence with a rollback rule set first; route by difficulty; tune effort before switching tier.","d2-models"],
["2.2","Design system prompts, templates and guardrails","Role, scope, refusal path, output contract. Fixed scaffolding outside variable slots; untrusted content delimited as data; hard limits in code.","d2-prompts"],
["2.3","Apply zero-shot, few-shot and chain-of-thought","Zero-shot first. Format failure → structured outputs or examples; boundary failure → boundary examples; reasoning failure → CoT or thinking. Model last.","d2-tech"],
["2.4","Optimize context windows and tokens","Everything counts toward the window; measure with usage and count_tokens; documents first, question last; compaction, context editing, memory tool; re-inject app state.","d2-context"],
["2.5","Reuse via caching, modular prompts and Skills","Static first, dynamic last, breakpoint between. A change breaks its level and below (tools → system → messages). Stable governed procedures become Skills.","d2-reuse"],
["D3","Integration · 19%"],
["3.1","Evaluate capability bloat","Remove unneeded tools (beats confirm, log or prompt). Narrow, namespaced tools. Past 30–50 tools selection degrades: use tool search.","d3-bloat"],
["3.2","Find authentication and authorization gaps","Per-user delegated, scoped credentials enforced in the backend. No token passthrough, no secrets in context; remote MCP uses OAuth 2.1 with PKCE.","d3-auth"],
["3.3","Justify accuracy–latency trade-offs","Find the dominant latency term. Streaming helps perceived latency only; route by risk; batch only when nobody waits.","d3-latency"],
["3.4","Choose observability strategies at scale","One trace ID end to end; log versions, chunks, tool calls, tokens, stop reasons, p95; sample and score quality; alert on drift.","d3-obs"],
["3.5","Design RAG chunking and indexing","Chunk by structure; hybrid dense + BM25; retrieve broad, rerank narrow; contextual retrieval; one pinned embedder; under ~200K tokens skip RAG and cache.","d3-rag"],
["3.6","Match retrieval to data shape","Live state and aggregates → tool call; large stable text → hybrid RAG; small stable reference → cached prompt; code → agentic search.","d3-retrieval"],
["3.7","Select MCP, API/CLI or agent-to-agent","One app → direct tool use; tools shared across clients → MCP (M×N → M+N); independent agents owned by others → A2A.","d3-connect"],
["3.8","Progressive discovery vs monolithic context","Defer at 10+ tools or 10K+ tokens; never defer the search tool; keep 3–5 hot tools loaded; resend all tools each turn; compact long histories.","d3-progressive"],
["D4","Evaluation, Testing & Optimization · 16%"],
["4.1","Define metrics for accuracy, latency, cost, safety, security","Labels → exact match; fields → precision/recall/F1; meaning → embeddings; tone → LLM rubric; tail latency → p95; safety two-sided (harm and over-refusal).","d4-metrics"],
["4.2","Design datasets and test frameworks","Stratified golden set plus edge, adversarial and regression cases. Code graders first, calibrated LLM judge, humans for ground truth. Confidence intervals, paired comparisons.","d4-datasets"],
["4.3","Run A/B tests and iterate","One variable, metric and sample size fixed in advance, guardrail metrics. Shadow → canary → A/B.","d4-ab"],
["4.4","Diagnose prompt failure, hallucination, model mismatch","Cheapest decisive check at the likeliest layer: retrieval after a refresh, stop_reason for truncation, prompt for format, grounding vs generation for hallucination, segment eval for mismatch.","d4-diagnose"],
["4.5","Optimize tokens, latency and cost","Caching, routing, batch for offline work, trimmed context, output caps. Never cut required context.","d4-optimize"],
["4.6","Monitor with logging and observability tools","Percentiles, stop reasons, cost per task, cache hits, sampled quality. OTEL settings by layer: content, cost, delivery.","d4-monitor"],
["D5","Governance, Safety & Risk · 14%"],
["5.1","Implement guardrails and safety controls","Layers: input screen, prompt, action (least privilege, approvals), output checks, monitoring. Remove the risk where possible.","d5-guardrails"],
["5.2","Identify risks and failure modes","Hallucination, direct vs indirect injection, excessive agency, leakage, over-reliance, over-refusal, bias and drift, each with its control.","d5-risks"],
["5.3","Apply human-in-the-loop validation","Approval before irreversible or high-stakes actions; confidence routing for medium risk; sampling for low. Usage Policy high-risk uses need qualified review plus disclosure.","d5-hitl"],
["5.4","Comply with GDPR, HIPAA, FedRAMP","GDPR: minimize, residency, erasure everywhere. HIPAA: BAA, eligible features only. FedRAMP: the authorized route decides delivery. ZDR and inference_geo are separate controls.","d5-compliance"],
["5.5","Address bias, fairness, transparency","Measure per segment; remove protected attributes and proxies; fairness metrics conflict, so choose by harm; disclose AI, cite sources, humans on consequential decisions.","d5-ethics"],
["D6","Stakeholders & Lifecycle · 14%"],
["6.1","Conduct structured discovery","Problem, users, baseline, metric, data, constraints and risk before technology. 'We need an agent' is a hypothesis.","d6-discovery"],
["6.2","Communicate decisions and trade-offs","ADRs with options and revisit conditions; each audience's terms; eval evidence, not opinion.","d6-comms"],
["6.3","Align expectations, feedback loops and SLAs","Measured rates on a versioned eval set, never 'always right'. An SLA names metric, percentile, measurement point, window, population and breach behaviour.","d6-sla"],
["6.4","Document and guide implementation","Diagrams, ADRs, prompt and model registry, eval suite, runbook, owners: the team can operate, change and roll back without you.","d6-docs"],
["6.5","Support lifecycle phases","Discovery → design → build and pilot (acceptance criteria first) → handoff → monitor → iterate through regression tests.","d6-lifecycle"],
["D7","Developer Productivity · 7%"],
["7.1","Configure Claude tools for teams","CLAUDE.md guides; settings, deny rules and hooks enforce; managed settings for org policy; MCP scopes local, project, user.","d7-config"],
["7.2","Improve developer workflows","Explore → plan → code → commit; give Claude a way to verify (tests); headless claude -p in CI with scoped permissions and turn limits; humans review PRs.","d7-workflows"],
["7.3","Support debugging and operations","Real evidence first; read-only access in incidents; checkpoints and /rewind for bad sessions; every fix becomes a regression test.","d7-debug"]
];
var objState={};try{objState=JSON.parse(store.get("ccprep_ccap_objectives")||"{}")||{}}catch(e){objState={}}
var objBody=document.getElementById("objmap"),objCount=document.getElementById("objcount");
function objPaint(){var n=0,t=0;OBJ.forEach(function(o){if(o.length>2){t++;if(objState[o[0]])n++}});if(objCount)objCount.textContent=n+" of "+t+" objectives ticked"}
if(objBody){
  OBJ.forEach(function(o){
    var tr=document.createElement("tr");
    if(o.length===2){tr.className="grp";var td=document.createElement("td");td.colSpan=4;td.textContent=o[1];tr.appendChild(td);objBody.appendChild(tr);return}
    var a=document.createElement("td");a.textContent=o[0];
    var b=document.createElement("td");var l=document.createElement("a");l.href="#"+o[3];l.textContent=o[1];b.appendChild(l);
    var c=document.createElement("td");c.textContent=o[2];
    var d=document.createElement("td");d.className="c";var cb=document.createElement("input");cb.type="checkbox";cb.setAttribute("aria-label","Confident on "+o[0]);cb.checked=!!objState[o[0]];
    if(cb.checked)tr.classList.add("done");
    cb.addEventListener("change",function(){if(cb.checked)objState[o[0]]=1;else delete objState[o[0]];tr.classList.toggle("done",cb.checked);store.set("ccprep_ccap_objectives",JSON.stringify(objState));objPaint()});
    d.appendChild(cb);tr.appendChild(a);tr.appendChild(b);tr.appendChild(c);tr.appendChild(d);objBody.appendChild(tr);
  });
  document.getElementById("objreset").addEventListener("click",function(){objState={};store.set("ccprep_ccap_objectives","{}");[].forEach.call(objBody.querySelectorAll("input"),function(x){x.checked=false});[].forEach.call(objBody.querySelectorAll("tr.done"),function(x){x.classList.remove("done")});objPaint()});
  objPaint();
}

/* ================= TIMED EXAM ================= */
var QUOTA={d1:11,d2:8,d3:12,d4:10,d5:9,d6:9,d7:4};
var DNAME={d1:"Solution Design",d2:"Models & Prompting",d3:"Integration",d4:"Evaluation",d5:"Governance & Safety",d6:"Stakeholders & Lifecycle",d7:"Developer Productivity"};
var FACTS_CAP=4,DUR=120*60*1000,EK="ccprep_ccap_exam_v1";
var exBox=document.getElementById("examBox"),exTimer=null,running=false;
var live=el("div","vh");live.setAttribute("role","status");live.setAttribute("aria-live","polite");
if(exBox)exBox.parentNode.insertBefore(live,exBox);
function announce(t){live.textContent="";setTimeout(function(){live.textContent=t},60)}
function domOf(q){return q.k==="facts"?q.dom:q.k}
function saveEx(st){store.set(EK,JSON.stringify(st))}
function onLeave(e){if(!running)return;e.preventDefault();e.returnValue="";return ""}
window.addEventListener("beforeunload",onLeave);

/* draw a run: per-domain quotas, recall ("facts") items capped so the mix stays scenario-based */
function draw(){
  var pools={};Object.keys(QUOTA).forEach(function(d){pools[d]=[]});
  Object.keys(Q).forEach(function(k){Q[k].forEach(function(q){var d=domOf(q);if(pools[d])pools[d].push(q)})});
  var facts=0,ids=[];
  Object.keys(QUOTA).forEach(function(d){
    var p=shuffle(pools[d].slice()),take=[];
    for(var i=0;i<p.length&&take.length<QUOTA[d];i++){
      if(p[i].k==="facts"){if(facts>=FACTS_CAP)continue;facts++}
      take.push(p[i].id);
    }
    ids=ids.concat(take);
  });
  shuffle(ids);
  var order={};ids.forEach(function(id){order[id]=perm(BYID[id].o.length)});
  return {v:1,ids:ids,order:order,ans:{},flags:{},end:Date.now()+DUR,done:false};
}
/* a stored run is used only if every id still exists and every saved order is a valid permutation */
function validRun(st){
  if(!st||st.v!==1||!Array.isArray(st.ids)||!st.ids.length||typeof st.order!=="object"||!st.order||typeof st.end!=="number")return false;
  if(!st.ans||typeof st.ans!=="object")st.ans={};
  if(!st.flags||typeof st.flags!=="object")st.flags={};
  return st.ids.every(function(id){
    var q=BYID[id],o=st.order[id];
    if(!q||!Array.isArray(o)||o.length!==q.o.length)return false;
    if(!o.slice().sort().every(function(x,i){return x===i}))return false;
    if(st.ans[id]&&!Array.isArray(st.ans[id]))delete st.ans[id];
    return true;
  });
}
function grade(st){
  var per={},score=0;Object.keys(QUOTA).forEach(function(d){per[d]={c:0,t:0}});
  st.ids.forEach(function(id){var q=BYID[id],d=domOf(q),sel=st.ans[id]||[],ok=same(sel,q.a);if(per[d]){per[d].t++;if(ok)per[d].c++}if(ok)score++});
  return {per:per,score:score};
}

function exIntro(){
  if(!exBox)return;exBox.textContent="";
  var p=el("div","box");
  p.appendChild(el("p",null,"Sit it in one go, like the real exam: no notes, no tabs. Flag any answer you guessed, so you can review it afterwards. You can submit early. Your run is saved in this browser, so a reload resumes it."));
  var b=el("button","btn primary","Start timed exam (63 questions, 120 minutes)");b.type="button";
  b.addEventListener("click",function(){var st=draw();saveEx(st);exRun(st,true)});
  p.appendChild(b);exBox.appendChild(p);
}

function exRun(st,scroll){
  exBox.textContent="";running=true;
  var cards=[];
  st.ids.forEach(function(id,i){
    var q=BYID[id];
    var meta=el("div","meta");meta.appendChild(el("span","dtag","Question "+(i+1)+" of "+st.ids.length));
    var fl=el("button","flagb",st.flags[id]?"Flagged":"Flag");fl.type="button";fl.setAttribute("aria-pressed",st.flags[id]?"true":"false");
    fl.setAttribute("aria-label","Flag question "+(i+1)+" for review");
    meta.appendChild(fl);
    var c=buildQ(q,0,"ex_"+id,st.order[id],meta);
    var a=st.ans[id]||[];
    c.opts.forEach(function(o){
      o.i.checked=a.indexOf(o.orig)>-1;
      o.i.addEventListener("change",function(){var sel=picked(c.opts);if(sel.length)st.ans[id]=sel;else delete st.ans[id];saveEx(st);upd()});
    });
    fl.addEventListener("click",function(){var on=!st.flags[id];if(on)st.flags[id]=1;else delete st.flags[id];fl.setAttribute("aria-pressed",on?"true":"false");fl.textContent=on?"Flagged":"Flag";saveEx(st);upd()});
    exBox.appendChild(c.box);cards.push(id);
  });
  var bar=el("div","exbar"),clock=el("span","clock"),stat=el("span","srcl");
  var sub=el("button","btn primary","Submit");sub.type="button";
  sub.addEventListener("click",function(){
    var un=st.ids.filter(function(id){return!(st.ans[id]&&st.ans[id].length)}).length;
    var msg=un?"Submit with "+un+" unanswered question"+(un>1?"s":"")+"? You can't change answers afterwards.":"Submit your answers now? You can't change them afterwards.";
    if(confirm(msg))finish(st);
  });
  bar.appendChild(clock);bar.appendChild(stat);bar.appendChild(sub);exBox.appendChild(bar);
  function upd(){
    var a=st.ids.filter(function(id){return st.ans[id]&&st.ans[id].length}).length,f=Object.keys(st.flags).length;
    stat.textContent=a+"/"+st.ids.length+" answered · "+f+" flagged";
  }
  var left0=st.end-Date.now(),warned5=left0<=5*60000,warned1=left0<=60000;
  function tick(){
    var left=Math.max(0,st.end-Date.now()),m=Math.floor(left/60000),sx=Math.floor(left%60000/1000);
    clock.textContent=m+":"+(sx<10?"0":"")+sx+" left";clock.classList.toggle("low",left<10*60000);
    if(!warned5&&left<=5*60000){warned5=true;announce("5 minutes remaining.")}
    if(!warned1&&left<=60000){warned1=true;announce("1 minute remaining.")}
    if(left<=0)finish(st);
  }
  if(exTimer)clearInterval(exTimer);exTimer=setInterval(tick,1000);upd();tick();
  if(scroll)exBox.scrollIntoView({block:"start"});
}

function finish(st){
  if(st.done)return;
  st.done=true;running=false;if(exTimer)clearInterval(exTimer);
  saveEx(st);exReview(st,true);
}

function exReview(st,justFinished){
  exBox.textContent="";
  var g=grade(st),n=st.ids.length,pct=Math.round(100*g.score/n);
  var res=el("div","box");
  var hd=el("h3","verdict",g.score+" / "+n+" correct ("+pct+"%)");hd.tabIndex=-1;res.appendChild(hd);
  var gate=pct>=80?"Ready: book the exam if no domain is below 70%.":pct>=72?"Close: one session on the weakest domain, then another run.":"Not yet: repeat Day 1 for the two weakest domains, then another run.";
  res.appendChild(el("p",null,gate));
  res.appendChild(el("p","srcl","The 72% and 80% thresholds are raw percent-correct proxies for this practice bank. The real exam reports a scaled score (720 of 1,000 to pass), which does not map directly to percent correct."));
  var tw=el("div","tw");tw.tabIndex=0;tw.setAttribute("role","region");tw.setAttribute("aria-label","Score by domain (table)");
  var tb=document.createElement("table"),th=document.createElement("thead"),hr=document.createElement("tr");
  ["Domain","Correct","Score"].forEach(function(t){hr.appendChild(el("th",null,t))});th.appendChild(hr);tb.appendChild(th);
  var body=document.createElement("tbody");
  Object.keys(QUOTA).forEach(function(d){var p=g.per[d],pc=p.t?Math.round(100*p.c/p.t):0;var tr=document.createElement("tr");[DNAME[d],p.c+" / "+p.t,pc+"%"+(pc<70?"  ← below 70%":"")].forEach(function(v){tr.appendChild(el("td",null,v))});body.appendChild(tr)});
  tb.appendChild(body);tw.appendChild(tb);res.appendChild(tw);
  var row=el("div","toolbar");
  var all=el("button","btn","All questions"),wr=el("button","btn","Only wrong, unanswered or flagged");
  all.type=wr.type="button";
  var again=el("button","btn primary","Start a new run");again.type="button";
  again.addEventListener("click",function(){var ns=draw();saveEx(ns);exRun(ns,true)});
  var back=el("button","btn","Close results");back.type="button";
  back.addEventListener("click",function(){store.del(EK);exIntro()});
  row.appendChild(all);row.appendChild(wr);row.appendChild(again);row.appendChild(back);res.appendChild(row);
  exBox.appendChild(res);
  var items=[];
  st.ids.forEach(function(id,i){
    var q=BYID[id],order=st.order[id],sel=st.ans[id]||[],ok=same(sel,q.a),fl=!!st.flags[id];
    var meta=el("div","meta");meta.appendChild(el("span","dtag","Question "+(i+1)+" of "+n+(fl?" · flagged":"")));
    var c=buildQ(q,0,"rv_"+id,order,meta);
    c.opts.forEach(function(o){o.i.checked=sel.indexOf(o.orig)>-1});
    mark(c.opts,q,sel);
    var ex=el("div","exp");
    ex.appendChild(el("b",null,ok?"Correct. ":(sel.length?"Wrong. ":"Unanswered. ")));
    ex.appendChild(document.createTextNode("Your answer: "+(sel.length?letters(sel,order):"none")+". Correct answer: "+letters(q.a,order)+". "+q.e+" "));
    var d=domOf(q),lk=el("a",null,"Review: "+DNAME[d]);lk.href="#"+d;ex.appendChild(lk);
    c.box.appendChild(ex);exBox.appendChild(c.box);
    items.push({box:c.box,keep:!ok||fl});
  });
  function filter(onlyMiss){
    items.forEach(function(it){it.box.hidden=onlyMiss&&!it.keep});
    all.setAttribute("aria-pressed",onlyMiss?"false":"true");wr.setAttribute("aria-pressed",onlyMiss?"true":"false");
  }
  all.addEventListener("click",function(){filter(false)});wr.addEventListener("click",function(){filter(true)});
  filter(false);
  if(justFinished){
    announce("Exam submitted. Score "+g.score+" of "+n+", "+pct+" percent.");
    exBox.scrollIntoView({block:"start"});hd.focus({preventScroll:true});
  }
}

if(exBox){
  var saved=loadObj(EK);
  if(validRun(saved)){
    if(saved.done)exReview(saved,false);
    else exRun(saved,false);
  }else{store.del(EK);exIntro()}
}

var ra=document.getElementById("resetall");
if(ra)ra.addEventListener("click",function(){
  if(!confirm("Clear all saved answers, ticks and any saved timed exam in this browser?"))return;
  running=false;store.del(RK);store.del("ccprep_ccap_results");store.del(EK);store.set("ccprep_ccap_objectives","{}");location.reload();
});

paint();
})();
