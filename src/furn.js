/* ================= FURNITURE library (plan symbols; 3D models are in v3d.js) ================= */
/* Stage: Build - Component tool: furniture and fixture library */
var MM=1/304.8;
var FURN={
 dbed:{n:"Double bed",cat:"Bedroom",w:5,d:6.5,h:3.5},sbed:{n:"Single bed",cat:"Bedroom",w:3,d:6.5,h:3.5},wardrobe:{n:"Wardrobe",cat:"Bedroom",w:4,d:2,h:7},sidetable:{n:"Side table",cat:"Bedroom",w:1.5,d:1.5,h:3.2},
 sofaset:{n:"Sofa set 3+1+1",cat:"Hall",w:6.5,d:3,composite:true,h:2.8},sofa3:{n:"3-seater sofa",cat:"Hall",w:6.5,d:3,h:2.8},sofa1:{n:"Single sofa",cat:"Hall",w:3,d:3,h:2.8},ctable:{n:"Center table",cat:"Hall",w:3.5,d:2,h:1.5},
 tvunit:{n:"TV unit + TV",cat:"Hall",w:5,d:1.5,h:4.5},dining4:{n:"Dining + 4 chairs",cat:"Hall",w:4,d:5.6,h:2.5},dining6:{n:"Dining + 6 chairs",cat:"Hall",w:5.5,d:5.6,h:2.5},
 counterL:{n:"L platform (sink+stove)",cat:"Kitchen",w:8,d:6,h:2.75},counterS:{n:"Straight platform",cat:"Kitchen",w:8,d:2,h:2.75},fridge:{n:"Fridge",cat:"Kitchen",w:2.25,d:2.25,h:5.6},cyl:{n:"Gas cylinder",cat:"Kitchen",w:1.2,d:1.2,h:2.1},
 wcw:{n:"Western WC",cat:"Toilet",w:1.4,d:2.3,h:2.6},wci:{n:"Indian WC",cat:"Toilet",w:1.6,d:2.2,h:0.3},basin:{n:"Wash basin",cat:"Toilet",w:1.8,d:1.4,h:2.7},shower:{n:"Shower",cat:"Toilet",w:3,d:3,h:6.5},bucket:{n:"Bucket area",cat:"Toilet",w:2.5,d:2.5,h:2.1},
 pooja:{n:"Pooja shelf",cat:"Pooja",w:3,d:1.25,h:6.5},
 /* Stage: Kitchen - modular kitchen units (sizes in mm, stored in feet) */
 km_base:{n:"Base cabinet",cat:"Modular",w:600*MM,d:560*MM,h:720*MM,km:"base"},km_drawer:{n:"Drawer unit",cat:"Modular",w:600*MM,d:560*MM,h:720*MM,km:"base"},
 km_sink:{n:"Sink unit",cat:"Modular",w:900*MM,d:560*MM,h:720*MM,km:"base"},km_hob:{n:"Hob unit",cat:"Modular",w:900*MM,d:560*MM,h:720*MM,km:"base"},
 km_corner:{n:"Corner unit",cat:"Modular",w:900*MM,d:900*MM,h:720*MM,km:"base"},km_wall:{n:"Wall cabinet",cat:"Modular",w:600*MM,d:300*MM,h:720*MM,km:"wall",z:1400*MM},
 km_tall:{n:"Tall unit",cat:"Modular",w:600*MM,d:560*MM,h:2100*MM,km:"tall"},km_fsp:{n:"Fridge space",cat:"Modular",w:750*MM,d:650*MM,h:1800*MM,km:"space"},
 km_chim:{n:"Chimney",cat:"Modular",w:900*MM,d:500*MM,h:900*MM,km:"wall",z:1600*MM}};
