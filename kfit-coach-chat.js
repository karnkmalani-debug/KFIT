// KFit Coach tab -- one thread per client between the client and their
// coach: messages, photos, GIFs, files, and automatic update cards (new
// routine, approval results). Used by both the client tracker (role
// 'client') and Merge (role 'coach'). Who may read/write what is enforced
// by the database (kfit-coach-chat.sql); this file is only the screen.
(function(global){
'use strict';
var T='coach_messages', BUCKET='kfit-chat', MAX=10*1024*1024;
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
    return send(sb,clientId,'system',{kind:'event',body:ev.title||'',meta:{type:ev.type||'info',detail:ev.detail||'',popup:ev.popup!==false}})
      .catch(function(){ return {error:null}; });
  }catch(e){ return Promise.resolve({error:null}); }
}
function upload(sb,clientId,file){
  if(!file) return Promise.resolve({error:{message:'No file'}});
  if(file.size>MAX) return Promise.resolve({error:{message:'That file is over 10 MB.'}});
  var safe=String(file.name||'file').replace(/[^a-zA-Z0-9.\-_]/g,'_').slice(-80);
  var path=clientId+'/'+Date.now()+'_'+Math.random().toString(36).slice(2,7)+'_'+safe;
  return sb.storage.from(BUCKET).upload(path,file,{contentType:file.type||'application/octet-stream',upsert:false}).then(function(r){
    if(r.error) return {error:r.error};
    var isImg=/^image\//.test(file.type||'');
    return {error:null,kind:isImg?'image':'file',meta:{path:path,name:file.name||safe,mime:file.type||'',size:file.size}};
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
  if(m.kind==='file') return '📎 '+((m.meta&&m.meta.name)||'File');
  if(m.kind==='event') return m.body||'Update';
  return m.body||'';
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
    +'<div class="kc-bar"><input type="file" class="kc-file" accept="image/*,application/pdf" style="display:none;">'
    +'<button class="kc-btn kc-att" title="Photo, GIF or file" aria-label="Attach a photo, GIF or file">📎</button>'
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
        return '<div class="kc-ev"><span style="font-size:18px;">'+ic+'</span><div style="flex:1;min-width:0;"><b>'+esc(m.body)+'</b>'
          +((m.meta&&m.meta.detail)?'<div class="kc-d">'+esc(m.meta.detail)+'</div>':'')
          +'<div class="kc-d">'+esc(when(m.created_at))+'</div></div></div>';
      }
      var mine=(role==='client')?m.sender==='client':m.sender!=='client';
      var inner='';
      if(m.kind==='image') inner='<a data-path="'+esc(m.meta&&m.meta.path)+'" target="_blank" rel="noopener"><img class="kc-img" data-path="'+esc(m.meta&&m.meta.path)+'" alt="'+esc((m.meta&&m.meta.name)||'Photo')+'"></a>'+(m.body?'<div style="margin-top:6px;">'+esc(m.body)+'</div>':'');
      else if(m.kind==='file') inner='<a data-path="'+esc(m.meta&&m.meta.path)+'" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline;">📎 '+esc((m.meta&&m.meta.name)||'File')+'</a>'+(m.body?'<div style="margin-top:6px;">'+esc(m.body)+'</div>':'');
      else inner=esc(m.body);
      return '<div class="kc-b '+(mine?'kc-me':'kc-them')+'">'+inner+'<div class="kc-t">'+esc(when(m.created_at))+'</div></div>';
    }).join('');
    list.querySelectorAll('[data-path]').forEach(function(node){
      var p=node.getAttribute('data-path'); if(!p) return;
      fileUrl(sb,p).then(function(u){ if(!u) return; if(node.tagName==='IMG') node.src=u; else node.href=u; });
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
    showErr('Uploading...');
    upload(sb,clientId,f).then(function(u){
      if(u.error){ showErr('Upload failed -- '+(u.error.message||'try again')+'.'); return; }
      var caption=(input.value||'').trim();
      return send(sb,clientId,role,{kind:u.kind,body:caption||null,meta:u.meta}).then(function(r){
        if(r.error){ showErr('Not sent -- '+(r.error.message||'try again')+'.'); return; }
        input.value=''; showErr(''); refresh();
      });
    });
  };
  var timer=setInterval(function(){ if(document.visibilityState==='visible'&&el.isConnected&&el.offsetParent!==null) refresh(); },20000);
  refresh();
  return {refresh:refresh,destroy:function(){ alive=false; clearInterval(timer); }};
}

global.KFitChat={mount:mount,fetchThread:fetchThread,unread:unread,markRead:markRead,send:send,postEvent:postEvent,upload:upload,preview:preview,when:when,esc:esc};
})(typeof window!=='undefined'?window:globalThis);
