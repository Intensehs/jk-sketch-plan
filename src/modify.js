/* ================= v1.3 MODIFY: select, move, copy, rotate, mirror, array, align, trim/extend, split, offset, pin, delete ================= */
var EK={seg:"segs",op:"ops",furn:"furn",lab:"labels",col:"cols",beam:"beams",dim:"dims",note:"notes",spot:"spots",dline:"dlines",rail:"rails",grid:"grids",sec:"secs",stair:"stairs",kc:"kcs"};
var EKN={seg:"Wall",op:"Door / Window",furn:"Furniture",lab:"Room tag",col:"Column",beam:"Beam",dim:"Dimension",note:"Text",spot:"Spot level",dline:"Detail line",rail:"Railing",grid:"Grid",sec:"Section",stair:"Stair",kc:"Kitchen counter"};
var EKV={seg:"walls",op:"doors",furn:"furn",lab:"rooms",col:"cols",beam:"beams",dim:"dims",note:"text",spot:"text",dline:"dlines",rail:"rails",grid:"grids",sec:"secs",stair:"stairs",kc:"furn"};
function elGet(r){var A=S[EK[r.k]]||[];for(var i=0;i<A.length;i++)if(A[i].id===r.id)return A[i];return null}
function selHas(k,id){return (UI.sel||[]).some(function(r){return r.k===k&&r.id===id})}
function selEls(){return (UI.sel||[]).filter(function(r){return elGet(r)})}
function setSel(L,add){if(add){L.forEach(function(r){var i=UI.sel.findIndex(function(q){return q.k===r.k&&q.id===r.id});if(i>=0)UI.sel.splice(i,1);else UI.sel.push(r)})}else UI.sel=L.slice();UI.sel=selEls();updCtx();updProps();render()}
function clearSel(){if(UI.sel&&UI.sel.length){UI.sel=[];updCtx();updProps();render()}}
/* ---------- hit testing ---------- */
function d2seg(w,a,b){return projSeg(w.x,w.y,a,b).d}
/* Stage: Modify - Select tool: what is under the pointer */
function hitList(w,R){var out=[];function add(k,id,d,pri){if(d<=R)out.push({k:k,id:id,d:d-pri*R*0.3})}
 if(visOn("doors"))S.ops.forEach(function(o){var G=opWorld(o);if(G)add("op",o.id,d2seg(w,G.p0,G.p1),2)});
 if(visOn("cols"))S.cols.forEach(function(c){add("col",c.id,inPoly(w.x,w.y,colPoly(c))?0:Math.hypot(c.x-w.x,c.y-w.y)-Math.max(c.w,c.d)/24,2)});
 if(visOn("text"))S.notes.forEach(function(n){var b=noteBox(n);add("note",n.id,(w.x>=b[0]&&w.x<=b[2]&&w.y>=b[1]&&w.y<=b[3])?0:R*2,2)});
 if(visOn("text"))S.spots.forEach(function(s){add("spot",s.id,Math.hypot(s.x-w.x,s.y-w.y),2)});
 if(visOn("furn"))S.furn.forEach(function(f){var D=fdims(f),a=-(f.rot||0)*Math.PI/180,dx=w.x-f.x,dy=w.y-f.y,lx=dx*Math.cos(a)-dy*Math.sin(a),ly=dx*Math.sin(a)+dy*Math.cos(a);if(Math.abs(lx)<=D.w/2&&Math.abs(ly)<=D.d/2)add("furn",f.id,0.0,1)});
 if(visOn("rooms"))S.labels.forEach(function(l){add("lab",l.id,Math.hypot(l.x-w.x,l.y-w.y)*0.7,1)});
 if(visOn("dims"))S.dims.forEach(function(m){var G=dimGeom(m);add("dim",m.id,Math.min(d2seg(w,G.A,G.B),Math.hypot(G.T.x-w.x,G.T.y-w.y)),1)});
 if(visOn("beams"))S.beams.forEach(function(m){add("beam",m.id,d2seg(w,m.a,m.b),0)});
 if(visOn("rails"))S.rails.forEach(function(m){add("rail",m.id,d2seg(w,m.a,m.b),0.5)});
 if(visOn("dlines"))S.dlines.forEach(function(m){add("dline",m.id,d2seg(w,m.a,m.b),0.5)});
 if(visOn("grids"))S.grids.forEach(function(m){var G=gridGeom(m);add("grid",m.id,Math.min(d2seg(w,G.a,G.b),Math.hypot(G.ba.x-w.x,G.ba.y-w.y)-G.r,Math.hypot(G.bb.x-w.x,G.bb.y-w.y)-G.r),0)});
 if(visOn("secs"))S.secs.forEach(function(m){add("sec",m.id,d2seg(w,m.a,m.b),0.5)});
 if(visOn("furn"))(S.kcs||[]).forEach(function(c){var d=kcHitD(c,w);add("kc",c.id,d===0?R*0.3:d,d===0?1:0.5)});
 if(visOn("stairs"))(S.stairs||[]).forEach(function(st){var d=stairHitD(st,w);add("stair",st.id,d===0?R*0.25:d,d===0?1:0.5)});
 if(visOn("walls"))S.segs.forEach(function(s){var q=projSeg(w.x,w.y,pt(s.a),pt(s.b));add("seg",s.id,Math.max(0,q.d-(S.meta.dbl?wallT(s)/2:0)),0)});
 out.sort(function(a,b){return a.d-b.d});return out}
