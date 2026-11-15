/* ================= 3D view + AutoCAD-style 3D (three.js r128, inlined) ================= */
var V3={on:false,mode:"3d",style:"shaded",roof:true,labels:true,auto:false,grid:true,view:"SE Iso",ready:false};
var T3={};
var CADCOL={WALLS3D:"#e6dc8a",OPENINGS3D:"#22d3e6",GLASS3D:"#22d3e6",STAIRS3D:"#3fd16b",FLOOR3D:"#7f8c9a",ROOF3D:"#c77dff",PLINTH3D:"#9aa3ad",DOORS3D:"#22d3e6",FURN3D:"#ffa64d"};
var CADEDGE={WALLS3D:"#ffffff",OPENINGS3D:"#00ffff",GLASS3D:"#00ffff",STAIRS3D:"#00ff00",FLOOR3D:"#8c96a0",ROOF3D:"#ff66ff",PLINTH3D:"#b0b0b0",DOORS3D:"#00ffff",FURN3D:"#ffbf73"};
var DXFCOL={WALLS3D:7,OPENINGS3D:4,GLASS3D:4,DOORS3D:4,STAIRS3D:3,FLOOR3D:8,ROOF3D:6,PLINTH3D:9,FURN3D:30};
function texCanvas(w,h,fn){var c=document.createElement("canvas");c.width=w;c.height=h;fn(c.getContext("2d"),w,h);var t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;t.anisotropy=4;return t}
function noiseFill(x,w,h,base,amp,n){x.fillStyle=base;x.fillRect(0,0,w,h);for(var i=0;i<n;i++){var a=Math.random()*amp;x.fillStyle=(Math.random()<0.5?"rgba(0,0,0,":"rgba(255,255,255,")+a+")";var r=Math.random()*2+0.5;x.fillRect(Math.random()*w,Math.random()*h,r,r)}}
function mkMaterials(){var M={};
 var plaster=texCanvas(256,256,function(x,w,h){noiseFill(x,w,h,"#efe6d3",0.06,9000)});
 var stone=texCanvas(256,256,function(x,w,h){noiseFill(x,w,h,"#8d8178",0.12,7000);x.strokeStyle="rgba(40,30,25,.35)";x.lineWidth=2;for(var y=0;y<=h;y+=64){x.beginPath();x.moveTo(0,y);x.lineTo(w,y);x.stroke();for(var k=0;k<w;k+=96){var o=(y/64)%2?48:0;x.beginPath();x.moveTo(k+o,y);x.lineTo(k+o,y+64);x.stroke()}}});
 var tile=texCanvas(256,256,function(x,w,h){noiseFill(x,w,h,"#ffffff",0.05,3000);x.strokeStyle="rgba(120,110,100,.55)";x.lineWidth=3;x.strokeRect(1.5,1.5,w-3,h-3)});
 var grass=texCanvas(512,512,function(x,w,h){noiseFill(x,w,h,"#6d8f4a",0.18,40000)});grass.repeat.set(60,60);
 var wood=texCanvas(128,512,function(x,w,h){x.fillStyle="#7a4a26";x.fillRect(0,0,w,h);for(var i=0;i<60;i++){x.strokeStyle="rgba(40,20,8,"+(Math.random()*0.25)+")";x.lineWidth=Math.random()*2+0.5;var X=Math.random()*w;x.beginPath();x.moveTo(X,0);x.bezierCurveTo(X+6,h/3,X-6,2*h/3,X+3,h);x.stroke()}});
 var conc=texCanvas(256,256,function(x,w,h){noiseFill(x,w,h,"#cfcac1",0.08,9000)});
 tile.repeat.set(0.5,0.5);
 M.wall=new THREE.MeshStandardMaterial({color:0xffffff,map:plaster,roughness:0.92,metalness:0});
 M.plinth=new THREE.MeshStandardMaterial({color:0xffffff,map:stone,roughness:0.95});
 M.roof=new THREE.MeshStandardMaterial({color:0xffffff,map:conc,roughness:0.9});
 M.coping=new THREE.MeshStandardMaterial({color:0xd9d4cb,map:conc,roughness:0.85});
 M.grass=new THREE.MeshStandardMaterial({color:0xffffff,map:grass,roughness:1});
 M.door=new THREE.MeshStandardMaterial({color:0xffffff,map:wood,roughness:0.6});
 M.frame=new THREE.MeshStandardMaterial({color:0x5b3a1e,roughness:0.6});
 M.wframe=new THREE.MeshStandardMaterial({color:0xf4f4f2,roughness:0.4,metalness:0.1});
 M.glass=new THREE.MeshStandardMaterial({color:0x8fbfe0,transparent:true,opacity:0.38,roughness:0.05,metalness:0.6,depthWrite:false,side:THREE.DoubleSide});
 M.stair=new THREE.MeshStandardMaterial({color:0xb9b2a6,map:conc,roughness:0.7});
 M.handle=new THREE.MeshStandardMaterial({color:0xd4b04c,metalness:0.9,roughness:0.3});
 M.teak=new THREE.MeshStandardMaterial({color:0xffc890,map:wood,roughness:0.42});M.teakF=new THREE.MeshStandardMaterial({color:0xd9a070,map:wood,roughness:0.5});
 M.pvc=new THREE.MeshStandardMaterial({color:new THREE.Color(0xe8e1d0).convertSRGBToLinear(),roughness:0.4});
 M.tile=tile;
 M.floorFor=function(hex){return new THREE.MeshStandardMaterial({color:new THREE.Color(hex).lerp(new THREE.Color("#ffffff"),0.35),map:tile,roughness:0.55,metalness:0.02})};
 M.cad={};M.hidden=new THREE.MeshBasicMaterial({color:0x212830,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1});
 Object.keys(CADCOL).forEach(function(k){M.cad[k]=new THREE.MeshLambertMaterial({color:CADCOL[k],polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1,transparent:k==="GLASS3D",opacity:k==="GLASS3D"?0.35:1,side:k==="GLASS3D"?THREE.DoubleSide:THREE.FrontSide})});
 M.edgeCad={};Object.keys(CADEDGE).forEach(function(k){M.edgeCad[k]=new THREE.LineBasicMaterial({color:CADEDGE[k]})});
 M.edgeReal=new THREE.LineBasicMaterial({color:0x3a3530,transparent:true,opacity:0.28});
 furnMaterials(M);return M}

