/* ================= v1.3 VIEWS: elevations N/S/E/W, sections, sheet set (PDF), multi-level 3D ================= */
var PLH=1.5,MARKG=false;
function levelPack(i){return withLevel(i,function(){var L=S.L[i],RI=roomsInfo(),dbl=S.meta.dbl,P={i:i,L:L,zb:lvElev(i),H:L.h,sl:(L.slab||5)/12,RI:RI,walls:[],stairs:stairsAll(RI),beams:S.beams.slice(),rails:S.rails.slice(),cols:(typeof colsOnFloor==="function"?colsOnFloor(i,{all:true}):S.cols.slice())};
 function ins(x,y){return RI.faces.some(function(f){return inPoly(x,y,f.pts)})}
 var opsBy={};S.ops.forEach(function(o){var G=opWorld(o);if(G)(opsBy[o.seg]=opsBy[o.seg]||[]).push({o:o,G:G})});
 S.segs.forEach(function(s){var a=pt(s.a),b=pt(s.b),Ln=segLen(s);if(Ln<0.05)return;var u={x:(b.x-a.x)/Ln,y:(b.y-a.y)/Ln},n={x:-u.y,y:u.x},m={x:(a.x+b.x)/2,y:(a.y+b.y)/2},i1=ins(m.x+n.x*0.35,m.y+n.y*0.35),i2=ins(m.x-n.x*0.35,m.y-n.y*0.35);
  var t=dbl?wallT(s):0.5,poly=dbl?wallPoly(s):[{x:a.x+n.x*0.25,y:a.y+n.y*0.25},{x:b.x+n.x*0.25,y:b.y+n.y*0.25},{x:b.x-n.x*0.25,y:b.y-n.y*0.25},{x:a.x-n.x*0.25,y:a.y-n.y*0.25}];
  P.walls.push({s:s,a:{x:a.x,y:a.y},b:{x:b.x,y:b.y},L:Ln,u:u,n:n,m:m,poly:poly,t:t,ext:!(i1&&i2)&&(i1||i2||!RI.faces.length),out:i1?-1:1,ops:opsBy[s.id]||[]})});
 return P})}
function allPacks(){var PK=[];S.L.forEach(function(L,i){PK.push(levelPack(i))});var ti=topLevel(),rc=roofCfg();
 PK.forEach(function(P,i){var Q=PK[i+1];P.walls.forEach(function(w){var cov=false;if(Q&&Q.walls.length){cov=[1,-1].some(function(sg){var x=w.m.x+w.n.x*0.35*sg,y=w.m.y+w.n.y*0.35*sg;return Q.RI.faces.some(function(f){return inPoly(x,y,f.pts)})})||Q.walls.some(function(v){return projSeg(w.m.x,w.m.y,v.a,v.b).d<0.3})}
  w.cov=cov;w.par=(w.ext&&!cov)?(i<ti?3:(i===ti&&rc.type==="flat"?(+rc.par||0):0)):0})});return PK}
/* ---------- generic 2D view (h horizontal, z up) ---------- */
function rect(h0,z0,h1,z1){return [[h0,z0],[h1,z0],[h1,z1],[h0,z1]]}
var CUT={fill:"#3a3a3a",c:"#000000",w:0.35};
function opItems(items,o,h0,h1,s0,s1,dep,ext,light){var k=opKind(o),c=light?"#8a8a8a":"#1f2937";
 if(o.type==="D"){if(k==="OP"){items.push({p:rect(h0,s0,h1,s1),fill:"#6b7280",c:c,w:0.2,dep:dep,L:"DOORS"});return}
  var it={p:rect(h0,s0,h1,s1),fill:light?"#f2e8dc":(k==="MD"?"#b9875a":(k==="TD"?"#dfe7e5":"#d9b48c")),c:c,w:0.25,dep:dep,L:"DOORS",lines:[]},fr=0.25,ih0=h0+fr,ih1=h1-fr;
  var np=k==="MD"?2:1;for(var i=0;i<np;i++){var a=ih0+(ih1-ih0)*i/np+0.12,b=ih0+(ih1-ih0)*(i+1)/np-0.12;[[s0+0.4,s0+(s1-s0)*0.45],[s0+(s1-s0)*0.5,s1-0.35]].forEach(function(z){it.lines.push([a,z[0],b,z[0]],[b,z[0],b,z[1]],[b,z[1],a,z[1]],[a,z[1],a,z[0]])})}items.push(it);return}
 var it2={p:rect(h0,s0,h1,s1),fill:light?"#f4f8fc":"#cfe3f5",c:c,w:0.25,dep:dep,L:"WINDOWS",lines:[]},hm=(h0+h1)/2;
 if(o.type==="W"){if(h1-h0>2.4)it2.lines.push([hm,s0,hm,s1]);it2.lines.push([h0+0.17,s0+0.17,h1-0.17,s0+0.17],[h1-0.17,s0+0.17,h1-0.17,s1-0.17],[h1-0.17,s1-0.17,h0+0.17,s1-0.17],[h0+0.17,s1-0.17,h0+0.17,s0+0.17])}
 else for(var z=s0+0.25;z<s1-0.1;z+=0.25)it2.lines.push([h0+0.12,z,h1-0.12,z]);
 items.push(it2);if(ext&&!light){items.push({p:rect(h0-0.15,s0-0.12,h1+0.15,s0),fill:"#cfcac0",c:c,w:0.15,dep:dep-0.0001,L:"WINDOWS"});if(o.type==="W")items.push({p:rect(h0-0.5,s1+0.25,h1+0.5,s1+0.5),fill:"#bdb7ab",c:c,w:0.18,dep:dep-0.0002,L:"WINDOWS"})}}
