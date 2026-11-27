/* ===== v2.1 Site boundary (plot line) + footing snap inside the boundary ===== */
Object.assign(ICO,{bound:'<rect x="3" y="3" width="18" height="18" rx="1" stroke-dasharray="3 2"/><path d="M7 17V7h10"/>',undo:'<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>'});
Object.assign(TD14,{bound:["Boundary","Draw or fix the site boundary (plot line). Footings stay inside.","bound"]});
Object.assign(HINTS,{bound:"Tap each plot corner · tap the first corner to close · footings snap to this line"});
Object.assign(RLAB,{bound:"Bound"});
if(typeof PANELS!=="undefined"){PANELS.arch[1].forEach(function(p){if(p[0]==="Site"&&p[2].indexOf("bound")<0)p[2].splice(1,0,"bound")});
 if(typeof panelTools==="function"){TABS={};Object.keys(PANELS).forEach(function(k){TABS[k]=[PANELS[k][0],panelTools(k)]})}}

function boundCfg(){S.meta.bound=S.meta.bound||{pts:[],on:true};if(!Array.isArray(S.meta.bound.pts))S.meta.bound.pts=[];return S.meta.bound}
function boundPoly(){var b=boundCfg();if(b.on!==false&&b.pts&&b.pts.length>=3)return b.pts;
 var w=(S.L[0]&&S.L[0].cwalls||[]).find(function(x){return x.closed&&x.pts&&x.pts.length>=3});return w?w.pts:null}
function boundHas(){return !!(boundPoly()&&boundPoly().length>=3)}
function rayHitPoly(o,ux,uy,P){var best=Infinity;for(var i=0;i<P.length;i++){var A=P[i],B=P[(i+1)%P.length],I=segIntersect(o,{x:ux,y:uy},A,B);
 if(I&&I.t>=-1e-6&&I.t<=1+1e-6&&I.r>1e-4&&I.r<best)best=I.r}return isFinite(best)?best:null}
function closestOnPoly(x,y,P){var best=null,bd=1e9;for(var i=0;i<P.length;i++){var q=projSeg(x,y,P[i],P[(i+1)%P.length]);if(q.d<bd){bd=q.d;best=q}}return best}

/* Stage: Foundation - clip a column's footing so every edge stays on or inside the plot boundary */
function clipFtgCol(c){if(!c)return;var P=boundPoly();if(!P){if(c.ftg){delete c.ftg.cw;delete c.ftg.cl;delete c.ftg.ox;delete c.ftg.oy}return}
 var f=ftgOf(c),hw=f.w/2,hl=f.l/2,ang=(c.rot||0)*Math.PI/180,cs=Math.cos(ang),sn=Math.sin(ang);
 function dist(ux,uy,maxd){var r=rayHitPoly(c,ux,uy,P);return r==null?maxd:Math.min(maxd,r)}
 var inside=inPoly(c.x,c.y,P);
 if(!inside){var q=closestOnPoly(c.x,c.y,P);if(!q)return;var nx=c.x-q.x,ny=c.y-q.y,L=Math.hypot(nx,ny)||1;nx/=L;ny/=L;
  if(!inPoly(q.x+nx*0.05,q.y+ny*0.05,P)){nx=-nx;ny=-ny}
  var need=Math.max(hw,hl);c.ftg=Object.assign(c.ftg||{},{ox:nx*need- (c.x-(q.x+nx*0.01)),oy:ny*need-(c.y-(q.y+ny*0.01)),cw:f.w,cl:f.l});
  c.x=q.x+nx*0.02;c.y=q.y+ny*0.02;inside=inPoly(c.x,c.y,P)}
 var dp=dist(cs,sn,hw),dm=dist(-cs,-sn,hw),lp=dist(-sn,cs,hl),lm=dist(sn,-cs,hl);
 var ox=(dp-dm)/2,oy=(lp-lm)/2,cw=dp+dm,cl=lp+lm;
 if(cw<0.5)cw=0.5;if(cl<0.5)cl=0.5;
 c.ftg=Object.assign(c.ftg||{},{ox:ox*cs-oy*sn,oy:ox*sn+oy*cs,cw:cw,cl:cl})}
