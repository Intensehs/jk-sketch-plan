/* ===== v2.1.4 live dimensions, relative 90° snap, corner edit ===== */
var R90TOL=3;
Object.assign(HINTS,{
 draw:"Draw walls with pen / finger · length and angle show live next to the cursor · green square = 90°",
 move:"Tap a corner to select it, then drag · connected walls follow · 90° snaps green · Undo works",
 bound:"Tap each plot corner · length and angle show live · green square = 90° · drag a corner to move it"});
(function(){if(typeof PANELS==="undefined")return;
 PANELS.arch[1].forEach(function(p){if(p[0]==="Build"&&p[2].indexOf("move")<0)p[2].splice(1,0,"move")});
 TABS={};Object.keys(PANELS).forEach(function(k){TABS[k]=[PANELS[k][0],panelTools(k)]})})();

function fmtAng(d){if(!isFinite(d))return "";var a=Math.abs(d);if(a>180)a=360-a;return Math.round(a)+"°"}
function absAng(a,b){return Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI}
function turnAng(prev,corner,next){if(!prev||!corner||!next)return absAng(corner,next);
 var a1=Math.atan2(corner.y-prev.y,corner.x-prev.x),a2=Math.atan2(next.y-corner.y,next.x-corner.x),d=(a2-a1)*180/Math.PI;
 while(d>180)d-=360;while(d<-180)d+=360;return d}
function near90(ang){var a=Math.abs(ang);return Math.abs(a-90)<=R90TOL||Math.abs(a-270)<=R90TOL}
function incomingPt(pid){if(pid==null||!S||!S.segs)return null;var n=[];
 S.segs.forEach(function(s){if(s.a===pid){var p=pt(s.b);if(p)n.push(p)}else if(s.b===pid){var p2=pt(s.a);if(p2)n.push(p2)}});
 if(n.length===1)return n[0];
 if(n.length&&UI&&UI.runStart!=null){var pref=n.filter(function(p){return p.id!==UI.runStart});if(pref.length===1)return pref[0]}
 return n.length?n[n.length-1]:null}
function snapRel90(prev,from,to){if(!prev||!from||!to)return to;
 var vx=from.x-prev.x,vy=from.y-prev.y,L0=Math.hypot(vx,vy);if(L0<1e-6)return to;vx/=L0;vy/=L0;
 var wx=to.x-from.x,wy=to.y-from.y,L=Math.hypot(wx,wy);if(L<1e-6)return to;
 var ang=Math.atan2(vx*wy-vy*wx,vx*wx+vy*wy)*180/Math.PI;
 if(Math.abs(Math.abs(ang)-90)>R90TOL){to.sq=false;return to}
 var sign=ang>=0?1:-1,px=-vy*sign,py=vx*sign;
 to.x=from.x+px*L;to.y=from.y+py*L;to.sq=true;to.sqAt=from;to.sqPrev=prev;return to}
function dhSegAngTxt(pv,i){if(!pv||!pv[i])return "";var sg=pv[i],prev=i?pv[i-1].a:(sg.a.prev||incomingPt(sg.a.pid)),ang=turnAng(prev,sg.a,sg.b);
 return "  "+fmtAng(ang)}
function drawRightSq(corner,from,to){if(!g||!corner||!from||!to)return;
 var A=w2s(corner.x,corner.y),s1x=(from.x-corner.x)*V.s,s1y=(from.y-corner.y)*V.s,s2x=(to.x-corner.x)*V.s,s2y=(to.y-corner.y)*V.s;
 var L1=Math.hypot(s1x,s1y),L2=Math.hypot(s2x,s2y);if(L1<2||L2<2)return;
 var sz=Math.max(10,Math.min(18,Math.min(L1,L2)*0.35));s1x=s1x/L1*sz;s1y=s1y/L1*sz;s2x=s2x/L2*sz;s2y=s2y/L2*sz;
 g.save();g.beginPath();g.moveTo(A.x+s1x,A.y+s1y);g.lineTo(A.x+s1x+s2x,A.y+s1y+s2y);g.lineTo(A.x+s2x,A.y+s2y);
 g.strokeStyle="#16a34a";g.lineWidth=2.4;g.lineJoin="miter";g.stroke();g.restore()}
