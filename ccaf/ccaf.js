/* CCAF guide: active-section highlight and mobile contents drawer. */
(function(){
  var links=[].slice.call(document.querySelectorAll("nav.toc a"));
  var secs=[].slice.call(document.querySelectorAll("[id]")).filter(function(s){return links.some(function(a){return a.getAttribute("href")==="#"+s.id})});
  if("IntersectionObserver" in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){
      if(!e.isIntersecting)return;
      links.forEach(function(a){a.classList.toggle("active",a.getAttribute("href")==="#"+e.target.id)});
    })},{rootMargin:"-20% 0px -70% 0px"});
    secs.forEach(function(s){io.observe(s)});
  }

  var b=document.body,t=document.querySelector(".nav-toggle"),o=document.querySelector(".nav-overlay"),nav=document.querySelector("nav.toc");
  if(!t||!nav)return;
  var mq=window.matchMedia("(max-width:900px)");
  function isOpen(){return b.classList.contains("nav-open")}
  /* On mobile the drawer is off-screen when closed: make it inert so it can't be tabbed into.
     On desktop the sidebar is always visible and must stay usable. */
  function sync(){
    var hide=mq.matches&&!isOpen();
    if(hide)nav.setAttribute("inert","");else nav.removeAttribute("inert");
    t.setAttribute("aria-expanded",isOpen()?"true":"false");
  }
  function open(){
    b.classList.add("nav-open");sync();
    var target=nav.querySelector("a.active")||nav.querySelector("a");
    if(target)target.focus();
  }
  function close(returnFocus){
    if(!isOpen())return;
    b.classList.remove("nav-open");sync();
    if(returnFocus)t.focus();
  }
  t.addEventListener("click",function(){isOpen()?close(true):open()});
  if(o)o.addEventListener("click",function(){close(true)});
  links.forEach(function(a){a.addEventListener("click",function(){close(false)})});
  document.addEventListener("keydown",function(e){if((e.key==="Escape"||e.key==="Esc")&&isOpen()){e.preventDefault();close(true)}});
  if(mq.addEventListener)mq.addEventListener("change",function(){if(!mq.matches)b.classList.remove("nav-open");sync()});
  else if(mq.addListener)mq.addListener(function(){if(!mq.matches)b.classList.remove("nav-open");sync()});
  sync();
})();
