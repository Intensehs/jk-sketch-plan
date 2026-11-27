/* ================= v1.3 STRUCTURE + STAIRS + ROOF ================= */
var COLSZ=[[9,9],[9,12],[12,12],[9,15],[12,18]],BEAMSZ=[[9,12],[9,15],[9,18],[9,24]];
/* ---------- stairs: straight / L / U (dog-legged), risers from floor-to-floor height ---------- */
function stairGeom(f,lab){var sd=f.side,db=S.meta.dbl&&sd,il=db?sd.l/2:0.25,ir=db?sd.r/2:0.25,it=db?sd.t/2:0.25,ib=db?sd.b/2:0.25,x0=f.bx+il,y0=f.by+it,w=f.w-il-ir,h=f.h-it-ib;if(w<1.5||h<1.5)return null;
 var st=(lab&&lab.st)||{},type=st.type||"straight",H=wallH(),nR=Math.max(2,Math.ceil(H/(7/12)-1e-6)),R=H/nR,T0=(st.tread||10)/12,horiz=w>=h,L=horiz?w:h,W=horiz?h:w,fl=lab&&lab.flip,sw=lab&&lab.swap;
 function P(a,b){if(fl)a=L-a;if(sw)b=W-b;return horiz?{x:x0+a,y:y0+b}:{x:x0+b,y:y0+a}}
 function rect(a0,b0,a1,b1){return [P(a0,b0),P(a1,b0),P(a1,b1),P(a0,b1)]}
 var G={type:type,horiz:horiz,L:L,W:W,nR:nR,R:R,T:T0,box:rect(0,0,L,W),treads:[],steps:[],arrow:[],warn:""};
 if(type==="U"&&W<4.5)type=G.type="straight";
 if(type==="L"&&(W<5||L<6))type=G.type="straight";
 if(type==="straight"){var nT=nR-1,land=Math.min(Math.max(3,W*0.6),L*0.35),T=Math.min(T0,(L-land)/nT);if(T<9/12)G.warn="Room too short: needs "+fi(nT*9/12+3)+" for "+nR+" risers";T=Math.max(T,0.3);var run=nT*T;land=L-run;
  for(var i=1;i<=nT;i++)G.treads.push([P(i*T,0),P(i*T,W)]);
  for(i=0;i<nT;i++)G.steps.push({pts:rect(i*T,0,(i+1)*T,W),z:(i+1)*R});G.steps.push({pts:rect(run,0,L,W),z:H,landing:true});
  var c=run*0.55;G.cut=[P(c-W*0.35,W),P(c-0.15,W*0.56),P(c+0.15,W*0.44),P(c+W*0.35,0)];G.arrow=[P(T*0.5,W/2),P(run+land*0.55,W/2)];G.n=nT;G.run=run;G.land=land;G.T=T;G.up=P(T*0.5+Math.min(1.2,run*0.15),W/2+Math.min(0.9,W*0.22))}
 else if(type==="U"){var gap=0.33,Wf=(W-gap)/2,Wl=Math.max(Wf,3),n1=Math.ceil(nR/2),n2=nR-n1,av=L-Wl,T=Math.min(T0,av/Math.max(n1-1,n2-1,1));if(T<9/12)G.warn="Room too short for U stair: needs "+fi(Math.max(n1-1,n2-1)*9/12+Wl);T=Math.max(T,0.3);
  for(var i=0;i<n1-1;i++){G.steps.push({pts:rect(i*T,0,(i+1)*T,Wf),z:(i+1)*R});G.treads.push([P((i+1)*T,0),P((i+1)*T,Wf)])}
  G.steps.push({pts:rect(L-Wl,0,L,W),z:n1*R,landing:true});G.treads.push([P(L-Wl,0),P(L-Wl,W)]);
  for(var j=0;j<n2-1;j++){var a1=L-Wl-j*T,a0=a1-T;G.steps.push({pts:rect(a0,W-Wf,a1,W),z:(n1+j+1)*R});G.treads.push([P(a0,W-Wf),P(a0,W)])}
  G.treads.push([P(0,Wf),P(L-Wl,Wf)]);G.treads.push([P(0,W-Wf),P(L-Wl,W-Wf)]);
  var e2=L-Wl-(n2-1)*T;G.arrow=[P(T*0.5,Wf/2),P(L-Wl/2,Wf/2),P(L-Wl/2,W-Wf/2),P(e2+T*0.5,W-Wf/2)];var c=(n1-1)*T*0.6;G.cut=[P(c-0.6,Wf),P(c-0.1,Wf*0.56),P(c+0.1,Wf*0.44),P(c+0.6,0)];
  G.n=nR-2;G.run=(n1-1)*T;G.land=Wl;G.T=T;G.up=P(T*0.5+0.9,Wf/2+Math.min(0.7,Wf*0.25))}
 else{/* L */var Wf=Math.min(Math.max(3,W*0.45),W-2),nT=nR-2,av1=L-Wf,av2=W-Wf,n2=Math.max(1,Math.round(nT*av2/(av1+av2))),n1=nT-n2,T=Math.min(T0,av1/Math.max(n1,1),av2/Math.max(n2,1));if(T<9/12)G.warn="Room too small for L stair";T=Math.max(T,0.3);
  for(var i=0;i<n1;i++){G.steps.push({pts:rect(i*T,0,(i+1)*T,Wf),z:(i+1)*R});G.treads.push([P((i+1)*T,0),P((i+1)*T,Wf)])}
  G.steps.push({pts:rect(L-Wf,0,L,Wf),z:(n1+1)*R,landing:true});G.treads.push([P(L-Wf,0),P(L-Wf,Wf)]);
  for(var j=0;j<n2;j++){G.steps.push({pts:rect(L-Wf,Wf+j*T,L,Wf+(j+1)*T),z:(n1+2+j)*R});G.treads.push([P(L-Wf,Wf+(j+1)*T),P(L,Wf+(j+1)*T)])}
  G.treads.push([P(0,Wf),P(L-Wf,Wf)]);G.treads.push([P(L-Wf,Wf),P(L-Wf,Wf+n2*T)]);
  G.arrow=[P(T*0.5,Wf/2),P(L-Wf/2,Wf/2),P(L-Wf/2,Wf+n2*T-T*0.5)];var c=n1*T*0.6;G.cut=[P(c-0.6,Wf),P(c-0.1,Wf*0.56),P(c+0.1,Wf*0.44),P(c+0.6,0)];
  G.n=nT;G.run=n1*T;G.land=Wf;G.T=T;G.up=P(T*0.5+0.9,Wf/2+Math.min(0.7,Wf*0.25))}
 var A=G.arrow,e=A[A.length-1],q0=A[A.length-2],ux=e.x-q0.x,uy=e.y-q0.y,ul=Math.hypot(ux,uy)||1;ux/=ul;uy/=ul;var hl=Math.min(0.9,ul*0.4),hw=0.4,q={x:e.x-ux*hl,y:e.y-uy*hl};
 G.head=[e,{x:q.x-uy*hw,y:q.y+ux*hw},{x:q.x+uy*hw,y:q.y-ux*hw}];G.ang=Math.atan2(A[1].y-A[0].y,A[1].x-A[0].x);
 G.info=nR+" risers @ "+fmt(R*12,1)+"\" · treads "+fmt(G.T*12,1)+"\"";return G}