var EDIR={N:{h:function(p){return -p.x},d:function(p){return p.y},v:{x:0,y:1},t:"NORTH ELEVATION"},S:{h:function(p){return p.x},d:function(p){return -p.y},v:{x:0,y:-1},t:"SOUTH ELEVATION"},
 E:{h:function(p){return -p.y},d:function(p){return -p.x},v:{x:-1,y:0},t:"EAST ELEVATION"},W:{h:function(p){return p.y},d:function(p){return p.x},v:{x:1,y:0},t:"WEST ELEVATION"}};
function levelMarks(PK){var out=[];PK.forEach(function(P,i){if(i===0||P.walls.length||PK[i-1].walls.length)out.push({z:P.zb,t:ascii(P.L.name).toUpperCase()})});var ti=topLevel(),T=PK[ti];if(T)out.push({z:T.zb+T.H,t:roofCfg().type==="flat"?"TERRACE / ROOF":"ROOF EAVE"});return out}
/* Stage: Views - Elevation tool (N/S/E/W) */
function elevView(dir,PK){PK=PK||allPacks();var D=EDIR[dir],items=[],rc=roofCfg();
 PK.forEach(function(P){P.walls.forEach(function(w){var hs=w.poly.map(D.h),h0=Math.min.apply(null,hs),h1=Math.max.apply(null,hs),ds=w.poly.map(D.d),dep=ds.reduce(function(a,b){return a+b},0)/ds.length,zt=P.zb+P.H;
   items.push({p:rect(h0,P.zb,h1,zt),fill:"#f3ede2",c:"#2b2b2b",w:0.25,dep:dep,L:"ELEV"});
   if(w.ext)items.push({p:rect(h0,zt-P.sl,h1,zt),fill:"#d6d2ca",c:"#555555",w:0.15,dep:dep-0.0003,L:"ELEV"});
   if(w.par>0){items.push({p:rect(h0,zt,h1,zt+w.par),fill:"#f3ede2",c:"#2b2b2b",w:0.25,dep:dep-0.0003,L:"ELEV"});items.push({p:rect(h0-0.08,zt+w.par,h1+0.08,zt+w.par+0.25),fill:"#cfcac0",c:"#444444",w:0.15,dep:dep-0.0004,L:"ELEV"})}
   if(P.i===0)items.push({p:rect(h0-0.05,-PLH,h1+0.05,0),fill:"#cdbfa6",c:"#555555",w:0.2,dep:dep-0.0002,L:"ELEV"});
   if(Math.abs(w.n.x*D.v.x+w.n.y*D.v.y)>0.5)w.ops.forEach(function(q){var a=D.h(q.G.p0),b=D.h(q.G.p1),s0=P.zb+opSill(q.o);opItems(items,q.o,Math.min(a,b),Math.max(a,b),s0,s0+Math.min(opH(q.o),P.H-0.3),dep-0.001,w.ext)})});
  P.rails.forEach(function(r){var a=D.h(r.a),b=D.h(r.b),dep=(D.d(r.a)+D.d(r.b))/2,hh=r.h||3,ls=[[Math.min(a,b),P.zb+hh,Math.max(a,b),P.zb+hh]];for(var t=0;t<=1.0001;t+=1/Math.max(1,Math.ceil(Math.abs(b-a)/4)))ls.push([a+(b-a)*t,P.zb,a+(b-a)*t,P.zb+hh]);items.push({p:null,lines:ls,c:"#0f766e",w:0.25,dep:dep-0.01,L:"RAILINGS"})})});
 var RG=roofGeom();if(RG)RG.tris.forEach(function(t){var dep=t.p.reduce(function(a,p){return a+D.d(p)},0)/3;items.push({p:t.p.map(function(p){return [D.h(p),p.z]}),fill:t.k==="roof"?"#b5653b":"#f3ede2",c:"#3b2314",w:0.25,dep:dep-(t.k==="roof"?0.5:0),L:"ROOF"})});
 return {items:items,lv:levelMarks(PK),title:D.t}}