/* Stage: 3D view - three.js renderer + OrbitControls (mouse / one-finger orbit, pinch zoom) */
function ensure3D(){if(V3.ready)return true;if(!window.THREE){toast("3D engine missing");return false}
 var cv3=$("cv3"),R=new THREE.WebGLRenderer({canvas:cv3,antialias:true,alpha:false});R.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
 R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;R.outputEncoding=THREE.sRGBEncoding;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.05;R.autoClear=false;
 T3.R=R;T3.scene=new THREE.Scene();T3.M=mkMaterials();
 T3.pcam=new THREE.PerspectiveCamera(42,1,0.3,3000);T3.ocam=new THREE.OrthographicCamera(-10,10,10,-10,-2000,4000);
 T3.hemi=new THREE.HemisphereLight(0xdfefff,0x6b5a40,0.55);T3.scene.add(T3.hemi);
 T3.amb=new THREE.AmbientLight(0xffffff,0.12);T3.scene.add(T3.amb);
 var sun=new THREE.DirectionalLight(0xfff1dc,1.15);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.bias=-0.0004;sun.shadow.normalBias=0.02;T3.sun=sun;T3.scene.add(sun);T3.scene.add(sun.target);
 T3.model=new THREE.Group();T3.edges=new THREE.Group();T3.labels=new THREE.Group();T3.env=new THREE.Group();T3.scene.add(T3.model,T3.edges,T3.labels,T3.env);
 // UCS icon scene
 T3.ucs=new THREE.Scene();T3.ucam=new THREE.PerspectiveCamera(40,1,0.1,50);
 [[1,0,0,"#ff4040","X"],[0,0,-1,"#40e040","Y"],[0,1,0,"#4a7dff","Z"]].forEach(function(a){var dir=new THREE.Vector3(a[0],a[1],a[2]);var g=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),dir.clone().multiplyScalar(1.4)]);
  T3.ucs.add(new THREE.Line(g,new THREE.LineBasicMaterial({color:a[3]})));var cone=new THREE.Mesh(new THREE.ConeGeometry(0.09,0.3,12),new THREE.MeshBasicMaterial({color:a[3]}));cone.position.copy(dir.clone().multiplyScalar(1.5));cone.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir);T3.ucs.add(cone);
  var sp=textSprite(a[4],{fg:a[3],bg:null,size:64,bold:true});sp.position.copy(dir.clone().multiplyScalar(1.95));sp.scale.set(0.5,0.5,1);T3.ucs.add(sp)});
 var sq=new THREE.Mesh(new THREE.PlaneGeometry(0.3,0.3),new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide,transparent:true,opacity:0.6}));sq.rotation.x=-Math.PI/2;sq.position.set(0.15,0,-0.15);T3.ucs.add(sq);
 // controls
 setCam("persp");
 var el=cv3;el.addEventListener("pointermove",function(e){if(V3.mode!=="cad")return;var r=el.getBoundingClientRect();cadCoords((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1)});
 el.addEventListener("pointerdown",function(){if(V3.auto&&V3.mode==="3d"){/* keep spinning, user can stop with button */}});
 window.addEventListener("resize",function(){if(V3.on)resize3D()});
 V3.ready=true;return true}
