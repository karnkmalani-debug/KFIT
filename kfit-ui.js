// KFit -- small shared screen helpers, used by Merge and both client apps.
//  1. KFitUI.viewer(urls, index, caption): photos open INSIDE the app, swipe
//     between them, and closing returns exactly where you were (nothing
//     underneath is reloaded or moved).
//  2. KFitUI.linkify(text): a long web link becomes a short tappable chip, so
//     it can never spill out of a note or chat bubble.
//  3. KFitUI.gallery(img): open the viewer on a tapped photo, with its
//     neighbouring photos as the other slides.
(function(global){
  'use strict';
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  var cssDone=false;
  function css(){
    if(cssDone||typeof document==='undefined') return; cssDone=true;
    var s=document.createElement('style'); s.id='kfitUiCss';
    s.textContent='body{overflow-wrap:break-word}'
      +'.kf-link{display:inline-flex;align-items:center;gap:4px;max-width:100%;vertical-align:bottom;border:1px solid currentColor;border-radius:8px;padding:2px 8px;margin:2px 0;font-size:.93em;color:inherit;text-decoration:none;opacity:.95;box-sizing:border-box}'
      +'.kf-link>span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}'
      +'#kfViewer{position:fixed;inset:0;z-index:100000;background:#000;display:flex;flex-direction:column;color:#fff;font-family:inherit;touch-action:pan-x pinch-zoom}'
      +'#kfViewer .kfv-top{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:calc(10px + env(safe-area-inset-top,0px)) 14px 8px}'
      +'#kfViewer .kfv-x{width:44px;height:44px;border-radius:22px;border:none;background:rgba(255,255,255,.16);color:#fff;font-size:22px;line-height:1;cursor:pointer;flex-shrink:0}'
      +'#kfViewer .kfv-track{flex:1;min-height:0;display:flex;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none}'
      +'#kfViewer .kfv-track::-webkit-scrollbar{display:none}'
      +'#kfViewer .kfv-slide{flex:0 0 100%;width:100%;height:100%;scroll-snap-align:center;scroll-snap-stop:always;display:flex;align-items:center;justify-content:center}'
      +'#kfViewer .kfv-slide img{max-width:100%;max-height:100%;object-fit:contain}'
      +'#kfViewer .kfv-bot{text-align:center;font-size:14px;padding:8px 14px calc(14px + env(safe-area-inset-bottom,0px));min-height:24px}'
      +'#kfViewer .kfv-nav{position:absolute;top:50%;transform:translateY(-50%);width:44px;height:44px;border-radius:22px;border:none;background:rgba(255,255,255,.16);color:#fff;font-size:24px;cursor:pointer}'
      +'@media (hover:none){#kfViewer .kfv-nav{display:none}}';
    document.head.appendChild(s);
  }
  // ---------- links ----------
  function linkLabel(u){
    try{
      var x=new URL(u), host=x.hostname.replace(/^www\./,''), best='';
      x.pathname.split('/').forEach(function(seg){ var d=seg; try{ d=decodeURIComponent(seg); }catch(e){}
        d=d.replace(/\.[a-z0-9]{2,5}$/i,''); if(/[a-z]{3}/i.test(d)&&/[-_ ]/.test(d)&&d.length>best.length) best=d; });
      best=best.replace(/[-_+]+/g,' ').trim(); if(best.length>30) best=best.slice(0,29).trim()+'…';
      return host+(best?' · '+best:'');
    }catch(e){ return u.length>40?u.slice(0,39)+'…':u; }
  }
  // text in, safe HTML out
  function linkify(text){
    css();
    return esc(text).replace(/(https?:\/\/[^\s<]+)/g,function(u){
      var tail=''; var m=u.match(/[.,;:!?)\]]+$/); if(m){ tail=m[0]; u=u.slice(0,-tail.length); }
      var raw=u.replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"');
      return '<a class="kf-link" href="'+u+'" target="_blank" rel="noopener" title="'+u+'">🔗 <span>'+esc(linkLabel(raw))+'</span></a>'+tail;
    });
  }
  // ---------- photo viewer ----------
  var open=null;
  function close(fromPop){
    if(!open) return; var o=open; open=null;
    document.removeEventListener('keydown',o.key); window.removeEventListener('popstate',o.pop);
    if(o.el.parentNode) o.el.parentNode.removeChild(o.el);
    document.documentElement.style.overflow=o.prevOverflow;
    try{ window.scrollTo(o.sx,o.sy); }catch(e){}
    if(!fromPop){ try{ if(history.state&&history.state.kfViewer) history.back(); }catch(e){} }
  }
  function viewer(urls,index,caption){
    urls=(urls||[]).filter(Boolean); if(!urls.length||typeof document==='undefined') return;
    css(); if(open) close();
    var i0=Math.max(0,Math.min(urls.length-1,index||0));
    var el=document.createElement('div'); el.id='kfViewer'; el.setAttribute('role','dialog'); el.setAttribute('aria-modal','true'); el.setAttribute('aria-label','Photos');
    el.innerHTML='<div class="kfv-top"><span class="kfv-cap" style="font-size:14px;opacity:.9;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(caption||'')+'</span><button class="kfv-x" aria-label="Close">✕</button></div>'
      +'<div class="kfv-track">'+urls.map(function(u,i){return '<div class="kfv-slide"><img src="'+esc(u)+'" alt="Photo '+(i+1)+' of '+urls.length+'"></div>';}).join('')+'</div>'
      +(urls.length>1?'<button class="kfv-nav" data-d="-1" style="left:10px" aria-label="Previous photo">‹</button><button class="kfv-nav" data-d="1" style="right:10px" aria-label="Next photo">›</button>':'')
      +'<div class="kfv-bot"></div>';
    var o={el:el,sx:window.scrollX,sy:window.scrollY,prevOverflow:document.documentElement.style.overflow};
    document.body.appendChild(el); document.documentElement.style.overflow='hidden';
    var track=el.querySelector('.kfv-track'), bot=el.querySelector('.kfv-bot');
    function cur(){ return Math.round(track.scrollLeft/Math.max(1,track.clientWidth)); }
    function paint(){ var c=cur(); bot.textContent=urls.length>1?urls.map(function(_,i){return i===c?'●':'○';}).join(' ')+'   '+(c+1)+' of '+urls.length:''; }
    function goTo(i,smooth){ i=Math.max(0,Math.min(urls.length-1,i)); try{ track.scrollTo({left:i*track.clientWidth,behavior:smooth?'smooth':'auto'}); }catch(e){ track.scrollLeft=i*track.clientWidth; } }
    track.addEventListener('scroll',paint,{passive:true});
    el.querySelector('.kfv-x').onclick=function(){ close(); };
    el.querySelectorAll('.kfv-nav').forEach(function(b){ b.onclick=function(){ goTo(cur()+(+b.dataset.d),true); }; });
    o.key=function(e){ if(e.key==='Escape') close(); else if(e.key==='ArrowRight') goTo(cur()+1,true); else if(e.key==='ArrowLeft') goTo(cur()-1,true); };
    o.pop=function(){ close(true); };
    document.addEventListener('keydown',o.key);
    // the phone's Back button closes the photo instead of leaving the screen
    try{ history.pushState(Object.assign({},history.state||{},{kfViewer:1}),''); window.addEventListener('popstate',o.pop); }catch(e){}
    open=o; goTo(i0,false); paint(); setTimeout(function(){ if(open===o){ goTo(i0,false); paint(); } },60);
    return {close:close};
  }
  // Open the viewer for a tapped <img>, with the other photos beside it.
  function gallery(img,caption){
    if(!img||!img.src) return;
    var box=img.parentNode, all=box?Array.prototype.slice.call(box.querySelectorAll('img')).filter(function(x){return x.src&&x.parentNode===box;}):[img];
    if(all.indexOf(img)<0) all=[img];
    viewer(all.map(function(x){return x.src;}),all.indexOf(img),caption);
  }
  global.KFitUI={viewer:viewer,gallery:gallery,linkify:linkify,linkLabel:linkLabel,closeViewer:function(){close();}};
  if(typeof document!=='undefined'){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',css); else css(); }
})(typeof window!=='undefined'?window:this);
