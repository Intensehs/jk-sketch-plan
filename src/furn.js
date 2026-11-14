/* ================= FURNITURE library (plan symbols; 3D models are in v3d.js) ================= */
/* Stage: Build - Component tool: furniture and fixture library */
var FURN={
 dbed:{n:"Double bed",cat:"Bedroom",w:5,d:6.5},sbed:{n:"Single bed",cat:"Bedroom",w:3,d:6.5},wardrobe:{n:"Wardrobe",cat:"Bedroom",w:4,d:2},sidetable:{n:"Side table",cat:"Bedroom",w:1.5,d:1.5},
 sofaset:{n:"Sofa set 3+1+1",cat:"Hall",w:6.5,d:3,composite:true},sofa3:{n:"3-seater sofa",cat:"Hall",w:6.5,d:3},sofa1:{n:"Single sofa",cat:"Hall",w:3,d:3},ctable:{n:"Center table",cat:"Hall",w:3.5,d:2},
 tvunit:{n:"TV unit + TV",cat:"Hall",w:5,d:1.5},dining4:{n:"Dining + 4 chairs",cat:"Hall",w:4,d:5.6},dining6:{n:"Dining + 6 chairs",cat:"Hall",w:5.5,d:5.6},
 counterL:{n:"L platform (sink+stove)",cat:"Kitchen",w:8,d:6},counterS:{n:"Straight platform",cat:"Kitchen",w:8,d:2},fridge:{n:"Fridge",cat:"Kitchen",w:2.25,d:2.25},cyl:{n:"Gas cylinder",cat:"Kitchen",w:1.2,d:1.2},
 wcw:{n:"Western WC",cat:"Toilet",w:1.4,d:2.3},wci:{n:"Indian WC",cat:"Toilet",w:1.6,d:2.2},basin:{n:"Wash basin",cat:"Toilet",w:1.8,d:1.4},shower:{n:"Shower",cat:"Toilet",w:3,d:3},bucket:{n:"Bucket area",cat:"Toilet",w:2.5,d:2.5},
 pooja:{n:"Pooja shelf",cat:"Pooja",w:3,d:1.25}};
