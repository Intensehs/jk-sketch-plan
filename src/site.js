/* ===== v1.5 Site: Compound wall (any angle), setback, angled rooms ===== */
["cwalls","elec"].forEach(function(k){if(LVK.indexOf(k)<0)LVK.push(k)});
function lvArr(k){var L=S.L[S.cur];if(!Array.isArray(L[k]))L[k]=[];return L[k]}
function polyArea(P){var a=0;for(var i=0;i<P.length;i++){var p=P[i],q=P[(i+1)%P.length];a+=p.x*q.y-q.x*p.y}return a/2}
function cwSides(w){var P=w.pts,n=P.length,out=[];for(var i=0;i<(w.closed?n:n-1);i++){var a=P[i],b=P[(i+1)%n];out.push({a:a,b:b,L:Math.hypot(b.x-a.x,b.y-a.y),i:i})}return out}
function fiM(L){return fi(L)+" ("+(L*0.3048).toFixed(2)+" m)"}
/* inward offset of a closed polygon, per-side distances */
function offsetPoly(P,D){var n=P.length,s=polyArea(P)>0?1:-1,L=[];
 for(var i=0;i<n;i++){var a=P[i],b=P[(i+1)%n],l=Math.hypot(b.x-a.x,b.y-a.y)||1,nx=-(b.y-a.y)/l*s,ny=(b.x-a.x)/l*s,d=+D[i]||0;L.push({a:{x:a.x+nx*d,y:a.y+ny*d},u:{x:(b.x-a.x)/l,y:(b.y-a.y)/l}})}
 /* inward normal check: for area>0 (clockwise on screen y-down) (-uy,ux) points inside */
 return L.map(function(l,i){var m=L[(i-1+n)%n],den=m.u.x*l.u.y-m.u.y*l.u.x;if(Math.abs(den)<1e-9)return {x:l.a.x,y:l.a.y};var t=((l.a.x-m.a.x)*l.u.y-(l.a.y-m.a.y)*l.u.x)/den;return {x:m.a.x+m.u.x*t,y:m.a.y+m.u.y*t}})}
function sbPoly(w){if(!w.closed||!w.sb||!w.sb.some(function(v){return v>0}))return null;var P=offsetPoly(w.pts,w.sb);
 /* make sure it went inward: smaller area */ if(Math.abs(polyArea(P))>Math.abs(polyArea(w.pts))){P=offsetPoly(w.pts,w.sb.map(function(v){return -v}))}return P}
/* build polygon from typed sides: mode "ang" lengths + interior angles; mode "diag" 4 sides + diagonal AC */
function polyFromSides(L,A,diag,x0,y0){x0=x0||0;y0=y0||0;var P=[];
 if(diag&&L.length===4){var AB=L[0],BC=L[1],CD=L[2],DA=L[3],AC=diag;function tri(a,b,ra,rb,side){var dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),x=(ra*ra-rb*rb+d*d)/(2*d),h2=ra*ra-x*x;if(h2<0)return null;var h=Math.sqrt(h2),ux=dx/d,uy=dy/d;return {x:a.x+ux*x-uy*h*side,y:a.y+uy*x+ux*h*side}}
  var pA={x:x0,y:y0},pB={x:x0+AB,y:y0},pC=tri(pA,pB,AC,BC,-1);if(!pC)return null;var pD=tri(pA,pC,DA,CD,-1);if(!pD)return null;return [pA,pB,pC,pD]}
 var x=x0,y=y0,h=0;P.push({x:x,y:y});for(var i=0;i<L.length-1;i++){x+=L[i]*Math.cos(h);y+=L[i]*Math.sin(h);P.push({x:x,y:y});h+=Math.PI-(A[i+1]||90)*Math.PI/180}
 return P}
