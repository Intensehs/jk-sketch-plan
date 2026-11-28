/* ===== v2.1.6 Elevation Design: projected Front/Rear/Left/Right, offset, sill/lintel ===== */
/* Stage: Elevation - Elevation Design tab: Front/Rear/Left/Right from the plan, offset, sill/lintel, PDF/PNG */
Object.assign(ICO,{
 efront:'<path d="M3 21h18"/><path d="M5 21V10l7-6 7 6v11"/><rect x="9.5" y="14" width="5" height="7"/>',
 erear:'<path d="M3 21h18"/><path d="M5 21V11h14v10"/><path d="M9 21v-6h6v6"/>',
 eleft:'<path d="M3 21h18"/><path d="M8 21V9l4-5 4 5v12"/><path d="M11 21v-7h2v7"/>',
 eright:'<path d="M3 21h18"/><path d="M7 21V10h10v11"/><rect x="10" y="13" width="4" height="8"/>'});
Object.assign(TD14,{
 eline:["Line","Draw an elevation line (solid or dashed)","dline"],
 eoff:["Offset","Parallel line at a typed distance (ft-in)","offset"],
 edim:["Dimension","Aligned dimension or height on the elevation","dim"],
 espot:["Height","Height marker at the tap (sill / lintel / FFL)","spot"],
 etext:["Text","Text label on the elevation","text"],
 edel:["Delete","Tap a drafted line, dimension, height or text to delete","del"],
 "a:efront":["Front","Front elevation (South face)","efront"],
 "a:erear":["Rear","Rear elevation (North face)","erear"],
 "a:eleft":["Left","Left elevation (West face)","eleft"],
 "a:eright":["Right","Right elevation (East face)","eright"],
 "a:esill":["Sill / Lintel","Edit typical sill and lintel heights","level"],
 "a:elevpdf":["PDF","Export this elevation as PDF","pdf"],
 "a:elevpng":["PNG","Export this elevation as PNG","img"]});
Object.assign(HINTS,{
 eline:"Drag (or tap two points) to draw a line on the elevation · snaps 90°",
 eoff:"Tap a wall edge or line, on the side to offset · distance is in the option bar",
 edim:"Tap two points, then tap where the dimension line should sit",
 espot:"Tap a point to drop a height marker (uses the elevation Z)",
 etext:"Tap to add a text label",
 edel:"Tap a drafted line, dimension, height or text · generated walls stay (edit the plan)"});
Object.assign(RLAB,{eline:"Line",eoff:"Offset",edim:"Dim",espot:"Height",etext:"Text",edel:"Delete",
 "a:efront":"Front","a:erear":"Rear","a:eleft":"Left","a:eright":"Right","a:esill":"Sill","a:elevpdf":"PDF","a:elevpng":"PNG"});
LINE2.eline=1;LINE2.edim=1;

(function(){if(typeof PANELS==="undefined")return;var n={};
 Object.keys(PANELS).forEach(function(k){n[k]=PANELS[k];
  if(k==="qty")n.elev=["Elevation",[
   ["Views","View",["a:efront","a:erear","a:eleft","a:eright"]],
   ["Draft","Draft",["eline","eoff","edim","espot","etext","edel"]],
   ["Library","Lib.",["eel","a:etpl","a:erend"]],
   ["Levels","Lv",["a:esill"]],
   ["Export","Exp.",["a:elevpdf","a:elevpng"]]
  ]]});
 PANELS=n;TABS={};Object.keys(PANELS).forEach(function(k){TABS[k]=[PANELS[k][0],panelTools(k)]})})();

var EFACE={S:{k:"S",n:"Front",sub:"South"},N:{k:"N",n:"Rear",sub:"North"},W:{k:"W",n:"Left",sub:"West"},E:{k:"E",n:"Right",sub:"East"}};
var ETOOL={eline:1,eoff:1,edim:1,espot:1,etext:1,edel:1,eel:1};
function elevFace(){var e=S&&S.elev,k=e&&e.face;return EFACE[k]?k:"S"}
function elevFaceInfo(){return EFACE[elevFace()]}
function elevDoc(){var d={face:"S",sill:3,lintel:7,lines:[],dims:[],notes:[],spots:[],els:[]};
 if(!S||!S.elev||typeof S.elev!=="object")return d;
 var e=S.elev;d.face=EFACE[e.face]?e.face:"S";d.sill=e.sill!=null&&isFinite(+e.sill)?+e.sill:3;d.lintel=e.lintel!=null&&isFinite(+e.lintel)?+e.lintel:7;
 d.lines=Array.isArray(e.lines)?e.lines:[];d.dims=Array.isArray(e.dims)?e.dims:[];d.notes=Array.isArray(e.notes)?e.notes:[];d.spots=Array.isArray(e.spots)?e.spots:[];
 d.els=Array.isArray(e.els)?e.els:[];return d}