function hitOne(w){var L=hitList(w,snapR()*1.4);return L.length?{k:L[0].k,id:L[0].id}:null}
function elPts(r){var e=elGet(r);if(!e)return [];if(r.k==="seg")return [pt(e.a),pt(e.b)];if(r.k==="op"){var G=opWorld(e);return G?[G.p0,G.p1]:[]}
 if(r.k==="furn"){var X=fXform(e),D=fdims(e);return [X(-D.w/2,-D.d/2),X(D.w/2,-D.d/2),X(D.w/2,D.d/2),X(-D.w/2,D.d/2)]}if(r.k==="col")return colPoly(e);if(r.k==="stair")return stairPts(e);if(r.k==="kc")return kcPoly(e);if(r.k==="note"){var b=noteBox(e);return [{x:b[0],y:b[1]},{x:b[2],y:b[3]}]}
 if(e.a&&e.b&&e.a.x!=null)return [e.a,e.b];return [{x:e.x,y:e.y}]}
function elBox(r){var P=elPts(r);if(!P.length)return null;var b=[Infinity,Infinity,-Infinity,-Infinity];P.forEach(function(p){b[0]=Math.min(b[0],p.x);b[1]=Math.min(b[1],p.y);b[2]=Math.max(b[2],p.x);b[3]=Math.max(b[3],p.y)});return b}
function allRefs(){var out=[];Object.keys(EK).forEach(function(k){if(!visOn(EKV[k]))return;(S[EK[k]]||[]).forEach(function(e){out.push({k:k,id:e.id})})});return out}
/* window (left→right: fully inside) / crossing (right→left: touching) like Revit */
/* Stage: Modify - Select tool: box select (L->R window, R->L crossing) */
function boxSelect(a,b,add){var x0=Math.min(a.x,b.x),x1=Math.max(a.x,b.x),y0=Math.min(a.y,b.y),y1=Math.max(a.y,b.y),cross=b.x<a.x,L=[];
 allRefs().forEach(function(r){var P=elPts(r);if(!P.length)return;var inside=P.every(function(p){return p.x>=x0&&p.x<=x1&&p.y>=y0&&p.y<=y1});
  var touch=inside||P.some(function(p){return p.x>=x0&&p.x<=x1&&p.y>=y0&&p.y<=y1})||(P.length>=2&&segBoxHit(P[0],P[1],x0,y0,x1,y1));if(cross?touch:inside)L.push(r)});
 if(add){L.forEach(function(r){if(!selHas(r.k,r.id))UI.sel.push(r)});setSel(UI.sel)}else setSel(L);toast(UI.sel.length+" selected"+(cross?" (crossing)":" (window)"))}
