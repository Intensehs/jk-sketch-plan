/* ===== v2.1 MEP: one ribbon tab with Electrical, Mechanical and Plumbing groups ===== */
["ewires","mech","ducts","plumb","plines"].forEach(function(k){if(LVK.indexOf(k)<0)LVK.push(k)});
Object.assign(EK,{elec:"elec",ewire:"ewires",mech:"mech",duct:"ducts",plumb:"plumb",pline:"plines"});
Object.assign(EKN,{elec:"Electrical point",ewire:"Wiring",mech:"Mechanical unit",duct:"Duct",plumb:"Plumbing fixture",pline:"Pipe"});
Object.assign(EKV,{elec:"elec",ewire:"elec",mech:"mech",duct:"mech",plumb:"plumb",pline:"plumb"});
LINE2.ewire=1;LINE2.duct=1;LINE2.pline=1;
Object.assign(ICO,{
 ewire:'<path d="M4 18h4l3-8 3 8h6"/><circle cx="7" cy="18" r="1.4"/><circle cx="17" cy="18" r="1.4"/>',
 acunit:'<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 12h10M9 9v6M15 9v6"/>',
 duct:'<rect x="3" y="8" width="18" height="8" rx="1"/><path d="M7 8v8M17 8v8"/>',
 plumb:'<path d="M7 4h10v4H7z"/><path d="M12 8v6"/><path d="M8 20c0-3 8-3 8 0"/><path d="M8 14h8v3H8z"/>',
 pline:'<path d="M4 16c4-10 12 4 16-6"/><circle cx="4" cy="16" r="1.5"/><circle cx="20" cy="10" r="1.5"/>'});
Object.assign(TD14,{
 elec:["Point","Electrical points: lights, fans, switches, sockets, DB","elec"],
 ewire:["Wiring","Draw a wiring run (length used in takeoff / estimate)","ewire"],
 acunit:["AC / Mech","Place AC indoor / outdoor units and mechanical equipment","acunit"],
 duct:["Duct","Draw a duct run","duct"],
 plumb:["Fixture","Plumbing fixtures: WC, basin, sink, trap, IC, tap","plumb"],
 pline:["Pipe","Supply / drainage pipe run","pline"]});
Object.assign(HINTS,{
 elec:"Pick a point type, tap to place · drag to move · tap a point to change / delete",
 ewire:"Drag (or tap 2 points) to draw a wiring run · length is measured for quantities",
 acunit:"Pick a unit type, tap to place · drag to move",
 duct:"Drag (or tap 2 points) to draw a duct",
 plumb:"Pick a fixture, tap to place · drag to move",
 pline:"Drag (or tap 2 points) for supply / drainage pipe"});
Object.assign(RLAB,{elec:"Point",ewire:"Wiring",acunit:"AC",duct:"Duct",plumb:"Fixture",pline:"Pipe"});

(function(){var n={};
 Object.keys(PANELS).forEach(function(k){n[k]=PANELS[k];
  if(k==="struct")n.mep=["MEP",[["Electrical","Elec.",["elec","ewire"]],["Mechanical","Mech.",["acunit","duct"]],["Plumbing","Plumb.",["plumb","pline"]]]]});
 PANELS=n;PANELS.arch[1]=PANELS.arch[1].filter(function(p){return p[0]!=="Electrical"});
 TABS={};Object.keys(PANELS).forEach(function(k){TABS[k]=[PANELS[k][0],panelTools(k)]})})();

var MLT=[["ac_in","AC indoor"],["ac_out","AC outdoor"],["ahu","AHU / fan coil"],["exhfan","Exhaust fan"],["vent","Vent / grille"]];
var PLT=[["wc","WC / closet"],["basin","Wash basin"],["sink","Kitchen sink"],["shower","Shower"],["tap","Tap / bibcock"],["ft","Floor trap"],["gully","Gully trap"],["ic","Inspection chamber"],["oh","OH tank"],["ug","UG sump"]];
function mlName(t){var r=MLT.find(function(e){return e[0]===t});return r?r[1]:t}
function plName(t){var r=PLT.find(function(e){return e[0]===t});return r?r[1]:t}