function elevEnsure(){if(!S.elev||typeof S.elev!=="object")S.elev={face:"S",sill:3,lintel:7,lines:[],dims:[],notes:[],spots:[],els:[]};
 var e=S.elev;if(!EFACE[e.face])e.face="S";if(e.sill==null||!isFinite(+e.sill))e.sill=3;if(e.lintel==null||!isFinite(+e.lintel))e.lintel=7;
 if(!Array.isArray(e.lines))e.lines=[];if(!Array.isArray(e.dims))e.dims=[];if(!Array.isArray(e.notes))e.notes=[];if(!Array.isArray(e.spots))e.spots=[];
 if(!Array.isArray(e.els))e.els=[];return e}
function elevApplyOpDefaults(){var e=S&&S.elev;if(!e)return;if(e.sill!=null&&isFinite(+e.sill))OPSILL.W=+e.sill;
 if(e.sill!=null&&e.lintel!=null&&isFinite(+e.sill)&&isFinite(+e.lintel))OPHGT.W=Math.max(0.5,+e.lintel-+e.sill)}
function elevSetFace(k){if(!EFACE[k])return;elevEnsure().face=k;UI.eOffPend=null;UI.lp=null;UI.lpA=null;UI.dimPend=null;if(UI.elev)elevFit();updCtx();render();toast(EFACE[k].n+" elevation ("+EFACE[k].sub+")")}

function elevEnter(){if(UI.elev){if(!ETOOL[UI.tool])UI.tool="eline";elevApplyOpDefaults();return}
 UI.elev=true;UI._planV={s:V.s,ox:V.ox,oy:V.oy};if(UI.clean)setClean(false);if(!ETOOL[UI.tool])UI.tool="eline";
 UI.lp=null;UI.lpA=null;UI.dimPend=null;UI.preview=null;UI.eOffPend=null;UI.sel=[];elevApplyOpDefaults();elevFit();updCtx();render()}
function elevLeave(){if(!UI.elev)return;UI.elev=false;UI.eOffPend=null;UI.lp=null;UI.lpA=null;UI.dimPend=null;UI.eRect=null;
 if(ETOOL[UI.tool]){var L=TABS[UI.tab]&&TABS[UI.tab][1].filter(function(x){return x.indexOf("a:")<0});UI.tool=(L&&L[0])||"draw"}
 if(UI._planV){V.s=UI._planV.s;V.ox=UI._planV.ox;V.oy=UI._planV.oy;UI._planV=null}render()}
function elevSync(){if(UI.tab==="elev")elevEnter();else elevLeave()}

function elevBox(){var Vv=elevView(elevFace()),b=viewBox(Vv),e=elevDoc();
 function add(x,y){b[0]=Math.min(b[0],x);b[1]=Math.min(b[1],y);b[2]=Math.max(b[2],x);b[3]=Math.max(b[3],y)}
 e.lines.forEach(function(m){add(m.a.x,m.a.y);add(m.b.x,m.b.y)});e.dims.forEach(function(m){add(m.a.x,m.a.y);add(m.b.x,m.b.y)});
 e.notes.forEach(function(n){add(n.x,n.y)});e.spots.forEach(function(s){add(s.x,s.y)});
 (e.els||[]).forEach(function(el){add(el.x,el.y);add(el.x+(el.w||0),el.y+(el.h||0))});
 elevLevelList().forEach(function(L){add(b[0],L.z);add(b[2],L.z)});
 if(!isFinite(b[0]))b=[-4,-2,20,14];b[0]-=1.5;b[2]+=9;b[1]-=1;b[3]+=1;return b}
function elevFit(){var b=elevBox(),w=Math.max(b[2]-b[0],8),h=Math.max(b[3]-b[1],8),pad=48,tp=UI.noopt?0:36;
 V.s=clamp(Math.min((CW-2*pad)/w,(CH-2*pad-tp)/h),4,80);
 V.ox=CW/2-(b[0]+b[2])/2*V.s;V.oy=(CH+tp)/2+(b[1]+b[3])/2*V.s;render()}
function elevLevelList(){var e=elevDoc(),out=[],seen={},ti=typeof topLevel==="function"?topLevel():0,rc=typeof roofCfg==="function"?roofCfg():{type:"flat",par:3};
 function add(z,t){var k=Math.round(z*100);if(seen[k])return;seen[k]=1;out.push({z:z,t:t})}
 add(-(typeof PLH==="number"?PLH:1.5),"GROUND");add(0,"PLINTH / FFL");
 (S.L||[]).forEach(function(L,i){var zb=lvElev(i);if(i>0)add(zb,ascii(L.name).toUpperCase());add(zb+e.sill,"SILL");add(zb+e.lintel,"LINTEL")});
 var T=S.L[ti],top=lvElev(ti)+(T&&T.h>0?T.h:10),par=(rc&&rc.type==="flat")?(+rc.par||0):0;
 add(top+(par||0),par>0?"ROOF / PARAPET":"ROOF");return out}

