/* ================= Furniture size editing + Kitchen counter + Modular kitchen =================
 Stage: Furniture size editing - tap any item: W x D x H label (tap to edit), Props fields, context menu "Edit size", drag handles on corners / edges (1" snap, rotation kept), ready sizes.
 Stage: Kitchen - Counter tool (drag along walls: straight / L / U, snaps to the inner wall face) with sink / hob cut-outs; modular units are Component items (cat "Modular"); Kitchen List = schedule (CSV + sheet 2). */
function fzParse(v){v=String(v||"").trim();if(/mm\s*$/i.test(v))return parseFloat(v)*MM;if(/cm\s*$/i.test(v))return parseFloat(v)*10*MM;if(/m\s*$/i.test(v)&&!/mm/i.test(v))return parseFloat(v)*1000*MM;return parseFI(v)}
function mmT(ft){return Math.round(ft/MM)}
function fzText(f){var D=fdims(f);return isKM(f.type)?mmT(D.w)+" × "+mmT(D.d)+" × "+mmT(D.h)+" mm":fi(D.w)+" × "+fi(D.d)+" · H "+fi(D.h)}
function selFurn(){if(UI.tool==="sel"){var L=selEls();if(L.length===1&&L[0].k==="furn")return elGet(L[0]);return null}if(UI.tool==="furn"&&typeof furnSel==="function")return furnSel()||null;return null}
function r12(v){return Math.round(v*12)/12}
/* ---------- size popup (same ft-in keypad as walls) ---------- */
function furnSizePopup(f){var C=FURN[f.type]||{};
 function body(){var D=fdims(f),pre=FPRE[f.type]||[];return '<div class="mt">'+esc(C.n||"Item")+' - size</div><div class="ms">'+esc(fzText(f))+(isKM(f.type)?'<br>'+fi(D.w)+' × '+fi(D.d)+' × '+fi(D.h)+(D.z?' · bottom at '+fi(D.z):''):'')+'</div>'+
  (pre.length?'<div class="grid2">'+pre.map(function(p,i){return '<button class="bb" data-fpre="'+i+'">'+esc(p[0])+(isKM(f.type)?' mm':'')+'</button>'}).join("")+'</div>':'')+
  '<div class="row"><button class="bb" id="fzW">Width '+fi(D.w)+' ✎</button><button class="bb" id="fzD">Depth '+fi(D.d)+' ✎</button></div>'+
  '<div class="row"><button class="bb" id="fzH">Height '+fi(D.h)+' ✎</button>'+(isKM(f.type)?'<button class="bb" id="fzZ">Bottom at '+fi(D.z||0)+' ✎</button>':'')+(f.type==="counterL"?'<button class="bb" id="fzC">Counter depth '+fi(f.cd||2)+' ✎</button>':'')+'</div>'+
  (f.type==="wardrobe"||isKM(f.type)?'<div class="row"><button class="bb" id="fzDm">Doors −</button><div class="bb" style="display:flex;align-items:center;justify-content:center">Doors '+(f.doors||"auto")+'</div><button class="bb" id="fzDp">Doors +</button></div>':'')+
  '<div class="row"><button class="bb" id="fzR">Rotate 90°</button><button class="bb" id="fzRs">Catalogue size</button></div><div class="row"><button class="bb ok" id="fzOk">Done</button></div>'}
 function ch(fn){snapshot();fn();changed();updProps();re()}
 function ask(t,k,cur,min){fiPopup(t,"Type feet-inch (e.g. 5'6\") or mm (e.g. 600mm)",cur,function(v){if(!(v>=min&&v<60)){toast("Value out of range");furnSizePopup(f);return}snapshot();f[k]=Math.round(v*1200)/1200;changed();updProps();furnSizePopup(f)})}
 function bind(box){var D=fdims(f);box.querySelectorAll("[data-fpre]").forEach(function(b){b.onclick=function(){var p=FPRE[f.type][+b.dataset.fpre];ch(function(){f.w=p[1];f.d=p[2];if(p[3])Object.assign(f,p[3])})}});
  $("fzW").onclick=function(){ask("Width","w",D.w,0.25)};$("fzD").onclick=function(){ask("Depth","d",D.d,0.25)};$("fzH").onclick=function(){ask("Height","h",D.h,0.1)};
  if($("fzZ"))$("fzZ").onclick=function(){ask("Bottom elevation (from floor)","z",D.z||0,0)};if($("fzC"))$("fzC").onclick=function(){ask("Counter depth","cd",f.cd||2,1)};
  if($("fzDm"))$("fzDm").onclick=function(){ch(function(){var n=(f.doors||2)-1;if(n<1)delete f.doors;else f.doors=n})};if($("fzDp"))$("fzDp").onclick=function(){ch(function(){f.doors=Math.min(8,(f.doors||1)+1)})};
  $("fzR").onclick=function(){ch(function(){f.rot=((f.rot||0)+90)%360})};$("fzRs").onclick=function(){ch(function(){delete f.w;delete f.d;delete f.h;delete f.cd;delete f.doors;delete f.z})};$("fzOk").onclick=closeModal}
 function re(){$("mbox").innerHTML=body();bind($("mbox"))}modal(body(),bind)}
