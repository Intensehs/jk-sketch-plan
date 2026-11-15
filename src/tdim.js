/* ================= v1.4 Revit-style TEMPORARY DIMENSIONS + editable / lockable permanent dimensions ================= */
function segGeo(s){var a=pt(s.a),b=pt(s.b),L=Math.hypot(b.x-a.x,b.y-a.y)||1,u={x:(b.x-a.x)/L,y:(b.y-a.y)/L};return {a:a,b:b,L:L,u:u,n:{x:-u.y,y:u.x}}}
function runGeo(s){var R=wallRun(s),a=pt(R.a),b=pt(R.b),L=Math.hypot(b.x-a.x,b.y-a.y)||1,u={x:(b.x-a.x)/L,y:(b.y-a.y)/L};return {R:R,a:a,b:b,L:L,u:u,n:{x:-u.y,y:u.x}}}
/* nearest parallel walls on both sides of a wall run: clear (face to face) distances */
/* Stage: Modify - Select tool: temporary dimensions of a selected wall */
function tempDims(s){var G=runGeo(s),ts=wallT(s)/2,best={1:null,"-1":null},sa=pt(s.a),sb=pt(s.b),sm=(((sa.x+sb.x)/2-G.a.x)*G.u.x+((sa.y+sb.y)/2-G.a.y)*G.u.y);
 S.segs.forEach(function(q){if(G.R.ids.indexOf(q.id)>=0)return;var Q=segGeo(q);if(Math.abs(Q.u.x*G.u.y-Q.u.y*G.u.x)>0.03)return;
  var d1=(Q.a.x-G.a.x)*G.n.x+(Q.a.y-G.a.y)*G.n.y,d2=(Q.b.x-G.a.x)*G.n.x+(Q.b.y-G.a.y)*G.n.y,d=(d1+d2)/2;if(Math.abs(d)<0.2)return;
  var p1=(Q.a.x-G.a.x)*G.u.x+(Q.a.y-G.a.y)*G.u.y,p2=(Q.b.x-G.a.x)*G.u.x+(Q.b.y-G.a.y)*G.u.y,o0=Math.max(0,Math.min(p1,p2)),o1=Math.min(G.L,Math.max(p1,p2));if(o1-o0<0.25)return;
  var sd=d>0?1:-1,clear=Math.abs(d)-ts-wallT(q)/2;if(clear<0.05)return;var cur=best[sd];if(!cur||Math.abs(d)<Math.abs(cur.d))best[sd]={q:q,d:d,side:sd,clear:clear,m:(sm>=o0+0.3&&sm<=o1-0.3)?sm:Math.max(o0+0.3,Math.min(o1-0.3,sm)),tq:wallT(q)/2}});
 return [best[1],best[-1]].filter(Boolean).map(function(b){var base={x:G.a.x+G.u.x*b.m,y:G.a.y+G.u.y*b.m};
  b.p1={x:base.x+G.n.x*b.side*ts,y:base.y+G.n.y*b.side*ts};b.p2={x:base.x+G.n.x*(b.d-b.side*b.tq),y:base.y+G.n.y*(b.d-b.side*b.tq)};b.s=s;b.G=G;return b})}
/* which wall run is a point attached to (on a face or centre line) */
function attachSeg(p,ud){var best=null;S.segs.forEach(function(s){var G=segGeo(s);if(ud&&Math.abs(G.u.x*ud.x+G.u.y*ud.y)>0.3)return;var al=(p.x-G.a.x)*G.u.x+(p.y-G.a.y)*G.u.y;if(al<-0.2||al>G.L+0.2)return;
  var off=Math.abs((p.x-G.a.x)*G.n.x+(p.y-G.a.y)*G.n.y),t=wallT(s)/2,e=Math.min(Math.abs(off-t),off);if(e<0.08&&(!best||e<best.e))best={s:s,e:e}});return best?best.s:null}
