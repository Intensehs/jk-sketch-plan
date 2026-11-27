/* ===== v2.1 file / autosave / quantities / estimate / crash recovery ===== */
Object.assign(ICO,{
 qty:'<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M7 9h10M7 13h10M7 17h6"/>',
 est:'<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 8h8M8 12h8M8 16h5"/>',
 "a:new":'<path d="M5 3h9l5 5v13H5z"/><path d="M14 3v5h5"/><path d="M9 14h6M12 11v6"/>'});
Object.assign(TD14,{"a:new":["New","New drawing (asks if unsaved)","a:new"],"a:qty":["Quantities","Automatic quantity takeoff from the drawing","qty"],"a:est":["Estimate","Cost estimate in rupees from takeoff quantities","est"]});
Object.assign(RLAB,{"a:new":"New","a:qty":"Qty","a:est":"Estimate"});
PANELS.view[1].forEach(function(p){if(p[0]==="File"){if(p[2].indexOf("a:new")<0)p[2].unshift("a:new");if(p[2].indexOf("a:qty")<0)p[2].push("a:qty");if(p[2].indexOf("a:est")<0)p[2].push("a:est")}});
TABS={};Object.keys(PANELS).forEach(function(k){TABS[k]=[PANELS[k][0],panelTools(k)]});

function asOn(){var v=LS.get("jksp_as_on",true);return v!==false}
function asSet(on){LS.set("jksp_as_on",!!on);asInd(on?"saved":"off");if(on){DIRTY=true;autosave()}}
function asInd(st){var el=$("asInd");if(!el)return;el.className="asind "+(st||"");el.textContent=st==="off"?"Autosave off":st==="saving"?"Saving…":st==="unsaved"?"Unsaved":"Saved"}
function drawingEmpty(){return typeof fioEmpty==="function"?fioEmpty():!S.L.some(function(L){return LVK.some(function(k){return L[k]&&L[k].length})})}
function hasUnsaved(){if(drawingEmpty())return false;if(typeof fioSig!=="function")return !!DIRTY;if(FIO&&FIO.sig&&FIO.sig===fioSig())return false;return true}

/* ----- crash / close recovery ----- */
function crashGet(){return LS.get("jksp_crash",null)}
function crashList(){return LS.get("jksp_crash_list",[])}
function crashWrite(){try{if(!asOn())return;if(drawingEmpty())return;var rec={id:CURID||null,name:(S.meta&&S.meta.name)||"Unsaved drawing",t:Date.now(),dirty:hasUnsaved(),doc:JSON.parse(JSON.stringify(S))};
 LS.set("jksp_crash",rec);LS.set("jksp_sess",{alive:true,t:rec.t,id:rec.id});
 var key=rec.id?("p"+rec.id):("c"+rec.t);
 var L=crashList().filter(function(e){return e.k!==key && !(rec.id&&e.id===rec.id)});L.unshift({k:key,name:rec.name,t:rec.t,id:rec.id});LS.set("jksp_crash_list",L.slice(0,6));
 try{localStorage.setItem("jksp_rf_"+key,JSON.stringify({format:"jksp",doc:rec.doc}))}catch(e){}}catch(e){}}
