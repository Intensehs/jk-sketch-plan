/* ================= v1.3 ANNOTATE + pointer hooks for the new tools ================= */
function visOn(c){var v=S&&S.meta&&S.meta.vis;return !(v&&v[c]===false)}
function gridGeom(m){var L=Math.hypot(m.b.x-m.a.x,m.b.y-m.a.y)||1,u={x:(m.b.x-m.a.x)/L,y:(m.b.y-m.a.y)/L},r=15/V.s;return {u:u,r:r,a:m.a,b:m.b,ba:{x:m.a.x-u.x*r,y:m.a.y-u.y*r},bb:{x:m.b.x+u.x*r,y:m.b.y+u.y*r}}}
function gridVert(m){return Math.abs(m.b.y-m.a.y)>=Math.abs(m.b.x-m.a.x)}
function letterN(n){var s="";n++;while(n>0){var r=(n-1)%26;s=String.fromCharCode(65+r)+s;n=Math.floor((n-1)/26)}return s}
function letterI(s){var n=0;for(var i=0;i<s.length;i++)n=n*26+(s.charCodeAt(i)-64);return n-1}
function nextGridName(m){var v=gridVert(m),mx=-1;S.grids.forEach(function(q){if(q===m)return;if(v&&/^\d+$/.test(q.name))mx=Math.max(mx,+q.name-1);if(!v&&/^[A-Z]+$/.test(q.name))mx=Math.max(mx,letterI(q.name))});return v?String(mx+2):letterN(mx+1)}
/* Stage: Datum - Grid tool (auto grids) */
function autoGrids(){if(!S.segs.length){toast("Draw walls first");return}var xs=[],ys=[],done={},x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;S.pts.forEach(function(p){x0=Math.min(x0,p.x);y0=Math.min(y0,p.y);x1=Math.max(x1,p.x);y1=Math.max(y1,p.y)});
 S.segs.forEach(function(s){var r=wallRun(s),k=r.ids.slice().sort().join(",");if(done[k])return;done[k]=1;var a=pt(r.a),b=pt(r.b);
  if(Math.abs(a.x-b.x)<1e-6&&r.len>=Math.max(3,(y1-y0)*0.25))xs.push(a.x);else if(Math.abs(a.y-b.y)<1e-6&&r.len>=Math.max(3,(x1-x0)*0.25))ys.push(a.y)});
 function uniq(A){A.sort(function(a,b){return a-b});var o=[];A.forEach(function(v){if(!o.length||v-o[o.length-1]>0.6)o.push(v)});return o}xs=uniq(xs);ys=uniq(ys);
 if(S.grids.length&&!confirm("Replace the existing "+S.grids.length+" grids?"))return;snapshot();S.grids=[];var e=4;
 xs.forEach(function(x,i){S.grids.push({id:nid(),a:{x:x,y:y0-e},b:{x:x,y:y1+e},name:String(i+1)})});ys.forEach(function(y,i){S.grids.push({id:nid(),a:{x:x0-e,y:y},b:{x:x1+e,y:y},name:letterN(i)})});
 changed();toast(xs.length+" + "+ys.length+" grids (1,2,3 / A,B,C) from the walls")}