/* Stage: Views - Section tool */
function secView(sec,PK){PK=PK||allPacks();var G=secGeom(sec),A=sec.a,u=G.u,n=G.n,items=[],rc=roofCfg(),ti=topLevel(),c0=-1,c1=G.L+1;
 function H(p){return (p.x-A.x)*u.x+(p.y-A.y)*u.y}function Dd(p){return (p.x-A.x)*n.x+(p.y-A.y)*n.y}
 function crossH(poly){var ds=poly.map(Dd),hs=[];for(var k=0;k<poly.length;k++){var p=poly[k],q=poly[(k+1)%poly.length],d0=ds[k],d1=ds[(k+1)%poly.length];if((d0<=0&&d1>0)||(d0>0&&d1<=0)){var t=d0/(d0-d1);hs.push(H({x:p.x+(q.x-p.x)*t,y:p.y+(q.y-p.y)*t}))}}return hs.length>=2?[Math.min.apply(null,hs),Math.max.apply(null,hs)]:null}
 function clip(r){return r&&r[1]>c0&&r[0]<c1?[Math.max(r[0],c0),Math.min(r[1],c1)]:null}
 function intervals(fn,z0,z1,st){var out=[],on=null;for(var h=c0;h<=c1+1e-6;h+=0.1){var p={x:A.x+u.x*h,y:A.y+u.y*h},v=fn(p);if(v&&on==null)on=h;if(!v&&on!=null){out.push([on,h]);on=null}}if(on!=null)out.push([on,c1]);out.forEach(function(r){items.push(Object.assign({p:rect(r[0],z0,r[1],z1),dep:-1},st))})}
 PK.forEach(function(P){var zt=P.zb+P.H;
  P.walls.forEach(function(w){var ds=w.poly.map(Dd),mn=Math.min.apply(null,ds),mx=Math.max.apply(null,ds);
   if(mn<0&&mx>0){var r=clip(crossH(w.poly));if(!r)return;var top=zt+w.par,da=Dd(w.a),db=Dd(w.b),op=null;
    if((da<0)!==(db<0)&&Math.abs(da-db)>1e-6){var tc=da/(da-db)*w.L;op=w.ops.find(function(q){var c=(q.G.c.x-w.a.x)*w.u.x+(q.G.c.y-w.a.y)*w.u.y;return Math.abs(tc-c)<=q.G.w/2})}
    if(op){var s0=P.zb+opSill(op.o),s1=s0+Math.min(opH(op.o),P.H-0.3);if(s0>P.zb+0.01)items.push(Object.assign({p:rect(r[0],P.zb,r[1],s0),dep:-1,L:"SECTION"},CUT));items.push(Object.assign({p:rect(r[0],s1,r[1],top),dep:-1,L:"SECTION"},CUT));
     if(op.o.type!=="D")items.push({p:null,lines:[[(r[0]+r[1])/2,s0,(r[0]+r[1])/2,s1],[r[0],s0,r[0],s1],[r[1],s0,r[1],s1]],c:"#1f5fa8",w:0.18,dep:-1.1,L:"SECTION"})}
    else items.push(Object.assign({p:rect(r[0],P.zb,r[1],top),dep:-1,L:"SECTION"},CUT));
    if(w.par>0)items.push({p:rect(r[0]-0.08,top,r[1]+0.08,top+0.25),fill:"#9ca3af",c:"#000",w:0.25,dep:-1.05,L:"SECTION"})}
   else if(mn>=0){var hs=w.poly.map(H),h0=Math.max(Math.min.apply(null,hs),c0),h1=Math.min(Math.max.apply(null,hs),c1);if(h1<=h0)return;var dep=(mn+mx)/2;
    items.push({p:rect(h0,P.zb,h1,zt+w.par),fill:"#fbfaf7",c:"#8a8a8a",w:0.18,dep:dep,L:"ELEV"});
    if(Math.abs(w.n.x*n.x+w.n.y*n.y)>0.5)w.ops.forEach(function(q){var a=H(q.G.p0),b=H(q.G.p1),s0=P.zb+opSill(q.o);var lo=Math.max(Math.min(a,b),c0),hi=Math.min(Math.max(a,b),c1);if(hi>lo)opItems(items,q.o,lo,hi,s0,s0+Math.min(opH(q.o),P.H-0.3),dep-0.001,false,true)})}});
  // slabs, plinth
  var stairF=P.RI.faces.filter(function(f){return f.labels.some(function(l){return isStair(l.name)})});
  function inLevel(p,noStair){if(P.walls.some(function(w){return inPoly(p.x,p.y,w.poly)}))return true;return P.RI.faces.some(function(f){return inPoly(p.x,p.y,f.pts)&&!(noStair&&stairF.indexOf(f)>=0)})}
  if(P.i<ti||rc.type==="flat")intervals(function(p){return inLevel(p,P.i<ti)},zt-P.sl,zt,{fill:"#3a3a3a",c:"#000",w:0.3,L:"SECTION"});
  if(P.i===0)intervals(function(p){return inLevel(p,false)},-PLH,0,{fill:"#d9cbb0",c:"#333",w:0.3,L:"SECTION"});
  // beams cut
  P.beams.forEach(function(m){var da=Dd(m.a),db=Dd(m.b);if((da<0)===(db<0))return;var t=da/(da-db),h=H({x:m.a.x+(m.b.x-m.a.x)*t,y:m.a.y+(m.b.y-m.a.y)*t});if(h<c0||h>c1)return;items.push(Object.assign({p:rect(h-m.w/24,zt-P.sl-m.d/12,h+m.w/24,zt-P.sl),dep:-1.02,L:"SECTION"},CUT))});
  // stairs
  P.stairs.forEach(function(Gs){Gs.steps.forEach(function(st){var ds=st.pts.map(Dd),mn=Math.min.apply(null,ds),mx=Math.max.apply(null,ds),z=P.zb+Math.min(st.z,P.H);
   if(mn<0&&mx>0){var r=clip(crossH(st.pts));if(r)items.push({p:rect(r[0],Math.max(P.zb,z-(st.landing?0.5:0.55)),r[1],z),fill:"#6b7280",c:"#111",w:0.25,dep:-0.95,L:"STAIRS"})}
   else if(mn>=0){var hs=st.pts.map(H),h0=Math.max(Math.min.apply(null,hs),c0),h1=Math.min(Math.max.apply(null,hs),c1);if(h1>h0)items.push({p:rect(h0,z-Gs.R,h1,z),fill:"#f1f1f1",c:"#9a9a9a",w:0.15,dep:(mn+mx)/2-0.01,L:"STAIRS"})}})})});
 // pitched roof profile
 var RG=roofGeom();if(RG){var pts=[];for(var h=c0;h<=c1+1e-6;h+=0.1){var z=roofZ(A.x+u.x*h,A.y+u.y*h);if(z!=null)pts.push([h,z])}if(pts.length>1){var poly=pts.concat(pts.slice().reverse().map(function(p){return [p[0],p[1]-0.4]}));items.push({p:poly,fill:"#8b4a2b",c:"#000",w:0.3,dep:-1.2,L:"ROOF"})}}
 return {items:items,lv:levelMarks(PK),title:"SECTION "+sec.name+"-"+sec.name}}
function viewBox(V){var b=[Infinity,Infinity,-Infinity,-Infinity];V.items.forEach(function(it){(it.p||[]).forEach(function(p){b[0]=Math.min(b[0],p[0]);b[1]=Math.min(b[1],p[1]);b[2]=Math.max(b[2],p[0]);b[3]=Math.max(b[3],p[1])});(it.lines||[]).forEach(function(l){b[0]=Math.min(b[0],l[0],l[2]);b[2]=Math.max(b[2],l[0],l[2]);b[1]=Math.min(b[1],l[1],l[3]);b[3]=Math.max(b[3],l[1],l[3])})});
 if(!isFinite(b[0]))b=[0,0,10,10];b[1]=Math.min(b[1],-PLH);return b}