/* ---------- properties ---------- */
function furnProps(e){var D=fdims(e),pre=FPRE[e.type]||[],km=isKM(e.type);
 return pf("Family","",esc((FURN[e.type]||{}).n||e.type),{ro:1})+(pre.length?pf("Ready size","fz.pre","",{opts:[["","- choose -"]].concat(pre.map(function(p,i){return [String(i),p[0]+(km?" mm":"")]}))}):"")+
  pf("Width","fz.w",fi(D.w))+pf("Depth","fz.d",fi(D.d))+pf("Height","fz.h",fi(D.h))+(km?pf("Size (mm)","",fzText(e),{ro:1})+pf("Bottom at","fz.z",fi(D.z||0)):"")+
  (e.type==="counterL"?pf("Counter depth","fz.cd",fi(e.cd||2)):"")+(e.type==="wardrobe"||km?pf("Doors / shutters","fz.doors",e.doors||"",{num:1}):"")+pf("Rotation (°)","fz.rot",e.rot||0,{num:1})+
  '<button class="bb pri" id="prFsz" style="width:100%;margin-top:6px">Edit size…</button>'}
function furnPropSet(key,v,e){if(!e)return;var x=fzParse(v),num=parseFloat(v),ok=true;snapshot();
 switch(key){case "fz.w":if(x>=0.25&&x<60)e.w=x;else ok=false;break;case "fz.d":if(x>=0.25&&x<60)e.d=x;else ok=false;break;case "fz.h":if(x>=0.1&&x<30)e.h=x;else ok=false;break;
  case "fz.z":if(x>=0&&x<30)e.z=x;else ok=false;break;case "fz.cd":if(x>=1&&x<10)e.cd=x;else ok=false;break;case "fz.doors":if(!v)delete e.doors;else if(num>=1&&num<=8)e.doors=Math.round(num);else ok=false;break;
  case "fz.rot":e.rot=((num||0)%360+360)%360;break;case "fz.pre":var p=(FPRE[e.type]||[])[+v];if(v!==""&&p){e.w=p[1];e.d=p[2];if(p[3])Object.assign(e,p[3])}else ok=false;break}
 if(!ok){UNDO.pop();if(key!=="fz.pre")toast("Value out of range")}else changed();updProps()}
/* ================= Kitchen counter (object kind "kc", per level S.kcs) ================= */
var KC_DEF={d:2,h:2.75};
function kcGeo(c){var P=stClean(c.pts);if(P.length<2)return null;var s=c.side||1,d=clamp(+c.d||KC_DEF.d,1,8),h=clamp(+c.h||KC_DEF.h,1,6),legs=[],i;
 for(i=0;i<P.length-1;i++){var a=P[i],b=P[i+1],L=Math.hypot(b.x-a.x,b.y-a.y),u={x:(b.x-a.x)/L,y:(b.y-a.y)/L};legs.push({a:a,b:b,L:L,u:u,n:{x:-u.y*s,y:u.x*s}})}
 function inner(dep){var Q=[];for(var j=0;j<P.length;j++){if(j===0){Q.push({x:P[0].x+legs[0].n.x*dep,y:P[0].y+legs[0].n.y*dep});continue}if(j===P.length-1){var g=legs[j-1];Q.push({x:P[j].x+g.n.x*dep,y:P[j].y+g.n.y*dep});continue}
   var g0=legs[j-1],g1=legs[j],p0={x:P[j].x+g0.n.x*dep,y:P[j].y+g0.n.y*dep},p1={x:P[j].x+g1.n.x*dep,y:P[j].y+g1.n.y*dep},cr=g0.u.x*g1.u.y-g0.u.y*g1.u.x;
   if(Math.abs(cr)<1e-6){Q.push(p0);continue}var t=((p1.x-p0.x)*g1.u.y-(p1.y-p0.y)*g1.u.x)/cr;Q.push({x:p0.x+g0.u.x*t,y:p0.y+g0.u.y*t})}return Q}
 var Q=inner(d),poly=P.concat(Q.slice().reverse()),run=legs.reduce(function(a,g){return a+g.L},0);
 function rectAt(pos,W,off0,off1){var acc=0,k=0;for(;k<legs.length-1;k++){if(pos<=acc+legs[k].L)break;acc+=legs[k].L}var g=legs[k],s0=pos-acc,lo=W/2+(k>0?d:0),hi=g.L-W/2-(k<legs.length-1?d:0);if(hi<lo)s0=g.L/2;else s0=clamp(s0,lo,hi);
  function q(t,o){return {x:g.a.x+g.u.x*t+g.n.x*o,y:g.a.y+g.u.y*t+g.n.y*o}}return {pts:[q(s0-W/2,off0),q(s0+W/2,off0),q(s0+W/2,off1),q(s0-W/2,off1)],c:q(s0,(off0+off1)/2),u:g.u,n:g.n,pos:acc+s0}}
 function defPos(kind){var last=legs.length-1;if(kind==="sink"){var acc=0;for(var k=0;k<last;k++)acc+=legs[k].L;return last?acc+(legs[last].L+d)/2:run*0.68}return last?(legs[0].L-d)/2:run*0.25}
 var G={c:c,P:P,Q:Q,poly:poly,legs:legs,d:d,h:h,run:run,inner:inner};
 var sW=c.sinkW||(run>=6?2.6:1.6);if(c.sink!==false&&run>=sW+0.6)G.sink=rectAt(c.sinkAt!=null?c.sinkAt:defPos("sink"),sW,d*0.15,d*0.85);
 if(c.hob!==false&&run>=3.2)G.hob=rectAt(c.hobAt!=null?c.hobAt:defPos("hob"),2.3,d*0.18,d*0.82);return G}