function setCam(kind){var old=T3.ctl,tgt=old?old.target.clone():new THREE.Vector3(),cam=kind==="ortho"?T3.ocam:T3.pcam;if(old){cam.position.copy(T3.cam.position);old.dispose()}T3.cam=cam;
 var c=new THREE.OrbitControls(cam,$("cv3"));c.enableDamping=true;c.dampingFactor=0.085;c.rotateSpeed=0.75;c.zoomSpeed=1.0;c.panSpeed=0.9;c.screenSpacePanning=true;
 c.touches={ONE:THREE.TOUCH.ROTATE,TWO:THREE.TOUCH.DOLLY_PAN};c.mouseButtons={LEFT:THREE.MOUSE.ROTATE,MIDDLE:THREE.MOUSE.DOLLY,RIGHT:THREE.MOUSE.PAN};c.autoRotateSpeed=1.6;c.autoRotate=V3.auto;
 c.target.copy(tgt);c.maxPolarAngle=kind==="ortho"?Math.PI:Math.PI*0.49;c.minDistance=3;c.maxDistance=1500;c.minZoom=0.05;c.maxZoom=60;
 c.addEventListener("start",function(){V3.anim=null});T3.ctl=c}

/* ---- text sprites ---- */
function textSprite(txt,o){o=o||{};var lines=String(txt).split("\n"),fs=o.size||44,pad=fs*0.35,c=document.createElement("canvas"),x=c.getContext("2d");x.font=(o.bold?"bold ":"600 ")+fs+"px Roboto,Arial,sans-serif";
 var w=Math.max.apply(null,lines.map(function(l){return x.measureText(l).width}))+pad*2,h=lines.length*fs*1.2+pad*1.4;c.width=Math.ceil(w);c.height=Math.ceil(h);x=c.getContext("2d");
 if(o.bg){x.fillStyle=o.bg;var r=fs*0.4;x.beginPath();x.moveTo(r,0);x.arcTo(w,0,w,h,r);x.arcTo(w,h,0,h,r);x.arcTo(0,h,0,0,r);x.arcTo(0,0,w,0,r);x.fill()}
 lines.forEach(function(l,i){x.font=(i===0||o.bold?"bold ":"600 ")+(i?fs*0.8:fs)+"px Roboto,Arial,sans-serif";x.fillStyle=o.fg||"#16243a";x.textAlign="center";x.textBaseline="middle";x.fillText(l,w/2,pad*0.7+fs*0.6+i*fs*1.2)});
 var t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;var m=new THREE.SpriteMaterial({map:t,depthTest:o.depthTest!==false,transparent:true});var s=new THREE.Sprite(m);s.userData.aspect=w/h;s.renderOrder=5;return s}

/* ---- model building ---- */
function clearGroup(g){while(g.children.length){var c=g.children.pop();c.traverse(function(o){if(o.geometry)o.geometry.dispose();if(o.material&&o.material.map&&o.isSprite)o.material.map.dispose()})}}
function addMesh(geo,mat,layer,pos,rotY,opts){opts=opts||{};var m=new THREE.Mesh(geo,mat);if(pos)m.position.copy(pos);if(rotY)m.rotation.y=rotY;if(opts.rotX)m.rotation.x=opts.rotX;
 m.castShadow=opts.cast!==false;m.receiveShadow=true;m.userData.layer=layer;m.userData.real=mat;T3.model.add(m);
 if(opts.edges!==false){var e=new THREE.LineSegments(new THREE.EdgesGeometry(geo,28),T3.M.edgeReal);e.position.copy(m.position);e.quaternion.copy(m.quaternion);e.scale.copy(m.scale);e.userData.layer=layer;T3.edges.add(e)}return m}
/* box along a wall: from distance s0 to s1 along unit u starting at point a; y from z0 to z1; thickness t (centred), offset n */
function wallBox(a,u,s0,s1,z0,z1,t,mat,layer,off,opts){var L=s1-s0,H=z1-z0;if(L<=0.005||H<=0.005)return null;var mid=(s0+s1)/2,ox=off?-u.y*off:0,oz=off?u.x*off:0;
 return addMesh(new THREE.BoxGeometry(L,H,t),mat,layer,new THREE.Vector3(a.x+u.x*mid+ox,z0+H/2,a.y+u.y*mid+oz),-Math.atan2(u.y,u.x),opts)}