/* Stage: Annotate - Aligned dimension tool */
function dimGeom(m){var L=Math.hypot(m.b.x-m.a.x,m.b.y-m.a.y)||1,u={x:(m.b.x-m.a.x)/L,y:(m.b.y-m.a.y)/L},n={x:-u.y,y:u.x},o=m.off||0;var A={x:m.a.x+n.x*o,y:m.a.y+n.y*o},B={x:m.b.x+n.x*o,y:m.b.y+n.y*o};return {u:u,n:n,A:A,B:B,L:L,T:{x:(A.x+B.x)/2,y:(A.y+B.y)/2}}}
function noteH(n){return n.h||0.6}
function noteBox(n){var h=noteH(n),lines=String(n.t||"").split("\n"),w=Math.max.apply(null,lines.map(function(l){return l.length}))*h*0.58;return [n.x,n.y-h,n.x+Math.max(w,h),n.y-h+lines.length*h*1.25]}
function spotZ(s){return s.z!=null?s.z:lvElev(S.cur)}
/* ---------- canvas drawing ---------- */
function W2(p){return w2s(p.x,p.y)}
function cline(a,b,col,lw,dash){var A=W2(a),B=W2(b);g.beginPath();g.moveTo(A.x,A.y);g.lineTo(B.x,B.y);g.strokeStyle=col;g.lineWidth=lw;g.setLineDash(dash||[]);g.stroke();g.setLineDash([])}
function drawStructCanvas(){
 if(visOn("beams"))S.beams.forEach(function(m){var P=beamPoly(m);g.beginPath();P.forEach(function(p,i){var q=W2(p);i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y)});g.closePath();g.strokeStyle="#9a3412";g.lineWidth=1.6;g.setLineDash([8,5]);g.stroke();g.setLineDash([]);
  var c=W2({x:(m.a.x+m.b.x)/2,y:(m.a.y+m.b.y)/2});if(Math.hypot(m.b.x-m.a.x,m.b.y-m.a.y)*V.s>70)pill(c.x,c.y-12,"B "+(typeof beamSzLabel==="function"?beamSzLabel(m):m.w+"x"+m.d),"rgba(154,52,18,.85)","#fff",11)});
 if(visOn("rails"))S.rails.forEach(function(m){var L=Math.hypot(m.b.x-m.a.x,m.b.y-m.a.y);if(L<0.01)return;var u={x:(m.b.x-m.a.x)/L,y:(m.b.y-m.a.y)/L},n={x:-u.y*0.12,y:u.x*0.12};
  cline({x:m.a.x+n.x,y:m.a.y+n.y},{x:m.b.x+n.x,y:m.b.y+n.y},"#0f766e",1.6);cline({x:m.a.x-n.x,y:m.a.y-n.y},{x:m.b.x-n.x,y:m.b.y-n.y},"#0f766e",1.6);
  for(var t=0;t<=L+1e-6;t+=Math.max(L/Math.ceil(L/4),0.5)){var q=W2({x:m.a.x+u.x*t,y:m.a.y+u.y*t});g.fillStyle="#0f766e";g.fillRect(q.x-3,q.y-3,6,6)}});
 if(visOn("cols")){if(typeof colsFromBelow==="function")colsFromBelow(S.cur).forEach(function(gh){drawColGhost(gh.c,gh.from)});
  S.cols.forEach(function(c){var P=colPoly(c);g.beginPath();P.forEach(function(p,i){var q=W2(p);i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y)});g.closePath();g.fillStyle="#1f2937";g.fill();g.strokeStyle="#000";g.lineWidth=1.2;g.stroke();
  if(V.s>14){var a=W2(P[0]),b=W2(P[2]);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);var a2=W2(P[1]),b2=W2(P[3]);g.moveTo(a2.x,a2.y);g.lineTo(b2.x,b2.y);g.strokeStyle="rgba(255,255,255,.45)";g.lineWidth=1;g.stroke()}})}}
