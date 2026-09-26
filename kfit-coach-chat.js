// KFit Coach tab -- one thread per client between the client and their
// coach: messages, photos, GIFs, files, and automatic update cards (new
// routine, approval results). Used by both the client tracker (role
// 'client') and Merge (role 'coach'). Who may read/write what is enforced
// by the database (kfit-coach-chat.sql); this file is only the screen.
(function(global){
'use strict';
var T='coach_messages', BUCKET='kfit-chat', MAX=10*1024*1024, MAX_VIDEO=50*1024*1024;
// KFit is only the courier: photos, videos and files are kept 30 days, then
// deleted. Either side can "Save to phone" before that.
var KEEP_DAYS=30, KEEP_MS=KEEP_DAYS*24*60*60*1000;
function isExpired(m){ return m&&m.created_at&&(Date.now()-Date.parse(m.created_at))>KEEP_MS; }
var ICON={routine:'🏋️',workout:'📅',decision:'✅',declined:'✕',info:'💬'};

function esc(t){ return String(t==null?'':t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function when(iso){
  if(!iso) return '';
  var d=new Date(iso), now=new Date();
  var M=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var h=d.getHours(), ap=h>=12?'pm':'am'; h=h%12||12;
  var t=h+':'+String(d.getMinutes()).padStart(2,'0')+' '+ap;
  return d.toDateString()===now.toDateString()?t:(d.getDate()+' '+M[d.getMonth()]+', '+t);
}
function fetchThread(sb,clientId,limit){
  return sb.from(T).select('*').eq('client_id',clientId).order('created_at',{ascending:false}).limit(limit||200)
    .then(function(r){ return {data:(r.data||[]).reverse(),error:r.error||null}; });
}
// Unread for the given side. Client: messages/cards from the coach side.
// Coach: messages from clients (optionally one client).
function unread(sb,role,clientId){
  var q=sb.from(T).select('id,client_id,sender,kind,body,meta,created_at');
  if(clientId) q=q.eq('client_id',clientId);
  if(role==='client') q=q.neq('sender','client').is('read_by_client_at',null);
  else q=q.eq('sender','client').is('read_by_coach_at',null);
  return q.order('created_at',{ascending:true}).then(function(r){ return {data:r.data||[],error:r.error||null}; });
}
function markRead(sb,role,clientId){
  var q=sb.from(T).update(role==='client'?{read_by_client_at:new Date().toISOString()}:{read_by_coach_at:new Date().toISOString()}).eq('client_id',clientId);
  q=role==='client'?q.neq('sender','client').is('read_by_client_at',null):q.eq('sender','client').is('read_by_coach_at',null);
  return q.then(function(r){ return {error:r.error||null}; });
}
function send(sb,clientId,role,o){
  var row={client_id:clientId,sender:role,kind:o.kind||'text',body:o.body||null,meta:o.meta||{}};
  return sb.from(T).insert(row).then(function(r){ return {error:r.error||null}; });
}
// Coach side: an update card in the client's thread (never blocks the action that caused it).
function postEvent(sb,clientId,ev){
  try{
    var meta={type:ev.type||'info',detail:ev.detail||''}; ['routineId','name','dates'].forEach(function(k){ if(ev[k]!=null) meta[k]=ev[k]; });
    return send(sb,clientId,'system',{kind:'event',body:ev.title||'',meta:meta})
      .catch(function(){ return {error:null}; });
  }catch(e){ return Promise.resolve({error:null}); }
}
// Phone photos are often 3-8 MB: shrink them to max 1600px JPEG first so
// they send quickly and reliably on mobile data. GIFs (animation) and PDFs
// are sent as they are. If a photo can't be read here (rare formats), the
// original is sent instead.
function shrinkImage(file){
  return new Promise(function(resolve){
    if(!/^image\/(jpeg|png|webp|heic|heif)$/i.test(file.type||'')||typeof document==='undefined') return resolve(file);
    var url=URL.createObjectURL(file), img=new Image();
    img.onload=function(){
      try{
        // As small as a phone screen needs: 1280px, JPEG quality 0.7 (~100-150 KB).
        var max=1280, w=img.naturalWidth, h=img.naturalHeight, k=Math.min(1,max/Math.max(w,h));
        if(k===1&&file.size<300*1024){ URL.revokeObjectURL(url); return resolve(file); }
        var c=document.createElement('canvas'); c.width=Math.round(w*k); c.height=Math.round(h*k);
        c.getContext('2d').drawImage(img,0,0,c.width,c.height);
        c.toBlob(function(b){
          URL.revokeObjectURL(url);
          if(!b||(k===1&&b.size>=file.size)) return resolve(file);
          var name=String(file.name||'photo').replace(/\.[^.]+$/,'')+'.jpg';
          try{ resolve(new File([b],name,{type:'image/jpeg'})); }catch(e){ b.name=name; resolve(b); }
        },'image/jpeg',0.7);
      }catch(e){ URL.revokeObjectURL(url); resolve(file); }
    };
    img.onerror=function(){ URL.revokeObjectURL(url); resolve(file); };
    img.src=url;
  });
}
function upload(sb,clientId,original){
  if(!original) return Promise.resolve({error:{message:'No file'}});
  return shrinkImage(original).then(function(file){ return uploadOnce(sb,clientId,file,1); });
}
function uploadOnce(sb,clientId,file,retries){
  var isVid=/^video\//.test(file.type||'');
  if(isVid&&file.size>MAX_VIDEO) return Promise.resolve({error:{message:'This video is over 50 MB (about 30 seconds). Trim it to the key reps (your phone\'s Edit → Trim) and send again'}});
  if(!isVid&&file.size>MAX) return Promise.resolve({error:{message:'That file is over 10 MB. Try a smaller one.'}});
  var safe=String(file.name||'file').replace(/[^a-zA-Z0-9.\-_]/g,'_').slice(-80);
  var path=clientId+'/'+Date.now()+'_'+Math.random().toString(36).slice(2,7)+'_'+safe;
  return sb.storage.from(BUCKET).upload(path,file,{contentType:file.type||'application/octet-stream',upsert:false}).then(function(r){
    if(r.error&&retries>0&&!/mime|type|size|large|policy|security/i.test(r.error.message||'')) return uploadOnce(sb,clientId,file,retries-1);
    if(r.error) return {error:{message:/mime|type/i.test(r.error.message||'')?'That file type can\'t be sent -- photos, GIFs, short videos and PDFs only.':(/size|large|exceed/i.test(r.error.message||'')?'That file is too big to send.':(r.error.message||'upload failed'))}};
    var isImg=/^image\//.test(file.type||'');
    return {error:null,kind:isImg?'image':(isVid?'video':'file'),meta:{path:path,name:file.name||safe,mime:file.type||'',size:file.size}};
  });
}
var _urlCache={};
function fileUrl(sb,path){
  var hit=_urlCache[path];
  if(hit&&hit.until>Date.now()) return Promise.resolve(hit.url);
  return sb.storage.from(BUCKET).createSignedUrl(path,3600).then(function(r){
    var url=r&&r.data&&(r.data.signedUrl||r.data.signedURL);
    if(url) _urlCache[path]={url:url,until:Date.now()+50*60*1000};
    return url||'';
  }).catch(function(){ return ''; });
}
function preview(m){
  if(!m) return '';
  if(m.kind==='image') return (m.meta&&/gif/i.test(m.meta.mime||''))?'GIF':'📷 Photo';
  if(m.kind==='video') return '🎬 Video';
  if(m.kind==='file') return '📎 '+((m.meta&&m.meta.name)||'File');
  if(m.kind==='event') return m.body||'Update';
  return m.body||'';
}

// Save a photo/video/file onto this phone. On phones this opens the share
// sheet ("Save Image" / "Save Video" puts it in Photos); elsewhere it downloads.
function saveToPhone(sb,path,name,mime){
  return fileUrl(sb,path).then(function(u){
    if(!u) throw new Error('This file is no longer available.');
    return fetch(u).then(function(r){ if(!r.ok) throw new Error('Could not download it.'); return r.blob(); });
  }).then(function(b){
    var f; try{ f=new File([b],name||'kfit-file',{type:mime||b.type}); }catch(e){ f=null; }
    if(f&&navigator.canShare&&navigator.canShare({files:[f]})) return navigator.share({files:[f]}).then(function(){return 'shared';}).catch(function(e){ if(e&&e.name==='AbortError') return 'cancelled'; throw e; });
    var a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download=name||'kfit-file';
    document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); },4000);
    return 'downloaded';
  });
}
// Delete files older than 30 days from the given client folders (the
// database only allows deleting files that are past their 30 days).
function cleanupExpired(sb,folders){
  var removed=0, cutoff=Date.now()-KEEP_MS-60*60*1000;
  return (folders||[]).reduce(function(p,folder){
    return p.then(function(){
      return sb.storage.from(BUCKET).list(folder,{limit:1000}).then(function(r){
        var old=((r&&r.data)||[]).filter(function(o){ return o&&o.name&&o.created_at&&Date.parse(o.created_at)<cutoff; }).map(function(o){ return folder+'/'+o.name; });
        if(!old.length) return;
        return sb.storage.from(BUCKET).remove(old).then(function(x){ if(!x||!x.error) removed+=old.length; });
      }).catch(function(){});
    });
  },Promise.resolve()).then(function(){ return removed; });
}
function linkify(t){
  return esc(t).replace(/(https?:\/\/[^\s<]+)/g,function(u){ return '<a href="'+u+'" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline;word-break:break-all;">'+u+'</a>'; });
}

var CSS='.kc-wrap{display:flex;flex-direction:column;height:100%;min-height:0;font-family:"DM Sans",sans-serif;}'
+'.kc-list{flex:1;overflow-y:auto;padding:12px 4px;display:flex;flex-direction:column;gap:10px;}'
+'.kc-b{max-width:80%;padding:9px 12px;border-radius:14px;font-size:15px;line-height:1.45;white-space:pre-wrap;word-wrap:break-word;}'
+'.kc-them{align-self:flex-start;background:var(--surf2,#26241f);color:var(--text,#f2efe8);border:1px solid var(--border,#3a372f);}'
+'.kc-me{align-self:flex-end;background:var(--sage,#3a6e40);color:#fff;}'
+'.kc-t{font-size:11px;opacity:.7;margin-top:3px;}'
+'.kc-ev{align-self:stretch;display:flex;gap:10px;align-items:center;border:1px solid var(--border,#3a372f);border-radius:12px;padding:9px 12px;background:transparent;color:var(--text,#f2efe8);font-size:14px;}'
+'.kc-ev b{font-weight:700;}.kc-ev .kc-d{font-size:12px;color:var(--muted,#9a958a);margin-top:1px;}'
+'.kc-img{display:block;max-width:220px;max-height:260px;border-radius:12px;border:1px solid var(--border,#3a372f);}'
+'.kc-vid{display:block;width:230px;max-width:100%;max-height:320px;border-radius:12px;background:#000;}'
+'.kc-save{margin-top:6px;padding:4px 10px;border-radius:10px;border:1px solid currentColor;background:transparent;color:inherit;font-family:inherit;font-size:12px;font-weight:700;cursor:pointer;opacity:.9;}'
+'.kc-gone{font-size:13px;opacity:.75;font-style:italic;}'
+'.kc-bar{display:flex;gap:8px;align-items:flex-end;padding:10px 4px calc(10px + env(safe-area-inset-bottom,0px));border-top:1px solid var(--border,#3a372f);background:var(--bg,transparent);}'
+'.kc-in{flex:1;min-height:40px;max-height:120px;resize:none;padding:9px 12px;border-radius:12px;border:1px solid var(--border,#3a372f);background:var(--surf2,#26241f);color:var(--text,#f2efe8);font-family:inherit;font-size:15px;}'
+'.kc-btn{flex-shrink:0;height:40px;min-width:40px;padding:0 12px;border-radius:12px;border:1px solid var(--border,#3a372f);background:transparent;color:var(--text,#f2efe8);font-size:16px;cursor:pointer;}'
+'.kc-send{background:var(--sage,#3a6e40);border-color:var(--sage,#3a6e40);color:#fff;font-weight:700;font-size:14px;}'
+'.kc-empty{color:var(--muted,#9a958a);text-align:center;padding:30px 10px;font-size:14px;line-height:1.5;}'
+'.kc-err{color:var(--terra,#c8783f);font-size:13px;padding:0 6px 6px;}';
function injectCss(){
  if(document.getElementById('kfitChatCss')) return;
  var st=document.createElement('style'); st.id='kfitChatCss'; st.textContent=CSS; document.head.appendChild(st);
}

// mount(el,{sb,clientId,role,emptyText,onRead}) -> {refresh,destroy}
function mount(el,o){
  injectCss();
  var sb=o.sb, clientId=o.clientId, role=o.role, alive=true, lastSig='';
  el.innerHTML='<div class="kc-wrap"><div class="kc-list" aria-live="polite"><div class="kc-empty">Loading...</div></div>'
    +'<div class="kc-err" style="display:none;"></div>'
    +'<div class="kc-bar"><input type="file" class="kc-file" accept="image/*,video/*,application/pdf" style="display:none;">'
    +'<button class="kc-btn kc-att" title="Photo, video, GIF or file" aria-label="Attach a photo, video, GIF or file">📎</button>'
    +'<textarea class="kc-in" rows="1" placeholder="'+(role==='client'?'Message your coach':'Message your client')+'"></textarea>'
    +'<button class="kc-btn kc-send">Send</button></div></div>';
  var list=el.querySelector('.kc-list'), input=el.querySelector('.kc-in'), fileIn=el.querySelector('.kc-file'),
      err=el.querySelector('.kc-err'), sendBtn=el.querySelector('.kc-send');
  function showErr(t){ err.textContent=t||''; err.style.display=t?'block':'none'; }
  function render(msgs){
    var sig=msgs.map(function(m){return m.id;}).join(',');
    if(sig===lastSig) return; lastSig=sig;
    var atBottom=list.scrollHeight-list.scrollTop-list.clientHeight<80;
    if(!msgs.length){ list.innerHTML='<div class="kc-empty">'+esc(o.emptyText||'No messages yet.')+'</div>'; return; }
    list.innerHTML=msgs.map(function(m){
      if(m.kind==='event'){
        var ic=ICON[(m.meta&&m.meta.type)||'info']||'💬';
        var acts=(o.actionsFor&&o.actionsFor(m))||[];
        return '<div class="kc-ev"><span style="font-size:18px;">'+ic+'</span><div style="flex:1;min-width:0;"><b>'+esc(m.body)+'</b>'
          +((m.meta&&m.meta.detail)?'<div class="kc-d">'+esc(m.meta.detail)+'</div>':'')
          +'<div class="kc-d">'+esc(when(m.created_at))+'</div></div>'
          +(acts.length?'<div style="display:flex;gap:6px;flex-shrink:0;">'+acts.map(function(a,ai){
              return '<button class="kc-act" data-mid="'+m.id+'" data-ai="'+ai+'" style="padding:6px 10px;border-radius:8px;font-family:inherit;font-size:12px;font-weight:800;cursor:pointer;'
                +(a.style==='danger'?'background:transparent;border:1px solid var(--terra,#c8783f);color:var(--terra,#c8783f);':(a.style==='muted'?'background:transparent;border:1px solid var(--border,#3a372f);color:var(--muted,#9a958a);':'background:var(--sage,#3a6e40);border:none;color:#0c0c0a;'))
                +'"'+(a.disabled?' disabled':'')+'>'+esc(a.label)+'</button>'; }).join('')+'</div>':'')
          +'</div>';
      }
      var mine=(role==='client')?m.sender==='client':m.sender!=='client';
      var inner='', mp=esc(m.meta&&m.meta.path), mn=esc((m.meta&&m.meta.name)||''), mm=esc((m.meta&&m.meta.mime)||'');
      var save='<br><button class="kc-save" data-save="'+mp+'" data-name="'+mn+'" data-mime="'+mm+'">⬇ Save to phone</button>';
      var cap=m.body?'<div style="margin-top:6px;">'+linkify(m.body)+'</div>':'';
      if(['image','video','file'].indexOf(m.kind)>-1&&isExpired(m)){
        inner='<span class="kc-gone">'+(m.kind==='image'?'📷 Photo':m.kind==='video'?'🎬 Video':'📎 '+mn)+' expired -- KFit keeps files for '+KEEP_DAYS+' days</span>'+cap;
      }
      else if(m.kind==='image') inner='<img class="kc-img" data-path="'+mp+'" alt="'+(mn||'Photo')+'">'+cap+save;
      else if(m.kind==='video') inner='<video class="kc-vid" data-path="'+mp+'" controls playsinline preload="none"></video>'+cap+save;
      else if(m.kind==='file') inner='<a data-path="'+mp+'" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline;">📎 '+(mn||'File')+'</a>'+cap+save;
      else inner=linkify(m.body);
      return '<div class="kc-b '+(mine?'kc-me':'kc-them')+'">'+inner+'<div class="kc-t">'+esc(when(m.created_at))+'</div></div>';
    }).join('');
    list.querySelectorAll('[data-path]').forEach(function(node){
      var p=node.getAttribute('data-path'); if(!p) return;
      // (a video only downloads when someone taps play: preload="none")
      fileUrl(sb,p).then(function(u){ if(!u) return; if(node.tagName==='IMG'||node.tagName==='VIDEO') node.src=u; else node.href=u; });
    });
    list.querySelectorAll('.kc-act').forEach(function(btn){
      btn.onclick=function(){
        var id=btn.getAttribute('data-mid'), m=msgs.find(function(x){return String(x.id)===id;});
        var a=m&&o.actionsFor&&o.actionsFor(m)[Number(btn.getAttribute('data-ai'))];
        if(a&&a.run){ Promise.resolve(a.run(m)).then(function(){ lastSig=''; render(msgs); }); }
      };
    });
    list.querySelectorAll('[data-save]').forEach(function(btn){
      btn.onclick=function(){
        var t=btn.textContent; btn.disabled=true; btn.textContent='Saving...';
        saveToPhone(sb,btn.getAttribute('data-save'),btn.getAttribute('data-name'),btn.getAttribute('data-mime')).then(function(r){
          btn.textContent=r==='cancelled'?t:'✓ Saved'; btn.disabled=false;
        }).catch(function(e){ btn.textContent=t; btn.disabled=false; showErr((e&&e.message)||'Could not save it.'); });
      };
    });
    if(atBottom||o._first!==false){ list.scrollTop=list.scrollHeight; o._first=false; }
  }
  function refresh(){
    if(!alive) return Promise.resolve();
    return fetchThread(sb,clientId).then(function(r){
      if(!alive) return;
      if(r.error){ showErr('Could not load messages ('+(r.error.message||'connection issue')+').'); return; }
      showErr(''); render(r.data);
      return markRead(sb,role,clientId).then(function(){ if(o.onRead) o.onRead(); });
    });
  }
  function doSend(){
    var text=(input.value||'').trim();
    if(!text) return;
    sendBtn.disabled=true;
    send(sb,clientId,role,{kind:'text',body:text}).then(function(r){
      sendBtn.disabled=false;
      if(r.error){ showErr('Not sent -- '+(r.error.message||'check your connection')+'. Your text is still in the box.'); return; }
      input.value=''; showErr(''); refresh();
    });
  }
  sendBtn.onclick=doSend;
  input.addEventListener('keydown',function(e){ if(e.key==='Enter'&&!e.shiftKey&&!/iPhone|iPad|Android/i.test(navigator.userAgent)){ e.preventDefault(); doSend(); } });
  el.querySelector('.kc-att').onclick=function(){ fileIn.click(); };
  fileIn.onchange=function(){
    var f=fileIn.files&&fileIn.files[0]; fileIn.value='';
    if(!f) return;
    showErr((/^image\//.test(f.type||'')?'Sending photo':/^video\//.test(f.type||'')?'Sending video -- this can take a minute on mobile data':'Sending file')+'... keep the app open.');
    sendBtn.disabled=true; el.querySelector('.kc-att').disabled=true;
    upload(sb,clientId,f).then(function(u){
      sendBtn.disabled=false; el.querySelector('.kc-att').disabled=false;
      if(u.error){ showErr('Not sent -- '+(u.error.message||'try again')+'. Nothing was posted.'); return; }
      var caption=(input.value||'').trim();
      return send(sb,clientId,role,{kind:u.kind,body:caption||null,meta:u.meta}).then(function(r){
        if(r.error){ showErr('Not sent -- '+(r.error.message||'try again')+'.'); return; }
        input.value=''; showErr(''); refresh();
      });
    });
  };
  var timer=setInterval(function(){ if(document.visibilityState==='visible'&&el.isConnected&&el.offsetParent!==null) refresh(); },20000);
  refresh();
  return {refresh:refresh,rerender:function(){ lastSig=''; return refresh(); },destroy:function(){ alive=false; clearInterval(timer); }};
}

global.KFitChat={KEEP_DAYS:KEEP_DAYS,isExpired:isExpired,saveToPhone:saveToPhone,cleanupExpired:cleanupExpired,linkify:linkify,shrinkImage:shrinkImage,mount:mount,fetchThread:fetchThread,unread:unread,markRead:markRead,send:send,postEvent:postEvent,upload:upload,preview:preview,when:when,esc:esc};
})(typeof window!=='undefined'?window:globalThis);
