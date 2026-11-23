/* ===== Finishing 3D: eye-level walk-through, road view, site view (trees / road / lights), foundation view, evening light ===== */
var WK={on:false,yaw:0,pitch:-0.05,mv:{x:0,y:0},keys:{},t:0,eye:5.25,pos:null,fov0:42};
function w3Init(){if($("v3Walk"))return;var ref=$("v3Roof");if(!ref)return;
 var B=function(id,ic,t,s){return '<button class="tool" id="'+id+'">'+svgI(ic)+'<span>'+t+'</span><small>'+s+'</small></button>'};
 ref.insertAdjacentHTML("afterend",B("v3Walk","steps","Walk","உள்ளே நட")+B("v3Road","roof","Road view","front")+B("v3Site","grid","Site","trees, road")+B("v3Fdn","ftg","Foundation","footing")+B("v3Eve","pstyle","Evening","lights"));
 $("v3stage").insertAdjacentHTML("beforeend",'<div id="wkUI" style="display:none"><canvas id="wkMap" width="190" height="190" style="position:absolute;right:10px;top:10px;background:rgba(255,255,255,.9);border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,.25);touch-action:none"></canvas>'+
  '<div id="wkRooms" style="position:absolute;right:10px;top:206px;width:190px;display:flex;flex-wrap:wrap;gap:4px"></div>'+
  '<div id="wkJoy" style="position:absolute;left:18px;bottom:18px;width:120px;height:120px;border-radius:50%;background:rgba(15,23,42,.28);border:2px solid rgba(255,255,255,.7);touch-action:none"><div id="wkKnob" style="position:absolute;left:38px;top:38px;width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.9);box-shadow:0 1px 4px rgba(0,0,0,.4)"></div></div>'+
  '<div style="position:absolute;left:50%;transform:translateX(-50%);top:10px;background:rgba(15,23,42,.75);color:#fff;font:600 12px Roboto,Arial;padding:6px 10px;border-radius:14px">Walk · eye level 1.6 m · joystick to move · drag to look · tap the mini-plan to jump</div>'+
  '<button id="wkExit" class="bb" style="position:absolute;right:10px;bottom:14px;min-height:0;height:34px">Exit walk</button></div>');
 $("v3Walk").onclick=function(){WK.on?walkStop():walkStart()};$("wkExit").onclick=walkStop;
 $("v3Road").onclick=roadView;$("v3Site").onclick=function(){V3.site=!V3.site;build3D();upd3UI();toast(V3.site?"Site view: trees, road, street lights":"Site view OFF")};
 $("v3Fdn").onclick=function(){V3.fdn=!V3.fdn;build3D();upd3UI();if(V3.fdn&&!WK.on)setView("SE Iso");toast(V3.fdn?"Foundation 3D: footings at depth, columns rising":"Foundation view OFF")};
 $("v3Eve").onclick=function(){V3.eve=!V3.eve;build3D();upd3UI();toast(V3.eve?"Evening - lights ON":"Day light")};
 var cv=$("cv3"),drag=null;cv.addEventListener("pointerdown",function(e){if(!WK.on)return;drag={x:e.clientX,y:e.clientY,id:e.pointerId}});
 cv.addEventListener("pointermove",function(e){if(!WK.on||!drag||drag.id!==e.pointerId)return;WK.yaw+=(e.clientX-drag.x)*0.006;WK.pitch=Math.max(-1.2,Math.min(1.2,WK.pitch-(e.clientY-drag.y)*0.005));drag.x=e.clientX;drag.y=e.clientY});
 ["pointerup","pointercancel","pointerleave"].forEach(function(n){cv.addEventListener(n,function(){drag=null})});
 var J=$("wkJoy"),K=$("wkKnob"),jid=null;function jset(e){var r=J.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),L=Math.hypot(dx,dy),m=46;if(L>m){dx*=m/L;dy*=m/L}WK.mv={x:dx/m,y:dy/m};K.style.left=(38+dx)+"px";K.style.top=(38+dy)+"px"}
 J.addEventListener("pointerdown",function(e){jid=e.pointerId;J.setPointerCapture(e.pointerId);jset(e);e.stopPropagation()});J.addEventListener("pointermove",function(e){if(e.pointerId===jid)jset(e)});
 ["pointerup","pointercancel"].forEach(function(n){J.addEventListener(n,function(){jid=null;WK.mv={x:0,y:0};K.style.left="38px";K.style.top="38px"})});
 $("wkMap").addEventListener("pointerdown",function(e){var r=e.target.getBoundingClientRect(),M=WK.map;if(!M)return;var x=(e.clientX-r.left)*190/r.width,y=(e.clientY-r.top)*190/r.height;walkTo((x-M.ox)/M.k,(y-M.oy)/M.k)});
 window.addEventListener("keydown",function(e){if(WK.on)WK.keys[e.key.toLowerCase()]=1});window.addEventListener("keyup",function(e){delete WK.keys[e.key.toLowerCase()]})}
