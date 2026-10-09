// KFit -- habit progress worked out from logged meals (shared by the
// nutrition app and Merge), so progress doesn't depend on the client
// remembering to tap Done/Partly every night.
//
// KFitHabit.score(habitId, meals) -> 'done' | 'partly' | 'not' | 'wait' | null
//   meals: that day's meal bodies ({slot, time, items, feedback, photos, text})
//   'wait' = meals are logged but their estimate hasn't come back yet
//   null   = nothing to go on (no meals, or a habit food can't show)
// KFitHabit.readable(habitId) -> true when meals can show this habit (all do;
//   Eating Order, More-same-less and Sip smarter are estimates).
// KFitHabit.tip(habitId, daysOfMeals, ctx) -> one tip from their own meals.
// KFitHabit.answer(day, tapped, coachMark, auto) -> the answer to show:
//   your mark in Merge, then theirs, then the one from their meals.
(function(global){
  'use strict';
  var MAIN={Breakfast:1,Lunch:1,Dinner:1};
  // sweet drinks and desserts (English and common Indian names)
  var SWEET=/\b(juice|cola|coke|pepsi|soda|soft drink|sprite|fanta|frooti|maaza|energy drink|milkshake|shake with sugar|sweet lassi|mango lassi|sweet chai|chai with sugar|tea with sugar|coffee with sugar|frappe|iced tea|sharbat|sherbet|rooh afza|mocktail|beer|wine|cocktail|whisky|vodka|rum)\b/i;
  function hands(b){
    b=b||{};
    if(Array.isArray(b.items)&&b.items.length){
      var f={protein:0,veg:0,carbs:0,fats:0};
      b.items.forEach(function(it){ ['protein','veg','carbs','fats'].forEach(function(k){ f[k]+=Number(it&&it[k])||0; }); });
      if(f.protein+f.veg+f.carbs+f.fats>0||b.feedback) return f;
    }
    var ps=Array.isArray(b.photos)?b.photos.filter(function(x){return x&&x.feedback;}):[];
    if(ps.length){ var g={protein:0,veg:0,carbs:0,fats:0}; ps.forEach(function(x){ ['protein','veg','carbs','fats'].forEach(function(k){ g[k]+=Number(x.feedback[k])||0; }); }); return g; }
    if(b.feedback&&b.feedback.protein!=null) return {protein:+b.feedback.protein||0,veg:+b.feedback.veg||0,carbs:+b.feedback.carbs||0,fats:+b.feedback.fats||0};
    return null;
  }
  function judge(list,ok,some){
    if(!list.length) return null;
    var known=list.filter(function(m){return m.h;});
    if(!known.length) return 'wait';
    var good=known.filter(ok).length, part=some?known.filter(some).length:good;
    return good===known.length?'done':(good||part)?'partly':'not';
  }
  var RULES={
    'protein-first':function(ms){ return judge(ms.filter(function(m){return MAIN[m.slot];}),function(m){return m.h.protein>=0.5;}); },
    'fibre-second':function(ms){ return judge(ms.filter(function(m){return m.slot==='Lunch'||m.slot==='Dinner';}),function(m){return m.h.veg>=1;},function(m){return m.h.veg>0;}); },
    'plate-by-hand':function(ms){ return judge(ms.filter(function(m){return MAIN[m.slot];}),function(m){return m.h.protein>=0.5&&m.h.veg>=0.5&&m.h.carbs<=2&&m.h.fats<=2;},function(m){return m.h.protein>=0.5||m.h.veg>=0.5;}); },
    'snack-upgrade':function(ms){ var sn=ms.filter(function(m){return /snack/i.test(m.slot||'');}); if(!sn.length) return ms.length?'done':null; return judge(sn,function(m){return m.h.protein>=0.5;}); },
    'eating-order':function(ms){ return judge(ms.filter(function(m){return MAIN[m.slot];}),function(m){return m.h.protein>=0.5&&m.h.veg>=0.5;},function(m){return m.h.protein>=0.5||m.h.veg>=0.5;}); },
    'more-same-less':function(ms,ctx){ var t=ctx&&ctx.target; if(!t) return null; var known=ms.filter(function(m){return m.k!=null;}); if(!known.length) return ms.length?'wait':null;
      var k=known.reduce(function(a,m){return a+m.k;},0); var r=k/t; return r>=0.8&&r<=1.1?'done':r>=0.65&&r<=1.25?'partly':'not'; },
    'sip-smarter':function(ms){ if(!ms.length) return null; var sweet=ms.filter(function(m){return SWEET.test(m.text);}).length; return sweet===0?'done':sweet===1?'partly':'not'; },
    'out-and-about':function(ms,ctx){ return RULES['protein-first'](ms,ctx); },
    'weekends':function(ms,ctx){ return RULES['protein-first'](ms,ctx); },
    'own-it':function(ms,ctx){ return RULES['plate-by-hand'](ms,ctx); },
    'early-dinner':function(ms){ var d=ms.filter(function(m){return m.slot==='Dinner'&&/^\d{1,2}:\d{2}/.test(m.time||'');})[0]; if(!d) return null; var p=String(d.time).split(':'), t=(+p[0])*60+(+p[1]); return t<=20*60+30?'done':t<=21*60+30?'partly':'not'; }
  };
  function kcal(b){ if(Array.isArray(b.items)&&b.items.length){ var k=b.items.reduce(function(a,i){return a+(Number(i&&i.kcal)||0);},0); if(k) return k; }
    var ps=Array.isArray(b.photos)?b.photos:[]; var k2=ps.reduce(function(a,q){return a+((q&&q.feedback&&Number(q.feedback.kcal))||0);},0); if(k2) return k2;
    return b.feedback&&Number(b.feedback.kcal)||null; }
  function score(id,meals,ctx){
    var r=RULES[id]; if(!r||!meals||!meals.length) return null;
    var ms=meals.map(function(b){ b=b||{}; var k=kcal(b); return {slot:b.slot||'',time:b.time||'',h:hands(b),k:k,text:[b.text||''].concat((b.items||[]).map(function(i){return i&&i.name||'';})).join(' ')}; });
    return r(ms,ctx);
  }
  // One gentle, specific tip from their own meals over the habit's days so far.
  function tip(id,days,ctx){
    var all=[]; (days||[]).forEach(function(ms){ (ms||[]).forEach(function(b){ all.push({slot:(b||{}).slot||'',time:(b||{}).time||'',h:hands(b||{}),text:[(b||{}).text||''].concat(((b||{}).items||[]).map(function(i){return i&&i.name||'';})).join(' ')}); }); });
    if(!all.length) return 'Log your meals, photo or a few words, and your progress fills in by itself.';
    function worst(test,slots){ var c={}; all.forEach(function(m){ if(m.h&&slots.indexOf(m.slot)>=0&&test(m)) c[m.slot]=(c[m.slot]||0)+1; }); var k=Object.keys(c).sort(function(a,b){return c[b]-c[a];})[0]; return k?{slot:k,n:c[k]}:null; }
    var w;
    if(id==='protein-first'||id==='weekends'||id==='out-and-about'){ w=worst(function(m){return m.h.protein<0.5;},['Breakfast','Lunch','Dinner']);
      return w?w.slot+' is where protein slips most. Try eggs, curd, paneer, dal or sprouts there.':'Protein is showing up at your meals. Keep it first on the plate.'; }
    if(id==='fibre-second'){ w=worst(function(m){return m.h.veg<1;},['Lunch','Dinner']); return w?'Your '+w.slot.toLowerCase()+' is often light on veg. Add a fist of salad or sabzi first.':'A fist of veg at lunch and dinner: you\'re doing it.'; }
    if(id==='plate-by-hand'||id==='own-it'){ w=worst(function(m){return m.h.carbs>2;},['Breakfast','Lunch','Dinner']); if(w) return 'Carbs run big at '+w.slot.toLowerCase()+'. Try one cupped hand and add veg.';
      w=worst(function(m){return m.h.veg<0.5;},['Breakfast','Lunch','Dinner']); return w?'Add a fist of veg at '+w.slot.toLowerCase()+' to complete the plate.':'Your plates are well built. Keep using your hand as the guide.'; }
    if(id==='eating-order'){ w=worst(function(m){return !(m.h.protein>=0.5&&m.h.veg>=0.5);},['Lunch','Dinner']); return w?'Have protein and veg on your '+w.slot.toLowerCase()+' plate so you can eat them first, carbs last.':'Protein and veg are on your plate. Eat them first, carbs last.'; }
    if(id==='snack-upgrade'){ var sn=all.filter(function(m){return /snack/i.test(m.slot)&&m.h&&m.h.protein<0.5;}).length; return sn?'Swap one snack for curd, roasted chana, nuts or a boiled egg.':'Your snacks are protein-led. Nice.'; }
    if(id==='early-dinner'){ var t=all.filter(function(m){return m.slot==='Dinner'&&/^\d{1,2}:\d{2}/.test(m.time);}).map(function(m){var p=m.time.split(':');return (+p[0])*60+(+p[1]);}); if(!t.length) return 'Log dinner with its time and you\'ll see how early you\'re finishing.';
      var avg=Math.round(t.reduce(function(a,b){return a+b;},0)/t.length); var hh=Math.floor(avg/60), mm=avg%60; return 'Dinner averages '+(hh>12?hh-12:hh)+':'+(mm<10?'0':'')+mm+(hh>=12?' pm':' am')+'. Aim to finish 2 to 3 hours before bed.'; }
    if(id==='sip-smarter'){ var sw=all.filter(function(m){return SWEET.test(m.text);}); return sw.length?'Sweet drinks showed up '+sw.length+' time'+(sw.length===1?'':'s')+'. Try water, buttermilk or unsweetened chai instead.':'No sweet drinks logged. Lovely.'; }
    if(id==='more-same-less') return 'Eat slowly and stop at satisfied, not stuffed. Your daily total tells the story.';
    return '';
  }
  function answer(tapped,coachMark,auto){ return coachMark||tapped||(auto==='wait'?null:auto)||null; }
  global.KFitHabit={score:score,readable:function(id){return !!RULES[id];},estimated:function(id){return id==='eating-order'||id==='more-same-less'||id==='sip-smarter';},answer:answer,hands:hands,tip:tip};
})(typeof window!=='undefined'?window:this);