/* move wall run(s) by v, keeping locked dimensions; returns false if blocked */
function moveWallRuns(seed,v,fixedIds,skipDim){var runs=[],ids={},queue=[seed],fx={};(fixedIds||[]).forEach(function(i){fx[i]=1});
 var dimAt=S.dims.map(function(m){var u=dimGeom(m).u;return {m:m,sa:attachSeg(m.a,u),sb:attachSeg(m.b,u)}});
 while(queue.length){var s=queue.shift();if(ids[s.id])continue;var R=wallRun(s);if(R.ids.some(function(i){return fx[i]})){toast("A locked dimension prevents this change");return false}
  if(R.ids.some(function(i){var q=segById(i);return q&&q.pin})){toast("Pinned wall - unpin first");return false}
  R.ids.forEach(function(i){ids[i]=1});runs.push(R);
  dimAt.forEach(function(D){if(!D.m.lock||D.m===skipDim)return;var ina=D.sa&&ids[D.sa.id],inb=D.sb&&ids[D.sb.id];if(ina&&D.sb&&!ids[D.sb.id])queue.push(D.sb);if(inb&&D.sa&&!ids[D.sa.id])queue.push(D.sa)})}
 var P={};Object.keys(ids).forEach(function(i){var q=segById(+i);if(q){P[q.a]=1;P[q.b]=1}});
 Object.keys(P).forEach(function(i){var p=pt(+i);if(p){p.x=Math.round((p.x+v.x)*1200)/1200;p.y=Math.round((p.y+v.y)*1200)/1200}});
 dimAt.forEach(function(D){if(D.sa&&ids[D.sa.id]){D.m.a.x+=v.x;D.m.a.y+=v.y}if(D.sb&&ids[D.sb.id]){D.m.b.x+=v.x;D.m.b.y+=v.y}});
 S.labels.forEach(function(l){});return true}
function applyTempDim(td,val){var delta=val-td.clear;if(Math.abs(delta)<1e-4)return;var v={x:-td.side*td.G.n.x*delta,y:-td.side*td.G.n.y*delta};
 snapshot();if(!moveWallRuns(td.s,v,wallRun(td.q).ids)){UNDO.pop();render();return}planarize();changed();updProps();toast("Clear distance "+fi(val)+" - wall moved "+fi(Math.abs(delta)))}
function editDimValue(m,val){if(!(val>0.05)){toast("Value not valid");return false}if(m.lock){toast("Dimension is locked - unlock it first");return false}
 var G=dimGeom(m),delta=val-G.L;if(Math.abs(delta)<1e-4)return true;var sa=attachSeg(m.a,G.u),sb=attachSeg(m.b,G.u),mv=sb,fix=sa,sg=1;
 if(!sb||(sb.pin)){mv=sa;fix=sb;sg=-1}if(!mv){toast("Dimension is not attached to a wall");return false}
 var W=segGeo(mv),dt=G.u.x*W.n.x+G.u.y*W.n.y;if(Math.abs(dt)<0.2){toast("Wall is not across the dimension");return false}var k=sg*delta/dt,v={x:W.n.x*k,y:W.n.y*k};
 snapshot();var oa={x:m.a.x,y:m.a.y},ob={x:m.b.x,y:m.b.y};if(!moveWallRuns(mv,v,fix?wallRun(fix).ids:[],m)){UNDO.pop();render();return false}
 if(sg>0){m.a.x=oa.x;m.a.y=oa.y;m.b.x=ob.x+G.u.x*delta;m.b.y=ob.y+G.u.y*delta}else{m.b.x=ob.x;m.b.y=ob.y;m.a.x=oa.x-G.u.x*delta;m.a.y=oa.y-G.u.y*delta}
 planarize();changed();updProps();toast("Dimension "+fi(val)+" - wall moved");return true}
/* popup: feet-inches (type 10'6" or use keypad) */
function fiPopup(title,sub,cur,done,extra){var typed=false;modal('<div class="mt">'+title+'</div><div class="ms">'+sub+'</div><label class="fld">New value (e.g. 10\'6")<input id="tdV" value="'+escH(fi(cur))+'" autocomplete="off"></label>'+keypadHTML()+(extra||"")+'<div class="row"><button class="bb" id="tdX">Cancel</button><button class="bb ok" id="tdOk">OK</button></div>',function(box){
 var get=bindKeypad(box,cur),inp=$("tdV");inp.oninput=function(){typed=true};box.querySelectorAll(".kp button,#kf,#ki").forEach(function(b){b.addEventListener("click",function(){typed=false;inp.value=fi(get())})});
 $("tdX").onclick=closeModal;$("tdOk").onclick=function(){var v=typed?parseFI(inp.value):get();if(!(v>0.05)||!isFinite(v)){toast("Enter a value like 10'6\"");return}closeModal();done(v)};
 inp.onkeydown=function(e){if(e.key==="Enter")$("tdOk").click()}})}
function tempDimPopup(td){fiPopup("Clear distance","Inner face to inner face · the selected wall moves, the other wall stays",td.clear,function(v){applyTempDim(td,v)})}
function dimValuePopup(m){if(m.lock){toast("Dimension is locked - unlock it first");return}fiPopup("Edit dimension","The wall at the second end moves (first end stays). Locked dimensions keep their walls together.",dimGeom(m).L,function(v){editDimValue(m,v)},
 '<div class="row"><button class="bb" id="tdLock">Lock this dimension</button></div>');setTimeout(function(){var b=$("tdLock");if(b)b.onclick=function(){snapshot();m.lock=true;closeModal();changed();updCtx();updProps();toast("Dimension locked")}},0)}
