/* ---- FURNITURE 3D models (three.js primitives, feet units, origin = item centre on floor, back = -z) ---- */
function furnMaterials(M){function S(o){return new THREE.MeshStandardMaterial(o)}
 var woodL=texCanvas(128,512,function(x,w,h){x.fillStyle="#c08a58";x.fillRect(0,0,w,h);for(var i=0;i<70;i++){x.strokeStyle="rgba(90,50,20,"+(Math.random()*0.22)+")";x.lineWidth=Math.random()*2+0.5;var X=Math.random()*w;x.beginPath();x.moveTo(X,0);x.bezierCurveTo(X+6,h/3,X-6,2*h/3,X+3,h);x.stroke()}});
 var gran=texCanvas(256,256,function(x,w,h){x.fillStyle="#26272b";x.fillRect(0,0,w,h);for(var i=0;i<5000;i++){var c=Math.random();x.fillStyle=c<0.45?"rgba(190,185,175,"+(Math.random()*0.7)+")":c<0.6?"rgba(120,80,60,.6)":"rgba(0,0,0,.6)";var r=Math.random()*2.2+0.4;x.fillRect(Math.random()*w,Math.random()*h,r,r)}});
 var fab=texCanvas(128,128,function(x,w,h){noiseFill(x,w,h,"#ffffff",0.10,5000)});fab.repeat.set(2,2);
 var blk=texCanvas(128,128,function(x,w,h){x.fillStyle="#ffffff";x.fillRect(0,0,w,h);x.strokeStyle="rgba(0,0,0,.13)";x.lineWidth=6;for(var i=-w;i<w*2;i+=22){x.beginPath();x.moveTo(i,0);x.lineTo(i+h,h);x.stroke()}});blk.repeat.set(3,3);
 var scr=texCanvas(256,144,function(x,w,h){var g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,"#1d4e89");g.addColorStop(0.55,"#3d8ad6");g.addColorStop(1,"#0d2747");x.fillStyle=g;x.fillRect(0,0,w,h);x.fillStyle="rgba(255,255,255,.25)";x.beginPath();x.moveTo(0,h*0.75);x.quadraticCurveTo(w*0.4,h*0.45,w,h*0.7);x.lineTo(w,h);x.lineTo(0,h);x.fill()});scr.wrapS=scr.wrapT=THREE.ClampToEdgeWrapping;
 var F={};
 F.woodD=S({color:0xffffff,map:M.door.map,roughness:0.55});F.woodL=S({color:0xffffff,map:woodL,roughness:0.6});
 F.fabric=S({color:0x3c4f69,map:fab,roughness:1});F.cushion=S({color:0x4f6584,map:fab,roughness:1});F.accent=S({color:0xd08a2e,map:fab,roughness:1});F.headF=S({color:0xb59c82,map:fab,roughness:1});
 F.mattress=S({color:0xf6f3ec,roughness:0.95});F.blanket=S({color:0x58101c,map:blk,roughness:0.95});F.sheet=S({color:0xf4efe4,roughness:0.95});F.pillow=S({color:0xffffff,roughness:0.9});
 F.granite=S({color:0xffffff,map:gran,roughness:0.22,metalness:0.15});F.lam=S({color:0xeee8de,roughness:0.5});F.shutter=S({color:0x8c3f22,roughness:0.45});
 F.steel=S({color:0xd5d9de,metalness:0.45,roughness:0.3});F.steelD=S({color:0x9aa1a8,metalness:0.4,roughness:0.4});F.black=S({color:0x141517,roughness:0.18,metalness:0.3});F.iron=S({color:0x2b2b2b,roughness:0.6,metalness:0.5});
 F.ceramic=S({color:0xfdfdfb,roughness:0.12,metalness:0.02});F.seat=S({color:0xeeeeea,roughness:0.3});F.pan=S({color:0xb9c3c9,roughness:0.15});
 F.fridge=S({color:0xc9ced4,metalness:0.3,roughness:0.35});F.red=S({color:0xc4202b,roughness:0.42,metalness:0.1});F.brass=S({color:0xd2a637,metalness:0.55,roughness:0.35});
 F.screen=S({color:0xffffff,map:scr,emissive:0xffffff,emissiveMap:scr,emissiveIntensity:0.55,roughness:0.15});F.mirror=S({color:0xc4dbe8,metalness:0.15,roughness:0.08});
 F.bucket=S({color:0x2c6fd1,roughness:0.45});F.mug=S({color:0xe0502c,roughness:0.45});F.stool=S({color:0x3d9e5b,roughness:0.5});F.water=S({color:0x8cc4e6,transparent:true,opacity:0.75,roughness:0.05});
 F.shade=S({color:0xfff2d6,emissive:0xffd08a,emissiveIntensity:0.45,roughness:0.8});F.flame=S({color:0xffb030,emissive:0xff8c00,emissiveIntensity:1});F.tileW=S({color:0xeef4f5,map:M.tile,roughness:0.3});
 Object.keys(F).forEach(function(k){var m=F[k];if(m.color&&!m.map)m.color.convertSRGBToLinear();else if(m.color&&m.map&&m.color.getHex()!==0xffffff)m.color.convertSRGBToLinear();if(m.emissive&&!m.emissiveMap)m.emissive.convertSRGBToLinear()});
 M.F=F}
