/* ================= 2D DRAFTING: Circle, Arc, Rectangle (2D only: plan, PDF, DXF), Trim / Extend 2D, Fillet (walls + 2D lines) ================= */
/* circle / arc = {id, x, y, r, a0, a1, st}: centre, radius (ft); arc runs counter-clockwise (world angles, degrees) from a0 to a1; a0 null = full circle */
var D2R=Math.PI/180;
function dcSpan(m){return m.a0==null?360:(((m.a1-m.a0)%360)+360)%360||360}
function dcIn(m,a){if(m.a0==null)return true;return ((((a-m.a0)%360)+360)%360)<=dcSpan(m)+1e-7}
function dcAng(m,p){return Math.atan2(p.y-m.y,p.x-m.x)/D2R}
function dcPt(m,a){return {x:m.x+m.r*Math.cos(a*D2R),y:m.y+m.r*Math.sin(a*D2R)}}
function dcPts(m,n){var sp=dcSpan(m),a0=m.a0==null?0:m.a0,k=n||Math.max(12,Math.ceil(sp/6)),P=[];for(var i=0;i<=k;i++)P.push(dcPt(m,a0+sp*i/k));return P}
function dcDist(m,w){var a=dcAng(m,w);if(dcIn(m,a))return Math.abs(Math.hypot(w.x-m.x,w.y-m.y)-m.r);var p0=dcPt(m,m.a0),p1=dcPt(m,m.a1);return Math.min(Math.hypot(w.x-p0.x,w.y-p0.y),Math.hypot(w.x-p1.x,w.y-p1.y))}
function dcBoxPts(m){var P=m.a0==null?[{x:m.x-m.r,y:m.y-m.r},{x:m.x+m.r,y:m.y+m.r}]:dcPts(m,24),b=[Infinity,Infinity,-Infinity,-Infinity];P.forEach(function(p){b[0]=Math.min(b[0],p.x);b[1]=Math.min(b[1],p.y);b[2]=Math.max(b[2],p.x);b[3]=Math.max(b[3],p.y)});return [{x:b[0],y:b[1]},{x:b[2],y:b[1]},{x:b[2],y:b[3]},{x:b[0],y:b[3]}]}
function dcStroke(m,col,lw,dash){var P=dcPts(m);g.beginPath();P.forEach(function(p,i){var q=w2s(p.x,p.y);i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y)});if(m.a0==null)g.closePath();g.strokeStyle=col;g.lineWidth=lw;g.setLineDash(dash||[]);g.stroke();g.setLineDash([])}
function dcSelDraw(m){g.globalAlpha=0.45;dcStroke(m,"#0ea5e9",7);g.globalAlpha=1;var q=w2s(m.x,m.y);g.beginPath();g.moveTo(q.x-6,q.y);g.lineTo(q.x+6,q.y);g.moveTo(q.x,q.y-6);g.lineTo(q.x,q.y+6);g.strokeStyle="#0ea5e9";g.lineWidth=1.5;g.stroke()}
/* canvas */
var _d2Anno=drawAnnoCanvas;drawAnnoCanvas=function(){_d2Anno.apply(this,arguments);g.save();
 if(visOn("dlines"))(S.dcircs||[]).forEach(function(m){dcStroke(m,"#374151",1.4,m.st==="dash"?[7,5]:null)});
 var pv=UI.d2pv;if(pv){if(pv.c)dcStroke(pv.c,"#e8590c",1.5,[6,4]);if(pv.r){var a=w2s(pv.r[0].x,pv.r[0].y),b=w2s(pv.r[1].x,pv.r[1].y);g.strokeStyle="#e8590c";g.lineWidth=1.5;g.setLineDash([6,4]);g.strokeRect(Math.min(a.x,b.x),Math.min(a.y,b.y),Math.abs(b.x-a.x),Math.abs(b.y-a.y));g.setLineDash([])}}
 (UI.d2mk||[]).forEach(function(p){var q=w2s(p.x,p.y);g.beginPath();g.arc(q.x,q.y,6,0,7);g.fillStyle="#e8590c";g.fill()});
 g.restore()};
