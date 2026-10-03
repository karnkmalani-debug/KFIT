// KFit -- daily steps card, shared by the fitness and nutrition apps.
// One number per person per day (stored by mobile), so both apps and Merge
// always show the same steps. The goal is set by the coach (default 8,000).
(function(global){
  'use strict';
  function pad(n){return (n<10?'0':'')+n;}
  function today(){var d=new Date();return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());}
  function fmt(n){try{return Number(n).toLocaleString('en-IN');}catch(e){return String(n);}}
  // opts: {sb, mobile, day (optional), compact (bool), onSaved(steps)}
  async function mount(el,opts){
    if(!el||!opts||!opts.sb) return;
    var m=String(opts.mobile||'').replace(/\D/g,''); if(m.length<8){ el.innerHTML=''; return; }
    var day=opts.day||today();
    var steps=null, goal=8000;
    try{
      var r=await opts.sb.from('client_daily_steps').select('steps').eq('mobile',m).eq('day',day);
      if(r.data&&r.data[0]) steps=r.data[0].steps;
      var g=await opts.sb.from('client_step_goals').select('goal').eq('mobile',m);
      if(g.data&&g.data[0]) goal=g.data[0].goal;
    }catch(e){}
    var pct=steps?Math.min(100,Math.round(steps/goal*100)):0;
    el.innerHTML='<div style="background:var(--card,var(--surf));border:1px solid var(--line,var(--border));border-radius:16px;padding:12px 14px;display:flex;flex-direction:column;gap:8px;margin-bottom:12px">'
      +'<div style="display:flex;justify-content:space-between;align-items:center"><div style="font-weight:700;font-size:15px">👟 Steps '+(day===today()?'today':'')+'</div><span style="font-size:12px;color:var(--muted)">goal '+fmt(goal)+'</span></div>'
      +'<div style="display:flex;align-items:baseline;gap:8px"><span style="font-family:var(--serif,\'Playfair Display\',Georgia,serif);font-size:28px;color:var(--gold,#C9A24A)">'+(steps!=null?fmt(steps):'–')+'</span><span style="font-size:12px;color:var(--muted)">of '+fmt(goal)+'</span></div>'
      +'<div style="height:8px;border-radius:4px;background:var(--line,#2E2F28)"><div style="width:'+pct+'%;height:8px;border-radius:4px;background:var(--gold,#C9A24A);transition:width .5s"></div></div>'
      +'<div style="display:flex;gap:8px"><input type="number" inputmode="numeric" min="0" max="150000" class="kst-in" placeholder="Type today\'s steps" value="'+(steps!=null?steps:'')+'" style="flex:1;min-height:42px;border-radius:10px;border:1px solid var(--line2,var(--border));background:var(--sand,var(--surf2));color:var(--ink,var(--text));padding:0 10px;font-size:15px;font-family:inherit">'
      +'<button class="kst-save" style="min-height:42px;border-radius:10px;border:none;background:var(--green,#2F6B4A);color:#fff;font-weight:700;padding:0 16px;font-family:inherit">Save</button></div>'
      +'<div style="font-size:12px;color:var(--muted)">Copy the number from your phone\'s Health or Fit app, or your watch.</div></div>';
    el.querySelector('.kst-save').onclick=async function(){
      var v=parseInt(el.querySelector('.kst-in').value,10);
      if(!isFinite(v)||v<0||v>150000){ el.querySelector('.kst-in').focus(); return; }
      this.disabled=true;
      var res=await opts.sb.from('client_daily_steps').upsert({mobile:m,day:day,steps:v},{onConflict:'mobile,day'});
      this.disabled=false;
      if(res.error){ alert('Steps not saved. Check your connection.'); return; }
      if(opts.onSaved) opts.onSaved(v);
      mount(el,opts);
    };
  }
  global.KFitSteps={mount:mount};
})(window);