function elevEdges(){var Vv=elevView(elevFace()),out=[],seen={};
 function push(a,b,src){var L=Math.hypot(b.x-a.x,b.y-a.y);if(L<0.08)return;var k=[a.x,a.y,b.x,b.y].map(function(v){return Math.round(v*50)}).join(",");if(seen[k])return;seen[k]=1;out.push({a:a,b:b,src:src||"gen",L:L})}
 Vv.items.forEach(function(it){if(it.p&&it.p.length>=2){for(var i=0;i<it.p.length;i++){var p=it.p[i],q=it.p[(i+1)%it.p.length];push({x:p[0],y:p[1]},{x:q[0],y:q[1]},"wall")}}
  (it.lines||[]).forEach(function(l){push({x:l[0],y:l[1]},{x:l[2],y:l[3]},"open")})});
 elevDoc().lines.forEach(function(m){push(m.a,m.b,"line")});return out}
function elevNearEdge(w,r){var best=null,bd=r||snapR()*1.6;elevEdges().forEach(function(e){var q=projSeg(w.x,w.y,e.a,e.b);if(q.d<bd){bd=q.d;best={e:e,q:q,d:q.d}}});return best}
function elevSnap(w,from){var p={x:w.x,y:w.y},R=snapR(),best=null,bd=R;
 elevEdges().forEach(function(e){[{x:e.a.x,y:e.a.y},{x:e.b.x,y:e.b.y}].forEach(function(q){var d=Math.hypot(q.x-w.x,q.y-w.y);if(d<bd){bd=d;best=q}});
  var pr=projSeg(w.x,w.y,e.a,e.b);if(pr.tc>0.02&&pr.tc<0.98&&pr.d<bd){bd=pr.d;best={x:pr.x,y:pr.y}}});
 elevLevelList().forEach(function(L){if(Math.abs(L.z-w.y)*V.s<12){p.y=L.z;p.lv=1}});
 if(best){p.x=best.x;p.y=best.y;p.snap="edge"}
 if(!from||UI.ortho===0){if(!p.snap){p.x=Math.round(p.x*4)/4;p.y=Math.round(p.y*4)/4}return p}
 var dx=p.x-from.x,dy=p.y-from.y,L=Math.hypot(dx,dy);if(L<1e-6)return p;
 var st=UI.ortho===45?Math.PI/4:Math.PI/2,an=Math.round(Math.atan2(dy,dx)/st)*st,ux=Math.cos(an),uy=Math.sin(an),pr=dx*ux+dy*uy;
 if(Math.abs(dx*uy-dy*ux)>L*0.2)return p;p.x=from.x+ux*pr;p.y=from.y+uy*pr;p.ortho=1;return p}
function elevHit(w){var R=snapR()*1.5,e=elevDoc(),best=null,bd=R;
 e.lines.forEach(function(m){var q=projSeg(w.x,w.y,m.a,m.b);if(q.d<bd){bd=q.d;best={k:"eline",id:m.id,e:m}}});
 e.dims.forEach(function(m){var G=dimGeom(m),q=projSeg(w.x,w.y,G.A,G.B);if(q.d<bd){bd=q.d;best={k:"edim",id:m.id,e:m}}});
 e.spots.forEach(function(s){var d=Math.hypot(s.x-w.x,s.y-w.y);if(d<bd){bd=d;best={k:"espot",id:s.id,e:s}}});
 e.notes.forEach(function(n){var b=typeof noteBox==="function"?noteBox(n):[n.x,n.y-0.6,n.x+3,n.y];
  if(w.x>=b[0]-0.3&&w.x<=b[2]+0.3&&w.y>=b[1]-0.3&&w.y<=b[3]+0.3){best={k:"enote",id:n.id,e:n};bd=0}});
 return best}

function elevDrawGrid(){if(!UI.grid)return;var a=s2w(0,0),b=s2w(CW,CH),x0=Math.min(a.x,b.x),x1=Math.max(a.x,b.x),y0=Math.min(a.y,b.y),y1=Math.max(a.y,b.y);
 function lines(step,col){if(step*V.s<5)return;g.beginPath();
  for(var x=Math.floor(x0/step)*step;x<=x1;x+=step){var X=Math.round(x*V.s+V.ox)+0.5;g.moveTo(X,0);g.lineTo(X,CH)}
  for(var y=Math.floor(y0/step)*step;y<=y1;y+=step){var Y=Math.round(V.oy-y*V.s)+0.5;g.moveTo(0,Y);g.lineTo(CW,Y)}
  g.strokeStyle=col;g.lineWidth=1;g.stroke()}
 lines(1,UI.grid===2?"#e8e0d4":"#f3eee6");lines(5,UI.grid===2?"#c4b8a8":"#e4dccf")}