var _o3w=open3D;open3D=function(){var r=_o3w.apply(this,arguments);try{w3Init();upd3UI()}catch(e){console.warn(e)}return r};
var _u3w=upd3UI;upd3UI=function(){_u3w.apply(this,arguments);var s=function(id,on){var b=$(id);if(b)b.classList.toggle("on",!!on)};s("v3Walk",WK.on);s("v3Site",V3.site);s("v3Fdn",V3.fdn);s("v3Eve",V3.eve)};
var _c3w=close3D;close3D=function(){if(WK.on)walkStop(true);return _c3w.apply(this,arguments)};
function walkRooms(){var out=[];withLevel(S.cur,function(){roomsInfo().faces.forEach(function(f,i){var l=f.labels[0];out.push({name:l?l.name:"Room "+(i+1),x:l?l.x:f.cx,y:l?l.y:f.cy,f:f})})});return out}
function walkStart(){var R=walkRooms();if(!R.length){toast("No rooms on this floor");return}WK.on=true;var st=R.find(function(r){return /hall|living/i.test(r.name)})||R.slice().sort(function(a,b){return b.f.area-a.f.area})[0];
 WK.pos=new THREE.Vector3(st.x,lvElev(S.cur)+WK.eye,st.y);WK.yaw=0;WK.pitch=-0.05;T3.ctl.enabled=false;if(T3.cam!==T3.pcam)setCam("persp");T3.ctl.enabled=false;WK.fov0=T3.pcam.fov;T3.pcam.fov=68;T3.pcam.near=0.2;T3.pcam.updateProjectionMatrix();
 V3.anim=null;$("wkUI").style.display="block";var h=$("v3hint");if(h)h.style.display="none";
 $("wkRooms").innerHTML=R.map(function(r,i){return '<button class="bb" data-wr="'+i+'" style="min-height:0;height:26px;font-size:11px;padding:2px 8px">'+esc(r.name)+'</button>'}).join("");
 $("wkRooms").querySelectorAll("[data-wr]").forEach(function(b){b.onclick=function(){var r=R[+b.dataset.wr];walkTo(r.x,r.y)}});WK.rooms=R;build3D();upd3UI();toast("Walk mode - you are in the "+st.name)}