/* Stage: Circulation - Stair tool */
function stairPopup(x,y){var RI=roomsInfo(),f=faceAt(x,y,RI.faces);if(!f){toast("Tap inside a closed room to make it a staircase");return}
 var lab=f.labels.find(function(l){return isStair(l.name)});
 if(!lab){snapshot();lab={id:nid(),x:f.cx,y:f.cy,name:"Staircase",st:{type:"straight"}};if(f.labels[0]&&!isStair(f.labels[0].name)){lab.x=f.labels[0].x;lab.y=f.labels[0].y;f.labels[0].name="Staircase";lab=f.labels[0];lab.st={type:"straight"}}else S.labels.push(lab);changed()}
 lab.st=lab.st||{type:"straight"};
 function body(){var G=stairGeom(f,lab)||{};return '<div class="mt">Staircase / படிக்கட்டு</div><div class="ms">Floor to floor '+fi(wallH())+' → <b>'+(G.info||"-")+'</b>'+(G.warn?'<br><span class="warn">'+G.warn+'</span>':'')+'</div>'+
  '<div class="grid2">'+[["straight","Straight","நேர்"],["L","L-shape","L வடிவம்"],["U","U / dog-legged","U வடிவம்"]].map(function(t){return '<button class="bb'+(lab.st.type===t[0]?' on':'')+'" data-sty="'+t[0]+'">'+t[1]+'<small>'+t[2]+'</small></button>'}).join("")+'</div>'+
  '<div class="row"><button class="bb" id="stFl">Flip UP direction ⇆</button><button class="bb" id="stSw">Swap side ⇅</button></div>'+
  '<div class="row"><button class="bb" id="stTd">Tread −1"</button><div class="bb" style="display:flex;align-items:center;justify-content:center">Tread '+(lab.st.tread||10)+'"</div><button class="bb" id="stTu">Tread +1"</button></div>'+
  '<div class="row"><button class="bb ok" id="stOk">Done</button></div>'}
 function bind(box){box.querySelectorAll("[data-sty]").forEach(function(b){b.onclick=function(){snapshot();lab.st.type=b.dataset.sty;changed();re()}});
  $("stFl").onclick=function(){snapshot();lab.flip=!lab.flip;changed();re()};$("stSw").onclick=function(){snapshot();lab.swap=!lab.swap;changed();re()};
  $("stTd").onclick=function(){snapshot();lab.st.tread=Math.max(8,(lab.st.tread||10)-1);changed();re()};$("stTu").onclick=function(){snapshot();lab.st.tread=Math.min(12,(lab.st.tread||10)+1);changed();re()};$("stOk").onclick=closeModal}
 function re(){$("mbox").innerHTML=body();bind($("mbox"))}modal(body(),bind)}
