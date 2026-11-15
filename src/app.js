/* ================= JK Sketch Plan - hand drawing house plan ================= */
var APP="JK Sketch Plan",SUBT="JK Construction - Hand Drawing House Plan",VERSION="1.4";
var ROOMS=["Bedroom","Hall","Kitchen","Toilet","Pooja Room","Staircase","Dining","Portico/Parking","Sit-out","Utility"];
var TAM={"Bedroom":"படுக்கை அறை","Hall":"ஹால்","Kitchen":"சமையலறை","Toilet":"கழிவறை","Pooja Room":"பூஜை அறை","Staircase":"படிக்கட்டு","Dining":"சாப்பாட்டு அறை","Portico/Parking":"போர்டிகோ","Sit-out":"சிட்-அவுட்","Utility":"யூட்டிலிட்டி"};
var OPN={D:"Door",W:"Window",V:"Ventilator"},OPC={D:"#8a4b14",W:"#1f5fa8",V:"#3f6f5a"},OPDEF={D:3,W:4,V:2};
var OPSILL={D:0,W:3,V:7},OPHGT={D:7,W:4,V:1.5};
function opSill(o){return o.sill!=null?o.sill:OPSILL[o.type]}
function opH(o){return o.h!=null?o.h:OPHGT[o.type]}
var OK5=["MD","D","TD","OP","W","V"],OKN={MD:"Main Door",D:"Bedroom Door",TD:"Bathroom/Toilet Door",OP:"Opening (no shutter)",W:"Window",V:"Ventilator"},OKT={MD:"மெயின் கதவு",D:"அறை கதவு",TD:"கழிவறை கதவு",OP:"திறப்பு",W:"ஜன்னல்",V:"வென்டிலேட்டர்"};
var OKW={MD:3.5,D:3,TD:2.5,OP:3,W:4,V:2},OKC={MD:"#7a2e0b",D:"#c2410c",TD:"#0f766e",OP:"#64748b",W:"#1d4ed8",V:"#7c3aed"};
function opKind(o){return o.type==="D"?(o.dk||"D"):o.type}function opCol(o){return OKC[opKind(o)]}function opLayer(o){return o.type==="D"?"DOORS":"WINDOWS"}function kType(k){return (k==="MD"||k==="TD"||k==="D"||k==="OP")?"D":k}
function toiletWall(s){var a=pt(s.a),b=pt(s.b),L=segLen(s);if(L<1e-6)return false;var m={x:(a.x+b.x)/2,y:(a.y+b.y)/2},n={x:-(b.y-a.y)/L,y:(b.x-a.x)/L},RI=roomsInfo();
 return RI.faces.some(function(f){var l=f.labels[0];if(!l||!/toilet|bath|wc|wash/i.test(l.name))return false;return inPoly(m.x+n.x*0.4,m.y+n.y*0.4,f.pts)||inPoly(m.x-n.x*0.4,m.y-n.y*0.4,f.pts)})}
function lvl(v){return (v>=0?"+":"-")+fi(Math.abs(v))}
function wallH(){return (S&&S.L&&S.L[S.cur])?S.L[S.cur].h:(S.meta.wh||10)}
function isStair(n){return /stair|padi/i.test(n||"")}
/* staircase symbol inside a room's box: treads @10", landing at the far end, cut line, UP arrow */
function stairGeom(f,lab){var sd=f.side,db=S.meta.dbl&&sd,il=db?sd.l/2:0.25,ir=db?sd.r/2:0.25,it=db?sd.t/2:0.25,ib=db?sd.b/2:0.25,x0=f.bx+il,y0=f.by+it,w=f.w-il-ir,h=f.h-it-ib;if(w<1.5||h<1.5)return null;
 var horiz=w>=h,L=horiz?w:h,W=horiz?h:w,T=10/12,Rz=7/12,land=Math.min(Math.max(W,3),L*0.35),n=Math.max(2,Math.floor((L-land)/T)),run=n*T;land=L-run;
 var fl=lab&&lab.flip;function P(a,b){if(fl)a=L-a;return horiz?{x:x0+a,y:y0+b}:{x:x0+b,y:y0+a}}
 var G={horiz:horiz,L:L,W:W,n:n,run:run,land:land,T:T,R:Rz,box:[P(0,0),P(L,0),P(L,W),P(0,W)],treads:[],steps:[]};
 for(var i=1;i<=n;i++)G.treads.push([P(i*T,0),P(i*T,W)]);
 var c=run*0.55;G.cut=[P(c-W*0.35,W),P(c-0.15,W*0.56),P(c+0.15,W*0.44),P(c+W*0.35,0)];
 G.arrow=[P(T*0.5,W/2),P(run+land*0.55,W/2)];var e=G.arrow[1],q=P(run+land*0.55-Math.min(0.9,land*0.4),W/2),ux=e.x-q.x,uy=e.y-q.y,ul=Math.hypot(ux,uy)||1;ux/=ul;uy/=ul;var hw=Math.min(0.45,W*0.15);
 G.head=[e,{x:q.x-uy*hw,y:q.y+ux*hw},{x:q.x+uy*hw,y:q.y-ux*hw}];G.up=P(T*0.5+Math.min(1.2,run*0.15),W/2+Math.min(0.9,W*0.22));G.ang=Math.atan2(G.arrow[1].y-G.arrow[0].y,G.arrow[1].x-G.arrow[0].x);
 for(i=0;i<n;i++)G.steps.push({pts:[P(i*T,0),P((i+1)*T,0),P((i+1)*T,W),P(i*T,W)],z:(i+1)*Rz});
 G.steps.push({pts:[P(run,0),P(L,0),P(L,W),P(run,W)],z:(n+1)*Rz,landing:true});return G}
function stairsAll(RI){var out=[];(RI||roomsInfo()).faces.forEach(function(f){var l=f.labels.find(function(x){return isStair(x.name)});if(l){var g2=stairGeom(f,l);if(g2)out.push(g2)}});return out}
var FILLS=["#fde9c8","#d9ecf7","#e3f1d9","#f6dbe5","#e8e1f5","#fbf3c4","#d8f0ee","#f3e2d2"];
var S,cv,g,CW=0,CH=0,DPR=1;
var V={s:20,ox:40,oy:40};          // plan view: px per ft
var SV={s:2,ox:0,oy:0};            // clean view: px per mm of the A3 sheet
/* Stage: v1.4 drawing tools - UI.tool holds the active tool; default is the Wall tool ("draw") */
var UI={tool:"draw",ortho:90,grid:1,penOnly:false,penSeen:false,kind:"O",chainOn:true,chain:null,runStart:null,clean:false,preview:null,snap:null,mark:null,selSeg:null};
var UNDO=[],REDO=[],CURID=null,SAVET=null,DIRTY=false;

/* Stage: New drawing - empty plan, no tool-specific data yet (Wall tool active) */
function blank(){return docify({v:1,nid:1,pts:[],segs:[],labels:[],ops:[],furn:[],meta:{name:"",owner:"",site:"",date:today(),dbl:true,tout:9,tin:4.5,paper:"A3",proj:"",ttl:"Ground Floor Plan",dno:"A101",drawn:"JK Construction",chk:"",revs:""}})}
function nid(){return S.nid++}
function pt(id){for(var i=0;i<S.pts.length;i++)if(S.pts[i].id===id)return S.pts[i];return null}
function segById(id){for(var i=0;i<S.segs.length;i++)if(S.segs[i].id===id)return S.segs[i];return null}
function segLen(s){var a=pt(s.a),b=pt(s.b);return Math.hypot(b.x-a.x,b.y-a.y)}
/* Stage: Inner-to-inner wall dimensions - labels, live drawing length and the Size / value editor show the CLEAR length
   between the inner faces of the walls joined at each end (c-c minus half the joined wall's thickness at each end; for a
   sloped join half-thickness / sin(angle)). A free end, or an end that only continues straight, is measured to the wall's
   own end point (no deduction). The data model stays centre-to-centre. */
function jCut(p,u,skip,extra){var c=0;function cand(qa,qb,tq){var L=Math.hypot(qb.x-qa.x,qb.y-qa.y);if(L<1e-6)return;
  if(!(Math.hypot(qa.x-p.x,qa.y-p.y)<0.02||Math.hypot(qb.x-p.x,qb.y-p.y)<0.02)){var q=projSeg(p.x,p.y,qa,qb);if(!(q.t>0&&q.t<1&&q.d<0.02))return}
  var cr=Math.abs(u.x*(qb.y-qa.y)/L-u.y*(qb.x-qa.x)/L);if(cr<0.1)return;c=Math.max(c,tq/2/Math.max(cr,0.25))}
 S.segs.forEach(function(q){if(skip&&skip[q.id])return;var A=pt(q.a),B=pt(q.b);if(A&&B)cand(A,B,wallT(q))});(extra||[]).forEach(function(e){cand(e.a,e.b,e.t)});return c}
function innerEnds(a,b,skip,extra){var L=Math.hypot(b.x-a.x,b.y-a.y);if(L<1e-6)return {a:a,b:b,L:0,ca:0,cb:0,cc:0};var u={x:(b.x-a.x)/L,y:(b.y-a.y)/L},ca=jCut(a,u,skip,extra),cb=jCut(b,{x:-u.x,y:-u.y},skip,extra);
 if(ca+cb>L-0.05){ca=0;cb=0}return {a:{x:a.x+u.x*ca,y:a.y+u.y*ca},b:{x:b.x-u.x*cb,y:b.y-u.y*cb},L:L-ca-cb,ca:ca,cb:cb,cc:L}}
function segInner(s){var k={};k[s.id]=1;return innerEnds(pt(s.a),pt(s.b),k)}
function runInner(R){var k={};R.ids.forEach(function(i){k[i]=1});return innerEnds(pt(R.a),pt(R.b),k)}
function pvInner(pv,i){var t=wallT({k:UI.kind,th:UI.wth}),ex=[];pv.forEach(function(o,j){if(j!==i)ex.push({a:o.a,b:o.b,t:t})});return innerEnds(pv[i].a,pv[i].b,null,ex)}
function innerSelSeg(){if(UI.tool!=="sel"||UI.box||UI.clean)return null;var L=typeof selEls==="function"?selEls():[];return L.length===1&&L[0].k==="seg"?L[0].id:null}
function fi(L){var t=Math.round(Math.abs(L)*12),f=Math.floor(t/12),i=t%12;return f+"'-"+i+'"'}
function sq(n){return (Math.round(n*10)/10).toFixed(1)}
function gsnap(v){return Math.round(v*2)/2}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function snapR(){return 22/V.s}
/* wall thickness (inches): own value s.th, else the drawing default for outer / inner walls */
function wallIn(s){return (s&&s.th>0)?+s.th:((s&&s.k==="I")?+S.meta.tin:+S.meta.tout)}
function wallT(s){return wallIn(s)/12}
function thTxt(v){v=+v;var w=Math.floor(v+1e-9),f=v-w;return (Math.abs(f-0.5)<0.01?(w?w:"")+"½":fmt(v))+'"'}
function thA(v){return fmt(+v)+'"'}
function setWallTh(s,v){v=+v;var m=S.meta;if(Math.abs(v-m.tout)<0.01){s.k="O";delete s.th}else if(Math.abs(v-m.tin)<0.01){s.k="I";delete s.th}else{s.th=v;s.k=v>=8?"O":"I"}}
var THP=[[4.5,"Half brick","அரை செங்கல்"],[6,"Block 6 in","பிளாக்"],[8,"Block 8 in","பிளாக்"],[9,"Full brick","முழு செங்கல்"]];
function thName(v){v=+v;return v===4.5?"half brick":v===9?"full brick":(v===6||v===8)?"block":"custom"}
function thCol(v){v=+v;return v<=4.6?"#0f8a7e":v<=6.1?"#7c3aed":v<=8.1?"#b45309":v<=9.1?"#334155":"#be123c"}

/* ---------- distance helpers ---------- */
function projSeg(x,y,a,b){var dx=b.x-a.x,dy=b.y-a.y,L2=dx*dx+dy*dy;if(L2<1e-12)return {t:0,x:a.x,y:a.y,d:Math.hypot(x-a.x,y-a.y)};
 var t=((x-a.x)*dx+(y-a.y)*dy)/L2,tc=clamp(t,0,1),px=a.x+dx*tc,py=a.y+dy*tc;return {t:t,tc:tc,x:px,y:py,d:Math.hypot(x-px,y-py)}}
function findPoint(x,y,r,excl){var best=null,bd=r;S.pts.forEach(function(p){if(p.id===excl)return;var d=Math.hypot(p.x-x,p.y-y);if(d<=bd){bd=d;best=p}});return best}
function findSeg(x,y,r,exclPid){var best=null,bd=r;S.segs.forEach(function(s){if(exclPid&&(s.a===exclPid||s.b===exclPid))return;var a=pt(s.a),b=pt(s.b),q=projSeg(x,y,a,b);if(q.t<=0||q.t>=1)return;if(q.d<=bd){var L=Math.hypot(b.x-a.x,b.y-a.y),al=gsnap(q.t*L);if(al<=0.01||al>=L-0.01)al=q.t*L;var t=al/L;bd=q.d;best={seg:s.id,t:t,x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,d:q.d}}});return best}
function segIntersect(p,u,a,b){/* ray p+r*u vs segment a-b -> {r,t} */var ex=b.x-a.x,ey=b.y-a.y,den=u.x*ey-u.y*ex;if(Math.abs(den)<1e-9)return null;
 var wx=a.x-p.x,wy=a.y-p.y,r=(wx*ey-wy*ex)/den,t=(wx*u.y-wy*u.x)/den;return {r:r,t:t}}

/* ---------- freehand straightening (Ramer-Douglas-Peucker) ---------- */
function rdp(P,eps){if(P.length<3)return P.slice();var a=P[0],b=P[P.length-1],md=-1,mi=0;
 for(var i=1;i<P.length-1;i++){var q=projSeg(P[i].x,P[i].y,a,b);if(q.d>md){md=q.d;mi=i}}
 if(md>eps){var l=rdp(P.slice(0,mi+1),eps),r=rdp(P.slice(mi),eps);return l.slice(0,-1).concat(r)}return [a,b]}