function dhMarkPreview(pv){if(!pv||!pv.length)return;
 pv.forEach(function(sg,i){var prev=i?pv[i-1].a:(sg.a.prev||incomingPt(sg.a.pid));if(!prev)return;
  var ang=turnAng(prev,sg.a,sg.b);if(sg.b.sq||near90(ang))drawRightSq(sg.a,prev,sg.b)})}
function showDimTip(t,sx,sy,touch){var el=$("dimtip");if(!el){if(typeof showHud==="function")showHud(t);return}
 el.textContent=t;el.style.display="block";
 var x=sx,y=sy,offY=touch?-56:-28,offX=touch?18:0;
 el.style.left=Math.max(8,Math.min((CW||innerWidth)-8,x+offX))+"px";
 el.style.top=Math.max(8,y+offY)+"px";
 var h=$("hud");if(h)h.style.display="none"}
function hideDimTip(){var el=$("dimtip");if(el)el.style.display="none"}
var _hideHudDH=hideHud;hideHud=function(){hideDimTip();if(_hideHudDH)return _hideHudDH.apply(this,arguments)};

function liveTxt(len,ang){return fi(len)+(ang==null||!isFinite(ang)?"":"  "+fmtAng(ang))}
function dhLiveFromPt(P,w){if(!P)return;var nbs=[];(S.segs||[]).forEach(function(s){if(s.a===P.id){var b=pt(s.b);if(b)nbs.push(b)}else if(s.b===P.id){var a=pt(s.a);if(a)nbs.push(a)}});
 var ang=nbs.length>=2?turnAng(nbs[0],P,nbs[1]):(nbs.length===1?absAng(nbs[0],P):null);
 var L=nbs.length?Math.hypot((nbs[0].x-P.x),(nbs[0].y-P.y)):0;
 var scr=UI.ptr||w2s(P.x,P.y);showDimTip(liveTxt(L,ang),scr.sx!=null?scr.sx:scr.x,scr.sy!=null?scr.sy:scr.y,UI.ptr&&UI.ptr.type==="touch")}

function snapCornerMove(P,w){var cand={x:gsnap(w.x),y:gsnap(w.y)},q=findPoint(w.x,w.y,snapR(),P.id);
 if(q){cand.x=q.x;cand.y=q.y;cand.pid=q.id}UI.vsq=null;
 var nbs=[];(S.segs||[]).forEach(function(s){if(s.a===P.id){var b=pt(s.b);if(b)nbs.push(b)}else if(s.b===P.id){var a=pt(s.a);if(a)nbs.push(a)}});
 if(nbs.length>=2){var A=nbs[0],B=nbs[1],ang=turnAng(A,cand,B);
  if(near90(ang)){var mx=(A.x+B.x)/2,my=(A.y+B.y)/2,r=Math.hypot(B.x-A.x,B.y-A.y)/2,vx=cand.x-mx,vy=cand.y-my,L=Math.hypot(vx,vy)||1;
   cand.x=mx+vx/L*r;cand.y=my+vy/L*r;cand.sq=true;UI.vsq={c:cand,a:A,b:B}}}
 else if(nbs.length===1){var A2=nbs[0],n2=[];(S.segs||[]).forEach(function(s){var o=s.a===A2.id?pt(s.b):(s.b===A2.id?pt(s.a):null);if(o&&o.id!==P.id)n2.push(o)});
  if(n2.length){snapRel90(n2[0],A2,cand);if(cand.sq)UI.vsq={c:A2,a:n2[0],b:cand}}}
 return cand}