function elevPaintOrder(a,b){var da=+(a.dep||0),db=+(b.dep||0),ba=Math.round(da),bb=Math.round(db);if(ba!==bb)return ba-bb;return db-da}
function paintElev(){if(!g)return;g.setTransform(DPR,0,0,DPR,0,0);g.fillStyle="#f4f0e8";g.fillRect(0,0,CW,CH);
 elevDrawGrid();
 var Vv=elevView(elevFace()),its=(Vv.items||[]).slice().sort(elevPaintOrder);
 its.forEach(function(it){if(it.p&&it.p.length){g.beginPath();it.p.forEach(function(p,i){var q=w2s(p[0],p[1]);i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y)});g.closePath();
   if(it.fill){g.fillStyle=it.fill;g.globalAlpha=0.95;g.fill();g.globalAlpha=1}g.strokeStyle=it.c||"#2b2b2b";g.lineWidth=UI.thin?1:Math.max(1.2,(it.w||0.25)*3);g.stroke()}
  (it.lines||[]).forEach(function(l){var a=w2s(l[0],l[1]),b=w2s(l[2],l[3]);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.strokeStyle=it.c||"#444";g.lineWidth=1.4;g.stroke()})});
 elevDrawGround();elevDrawLevels();elevDrawDraft();elevDrawPreview();
 if(typeof scaleBar==="function")scaleBar();
 var fi2=elevFaceInfo(),n=elevDoc().lines.length,has=S.L&&S.L.some(function(L){return L.segs&&L.segs.length});
 $("info").innerHTML="<b>"+esc(fi2.n)+" elevation</b> ("+esc(fi2.sub)+") · sill "+fi(elevDoc().sill)+" · lintel "+fi(elevDoc().lintel)+(has?"":" · draw walls on Architecture first")+(n?" · "+n+" drafted line"+(n>1?"s":""):"")}
function elevDrawGround(){var b=elevBox(),z=-(typeof PLH==="number"?PLH:1.5),a=w2s(b[0]-4,z),c=w2s(b[2]+6,z);
 g.beginPath();g.moveTo(a.x,a.y);g.lineTo(c.x,c.y);g.strokeStyle="#111";g.lineWidth=2.2;g.stroke();
 for(var h=b[0]-3;h<b[2]+5;h+=0.7){var p=w2s(h,z),q=w2s(h-0.45,z-0.45);g.beginPath();g.moveTo(p.x,p.y);g.lineTo(q.x,q.y);g.strokeStyle="#777";g.lineWidth=1;g.stroke()}}
function elevDrawLevels(){var wb=viewBox(elevView(elevFace())),col="#1d3f7a",x0=wb[0]-1.8,x1=wb[2]+1.6;
 elevLevelList().forEach(function(L){var a=w2s(x0,L.z),c=w2s(x1,L.z);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(c.x,c.y);g.strokeStyle=col;g.lineWidth=1.15;g.setLineDash([7,4,2,4]);g.stroke();g.setLineDash([]);
  g.beginPath();g.moveTo(c.x,c.y);g.lineTo(c.x+7,c.y-8);g.lineTo(c.x+7,c.y+8);g.closePath();g.fillStyle=col;g.fill();
  g.font="bold 12px Roboto,Arial";g.fillStyle=col;g.textAlign="left";g.textBaseline="bottom";g.fillText(L.t,c.x+10,c.y-1);
  g.font="600 11px Roboto,Arial";g.textBaseline="top";g.fillText(lvl(L.z),c.x+10,c.y+2)})}
function elevDrawDraft(){var e=elevDoc(),sel=UI.eSel;
 e.lines.forEach(function(m){var on=sel&&sel.k==="eline"&&sel.id===m.id;cline(m.a,m.b,on?"#e8590c":"#1f2937",on?2.6:1.6,m.st==="dash"?[8,5]:null)});
 e.dims.forEach(function(m){drawDimC(m,sel&&sel.k==="edim"&&sel.id===m.id?"#e8590c":"#1d4ed8")});
 e.notes.forEach(function(n){var h=noteH(n),fs=Math.max(12,h*V.s),q=w2s(n.x,n.y);g.textAlign="left";g.textBaseline="alphabetic";g.font="600 "+fs+"px Roboto,Arial";g.fillStyle="#111827";
  String(n.t||"").split("\n").forEach(function(l,i){g.fillText(l,q.x,q.y+i*fs*1.25)})});
 e.spots.forEach(function(s){var q=w2s(s.x,s.y),on=sel&&sel.k==="espot"&&sel.id===s.id;g.beginPath();g.moveTo(q.x,q.y);g.lineTo(q.x-8,q.y+12);g.lineTo(q.x+8,q.y+12);g.closePath();g.fillStyle=on?"#e8590c":"#0f766e";g.fill();
  g.beginPath();g.moveTo(q.x+8,q.y+12);g.lineTo(q.x+78,q.y+12);g.strokeStyle=g.fillStyle;g.lineWidth=1.2;g.stroke();
  g.font="bold 13px Roboto,Arial";g.textAlign="left";g.textBaseline="alphabetic";g.fillText((s.lab||"EL")+" "+lvl(s.z!=null?s.z:s.y),q.x+12,q.y+8)})}