/* sheets (PDF / PNG) + DXF: polyline on the DETAIL layer */
var _d2PE=planExtras;planExtras=function(d,R,k){_d2PE.apply(this,arguments);if(!visOn("dlines"))return;(S.dcircs||[]).forEach(function(m){var P=dcPts(m,Math.max(24,Math.ceil(dcSpan(m)/4))).map(function(p){return R(p.x,p.y)});d.poly(P,{w:0.18,c:"#222222",closed:m.a0==null,dash:m.st==="dash"?[1.5,0.8]:undefined,L:"DETAIL"})})};
var _d2PX=planExt;planExt=function(ext){_d2PX.apply(this,arguments);(S.dcircs||[]).forEach(function(m){dcBoxPts(m).forEach(ext)})};
/* move / rotate / mirror keep arc ends on the arc */
var _d2XF=xfRefs;xfRefs=function(L,f,ang,mir){var A=[];L.forEach(function(r){if(r.k!=="dcirc")return;var e=elGet(r);if(e&&e.a0!=null)A.push({e:e,p0:f(dcPt(e,e.a0)),p1:f(dcPt(e,e.a1))})});
 var out=_d2XF.apply(this,arguments);A.forEach(function(q){var e=q.e,b0=dcAng(e,q.p0),b1=dcAng(e,q.p1);if(mir!=null){e.a0=b1;e.a1=b0}else{e.a0=b0;e.a1=b1}e.a0=Math.round(e.a0*1e6)/1e6;e.a1=Math.round(e.a1*1e6)/1e6});return out};
function dcAdd(o){snapshot();var m=Object.assign({id:nid(),st:UI.dlSt||"solid"},o);S.dcircs.push(m);changed();return m}
function dcRadiusPopup(m){fiPopup("Circle radius","Radius of this "+(m.a0==null?"circle":"arc"),m.r,function(v){if(v>0.02&&v<1000){snapshot();m.r=v;changed();updProps&&updProps()}else toast("Radius too small")})}
/* ---------- geometry: intersections with 2D lines, circles / arcs and wall faces ---------- */
function d2Bounds(skipK,skipId){var Ls=[],Cs=[];S.dlines.forEach(function(m){if(!(skipK==="dline"&&m.id===skipId))Ls.push([m.a,m.b])});(S.dcircs||[]).forEach(function(m){if(!(skipK==="dcirc"&&m.id===skipId))Cs.push(m)});
 S.segs.forEach(function(s){var P=S.meta.dbl?wallPoly(s):null;if(P){for(var i=0;i<P.length;i++)Ls.push([P[i],P[(i+1)%P.length]])}else Ls.push([pt(s.a),pt(s.b)])});return {L:Ls,C:Cs}}
function llX(A,B,C,D){var r={x:B.x-A.x,y:B.y-A.y},s={x:D.x-C.x,y:D.y-C.y},den=r.x*s.y-r.y*s.x;if(Math.abs(den)<1e-12)return null;var t=((C.x-A.x)*s.y-(C.y-A.y)*s.x)/den,u=((C.x-A.x)*r.y-(C.y-A.y)*r.x)/den;return {t:t,u:u}}
function lcX(A,B,m){var dx=B.x-A.x,dy=B.y-A.y,fx=A.x-m.x,fy=A.y-m.y,a=dx*dx+dy*dy,b=2*(fx*dx+fy*dy),c=fx*fx+fy*fy-m.r*m.r,D=b*b-4*a*c;if(D<0||a<1e-12)return [];var q=Math.sqrt(D),o=[];[(-b-q)/(2*a),(-b+q)/(2*a)].forEach(function(t){var p={x:A.x+dx*t,y:A.y+dy*t};if(dcIn(m,dcAng(m,p)))o.push({t:t,p:p})});return o}
function ccX(m,n){var dx=n.x-m.x,dy=n.y-m.y,d=Math.hypot(dx,dy);if(d<1e-9||d>m.r+n.r||d<Math.abs(m.r-n.r))return [];var a=(m.r*m.r-n.r*n.r+d*d)/(2*d),h=Math.sqrt(Math.max(0,m.r*m.r-a*a)),px=m.x+dx*a/d,py=m.y+dy*a/d;
 return [{x:px+h*dy/d,y:py-h*dx/d},{x:px-h*dy/d,y:py+h*dx/d}].filter(function(p){return dcIn(n,dcAng(n,p))})}