function shapeOf(pts){var sh=new THREE.Shape();pts.forEach(function(p,i){i?sh.lineTo(p.x,-p.y):sh.moveTo(p.x,-p.y)});return sh}
function slab(pts,y0,y1,mat,layer,opts){var g=new THREE.ExtrudeGeometry(shapeOf(pts),{depth:y1-y0,bevelEnabled:false});var m=addMesh(g,mat,layer,new THREE.Vector3(0,y0,0),0,Object.assign({rotX:-Math.PI/2},opts||{}));return m}
/* Stage: 3D view - all levels stacked: walls, openings, slabs, roof */
function build3D(){var M=T3.M;[T3.model,T3.edges,T3.labels,T3.env].forEach(clearGroup);
 var RI=roomsInfo(),H=wallH(),roofT=0.5,par=V3.roof?3:0,top=V3.roof?H+roofT:H,PL=1.5,dbl=S.meta.dbl;
 function insideAny(x,y){return RI.faces.some(function(f){return inPoly(x,y,f.pts)})}
 // floors (room colours) on plinth
 RI.faces.forEach(function(f,i){var mat=M.floorFor(FILLS[i%FILLS.length]);var m=slab(f.pts,-PL,0.0,[mat,M.plinth],"FLOOR3D",{cast:false});m.userData.real=[mat,M.plinth]});
 // walls with openings
 var opsBy={};S.ops.forEach(function(o){var g=opWorld(o);if(!g)return;(opsBy[o.seg]=opsBy[o.seg]||[]).push({o:o,g:g})});
 S.segs.forEach(function(s){var a=pt(s.a),b=pt(s.b),L=segLen(s);if(L<0.05)return;var u={x:(b.x-a.x)/L,y:(b.y-a.y)/L},t=dbl?wallT(s):0.5,e=t/2;
  var m={x:(a.x+b.x)/2,y:(a.y+b.y)/2},n={x:-u.y,y:u.x},i1=insideAny(m.x+n.x*0.35,m.y+n.y*0.35),i2=insideAny(m.x-n.x*0.35,m.y-n.y*0.35),ext=!(i1&&i2),outSg=i1?-1:1;
  wallBox(a,u,-e-0.04,L+e+0.04,-PL-0.02,0,t+0.12,M.plinth,"PLINTH3D",0,{edges:false});
  var list=(opsBy[s.id]||[]).map(function(q){var c=(q.g.c.x-a.x)*u.x+(q.g.c.y-a.y)*u.y;return {q:q,s0:c-q.g.w/2,s1:c+q.g.w/2,sill:Math.min(opSill(q.o),H-0.3),hh:opH(q.o)}}).sort(function(p,q){return p.s0-q.s0});
  var cur=-e;list.forEach(function(it){wallBox(a,u,cur,it.s0,0,top,t,M.wall,"WALLS3D");var z1=Math.min(it.sill+it.hh,H);
   if(it.sill>0.01)wallBox(a,u,it.s0,it.s1,0,it.sill,t,M.wall,"WALLS3D");wallBox(a,u,it.s0,it.s1,z1,top,t,M.wall,"WALLS3D");
   openingParts(it,a,u,t,z1,ext,outSg);cur=it.s1});
  wallBox(a,u,cur,L+e,0,top,t,M.wall,"WALLS3D");
  if(V3.roof&&ext){var pt2=Math.min(t,0.5);wallBox(a,u,-e,L+e,top,top+par,pt2,M.wall,"WALLS3D",outSg*(t-pt2)/2);wallBox(a,u,-e-0.08,L+e+0.08,top+par,top+par+0.25,pt2+0.18,M.coping,"ROOF3D",outSg*(t-pt2)/2)}});
 // roof slab
 if(V3.roof)RI.faces.forEach(function(f){slab(f.pts,H,H+roofT,M.roof,"ROOF3D")});
 // stairs
 stairsAll(RI).forEach(function(G){G.steps.forEach(function(st){var z=Math.min(st.z,H-0.2);var m=slab(st.pts,0,z,M.stair,"STAIRS3D")})});
 // furniture
 (S.furn||[]).forEach(function(f){try{furn3D(f)}catch(e){console.warn("furn",f.type,e)}});try{kc3DAll(0)}catch(e){console.warn("kc",e)}
 // labels
 RI.faces.forEach(function(f){var l=f.labels[0],name=l?l.name:"Room",at=l||{x:f.cx,y:f.cy};var sp=textSprite(name.toUpperCase()+"\n"+sizeText(f)+"  "+sq(f.carpet!=null?f.carpet:f.area)+" sq.ft",{bg:"rgba(255,255,255,.88)",size:40});
  var w=Math.min(Math.max(f.w*0.42,3.2),5.5);sp.scale.set(w,w/sp.userData.aspect,1);sp.position.set(at.x,H+1.2,at.y);T3.labels.add(sp)});
 // environment: ground + grid
 var bb=bbox3();var span=Math.max(bb.sx,bb.sz,20);
 var gnd=new THREE.Mesh(new THREE.PlaneGeometry(span*14,span*14),M.grass);gnd.rotation.x=-Math.PI/2;gnd.position.set(bb.cx,-PL-0.01,bb.cz);gnd.receiveShadow=true;gnd.userData.env="ground";T3.env.add(gnd);
 var gs=Math.ceil(span*3/10)*10,grid=new THREE.GridHelper(gs,gs,0x5d6a78,0x323b46);grid.position.set(Math.round(bb.cx),-PL,Math.round(bb.cz));grid.userData.env="grid";T3.env.add(grid);
 var gmaj=new THREE.GridHelper(gs,gs/5,0x6f7c8a,0x46515e);gmaj.position.copy(grid.position);gmaj.position.y+=0.005;gmaj.userData.env="grid";T3.env.add(gmaj);
 // sun + shadow camera around model
 var r=Math.max(bb.sx,bb.sz,bb.sy)*0.9+8;T3.sun.position.set(bb.cx+r*0.9,r*1.4,bb.cz+r*0.6);T3.sun.target.position.set(bb.cx,0,bb.cz);var sc=T3.sun.shadow.camera;sc.left=-r;sc.right=r;sc.top=r;sc.bottom=-r;sc.near=0.5;sc.far=r*5;sc.updateProjectionMatrix();
 T3.bb=bb;applyStyle()}