function elevDrawPreview(){if(UI.lp){var L=Math.hypot(UI.lp.b.x-UI.lp.a.x,UI.lp.b.y-UI.lp.a.y);cline(UI.lp.a,UI.lp.b,"#e8590c",3,UI.tool==="eoff"?[8,5]:null);lenLabel(UI.lp.a,UI.lp.b,fi(L),true)}
 if(UI.lpA){var q=w2s(UI.lpA.x,UI.lpA.y);g.beginPath();g.arc(q.x,q.y,9,0,7);g.strokeStyle="#e8590c";g.lineWidth=2.5;g.stroke()}
 if(UI.dimPend)drawDimC({a:UI.dimPend.a,b:UI.dimPend.b,off:UI.dimPend.off||0},"#e8590c");
 if(UI.eOffPend&&UI.eOffPend.prev)cline(UI.eOffPend.prev.a,UI.eOffPend.prev.b,"#e8590c",2.4,[8,5])}

function elevUpdCtx(){var c=$("ctx");if(!c)return;var T=UI.tool,e=elevDoc(),fi2=elevFaceInfo();
 var h='<span class="ctl">'+svgI("elev")+esc(fi2.n)+' · '+esc(fi2.sub)+'</span>';
 h+=CDV+cb("ef:S","Front","South face",e.face==="S")+cb("ef:N","Rear","North face",e.face==="N")+cb("ef:W","Left","West face",e.face==="W")+cb("ef:E","Right","East face",e.face==="E");
 h+=CDV+cbI("esill","level","Sill "+fi(e.sill)+" · Lintel "+fi(e.lintel),"Typical sill / lintel (openings use these if unset)",true);
 if(T==="eline")h+=CDV+cb("dls","Solid","",(UI.dlSt||"solid")==="solid")+cb("dld","Dashed","",UI.dlSt==="dash")+cbI("ortho","angle",UI.ortho===90?"90°":UI.ortho===45?"45°":"Free","Angle snap",true);
 if(T==="eoff")h+=CDV+cbI("ofd","offset","Distance "+fi(UI.offD||3),"typed ft-in",true);
 if(T==="edim")h+=CDV+cbI("ortho","angle",UI.ortho===90?"90°":UI.ortho===45?"45°":"Free","Angle snap",true);
 h+=CDV+cbI("elevpdf","pdf","PDF","this elevation")+cbI("elevpng","img","PNG","this elevation")+cbI("efit","plan","Fit","fit elevation");
 c.innerHTML=h;c.querySelectorAll("[data-c]").forEach(function(b){b.onclick=function(){ctxAction(b.dataset.c)}});
 var hn=$("hint");if(hn)hn.textContent=HINTS[T]||"Elevation: walls projected from the plan. Draft on top. Undo is in the top bar."}
function elevCtx(k){if(k.indexOf("ef:")===0){elevSetFace(k.slice(3));return true}
 if(k==="esill"){elevSillPopup();return true}if(k==="elevpdf"){elevExport("pdf");return true}if(k==="elevpng"){elevExport("png");return true}
 if(k==="efit"){elevFit();return true}if(k==="ofd"){offsetDistPopup();return true}
 if(k==="dls"){UI.dlSt="solid";return true}if(k==="dld"){UI.dlSt="dash";return true}
 if(k==="ortho"){UI.ortho=UI.ortho===90?45:(UI.ortho===45?0:90);toast(UI.ortho?"Snap "+UI.ortho+"°":"Free angle");return true}
 return false}
function elevSillPopup(){var e=elevEnsure();
 modal('<div class="mt">Sill / lintel levels</div><div class="ms">Typical heights from each floor FFL. Dashed lines on the elevation. New windows without a custom sill use these (sill '+fi(e.sill)+', lintel '+fi(e.lintel)+'). Doors stay at FFL.</div>'+
  '<div class="row"><label class="fld">Sill height<input id="eSill" value="'+escH(fi(e.sill))+'"></label><label class="fld">Lintel height<input id="eLin" value="'+escH(fi(e.lintel))+'"></label></div>'+
  '<div class="row"><button class="bb" id="eSX">Cancel</button><button class="bb ok" id="eSOK">OK</button></div>',function(){
  $("eSX").onclick=closeModal;$("eSOK").onclick=function(){var s=parseFI($("eSill").value),l=parseFI($("eLin").value);
   if(!(s>=0&&s<12)){toast("Sill e.g. 3\'-0\"");return}if(!(l>s&&l<=16)){toast("Lintel must be above sill, e.g. 7\'-0\"");return}
   snapshot();e.sill=s;e.lintel=l;elevApplyOpDefaults();closeModal();changed();updCtx();toast("Sill "+fi(s)+" · lintel "+fi(l))}})}