function kcById(id){return (S.kcs||[]).find(function(c){return c.id===id})}
function kcPoly(c){var G=kcGeo(c);return G?G.poly:(c.pts||[])}
function kcHitD(c,w){var G=kcGeo(c);if(!G)return 1e9;if(inPoly(w.x,w.y,G.poly))return 0;var d=1e9;for(var i=0;i<G.poly.length;i++)d=Math.min(d,d2seg(w,G.poly[i],G.poly[(i+1)%G.poly.length]));return d}
function kcCovers(x,y){return (S.kcs||[]).some(function(c){var G=kcGeo(c);return G&&inPoly(x,y,G.poly)})}
function kcLegText(G){return G.legs.map(function(g){return fi(g.L)}).join(" + ")}
/* snap a sketched path to the wall inner faces (each leg to the nearest parallel wall face, ends to a perpendicular wall face) */
function kcSnapPts(raw){var P=stClean(raw);if(P.length<2)return null;var lines=[],side=0;
 for(var i=0;i<P.length-1;i++){var a=P[i],b=P[i+1],L=Math.hypot(b.x-a.x,b.y-a.y),u={x:(b.x-a.x)/L,y:(b.y-a.y)/L},m={x:(a.x+b.x)/2,y:(a.y+b.y)/2},best=null;
  S.segs.forEach(function(s){var A=pt(s.a),B=pt(s.b),SL=Math.hypot(B.x-A.x,B.y-A.y);if(SL<0.1)return;var su={x:(B.x-A.x)/SL,y:(B.y-A.y)/SL};if(Math.abs(u.x*su.y-u.y*su.x)>0.08)return;
   var nW={x:-su.y,y:su.x},dist=nW.x*(m.x-A.x)+nW.y*(m.y-A.y);if(Math.abs(dist)>3)return;var ta=(a.x-A.x)*su.x+(a.y-A.y)*su.y,tb=(b.x-A.x)*su.x+(b.y-A.y)*su.y;if(Math.max(ta,tb)<-0.5||Math.min(ta,tb)>SL+0.5)return;
   var t=S.meta.dbl?wallT(s)/2:0,sg=dist>=0?1:-1,gap=Math.abs(Math.abs(dist)-t);if(!best||gap<best.gap)best={gap:gap,p:{x:A.x+nW.x*sg*t,y:A.y+nW.y*sg*t},nIn:{x:nW.x*sg,y:nW.y*sg}}});
  if(best){lines.push({p:best.p,u:u});if(!side)side=((-u.y)*best.nIn.x+u.x*best.nIn.y)>=0?1:-1}else lines.push({p:a,u:u})}
 function proj(q,l){var t=(q.x-l.p.x)*l.u.x+(q.y-l.p.y)*l.u.y;return {x:l.p.x+l.u.x*t,y:l.p.y+l.u.y*t}}
 function isect(l0,l1){var cr=l0.u.x*l1.u.y-l0.u.y*l1.u.x;if(Math.abs(cr)<1e-6)return proj(l1.p,l0);var t=((l1.p.x-l0.p.x)*l1.u.y-(l1.p.y-l0.p.y)*l1.u.x)/cr;return {x:l0.p.x+l0.u.x*t,y:l0.p.y+l0.u.y*t}}
 var out=[proj(P[0],lines[0])];for(i=1;i<P.length-1;i++)out.push(isect(lines[i-1],lines[i]));out.push(proj(P[P.length-1],lines[lines.length-1]));
 function endSnap(E,dir){var best=null;S.segs.forEach(function(s){var A=pt(s.a),B=pt(s.b),SL=Math.hypot(B.x-A.x,B.y-A.y);if(SL<0.1)return;var su={x:(B.x-A.x)/SL,y:(B.y-A.y)/SL};if(Math.abs(dir.x*su.x+dir.y*su.y)>0.08)return;
   var nW={x:-su.y,y:su.x},den=nW.x*dir.x+nW.y*dir.y;if(Math.abs(den)<1e-6)return;var tt=(nW.x*(A.x-E.x)+nW.y*(A.y-E.y))/den,t=S.meta.dbl?wallT(s)/2:0,mv=tt-t;if(Math.abs(mv)>1.5)return;
   var X={x:E.x+dir.x*mv,y:E.y+dir.y*mv},tp=(X.x-A.x)*su.x+(X.y-A.y)*su.y;if(tp<-1||tp>SL+1)return;if(!best||Math.abs(mv)<Math.abs(best.mv))best={mv:mv,X:X}});return best?best.X:E}
 var u0=lines[0].u,ue=lines[lines.length-1].u;out[0]=endSnap(out[0],{x:-u0.x,y:-u0.y});out[out.length-1]=endSnap(out[out.length-1],ue);
 out=out.map(function(p){return {x:Math.round(p.x*1200)/1200,y:Math.round(p.y*1200)/1200}});return {pts:stClean(out),side:side||1}}