function drawAnnoCanvas(){g.save();g.textAlign="center";g.textBaseline="middle";
 if(visOn("grids"))S.grids.forEach(function(m){var G=gridGeom(m);cline(m.a,m.b,"#64748b",1.2,[16,4,3,4]);[G.ba,G.bb].forEach(function(c){var q=W2(c);g.beginPath();g.arc(q.x,q.y,15,0,7);g.fillStyle="#fff";g.fill();g.strokeStyle="#334155";g.lineWidth=1.6;g.stroke();g.fillStyle="#0f172a";g.font="bold 14px Roboto,Arial";g.fillText(m.name,q.x,q.y+0.5)})});
 if(visOn("dlines"))S.dlines.forEach(function(m){cline(m.a,m.b,"#374151",1.4,m.st==="dash"?[7,5]:null)});
 if(visOn("dims"))S.dims.forEach(function(m){drawDimC(m,"#1d4ed8")});
 if(visOn("text"))S.notes.forEach(function(n){var h=noteH(n),fs=Math.max(11,h*V.s),q=W2({x:n.x,y:n.y});g.textAlign="left";g.textBaseline="alphabetic";g.font=(n.b?"bold ":"600 ")+fs+"px Roboto,Arial";g.fillStyle="#111827";String(n.t||"").split("\n").forEach(function(l,i){g.fillText(l,q.x,q.y+i*fs*1.25)});g.textAlign="center";g.textBaseline="middle"});
 if(visOn("text"))S.spots.forEach(function(s){var q=W2(s);g.beginPath();g.moveTo(q.x,q.y);g.lineTo(q.x-8,q.y-12);g.lineTo(q.x+8,q.y-12);g.closePath();g.fillStyle="#0f766e";g.fill();g.beginPath();g.moveTo(q.x+8,q.y-12);g.lineTo(q.x+70,q.y-12);g.strokeStyle="#0f766e";g.lineWidth=1.2;g.stroke();
  g.font="bold 13px Roboto,Arial";g.textAlign="left";g.fillStyle="#0f766e";g.fillText((s.lab||"FFL")+" "+lvl(spotZ(s)),q.x+10,q.y-20);g.textAlign="center"});
 if(visOn("secs"))S.secs.forEach(function(m){drawSecC(m)});
 // previews
 if(UI.lp){var L=Math.hypot(UI.lp.b.x-UI.lp.a.x,UI.lp.b.y-UI.lp.a.y);cline(UI.lp.a,UI.lp.b,"#e8590c",3,UI.tool==="grid"?[16,4,3,4]:null);lenLabel(UI.lp.a,UI.lp.b,fi(L),true)}
 if(UI.lpA){var q=W2(UI.lpA);g.beginPath();g.arc(q.x,q.y,9,0,7);g.strokeStyle="#e8590c";g.lineWidth=2.5;g.stroke()}
 if(UI.dimPend)drawDimC({a:UI.dimPend.a,b:UI.dimPend.b,off:UI.dimPend.off||0},"#e8590c");
 g.restore()}
function drawDimC(m,col){var G=dimGeom(m),A=W2(G.A),B=W2(G.B),a=W2(m.a),b=W2(m.b);g.strokeStyle=col;g.lineWidth=1.3;g.setLineDash([]);g.beginPath();g.moveTo(A.x,A.y);g.lineTo(B.x,B.y);g.moveTo(a.x,a.y);g.lineTo(A.x,A.y);g.moveTo(b.x,b.y);g.lineTo(B.x,B.y);g.stroke();
 [A,B].forEach(function(p){g.beginPath();g.moveTo(p.x-6,p.y+6);g.lineTo(p.x+6,p.y-6);g.lineWidth=2.2;g.stroke()});var an=Math.atan2(B.y-A.y,B.x-A.x);if(an>Math.PI/2+1e-6)an-=Math.PI;if(an<=-Math.PI/2+1e-6)an+=Math.PI;
 g.save();g.translate((A.x+B.x)/2,(A.y+B.y)/2);g.rotate(an);g.font="bold 14px Roboto,Arial";g.fillStyle="#fff";var t=fi(G.L),w=g.measureText(t).width+6;g.fillRect(-w/2,-19,w,16);g.fillStyle=col;g.textAlign="center";g.textBaseline="middle";g.fillText(t,0,-11);g.restore()}
function secGeom(m){var L=Math.hypot(m.b.x-m.a.x,m.b.y-m.a.y)||1,u={x:(m.b.x-m.a.x)/L,y:(m.b.y-m.a.y)/L},s=m.flip?-1:1,n={x:-u.y*s,y:u.x*s};return {u:u,n:n,L:L}}
function drawSecC(m){var G=secGeom(m);cline(m.a,m.b,"#7c2d12",2,[18,5,4,5]);[m.a,m.b].forEach(function(p){var q=W2(p),h=W2({x:p.x+G.n.x*1.2,y:p.y+G.n.y*1.2});g.beginPath();g.moveTo(q.x,q.y);g.lineTo(h.x,h.y);g.strokeStyle="#7c2d12";g.lineWidth=2.5;g.stroke();
  var ux=h.x-q.x,uy=h.y-q.y,l=Math.hypot(ux,uy)||1;ux/=l;uy/=l;g.beginPath();g.moveTo(h.x+ux*6,h.y+uy*6);g.lineTo(h.x-uy*7,h.y+ux*7);g.lineTo(h.x+uy*7,h.y-ux*7);g.closePath();g.fillStyle="#7c2d12";g.fill();
  var c=W2({x:p.x-G.u.x*(p===m.a?1:-1)*0.9,y:p.y-G.u.y*(p===m.a?1:-1)*0.9});g.beginPath();g.arc(c.x,c.y,13,0,7);g.fillStyle="#fff";g.fill();g.strokeStyle="#7c2d12";g.lineWidth=1.6;g.stroke();g.fillStyle="#7c2d12";g.font="bold 13px Roboto,Arial";g.fillText(m.name,c.x,c.y+0.5)})}