function elevOffsetTap(w){var n=elevNearEdge(w,Math.max(snapR()*2,(UI.offD||3)+1));if(!n){toast("Tap a wall edge or a drafted line, on the side to offset");return}
 var A=n.e.a,B=n.e.b,L=n.e.L||Math.hypot(B.x-A.x,B.y-A.y),u={x:(B.x-A.x)/L,y:(B.y-A.y)/L},nn={x:-u.y,y:u.x};
 var sd=((w.x-A.x)*nn.x+(w.y-A.y)*nn.y)>=0?1:-1,D=(UI.offD||3)*sd;
 snapshot();var a={x:A.x+nn.x*D,y:A.y+nn.y*D},b={x:B.x+nn.x*D,y:B.y+nn.y*D};
 elevEnsure().lines.push({id:nid(),a:a,b:b,st:"dash"});changed();toast("Offset "+fi(Math.abs(D))+" (dashed)")}
function elevDelete(h){if(!h){toast("Tap a drafted line, dimension, height or text");return}snapshot();var e=elevEnsure();
 if(h.k==="eline")e.lines=e.lines.filter(function(x){return x.id!==h.id});
 else if(h.k==="edim")e.dims=e.dims.filter(function(x){return x.id!==h.id});
 else if(h.k==="espot")e.spots=e.spots.filter(function(x){return x.id!==h.id});
 else if(h.k==="enote")e.notes=e.notes.filter(function(x){return x.id!==h.id});
 UI.eSel=null;changed();toast("Deleted")}
function elevCommitLine(t,a,b){var L=Math.hypot(b.x-a.x,b.y-a.y);if(L<0.15){toast("Too short");return}
 if(t==="edim"){UI.dimPend={a:{x:a.x,y:a.y},b:{x:b.x,y:b.y},off:1.5,_elev:1};toast("Now tap where the dimension line should sit");render();return}
 snapshot();elevEnsure().lines.push({id:nid(),a:{x:a.x,y:a.y},b:{x:b.x,y:b.y},st:UI.dlSt||"solid"});changed()}

function elevExport(kind){if(!S.L.some(function(L){return L.segs&&L.segs.length})){toast("Draw walls on Architecture first");return}
 var d=new Dwg();frameA(d);var Vv=elevAugment(elevView(elevFace())),N=placeView(d,Vv,16,16,TBX-20,281-16-8,null,1);
 var fi2=elevFaceInfo(),e=elevDoc();
 infoBox(d,TBX-95,20,88,"ELEVATION NOTES",[["Projected from the plan · "+fi2.n+" ("+fi2.sub+")"],["Sill "+fi(e.sill)+" · lintel "+fi(e.lintel)],["Doors / windows from the plan"],["Offset / Line are drafted on this view"]],18);
 tblock(d,{title:fi2.n+" Elevation ("+fi2.sub+")",dno:(S.meta.dno||"A101")+"-E",sheet:"1 / 1",scale:scaleTxt(N),RI:typeof plinthAll==="function"?plinthAll():{plinth:0,carpet:0}});
 if(kind==="png"){var c=document.createElement("canvas"),s=2480/420;c.width=2480;c.height=Math.round(297*s);var x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,c.width,c.height);drawDwg(x,d,s,0,0);
  c.toBlob(function(b){saveFile(fname("png").replace(/\.png$/,"_"+fi2.n+"_Elevation.png"),b,"image/png")},"image/png");toast("PNG: "+fi2.n+" elevation")}
 else{saveFile(fname("pdf").replace(/\.pdf$/,"_"+fi2.n+"_Elevation.pdf"),new Blob([bin(toPDF([d],S.meta.paper||"A3"))],{type:"application/pdf"}),"application/pdf");toast("PDF: "+fi2.n+" elevation")}}
function elevAugment(Vv){var e=elevDoc(),b=viewBox(Vv);
 e.lines.forEach(function(m){Vv.items.push({p:null,lines:[[m.a.x,m.a.y,m.b.x,m.b.y]],c:"#1f2937",w:m.st==="dash"?0.18:0.28,dep:-2,L:"DETAIL"})});
 e.dims.forEach(function(m){var G=dimGeom(m);Vv.items.push({p:null,lines:[[G.A.x,G.A.y,G.B.x,G.B.y],[m.a.x,m.a.y,G.A.x,G.A.y],[m.b.x,m.b.y,G.B.x,G.B.y]],c:"#1a1a1a",w:0.18,dep:-2.1,L:"DIMS"})});
 e.spots.forEach(function(s){Vv.items.push({p:null,lines:[[s.x,s.y,s.x+2.4,s.y]],c:"#0f766e",w:0.2,dep:-2.2,L:"ANNO"})});
 elevLevelList().forEach(function(L){if(!Vv.lv.some(function(q){return Math.abs(q.z-L.z)<0.05}))Vv.lv.push({z:L.z,t:L.t})});
 return Vv}