/* one straight step from cur towards tgt, with angle / grid / object snapping */
function snapStep(cur,tgt,isLast){
 var dx=tgt.x-cur.x,dy=tgt.y-cur.y,L=Math.hypot(dx,dy),R=snapR();
 if(L<1e-9)return {x:cur.x,y:cur.y,len:0};
 if(UI.ortho===0){
  if(isLast){var q=findPoint(tgt.x,tgt.y,R,cur.pid);if(q)return {x:q.x,y:q.y,pid:q.id,len:Math.hypot(q.x-cur.x,q.y-cur.y),snap:"pt"};
   var sg=findSeg(tgt.x,tgt.y,R,cur.pid);if(sg)return {x:sg.x,y:sg.y,len:Math.hypot(sg.x-cur.x,sg.y-cur.y),snap:"seg"}}
  var x=gsnap(tgt.x),y=gsnap(tgt.y);return {x:x,y:y,len:Math.hypot(x-cur.x,y-cur.y)}}
 var step=UI.ortho===45?Math.PI/4:Math.PI/2,ang=Math.round(Math.atan2(dy,dx)/step)*step,ux=Math.cos(ang),uy=Math.sin(ang);
 if(Math.abs(ux)<1e-9)ux=0;if(Math.abs(uy)<1e-9)uy=0;
 var len=dx*ux+dy*uy,e=Math.max(gsnap(len),0),res={len:e},best=null;
 if(isLast){
  S.pts.forEach(function(q){if(q.id===cur.pid)return;var px=q.x-cur.x,py=q.y-cur.y,pr=px*ux+py*uy,perp=Math.abs(px*uy-py*ux);if(pr<=0.1)return;
   var dEnd=Math.hypot(cur.x+ux*pr-tgt.x,cur.y+uy*pr-tgt.y);
   if(perp<0.02&&dEnd<R*1.5){if(!best||best.k>0||dEnd<best.d)best={k:0,len:pr,pid:q.id,d:dEnd,snap:"pt"}}
   else if(Math.abs(pr-len)<R*0.8&&(!best||best.k>1||(best.k===1&&Math.abs(pr-len)<best.d)))best={k:1,len:pr,d:Math.abs(pr-len),snap:"align",ax:q.x,ay:q.y}});
  S.segs.forEach(function(s){if(s.a===cur.pid||s.b===cur.pid)return;var a=pt(s.a),b=pt(s.b),I=segIntersect(cur,{x:ux,y:uy},a,b);if(!I||I.t<=0.001||I.t>=0.999||I.r<=0.1)return;
   if(Math.abs(I.r-len)<R&&(!best||best.k>0.5||(best.k===0.5&&Math.abs(I.r-len)<best.d)))best={k:0.5,len:I.r,d:Math.abs(I.r-len),snap:"seg"}});
 }
 if(best){res.len=best.len;res.snap=best.snap;if(best.pid)res.pid=best.pid;if(best.ax!==undefined){res.ax=best.ax;res.ay=best.ay}}
 res.x=cur.x+ux*res.len;res.y=cur.y+uy*res.len;
 if(res.pid){var P=pt(res.pid);res.x=P.x;res.y=P.y}
 return res}

/* Stage: v1.4 drawing tools - Wall tool: freehand stroke -> straight wall preview */
function buildPreview(start,path){
 var eps=Math.max(0.6,16/V.s),simp=rdp(path,eps);simp[0]={x:start.x,y:start.y};
 if(simp.length<2)return [];
 var out=[],cur={x:start.x,y:start.y,pid:start.pid};
 for(var i=1;i<simp.length;i++){var last=i===simp.length-1,r=snapStep(cur,simp[i],last);
  if(r.len<0.25)continue;out.push({a:cur,b:r});cur={x:r.x,y:r.y,pid:r.pid}}
 return out}

/* ---------- topology ---------- */
/* Stage: v1.4 drawing tools - Wall tool: creates a wall segment of the selected wall type */
function addSeg(a,b,k){if(a===b)return null;for(var i=0;i<S.segs.length;i++){var s=S.segs[i];if((s.a===a&&s.b===b)||(s.a===b&&s.b===a))return s}
 var s={id:nid(),a:a,b:b,k:k||"O"};if(UI.wth)setWallTh(s,UI.wth);if(UI.wt&&typeof tById==="function"){var wt=tById("wall",UI.wt);if(wt&&Math.abs(wt.th-wallIn(s))<0.01)s.wt=wt.id}S.segs.push(s);return s}
function ensurePoint(p){if(p.pid&&pt(p.pid))return p.pid;var q=findPoint(p.x,p.y,0.02);if(q)return q.id;var id=nid();S.pts.push({id:id,x:p.x,y:p.y});return id}
function splitSeg(s,pid){var a=pt(s.a),b=pt(s.b),P=pt(pid),q=projSeg(P.x,P.y,a,b),t=q.t,s2={id:nid(),a:pid,b:s.b,k:s.k};if(s.th)s2.th=s.th;s.b=pid;S.segs.push(s2);
 S.ops.forEach(function(o){if(o.seg!==s.id)return;if(o.t<t)o.t=o.t/t;else{o.seg=s2.id;o.t=(o.t-t)/(1-t)}});return s2}
/* Stage: v1.4 drawing tools - Wall tool / Import: joins walls at corners, T-junctions and crossings */
function planarize(){
 for(var guard=0;guard<2000;guard++){var did=false;
  // merge coincident points
  for(var i=0;i<S.pts.length&&!did;i++)for(var j=i+1;j<S.pts.length&&!did;j++){var A=S.pts[i],B=S.pts[j];if(Math.hypot(A.x-B.x,A.y-B.y)<0.02){
   S.segs.forEach(function(s){if(s.a===B.id)s.a=A.id;if(s.b===B.id)s.b=A.id});S.pts.splice(j,1);if(UI.chain===B.id)UI.chain=A.id;if(UI.runStart===B.id)UI.runStart=A.id;did=true}}
  if(did)continue;
  // drop zero / duplicate segments
  var seen={};for(i=S.segs.length-1;i>=0;i--){var s=S.segs[i],key=Math.min(s.a,s.b)+"_"+Math.max(s.a,s.b);if(s.a===s.b||seen[key]){dropOps(s.id);S.segs.splice(i,1);did=true}else seen[key]=1}
  if(did)continue;
  // T-junctions: a point lying on a segment interior
  for(i=0;i<S.segs.length&&!did;i++){var s=S.segs[i],a=pt(s.a),b=pt(s.b);for(j=0;j<S.pts.length;j++){var P=S.pts[j];if(P.id===s.a||P.id===s.b)continue;var q=projSeg(P.x,P.y,a,b);
   if(q.t>1e-4&&q.t<1-1e-4&&q.d<0.02){splitSeg(s,P.id);did=true;break}}}
  if(did)continue;
  // crossings
  for(i=0;i<S.segs.length&&!did;i++)for(j=i+1;j<S.segs.length&&!did;j++){var s1=S.segs[i],s2=S.segs[j];if(s1.a===s2.a||s1.a===s2.b||s1.b===s2.a||s1.b===s2.b)continue;
   var a1=pt(s1.a),b1=pt(s1.b),a2=pt(s2.a),b2=pt(s2.b),L1=Math.hypot(b1.x-a1.x,b1.y-a1.y),u={x:(b1.x-a1.x)/L1,y:(b1.y-a1.y)/L1},I=segIntersect(a1,u,a2,b2);
   if(I&&I.r>0.02&&I.r<L1-0.02&&I.t>1e-3&&I.t<1-1e-3){var id=nid();S.pts.push({id:id,x:a1.x+u.x*I.r,y:a1.y+u.y*I.r});splitSeg(s1,id);splitSeg(s2,id);did=true}}
  if(!did)break}
 cleanup()}
function dropOps(sid){S.ops=S.ops.filter(function(o){return o.seg!==sid})}
function cleanup(){var used={};S.segs.forEach(function(s){used[s.a]=1;used[s.b]=1});S.pts=S.pts.filter(function(p){return used[p.id]});
 if(UI.chain&&!pt(UI.chain))UI.chain=null;if(UI.runStart&&!pt(UI.runStart))UI.runStart=null;
 S.ops=S.ops.filter(function(o){return segById(o.seg)})}
function component(pid){var c={},st=[pid];c[pid]=1;while(st.length){var p=st.pop();S.segs.forEach(function(s){var o=s.a===p?s.b:(s.b===p?s.a:null);if(o&&!c[o]){c[o]=1;st.push(o)}})}return c}
/* the full straight wall through segment s (colinear neighbours) */
function wallRun(s){var a=pt(s.a),b=pt(s.b),L=segLen(s),ux=(b.x-a.x)/L,uy=(b.y-a.y)/L,ids=[s.id];
 function ext(pid,sgn){var cur=pid;for(var n=0;n<500;n++){var nx=null;S.segs.forEach(function(q){if(nx||ids.indexOf(q.id)>=0)return;var o=q.a===cur?q.b:(q.b===cur?q.a:null);if(!o)return;var P=pt(cur),O=pt(o),dx=O.x-P.x,dy=O.y-P.y,l=Math.hypot(dx,dy);
   if(l>1e-6&&Math.abs((dx*ux+dy*uy)/l-sgn)<1e-4){nx={q:q,o:o}}});if(!nx)return cur;ids.push(nx.q.id);cur=nx.o}return cur}
 var e0=ext(s.a,-1),e1=ext(s.b,1);return {a:e0,b:e1,ids:ids,len:Math.hypot(pt(e1).x-pt(e0).x,pt(e1).y-pt(e0).y)}}

/* ---------- rooms: faces of the planar wall graph ---------- */
function polyArea(P){var a=0;for(var i=0;i<P.length;i++){var p=P[i],q=P[(i+1)%P.length];a+=p.x*q.y-q.x*p.y}return a/2}
function inPoly(x,y,P){var c=false;for(var i=0,j=P.length-1;i<P.length;j=i++){var a=P[i],b=P[j];if(((a.y>y)!==(b.y>y))&&(x<(b.x-a.x)*(y-a.y)/(b.y-a.y)+a.x))c=!c}return c}
function faces(){var adj={};S.pts.forEach(function(p){adj[p.id]=[]});
 S.segs.forEach(function(s){var a=pt(s.a),b=pt(s.b);adj[s.a].push({to:s.b,ang:Math.atan2(b.y-a.y,b.x-a.x)});adj[s.b].push({to:s.a,ang:Math.atan2(a.y-b.y,a.x-b.x)})});
 for(var k in adj)adj[k].sort(function(p,q){return p.ang-q.ang});
 var vis={},out=[];
 S.segs.forEach(function(s){[[s.a,s.b],[s.b,s.a]].forEach(function(he){var u=he[0],v=he[1];if(vis[u+">"+v])return;var cyc=[],n=0;
   while(!vis[u+">"+v]&&n++<5000){vis[u+">"+v]=1;cyc.push(u);var L=adj[v],idx=-1;for(var i=0;i<L.length;i++)if(L[i].to===u){idx=i;break}
    var w=L[(idx-1+L.length)%L.length].to;u=v;v=w}
   var P=cyc.map(function(id){var p=pt(id);return {x:p.x,y:p.y,id:id}}),A=polyArea(P);if(A>1e-3)out.push({pts:P,area:A})})});
 return out}
function simplifyPoly(P){var o=P.filter(function(p,i){var a=P[(i-1+P.length)%P.length],b=P[(i+1)%P.length];return Math.abs((p.x-a.x)*(b.y-p.y)-(p.y-a.y)*(b.x-p.x))>1e-6});return o}
function faceInfo(f){var P=simplifyPoly(f.pts),xs=P.map(function(p){return p.x}),ys=P.map(function(p){return p.y}),
 bx=Math.min.apply(null,xs),by=Math.min.apply(null,ys),bw=Math.max.apply(null,xs)-bx,bh=Math.max.apply(null,ys)-by;
 var rect=P.length===4&&P.every(function(p,i){var q=P[(i+1)%4];return Math.abs(p.x-q.x)<1e-6||Math.abs(p.y-q.y)<1e-6});
 var cx=0,cy=0;P.forEach(function(p){cx+=p.x;cy+=p.y});return {area:f.area,pts:f.pts,rect:rect,w:bw,h:bh,bx:bx,by:by,cx:cx/P.length,cy:cy/P.length}}
/* Stage: v1.4 drawing tools - Room tool: rooms and areas found from closed walls */
function roomsInfo(){var F=faces().map(faceInfo);
 F.forEach(function(f){f.labels=[]});
 LABF={};S.labels.forEach(function(l){var best=null;F.forEach(function(f){if(inPoly(l.x,l.y,f.pts)&&(!best||f.area<best.area))best=f});LABF[l.id]=best;if(best)best.labels.push(l)});
 var SK={};S.segs.forEach(function(s){SK[Math.min(s.a,s.b)+"_"+Math.max(s.a,s.b)]=s});
 var total=0,carpet=0;F.forEach(function(f){total+=f.area;clearOf(f,SK);carpet+=f.carpet});
 var plinth=total,dbl=S.meta.dbl,anyExt=false;
 if(dbl&&F.length)S.segs.forEach(function(s){var a=pt(s.a),b=pt(s.b),L=segLen(s);if(L<1e-6)return;var n={x:-(b.y-a.y)/L,y:(b.x-a.x)/L},m={x:(a.x+b.x)/2,y:(a.y+b.y)/2},e=0.3;
  var i1=F.some(function(f){return inPoly(m.x+n.x*e,m.y+n.y*e,f.pts)}),i2=F.some(function(f){return inPoly(m.x-n.x*e,m.y-n.y*e,f.pts)});
  if(i1!==i2){plinth+=L*wallT(s)/2;anyExt=true}});
 if(anyExt)plinth+=4*Math.pow(S.meta.tout/24,2);
 return {faces:F,total:total,carpet:carpet,plinth:plinth}}
/* clear (inside, wall face to wall face) size of a room; rectangles exact, other shapes approximate */
function clearOf(f,SK){var dbl=S.meta.dbl,P=f.pts,n=P.length,side={l:0,r:0,t:0,b:0},per=0,sl=0,st=0;
 for(var i=0;i<n;i++){var p=P[i],q=P[(i+1)%n],s=SK[Math.min(p.id,q.id)+"_"+Math.max(p.id,q.id)],t=(dbl&&s)?wallT(s):0,L=Math.hypot(q.x-p.x,q.y-p.y);per+=L*t/2;sl+=L;st+=L*t;
  if(Math.abs(p.y-q.y)<1e-6){if(Math.abs(p.y-f.by)<1e-6)side.t=Math.max(side.t,t);else if(Math.abs(p.y-(f.by+f.h))<1e-6)side.b=Math.max(side.b,t)}
  else if(Math.abs(p.x-q.x)<1e-6){if(Math.abs(p.x-f.bx)<1e-6)side.l=Math.max(side.l,t);else if(Math.abs(p.x-(f.bx+f.w))<1e-6)side.r=Math.max(side.r,t)}}
 f.side=side;if(f.rect){f.cw=Math.max(f.w-(side.l+side.r)/2,0);f.ch=Math.max(f.h-(side.t+side.b)/2,0);f.carpet=f.cw*f.ch}
 else{var av=sl?st/sl:0;f.cw=Math.max(f.w-av,0);f.ch=Math.max(f.h-av,0);f.carpet=Math.max(f.area-per,0)}}
function faceAt(x,y,F){var best=null;(F||roomsInfo().faces).forEach(function(f){if(inPoly(x,y,f.pts)&&(!best||f.area<best.area))best=f});return best}
function sizeText(f){return (f.rect?"":"~")+fi(f.cw!=null?f.cw:f.w)+" x "+fi(f.ch!=null?f.ch:f.h)}
function ctrText(f){return fi(f.w)+" x "+fi(f.h)}