function clipAllFtgs(){if(!S||!S.L||!S.L[0])return;(S.L[0].cols||[]).forEach(clipFtgCol)}
function ftgPoly(c){var f=ftgOf(c),w=((c.ftg&&c.ftg.cw)>0?c.ftg.cw:f.w)/2,l=((c.ftg&&c.ftg.cl)>0?c.ftg.cl:f.l)/2;
 var ox=(c.ftg&&c.ftg.ox)||0,oy=(c.ftg&&c.ftg.oy)||0,a=(c.rot||0)*Math.PI/180,cs=Math.cos(a),sn=Math.sin(a),cx=c.x+ox,cy=c.y+oy;
 return [[-w,-l],[w,-l],[w,l],[-w,l]].map(function(p){return {x:cx+p[0]*cs-p[1]*sn,y:cy+p[0]*sn+p[1]*cs}})}

var _ftgR0=ftgRects;ftgRects=function(){if(S.cur!==0)return [];if(!(ftgCfg().on||boundHas()))return [];return (S.cols||[]).map(ftgPoly)};
var _addColB=addCol;addCol=function(x,y,quiet){var c=_addColB(x,y,quiet);if(c){if(boundHas()){S.meta.ftg=Object.assign(S.meta.ftg||{},{on:true});clipFtgCol(c)} }return c};
var _setWallThB=typeof setWallTh==="function"?setWallTh:null;
if(_setWallThB){setWallTh=function(s,v){_setWallThB(s,v);if(typeof syncBeamsOnWall==="function")syncBeamsOnWall(s)}}
var _propSetB=propSet;propSet=function(key,v,L){var r=_propSetB.apply(this,arguments);if(key==="beam.w"&&L&&L[0]){var e=elGet(L[0]);if(e)e.wov=1}if(key==="col.w"||key==="col.d"||key==="col.rot")clipAllFtgs();return r};

function drawBoundCanvas(){var P=boundCfg().pts,pd=UI.bdPend;if(UI.clean)return;
 function stroke(pts,col,lw,dash,close){if(!pts||pts.length<2)return;g.save();g.strokeStyle=col;g.lineWidth=lw;g.setLineDash(dash||[]);g.beginPath();pts.forEach(function(p,i){var q=w2s(p.x,p.y);i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y)});if(close)g.closePath();g.stroke();g.setLineDash([]);g.restore()}
 if(P.length>=2&&boundCfg().on!==false){stroke(P,"#0f766e",2.2,[10,5],P.length>=3);
  P.forEach(function(p,i){var q=w2s(p.x,p.y);g.fillStyle=i?"#0f766e":"#16a34a";g.beginPath();g.arc(q.x,q.y,4,0,7);g.fill();
   if(P.length>=3){var n=P[(i+1)%P.length],m=w2s((p.x+n.x)/2,(p.y+n.y)/2);g.fillStyle="#0f766e";g.font="bold 11px Roboto,Arial";g.textAlign="center";g.fillText(fi(Math.hypot(n.x-p.x,n.y-p.y)),m.x,m.y-8)}})}
 if(UI.tool==="bound"&&pd&&pd.length){stroke(pd,"#ea580c",2.4,null,false);pd.forEach(function(p,i){var q=w2s(p.x,p.y);g.fillStyle=i?"#ea580c":"#16a34a";g.beginPath();g.arc(q.x,q.y,i?4:7,0,7);g.fill()})}
 /* roof outline */
 try{if(typeof roofPlanPoly==="function"&&visOn("roof")!==false){var R=roofPlanPoly();if(R&&R.length>=3)stroke(R,"#b45309",1.6,[8,4],true)}}catch(e){}}
var _duB=drawUnderlay;drawUnderlay=function(){_duB.apply(this,arguments);try{drawBoundCanvas()}catch(e){console.warn(e)}};