function crashClear(){try{localStorage.removeItem("jksp_crash")}catch(e){}LS.set("jksp_sess",{alive:false,t:Date.now()})}
function crashMarkSaved(){var c=crashGet();if(c){c.dirty=false;LS.set("jksp_crash",c)}LS.set("jksp_sess",{alive:false,t:Date.now()})}
function needsRecover(c){if(!c||!c.doc)return false;var sess=LS.get("jksp_sess",null);if(sess&&sess.alive===false&&!c.dirty)return false;return !!c.dirty||(sess&&sess.alive===true)}
function fmtWhen(t){try{return new Date(t).toLocaleString("en-IN",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}catch(e){return ""+t}}

function unsavedAsk(next,opt){opt=opt||{};if(!hasUnsaved()){if(next)next("ok");return}
 modal('<div class="mt">You have unsaved changes</div><div class="ms">Save this drawing before continuing? Autosave already keeps a recovery copy if the app closes or crashes.</div>'+
  '<div class="ms"><b>'+esc((S.meta&&S.meta.name)||"Untitled")+'</b>'+(FIO&&FIO.hname?' · file '+esc(FIO.hname):"")+'</div>'+
  '<div class="row"><button class="bb ok" id="usSave">Save</button><button class="bb del" id="usNo">Don\'t save</button><button class="bb" id="usX">Cancel</button></div>',function(){
  $("usX").onclick=function(){closeModal();if(opt.onCancel)opt.onCancel()};
  $("usNo").onclick=function(){if(typeof FIO!=="undefined"&&typeof fioSig==="function")FIO.sig=fioSig();crashClear();closeModal();if(next)next("discard")};
  $("usSave").onclick=function(){closeModal();Promise.resolve(doExplicitSave()).then(function(){if(next)next("save")})}})}
function doExplicitSave(){autosave();crashMarkSaved();if(typeof fileSave==="function")return fileSave(false);return null}
function newDrawingAsk(){unsavedAsk(function(){newDrawing();if(typeof FIO!=="undefined"){FIO.handle=null;FIO.hname="";FIO.sig=typeof fioSig==="function"?fioSig():null}crashClear();if(typeof startDialog==="function")startDialog()})}

function recoverDialog(c){c=c||crashGet();if(!c){startDialog();return}
 modal('<div class="mt">Recover unsaved drawing</div><div class="ms">The app closed without a confirmed Save (tab close, back, crash or battery). A recovery copy from autosave is available.</div>'+
  '<div class="file"><div><b>'+esc(c.name||"Unsaved drawing")+'</b><small>Last autosave '+esc(fmtWhen(c.t))+(c.id?" · project "+esc(c.id):"")+'</small></div></div>'+
  recentsHTML({skipT:c.t,skipId:c.id})+
  '<div class="row"><button class="bb ok" id="rcYes">Restore</button><button class="bb del" id="rcNo">Discard</button><button class="bb" id="rcSkip">Start menu</button></div>',function(box){
  $("rcYes").onclick=function(){closeModal();loadRecovered(c)};
  $("rcNo").onclick=function(){crashClear();closeModal();startDialog()};
  $("rcSkip").onclick=function(){closeModal();startDialog()};
  bindRecentRows(box)})}
function loadRecovered(c){try{var D=JSON.parse(JSON.stringify(c.doc));D.meta=Object.assign(blank().meta,D.meta||{});S=docify(D);S.furn=S.furn||[];CURID=c.id||("d"+Date.now().toString(36));UNDO=[];REDO=[];UI.chain=null;UI.chainFree=null;UI.sel=[];
  if(typeof setClean==="function")setClean(false);fitAll();changed();DIRTY=true;autosave();updTitle();if(typeof FIO!=="undefined")FIO.sig=null;crashClear();toast("Restored autosave from "+fmtWhen(c.t))}catch(e){toast("Could not restore");startDialog()}}
function recentsHTML(opt){opt=opt||{};var R=(typeof fioRecent==="function"?fioRecent():[]),C=crashList().filter(function(e){if(opt.skipId&&e.id===opt.skipId)return false;if(opt.skipT&&e.t===opt.skipT)return false;return true});
 var h='<div class="ms" style="margin-top:10px"><b>Recent / recovered files</b></div>';
 if(!R.length&&!C.length)return h+'<p class="ms">None yet.</p>';
 h+=C.slice(0,4).map(function(e){return '<div class="file"><div><b>'+esc(e.name)+'</b><small>Recovered · '+esc(fmtWhen(e.t))+'</small></div><button class="bb pri" data-rc="'+esc(e.k)+'">Open</button></div>'}).join("");
 h+=R.slice(0,6).map(function(e){return '<div class="file"><div><b>'+esc(e.name)+'</b><small>Recent · '+esc(fmtWhen(e.t))+'</small></div><button class="bb pri" data-rf="'+esc(e.k)+'">Open</button></div>'}).join("");
 return h}
function bindRecentRows(box){box.querySelectorAll("[data-rf]").forEach(function(b){b.onclick=function(){if(typeof fioOpenRecent==="function")fioOpenRecent(b.dataset.rf);else closeModal()}});
 box.querySelectorAll("[data-rc]").forEach(function(b){b.onclick=function(){var k=b.dataset.rc,t=null;try{t=localStorage.getItem("jksp_rf_"+k)}catch(e){}
  if(!t){toast("That recovery copy is no longer stored");return}closeModal();if(typeof fioLoad==="function")fioLoad(t,"Recovered.jksp",null);else{try{var o=JSON.parse(t);loadRecovered({doc:o.doc||o,name:"Recovered",t:Date.now()})}catch(e){toast("Could not open")}}}})}

function startDialog(){if(Date.now()-(startDialog._t||0)<400)return;startDialog._t=Date.now();var L=idxList(),crash=crashGet();
 modal('<div class="mt">JK Sketch Plan</div><div class="ms">Start a new drawing, open a saved project, or pick up a recent / recovered file.</div>'+
  '<div class="grid2"><button class="bb ok" id="stNew">New<small>blank drawing</small></button><button class="bb pri" id="stProj">Open project<small>saved in this browser</small></button>'+
  '<button class="bb" id="stFile">Open file<small>.jksp / .json</small></button>'+(crash&&crash.doc?'<button class="bb on" id="stRec">Recover unsaved<small>'+esc(fmtWhen(crash.t))+'</small></button>':'')+'</div>'+
  (L.length?'<div class="ms" style="margin-top:10px"><b>Saved projects</b></div>'+L.slice(0,8).map(function(e){return '<div class="file"><div><b>'+esc(e.name)+(e.id===CURID?" (open)":"")+'</b><small>'+sq(e.area||0)+' sq.ft · '+esc(fmtWhen(e.updated))+'</small></div><button class="bb pri" data-open="'+e.id+'">Open</button></div>'}).join(""):"")+
  recentsHTML()+
  '<div class="row"><button class="bb" id="stX">Close</button></div>',function(box){
  $("stNew").onclick=function(){closeModal();unsavedAsk(function(){newDrawing()})};
  $("stProj").onclick=function(){closeModal();filesPopup()};
  $("stFile").onclick=function(){unsavedAsk(function(){if(typeof fileOpen==="function")fileOpen()})};
  if($("stRec"))$("stRec").onclick=function(){closeModal();recoverDialog(crash)};
  $("stX").onclick=closeModal;
  box.querySelectorAll("[data-open]").forEach(function(b){b.onclick=function(){closeModal();unsavedAsk(function(){openDrawing(b.dataset.open)})}});
  bindRecentRows(box)})}

function projectPopup(){var R=typeof fioRecent==="function"?fioRecent():[],canPick=!!window.showSaveFilePicker&&!window.Android,L=idxList();
 modal('<div class="mt">Save / Open</div><div class="ms">'+(FIO&&FIO.hname?"Current file: <b>"+esc(FIO.hname)+"</b>":"Save as a named project (this browser) or as a .jksp file.")+(hasUnsaved()?" · <b>unsaved changes</b>":"")+'</div>'+
  '<div class="grid2"><button class="bb ok" id="fiSave">Save<small>'+(FIO&&FIO.handle?"overwrite "+esc(FIO.hname):canPick?"choose where to save":"download .jksp")+'</small></button>'+
  '<button class="bb" id="fiSaveAs">Save As…<small>named project or new file</small></button>'+
  '<button class="bb pri" id="fiOpen">Open file<small>.jksp / .json</small></button><button class="bb pri" id="fiProj">Open project<small>saved drawings</small></button></div>'+
  (L.length?'<div class="ms" style="margin-top:10px"><b>Projects in this browser</b></div>'+L.slice(0,8).map(function(e){return '<div class="file"><div><b>'+esc(e.name)+(e.id===CURID?" (open)":"")+'</b><small>'+esc(fmtWhen(e.updated))+'</small></div><button class="bb pri" data-open="'+e.id+'">Open</button></div>'}).join(""):"")+
  recentsHTML()+
  '<div class="row"><button class="bb" id="fiX">Close</button></div>',function(box){
  $("fiSave").onclick=function(){closeModal();doExplicitSave()};
  $("fiSaveAs").onclick=function(){closeModal();saveAsPopup()};
  $("fiOpen").onclick=function(){unsavedAsk(function(){if(typeof fileOpen==="function")fileOpen()})};
  $("fiProj").onclick=function(){closeModal();filesPopup()};
  $("fiX").onclick=closeModal;
  box.querySelectorAll("[data-open]").forEach(function(b){b.onclick=function(){closeModal();unsavedAsk(function(){openDrawing(b.dataset.open)})}});
  bindRecentRows(box)})}
function saveAsPopup(){var n=(S.meta.name||defaultName());
 modal('<div class="mt">Save As</div><label class="fld">Project name<input id="saN" value="'+escH(n)+'"></label>'+
  '<div class="row"><button class="bb ok" id="saProj">Save project<small>this browser</small></button><button class="bb pri" id="saFile">Save file<small>.jksp</small></button><button class="bb" id="saX">Cancel</button></div>',function(){
  $("saX").onclick=closeModal;
  $("saProj").onclick=function(){var nm=$("saN").value.trim()||defaultName();S.meta.name=nm;if(!CURID)CURID="d"+Date.now().toString(36);DIRTY=true;autosave();if(typeof FIO!=="undefined"&&typeof fioSig==="function")FIO.sig=fioSig();crashMarkSaved();closeModal();updTitle();toast("Saved project: "+nm)};
  $("saFile").onclick=function(){var nm=$("saN").value.trim();if(nm)S.meta.name=nm;closeModal();if(typeof fileSave==="function")fileSave(true);crashMarkSaved()}})}

/* wrap autosave / changed / init / new / back */
var _as0=autosave;autosave=function(){if(!asOn()){asInd("off");return}asInd("saving");_as0.apply(this,arguments);crashWrite();asInd(hasUnsaved()?"unsaved":"saved")};
var _ch0=changed;changed=function(){_ch0.apply(this,arguments);if(!asOn())asInd("off");else asInd("unsaved")};
var ASINT=setInterval(function(){if(asOn()&&DIRTY)autosave()},15000);
var _nd0=newDrawing;newDrawing=function(){_nd0.apply(this,arguments);if(typeof FIO!=="undefined"){FIO.handle=null;FIO.hname="";FIO.sig=typeof fioSig==="function"?fioSig():""}asInd("saved")};
var _od0=openDrawing;openDrawing=function(id){_od0(id);if(typeof FIO!=="undefined"&&typeof fioSig==="function")FIO.sig=fioSig();asInd("saved")};
var _ob0=onBack;onBack=function(){if(window.V3&&V3.on){close3D();return 1}if($("modal")&&$("modal").classList.contains("show")){var t=($("mbox")&&$("mbox").querySelector(".mt"));if(t&&/unsaved changes/i.test(t.textContent||""))return 1;closeModal();return 1}
 if(UI.clean){setClean(false);return 1}if(hasUnsaved()){unsavedAsk(function(how){crashWrite();if(how==="discard")crashClear();if(window.Android&&typeof window.Android.exitApp==="function")window.Android.exitApp();else if(window.Android&&typeof window.Android.close==="function")window.Android.close()});return 1}
 autosave();crashMarkSaved();return _ob0.apply(this,arguments)};
window.addEventListener("beforeunload",function(e){if(!hasUnsaved())return;crashWrite();e.preventDefault();e.returnValue="";return ""});
var _ph=function(){if(asOn()){if(DIRTY)_as0();crashWrite();if(!hasUnsaved())crashMarkSaved()}};
window.addEventListener("pagehide",_ph);document.addEventListener("visibilitychange",function(){if(document.hidden)_ph()});

var BOOTING=true,FEAT21BOOTED=false;
function feat21Boot(){if(FEAT21BOOTED)return;FEAT21BOOTED=true;BOOTING=false;
 asInd(asOn()?(hasUnsaved()?"unsaved":"saved"):"off");
 var b=$("bNew");if(b)b.onclick=function(){newDrawingAsk()};
 var tog=$("asInd");if(tog)tog.onclick=function(){asSet(!asOn());toast("Autosave "+(asOn()?"ON":"OFF"))};
 var crash=crashGet();
 if(needsRecover(crash)){startDialog._t=Date.now();setTimeout(function(){recoverDialog(crash)},60);return}
 if(drawingEmpty()&&typeof startDialog==="function")setTimeout(startDialog,80)}
var _init0=init;init=function(){_init0.apply(this,arguments);feat21Boot()};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",feat21Boot);
else setTimeout(feat21Boot,0);

var _ra21=railAction;railAction=function(a){if(a==="new"){newDrawingAsk();return}if(a==="qty"){qtyPopup();return}if(a==="est"){estPopup();return}if(a==="fsave"){doExplicitSave();return}if(a==="fopen"){projectPopup();return}return _ra21.apply(this,arguments)};
document.addEventListener("keydown",function(e){if(!(e.ctrlKey||e.metaKey)||e.altKey)return;if((e.key||"").toLowerCase()!=="n")return;if(window.V3&&V3.on)return;if(/INPUT|TEXTAREA|SELECT/.test((e.target||{}).tagName||""))return;e.preventDefault();newDrawingAsk()},true);

function hookFio(){if(typeof filePopup!=="function"){setTimeout(hookFio,20);return}
 filePopup=projectPopup;
 var _fs=fileSave;fileSave=function(){var r=_fs.apply(this,arguments);Promise.resolve(r).then(function(){if(typeof FIO!=="undefined"&&typeof fioSig==="function")FIO.sig=fioSig();crashMarkSaved();asInd("saved")});return r}}
setTimeout(hookFio,0);
if(window.JKS){JKS.onBack=onBack;JKS.newDrawing=newDrawingAsk;JKS.autosave=autosave;JKS.openDrawing=openDrawing;JKS.startDialog=startDialog;JKS.qtyPopup=qtyPopup;JKS.estPopup=estPopup}

/* ----- beam: Match wall chip + Auto/Manual in beam popup ----- */
var _ucFeat=updCtx;updCtx=function(){_ucFeat.apply(this,arguments);var c=$("ctx");if(!c||UI.clean||UI.tool!=="beam")return;
 var h=CDV+cb("bmatch","Match wall","width = wall",!UI.beamMan)+cb("bman","Manual","override",!!UI.beamMan);
 c.insertAdjacentHTML("beforeend",h);c.querySelectorAll("[data-c]").forEach(function(b){b.onclick=function(){ctxAction(b.dataset.c)}})};
var _caFeat=ctxAction;ctxAction=function(k){
 if(k.indexOf("bs:")===0){UI.beamMan=1;UI.beamSz=k.slice(3).split("x").map(Number);updCtx();render();return _caFeat.apply(this,arguments)}
 if(k==="bmatch"){UI.beamMan=false;var L=typeof selOf==="function"?selOf("beam"):[];L.forEach(function(m){delete m.wov;var th=wallThAlong(m.a,m.b);if(th)m.w=th});changed();updCtx();toast("Beam width matches the wall");return}
 if(k==="bman"){UI.beamMan=true;updCtx();toast("New beams use the typed width");return}
 return _caFeat.apply(this,arguments)};
(function(){var _bp=beamPopup;beamPopup=function(){var sel=typeof selOf==="function"?selOf("beam"):[],m0=sel[0];
 _bp.apply(this,arguments);setTimeout(function(){var box=$("mbox");if(!box||!box.querySelector("#bw"))return;
  var bar=document.createElement("div");bar.className="ms";bar.innerHTML='<b>Width:</b> <label><input type="radio" name="bautoW" value="a" '+(UI.beamMan?"":"checked")+'> Auto (match wall)</label> · <label><input type="radio" name="bautoW" value="m" '+(UI.beamMan?"checked":"")+'> Manual override</label>';
  var g=box.querySelector(".grid2");if(g)g.parentNode.insertBefore(bar,g);
  var ok=$("bOk");if(!ok)return;var prev=ok.onclick;ok.onclick=function(){var r=document.querySelector('input[name="bautoW"]:checked');UI.beamMan=r&&r.value==="m";
   if(!UI.beamMan){var L=document.querySelector('input[name="scp"]:checked');var sc=L?L.value:"all";var list=sc==="sel"?sel:sc==="all"?S.L.reduce(function(a,Lv){return a.concat(Lv.beams||[])},[]):[];
    list.forEach(function(m){delete m.wov;var th=wallThAlong(m.a,m.b);if(th)m.w=th})}else{var list2=(document.querySelector('input[name="scp"]:checked')||{}).value==="sel"?sel:S.L.reduce(function(a,Lv){return a.concat(Lv.beams||[])},[]);list2.forEach(function(m){m.wov=1})}
   if(prev)prev()};},0)};})();

/* ===== quantities ===== */
function cuFt(v){return Math.round(v*100)/100}
function sqFt(v){return Math.round(v*10)/10}
function kgR(v){return Math.round(v*10)/10}
function qtySteel(){var kg=0,note=[];
 S.L.forEach(function(Lv,i){withLevel(i,function(){
  (S.cols||[]).forEach(function(c){var r=colRB(c),H=Lv.h+(i===0?(ftgOf(c).dep||5):0),lenM=H*0.3048,main=r.n*lenM*kgm(r.dia),peri=2*(c.w+c.d)/39.37,ties=Math.max(1,Math.ceil(H*304.8/r.sp))*(peri+0.05)*kgm(r.tie);kg+=main+ties});
  (S.beams||[]).forEach(function(m){var r=beamRB(m),L=Math.hypot(m.b.x-m.a.x,m.b.y-m.a.y),Lm=L*0.3048,main=(r.top*kgm(r.td)+r.bot*kgm(r.bd))*Lm,stirr=Math.max(1,Math.ceil(L*304.8/r.sp))*(2*(m.w+m.d)/39.37+0.05)*kgm(r.st);kg+=main+stirr});
  if(i===0)(S.cols||[]).forEach(function(c){var f=ftgOf(c),nx=Math.max(2,Math.ceil(f.l*304.8/f.sp)+1),ny=Math.max(2,Math.ceil(f.w*304.8/f.sp)+1);kg+=nx*(f.w*0.3048)*kgm(f.dia)+ny*(f.l*0.3048)*kgm(f.dia)});
  var RI=roomsInfo(),sr=slabRB();RI.faces.forEach(function(f){var a=f.carpet!=null?f.carpet:f.area,md=sr.md,ms=sr.ms/1000,dd=sr.dd,ds=sr.ds/1000;kg+=(a*0.092903)*(kgm(md)/ms+kgm(dd)/ds)})})});
 return kg}
function qtyBuild(){var wallL=0,wallA=0,wallV=0,brick=0,opA=0,doors=0,wins=0,rails=0,floorA=0,wallTile=0,paintW=0,paintC=0,ftgN=0,ftgExc=0,ftgConc=0,colV=0,beamV=0,slabV=0,slabA=0,cent=0,wireL=0,ductL=0,pipeL=0,ePts=0,mPts=0,pPts=0,furnN=0,rooms=[];
 S.L.forEach(function(Lv,i){withLevel(i,function(){var H=Lv.h,sl=(Lv.slab||5)/12,RI=roomsInfo();
  (S.segs||[]).forEach(function(s){var L=segLen(s),t=wallT(s);wallL+=L;wallA+=L*H;wallV+=L*t*H;brick+=L*t*H});
  (S.ops||[]).forEach(function(o){var w=o.w||3,h=opH(o);opA+=w*h;if(o.type==="D")doors++;else wins++;wallA=Math.max(0,wallA-w*h);paintW=paintW});
  (S.rails||[]).forEach(function(m){rails+=Math.hypot(m.b.x-m.a.x,m.b.y-m.a.y)});
  RI.faces.forEach(function(f){var a=f.carpet!=null?f.carpet:f.area,per=0;for(var k=0;k<f.pts.length;k++){var p=f.pts[k],q=f.pts[(k+1)%f.pts.length];per+=Math.hypot(q.x-p.x,q.y-p.y)}floorA+=a;paintC+=a;paintW+=per*(H-sl);wallTile+=per*4;slabA+=a;slabV+=a*sl;cent+=a+per*(H*0.15);
   rooms.push({name:(S.L.length>1?Lv.name+": ":"")+(f.labels[0]?f.labels[0].name:"Room"),area:sqFt(a),level:Lv.name})});
  (S.cols||[]).forEach(function(c){var w=c.w/12,d=c.d/12;colV+=w*d*H;cent+=2*(w+d)*H;if(i===0){var f=ftgOf(c),fw=f.w,fl=f.l,ft=f.t,dep=f.dep;ftgN++;ftgExc+=fw*fl*dep;ftgConc+=fw*fl*ft;cent+=2*(fw+fl)*ft}});
  (S.beams||[]).forEach(function(m){var L=Math.hypot(m.b.x-m.a.x,m.b.y-m.a.y),w=m.w/12,d=m.d/12;beamV+=L*w*d;cent+=L*(w+2*d)});
  (S.ewires||[]).forEach(function(m){wireL+=Math.hypot(m.b.x-m.a.x,m.b.y-m.a.y)});
  (S.ducts||[]).forEach(function(m){ductL+=Math.hypot(m.b.x-m.a.x,m.b.y-m.a.y)});
  (S.plines||[]).forEach(function(m){pipeL+=Math.hypot(m.b.x-m.a.x,m.b.y-m.a.y)});
  ePts+=(S.elec||[]).length;mPts+=(S.mech||[]).length;pPts+=(S.plumb||[]).length;furnN+=(S.furn||[]).length})});
 if(typeof roofPlanPoly==="function"){var RP=roofPlanPoly();if(RP&&RP.length>=3){var ra=Math.abs(polyArea(RP)),th=((S.L[topLevel()]||{}).slab||5)/12;if(ra>slabA){slabA=ra;slabV=ra*th}}}
 var steel=qtySteel();
 function row(id,name,unit,qty,note){return {id:id,name:name,unit:unit,qty:+(+qty).toFixed(2),note:note||""}}
 return {rooms:rooms,sections:[
  {id:"ftg",name:"Footing",rows:[row("ftg_n","Footings (nos)","nos",ftgN),row("ftg_exc","Excavation","cu.ft",ftgExc,"size × depth"),row("ftg_pcc","PCC bed (assumed 3\")","cu.ft",ftgN?ftgExc*0.05:0),row("ftg_rcc","RCC footing concrete","cu.ft",ftgConc)]},
  {id:"conc",name:"Concrete (RCC)",rows:[row("c_ftg","Footing","cu.ft",ftgConc),row("c_col","Column","cu.ft",colV),row("c_beam","Beam","cu.ft",beamV),row("c_slab","Slab / roof (incl. overhang)","cu.ft",slabV),row("c_tot","Total RCC","cu.ft",ftgConc+colV+beamV+slabV)]},
  {id:"cent",name:"Centering / shuttering",rows:[row("cent","Shuttering area","sq.ft",cent,"footing + column + beam + slab") ]},
  {id:"stl",name:"Steel / reinforcement",rows:[row("stl","Rebar (from Kambi data)","kg",steel,"columns, beams, footing mesh, slab")]},
  {id:"wall",name:"Walls / brickwork",rows:[row("w_len","Wall length","ft",wallL),row("w_area","Wall area (gross)","sq.ft",wallA),row("w_vol","Brickwork volume","cu.ft",brick)]},
  {id:"tile",name:"Tiles",rows:[row("t_flr","Floor tiles","sq.ft",floorA,"per room carpet"),row("t_wall","Wall tiles (dado ~4')","sq.ft",wallTile)]},
  {id:"paint",name:"Painting",rows:[row("p_wall","Wall painting","sq.ft",paintW),row("p_ceil","Ceiling painting","sq.ft",paintC)]},
  {id:"op",name:"Doors / windows / rails",rows:[row("doors","Doors","nos",doors),row("wins","Windows / vents","nos",wins),row("rails","Handrails","ft",rails)]},
  {id:"mep",name:"Electrical / MEP",rows:[row("e_pts","Electrical points","nos",ePts),row("e_wire","Wiring length","ft",wireL),row("m_pts","Mechanical units","nos",mPts),row("m_duct","Duct length","ft",ductL),row("p_pts","Plumbing fixtures","nos",pPts),row("p_pipe","Pipe length","ft",pipeL)]},
  {id:"furn",name:"Furniture",rows:[row("furn","Furniture / fixtures","nos",furnN)]}
 ]}}
function qtyFlat(Q){var o={};(Q.sections||[]).forEach(function(s){(s.rows||[]).forEach(function(r){o[r.id]=r})});return o}

function qtyTableHTML(Q){var h='<table class="qtbl"><thead><tr><th>Item</th><th>Qty</th><th>Unit</th><th>Notes</th></tr></thead><tbody>';
 Q.sections.forEach(function(s){h+='<tr class="qh"><td colspan="4">'+esc(s.name)+'</td></tr>';s.rows.forEach(function(r){h+='<tr><td>'+esc(r.name)+'</td><td class="qn">'+r.qty+'</td><td>'+esc(r.unit)+'</td><td class="ms">'+esc(r.note||"")+'</td></tr>'})});
 if(Q.rooms&&Q.rooms.length){h+='<tr class="qh"><td colspan="4">Flooring per room</td></tr>';Q.rooms.forEach(function(r){h+='<tr><td>'+esc(r.name)+'</td><td class="qn">'+r.area+'</td><td>sq.ft</td><td>'+esc(r.level||"")+'</td></tr>'})}
 return h+'</tbody></table>'}
function qtyCSV(Q){var lines=[["Section","Item","Qty","Unit","Notes"].join(",")];
 Q.sections.forEach(function(s){s.rows.forEach(function(r){lines.push([csvQ(s.name),csvQ(r.name),r.qty,csvQ(r.unit),csvQ(r.note||"")].join(","))})});
 (Q.rooms||[]).forEach(function(r){lines.push([csvQ("Flooring"),csvQ(r.name),r.area,"sq.ft",csvQ(r.level||"")].join(","))});
 return "\ufeff"+lines.join("\n")}
function csvQ(s){s=String(s==null?"":s);return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s}
function qtyXLS(title,head,rows){var h='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>'+esc(title)+'</x:Name></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table border="1"><tr>'+head.map(function(c){return "<th>"+esc(c)+"</th>"}).join("")+"</tr>";
 rows.forEach(function(r){h+="<tr>"+r.map(function(c){return "<td>"+esc(c)+"</td>"}).join("")+"</tr>"});return h+"</table></body></html>"}
function qtyPDF(title,head,rows){var d=new Dwg();frame(d,title,(S.meta.name||"Drawing")+" · "+(S.meta.owner||""));
 var y=40,cols=head.map(function(c,i){return [c,i===0?90:(i===head.length-1?70:40)]}),chunk=32,i=0;
 while(i<rows.length){var part=rows.slice(i,i+chunk).map(function(r){return r.slice()});y=table(d,20,y,cols,part,{rh:5.2});i+=chunk;if(i<rows.length){y+=8;if(y>250){d.text(20,y,"(continued in CSV / Excel export for the full list)",2.4,{c:"#555"});break}}}
 saveFile(fname("pdf").replace(/\.pdf$/,"_"+(title.replace(/\s+/g,"_"))+".pdf"),new Blob([bin(toPDF(d,S.meta.paper||"A3"))],{type:"application/pdf"}),"application/pdf")}
function qtyPopup(){var Q=qtyBuild();
 modal('<div class="mt">Quantity takeoff</div><div class="ms">Lengths, areas and volumes from the drawing (ft-in / cu.ft). Roof overhang and MEP runs are included.</div><div class="qwrap">'+qtyTableHTML(Q)+'</div>'+
  '<div class="row"><button class="bb" id="qCsv">CSV</button><button class="bb" id="qXls">Excel</button><button class="bb" id="qPdf">PDF</button><button class="bb ok" id="qEst">Estimate</button><button class="bb" id="qX">Close</button></div>',function(){
  $("qX").onclick=closeModal;$("qEst").onclick=function(){closeModal();estPopup()};
  $("qCsv").onclick=function(){saveFile(fname("csv").replace(/\.csv$/,"_qty.csv"),new Blob([qtyCSV(Q)],{type:"text/csv"}),"text/csv")};
  $("qXls").onclick=function(){var rows=[];Q.sections.forEach(function(s){s.rows.forEach(function(r){rows.push([s.name,r.name,r.qty,r.unit,r.note||""])})});saveFile(fname("xls").replace(/\.xls$/,"_qty.xls"),new Blob([qtyXLS("Quantities",["Section","Item","Qty","Unit","Notes"],rows)],{type:"application/vnd.ms-excel"}),"application/vnd.ms-excel")};
  $("qPdf").onclick=function(){var rows=[];Q.sections.forEach(function(s){rows.push({0:s.name,1:"",2:"",3:"",bold:true});s.rows.forEach(function(r){rows.push([r.name,r.qty,r.unit,r.note||""])})});qtyPDF("Quantity takeoff",["Item","Qty","Unit","Notes"],rows)}});
 $("mbox").classList.add("wide")}

/* ===== cost estimate (INR) ===== */
var EST_TPL_DEFAULT=[
 {sec:"Footing",id:"ftg_exc",name:"Earthwork excavation",unit:"cu.ft",rate:28,src:"ftg_exc"},
 {sec:"Footing",id:"ftg_pcc",name:"PCC 1:4:8 under footing",unit:"cu.ft",rate:160,src:"ftg_pcc"},
 {sec:"Footing",id:"ftg_rcc",name:"RCC footing M20",unit:"cu.ft",rate:280,src:"ftg_rcc"},
 {sec:"Concrete",id:"c_col",name:"RCC column M20",unit:"cu.ft",rate:310,src:"c_col"},
 {sec:"Concrete",id:"c_beam",name:"RCC beam M20",unit:"cu.ft",rate:300,src:"c_beam"},
 {sec:"Concrete",id:"c_slab",name:"RCC slab / roof M20",unit:"cu.ft",rate:290,src:"c_slab"},
 {sec:"Centering",id:"cent",name:"Centering / shuttering",unit:"sq.ft",rate:48,src:"cent"},
 {sec:"Steel",id:"stl",name:"TMT steel (from Kambi)",unit:"kg",rate:82,src:"stl"},
 {sec:"Brickwork",id:"w_vol",name:"Brickwork in CM",unit:"cu.ft",rate:145,src:"w_vol"},
 {sec:"Tiles",id:"t_flr",name:"Floor tiles laid",unit:"sq.ft",rate:95,src:"t_flr"},
 {sec:"Tiles",id:"t_wall",name:"Wall tiles (dado)",unit:"sq.ft",rate:85,src:"t_wall"},
 {sec:"Electrical",id:"e_pts",name:"Electrical points",unit:"nos",rate:480,src:"e_pts"},
 {sec:"Electrical",id:"e_wire",name:"Concealed wiring",unit:"ft",rate:42,src:"e_wire"},
 {sec:"Painting",id:"p_wall",name:"Wall painting (2 coats)",unit:"sq.ft",rate:18,src:"p_wall"},
 {sec:"Painting",id:"p_ceil",name:"Ceiling painting",unit:"sq.ft",rate:16,src:"p_ceil"},
 {sec:"Openings",id:"wins",name:"Windows",unit:"nos",rate:6500,src:"wins"},
 {sec:"Openings",id:"doors",name:"Doors",unit:"nos",rate:9500,src:"doors"},
 {sec:"Rails",id:"rails",name:"Handrails (running length)",unit:"ft",rate:380,src:"rails"}
];
function inr(n){n=Math.round(+n||0);var neg=n<0;n=Math.abs(n);var s=String(n),last=s.slice(-3),rest=s.slice(0,-3);if(rest)rest=rest.replace(/\B(?=(\d{2})+(?!\d))/g,",");return (neg?"-":"")+"₹"+(rest?rest+","+last:last)}
function estTplLoad(){var t=LS.get("jksp_est_tpl",null);if(Array.isArray(t)&&t.length)return t.map(function(x){return Object.assign({},x)});return EST_TPL_DEFAULT.map(function(x){return Object.assign({},x)})}
function estTplSave(tpl){LS.set("jksp_est_tpl",tpl)}
function estLinesFrom(Q,tpl,saved){var map=qtyFlat(Q),used={};var lines=(saved&&saved.lines&&saved.lines.length?saved.lines:tpl).map(function(L,i){var q=L.qty;if(L.src&&map[L.src]&&(saved&&saved.lockQty&&saved.lockQty[L.id||L.src]))q=L.qty;
  else if(L.src&&map[L.src])q=map[L.src].qty;var rate=+L.rate||0;q=+q||0;used[L.src||L.id]=1;return {id:L.id||L.src||("x"+i),sec:L.sec||"Other",name:L.name,unit:L.unit||"",qty:q,rate:rate,src:L.src||"",amt:q*rate}});
 return lines}
function estTotals(lines){var sec={},g=0;lines.forEach(function(L){sec[L.sec]=(sec[L.sec]||0)+L.amt;g+=L.amt});return {sec:sec,g:g}}
function estState(){S.meta.est=S.meta.est||{lines:null,lockQty:{}};return S.meta.est}
function estPopup(){var Q=qtyBuild(),tpl=estTplLoad(),st=estState(),lines=estLinesFrom(Q,tpl,st);
 function body(){var T=estTotals(lines),h='<div class="mt">Cost estimate (INR)</div><div class="ms">Amount = qty × rate. Edit rates or quantities, add or remove lines, then save as the template for later drawings.</div><div class="qwrap"><table class="qtbl est"><thead><tr><th></th><th>Item</th><th>Qty</th><th>Unit</th><th>Rate ₹</th><th>Amount ₹</th></tr></thead><tbody>';
  var last="";lines.forEach(function(L,i){if(L.sec!==last){last=L.sec;h+='<tr class="qh"><td colspan="5">'+esc(L.sec)+'</td><td class="qn">'+inr(T.sec[L.sec]||0)+'</td></tr>'}
   h+='<tr data-i="'+i+'"><td><button class="bb del qdel" data-i="'+i+'">×</button></td><td><input class="en" value="'+escH(L.name)+'"></td><td><input class="eq" type="number" step="0.01" value="'+L.qty+'"></td><td><input class="eu" value="'+escH(L.unit)+'"></td><td><input class="er" type="number" step="1" value="'+L.rate+'"></td><td class="qn">'+inr(L.amt)+'</td></tr>'});
  h+='<tr class="qh"><td colspan="5">Grand total</td><td class="qn">'+inr(T.g)+'</td></tr></tbody></table></div>';
  h+='<div class="ms" style="font-size:17px;font-weight:800;text-align:right;margin:4px 0 8px">Grand total '+inr(T.g)+'</div>';
  h+='<div class="row"><button class="bb" id="eAdd">+ Line</button><button class="bb" id="eTpl">Save as template</button><button class="bb" id="eRst">Reset rates</button></div>';
  h+='<div class="row"><button class="bb" id="eCsv">CSV</button><button class="bb" id="eXls">Excel</button><button class="bb" id="ePdf">PDF</button><button class="bb ok" id="eOk">Save in project</button><button class="bb" id="eX">Close</button></div>';
  return h}
 function read(){var rows=$("mbox").querySelectorAll("tr[data-i]");rows.forEach(function(tr){var i=+tr.dataset.i,L=lines[i];if(!L)return;L.name=tr.querySelector(".en").value;L.qty=+tr.querySelector(".eq").value||0;L.unit=tr.querySelector(".eu").value;L.rate=+tr.querySelector(".er").value||0;L.amt=L.qty*L.rate})}
 function re(){read();$("mbox").innerHTML=body();bind()}
 function bind(){$("eX").onclick=closeModal;$("eAdd").onclick=function(){read();lines.push({id:"c"+Date.now(),sec:"Extra",name:"New item",unit:"nos",qty:1,rate:0,src:"",amt:0});re()};
  $("mbox").querySelectorAll(".qdel").forEach(function(b){b.onclick=function(){read();lines.splice(+b.dataset.i,1);re()}});
  $("mbox").querySelectorAll(".eq,.er,.en,.eu").forEach(function(inp){inp.onchange=function(){re()}});
  $("eTpl").onclick=function(){read();estTplSave(lines.map(function(L){return {sec:L.sec,id:L.id,name:L.name,unit:L.unit,rate:L.rate,src:L.src}}));toast("Template saved — later drawings reuse these rates")};
  $("eRst").onclick=function(){tpl=EST_TPL_DEFAULT.map(function(x){return Object.assign({},x)});lines=estLinesFrom(Q,tpl,null);re()};
  $("eOk").onclick=function(){read();snapshot();S.meta.est={lines:lines,lockQty:{}};lines.forEach(function(L){S.meta.est.lockQty[L.id]=1});closeModal();changed();toast("Estimate saved with the project · "+inr(estTotals(lines).g))};
  $("eCsv").onclick=function(){read();var t=estTotals(lines),out=["Section,Item,Qty,Unit,Rate INR,Amount INR"];lines.forEach(function(L){out.push([csvQ(L.sec),csvQ(L.name),L.qty,csvQ(L.unit),L.rate,Math.round(L.amt)].join(","))});out.push(["","","","","Grand total",Math.round(t.g)].join(","));saveFile(fname("csv").replace(/\.csv$/,"_estimate.csv"),new Blob(["\ufeff"+out.join("\n")],{type:"text/csv"}),"text/csv")};
  $("eXls").onclick=function(){read();var t=estTotals(lines),rows=lines.map(function(L){return [L.sec,L.name,L.qty,L.unit,L.rate,Math.round(L.amt)]});rows.push(["","","","","Grand total",Math.round(t.g)]);saveFile(fname("xls").replace(/\.xls$/,"_estimate.xls"),new Blob([qtyXLS("Estimate",["Section","Item","Qty","Unit","Rate INR","Amount INR"],rows)],{type:"application/vnd.ms-excel"}),"application/vnd.ms-excel")};
  $("ePdf").onclick=function(){read();var t=estTotals(lines),rows=[];var last="";lines.forEach(function(L){if(L.sec!==last){last=L.sec;rows.push({0:L.sec,1:"",2:"",3:"",4:inr(t.sec[L.sec]||0),bold:true})}rows.push([L.name,L.qty,L.unit,L.rate,inr(L.amt)])});rows.push({0:"GRAND TOTAL",1:"",2:"",3:"",4:inr(t.g),bold:true});qtyPDF("Cost estimate (INR)",["Item","Qty","Unit","Rate","Amount"],rows)};
 }
 modal(body(),bind);$("mbox").classList.add("wide")}