var FCATS=[["Bedroom","படுக்கை அறை"],["Hall","ஹால்"],["Kitchen","சமையலறை"],["Toilet","கழிவறை"],["Pooja","பூஜை"],["Modular","Kitchen units"]];
/* ready sizes per item [label, w ft, d ft, extra] */
function mmP(l,w,d,x){return [l,w*MM,d*MM,x]}
var FPRE={dbed:[["Single 3'x6'3\"",3,6.25],["Double 4'6\"x6'3\"",4.5,6.25],["Queen 5'x6'6\"",5,6.5],["King 6'x6'6\"",6,6.5]],
 wardrobe:[["2-door 3'x2'",3,2,{doors:2}],["3-door 4'6\"x2'",4.5,2,{doors:3}],["4-door 6'x2'",6,2,{doors:4}],["Sliding 6'x2'2\"",6,2.17,{doors:2}]],
 sidetable:[["Small 1'3\"",1.25,1.25],["Standard 1'6\"",1.5,1.5],["Large 2'",2,1.5]],
 sofa3:[["2-seater 4'6\"",4.5,3],["3-seater 6'6\"",6.5,3],["4-seater 8'",8,3]],sofa1:[["Compact 2'6\"",2.5,2.75],["Standard 3'",3,3]],ctable:[["Small 3'x1'6\"",3,1.5],["Standard 3'6\"x2'",3.5,2],["Large 4'x2'6\"",4,2.5]],
 tvunit:[["4' unit",4,1.5],["5' unit",5,1.5],["6' unit",6,1.5],["8' unit",8,1.5]],dining4:[["4-seater 4'x5'6\"",4,5.6],["Square 3'6\"",3.5,5.6]],dining6:[["6-seater 5'6\"",5.5,5.6],["8-seater 7'",7,5.6]],
 counterS:[["6' x 2'",6,2],["8' x 2'",8,2],["10' x 2'",10,2],["12' x 2'",12,2]],counterL:[["8' x 6'",8,6,{cd:2}],["10' x 8'",10,8,{cd:2}],["12' x 8'",12,8,{cd:2}]],
 fridge:[["Single door 2'x2'",2,2],["Double door 2'4\"x2'4\"",2.33,2.33],["Side-by-side 3'x2'4\"",3,2.33]],cyl:[["Standard",1.2,1.2]],
 wcw:[["Compact 1'2\"x1'11\"",1.17,1.92],["Standard 1'4\"x2'3\"",1.4,2.3],["Wall hung 1'2\"x1'9\"",1.17,1.75]],wci:[["Standard 1'8\"x2'2\"",1.6,2.2],["Large 1'10\"x2'4\"",1.83,2.33]],
 basin:[["Small 1'4\"x1'",1.33,1],["Standard 1'10\"x1'5\"",1.8,1.4],["Large 2'x1'8\"",2,1.67],["Counter 3'x1'8\"",3,1.67]],shower:[["3' x 3'",3,3],["3' x 4'",3,4],["4' x 4'",4,4]],
 bucket:[["2'6\" x 2'6\"",2.5,2.5],["3' x 3'",3,3]],pooja:[["2' shelf",2,1.25],["3' shelf",3,1.25],["4' unit",4,1.5]],
 km_base:[mmP("300",300,560),mmP("450",450,560),mmP("600",600,560),mmP("900",900,560)],km_drawer:[mmP("450",450,560),mmP("600",600,560),mmP("900",900,560)],
 km_sink:[mmP("600",600,560),mmP("800",800,560),mmP("900",900,560)],km_hob:[mmP("600",600,560),mmP("750",750,560),mmP("900",900,560)],
 km_corner:[mmP("900x900",900,900),mmP("1000x1000",1000,1000)],km_wall:[mmP("300",300,300),mmP("450",450,300),mmP("600",600,300),mmP("900",900,300)],
 km_tall:[mmP("450",450,560),mmP("600",600,560)],km_fsp:[mmP("Single door 700",700,650),mmP("Double door 800",800,700),mmP("Side-by-side 950",950,750)],km_chim:[mmP("600",600,500),mmP("900",900,500)]};
FPRE.sbed=FPRE.dbed;
function fdims(f){var c=FURN[f.type]||{w:2,d:2,h:3};return {w:f.w||c.w,d:f.d||c.d,h:f.h||c.h||3,z:f.z!=null?f.z:(c.z||0)}}
function isKM(t){return !!(FURN[t]&&FURN[t].km)}
/* plan symbol primitives in local feet, centre (0,0), back of the item at y=-d/2.
   Stage: Furniture size editing - every symbol is drawn from the item's own width / depth (fixed details are capped so they stay in proportion) */
