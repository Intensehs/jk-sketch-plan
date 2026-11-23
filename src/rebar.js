/* ===== v1.5 Structure: auto grids, rebar (Kambi) data, beams, footings, plinth beam ===== */
var RBD=[8,10,12,16,20,25],STD=[6,8,10];
function mmI(v){return Math.round(v*25.4)}
function mmF(v){return Math.round(v*304.8)}
function fiMM(L){return fi(L)+" ("+mmF(L)+")"}
function kgm(d){return d*d/162}
function stMeta(){S.meta.st=S.meta.st||{};return S.meta.st}
/* ---- column rebar ---- */
function colRB(c){var r=(c&&c.rb)||{},d=stMeta().col||{};return {n:+r.n||+d.n||4,dia:+r.dia||+d.dia||12,tie:+r.tie||+d.tie||8,sp:+r.sp||+d.sp||150,cov:+r.cov||+d.cov||40}}
/* ---- beam rebar (slab beams) ---- */
function beamRB(m){var r=(m&&m.rb)||{},d=stMeta().beam||{};return {top:+r.top||+d.top||2,td:+r.td||+d.td||12,bot:+r.bot||+d.bot||3,bd:+r.bd||+d.bd||12,st:+r.st||+d.st||8,sp:+r.sp||+d.sp||150,cov:+r.cov||+d.cov||25}}
/* ---- plinth beam ---- */
function pbCfg(){var d=stMeta().pb||{};return {w:+d.w||9,d:+d.d||12,top:+d.top||2,td:+d.td||12,bot:+d.bot||2,bd:+d.bd||12,st:+d.st||8,sp:+d.sp||150,cov:+d.cov||25}}
/* ---- footing ---- */
function ftgOf(c){var g=(typeof ftgCfg==="function"?ftgCfg():{})||{},m=stMeta().ftg||{},o=(c&&c.ftg)||{};
 return {l:+o.l||+m.l||+g.l||4,w:+o.w||+m.w||+g.w||4,t:+o.t||+m.t||1.5,dep:+o.dep||+m.dep||+g.dep||5,dia:+o.dia||+m.dia||12,sp:+o.sp||+m.sp||150,pcc:3}}
/* ---- slab ---- */
function slabRB(){var d=stMeta().slab||{};return {auto:d.auto!==false,t:+d.t||5,md:+d.md||10,ms:+d.ms||150,dd:+d.dd||8,ds:+d.ds||200,cov:+d.cov||15}}
function slabPanelRB(lx,ly){var c=slabRB(),one=ly/lx>2,md=c.md,ms=c.ms,t=c.t;
 if(c.auto){if(lx<=9){md=8;ms=150}else if(lx<=12){md=10;ms=150}else if(lx<=14){md=10;ms=125;t=Math.max(t,6)}else{md=12;ms=150;t=Math.max(t,6)}}
 return {one:one,t:t,md:md,ms:ms,ld:one?c.dd:md,ls:one?c.ds:Math.min(ms+25,200),warn:lx>14}}
/* ---------- automatic grid lines through column centres ---------- */
function cluster(vals,tol){vals=vals.slice().sort(function(a,b){return a-b});var out=[];vals.forEach(function(v){var l=out[out.length-1];if(l&&v-l.max<=tol){l.s+=v;l.n++;l.max=v;l.v=l.s/l.n}else out.push({v:v,s:v,n:1,max:v})});return out.map(function(o){return o.v})}
function gLetter(i){var A="ABCDEFGHJKLMNPQRSTUVWXYZ";return i<A.length?A[i]:A[Math.floor(i/A.length)-1]+A[i%A.length]}
function allCols(){var o=[];S.L.forEach(function(L){(L.cols||[]).forEach(function(c){o.push(c)})});return o}
function autoGrid(cols){cols=cols||allCols();if(!cols.length)return null;var xs=cluster(cols.map(function(c){return c.x}),0.3),ys=cluster(cols.map(function(c){return c.y}),0.3);
 var x0=Math.min.apply(null,xs),x1=Math.max.apply(null,xs),y0=Math.min.apply(null,ys),y1=Math.max.apply(null,ys),e=4;
 return {V:xs.map(function(x,i){return {v:x,n:String(i+1)}}),H:ys.map(function(y,i){return {v:y,n:gLetter(i)}}),x0:x0-e,x1:x1+e,y0:y0-e,y1:y1+e,bx0:x0,bx1:x1,by0:y0,by1:y1}}