/* ---------- line tools (drag, or tap start + tap end) ---------- */
var LINE2={beam:1,rail:1,grid:1,dline:1,sec:1,dim:1};
function snapLine(w,a){var p=snapPick(w,{face:UI.tool==="dim",fine:UI.tool==="dim"||UI.tool==="dline",noCol:UI.tool==="grid"});if(!a||p.snap==="pt"||p.snap==="grid"||p.snap==="col"||UI.ortho===0)return p;
 var dx=p.x-a.x,dy=p.y-a.y,L=Math.hypot(dx,dy);if(L<1e-6)return p;var st=UI.ortho===45?Math.PI/4:Math.PI/2,an=Math.round(Math.atan2(dy,dx)/st)*st,ux=Math.cos(an),uy=Math.sin(an),pr=dx*ux+dy*uy;
 if(Math.abs(dx*uy-dy*ux)>L*0.18)return p;pr=UI.tool==="dim"?pr:Math.round(pr*4)/4;return {x:a.x+ux*pr,y:a.y+uy*pr}}
function commitLine(t,a,b){var L=Math.hypot(b.x-a.x,b.y-a.y);if(L<0.3){toast("Too short");return}
 if(t==="dim"){UI.dimPend={a:{x:a.x,y:a.y},b:{x:b.x,y:b.y},off:2};toast("Now tap where the dimension line should sit");render();return}
 snapshot();var A={x:a.x,y:a.y},B={x:b.x,y:b.y};
 if(t==="beam"){var bm=addBeam(A,B);toast("Beam "+(bm&&typeof beamSzLabel==="function"?beamSzLabel(bm)+" · ":"")+fi(L))}else if(t==="rail"){S.rails.push({id:nid(),a:A,b:B,h:3});toast("Railing "+fi(L)+" (3'-0\" high)")}
 else if(t==="grid"){var m={id:nid(),a:A,b:B};m.name=nextGridName(m);S.grids.push(m);toast("Grid "+m.name)}
 else if(t==="dline"){S.dlines.push({id:nid(),a:A,b:B,st:UI.dlSt||"solid"})}
 else if(t==="sec"){var n=S.secs.length+1;S.secs.push({id:nid(),a:A,b:B,name:String(n),flip:false});toast("Section "+n+" - see View → Sheets / Section");setTimeout(function(){changed();openSheetBy("sec",S.secs.length-1)},50)}
 changed()}
/* ---------- pointer hooks called from app.js ---------- */
/* Stage: Annotate / Structure - pointer handling for Dim, Detail Line, Grid, Beam, Railing, Section tools */
function toolDown(w,G){var t=UI.tool;
 if(t==="sel"){if(UI.pick)return false;var h=hitOne(w);if(h&&selHas(h.k,h.id)){G.kind="dragsel";G.w0=w;G.dx=0;G.dy=0;G.snap=false;return true}G.kind="boxsel";G.w0=w;return true}
 if(LINE2[t]&&!UI.dimPend){G.kind="line2";G.a=snapLine(w);return true}
 return false}
function toolMove(w,G,p){if(G.kind==="boxsel"){if(G.moved){UI.box={a:G.w0,b:w};render()}return true}
 if(G.kind==="dragsel"){if(!G.moved)return true;var L=movable();if(!L.length)return true;if(!G.snap){snapshot();G.snap=true}
  var dx=w.x-G.w0.x,dy=w.y-G.w0.y;if(UI.ortho!==0){if(Math.abs(dx)>Math.abs(dy)*2.5)dy=0;else if(Math.abs(dy)>Math.abs(dx)*2.5)dx=0}dx=Math.round(dx*4)/4;dy=Math.round(dy*4)/4;
  var ddx=dx-G.dx,ddy=dy-G.dy;if(ddx||ddy){xfNoPlan(L,ddx,ddy);G.dx=dx;G.dy=dy;SHEET=null;showHud("Move "+fi(Math.hypot(dx,dy)));render()}return true}
 if(G.kind==="line2"){if(G.moved){UI.lp={a:G.a,b:snapLine(w,G.a)};showHud(fi(Math.hypot(UI.lp.b.x-G.a.x,UI.lp.b.y-G.a.y)));render()}return true}
 return false}