function furnSym(type,w,d,f){var P=[],L=-w/2,Rr=w/2,B=-d/2,F=d/2,mn=Math.min(w,d);f=f||{};
 function r(x0,y0,x1,y1,o){P.push({t:"r",x0:x0,y0:y0,x1:x1,y1:y1,o:o||{}})}function l(x0,y0,x1,y1,o){P.push({t:"l",x0:x0,y0:y0,x1:x1,y1:y1,o:o||{}})}
 function e(cx,cy,rx,ry,o){var pts=[];for(var i=0;i<28;i++){var a=i/28*Math.PI*2;pts.push([cx+rx*Math.cos(a),cy+ry*Math.sin(a)])}P.push({t:"p",pts:pts,closed:true,o:o||{}})}
 function c(cx,cy,rr,o){e(cx,cy,rr,rr,o)}function p(pts,cl,o){P.push({t:"p",pts:pts,closed:cl,o:o||{}})}
 function sinkAt(x0,x1,y0,y1){var W=x1-x0,H=y1-y0;if(W>2.2){var m=(x0+x1)/2;r(x0,y0,m-0.05,y1,{fill:4});r(m+0.05,y0,x1,y1,{fill:4});c((x0+m)/2,(y0+y1)/2,0.08);c((m+x1)/2,(y0+y1)/2,0.08)}else{r(x0,y0,x1,y1,{fill:4});c((x0+x1)/2,(y0+y1)/2,0.08)}}
 function hobAt(cx,cy,along){var a=along?0:1,rr=0.36;r(cx-(a?1.1:0.6),cy-(a?0.6:1.1),cx+(a?1.1:0.6),cy+(a?0.6:1.1));[-0.55,0.55].forEach(function(k){var x=cx+(a?k:0),y=cy+(a?0:k);c(x,y,rr);c(x,y,0.14)})}
 switch(type){
 case "dbed":case "sbed":{var hb=Math.min(0.3,d*0.05),sc=Math.min(1,d/6.5);r(L,B,Rr,F,{fill:1});r(L,B,Rr,B+hb,{fill:2});var n=w>=3.9?2:1,g=Math.min(0.25,w*0.05),pw=(w-2*g-(n-1)*g)/n,py0=B+hb+0.2*sc,py1=py0+Math.min(1,d*0.16);
  for(var i=0;i<n;i++){var x=L+g+i*(pw+g);r(x,py0,x+pw,py1,{fill:3})}var fy=B+d*0.36;l(L,fy,Rr,fy);var fw=Math.min(1.3,w*0.35);p([[Rr-fw,fy],[Rr,fy+Math.min(1.1,d*0.17)]],false);l(L+0.15,F-0.15,Rr-0.15,F-0.15,{dash:1});break}
 case "wardrobe":{r(L,B,Rr,F,{fill:1});var nd=f.doors||(w<=2.6?1:Math.max(2,Math.round(w/1.6)));for(var k=1;k<nd;k++){var xd=L+w*k/nd;l(xd,B,xd,F)}l(L,F-Math.min(0.12,d*0.08),Rr,F-Math.min(0.12,d*0.08));l(L+0.2,0,Rr-0.2,0,{dash:1});var hs=Math.min(0.35,d*0.18);for(var x2=L+0.5;x2<Rr-0.3;x2+=0.5)l(x2,-hs,x2+0.15,hs);break}
 case "sidetable":r(L,B,Rr,F,{fill:1});c(0,0,mn*0.28);l(-mn*0.17,0,mn*0.17,0);l(0,-mn*0.17,0,mn*0.17);break;
 case "sofa3":case "sofa1":case "sofaset":{var ar=Math.min(0.6,w*0.15),bk=Math.min(0.7,d*0.25);r(L,B,Rr,F,{fill:1});r(L,B,Rr,B+bk,{fill:2});r(L,B,L+ar,F,{fill:2});r(Rr-ar,B,Rr,F,{fill:2});var ks=type==="sofa1"?1:Math.max(1,Math.round((w-2*ar)/1.8)),cw=(w-2*ar)/ks;for(var j=0;j<ks;j++)r(L+ar+j*cw+0.05,B+bk+0.05,L+ar+(j+1)*cw-0.05,F-0.1,{fill:3});break}
 case "ctable":{var ins=Math.min(0.25,mn*0.12);r(L,B,Rr,F,{fill:1});r(L+ins,B+ins,Rr-ins,F-ins);break}
 case "tvunit":{r(L,B,Rr,F,{fill:1});var tw=w*0.75,td=Math.min(0.28,d*0.2);r(-tw/2,B+0.12*Math.min(1,d/1.5),tw/2,B+0.12*Math.min(1,d/1.5)+td,{fill:4});var sw=Math.min(0.5,w*0.12);r(-sw,B+0.4*Math.min(1,d/1.5),sw,B+0.75*Math.min(1,d/1.5));l(L+0.2,F-0.12,Rr-0.2,F-0.12,{dash:1});break}
 case "dining4":case "dining6":{var th=Math.max(1.5,d-2.6),ch=Math.min(1.2,(d-th)/2-0.1),k2=Math.max(1,Math.round(w/1.9)),cw2=Math.min(1.3,w/k2*0.8);r(-w/2,-th/2,w/2,th/2,{fill:1});
  for(var q=0;q<k2;q++){var cx=-w/2+w*(q+0.5)/k2,hw=cw2/2;if(ch>0.3){r(cx-hw,-th/2-ch-0.1,cx+hw,-th/2-0.1,{fill:3});r(cx-hw,-th/2-ch-0.1,cx+hw,-th/2-ch+0.1,{fill:2});r(cx-hw,th/2+0.1,cx+hw,th/2+ch+0.1,{fill:3});r(cx-hw,th/2+ch-0.1,cx+hw,th/2+ch+0.1,{fill:2})}}break}
 case "counterS":{r(L,B,Rr,F,{fill:1});var by=Math.min(0.3,d*0.15);if(w>=3.2){var sW=w>=6?2.6:Math.min(1.6,w*0.4);sinkAt(Rr-0.6-sW,Rr-0.6,B+by,F-by)}if(w>=5.5)hobAt(L+0.6+1.1,0,true);else if(w<3.2)c(0,0,Math.min(0.3,mn*0.25));break}
 case "counterL":{var cd=Math.min(f.cd||2,Math.min(w,d)-0.5);p([[L,B],[Rr,B],[Rr,B+cd],[L+cd,B+cd],[L+cd,F],[L,F]],true,{fill:1});l(L+cd,B+cd,L,B,{dash:1});
  var sW2=Math.min(2.6,Math.max(1.2,w-cd-1.2));if(w-cd>=2)sinkAt(Rr-0.4-sW2,Rr-0.4,B+0.3*Math.min(1,cd/2),B+cd-0.3*Math.min(1,cd/2));if(d-cd>=2.4)hobAt(L+cd/2,F-Math.min(2,(d-cd)/2),false);break}
 case "fridge":r(L,B,Rr,F,{fill:1});r(L+0.12,B+0.12,Rr-0.12,F-0.3);l(L,F-0.3,Rr,F-0.3);l(Rr-Math.min(0.45,w*0.2),F-0.3,Rr-Math.min(0.45,w*0.2),F);if(w>2.8)l(0,B+0.12,0,F-0.3);break;
 case "cyl":c(0,0,mn*0.46,{fill:4});c(0,0,mn*0.17);break;
 case "wcw":{var tk=Math.min(0.6,d*0.26),ry=(d-tk)/2*0.95,rx=Math.min(w*0.4,ry*0.85);r(L,B,Rr,B+tk,{fill:1});e(0,B+tk+(d-tk)/2,rx,ry,{fill:1});e(0,B+tk+(d-tk)/2+ry*0.05,rx*0.68,ry*0.7);break}
 case "wci":{var sx=w/1.6,sy=d/2.2;r(L,B,Rr,F,{fill:1});e(0,0.1*sy,0.42*sx,0.75*sy);c(0,-0.35*sy,0.14*Math.min(sx,sy));r(-0.68*sx,0.25*sy,-0.42*sx,0.95*sy,{fill:2});r(0.42*sx,0.25*sy,0.68*sx,0.95*sy,{fill:2});break}
 case "basin":{var bs=Math.min(0.25,d*0.18),av=d-bs,ry2=Math.min(av*0.46,w*0.4),rx2=Math.min(w*0.45,ry2*1.6),cy2=B+bs+av/2;r(L,B,Rr,B+bs,{fill:2});if(w>2.6)r(L,B,Rr,F,{});e(0,cy2,rx2,ry2,{fill:1});e(0,cy2+ry2*0.08,rx2*0.72,ry2*0.7);c(0,B+bs+Math.min(0.15,av*0.1),0.08);break}
 case "shower":r(L,B,Rr,F,{fill:1});l(L,B,Rr,F);l(Rr,B,L,F);c(0,0,0.15);c(0,B+0.3,0.22,{fill:4});break;
 case "bucket":{var s2=mn/2.5;r(L,B,Rr,F,{dash:1});c(0.25*s2,0.3*s2,0.45*s2,{fill:4});c(-0.65*s2,0.55*s2,0.18*s2);c(0,B+0.2,0.08);l(0,B,0,B+0.2);r(-1*s2,-0.9*s2,-0.3*s2,-0.2*s2);break}
 case "pooja":{var sh=Math.min(0.4,d*0.32);r(L,B,Rr,F,{fill:1});l(L,B+sh,Rr,B+sh);l(L,B+2*sh,Rr,B+2*sh);c(-w/3,F-0.22,0.1,{fill:4});c(w/3,F-0.22,0.1,{fill:4});var pw2=Math.min(0.4,w*0.15);p([[-pw2,B+sh],[-pw2,B+sh*0.4],[0,B+0.02],[pw2,B+sh*0.4],[pw2,B+sh]],false);break}
 /* modular kitchen units: carcass + shutter lines (wall units / chimney dashed = above the counter) */
 case "km_base":case "km_sink":case "km_hob":case "km_drawer":case "km_tall":{r(L,B,Rr,F,{fill:type==="km_tall"?2:1});var nsh=f.doors||(w>1.6?2:1);l(L,F-0.06,Rr,F-0.06);
  if(type==="km_drawer"){[0.25,0.5,0.75].forEach(function(t){l(L+0.05,B+d*t,Rr-0.05,B+d*t,{dash:1})})}else for(var k3=1;k3<nsh;k3++)l(L+w*k3/nsh,B,L+w*k3/nsh,F);
  if(type==="km_sink")sinkAt(L+Math.min(0.25,w*0.1),Rr-Math.min(0.25,w*0.1),B+d*0.15,F-d*0.2);if(type==="km_hob"&&w>=1.8)hobAt(0,0,true);if(type==="km_tall"){l(L,B,Rr,F);l(Rr,B,L,F)}break}
 case "km_corner":{r(L,B,Rr,F,{fill:1});var cd2=Math.min(560*MM,mn*0.62);p([[L+cd2,B+cd2],[Rr,B+cd2]],false,{dash:1});p([[L+cd2,B+cd2],[L+cd2,F]],false,{dash:1});c(L+cd2*0.5,B+cd2*0.5,Math.min(0.35,cd2*0.3));break}
 case "km_wall":{r(L,B,Rr,F,{dash:1});var nw2=f.doors||(w>1.6?2:1);for(var k4=1;k4<nw2;k4++)l(L+w*k4/nw2,B,L+w*k4/nw2,F,{dash:1});break}
 case "km_chim":{p([[L,B],[Rr,B],[Rr-w*0.3,F],[L+w*0.3,F]],true,{dash:1});r(-Math.min(0.5,w*0.15),B,Math.min(0.5,w*0.15),B+Math.min(0.6,d*0.4),{dash:1});break}
 case "km_fsp":{r(L,B,Rr,F,{dash:1});l(L,B,Rr,F,{dash:1});l(Rr,B,L,F,{dash:1});break}
 default:r(L,B,Rr,F)}
 return P}