/* draw view V into rectangle (x,y,w,h) of page; N = scale (1:N) or auto; num = view number */
function placeView(d,V,x,y,w,h,N,num){var b=viewBox(V),Wf=b[2]-b[0],Hf=b[3]-b[1];N=N||chooseScale(Wf+9,Hf+3,w-30,h-22);var k=304.8/N,cx=x+(w-30)/2+4,ox=cx-(b[0]+b[2])/2*k,oy=y+h-16-(-b[1])*k-(PLH+0.3)*k*0;
 var gy=y+h-17;oy=gy+(b[1])*k;function E(hh,z){return [ox+hh*k,oy-z*k]}
 var its=V.items.slice().sort(function(a,b2){return b2.dep-a.dep});
 its.forEach(function(it){var o={w:it.w||0.2,c:it.c||"#222222",L:it.L||"ELEV"};if(it.p){d.poly(it.p.map(function(p){return E(p[0],p[1])}),Object.assign({fill:it.fill,solid:it.fill==="#3a3a3a"},o))}
  (it.lines||[]).forEach(function(l){var a=E(l[0],l[1]),c=E(l[2],l[3]);d.line(a[0],a[1],c[0],c[1],{w:Math.min(o.w,0.18),c:it.c||"#444444",L:o.L})})});
 // ground line
 var g0=E(b[0]-3,-PLH),g1=E(b[2]+3,-PLH);d.line(g0[0],g0[1],g1[0],g1[1],{w:0.7,c:"#111111",L:"ELEV"});for(var hx=b[0]-3;hx<b[2]+3;hx+=0.8){var p=E(hx,-PLH);d.line(p[0],p[1],p[0]-1.2,p[1]+1.2,{w:0.1,c:"#777777",L:"ELEV"})}
 // level lines + heads
 var lx0=E(b[0]-2,0)[0],lx1=E(b[2]+2,0)[0];V.lv.concat([{z:-PLH,t:"GROUND LEVEL"}]).forEach(function(L){var yy=E(0,L.z)[1];d.line(lx0,yy,lx1,yy,{w:0.12,c:"#1d3f7a",dash:[2.2,1,0.4,1],L:"ANNO"});
  d.poly([[lx1+2,yy],[lx1+0.6,yy-1.4],[lx1+3.4,yy-1.4]],{w:0.12,fill:"#1d3f7a",c:"#1d3f7a",L:"ANNO"});d.text(lx1+4.2,yy-0.5,L.t,1.9,{bold:true,c:"#1d3f7a",L:"ANNO"});d.text(lx1+4.2,yy+2.3,(L.z<0?"-":"+")+fi(Math.abs(L.z)),1.8,{c:"#1d3f7a",L:"ANNO"})});
 // floor-to-floor dims on the left
 var dx=lx0-3,zs=V.lv.map(function(L){return L.z}).sort(function(a,b2){return a-b2});for(var i=0;i+1<zs.length;i++){var a=E(0,zs[i])[1],c=E(0,zs[i+1])[1];d.line(dx,a,dx,c,{w:0.15,c:"#1a1a1a",L:"DIMS"});[a,c].forEach(function(yy){d.line(dx-0.8,yy+0.8,dx+0.8,yy-0.8,{w:0.3,c:"#1a1a1a",L:"DIMS"})});d.text(dx-1.2,(a+c)/2,fi(zs[i+1]-zs[i]),2,{a:"middle",c:"#1a1a1a",L:"DIMS",rot:90})}
 // view title
 var vt=V.title,vc=[x+8,y+h-6];var cc=[];for(var j=0;j<=30;j++){var an=j/30*Math.PI*2;cc.push([vc[0]+3.6*Math.cos(an),vc[1]+3.6*Math.sin(an)])}d.poly(cc,{w:0.3,closed:false,nodxf:true});d.text(vc[0],vc[1]+1.1,String(num||1),3,{a:"middle",bold:true,nodxf:true});
 var vw=Math.max(tw(vt,3.4,true),40);d.line(vc[0]+3.6,vc[1],vc[0]+7+vw,vc[1],{w:0.45,nodxf:true});d.text(vc[0]+6,vc[1]-1.2,vt,3.4,{bold:true,nodxf:true});d.text(vc[0]+6,vc[1]+3.8,"SCALE "+scaleTxt(N),2.1,{nodxf:true});return N}
/* ---------- sheet set ---------- */
function plinthAll(){var p=0,c=0;S.L.forEach(function(L,i){if(!L.segs.length)return;var RI=withLevel(i,roomsInfo);p+=RI.plinth;c+=RI.carpet});return {plinth:p,carpet:c,faces:[]}}
function assignMarks(){var cnt={};S.L.forEach(function(L,i){withLevel(i,function(){S.ops.forEach(function(o){var G=opWorld(o);if(!G)return;var k=opKind(o);cnt[k]=(cnt[k]||0)+1;o._mark=k+cnt[k]})})})}
function dnoN(base,n){var s=String(base||"A101"),m=s.match(/^(.*?)(\d+)(\D*)$/);if(!m)return s+"-"+n;var v=String(+m[2]+n);while(v.length<m[2].length)v="0"+v;return m[1]+v+m[3]}
function sheetList(){var L=[],base=S.meta.dno||"A101",m=base.match(/^(.*?)(\d)(\d\d)(\D*)$/);function ser(sr,n){return m?m[1]+sr+String(+m[3]+n).padStart(2,"0")+m[4]:dnoN(base,sr*100+n)}var sr0=m?+m[2]:1;
 S.L.forEach(function(Lv,i){if(Lv.segs.length||i===0)L.push({key:"plan"+i,lv:i,no:ser(sr0,i),title:Lv.name+" Plan",short:Lv.name})});
 if(S.L.some(function(Lv){return Lv.segs.length}))L.push({key:"elev",no:ser(sr0+1,0),title:"Elevations",short:"Elevations N/S/E/W"});
 S.secs.forEach(function(s,i){L.push({key:"sec"+i,sec:i,no:ser(sr0+2,i),title:"Section "+s.name+"-"+s.name,short:"Section "+s.name})});
 L.push({key:"dw",no:ser(sr0+5,0),title:"Door & Window Details",short:"Door & Window"});return L}