/* ================= rendering: drawing view ================= */
function w2s(x,y){return {x:x*V.s+V.ox,y:y*V.s+V.oy}}
function s2w(x,y){return {x:(x-V.ox)/V.s,y:(y-V.oy)/V.s}}
var RAF=0;function render(){if(!RAF)RAF=requestAnimationFrame(function(){RAF=0;paint()})}
/* Stage: Plan view - draws whatever the active tool produced (walls, openings, rooms, annotations) */
function paint(){if(!g)return;g.setTransform(DPR,0,0,DPR,0,0);g.fillStyle="#ffffff";g.fillRect(0,0,CW,CH);
 if(UI.clean){paintSheet();return}
 drawGrid();drawUnderlay();
 var RI=roomsInfo();
 if(visOn("rooms"))RI.faces.forEach(function(f,i){if(!f.labels.length)return;g.beginPath();f.pts.forEach(function(p,j){var q=w2s(p.x,p.y);j?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y)});g.closePath();g.fillStyle=FILLS[i%FILLS.length];g.globalAlpha=0.55;g.fill();g.globalAlpha=1});
 // staircase symbols
 (visOn("stairs")?stairsAll(RI):[]).forEach(function(G){function ln(P,col,w,dash){g.beginPath();P.forEach(function(p,i){var q=w2s(p.x,p.y);i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y)});g.strokeStyle=col;g.lineWidth=w;g.setLineDash(dash||[]);g.stroke();g.setLineDash([])}
  ln(G.box.concat([G.box[0]]),"#2f7a3b",1.6);G.treads.forEach(function(t){ln(t,"#2f7a3b",1.2)});ln(G.cut,"#2f7a3b",1.6);ln(G.arrow,"#14532d",2);
  g.beginPath();G.head.forEach(function(p,i){var q=w2s(p.x,p.y);i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y)});g.closePath();g.fillStyle="#14532d";g.fill();
  var u=w2s(G.up.x,G.up.y);pill(u.x,u.y,"UP",'#14532d','#fff',13)});
 // furniture
 if(visOn("furn"))(S.furn||[]).forEach(function(f){drawFurnCanvas(f,UI.tool==="furn"&&f.id===UI.fsel)});
 // walls (double line, filled, per-wall thickness)
 if(visOn("walls"))drawWallsCanvas();
 // openings: cut through the wall, door leaf + swing arc, window 3 lines
 if(visOn("doors"))S.ops.forEach(function(o){drawOpCanvas(o)});
 drawStructCanvas();
 // length labels
 var dblW=S.meta.dbl;if(visOn("walls")&&(visOn("dims")||UI.tool==="wall"))S.segs.forEach(function(s){var a=pt(s.a),b=pt(s.b);if(UI.tool==="wall"){var A=w2s(a.x,a.y),B=w2s(b.x,b.y);if(Math.hypot(B.x-A.x,B.y-A.y)>30)pill((A.x+B.x)/2,(A.y+B.y)/2,thTxt(wallIn(s)),thCol(wallIn(s)),"#fff",13);return}if(s.id===innerSelSeg())return;var I=segInner(s);lenLabel(I.a,I.b,fi(I.L),false,dblW?wallT(s)/2*V.s:0)});
 // points
 S.pts.forEach(function(p){var q=w2s(p.x,p.y);g.beginPath();g.arc(q.x,q.y,UI.tool==="move"?8:4,0,7);g.fillStyle=UI.tool==="move"?"#ffd58a":"#14253b";g.fill();if(UI.tool==="move"){g.strokeStyle="#14253b";g.lineWidth=1.5;g.stroke()}});
 // room labels
 if(visOn("rooms"))S.labels.forEach(function(l){var q=w2s(l.x,l.y),f=LABF[l.id];var lines=[l.name.toUpperCase()];if(f){lines.push(sizeText(f));lines.push(sq(f.carpet)+" sq.ft")}else lines.push("(not closed)");
  g.textAlign="center";g.textBaseline="middle";lines.forEach(function(t,i){g.font=(i?"600 14px":"bold 17px")+" Roboto,Arial,sans-serif";var y=q.y+(i-(lines.length-1)/2)*19;
   g.lineWidth=4;g.strokeStyle="rgba(255,255,255,.9)";g.strokeText(t,q.x,y);g.fillStyle=i?"#2b4466":"#0f2440";g.fillText(t,q.x,y)})});
 drawAnnoCanvas();drawSelCanvas();
 // chain point
 var cp=UI.chain&&pt(UI.chain);if(!cp&&UI.chainFree)cp=UI.chainFree;
 if(cp&&UI.tool==="draw"){var q=w2s(cp.x,cp.y);g.beginPath();g.arc(q.x,q.y,9,0,7);g.strokeStyle="#e8590c";g.lineWidth=2.5;g.stroke()}
 // marked end (size popup)
 if(UI.mark){var q=w2s(UI.mark.x,UI.mark.y);g.beginPath();g.arc(q.x,q.y,10,0,7);g.fillStyle="rgba(232,89,12,.35)";g.fill();g.strokeStyle="#e8590c";g.lineWidth=2;g.stroke()}
 // preview
 var pv=UI.preview;if(pv&&pv.length){pv.forEach(function(sg){var a=w2s(sg.a.x,sg.a.y),b=w2s(sg.b.x,sg.b.y);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.strokeStyle="#e8590c";g.lineWidth=4;g.lineCap="round";g.stroke()});
  pv.forEach(function(sg,i){var I=pvInner(pv,i);lenLabel(I.a,I.b,fi(I.L),true)});
  var e=pv[pv.length-1].b,q=w2s(e.x,e.y);
  if(e.snap){g.beginPath();if(e.snap==="pt")g.arc(q.x,q.y,10,0,7);else g.rect(q.x-8,q.y-8,16,16);g.strokeStyle="#1c7c43";g.lineWidth=2.5;g.stroke()}
  if(e.snap==="align"){var A=w2s(e.ax,e.ay);g.beginPath();g.moveTo(A.x,A.y);g.lineTo(q.x,q.y);g.strokeStyle="#1c7c43";g.setLineDash([5,4]);g.lineWidth=1;g.stroke();g.setLineDash([])}}
 if(UI.rawPath&&UI.rawPath.length>1){g.beginPath();UI.rawPath.forEach(function(p,i){var q=w2s(p.x,p.y);i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y)});g.strokeStyle="rgba(232,89,12,.25)";g.lineWidth=2;g.stroke()}
 scaleBar();updInfo(RI)}
function drawGrid(){if(!UI.grid)return;var a=s2w(0,0),b=s2w(CW,CH),minor=UI.grid===2?"#e3e9f1":"#f3f6fa",major=UI.grid===2?"#b7c5d8":"#e2e8f0";
 function lines(step,col,w){if(step*V.s<5)return;g.beginPath();for(var x=Math.floor(a.x/step)*step;x<=b.x;x+=step){var X=Math.round(x*V.s+V.ox)+0.5;g.moveTo(X,0);g.lineTo(X,CH)}
  for(var y=Math.floor(a.y/step)*step;y<=b.y;y+=step){var Y=Math.round(y*V.s+V.oy)+0.5;g.moveTo(0,Y);g.lineTo(CW,Y)}g.strokeStyle=col;g.lineWidth=w;g.stroke()}
 lines(1,minor,1);lines(5,major,1);if(V.s<5)lines(25,major,1)}
function pill(x,y,t,bg,fg,fs){g.font="bold "+fs+"px Roboto,Arial,sans-serif";var w=g.measureText(t).width+10,h=fs+6;g.fillStyle=bg;rr(x-w/2,y-h/2,w,h,5);g.fill();g.fillStyle=fg;g.textAlign="center";g.textBaseline="middle";g.fillText(t,x,y+0.5)}
function rr(x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
function lenLabel(a,b,t,live,xo){var A=w2s(a.x,a.y),B=w2s(b.x,b.y),dx=B.x-A.x,dy=B.y-A.y,L=Math.hypot(dx,dy);if(L<4)return;var ang=Math.atan2(dy,dx);if(ang>Math.PI/2+1e-6)ang-=Math.PI;if(ang<=-Math.PI/2+1e-6)ang+=Math.PI;
 var nx=Math.sin(ang),ny=-Math.cos(ang),fs=live?22:(L<50?13:16),off=(live?20:14)+(xo||0),mx=(A.x+B.x)/2+nx*off,my=(A.y+B.y)/2+ny*off;
 g.save();g.translate(mx,my);g.rotate(ang);g.font="bold "+fs+"px Roboto,Arial,sans-serif";var w=g.measureText(t).width+(live?16:8),h=fs+(live?10:4);
 g.fillStyle=live?"#e8590c":"rgba(255,255,255,.88)";rr(-w/2,-h/2,w,h,live?6:3);g.fill();g.fillStyle=live?"#ffffff":"#1d3f7a";g.textAlign="center";g.textBaseline="middle";g.fillText(t,0,0.5);g.restore()}
function scaleBar(){var cands=[1,2,5,10,20,50,100],st=1;for(var i=0;i<cands.length;i++){if(cands[i]*V.s>=50){st=cands[i];break}}var w=st*V.s,y=18;g.font="600 13px Roboto,Arial,sans-serif";var tw2=g.measureText(st+" ft  (1 grid = 1 ft)").width,bw=Math.max(w,tw2),x=CW-bw-16+(bw-w)/2;
 g.fillStyle="rgba(255,255,255,.85)";g.fillRect(CW-bw-24,y-12,bw+16,32);g.strokeStyle="#14253b";g.lineWidth=2;g.beginPath();g.moveTo(x,y);g.lineTo(x+w,y);g.moveTo(x,y-5);g.lineTo(x,y+5);g.moveTo(x+w,y-5);g.lineTo(x+w,y+5);g.stroke();
 g.font="600 13px Roboto,Arial,sans-serif";g.fillStyle="#14253b";g.textAlign="center";g.textBaseline="top";g.fillText(st+" ft  (1 grid = 1 ft)",x+w/2,y+3)}
function updInfo(RI){var n=RI.faces.length;$("info").innerHTML=S.segs.length?("Built-up <b>"+sq(RI.plinth)+"</b> sq.ft · carpet "+sq(RI.carpet)+(n?" · "+n+" room"+(n>1?"s":""):"")+" · "+S.segs.length+" walls"):"Blank sheet · draw with pen / finger";}

/* opening geometry in world feet */
function opWorld(o){var s=segById(o.seg);if(!s)return null;var a=pt(s.a),b=pt(s.b),L=segLen(s);if(L<1e-6)return null;var u={x:(b.x-a.x)/L,y:(b.y-a.y)/L},n={x:-u.y,y:u.x},w=Math.min(o.w,L),
 cl=clamp(o.t*L,w/2,L-w/2),c={x:a.x+u.x*cl,y:a.y+u.y*cl};return {s:s,u:u,n:n,c:c,w:w,L:L,p0:{x:c.x-u.x*w/2,y:c.y-u.y*w/2},p1:{x:c.x+u.x*w/2,y:c.y+u.y*w/2}}}

/* ---------- thick walls on the drawing canvas ---------- */
/* how far wall s must run past its end node pid so that corners / T-joins close cleanly */
function nodeExt(s,pid,only){var a=pt(s.a),b=pt(s.b),L=segLen(s);if(L<1e-6)return 0;var ux=(b.x-a.x)/L,uy=(b.y-a.y)/L,e=0,ts=wallT(s)/2;
 S.segs.forEach(function(q){if(q===s||(q.a!==pid&&q.b!==pid))return;if(only&&!only(q))return;var c=pt(q.a),d=pt(q.b),Lq=segLen(q);if(Lq<1e-6)return;
  var cr=Math.abs(((d.x-c.x)*uy-(d.y-c.y)*ux)/Lq),co=Math.abs(((d.x-c.x)*ux+(d.y-c.y)*uy)/Lq);if(cr<0.05)return;
  e=Math.max(e,Math.min(wallT(q)/2/cr+ts*co/cr,4*Math.max(wallT(q),wallT(s))))});return e}
function wallPoly(s){var a=pt(s.a),b=pt(s.b),L=segLen(s);if(L<1e-6)return null;var ux=(b.x-a.x)/L,uy=(b.y-a.y)/L,h=wallT(s)/2,nx=-uy*h,ny=ux*h,e0=nodeExt(s,s.a),e1=nodeExt(s,s.b);
 var A={x:a.x-ux*e0,y:a.y-uy*e0},B={x:b.x+ux*e1,y:b.y+uy*e1};return [{x:A.x+nx,y:A.y+ny},{x:B.x+nx,y:B.y+ny},{x:B.x-nx,y:B.y-ny},{x:A.x-nx,y:A.y-ny}]}
/* Stage: Filled corners - optional solid wall joins (S.meta.fillc, saved with the drawing). Only how joins are DRAWN changes:
   each wall is drawn to its node, and every node with 2+ walls gets a patch between neighbouring walls (mitred to where their
   faces meet; bevelled if the angle is very sharp). Wall geometry and all measurements are unchanged. */
function fillToggle(){snapshot();S.meta.fillc=!S.meta.fillc;changed();if(typeof updCtx==="function")updCtx();if(typeof buildRail==="function")buildRail();toast("Filled corners "+(S.meta.fillc?"ON":"OFF")+(S.meta.fillc&&!S.meta.dbl?" (shows with double-line walls)":""))}
function fillOn(){return !!(S&&S.meta&&S.meta.fillc&&S.meta.dbl)}
function wallPolyF(s){var a=pt(s.a),b=pt(s.b),L=segLen(s);if(L<1e-6)return null;var ux=(b.x-a.x)/L,uy=(b.y-a.y)/L,h=wallT(s)/2,nx=-uy*h,ny=ux*h;
 return [{x:a.x+nx,y:a.y+ny},{x:b.x+nx,y:b.y+ny},{x:b.x-nx,y:b.y-ny},{x:a.x-nx,y:a.y-ny}]}
function cornerPatches(only){var by={},out=[];S.segs.forEach(function(s){if(segLen(s)<1e-6)return;[s.a,s.b].forEach(function(p){(by[p]=by[p]||[]).push(s)})});
 Object.keys(by).forEach(function(pid){var W=by[pid];if(W.length<2)return;if(only&&!W.some(only))return;var N=pt(+pid);
  var A=W.map(function(s){var o=pt(s.a===+pid?s.b:s.a),L=Math.hypot(o.x-N.x,o.y-N.y),u={x:(o.x-N.x)/L,y:(o.y-N.y)/L};return {s:s,u:u,n:{x:-u.y,y:u.x},t:wallT(s)/2,ang:Math.atan2(u.y,u.x)}}).sort(function(p,q){return p.ang-q.ang});
  if(A.length===2&&Math.abs(A[0].u.x*A[1].u.y-A[0].u.y*A[1].u.x)<0.02&&A[0].u.x*A[1].u.x+A[0].u.y*A[1].u.y<0)return;
  for(var i=0;i<A.length;i++){var P=A[i],Q=A[(i+1)%A.length],gap=Q.ang-P.ang;if(gap<=1e-9)gap+=2*Math.PI;if(A.length===1)break;
   var Lp={x:N.x+P.n.x*P.t,y:N.y+P.n.y*P.t},Rq={x:N.x-Q.n.x*Q.t,y:N.y-Q.n.y*Q.t},poly=[{x:N.x,y:N.y},Lp];
   var den=P.u.x*Q.u.y-P.u.y*Q.u.x;if(Math.abs(den)>0.02&&Math.abs(gap-Math.PI)>0.02){var wx=Rq.x-Lp.x,wy=Rq.y-Lp.y,r=(wx*Q.u.y-wy*Q.u.x)/den,C={x:Lp.x+P.u.x*r,y:Lp.y+P.u.y*r};
    if(Math.hypot(C.x-N.x,C.y-N.y)<=4*Math.max(P.t,Q.t)+1e-6)poly.push(C)}
   poly.push(Rq);out.push({P:poly,s:P.t>=Q.t?P.s:Q.s,a:P.s,b:Q.s,N:N})}});return out}
/* Stage: Plan view - Wall tool output: filled double-line walls */
function drawWallsCanvas(){var sel=UI.selSeg||[];
 if(!S.meta.dbl){S.segs.forEach(function(s){var a=w2s(pt(s.a).x,pt(s.a).y),b=w2s(pt(s.b).x,pt(s.b).y);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);
  var on=sel.indexOf(s.id)>=0;g.strokeStyle=on?"#e8590c":(s.k==="I"?"#4f6d8f":"#14253b");g.lineWidth=on?5:(s.k==="I"?2.2:3.4);g.lineCap="round";g.stroke()});return}
 var FC=fillOn(),Q=[];S.segs.forEach(function(s){var P=FC?wallPolyF(s):wallPoly(s);if(P)Q.push({s:s,P:P.map(function(p){return w2s(p.x,p.y)})})});
 if(FC)cornerPatches().forEach(function(c){Q.push({s:c.s,P:c.P.map(function(p){return w2s(p.x,p.y)}),patch:1})});
 function path(P){g.beginPath();P.forEach(function(p,i){i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y)});g.closePath()}
 g.lineJoin="miter";g.setLineDash([]);
 Q.forEach(function(q){path(q.P);g.strokeStyle="#0b1a2e";g.lineWidth=UI.thin?1:2.6;g.stroke()});
 Q.forEach(function(q){path(q.P);var on=!q.patch&&sel.indexOf(q.s.id)>=0;g.fillStyle=on?"#f08c4a":(UI.tool==="wall"?thCol(wallIn(q.s)):"#5d6c80");g.fill()});
 // very thin on screen (zoomed out): keep a visible centre line
 if(V.s*S.meta.tin/12<3)Q.forEach(function(q){var a=w2s(pt(q.s.a).x,pt(q.s.a).y),b=w2s(pt(q.s.b).x,pt(q.s.b).y);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.strokeStyle="#0b1a2e";g.lineWidth=2;g.stroke()})}