function openingParts(it,a,u,t,z1,ext,outSg){var M=T3.M,o=it.q.o,w=it.s1-it.s0,f=0.18,ft=Math.min(t,0.4),sill=it.sill,hh=z1-sill,L="OPENINGS3D";
 function B(s0,s1,y0,y1,th,mat,layer,off,opts){return wallBox(a,u,s0,s1,y0,y1,th,mat,layer||L,off||0,opts)}
 if(o.type==="D"){var dk=o.dk||"D",MD=dk==="MD",fm=MD?M.teakF:M.frame,lm=MD?M.teak:(dk==="TD"?M.pvc:M.door);if(MD){f=0.28;ft=Math.min(t+0.06,0.62)}
  B(it.s0,it.s0+f,0,z1,ft,fm,"DOORS3D");B(it.s1-f,it.s1,0,z1,ft,fm,"DOORS3D");B(it.s0,it.s1,z1-f,z1,ft,fm,"DOORS3D");
  if(MD&&ext){B(it.s0-0.35,it.s1+0.35,z1,z1+0.35,ft+0.1,M.teakF,"DOORS3D");B(it.s0-0.25,it.s0,0,z1,ft*0.6,M.teakF,"DOORS3D",outSg*(t/2));B(it.s1,it.s1+0.25,0,z1,ft*0.6,M.teakF,"DOORS3D",outSg*(t/2))}
  // leaf, ajar 28 deg about hinge
  var hingeS=o.hinge?it.s1-f:it.s0+f,lw=w-2*f-0.04,sd=(o.flip?-1:1),ang=28*Math.PI/180*(o.hinge?-1:1)*sd,hp={x:a.x+u.x*hingeS+(-u.y)*sd*(ft/2-0.06),y:a.y+u.y*hingeS+u.x*sd*(ft/2-0.06)};
  var dirAng=Math.atan2(u.y,u.x)+(o.hinge?Math.PI:0),la=dirAng+ang*(o.hinge?1:1),lu={x:Math.cos(la),y:Math.sin(la)};
  var lt=MD?0.18:0.13,top=z1-f-0.02,leaf=wallBox(hp,lu,0,lw,0.02,top,lt,lm,"DOORS3D",0);
  if(MD){var cols=2,rows=3,gx=0.22,pw=(lw-gx*(cols+1))/cols,ph=(top-0.3-gx*(rows+1))/rows;[1,-1].forEach(function(sg){for(var ci=0;ci<cols;ci++)for(var ri=0;ri<rows;ri++){var s0=gx+ci*(pw+gx),z0=0.3+gx+ri*(ph+gx);
    wallBox(hp,lu,s0,s0+pw,z0,z0+ph,0.06,M.teak,"DOORS3D",sg*(lt/2+0.02),{edges:true});wallBox(hp,lu,s0+0.08,s0+pw-0.08,z0+0.08,z0+ph-0.08,0.03,M.teakF,"DOORS3D",sg*(lt/2+0.05),{edges:false})}});
   wallBox(hp,lu,lw-0.5,lw-0.4,2.9,4.1,0.36,M.handle,"DOORS3D",0,{edges:false})}
  else if(dk==="TD")wallBox(hp,lu,0.25,lw-0.25,top-1.0,top-0.4,lt+0.02,M.frame,"DOORS3D",0,{edges:false});
  var hd=wallBox(hp,lu,lw-0.45,lw-0.25,3.3,3.45,0.3,M.handle,"DOORS3D",0,{edges:false});return}
 // window / ventilator frame
 B(it.s0,it.s0+f,sill,z1,ft,M.wframe);B(it.s1-f,it.s1,sill,z1,ft,M.wframe);B(it.s0,it.s1,sill,sill+f,ft,M.wframe);B(it.s0,it.s1,z1-f,z1,ft,M.wframe);
 if(o.type==="W"&&w>2.4)B((it.s0+it.s1)/2-f/2,(it.s0+it.s1)/2+f/2,sill+f,z1-f,ft*0.8,M.wframe);
 B(it.s0+f,it.s1-f,sill+f,z1-f,0.04,M.glass,"GLASS3D",0,{edges:false,cast:false});
 if(o.type==="V"){var n=3;for(var i=1;i<=n;i++){var y=sill+f+(hh-2*f)*i/(n+1);B(it.s0+f,it.s1-f,y-0.04,y+0.04,ft*0.7,M.wframe)}}
 if(ext){// sill projection + chajja (sunshade) on outside face
  B(it.s0-0.15,it.s1+0.15,sill-0.12,sill,0.35,M.coping,"WALLS3D",outSg*(t/2+0.1));
  if(o.type==="W")B(it.s0-0.5,it.s1+0.5,z1+0.25,z1+0.5,1.6,M.coping,"WALLS3D",outSg*(t/2+0.8))}}