/* cut parameters on a line (t in 0..1) or on a circle / arc (angles) */
function lineCuts(m){var B=d2Bounds("dline",m.id),T=[];B.L.forEach(function(q){var r=llX(m.a,m.b,q[0],q[1]);if(r&&r.t>1e-6&&r.t<1-1e-6&&r.u>=-1e-6&&r.u<=1+1e-6)T.push(r.t)});B.C.forEach(function(c){lcX(m.a,m.b,c).forEach(function(r){if(r.t>1e-6&&r.t<1-1e-6)T.push(r.t)})});return T.sort(function(a,b){return a-b})}
function circCuts(m){var B=d2Bounds("dcirc",m.id),A=[];B.L.forEach(function(q){lcX(q[0],q[1],m).forEach(function(r){if(r.t>=-1e-6&&r.t<=1+1e-6)A.push(dcAng(m,r.p))})});B.C.forEach(function(c){ccX(m,c).forEach(function(p){A.push(dcAng(m,p))})});return A.filter(function(a){return dcIn(m,a)})}
/* ---------- Trim 2D: tap the part of a line / circle / arc to remove (cut at crossings with lines, circles, arcs, walls) ---------- */
function d2Hit(w){var L=hitList(w,snapR()*1.6).filter(function(h){return h.k==="dline"||h.k==="dcirc"});return L.length?{k:L[0].k,e:elGet(L[0])}:null}
function d2Trim(w){var h=d2Hit(w);if(!h){toast("Tap the part of a 2D line / circle to cut away");return false}var e=h.e;
 if(h.k==="dline"){var T=lineCuts(e),L=Math.hypot(e.b.x-e.a.x,e.b.y-e.a.y)||1,tt=((w.x-e.a.x)*(e.b.x-e.a.x)+(w.y-e.a.y)*(e.b.y-e.a.y))/(L*L);if(!T.length){toast("Nothing crosses this line - use Delete to remove it");return false}
  var lo=0,hi=1;T.forEach(function(t){if(t<tt)lo=t;else if(hi===1&&t>tt)hi=t});snapshot();var A={x:e.a.x,y:e.a.y},B={x:e.b.x,y:e.b.y};function P(t){return {x:A.x+(B.x-A.x)*t,y:A.y+(B.y-A.y)*t}}
  if(lo>0&&hi<1){e.a=A;e.b=P(lo);S.dlines.push({id:nid(),a:P(hi),b:B,st:e.st})}else if(lo>0){e.a=A;e.b=P(lo)}else if(hi<1){e.a=P(hi);e.b=B}else S.dlines=S.dlines.filter(function(x){return x!==e});changed();toast("Trimmed");return true}
 var Aa=circCuts(e),ta=dcAng(e,w);if(e.a0==null){if(Aa.length<2){toast("A circle needs 2 crossings to trim");return false}var off=Aa.map(function(a){return (((a-ta)%360)+360)%360}).sort(function(a,b){return a-b});
  snapshot();e.a0=ta+off[0];e.a1=ta+off[off.length-1];/* keep from the first crossing after the tap round to the last one before it */e.a0=((e.a0%360)+360)%360;e.a1=((e.a1%360)+360)%360;changed();toast("Trimmed - circle is now an arc");return true}
 var sp=dcSpan(e),O=Aa.map(function(a){return (((a-e.a0)%360)+360)%360}).filter(function(o){return o>1e-6&&o<sp-1e-6}).sort(function(a,b){return a-b}),to=(((ta-e.a0)%360)+360)%360;if(!O.length){toast("Nothing crosses this arc - use Delete");return false}
 var lo2=0,hi2=sp;O.forEach(function(o){if(o<to)lo2=o;else if(hi2===sp&&o>to)hi2=o});snapshot();var a0=e.a0;
 if(lo2>0&&hi2<sp){e.a1=a0+lo2;S.dcircs.push({id:nid(),x:e.x,y:e.y,r:e.r,a0:a0+hi2,a1:a0+sp,st:e.st})}else if(lo2>0)e.a1=a0+lo2;else if(hi2<sp)e.a0=a0+hi2;else S.dcircs=S.dcircs.filter(function(x){return x!==e});changed();toast("Trimmed");return true}
/* ---------- Extend 2D: tap a line near the end to stretch it to the next line / circle / wall ---------- */
function d2Extend(w){var h=d2Hit(w);if(!h||h.k!=="dline"){toast("Tap near the end of a 2D line to extend it");return false}var e=h.e,da=Math.hypot(w.x-e.a.x,w.y-e.a.y),db=Math.hypot(w.x-e.b.x,w.y-e.b.y),end=da<db?"a":"b",oth=end==="a"?"b":"a",E=e[end],O=e[oth],L=Math.hypot(E.x-O.x,E.y-O.y)||1,u={x:(E.x-O.x)/L,y:(E.y-O.y)/L},far={x:E.x+u.x*500,y:E.y+u.y*500},B=d2Bounds("dline",e.id),best=Infinity;
 B.L.forEach(function(q){var r=llX(E,far,q[0],q[1]);if(r&&r.t>1e-7&&r.u>=-1e-6&&r.u<=1+1e-6)best=Math.min(best,r.t*500)});B.C.forEach(function(c){lcX(E,far,c).forEach(function(r){if(r.t>1e-7)best=Math.min(best,r.t*500)})});
 if(!isFinite(best)){toast("No boundary ahead of this end");return false}snapshot();e[end]={x:E.x+u.x*best,y:E.y+u.y*best};changed();toast("Extended "+fi(best));return true}