function xfNoPlan(L,dx,dy){var seen=new Set();function mv(p){if(!p||seen.has(p))return;seen.add(p);p.x+=dx;p.y+=dy}var segs={};L.forEach(function(r){if(r.k==="seg")segs[r.id]=1});
 L.forEach(function(r){var e=elGet(r);if(!e)return;if(r.k==="seg"){mv(pt(e.a));mv(pt(e.b))}else if(r.k==="op"){if(segs[e.seg])return;var s=segById(e.seg),G=opWorld(e);if(!s||!G)return;var q=projSeg(G.c.x+dx,G.c.y+dy,pt(s.a),pt(s.b));e.t=clamp(q.t,0,1)}else if(r.k==="kc"){e.pts.forEach(mv)}else if(r.k==="stair"){e.pts.forEach(mv);if(e.fit){delete e.fit;delete e.lab}}else if(e.a&&e.b&&e.a.x!=null){mv(e.a);mv(e.b)}else mv(e)})}
function toolUp(G,w){if(G.kind==="boxsel"){var b=UI.box;UI.box=null;if(G.moved&&b)boxSelect(b.a,b.b,UI.addSel);else{var h=hitOne(w);if(h)setSel([h],UI.addSel);else{var gh=typeof ghostHit==="function"?ghostHit(w):null;if(gh)ghostToast(gh);else if(!UI.addSel)clearSel()}}render();return true}
 if(G.kind==="dragsel"){hideHud();if(G.snap){planarize();changed();updProps()}else{var h2=hitOne(w);if(h2)setSel([h2],UI.addSel)}return true}
 if(G.kind==="line2"){hideHud();var lp=UI.lp;UI.lp=null;if(G.moved&&lp){UI.lpA=null;commitLine(UI.tool,lp.a,lp.b)}else{if(UI.lpA){var b2=snapLine(w,UI.lpA),a=UI.lpA;UI.lpA=null;commitLine(UI.tool,a,b2)}else{UI.lpA=snapLine(w);toast("Start point set - tap the end point (or drag)")}}render();return true}
 return false}
function toolTap(w){var t=UI.tool;
 if(UI.pick&&UI.pick.k==="mirror"){var p=snapPick(w);UI.pick.pts.push(p);if(UI.pick.pts.length<2){render();toast("Tap second point of the axis");return true}var A=UI.pick.pts[0],B=UI.pick.pts[1],cp=UI.pick.copy;UI.pick=null;updCtx();doMirror(A,Math.atan2(B.y-A.y,B.x-A.x)*180/Math.PI,cp);return true}
 if(UI.dimPend&&t==="dim"){var D=UI.dimPend,G=dimGeom({a:D.a,b:D.b,off:0});var off=(w.x-D.a.x)*G.n.x+(w.y-D.a.y)*G.n.y;UI.dimPend=null;snapshot();S.dims.push({id:nid(),a:D.a,b:D.b,off:Math.round(off*4)/4});changed();toast("Dimension "+fi(G.L));return true}
 if(t==="del"){var h=hitOne(w);if(!h){toast("Tap an item to delete");return true}if(isPinned(h)){toast("Pinned - unpin first (Modify → Pin)");return true}UI.sel=[h];doDelete();return true}
 if(t==="col"){var p2=snapPick(w);snapshot();var c=addCol(p2.x,p2.y);if(c){changed();toast("Column "+c.w+"\" x "+c.d+"\""+(p2.snap?" (snapped to "+p2.snap+")":"")+(S.cur<S.L.length-1?" · continues up":""))}else{UNDO.pop();toast("Column already here")}return true}
 if(t==="stair"){stairPopup(w.x,w.y);return true}
 if(t==="slab"){floorPopup();return true}
 if(t==="roof"){roofPopup();return true}
 if(t==="text"){var n=null;S.notes.forEach(function(q){var b=noteBox(q);if(w.x>=b[0]-0.3&&w.x<=b[2]+0.3&&w.y>=b[1]-0.3&&w.y<=b[3]+0.3)n=q});notePopup(n,w);return true}
 if(t==="spot"){var s=S.spots.find(function(q){return Math.hypot(q.x-w.x,q.y-w.y)<snapR()*1.4});spotPopup(s,w);return true}
 if(t==="align"){alignTap(w);return true}
 if(t==="trim"){trimTap(w);return true}
 if(t==="split"){splitTap(w);return true}
 if(t==="offset"){offsetTap(w);return true}
 return false}