/* ---------- snapping for structure / annotation picks ---------- */
function gridXs(){var out=[];for(var i=0;i<S.grids.length;i++)for(var j=i+1;j<S.grids.length;j++){var A=S.grids[i],B=S.grids[j],L1=Math.hypot(A.b.x-A.a.x,A.b.y-A.a.y);if(L1<1e-6)continue;var u={x:(A.b.x-A.a.x)/L1,y:(A.b.y-A.a.y)/L1},I=segIntersect(A.a,u,B.a,B.b);if(I&&I.r>=-0.01&&I.r<=L1+0.01&&I.t>=-0.01&&I.t<=1.01)out.push({x:A.a.x+u.x*I.r,y:A.a.y+u.y*I.r})}return out}
function snapPick(w,opt){opt=opt||{};var R=snapR()*1.3,best=null,bd=R;
 S.pts.forEach(function(p){var d=Math.hypot(p.x-w.x,p.y-w.y);if(d<bd){bd=d;best={x:p.x,y:p.y,snap:"pt"}}});
 gridXs().forEach(function(p){var d=Math.hypot(p.x-w.x,p.y-w.y);if(d<bd){bd=d;best={x:p.x,y:p.y,snap:"grid"}}});
 if(!opt.noCol)S.cols.forEach(function(c){var d=Math.hypot(c.x-w.x,c.y-w.y);if(d<bd){bd=d;best={x:c.x,y:c.y,snap:"col"}}});
 if(best)return best;
 if(opt.face&&S.meta.dbl){var bf=null,bfd=R*0.8;S.segs.forEach(function(s){var a=pt(s.a),b=pt(s.b),L=segLen(s);if(L<1e-6)return;var n={x:-(b.y-a.y)/L,y:(b.x-a.x)/L},t=wallT(s)/2;[1,-1].forEach(function(sg){var A={x:a.x+n.x*t*sg,y:a.y+n.y*t*sg},B={x:b.x+n.x*t*sg,y:b.y+n.y*t*sg},q=projSeg(w.x,w.y,A,B);if(q.d<bfd&&q.t>-0.05&&q.t<1.05){bfd=q.d;var al=Math.abs(n.x)>0.99?{x:q.x,y:gsnap(q.y)}:Math.abs(n.y)>0.99?{x:gsnap(q.x),y:q.y}:{x:q.x,y:q.y};bf={x:al.x,y:al.y,snap:"face"}}})});if(bf)return bf}
 var sg=findSeg(w.x,w.y,R);if(sg&&opt.onWall)return {x:sg.x,y:sg.y,snap:"seg"};
 var st=opt.fine?0.25:0.5;return {x:Math.round(w.x/st)*st,y:Math.round(w.y/st)*st}}