/* ---------- Fillet: 2 walls or 2 2D lines + radius (0 = sharp corner) ---------- */
function filletR(){return UI.fR>0?UI.fR:0}
function fillet2D(m1,w1,m2,w2,r){var X0=llX(m1.a,m1.b,m2.a,m2.b);if(!X0){toast("Lines are parallel");return false}var X={x:m1.a.x+(m1.b.x-m1.a.x)*X0.t,y:m1.a.y+(m1.b.y-m1.a.y)*X0.t};
 function keep(m,w){var da=(m.a.x-X.x)*(w.x-X.x)+(m.a.y-X.y)*(w.y-X.y),db=(m.b.x-X.x)*(w.x-X.x)+(m.b.y-X.y)*(w.y-X.y),K=Math.hypot(m.a.x-X.x,m.a.y-X.y)>Math.hypot(m.b.x-X.x,m.b.y-X.y)?"a":"b";if(da>0&&db<=0)K="a";else if(db>0&&da<=0)K="b";return K}
 var k1=keep(m1,w1),k2=keep(m2,w2),P1=m1[k1],P2=m2[k2],l1=Math.hypot(P1.x-X.x,P1.y-X.y),l2=Math.hypot(P2.x-X.x,P2.y-X.y);if(l1<1e-6||l2<1e-6){toast("Tap each line on the side to keep");return false}
 var u1={x:(P1.x-X.x)/l1,y:(P1.y-X.y)/l1},u2={x:(P2.x-X.x)/l2,y:(P2.y-X.y)/l2},th=Math.acos(Math.max(-1,Math.min(1,u1.x*u2.x+u1.y*u2.y)));
 var o1=k1==="a"?"b":"a",o2=k2==="a"?"b":"a";
 if(!(r>0)){snapshot();m1[o1]={x:X.x,y:X.y};m2[o2]={x:X.x,y:X.y};changed();toast("Corner made");return true}
 var t=r/Math.tan(th/2);if(t>l1-1e-6||t>l2-1e-6){toast("Radius too big for these lines");return false}
 var T1={x:X.x+u1.x*t,y:X.y+u1.y*t},T2={x:X.x+u2.x*t,y:X.y+u2.y*t},bx=u1.x+u2.x,by=u1.y+u2.y,bl=Math.hypot(bx,by),dc=r/Math.sin(th/2),C={x:X.x+bx/bl*dc,y:X.y+by/bl*dc};
 snapshot();m1[o1]=T1;m2[o2]=T2;var c={x:C.x,y:C.y,r:r},A1=dcAng(c,T1),A2=dcAng(c,T2);if((((A2-A1)%360)+360)%360>180){var tmp=A1;A1=A2;A2=tmp}
 S.dcircs.push({id:nid(),x:C.x,y:C.y,r:r,a0:A1,a1:A2,st:m1.st||"solid"});changed();toast("Fillet R "+fi(r));return true}
