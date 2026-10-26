/* Theme toggle + shared constants. Loaded in <head> (defer-free) so the saved theme applies before first paint. */
(function(){
  var K="ccprep_theme",r=document.documentElement;
  try{var s=localStorage.getItem(K);if(s==="light"||s==="dark")r.setAttribute("data-theme",s)}catch(e){}
  window.CCPREP={reviewed:"October 2026"};
  document.addEventListener("DOMContentLoaded",function(){
    [].forEach.call(document.querySelectorAll("[data-reviewed]"),function(n){n.textContent=window.CCPREP.reviewed});
    var b=document.getElementById("themebtn");if(!b)return;
    function cur(){return r.getAttribute("data-theme")||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")}
    function label(){b.textContent=cur()==="dark"?"Light mode":"Dark mode"}
    label();
    b.addEventListener("click",function(){var n=cur()==="dark"?"light":"dark";r.setAttribute("data-theme",n);try{localStorage.setItem(K,n)}catch(e){}label()});
  });
})();