function segBoxHit(a,b,x0,y0,x1,y1){var E=[[{x:x0,y:y0},{x:x1,y:y0}],[{x:x1,y:y0},{x:x1,y:y1}],[{x:x1,y:y1},{x:x0,y:y1}],[{x:x0,y:y1},{x:x0,y:y0}]],L=Math.hypot(b.x-a.x,b.y-a.y);if(L<1e-9)return false;var u={x:(b.x-a.x)/L,y:(b.y-a.y)/L};
 return E.some(function(e){var I=segIntersect(a,u,e[0],e[1]);return I&&I.r>=0&&I.r<=L&&I.t>=0&&I.t<=1})}
/* ---------- transforms ---------- */
function isPinned(r){var e=elGet(r);return e&&e.pin}
function movable(){var L=selEls(),pin=L.filter(isPinned);if(pin.length)toast(pin.length+" pinned item"+(pin.length>1?"s":"")+" not changed (unpin first)");return L.filter(function(r){return !isPinned(r)})}
function selCenter(L){var b=[Infinity,Infinity,-Infinity,-Infinity];(L||selEls()).forEach(function(r){var q=elBox(r);if(!q)return;b[0]=Math.min(b[0],q[0]);b[1]=Math.min(b[1],q[1]);b[2]=Math.max(b[2],q[2]);b[3]=Math.max(b[3],q[3])});return isFinite(b[0])?{x:(b[0]+b[2])/2,y:(b[1]+b[3])/2,b:b}:null}
/* f: point→point ; ang: rotation added (deg) ; mir: mirror line angle (deg) or null */
function xfRefs(L,f,ang,mir){var seen=new Set(),segMoved={};
 var opsC=L.filter(function(r){return r.k==="op"}).map(function(r){var o=elGet(r),G=opWorld(o);return {o:o,c:G?G.c:null}});
 var selSegs={};L.forEach(function(r){if(r.k==="seg")selSegs[r.id]=1});
 function mv(p){if(!p||seen.has(p))return;seen.add(p);var q=f(p);p.x=Math.round(q.x*1200)/1200;p.y=Math.round(q.y*1200)/1200}
 L.forEach(function(r){var e=elGet(r);if(!e||r.k==="op")return;
  if(r.k==="seg"){mv(pt(e.a));mv(pt(e.b));segMoved[e.id]=1;return}
  if(r.k==="stair"){e.pts.forEach(mv);if(e.fit){delete e.fit;delete e.lab}return}
  if(r.k==="kc"){e.pts.forEach(mv);if(mir!=null)e.side=-(e.side||1);return}
  if(e.a&&e.b&&e.a.x!=null){mv(e.a);mv(e.b);if(mir!=null&&r.k==="dim")e.off=-(e.off||0);return}
  mv(e);if(r.k==="furn"){if(mir!=null){e.rot=((2*mir-(e.rot||0)+180)%360+360)%360;e.rot=Math.round(e.rot*1e6)/1e6%360;if(e.fx)delete e.fx;else e.fx=true}else if(ang)e.rot=(((e.rot||0)+ang)%360+360)%360}
  if(r.k==="col"){if(mir!=null)e.rot=((2*mir-(e.rot||0))%360+360)%360;else if(ang)e.rot=(((e.rot||0)+ang)%360+360)%360}});
 if(mir!=null)S.ops.forEach(function(o){if(segMoved[o.seg])o.flip=!o.flip});
 opsC.forEach(function(q){if(!q.c||selSegs[q.o.seg])return;var c=f(q.c),s=segById(q.o.seg);if(!s)return;var P=projSeg(c.x,c.y,pt(s.a),pt(s.b));q.o.t=clamp(P.t,0,1)});
 planarize()}
/* copy: duplicates, returns new refs */
function dupRefs(L){var pm={},sm={},out=[];function np(id){if(pm[id])return pm[id];var p=pt(id),n=nid();S.pts.push({id:n,x:p.x,y:p.y});pm[id]=n;return n}
 L.forEach(function(r){var e=elGet(r);if(!e||r.k==="op")return;var c=JSON.parse(JSON.stringify(e));c.id=nid();delete c.pin;if(r.k==="stair"){delete c.lab;delete c.fit}
  if(r.k==="seg"){c.a=np(e.a);c.b=np(e.b);sm[e.id]=c.id}if(r.k==="grid")c.name=nextGridName(c);S[EK[r.k]].push(c);out.push({k:r.k,id:c.id})});
 L.forEach(function(r){if(r.k!=="op")return;var o=elGet(r);if(!o)return;var c=JSON.parse(JSON.stringify(o));c.id=nid();if(sm[o.seg])c.seg=sm[o.seg];S.ops.push(c);out.push({k:"op",id:c.id})});
 S.ops.forEach(function(o){if(sm[o.seg]&&!L.some(function(r){return r.k==="op"&&r.id===o.id})){var c=JSON.parse(JSON.stringify(o));c.id=nid();c.seg=sm[o.seg];S.ops.push(c);out.push({k:"op",id:c.id})}});
 return out}