/* walls: radius 0 = Trim corner; radius > 0 = corner, then the corner is replaced by a curved wall made of short straight wall pieces */
function filletWalls(w1,w2,r){var n1=nearSeg(w1.x,w1.y,snapR()*1.6),n2=nearSeg(w2.x,w2.y,snapR()*1.6);if(!n1||!n2||n1.s===n2.s){toast("Tap two different walls");return false}
 var r1=wallRun(n1.s),r2=wallRun(n2.s),A1=pt(r1.a),B1=pt(r1.b),A2=pt(r2.a),B2=pt(r2.b),X0=llX(A1,B1,A2,B2);if(!X0){toast("Walls are parallel");return false}var X={x:A1.x+(B1.x-A1.x)*X0.t,y:A1.y+(B1.y-A1.y)*X0.t};
 function unit(a,b){var L=Math.hypot(b.x-a.x,b.y-a.y)||1;return {x:(b.x-a.x)/L,y:(b.y-a.y)/L}}var v1=unit(A1,B1),v2=unit(A2,B2);
 /* openings keep their real position on the wall */
 var OP0=S.ops.map(function(o){var G=opWorld(o);return {o:o,c:G?{x:G.c.x,y:G.c.y}:null}});
 function keepOps(){OP0.forEach(function(q){if(!q.c)return;var best=null;S.segs.forEach(function(s){var pr=projSeg(q.c.x,q.c.y,pt(s.a),pt(s.b));if(pr.d<0.05&&(!best||pr.d<best.d))best={s:s,t:pr.t,d:pr.d}});if(best){q.o.seg=best.s.id;q.o.t=clamp(best.t,0,1)}})}
 var u0=UNDO.length,tm=UI.trimMode;UI.trimMode="corner";UI.pick=null;try{trimTap(w1);trimTap(w2)}finally{UI.trimMode=tm;UI.pick=null}
 if(UNDO.length===u0)return false;keepOps();if(!(r>0)){changed();toast("Corner made (radius 0)");return true}
 var P=findPoint(X.x,X.y,0.05);if(!P){toast("Corner made - could not round it");return true}
 var inc=S.segs.filter(function(s){return s.a===P.id||s.b===P.id});function dirOf(s){var o=pt(s.a===P.id?s.b:s.a),L=Math.hypot(o.x-P.x,o.y-P.y)||1;return {s:s,o:o,L:L,u:{x:(o.x-P.x)/L,y:(o.y-P.y)/L}}}
 var D=inc.map(dirOf),q1=null,q2=null;D.forEach(function(q){var c1=Math.abs(q.u.x*v1.x+q.u.y*v1.y),c2=Math.abs(q.u.x*v2.x+q.u.y*v2.y);if(c1>0.999&&(!q1||q.L>q1.L))q1=q;else if(c2>0.999&&(!q2||q.L>q2.L))q2=q});
 if(!q1||!q2||inc.length!==2){toast("Corner made - other walls meet here, so it stays sharp");return true}
 var th=Math.acos(Math.max(-1,Math.min(1,q1.u.x*q2.u.x+q1.u.y*q2.u.y))),t=r/Math.tan(th/2);if(t>q1.L-0.05||t>q2.L-0.05){undoTo(u0);toast("Radius too big for these walls");return false}
 var T1={x:P.x+q1.u.x*t,y:P.y+q1.u.y*t},T2={x:P.x+q2.u.x*t,y:P.y+q2.u.y*t},bx=q1.u.x+q2.u.x,by=q1.u.y+q2.u.y,bl=Math.hypot(bx,by),dc=r/Math.sin(th/2),C={x:P.x+bx/bl*dc,y:P.y+by/bl*dc};
 var c={x:C.x,y:C.y,r:r},a1=dcAng(c,T1),a2=dcAng(c,T2),sp=(((a2-a1)%360)+360)%360;if(sp>180)sp=sp-360;var n=Math.max(3,Math.ceil(Math.abs(sp)/12));
 /* openings keep their real position */
 var k=q1.s.k,th1=q1.s.th,i1=nid(),i2=nid();S.pts.push({id:i1,x:T1.x,y:T1.y},{id:i2,x:T2.x,y:T2.y});
 if(q1.s.a===P.id)q1.s.a=i1;else q1.s.b=i1;if(q2.s.a===P.id)q2.s.a=i2;else q2.s.b=i2;
 var prev=i1;for(var i=1;i<=n;i++){var id=i===n?i2:nid();if(i<n){var p=dcPt(c,a1+sp*i/n);S.pts.push({id:id,x:p.x,y:p.y})}var s=addSeg(prev,id,k);if(s){if(th1)s.th=th1;s.arc=1;s.arcR=r;s.arcG=i1}prev=id}
 keepOps();
 cleanup();changed();toast("Fillet R "+fi(r)+" - curved wall in "+n+" straight pieces");return true}
function undoTo(n){while(UNDO.length>n){S=docify(JSON.parse(UNDO.pop()))}REDO=[];changed()}
function filletTap(w){var h=d2Hit(w),R=filletR(),n=nearSeg(w.x,w.y,snapR()*1.4),k=h&&h.k==="dline"?"dline":(n?"seg":null);
 if(!k){toast("Tap a wall or a 2D line");return}
 if(!UI.pick||UI.pick.k!=="fillet"){UI.pick={k:"fillet",kind:k,w:{x:w.x,y:w.y},id:k==="dline"?h.e.id:n.s.id};UI.d2mk=[{x:w.x,y:w.y}];if(k==="seg")UI.selSeg=wallRun(n.s).ids;updCtx();render();toast("Now tap the second "+(k==="seg"?"wall":"line")+" (side to keep) · radius "+fi(R));return}
 var P=UI.pick;UI.pick=null;UI.selSeg=null;UI.d2mk=null;
 if(P.kind==="dline"){if(k!=="dline"){toast("Tap a 2D line for the second pick");updCtx();render();return}var m1=S.dlines.find(function(x){return x.id===P.id});if(!m1||m1===h.e){updCtx();render();return}fillet2D(m1,P.w,h.e,w,R)}
 else filletWalls(P.w,w,R);updCtx();render()}