/* ----- wrap existing UI / pointer / paint (additive; Qty Takeoff tab untouched) ----- */
var _w2sE=w2s,_s2wE=s2w;
w2s=function(x,y){if(UI.elev&&!UI.clean)return {x:x*V.s+V.ox,y:V.oy-y*V.s};return _w2sE(x,y)};
s2w=function(x,y){if(UI.elev&&!UI.clean)return {x:(x-V.ox)/V.s,y:(V.oy-y)/V.s};return _s2wE(x,y)};
var _paintE=paint;paint=function(){if(UI.elev&&!UI.clean){paintElev();return}_paintE.apply(this,arguments)};
var _fitE=fitAll;fitAll=function(){if(UI.elev&&!UI.clean){elevFit();return}_fitE.apply(this,arguments)};
var _btE=buildTabs;buildTabs=function(){_btE();var t=$("tabs");if(!t)return;
 t.querySelectorAll("[data-tab]").forEach(function(b){b.onclick=function(){UI.tab=b.dataset.tab;if(UI.tab==="elev")elevEnter();else elevLeave();buildRail();var L=TABS[UI.tab][1].filter(function(x){return x.indexOf("a:")<0});
  if(UI.tab!=="view"&&UI.tab!=="qty"&&L.indexOf(UI.tool)<0&&L.length)setTool(L[0]);else{markRail();updCtx()}}})};
var _ucE=updCtx;updCtx=function(){if(UI.elev&&!UI.clean){elevUpdCtx();return}_ucE.apply(this,arguments)};
var _ctxE=ctxAction;ctxAction=function(k){if(UI.elev&&elevCtx(k)){updCtx();render();return}_ctxE.apply(this,arguments)};
var _raE=railAction;railAction=function(a){
 if(a==="efront"){elevSetFace("S");return}if(a==="erear"){elevSetFace("N");return}if(a==="eleft"){elevSetFace("W");return}if(a==="eright"){elevSetFace("E");return}
 if(a==="esill"){elevSillPopup();return}if(a==="elevpdf"){elevExport("pdf");return}if(a==="elevpng"){elevExport("png");return}
 return _raE.apply(this,arguments)};
var _stE=setTool;setTool=function(t){_stE(t);if(UI.tab==="elev")elevEnter();else if(UI.elev&&UI.tab!=="elev")elevLeave()};
var _clE=commitLine;commitLine=function(t,a,b){if(UI.elev&&(t==="eline"||t==="edim")){elevCommitLine(t,a,b);return}_clE(t,a,b)};
var _ttE=toolTap;toolTap=function(w){
 if(UI.elev){var t=UI.tool;
  if(UI.dimPend&&UI.dimPend._elev&&t==="edim"){var D=UI.dimPend,G=dimGeom({a:D.a,b:D.b,off:0}),off=(w.x-D.a.x)*G.n.x+(w.y-D.a.y)*G.n.y;UI.dimPend=null;snapshot();elevEnsure().dims.push({id:nid(),a:D.a,b:D.b,off:Math.round(off*4)/4});changed();toast("Dimension "+fi(G.L));return true}
  if(t==="eoff"){elevOffsetTap(w);return true}
  if(t==="edel"){elevDelete(elevHit(w));return true}
  if(t==="etext"){var n=null;elevDoc().notes.forEach(function(q){var b=noteBox(q);if(w.x>=b[0]-0.3&&w.x<=b[2]+0.3&&w.y>=b[1]-0.3&&w.y<=b[3]+0.3)n=q});elevNotePopup(n,w);return true}
  if(t==="espot"){var s=elevDoc().spots.find(function(q){return Math.hypot(q.x-w.x,q.y-w.y)<snapR()*1.4});elevSpotPopup(s,w);return true}
  if(t==="eline"||t==="edim")return false;
  return true}
 return _ttE(w)};
var _tdE=toolDown;toolDown=function(w,G){
 if(UI.elev){var t=UI.tool;if((t==="eline"||t==="edim")&&!UI.dimPend){G.kind="line2";G.a=elevSnap(w);return true}return false}
 return _tdE(w,G)};