function mepPrims(kind,t,r){var P=[];function c(x,y,rr,f){P.push({k:"c",x:x,y:y,r:rr,f:f})}function l(x1,y1,x2,y2){P.push({k:"l",a:[x1,y1],b:[x2,y2]})}function tx(s){P.push({k:"t",s:s})}function rec(w,h,f){P.push({k:"r",w:w,h:h,f:f})}
 if(kind==="mech"){if(t==="ac_in"){rec(r*2.2,r*1.1);tx("AC")}else if(t==="ac_out"){rec(r*2.4,r*1.4,1);tx("ODU")}else if(t==="ahu"){rec(r*2.2,r*1.6);tx("AHU")}else if(t==="exhfan"){c(0,0,r);l(-r*0.6,-r*0.6,r*0.6,r*0.6);tx("EF")}else{rec(r*1.6,r*1.2);tx("V")}}
 else{if(t==="wc"){c(0,r*0.2,r*0.7);rec(r*1.1,r*1.6);tx("WC")}else if(t==="basin"){c(0,0,r*0.8);tx("WB")}else if(t==="sink"){rec(r*2,r*1.2);tx("S")}else if(t==="shower"){c(0,0,r*0.5);l(0,-r,0,r);tx("SH")}else if(t==="tap"){l(-r,0,r,0);c(r,0,r*0.35,1)}else if(t==="ft"){c(0,0,r);c(0,0,r*0.4,1);tx("FT")}else if(t==="gully"){c(0,0,r);tx("GT")}else if(t==="ic"){rec(r*1.8,r*1.8);tx("IC")}else if(t==="oh"){rec(r*2.2,r*1.4,1);tx("OHT")}else{rec(r*2.2,r*1.4);tx("UG")}}
 return P}
function drawMepSym(e,col,sel){var q=w2s(e.x,e.y),r=Math.max(7,0.5*V.s);g.save();g.translate(q.x,q.y);g.strokeStyle=e.id===sel? "#2563eb":col;g.fillStyle=g.strokeStyle;g.lineWidth=1.6;
 mepPrims(e._k,e.t,r).forEach(function(p){if(p.k==="c"){g.beginPath();g.arc(p.x,p.y,p.r,0,7);p.f?g.fill():g.stroke()}else if(p.k==="l"){g.beginPath();g.moveTo(p.a[0],p.a[1]);g.lineTo(p.b[0],p.b[1]);g.stroke()}else if(p.k==="r"){if(p.f){g.globalAlpha=0.25;g.fillRect(-p.w/2,-p.h/2,p.w,p.h);g.globalAlpha=1}g.strokeRect(-p.w/2,-p.h/2,p.w,p.h)}else if(p.k==="t"){g.font="bold "+Math.round(r*0.7)+"px Roboto,Arial";g.textAlign="center";g.textBaseline="middle";g.fillText(p.s,0,0)}});g.restore()}
function drawMepLines(A,col,selId){(A||[]).forEach(function(m){var a=w2s(m.a.x,m.a.y),b=w2s(m.b.x,m.b.y);g.save();g.strokeStyle=m.id===selId?"#2563eb":col;g.lineWidth=m.id===selId?3:2;g.setLineDash(m.k==="drain"?[8,4]:m.k==="duct"?[10,3]:[]);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke();g.setLineDash([]);
  var c=w2s((m.a.x+m.b.x)/2,(m.a.y+m.b.y)/2);g.fillStyle=g.strokeStyle;g.font="bold 10px Roboto,Arial";g.textAlign="center";g.fillText(fi(Math.hypot(m.b.x-m.a.x,m.b.y-m.a.y)),c.x,c.y-6);g.restore()})}