function bdPick(w){var q=findPoint(w.x,w.y,snapR());if(q)return {x:q.x,y:q.y};return {x:gsnap(w.x),y:gsnap(w.y)}}
function bdFinish(close){var P=UI.bdPend||[];if(P.length<3){toast("Tap at least 3 corners for a closed plot");return}
 snapshot();S.meta.bound={pts:P.map(function(p){return {x:p.x,y:p.y}}),on:true};UI.bdPend=[];clipAllFtgs();changed();updCtx();toast("Site boundary set · footings stay inside")}
function bdAt(w){var P=boundCfg().pts;if(!P||P.length<2)return null;var bd=snapR()*1.2;for(var i=0;i<P.length;i++){var d=d2seg(w,P[i],P[(i+1)%P.length]);if(d<bd)return true}return false}

var _ttB=toolTap;toolTap=function(w){if(UI.tool==="bound"){var P=UI.bdPend=UI.bdPend||[];if(!P.length&&bdAt(w)&&boundCfg().pts.length){bdPopup();return true}
  var p=bdPick(w);if(P.length>=3&&Math.hypot(p.x-P[0].x,p.y-P[0].y)<snapR()*1.2){bdFinish(true);return true}P.push(p);render();updCtx();return true}
 return _ttB.apply(this,arguments)};

function bdPopup(){var b=boundCfg(),P=b.pts||[];modal('<div class="mt">Site boundary</div><div class="ms">'+(P.length?P.length+" corners · plot line that footings cannot cross.":"No boundary yet.")+'</div>'+
 '<label class="fld"><input type="checkbox" id="bdOn" '+(b.on!==false?"checked":"")+'> Show boundary and snap footings</label>'+
 '<div class="row"><button class="bb del" id="bdDel">Clear</button><button class="bb" id="bdRed">Redraw</button><button class="bb" id="bdX">Cancel</button><button class="bb ok" id="bdOk">OK</button></div>',function(){
 $("bdX").onclick=closeModal;$("bdRed").onclick=function(){closeModal();UI.bdPend=[];setTool("bound");toast("Tap the plot corners")};
 $("bdDel").onclick=function(){snapshot();S.meta.bound={pts:[],on:true};clipAllFtgs();closeModal();changed()};
 $("bdOk").onclick=function(){snapshot();b.on=$("bdOn").checked;clipAllFtgs();closeModal();changed()}})}

var _ucB=updCtx;updCtx=function(){_ucB.apply(this,arguments);var c=$("ctx");if(!c||UI.clean)return;if(UI.tool!=="bound")return;
 var h=CDV+'<span class="cnt">'+((UI.bdPend||[]).length)+' pts</span>'+cbI("bdclose","poly","Close plot")+cbI("bdundo","undo","Undo point")+cbI("bdedit","edit","Edit boundary");
 c.insertAdjacentHTML("beforeend",h);c.querySelectorAll("[data-c]").forEach(function(b){b.onclick=function(){ctxAction(b.dataset.c)}})};
var _caB=ctxAction;ctxAction=function(k){if(k==="bdclose"){bdFinish(true);return}if(k==="bdundo"){(UI.bdPend||[]).pop();render();updCtx();return}if(k==="bdedit"){bdPopup();return}return _caB.apply(this,arguments)};

var _pexB=planExtras;planExtras=function(d,R,k){_pexB.apply(this,arguments);var P=boundPoly();if(P&&P.length>=3)d.poly(P.map(function(p){return R(p.x,p.y)}),{w:0.25,c:"#0f766e",dash:[2,1.2],L:"BOUNDARY"});
 try{if(typeof roofPlanPoly==="function"){var RP=roofPlanPoly();if(RP&&RP.length>=3)d.poly(RP.map(function(p){return R(p.x,p.y)}),{w:0.22,c:"#b45309",dash:[1.6,0.8],L:"ROOF"})}}catch(e){}};
var _peB=planExt;planExt=function(ext){_peB(ext);var P=boundPoly();if(P)P.forEach(ext);try{var RP=typeof roofPlanPoly==="function"&&roofPlanPoly();if(RP)RP.forEach(ext)}catch(e){}};