function agOn(){return S.meta.agrid!==false}
function colGridRef(c,G){G=G||autoGrid();if(!G)return "";var v=G.V.reduce(function(a,b){return Math.abs(b.v-c.x)<Math.abs(a.v-c.x)?b:a}),h=G.H.reduce(function(a,b){return Math.abs(b.v-c.y)<Math.abs(a.v-c.y)?b:a});
 return (Math.abs(h.v-c.y)<0.35?h.n:"~"+h.n)+"-"+(Math.abs(v.v-c.x)<0.35?v.n:"~"+v.n)}
/* canvas: dashed grid lines, bubbles, and c/c dimension strings (ft-in + mm) on both axes */
function drawAutoGridCanvas(){if(!agOn()||!visOn("grids")||!allCols().length||UI.clean)return;var G=autoGrid();if(!G)return;g.save();
 function L(a,b){var p=w2s(a.x,a.y),q=w2s(b.x,b.y);g.beginPath();g.moveTo(p.x,p.y);g.lineTo(q.x,q.y);g.stroke()}
 function bub(c,t){var q=w2s(c.x,c.y);g.setLineDash([]);g.beginPath();g.arc(q.x,q.y,12,0,7);g.fillStyle="#fff";g.fill();g.strokeStyle="#0e7490";g.lineWidth=1.5;g.stroke();g.fillStyle="#0e7490";g.font="bold 12px Roboto,Arial";g.textAlign="center";g.textBaseline="middle";g.fillText(t,q.x,q.y+0.5)}
 var r=24/V.s;g.strokeStyle="rgba(14,116,144,.75)";g.lineWidth=1;g.setLineDash([12,4,3,4]);
 G.V.forEach(function(l){L({x:l.v,y:G.y0},{x:l.v,y:G.y1})});G.H.forEach(function(l){L({x:G.x0,y:l.v},{x:G.x1,y:l.v})});
 G.V.forEach(function(l){bub({x:l.v,y:G.y0-r/2},l.n)});G.H.forEach(function(l){bub({x:G.x0-r/2,y:l.v},l.n)});
 /* dimension strings */
 g.setLineDash([]);g.strokeStyle="#0e7490";g.fillStyle="#0e7490";g.font="11px Roboto,Arial";g.textBaseline="bottom";
 function dimChain(arr,horiz,off){var pts=arr.map(function(l){return l.v});if(pts.length<2)return;
  function P(v,o){return horiz?w2s(v,o):w2s(o,v)}
  [[pts,off],[[pts[0],pts[pts.length-1]],off-(18/V.s)]].forEach(function(set,si){var a=set[0],o=set[1];if(si===1&&a[0]===pts[0]&&pts.length===2)return;
   var A=P(a[0],o),B=P(a[a.length-1],o);g.beginPath();g.moveTo(A.x,A.y);g.lineTo(B.x,B.y);g.stroke();
   a.forEach(function(v){var q=P(v,o);g.beginPath();g.moveTo(q.x-4,q.y+4);g.lineTo(q.x+4,q.y-4);g.stroke()});
   for(var i=0;i<a.length-1;i++){var m=P((a[i]+a[i+1])/2,o),D=a[i+1]-a[i];if(Math.abs(D)*V.s<34)continue;var t=fi(D)+" ("+mmF(D)+")";g.save();g.translate(m.x,m.y);if(!horiz)g.rotate(-Math.PI/2);g.textAlign="center";g.fillText(si?("Total "+t):t,0,-2);g.restore()}})}
 dimChain(G.V,true,G.y0-r*1.6);dimChain(G.H,false,G.x0-r*1.6);g.restore()}