/* ---------- tools: pointer ---------- */
var D2T={circle:1,arc:1,rect:1,fillet:1,dtrim:1,dext:1};
function d2Snap(w){try{return snapPick(w,{fine:true})}catch(e){return {x:w.x,y:w.y}}}
var _d2Dn=toolDown;toolDown=function(w,G){if(D2T[UI.tool]&&!(UI.pick&&UI.pick.k!=="fillet")){G.kind="d2";G.a=d2Snap(w);return true}return _d2Dn(w,G)};
var _d2Mv=toolMove;toolMove=function(w,G,p){if(G.kind!=="d2")return _d2Mv(w,G,p);if(!G.moved)return true;var b=d2Snap(w),a=G.a;
 if(UI.tool==="circle"){var r=Math.hypot(b.x-a.x,b.y-a.y);UI.d2pv={c:{x:a.x,y:a.y,r:r}};showHud("Radius "+fi(r))}else if(UI.tool==="rect"){UI.d2pv={r:[a,b]};showHud(fi(Math.abs(b.x-a.x))+" x "+fi(Math.abs(b.y-a.y)))}render();return true};
var _d2Up=toolUp;toolUp=function(G,w){if(G.kind!=="d2")return _d2Up(G,w);hideHud();var t=UI.tool,b=d2Snap(w),a=G.a;UI.d2pv=null;
 if(t==="circle"){if(G.moved){var r=Math.hypot(b.x-a.x,b.y-a.y);if(r<0.1)toast("Too small");else{dcAdd({x:a.x,y:a.y,r:r});toast("Circle R "+fi(r))}}
  else if(UI.cR>0){dcAdd({x:b.x,y:b.y,r:UI.cR});toast("Circle R "+fi(UI.cR))}
  else if(UI.d2A){var c=UI.d2A,r2=Math.hypot(b.x-c.x,b.y-c.y);UI.d2A=null;UI.d2mk=null;if(r2<0.1)toast("Too small");else{dcAdd({x:c.x,y:c.y,r:r2});toast("Circle R "+fi(r2))}}
  else{UI.d2A=b;UI.d2mk=[b];toast("Centre set - tap a point on the circle (or drag from the centre)")}}
 else if(t==="rect"){var p0=G.moved?a:UI.d2A,p1=b;if(!G.moved&&!UI.d2A){UI.d2A=b;UI.d2mk=[b];toast("Corner set - tap the opposite corner (or drag)")}
  else{UI.d2A=null;UI.d2mk=null;if(Math.abs(p1.x-p0.x)<0.1||Math.abs(p1.y-p0.y)<0.1)toast("Too small");else{snapshot();var st=UI.dlSt||"solid",C=[{x:p0.x,y:p0.y},{x:p1.x,y:p0.y},{x:p1.x,y:p1.y},{x:p0.x,y:p1.y}];for(var i=0;i<4;i++)S.dlines.push({id:nid(),a:{x:C[i].x,y:C[i].y},b:{x:C[(i+1)%4].x,y:C[(i+1)%4].y},st:st});changed();toast("Rectangle "+fi(Math.abs(p1.x-p0.x))+" x "+fi(Math.abs(p1.y-p0.y))+" (4 lines)")}}}
 else if(t==="arc"){UI.d2P=UI.d2P||[];UI.d2P.push(b);UI.d2mk=UI.d2P.slice();if(UI.d2P.length===1)toast("Arc: start set - tap the end point");else if(UI.d2P.length===2)toast("Now tap a point the arc passes through");else{var P3=UI.d2P;UI.d2P=null;UI.d2mk=null;d2Arc3(P3[0],P3[2],P3[1])}}
 else if(t==="fillet")filletTap(b.snap?w:w);else if(t==="dtrim")d2Trim(w);else if(t==="dext")d2Extend(w);
 render();return true};