function drawMepCanvas(){if(UI.clean)return;
 if(visOn("elec")!==false){drawMepLines(S.ewires||[],"#b45309",UI.mepSel);(S.elec||[]).forEach(function(e){e._k="elec"})}
 if(visOn("mech")!==false){drawMepLines(S.ducts||[],"#7c3aed",UI.mepSel);(S.mech||[]).forEach(function(e){e._k="mech";drawMepSym(e,"#7c3aed",UI.mepSel)})}
 if(visOn("plumb")!==false){drawMepLines(S.plines||[],"#0e7490",UI.mepSel);(S.plumb||[]).forEach(function(e){e._k="plumb";drawMepSym(e,"#0e7490",UI.mepSel)})}}
var _dscM=drawStructCanvas;drawStructCanvas=function(){_dscM.apply(this,arguments);try{drawMepCanvas()}catch(e){console.warn(e)}};

function mepHitPt(arr,w){var R=Math.max(0.8,12/V.s),best=null;(arr||[]).forEach(function(e){var d=Math.hypot(e.x-w.x,e.y-w.y);if(d<R){R=d;best=e}});return best}
function mepHitLn(arr,w){var R=snapR()*1.1,best=null;(arr||[]).forEach(function(m){var d=d2seg(w,m.a,m.b);if(d<R){R=d;best=m}});return best}
function mepPlace(arrKey,t,w){snapshot();var e={id:nid(),x:Math.round(w.x*4)/4,y:Math.round(w.y*4)/4,t:t};lvArr(arrKey).push(e);UI.mepSel=e.id;changed();return e}

var _ttM=toolTap;toolTap=function(w){var t=UI.tool;
 if(t==="acunit"){var h=mepHitPt(S.mech,w);if(h){UI.mepSel=h.id;mepPtPopup("mech",h,MLT,mlName);return true}var e=mepPlace("mech",UI.mlT||"ac_in",w);toast(mlName(e.t)+" placed");return true}
 if(t==="plumb"){var h2=mepHitPt(S.plumb,w);if(h2){UI.mepSel=h2.id;mepPtPopup("plumb",h2,PLT,plName);return true}var e2=mepPlace("plumb",UI.plT||"wc",w);toast(plName(e2.t)+" placed");return true}
 if(t==="ewire"){var hw=mepHitLn(S.ewires,w);if(hw&&!(UI.lpA)){UI.mepSel=hw.id;mepLnPopup(hw,"Wiring");return true}}
 if(t==="duct"){var hd=mepHitLn(S.ducts,w);if(hd&&!(UI.lpA)){UI.mepSel=hd.id;mepLnPopup(hd,"Duct");return true}}
 if(t==="pline"){var hp=mepHitLn(S.plines,w);if(hp&&!(UI.lpA)){UI.mepSel=hp.id;mepLnPopup(hp,"Pipe");return true}}
 return _ttM.apply(this,arguments)};

var _tdM=toolDown;toolDown=function(w,G){var t=UI.tool;
 if(t==="acunit"){var h=mepHitPt(S.mech,w);if(h){G.kind="dragmep";G.arr="mech";G.eid=h.id;G.snap=false;return true}}
 if(t==="plumb"){var h2=mepHitPt(S.plumb,w);if(h2){G.kind="dragmep";G.arr="plumb";G.eid=h2.id;G.snap=false;return true}}
 return _tdM.apply(this,arguments)};