function walkStop(quiet){WK.on=false;var u=$("wkUI");if(u)u.style.display="none";var h=$("v3hint");if(h)h.style.display="";T3.pcam.fov=WK.fov0||42;T3.pcam.near=0.3;T3.pcam.updateProjectionMatrix();T3.ctl.enabled=true;if(!quiet){build3D();setView("Persp");upd3UI()}}
function walkTo(x,y){if(!WK.pos)return;WK.pos.x=x;WK.pos.z=y;var r=(WK.rooms||[]).find(function(q){return inPoly(x,y,q.f.pts)});if(r)toast(r.name)}
function walkBlocked(x0,y0,x1,y1){var hit=false;withLevel(S.cur,function(){var doors=S.ops.filter(function(o){return o.type==="D"}).map(opWorld).filter(Boolean);
 S.segs.forEach(function(s){if(hit)return;var a=pt(s.a),b=pt(s.b);if(d2seg({x:x1,y:y1},a,b)>wallT(s)/2+0.7)return;if(d2seg({x:x0,y:y0},a,b)<d2seg({x:x1,y:y1},a,b))return;
  if(doors.some(function(q){return q.s===s&&Math.hypot(x1-q.c.x,y1-q.c.y)<q.o.w/2+0.4}))return;hit=true})});return hit}
function walkStep(dt){var f={x:Math.sin(WK.yaw),y:-Math.cos(WK.yaw)},r={x:Math.cos(WK.yaw),y:Math.sin(WK.yaw)},K=WK.keys,fw=-WK.mv.y+((K.w||K.arrowup)?1:0)-((K.s||K.arrowdown)?1:0),sd=WK.mv.x+((K.d)?1:0)-((K.a)?1:0);
 if(K.arrowleft)WK.yaw-=dt*1.6;if(K.arrowright)WK.yaw+=dt*1.6;var sp=7*dt,nx=WK.pos.x+(f.x*fw+r.x*sd)*sp,nz=WK.pos.z+(f.y*fw+r.y*sd)*sp;
 if(fw||sd){if(!walkBlocked(WK.pos.x,WK.pos.z,nx,nz)){WK.pos.x=nx;WK.pos.z=nz}else if(!walkBlocked(WK.pos.x,WK.pos.z,nx,WK.pos.z))WK.pos.x=nx;else if(!walkBlocked(WK.pos.x,WK.pos.z,WK.pos.x,nz))WK.pos.z=nz}
 var c=T3.pcam;c.position.copy(WK.pos);c.lookAt(WK.pos.x+Math.sin(WK.yaw)*Math.cos(WK.pitch),WK.pos.y+Math.sin(WK.pitch),WK.pos.z-Math.cos(WK.yaw)*Math.cos(WK.pitch));walkMap()}
function walkMap(){var cv=$("wkMap");if(!cv)return;var g2=cv.getContext("2d"),x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;withLevel(S.cur,function(){S.pts.forEach(function(p){x0=Math.min(x0,p.x);y0=Math.min(y0,p.y);x1=Math.max(x1,p.x);y1=Math.max(y1,p.y)})});
 var k=170/Math.max(x1-x0,y1-y0,1),ox=95-(x0+x1)/2*k,oy=95-(y0+y1)/2*k;WK.map={k:k,ox:ox,oy:oy};g2.clearRect(0,0,190,190);
 (WK.rooms||[]).forEach(function(r){g2.fillStyle="#e0f2fe";g2.beginPath();r.f.pts.forEach(function(p,i){g2[i?"lineTo":"moveTo"](ox+p.x*k,oy+p.y*k)});g2.fill();g2.fillStyle="#334155";g2.font="9px Roboto,Arial";g2.textAlign="center";g2.fillText(r.name.slice(0,12),ox+r.x*k,oy+r.y*k)});
 g2.strokeStyle="#1e293b";g2.lineCap="round";withLevel(S.cur,function(){S.segs.forEach(function(s){var a=pt(s.a),b=pt(s.b);g2.lineWidth=Math.max(1.5,wallT(s)*k);g2.beginPath();g2.moveTo(ox+a.x*k,oy+a.y*k);g2.lineTo(ox+b.x*k,oy+b.y*k);g2.stroke()})});
 var px=ox+WK.pos.x*k,py=oy+WK.pos.z*k;g2.fillStyle="rgba(220,38,38,.25)";g2.beginPath();g2.moveTo(px,py);g2.arc(px,py,22,WK.yaw-Math.PI/2-0.6,WK.yaw-Math.PI/2+0.6);g2.closePath();g2.fill();g2.fillStyle="#dc2626";g2.beginPath();g2.arc(px,py,4.5,0,7);g2.fill()}
