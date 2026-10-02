// KFit -- "Join a coach" (shared by the fitness and nutrition apps).
// When a client opens a coach's invite link (?coach=<id>) and they already
// belong to a different coach, this asks them once: "Join <coach>?".
// Tapping Join is their consent; the new coach approves it in Merge.
// Past billing stays with the old coach; everything else moves with them.
(function(global){
  'use strict';
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function inviteFromUrl(){
    try{ var c=new URLSearchParams(location.search).get('coach'); return /^[0-9a-f-]{36}$/i.test(c||'')?c:null; }catch(e){ return null; }
  }
  function card(html){
    var ov=document.createElement('div');
    ov.id='kfitJoinCoach';
    ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;font-family:inherit';
    ov.innerHTML='<div role="dialog" aria-modal="true" style="max-width:420px;width:100%;background:#1C1D18;color:#F3EEE3;border:1px solid #3E3F36;border-radius:20px;padding:20px;display:flex;flex-direction:column;gap:12px">'+html+'</div>';
    document.body.appendChild(ov); return ov;
  }
  var BTN='min-height:48px;border-radius:14px;font-weight:700;font-size:16px;font-family:inherit;width:100%;cursor:pointer';
  // opts: {sb, mobile, name, onToast(msg)}
  async function check(opts){
    var invite=inviteFromUrl(); if(!invite||!opts||!opts.sb||!opts.mobile) return;
    var seenKey='kfit_join_asked_'+invite;
    try{ if(sessionStorage.getItem(seenKey)) return; }catch(e){}
    var r; try{ r=await opts.sb.rpc('kfit_my_coach',{p_mobile:String(opts.mobile),p_invite:invite}); }catch(e){ return; }
    var d=r&&r.data; if(!d||d.status!=='ok'||!d.invite_valid||d.coach===invite) return;
    try{ sessionStorage.setItem(seenKey,'1'); }catch(e){}
    if(d.pending){ if(opts.onToast) opts.onToast('Your request to join '+(d.invite_name||'this coach')+' is waiting for their approval.'); return; }
    var ov=card('<div style="font-size:22px;font-weight:700">Join '+esc(d.invite_name||'this coach')+'?</div>'
      +'<div style="font-size:15px;line-height:1.5;color:#C9C3B4">You\'re currently with '+esc(d.coach_name||'another coach')+'. If you join '+esc(d.invite_name||'this coach')+', your meals, workouts and progress come with you, and they\'ll coach you from now on.</div>'
      +'<div style="font-size:13px;line-height:1.5;color:#9C978A">Your previous coach keeps only the record of past sessions and payments. They won\'t see anything new.</div>'
      +'<button id="kjcJoin" style="'+BTN+';background:#2F6B4A;color:#fff;border:none">Join '+esc(d.invite_name||'this coach')+'</button>'
      +'<button id="kjcNo" style="'+BTN+';background:none;color:#F3EEE3;border:1px solid #3E3F36">Not now</button>');
    ov.querySelector('#kjcNo').onclick=function(){ov.remove();};
    ov.querySelector('#kjcJoin').onclick=async function(){
      this.disabled=true;
      var q; try{ q=await opts.sb.rpc('kfit_request_coach',{p_mobile:String(opts.mobile),p_coach:invite,p_name:opts.name||''}); }catch(e){ q=null; }
      ov.remove();
      var st=q&&q.data&&q.data.status;
      if(st==='pending'&&opts.onToast) opts.onToast('Request sent. '+(d.invite_name||'Your new coach')+' will approve it soon.');
      else if(st==='already'&&opts.onToast) opts.onToast('You\'re already with this coach.');
      else if(opts.onToast) opts.onToast((q&&q.data&&q.data.message)||'Could not send the request. Please try again.');
    };
  }
  global.KFitJoinCoach={check:check};
})(window);