var _tmE=toolMove;toolMove=function(w,G,p){
 if(UI.elev&&G.kind==="line2"){if(G.moved){UI.lp={a:G.a,b:elevSnap(w,G.a)};showHud(fi(Math.hypot(UI.lp.b.x-G.a.x,UI.lp.b.y-G.a.y)));render()}return true}
 return _tmE(w,G,p)};
var _tuE=toolUp;toolUp=function(G,w){
 if(UI.elev&&G.kind==="line2"){hideHud();var lp=UI.lp;UI.lp=null;if(G.moved&&lp){UI.lpA=null;commitLine(UI.tool,lp.a,lp.b)}else{if(UI.lpA){var b2=elevSnap(w,UI.lpA),a=UI.lpA;UI.lpA=null;commitLine(UI.tool,a,b2)}else{UI.lpA=elevSnap(w);toast("Start point set - tap the end point (or drag)")}}render();return true}
 return _tuE(G,w)};
var _obE=onBack;onBack=function(){if(UI.elev&&UI.tab==="elev"){UI.tab="arch";elevLeave();if(typeof buildRail==="function")buildRail();setTool("draw");return 1}return _obE.apply(this,arguments)};

function elevNotePopup(n,w){modal('<div class="mt">'+(n?"Edit":"Add")+' elevation text</div><label class="fld">Text<textarea id="ntT" rows="3" style="display:block;width:100%;font-size:18px;padding:8px;border:1.5px solid #b8c6d8;border-radius:10px">'+esc(n?n.t:"")+'</textarea></label>'+
 '<div class="row">'+(n?'<button class="bb del" id="ntD">Delete</button>':'')+'<button class="bb" id="ntX">Cancel</button><button class="bb ok" id="ntOk">OK</button></div>',function(){
  $("ntX").onclick=closeModal;if(n)$("ntD").onclick=function(){snapshot();elevEnsure().notes=elevEnsure().notes.filter(function(q){return q!==n});closeModal();changed()};
  $("ntOk").onclick=function(){var t=$("ntT").value.replace(/\s+$/,"");if(!t){toast("Type the text");return}snapshot();if(n)n.t=t;else elevEnsure().notes.push({id:nid(),x:w.x,y:w.y,t:t,h:0.6});closeModal();changed()}})}
function elevSpotPopup(s,w){var z=s? (s.z!=null?s.z:s.y):w.y;
 modal('<div class="mt">Height marker</div><div class="ms">Level from ground floor FFL +0\'-0\". Tap OK to place at '+lvl(z)+'.</div><div class="grid2">'+["EL","FFL","SILL","LINTEL","GL","RL"].map(function(l){return '<button class="bb'+((s?s.lab||"EL":"EL")===l?' on':'')+'" data-sl="'+l+'">'+l+'</button>'}).join("")+'</div><label class="fld">Level<input id="spZ" value="'+(z<0?"-":"")+fi(Math.abs(z))+'"></label>'+
  '<div class="row">'+(s?'<button class="bb del" id="spD">Delete</button>':'')+'<button class="bb" id="spX">Cancel</button><button class="bb ok" id="spOk">OK</button></div>',function(box){var lab=s?s.lab||"EL":"EL";
  box.querySelectorAll("[data-sl]").forEach(function(b){b.onclick=function(){lab=b.dataset.sl;box.querySelectorAll("[data-sl]").forEach(function(x){x.classList.toggle("on",x===b)})}});
  $("spX").onclick=closeModal;if(s)$("spD").onclick=function(){snapshot();elevEnsure().spots=elevEnsure().spots.filter(function(q){return q!==s});closeModal();changed()};
  $("spOk").onclick=function(){var v=parseFI($("spZ").value);if(!isFinite(v)){toast("Enter a level like 7\'-0\"");return}snapshot();if(s){s.z=v;s.y=v;s.lab=lab}else elevEnsure().spots.push({id:nid(),x:w.x,y:v,z:v,lab:lab});closeModal();changed()}})}

var _opSillE=opSill,_opHE=opH;
opSill=function(o){if(o&&o.sill!=null)return o.sill;if(o&&o.type==="W"&&S&&S.elev&&S.elev.sill!=null)return +S.elev.sill;return _opSillE(o)};
opH=function(o){if(o&&o.h!=null)return o.h;if(o&&o.type==="W"&&S&&S.elev&&S.elev.sill!=null&&S.elev.lintel!=null)return Math.max(0.5,+S.elev.lintel-+opSill(o));return _opHE(o)};

var _docE=docify;
docify=function(D){D=_docE(D);if(D&&D.elev&&typeof D.elev==="object"){if(!Array.isArray(D.elev.lines))D.elev.lines=[];if(!Array.isArray(D.elev.dims))D.elev.dims=[];if(!Array.isArray(D.elev.notes))D.elev.notes=[];if(!Array.isArray(D.elev.spots))D.elev.spots=[];if(!Array.isArray(D.elev.els))D.elev.els=[]}return D};