var _l3w=loop3D;loop3D=function(){if(V3.on&&WK.on){requestAnimationFrame(loop3D);var t=performance.now(),dt=Math.min(0.1,(t-(WK.t||t))/1000);WK.t=t;walkStep(dt);var R=T3.R;R.setViewport(0,0,T3.W,T3.H);R.setScissorTest(false);R.clear();R.render(T3.scene,T3.pcam);return}WK.t=0;return _l3w.apply(this,arguments)};
/* road view: eye level on the road in front of the plot */
function roadView(){if(WK.on)walkStop(true);var side=S.meta.road||"S",bb=T3.bb,P=siteBox(),cx=(P.x0+P.x1)/2,cz=(P.y0+P.y1)/2,d=Math.max(P.x1-P.x0,P.y1-P.y0)*0.9+25,pos,tgt=new THREE.Vector3(cx,5,cz);
 pos=side==="N"?new THREE.Vector3(cx-8,WK.eye,P.y0-d):side==="E"?new THREE.Vector3(P.x1+d,WK.eye,cz+8):side==="W"?new THREE.Vector3(P.x0-d,WK.eye,cz-8):new THREE.Vector3(cx+8,WK.eye,P.y1+d);
 if(T3.cam!==T3.pcam)setCam("persp");V3.anim={t0:performance.now(),dur:700,p0:T3.cam.position.clone(),p1:pos,g0:T3.ctl.target.clone(),g1:tgt};
 if(!V3.site){V3.site=true;build3D()}upd3UI();modal('<div class="mt">Road side</div><div class="ms">Which side of the plot is the road?</div><div class="row">'+["N","S","E","W"].map(function(k){return '<button class="bb'+(k===side?" ok":"")+'" data-rs="'+k+'">'+{N:"North (top)",S:"South (bottom)",E:"East (right)",W:"West (left)"}[k]+'</button>'}).join("")+'</div><div class="row"><button class="bb" id="rsX">OK</button></div>',function(b){$("rsX").onclick=closeModal;b.querySelectorAll("[data-rs]").forEach(function(x){x.onclick=function(){S.meta.road=x.dataset.rs;closeModal();build3D();roadView();closeModal()}})})}
function siteBox(){var x0=1e9,y0=1e9,x1=-1e9,y1=-1e9,add=function(p){x0=Math.min(x0,p.x);y0=Math.min(y0,p.y);x1=Math.max(x1,p.x);y1=Math.max(y1,p.y)};(S.L[0].cwalls||[]).forEach(function(w){w.pts.forEach(add)});if(x0>x1)S.L.forEach(function(L){L.pts.forEach(add)});if(x0>x1){x0=y0=0;x1=y1=30}
 var cw=(S.L[0].cwalls||[]).length;if(!cw){x0-=8;y0-=8;x1+=8;y1+=8}return {x0:x0,y0:y0,x1:x1,y1:y1}}
