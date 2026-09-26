// KFit fitness store -- the per-row storage layer for fitness data.
//
// Before: each client's whole fitness history lived in ONE jsonb record
// (tracker_data.data), downloaded, merged and re-uploaded in full on every
// save. That is what produced the 38.8 MB doubling list, the dropped
// sessions and the Merge timeouts.
//
// Now fitness data lives in proper tables:
//   fitness_clients       one row per client: profile, notes, routines,
//                         assigned workouts, coach tag, wipe marker
//   fitness_sessions      one row per workout session (approval state
//                         travels inside the session, exactly as before)
//   fitness_measurements  one row per body-measurement entry
//   fitness_requests      (view) the sessions with a pending approval
//   attendance            unchanged -- check-ins, paid/unpaid
//
// Deleted sessions stay as rows marked deleted=true. That row IS the
// tombstone (so a stale phone can never bring it back -- the database
// refuses) and, while it still carries the session, it is the Trash copy.
//
// Two ways in:
//  1. Direct row functions (pull/push/listTrash/...) -- used by the new
//     incremental sync in the client tracker and by Merge's inbox/Trash.
//  2. wrapClient(): a drop-in for supabase.createClient(). Any
//     .from('tracker_data') query aimed at tracker 'fitness' is served from
//     the new tables instead, and a write sends ONLY the sessions /
//     measurements / client fields that actually changed. Every other table
//     -- and tracker 'nutrition' -- goes straight to Supabase untouched.
//     This is what lets Merge's existing edit/approve/restore/assign code
//     keep working unchanged, while no longer reading or writing tracker_data.
//
// tracker_data itself is never written for fitness any more: it stays as
// the untouched backup during the switch.
(function(global){
'use strict';

var T_CLIENTS='fitness_clients', T_SESS='fitness_sessions', T_MEAS='fitness_measurements';
var T_REQ='fitness_requests', T_SUMMARY='fitness_client_summary';
var PAGE=1000;               // Supabase returns at most 1000 rows per request
var CHUNK_ROWS=40;           // rows per upsert request
var CHUNK_BYTES=600*1024;    // ...and never much more than ~600 KB per request

// ---------- small helpers ----------
function msOf(v){ var n=Number(v); return (isFinite(n)&&n>0)?Math.floor(n):0; }
function sid(id){ return id==null?'':String(id); }
function measKey(m){
  if(!m||typeof m!=='object') return '';
  if(m.id!=null&&m.id!=='') return String(m.id);
  return m.date?'d_'+m.date:'';
}
function appId(x){ return (typeof x==='string'&&/^\d{1,15}$/.test(x))?Number(x):x; }
function isObj(o){ return !!o&&typeof o==='object'&&!Array.isArray(o); }
function clone(o){ return o==null?o:JSON.parse(JSON.stringify(o)); }
function stripTransient(o){
  var c={};
  Object.keys(o||{}).forEach(function(k){ if(k.charAt(0)!=='_') c[k]=o[k]; });
  return c;
}
// What gets stored for a session: no screen-only "_" fields, and a pending
// edit never carries nested request copies of its own (same rule the old
// compactFitnessData applied before every upload).
function compactSession(s){
  var c=stripTransient(s);
  if(c.pendingEdit&&c.pendingEdit.session){
    var ps=stripTransient(c.pendingEdit.session);
    delete ps.pendingEdit; delete ps.pendingDelete; delete ps.approval; delete ps.lastDecision;
    c.pendingEdit={session:ps,requestedAt:c.pendingEdit.requestedAt};
  }
  return clone(c);
}
function compactMeas(m){ return clone(stripTransient(m)); }
// Postgres stores jsonb keys in its own order, so plain JSON.stringify of a
// session read back from the server would never match the phone's copy.
// Sorted-key stringify makes "same content" compare equal.
function stable(v){
  if(v===undefined) return 'null';
  if(v===null||typeof v!=='object') return JSON.stringify(v);
  if(Array.isArray(v)) return '['+v.map(stable).join(',')+']';
  var ks=Object.keys(v).filter(function(k){return v[k]!==undefined;}).sort();
  return '{'+ks.map(function(k){return JSON.stringify(k)+':'+stable(v[k]);}).join(',')+'}';
}
function hash(str){
  var h1=5381,h2=52711;
  for(var i=0;i<str.length;i++){ var c=str.charCodeAt(i); h1=(h1*33)^c; h2=(h2*33)^c; }
  return (h1>>>0).toString(36)+(h2>>>0).toString(36)+'.'+str.length.toString(36);
}
function sig(v){ return hash(stable(v)); }
function nowMs(){ return Date.now(); }
function uniq(arr){
  var seen={},out=[];
  (arr||[]).forEach(function(x){ if(x==null||x==='') return; var k=String(x); if(!seen[k]){seen[k]=1;out.push(x);} });
  return out;
}

// ---------- client row <-> blob fields ----------
// The client-level pieces, each its own column so a change to one (e.g. the
// coach adding a routine) never rewrites another (e.g. the client's notes).
var CLIENT_COLS=['name','mobile','email','profile','notes','routines','assigned_workouts',
  'deleted_routine_ids','deleted_assigned_dates','is_active_client','active_since_date','other'];
// Keys of the old blob that are NOT client-level (rows, or derived).
var ROW_KEYS=['sessions','measurements','deletedSessionIds','deletedSessionsArchive',
  'deletedMeasurementIds','pendingRequests','wiped','wiped_at','wipedMs'];
var MAPPED_KEYS=['name','mobile','email','target','age','gender','unit','notes','routines',
  'assignedWorkouts','deletedRoutineIds','deletedAssignedWorkoutDates','isActiveClient','activeSinceDate'];

function clientColsFromBlob(d){
  d=d||{};
  var profile={};
  ['target','age','gender','unit'].forEach(function(k){ if(d[k]!=null&&d[k]!=='') profile[k]=d[k]; });
  var other={};
  Object.keys(d).forEach(function(k){
    if(MAPPED_KEYS.indexOf(k)===-1&&ROW_KEYS.indexOf(k)===-1&&d[k]!==undefined) other[k]=d[k];
  });
  return {
    name:d.name==null?null:String(d.name),
    mobile:d.mobile==null?null:String(d.mobile),
    email:d.email==null?null:String(d.email),
    profile:profile,
    notes:isObj(d.notes)?d.notes:{},
    routines:Array.isArray(d.routines)?d.routines:[],
    assigned_workouts:isObj(d.assignedWorkouts)?d.assignedWorkouts:{},
    deleted_routine_ids:uniq(d.deletedRoutineIds),
    deleted_assigned_dates:uniq(d.deletedAssignedWorkoutDates),
    is_active_client:(d.isActiveClient===true||d.isActiveClient===false)?d.isActiveClient:null,
    active_since_date:d.activeSinceDate||null,
    other:other
  };
}
function blobFieldsFromClientRow(c){
  var d={};
  if(!c) return d;
  if(isObj(c.other)) Object.keys(c.other).forEach(function(k){ d[k]=c.other[k]; });
  if(c.name!=null) d.name=c.name;
  if(c.mobile!=null) d.mobile=c.mobile;
  if(c.email!=null) d.email=c.email;
  var p=isObj(c.profile)?c.profile:{};
  ['target','age','gender','unit'].forEach(function(k){ if(p[k]!=null) d[k]=p[k]; });
  d.notes=isObj(c.notes)?c.notes:{};
  d.routines=Array.isArray(c.routines)?c.routines:[];
  d.assignedWorkouts=isObj(c.assigned_workouts)?c.assigned_workouts:{};
  d.deletedRoutineIds=Array.isArray(c.deleted_routine_ids)?c.deleted_routine_ids:[];
  d.deletedAssignedWorkoutDates=Array.isArray(c.deleted_assigned_dates)?c.deleted_assigned_dates:[];
  if(c.is_active_client!=null) d.isActiveClient=c.is_active_client;
  if(c.active_since_date!=null) d.activeSinceDate=c.active_since_date;
  return d;
}
function clientColSigs(cols){
  var s={};
  CLIENT_COLS.forEach(function(k){ s[k]=sig(k==='deleted_routine_ids'||k==='deleted_assigned_dates'?uniq(cols[k]).map(String).sort():cols[k]); });
  return s;
}

// ---------- row builders ----------
function sessionRow(clientId,s){
  return {client_id:clientId,session_id:sid(s.id),body:s,updated_ms:msOf(s.updatedAt),
    session_date:s.date?String(s.date):null,time_of_day:s.timeOfDay?String(s.timeOfDay):null,deleted:false,undelete:false};
}
function tombstoneRow(clientId,id,trashBody,deletedMs){
  var b=trashBody?compactSession(trashBody):{};
  return {client_id:clientId,session_id:sid(id),body:b,updated_ms:nowMs(),
    session_date:b.date?String(b.date):null,time_of_day:b.timeOfDay?String(b.timeOfDay):null,
    deleted:true,deleted_ms:msOf(deletedMs)||nowMs(),undelete:false};
}
function measRow(clientId,m){
  return {client_id:clientId,meas_id:measKey(m),body:m,updated_ms:msOf(m.updatedAt),
    meas_date:m.date?String(m.date):null,deleted:false,undelete:false};
}
function measTombstoneRow(clientId,id){
  return {client_id:clientId,meas_id:String(id),body:{},updated_ms:nowMs(),deleted:true,deleted_ms:nowMs(),undelete:false};
}

// ---------- low-level I/O ----------
function errOf(res){ return res&&res.error?res.error:null; }
// Reads every page of a query. make(from,to) must return a fresh query.
function fetchAll(make){
  var out=[];
  function page(from){
    return make(from,from+PAGE-1).then(function(res){
      if(res.error) return {data:null,error:res.error};
      var rows=res.data||[];
      out=out.concat(rows);
      if(rows.length<PAGE) return {data:out,error:null};
      return page(from+PAGE);
    });
  }
  return page(0);
}
function chunks(rows){
  var out=[],cur=[],bytes=0;
  rows.forEach(function(r){
    var n=JSON.stringify(r).length;
    if(cur.length&&(cur.length>=CHUNK_ROWS||bytes+n>CHUNK_BYTES)){ out.push(cur); cur=[]; bytes=0; }
    cur.push(r); bytes+=n;
  });
  if(cur.length) out.push(cur);
  return out;
}
// Upserts rows in small requests, one after another, stopping at the first
// error (the rows before it are safely stored; the rest are retried later).
// Also reports which rows the database refused (its rules can skip a row
// without an error -- e.g. an older copy, or a change only a coach may
// make). keyCol names the row's id column.
function upsertRows(db,table,rows,conflict,keyCol){
  var parts=chunks(rows),i=0,sent=[],got={};
  function next(){
    if(i>=parts.length){
      var refused=sent.filter(function(k){return !got[k];});
      return Promise.resolve({error:null,refused:refused});
    }
    var p=parts[i++];
    p.forEach(function(r){ sent.push(String(r[keyCol])); });
    return db.from(table).upsert(p,{onConflict:conflict}).select(keyCol).then(function(res){
      if(res.error) return {error:res.error,refused:[]};
      (res.data||[]).forEach(function(r){ got[String(r[keyCol])]=1; });
      return next();
    });
  }
  return next();
}

// ---------- blob assembly (compat read) ----------
// Builds the old tracker_data.data shape for one client from its rows.
// Returns null when the client has no rows at all (same as "no record").
function loadBlob(db,clientId){
  var liveQ=fetchAll(function(a,b){ return db.from(T_SESS).select('session_id,body,updated_ms').eq('client_id',clientId).eq('deleted',false).order('session_id',{ascending:true}).range(a,b); });
  var deadQ=fetchAll(function(a,b){ return db.from(T_SESS).select('session_id').eq('client_id',clientId).eq('deleted',true).order('session_id',{ascending:true}).range(a,b); });
  var trashQ=db.from(T_SESS).select('session_id,body,deleted_ms').eq('client_id',clientId).eq('deleted',true).eq('has_body',true).order('deleted_ms',{ascending:false}).limit(80);
  var measQ=fetchAll(function(a,b){ return db.from(T_MEAS).select('meas_id,body,updated_ms').eq('client_id',clientId).eq('deleted',false).order('meas_id',{ascending:true}).range(a,b); });
  var mdeadQ=fetchAll(function(a,b){ return db.from(T_MEAS).select('meas_id').eq('client_id',clientId).eq('deleted',true).order('meas_id',{ascending:true}).range(a,b); });
  var cliQ=db.from(T_CLIENTS).select('*').eq('client_id',clientId).limit(1);
  return Promise.all([cliQ,liveQ,deadQ,trashQ,measQ,mdeadQ]).then(function(r){
    for(var i=0;i<r.length;i++){ if(r[i].error) return {data:null,error:r[i].error}; }
    var cli=(r[0].data||[])[0]||null;
    var live=r[1].data||[], dead=r[2].data||[], trash=r[3].data||[], meas=r[4].data||[], mdead=r[5].data||[];
    if(!cli&&!live.length&&!dead.length&&!meas.length&&!mdead.length) return {data:null,error:null,client:null};
    var d=blobFieldsFromClientRow(cli);
    d.sessions=live.map(function(x){ var b=x.body||{}; return b; }).sort(function(a,b){
      var dd=new Date(b.date)-new Date(a.date); return dd!==0?dd:(msOf(b.updatedAt)-msOf(a.updatedAt));
    });
    // Session ids are numbers in the app (Date.now()); rows store them as
    // text. Hand them back as numbers so the app's own id comparisons
    // (x.id===id) keep working -- e.g. restoring from Trash.
    d.deletedSessionIds=dead.map(function(x){ return appId(x.session_id); });
    d.deletedSessionsArchive=trash.map(function(x){
      var b=Object.assign({},x.body||{}); if(!b.deletedAt&&x.deleted_ms) b.deletedAt=Number(x.deleted_ms); return b;
    });
    d.measurements=meas.map(function(x){ return x.body||{}; }).sort(function(a,b){ return new Date(b.date)-new Date(a.date); });
    d.deletedMeasurementIds=mdead.map(function(x){ return x.meas_id; });
    d.pendingRequests=d.sessions.filter(function(x){ return (x.approval&&x.approval.status==='pending')||x.pendingEdit||x.pendingDelete; }).length;
    if(cli&&cli.wiped_ms&&!live.length) d.wipedMs=Number(cli.wiped_ms);
    return {data:d,error:null,client:cli};
  });
}

// What a later compat write is diffed against: per-item signatures of the
// last copy read from the server for this client.
function snapshotOf(d){
  var s={sess:{},sessMs:{},dead:{},meas:{},measMs:{},mdead:{},cols:{}};
  if(!d){ s.cols=null; return s; }
  (d.sessions||[]).forEach(function(x){ var id=sid(x&&x.id); if(!id) return; s.sess[id]=sig(compactSession(x)); s.sessMs[id]=msOf(x.updatedAt); });
  (d.deletedSessionIds||[]).forEach(function(id){ s.dead[sid(id)]=1; });
  (d.measurements||[]).forEach(function(m){ var k=measKey(m); if(!k) return; s.meas[k]=sig(compactMeas(m)); s.measMs[k]=msOf(m.updatedAt); });
  (d.deletedMeasurementIds||[]).forEach(function(id){ s.mdead[String(id)]=1; });
  s.cols=clientColSigs(clientColsFromBlob(d));
  return s;
}

// Writes a blob-shaped object back as rows -- ONLY what changed since
// `snap`. Returns {error}. `meta` = {coachId,userId}.
function saveBlob(db,clientId,d,snap,meta){
  meta=meta||{};
  d=d||{};
  snap=snap||snapshotOf(null);
  var t=nowMs();
  var dead={}; (d.deletedSessionIds||[]).forEach(function(id){ dead[sid(id)]=1; });
  var archive={}; (d.deletedSessionsArchive||[]).forEach(function(x){ if(x&&x.id!=null) archive[sid(x.id)]=x; });
  var sessRows=[], seen={};
  // newest copy per id wins if the list has duplicates
  var byId={};
  (d.sessions||[]).forEach(function(x){ if(!x||x.id==null) return; var id=sid(x.id); if(!byId[id]||msOf(x.updatedAt)>=msOf(byId[id].updatedAt)) byId[id]=x; });
  var prevLive={};
  Object.keys(byId).forEach(function(id){
    if(dead[id]) return;                  // a tombstone always wins
    seen[id]=1;
    var c=compactSession(byId[id]);
    var g=sig(c);
    if(snap.sess[id]===g&&!snap.dead[id]) return;      // unchanged
    // A changed session is a new version: make sure it carries a newer
    // timestamp than what the server had, or the server would (rightly)
    // treat it as a stale copy and ignore it.
    if(snap.sessMs[id]!=null&&msOf(c.updatedAt)<=snap.sessMs[id]){ c.updatedAt=Math.max(t,snap.sessMs[id]+1); byId[id].updatedAt=c.updatedAt; }
    var row=sessionRow(clientId,c);
    if(snap.dead[id]) row.undelete=true;                // an explicit restore
    sessRows.push(row);
  });
  Object.keys(dead).forEach(function(id){
    if(snap.dead[id]) return;             // already deleted on the server
    if(!snap.sess[id]&&!archive[id]) {
      // Never seen live -- still record it so no stale copy can come back.
      sessRows.push(tombstoneRow(clientId,id,null,t)); return;
    }
    var a=archive[id];
    sessRows.push(tombstoneRow(clientId,id,a||null,a&&a.deletedAt));
  });
  // measurements
  var mdead={}; (d.deletedMeasurementIds||[]).forEach(function(id){ mdead[String(id)]=1; });
  var measRows=[], mById={};
  (d.measurements||[]).forEach(function(m){ var k=measKey(m); if(!k) return; if(!mById[k]||msOf(m.updatedAt)>=msOf(mById[k].updatedAt)) mById[k]=m; });
  Object.keys(mById).forEach(function(k){
    if(mdead[k]) return;
    var c=compactMeas(mById[k]); var g=sig(c);
    if(snap.meas[k]===g&&!snap.mdead[k]) return;
    if(snap.measMs[k]!=null&&msOf(c.updatedAt)<=snap.measMs[k]){ c.updatedAt=Math.max(t,snap.measMs[k]+1); mById[k].updatedAt=c.updatedAt; }
    else if(!msOf(c.updatedAt)){ c.updatedAt=t; }
    var row=measRow(clientId,c);
    if(snap.mdead[k]) row.undelete=true;
    measRows.push(row);
  });
  Object.keys(mdead).forEach(function(k){ if(!snap.mdead[k]) measRows.push(measTombstoneRow(clientId,k)); });
  // client-level columns: only the ones that changed
  var cols=clientColsFromBlob(d), sigs=clientColSigs(cols), cliRow=null;
  CLIENT_COLS.forEach(function(k){
    if(!snap.cols||snap.cols[k]!==sigs[k]){ cliRow=cliRow||{client_id:clientId}; cliRow[k]=cols[k]; }
  });
  if(cliRow&&!snap.cols){
    // brand-new client row: only send columns that actually hold something
    Object.keys(cliRow).forEach(function(k){
      var v=cliRow[k];
      if(k!=='client_id'&&(v==null||(Array.isArray(v)&&!v.length)||(isObj(v)&&!Object.keys(v).length))) delete cliRow[k];
    });
  }
  function stamp(rows){ return rows.map(function(r){
    if(meta.coachId&&r.coach_id===undefined) r.coach_id=meta.coachId;
    if(meta.userId&&r.user_id===undefined) r.user_id=meta.userId;
    return r; }); }
  var chain=Promise.resolve({error:null});
  // The client row goes first, so a brand-new client exists before its rows.
  if(cliRow||(!snap.cols&&(sessRows.length||measRows.length))){
    var cr=stamp([cliRow||{client_id:clientId}])[0];
    chain=chain.then(function(){ return db.from(T_CLIENTS).upsert(cr,{onConflict:'client_id'}); });
  }
  var refusedLive=[];
  var liveIds={}; sessRows.forEach(function(r){ if(!r.deleted) liveIds[r.session_id]=1; });
  var liveMeas={}; measRows.forEach(function(r){ if(!r.deleted) liveMeas[r.meas_id]=1; });
  chain=chain.then(function(res){ if(errOf(res)) return res; return upsertRows(db,T_SESS,stamp(sessRows),'client_id,session_id','session_id'); });
  chain=chain.then(function(res){ if(errOf(res)) return res;
    (res.refused||[]).forEach(function(id){ if(liveIds[id]) refusedLive.push(id); });
    return upsertRows(db,T_MEAS,stamp(measRows),'client_id,meas_id','meas_id'); });
  return chain.then(function(res){
    if(!errOf(res)) (res.refused||[]).forEach(function(k){ if(liveMeas[k]) refusedLive.push(k); });
    var err=errOf(res);
    if(!err&&refusedLive.length){
      // Everything else was saved; these were changed on the client's phone
      // after this screen loaded them, so the newer version was kept.
      err={message:refusedLive.length+' item(s) were not saved because they changed on the client\'s phone after you opened them. Reopen and try again.',code:'KFIT_STALE'};
    }
    return {error:err,written:{client:!!cliRow,sessions:sessRows.length,measurements:measRows.length}};
  });
}

// Coach "delete all fitness data": stamps the wipe time on the client row
// and removes every session/measurement row. Anything a phone later tries
// to upload that is older than the wipe is refused by the database.
function wipeClient(db,clientId,meta){
  meta=meta||{};
  var row={client_id:clientId,wiped_ms:nowMs(),notes:{},routines:[],assigned_workouts:{},deleted_routine_ids:[],deleted_assigned_dates:[],other:{}};
  if(meta.coachId) row.coach_id=meta.coachId;
  return db.from(T_CLIENTS).upsert(row,{onConflict:'client_id'}).then(function(r){
    if(r.error) return {error:r.error};
    return db.from(T_SESS).delete().eq('client_id',clientId).then(function(r2){
      if(r2.error) return {error:r2.error};
      return db.from(T_MEAS).delete().eq('client_id',clientId).then(function(r3){ return {error:r3.error||null}; });
    });
  });
}
// Hard delete of a client's fitness rows (admin "remove from coach", or the
// tracker clearing a leftover device placeholder).
function deleteClients(db,ids,coachId){
  if(!ids.length) return Promise.resolve({error:null});
  function q(t){ var b=db.from(t).delete().in('client_id',ids); if(coachId) b=b.eq('coach_id',coachId); return b; }
  return q(T_SESS).then(function(a){ if(a.error) return a;
    return q(T_MEAS).then(function(b){ if(b.error) return b;
      return q(T_CLIENTS).then(function(c){ return {error:c.error||null}; }); }); });
}

// ---------- incremental sync API (client tracker) ----------
// Everything that changed for this client since the given cursors. A few
// minutes of overlap is re-read on purpose: a row committed a moment late
// can carry a slightly earlier timestamp, and re-reading a row is harmless.
var OVERLAP_MS=5*60*1000;
function since(iso){
  if(!iso) return null;
  var t=Date.parse(iso); if(!isFinite(t)) return null;
  return new Date(t-OVERLAP_MS).toISOString();
}
function pull(db,clientId,cursors){
  cursors=cursors||{};
  var cs=since(cursors.s), cm=since(cursors.m);
  function q(t,cols,deleted,cur){
    return fetchAll(function(a,b){
      var x=db.from(t).select(cols).eq('client_id',clientId).eq('deleted',deleted);
      if(cur) x=x.gte('updated_at',cur);
      return x.order('updated_at',{ascending:true}).order(t===T_SESS?'session_id':'meas_id',{ascending:true}).range(a,b);
    });
  }
  return Promise.all([
    db.from(T_CLIENTS).select('*').eq('client_id',clientId).limit(1),
    q(T_SESS,'session_id,body,updated_ms,updated_at',false,cs),
    q(T_SESS,'session_id,updated_ms,updated_at',true,cs),
    q(T_MEAS,'meas_id,body,updated_ms,updated_at',false,cm),
    q(T_MEAS,'meas_id,updated_ms,updated_at',true,cm)
  ]).then(function(r){
    for(var i=0;i<r.length;i++){ if(r[i].error) return {error:r[i].error}; }
    function maxAt(rows,prev){ var m=prev||null; rows.forEach(function(x){ if(x.updated_at&&(!m||Date.parse(x.updated_at)>Date.parse(m))) m=x.updated_at; }); return m; }
    return {error:null,client:(r[0].data||[])[0]||null,
      live:r[1].data||[],dead:r[2].data||[],measLive:r[3].data||[],measDead:r[4].data||[],
      cursors:{s:maxAt((r[1].data||[]).concat(r[2].data||[]),cursors.s),m:maxAt((r[3].data||[]).concat(r[4].data||[]),cursors.m)}};
  });
}
// plan = {clientRow|null, sessionRows:[], measRows:[]}
function push(db,plan){
  var chain=Promise.resolve({error:null}), out={error:null,refusedSessions:[],refusedMeas:[]};
  if(plan.clientRow) chain=chain.then(function(){ return db.from(T_CLIENTS).upsert(plan.clientRow,{onConflict:'client_id'}); });
  chain=chain.then(function(r){ if(errOf(r)) return r; return upsertRows(db,T_SESS,plan.sessionRows||[],'client_id,session_id','session_id'); });
  chain=chain.then(function(r){ if(errOf(r)) return r; out.refusedSessions=r.refused||[]; return upsertRows(db,T_MEAS,plan.measRows||[],'client_id,meas_id','meas_id'); });
  return chain.then(function(r){ out.error=errOf(r); if(!out.error) out.refusedMeas=r.refused||[]; return out; });
}
// Links this phone to a client (the database only lets a phone reach
// clients it is linked to). rpcClient = the real Supabase client.
// How a phone gets access (all enforced by the database):
//  - requestAccess: asks the coach to approve this phone / new sign-up.
//    status: 'linked' | 'pending' | 'rejected' | 'coach' | 'error'.
//    Answers the same whether or not the number is registered.
//  - linkVerified: after a fresh emailed code, links this phone if the
//    email matches the account's.
//  - myClients: the client(s) this phone is already linked to.
function requestAccess(rpcClient,o){
  return rpcClient.rpc('kfit_request_access',{p_mobile:String(o.mobile||''),p_name:o.name||null,p_coach_id:o.coachId||null,p_email:o.email||null})
    .then(function(r){ if(r.error) return {status:'error',message:r.error.message,error:r.error}; return r.data||{status:'error',message:'No answer'}; });
}
function official(s){
  var c=compactSession(s||{});
  delete c.pendingEdit; delete c.pendingDelete; delete c.lastDecision; delete c.updatedAt; delete c.client; delete c.mobile;
  return c;
}
// Login lookup: client rows whose key ends in this mobile, with session counts.
// Mobile sign-in on a new phone: the database links this phone and
// returns only the small client summary.
function linkVerified(rpcClient,mobile){ return summaries(rpcClient.rpc('kfit_link_verified',{p_mobile:String(mobile)})); }
function myClients(rpcClient,mobile){ return summaries(rpcClient.rpc('kfit_my_clients',{p_mobile:String(mobile)})); }
function summaries(p){
  return p.then(function(res){
    if(res.error) return {data:null,error:res.error};
    return {data:(res.data||[]).map(function(c){
      var d=blobFieldsFromClientRow(c);
      return {client_id:c.client_id,data:d,liveSessions:Number(c.live_sessions)||0,updated_at:c.updated_at};
    }),error:null};
  });
}

// ---------- Merge helpers ----------
function listClientSummaries(db){
  return fetchAll(function(a,b){ return db.from(T_SUMMARY).select('client_id,name,mobile,live_sessions').order('client_id',{ascending:true}).range(a,b); });
}
function pendingRequestClientIds(db,coachId){
  var q=db.from(T_REQ).select('client_id');
  if(coachId) q=q.eq('coach_id',coachId);
  return q.then(function(res){
    if(res.error) return {data:null,error:res.error};
    return {data:uniq((res.data||[]).map(function(r){return r.client_id;})),error:null};
  });
}
function listRequests(db,coachId){
  return fetchAll(function(a,b){
    var q=db.from(T_REQ).select('client_id,session_id,request_kind,body,client_name');
    if(coachId) q=q.eq('coach_id',coachId);
    return q.order('client_id',{ascending:true}).order('session_id',{ascending:true}).range(a,b);
  });
}
function listTrash(db,sinceMs){
  return fetchAll(function(a,b){
    return db.from(T_SESS).select('client_id,session_id,body,deleted_ms').eq('deleted',true).eq('has_body',true)
      .gte('deleted_ms',sinceMs).order('deleted_ms',{ascending:false}).order('session_id',{ascending:true}).range(a,b);
  });
}

// ---------- tracker_data compatibility wrapper ----------
// wrapClient(real, {coachId:fn, userId:fn}) returns an object that behaves
// like the Supabase client, except .from('tracker_data') for fitness.
function wrapClient(real,opts){
  opts=opts||{};
  var snaps={};   // clientId -> snapshot of the last server copy read
  // The snapshot a write is diffed against must be the copy THAT caller
  // read and modified -- not whatever was read most recently -- or one
  // screen's older copy could undo another screen's newer change. Merge's
  // code hands back the same object (or its sessions array) it was given,
  // so the snapshot is tied to that object.
  var baseOf=(typeof WeakMap!=='undefined')?new WeakMap():null;
  var pending={}; // clientId -> write in progress (writes to one client run one at a time)
  function meta(payload){
    var m={};
    var c=payload&&payload.coach_id!==undefined?payload.coach_id:(opts.coachId?opts.coachId():null);
    if(c) m.coachId=c;
    var u=payload&&payload.user_id!==undefined?payload.user_id:null;
    if(u) m.userId=u;
    return m;
  }
  function remember(id,d,snap){
    snaps[id]=snap;
    if(baseOf&&d&&typeof d==='object'){
      baseOf.set(d,snap);
      if(Array.isArray(d.sessions)) baseOf.set(d.sessions,snap);
      if(Array.isArray(d.measurements)) baseOf.set(d.measurements,snap);
    }
  }
  function baseFor(id,d){
    if(baseOf&&d&&typeof d==='object'){
      var b=baseOf.get(d)||(Array.isArray(d.sessions)&&baseOf.get(d.sessions))||(Array.isArray(d.measurements)&&baseOf.get(d.measurements));
      if(b) return b;
    }
    return snaps[id]||null;
  }
  // (Access is granted by the database -- nothing to claim from here.)
  function ensureClaim(){ return Promise.resolve(); }
  function readOne(id){
    return ensureClaim(id).then(function(){ return loadBlob(real,id); }).then(function(r){
      if(!r.error) remember(id,r.data,snapshotOf(r.data));
      return r;
    });
  }
  function writeOne(id,d,payloadMeta){
    var prev=pending[id]||Promise.resolve();
    var p=prev.then(function(){
      var base=baseFor(id,d);
      var getBase=base?ensureClaim(id).then(function(){return {error:null};}):readOne(id).then(function(r){ base=snaps[id]; return r; });
      return getBase.then(function(r){
        if(r&&r.error) return {error:r.error};
        if(d&&(d.wiped===true)){
          return wipeClient(real,id,payloadMeta).then(function(w){ if(!w.error) snaps[id]=snapshotOf(null); return w; });
        }
        return saveBlob(real,id,d,base,payloadMeta).then(function(w){
          if(!w.error) remember(id,d,snapshotOf(d));
          else delete snaps[id];   // unknown state: re-read before the next write
          return w;
        });
      });
    });
    pending[id]=p.catch(function(){});
    return p;
  }
  function resolveIds(f){
    // client ids matching the recorded filters, from fitness_clients
    if(f.eq.client_id!=null&&!f.like&&!f.in&&f.eq.user_id==null) return Promise.resolve({ids:[String(f.eq.client_id)],error:null});
    var q=real.from(T_CLIENTS).select('client_id');
    if(f.eq.client_id!=null) q=q.eq('client_id',f.eq.client_id);
    if(f.eq.user_id!=null) q=q.eq('user_id',f.eq.user_id);
    if(f.eq.coach_id!=null) q=q.eq('coach_id',f.eq.coach_id);
    if(f.like) q=q.like('client_id',f.like);
    if(f.in) q=q.in('client_id',f.in);
    return q.then(function(res){
      if(res.error) return {ids:null,error:res.error};
      return {ids:(res.data||[]).map(function(r){return r.client_id;}),error:null};
    });
  }
  function execFitness(st){
    var f=st.f;
    if(st.op==='select'){
      var cols=(st.cols||'*').split(',').map(function(s){return s.trim();});
      var wantData=cols.indexOf('data')>-1||cols.indexOf('*')>-1;
      cols.forEach(function(c){
        if(['data','client_id','*','tracker','updated_at','coach_id','user_id'].indexOf(c)===-1)
          throw new Error('kfit-fitness-store: unsupported fitness select column "'+c+'" -- use a KFitStore function instead');
      });
      return resolveIds(f).then(function(r){
        if(r.error) return {data:null,error:r.error};
        var ids=r.ids;
        if(!wantData){
          if(f.eq.client_id!=null&&!f.like&&!f.in){
            return real.from(T_CLIENTS).select('client_id,coach_id,user_id,updated_at').eq('client_id',ids[0]).then(function(x){
              if(x.error) return {data:null,error:x.error};
              return {data:(x.data||[]).map(function(row){ return shape(row,null,cols); }),error:null};
            });
          }
          return {data:ids.map(function(id){ return shape({client_id:id},null,cols); }),error:null};
        }
        return Promise.all(ids.map(function(id){ return readOne(id).then(function(x){ return {id:id,x:x}; }); })).then(function(all){
          var out=[];
          for(var i=0;i<all.length;i++){
            if(all[i].x.error) return {data:null,error:all[i].x.error};
            if(all[i].x.data) out.push(shape(Object.assign({client_id:all[i].id},all[i].x.client||{}),all[i].x.data,cols));
          }
          return {data:out,error:null};
        });
      });
    }
    if(st.op==='upsert'||st.op==='insert'){
      var rows=Array.isArray(st.payload)?st.payload:[st.payload];
      var chain=Promise.resolve({error:null});
      rows.forEach(function(row){
        chain=chain.then(function(prev){
          if(prev.error) return prev;
          if(!row||row.client_id==null) return {error:{message:'tracker_data write without client_id'}};
          var d=row.data;
          if(typeof d==='string') return {error:{message:'Refused: "data" was a JSON string instead of an object (double-encoding).'}};
          return writeOne(String(row.client_id),d||{},meta(row));
        });
      });
      return chain.then(function(r){ return {data:null,error:r.error||null}; });
    }
    if(st.op==='update'){
      if(!st.payload||st.payload.data===undefined) return Promise.resolve({data:null,error:null}); // nothing fitness-relevant
      if(typeof st.payload.data==='string') return Promise.resolve({data:null,error:{message:'Refused: "data" was a JSON string instead of an object (double-encoding).'}});
      return resolveIds(f).then(function(r){
        if(r.error) return {data:null,error:r.error};
        var chain2=Promise.resolve({error:null});
        r.ids.forEach(function(id){
          chain2=chain2.then(function(prev){ if(prev.error) return prev;
            // update() only ever changed an EXISTING record: an id with no
            // rows at all is a no-op, exactly like an UPDATE matching nothing.
            var known=baseFor(id,st.payload.data);
            var check=(known&&known.cols!==null)?Promise.resolve({data:true,error:null}):readOne(id);
            return check.then(function(x){
              if(x.error) return x;
              if(x.data===null) return {error:null};
              return writeOne(id,st.payload.data,meta(st.payload));
            });
          });
        });
        return chain2.then(function(x){ return {data:null,error:x.error||null}; });
      });
    }
    if(st.op==='delete'){
      return resolveIds(f).then(function(r){
        if(r.error) return {data:null,error:r.error};
        r.ids.forEach(function(id){ delete snaps[id]; });
        return Promise.all(r.ids.map(ensureClaim)).then(function(){ return deleteClients(real,r.ids,f.eq.coach_id||null); }).then(function(x){ return {data:null,error:x.error}; });
      });
    }
    return Promise.resolve({data:null,error:{message:'kfit-fitness-store: unsupported operation '+st.op}});
  }
  function shape(row,d,cols){
    var o={};
    cols.forEach(function(c){
      if(c==='*'){ o.client_id=row.client_id; o.tracker='fitness'; o.data=d; o.coach_id=row.coach_id||null; o.user_id=row.user_id||null; o.updated_at=row.updated_at||null; }
      else if(c==='data') o.data=d;
      else if(c==='tracker') o.tracker='fitness';
      else o[c]=row[c]===undefined?null:row[c];
    });
    return o;
  }
  function Builder(){
    this._ops=[]; this._st={op:null,cols:null,payload:null,f:{eq:{},like:null,in:null,other:[]}};
  }
  ['select','insert','upsert','update','delete'].forEach(function(m){
    Builder.prototype[m]=function(a,b){
      this._ops.push([m,Array.prototype.slice.call(arguments)]);
      if(this._st.op&&m==='select'){ this._st.selectAfter=true; return this; } // e.g. .upsert().select()
      this._st.op=m;
      if(m==='select') this._st.cols=a||'*';
      else if(m!=='delete') this._st.payload=a;
      return this;
    };
  });
  ['eq','like','in','not','neq','order','limit','range','single','maybeSingle','gt','gte','lt','lte','is','ilike','or','match','filter'].forEach(function(m){
    Builder.prototype[m]=function(a,b){
      this._ops.push([m,Array.prototype.slice.call(arguments)]);
      if(m==='eq') this._st.f.eq[a]=b;
      else if(m==='like') this._st.f.like=b;
      else if(m==='in') this._st.f.in=b;
      else this._st.f.other.push(m);
      return this;
    };
  });
  Builder.prototype._isFitness=function(){
    if(this._st.f.eq.tracker!=null) return this._st.f.eq.tracker==='fitness';
    var p=this._st.payload;
    if(p&&(this._st.op==='upsert'||this._st.op==='insert')){
      var rows=Array.isArray(p)?p:[p];
      return rows.length>0&&rows.every(function(r){return r&&r.tracker==='fitness';});
    }
    return false;
  };
  Builder.prototype._run=function(){
    var self=this;
    if(!self._isFitness()){
      // not fitness: replay exactly onto the real table
      var b=real.from('tracker_data');
      self._ops.forEach(function(op){ b=b[op[0]].apply(b,op[1]); });
      return Promise.resolve(b);
    }
    try{
      var bad=self._st.f.other.filter(function(m){ return m!=='order'&&m!=='limit'; });
      if(bad.length) throw new Error('kfit-fitness-store: unsupported filter on fitness tracker_data: '+bad.join(','));
      return execFitness(self._st).then(function(res){
        if(res&&res.error&&!res.error.message) res.error={message:String(res.error)};
        return res;
      },function(e){ return {data:null,error:{message:e&&e.message?e.message:String(e)}}; });
    }catch(e){ return Promise.resolve({data:null,error:{message:e.message}}); }
  };
  Builder.prototype.then=function(ok,bad){ return this._run().then(ok,bad); };
  Builder.prototype.catch=function(bad){ return this._run().catch(bad); };
  Builder.prototype.finally=function(fn){ return this._run().finally(fn); };

  var wrapped=Object.create(null);
  wrapped.from=function(t){ return t==='tracker_data'?new Builder():real.from(t); };
  wrapped.__kfitReal=real;
  wrapped.__kfitForget=function(id){ if(id) delete snaps[id]; else snaps={}; };
  return new Proxy(wrapped,{
    get:function(target,prop){
      if(prop in target) return target[prop];
      var v=real[prop];
      return typeof v==='function'?v.bind(real):v;
    }
  });
}

global.KFitStore={
  // helpers (also used by the tracker's sync)
  msOf:msOf, sid:sid, measKey:measKey, sig:sig, stable:stable,
  compactSession:compactSession, compactMeas:compactMeas,
  clientColsFromBlob:clientColsFromBlob, blobFieldsFromClientRow:blobFieldsFromClientRow,
  clientColSigs:clientColSigs, CLIENT_COLS:CLIENT_COLS,
  sessionRow:sessionRow, tombstoneRow:tombstoneRow, measRow:measRow, measTombstoneRow:measTombstoneRow,
  // I/O
  loadBlob:loadBlob, saveBlob:saveBlob, snapshotOf:snapshotOf, wipeClient:wipeClient, deleteClients:deleteClients,
  pull:pull, push:push, myClients:myClients, linkVerified:linkVerified, requestAccess:requestAccess, official:official,
  listClientSummaries:listClientSummaries, pendingRequestClientIds:pendingRequestClientIds,
  listRequests:listRequests, listTrash:listTrash,
  wrapClient:wrapClient,
  TABLES:[T_CLIENTS,T_SESS,T_MEAS]
};
})(typeof window!=='undefined'?window:globalThis);