/* drawing + hit areas */
function tdLabel(x,y,t,on){g.font="600 12px Inter,Roboto,Arial,sans-serif";var w=g.measureText(t).width+14,h=20;g.fillStyle=on?"#2563eb":"#fff";g.strokeStyle="#2563eb";g.lineWidth=1.2;rr(x-w/2,y-h/2,w,h,5);g.fill();g.stroke();g.fillStyle=on?"#fff":"#1d4ed8";g.textAlign="center";g.textBaseline="middle";g.fillText(t,x,y+0.5);return {x:x,y:y,w:w,h:h}}
function lockGlyph(x,y){g.save();g.strokeStyle="#7c3aed";g.fillStyle="#fff";g.lineWidth=1.4;rr(x-5,y-2,10,8,1.5);g.fill();g.stroke();g.beginPath();g.arc(x,y-2,3.2,Math.PI,0);g.stroke();g.restore()}
var _dsel0=drawSelCanvas;drawSelCanvas=function(){var r=_dsel0.apply(this,arguments);UI.tdHits=[];if(UI.clean)return r;
 if(visOn("dims"))S.dims.forEach(function(m){if(m.lock){var G=dimGeom(m),q=W2(G.T);lockGlyph(q.x+18,q.y-12)}});
 var L=selEls();if(UI.tool!=="sel"||L.length!==1||UI.box)return r;var e=elGet(L[0]);
 /* Stage: Inner-to-inner wall dimensions - selected wall: its clear (inner) length as a tappable value; tap -> Size editor (inner) */
 if(L[0].k==="seg"&&visOn("walls")){var I=segInner(e),A0=w2s(I.a.x,I.a.y),B0=w2s(I.b.x,I.b.y),ang=Math.atan2(B0.y-A0.y,B0.x-A0.x);if(ang>Math.PI/2+1e-6)ang-=Math.PI;if(ang<=-Math.PI/2+1e-6)ang+=Math.PI;
  var off=14+(S.meta.dbl?wallT(e)/2*V.s:0)+6,ix=(A0.x+B0.x)/2+Math.sin(ang)*off,iy=(A0.y+B0.y)/2-Math.cos(ang)*off,ib=tdLabel(ix,iy,fi(I.L),true);ib.inner=e;ib.innerV=I.L;UI.tdHits.push(ib)}
 if(L[0].k==="seg"){tempDims(e).forEach(function(td){var A=W2(td.p1),B=W2(td.p2);g.save();g.strokeStyle="#2563eb";g.lineWidth=1.2;g.setLineDash([]);g.beginPath();g.moveTo(A.x,A.y);g.lineTo(B.x,B.y);g.stroke();
  var nx=B.y-A.y,ny=A.x-B.x,l=Math.hypot(nx,ny)||1;nx/=l;ny/=l;[A,B].forEach(function(P){g.beginPath();g.moveTo(P.x-nx*6,P.y-ny*6);g.lineTo(P.x+nx*6,P.y+ny*6);g.stroke()});g.restore();
  var hb=tdLabel((A.x+B.x)/2,(A.y+B.y)/2,fi(td.clear),false);hb.td=td;UI.tdHits.push(hb)})}
 else if(L[0].k==="dim"){var G=dimGeom(e),q=W2(G.T),hb=tdLabel(q.x,q.y-14,fi(G.L),true);hb.dim=e;UI.tdHits.push(hb)}
 return r};
function tdHit(w){var H=UI.tdHits||[];if(!H.length)return null;var q=w2s(w.x,w.y);for(var i=0;i<H.length;i++){var b=H[i];if(Math.abs(q.x-b.x)<=b.w/2+6&&Math.abs(q.y-b.y)<=b.h/2+6)return b}return null}
var _tdn0=toolDown;toolDown=function(w,G){if(UI.tool==="sel"&&!UI.pick){var h=tdHit(w);if(h){G.kind="tdim";G.td=h;return true}}return _tdn0(w,G)};
var _tmv0=toolMove;toolMove=function(w,G,p){if(G.kind==="tdim")return true;return _tmv0(w,G,p)};
var _tup0=toolUp;toolUp=function(G,w){if(G.kind==="tdim"){var h=G.td;if(h.td)tempDimPopup(h.td);else if(h.dim)dimValuePopup(h.dim);else if(h.inner)sizePopup(h.inner);return true}return _tup0(G,w)};
