/* Old URLs that no longer exist.
   - On the 404 page (data-mode="404"): forward the old single-file pages to their new homes.
   - On the home page: the CCAF guide used to be the site root, so index.html#d3-cicd style
     links are forwarded to the same anchor under /ccaf/. */
(function(){
  var me=document.currentScript,mode=me&&me.getAttribute("data-mode");
  if(mode==="404"){
    var base=me.getAttribute("data-base"),
        moved={"questions.html":"ccaf/practice.html","courses.html":"courses/"};
    for(var old in moved){
      if(location.pathname.slice(-old.length-1)==="/"+old){location.replace(base+moved[old]+location.search+location.hash);return}
    }
    return;
  }
  var h=location.hash;
  if(!h||h.length<2)return;
  var id;try{id=decodeURIComponent(h.slice(1))}catch(e){return}
  if(!document.getElementById(id))location.replace("ccaf/index.html"+h);
})();