/* plan */
function kcDrawG(G,col,lw,fill){function poly(P,cl,f2,dash){g.beginPath();P.forEach(function(p,i){var q=w2s(p.x,p.y);i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y)});if(cl)g.closePath();if(f2){g.fillStyle=f2;g.fill()}g.setLineDash(dash||[]);g.strokeStyle=col;g.lineWidth=lw;g.stroke();g.setLineDash([])}
 poly(G.poly,true,fill);for(var i=1;i<G.P.length-1;i++)poly([G.P[i],G.Q[i]],false,null,[4,3]);
 if(G.sink){var s=G.sink,P=s.pts,m1={x:(P[0].x+P[1].x)/2,y:(P[0].y+P[1].y)/2},m2={x:(P[2].x+P[3].x)/2,y:(P[2].y+P[3].y)/2};poly(P,true,FFILL[4]);poly([m1,m2],false);var q=w2s(s.c.x,s.c.y);g.beginPath();g.arc(q.x,q.y,Math.max(2,0.08*V.s),0,7);g.stroke()}
 if(G.hob){var hP=G.hob.pts;poly(hP,true,"#e9ecef");var c=G.hob.c;[-0.55,0.55].forEach(function(k){var x={x:c.x+G.hob.u.x*k,y:c.y+G.hob.u.y*k},q2=w2s(x.x,x.y);g.beginPath();g.arc(q2.x,q2.y,0.36*V.s,0,7);g.stroke();g.beginPath();g.arc(q2.x,q2.y,0.14*V.s,0,7);g.stroke()})}}
function drawKcPlan(){if(!visOn("furn"))return;(S.kcs||[]).forEach(function(c){var G=kcGeo(c);if(G){g.save();kcDrawG(G,"#7a5432",1.3,FFILL[1]);g.restore()}})}
function kcSelDraw(c){var G=kcGeo(c);if(!G)return;g.save();g.beginPath();G.poly.forEach(function(p,i){var q=w2s(p.x,p.y);i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y)});g.closePath();g.fillStyle="rgba(14,165,233,.22)";g.fill();g.strokeStyle=c.pin?"#7c3aed":"#0ea5e9";g.lineWidth=2.4;g.stroke();g.restore()}
function kcSheet(d,RP){(S.kcs||[]).forEach(function(c){var G=kcGeo(c);if(!G)return;var o={w:0.18,c:"#6b4a2b",L:"FURNITURE"};d.poly(G.poly.map(RP),{w:0,fill:FFILL[1],nodxf:true});d.poly(G.poly.map(RP),Object.assign({closed:true},o));
  if(G.sink)d.poly(G.sink.pts.map(RP),Object.assign({closed:true},o));if(G.hob)d.poly(G.hob.pts.map(RP),Object.assign({closed:true},o))})}
/* 3D: carcass (set back) + granite top + sink / hob */
function kcExtrude(P,z0,z1,mat){var sh=new THREE.Shape();P.forEach(function(p,i){i?sh.lineTo(p.x,p.y):sh.moveTo(p.x,p.y)});var geo=new THREE.ExtrudeGeometry(sh,{depth:z1-z0,bevelEnabled:false});geo.rotateX(Math.PI/2);
 var m=new THREE.Mesh(geo,mat);m.position.y=z1;m.castShadow=true;m.receiveShadow=true;m.userData.layer="FURN3D";m.userData.real=mat;T3.model.add(m);m.updateMatrix();
 var e=new THREE.LineSegments(new THREE.EdgesGeometry(geo,28),T3.M.edgeReal);e.position.copy(m.position);e.userData.layer="FURN3D";T3.edges.add(e);return m}