function rotP(c,deg){var a=deg*Math.PI/180,cs=Math.cos(a),sn=Math.sin(a);return function(p){var dx=p.x-c.x,dy=p.y-c.y;return {x:c.x+dx*cs-dy*sn,y:c.y+dx*sn+dy*cs}}}
function mirP(a,deg){var t=deg*Math.PI/180,ux=Math.cos(t),uy=Math.sin(t);return function(p){var dx=p.x-a.x,dy=p.y-a.y,pr=dx*ux+dy*uy;return {x:a.x+2*pr*ux-dx,y:a.y+2*pr*uy-dy}}}
/* Stage: Modify - Move / Copy tool */
function doMove(dx,dy,copy){var L=movable();if(!L.length){toast("Select something first");return}snapshot();if(copy)L=dupRefs(L);xfRefs(L,function(p){return {x:p.x+dx,y:p.y+dy}});if(copy)UI.sel=L;changed();updProps();toast((copy?"Copied ":"Moved ")+fi(Math.hypot(dx,dy)))}
/* Stage: Modify - Rotate tool */
function doRotate(deg,copy,c){var L=movable();if(!L.length){toast("Select something first");return}c=c||selCenter(L);snapshot();if(copy)L=dupRefs(L);xfRefs(L,rotP(c,deg),deg);if(copy)UI.sel=L;changed();updProps();toast("Rotated "+deg+"°")}
/* Stage: Modify - Mirror tool */
function doMirror(a,deg,copy){var L=movable();if(!L.length){toast("Select something first");return}snapshot();if(copy)L=dupRefs(L);xfRefs(L,mirP(a,deg),0,deg);if(copy)UI.sel=L;changed();updProps();toast("Mirrored"+(copy?" (copy)":""))}
/* Stage: Modify - Array tool */
function doArray(n,dx,dy){var L=movable();if(!L.length||n<2){toast("Select something first");return}snapshot();var all=L.slice();for(var i=1;i<n;i++){var c=dupRefs(L);(function(k){xfRefs(c,function(p){return {x:p.x+dx*k,y:p.y+dy*k}})})(i);all=all.concat(c)}UI.sel=all;changed();updProps();toast(n+" copies in a row")}
/* Stage: Modify - Delete tool */
function doDelete(){var L=movable();if(!L.length)return;snapshot();var segs={};L.forEach(function(r){if(r.k==="seg")segs[r.id]=1});
 L.forEach(function(r){var k=EK[r.k];S[k]=S[k].filter(function(e){return e.id!==r.id})});Object.keys(segs).forEach(function(id){dropOps(+id)});cleanup();UI.sel=[];changed();updCtx();updProps();toast(L.length+" deleted")}