/* ---- canvas ---- */
function drawCwallsCanvas(){var W=S.cwalls||[];function px(p){return w2s(p.x,p.y)}
 W.forEach(function(w){var P=w.pts;if(P.length<2)return;g.save();g.lineJoin="miter";g.lineCap="butt";g.strokeStyle="#57534e";g.lineWidth=Math.max(3,(w.t||9)/12*V.s);g.beginPath();P.forEach(function(p,i){var q=px(p);i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y)});if(w.closed)g.closePath();g.stroke();
  g.strokeStyle="#fff";g.lineWidth=1;g.setLineDash([6,4]);g.stroke();g.setLineDash([]);
  var ar=polyArea(P)>0?1:-1;cwSides(w).forEach(function(s){if(s.L*V.s<30)return;var m=px({x:(s.a.x+s.b.x)/2,y:(s.a.y+s.b.y)/2}),nx=(s.b.y-s.a.y)/s.L*ar,ny=-(s.b.x-s.a.x)/s.L*ar,ang=Math.atan2(s.b.y-s.a.y,s.b.x-s.a.x);if(ang>Math.PI/2)ang-=Math.PI;if(ang<-Math.PI/2)ang+=Math.PI;
   g.save();g.translate(m.x+nx*16,m.y+ny*16);g.rotate(ang);g.font="bold 11px Roboto,Arial";g.textAlign="center";g.textBaseline="middle";var t=fiM(s.L),tw2=g.measureText(t).width+8;g.fillStyle="rgba(87,83,78,.9)";g.fillRect(-tw2/2,-8,tw2,16);g.fillStyle="#fff";g.fillText(t,0,0);g.restore()});
  var SB=sbPoly(w);if(SB){g.strokeStyle="#dc2626";g.lineWidth=1.3;g.setLineDash([8,5]);g.beginPath();SB.forEach(function(p,i){var q=px(p);i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y)});g.closePath();g.stroke();g.setLineDash([]);
   cwSides(w).forEach(function(s,i){if(!(w.sb[i]>0))return;var m=px({x:(s.a.x+s.b.x)/2,y:(s.a.y+s.b.y)/2}),c=px({x:(SB[i].x+SB[(i+1)%SB.length].x)/2,y:(SB[i].y+SB[(i+1)%SB.length].y)/2});g.fillStyle="#dc2626";g.font="10px Roboto,Arial";g.textAlign="center";g.fillText("Setback "+fi(w.sb[i]),(m.x+c.x)/2,(m.y+c.y)/2)})}
  g.restore()});
 var pd=UI.cwPend;if(UI.tool==="cwall"&&pd&&pd.length){g.save();g.strokeStyle="#ea580c";g.lineWidth=2.5;g.beginPath();pd.forEach(function(p,i){var q=px(p);i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y)});g.stroke();pd.forEach(function(p,i){var q=px(p);g.fillStyle=i?"#ea580c":"#16a34a";g.beginPath();g.arc(q.x,q.y,i?4:7,0,7);g.fill()});
  for(var i=0;i<pd.length-1;i++){var a=pd[i],b=pd[i+1],m=px({x:(a.x+b.x)/2,y:(a.y+b.y)/2});g.fillStyle="#9a3412";g.font="bold 12px Roboto,Arial";g.textAlign="center";g.fillText(fiM(Math.hypot(b.x-a.x,b.y-a.y)),m.x,m.y-8)}g.restore()}
 var rp=UI.prPend;if(UI.tool==="proom"&&rp&&rp.length){g.save();g.strokeStyle="#2563eb";g.lineWidth=2;g.beginPath();rp.forEach(function(p,i){var q=px(p);i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y)});g.stroke();rp.forEach(function(p,i){var q=px(p);g.fillStyle=i?"#2563eb":"#16a34a";g.beginPath();g.arc(q.x,q.y,i?4:7,0,7);g.fill()});
  for(var j=0;j<rp.length-1;j++){var a2=rp[j],b2=rp[j+1],m2=px({x:(a2.x+b2.x)/2,y:(a2.y+b2.y)/2});g.fillStyle="#1e3a8a";g.font="bold 12px Roboto,Arial";g.textAlign="center";g.fillText(fi(Math.hypot(b2.x-a2.x,b2.y-a2.y)),m2.x,m2.y-8)}g.restore()}}