function bbox3(){var mx=Infinity,mz=Infinity,Mx=-Infinity,Mz=-Infinity;S.pts.forEach(function(p){mx=Math.min(mx,p.x);mz=Math.min(mz,p.y);Mx=Math.max(Mx,p.x);Mz=Math.max(Mz,p.y)});
 var H=wallH()+(V3.roof?3.75:0);return {cx:(mx+Mx)/2,cz:(mz+Mz)/2,cy:(H-1.5)/2,sx:Mx-mx,sz:Mz-mz,sy:H+1.5,min:new THREE.Vector3(mx,-1.5,mz),max:new THREE.Vector3(Mx,H,Mz)}}

/* ---- styles ---- */
function applyStyle(){var M=T3.M,cad=V3.mode==="cad",st=cad?V3.style:"realistic",real=st==="realistic";
 T3.model.children.forEach(function(m){var L=m.userData.layer;m.visible=st!=="wireframe";m.castShadow=real&&L!=="GLASS3D";
  if(real)m.material=m.userData.real;else if(st==="hidden")m.material=L==="GLASS3D"?M.cad.GLASS3D:M.hidden;else m.material=M.cad[L]||M.cad.WALLS3D;});
 T3.edges.children.forEach(function(e){e.visible=!real||!cad?(real?true:true):true;e.material=real?M.edgeReal:(M.edgeCad[e.userData.layer]||M.edgeCad.WALLS3D);e.visible=st!=="shaded"});
 if(!cad)T3.edges.visible=true;
 T3.edges.visible=true;
 T3.R.shadowMap.enabled=real;T3.sun.castShadow=real;
 T3.env.children.forEach(function(o){if(o.userData.env==="ground")o.visible=!cad||st==="realistic";if(o.userData.env==="grid")o.visible=cad&&V3.grid&&st!=="realistic"||(cad&&V3.grid&&st==="realistic")});
 T3.labels.visible=V3.labels&&(cad||!V3.roof);T3.labels.children.forEach(function(s){s.material.depthTest=false});
 T3.scene.background=new THREE.Color(cad?(real?"#2b3440":"#212830"):"#cfe2f3");T3.scene.fog=cad?null:new THREE.Fog(0xcfe2f3,(T3.bb?Math.max(T3.bb.sx,T3.bb.sz):40)*4,(T3.bb?Math.max(T3.bb.sx,T3.bb.sz):40)*12);
 T3.hemi.intensity=real?0.55:0.75;T3.sun.intensity=real?1.15:0.65;T3.amb.intensity=real?0.12:0.35;
 T3.model.children.forEach(function(m){if(m.material&&m.material.needsUpdate!==undefined)m.material.needsUpdate=true})}

/* ---- views ---- */
var VIEWS={"Top":[0,1,0.0001],"Front":[0,0.0001,1],"Back":[0,0.0001,-1],"Right":[1,0.0001,0],"Left":[-1,0.0001,0],"SE Iso":[1,1,1],"SW Iso":[-1,1,1],"NE Iso":[1,1,-1],"NW Iso":[-1,1,-1],"Persp":[0.8,0.85,1.1],"Inside":[0.5,1.55,0.85]};
function fitDist(){var bb=T3.bb,r=Math.sqrt(bb.sx*bb.sx+bb.sy*bb.sy+bb.sz*bb.sz)/2+1;return r/Math.sin(T3.pcam.fov*Math.PI/360)*1.05}
/* Stage: 3D view - View cube (Top, Front, Iso ...) */
function setView(name,instant){var v=VIEWS[name]||VIEWS["SE Iso"],bb=T3.bb,tgt=new THREE.Vector3(bb.cx,bb.cy,bb.cz),dir=new THREE.Vector3(v[0],v[1],v[2]).normalize(),d=fitDist();
 var to=tgt.clone().add(dir.multiplyScalar(d));V3.view=name;var c=T3.ctl;
 if(T3.cam.isOrthographicCamera)fitOrtho();
 if(instant){T3.cam.position.copy(to);c.target.copy(tgt);c.update();return}
 V3.anim={t0:performance.now(),dur:550,p0:T3.cam.position.clone(),p1:to,g0:c.target.clone(),g1:tgt};cmd("-VIEW _"+name.replace(" ","").toUpperCase())}