/* Stage: Modify - Pin tool */
function doPin(){var L=selEls();if(!L.length)return;var on=!L.every(isPinned);snapshot();L.forEach(function(r){var e=elGet(r);if(on)e.pin=true;else delete e.pin});changed();updProps();updCtx();toast(on?"Pinned (cannot move / delete)":"Unpinned")}
/* ---------- popups ---------- */
function dirDist(title,cb,opt){opt=opt||{};var st={d:opt.dir||"r"};modal('<div class="mt">'+title+'</div><div class="ms">Direction and distance (feet + inches). Or drag the selection on the drawing.</div><div class="grid2" style="grid-template-columns:repeat(4,1fr)">'+
 [["r","→ Right"],["l","← Left"],["u","↑ Up"],["d","↓ Down"]].map(function(t){return '<button class="bb" data-dd="'+t[0]+'">'+t[1]+'</button>'}).join("")+'</div>'+(opt.count?'<label class="fld">Number of items (incl. original)<input id="arN" type="number" value="'+(opt.count||3)+'"></label>':'')+keypadHTML()+
 '<div class="row"><button class="bb" id="ddX">Cancel</button><button class="bb ok" id="ddOk">OK</button></div>',function(box){var get=bindKeypad(box,opt.L||5);
 function up(){box.querySelectorAll("[data-dd]").forEach(function(b){b.classList.toggle("on",b.dataset.dd===st.d)})}box.querySelectorAll("[data-dd]").forEach(function(b){b.onclick=function(){st.d=b.dataset.dd;up()}});up();
 $("ddX").onclick=closeModal;$("ddOk").onclick=function(){var v=get(),n=opt.count?parseInt($("arN").value,10):0;var D={r:[1,0],l:[-1,0],u:[0,-1],d:[0,1]}[st.d];closeModal();cb(D[0]*v,D[1]*v,n)}})}
function rotatePopup(){var st={copy:false};modal('<div class="mt">Rotate</div><div class="ms">About the centre of the selection</div><div class="grid2" style="grid-template-columns:repeat(4,1fr)">'+
 [90,-90,180,45,-45,30,-30,15].map(function(a){return '<button class="bb" data-ra="'+a+'">'+(a>0?"⟳ ":"⟲ ")+Math.abs(a)+'°</button>'}).join("")+'</div><label class="fld">Custom angle (° clockwise)<input id="raC" type="number" value="90"></label>'+
 '<div class="row"><button class="bb" id="raCp">Keep original (copy): OFF</button></div><div class="row"><button class="bb" id="raX">Cancel</button><button class="bb ok" id="raOk">Rotate custom</button></div>',function(box){
 $("raCp").onclick=function(){st.copy=!st.copy;this.textContent="Keep original (copy): "+(st.copy?"ON":"OFF");this.classList.toggle("on",st.copy)};
 box.querySelectorAll("[data-ra]").forEach(function(b){b.onclick=function(){closeModal();doRotate(+b.dataset.ra,st.copy)}});$("raX").onclick=closeModal;$("raOk").onclick=function(){var a=+$("raC").value;closeModal();if(a)doRotate(a,st.copy)}})}
function mirrorPopup(){var st={copy:true};var c=selCenter();if(!c){toast("Select something first");return}
 modal('<div class="mt">Mirror</div><div class="ms">Mirror axis through the selection edge or centre, or pick an axis line (2 taps)</div><div class="grid2">'+
 '<button class="bb" data-mx="R">Copy to the RIGHT<small>axis = right edge</small></button><button class="bb" data-mx="L">Copy to the LEFT<small>axis = left edge</small></button><button class="bb" data-mx="D">Copy DOWN<small>axis = bottom edge</small></button><button class="bb" data-mx="U">Copy UP<small>axis = top edge</small></button><button class="bb" data-mx="V">Flip left-right<small>in place, about centre</small></button><button class="bb" data-mx="H">Flip up-down<small>in place, about centre</small></button></div>'+
 '<div class="row"><button class="bb" id="mxPick">Pick axis (tap 2 points)</button><button class="bb on" id="mxCp">Keep original: ON</button></div><div class="row"><button class="bb" id="mxX">Cancel</button></div>',function(box){
 $("mxCp").onclick=function(){st.copy=!st.copy;this.textContent="Keep original: "+(st.copy?"ON":"OFF");this.classList.toggle("on",st.copy)};$("mxX").onclick=closeModal;
 box.querySelectorAll("[data-mx]").forEach(function(b){b.onclick=function(){var k=b.dataset.mx,B=c.b;closeModal();
  if(k==="R")doMirror({x:B[2],y:0},90,st.copy);else if(k==="L")doMirror({x:B[0],y:0},90,st.copy);else if(k==="D")doMirror({x:0,y:B[3]},0,st.copy);else if(k==="U")doMirror({x:0,y:B[1]},0,st.copy);else if(k==="V")doMirror(c,90,false);else doMirror(c,0,false)}});
 $("mxPick").onclick=function(){closeModal();UI.pick={k:"mirror",copy:st.copy,pts:[]};updCtx();toast("Tap first point of the mirror axis")}})}