var FFILL={1:"#fbf6ee",2:"#e7d6bd",3:"#ffffff",4:"#d9e6f2"};
function fXform(f){var a=(f.rot||0)*Math.PI/180,cs=Math.cos(a),sn=Math.sin(a);return function(x,y){return {x:f.x+x*cs-y*sn,y:f.y+x*sn+y*cs}}}
function primPolys(pr){if(pr.t==="r")return [[pr.x0,pr.y0],[pr.x1,pr.y0],[pr.x1,pr.y1],[pr.x0,pr.y1]];if(pr.t==="l")return [[pr.x0,pr.y0],[pr.x1,pr.y1]];return pr.pts}
/* draw onto the plan canvas */
function drawFurnCanvas(f,sel){var D=fdims(f),X=fXform(f),P=furnSym(f.type,D.w,D.d,f);
 P.forEach(function(pr){var pts=primPolys(pr).map(function(q){var w=X(q[0],q[1]);return w2s(w.x,w.y)}),closed=pr.t!=="l"&&pr.closed!==false;
  g.beginPath();pts.forEach(function(q,i){i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y)});if(closed)g.closePath();
  if(closed&&pr.o.fill){g.fillStyle=FFILL[pr.o.fill];g.fill()}g.setLineDash(pr.o.dash?[4,3]:[]);g.strokeStyle=sel?"#e8590c":"#7a5432";g.lineWidth=sel?2:1.2;g.stroke();g.setLineDash([])});
 if(sel){var c=w2s(f.x,f.y);g.beginPath();g.arc(c.x,c.y,6,0,7);g.fillStyle="#e8590c";g.fill()}}