/* one door / window / ventilator in architectural plan style */
/* Stage: Plan view - Door / Window / Opening tool output: wall cut, leaf, swing arc */
function drawOpCanvas(o){var G=opWorld(o);if(!G)return;var dbl=S.meta.dbl,T=dbl?wallT(G.s):0.3,u=G.u,n=G.n,c=G.c,w=G.w,col=opCol(o),px=1/V.s;
 function P(al,ac){return w2s(c.x+u.x*al+n.x*ac,c.y+u.y*al+n.y*ac)}
 function ln(pts,lw,cl,dash){g.beginPath();pts.forEach(function(p,i){i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y)});g.strokeStyle=cl;g.lineWidth=lw;g.lineCap="butt";g.setLineDash(dash||[]);g.stroke();g.setLineDash([])}
 var e=T/2+2*px,cut=[P(-w/2,-e),P(w/2,-e),P(w/2,e),P(-w/2,e)];g.beginPath();cut.forEach(function(p,i){i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y)});g.closePath();g.fillStyle="#ffffff";g.fill();
 if(dbl){ln([P(-w/2,-T/2),P(-w/2,T/2)],2.6,"#0b1a2e");ln([P(w/2,-T/2),P(w/2,T/2)],2.6,"#0b1a2e")}
 var lw=o.dk==="MD"?3:2.2;
 if(o.type==="W"){[-T/2,0,T/2].forEach(function(v,i){ln([P(-w/2,v),P(w/2,v)],i===1?1.4:1.8,col)})}
 else if(o.type==="V"){[-T/2,0,T/2].forEach(function(v,i){ln([P(-w/2,v),P(w/2,v)],1.3,col,i===1?[4,3]:null)})}
 else if(o.dk==="OP"){[-T/2,T/2].forEach(function(v){ln([P(-w/2,v),P(w/2,v)],1.3,col,[6,4])})}
 else{var sd=o.flip?-1:1,h=o.hinge?w/2:-w/2,ee=-h,v0=sd*T/2;ln([P(h,v0),P(h,v0+sd*w)],lw+0.6,col);var arc=[];for(var i=0;i<=24;i++){var th=i/24*Math.PI/2;arc.push(P(h+(ee-h)*Math.cos(th),v0+sd*w*Math.sin(th)))}ln(arc,1.3,col)}
 var cc=w2s(c.x,c.y),p1=w2s(G.p1.x,G.p1.y),p0=w2s(G.p0.x,G.p0.y),an=Math.atan2(p1.y-p0.y,p1.x-p0.x);if(an>Math.PI/2+1e-6)an-=Math.PI;if(an<=-Math.PI/2+1e-6)an+=Math.PI;
 var sg=o.type==="D"?-(o.flip?-1:1):1,dn=(T/2)*V.s+16;var nn=w2s(c.x+n.x,c.y+n.y),ndx=(nn.x-cc.x)/V.s,ndy=(nn.y-cc.y)/V.s;
 pill(cc.x+ndx*sg*dn,cc.y+ndy*sg*dn,opKind(o)+" "+fi(o.w),col,"#fff",12)}

/* ================= clean plan sheet (A3, mm) ================= */
/* buildSheet(), page 2 and the title block live in sheet.js (v1.2) */
/* door & window schedule (grouped by type, size, sill) */
function openSched(d,x,y,w,G){var grp={},ord=[];G.forEach(function(q){var o=q.o,k=opKind(o)+"|"+fi(o.w)+"|"+fi(opH(o))+"|"+fi(opSill(o));if(!grp[k]){grp[k]={o:o,m:[]};ord.push(k)}grp[k].m.push(o._mark)});
 ord.sort(function(a,b){return OK5.indexOf(a.split("|")[0])-OK5.indexOf(b.split("|")[0])});
 var rh=4.4,h=7+rh*(ord.length+1)+3;d.rect(x,y,w,h,{w:0.35});d.rect(x,y,w,7,{w:0.35,fill:"#16365c",c:"#16365c"});d.text(x+w/2,y+4.9,"DOOR & WINDOW SCHEDULE",3.1,{a:"middle",bold:true,c:"#ffffff"});
 var cx=[x+2,x+24,x+52,x+74,x+93],yy=y+7+rh-0.9,s=2.3;["Mark","Size W x H","Sill","Lintel","Nos"].forEach(function(t,i){d.text(cx[i],yy,t,s,{bold:true})});d.line(x,yy+1.2,x+w,yy+1.2,{w:0.15});
 ord.forEach(function(k){var g2=grp[k],o=g2.o;yy+=rh;var mk=g2.m.length>2?g2.m[0]+"-"+g2.m[g2.m.length-1]:g2.m.join(",");
  d.text(cx[0],yy,mk,s,{bold:true,c:opCol(o)});d.text(cx[1],yy,fi(o.w)+" x "+fi(opH(o)),s);d.text(cx[2],yy,o.type==="D"?"FFL":lvl(opSill(o)),s);d.text(cx[3],yy,lvl(opSill(o)+opH(o)),s);d.text(cx[4],yy,String(g2.m.length),s,{bold:true})});
 return y+h}
/* typical wall section through a window: FFL, sill, lintel, roof levels */
function wallSection(d,x,y,w,G){var q=G.find(function(z){return z.o.type==="W"})||G.find(function(z){return z.o.type!=="D"}),o=q.o,H=wallH(),sl=opSill(o),ln=sl+opH(o),h=44;
 d.rect(x,y,w,h,{w:0.35});d.text(x+w/2,y+4.6,"TYPICAL SECTION AT "+o._mark+" (not to scale)",2.6,{a:"middle",bold:true});
 var top=y+8,bot=y+h-6,sc=(bot-top)/(H+1.5),Y=function(v){return bot-(v+1.5)*sc},wx=x+30,ww=4.5;
 d.line(x+4,Y(-1.5),x+w-4,Y(-1.5),{w:0.25,c:"#555555"});d.text(x+w-4,Y(-1.5)+3,"GL",2,{a:"end",c:"#555555"});
 d.rect(wx-8,Y(0),ww+16,Y(-1.5)-Y(0),{w:0.25,fill:"#cfc7bb"});d.rect(wx-12,Y(H+0.5),ww+24,Y(H)-Y(H+0.5),{w:0.25,fill:"#bdbdbd"});
 d.rect(wx,Y(sl),ww,Y(0)-Y(sl),{w:0.3,fill:"#8a8f98"});d.rect(wx,Y(H),ww,Y(ln)-Y(H),{w:0.3,fill:"#8a8f98"});
 d.rect(wx-0.6,Y(ln)-0.1,ww+6,Y(ln)-Y(ln+0.5)+0.1,{w:0.3,fill:"#a6a6a6"});
 d.line(wx+ww/2,Y(sl),wx+ww/2,Y(ln),{w:0.5,c:"#1f5fa8"});d.line(wx+ww/2-1.2,Y(sl),wx+ww/2-1.2,Y(ln),{w:0.2,c:"#1f5fa8"});
 [[0,"FFL +0'-0\""],[sl,"SILL "+lvl(sl)],[ln,"LINTEL "+lvl(ln)],[H,"ROOF "+lvl(H)]].forEach(function(L,i){var yy=Y(L[0]);d.line(wx+ww+1,yy,x+w-30,yy,{w:0.15,c:"#1d3f7a",dash:[1,0.8]});
  d.poly([[x+w-30,yy],[x+w-31.6,yy-1.6],[x+w-28.4,yy-1.6]],{w:0.1,fill:"#1d3f7a",c:"#1d3f7a"});d.text(x+w-27,yy+0.9,L[1],2.3,{bold:i===1||i===2,c:"#1d3f7a"})});
 d.text(x+4,Y(sl/2)+1,o.type==="W"?"Window":"Ventilator",2.1,{c:"#1f5fa8"});d.text(x+4,Y(sl/2)+4,fi(o.w)+" x "+fi(opH(o)),2.1,{c:"#1f5fa8"})}
/* render a Dwg onto a 2D canvas (page mm -> px) */
function drawDwg(c2,d,s,ox,oy){c2.lineCap="butt";c2.lineJoin="miter";
 d.p.forEach(function(p){if(p.t==="img"){var im=logoImg();if(im&&im.complete&&im.naturalWidth)c2.drawImage(im,ox+p.x*s,oy+p.y*s,p.w*s,p.h*s);return}if(p.t==="text"){c2.save();c2.translate(ox+p.x*s,oy+p.y*s);if(p.rot)c2.rotate(-p.rot*Math.PI/180);c2.font=(p.bold?"bold ":"")+(p.s*s).toFixed(2)+"px Helvetica,Arial,sans-serif";
   c2.textAlign=p.a==="middle"?"center":(p.a==="end"?"right":"left");c2.textBaseline="alphabetic";c2.fillStyle=p.c;c2.fillText(p.str,0,0);c2.restore();return}
  c2.beginPath();if(p.t==="line"){c2.moveTo(ox+p.x1*s,oy+p.y1*s);c2.lineTo(ox+p.x2*s,oy+p.y2*s)}else{p.pts.forEach(function(q,i){i?c2.lineTo(ox+q[0]*s,oy+q[1]*s):c2.moveTo(ox+q[0]*s,oy+q[1]*s)});if(p.closed)c2.closePath()}
  if(p.t==="poly"&&p.fill){c2.fillStyle=p.fill;c2.fill()}
  if(p.t==="line"||p.w>0){c2.setLineDash(p.dash?p.dash.map(function(v){return v*s}):[]);c2.lineWidth=Math.max(p.w*s,0.6);c2.strokeStyle=p.c;c2.stroke();c2.setLineDash([])}})}
var SHEET=null;
function paintSheet(){if(!SHEET)SHEET=buildSheet();var DD=UI.page===2?SHEET.d2:SHEET.d;g.fillStyle="#d9dee5";g.fillRect(0,0,CW,CH);g.fillStyle="#ffffff";g.shadowColor="rgba(0,0,0,.25)";g.shadowBlur=10;g.fillRect(SV.ox,SV.oy,420*SV.s,297*SV.s);g.shadowBlur=0;
 drawDwg(g,DD,SV.s,SV.ox,SV.oy);$("info").innerHTML=(UI.page===2?"Sheet 2: Door &amp; Window details":"Sheet 1: Plan")+" · Built-up <b>"+sq(SHEET.RI.plinth)+"</b> sq.ft · pinch to zoom"}
function fitSheet(){var s=Math.min((CW-16)/420,(CH-16)/297);SV.s=s;SV.ox=(CW-420*s)/2;SV.oy=(CH-297*s)/2}

/* ================= history + storage ================= */
function snapshot(){UNDO.push(JSON.stringify(S));if(UNDO.length>200)UNDO.shift();REDO=[]}
function changed(){SHEET=null;DIRTY=true;render();updButtons();clearTimeout(SAVET);SAVET=setTimeout(autosave,400)}
function undo(){if(!UNDO.length)return;REDO.push(JSON.stringify(S));S=docify(JSON.parse(UNDO.pop()));UI.chain=null;UI.chainFree=null;changed();toast("Undo")}
function redo(){if(!REDO.length)return;UNDO.push(JSON.stringify(S));S=docify(JSON.parse(REDO.pop()));UI.chain=null;UI.chainFree=null;changed();toast("Redo")}
var LABF={};
var LS={get:function(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){toast("Storage full - could not save");return false}}};
function idxList(){return LS.get("jksp_index",[])}
function autosave(){if(!DIRTY)return;DIRTY=false;var empty=!S.L.some(function(L){return L.segs.length||L.labels.length});var L=idxList(),i=L.findIndex(function(e){return e.id===CURID});
 if(empty&&i<0)return;
 if(!CURID)CURID="d"+Date.now().toString(36);if(!S.meta.name)S.meta.name=defaultName();
 var RI=plinthAll(),e={id:CURID,name:S.meta.name,owner:S.meta.owner,updated:Date.now(),area:RI.plinth,walls:S.L.reduce(function(a,L){return a+L.segs.length},0),levels:S.L.length};
 if(i>=0)L[i]=e;else L.unshift(e);L.sort(function(a,b){return b.updated-a.updated});
 var data=JSON.parse(JSON.stringify(S));
 LS.set("jksp_d_"+CURID,data);LS.set("jksp_index",L);LS.set("jksp_last",{id:CURID,t:Date.now()});updTitle()}