var _du15=drawUnderlay;drawUnderlay=function(){try{if(typeof drawImgUL==="function")drawImgUL()}catch(e){}_du15.apply(this,arguments);try{drawCwallsCanvas()}catch(e){console.warn(e)}};
/* ---- tools ---- */
function cwPick(w){var q=findPoint(w.x,w.y,snapR());if(q)return {x:q.x,y:q.y};var c=null;(S.cwalls||[]).forEach(function(cw){cw.pts.forEach(function(p){if(Math.hypot(p.x-w.x,p.y-w.y)<snapR())c=p})});return c?{x:c.x,y:c.y}:{x:gsnap(w.x),y:gsnap(w.y)}}
function cwFinish(close){var P=UI.cwPend||[];if(P.length<2){toast("Tap at least 2 points");return}snapshot();var w={id:nid(),pts:P.map(function(p){return {x:p.x,y:p.y}}),closed:!!(close&&P.length>=3),t:UI.cwT||9,h:UI.cwH||5,sb:[]};lvArr("cwalls").push(w);UI.cwPend=[];changed();updCtx();
 var tot=cwSides(w).reduce(function(a,s){return a+s.L},0);toast("Compound wall: "+cwSides(w).length+" sides, total "+fi(tot))}
function prFinish(){var P=UI.prPend||[];if(P.length<3){toast("Tap at least 3 corners");return}snapshot();var ids=P.map(function(p){return ensurePoint({x:p.x,y:p.y,pid:p.pid})});for(var i=0;i<ids.length;i++)addSeg(ids[i],ids[(i+1)%ids.length],UI.kind||"O");planarize();UI.prPend=[];changed();updCtx();toast("Room walls added ("+ids.length+" sides)")}
function cwAt(w){var best=null,bd=snapR()*1.2;(S.cwalls||[]).forEach(function(cw){cwSides(cw).forEach(function(s){var d=d2seg(w,s.a,s.b);if(d<bd){bd=d;best=cw}})});return best}
var _tt15=toolTap;toolTap=function(w){var t=UI.tool;
 if(t==="cwall"){var P=UI.cwPend=UI.cwPend||[];if(!P.length){var hit=cwAt(w);if(hit){cwPopup(hit);return true}}var p=cwPick(w);
  if(P.length>=3&&Math.hypot(p.x-P[0].x,p.y-P[0].y)<snapR()*1.2){cwFinish(true);return true}P.push(p);render();updCtx();return true}
 if(t==="proom"){var Q=UI.prPend=UI.prPend||[],q=findPoint(w.x,w.y,snapR()),p2=q?{x:q.x,y:q.y,pid:q.id}:{x:gsnap(w.x),y:gsnap(w.y)};if(Q.length>=3&&Math.hypot(p2.x-Q[0].x,p2.y-Q[0].y)<snapR()*1.2){prFinish();return true}Q.push(p2);render();updCtx();return true}
 return _tt15.apply(this,arguments)};