/* Stage: Sheets - sheet set used by Export PDF */
function buildSheetSet(){var L=sheetList(),N=L.length,RIall=plinthAll(),PK=null;MARKG=true;assignMarks();
 try{L.forEach(function(sh,k){var lab=(k+1)+" / "+N;
  if(sh.lv!=null){var r=withLevel(sh.lv,function(){return buildSheet({title:sh.title,dno:sh.no,sheet:lab,noD2:true})});sh.d=r.d;sh.N=r.N;sh.RI=r.RI}
  else if(sh.key==="elev"){PK=PK||allPacks();var d=new Dwg();frameA(d);var Vs=["S","N","E","W"].map(function(k2){return elevView(k2,PK)}),bb=[0,0];Vs.forEach(function(V){var b=viewBox(V);bb[0]=Math.max(bb[0],b[2]-b[0]);bb[1]=Math.max(bb[1],b[3]-b[1])});
   var cw=(TBX-4-16)/2,ch=(281-16)/2,Nc=chooseScale(bb[0]+9,bb[1]+3,cw-30,ch-22);Vs.forEach(function(V,j){placeView(d,V,16+(j%2)*cw,16+Math.floor(j/2)*ch,cw,ch,Nc,j+1)});d.line(16+cw,16,16+cw,281,{w:0.15,c:"#9aa4b0",nodxf:true});d.line(16,16+ch,TBX-4,16+ch,{w:0.15,c:"#9aa4b0",nodxf:true});
   tblock(d,{title:"Elevations",dno:sh.no,sheet:lab,scale:scaleTxt(Nc),RI:RIall});sh.d=d;sh.N=Nc}
  else if(sh.sec!=null){PK=PK||allPacks();var d3=new Dwg();frameA(d3);var V=secView(S.secs[sh.sec],PK);var N3=placeView(d3,V,16,16,TBX-20,281-16-8,null,1);
   noteBox(d3,TBX-95,20,88,"SECTION NOTES",["Cut walls and RCC slabs shown dark.","Levels from ground floor FFL +0'-0\".","Plinth "+fi(PLH)+" above ground level.","Floor to floor: "+S.L.map(function(Lv){return fi(Lv.h)}).join(", ")],1.8);
   tblock(d3,{title:sh.title,dno:sh.no,sheet:lab,scale:scaleTxt(N3),RI:RIall});sh.d=d3;sh.N=N3}
  else if(sh.key==="dw"){var d4=new Dwg();frameA(d4);var G=[],sched=[];S.L.forEach(function(Lv,i){withLevel(i,function(){var RI=roomsInfo();S.ops.forEach(function(o){var q=opWorld(o);if(q){q.o=o;q.T=S.meta.dbl?wallT(q.s):0.5;q.RI=RI;G.push(q)}});
    var un=0;RI.faces.forEach(function(f){var l=f.labels[0];sched.push({name:(S.L.length>1&&Lv.segs.length?(Lv.name.split(" ")[0]+": "):"")+(l?l.name:"Room "+(++un)),f:f})})})});
   sheet2(d4,G,RIall,sched,{title:sh.title,dno:sh.no,sheet:lab});sh.d=d4}});
 }finally{MARKG=false}
 return {list:L,RI:RIall}}
function openSheetBy(key,i){SHEET=null;UI.sheetKey=key==="sec"?"sec"+i:key;setClean(true)}
/* clean view: show one sheet of the set */
function curSheet(){if(!SHEET||!SHEET.list)SHEET=buildSheetSet();var L=SHEET.list,i=L.findIndex(function(s){return s.key===UI.sheetKey});if(i<0){i=0;UI.sheetKey=L[0].key}return {sh:L[i],i:i,n:L.length}}
function paintSheet(){var c=curSheet(),DD=c.sh.d;g.fillStyle="#d9dee5";g.fillRect(0,0,CW,CH);g.fillStyle="#ffffff";g.shadowColor="rgba(0,0,0,.25)";g.shadowBlur=10;g.fillRect(SV.ox,SV.oy,420*SV.s,297*SV.s);g.shadowBlur=0;
 drawDwg(g,DD,SV.s,SV.ox,SV.oy);$("info").innerHTML="Sheet "+(c.i+1)+"/"+c.n+": <b>"+esc(c.sh.no+" "+c.sh.title)+"</b> · Built-up (all floors) <b>"+sq(SHEET.RI.plinth)+"</b> sq.ft · pinch to zoom"}
function lwScaled(d,f){if(Math.abs(f-1)<0.01)return d;var c=Object.create(Object.getPrototypeOf(d));Object.keys(d).forEach(function(k){c[k]=d[k]});c.p=d.p.map(function(p){if(p.w>0){var q=Object.assign({},p);q.w=p.w*f;return q}return p});return c}
/* Stage: Export - PDF tool (all sheets) */
function exportPDF(){if(!S.L.some(function(L){return L.segs.length})){toast("Draw something first");return}var r=buildSheetSet(),f=+S.meta.lw||1;
 saveFile(fname("pdf"),new Blob([bin(toPDF(r.list.map(function(s){return lwScaled(s.d,f)}),S.meta.paper||"A3"))],{type:"application/pdf"}),"application/pdf");toast("PDF: "+r.list.length+" sheets")}