function defaultName(){var d=new Date();return "Plan "+d.getDate()+"-"+(d.getMonth()+1)+"-"+d.getFullYear()+" "+String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0")}
function openDrawing(id){autosave();var data=LS.get("jksp_d_"+id,null);if(!data){toast("Not found");return}S=data;S.meta=Object.assign(blank().meta,S.meta||{});S=docify(S);S.furn=S.furn||[];CURID=id;UNDO=[];REDO=[];UI.chain=null;UI.chainFree=null;UI.clean=false;
 LS.set("jksp_last",{id:id,t:Date.now()});setClean(false);fitAll();changed();DIRTY=false;updTitle()}
function newDrawing(){autosave();S=blank();CURID=null;UNDO=[];REDO=[];UI.chain=null;UI.chainFree=null;setClean(false);homeView();changed();DIRTY=false;updTitle();setTool("draw")}
function updTitle(){$("dname").textContent=(S.meta.name||"New drawing")+(S.meta.owner?" · "+S.meta.owner:"")}

/* ================= view ================= */
function resize(){var r=$("stage").getBoundingClientRect();DPR=window.devicePixelRatio||1;CW=Math.max(1,r.width);CH=Math.max(1,r.height);cv.width=Math.round(CW*DPR);cv.height=Math.round(CH*DPR);if(UI.clean)fitSheet();render()}
function homeView(){V.s=clamp(Math.min(CW,CH)/30,12,30);V.ox=Math.round(V.s*2);V.oy=Math.round(V.s*2)}
function fitAll(){if(UI.clean){fitSheet();render();return}var PTS=S.pts.length?S.pts:(S.cur>0?S.L[S.cur-1].pts:[]);if(!PTS.length){homeView();render();return}var mx=Infinity,my=Infinity,Mx=-Infinity,My=-Infinity;
 PTS.concat(S.labels).forEach(function(p){mx=Math.min(mx,p.x);my=Math.min(my,p.y);Mx=Math.max(Mx,p.x);My=Math.max(My,p.y)});
 var w=Math.max(Mx-mx,4),h=Math.max(My-my,4),pad=56,tp=UI.noopt?0:36;V.s=clamp(Math.min((CW-2*pad)/w,(CH-2*pad-tp)/h),2,200);V.ox=CW/2-(mx+Mx)/2*V.s;V.oy=(CH+tp)/2-(my+My)/2*V.s;render()}
function zoomAt(x,y,f){if(UI.clean){var ns=clamp(SV.s*f,0.3,40);SV.ox=x-(x-SV.ox)*ns/SV.s;SV.oy=y-(y-SV.oy)*ns/SV.s;SV.s=ns}else{var n2=clamp(V.s*f,2,200);V.ox=x-(x-V.ox)*n2/V.s;V.oy=y-(y-V.oy)*n2/V.s;V.s=n2}render()}
function panBy(dx,dy){var o=UI.clean?SV:V;o.ox+=dx;o.oy+=dy;render()}

/* ================= pointer input ================= */
var PT={},GS=null;
function lp(e){var r=cv.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top}}
function touchIds(){return Object.keys(PT).filter(function(k){return PT[k].type==="touch"})}
function canEdit(e){if(UI.clean)return false;if(e.pointerType==="pen")return true;if(e.pointerType==="mouse")return e.button===0;return !UI.penOnly}
function onDown(e){e.preventDefault();var p=lp(e);try{cv.setPointerCapture(e.pointerId)}catch(_){}
 if(e.pointerType==="pen"&&!UI.penSeen){UI.penSeen=true;if(!UI.penOnly){UI.penOnly=true;toast("Pen detected: Pen-only drawing ON. Fingers now pan / zoom. (பேனா மட்டும்)");updCtx()}}
 PT[e.pointerId]={x:p.x,y:p.y,type:e.pointerType};
 var T=touchIds();
 if(e.pointerType==="touch"&&T.length>=2){if(GS&&GS.kind==="stroke"&&GS.ptype==="pen")return;cancelGesture();var a=PT[T[0]],b=PT[T[1]],o=UI.clean?SV:V;
  GS={kind:"pinch",a:T[0],b:T[1],d0:Math.hypot(a.x-b.x,a.y-b.y)||1,s0:o.s,mx:(a.x+b.x)/2,my:(a.y+b.y)/2,ox0:o.ox,oy0:o.oy};return}
 if(GS&&GS.kind==="stroke")return; /* palm / extra pointer while drawing */
 if(e.pointerType==="mouse"&&e.button!==0){GS={kind:"pan",id:e.pointerId,lx:p.x,ly:p.y};return}
 if(!canEdit(e)){GS={kind:"pan",id:e.pointerId,lx:p.x,ly:p.y};return}
 var w=s2w(p.x,p.y);GS={kind:"press",id:e.pointerId,ptype:e.pointerType,sx:p.x,sy:p.y,lx:p.x,ly:p.y,t0:Date.now(),moved:false};
 var R=snapR();
 if(toolDown(w,GS))return;
 if(UI.tool==="draw"){var st=strokeStart(w,R);GS.kind="stroke";GS.start=st;GS.path=[{x:st.x,y:st.y},w];UI.rawPath=null;UI.preview=null}
 else if(UI.tool==="furn"){var ff=furnAt(w.x,w.y);if(ff){GS.kind="dragfurn";GS.fid=ff.id;GS.dx=ff.x-w.x;GS.dy=ff.y-w.y;GS.snap=false;UI.fsel=ff.id;updCtx();render()}}
 else if(UI.tool==="move"){var q=findPoint(w.x,w.y,R*1.3);if(q){GS.kind="dragpt";GS.pid=q.id;GS.snap=false}else{var L=findLabel(w.x,w.y,R*1.6);if(L){GS.kind="draglab";GS.lab=L.id;GS.snap=false}}}
}
function strokeStart(w,R){var q=findPoint(w.x,w.y,R*1.3);if(q)return {x:q.x,y:q.y,pid:q.id};
 var sg=findSeg(w.x,w.y,R);if(sg)return {x:sg.x,y:sg.y,onSeg:sg.seg};
 var c=UI.chainOn&&UI.chain&&pt(UI.chain);if(c&&Math.hypot(c.x-w.x,c.y-w.y)*V.s<90)return {x:c.x,y:c.y,pid:c.id};
 var f=UI.chainOn&&UI.chainFree;if(f&&Math.hypot(f.x-w.x,f.y-w.y)*V.s<90)return {x:f.x,y:f.y};
 return {x:gsnap(w.x),y:gsnap(w.y)}}
function onMove(e){if(!PT[e.pointerId])return;e.preventDefault();var p=lp(e);PT[e.pointerId].x=p.x;PT[e.pointerId].y=p.y;if(!GS)return;
 if(GS.kind==="pinch"){var a=PT[GS.a],b=PT[GS.b];if(!a||!b)return;var d=Math.hypot(a.x-b.x,a.y-b.y),o=UI.clean?SV:V,mn=UI.clean?0.3:2,mx=UI.clean?40:200,ns=clamp(GS.s0*d/GS.d0,mn,mx),cx=(a.x+b.x)/2,cy=(a.y+b.y)/2;
  var wx=(GS.mx-GS.ox0)/GS.s0,wy=(GS.my-GS.oy0)/GS.s0;o.s=ns;o.ox=cx-wx*ns;o.oy=cy-wy*ns;render();return}
 if(e.pointerId!==GS.id)return;
 if(GS.kind==="pan"){panBy(p.x-GS.lx,p.y-GS.ly);GS.lx=p.x;GS.ly=p.y;return}
 if(Math.hypot(p.x-GS.sx,p.y-GS.sy)>7)GS.moved=true;
 var w=s2w(p.x,p.y);
 if(toolMove(w,GS,p))return;
 if(GS.kind==="stroke"){var last=GS.path[GS.path.length-1];if(Math.hypot(w.x-last.x,w.y-last.y)*V.s>2)GS.path.push(w);
  if(GS.moved){UI.rawPath=GS.path;UI.preview=buildPreview(GS.start,GS.path);var pv=UI.preview;showHud(pv.length?fi(pvInner(pv,pv.length-1).L):"0'-0\"");render()}return}
 if(GS.kind==="dragpt"&&GS.moved){if(!GS.snap){snapshot();GS.snap=true}var P=pt(GS.pid),q=findPoint(w.x,w.y,snapR(),GS.pid);P.x=q?q.x:gsnap(w.x);P.y=q?q.y:gsnap(w.y);SHEET=null;render();return}
 if(GS.kind==="dragfurn"&&GS.moved){if(!GS.snap){snapshot();GS.snap=true}var F2=furnSel();if(F2){F2.x=Math.round((w.x+GS.dx)*4)/4;F2.y=Math.round((w.y+GS.dy)*4)/4;snapFurn(F2,false);SHEET=null;render()}return}
 if(GS.kind==="draglab"&&GS.moved){if(!GS.snap){snapshot();GS.snap=true}var L=S.labels.find(function(l){return l.id===GS.lab});L.x=w.x;L.y=w.y;render();return}
 if(GS.kind==="press"&&GS.moved){GS.kind="pan";GS.lx=p.x;GS.ly=p.y}}
function onUp(e){UI.lastUp=Date.now();var rec=PT[e.pointerId];delete PT[e.pointerId];if(!GS||!rec)return;
 if(GS.kind==="pinch"){if(e.pointerId===GS.a||e.pointerId===GS.b){var rest=touchIds();GS=rest.length?{kind:"pan",id:+rest[0],lx:PT[rest[0]].x,ly:PT[rest[0]].y}:null}return}
 if(e.pointerId!==GS.id)return;var G=GS;GS=null;hideHud();
 if(e.type==="pointercancel"){UI.preview=null;UI.rawPath=null;render();return}
 var w=s2w(rec.x,rec.y);
 if(toolUp(G,w))return;
 if(G.kind==="stroke"){var pv=G.moved?buildPreview(G.start,G.path):null;UI.preview=null;UI.rawPath=null;if(pv&&pv.length)commitStroke(G.start,pv);else if(!G.moved)tapDraw(w);render();return}
 if(G.kind==="dragpt"){if(G.snap){planarize();changed()}else tapTool(w);return}
 if(G.kind==="dragfurn"){if(G.snap)changed();return}
 if(G.kind==="draglab"){if(G.snap)changed();else tapTool(w);return}
 if(G.kind==="press"&&!G.moved)tapTool(w)}
function cancelGesture(){if(GS&&GS.kind==="stroke"){UI.preview=null;UI.rawPath=null;hideHud();render()}if(GS&&(GS.kind==="dragpt"||GS.kind==="draglab")&&GS.snap){planarize();changed()}GS=null}
function showHud(t){var h=$("hud");h.textContent=t;h.style.display="block"}
function hideHud(){$("hud").style.display="none"}

/* ---------- drawing commits ---------- */
function commitStroke(start,pv){snapshot();var aId=ensurePoint(start),first=aId;
 if(!UI.chain||UI.chain!==aId)UI.runStart=aId;
 pv.forEach(function(sg){var bId=ensurePoint(sg.b);addSeg(aId,bId,UI.kind);aId=bId});
 UI.chain=aId;UI.chainFree=null;planarize();
 if(UI.runStart&&UI.chain===UI.runStart&&pv.length){UI.chain=null;toast("Outline closed")}
 changed()}
function tapDraw(w){var R=snapR(),q=findPoint(w.x,w.y,R*1.3);
 if(q){UI.chain=q.id;UI.chainFree=null;UI.runStart=q.id;toast("Start from this point");render();return}
 var c=UI.chain&&pt(UI.chain),f=UI.chainFree;
 if(c||f){var from=c?{x:c.x,y:c.y,pid:c.id}:{x:f.x,y:f.y},r=snapStep(from,w,true);if(r.len>=0.25){commitStroke(from,[{a:from,b:r}]);return}}
 UI.chain=null;UI.chainFree={x:gsnap(w.x),y:gsnap(w.y)};toast("Start point set - tap or drag to draw");render()}
function autoClose(){var c=UI.chain&&pt(UI.chain),s=UI.runStart&&pt(UI.runStart);if(!c||!s||c.id===s.id){toast("Nothing to close - draw an outline first");return}
 snapshot();addSeg(c.id,s.id,UI.kind);var ortho=Math.abs(c.x-s.x)<1e-6||Math.abs(c.y-s.y)<1e-6;planarize();UI.chain=null;changed();toast(ortho?"Outline closed":"Closed with a sloped line - set sizes with Size tool")}
function newLine(){UI.chain=null;UI.chainFree=null;UI.runStart=null;render();toast("New line: start anywhere")}

/* ---------- tool taps ---------- */
function findLabel(x,y,r){var best=null,bd=r;S.labels.forEach(function(l){var d=Math.hypot(l.x-x,l.y-y);if(d<bd){bd=d;best=l}});return best}
function findOp(x,y,r){var best=null,bd=r;S.ops.forEach(function(o){var G=opWorld(o);if(!G)return;var q=projSeg(x,y,G.p0,G.p1);if(q.d<bd){bd=q.d;best=o}});return best}
function nearSeg(x,y,r){var best=null,bd=r;S.segs.forEach(function(s){var q=projSeg(x,y,pt(s.a),pt(s.b));if(q.d<bd){bd=q.d;best={s:s,t:q.tc}}});return best}
function tapTool(w){var R=snapR()*1.4;if(toolTap(w))return;
 if(UI.tool==="size"){var n=nearSeg(w.x,w.y,R);if(n)sizePopup(n.s);else toast("Tap on a wall line to type its size");return}
 if(UI.tool==="room"){var L=findLabel(w.x,w.y,R);roomPopup(L?L.x:w.x,L?L.y:w.y,L);return}
 if(UI.tool==="open"){var o=findOp(w.x,w.y,R);if(o){opPopup(o);return}var n2=nearSeg(w.x,w.y,R);if(n2)opPopup(null,n2.s,n2.t);else toast("Tap on a wall to add a door / window");return}
 if(UI.tool==="furn"){var fz=furnAt(w.x,w.y);if(fz){UI.fsel=fz.id;updCtx();render()}else{UI.fsel=null;updCtx();furnPopup(w.x,w.y)}return}
 if(UI.tool==="del"){var fz2=furnAt(w.x,w.y);var o2=findOp(w.x,w.y,R);if(fz2&&!o2){snapshot();S.furn=S.furn.filter(function(x){return x!==fz2});changed();toast(FURN[fz2.type].n+" deleted");return}if(o2){snapshot();S.ops=S.ops.filter(function(x){return x!==o2});changed();toast("Opening deleted");return}
  var L2=findLabel(w.x,w.y,R*1.2);if(L2){snapshot();S.labels=S.labels.filter(function(x){return x!==L2});changed();toast("Label deleted");return}
  var n3=nearSeg(w.x,w.y,R);if(n3){snapshot();dropOps(n3.s.id);S.segs=S.segs.filter(function(x){return x!==n3.s});cleanup();changed();toast("Wall deleted")}return}
 if(UI.tool==="wall"){var n5=nearSeg(w.x,w.y,R*1.2);if(n5)thickPopup(n5.s);else toast("Tap on a wall to set its thickness");return}
 if(UI.tool==="move"){var n4=nearSeg(w.x,w.y,R);if(n4)segPopup(n4.s);return}}