/* typed sides popup (compound wall + angled room) */
function sidesPopup(kind){var n=UI.sdN||4;modal('<div class="mt">'+(kind==="room"?"Room":"Compound wall")+' - type the sides</div><div class="ms">Type each side as measured on site (e.g. 90, 43\'6"). Give either the inside angle at each corner, or for 4 sides the diagonal A to C - the diagonal gives the exact shape for uneven plots.</div>'+
 '<label class="fld">Number of sides<input id="sdN" type="number" min="3" max="20" value="'+n+'"></label><div id="sdRows"></div><label class="fld">Diagonal A-C (4 sides only, optional)<input id="sdDg" placeholder="e.g. 95\'"></label><div id="sdMsg" class="ms"></div>'+
 '<div class="row"><button class="bb" id="sdX">Cancel</button><button class="bb ok" id="sdOk">Draw</button></div>',function(){
 function rows(){var k=+$("sdN").value||4;UI.sdN=k;var h="";for(var i=0;i<k;i++){var A=String.fromCharCode(65+i),B=String.fromCharCode(65+(i+1)%k);h+='<div class="grid2"><label class="fld">Side '+A+'-'+B+'<input class="sdL" data-i="'+i+'" placeholder="length"></label><label class="fld">Angle at '+A+' (°)<input class="sdA" data-i="'+i+'" value="90"></label></div>'}$("sdRows").innerHTML=h}
 rows();$("sdN").onchange=rows;$("sdX").onclick=closeModal;
 $("sdOk").onclick=function(){var L=[],A=[],bad=false;document.querySelectorAll(".sdL").forEach(function(e){var v=parseFI(e.value);if(!(v>0)){var nn=parseFloat(e.value);v=nn>0?nn:NaN}if(!(v>0))bad=true;L.push(v)});document.querySelectorAll(".sdA").forEach(function(e){A.push(parseFloat(e.value)||90)});
  if(bad){$("sdMsg").textContent="Type every side length.";return}var dg=parseFI($("sdDg").value);if(!(dg>0))dg=parseFloat($("sdDg").value)||0;
  var c=s2w(CW/2,CH/2),P=polyFromSides(L,A,dg,gsnap(c.x-L[0]/2),gsnap(c.y-L[0]/3));if(!P){$("sdMsg").textContent="These sides and diagonal cannot make a closed shape - check the measurements.";return}
  var last=P[P.length-1],gap=Math.hypot(last.x+L[L.length-1]*0-P[0].x,last.y-P[0].y),err=Math.abs(gap-L[L.length-1]);
  closeModal();snapshot();if(kind==="room"){UI.prPend=P;prFinish()}else{var w={id:nid(),pts:P,closed:true,t:UI.cwT||9,h:UI.cwH||5,sb:[],typed:L};lvArr("cwalls").push(w);changed()}
  toast(err>0.1&&!dg?"Closing side drawn "+fi(gap)+" (typed "+fi(L[L.length-1])+") - adjust angles or give the diagonal":"Shape drawn - each side length is shown")}})}
function cwPopup(w){var sd=cwSides(w),tot=sd.reduce(function(a,s){return a+s.L},0),ar=w.closed?Math.abs(polyArea(w.pts)):0;
 modal('<div class="mt">Compound wall</div><div class="ms">'+sd.length+' sides · total length <b>'+fiM(tot)+'</b>'+(w.closed?' · plot area <b>'+Math.round(ar)+' sq.ft ('+(ar*0.092903).toFixed(1)+' sq.m)</b>':'')+'</div>'+
 '<div style="max-height:40vh;overflow:auto">'+sd.map(function(s,i){return '<div class="grid2"><label class="fld">Side '+(i+1)+' length<input class="cwL" data-i="'+i+'" value="'+escH(fi(s.L))+'"></label><label class="fld">Setback from this side<input class="cwS" data-i="'+i+'" value="'+escH(fi((w.sb&&w.sb[i])||0))+'"></label></div>'}).join("")+'</div>'+
 '<div class="grid2"><label class="fld">Wall thickness (in)<input id="cwT" type="number" step="0.5" value="'+(w.t||9)+'"></label><label class="fld">Wall height (ft)<input id="cwH" type="number" step="0.5" value="'+(w.h||5)+'"></label></div>'+
 '<div class="row"><button class="bb del" id="cwDel">Delete</button><button class="bb" id="cwX">Cancel</button><button class="bb ok" id="cwOk">Save</button></div>',function(){
 $("cwX").onclick=closeModal;$("cwDel").onclick=function(){snapshot();S.cwalls=S.cwalls.filter(function(x){return x!==w});closeModal();changed()};
 $("cwOk").onclick=function(){snapshot();w.t=+$("cwT").value||9;w.h=+$("cwH").value||5;w.sb=[];document.querySelectorAll(".cwS").forEach(function(e){w.sb[+e.dataset.i]=Math.max(0,parseFI(e.value)||0)});
  /* edited side length: move the far end of that side along its direction, rest of shape follows */
  document.querySelectorAll(".cwL").forEach(function(e){var i=+e.dataset.i,v=parseFI(e.value),s=cwSides(w)[i];if(!(v>0)||Math.abs(v-s.L)<1/24)return;var ux=(s.b.x-s.a.x)/s.L,uy=(s.b.y-s.a.y)/s.L,dx=ux*(v-s.L),dy=uy*(v-s.L);for(var j=i+1;j<w.pts.length;j++){w.pts[j].x+=dx;w.pts[j].y+=dy}});
  closeModal();changed();checkSetback()}})}