/* ---------- columns ---------- */
function colPoly(c){var a=(c.rot||0)*Math.PI/180,cs=Math.cos(a),sn=Math.sin(a),hw=c.w/24,hd=c.d/24;return [[-hw,-hd],[hw,-hd],[hw,hd],[-hw,hd]].map(function(p){return {x:c.x+p[0]*cs-p[1]*sn,y:c.y+p[0]*sn+p[1]*cs}})}
/* Stage: Structure - Column tool */
function addCol(x,y,quiet){if(S.cols.some(function(c){return Math.hypot(c.x-x,c.y-y)<0.4}))return null;var z=UI.colSz||[9,9],c={id:nid(),x:x,y:y,w:z[0],d:z[1],rot:UI.colRot||0};S.cols.push(c);return c}
function autoCols(){snapshot();var n=0,deg={};S.segs.forEach(function(s){(deg[s.a]=deg[s.a]||[]).push(s);(deg[s.b]=deg[s.b]||[]).push(s)});
 S.pts.forEach(function(p){var L=deg[p.id]||[];if(!L.length)return;var turn=L.length!==2;if(L.length===2){var u=segDir(L[0],p.id),v=segDir(L[1],p.id);turn=Math.abs(u.x*v.y-u.y*v.x)>0.05}if(turn&&addCol(p.x,p.y))n++});
 changed();toast(n+" columns placed at wall corners / junctions")}
function segDir(s,from){var a=pt(from),o=pt(s.a===from?s.b:s.a),L=Math.hypot(o.x-a.x,o.y-a.y)||1;return {x:(o.x-a.x)/L,y:(o.y-a.y)/L}}
function gridCols(){var X=gridXs();if(!X.length){toast("No grid intersections - add grids first (Annotate → Grid)");return}snapshot();var n=0;X.forEach(function(p){if(addCol(p.x,p.y))n++});changed();toast(n+" columns at grid intersections")}
/* ---------- beams ---------- */
/* Stage: Structure - Beam tool */
function addBeam(a,b){var z=UI.beamSz||[9,18];var bm={id:nid(),a:{x:a.x,y:a.y},b:{x:b.x,y:b.y},w:z[0],d:z[1]};S.beams.push(bm);return bm}
function autoBeams(){snapshot();var n=0,done={};S.segs.forEach(function(s){var r=wallRun(s),k=r.ids.slice().sort().join(",");if(done[k])return;done[k]=1;var a=pt(r.a),b=pt(r.b);
  if(S.beams.some(function(m){return (Math.hypot(m.a.x-a.x,m.a.y-a.y)<0.1&&Math.hypot(m.b.x-b.x,m.b.y-b.y)<0.1)||(Math.hypot(m.a.x-b.x,m.a.y-b.y)<0.1&&Math.hypot(m.b.x-a.x,m.b.y-a.y)<0.1)}))return;var bm=addBeam(a,b);bm.w=Math.max(bm.w,wallIn(s));n++});
 changed();toast(n+" beams placed over the walls (lintel/roof beams)")}