function arrayPopup(){if(!selEls().length){toast("Select something first");return}dirDist("Array (linear)",function(dx,dy,n){if(!(n>=2&&n<=50)){toast("Count 2 to 50");return}doArray(n,dx,dy)},{count:3,L:5})}
function filterPopup(){var L=selEls(),cnt={};L.forEach(function(r){cnt[r.k]=(cnt[r.k]||0)+1});var keys=Object.keys(cnt);if(!keys.length){toast("Nothing selected");return}var on={};keys.forEach(function(k){on[k]=true});
 modal('<div class="mt">Filter selection</div><div class="grid2">'+keys.map(function(k){return '<button class="bb on" data-fk="'+k+'">'+EKN[k]+'<small>'+cnt[k]+'</small></button>'}).join("")+'</div><div class="row"><button class="bb" id="fiX">Cancel</button><button class="bb ok" id="fiOk">OK</button></div>',function(box){
 box.querySelectorAll("[data-fk]").forEach(function(b){b.onclick=function(){on[b.dataset.fk]=!on[b.dataset.fk];b.classList.toggle("on",on[b.dataset.fk])}});$("fiX").onclick=closeModal;
 $("fiOk").onclick=function(){closeModal();setSel(L.filter(function(r){return on[r.k]}))}})}
/* ---------- align / trim / split / offset ---------- */
function lineOf(r){var e=elGet(r);if(!e)return null;if(r.k==="seg")return [pt(e.a),pt(e.b)];if(e.a&&e.b&&e.a.x!=null)return [e.a,e.b];return null}
/* Stage: Modify - Align tool */
function alignTap(w){var h=hitOne(w);if(!h){toast("Tap a wall, grid or line");return}
 if(!UI.pick||UI.pick.k!=="align"){var L=lineOf(h);if(!L){toast("First tap a straight reference (wall, grid, line)");return}var A=L[0],B=L[1],Ln=Math.hypot(B.x-A.x,B.y-A.y),u={x:(B.x-A.x)/Ln,y:(B.y-A.y)/Ln};
  var n={x:-u.y,y:u.x},ref=projSeg(w.x,w.y,A,B);var off=0;if(h.k==="seg"&&S.meta.dbl){var t=wallT(elGet(h))/2,sd=((w.x-ref.x)*n.x+(w.y-ref.y)*n.y)>=0?1:-1;if(ref.d>t*0.45)off=t*sd}
  UI.pick={k:"align",A:{x:A.x+n.x*off,y:A.y+n.y*off},u:u,n:n,face:off!==0,ref:h};updCtx();render();toast("Reference set"+(off?" (wall face)":"")+" - now tap the wall / item to align");return}
 var P=UI.pick,e=elGet(h);if(!e)return;if(isPinned(h)){toast("Pinned - unpin first");return}
 var d;if(h.k==="seg"){var a=pt(e.a),b=pt(e.b),L2=segLen(e),u2={x:(b.x-a.x)/L2,y:(b.y-a.y)/L2};if(Math.abs(u2.x*P.u.y-u2.y*P.u.x)>0.02){toast("Not parallel to the reference");return}
  var q=projSeg(w.x,w.y,a,b),t2=S.meta.dbl?wallT(e)/2:0,sd2=((w.x-q.x)*P.n.x+(w.y-q.y)*P.n.y)>=0?1:-1,face=P.face&&q.d>t2*0.45?t2*sd2:0;d=((P.A.x-a.x)*P.n.x+(P.A.y-a.y)*P.n.y)-face;
  snapshot();[a,b].forEach(function(p){p.x+=P.n.x*d;p.y+=P.n.y*d})}
 else{var c=elPts(h),cx=0,cy=0;c.forEach(function(p){cx+=p.x;cy+=p.y});cx/=c.length;cy/=c.length;d=(P.A.x-cx)*P.n.x+(P.A.y-cy)*P.n.y;snapshot();xfRefs([h],function(p){return {x:p.x+P.n.x*d,y:p.y+P.n.y*d}})}
 planarize();changed();toast("Aligned (moved "+fi(Math.abs(d))+")")}