/* ================= popups ================= */
function $(id){return document.getElementById(id)}
function modal(html,onShow){UI.modalT=(Date.now()-(UI.lastUp||0)<150)?Date.now():0;$("mbox").innerHTML=html;$("modal").classList.add("show");if(onShow)onShow($("mbox"))}
function closeModal(){$("modal").classList.remove("show");$("mbox").innerHTML="";UI.selSeg=null;UI.mark=null;render()}
function toast(t){var el=$("toast");el.textContent=t;el.style.display="block";clearTimeout(toast.t);toast.t=setTimeout(function(){el.style.display="none"},2200)}
function escH(s){return esc(String(s)).replace(/"/g,"&quot;")}
/* big ft / inch keypad; cb(feet) */
function keypadHTML(){return '<div class="lenf"><div class="lf on" id="kf"></div><span>ft</span><div class="lf" id="ki"></div><span>in</span></div><div class="kp">'+
 ["7","8","9","4","5","6","1","2","3",".","0","⌫"].map(function(k){return '<button data-k="'+k+'">'+k+'</button>'}).join("")+'</div>'}
function bindKeypad(box,L){var t=Math.round(L*12),st={f:String(Math.floor(t/12)),i:String(t%12),cur:"f",fresh:true};
 function show(){box.querySelector("#kf").textContent=st.f||"0";box.querySelector("#ki").textContent=st.i||"0";box.querySelector("#kf").classList.toggle("on",st.cur==="f");box.querySelector("#ki").classList.toggle("on",st.cur==="i")}
 box.querySelector("#kf").onclick=function(){st.cur="f";st.fresh=true;show()};box.querySelector("#ki").onclick=function(){st.cur="i";st.fresh=true;show()};
 box.querySelectorAll(".kp button").forEach(function(b){b.onclick=function(){var k=b.dataset.k,v=st[st.cur];if(st.fresh&&k!=="⌫"){v="";st.fresh=false;if(st.cur==="f")st.i="0"}
  if(k==="⌫"){v=v.slice(0,-1);st.fresh=false}else if(k==="."){if(v.indexOf(".")<0)v=(v||"0")+"."}else if(v.length<6)v=(v==="0"?"":v)+k;st[st.cur]=v;show()}});
 show();return function(){var f=parseFloat(st.f)||0,i=parseFloat(st.i)||0;return f+i/12}}
function sizePopup(s){var run=wallRun(s),L=segLen(s),useRun=run.ids.length>1&&Math.abs(run.len-L)>0.01,IS=segInner(s),IR=runInner(run);
 var st={full:false,flip:false};
 function ends(){var a=st.full?pt(run.a):pt(s.a),b=st.full?pt(run.b):pt(s.b),horiz=Math.abs(b.x-a.x)>=Math.abs(b.y-a.y),bMoves=horiz?b.x>=a.x:b.y>=a.y;if(st.flip)bMoves=!bMoves;return bMoves?{anc:a,mov:b,horiz:horiz}:{anc:b,mov:a,horiz:horiz}}
 function dirTxt(){var E=ends(),dx=E.mov.x-E.anc.x,dy=E.mov.y-E.anc.y;return Math.abs(dx)>=Math.abs(dy)?(dx>=0?"→ right end moves":"← left end moves"):(dy>=0?"↓ bottom end moves":"↑ top end moves")}
 function mark(){UI.selSeg=st.full?run.ids:[s.id];var E=ends();UI.mark={x:E.mov.x,y:E.mov.y};render()}
 modal('<div class="mt">Wall size / சுவர் அளவு</div><div class="ms" id="szNow"></div>'+
  (useRun?'<div class="row"><button class="bb on" id="szPart">This part<small>'+fi(IS.L)+'</small></button><button class="bb" id="szFull">Full wall<small>'+fi(IR.L)+'</small></button></div>':'')+
  keypadHTML()+'<div class="row"><button class="bb" id="szDir"></button></div><div class="row"><button class="bb" id="szCancel">Cancel</button><button class="bb ok" id="szOk">OK</button></div>',function(box){
  var get=bindKeypad(box,IS.L);
  function upd(){var I=st.full?IR:IS;$("szNow").textContent="Inner (clear) now: "+fi(I.L)+"  ·  c/c "+fi(I.cc)+"  ·  type the real inner size (feet + inches). Other walls stay attached.";$("szDir").innerHTML=dirTxt()+"<small>tap to change which end moves</small>";mark()}
  if(useRun){$("szPart").onclick=function(){st.full=false;$("szPart").classList.add("on");$("szFull").classList.remove("on");upd()};$("szFull").onclick=function(){st.full=true;$("szFull").classList.add("on");$("szPart").classList.remove("on");upd()}}
  $("szDir").onclick=function(){st.flip=!st.flip;upd()};$("szCancel").onclick=closeModal;
  $("szOk").onclick=function(){var v=get();if(!(v>0.05)){toast("Enter a length");return}var E=ends(),I=st.full?IR:IS;closeModal();setLength(E.anc,E.mov,v+I.ca+I.cb);toast("Inner (clear) set to "+fi(v)+" · c/c "+fi(v+I.ca+I.cb))};upd()})}
/* stretch: anchor stays, moving end and everything beyond it (same connected drawing) shifts along the wall direction */
function setLength(anc,mov,Lnew){var dx=mov.x-anc.x,dy=mov.y-anc.y,cur=Math.hypot(dx,dy);if(cur<1e-6)return;var ux=dx/cur,uy=dy/cur,dl=Lnew-cur;
 snapshot();var comp=component(mov.id),moved=[];
 S.pts.forEach(function(p){if(!comp[p.id])return;var pr=(p.x-anc.x)*ux+(p.y-anc.y)*uy;if(pr>=cur-0.01){moved.push(p)}});
 var bx=Infinity,By=Infinity,Bx=-Infinity,BY=-Infinity;Object.keys(comp).forEach(function(id){var p=pt(+id);bx=Math.min(bx,p.x);By=Math.min(By,p.y);Bx=Math.max(Bx,p.x);BY=Math.max(BY,p.y)});
 S.labels.forEach(function(l){if(l.x<bx-0.5||l.x>Bx+0.5||l.y<By-0.5||l.y>BY+0.5)return;var pr=(l.x-anc.x)*ux+(l.y-anc.y)*uy;if(pr>=cur-0.01){l.x+=ux*dl;l.y+=uy*dl}else if(pr>0){l.x+=ux*pr*(Lnew/cur-1);l.y+=uy*pr*(Lnew/cur-1)}});
 (S.furn||[]).forEach(function(f){if(f.x<bx-1||f.x>Bx+1||f.y<By-1||f.y>BY+1)return;var pr=(f.x-anc.x)*ux+(f.y-anc.y)*uy;if(pr>=cur-0.01){f.x+=ux*dl;f.y+=uy*dl}});
 moved.forEach(function(p){p.x+=ux*dl;p.y+=uy*dl;if(Math.abs(p.x-Math.round(p.x*1200)/1200)<1e-9)p.x=Math.round(p.x*1200)/1200;if(Math.abs(p.y-Math.round(p.y*1200)/1200)<1e-9)p.y=Math.round(p.y*1200)/1200});
 planarize();changed();toast("Set to "+fi(Lnew))}
function segPopup(s){UI.selSeg=[s.id];render();
 modal('<div class="mt">Wall '+fi(segInner(s).L)+' clear</div><div class="ms">Choose wall type or action</div><div class="row"><button class="bb '+(s.k!=="I"?"on":"")+'" id="kO">Outer wall<small>'+fmt(S.meta.tout)+'" thick</small></button><button class="bb '+(s.k==="I"?"on":"")+'" id="kI">Inner wall<small>'+fmt(S.meta.tin)+'" thick</small></button></div>'+
  '<div class="row"><button class="bb" id="kRun">Whole straight wall<small>apply type to full line</small></button></div><div class="row"><button class="bb" id="kTh">Thickness '+thTxt(wallIn(s))+'<small>4½" / 6" / 8" / 9" / custom</small></button></div><div class="row"><button class="bb pri" id="kLen">Set size</button><button class="bb del" id="kDel">Delete</button></div><div class="row"><button class="bb" id="kX">Close</button></div>',function(){
  function setK(k,all){snapshot();(all?wallRun(s).ids.map(segById):[s]).forEach(function(q){q.k=k});closeModal();changed();toast(k==="I"?"Inner wall":"Outer wall")}
  $("kO").onclick=function(){setK("O")};$("kI").onclick=function(){setK("I")};$("kRun").onclick=function(){setK(s.k==="I"?"I":"O",true)};
  $("kLen").onclick=function(){closeModal();sizePopup(s)};$("kTh").onclick=function(){closeModal();thickPopup(s)};$("kDel").onclick=function(){snapshot();dropOps(s.id);S.segs=S.segs.filter(function(x){return x!==s});cleanup();closeModal();changed()};$("kX").onclick=closeModal})}
/* wall thickness: per wall / straight run / same thickness / all walls, plus drawing defaults */
function thickPopup(s){var run=wallRun(s),m=S.meta,cur=wallIn(s),st={v:cur,scope:"one"};UI.selSeg=[s.id];render();
 var scopes=[["one","This wall",fi(segLen(s))],["run","Full straight wall",fi(run.len)],["same","All "+thTxt(cur)+" walls",S.segs.filter(function(q){return Math.abs(wallIn(q)-cur)<0.01}).length+" walls"],["all","All walls",S.segs.length+" walls"]];
 modal('<div class="mt">Wall thickness / சுவர் தடிமன்</div><div class="ms">Wall '+fi(segLen(s))+' · now <b>'+thTxt(cur)+'</b> '+(s.th>0?'(own size)':'(default '+(s.k==="I"?'inner':'outer')+')')+'</div>'+
  '<div class="grid2" style="grid-template-columns:repeat(4,minmax(0,1fr))">'+THP.map(function(p){return '<button class="bb" data-th="'+p[0]+'" style="border-left:6px solid '+thCol(p[0])+'">'+thTxt(p[0])+'<small>'+p[1]+' · '+p[2]+'</small></button>'}).join("")+'</div>'+
  '<label class="fld">Custom thickness (inches)<input id="thC" type="number" inputmode="decimal" step="0.5" min="2" max="36" value="'+cur+'"></label>'+
  '<div class="ms" style="margin:6px 0 0">Apply to</div><div class="grid2" style="grid-template-columns:repeat(4,minmax(0,1fr))">'+scopes.map(function(c){return '<button class="bb" data-sc="'+c[0]+'">'+c[1]+'<small>'+c[2]+'</small></button>'}).join("")+'</div>'+
  '<div class="ms" style="margin:8px 0 0">Make this the drawing default (walls without their own size follow it)</div><div class="row"><button class="bb" id="thDO">Default OUTER<small>now '+thTxt(m.tout)+'</small></button><button class="bb" id="thDI">Default INNER<small>now '+thTxt(m.tin)+'</small></button><button class="bb" id="thR">Reset to default<small>selected walls</small></button></div>'+
  '<div class="row"><button class="bb" id="thX">Cancel</button><button class="bb ok" id="thOk">OK</button></div>',function(box){
  function upd(){box.querySelectorAll("[data-th]").forEach(function(b){b.classList.toggle("on",Math.abs(+b.dataset.th-st.v)<0.01)});box.querySelectorAll("[data-sc]").forEach(function(b){b.classList.toggle("on",b.dataset.sc===st.scope)});
   var ids=targets().map(function(q){return q.id});UI.selSeg=ids;render()}
  function targets(){if(st.scope==="run")return run.ids.map(segById).filter(Boolean);if(st.scope==="same")return S.segs.filter(function(q){return Math.abs(wallIn(q)-cur)<0.01});if(st.scope==="all")return S.segs.slice();return [s]}
  function val(){var v=parseFloat($("thC").value);return (v>=2&&v<=36)?Math.round(v*4)/4:null}
  box.querySelectorAll("[data-th]").forEach(function(b){b.onclick=function(){st.v=+b.dataset.th;$("thC").value=st.v;upd()}});
  $("thC").oninput=function(){var v=val();if(v)st.v=v;upd()};
  box.querySelectorAll("[data-sc]").forEach(function(b){b.onclick=function(){st.scope=b.dataset.sc;upd()}});
  $("thX").onclick=closeModal;
  $("thR").onclick=function(){snapshot();targets().forEach(function(q){delete q.th});closeModal();changed();toast("Back to default thickness")};
  function setDef(which){var v=val()||st.v;snapshot();var old=which==="O"?m.tout:m.tin;if(which==="O")m.tout=v;else m.tin=v;S.segs.forEach(function(q){if(q.th>0&&Math.abs(q.th-v)<0.01){delete q.th;q.k=which}});
   closeModal();changed();toast("Default "+(which==="O"?"outer":"inner")+" wall: "+thTxt(v)+" (was "+thTxt(old)+")")}
  $("thDO").onclick=function(){setDef("O")};$("thDI").onclick=function(){setDef("I")};
  $("thOk").onclick=function(){var v=val()||st.v;snapshot();var T=targets();T.forEach(function(q){setWallTh(q,v)});closeModal();changed();toast(T.length+" wall"+(T.length>1?"s":"")+" → "+thTxt(v))};upd()})}
/* drawing defaults: outer / inner wall thickness */
function thickDefaultsPopup(){var m=S.meta,st={o:+m.tout,i:+m.tin};
 function rowH(k){return '<div class="grid2" style="grid-template-columns:repeat(4,minmax(0,1fr))">'+THP.map(function(p){return '<button class="bb" data-'+k+'="'+p[0]+'" style="border-left:6px solid '+thCol(p[0])+'">'+thTxt(p[0])+'<small>'+p[1]+'</small></button>'}).join("")+'</div>'}
 modal('<div class="mt">Default wall thickness</div><div class="ms">Every wall that has no size of its own follows these. Walls set with the Wall tool keep their own size.</div>'+
  '<div class="ms" style="margin:4px 0"><b>OUTER walls</b> (outside of house)</div>'+rowH("do")+'<label class="fld">Outer custom (inch)<input id="tdO" type="number" inputmode="decimal" step="0.5" value="'+st.o+'"></label>'+
  '<div class="ms" style="margin:4px 0"><b>INNER walls</b> (partitions, toilet)</div>'+rowH("di")+'<label class="fld">Inner custom (inch)<input id="tdI" type="number" inputmode="decimal" step="0.5" value="'+st.i+'"></label>'+
  '<div class="row"><button class="bb" id="tdX">Cancel</button><button class="bb ok" id="tdOk">Save</button></div>',function(box){
  function upd(){box.querySelectorAll("[data-do]").forEach(function(b){b.classList.toggle("on",Math.abs(+b.dataset.do-st.o)<0.01)});box.querySelectorAll("[data-di]").forEach(function(b){b.classList.toggle("on",Math.abs(+b.dataset.di-st.i)<0.01)})}
  box.querySelectorAll("[data-do]").forEach(function(b){b.onclick=function(){st.o=+b.dataset.do;$("tdO").value=st.o;upd()}});box.querySelectorAll("[data-di]").forEach(function(b){b.onclick=function(){st.i=+b.dataset.di;$("tdI").value=st.i;upd()}});
  $("tdO").oninput=function(){var v=parseFloat(this.value);if(v>=2&&v<=36)st.o=v;upd()};$("tdI").oninput=function(){var v=parseFloat(this.value);if(v>=2&&v<=36)st.i=v;upd()};
  $("tdX").onclick=closeModal;$("tdOk").onclick=function(){snapshot();m.tout=Math.round(st.o*4)/4;m.tin=Math.round(st.i*4)/4;closeModal();changed();updCtx();toast("Defaults: outer "+thTxt(m.tout)+" / inner "+thTxt(m.tin))};upd()})}
/* thickness for the next walls drawn */
function newWallPopup(){var m=S.meta,cur=UI.wth||m.tout;
 modal('<div class="mt">New walls thickness</div><div class="ms">Walls you draw next get this thickness. Change any wall later with the <b>Wall</b> tool.</div><div class="grid2" style="grid-template-columns:repeat(4,minmax(0,1fr))">'+THP.map(function(p){return '<button class="bb'+(Math.abs(p[0]-cur)<0.01?' on':'')+'" data-th="'+p[0]+'" style="border-left:6px solid '+thCol(p[0])+'">'+thTxt(p[0])+'<small>'+p[1]+' · '+p[2]+'</small></button>'}).join("")+'</div>'+
  '<label class="fld">Custom (inches)<input id="nwC" type="number" inputmode="decimal" step="0.5" min="2" max="36" value="'+cur+'"></label><div class="row"><button class="bb" id="nwX">Cancel</button><button class="bb ok" id="nwOk">Use custom</button></div>',function(box){
  function use(v){UI.wth=v;UI.kind=v>=8?"O":"I";closeModal();updCtx();toast("Next walls: "+thTxt(v)+" ("+thName(v)+")")}
  box.querySelectorAll("[data-th]").forEach(function(b){b.onclick=function(){use(+b.dataset.th)}});$("nwX").onclick=closeModal;
  $("nwOk").onclick=function(){var v=parseFloat($("nwC").value);if(!(v>=2&&v<=36)){toast("Enter 2 to 36 inches");return}use(Math.round(v*4)/4)}})}
/* new toilet label: its inside (partition) walls without own thickness become inner walls (default 4.5") */
function toiletInner(x,y){var RI=roomsInfo(),f=faceAt(x,y,RI.faces);if(!f)return;var n=0,P=f.pts;
 for(var i=0;i<P.length;i++){var a=P[i],b=P[(i+1)%P.length],s=S.segs.find(function(q){return (q.a===a.id&&q.b===b.id)||(q.a===b.id&&q.b===a.id)});if(!s||s.th>0||s.k==="I")continue;
  var L=segLen(s),nx=-(b.y-a.y)/L,ny=(b.x-a.x)/L,mx=(a.x+b.x)/2,my=(a.y+b.y)/2;
  var i1=RI.faces.some(function(F){return inPoly(mx+nx*0.3,my+ny*0.3,F.pts)}),i2=RI.faces.some(function(F){return inPoly(mx-nx*0.3,my-ny*0.3,F.pts)});if(i1&&i2){s.k="I";n++}}
 if(n)setTimeout(function(){toast("Toilet partition walls → "+thTxt(S.meta.tin)+" (change with Wall tool)")},300)}
function roomPopup(x,y,lab){var f=faceAt(x,y);var info=f?("Clear size <b>"+sizeText(f)+"</b> · carpet <b>"+sq(f.carpet)+" sq.ft</b>"+(f.rect?"":" (approx.)")+"<br><small>Centre-line "+ctrText(f)+" = "+sq(f.area)+" sq.ft</small>"):'<span class="warn">This spot is not inside a closed outline. Close the walls to get the area.</span>';
 modal('<div class="mt">Room name / அறை பெயர்</div><div class="ms">'+info+'</div><div class="grid2">'+ROOMS.map(function(r){return '<button class="bb" data-r="'+escH(r)+'">'+esc(r)+'<small>'+TAM[r]+'</small></button>'}).join("")+'</div>'+
  '<label class="fld">Custom name (English letters print best)<input id="rCus" maxlength="30" placeholder="e.g. Bedroom 2, Store"></label><div class="row">'+(lab&&isStair(lab.name)?'<button class="bb" id="rFlip">Flip stair UP direction</button>':'')+(lab?'<button class="bb del" id="rDel">Delete label</button>':'')+'<button class="bb" id="rX">Cancel</button><button class="bb ok" id="rOk">Use custom</button></div>',function(box){
  if(lab)$("rCus").value=lab.name;
  function put(name){name=String(name||"").trim();if(!name){toast("Type a name");return}var same=S.labels.filter(function(l){return l.name.toLowerCase().indexOf(name.toLowerCase())===0}).length;
   if(!lab&&same&&["Bedroom","Toilet"].indexOf(name)>=0)name=name+" "+(same+1);snapshot();if(lab)lab.name=name;else{S.labels.push({id:nid(),x:x,y:y,name:name});if(/toilet|bath|wc/i.test(name))toiletInner(x,y)}
   if(/[^\x20-\x7e]/.test(name))toast("Note: non-English letters show as ? in PDF/DXF");closeModal();changed()}
  box.querySelectorAll("[data-r]").forEach(function(b){b.onclick=function(){put(b.dataset.r)}});$("rOk").onclick=function(){put($("rCus").value)};$("rX").onclick=closeModal;
  if(lab&&isStair(lab.name))$("rFlip").onclick=function(){snapshot();lab.flip=!lab.flip;closeModal();changed()};
  if(lab)$("rDel").onclick=function(){snapshot();S.labels=S.labels.filter(function(l){return l!==lab});closeModal();changed()}})}
function opPopup(o,seg,t){var isNew=!o,s=o?segById(o.seg):seg,T0=isNew&&typeof opToolType==="function"?opToolType():null,st=o?{kind:opKind(o),flip:!!o.flip,hinge:!!o.hinge}:{kind:T0?T0.k:(toiletWall(s)?"TD":(UI.lastOp||"D")),flip:false,hinge:false};st.type=kType(st.kind);UI.selSeg=[s.id];render();
 modal('<div class="mt">'+(isNew?"Add":"Edit")+' door / window</div><div class="ms">On wall '+fi(segLen(s))+' · type the opening width</div><div class="grid3" style="grid-template-columns:repeat(3,minmax(0,1fr))">'+OK5.map(function(k){return '<button class="bb" data-o="'+k+'" style="border-left:6px solid '+OKC[k]+'"><b style="color:'+OKC[k]+'">'+k+'</b> '+OKN[k]+'<small>'+OKT[k]+' · '+fi(OKW[k])+'</small></button>'}).join("")+'</div>'+
  keypadHTML()+'<div class="row"><button class="bb" id="sDn">Sill −3"</button><div class="bb" id="sVal" style="flex:1.4;display:flex;align-items:center;justify-content:center"></div><button class="bb" id="sUp">Sill +3"</button></div><div class="row"><button class="bb" id="hDn">Height −3"</button><div class="bb" id="hVal" style="flex:1.4;display:flex;align-items:center;justify-content:center"></div><button class="bb" id="hUp">Height +3"</button></div><div class="row" id="dOpt"><button class="bb" id="oFlip">Swing side ⇅</button><button class="bb" id="oHinge">Hinge side ⇆</button></div><div class="row">'+(isNew?'':'<button class="bb del" id="oDel">Delete</button>')+'<button class="bb" id="oX">Cancel</button><button class="bb ok" id="oOk">OK</button></div>',function(box){
  var get=bindKeypad(box,o?o.w:(T0?T0.w:OKW[st.kind]));st.sill=o?opSill(o):(T0&&T0.sill!=null?T0.sill:OPSILL[st.type]);st.h=o?opH(o):(T0?T0.h:OPHGT[st.type]);
  function lv(){$("sVal").innerHTML=(st.type==="D"?"Sill (floor)":"SILL "+lvl(st.sill))+"<small>bottom of opening</small>";$("hVal").innerHTML="Height "+fi(st.h)+"<small>LINTEL "+lvl(st.sill+st.h)+"</small>"}
  $("sDn").onclick=function(){st.sill=Math.max(0,st.sill-0.25);lv()};$("sUp").onclick=function(){st.sill=Math.min(wallH()-0.5,st.sill+0.25);lv()};$("hDn").onclick=function(){st.h=Math.max(0.5,st.h-0.25);lv()};$("hUp").onclick=function(){st.h=Math.min(wallH(),st.h+0.25);lv()};
  function upd(){lv();box.querySelectorAll("[data-o]").forEach(function(b){b.classList.toggle("on",b.dataset.o===st.kind)});$("dOpt").style.display=st.type==="D"?"flex":"none"}
  box.querySelectorAll("[data-o]").forEach(function(b){b.onclick=function(){var ch=st.kind!==b.dataset.o,tch=kType(b.dataset.o)!==st.type;st.kind=b.dataset.o;st.type=kType(st.kind);if(ch){if(tch){st.sill=OPSILL[st.type];st.h=OPHGT[st.type]}get=bindKeypad(box,OKW[st.kind])}upd()}});
  $("oFlip").onclick=function(){st.flip=!st.flip;toast("Door opens to "+(st.flip?"other":"first")+" side")};$("oHinge").onclick=function(){st.hinge=!st.hinge;toast("Hinge moved")};
  $("oX").onclick=closeModal;if(!isNew)$("oDel").onclick=function(){snapshot();S.ops=S.ops.filter(function(x){return x!==o});closeModal();changed()};
  $("oOk").onclick=function(){var w=get();if(!(w>0.2)){toast("Enter width");return}snapshot();if(isNew){var no={id:nid(),seg:s.id,t:t,type:st.type,dk:st.type==="D"?st.kind:undefined,w:w,flip:st.flip,hinge:st.hinge,sill:st.sill,h:st.h};if(typeof typeOf==="function"){var nt=typeOf(catOf("op",no),no);if(nt)no.ot=nt.id}S.ops.push(no);UI.lastOp=st.kind}else{o.type=st.type;o.dk=st.type==="D"?st.kind:undefined;o.w=w;o.flip=st.flip;o.hinge=st.hinge;o.sill=st.sill;o.h=st.h}closeModal();changed()};upd()})}
/* Stage: Menu - My drawings, Details, Levels, Import IFC/DXF, Export PDF/DXF/PNG */
function menuPopup(){modal('<div class="mt">Menu</div><div class="ms">'+esc(S.meta.name||"New drawing")+'</div><div class="grid2">'+
 '<button class="bb ok" id="mFSave">Save File<small>.jksp file · Ctrl+S</small></button><button class="bb pri" id="mFOpen">Open File<small>.jksp · recent files</small></button>'+
 '<button class="bb pri" id="mFiles">My drawings<small>சேமித்த வரைபடங்கள்</small></button><button class="bb" id="mNew">New drawing<small>புதிய தாள்</small></button>'+
 '<button class="bb" id="mDet">Details<small>Owner, site, walls</small></button><button class="bb" id="mLv">Levels<small>floors</small></button><button class="bb" id="mVG">Visibility<small>show / hide</small></button><button class="bb" id="mGrid">Grid: '+["Off","Faint","On"][UI.grid]+'<small>கட்டம்</small></button>'+
 '<button class="bb'+(S.meta.fillc?' on':'')+'" id="mFill">Corners: '+(S.meta.fillc?'Filled':'Plain')+'<small>wall joins</small></button>'+
 '<button class="bb pri" id="mImp">Import IFC / DXF<small>from Revit</small></button><button class="bb ok" id="mPdf">Export PDF</button><button class="bb ok" id="mDxf">Export DXF<small>AutoCAD</small></button><button class="bb ok" id="mPng">Export PNG<small>image</small></button><button class="bb del" id="mClr">Clear sheet<small>அழி</small></button>'+
 '</div><div class="row"><button class="bb" id="mHelp">Help / உதவி</button><button class="bb" id="mX">Close</button></div>',function(){
 $("mFiles").onclick=filesPopup;$("mFSave").onclick=function(){closeModal();fileSave(false)};$("mFOpen").onclick=filePopup;$("mNew").onclick=function(){closeModal();newDrawing();toast("New blank sheet")};$("mDet").onclick=detailsPopup;$("mLv").onclick=levelsPopup;$("mVG").onclick=vgPopup;
 $("mGrid").onclick=function(){UI.grid=(UI.grid+1)%3;LS.set("jksp_grid",UI.grid);$("mGrid").innerHTML="Grid: "+["Off","Faint","On"][UI.grid]+"<small>கட்டம்</small>";render();updCtx()};
 $("mImp").onclick=importPopup;$("mFill").onclick=function(){fillToggle();this.classList.toggle("on",!!S.meta.fillc);this.innerHTML="Corners: "+(S.meta.fillc?"Filled":"Plain")+"<small>wall joins</small>"};$("mPdf").onclick=function(){closeModal();exportPDF()};$("mDxf").onclick=function(){closeModal();exportDXF()};$("mPng").onclick=function(){closeModal();exportPNG()};
 $("mClr").onclick=function(){if(!S.segs.length&&!S.labels.length){closeModal();return}if(confirm("Clear the whole sheet? (Undo can bring it back)")){snapshot();S.pts=[];S.segs=[];S.labels=[];S.ops=[];S.furn=[];S.cols=[];S.beams=[];S.dims=[];S.notes=[];S.spots=[];S.dlines=[];S.rails=[];UI.chain=null;UI.chainFree=null;closeModal();changed()}};
 $("mHelp").onclick=helpPopup;$("mX").onclick=closeModal})}
/* Stage: My drawings - open / rename / delete drawings saved in this browser */
function filesPopup(){autosave();var L=idxList();
 modal('<div class="mt">My drawings</div><div class="ms">Saved automatically on this phone / tablet</div><div class="row"><button class="bb pri" id="fNew">+ New drawing</button></div>'+
  (L.length?L.map(function(e){return '<div class="file"><div><b>'+esc(e.name)+(e.id===CURID?" (open)":"")+'</b><small>'+(e.owner?esc(e.owner)+" · ":"")+sq(e.area||0)+' sq.ft · '+new Date(e.updated).toLocaleString()+'</small></div><button class="bb pri" data-open="'+e.id+'">Open</button><button class="bb" data-ren="'+e.id+'">Rename</button><button class="bb del" data-del="'+e.id+'">×</button></div>'}).join(""):'<p class="ms">No saved drawings yet.</p>')+
  '<div class="row"><button class="bb" id="fX">Close</button></div>',function(box){
  $("fNew").onclick=function(){closeModal();newDrawing()};$("fX").onclick=closeModal;
  box.querySelectorAll("[data-open]").forEach(function(b){b.onclick=function(){closeModal();openDrawing(b.dataset.open)}});
  box.querySelectorAll("[data-ren]").forEach(function(b){b.onclick=function(){var id=b.dataset.ren,L2=idxList(),e=L2.find(function(x){return x.id===id});var n=prompt("Drawing name",e.name);if(!n)return;e.name=n;LS.set("jksp_index",L2);var d=LS.get("jksp_d_"+id,null);if(d){d.meta.name=n;LS.set("jksp_d_"+id,d)}if(id===CURID){S.meta.name=n;updTitle()}filesPopup()}});
  box.querySelectorAll("[data-del]").forEach(function(b){b.onclick=function(){var id=b.dataset.del;if(!confirm("Delete this drawing?"))return;LS.set("jksp_index",idxList().filter(function(x){return x.id!==id}));try{localStorage.removeItem("jksp_d_"+id)}catch(e){}if(id===CURID){CURID=null;DIRTY=true}filesPopup()}})})}
function detailsPopup(){var m=S.meta;
 modal('<div class="mt">Drawing details</div><label class="fld">Drawing name<input id="dN" value="'+escH(m.name||defaultName())+'"></label><label class="fld">Owner / Client name<input id="dO" value="'+escH(m.owner)+'" placeholder="e.g. Mr. Kumar"></label>'+
  '<div class="ms" style="margin:10px 0 0"><b>PDF title block</b> (English letters print best)</div><div class="row"><label class="fld">Project<input id="dPr" value="'+escH(m.proj)+'" placeholder="e.g. Villa, Residence"></label><label class="fld">Title<input id="dTt" value="'+escH(m.ttl)+'" placeholder="Ground Floor Plan"></label></div>'+
  '<div class="row"><label class="fld">Drawing No.<input id="dNo" value="'+escH(m.dno)+'" placeholder="A101"></label><label class="fld">Drawn by<input id="dBy" value="'+escH(m.drawn)+'"></label><label class="fld">Checked by<input id="dCk" value="'+escH(m.chk)+'"></label></div>'+
  '<label class="fld">Revisions (one per line: description | date)<textarea id="dRv" rows="3" style="display:block;width:100%;font-size:16px;padding:8px;border:1.5px solid #b8c6d8;border-radius:10px;-webkit-user-select:text;user-select:text" placeholder="First issue | 14/11/2026">'+esc(m.revs||"")+'</textarea></label>'+
  '<label class="fld">Site / place<input id="dS" value="'+escH(m.site)+'" placeholder="e.g. TS No. 10/1913/4, Ramanathapuram"></label><label class="fld">Date<input id="dD" type="date" value="'+escH(m.date||today())+'"></label>'+
  '<div class="row"><button class="bb '+(m.dbl?"on":"")+'" id="dDbl">Double-line walls</button><button class="bb '+(m.dbl?"":"on")+'" id="dSgl">Single line</button></div>'+
  '<div class="ms" style="margin:10px 0 0"><b>Default wall thickness</b> · each wall can have its own size with the Wall tool (4½" / 6" / 8" / 9")</div><div class="row"><label class="fld">Outer wall (inch)<input id="dTo" type="number" inputmode="decimal" value="'+m.tout+'"></label><label class="fld">Inner wall (inch)<input id="dTi" type="number" inputmode="decimal" value="'+m.tin+'"></label></div>'+
  '<label class="fld">Floor height of this level (ft, floor to floor)<input id="dWh" type="number" inputmode="decimal" value="'+wallH()+'"></label><label class="fld">PDF paper<select id="dP"><option'+(m.paper==="A3"?" selected":"")+'>A3</option><option'+(m.paper==="A4"?" selected":"")+'>A4</option></select></label>'+
  '<div class="row"><button class="bb" id="dX">Cancel</button><button class="bb ok" id="dOk">Save</button></div>',function(){var dbl=m.dbl;
  $("dDbl").onclick=function(){dbl=true;$("dDbl").classList.add("on");$("dSgl").classList.remove("on")};$("dSgl").onclick=function(){dbl=false;$("dSgl").classList.add("on");$("dDbl").classList.remove("on")};
  $("dX").onclick=closeModal;$("dOk").onclick=function(){snapshot();m.name=$("dN").value.trim()||defaultName();m.owner=$("dO").value.trim();m.site=$("dS").value.trim();m.date=$("dD").value||today();m.dbl=dbl;m.proj=$("dPr").value.trim();m.ttl=$("dTt").value.trim()||"Ground Floor Plan";m.dno=$("dNo").value.trim()||"A101";m.drawn=$("dBy").value.trim();m.chk=$("dCk").value.trim();m.revs=$("dRv").value;
   var to=parseFloat($("dTo").value),ti=parseFloat($("dTi").value);if(to>0&&to<36)m.tout=to;if(ti>0&&ti<36)m.tin=ti;m.paper=$("dP").value;var wh=parseFloat($("dWh").value);if(wh>=7&&wh<=30){m.wh=wh;curLv().h=wh}closeModal();changed();updTitle()}})}
function helpPopup(){modal('<div class="mt">How to use</div><div class="ms" style="font-size:15px;line-height:1.5">'+
 '<b>Draw</b>: drag the pen / finger along a wall. The length in feet shows on the line while you draw (1 grid = 1 ft). Lines snap straight (90°). Lift and drag again from the end to continue. A rough hand stroke with corners becomes straight walls.<br>'+
 '<b>Tap-tap</b>: in Draw, tap a point then tap the next corner.<br><b>Close</b> joins the last point to the first. <b>New line</b> starts a separate wall (inside walls).<br>'+
 '<b>Size</b>: tap a wall and type the real feet / inches. Connected walls move with it.<br><b>Room</b>: tap inside a closed room and pick the name - area and size are shown.<br>'+
 '<b>Door/Win</b>: tap a wall, choose door / window / ventilator and width.<br><b>Move</b>: drag corner points or room names; tap a wall for outer / inner type.<br><b>Wall</b>: tap a wall to set its thickness - 4½" half brick, 6" / 8" block, 9" full brick or any custom inches; apply to one wall, the full straight wall, or all walls. <b>Defaults</b> sets outer / inner thickness for the whole drawing. In Draw, the <b>Wall 9"</b> button sets the thickness of the next walls.<br>'+
 '<b>Pen only</b>: with a stylus, fingers only move / zoom (palm will not draw).<br><b>Clean</b>: Sheet 1 = plan with thick walls, door swings, windows, title block; Sheet 2 = door &amp; window 2D details + schedules. Export PDF (2 pages) / DXF / PNG.<br>Room sizes shown are clear inside sizes (wall face to wall face); built-up area is to the outer face of walls.<br>'+
 'Two fingers: pan and pinch zoom. Everything saves automatically.</div><div class="row"><button class="bb" id="hX">Close</button></div>',function(){$("hX").onclick=closeModal})}

/* ================= toolbar ================= */
function setTool(t){UI.tool=t;document.querySelectorAll(".tool").forEach(function(b){b.classList.toggle("on",b.dataset.t===t)});if(UI.clean)setClean(false);updCtx();render()}
var HINTS={wall:"Tap a wall to set its thickness · colour = thickness (4½\" teal, 6\" purple, 8\" brown, 9\" slate)",furn:"Tap empty floor to add furniture · drag to move · snaps to walls",draw:"Draw walls with pen / finger · length shows live",move:"Drag corners or room names · tap wall for type",size:"Tap a wall to type its real size",room:"Tap inside a room to name it",open:"Tap a wall to add door / window",del:"Tap a wall, label or opening to delete"};
function updCtx(){var c=$("ctx"),h="";
 if(UI.clean)h='<button class="cb on" data-c="back">✎ Back to drawing<small>வரைபடம்</small></button><button class="cb" data-c="pdf">PDF</button><button class="cb" data-c="dxf">DXF<small>AutoCAD</small></button><button class="cb" data-c="png">PNG</button><button class="cb" data-c="det">Details<small>Owner / site</small></button><button class="cb '+(UI.page!==2?"on":"")+'" data-c="pg1">Sheet 1<small>Plan</small></button><button class="cb '+(UI.page===2?"on":"")+'" data-c="pg2">Sheet 2<small>Door &amp; Window</small></button><button class="cb on" data-c="v3d">3D View<small>முப்பரிமாணம்</small></button><button class="cb" data-c="cad">AutoCAD 3D</button>';
 else{if(UI.tool==="draw")h+='<button class="cb" data-c="new">＋ New line<small>புதிய கோடு</small></button><button class="cb" data-c="close">⬠ Close<small>மூடு</small></button><button class="cb on" data-c="ortho">'+(UI.ortho===90?"90° Straight":UI.ortho===45?"45° Angles":"Free angle")+'<small>snap</small></button><button class="cb on" data-c="wth">Wall '+thTxt(UI.wth||S.meta.tout)+'<small>new walls · thickness</small></button>';
  h+='<button class="cb '+(UI.penOnly?"on":"")+'" data-c="pen">✒ Pen only: '+(UI.penOnly?"ON":"OFF")+'<small>palm safe</small></button><button class="cb '+(UI.grid?"on":"")+'" data-c="grid">Grid: '+["Off","Faint","On"][UI.grid]+'<small>கட்டம்</small></button>';
  if(UI.tool==="furn"){var fs=furnSel();h='<button class="cb on" data-c="fadd">＋ Add furniture<small>மரச்சாமான்</small></button>'+(fs?'<button class="cb" data-c="frot">⟳ Rotate 90°</button><button class="cb" data-c="fdup">Duplicate</button><button class="cb warn" data-c="fdel">Delete</button><button class="cb" data-c="fdone">Done</button><span style="align-self:center;font-weight:700;color:#16365c;white-space:nowrap">'+esc(FURN[fs.type].n)+'</span>':'')}
  if(UI.tool==="wall")h='<button class="cb on" data-c="wdef">Defaults<small>outer '+thTxt(S.meta.tout)+' · inner '+thTxt(S.meta.tin)+'</small></button>'+THP.map(function(p){return '<span class="cb" style="border-color:'+thCol(p[0])+';color:'+thCol(p[0])+';pointer-events:none">'+thTxt(p[0])+'<small>'+p[1]+'</small></span>'}).join("");
  if(UI.tool==="draw")h+='<button class="cb '+(UI.chainOn?"on":"")+'" data-c="chain">Continue: '+(UI.chainOn?"ON":"OFF")+'<small>from last end</small></button>'}
 c.innerHTML=h;c.querySelectorAll("[data-c]").forEach(function(b){b.onclick=function(){ctxAction(b.dataset.c)}});$("hint").textContent=UI.clean?"Clean plan":HINTS[UI.tool]}
function ctxAction(k){if(/^f(add|rot|dup|del|done)$/.test(k)){furnAction(k);return}if(k==="new")newLine();else if(k==="close")autoClose();else if(k==="ortho"){UI.ortho=UI.ortho===90?45:(UI.ortho===45?0:90);toast(UI.ortho?"Snap "+UI.ortho+"°":"Free angle")}
 else if(k==="kind"){UI.kind=UI.kind==="O"?"I":"O";toast(UI.kind==="O"?"Next walls: outer":"Next walls: inner")}else if(k==="wth"){newWallPopup();return}
 else if(k==="wdef"){thickDefaultsPopup();return}else if(k==="pg1"||k==="pg2"){UI.page=k==="pg2"?2:1;SHEET=null}else if(k==="pen"){UI.penOnly=!UI.penOnly;LS.set("jksp_pen",UI.penOnly);toast(UI.penOnly?"Pen only: fingers pan / zoom":"Finger drawing ON")}
 else if(k==="grid"){UI.grid=(UI.grid+1)%3;LS.set("jksp_grid",UI.grid)}else if(k==="chain"){UI.chainOn=!UI.chainOn}else if(k==="back")setClean(false);else if(k==="pdf")exportPDF();else if(k==="dxf")exportDXF();else if(k==="png")exportPNG();else if(k==="det")detailsPopup();else if(k==="v3d"){open3D("3d");return}else if(k==="cad"){open3D("cad");return}
 updCtx();render()}
function setClean(on){UI.clean=on;$("bClean").classList.toggle("on",on);SHEET=null;if(on)fitSheet();updCtx();render()}
function updButtons(){$("bUndo").disabled=!UNDO.length;$("bRedo").disabled=!REDO.length}

/* ================= export ================= */
/* Stage: Export (PDF/DXF/PNG) - browser download (Blob + <a download>); Android bridge only inside the APK */
function saveFile(filename,blobOrDataURL,mime){var data=blobOrDataURL;mime=mime||(data&&data.type)||"application/octet-stream";
 function asBlob(){if(data instanceof Blob)return data;if(typeof data==="string"&&data.slice(0,5)==="data:")return dataURLtoBlob(data);return new Blob([data],{type:mime})}
 if(window.Android&&typeof window.Android.saveFile==="function"){
  if(typeof data==="string"&&/^data:[^,]*;base64,/.test(data)){window.Android.saveFile(filename,data.slice(data.indexOf(",")+1),mime);return}
  var fr=new FileReader();fr.onload=function(){var s=String(fr.result);window.Android.saveFile(filename,s.slice(s.indexOf(",")+1),mime)};fr.readAsDataURL(asBlob());return}
 var b=asBlob(),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=filename;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},4000);toast("Saved "+filename);webShareOffer(filename,b)}