function beamPoly(m){var L=Math.hypot(m.b.x-m.a.x,m.b.y-m.a.y)||1,nx=-(m.b.y-m.a.y)/L*m.w/24,ny=(m.b.x-m.a.x)/L*m.w/24;return [{x:m.a.x+nx,y:m.a.y+ny},{x:m.b.x+nx,y:m.b.y+ny},{x:m.b.x-nx,y:m.b.y-ny},{x:m.a.x-nx,y:m.a.y-ny}]}
/* ---------- roof (top level): flat slab + parapet, gable, hip ---------- */
function roofCfg(){return S.meta.roof||{type:"flat",par:3,pitch:25,ov:1.5,ridge:"auto"}}
/* triangles in world feet (x, y plan, z up) for gable / hip roofs over the top level; null for flat */
function roofGeom(){var rc=roofCfg();if(rc.type==="flat")return null;var ti=topLevel(),z0=lvElev(ti)+S.L[ti].h;
 var bx=withLevel(ti,function(){var x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;S.segs.forEach(function(s){var P=S.meta.dbl?wallPoly(s):[pt(s.a),pt(s.b)];(P||[]).forEach(function(p){x0=Math.min(x0,p.x);y0=Math.min(y0,p.y);x1=Math.max(x1,p.x);y1=Math.max(y1,p.y)})});return [x0,y0,x1,y1]});
 if(!isFinite(bx[0]))return null;var ov=+rc.ov||0,tn=Math.tan((+rc.pitch||25)*Math.PI/180),X0=bx[0]-ov,Y0=bx[1]-ov,X1=bx[2]+ov,Y1=bx[3]+ov;
 var alongX=rc.ridge==="x"?true:rc.ridge==="y"?false:(X1-X0)>=(Y1-Y0);
 function V(a,b,z){return alongX?{x:a,y:b,z:z}:{x:b,y:a,z:z}}
 var A0=alongX?X0:Y0,A1=alongX?X1:Y1,B0=alongX?Y0:X0,B1=alongX?Y1:X1,hb=(B1-B0)/2,ze=z0-ov*tn,zr=ze+hb*tn,bm=(B0+B1)/2,T=[];
 var w0=alongX?bx[0]:bx[1],w1=alongX?bx[2]:bx[3],c0=alongX?bx[1]:bx[0],c1=alongX?bx[3]:bx[2];
 if(rc.type==="gable"){T.push({k:"roof",p:[V(A0,B0,ze),V(A1,B0,ze),V(A1,bm,zr)]},{k:"roof",p:[V(A0,B0,ze),V(A1,bm,zr),V(A0,bm,zr)]},{k:"roof",p:[V(A0,bm,zr),V(A1,bm,zr),V(A1,B1,ze)]},{k:"roof",p:[V(A0,bm,zr),V(A1,B1,ze),V(A0,B1,ze)]});
  [w0,w1].forEach(function(a){T.push({k:"gable",p:[V(a,c0,z0),V(a,c1,z0),V(a,bm,zr)]})})}
 else{var r0=Math.min(A0+hb,(A0+A1)/2),r1=Math.max(A1-hb,(A0+A1)/2);
  T.push({k:"roof",p:[V(A0,B0,ze),V(A1,B0,ze),V(r1,bm,zr)]},{k:"roof",p:[V(A0,B0,ze),V(r1,bm,zr),V(r0,bm,zr)]},{k:"roof",p:[V(r0,bm,zr),V(r1,bm,zr),V(A1,B1,ze)]},{k:"roof",p:[V(r0,bm,zr),V(A1,B1,ze),V(A0,B1,ze)]},
   {k:"roof",p:[V(A0,B1,ze),V(A0,B0,ze),V(r0,bm,zr)]},{k:"roof",p:[V(A1,B0,ze),V(A1,B1,ze),V(r1,bm,zr)]})}
 return {tris:T,ze:ze,zr:zr,z0:z0,box:[X0,Y0,X1,Y1]}}