function fitOrtho(){var bb=T3.bb,r=Math.sqrt(bb.sx*bb.sx+bb.sy*bb.sy+bb.sz*bb.sz)/2+1,a=T3.aspect||1.6,o=T3.ocam;o.left=-r*a;o.right=r*a;o.top=r;o.bottom=-r;o.zoom=1.05;o.updateProjectionMatrix()}
function zoomExtents(){setView(V3.mode==="cad"?(V3.view==="Persp"?"SE Iso":V3.view):"Persp");cmd("ZOOM _E")}
function resize3D(){var el=$("v3stage").getBoundingClientRect(),w=Math.max(1,el.width),h=Math.max(1,el.height);T3.R.setSize(w,h,false);T3.aspect=w/h;T3.pcam.aspect=w/h;T3.pcam.updateProjectionMatrix();
 var o=T3.ocam,hh=(o.top-o.bottom)/2||10;o.left=-hh*w/h;o.right=hh*w/h;o.updateProjectionMatrix();T3.W=w;T3.H=h}
function loop3D(){if(!V3.on)return;requestAnimationFrame(loop3D);var c=T3.ctl;
 if(V3.anim){var A=V3.anim,k=Math.min(1,(performance.now()-A.t0)/A.dur),e=k<0.5?2*k*k:1-Math.pow(-2*k+2,2)/2;T3.cam.position.lerpVectors(A.p0,A.p1,e);c.target.lerpVectors(A.g0,A.g1,e);if(k>=1)V3.anim=null}
 c.update();var R=T3.R;R.setViewport(0,0,T3.W,T3.H);R.setScissorTest(false);R.clear();R.render(T3.scene,T3.cam);
 if(V3.mode==="cad"){var s=110;R.setScissorTest(true);R.setScissor(8,8,s,s);R.setViewport(8,8,s,s);R.clearDepth();var d=T3.cam.position.clone().sub(c.target).normalize().multiplyScalar(6);T3.ucam.position.copy(d);T3.ucam.up.copy(T3.cam.up);T3.ucam.lookAt(0,0,0);R.render(T3.ucs,T3.ucam);R.setScissorTest(false)}}

/* ---- AutoCAD command line ---- */
var CMDH=[];function cmd(t){CMDH.push(t);if(CMDH.length>3)CMDH.shift();var el=$("cmdHist");if(el)el.innerHTML=CMDH.map(function(x){return "Command: "+esc(x)}).join("<br>")}
function cadCoords(nx,ny){var rc=new THREE.Raycaster();rc.setFromCamera({x:nx,y:ny},T3.cam);var p=new THREE.Vector3();if(rc.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),0),p)){var X=p.x,Y=-p.z;$("cmdXY").textContent="X "+sgnFi(X)+"   Y "+sgnFi(Y)+"   Z 0'-0\""}}
function sgnFi(v){return (v<0?"-":"")+fi(Math.abs(v))}
function runCmd(t){t=String(t||"").trim().toUpperCase();if(!t)return;cmd(t);var map={TOP:"Top",FRONT:"Front",BACK:"Back",RIGHT:"Right",LEFT:"Left",SEISO:"SE Iso",SWISO:"SW Iso",NEISO:"NE Iso",NWISO:"NW Iso"};
 if(map[t])return setView(map[t]);if(t==="ZE"||t==="Z E"||t==="ZOOM E"||t==="ZOOM")return zoomExtents();var st={WIREFRAME:"wireframe","2D":"wireframe",HIDDEN:"hidden",SHADED:"shaded",REALISTIC:"realistic",VSW:"wireframe",VSH:"hidden",VSS:"shaded",VSR:"realistic"};
 if(st[t])return setStyle(st[t]);if(t==="GRID"){V3.grid=!V3.grid;applyStyle();upd3UI();return}if(t==="3DORBIT"||t==="ORBIT")return toast("Drag with one finger to orbit");if(t==="EXPORT"||t==="DXFOUT")return export3DDXF();if(t==="PNGOUT")return export3DPNG();
 toast("Unknown command: "+t)}
function setStyle(s){V3.style=s;applyStyle();upd3UI();cmd("VSCURRENT _"+s.charAt(0).toUpperCase()+s.slice(1))}

/* ---- open / close / UI ---- */
/* Stage: 3D view - 3D View tool / top-row 3D button */
function open3D(mode){if(!S.segs.length){toast("Draw the plan first");return}if(!ensure3D())return;autosave();
 V3.on=true;V3.mode=mode;$("v3d").classList.add("show");$("v3d").classList.toggle("cad",mode==="cad");setCam(mode==="cad"?"ortho":"persp");resize3D();build3D();
 if(mode==="cad"){V3.style=V3.style||"shaded";CMDH=[];cmd("_-VIEW _SEISO");setView("SE Iso",true);cmd("VSCURRENT _"+V3.style)}else setView("Persp",true);
 T3.ctl.autoRotate=V3.auto;upd3UI();loop3D()}