function kc3DAll(){var F=T3.M.F;if(!F)return;(S.kcs||[]).forEach(function(c){var G=kcGeo(c);if(!G)return;var hasM=(S.furn||[]).some(function(f){return FURN[f.type]&&FURN[f.type].km==="base"&&inPoly(f.x,f.y,G.poly)});var body=G.P.concat(G.inner(Math.max(0.5,G.d-(hasM?0.4:0.12))).slice().reverse()),ts=0.13;
  kcExtrude(body,0.005,G.h-ts,F.lam);kcExtrude(G.poly,G.h-ts,G.h,F.granite);if(G.sink)kcExtrude(G.sink.pts,G.h,G.h+0.02,F.steelD);if(G.hob)kcExtrude(G.hob.pts,G.h,G.h+0.12,F.black)})}
/* selection label + furniture handles + previews */
var _kcDsel=drawSelCanvas;drawSelCanvas=function(){var r=_kcDsel.apply(this,arguments);if(UI.clean)return r;UI.fHand=[];
 if(UI.kcPv&&UI.kcPv.pts&&UI.kcPv.pts.length>1){var G0=kcGeo({pts:UI.kcPv.pts,side:UI.kcPv.side,d:UI.kcD||KC_DEF.d,h:UI.kcH||KC_DEF.h});if(G0){g.save();g.globalAlpha=0.75;kcDrawG(G0,"#2563eb",1.6,"rgba(37,99,235,.12)");g.restore()}}
 var cvE=$("cv"),cw=cvE?cvE.clientWidth:9999,chh=cvE?cvE.clientHeight:9999;function lab(x,y,t){g.font="600 12px Inter,Roboto,Arial,sans-serif";var lw=g.measureText(t).width+14;return tdLabel(clamp(x,lw/2+6,Math.max(lw/2+6,cw-lw/2-6)),clamp(y,16,Math.max(16,chh-16)),t,true)}
 UI.tdHits=UI.tdHits||[];
 var L=selEls();if(UI.tool==="sel"&&L.length===1&&!UI.box&&L[0].k==="kc"){var c=elGet(L[0]),G=kcGeo(c);if(G){var a=w2s(G.P[0].x,G.P[0].y),b=w2s(G.P[1].x,G.P[1].y),n=G.legs[0].n,off=18+G.d*V.s;var hb=lab((a.x+b.x)/2-n.x*24,(a.y+b.y)/2-n.y*24,"Counter "+kcLegText(G)+" · D "+fi(G.d)+" · H "+fi(G.h));hb.kc=c;UI.tdHits.push(hb)}}
 var f=selFurn();if(f&&!UI.box){var D=fdims(f),X=fXform(f);
  var fr=X(0,D.d/2),ce=X(0,0),q=w2s(fr.x,fr.y),q0=w2s(ce.x,ce.y),vx=q.x-q0.x,vy=q.y-q0.y,vl=Math.hypot(vx,vy)||1,hb2=lab(q.x+vx/vl*22,q.y+vy/vl*22,fzText(f));hb2.furn=f;UI.tdHits.push(hb2);
  if(!isPinned({k:"furn",id:f.id})){[-1,0,1].forEach(function(ix){[-1,0,1].forEach(function(iy){if(!ix&&!iy)return;var p=X(ix*D.w/2,iy*D.d/2),s=w2s(p.x,p.y);g.save();g.fillStyle="#fff";g.strokeStyle="#e8590c";g.lineWidth=2;var z=ix&&iy?9:8;g.fillRect(s.x-z/2,s.y-z/2,z,z);g.strokeRect(s.x-z/2,s.y-z/2,z,z);g.restore();UI.fHand.push({x:s.x,y:s.y,ix:ix,iy:iy})})})}}
 return r};
function fHandHit(w){var H=UI.fHand||[];if(!H.length)return null;var q=w2s(w.x,w.y),best=null;H.forEach(function(h){var d=Math.hypot(q.x-h.x,q.y-h.y);if(d<=18&&(!best||d<best.d))best={h:h,d:d}});return best?best.h:null}
var _kcDn=toolDown;toolDown=function(w,G){
 if((UI.tool==="sel"||UI.tool==="furn")&&!UI.pick){var f=selFurn();if(f){var h=fHandHit(w);if(h){var D=fdims(f);G.kind="fresize";G.f=f;G.h=h;G.o={w:D.w,d:D.d,x:f.x,y:f.y};return true}}
  if(UI.tool==="furn"){var t=tdHit(w);if(t&&t.furn){G.kind="tdim";G.td=t;return true}}}
 if(UI.tool==="kc"&&!UI.pick){G.kind="kcdraw";G.path=[w];return true}
 return _kcDn(w,G)};