/* Stage: Export (PDF/DXF/PNG) - optional Share button on phones (Web Share API) */
function webShareOffer(name,b){try{if(!(navigator.share&&navigator.canShare&&matchMedia("(pointer:coarse)").matches))return;var f=new File([b],name,{type:b.type||"application/octet-stream"});if(!navigator.canShare({files:[f]}))return;var el=$("toast");el.innerHTML=esc("Saved "+name)+' <button id="tShare" style="margin-left:8px;border:0;border-radius:6px;padding:4px 10px;background:#fff;color:#16365c;font-weight:700">Share</button>';el.style.display="block";clearTimeout(toast.t);toast.t=setTimeout(function(){el.style.display="none"},6000);$("tShare").onclick=function(){navigator.share({files:[f],title:name}).catch(function(){})}}catch(e){}}
function fname(ext){return "HousePlan_"+((S.meta.owner||S.meta.name||"plan").replace(/[^A-Za-z0-9]+/g,"-").replace(/^-|-$/g,"")||"plan")+"_"+(S.meta.date||today())+"."+ext}
function needContent(){if(!S.segs.length){toast("Draw something first");return false}return true}
/* Stage: Export - PDF tool (single sheet; replaced by the sheet-set export in views.js) */
function exportPDF(){if(!needContent())return;var r=buildSheet();saveFile(fname("pdf"),new Blob([bin(toPDF([r.d,r.d2],S.meta.paper||"A3"))],{type:"application/pdf"}),"application/pdf")}
/* Stage: Export - DXF tool (current plan, AutoCAD R12, feet) */
function exportDXF(){if(!needContent())return;var r=buildSheet();saveFile(fname("dxf"),new Blob([toDXF(r.d,["WALLS","WALLFILL","DIMS","TEXT","DOORS","WINDOWS","STAIRS","FURNITURE","TITLE"])],{type:"application/dxf"}),"application/dxf")}
/* Stage: Export - PNG tool (plan image) */
function exportPNG(){if(!needContent())return;var r=buildSheet(),c=document.createElement("canvas"),s=2480/420;c.width=2480;c.height=Math.round(297*s);var x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,c.width,c.height);drawDwg(x,UI.page===2?r.d2:r.d,s,0,0);
 c.toBlob(function(b){saveFile(fname("png"),b,"image/png")},"image/png")}

