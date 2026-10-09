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
    // collapsed: one quiet line (the fitness LOG screen); tap to open the full card
    // collapsed (the fitness LOG screen): a big gold "Add today's steps" until
    // they're in, then the number, large. Tap either to open the box.
    if(opts.collapsed&&!el._kstOpen){
      // a quiet box; only the words are big and bold
      var box='width:100%;background:var(--card,var(--surf));border:1px solid var(--line,var(--border));border-radius:16px;padding:14px 16px;display:flex;align-items:center;gap:12px;margin-bottom:12px;color:var(--ink,var(--text));font-family:inherit;cursor:pointer;text-align:left';
      var big=steps==null
        ?'<button class="kst-line" style="'+box+'"><span style="font-size:26px;line-height:1">👟</span><span style="flex:1"><span style="display:block;font-size:20px;font-weight:900;letter-spacing:.01em">'+(day===today()?'Add today\'s steps':'Add steps')+'</span><span style="display:block;font-size:13px;color:var(--muted)">Goal '+fmt(goal)+'</span></span><span style="font-size:24px;font-weight:900;color:var(--muted)">+</span></button>'
        :'<button class="kst-line" style="'+box+'"><span style="font-size:26px;line-height:1">👟</span><span style="flex:1;min-width:0"><span style="display:block;font-size:24px;font-weight:900">'+fmt(steps)+' <span style="font-size:14px;font-weight:600;color:var(--muted)">steps</span></span>'
          +'<span style="display:block;height:5px;border-radius:3px;background:var(--line,#2E2F28);margin-top:5px"><span style="display:block;width:'+pct+'%;height:5px;border-radius:3px;background:var(--muted)"></span></span>'
          +'<span style="display:block;font-size:12px;color:var(--muted);margin-top:3px">of '+fmt(goal)+' · tap to change</span></span></button>';
      el.innerHTML=big;
      el.querySelector('.kst-line').onclick=function(){ el._kstOpen=true; mount(el,opts).then(function(){ var i=el.querySelector('.kst-in'); if(i) i.focus(); }); };
      return;
    }
    el.innerHTML='<div style="background:var(--card,var(--surf));border:1px solid var(--line,var(--border));border-radius:16px;padding:12px 14px;display:flex;flex-direction:column;gap:8px;margin-bottom:12px">'
      +'<div style="display:flex;justify-content:space-between;align-items:center"><div style="font-weight:700;font-size:15px">👟 Steps '+(day===today()?'today':'')+'</div><span style="font-size:12px;color:var(--muted)"><button class="kst-goal" title="Change your daily goal" style="background:none;border:none;padding:0;color:var(--muted);font-family:inherit;font-size:12px;text-decoration:underline;cursor:pointer">goal '+fmt(goal)+' ✎</button>'+(opts.collapsed?' <button class="kst-x" aria-label="Close" style="background:none;border:none;color:var(--muted);font-size:20px;margin-left:8px;padding:0 4px;cursor:pointer;vertical-align:middle">✕</button>':'')+'</span></div>'
      +'<div style="display:flex;align-items:baseline;gap:8px"><span style="font-family:var(--serif,\'Playfair Display\',Georgia,serif);font-size:28px;color:var(--gold,#C9A24A)">'+(steps!=null?fmt(steps):'–')+'</span><span style="font-size:12px;color:var(--muted)">of '+fmt(goal)+'</span></div>'
      +'<div style="height:8px;border-radius:4px;background:var(--line,#2E2F28)"><div style="width:'+pct+'%;height:8px;border-radius:4px;background:var(--gold,#C9A24A);transition:width .5s"></div></div>'
      +'<div style="display:flex;gap:8px"><input type="number" inputmode="numeric" min="0" max="150000" class="kst-in" placeholder="Type today\'s steps" value="'+(steps!=null?steps:'')+'" style="flex:1;min-height:42px;border-radius:10px;border:1px solid var(--line2,var(--border));background:var(--sand,var(--surf2));color:var(--ink,var(--text));padding:0 10px;font-size:15px;font-family:inherit">'
      +'<button class="kst-save" style="min-height:42px;border-radius:10px;border:none;background:var(--green,#2F6B4A);color:#fff;font-weight:700;padding:0 16px;font-family:inherit">Save</button></div>'
      +'<div style="font-size:12px;color:var(--muted)">Copy the number from your phone\'s Health or Fit app, or your watch.</div></div>';
    // anyone can change their own daily goal (the coach can too, in Merge)
    var kg=el.querySelector('.kst-goal'); if(kg) kg.onclick=async function(){
      var v=prompt('Your daily step goal (1,000 to 50,000):',String(goal)); if(v===null) return;
      var g=parseInt(String(v).replace(/\D/g,''),10); if(!(g>=1000&&g<=50000)){ alert('Please enter a number between 1,000 and 50,000.'); return; }
      var r=await opts.sb.from('client_step_goals').upsert({mobile:m,goal:g},{onConflict:'mobile'});
      if(r.error){ alert('Goal not saved. Check your connection and try again.'); return; }
      mount(el,opts);
    };
    var kx=el.querySelector('.kst-x'); if(kx) kx.onclick=function(){ el._kstOpen=false; mount(el,opts); };
    el.querySelector('.kst-save').onclick=async function(){
      var v=parseInt(el.querySelector('.kst-in').value,10);
      if(!isFinite(v)||v<0||v>150000){ el.querySelector('.kst-in').focus(); return; }
      this.disabled=true;
      var res=await opts.sb.from('client_daily_steps').upsert({mobile:m,day:day,steps:v},{onConflict:'mobile,day'});
      this.disabled=false;
      if(res.error){ alert('Steps not saved. Check your connection.'); return; }
      if(opts.onSaved) opts.onSaved(v);
      el._kstOpen=false;
      mount(el,opts);
    };
  }
  global.KFitSteps={mount:mount};
})(window);