/* extra 3D content */
var _b3w=build3D;build3D=function(){_b3w.apply(this,arguments);try{w3Extras()}catch(e){console.warn("w3",e)}};
function w3Mat(c,o){return new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:0.85,metalness:0.05},o||{}))}
function w3Box(g,w,h,d,x,y,z,m){var b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);b.position.set(x,y,z);b.castShadow=true;b.receiveShadow=true;g.add(b);return b}
function w3Extras(){var G=new THREE.Group();G.userData.env="w3";T3.env.add(G);var PL=1.5,eve=V3.eve,cnt=0;
 /* electrical: lights + fans at the ceiling of each floor */
 var LM=w3Mat(0xfff7d6,{emissive:eve||WK.on?0xffe9a8:0x000000,emissiveIntensity:eve?1.4:0.6}),FM=w3Mat(0x7c5a3a),HM=w3Mat(0xd1d5db,{metalness:0.4});
 if(!V3.fdn)S.L.forEach(function(L,i){var ce=lvElev(i)+L.h-0.55;(L.elec||[]).forEach(function(e){if(e.t==="light"||e.t==="wlight"||e.t==="tube"){var m=e.t==="tube"?w3Box(G,2,0.18,0.18,e.x,ce-0.1,e.y,LM):new THREE.Mesh(new THREE.SphereGeometry(0.28,16,10),LM);if(e.t!=="tube"){m.position.set(e.x,ce-0.2,e.y);G.add(m)}
   if((eve||WK.on)&&cnt<10){var pl=new THREE.PointLight(0xffe3b0,eve?0.9:0.45,22,1.6);pl.position.set(e.x,ce-0.5,e.y);G.add(pl);cnt++}}
  else if(e.t==="fan"){w3Box(G,0.12,1.1,0.12,e.x,ce-0.55,e.y,HM);var hub=new THREE.Mesh(new THREE.CylinderGeometry(0.35,0.35,0.28,18),HM);hub.position.set(e.x,ce-1.15,e.y);G.add(hub);for(var k=0;k<3;k++){var bl=w3Box(G,2.1,0.05,0.42,0,0,0,FM);bl.geometry.translate(1.25,0,0);bl.position.set(e.x,ce-1.18,e.y);bl.rotation.y=k*2*Math.PI/3+0.3}}})});
 if(eve){T3.sun.intensity=0.12;T3.hemi.intensity=0.18;T3.amb.intensity=0.06;T3.scene.background=new THREE.Color("#1b2440");if(T3.scene.fog)T3.scene.fog.color.set("#1b2440")}else{T3.sun.intensity=1.15;T3.hemi.intensity=WK.on?0.75:0.55;T3.amb.intensity=WK.on?0.25:0.12}
 /* site: road, trees, street lights, gate gap */
 if(V3.site){var P=siteBox(),side=S.meta.road||"S",RW=20,rm=w3Mat(0x3f3f46),sm=w3Mat(0xd6d3d1),ym=w3Mat(0xfacc15,{emissive:0x333300}),tr=w3Mat(0x6b4423),lf=w3Mat(0x2f7d32),lf2=w3Mat(0x3f9b43),pm=w3Mat(0x52525b,{metalness:0.6}),lm=w3Mat(0xfff3c4,{emissive:0xffe7a0,emissiveIntensity:eve?1.5:0.3});
  var hz=side==="N"||side==="S",len=(hz?P.x1-P.x0:P.y1-P.y0)+120,cx=(P.x0+P.x1)/2,cz=(P.y0+P.y1)/2,off=6+RW/2,rc=side==="S"?{x:cx,z:P.y1+off}:side==="N"?{x:cx,z:P.y0-off}:side==="E"?{x:P.x1+off,z:cz}:{x:P.x0-off,z:cz};
  var road=w3Box(G,hz?len:RW,0.1,hz?RW:len,rc.x,-PL+0.03,rc.z,rm);road.castShadow=false;
  for(var t=-len/2+4;t<len/2;t+=10)w3Box(G,hz?5:0.35,0.02,hz?0.35:5,rc.x+(hz?t:0),-PL+0.1,rc.z+(hz?0:t),ym);
  var sw=side==="S"?-1:side==="N"?1:side==="E"?-1:1;w3Box(G,hz?len:4,0.4,hz?4:len,rc.x+(hz?0:sw*(RW/2+2)),-PL+0.2,rc.z+(hz?sw*(RW/2+2):0),sm);
  function tree(x,z,s){w3Box(G,0.6*s,5*s,0.6*s,x,-PL+2.5*s,z,tr);var a=new THREE.Mesh(new THREE.IcosahedronGeometry(3.2*s,1),lf);a.position.set(x,-PL+6.6*s,z);a.castShadow=true;G.add(a);var b=new THREE.Mesh(new THREE.IcosahedronGeometry(2.3*s,1),lf2);b.position.set(x+1.2*s,-PL+8.2*s,z-0.8*s);G.add(b)}
  function pole(x,z,dx,dz){w3Box(G,0.35,16,0.35,x,-PL+8,z,pm);w3Box(G,Math.abs(dx)*3+0.3,0.3,Math.abs(dz)*3+0.3,x+dx*1.5,-PL+15.9,z+dz*1.5,pm);w3Box(G,1.2,0.35,0.7,x+dx*3,-PL+15.6,z+dz*3,lm);if(eve&&cnt<14){var pl=new THREE.PointLight(0xffd9a0,1.2,45,1.5);pl.position.set(x+dx*3,-PL+15,z+dz*3);G.add(pl);cnt++}}
  for(var u=-len/2+15;u<len/2;u+=36){var px=rc.x+(hz?u:-sw*(RW/2+3)),pz=rc.z+(hz?-sw*(RW/2+3):u);pole(hz?px:rc.x+sw*(RW/2+1.5),hz?rc.z+sw*(RW/2+1.5):pz,hz?0:-sw,hz?-sw:0)}
  var C=[[P.x0-5,P.y0-5],[P.x1+5,P.y0-5],[P.x1+5,P.y1+5],[P.x0-5,P.y1+5],[(P.x0+P.x1)/2,P.y0-9],[P.x0-9,(P.y0+P.y1)/2],[P.x1+9,(P.y0+P.y1)/2]];C.forEach(function(c,i){tree(c[0],c[1],0.9+0.15*(i%3))});
  for(var v=-len/2+24;v<len/2;v+=36)tree(rc.x+(hz?v:sw*(RW/2+6)),rc.z+(hz?sw*(RW/2+6):v),0.8)}
 /* foundation: footings at depth with columns rising, plinth beams, pits */
 if(V3.fdn){T3.model.visible=false;T3.labels.visible=false;T3.edges.visible=false;var cm=w3Mat(0xa8a29e),pc=w3Mat(0x78716c),col=w3Mat(0x94a3b8),pbm=w3Mat(0xb45309),H=S.L[0].h,gl=-PL;
  stCols().forEach(function(c){var f=ftgOf(c),bot=gl-f.dep;w3Box(G,f.w+0.5,0.25,f.l+0.5,c.x,bot-0.125,c.y,pc);w3Box(G,f.w,f.t,f.l,c.x,bot+f.t/2,c.y,cm);var cw=c.w/12,cd=c.d/12,top=H;w3Box(G,cw,top-(bot+f.t),cd,c.x,(top+bot+f.t)/2,c.y,col);
   var pit=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(f.w+1,f.dep+0.25,f.l+1)),new THREE.LineBasicMaterial({color:0x92400e}));pit.position.set(c.x,gl-(f.dep+0.25)/2,c.y);G.add(pit)});
  var pb=pbCfg(),pw=pb.w/12,pd=pb.d/12;S.L[0].segs.forEach(function(s){var a=pt(s.a),b=pt(s.b),L=Math.hypot(b.x-a.x,b.y-a.y);if(L<0.5)return;var m=w3Box(G,L,pd,pw,(a.x+b.x)/2,gl+pd/2-0.25,(a.y+b.y)/2,pbm);m.rotation.y=-Math.atan2(b.y-a.y,b.x-a.x)});
  T3.env.children.forEach(function(o){if(o.userData.env==="ground"){o.material=o.material.clone();o.material.transparent=true;o.material.opacity=0.28;o.material.depthWrite=false}})}
 else{T3.model.visible=true;T3.edges.visible=true;if(WK.on)T3.labels.visible=false}}
