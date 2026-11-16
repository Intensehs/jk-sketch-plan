/* ================= VEHICLES: car / bike plan symbols (2D only: plan, PDF, DXF; no 3D) ================= */
/* Stage: Vehicles - w = width across, d = length (front of the vehicle at y=-d/2) */
Object.assign(FURN,{
 car_hatch:{n:"Car - Hatchback",cat:"Vehicles",w:1700*MM,d:3800*MM,h:1500*MM,v2d:1,veh:"car"},
 car_sedan:{n:"Car - Sedan",cat:"Vehicles",w:1800*MM,d:4500*MM,h:1500*MM,v2d:1,veh:"car"},
 car_suv:{n:"Car - SUV",cat:"Vehicles",w:1900*MM,d:4700*MM,h:1800*MM,v2d:1,veh:"car"},
 bike:{n:"Bike",cat:"Vehicles",w:750*MM,d:2000*MM,h:1100*MM,v2d:1,veh:"bike"},
 scooter:{n:"Scooter",cat:"Vehicles",w:700*MM,d:1800*MM,h:1100*MM,v2d:1,veh:"scooter"}});
FCATS.push(["Vehicles","Car / bike"]);
Object.assign(FPRE,{
 car_hatch:[mmP("Small 3.6 x 1.6 m",1600,3600),mmP("Hatchback 3.8 x 1.7 m",1700,3800),mmP("Premium 4.0 x 1.75 m",1750,4000)],
 car_sedan:[mmP("Compact 4.0 x 1.7 m",1700,4000),mmP("Sedan 4.5 x 1.8 m",1800,4500),mmP("Large 4.8 x 1.85 m",1850,4800)],
 car_suv:[mmP("Compact SUV 4.3 x 1.8 m",1800,4300),mmP("SUV 4.7 x 1.9 m",1900,4700),mmP("Large SUV 4.9 x 1.95 m",1950,4900)],
 bike:[mmP("Bike 2.0 x 0.75 m",750,2000),mmP("Large bike 2.2 x 0.85 m",850,2200)],
 scooter:[mmP("Scooter 1.8 x 0.7 m",700,1800),mmP("Maxi 1.9 x 0.75 m",750,1900)]});
function isVeh(t){return !!(FURN[t]&&FURN[t].v2d)}
function vehSym(type,w,d){var P=[],L=-w/2,Rr=w/2,B=-d/2,F=d/2,kind=FURN[type].veh;
 function r(x0,y0,x1,y1,o){P.push({t:"r",x0:x0,y0:y0,x1:x1,y1:y1,o:o||{}})}function l(x0,y0,x1,y1,o){P.push({t:"l",x0:x0,y0:y0,x1:x1,y1:y1,o:o||{}})}
 function p(pts,cl,o){P.push({t:"p",pts:pts,closed:cl,o:o||{}})}
 function e(cx,cy,rx,ry,o){var pts=[];for(var i=0;i<24;i++){var a=i/24*Math.PI*2;pts.push([cx+rx*Math.cos(a),cy+ry*Math.sin(a)])}p(pts,true,o)}
 if(kind==="car"){var c=Math.min(w*0.22,d*0.09),wl=Math.min(d*0.17,2.4),wt=Math.min(w*0.13,0.75),inset=w*0.03;
  /* wheels (under the body, dashed) */
  [B+d*0.17,F-d*0.19].forEach(function(cy){[L-inset*0.2,Rr-wt+inset*0.2].forEach(function(x){r(x,cy-wl/2,x+wt,cy+wl/2,{fill:4})})});
  /* body with rounded nose and tail */
  var c2=c*0.8;p([[L+c,B],[Rr-c,B],[Rr,B+c],[Rr,F-c2],[Rr-c2,F],[L+c2,F],[L,F-c2],[L,B+c]],true,{fill:1});
  var suv=type==="car_suv",hat=type==="car_hatch",ws0=B+d*(suv?0.27:0.29),ws1=ws0+d*0.1,rf1=F-d*(hat?0.14:suv?0.15:0.24),rw1=rf1+d*(hat?0.06:0.08),gi=w*0.1,gr=w*0.17;
  /* bonnet line, windshield, roof, rear window */
  p([[L+gi,ws0],[Rr-gi,ws0],[Rr-gr,ws1],[L+gr,ws1]],true,{fill:3});
  r(L+gr,ws1,Rr-gr,rf1,{fill:2});
  p([[L+gr,rf1],[Rr-gr,rf1],[Rr-gi*1.1,rw1],[L+gi*1.1,rw1]],true,{fill:3});
  l(L+gi*0.6,B+c*0.6,L+gi*0.6,ws0);l(Rr-gi*0.6,B+c*0.6,Rr-gi*0.6,ws0);
  /* side mirrors */
  var my=ws1-d*0.01;p([[L,my-0.12],[L-w*0.08,my],[L,my+0.25]],true,{fill:2});p([[Rr,my-0.12],[Rr+w*0.08,my],[Rr,my+0.25]],true,{fill:2});
  /* headlamps */
  r(L+c*0.5,B+0.08,L+c*0.5+w*0.18,B+0.28);r(Rr-c*0.5-w*0.18,B+0.08,Rr-c*0.5,B+0.28);
  l(-w*0.2,F-0.06,w*0.2,F-0.06,{dash:1})}
 else{var tw=Math.min(w*0.22,0.4),tl=d*(kind==="scooter"?0.2:0.27),sc=kind==="scooter";
  r(-tw/2,B,tw/2,B+tl,{fill:4});r(-tw/2,F-tl,tw/2,F,{fill:4});
  if(sc){p([[-w*0.2,B+tl*0.8],[w*0.2,B+tl*0.8],[w*0.26,B+d*0.3],[w*0.3,F-tl*0.6],[-w*0.3,F-tl*0.6],[-w*0.26,B+d*0.3]],true,{fill:1});e(0,F-d*0.3,w*0.2,d*0.13,{fill:2});r(-w*0.18,B+d*0.34,w*0.18,B+d*0.52,{fill:3})}
  else{e(0,0,w*0.24,d*0.27,{fill:1});e(0,d*0.12,w*0.17,d*0.14,{fill:2});e(0,-d*0.12,w*0.2,d*0.08,{fill:3})}
  /* handlebar */
  var hy=B+tl*(sc?0.95:1.05);l(L,hy,Rr,hy);r(L,hy-0.06,L+w*0.16,hy+0.06,{fill:2});r(Rr-w*0.16,hy-0.06,Rr,hy+0.06,{fill:2});
  l(0,B+tl,0,hy)}
 return P}
var _vehSym0=furnSym;furnSym=function(type,w,d,f){if(isVeh(type))return vehSym(type,w,d);return _vehSym0(type,w,d,f)};
/* vehicles park freely: no wall snap */
var _vehSnap0=snapFurn;snapFurn=function(f,autoRot){if(f&&isVeh(f.type))return;return _vehSnap0(f,autoRot)};
/* 2D only: no 3D model */
var _vehF3D0=furn3D;furn3D=function(f){if(f&&isVeh(f.type))return;return _vehF3D0(f)};