/* Stage: Modify - Trim/Extend tool */
function trimTap(w){var n=nearSeg(w.x,w.y,snapR()*1.4);if(!n){toast("Tap a wall");return}
 if(!UI.pick||UI.pick.k!=="trim"){UI.pick={k:"trim",s:n.s.id,w:{x:w.x,y:w.y}};UI.selSeg=wallRun(n.s).ids;updCtx();render();toast(UI.trimMode==="one"?"Now tap the boundary wall":"Now tap the second wall (side to keep)");return}
 var P=UI.pick;UI.pick=null;UI.selSeg=null;var s1=segById(P.s),s2=n.s;if(!s1||s1===s2){updCtx();render();return}
 var r1=wallRun(s1),r2=wallRun(s2),A1=pt(r1.a),B1=pt(r1.b),A2=pt(r2.a),B2=pt(r2.b),L1=r1.len,u1={x:(B1.x-A1.x)/L1,y:(B1.y-A1.y)/L1},I=segIntersect(A1,u1,A2,B2);
 if(!I){toast("Walls are parallel");updCtx();return}var X={x:A1.x+u1.x*I.r,y:A1.y+u1.y*I.r};snapshot();
 function fix(run,tap){var A=pt(run.a),B=pt(run.b),L=run.len,u={x:(B.x-A.x)/L,y:(B.y-A.y)/L},tI=(X.x-A.x)*u.x+(X.y-A.y)*u.y,tT=(tap.x-A.x)*u.x+(tap.y-A.y)*u.y;
  if(tI>0.02&&tI<L-0.02){var pid=ensurePoint({x:X.x,y:X.y});planarize();var kill=[];S.segs.forEach(function(s){var a=pt(s.a),b=pt(s.b);if(!a||!b)return;var m={x:(a.x+b.x)/2,y:(a.y+b.y)/2},q=projSeg(m.x,m.y,A,B);if(q.d>0.02)return;var tm=(m.x-A.x)*u.x+(m.y-A.y)*u.y;
    if(Math.abs((b.x-a.x)*u.y-(b.y-a.y)*u.x)>0.01*Math.hypot(b.x-a.x,b.y-a.y))return;if(tm>-0.01&&tm<L+0.01&&(tm-tI)*(tT-tI)<0)kill.push(s)});kill.forEach(function(s){dropOps(s.id)});S.segs=S.segs.filter(function(s){return kill.indexOf(s)<0});return}
  var end=tI>=L-0.02?run.b:run.a,E=pt(end),deg=S.segs.filter(function(s){return s.a===end||s.b===end}).length;if(Math.hypot(E.x-X.x,E.y-X.y)<0.01)return;
  if(deg<=1){E.x=X.x;E.y=X.y}else{var id=nid();S.pts.push({id:id,x:X.x,y:X.y});addSeg(end,id,segById(run.ids[0]).k)}}
 fix(r1,P.w);if(UI.trimMode!=="one")fix(r2,w);
 planarize();cleanup();changed();updCtx();toast(UI.trimMode==="one"?"Extended / trimmed to boundary":"Corner made")}
/* Stage: Modify - Split tool */
function splitTap(w){var sg=findSeg(w.x,w.y,snapR()*1.4);if(!sg){toast("Tap on a wall (not at a corner)");return}var s=segById(sg.seg);snapshot();var id=nid();S.pts.push({id:id,x:sg.x,y:sg.y});splitSeg(s,id);planarize();changed();
 toast("Wall split at "+fi(Math.hypot(sg.x-pt(s.a).x,sg.y-pt(s.a).y)));UI.flash={x:sg.x,y:sg.y,t:Date.now()};render()}
/* Stage: Modify - Offset tool */
function offsetTap(w){var n=nearSeg(w.x,w.y,Math.max(snapR()*2,(UI.offD||3)+1));if(!n){toast("Tap near a wall, on the side to copy to");return}var run=UI.offRun?wallRun(n.s):{a:n.s.a,b:n.s.b},A=pt(run.a),B=pt(run.b),L=Math.hypot(B.x-A.x,B.y-A.y),u={x:(B.x-A.x)/L,y:(B.y-A.y)/L},nn={x:-u.y,y:u.x};
 var sd=((w.x-A.x)*nn.x+(w.y-A.y)*nn.y)>=0?1:-1,D=(UI.offD||3)*sd;snapshot();var a=ensurePoint({x:A.x+nn.x*D,y:A.y+nn.y*D}),b=ensurePoint({x:B.x+nn.x*D,y:B.y+nn.y*D}),s=addSeg(a,b,n.s.k);if(s&&n.s.th)s.th=n.s.th;planarize();changed();toast("Offset copy at "+fi(Math.abs(D)))}