/* draw onto the sheet (Dwg) - layer FURNITURE */
function drawFurnSheet(d,R,f){var D=fdims(f),X=fXform(f),P=furnSym(f.type,D.w,D.d,f);
 P.forEach(function(pr){var pts=primPolys(pr).map(function(q){var w=X(q[0],q[1]);return R(w.x,w.y)});
  if(pr.t==="l")d.line(pts[0][0],pts[0][1],pts[1][0],pts[1][1],{w:0.15,c:"#6b4a2b",L:"FURNITURE",dash:pr.o.dash?[0.8,0.6]:null});
  else{if(pr.o.fill)d.poly(pts,{w:0,fill:FFILL[pr.o.fill],nodxf:true});d.poly(pts,{w:0.18,c:"#6b4a2b",closed:pr.closed!==false,L:"FURNITURE",dash:pr.o.dash?[0.8,0.6]:null})}})}
function furnIcon(type){var c=FURN[type],cv2=document.createElement("canvas"),W=96,H=72;cv2.width=W*2;cv2.height=H*2;var x=cv2.getContext("2d");x.scale(2,2);
 var D={w:c.w,d:c.d},s=Math.min((W-12)/D.w,(H-12)/D.d),P=furnSym(type,D.w,D.d);
 P.forEach(function(pr){var pts=primPolys(pr).map(function(q){return [W/2+q[0]*s,H/2+q[1]*s]}),closed=pr.t!=="l"&&pr.closed!==false;x.beginPath();pts.forEach(function(q,i){i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1])});if(closed)x.closePath();
  if(closed&&pr.o.fill){x.fillStyle=FFILL[pr.o.fill];x.fill()}x.setLineDash(pr.o.dash?[3,2]:[]);x.strokeStyle="#6b4a2b";x.lineWidth=1.1;x.stroke()});
 return cv2.toDataURL()}