var DXFL=["WALLS","WALLFILL","DIMS","TEXT","DOORS","WINDOWS","STAIRS","FURNITURE","COLUMNS","BEAMS","GRIDS","ANNO","DETAIL","RAILINGS","SECTION","ELEV","ROOF","FOOTINGS","TITLE"];
/* Stage: Export - DXF tool (current sheet) */
function exportDXF(){if(!needContent())return;var d,nm;if(UI.clean){var c=curSheet();d=c.sh.d;nm=c.sh.no}else{d=buildSheet({title:curLv().name+" Plan"}).d;nm=curLv().name}saveFile(fname("dxf").replace(/\.dxf$/,"_"+nm.replace(/[^A-Za-z0-9]+/g,"-")+".dxf"),new Blob([toDXF(d,DXFL)],{type:"application/dxf"}),"application/dxf")}
/* Stage: Export - PNG tool (current sheet) */
function exportPNG(){if(!needContent())return;var d=UI.clean?curSheet().sh.d:buildSheet({title:curLv().name+" Plan"}).d,c=document.createElement("canvas"),s=2480/420;c.width=2480;c.height=Math.round(297*s);var x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,c.width,c.height);drawDwg(x,d,s,0,0);
 c.toBlob(function(b){saveFile(fname("png"),b,"image/png")},"image/png")}
/* ---------- 3D: all levels stacked ---------- */
function build3D(){var M=T3.M;[T3.model,T3.edges,T3.labels,T3.env].forEach(clearGroup);var ti=topLevel(),rc=roofCfg(),PK=allPacks(),PL=PLH;
 PK.forEach(function(P,i){if(!P.walls.length&&!P.cols.length)return;var c0=T3.model.children.length,e0=T3.edges.children.length,l0=T3.labels.children.length;
  withLevel(i,function(){build3DLevel(P,i,ti,rc,M)});
  [[T3.model,c0],[T3.edges,e0],[T3.labels,l0]].forEach(function(q){for(var k=q[1];k<q[0].children.length;k++)q[0].children[k].position.y+=P.zb})});
 if(V3.roof){var RG=roofGeom();if(RG){var pos=[];RG.tris.forEach(function(t){t.p.forEach(function(p){pos.push(p.x,p.z,p.y)})});var geo=new THREE.BufferGeometry();geo.setAttribute("position",new THREE.Float32BufferAttribute(pos,3));geo.computeVertexNormals();
   var mt=M.roof.clone?M.roof.clone():M.roof;mt.side=THREE.DoubleSide;addMesh(geo,mt,"ROOF3D",null,0,{})}}
 var bb=bbox3();var span=Math.max(bb.sx,bb.sz,20);
 var gnd=new THREE.Mesh(new THREE.PlaneGeometry(span*14,span*14),M.grass);gnd.rotation.x=-Math.PI/2;gnd.position.set(bb.cx,-PL-0.01,bb.cz);gnd.receiveShadow=true;gnd.userData.env="ground";T3.env.add(gnd);
 var gs=Math.ceil(span*3/10)*10,grid=new THREE.GridHelper(gs,gs,0x5d6a78,0x323b46);grid.position.set(Math.round(bb.cx),-PL,Math.round(bb.cz));grid.userData.env="grid";T3.env.add(grid);
 var gmaj=new THREE.GridHelper(gs,gs/5,0x6f7c8a,0x46515e);gmaj.position.copy(grid.position);gmaj.position.y+=0.005;gmaj.userData.env="grid";T3.env.add(gmaj);
 var r=Math.max(bb.sx,bb.sz,bb.sy)*0.9+8;T3.sun.position.set(bb.cx+r*0.9,r*1.4,bb.cz+r*0.6);T3.sun.target.position.set(bb.cx,0,bb.cz);var sc=T3.sun.shadow.camera;sc.left=-r;sc.right=r;sc.top=r;sc.bottom=-r;sc.near=0.5;sc.far=r*5;sc.updateProjectionMatrix();
 T3.bb=bb;applyStyle()}