/* arc through start, a point on it, end */
function d2Arc3(A,M,B){var ax=A.x,ay=A.y,bx=M.x,by=M.y,cx=B.x,cy=B.y,d=2*(ax*(by-cy)+bx*(cy-ay)+cx*(ay-by));if(Math.abs(d)<1e-9){toast("Points are in a line - tap a point off the line");return}
 var ux=((ax*ax+ay*ay)*(by-cy)+(bx*bx+by*by)*(cy-ay)+(cx*cx+cy*cy)*(ay-by))/d,uy=((ax*ax+ay*ay)*(cx-bx)+(bx*bx+by*by)*(ax-cx)+(cx*cx+cy*cy)*(bx-ax))/d,c={x:ux,y:uy,r:Math.hypot(ax-ux,ay-uy)};
 var a0=dcAng(c,A),a1=dcAng(c,B),am=dcAng(c,M);c.a0=a0;c.a1=a1;if(!dcIn(c,am)){c.a0=a1;c.a1=a0}dcAdd({x:c.x,y:c.y,r:c.r,a0:c.a0,a1:c.a1});toast("Arc R "+fi(c.r))}
/* ---------- ribbon: Draw group (Annotate + Architecture), Fillet next to Trim (Modify) ---------- */
Object.assign(TD14,{dline:["Line","2D line (detail line) - plan, PDF, DXF only","dline"],circle:["Circle","2D circle: centre + radius (plan, PDF, DXF only)","circle"],arc:["Arc","2D arc through 3 points: start, end, a point on it","arc"],rect:["Rectangle","2D rectangle: 2 corners (4 lines)","rect"],
 dtrim:["Trim 2D","Cut a 2D line / circle where it crosses lines, circles or walls - tap the part to remove","dtrim"],dext:["Extend 2D","Stretch a 2D line to the next line, circle or wall","dext"],fillet:["Fillet","2 walls or 2 lines + radius (0 = sharp corner)","fillet"]});
Object.assign(RLAB,{dline:"Line",circle:"Circle",arc:"Arc",rect:"Rect",dtrim:"Trim 2D",dext:"Extend",fillet:"Fillet"});
(function(){var an=PANELS.anno[1];an.forEach(function(p){if(p[0]==="Detail"){p[0]="Draw";p[1]="Draw";p[2]=["dline","circle","arc","rect","dtrim","dext"]}});
 var ar=PANELS.arch[1],bi=ar.findIndex(function(p){return p[0]==="Build"});ar.splice(bi+1,0,["Draw","Draw",["dline","circle","arc","rect"]]);
 var mo=PANELS.modify[1].find(function(p){return p[0]==="Modify"});var ti=mo[2].indexOf("trim");mo[2].splice(ti+1,0,"fillet","dtrim","dext");
 TABS={};Object.keys(PANELS).forEach(function(k){TABS[k]=[PANELS[k][0],panelTools(k)]})})();
Object.assign(HINTS,{circle:"Drag from the centre (or tap centre, then a point on the circle) · set an exact radius in the bar",arc:"Tap the start, the end, then a point the arc passes through",rect:"Drag corner to corner (or tap 2 corners) - makes 4 lines",
 dtrim:"Tap the part of a 2D line / circle to cut away (cuts at crossings with lines, circles, walls)",dext:"Tap a 2D line near its end - it stretches to the next line, circle or wall",fillet:"Tap 2 walls (or 2 lines) on the sides to keep · radius 0 = sharp corner",dline:HINTS.dline||"Drag (or tap 2 points) to draw a 2D line"});
var _d2Uctx=updCtx;updCtx=function(){_d2Uctx.apply(this,arguments);var c=$("ctx");if(!c||$("d2Chips")||UI.clean)return;var t=UI.tool,h="";
 if(t==="circle")h=cb("d2cr",UI.cR>0?"Radius "+fi(UI.cR):"Radius: drag","tap = exact",UI.cR>0)+(UI.cR>0?cb("d2cr0","Drag radius",""):"");
 if(t==="circle"||t==="arc"||t==="rect")h+=cb("dls","Solid","",(UI.dlSt||"solid")==="solid")+cb("dld","Dashed","",UI.dlSt==="dash");
 if(t==="fillet")h=cb("d2fr","Radius "+fi(filletR()),filletR()>0?"curved corner":"sharp corner",true)+[0,1,2,3,5].map(function(v){return cb("d2fr:"+v,v?fi(v):"0 sharp","",Math.abs(filletR()-v)<1e-9)}).join("");
 if(!h)return;var sp=document.createElement("span");sp.id="d2Chips";sp.style.display="contents";sp.innerHTML=h;c.appendChild(sp);sp.querySelectorAll("[data-c]").forEach(function(b){b.onclick=function(ev){ev.stopPropagation();ctxAction(b.dataset.c)}})};