/* Stage: 3D view - furniture placed with the Component tool */
function furn3D(f){var M=T3.M,F=M.F,D=fdims(f),C0=FURN[f.type]||{},RIG={basin:1,wcw:1,wci:1,cyl:1,bucket:1}[f.type],w=RIG?C0.w:D.w,d=RIG?C0.d:D.d,h=D.h,L=-w/2,Rr=w/2,B=-d/2,Fr=d/2,G=new THREE.Group();
 function add(geo,mat,x,y,z,o){o=o||{};var m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(o.rx)m.rotation.x=o.rx;if(o.rz)m.rotation.z=o.rz;if(o.ry)m.rotation.y=o.ry;if(o.sx||o.sy||o.sz)m.scale.set(o.sx||1,o.sy||1,o.sz||1);m.userData.edges=o.edges!==false;G.add(m);return m}
 function bx(W,H,Dp,x,y0,z,mat,o){return add(new THREE.BoxGeometry(W,H,Dp),mat,x,y0+H/2,z,o)}
 function cy(rt,rb,H,x,y0,z,mat,o){o=o||{};return add(new THREE.CylinderGeometry(rt,rb,H,o.seg||18),mat,x,y0+H/2,z,o)}
 function sp(r,x,y,z,mat,o){o=o||{};o.edges=false;return add(new THREE.SphereGeometry(r,18,12),mat,x,y,z,o)}
 function legs(W,Dp,h,s,mat,ins){ins=ins||0.12;[[-1,-1],[1,-1],[1,1],[-1,1]].forEach(function(q){bx(s,h,s,q[0]*(W/2-ins),0,q[1]*(Dp/2-ins),mat)})}
 function cabinetRun(x0,x1,z0,z1,face){var W=x1-x0,Dp=z1-z0,cx=(x0+x1)/2,cz=(z0+z1)/2;bx(W-0.1,0.3,Dp-0.15,cx,0,cz-0.05,F.black,{edges:false});bx(W,2.25,Dp-0.05,cx,0.3,cz-0.02,F.lam);
  var run=face==="z"?W:Dp,n=Math.max(1,Math.round(run/1.6)),sw=run/n;for(var i=0;i<n;i++){var a=(face==="z"?x0:z0)+sw*i+sw/2;
   if(face==="z"){bx(sw-0.06,2.05,0.05,a,0.38,z1-0.02,F.shutter);bx(0.06,0.45,0.08,a+(i%2?-1:1)*(sw/2-0.22),1.9,z1+0.03,F.steel)}else{bx(0.05,2.05,sw-0.06,x1-0.02,0.38,a,F.shutter);bx(0.08,0.45,0.06,x1+0.03,1.9,a+(i%2?-1:1)*(sw/2-0.22),F.steel)}}
  bx(W+0.06,0.13,Dp+0.08,cx,2.55,cz+0.02,F.granite)}
 function sink(x,z){bx(2.6,0.03,1.45,x,2.68,z,F.steel);bx(1.12,0.02,1.15,x-0.62,2.7,z,F.steelD,{edges:false});bx(1.12,0.02,1.15,x+0.62,2.7,z,F.steelD,{edges:false});
  cy(0.06,0.06,1.0,x,2.68,z-0.9,F.steel);bx(0.08,0.08,0.75,x,3.62,z-0.55,F.steel);cy(0.05,0.05,0.18,x,3.48,z-0.2,F.steel)}
 function stove(x,z,along){var W=along?1.5:2.3,Dp=along?2.3:1.5;bx(W,0.2,Dp,x,2.68,z,F.black);[-1,1].forEach(function(k){var bxp=along?x:x+k*0.58,bz=along?z+k*0.58:z;cy(0.34,0.34,0.03,bxp,2.88,bz,F.iron,{seg:20});cy(0.16,0.16,0.05,bxp,2.89,bz,F.brass,{seg:16});
   for(var a=0;a<4;a++){var g=bx(0.6,0.05,0.04,bxp,2.92,bz,F.iron,{ry:a*Math.PI/4})}})}
 switch(f.type){
 /* Stage: Kitchen - modular units in 3D (base 720 carcass on 100 plinth, wall units / chimney lifted to their elevation) */
 case "km_base":case "km_sink":case "km_hob":case "km_drawer":case "km_corner":{var pl=100*MM,top=!(typeof kcCovers==="function"&&kcCovers(f.x,f.y));bx(w-0.1,pl,d-0.15,0,0,-0.05,F.black,{edges:false});bx(w,h,d-0.06,0,pl,-0.03,F.lam);
  if(f.type==="km_drawer"){for(var q=0;q<3;q++){bx(w-0.06,h/3-0.05,0.05,0,pl+0.03+q*h/3,Fr-0.025,F.shutter);bx(Math.min(0.8,w*0.4),0.05,0.06,0,pl+q*h/3+h/3-0.2,Fr+0.03,F.steel)}}
  else{var ns=f.doors||(w>1.6?2:1),sw=w/ns;for(var q2=0;q2<ns;q2++){var xx=L+sw*q2+sw/2;bx(sw-0.05,h-0.08,0.05,xx,pl+0.04,Fr-0.025,F.shutter);bx(0.06,0.45,0.06,xx+(q2%2?-1:1)*(sw/2-0.2),pl+h-0.7,Fr+0.03,F.steel)}}
  if(top)bx(w+0.04,0.13,d+0.06,0,pl+h,0.03,F.granite);if(f.type==="km_sink"&&w>=2.7)sink(0,0.05);else if(f.type==="km_sink")bx(w*0.7,0.03,d*0.6,0,pl+h+0.13,0.05,F.steel);if(f.type==="km_hob"&&w>=2.3)stove(0,0.05,false);break}
 case "km_tall":{var pl2=100*MM;bx(w-0.1,pl2,d-0.15,0,0,-0.05,F.black,{edges:false});bx(w,h-pl2,d-0.06,0,pl2,-0.03,F.lam);var hh=(h-pl2)/2;for(var q3=0;q3<2;q3++){bx(w-0.06,hh-0.06,0.05,0,pl2+0.03+q3*hh,Fr-0.025,F.shutter);bx(0.06,0.6,0.06,Rr-0.2,pl2+q3*hh+hh/2-0.3,Fr+0.03,F.steel)}break}
 case "km_wall":{bx(w,h,d,0,0,0,F.lam);var nw=f.doors||(w>1.6?2:1),sw2=w/nw;for(var q4=0;q4<nw;q4++){var x4=L+sw2*q4+sw2/2;bx(sw2-0.05,h-0.06,0.05,x4,0.03,Fr+0.025,F.shutter);bx(0.06,0.4,0.06,x4+(q4%2?-1:1)*(sw2/2-0.2),0.15,Fr+0.07,F.steel)}break}
 case "km_fsp":bx(w-0.2,h,d-0.15,0,0,-0.05,F.fridge);bx(0.07,1.2,0.1,Rr-0.35,h*0.45,Fr-0.1,F.steel);break;
 case "km_chim":bx(w,0.3,d,0,0,0,F.steel);bx(w*0.35,Math.max(0.3,h-0.3),d*0.5,0,0.3,B+d*0.25,F.steel);bx(w*0.9,0.03,d*0.9,0,-0.02,0,F.black,{edges:false});break;
 case "dbed":case "sbed":{legs(w,d,0.35,0.25,F.woodD,0.15);bx(w,0.85,d,0,0.35,0,F.woodD);bx(w+0.1,3.5,0.25,0,0,B+0.125,F.woodD);bx(w-0.5,1.55,0.12,0,1.75,B+0.3,F.headF);bx(w+0.04,1.55,0.18,0,0,Fr-0.09,F.woodD);
  bx(w-0.2,0.7,d-0.5,0,1.2,0.07,F.mattress);var bl=d*0.6,bz=Fr-0.28-bl/2;bx(w-0.08,0.1,bl,0,1.86,bz,F.blanket);[-1,1].forEach(function(k){bx(0.06,0.6,bl,k*(w/2-0.05),1.32,bz,F.blanket,{edges:false})});bx(w-0.08,0.15,0.55,0,1.88,bz-bl/2+0.28,F.sheet);
  var n=f.type==="dbed"?2:1,pw=(w-0.6)/n;for(var i=0;i<n;i++)sp(1,L+0.3+pw*(i+0.5),2.05,B+0.95,F.pillow,{sx:pw*0.44,sy:0.22,sz:0.5});break}
 case "wardrobe":bx(w,7,d,0,0,0,F.woodL);bx(w-0.08,0.04,0.06,0,5.6,Fr+0.02,F.woodD,{edges:false});[-1,1].forEach(function(k){bx(w/2-0.06,5.35,0.05,k*w/4,0.15,Fr+0.02,F.woodL);bx(w/2-0.06,1.2,0.05,k*w/4,5.68,Fr+0.02,F.woodL);bx(0.05,0.9,0.08,k*0.16,2.9,Fr+0.06,F.steel)});bx(w,0.15,d,0,0,0,F.woodD);break;
 case "sidetable":bx(w,1.9,d,0,0,0,F.woodD);bx(w-0.2,0.55,0.04,0,1.15,Fr+0.02,F.woodL);cy(0.04,0.04,0.06,0,1.4,Fr+0.06,F.brass,{rx:Math.PI/2});cy(0.22,0.28,0.1,0,1.9,0,F.brass);cy(0.04,0.04,0.75,0,2.0,0,F.brass);cy(0.25,0.42,0.55,0,2.65,0,F.shade);break;
 case "sofa3":case "sofa1":case "sofaset":{var k=f.type==="sofa1"?1:3,cw=(w-1.2)/k;[[-1,-1],[1,-1],[1,1],[-1,1]].forEach(function(q){cy(0.08,0.06,0.3,q[0]*(w/2-0.25),0,q[1]*(d/2-0.25),F.woodD)});
  bx(w,0.9,d,0,0.3,0,F.fabric);bx(w-1.2,1.75,0.6,0,1.2,B+0.3,F.fabric);[-1,1].forEach(function(s){bx(0.6,1.85,d,s*(w/2-0.3),0.3,0,F.fabric);bx(0.66,0.14,d+0.02,s*(w/2-0.3),2.08,0,F.cushion)});
  for(var j=0;j<k;j++){var x=L+0.6+cw*(j+0.5);bx(cw-0.06,0.45,d-0.95,x,1.2,0.22,F.cushion);bx(cw-0.1,1.35,0.42,x,1.62,B+0.78,F.cushion,{rx:-0.14})}
  sp(1,L+0.95,1.95,B+1.15,F.accent,{sx:0.42,sy:0.42,sz:0.14,rx:-0.3});if(k>1)sp(1,Rr-0.95,1.95,B+1.15,F.accent,{sx:0.42,sy:0.42,sz:0.14,rx:-0.3});break}
 case "ctable":legs(w,d,1.3,0.15,F.woodD);bx(w,0.12,d,0,1.3,0,F.woodD);bx(w-0.3,0.08,d-0.3,0,0.35,0,F.woodL);cy(0.18,0.12,0.3,0.6,1.42,0,F.brass,{seg:14});break;
 case "tvunit":{bx(w-0.2,0.15,d-0.2,0,0,0,F.black,{edges:false});bx(w,1.45,d,0,0.15,0,F.woodD);for(var i2=0;i2<3;i2++)bx(w/3-0.08,0.5,0.04,L+w/6+i2*w/3,0.55,Fr+0.02,F.woodL);
  var tw=w*0.78,th=tw*0.5625,tz=B+0.45;bx(0.9,0.05,0.5,0,1.6,tz+0.1,F.black);bx(0.15,0.42,0.1,0,1.65,tz,F.black);bx(tw,th,0.12,0,2.0,tz,F.black);add(new THREE.PlaneGeometry(tw-0.12,th-0.12),F.screen,0,2.0+th/2,tz+0.065,{edges:false});break}
 case "dining4":case "dining6":{var k2=f.type==="dining4"?2:3,tw2=w;legs(tw2,3,2.4,0.2,F.woodD,0.3);bx(tw2,0.12,3,0,2.4,0,F.woodD);
  for(var q=0;q<k2;q++){var cx=-tw2/2+tw2*(q+0.5)/k2;[-1,1].forEach(function(s){var zc=s*(1.5+0.68),g2=[];[[-1,-1],[1,-1],[1,1],[-1,1]].forEach(function(p){bx(0.12,1.5,0.12,cx+p[0]*0.55,0,zc+p[1]*0.52,F.woodL)});bx(1.32,0.12,1.28,cx,1.5,zc,F.woodL);bx(1.2,0.1,1.15,cx,1.62,zc,F.cushion);bx(1.32,1.75,0.12,cx,1.62,zc+s*0.58,F.woodL)})}
  break}
 case "counterS":cabinetRun(L,Rr,B,Fr,"z");bx(w,2.0,0.05,0,2.68,B+0.025,F.tileW);if(w>=4)sink(Rr-1.9,0.1);if(w>=5.5)stove(L+1.75,0.1,false);break;
 case "counterL":{var cd=Math.min(f.cd||2,Math.min(w,d)-0.5);cabinetRun(L+cd,Rr,B,B+cd,"z");cabinetRun(L,L+cd,B,Fr,"x");bx(w,2.0,0.05,0,2.68,B+0.025,F.tileW);bx(0.05,2.0,d,L+0.025,2.68,0,F.tileW);if(w-cd>=3)sink(Rr-1.9,B+cd/2+0.1);if(d-cd>=2.4)stove(L+cd/2+0.05,Fr-Math.min(2,(d-cd)/2),true);break}
 case "fridge":bx(w-0.1,0.12,d-0.2,0,0,0,F.black,{edges:false});bx(w-0.1,5.5,d-0.12,0,0.12,0,F.fridge);bx(w-0.08,0.03,0.03,0,3.9,Fr-0.05,F.steelD,{edges:false});bx(0.07,1.1,0.1,Rr-0.32,4.2,Fr+0.0,F.steel);bx(0.07,1.4,0.1,Rr-0.32,2.2,Fr+0.0,F.steel);break;
 case "cyl":cy(0.46,0.46,0.18,0,0,0,F.red);cy(0.5,0.5,1.45,0,0.18,0,F.red,{seg:24});sp(0.5,0,1.63,0,F.red,{sy:0.5});cy(0.24,0.24,0.28,0,1.78,0,F.red);cy(0.07,0.07,0.22,0,1.95,0,F.brass);break;
 case "wcw":bx(0.62,1.2,0.75,0,0,B+0.75,F.ceramic);cy(0.62,0.45,1.2,0,0,B+1.45,F.ceramic,{sx:1.4*0.4/0.62,sz:0.85/0.62,seg:24});cy(0.64,0.64,0.07,0,1.2,B+1.45,F.seat,{sx:1.4*0.41/0.64,sz:0.88/0.64,seg:24});
  bx(1.35,1.25,0.58,0,1.27,B+0.3,F.ceramic);bx(1.42,0.08,0.64,0,2.52,B+0.31,F.ceramic);cy(0.08,0.08,0.03,0,2.6,B+0.31,F.steel,{seg:14});break;
 case "wci":bx(w,0.14,d,0,0,0,F.ceramic);cy(0.42,0.42,0.02,0,0.14,0.1,F.pan,{sz:0.75/0.42,seg:22,edges:false});cy(0.13,0.13,0.025,0,0.145,-0.4,F.steelD,{seg:14,edges:false});[-1,1].forEach(function(s){bx(0.26,0.06,0.7,s*0.55,0.14,0.6,F.ceramic)});cy(0.05,0.05,0.3,0.5,1.8,B+0.12,F.steel,{rx:Math.PI/2});break;
 case "basin":cy(0.17,0.24,2.15,0,0,B+0.55,F.ceramic,{seg:16});cy(0.8,0.55,0.5,0,2.15,B+0.75,F.ceramic,{sx:1.8*0.45/0.8,sz:0.62/0.8,seg:24});cy(0.68,0.68,0.02,0,2.64,B+0.78,F.pan,{sx:1.8*0.45/0.8,sz:0.5/0.8,seg:24,edges:false});
  cy(0.045,0.045,0.38,0,2.65,B+0.22,F.steel);bx(0.06,0.06,0.3,0,2.98,B+0.36,F.steel);bx(1.6,2.1,0.05,0,3.5,B+0.03,F.mirror);break;
 case "shower":bx(w,0.15,d,0,0,0,F.ceramic);var gl=T3.M.glass;bx(w*0.55,6.3,0.04,Rr-w*0.275,0.15,Fr-0.03,gl,{edges:false});bx(0.04,6.3,d,Rr-0.03,0.15,0,gl,{edges:false});bx(w*0.55,0.06,0.06,Rr-w*0.275,6.45,Fr-0.03,F.steel);bx(0.06,0.06,d,Rr-0.03,6.45,0,F.steel);
  cy(0.05,0.05,5.9,0,0.15,B+0.1,F.steel);bx(0.06,0.06,0.6,0,6.0,B+0.38,F.steel);cy(0.32,0.22,0.08,0,5.9,B+0.65,F.steel,{seg:20});cy(0.12,0.12,0.12,0,3.6,B+0.12,F.steel,{rx:Math.PI/2});cy(0.15,0.15,0.01,0,0.15,0,F.steelD,{edges:false});break;
 case "bucket":cy(0.45,0.36,1.1,0.25,0,0.3,F.bucket,{seg:22});cy(0.42,0.42,0.02,0.25,0.98,0.3,F.water,{seg:22,edges:false});cy(0.17,0.14,0.35,-0.65,0,0.55,F.mug);bx(0.7,0.55,0.7,-0.65,0,-0.5,F.stool);cy(0.05,0.05,0.35,0,1.9,B+0.18,F.steel,{rx:Math.PI/2});cy(0.04,0.04,0.25,0,1.68,B+0.33,F.steel);break;
 case "pooja":{bx(w,2.4,d,0,0,0,F.woodL);[-1,1].forEach(function(s){bx(w/2-0.06,2.1,0.04,s*w/4,0.15,Fr+0.02,F.woodD)});bx(w,3.6,0.12,0,2.4,B+0.06,F.woodD);[-1,1].forEach(function(s){bx(0.15,3.6,d,s*(w/2-0.075),2.4,0,F.woodD)});
  bx(w+0.25,0.25,d+0.2,0,6.0,0.05,F.woodD);cy(0.0,0.42,0.45,0,6.25,0,F.brass,{seg:4,ry:Math.PI/4});bx(w-0.3,0.08,d,0,2.4,0,F.woodL);bx(w-0.6,0.3,d*0.5,0,2.48,B+d*0.3,F.woodL);bx(w-1.2,0.3,d*0.4,0,2.78,B+d*0.22,F.woodL);
  cy(0.12,0.16,0.3,0,3.08,B+0.25,F.brass);sp(0.16,0,3.5,B+0.25,F.brass,{sy:1.3});[-1,1].forEach(function(s){cy(0.07,0.12,0.22,s*w/3,2.48,Fr-0.25,F.brass);sp(0.045,s*w/3,2.78,Fr-0.25,F.flame,{sy:1.8})});break}
 }
 G.position.set(f.x,0.005+(D.z||0),f.y);G.rotation.y=-(f.rot||0)*Math.PI/180;if(RIG)G.scale.set(D.w/C0.w,1,D.d/C0.d);if(f.h&&!C0.km&&C0.h)G.scale.y=f.h/C0.h;G.updateMatrix();
 G.children.slice().forEach(function(m){m.applyMatrix4(G.matrix);m.castShadow=m.material!==T3.M.glass;m.receiveShadow=true;m.userData.layer=m.material===T3.M.glass?"GLASS3D":"FURN3D";m.userData.real=m.material;T3.model.add(m);
  if(m.userData.edges){var e=new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry,28),T3.M.edgeReal);e.position.copy(m.position);e.quaternion.copy(m.quaternion);e.scale.copy(m.scale);e.userData.layer="FURN3D";T3.edges.add(e)}})}