/* ================= init ================= */
function onBack(){if(window.V3&&V3.on){close3D();return 1}if($("modal").classList.contains("show")){closeModal();return 1}if(UI.clean){setClean(false);return 1}autosave();return 0}
/* Stage: Start-up - binds the top-row quick tools (Undo, Redo, Fit, Sheets, 3D, Import, Menu); Wall tool active */
function init(){cv=$("cv");g=cv.getContext("2d");S=blank();
 UI.grid=LS.get("jksp_grid",1);UI.penOnly=LS.get("jksp_pen",false);
 cv.addEventListener("pointerdown",onDown);cv.addEventListener("pointermove",onMove);cv.addEventListener("pointerup",onUp);cv.addEventListener("pointercancel",onUp);
 cv.addEventListener("wheel",function(e){e.preventDefault();var p=lp(e);zoomAt(p.x,p.y,Math.exp(-e.deltaY*0.0015))},{passive:false});
 cv.addEventListener("contextmenu",function(e){e.preventDefault()});
 document.querySelectorAll(".tool").forEach(function(b){b.onclick=function(){setTool(b.dataset.t)}});
 $("bUndo").onclick=undo;$("bRedo").onclick=redo;$("bFit").onclick=fitAll;$("bClean").onclick=function(){setClean(!UI.clean)};$("bMenu").onclick=menuPopup;$("bImport").onclick=importPopup;$("b3d").onclick=function(){open3D("3d")};bind3DUI();initV13();
 /* swallow the ghost click that follows the canvas tap which opened a popup */
 $("modal").addEventListener("click",function(e){if(Date.now()-(UI.modalT||0)<450){e.stopPropagation();e.preventDefault()}},true);
 $("modal").addEventListener("pointerdown",function(e){if(e.target===$("modal")&&Date.now()-(UI.modalT||0)>450)closeModal()});
 window.addEventListener("resize",resize);if(window.ResizeObserver)new ResizeObserver(resize).observe($("stage"));
 document.addEventListener("visibilitychange",function(){if(document.hidden)autosave()});window.addEventListener("pagehide",autosave);
 resize();homeView();
 var last=LS.get("jksp_last",null);if(last&&last.id&&Date.now()-last.t<30*60*1000&&LS.get("jksp_d_"+last.id,null)){openDrawing(last.id);toast("Continuing: "+S.meta.name)}
 setTool("draw");updButtons();updTitle();render()}
window.JKS={get S(){return S},set S(v){S=docify(v);changed()},V:V,UI:UI,roomsInfo:roomsInfo,faces:faces,buildSheet:buildSheet,toPDF:toPDF,toDXF:toDXF,setLength:setLength,fi:fi,w2s:w2s,s2w:s2w,onBack:onBack,fitAll:fitAll,newDrawing:newDrawing,openDrawing:openDrawing,autosave:autosave,idxList:idxList,setTool:setTool,importModel:function(m,t,f){IMP={file:f||"test"};return impApply(m,t||"new")},setClean:setClean,stairsAll:stairsAll,addFurn:function(t,x,y){addFurn(t,x,y)},FURN:FURN,open3D:function(m){open3D(m)},close3D:function(){close3D()}};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