/* sheet: grid lines + bubbles + chains, R=world->paper */
function sheetGrid(d,R,G,o){o=o||{};if(!G)return;var c="#0e7490",ext=o.ext||3,br=3.2;
 G.V.forEach(function(l){var a=R(l.v,G.by0-ext),b=R(l.v,G.by1+ext);d.line(a[0],a[1],b[0],b[1],{w:0.18,c:c,dash:[3,1,0.6,1],L:"GRIDS"});d.poly(circ(a[0],a[1]-br,br),{w:0.3,c:c,fill:"#ffffff",L:"GRIDS"});d.text(a[0],a[1]-br,l.n,3,{a:"middle",v:"mid",bold:true,c:c,L:"GRIDS"});
  if(o.both){d.poly(circ(b[0],b[1]+br,br),{w:0.3,c:c,fill:"#ffffff",L:"GRIDS"});d.text(b[0],b[1]+br,l.n,3,{a:"middle",v:"mid",bold:true,c:c,L:"GRIDS"})}});
 G.H.forEach(function(l){var a=R(G.bx0-ext,l.v),b=R(G.bx1+ext,l.v);d.line(a[0],a[1],b[0],b[1],{w:0.18,c:c,dash:[3,1,0.6,1],L:"GRIDS"});d.poly(circ(a[0]-br,a[1],br),{w:0.3,c:c,fill:"#ffffff",L:"GRIDS"});d.text(a[0]-br,a[1],l.n,3,{a:"middle",v:"mid",bold:true,c:c,L:"GRIDS"});
  if(o.both){d.poly(circ(b[0]+br,b[1],br),{w:0.3,c:c,fill:"#ffffff",L:"GRIDS"});d.text(b[0]+br,b[1],l.n,3,{a:"middle",v:"mid",bold:true,c:c,L:"GRIDS"})}});
 if(o.dims===false)return;
 var top=R(0,G.by0-ext)[1]-2*br-3,left=R(G.bx0-ext,0)[0]-2*br-3;
 chainP(d,G.V.map(function(l){return R(l.v,0)[0]}),G.V.map(function(l){return l.v}),top,true,c);
 chainP(d,G.H.map(function(l){return R(0,l.v)[1]}),G.H.map(function(l){return l.v}),left,false,c)}
/* paper chain: P = paper coords along axis, W = world values; pos = fixed coordinate. inner chain + overall */
function chainP(d,P,W,pos,horiz,c){if(P.length<2)return;c=c||"#000000";
 function seg(p0,p1,q,lab){var A=horiz?[p0,q]:[q,p0],B=horiz?[p1,q]:[q,p1];d.line(A[0],A[1],B[0],B[1],{w:0.18,c:c,L:"DIMS"});[A,B].forEach(function(p){d.line(p[0]-0.9,p[1]+0.9,p[0]+0.9,p[1]-0.9,{w:0.3,c:c,L:"DIMS"})});
  var m=(p0+p1)/2,len=Math.abs(p1-p0),s=Math.min(2.1,len/(tw(lab,1)+0.5));if(s<0.9)s=0.9;d.text(horiz?m:q-0.8,horiz?q-0.8:m,lab,s,{a:"middle",rot:horiz?0:90,c:c,L:"DIMS"})}
 for(var i=0;i<P.length-1;i++){var D=Math.abs(W[i+1]-W[i]);seg(P[i],P[i+1],pos,fi(D)+" ("+mmF(D)+")")}
 if(P.length>2){var T=Math.abs(W[W.length-1]-W[0]);seg(P[0],P[P.length-1],pos-(horiz?5:5),"Total "+fi(T)+" ("+mmF(T)+")")}}
function circ(cx,cy,r,n){n=n||20;var o=[];for(var i=0;i<n;i++){var a=i/n*Math.PI*2;o.push([cx+r*Math.cos(a),cy+r*Math.sin(a)])}return o}
/* hook into canvas painting: grids after structure */
var _dsc15=drawStructCanvas;drawStructCanvas=function(){_dsc15.apply(this,arguments);try{drawAutoGridCanvas()}catch(e){console.warn(e)}
 if(visOn("beams"))S.beams.forEach(function(m){if(!m.cb)return;var a=w2s(m.a.x,m.a.y),b=w2s(m.b.x,m.b.y);g.save();g.strokeStyle="#7c3aed";g.lineWidth=1.2;g.setLineDash([2,4]);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke();
  var c=w2s((m.a.x+m.b.x)/2,(m.a.y+m.b.y)/2);g.fillStyle="#7c3aed";g.font="bold 10px Roboto,Arial";g.textAlign="center";g.fillText("CB",c.x,c.y+14);g.restore()})};
/* new beams carry the chosen kind / rebar */
var _addBeam15=addBeam;addBeam=function(a,b){var m=_addBeam15(a,b);if(m){if(UI.beamCB)m.cb=1;if(UI.beamRB)m.rb=Object.assign({},UI.beamRB)}return m};