function furnAt(x,y){var hit=null;(S.furn||[]).forEach(function(f){var D=fdims(f),a=-(f.rot||0)*Math.PI/180,dx=x-f.x,dy=y-f.y,lx=dx*Math.cos(a)-dy*Math.sin(a),ly=dx*Math.sin(a)+dy*Math.cos(a);if(Math.abs(lx)<=D.w/2+0.2&&Math.abs(ly)<=D.d/2+0.2)hit=f});return hit}
/* snap an item flush against the nearest wall (inner face); optionally turn its back to that wall */
function snapFurn(f,autoRot){var best=null;S.segs.forEach(function(s){var a=pt(s.a),b=pt(s.b),q=projSeg(f.x,f.y,a,b);if(q.t<-0.05||q.t>1.05)return;var hz=Math.abs(a.y-b.y)<1e-6,vt=Math.abs(a.x-b.x)<1e-6;if(!hz&&!vt)return;if(!best||q.d<best.d)best={s:s,d:q.d,hz:hz,a:a,b:b}});
 var D=fdims(f);if(!best)return;var t=(S.meta.dbl?wallT(best.s):0)/2;
 if(autoRot){if(best.hz)f.rot=best.a.y<f.y?0:180;else f.rot=best.a.x<f.x?270:90}
 var half=(f.rot%180===0)?(best.hz?D.d/2:D.w/2):(best.hz?D.w/2:D.d/2);
 if(best.d-(t+half)<(autoRot?6:1.2)){if(best.hz){var sg=best.a.y<f.y?1:-1;f.y=best.a.y+sg*(t+half)}else{var sg2=best.a.x<f.x?1:-1;f.x=best.a.x+sg2*(t+half)}}}