var FCATS=[["Bedroom","படுக்கை அறை"],["Hall","ஹால்"],["Kitchen","சமையலறை"],["Toilet","கழிவறை"],["Pooja","பூஜை"]];
function fdims(f){var c=FURN[f.type];return {w:f.w||c.w,d:f.d||c.d}}
/* plan symbol primitives in local feet, centre (0,0), back of the item at y=-d/2 */
function furnSym(type,w,d){var P=[],L=-w/2,Rr=w/2,B=-d/2,F=d/2;
 function r(x0,y0,x1,y1,o){P.push({t:"r",x0:x0,y0:y0,x1:x1,y1:y1,o:o||{}})}function l(x0,y0,x1,y1,o){P.push({t:"l",x0:x0,y0:y0,x1:x1,y1:y1,o:o||{}})}
 function e(cx,cy,rx,ry,o){var pts=[];for(var i=0;i<28;i++){var a=i/28*Math.PI*2;pts.push([cx+rx*Math.cos(a),cy+ry*Math.sin(a)])}P.push({t:"p",pts:pts,closed:true,o:o||{}})}
 function c(cx,cy,rr,o){e(cx,cy,rr,rr,o)}function p(pts,cl,o){P.push({t:"p",pts:pts,closed:cl,o:o||{}})}
 switch(type){
 case "dbed":case "sbed":{r(L,B,Rr,F,{fill:1});r(L,B,Rr,B+0.3,{fill:2});var n=type==="dbed"?2:1,g=0.25,pw=(w-0.5-(n-1)*g)/n;for(var i=0;i<n;i++){var x=L+0.25+i*(pw+g);r(x,B+0.5,x+pw,B+1.5,{fill:3})}
  l(L,B+2.3,Rr,B+2.3);p([[Rr-1.3,B+2.3],[Rr,B+3.4]],false);l(L+0.15,F-0.15,Rr-0.15,F-0.15,{dash:1});break}
 case "wardrobe":r(L,B,Rr,F,{fill:1});l(0,B,0,F);l(L,F-0.12,Rr,F-0.12);l(L+0.2,0,Rr-0.2,0,{dash:1});for(var x=L+0.5;x<Rr-0.3;x+=0.5)l(x,-0.35,x+0.15,0.35);break;
 case "sidetable":r(L,B,Rr,F,{fill:1});c(0,0,Math.min(w,d)*0.28);l(-0.25,0,0.25,0);l(0,-0.25,0,0.25);break;
 case "sofa3":case "sofa1":case "sofaset":{r(L,B,Rr,F,{fill:1});r(L,B,Rr,B+0.7,{fill:2});r(L,B,L+0.6,F,{fill:2});r(Rr-0.6,B,Rr,F,{fill:2});var k=type==="sofa1"?1:3,cw=(w-1.2)/k;for(var j=0;j<k;j++)r(L+0.6+j*cw+0.05,B+0.75,L+0.6+(j+1)*cw-0.05,F-0.1,{fill:3});break}
 case "ctable":r(L,B,Rr,F,{fill:1});r(L+0.25,B+0.25,Rr-0.25,F-0.25);break;
 case "tvunit":{r(L,B,Rr,F,{fill:1});var tw=w*0.75;r(-tw/2,B+0.12,tw/2,B+0.4,{fill:4});r(-0.5,B+0.4,0.5,B+0.75);l(L+0.2,F-0.12,Rr-0.2,F-0.12,{dash:1});break}
 case "dining4":case "dining6":{var k2=type==="dining4"?2:3,tw2=w,th=3;r(-tw2/2,-th/2,tw2/2,th/2,{fill:1});for(var q=0;q<k2;q++){var cx=-tw2/2+tw2*(q+0.5)/k2;
   r(cx-0.65,-th/2-1.3,cx+0.65,-th/2-0.1,{fill:3});r(cx-0.65,-th/2-1.3,cx+0.65,-th/2-1.1,{fill:2});r(cx-0.65,th/2+0.1,cx+0.65,th/2+1.3,{fill:3});r(cx-0.65,th/2+1.1,cx+0.65,th/2+1.3,{fill:2})}break}
 case "counterS":r(L,B,Rr,F,{fill:1});r(Rr-3.2,B+0.3,Rr-1.95,F-0.3,{fill:4});r(Rr-1.85,B+0.3,Rr-0.6,F-0.3,{fill:4});c(Rr-2.6,0,0.1);c(Rr-1.25,0,0.1);
  r(L+0.6,B+0.25,L+2.9,F-0.25);c(L+1.15,0,0.38);c(L+2.35,0,0.38);c(L+1.15,0,0.15);c(L+2.35,0,0.15);break;
 case "counterL":p([[L,B],[Rr,B],[Rr,B+2],[L+2,B+2],[L+2,F],[L,F]],true,{fill:1});r(Rr-3.2,B+0.3,Rr-1.95,B+1.7,{fill:4});r(Rr-1.85,B+0.3,Rr-0.6,B+1.7,{fill:4});c(Rr-2.6,B+1,0.1);c(Rr-1.25,B+1,0.1);
  r(L+0.25,F-3.2,L+1.75,F-0.8);c(L+1,F-2.6,0.38);c(L+1,F-1.4,0.38);c(L+1,F-2.6,0.15);c(L+1,F-1.4,0.15);l(L+2,B+2,L+2.2,B+2.2,{dash:1});break;
 case "fridge":r(L,B,Rr,F,{fill:1});r(L+0.12,B+0.12,Rr-0.12,F-0.3);l(L,F-0.3,Rr,F-0.3);l(Rr-0.45,F-0.3,Rr-0.45,F);break;
 case "cyl":c(0,0,0.55,{fill:4});c(0,0,0.2);break;
 case "wcw":r(L,B,Rr,B+0.6,{fill:1});e(0,B+0.6+0.85,w*0.4,0.85,{fill:1});e(0,B+0.6+0.9,w*0.27,0.6);break;
 case "wci":r(L,B,Rr,F,{fill:1});e(0,0.1,0.42,0.75);c(0,-0.35,0.14);r(-0.68,0.25,-0.42,0.95,{fill:2});r(0.42,0.25,0.68,0.95,{fill:2});break;
 case "basin":r(L,B,Rr,B+0.25,{fill:2});e(0,B+0.75,w*0.45,0.6,{fill:1});e(0,B+0.8,w*0.32,0.42);c(0,B+0.4,0.08);break;
 case "shower":r(L,B,Rr,F,{fill:1});l(L,B,Rr,F);l(Rr,B,L,F);c(0,0,0.15);c(0,B+0.3,0.22,{fill:4});break;
 case "bucket":r(L,B,Rr,F,{dash:1});c(0.25,0.3,0.45,{fill:4});c(-0.65,0.55,0.18);c(0,B+0.2,0.08);l(0,B,0,B+0.2);r(-1,-0.9,-0.3,-0.2);break;
 case "pooja":r(L,B,Rr,F,{fill:1});l(L,B+0.4,Rr,B+0.4);l(L,B+0.8,Rr,B+0.8);c(-w/3,F-0.22,0.1,{fill:4});c(w/3,F-0.22,0.1,{fill:4});p([[-0.4,B+0.4],[-0.4,B+0.15],[0,B+0.02],[0.4,B+0.15],[0.4,B+0.4]],false);break;
 default:r(L,B,Rr,F)}
 return P}
