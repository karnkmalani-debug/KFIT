// KFit -- photos and videos on consults (progress photos, form checks...).
// Shared by the nutrition app and Merge. Files live in the private meal-photo
// storage, in the client's own folder (knut__<mobile>/consult-...), and are
// kept for good. Photos are made smaller first; videos up to 50 MB.
(function(global){
  'use strict';
  var BUCKET='kfit-meals', MAX_VIDEO=50*1024*1024, MAX_FILE=25*1024*1024;
  function uid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,8); }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  // a photo, 1600 px on the long side, as a JPEG
  function shrink(file){
    return new Promise(function(res,rej){
      var url=URL.createObjectURL(file), img=new Image();
      img.onload=function(){ var s=Math.min(1,1600/Math.max(img.width,img.height)), c=document.createElement('canvas');
        c.width=Math.round(img.width*s); c.height=Math.round(img.height*s); c.getContext('2d').drawImage(img,0,0,c.width,c.height);
        URL.revokeObjectURL(url); c.toBlob(function(b){ b?res(b):rej(new Error('photo')); },'image/jpeg',0.82); };
      img.onerror=function(){ URL.revokeObjectURL(url); rej(new Error('photo')); };
      img.src=url;
    });
  }
  // let her pick photos and videos (several at once)
  function pick(cb){
    var inp=document.createElement('input'); inp.type='file'; inp.accept='image/*,video/*'; inp.multiple=true; inp.style.display='none';
    document.body.appendChild(inp);
    inp.onchange=function(){ var fs=Array.prototype.slice.call(inp.files||[]); inp.remove(); if(fs.length) cb(fs); };
    inp.click();
    setTimeout(function(){ if(inp.isConnected&&!inp.files.length) inp.remove(); },120000);
  }
  // upload one file into the client's folder; resolves {file} or {error}
  async function upload(sb,folder,file,by){
    var isVid=/^video\//.test(file.type||''), isImg=/^image\//.test(file.type||'');
    if(!isVid&&!isImg) return {error:'Photos and videos only'};
    if(isVid&&file.size>MAX_VIDEO) return {error:'That video is over 50 MB. Trim it (Edit → Trim on your phone) and try again.'};
    var body=file, mime=file.type||'', ext='';
    if(isImg){ try{ body=await shrink(file); mime='image/jpeg'; ext='.jpg'; }catch(e){ if(file.size>MAX_FILE) return {error:'Could not read that photo'}; ext='.'+((file.name||'').split('.').pop()||'jpg').toLowerCase(); } }
    else ext='.'+((/quicktime/.test(mime)?'mov':(mime.split('/')[1]||'mp4')).replace(/[^a-z0-9]/g,''));
    var path=folder+'/consult-'+uid()+ext;
    try{
      var up=await sb.storage.from(BUCKET).upload(path,body,{contentType:mime,upsert:false});
      if(up.error) return {error:/mime|type/i.test(up.error.message||'')?'This kind of file can\'t be added yet. Ask your coach.':/size|large|exceed/i.test(up.error.message||'')?'That file is too large.':'Not saved. Check your connection.'};
    }catch(e){ return {error:'Not saved. Check your connection.'}; }
    return {file:{path:path,kind:isVid?'video':'image',mime:mime,at:new Date().toISOString(),by:by||'client'}};
  }
  // upload several, one after another; onDone(list of saved files, list of errors)
  async function uploadAll(sb,folder,files,by,onStep){
    var ok=[], bad=[];
    for(var i=0;i<files.length;i++){ if(onStep) onStep(i+1,files.length); var r=await upload(sb,folder,files[i],by); if(r.file) ok.push(r.file); else bad.push(r.error); }
    return {files:ok,errors:bad};
  }
  // a row of thumbnails; with removable, each gets a ✕ (data-cmx = index)
  function html(files,opts){
    files=Array.isArray(files)?files:[]; opts=opts||{}; if(!files.length) return '';
    var tile='width:72px;height:72px;border-radius:10px;object-fit:cover;background:#2A2B24;flex-shrink:0;cursor:pointer;border:none;padding:0';
    return '<div class="kcm-row" style="display:flex;gap:6px;flex-wrap:wrap;margin:6px 0">'+files.map(function(f,i){
      var x=opts.removable?'<button data-cmx="'+i+'" aria-label="Remove" style="position:absolute;top:-6px;right:-6px;width:22px;height:22px;border-radius:11px;border:none;background:#000;color:#fff;font-size:12px;line-height:22px;padding:0">✕</button>':'';
      var inner=f.kind==='video'
        ?'<button data-cmv="'+esc(f.path)+'" aria-label="Play video" style="'+tile+';display:flex;align-items:center;justify-content:center;font-size:26px;color:#fff">▶</button>'
        :'<img data-cm="'+esc(f.path)+'" alt="Photo" style="'+tile+'">';
      return '<span style="position:relative;display:inline-block">'+inner+x+'</span>';
    }).join('')+'</div>';
  }
  var urls={};
  async function signed(sb,path){ if(urls[path]&&urls[path].t>Date.now()) return urls[path].u;
    var r=await sb.storage.from(BUCKET).createSignedUrl(path,3600); var u=r&&r.data&&r.data.signedUrl; if(u) urls[path]={u:u,t:Date.now()+50*60000}; return u||null; }
  // fill in the pictures, and make photos open full size and videos play
  function hydrate(sb,el,caption){
    if(!el) return;
    el.querySelectorAll('img[data-cm]').forEach(async function(img){ var u=await signed(sb,img.dataset.cm); if(u) img.src=u;
      img.onclick=function(e){ e.stopPropagation(); if(!img.src) return;
        // all photos in this row, swipe between them
        var row=img.closest('.kcm-row'), all=row?Array.prototype.slice.call(row.querySelectorAll('img[data-cm]')).filter(function(x){return x.src;}):[img];
        if(global.KFitUI&&KFitUI.viewer) KFitUI.viewer(all.map(function(x){return x.src;}),Math.max(0,all.indexOf(img)),caption||'Photos'); else window.open(img.src,'_blank'); }; });
    el.querySelectorAll('[data-cmv]').forEach(function(b){ b.onclick=async function(e){ e.stopPropagation(); var u=await signed(sb,b.dataset.cmv); if(!u) return; play(u); }; });
  }
  function play(u){
    var ov=document.createElement('div'); ov.id='kcmPlayer'; ov.style.cssText='position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.94);display:flex;align-items:center;justify-content:center';
    ov.innerHTML='<video src="'+esc(u)+'" controls autoplay playsinline style="max-width:100%;max-height:88vh"></video><button aria-label="Close" style="position:absolute;top:calc(14px + env(safe-area-inset-top));right:14px;width:44px;height:44px;border-radius:22px;border:none;background:#222;color:#fff;font-size:20px">✕</button>';
    document.body.appendChild(ov);
    ov.querySelector('button').onclick=function(){ var v=ov.querySelector('video'); try{ v.pause(); }catch(e){} ov.remove(); };
  }
  global.KFitConsultMedia={pick:pick,upload:upload,uploadAll:uploadAll,html:html,hydrate:hydrate,signed:signed};
})(window);