var _tmM=toolMove;toolMove=function(w,G,p){if(G.kind==="dragmep"){if(G.moved){if(!G.snap){snapshot();G.snap=true}var e=(S[G.arr]||[]).find(function(x){return x.id===G.eid});if(e){e.x=Math.round(w.x*4)/4;e.y=Math.round(w.y*4)/4;SHEET=null;render()}}return true}return _tmM.apply(this,arguments)};
var _tuM=toolUp;toolUp=function(G,w){if(G.kind==="dragmep"){if(G.snap)changed();else{var e=(S[G.arr]||[]).find(function(x){return x.id===G.eid});if(e){UI.mepSel=e.id;if(G.arr==="mech")mepPtPopup("mech",e,MLT,mlName);else mepPtPopup("plumb",e,PLT,plName)}}return true}return _tuM.apply(this,arguments)};

var _clM=commitLine;commitLine=function(t,a,b){if(t==="ewire"||t==="duct"||t==="pline"){var L=Math.hypot(b.x-a.x,b.y-a.y);if(L<0.3){toast("Too short");return}snapshot();
  var m={id:nid(),a:{x:a.x,y:a.y},b:{x:b.x,y:b.y}};if(t==="pline")m.k=UI.plK||"supply";if(t==="duct")m.k="duct";
  lvArr(t==="ewire"?"ewires":t==="duct"?"ducts":"plines").push(m);changed();toast((t==="ewire"?"Wiring":t==="duct"?"Duct":(m.k==="drain"?"Drain":"Supply"))+" "+fi(L));return}
 return _clM.apply(this,arguments)};

function mepPtPopup(arr,e,types,nameFn){modal('<div class="mt">'+esc(nameFn(e.t))+'</div><div class="grid2">'+types.map(function(t){return '<button class="bb'+(t[0]===e.t?" ok":"")+'" data-mt="'+t[0]+'">'+esc(t[1])+'</button>'}).join("")+'</div><div class="row"><button class="bb del" id="mpDel">Delete</button><button class="bb" id="mpX">Close</button></div>',function(b){
 b.querySelectorAll("[data-mt]").forEach(function(x){x.onclick=function(){snapshot();e.t=x.dataset.mt;closeModal();changed()}});
 $("mpX").onclick=closeModal;$("mpDel").onclick=function(){snapshot();S[arr]=S[arr].filter(function(x){return x!==e});closeModal();changed()}})}
function mepLnPopup(m,title){var L=Math.hypot(m.b.x-m.a.x,m.b.y-m.a.y);modal('<div class="mt">'+esc(title)+'</div><div class="ms">Length <b>'+fi(L)+'</b> ('+(L*0.3048).toFixed(2)+' m)</div>'+
 (title==="Pipe"?'<div class="row"><button class="bb'+(m.k!=="drain"?" on":"")+'" id="mpSup">Supply</button><button class="bb'+(m.k==="drain"?" on":"")+'" id="mpDr">Drainage</button></div>':'')+
 '<div class="row"><button class="bb del" id="mlDel">Delete</button><button class="bb" id="mlX">Close</button></div>',function(){
 $("mlX").onclick=closeModal;$("mlDel").onclick=function(){snapshot();["ewires","ducts","plines"].forEach(function(k){S[k]=(S[k]||[]).filter(function(x){return x!==m})});closeModal();changed()};
 if($("mpSup"))$("mpSup").onclick=function(){snapshot();m.k="supply";closeModal();changed()};if($("mpDr"))$("mpDr").onclick=function(){snapshot();m.k="drain";closeModal();changed()}})}

var _ucM=updCtx;updCtx=function(){_ucM.apply(this,arguments);var c=$("ctx");if(!c||UI.clean)return;var T=UI.tool,h="";
 if(T==="acunit")h=CDV+MLT.map(function(t){return cb("mlt:"+t[0],esc(t[1]),"",(UI.mlT||"ac_in")===t[0])}).join("");
 else if(T==="plumb")h=CDV+PLT.map(function(t){return cb("plt:"+t[0],esc(t[1]),"",(UI.plT||"wc")===t[0])}).join("");
 else if(T==="pline")h=CDV+cb("plk:supply","Supply","", (UI.plK||"supply")==="supply")+cb("plk:drain","Drainage","",UI.plK==="drain")+cbI("ortho","angle",UI.ortho===90?"90°":UI.ortho===45?"45°":"Free","Angle snap",true);
 else if(T==="ewire"||T==="duct")h=CDV+cbI("ortho","angle",UI.ortho===90?"90°":UI.ortho===45?"45°":"Free","Angle snap",true);
 if(h){c.insertAdjacentHTML("beforeend",h);c.querySelectorAll("[data-c]").forEach(function(b){b.onclick=function(){ctxAction(b.dataset.c)}})}};