var FFILL={1:"#fbf6ee",2:"#e7d6bd",3:"#ffffff",4:"#d9e6f2"};
function fXform(f){var a=(f.rot||0)*Math.PI/180,cs=Math.cos(a),sn=Math.sin(a);return function(x,y){return {x:f.x+x*cs-y*sn,y:f.y+x*sn+y*cs}}}
function primPolys(pr){if(pr.t==="r")return [[pr.x0,pr.y0],[pr.x1,pr.y0],[pr.x1,pr.y1],[pr.x0,pr.y1]];if(pr.t==="l")return [[pr.x0,pr.y0],[pr.x1,pr.y1]];return pr.pts}
/* draw onto the plan canvas */
function drawFurnCanvas(f,sel){var D=fdims(f),X=fXform(f),P=furnSym(f.type,D.w,D.d);
 P.forEach(function(pr){var pts=primPolys(pr).map(function(q){var w=X(q[0],q[1]);return w2s(w.x,w.y)}),closed=pr.t!=="l"&&pr.closed!==false;
  g.beginPath();pts.forEach(function(q,i){i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y)});if(closed)g.closePath();
  if(closed&&pr.o.fill){g.fillStyle=FFILL[pr.o.fill];g.fill()}g.setLineDash(pr.o.dash?[4,3]:[]);g.strokeStyle=sel?"#e8590c":"#7a5432";g.lineWidth=sel?2:1.2;g.stroke();g.setLineDash([])});
 if(sel){var c=w2s(f.x,f.y);g.beginPath();g.arc(c.x,c.y,6,0,7);g.fillStyle="#e8590c";g.fill()}}
/* draw onto the sheet (Dwg) - layer FURNITURE */
function drawFurnSheet(d,R,f){var D=fdims(f),X=fXform(f),P=furnSym(f.type,D.w,D.d);
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
 function body(){return '<div class="mt">Furniture / மரச்சாமான்</div><div class="ms">Tap an item to place it here. It snaps to the nearest wall.</div><div class="row" style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr))">'+FCATS.map(function(c){return '<button class="bb '+(c[0]===cat?"on":"")+'" data-fc="'+c[0]+'">'+c[0]+'<small>'+c[1]+'</small></button>'}).join("")+'</div><div class="grid3">'+
  Object.keys(FURN).filter(function(k){return FURN[k].cat===cat}).map(function(k){return '<button class="bb" data-fi="'+k+'" style="min-height:110px"><img src="'+furnIcon(k)+'" style="width:96px;height:72px;display:block;margin:0 auto 2px"><span style="font-size:14px">'+esc(FURN[k].n)+'</span><small>'+fi(FURN[k].w)+' x '+fi(FURN[k].d)+'</small></button>'}).join("")+'</div><div class="row"><button class="bb" id="fX">Close</button></div>'}
 modal(body(),bind);function bind(box){box.querySelectorAll("[data-fc]").forEach(function(b){b.onclick=function(){cat=UI.fcat=b.dataset.fc;$("mbox").innerHTML=body();bind($("mbox"))}});
  box.querySelectorAll("[data-fi]").forEach(function(b){b.onclick=function(){closeModal();addFurn(b.dataset.fi,x,y)}});$("fX").onclick=closeModal}}
function furnSel(){return (S.furn||[]).find(function(f){return f.id===UI.fsel})}
function furnAction(k){var f=furnSel();if(k==="fadd"){var c=s2w(CW/2,CH/2);furnPopup(c.x,c.y);return}if(!f){toast("Tap a furniture item first");return}snapshot();
 if(k==="frot"){f.rot=((f.rot||0)+90)%360;snapFurn(f,false)}else if(k==="fdup"){var n={id:nid(),type:f.type,x:f.x+1,y:f.y+1,rot:f.rot};S.furn.push(n);UI.fsel=n.id}else if(k==="fdel"){S.furn=S.furn.filter(function(x){return x!==f});UI.fsel=null}else if(k==="fdone"){UI.fsel=null}
 changed();updCtx()}