var _tuB=toolUp;toolUp=function(G,w){var r=_tuB.apply(this,arguments);if(G&&(G.kind==="dragsel"||G.kind==="dragpt")&&boundHas())clipAllFtgs();return r};

/* roof outline from wall hull + per-side overhang (used by plan / 3D / quantities) */
function convexHull(pts){var P=pts.map(function(p){return {x:p.x,y:p.y}}).sort(function(a,b){return a.x===b.x?a.y-b.y:a.x-b.x});if(P.length<3)return P;
 function cr(o,a,b){return (a.x-o.x)*(b.y-o.y)-(a.y-o.y)*(b.x-o.x)}var low=[],up=[];
 P.forEach(function(p){while(low.length>=2&&cr(low[low.length-2],low[low.length-1],p)<=0)low.pop();low.push(p)});
 for(var i=P.length-1;i>=0;i--){var p=P[i];while(up.length>=2&&cr(up[up.length-2],up[up.length-1],p)<=0)up.pop();up.push(p)}
 low.pop();up.pop();return low.concat(up)}
function edgeOvDist(a,b,outSign){var o=roofOvs(),L=Math.hypot(b.x-a.x,b.y-a.y)||1,nx=-(b.y-a.y)/L*outSign,ny=(b.x-a.x)/L*outSign;
 if(Math.abs(nx)>=Math.abs(ny))return nx>=0?o.e:o.w;return ny>=0?o.s:o.n}
function offsetByEdges(P,distFn){var n=P.length,s=polyArea(P)>0?1:-1,L=[];
 for(var i=0;i<n;i++){var a=P[i],b=P[(i+1)%n],l=Math.hypot(b.x-a.x,b.y-a.y)||1,nx=-(b.y-a.y)/l*s,ny=(b.x-a.x)/l*s,d=distFn(a,b,s);
  L.push({a:{x:a.x+nx*d,y:a.y+ny*d},u:{x:(b.x-a.x)/l,y:(b.y-a.y)/l}})}
 return L.map(function(l,i){var m=L[(i-1+n)%n],den=m.u.x*l.u.y-m.u.y*l.u.x;if(Math.abs(den)<1e-9)return {x:l.a.x,y:l.a.y};
  var t=((l.a.x-m.a.x)*l.u.y-(l.a.y-m.a.y)*l.u.x)/den;return {x:m.a.x+m.u.x*t,y:m.a.y+m.u.y*t}})}
function wallHull(lv){lv=lv==null?topLevel():lv;return withLevel(lv,function(){var pts=[];S.pts.forEach(function(p){pts.push(p)});
  if(S.meta.dbl)S.segs.forEach(function(s){var P=wallPoly(s);if(P)P.forEach(function(p){pts.push(p)})});return pts.length>=3?convexHull(pts):[]})}
function roofPlanPoly(){var H=wallHull();if(!H||H.length<3)return null;if(!roofHasOv())return H;
 var O=offsetByEdges(H,function(a,b,s){return -edgeOvDist(a,b,s)});if(Math.abs(polyArea(O))<Math.abs(polyArea(H)))O=offsetByEdges(H,function(a,b,s){return edgeOvDist(a,b,s)});return O}

var _b3lR=build3DLevel;build3DLevel=function(P,i,ti,rc,M){var useOv=i===ti&&rc.type==="flat"&&roofHasOv()&&typeof roofPlanPoly==="function";
 if(useOv){_b3lR(P,i,ti,Object.assign({},rc,{type:"hip"}),M);var poly=roofPlanPoly();if(poly)slab(poly,P.H-P.sl,P.H,M.roof,"ROOF3D");return}
 _b3lR.apply(this,arguments)};
if(typeof VGC!=="undefined"){[["bound","Site boundary"],["roof","Roof outline"],["elec","Electrical"],["mech","Mechanical"],["plumb","Plumbing"]].forEach(function(c){if(!VGC.some(function(x){return x[0]===c[0]}))VGC.push(c)})}
