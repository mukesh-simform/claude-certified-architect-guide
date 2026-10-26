/* CCAF practice bank: choose an option to answer, filter by domain, track progress in this browser.
   Progress is keyed by each question's data-qid, so it survives reordering and new questions. */
(function(){
  var K="ccprep_ccaf_practice_v2",OLD="ccprep_ccaf_practice",saved={};
  try{
    var raw=JSON.parse(localStorage.getItem(K)||"{}");
    if(raw&&typeof raw==="object"&&!Array.isArray(raw))saved=raw;
    localStorage.removeItem(OLD); /* old progress was keyed by DOM position and can't be mapped safely */
  }catch(e){}
  function persist(){try{localStorage.setItem(K,JSON.stringify(saved))}catch(e){}}
  var letters="ABCD";
  var cards=[].slice.call(document.querySelectorAll(".q-card[data-qid]"));

  function correctOf(card){
    if(card.dataset.answer)return card.dataset.answer;
    var l=card.querySelector(".answer-label");
    return l?(l.textContent.match(/[A-D]\s*$/)||[""])[0].trim():"";
  }
  function mark(opt,ok){
    if(opt.querySelector(".q-opt-mark"))return;
    var m=document.createElement("span");
    m.className="q-opt-mark";
    m.innerHTML=ok?'<span aria-hidden="true">✓</span> Correct answer':'<span aria-hidden="true">✗</span> Your answer';
    opt.appendChild(m);
  }
  function reveal(card,pick,silent){
    if(card.classList.contains("done"))return;
    card.classList.add("done");
    var opts=[].slice.call(card.querySelectorAll(".q-opt")),c=correctOf(card);
    opts.forEach(function(o,i){
      o.setAttribute("aria-disabled","true");
      o.setAttribute("aria-pressed",letters[i]===pick?"true":"false");
      if(letters[i]===c){o.classList.add("correct");mark(o,true)}
      else if(letters[i]===pick){o.classList.add("wrong");mark(o,false)}
    });
    var fb=card.querySelector(".q-feedback");
    if(fb&&!silent){
      if(pick===c){fb.className="q-feedback ok";fb.innerHTML='<span aria-hidden="true">✓</span> Correct.'}
      else if(pick&&pick!=="-"){fb.className="q-feedback bad";fb.innerHTML='<span aria-hidden="true">✗</span> Incorrect. The correct answer is '+c+'.'}
      else{fb.className="q-feedback";fb.textContent="The correct answer is "+c+"."}
    }
    var d=card.querySelector("details.answer-block");if(d)d.open=true;
    if(!silent){saved[card.dataset.qid]=pick||"-";persist()}
    paint();
  }
  cards.forEach(function(card){
    [].slice.call(card.querySelectorAll(".q-opt")).forEach(function(o,i){
      o.addEventListener("click",function(){reveal(card,letters[i])});
    });
    var d=card.querySelector("details.answer-block");
    if(d)d.addEventListener("toggle",function(){var s=d.querySelector("summary");if(s)s.textContent=d.open?"Hide answer":"Show answer";if(d.open)reveal(card,"-")});
    var p=saved[card.dataset.qid];
    if(typeof p==="string")reveal(card,p,true);
  });
  function paint(){
    var done=0,ok=0;
    cards.forEach(function(c){var p=saved[c.dataset.qid];if(typeof p==="string"){done++;if(p===correctOf(c))ok++}});
    var s=document.getElementById("score");
    if(s)s.innerHTML="<b>"+done+"</b> / "+cards.length+" answered · <b>"+ok+"</b> correct"+(done?" ("+Math.round(100*ok/done)+"%)":"");
  }
  paint();
  var chips=[].slice.call(document.querySelectorAll(".chip"));
  chips.forEach(function(ch){ch.addEventListener("click",function(){
    chips.forEach(function(x){x.setAttribute("aria-pressed",x===ch?"true":"false")});
    var d=ch.dataset.d;
    cards.forEach(function(c){c.hidden=!!d&&c.dataset.d!==d});
    [].forEach.call(document.querySelectorAll(".scenario-block"),function(sb){
      sb.hidden=![].some.call(sb.querySelectorAll(".q-card"),function(c){return!c.hidden});
    });
  })});
  var r=document.getElementById("reset");
  if(r)r.addEventListener("click",function(){if(!confirm("Clear saved answers in this browser?"))return;saved={};persist();location.reload()});
})();
