// KFit -- phone notifications for CLIENTS (nutrition and fitness apps).
// She gets a buzz when her coach replies, sends a plan, or messages her.
// KFitClientPush.card(el, {sb, mobile, app})  -> shows a small "Turn on" card
// KFitClientPush.onOpen(fn)                   -> fn(url) when a notification is tapped
(function(global){
  'use strict';
  function supported(){ return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window; }
  function standalone(){ return (window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches)||window.navigator.standalone===true; }
  function iPhone(){ return /iPhone|iPad/.test(navigator.userAgent||''); }
  function b64(b){var p='='.repeat((4-b.length%4)%4),s=(b+p).replace(/-/g,'+').replace(/_/g,'/'),r=atob(s),o=new Uint8Array(r.length);for(var i=0;i<r.length;i++)o[i]=r.charCodeAt(i);return o;}
  async function current(){ try{ if(!supported()) return null; var reg=await navigator.serviceWorker.ready; return await reg.pushManager.getSubscription(); }catch(e){ return null; } }
  async function turnOn(sb,mobile,app){
    if(!supported()){ alert(iPhone()&&!standalone()?'On iPhone, notifications work when KFit is opened from its home-screen icon.\n\nIn Safari: tap Share, then Add to Home Screen. Open KFit from that icon and turn notifications on there.':'This phone can\'t show notifications from here.'); return false; }
    var perm=await Notification.requestPermission();
    if(perm!=='granted'){ alert('Notifications are blocked. You can allow them in your phone\'s Settings, then try again.'); return false; }
    var k=await sb.functions.invoke('kfit-push',{body:{action:'public_key'}});
    if(k.error||!k.data||!k.data.publicKey){ alert('Notifications aren\'t ready yet. Please try again later.'); return false; }
    var reg=await navigator.serviceWorker.ready, sub=await reg.pushManager.getSubscription();
    if(!sub) sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64(k.data.publicKey)});
    var j=sub.toJSON();
    var r=await sb.from('client_push_subscriptions').upsert({mobile:String(mobile).replace(/\D/g,''),app:app,endpoint:j.endpoint,p256dh:j.keys.p256dh,auth:j.keys.auth},{onConflict:'endpoint'});
    if(r.error){ alert('Could not turn them on: '+r.error.message); return false; }
    try{ await sb.functions.invoke('kfit-push',{body:{action:'test_client',endpoint:j.endpoint}}); }catch(e){}
    return true;
  }
  async function turnOff(sb){ var sub=await current(); if(sub){ try{ await sb.from('client_push_subscriptions').delete().eq('endpoint',sub.endpoint); }catch(e){} try{ await sub.unsubscribe(); }catch(e){} } }
  async function card(el,opts){
    if(!el||!opts||!opts.sb) return;
    var sub=await current(), on=!!sub&&Notification.permission==='granted';
    var hidden=false; try{ hidden=localStorage.getItem('kfit_push_card_hidden')==='1'; }catch(e){}
    if(opts.compact&&(on||hidden)){ el.innerHTML=''; return; }
    // line: a single quiet row (the fitness LOG screen) instead of the full card
    if(opts.line){
      el.innerHTML='<div style="background:var(--card,var(--surf));border:1px solid var(--line,var(--border));border-radius:14px;padding:4px 6px 4px 14px;display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:10px;font-size:15px">'
        +'<button class="kcp-on" style="flex:1;text-align:left;background:none;border:none;color:var(--ink,var(--text));font-family:inherit;font-size:15px;padding:8px 0;cursor:pointer">🔔 <b>Turn on notifications</b></button>'
        +'<button class="kcp-hide" aria-label="Not now" style="background:none;border:none;color:var(--muted);font-size:16px;padding:8px 10px;cursor:pointer">✕</button></div>';
      el.querySelector('.kcp-on').onclick=async function(){ this.disabled=true; if(await turnOn(opts.sb,opts.mobile,opts.app||'nutrition')) el.innerHTML=''; else this.disabled=false; };
      el.querySelector('.kcp-hide').onclick=function(){ try{ localStorage.setItem('kfit_push_card_hidden','1'); }catch(e){} el.innerHTML=''; };
      return;
    }
    el.innerHTML='<div style="background:var(--card,var(--surf));border:1px solid var(--line,var(--border));border-radius:16px;padding:12px 14px;display:flex;flex-direction:column;gap:8px;margin-bottom:12px">'
      +'<div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><div style="font-weight:700;font-size:15px">🔔 Notifications</div>'
      +(on?'<span style="color:var(--leaf,#8FD1A2);font-weight:700;font-size:13px">On ✓</span>':'<button class="kcp-on" style="min-height:38px;border-radius:10px;border:none;background:var(--green,#2F6B4A);color:#fff;font-weight:700;padding:0 14px;font-family:inherit">Turn on</button>')+'</div>'
      +'<div style="font-size:13px;color:var(--muted)">'+(on?'You\'ll get a buzz when your coach replies or sends you something.':'Get a buzz when your coach replies or sends you something.'+(iPhone()&&!standalone()?' On iPhone, open KFit from its home-screen icon first.':''))+'</div>'
      +(on&&opts.nudge?'<div class="kcp-nudge" style="display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:14px;border-top:1px solid var(--line,var(--border));padding-top:8px"><label style="display:flex;gap:8px;align-items:center"><input type="checkbox" class="kcp-nudge-on" style="width:20px;height:20px"> <span>Remind me if I haven\'t logged by</span></label><input type="time" class="kcp-nudge-time" value="14:00" style="min-height:36px;border-radius:8px;border:1px solid var(--line2,var(--border));background:var(--sand,var(--surf2));color:var(--ink,var(--text));padding:0 6px;font-size:15px"></div>':'')
      +(on?'<button class="kcp-off" style="align-self:flex-start;background:none;border:none;color:var(--muted);font-size:13px;padding:0;font-family:inherit;text-decoration:underline">Turn off on this phone</button>'
          :(opts.compact?'<button class="kcp-hide" style="align-self:flex-start;background:none;border:none;color:var(--muted);font-size:13px;padding:0;font-family:inherit">Not now</button>':''))+'</div>';
    var nb=el.querySelector('.kcp-nudge');
    if(nb){
      var m=String(opts.mobile).replace(/\D/g,''), cb=nb.querySelector('.kcp-nudge-on'), tm=nb.querySelector('.kcp-nudge-time');
      try{ var pr=await opts.sb.from('client_push_prefs').select('nudge_time').eq('mobile',m); var nt=pr.data&&pr.data[0]&&pr.data[0].nudge_time; cb.checked=!!nt; if(nt) tm.value=nt; }catch(e){}
      var save=async function(){ var v=/^\d{2}:\d{2}$/.test(tm.value)?tm.value:'14:00'; var r=await opts.sb.from('client_push_prefs').upsert({mobile:m,nudge_time:cb.checked?v:null},{onConflict:'mobile'}); if(r.error) alert('Not saved. Check your connection.'); };
      cb.onchange=save; tm.onchange=function(){ if(cb.checked) save(); };
    }
    var b=el.querySelector('.kcp-on'); if(b) b.onclick=async function(){ b.disabled=true; if(await turnOn(opts.sb,opts.mobile,opts.app||'nutrition')) card(el,Object.assign({},opts,{compact:false})); else b.disabled=false; };
    var o=el.querySelector('.kcp-off'); if(o) o.onclick=async function(){ await turnOff(opts.sb); card(el,opts); };
    var h=el.querySelector('.kcp-hide'); if(h) h.onclick=function(){ try{ localStorage.setItem('kfit_push_card_hidden','1'); }catch(e){} el.innerHTML=''; };
  }
  function onOpen(fn){
    try{ if(/[?&]open=/.test(location.search)){ var u=location.pathname+location.search; setTimeout(function(){ fn(u); try{ history.replaceState(null,'',location.pathname); }catch(e){} },1200); } }catch(e){}
    try{ navigator.serviceWorker&&navigator.serviceWorker.addEventListener('message',function(ev){ if(ev.data&&ev.data.type==='kfit-open') fn(ev.data.url); }); }catch(e){}
  }
  global.KFitClientPush={card:card,onOpen:onOpen,turnOn:turnOn,turnOff:turnOff};
})(window);