var _kcMv=toolMove;toolMove=function(w,G,p){
 if(G.kind==="fresize"){if(!G.moved)return true;var f=G.f,o=G.o,h=G.h,a=(f.rot||0)*Math.PI/180,cs=Math.cos(a),sn=Math.sin(a),dx=w.x-o.x,dy=w.y-o.y,lx=dx*cs+dy*sn,ly=-dx*sn+dy*cs;if(!G.snap){snapshot();G.snap=true}
  var nw=o.w,nd=o.d,cx=0,cy=0;if(h.ix){nw=Math.max(0.25,r12(h.ix*lx+o.w/2));cx=h.ix*(nw-o.w)/2}if(h.iy){nd=Math.max(0.25,r12(h.iy*ly+o.d/2));cy=h.iy*(nd-o.d)/2}
  f.w=nw;f.d=nd;f.x=o.x+cx*cs-cy*sn;f.y=o.y+cx*sn+cy*cs;SHEET=null;showHud(isKM(f.type)?mmT(nw)+" × "+mmT(nd)+" mm":fi(nw)+" × "+fi(nd));render();return true}
 if(G.kind==="kcdraw"){var l=G.path[G.path.length-1];if(Math.hypot(w.x-l.x,w.y-l.y)*V.s>2)G.path.push(w);if(G.moved){UI.kcPv=kcSnapPts(stSnapPath(G.path));if(UI.kcPv){var Gx=kcGeo({pts:UI.kcPv.pts,side:UI.kcPv.side,d:UI.kcD||2});if(Gx)showHud("Counter "+kcLegText(Gx))}render()}return true}
 return _kcMv(w,G,p)};
var _kcUp=toolUp;toolUp=function(G,w){
 if(G.kind==="tdim"&&G.td&&G.td.furn){furnSizePopup(G.td.furn);return true}if(G.kind==="tdim"&&G.td&&G.td.kc){kcPopup(G.td.kc);return true}
 if(G.kind==="fresize"){if(G.snap){changed();updProps();toast("Size "+fzText(G.f))}else tapTool(w);return true}
 if(G.kind==="kcdraw"){var pv=G.moved?kcSnapPts(stSnapPath(G.path.concat([w]))):null;UI.kcPv=null;hideHud();if(pv&&pv.pts.length>=2){snapshot();var c={id:nid(),pts:pv.pts,side:pv.side,d:UI.kcD||KC_DEF.d,h:UI.kcH||KC_DEF.h};S.kcs=S.kcs||[];S.kcs.push(c);changed();var Gk=kcGeo(c);toast("Counter "+(Gk?kcLegText(Gk)+" x "+fi(Gk.d):""))}else if(!G.moved)tapTool(w);else render();return true}
 return _kcUp(G,w)};