var _caM=ctxAction;ctxAction=function(k){
 if(k.indexOf("mlt:")===0){UI.mlT=k.slice(4);updCtx();return}if(k.indexOf("plt:")===0){UI.plT=k.slice(4);updCtx();return}
 if(k.indexOf("plk:")===0){UI.plK=k.slice(4);updCtx();return}return _caM.apply(this,arguments)};

var _hlM=hitList;hitList=function(w,R){var out=_hlM.apply(this,arguments);
 function add(k,id,d,pri){if(d<=R)out.push({k:k,id:id,d:d-pri*R*0.3})}
 if(visOn("elec")!==false){(S.elec||[]).forEach(function(e){add("elec",e.id,Math.hypot(e.x-w.x,e.y-w.y),2)});(S.ewires||[]).forEach(function(m){add("ewire",m.id,d2seg(w,m.a,m.b),1)})}
 if(visOn("mech")!==false){(S.mech||[]).forEach(function(e){add("mech",e.id,Math.hypot(e.x-w.x,e.y-w.y),2)});(S.ducts||[]).forEach(function(m){add("duct",m.id,d2seg(w,m.a,m.b),1)})}
 if(visOn("plumb")!==false){(S.plumb||[]).forEach(function(e){add("plumb",e.id,Math.hypot(e.x-w.x,e.y-w.y),2)});(S.plines||[]).forEach(function(m){add("pline",m.id,d2seg(w,m.a,m.b),1)})}
 out.sort(function(a,b){return a.d-b.d});return out};

function mepSheetSym(d,x,y,kind,t,r,col){mepPrims(kind,t,r).forEach(function(p){if(p.k==="c")d.poly(circ(x+p.x,y+p.y,p.r,16),{w:0.2,c:col,fill:p.f?col:undefined,L:"ANNO"});
 else if(p.k==="l")d.line(x+p.a[0],y+p.a[1],x+p.b[0],y+p.b[1],{w:0.2,c:col,L:"ANNO"});
 else if(p.k==="r")d.rect(x-p.w/2,y-p.h/2,p.w,p.h,{w:0.2,c:col,fill:p.f?"#ede9fe":undefined,L:"ANNO"});
 else if(p.k==="t")d.text(x,y,p.s,r*0.62,{a:"middle",v:"mid",bold:true,c:col,L:"ANNO"})})}