function build3DLevel(P,i,ti,rc,M){var RI=P.RI,H=P.H,sl=P.sl,PL=PLH,isTop=i===ti,showTop=!isTop||V3.roof,wallTop=isTop?(V3.roof?H:H-sl):H;
 var stairF=RI.faces.filter(function(f){return f.labels.some(function(l){return isStair(l.name)})});
 RI.faces.forEach(function(f,k){var mat=M.floorFor(FILLS[k%FILLS.length]);if(i===0){var m=slab(f.pts,-PL,0.0,[mat,M.plinth],"FLOOR3D",{cast:false});m.userData.real=[mat,M.plinth]}else slab(f.pts,0,0.03,mat,"FLOOR3D",{cast:false});
  if(showTop&&!(stairF.indexOf(f)>=0&&!isTop)&&(!isTop||rc.type==="flat"))slab(f.pts,H-sl,H,M.roof,isTop?"ROOF3D":"FLOOR3D")});
 P.walls.forEach(function(w){var s=w.s,a=w.a,u=w.u,L=w.L,t=w.t,e=t/2;if(i===0)wallBox(a,u,-e-0.04,L+e+0.04,-PL-0.02,0,t+0.12,M.plinth,"PLINTH3D",0,{edges:false});
  var top=wallTop,list=w.ops.map(function(q){var c=(q.G.c.x-a.x)*u.x+(q.G.c.y-a.y)*u.y;return {q:{o:q.o,g:q.G},s0:c-q.G.w/2,s1:c+q.G.w/2,sill:Math.min(opSill(q.o),H-0.3),hh:opH(q.o)}}).sort(function(p,q){return p.s0-q.s0});
  var cur=-e;list.forEach(function(it){wallBox(a,u,cur,it.s0,0,top,t,M.wall,"WALLS3D");var z1=Math.min(it.sill+it.hh,top-0.2);if(it.sill>0.01)wallBox(a,u,it.s0,it.s1,0,it.sill,t,M.wall,"WALLS3D");wallBox(a,u,it.s0,it.s1,z1,top,t,M.wall,"WALLS3D");
   if(!(it.q.o.type==="D"&&it.q.o.dk==="OP"))openingParts(it,a,u,t,z1,w.ext,w.out);cur=it.s1});
  wallBox(a,u,cur,L+e,0,top,t,M.wall,"WALLS3D");
  var par=showTop?w.par:0;if(par>0){var pt2=Math.min(t,0.5),of=w.out*(t-pt2)/2;wallBox(a,u,-e,L+e,top,top+par,pt2,M.wall,"WALLS3D",of);wallBox(a,u,-e-0.08,L+e+0.08,top+par,top+par+0.25,pt2+0.18,M.coping,"ROOF3D",of)}});
 P.stairs.forEach(function(G){G.steps.forEach(function(st){slab(st.pts,Math.max(0,Math.min(st.z,H)-(st.landing?0.5:1.2)),Math.min(st.z,H),M.stair,"STAIRS3D")})});
 P.cols.forEach(function(c){var a=c.rot*Math.PI/180||0,u={x:Math.cos(a),y:Math.sin(a)},w=c.w/12,dd=c.d/12;wallBox({x:c.x-u.x*w/2,y:c.y-u.y*w/2},u,0,w,i===0?-PL:0,H,dd+0.02,M.coping,"COLUMNS3D")});
 P.beams.forEach(function(m){var L=Math.hypot(m.b.x-m.a.x,m.b.y-m.a.y);if(L<0.1)return;var u={x:(m.b.x-m.a.x)/L,y:(m.b.y-m.a.y)/L};wallBox(m.a,u,0,L,H-sl-m.d/12,H-sl,m.w/12+0.02,M.coping,"BEAMS3D")});
 P.rails.forEach(function(m){var L=Math.hypot(m.b.x-m.a.x,m.b.y-m.a.y);if(L<0.1)return;var u={x:(m.b.x-m.a.x)/L,y:(m.b.y-m.a.y)/L},h=m.h||3;wallBox(m.a,u,0,L,h-0.15,h,0.2,M.handle,"RAIL3D");var n=Math.max(1,Math.ceil(L/4));for(var k=0;k<=n;k++){var s0=L*k/n;wallBox(m.a,u,Math.max(0,s0-0.06),Math.min(L,s0+0.06)||0.12,0,h-0.15,0.12,M.handle,"RAIL3D",0,{edges:false})}
  var nb=Math.floor(L/0.4);for(var j=1;j<nb;j++){var s1=L*j/nb;wallBox(m.a,u,s1-0.02,s1+0.02,0.3,h-0.15,0.04,M.handle,"RAIL3D",0,{edges:false,cast:false})}});
 (S.furn||[]).forEach(function(f){try{furn3D(f)}catch(e){console.warn("furn",f.type,e)}});try{kc3DAll(0)}catch(e){console.warn("kc",e)}
 RI.faces.forEach(function(f){var l=f.labels[0],name=l?l.name:"Room",at=l||{x:f.cx,y:f.cy};var sp=textSprite((S.L.length>1?S.L[i].name.split(" ")[0]+": ":"")+name.toUpperCase()+"\n"+sizeText(f)+"  "+sq(f.carpet!=null?f.carpet:f.area)+" sq.ft",{bg:"rgba(255,255,255,.88)",size:40});
  var w=Math.min(Math.max(f.w*0.42,3.2),5.5);sp.scale.set(w,w/sp.userData.aspect,1);sp.position.set(at.x,isTop?H+1.2:H*0.55,at.y);T3.labels.add(sp)})}
function bbox3(){var mx=Infinity,mz=Infinity,Mx=-Infinity,Mz=-Infinity;S.L.forEach(function(L){L.pts.forEach(function(p){mx=Math.min(mx,p.x);mz=Math.min(mz,p.y);Mx=Math.max(Mx,p.x);Mz=Math.max(Mz,p.y)})});if(!isFinite(mx)){mx=mz=0;Mx=Mz=10}
 var ti=topLevel(),RG=V3.roof?roofGeom():null,H=lvElev(ti)+S.L[ti].h+(V3.roof?(RG?RG.zr-RG.z0:3.25):0);return {cx:(mx+Mx)/2,cz:(mz+Mz)/2,cy:(H-1.5)/2,sx:Mx-mx,sz:Mz-mz,sy:H+1.5,min:new THREE.Vector3(mx,-1.5,mz),max:new THREE.Vector3(Mx,H,Mz)}}
/* ---------- plan sheet extras (columns, beams, grids, dims, notes, spots, detail lines, railings, section marks) ---------- */
function planTitle(O){if(S.cur===0&&S.meta.ttl&&(S.L.length===1||S.meta.ttl!=="Ground Floor Plan"))return S.meta.ttl;return O.title||(curLv().name+" Plan")}
function planExt(ext){S.cols.forEach(function(c){colPoly(c).forEach(ext)});if(typeof colsFromBelow==="function")colsFromBelow(S.cur).forEach(function(gh){colPoly(gh.c).forEach(ext)});S.beams.concat(S.rails,S.dlines,S.dims).forEach(function(m){ext(m.a);ext(m.b)});
 if(visOn("grids"))S.grids.forEach(function(m){ext(m.a);ext(m.b)});S.notes.forEach(function(n){var b=noteBox(n);ext({x:b[0],y:b[1]});ext({x:b[2],y:b[3]})});S.spots.forEach(ext);S.secs.forEach(function(m){ext(m.a);ext(m.b)})}