function offsetDistPopup(){modal('<div class="mt">Offset distance</div><div class="ms">Distance between the wall centre lines</div>'+keypadHTML()+'<div class="row"><button class="bb" id="ofX">Cancel</button><button class="bb ok" id="ofOk">OK</button></div>',function(box){var get=bindKeypad(box,UI.offD||3);$("ofX").onclick=closeModal;$("ofOk").onclick=function(){var v=get();if(v>0.1)UI.offD=v;closeModal();updCtx()}})}
/* ---------- selection drawing ---------- */
function drawSelCanvas(){var L=selEls();g.save();
 L.forEach(function(r){var e=elGet(r),P;g.strokeStyle=e.pin?"#7c3aed":"#0ea5e9";g.lineWidth=3;g.setLineDash([]);
  if(r.k==="seg"&&S.meta.dbl){P=wallPoly(e)}else if(r.k==="furn"||r.k==="col")P=elPts(r);
  if(r.k==="stair")stairSelDraw(e);else if(r.k==="kc")kcSelDraw(e);else if(P){g.beginPath();P.forEach(function(p,i){var q=w2s(p.x,p.y);i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y)});g.closePath();g.fillStyle="rgba(14,165,233,.28)";g.fill();g.stroke()}
  else{var Q=elPts(r);if(Q.length>=2){var a=w2s(Q[0].x,Q[0].y),b=w2s(Q[1].x,Q[1].y);if(r.k==="note"){g.strokeRect(a.x-3,a.y-3,b.x-a.x+6,b.y-a.y+6)}else{g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.lineWidth=7;g.globalAlpha=0.45;g.stroke();g.globalAlpha=1}}
   else if(Q.length){var q=w2s(Q[0].x,Q[0].y);g.beginPath();g.arc(q.x,q.y,16,0,7);g.stroke()}}
  if(e.pin){var c=elPts(r)[0],qq=w2s(c.x,c.y);pill(qq.x+10,qq.y-12,"PIN","#7c3aed","#fff",10)}});
 if(UI.box){var A=w2s(UI.box.a.x,UI.box.a.y),B=w2s(UI.box.b.x,UI.box.b.y),cr=UI.box.b.x<UI.box.a.x;g.strokeStyle=cr?"#16a34a":"#0ea5e9";g.lineWidth=1.5;g.setLineDash(cr?[7,5]:[]);g.fillStyle=cr?"rgba(22,163,74,.08)":"rgba(14,165,233,.08)";g.fillRect(A.x,A.y,B.x-A.x,B.y-A.y);g.strokeRect(A.x,A.y,B.x-A.x,B.y-A.y);g.setLineDash([])}
 if(UI.pick&&UI.pick.k==="align"){var a2=w2s(UI.pick.A.x-UI.pick.u.x*500,UI.pick.A.y-UI.pick.u.y*500),b2=w2s(UI.pick.A.x+UI.pick.u.x*500,UI.pick.A.y+UI.pick.u.y*500);g.beginPath();g.moveTo(a2.x,a2.y);g.lineTo(b2.x,b2.y);g.strokeStyle="#e11d48";g.lineWidth=1.5;g.setLineDash([10,6]);g.stroke();g.setLineDash([])}
 if(UI.pick&&UI.pick.pts)UI.pick.pts.forEach(function(p){var q=w2s(p.x,p.y);g.beginPath();g.arc(q.x,q.y,8,0,7);g.strokeStyle="#e11d48";g.lineWidth=2.5;g.stroke()});
 if(UI.flash&&Date.now()-UI.flash.t<1500){var f=w2s(UI.flash.x,UI.flash.y);g.beginPath();g.arc(f.x,f.y,11,0,7);g.strokeStyle="#e11d48";g.lineWidth=3;g.stroke()}
 g.restore()}