function roofZ(x,y){var G=roofGeom();if(!G)return null;var best=null;G.tris.forEach(function(t){if(t.k!=="roof")return;var p=t.p,P2=p.map(function(q){return {x:q.x,y:q.y}});if(!inPoly(x,y,P2))return;
  var a=p[0],b=p[1],c=p[2],ux=b.x-a.x,uy=b.y-a.y,uz=b.z-a.z,vx=c.x-a.x,vy=c.y-a.y,vz=c.z-a.z,nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;if(Math.abs(nz)<1e-9)return;var z=a.z-(nx*(x-a.x)+ny*(y-a.y))/nz;if(best==null||z>best)best=z});return best}
/* Stage: Build - Roof tool */
function roofPopup(){var rc=JSON.parse(JSON.stringify(roofCfg()));
 function body(){return '<div class="mt">Roof / கூரை</div><div class="ms">Roof over the top level ('+esc(S.L[topLevel()].name)+'). 3D, elevations and sections use it.</div><div class="grid2">'+
  [["flat","Flat RCC slab","parapet wall"],["gable","Gable","2 slopes"],["hip","Hip","4 slopes"]].map(function(t){return '<button class="bb'+(rc.type===t[0]?' on':'')+'" data-rf="'+t[0]+'">'+t[1]+'<small>'+t[2]+'</small></button>'}).join("")+'</div>'+
  (rc.type==="flat"?'<label class="fld">Parapet height (ft-in)<input id="rfP" value="'+fi(rc.par)+'"></label>':'<div class="row"><label class="fld">Pitch (degrees)<input id="rfA" type="number" value="'+rc.pitch+'"></label><label class="fld">Overhang (ft-in)<input id="rfO" value="'+fi(rc.ov)+'"></label></div><div class="grid2">'+[["auto","Ridge: auto"],["x","Ridge E-W"],["y","Ridge N-S"]].map(function(t){return '<button class="bb'+(rc.ridge===t[0]?' on':'')+'" data-rr="'+t[0]+'">'+t[1]+'</button>'}).join("")+'</div>')+
  '<div class="row"><button class="bb" id="rfX">Cancel</button><button class="bb ok" id="rfOk">Save</button></div>'}
 function rd(){if($("rfP")){var p=parseFI($("rfP").value);if(p>=0&&p<=8)rc.par=p}if($("rfA")){var a=+$("rfA").value;if(a>=5&&a<=60)rc.pitch=a}if($("rfO")){var o=parseFI($("rfO").value);if(o>=0&&o<=5)rc.ov=o}}
 function bind(box){box.querySelectorAll("[data-rf]").forEach(function(b){b.onclick=function(){rd();rc.type=b.dataset.rf;re()}});box.querySelectorAll("[data-rr]").forEach(function(b){b.onclick=function(){rd();rc.ridge=b.dataset.rr;re()}});
  $("rfX").onclick=closeModal;$("rfOk").onclick=function(){rd();snapshot();S.meta.roof=rc;closeModal();changed();toast("Roof: "+rc.type)}}
 function re(){$("mbox").innerHTML=body();bind($("mbox"))}modal(body(),bind)}
/* Stage: Build - Floor / Ceiling tool */
function floorPopup(){var L=curLv();modal('<div class="mt">Floor / slab - '+esc(L.name)+'</div><div class="ms">Floor slab is made from the closed rooms automatically (like Revit "Floor by walls").</div>'+
 '<div class="row"><label class="fld">Floor to floor height<input id="flH" value="'+fi(L.h)+'"></label><label class="fld">Slab thickness (inch)<input id="flT" type="number" value="'+L.slab+'"></label><label class="fld">Ceiling height<input id="flC" value="'+fi(L.ceil)+'"></label></div>'+
 '<div class="row"><button class="bb" id="flX">Cancel</button><button class="bb ok" id="flOk">Save</button></div>',function(){$("flX").onclick=closeModal;
 $("flOk").onclick=function(){var h=parseFI($("flH").value),t=+$("flT").value,c=parseFI($("flC").value);snapshot();if(h>=7&&h<=30)L.h=h;if(t>=3&&t<=12)L.slab=t;if(c>=6&&c<=L.h)L.ceil=c;closeModal();changed();updLevelBadge()}})}