/* Stage: Annotate - Text tool */
function notePopup(n,w){modal('<div class="mt">'+(n?"Edit":"Add")+' text note</div><div class="ms">English letters print best in PDF / DXF</div><label class="fld">Text (new line = Enter)<textarea id="ntT" rows="3" style="display:block;width:100%;font-size:18px;padding:8px;border:1.5px solid #b8c6d8;border-radius:10px;-webkit-user-select:text;user-select:text">'+esc(n?n.t:"")+'</textarea></label>'+
 '<div class="grid2">'+[[0.45,"Small"],[0.6,"Medium"],[0.9,"Large"]].map(function(z){return '<button class="bb'+(Math.abs((n?noteH(n):0.6)-z[0])<0.01?' on':'')+'" data-nh="'+z[0]+'">'+z[1]+'</button>'}).join("")+'</div><div class="row">'+(n?'<button class="bb del" id="ntD">Delete</button>':'')+'<button class="bb" id="ntX">Cancel</button><button class="bb ok" id="ntOk">OK</button></div>',function(box){var h=n?noteH(n):0.6;
 box.querySelectorAll("[data-nh]").forEach(function(b){b.onclick=function(){h=+b.dataset.nh;box.querySelectorAll("[data-nh]").forEach(function(x){x.classList.toggle("on",x===b)})}});$("ntX").onclick=closeModal;setTimeout(function(){try{$("ntT").focus()}catch(e){}},50);
 if(n)$("ntD").onclick=function(){snapshot();S.notes=S.notes.filter(function(q){return q!==n});closeModal();changed()};
 $("ntOk").onclick=function(){var t=$("ntT").value.replace(/\s+$/,"");if(!t){toast("Type the text");return}snapshot();if(n){n.t=t;n.h=h}else S.notes.push({id:nid(),x:w.x,y:w.y,t:t,h:h});closeModal();changed()}})}
/* Stage: Annotate - Spot Level tool */
function spotPopup(s,w){var z=s?spotZ(s):lvElev(S.cur);modal('<div class="mt">Spot level</div><div class="ms">Level value from ground floor FFL +0\'-0" (this level = '+lvl(lvElev(S.cur))+')</div><div class="grid2">'+["FFL","TOS","SILL","LINTEL","GL","RL"].map(function(l){return '<button class="bb'+((s?s.lab||"FFL":"FFL")===l?' on':'')+'" data-sl="'+l+'">'+l+'</button>'}).join("")+'</div><label class="fld">Level (ft-in, e.g. 10\'6" or -1\'6")<input id="spZ" value="'+(z<0?"-":"")+fi(z)+'"></label>'+
 '<div class="row">'+(s?'<button class="bb del" id="spD">Delete</button>':'')+'<button class="bb" id="spX">Cancel</button><button class="bb ok" id="spOk">OK</button></div>',function(box){var lab=s?s.lab||"FFL":"FFL";
 box.querySelectorAll("[data-sl]").forEach(function(b){b.onclick=function(){lab=b.dataset.sl;box.querySelectorAll("[data-sl]").forEach(function(x){x.classList.toggle("on",x===b)})}});$("spX").onclick=closeModal;
 if(s)$("spD").onclick=function(){snapshot();S.spots=S.spots.filter(function(q){return q!==s});closeModal();changed()};
 $("spOk").onclick=function(){var v=parseFI($("spZ").value);if(!isFinite(v)){toast("Enter a level like 10'6\"");return}snapshot();if(s){s.z=v;s.lab=lab}else S.spots.push({id:nid(),x:w.x,y:w.y,z:v,lab:lab});closeModal();changed()}})}