function planExtras(d,R,k){function P(p){return R(p.x,p.y)}function ln(a,b,o){var A=P(a),B=P(b);d.line(A[0],A[1],B[0],B[1],o)}
 function circ(c,r,o){var pts=[];for(var i=0;i<=32;i++){var a=i/32*Math.PI*2;pts.push([c[0]+r*Math.cos(a),c[1]+r*Math.sin(a)])}d.poly(pts,Object.assign({closed:false},o))}
 if(visOn("beams"))S.beams.forEach(function(m){d.poly(beamPoly(m).map(P),{w:0.18,c:"#5a3a1a",dash:[1.6,0.8],L:"BEAMS"});var c=P({x:(m.a.x+m.b.x)/2,y:(m.a.y+m.b.y)/2}),L=Math.hypot(m.b.x-m.a.x,m.b.y-m.a.y);if(L*k>18)d.text(c[0],c[1]-m.w/24*k-0.8,"B "+m.w+"x"+m.d,1.5,{a:"middle",c:"#5a3a1a",L:"BEAMS",rot:ang2page(m.b.x-m.a.x,m.b.y-m.a.y)})});
 if(visOn("rails"))S.rails.forEach(function(m){var L=Math.hypot(m.b.x-m.a.x,m.b.y-m.a.y)||1,n={x:-(m.b.y-m.a.y)/L*0.12,y:(m.b.x-m.a.x)/L*0.12};ln({x:m.a.x+n.x,y:m.a.y+n.y},{x:m.b.x+n.x,y:m.b.y+n.y},{w:0.2,c:"#222222",L:"RAILINGS"});ln({x:m.a.x-n.x,y:m.a.y-n.y},{x:m.b.x-n.x,y:m.b.y-n.y},{w:0.2,c:"#222222",L:"RAILINGS"})});
 if(visOn("cols")){if(typeof colsFromBelow==="function")colsFromBelow(S.cur).forEach(function(gh){d.poly(colPoly(gh.c).map(P),{w:0.22,c:"#1d4ed8",dash:[1.2,0.8],L:"COLUMNS"})});
  S.cols.forEach(function(c,i){d.poly(colPoly(c).map(P),{w:0.3,c:"#000000",fill:"#1a1a1a",solid:true,L:"COLUMNS"})})}
 if(visOn("grids"))S.grids.forEach(function(m){var A=P(m.a),B=P(m.b),L=Math.hypot(B[0]-A[0],B[1]-A[1])||1,ux=(B[0]-A[0])/L,uy=(B[1]-A[1])/L,r=3.4;d.line(A[0],A[1],B[0],B[1],{w:0.18,c:"#555555",dash:[7,1.2,1.2,1.2],L:"GRIDS"});
  [[A[0]-ux*r,A[1]-uy*r],[B[0]+ux*r,B[1]+uy*r]].forEach(function(c){circ(c,r,{w:0.25,c:"#222222",L:"GRIDS"});d.text(c[0],c[1]+1.1,ascii(m.name),3.1,{a:"middle",bold:true,L:"GRIDS"})})});
 if(visOn("dims"))S.dims.forEach(function(m){var G=dimGeom(m),A=P(G.A),B=P(G.B),a=P(m.a),b=P(m.b),o={w:0.18,c:"#1a1a1a",L:"DIMS"};d.line(A[0],A[1],B[0],B[1],o);
  var ex=[A[0]-a[0],A[1]-a[1]],el=Math.hypot(ex[0],ex[1]);[[a,A],[b,B]].forEach(function(q){if(el>0.5)d.line(q[0][0]+ex[0]/el*1.2,q[0][1]+ex[1]/el*1.2,q[1][0]+ex[0]/el*1.5,q[1][1]+ex[1]/el*1.5,{w:0.13,c:"#1a1a1a",L:"DIMS"})});
  var ux=(B[0]-A[0]),uy=(B[1]-A[1]),ul=Math.hypot(ux,uy)||1;ux/=ul;uy/=ul;[A,B].forEach(function(p){d.line(p[0]-(ux-uy)*0.9,p[1]-(uy+ux)*0.9,p[0]+(ux-uy)*0.9,p[1]+(uy+ux)*0.9,{w:0.3,c:"#1a1a1a",L:"DIMS"})});
  var rot=ang2page(ux,uy),nx=uy,ny=-ux;if(rot!==Math.atan2(-uy,ux)*180/Math.PI){nx=-nx;ny=-ny}var tp=[(A[0]+B[0])/2+nx*1.3,(A[1]+B[1])/2+ny*1.3];d.text(tp[0],tp[1],fi(G.L),2.3*txtF(),{a:"middle",v:"mid",c:"#1a1a1a",L:"DIMS",rot:rot})});
 if(visOn("text"))S.notes.forEach(function(n){var p=P(n),s=Math.max(1.8,noteH(n)*k);String(n.t||"").split("\n").forEach(function(l,i){d.text(p[0],p[1]+i*s*1.25,ascii(l),s,{bold:!!n.b,L:"ANNO"})})});
 if(visOn("text"))S.spots.forEach(function(sp){var p=P(sp);d.poly([[p[0],p[1]],[p[0]-1.3,p[1]-2],[p[0]+1.3,p[1]-2]],{w:0.15,c:"#1a1a1a",fill:"#1a1a1a",L:"ANNO"});d.line(p[0]+1.3,p[1]-2,p[0]+16,p[1]-2,{w:0.15,c:"#1a1a1a",L:"ANNO"});d.text(p[0]+1.8,p[1]-2.6,(sp.lab||"FFL")+" "+lvl(spotZ(sp)),2.1,{bold:true,L:"ANNO"})});
 if(visOn("dlines"))S.dlines.forEach(function(m){ln(m.a,m.b,{w:0.18,c:"#222222",dash:m.st==="dash"?[1.5,0.8]:undefined,L:"DETAIL"})});
 if(visOn("secs"))S.secs.forEach(function(m){var G=secGeom(m),A=P(m.a),B=P(m.b);d.line(A[0],A[1],B[0],B[1],{w:0.5,c:"#111111",dash:[8,1.5,1.5,1.5],L:"SECTION"});
  [[m.a,-1],[m.b,1]].forEach(function(q){var p=P(q[0]),hx=G.n.x,hy=G.n.y,c=[p[0]+G.u.x*q[1]*4.5,p[1]+G.u.y*q[1]*4.5];d.poly([[p[0],p[1]],[p[0]+hx*4-G.u.x*1.6,p[1]+hy*4-G.u.y*1.6],[p[0]+hx*4+G.u.x*1.6,p[1]+hy*4+G.u.y*1.6]],{w:0.1,c:"#111111",fill:"#111111",L:"SECTION"});
   circ(c,3.2,{w:0.3,c:"#111111",L:"SECTION"});d.text(c[0],c[1]+1.1,ascii(m.name),3,{a:"middle",bold:true,L:"SECTION"})})})}