/* Stage: Build - Component tool: place an item */
function addFurn(type,x,y){snapshot();S.furn=S.furn||[];var c=FURN[type];
 if(c.composite){var f={id:nid(),type:"sofa3",x:x,y:y,rot:0};snapFurn(f,true);var X=fXform(f);S.furn.push(f);
  [[-(3.25+0.3+1.5),2.4,270],[3.25+0.3+1.5,2.4,90]].forEach(function(o){var p=X(o[0],o[1]);var g={id:nid(),type:"sofa1",x:p.x,y:p.y,rot:(f.rot+o[2])%360};snapFurn(g,false);S.furn.push(g)});var pc=X(0,4.4);S.furn.push({id:nid(),type:"ctable",x:pc.x,y:pc.y,rot:f.rot});UI.fsel=f.id}
 else{var f2={id:nid(),type:type,x:gsnap(x),y:gsnap(y),rot:0};snapFurn(f2,true);S.furn.push(f2);UI.fsel=f2.id}
 changed();updCtx();toast(c.n+" placed - drag to move, Rotate 90° to turn")}
function furnPopup(x,y){var cat=UI.fcat||"Bedroom";
 function body(){return '<div class="mt">Furniture / மரச்சாமான்</div><div class="ms">Tap an item to place it here. It snaps to the nearest wall.</div><div class="row" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr))">'+FCATS.map(function(c){return '<button class="bb '+(c[0]===cat?"on":"")+'" data-fc="'+c[0]+'">'+c[0]+'<small>'+c[1]+'</small></button>'}).join("")+'</div><div class="grid3">'+
  Object.keys(FURN).filter(function(k){return FURN[k].cat===cat}).map(function(k){return '<button class="bb" data-fi="'+k+'" style="min-height:110px"><img src="'+furnIcon(k)+'" style="width:96px;height:72px;display:block;margin:0 auto 2px"><span style="font-size:14px">'+esc(FURN[k].n)+'</span><small>'+(isKM(k)?Math.round(FURN[k].w/MM)+' x '+Math.round(FURN[k].d/MM)+' mm':fi(FURN[k].w)+' x '+fi(FURN[k].d))+'</small></button>'}).join("")+'</div><div class="row"><button class="bb" id="fX">Close</button></div>'}
 modal(body(),bind);function bind(box){box.querySelectorAll("[data-fc]").forEach(function(b){b.onclick=function(){cat=UI.fcat=b.dataset.fc;$("mbox").innerHTML=body();bind($("mbox"))}});
  box.querySelectorAll("[data-fi]").forEach(function(b){b.onclick=function(){closeModal();addFurn(b.dataset.fi,x,y)}});$("fX").onclick=closeModal}}
function furnSel(){return (S.furn||[]).find(function(f){return f.id===UI.fsel})}
function furnAction(k){var f=furnSel();if(k==="fadd"){var c=s2w(CW/2,CH/2);furnPopup(c.x,c.y);return}if(!f){toast("Tap a furniture item first");return}snapshot();
 if(k==="frot"){f.rot=((f.rot||0)+90)%360;snapFurn(f,false)}else if(k==="fdup"){var n={id:nid(),type:f.type,x:f.x+1,y:f.y+1,rot:f.rot};S.furn.push(n);UI.fsel=n.id}else if(k==="fdel"){S.furn=S.furn.filter(function(x){return x!==f});UI.fsel=null}else if(k==="fdone"){UI.fsel=null}
 changed();updCtx()}