/* Stage: 3D view - Back to the plan (previous drawing tool active again) */
function close3D(){V3.on=false;V3.anim=null;$("v3d").classList.remove("show");render()}
function upd3UI(){var cad=V3.mode==="cad";$("v3title").textContent=cad?"AutoCAD 3D  ·  Model":"3D House View  ·  "+(S.meta.name||"");
 document.querySelectorAll("#v3d [data-s]").forEach(function(b){b.classList.toggle("on",b.dataset.s===V3.style)});
 var set=function(id,on,txt){var b=$(id);if(!b)return;b.classList.toggle("on",!!on);if(txt)b.querySelector("span").textContent=txt};
 set("v3Auto",V3.auto);set("v3Roof",V3.roof);set("v3Lab",V3.labels);set("v3Grid",V3.grid);set("v3Mode",false,cad?"3D View":"AutoCAD 3D")}
function bind3DUI(){
 $("v3Close").onclick=close3D;$("v3Mode").onclick=function(){open3D(V3.mode==="cad"?"3d":"cad")};
 $("v3Auto").onclick=function(){V3.auto=!V3.auto;T3.ctl.autoRotate=V3.auto;upd3UI();toast(V3.auto?"Auto-rotate ON":"Auto-rotate OFF")};
 $("v3Roof").onclick=function(){V3.roof=!V3.roof;build3D();upd3UI();if(V3.mode!=="cad")setView(V3.roof?"Persp":"Inside");toast(V3.roof?"Roof slab + parapet ON":"Roof OFF - see inside")};
 $("v3Lab").onclick=function(){V3.labels=!V3.labels;applyStyle();upd3UI()};
 $("v3Fit").onclick=zoomExtents;$("v3Grid").onclick=function(){V3.grid=!V3.grid;applyStyle();upd3UI();cmd("GRID "+(V3.grid?"ON":"OFF"))};
 $("v3Png").onclick=export3DPNG;$("v3Dxf").onclick=export3DDXF;
 document.querySelectorAll("#v3d [data-v]").forEach(function(b){b.onclick=function(){setView(b.dataset.v)}});
 document.querySelectorAll("#v3d [data-s]").forEach(function(b){b.onclick=function(){setStyle(b.dataset.s)}});
 $("cmdIn").addEventListener("keydown",function(e){if(e.key==="Enter"){runCmd(this.value);this.value="";this.blur()}})}

/* ---- exports ---- */
/* Stage: 3D view - PNG export of the 3D view */
function export3DPNG(){var R=T3.R;R.setViewport(0,0,T3.W,T3.H);R.clear();R.render(T3.scene,T3.cam);var u=R.domElement.toDataURL("image/png");saveFile(fname(V3.mode==="cad"?"cad3d.png":"3d.png").replace(".cad3d.png","_AutoCAD3D.png").replace(".3d.png","_3D.png"),u,"image/png");cmd("PNGOUT")}
/* Stage: 3D view - DXF 3D export */
function export3DDXF(){var o=[];function g(c,v){o.push(String(c));o.push(String(v))}var layers=Object.keys(DXFCOL);
 g(0,"SECTION");g(2,"HEADER");g(9,"$ACADVER");g(1,"AC1009");g(9,"$INSUNITS");g(70,2);g(0,"ENDSEC");
 g(0,"SECTION");g(2,"TABLES");g(0,"TABLE");g(2,"LTYPE");g(70,1);g(0,"LTYPE");g(2,"CONTINUOUS");g(70,0);g(3,"Solid line");g(72,65);g(73,0);g(40,0.0);g(0,"ENDTAB");
 g(0,"TABLE");g(2,"LAYER");g(70,layers.length);layers.forEach(function(l){g(0,"LAYER");g(2,l);g(70,0);g(62,DXFCOL[l]);g(6,"CONTINUOUS")});g(0,"ENDTAB");g(0,"ENDSEC");
 g(0,"SECTION");g(2,"ENTITIES");var n=0,v=new THREE.Vector3();
 function P(i,arr,mw){v.fromBufferAttribute(arr,i).applyMatrix4(mw);return [v.x,-v.z,v.y]}
 T3.model.updateMatrixWorld(true);T3.model.children.forEach(function(m){var geo=m.geometry,pos=geo.attributes.position,idx=geo.index,L=m.userData.layer||"WALLS3D",mw=m.matrixWorld;
  var cnt=idx?idx.count:pos.count;for(var i=0;i+2<cnt;i+=3){var a=idx?idx.getX(i):i,b=idx?idx.getX(i+1):i+1,c=idx?idx.getX(i+2):i+2,A=P(a,pos,mw),B=P(b,pos,mw),C=P(c,pos,mw);
   g(0,"3DFACE");g(8,L);[A,B,C,C].forEach(function(q,k){g(10+k,q[0].toFixed(4));g(20+k,q[1].toFixed(4));g(30+k,q[2].toFixed(4))});n++}});
 g(0,"ENDSEC");g(0,"EOF");saveFile(fname("dxf").replace(".dxf","_3D.dxf"),new Blob([o.join("\r\n")+"\r\n"],{type:"application/dxf"}),"application/dxf");cmd("DXFOUT  "+n+" 3DFACE entities");toast("3D DXF: "+n+" faces")}