function setbackPopup(){var W=(S.L[0].cwalls||[]).filter(function(w){return w.closed});if(!W.length){toast("Step 1: draw the compound wall first (closed plot)");setTool("cwall");return}
 var w=W[0],sd=cwSides(w);modal('<div class="mt">Setback</div><div class="ms">Distance kept free inside the compound wall on each side. Shown as a red dashed line; the house must sit inside it.</div>'+
 '<label class="fld">Same setback for all sides (optional)<input id="sbAll" placeholder="e.g. 3\'"></label>'+sd.map(function(s,i){return '<label class="fld">Side '+(i+1)+' ('+fi(s.L)+')<input class="sbI" data-i="'+i+'" value="'+escH(fi((w.sb&&w.sb[i])||0))+'"></label>'}).join("")+
 '<div class="row"><button class="bb" id="sbX">Cancel</button><button class="bb ok" id="sbOk">Apply</button></div>',function(){$("sbX").onclick=closeModal;$("sbOk").onclick=function(){snapshot();var all=parseFI($("sbAll").value);w.sb=[];document.querySelectorAll(".sbI").forEach(function(e){w.sb[+e.dataset.i]=all>0?all:Math.max(0,parseFI(e.value)||0)});closeModal();changed();checkSetback()}})}
function checkSetback(){var w=(S.L[0].cwalls||[]).find(function(x){return x.closed}),SB=w&&sbPoly(w);if(!SB)return true;var out=S.L[0].pts.filter(function(p){return !inPoly(p.x,p.y,SB)}).length;if(out){toast(out+" wall corner(s) are outside the setback line");return false}return true}
/* ---- PDF site plan sheet ---- */
function sh_site(sh,lab,RI){var d=stFrame(),U=stSetup(d,0,[PX,PY,PW,PH],{site:true,mg:16,pad:6}),R=U.R;
 var tot=0,rows=[];(S.L[0].cwalls||[]).forEach(function(w,wi){var P=w.pts.map(function(p){return R(p.x,p.y)}),ar=polyArea(w.pts)>0?1:-1;
  /* wall drawn as true thickness: offset both faces */
  var t=(w.t||9)/12,half=t/2;if(w.closed){var I=offsetPoly(w.pts,w.pts.map(function(){return half})),O=offsetPoly(w.pts,w.pts.map(function(){return -half}));if(Math.abs(polyArea(I))>Math.abs(polyArea(O))){var tmp=I;I=O;O=tmp}
   d.poly(O.map(function(p){return R(p.x,p.y)}),{w:0.35,fill:"#78716c",L:"WALLS"});d.poly(I.map(function(p){return R(p.x,p.y)}),{w:0.35,fill:"#ffffff",L:"WALLS"})}else d.poly(P,{closed:false,w:Math.max(0.5,t*U.k),c:"#78716c",L:"WALLS"});
  cwSides(w).forEach(function(s,i){tot+=s.L;var a=R(s.a.x,s.a.y),b=R(s.b.x,s.b.y),L=Math.hypot(b[0]-a[0],b[1]-a[1])||1,nx=(b[1]-a[1])/L*ar,ny=-(b[0]-a[0])/L*ar,o=4.5,A=[a[0]+nx*o,a[1]+ny*o],B=[b[0]+nx*o,b[1]+ny*o];
   d.line(A[0],A[1],B[0],B[1],{w:0.18,L:"DIMS"});[A,B].forEach(function(p){d.line(p[0]-0.9,p[1]+0.9,p[0]+0.9,p[1]-0.9,{w:0.3,L:"DIMS"})});var lab2=fiM(s.L);d.text((A[0]+B[0])/2+nx*1.2,(A[1]+B[1])/2+ny*1.2,lab2,2,{a:"middle",v:"mid",rot:ang2page(s.b.x-s.a.x,s.b.y-s.a.y),L:"DIMS"});stLog(sh.key,"cw-side",s.L,fi(s.L));
   var lt=String.fromCharCode(65+i);d.text(a[0]-nx*3,a[1]-ny*3,lt,2.4,{a:"middle",v:"mid",bold:true});rows.push([lt+"-"+String.fromCharCode(65+(i+1)%w.pts.length),fi(s.L),(s.L*0.3048).toFixed(3)+" m",(w.sb&&w.sb[i])?fi(w.sb[i]):"-"])});
  var SB=sbPoly(w);if(SB){d.poly(SB.map(function(p){return R(p.x,p.y)}),{w:0.3,c:"#dc2626",dash:[2,1],L:"ANNO"})}
  if(w.closed){var ar2=Math.abs(polyArea(w.pts));rows.push({0:"Plot area",1:Math.round(ar2)+" sq.ft",2:(ar2*0.092903).toFixed(2)+" sq.m",bold:true});stLog(sh.key,"plot-area",ar2,Math.round(ar2))}});
 stWalls(d,R,0,{fill:"#d1d5db"});
 rows.push({0:"Total wall",1:fi(tot),2:(tot*0.3048).toFixed(2)+" m",bold:true});
 var y=table(d,TX,PY+6,[["Side",14],["Length",20],["Metres",22],["Setback",22]],rows,{title:"PLOT / COMPOUND WALL"});
 var w0=(S.L[0].cwalls||[])[0];stNote(d,TX,y+6,TW,"NOTES",["Compound wall "+((w0&&w0.t)||9)+"\" thick, "+fi((w0&&w0.h)||5)+" high, drawn exactly as the site sides (any angle).","Red dashed = setback line; building (grey) must be inside it.","Lengths along the wall centre line."]);stDone(d,sh,lab,RI,U.N,"Site Plan - Compound Wall & Setback")}
STB.site=sh_site;
/* ---- 3D: compound wall as real wall pieces ---- */
var _b3l15=build3DLevel;build3DLevel=function(P,i,ti,rc,M){_b3l15.apply(this,arguments);if(i!==0)return;try{(S.cwalls||[]).forEach(function(w){var t=(w.t||9)/12,h=w.h||5;cwSides(w).forEach(function(s){var nx=-(s.b.y-s.a.y)/s.L*t/2,ny=(s.b.x-s.a.x)/s.L*t/2,ex=(s.b.x-s.a.x)/s.L*t/2,ey=(s.b.y-s.a.y)/s.L*t/2;
  slab([{x:s.a.x+nx-ex,y:s.a.y+ny-ey},{x:s.b.x+nx+ex,y:s.b.y+ny+ey},{x:s.b.x-nx+ex,y:s.b.y-ny+ey},{x:s.a.x-nx-ex,y:s.a.y-ny-ey}],-PLH,h-PLH,M.wall,"WALLS3D")})})}catch(e){console.warn(e)}};
/* move with select: compound wall points */