var _kcTap=toolTap;toolTap=function(w){if(UI.tool==="kc"&&!UI.pick){var c=(S.kcs||[]).find(function(x){return kcHitD(x,w)===0});if(c)kcPopup(c);else toast("Drag along the wall to draw a counter top (bend for L / U)");return true}return _kcTap(w)};
/* counter popup + props */
function kcSetLeg(c,i,L){var P=c.pts;if(i<0||i>=P.length-1||!(L>0.5))return false;var a=P[i],b=P[i+1],L0=Math.hypot(b.x-a.x,b.y-a.y),ux=(b.x-a.x)/L0,uy=(b.y-a.y)/L0,dl=L-L0;for(var j=i+1;j<P.length;j++){P[j].x=Math.round((P[j].x+ux*dl)*1200)/1200;P[j].y=Math.round((P[j].y+uy*dl)*1200)/1200}return true}
function kcPopup(c){
 function body(){var G=kcGeo(c)||{legs:[]};return '<div class="mt">Kitchen counter</div><div class="ms">'+(G.legs.length>2?"U":G.legs.length===2?"L":"Straight")+' counter · run '+fi(G.run||0)+' · depth '+fi(G.d||0)+' · top at '+fi(G.h||0)+'</div>'+
  '<div class="grid2">'+G.legs.map(function(g2,i){return '<button class="bb" data-kleg="'+i+'">Leg '+(i+1)+' '+fi(g2.L)+' ✎</button>'}).join("")+'</div>'+
  '<div class="row"><button class="bb" id="kcD">Depth '+fi(G.d)+' ✎</button><button class="bb" id="kcH">Height '+fi(G.h)+' ✎</button><button class="bb" id="kcF">Flip side ⇅</button></div>'+
  '<div class="row"><button class="bb'+(c.sink!==false?' on':'')+'" id="kcS">Sink cut-out: '+(c.sink!==false?"ON":"OFF")+'</button><button class="bb" id="kcSp"'+(G.sink?'':' disabled')+'>Sink at '+(G.sink?fi(G.sink.pos):"-")+' ✎</button></div>'+
  '<div class="row"><button class="bb'+(c.hob!==false?' on':'')+'" id="kcB">Hob cut-out: '+(c.hob!==false?"ON":"OFF")+'</button><button class="bb" id="kcBp"'+(G.hob?'':' disabled')+'>Hob at '+(G.hob?fi(G.hob.pos):"-")+' ✎</button></div>'+
  '<div class="row"><button class="bb" id="kcM">Add modular units…</button></div><div class="row"><button class="bb del" id="kcX">Delete counter</button><button class="bb ok" id="kcOk">Done</button></div>'}
 function ch(fn){snapshot();fn();changed();updProps();re()}
 function ask(t,sub,cur,fn){fiPopup(t,sub,cur,function(v){if(!fn(v)){toast("Value out of range")}kcPopup(c)})}
 function bind(box){var G=kcGeo(c);box.querySelectorAll("[data-kleg]").forEach(function(b){b.onclick=function(){var i=+b.dataset.kleg;ask("Leg "+(i+1)+" length","Along the wall side (outer length). The later legs move with it.",G.legs[i].L,function(v){if(!(v>=1&&v<80))return false;snapshot();kcSetLeg(c,i,v);changed();updProps();return true})}});
  $("kcD").onclick=function(){ask("Counter depth","Front to back (default 2'-0\")",G.d,function(v){if(!(v>=1&&v<=8))return false;snapshot();c.d=v;changed();updProps();return true})};
  $("kcH").onclick=function(){ask("Counter height","Top of the counter from the floor (default 2'-9\")",G.h,function(v){if(!(v>=1.5&&v<=5))return false;snapshot();c.h=v;changed();updProps();return true})};
  $("kcF").onclick=function(){ch(function(){c.side=-(c.side||1)})};$("kcS").onclick=function(){ch(function(){c.sink=c.sink===false})};$("kcB").onclick=function(){ch(function(){c.hob=c.hob===false})};
  $("kcSp").onclick=function(){if(!G.sink)return;ask("Sink position","Centre of the sink from the start of the counter",G.sink.pos,function(v){if(!(v>=0&&v<=G.run))return false;snapshot();c.sinkAt=v;changed();return true})};
  $("kcBp").onclick=function(){if(!G.hob)return;ask("Hob position","Centre of the hob from the start of the counter",G.hob.pos,function(v){if(!(v>=0&&v<=G.run))return false;snapshot();c.hobAt=v;changed();return true})};
  $("kcM").onclick=function(){closeModal();kitModular()};$("kcX").onclick=function(){closeModal();UI.sel=[{k:"kc",id:c.id}];doDelete()};$("kcOk").onclick=closeModal}
 function re(){if(!kcById(c.id)){closeModal();return}$("mbox").innerHTML=body();bind($("mbox"))}modal(body(),bind)}
function kcProps(c){var G=kcGeo(c)||{legs:[]};return G.legs.map(function(g2,i){return pf("Leg "+(i+1)+" length","kc.leg"+i,fi(g2.L))}).join("")+pf("Depth","kc.d",fi(G.d))+pf("Height (top)","kc.h",fi(G.h))+
  pf("Side","kc.side",String(c.side||1),{opts:[["1","Side 1"],["-1","Side 2 (flip)"]]})+pf("Sink cut-out","kc.sink",c.sink===false?"0":"1",{opts:[["1","On"],["0","Off"]]})+(G.sink?pf("Sink at (from start)","kc.sinkAt",fi(G.sink.pos)):"")+
  pf("Hob cut-out","kc.hob",c.hob===false?"0":"1",{opts:[["1","On"],["0","Off"]]})+(G.hob?pf("Hob at (from start)","kc.hobAt",fi(G.hob.pos)):"")+pf("Total run","",fi(G.run||0),{ro:1})+'<button class="bb pri" id="prKc" style="width:100%;margin-top:6px">Edit counter…</button>'}
function kcPropSet(key,v,c){if(!c)return;var x=fzParse(v),ok=true;snapshot();var m=/^kc\.leg(\d+)$/.exec(key);
 if(m)ok=x>=1&&x<80&&kcSetLeg(c,+m[1],x);else switch(key){case "kc.d":if(x>=1&&x<=8)c.d=x;else ok=false;break;case "kc.h":if(x>=1.5&&x<=5)c.h=x;else ok=false;break;case "kc.side":c.side=+v||1;break;
  case "kc.sink":c.sink=v!=="0";break;case "kc.hob":c.hob=v!=="0";break;case "kc.sinkAt":if(x>=0)c.sinkAt=x;else ok=false;break;case "kc.hobAt":if(x>=0)c.hobAt=x;else ok=false;break}
 if(!ok){UNDO.pop();toast("Value out of range")}else changed();updProps()}