var _d2Ctx=ctxAction;ctxAction=function(k){if(k==="d2cr"){fiPopup("Circle radius","Each tap places a circle with this radius",UI.cR||2,function(v){if(v>0.05){UI.cR=v;updCtx()}else toast("Radius too small")});return}
 if(k==="d2cr0"){UI.cR=0;updCtx();return}if(k==="d2fr"){fiPopup("Fillet radius","0 = sharp corner (like Trim corner)",filletR(),function(v){if(v>=0&&v<100){UI.fR=v;updCtx()}else toast("0 to 100 ft")});return}
 if(k.indexOf("d2fr:")===0){UI.fR=+k.slice(5);updCtx();toast("Fillet radius "+fi(UI.fR));return}
 if((k==="dls"||k==="dld")&&{circle:1,arc:1,rect:1}[UI.tool]){UI.dlSt=k==="dls"?"solid":"dash";updCtx();return}
 if(k==="pickx"){UI.d2A=null;UI.d2P=null;UI.d2mk=null}return _d2Ctx.apply(this,arguments)};
var _d2Tool=setTool;setTool=function(t){UI.d2A=null;UI.d2P=null;UI.d2mk=null;UI.d2pv=null;if(UI.pick&&UI.pick.k==="fillet")UI.pick=null;return _d2Tool.apply(this,arguments)};
setTimeout(function(){try{buildRail()}catch(e){}},0);
Object.assign(ICO,{circle:'<circle cx="12" cy="12" r="8"/><path d="M12 12h8"/><circle cx="12" cy="12" r="1"/>',arc:'<path d="M4 18A10 10 0 0 1 20 10"/><circle cx="4" cy="18" r="1.5"/><circle cx="20" cy="10" r="1.5"/>',rect:'<rect x="4" y="6" width="16" height="12"/>',
 dtrim:'<path d="M3 12h7"/><path d="M14 12h7" stroke-dasharray="2 2"/><path d="M12 4v16"/><path d="M15 9l4 6M19 9l-4 6"/>',dext:'<path d="M3 12h11"/><path d="M14 12h5" stroke-dasharray="2 2"/><path d="M21 4v16"/><path d="m11 9 3 3-3 3"/>',
 fillet:'<path d="M4 20V12a8 8 0 0 1 8-8h8"/><path d="M4 4h4M4 4v4" stroke-dasharray="1.5 1.5"/>'});

/* curved wall pieces: mitre the joints (no saw teeth), hide the inner dots and per-piece lengths, show one "R" label */
function arcInnerPts(){var deg={},arc={};S.segs.forEach(function(s){[s.a,s.b].forEach(function(p){deg[p]=(deg[p]||0)+1;if(s.arc)arc[p]=(arc[p]||0)+1})});var o={};Object.keys(arc).forEach(function(p){if(deg[p]===2&&arc[p]===2)o[p]=1});return o}
var _d2NE=nodeExt;nodeExt=function(s,pid,only){var inc=S.segs.filter(function(q){return q!==s&&(q.a===pid||q.b===pid)});
 if(inc.length===1&&(s.arc||inc[0].arc)&&(!only||only(inc[0]))){var q=inc[0],P=pt(pid),o1=pt(s.a===pid?s.b:s.a),o2=pt(q.a===pid?q.b:q.a),l1=Math.hypot(o1.x-P.x,o1.y-P.y),l2=Math.hypot(o2.x-P.x,o2.y-P.y);
  if(l1>1e-6&&l2>1e-6){var c=((o1.x-P.x)*(o2.x-P.x)+(o1.y-P.y)*(o2.y-P.y))/(l1*l2),phi=Math.acos(Math.max(-1,Math.min(1,c))),dev=Math.PI-phi;if(dev<Math.PI/3)return Math.max(wallT(s),wallT(q))/2*Math.tan(dev/2)}}
 return _d2NE.apply(this,arguments)};
var _d2Anno2=drawAnnoCanvas;drawAnnoCanvas=function(){_d2Anno2.apply(this,arguments);if(!visOn("walls")||!visOn("dims"))return;var G={};S.segs.forEach(function(s){if(s.arc&&s.arcG!=null)(G[s.arcG]=G[s.arcG]||[]).push(s)});
 Object.keys(G).forEach(function(k){var L=G[k],s=L[Math.floor(L.length/2)],a=pt(s.a),b=pt(s.b);if(!a||!b)return;var q=w2s((a.x+b.x)/2,(a.y+b.y)/2);pill(q.x,q.y,"R "+fi(s.arcR||0),"#1d4ed8","#fff",12)})};