function sh_mep(kind,sh,lab,RI){var lv=sh.slv,d=stFrame(),U=stSetup(d,lv,[PX,PY,PW,PH],{elec:true,mg:12}),R=U.R,col=kind==="mech"?"#7c3aed":"#0e7490",title=kind==="mech"?"MECHANICAL":"PLUMBING";
 stWalls(d,R,lv,{fill:"#e5e7eb"});
 var pts=kind==="mech"?S.L[lv].mech||[]:S.L[lv].plumb||[],lns=kind==="mech"?S.L[lv].ducts||[]:S.L[lv].plines||[],types=kind==="mech"?MLT:PLT,cnt={};
 lns.forEach(function(m){var a=R(m.a.x,m.a.y),b=R(m.b.x,m.b.y);d.line(a[0],a[1],b[0],b[1],{w:0.35,c:col,dash:m.k==="drain"?[2,1.2]:undefined,L:"ANNO"})});
 pts.forEach(function(e){var p=R(e.x,e.y);mepSheetSym(d,p[0],p[1],kind,e.t,1.8,col);cnt[e.t]=(cnt[e.t]||0)+1});
 var rows=types.filter(function(t){return cnt[t[0]]}).map(function(t){return ["",t[1],cnt[t[0]]]}),y0=PY+12;
 rows.push({0:"",1:"TOTAL",2:pts.length,bold:true});
 var totL=lns.reduce(function(a,m){return a+Math.hypot(m.b.x-m.a.x,m.b.y-m.a.y)},0);
 if(totL)rows.push({0:"",1:(kind==="mech"?"Duct":"Pipe")+" length",2:fi(totL)});
 var y=table(d,TX,y0,[["Symbol",16],["Item",46],["Nos",16]],rows,{title:title+" LEGEND",rh:6});
 types.filter(function(t){return cnt[t[0]]}).forEach(function(t,i){mepSheetSym(d,TX+8,y0+6+i*6+3,kind,t[0],1.6,col)});
 stNote(d,TX,y+6,TW,"NOTES",kind==="mech"?["AC indoor units at high level; outdoor units as marked.","Duct sizes to be confirmed with the HVAC vendor."]:["Inspection chambers at drainage junctions.","Pipe runs are schematic; confirm invert levels on site."]);
 stDone(d,sh,lab,RI,U.N,S.L[lv].name+" "+(kind==="mech"?"Mechanical":"Plumbing")+" Layout")}
STB.mech=function(sh,lab,RI){sh_mep("mech",sh,lab,RI)};
STB.plumb=function(sh,lab,RI){sh_mep("plumb",sh,lab,RI)};
var _slM=sheetList;sheetList=function(){var L=_slM.apply(this,arguments);
 S.L.forEach(function(Lv,i){if((Lv.mech||[]).length||(Lv.ducts||[]).length)L.push({key:"mech"+i,st:"mech",slv:i,no:"M1"+String(i+1).padStart(2,"0"),title:Lv.name+" Mechanical Layout",short:Lv.name.split(" ")[0]+" Mechanical"});
  if((Lv.plumb||[]).length||(Lv.plines||[]).length)L.push({key:"plumb"+i,st:"plumb",slv:i,no:"P1"+String(i+1).padStart(2,"0"),title:Lv.name+" Plumbing Layout",short:Lv.name.split(" ")[0]+" Plumbing"})});
 return L};

var _pexM=planExtras;planExtras=function(d,R,k){_pexM.apply(this,arguments);function P(p){return R(p.x,p.y)}
 if(visOn("elec")!==false)(S.ewires||[]).forEach(function(m){var a=P(m.a),b=P(m.b);d.line(a[0],a[1],b[0],b[1],{w:0.22,c:"#b45309",L:"ANNO"})});
 if(visOn("mech")!==false){(S.ducts||[]).forEach(function(m){var a=P(m.a),b=P(m.b);d.line(a[0],a[1],b[0],b[1],{w:0.28,c:"#7c3aed",L:"ANNO"})});(S.mech||[]).forEach(function(e){var p=P(e);mepSheetSym(d,p[0],p[1],"mech",e.t,1.6,"#7c3aed")})}
 if(visOn("plumb")!==false){(S.plines||[]).forEach(function(m){var a=P(m.a),b=P(m.b);d.line(a[0],a[1],b[0],b[1],{w:0.22,c:"#0e7490",dash:m.k==="drain"?[1.6,0.8]:undefined,L:"ANNO"})});(S.plumb||[]).forEach(function(e){var p=P(e);mepSheetSym(d,p[0],p[1],"plumb",e.t,1.6,"#0e7490")})}};
var _peM=planExt;planExt=function(ext){_peM(ext);(S.ewires||[]).concat(S.ducts||[],S.plines||[]).forEach(function(m){ext(m.a);ext(m.b)});(S.mech||[]).concat(S.plumb||[]).forEach(ext)};