function nudgeVsel(k){var P=pt(UI.vsel);if(!P){if(UI.vsel&&String(UI.vsel).charAt(0)==="b"){nudgeBound(k);return}toast("Tap a corner first");return}
 var inch=/6$/.test(k)?0.5:1/12,map={nL:[-inch,0],nR:[inch,0],nU:[0,-inch],nD:[0,inch],nL6:[-inch,0],nR6:[inch,0],nU6:[0,-inch],nD6:[0,inch]},d=map[k];if(!d)return;
 snapshot();P.x+=d[0];P.y+=d[1];planarize();changed();updCtx();toast("Moved "+thTxt(Math.abs(d[0]||d[1])*12).replace(/"$/,"")+(d[0]?" horizontally":" vertically"))}
function nudgeBound(k){var i=+String(UI.vsel).slice(1),P=(boundCfg().pts||[])[i];if(!P){toast("Tap a corner first");return}
 var inch=/6$/.test(k)?0.5:1/12,map={nL:[-inch,0],nR:[inch,0],nU:[0,-inch],nD:[0,inch],nL6:[-inch,0],nR6:[inch,0],nU6:[0,-inch],nD6:[0,inch]},d=map[k];if(!d)return;
 snapshot();P.x+=d[0];P.y+=d[1];if(typeof clipAllFtgs==="function")clipAllFtgs();changed();updCtx()}
function nudgeVselPopup(){var P=pt(UI.vsel);if(!P){toast("Tap a corner first");return}
 modal('<div class="mt">Nudge corner</div><div class="ms">Type how far to move this corner (inches). Undo brings it back.</div>'+
  '<div class="grid2"><label class="fld">ΔX inches (right +)<input id="nxv" type="number" step="0.5" value="0"></label><label class="fld">ΔY inches (down +)<input id="nyv" type="number" step="0.5" value="0"></label></div>'+
  '<div class="row"><button class="bb" id="nx">Cancel</button><button class="bb ok" id="nok">Move</button></div>',function(){
  $("nx").onclick=closeModal;$("nok").onclick=function(){var dx=(+$("nxv").value||0)/12,dy=(+$("nyv").value||0)/12;closeModal();if(!dx&&!dy)return;snapshot();P.x+=dx;P.y+=dy;planarize();changed();updCtx()}})}

function dhHoverRubber(){UI.hoverPv=null;UI.hoverSq=null;if(!UI.ptr||!UI.ptr.w)return;
 var w=UI.ptr.w,t=UI.tool;
 if(t==="draw"&&(UI.chain||UI.chainFree)&&!GS){var from=UI.chain&&pt(UI.chain)||UI.chainFree;if(from){var cur={x:from.x,y:from.y,pid:from.id,prev:incomingPt(from.id)},r=snapStep(cur,w,true);UI.hoverPv=[{a:cur,b:r}]}}
 if(t==="bound"&&(UI.bdPend||[]).length){var P=UI.bdPend,from=P[P.length-1],prev=P.length>=2?P[P.length-2]:null,p={x:gsnap(w.x),y:gsnap(w.y)};if(prev)snapRel90(prev,from,p);UI.hoverPv=[{a:from,b:p}]}
 if(t==="cwall"&&(UI.cwPend||[]).length){var C=UI.cwPend,f2=C[C.length-1],pr2=C.length>=2?C[C.length-2]:null,p2={x:gsnap(w.x),y:gsnap(w.y)};if(pr2)snapRel90(pr2,f2,p2);UI.hoverPv=[{a:f2,b:p2}]}
 if(t==="proom"&&(UI.prPend||[]).length){var R=UI.prPend,f3=R[R.length-1],pr3=R.length>=2?R[R.length-2]:null,p3={x:gsnap(w.x),y:gsnap(w.y)};if(pr3)snapRel90(pr3,f3,p3);UI.hoverPv=[{a:f3,b:p3}]}
 if(LINE2&&LINE2[t]&&UI.lpA&&!GS&&!UI.lp){var b=typeof snapLine==="function"?snapLine(w,UI.lpA):w;UI.hoverPv=[{a:UI.lpA,b:b}]}}

function dhOverlay(){if(!g||UI.clean){hideDimTip();return}
 var live=UI.preview&&UI.preview.length?UI.preview:(UI.hoverPv&&UI.hoverPv.length?UI.hoverPv:null);
 if(UI.hoverPv&&UI.hoverPv.length&&!(UI.preview&&UI.preview.length)){UI.hoverPv.forEach(function(sg){var a=w2s(sg.a.x,sg.a.y),b=w2s(sg.b.x,sg.b.y);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.strokeStyle="#e8590c";g.lineWidth=3.5;g.lineCap="round";g.stroke()});
  UI.hoverPv.forEach(function(sg,i){var L=Math.hypot(sg.b.x-sg.a.x,sg.b.y-sg.a.y),prev=i?UI.hoverPv[i-1].a:(sg.a.prev||incomingPt(sg.a.pid)),ang=turnAng(prev,sg.a,sg.b);lenLabel(sg.a,sg.b,fi(L)+"  "+fmtAng(ang),true);if(prev&&(sg.b.sq||near90(ang)))drawRightSq(sg.a,prev,sg.b)})}
 if(UI.lp){var prevL=null;if(UI.lp.a)prevL=incomingPt(UI.lp.a.id)||(UI.lpA&&UI.lpA!==UI.lp.a?UI.lpA:null);
  var angL=turnAng(prevL,UI.lp.a,UI.lp.b);if(prevL&&(UI.lp.b.sq||near90(angL)))drawRightSq(UI.lp.a,prevL,UI.lp.b)}
 if(UI.vsq&&UI.vsq.c)drawRightSq(UI.vsq.c,UI.vsq.a,UI.vsq.b);
 if(UI.tool==="move"||UI.vsel){(S.pts||[]).forEach(function(p){var q=w2s(p.x,p.y),on=p.id===UI.vsel;g.beginPath();g.arc(q.x,q.y,on?11:7,0,7);g.fillStyle=on?"#16a34a":"#ffd58a";g.fill();g.strokeStyle=on?"#14532d":"#14253b";g.lineWidth=on?2.5:1.5;g.stroke();
  if(on){g.beginPath();g.moveTo(q.x-14,q.y);g.lineTo(q.x+14,q.y);g.moveTo(q.x,q.y-14);g.lineTo(q.x,q.y+14);g.strokeStyle="#16a34a";g.lineWidth=1.6;g.stroke()}})}
 if(UI.tool==="bound"||(UI.tool==="move"&&boundCfg&&boundCfg().pts)){var BP=(typeof boundCfg==="function"?boundCfg().pts:null)||[];BP.forEach(function(p,i){var q=w2s(p.x,p.y),on=UI.vsel==="b"+i;g.beginPath();g.arc(q.x,q.y,on?11:6,0,7);g.fillStyle=on?"#16a34a":"#5eead4";g.fill();g.strokeStyle="#0f766e";g.lineWidth=1.6;g.stroke()})}
 var tip=null,sx,sy;
 if(live&&live.length){var last=live[live.length-1],prev=live.length>1?live[live.length-2].a:(last.a.prev||incomingPt(last.a.pid)),ang=turnAng(prev,last.a,last.b);
  var I=(UI.tool==="draw"&&typeof pvInner==="function")?pvInner(live,live.length-1):null,L=I&&I.L>0?I.L:Math.hypot(last.b.x-last.a.x,last.b.y-last.a.y);
  tip=liveTxt(L,ang);var sp=UI.ptr?{x:UI.ptr.sx,y:UI.ptr.sy}:w2s(last.b.x,last.b.y);sx=sp.x;sy=sp.y}
 else if(UI.lp){var ang2=absAng(UI.lp.a,UI.lp.b),L2=Math.hypot(UI.lp.b.x-UI.lp.a.x,UI.lp.b.y-UI.lp.a.y);tip=liveTxt(L2,ang2);var sp2=UI.ptr?{x:UI.ptr.sx,y:UI.ptr.sy}:w2s(UI.lp.b.x,UI.lp.b.y);sx=sp2.x;sy=sp2.y}
 if(tip&&sx!=null)showDimTip(tip,sx,sy,UI.ptr&&UI.ptr.type==="touch");else if(!(GS&&GS.kind==="dragpt"))hideDimTip()}

var _paintDH=paint;paint=function(){_paintDH.apply(this,arguments);try{dhOverlay()}catch(e){}};

var _onMoveDH=onMove;onMove=function(e){try{var p=lp(e);UI.ptr={sx:p.x,sy:p.y,w:s2w(p.x,p.y),type:e.pointerType};if(!GS){dhHoverRubber();if(UI.hoverPv)render()}}catch(err){}
 _onMoveDH.apply(this,arguments);
 if(GS&&GS.kind==="stroke"&&UI.preview&&UI.preview.length){var pv=UI.preview,sg=pv[pv.length-1],prev=pv.length>1?pv[pv.length-2].a:(sg.a.prev||incomingPt(sg.a.pid)),I=pvInner(pv,pv.length-1);
  showDimTip(liveTxt(I.L,turnAng(prev,sg.a,sg.b)),UI.ptr.sx,UI.ptr.sy,e.pointerType==="touch")}};
var _showHudDH=showHud;showHud=function(t){var d=$("dimtip");if(d&&d.style.display==="block")return;_showHudDH(t)};

var _onUpDH=onUp;onUp=function(e){UI.hoverPv=null;UI.vsq=null;hideDimTip();return _onUpDH.apply(this,arguments)};

var _tdDH=toolDown;toolDown=function(w,G){var R=snapR()*1.4;
 if(UI.tool==="bound"||UI.tool==="move"){var P=(typeof boundCfg==="function"?boundCfg().pts:null)||[];
  for(var i=0;i<P.length;i++){if(Math.hypot(P[i].x-w.x,P[i].y-w.y)<R){G.kind="dragbpt";G.bi=i;G.snap=false;UI.vsel="b"+i;return true}}}
 if(UI.tool==="cwall"){var W=S.cwalls||[];for(var wi=0;wi<W.length;wi++){var pts=W[wi].pts||[];for(var j=0;j<pts.length;j++){if(Math.hypot(pts[j].x-w.x,pts[j].y-w.y)<R){G.kind="dragcpt";G.cw=W[wi];G.ci=j;G.snap=false;return true}}}}
 return _tdDH.apply(this,arguments)};
var _tmDH=toolMove;toolMove=function(w,G,p){
 if(G.kind==="dragbpt"){if(G.moved){if(!G.snap){snapshot();G.snap=true}var P=boundCfg().pts[G.bi];if(P){var prev=boundCfg().pts[(G.bi-1+boundCfg().pts.length)%boundCfg().pts.length],next=boundCfg().pts[(G.bi+1)%boundCfg().pts.length],c={x:gsnap(w.x),y:gsnap(w.y)};
   if(prev&&next&&near90(turnAng(prev,c,next))){var mx=(prev.x+next.x)/2,my=(prev.y+next.y)/2,r=Math.hypot(next.x-prev.x,next.y-prev.y)/2,vx=c.x-mx,vy=c.y-my,L=Math.hypot(vx,vy)||1;c.x=mx+vx/L*r;c.y=my+vy/L*r;UI.vsq={c:c,a:prev,b:next}}
   else if(prev)snapRel90(boundCfg().pts[(G.bi-2+boundCfg().pts.length)%boundCfg().pts.length]||prev,prev,c);
   P.x=c.x;P.y=c.y;UI.vsel="b"+G.bi;var scr=UI.ptr||w2s(P.x,P.y);showDimTip(liveTxt(Math.hypot(P.x-prev.x,P.y-prev.y),turnAng(prev,P,next)),scr.sx||scr.x,scr.sy||scr.y,UI.ptr&&UI.ptr.type==="touch");SHEET=null;render()} }return true}
 if(G.kind==="dragcpt"){if(G.moved){if(!G.snap){snapshot();G.snap=true}var pts=G.cw.pts,P=pts[G.ci];if(P){var prev=pts[(G.ci-1+pts.length)%pts.length],next=pts[(G.ci+1)%pts.length],c={x:gsnap(w.x),y:gsnap(w.y)};
   if(prev&&next&&near90(turnAng(prev,c,next))){var mx=(prev.x+next.x)/2,my=(prev.y+next.y)/2,r=Math.hypot(next.x-prev.x,next.y-prev.y)/2,vx=c.x-mx,vy=c.y-my,L=Math.hypot(vx,vy)||1;c.x=mx+vx/L*r;c.y=my+vy/L*r;UI.vsq={c:c,a:prev,b:next}}
   P.x=c.x;P.y=c.y;SHEET=null;render()} }return true}
 if(G.kind==="line2"&&G.moved){var r=_tmDH.apply(this,arguments);if(UI.lp){var prev=incomingPt(G.a&&G.a.pid)||incomingPt(G.a&&G.a.id);if(prev)snapRel90(prev,UI.lp.a,UI.lp.b);
  var ang=turnAng(prev,UI.lp.a,UI.lp.b),L=Math.hypot(UI.lp.b.x-UI.lp.a.x,UI.lp.b.y-UI.lp.a.y);showDimTip(liveTxt(L,ang),UI.ptr?UI.ptr.sx:0,UI.ptr?UI.ptr.sy:0,UI.ptr&&UI.ptr.type==="touch")}return r}
 return _tmDH.apply(this,arguments)};
var _tuDH=toolUp;toolUp=function(G,w){
 if(G.kind==="dragbpt"){hideDimTip();if(G.snap){if(typeof clipAllFtgs==="function")clipAllFtgs();changed()}else{UI.vsel="b"+G.bi;if(typeof updCtx==="function")updCtx();render()}return true}
 if(G.kind==="dragcpt"){hideDimTip();if(G.snap)changed();return true}
 return _tuDH.apply(this,arguments)};

if(typeof bdPick==="function"){var _bdPick=bdPick;bdPick=function(w){var p=_bdPick(w),P=UI.bdPend||[];if(P.length>=1){var from=P[P.length-1],prev=P.length>=2?P[P.length-2]:null;if(prev)snapRel90(prev,from,p)}return p}}
if(typeof cwPick==="function"){var _cwPick=cwPick;cwPick=function(w){var p=_cwPick(w),P=UI.cwPend||[];if(P.length>=1){var from=P[P.length-1],prev=P.length>=2?P[P.length-2]:null;if(prev)snapRel90(prev,from,p)}return p}}
if(typeof snapLine==="function"){var _snapLine=snapLine;snapLine=function(w,a){var p=_snapLine(w,a);if(a){var prev=null;if(a.pid)prev=incomingPt(a.pid);if(!prev){var hit=findPoint(a.x,a.y,0.05);if(hit)prev=incomingPt(hit.id)}if(prev)snapRel90(prev,a,p)}return p}}

var _setToolDH=setTool;setTool=function(t){if(t!=="move"){UI.vsel=null;UI.vsq=null}_setToolDH.apply(this,arguments)};
var _undoDH=undo;undo=function(){UI.vsel=null;UI.vsq=null;_undoDH.apply(this,arguments)};
var _redoDH=redo;redo=function(){UI.vsel=null;UI.vsq=null;_redoDH.apply(this,arguments)};