var _kcUpd=updProps;updProps=function(){_kcUpd.apply(this,arguments);var L=selEls();if(L.length!==1)return;var e=elGet(L[0]);if($("prFsz"))$("prFsz").onclick=function(){furnSizePopup(e)};if($("prKc"))$("prKc").onclick=function(){kcPopup(e)}};
/* ---------- modular units + schedule ---------- */
function kitModular(){setTool("furn");UI.fcat="Modular";var c=s2w(CW/2,CH/2);furnPopup(c.x,c.y)}
function kitSchedRows(){var M={},rows=[];S.L.forEach(function(Lv,i){withLevel(i,function(){(S.furn||[]).forEach(function(f){if(!isKM(f.type))return;var D=fdims(f),k=FURN[f.type].n+"|"+mmT(D.w)+" x "+mmT(D.d)+" x "+mmT(D.h);M[k]=(M[k]||0)+1});
  (S.kcs||[]).forEach(function(c){var G=kcGeo(c);if(!G)return;var k="Counter top ("+(G.legs.length>2?"U":G.legs.length===2?"L":"straight")+")|"+G.legs.map(function(g2){return mmT(g2.L)}).join("+")+" x "+mmT(G.d);M[k]=(M[k]||0)+1})})});
 Object.keys(M).sort().forEach(function(k){var p=k.split("|");rows.push([p[0],p[1],M[k]])});return rows}
function kitSchedPopup(){var R=kitSchedRows();modal('<div class="mt">Modular kitchen schedule</div><div class="ms">Units placed with Modular / Component and counters drawn with Counter (all levels). Size = width x depth x height in mm.</div>'+
  (R.length?'<table style="width:100%;border-collapse:collapse;font-size:13px"><tr style="text-align:left;border-bottom:1px solid #ccc"><th>Unit</th><th>Size (mm)</th><th>Nos</th></tr>'+R.map(function(r){return '<tr style="border-bottom:1px solid #eee"><td>'+esc(r[0])+'</td><td>'+esc(r[1])+'</td><td style="text-align:center">'+r[2]+'</td></tr>'}).join("")+'</table>':'<div class="pn">No modular units or counters yet. Use Counter and Modular in the Kitchen group.</div>')+
  '<div class="row"><button class="bb" id="ksCsv"'+(R.length?'':' disabled')+'>Download CSV</button><button class="bb pri" id="ksAdd">Add units…</button><button class="bb ok" id="ksOk">Close</button></div>',function(){
  $("ksOk").onclick=closeModal;$("ksAdd").onclick=function(){closeModal();kitModular()};$("ksCsv").onclick=function(){var csv="Unit,Size (mm),Nos\n"+R.map(function(r){return r.map(function(x){return '"'+String(x).replace(/"/g,'""')+'"'}).join(",")}).join("\n");
   var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download=((S.meta.proj||S.meta.name||"Kitchen")+" kitchen schedule.csv").replace(/[\\/:*?"<>|]/g,"-");document.body.appendChild(a);a.click();setTimeout(function(){a.remove()},500)}})}
var _kcRail=railAction;railAction=function(a){if(a==="kmod"){kitModular();return}if(a==="ksched"){kitSchedPopup();return}return _kcRail(a)};
Object.assign(HINTS,{kc:"Drag along the wall to draw the counter top (bend for L / U) · snaps to the inner wall face · tap a counter to edit"});
/* option bar chips: Counter tool (depth / height) and Component tool (Size) */
var _kcCtxA=ctxAction;ctxAction=function(k){if(k==="kcd"){fiPopup("Counter depth","Depth of the next counter",UI.kcD||KC_DEF.d,function(v){if(v>=1&&v<=8){UI.kcD=v;updCtx()}else toast("Depth 1'-0\" to 8'-0\"")});return}
 if(k==="kch"){fiPopup("Counter height","Top of the next counter from the floor",UI.kcH||KC_DEF.h,function(v){if(v>=1.5&&v<=5){UI.kcH=v;updCtx()}else toast("Height 1'-6\" to 5'-0\"")});return}
 if(k==="kmods"){kitModular();return}if(k==="ksch"){kitSchedPopup();return}if(k==="fsize"){var f=selFurn();if(f)furnSizePopup(f);else toast("Tap a furniture item first");return}return _kcCtxA(k)};
var _kcUctx=updCtx;updCtx=function(){_kcUctx.apply(this,arguments);var c=$("ctx");if(!c)return;var h="";if(UI.tool==="kc"&&!$("kcChips"))h=cb("kcd","Depth "+fi(UI.kcD||KC_DEF.d),"next counter")+cb("kch","Height "+fi(UI.kcH||KC_DEF.h),"top")+cb("kmods","Modular units","base / wall / tall")+cb("ksch","Kitchen list","schedule");
 else if(UI.tool==="furn"&&!$("fzChips"))h=cb("fsize","Size","edit W x D x H")+cb("ksch","Kitchen list","schedule");if(!h)return;var sp=document.createElement("span");sp.id=UI.tool==="kc"?"kcChips":"fzChips";sp.style.display="contents";sp.innerHTML=h;c.appendChild(sp);
 sp.querySelectorAll("[data-c]").forEach(function(b){b.onclick=function(ev){ev.stopPropagation();ctxAction(b.dataset.c)}})};
