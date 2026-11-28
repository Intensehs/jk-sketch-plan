/* ================= SHEET VIEWPORT: drawing scale + position on the sheet, text size in paper mm, text auto-fit ================= */
/* Stage: Sheet scale - one viewport per plan sheet, saved in S.meta.vp["L"+level id] = {N: printed scale (0 = Fit), cx, cy: paper mm} */
var VPAD={l:25,t:24,r:13,b:13},VPZ={x0:16,y0:16,x1:TBX-4,y1:264},VPS=[20,50,75,100,200],VPSNAP=[10,20,25,50,75,100,125,150,200,250,300,400,500,750,1000],TXTPRE=[1.8,2.5,3.5,5,7];
var _SHN=0,_PNC={},VPV=0;
function vpKey(){var L=S.L&&S.L[S.cur];return "L"+(L?L.id:S.cur)}
function vpGet(){var m=S.meta.vp;return m&&m[vpKey()]||null}
function vpInt(Np){return S.meta.paper==="A4"?Np/Math.SQRT2:Np}
function vpPrint(N){return S.meta.paper==="A4"?Math.round(N*Math.SQRT2):Math.round(N)}
function txtMM(){var v=+S.meta.txtMM;return v>0?v:2.5}
function txtF(){return txtMM()/2.5}
function tAuto(){return S.meta.tauto!==false}
/* plan extents (same numbers buildSheet uses); paper-sized notes are measured at 1:100 so the Fit scale never chases its own text */
function sheetExt(){var s0=_SHN;_SHN=100;try{var wx0=Infinity,wy0=Infinity,wx1=-Infinity,wy1=-Infinity;function ext(p){wx0=Math.min(wx0,p.x);wy0=Math.min(wy0,p.y);wx1=Math.max(wx1,p.x);wy1=Math.max(wy1,p.y)}
 S.pts.forEach(ext);planExt(ext);if(S.meta.dbl)S.segs.forEach(function(s){var P=wallPoly(s);if(P)P.forEach(ext)});if(!isFinite(wx0)){wx0=wy0=0;wx1=wy1=1}
 var Wf=Math.max(wx1-wx0,1),Hf=Math.max(wy1-wy0,1),ax0=VPZ.x0+VPAD.l,ax1=VPZ.x1-VPAD.r,ay0=VPZ.y0+VPAD.t,ay1=VPZ.y1-VPAD.b;
 return {wx0:wx0,wy0:wy0,wx1:wx1,wy1:wy1,Wf:Wf,Hf:Hf,ax0:ax0,ax1:ax1,ay0:ay0,ay1:ay1,Nauto:S.pts.length?chooseScale(Wf,Hf,ax1-ax0,ay1-ay0):100}}finally{_SHN=s0}}
/* scale of the current level's plan sheet (for paper-sized text on the drawing screen) */
function planN(){var key=VPV+"|"+S.cur+"|"+(S.meta.paper||"");if(_PNC.k===key)return _PNC.N;var VP=vpGet(),N=VP&&VP.N>0?vpInt(VP.N):sheetExt().Nauto;_PNC={k:key,N:N};return N}
/* Stage: Text size - notes with pmm are sized in paper mm: same printed size at any scale */
function noteH(n){if(n&&n.pmm>0)return n.pmm*(_SHN||planN())/304.8;return n&&n.h||0.6}
var _vpChg=changed;changed=function(){VPV++;_PNC={};return _vpChg.apply(this,arguments)};
function vpSet(o){S.meta.vp=S.meta.vp||{};var k=vpKey(),c=S.meta.vp[k]||{N:0};S.meta.vp[k]=Object.assign({},c,o)}
function vpCur(){if(!UI.clean)return null;var c=curSheet();return c&&c.sh&&c.sh.lv!=null&&c.sh.d&&c.sh.d.vp?c:null}
function vpRebuild(c){var sh=c.sh;MARKG=true;try{assignMarks();var r=withLevel(sh.lv,function(){return buildSheet({title:sh.title,dno:sh.no,sheet:(c.i+1)+" / "+c.n,noD2:true})});sh.d=r.d;sh.N=r.N}finally{MARKG=false}}
function vpWith(c,fn){return withLevel(c.sh.lv,fn)}
/* where the padded drawing box goes for a snap: tl,t,tr,l,c,r,bl,b,br */
function vpSnapC(v,where){var W=v.Wp+VPAD.l+VPAD.r,H=v.Hp+VPAD.t+VPAD.b,h=where.charAt(where.length-1),vv=where.charAt(0);
 var x0=/l$/.test(where)?VPZ.x0:/r$/.test(where)?VPZ.x1-W:(VPZ.x0+VPZ.x1)/2-W/2,y0=/^t/.test(where)?VPZ.y0:/^b/.test(where)?VPZ.y1-H:(VPZ.y0+VPZ.y1)/2-H/2;
 return {cx:x0+VPAD.l+v.Wp/2,cy:y0+VPAD.t+v.Hp/2}}
function vpOutside(v){return v.x0<VPZ.x0-0.5||v.y0<VPZ.y0-0.5||v.x1>VPZ.x1+0.5||v.y1>VPZ.y1+0.5}
function vpApply(c,o,msg){snapshot();vpWith(c,function(){vpSet(o)});changed();updCtx();var c2=vpCur();if(c2&&vpOutside(c2.sh.d.vp))toast("Drawing goes past the sheet border - move it or pick a smaller scale");else if(msg)toast(msg)}
function vpScaleTxt(v){return (v.fit?"Fit ":"")+"1:"+vpPrint(v.N)}
/* ---- option bar chips (Sheets view, plan sheets) + Text tool chips ---- */
var _vpUctx=updCtx;updCtx=function(){_vpUctx.apply(this,arguments);var c=$("ctx");if(!c||$("vpChips"))return;var h="";
 if(UI.clean){var cs=null;try{cs=vpCur()}catch(e){}if(cs){var v=cs.sh.d.vp;h=cb("vpscale","Scale "+vpScaleTxt(v),"drawing on sheet")+cb("vpmove",UI.vpSel?"✥ Moving drawing":"✥ Move drawing",UI.vpSel?"drag · corners = scale":"select it on the sheet",!!UI.vpSel)+cb("vptxt","Text "+txtMM()+" mm","size on paper")+cb("tarr","Auto-arrange text","clear overlaps")}}
 else if(UI.tool==="text")h=cb("tauto","Auto-fit: "+(tAuto()?"ON":"OFF"),"keep text clear",tAuto())+cb("tarr","Auto-arrange text","clear overlaps")+cb("vptxt","Text "+txtMM()+" mm","size on paper");
 if(!h)return;var sp=document.createElement("span");sp.id="vpChips";sp.style.display="contents";sp.innerHTML=h;c.appendChild(sp);
 sp.querySelectorAll("[data-c]").forEach(function(b){b.onclick=function(ev){ev.stopPropagation();ctxAction(b.dataset.c)}})};
var _vpCtxA=ctxAction;ctxAction=function(k){
 if(k==="vpscale"){vpPopup();return}if(k==="vpmove"){UI.vpSel=!UI.vpSel;if(UI.vpSel)toast("Drag the drawing · drag a corner to change the scale");updCtx();render();return}
 if(k==="vptxt"){txtPopup();return}if(k==="tauto"){snapshot();S.meta.tauto=!tAuto();toast("Text auto-fit "+(tAuto()?"ON":"OFF"));changed();updCtx();return}
 if(k==="tarr"){autoArrange();return}
 if(k==="back"||/^pg|^sh:/.test(k))UI.vpSel=false;return _vpCtxA.apply(this,arguments)};
/* ---- Drawing on sheet popup: scale presets / custom / Fit, 9 snap positions, X / Y fields ---- */
function vpPopup(){var c=vpCur();if(!c){toast("Open a plan sheet first");return}
 function body(){var c2=vpCur(),v=c2.sh.d.vp,P=vpPrint(v.N);return '<div class="mt">Drawing on sheet</div><div class="ms">'+esc(c2.sh.no+" "+c2.sh.title)+' · now '+vpScaleTxt(v)+' ('+(S.meta.paper||"A3")+')</div>'+
  '<div class="ms" style="margin-top:6px"><b>Scale</b></div><div class="grid3">'+cbx("vps:0","Fit","auto "+"1:"+vpPrint(v.Nauto),v.fit)+VPS.map(function(n){return cbx("vps:"+n,"1:"+n,"",!v.fit&&P===n)}).join("")+'</div>'+
  '<label class="fld">Custom scale 1 :<input id="vpN" inputmode="numeric" value="'+P+'" autocomplete="off"></label>'+
  '<div class="ms" style="margin-top:6px"><b>Position</b> (snap)</div><div class="grid3">'+[["tl","↖ Top left"],["t","↑ Top"],["tr","↗ Top right"],["l","← Left"],["c","⊙ Centre"],["r","→ Right"],["bl","↙ Bottom left"],["b","↓ Bottom"],["br","↘ Bottom right"]].map(function(q){return cbx("vpp:"+q[0],q[1],"")}).join("")+'</div>'+
  '<div class="grid2"><label class="fld">Left (mm from sheet edge)<input id="vpX" inputmode="decimal" value="'+(v.cx-v.Wp/2).toFixed(1)+'"></label><label class="fld">Top (mm)<input id="vpY" inputmode="decimal" value="'+(v.cy-v.Hp/2).toFixed(1)+'"></label></div>'+
  '<div class="row"><button class="bb" id="vpR">Reset (Fit + centre)</button><button class="bb" id="vpXc">Close</button><button class="bb ok" id="vpOk">Apply</button></div>'}
 function cbx(k,t,s,on){return '<button class="bb'+(on?" on":"")+'" data-vp="'+k+'">'+t+(s?'<small>'+s+'</small>':'')+'</button>'}
 function bind(box){box.querySelectorAll("[data-vp]").forEach(function(b){b.onclick=function(){var a=b.dataset.vp.split(":"),c2=vpCur();
   if(a[0]==="vps")vpApply(c2,{N:+a[1]},a[1]==="0"?"Scale: Fit":"Scale 1:"+a[1]);else vpApply(c2,vpSnapC(c2.sh.d.vp,a[1]),"Drawing moved");$("mbox").innerHTML=body();bind($("mbox"))}});
  $("vpXc").onclick=closeModal;$("vpR").onclick=function(){var c2=vpCur();snapshot();vpWith(c2,function(){if(S.meta.vp)delete S.meta.vp[vpKey()]});changed();updCtx();$("mbox").innerHTML=body();bind($("mbox"));toast("Fit + centred")};
  $("vpOk").onclick=function(){var c2=vpCur(),v=c2.sh.d.vp,N=Math.round(+$("vpN").value),x=parseFloat($("vpX").value),y=parseFloat($("vpY").value),o={};
   if(N>0&&N!==vpPrint(v.N)){if(N>20000){toast("Scale 1:1 to 1:20000");return}o.N=N}var f=o.N?v.N/vpInt(o.N):1,Wn=v.Wp*f,Hn=v.Hp*f,ex=isFinite(x)&&Math.abs(x-(v.cx-v.Wp/2))>0.05,ey=isFinite(y)&&Math.abs(y-(v.cy-v.Hp/2))>0.05;
   if(ex||o.N)o.cx=ex?x+Wn/2:v.cx;if(ey||o.N)o.cy=ey?y+Hn/2:v.cy;
   if(!Object.keys(o).length){closeModal();return}if(o.N==null&&v.fit)o.N=0;vpApply(c2,o,"Drawing updated");closeModal()}}
 modal(body(),bind)}
/* ---- Text size popup (paper mm) ---- */
function txtPopup(){var cur=txtMM();modal('<div class="mt">Text size on paper</div><div class="ms">Printed size of text notes, room names, door / window tags and dimension text. Stays the same at 1:50, 1:100 or any scale.</div><div class="grid3">'+
 TXTPRE.map(function(z){return '<button class="bb'+(Math.abs(z-cur)<0.01?" on":"")+'" data-tz="'+z+'">'+z+' mm<small>'+({1.8:"small",2.5:"standard",3.5:"large",5:"titles",7:"big titles"})[z]+'</small></button>'}).join("")+'</div><label class="fld">Custom (mm)<input id="tzV" inputmode="decimal" value="'+cur+'"></label>'+
 '<label style="display:flex;gap:8px;align-items:center;margin:8px 0"><input type="checkbox" id="tzAll" checked> Also resize all existing text notes</label><div class="row"><button class="bb" id="tzX">Cancel</button><button class="bb ok" id="tzOk">OK</button></div>',function(box){
 box.querySelectorAll("[data-tz]").forEach(function(b){b.onclick=function(){$("tzV").value=b.dataset.tz;box.querySelectorAll("[data-tz]").forEach(function(x){x.classList.toggle("on",x===b)})}});$("tzX").onclick=closeModal;
 $("tzOk").onclick=function(){var v=parseFloat($("tzV").value);if(!(v>=1&&v<=20)){toast("Use 1 to 20 mm");return}snapshot();S.meta.txtMM=v;if($("tzAll").checked)S.L.forEach(function(L){(L.notes||[]).forEach(function(n){n.pmm=v;delete n.h})});closeModal();changed();updCtx();toast("Text "+v+" mm on paper")}})}
/* ---- note popup: sizes in paper mm, auto-fit on placement ---- */
function notePopup(n,w){var pm0=n?(n.pmm>0?n.pmm:0):txtMM();modal('<div class="mt">'+(n?"Edit":"Add")+' text note</div><div class="ms">English letters print best in PDF / DXF · size is the printed height on paper</div><label class="fld">Text (new line = Enter)<textarea id="ntT" rows="3" style="display:block;width:100%;font-size:18px;padding:8px;border:1.5px solid #b8c6d8;border-radius:10px;-webkit-user-select:text;user-select:text">'+esc(n?n.t:"")+'</textarea></label>'+
 '<div class="grid3">'+[[1.8,"Small"],[2.5,"Medium"],[3.5,"Large"],[5,"Title"],[7,"Big"]].map(function(z){return '<button class="bb'+(Math.abs(pm0-z[0])<0.01?' on':'')+'" data-pm="'+z[0]+'">'+z[1]+'<small>'+z[0]+' mm</small></button>'}).join("")+'</div>'+
 (n?'':'<label style="display:flex;gap:8px;align-items:center;margin:6px 0"><input type="checkbox" id="ntAF"'+(tAuto()?" checked":"")+'> Auto-fit: move clear of walls, furniture and other text</label>')+
 '<div class="row">'+(n?'<button class="bb del" id="ntD">Delete</button>':'')+'<button class="bb" id="ntX">Cancel</button><button class="bb ok" id="ntOk">OK</button></div>',function(box){var pm=pm0;
 box.querySelectorAll("[data-pm]").forEach(function(b){b.onclick=function(){pm=+b.dataset.pm;box.querySelectorAll("[data-pm]").forEach(function(x){x.classList.toggle("on",x===b)})}});$("ntX").onclick=closeModal;setTimeout(function(){try{$("ntT").focus()}catch(e){}},50);
 if(n)$("ntD").onclick=function(){snapshot();S.notes=S.notes.filter(function(q){return q!==n});closeModal();changed()};
 $("ntOk").onclick=function(){var t=$("ntT").value.replace(/\s+$/,"");if(!t){toast("Type the text");return}snapshot();var af=!n&&$("ntAF")&&$("ntAF").checked;
  if(n){n.t=t;if(pm>0){n.pmm=pm;delete n.h}closeModal();changed();return}
  var nn={id:nid(),x:w.x,y:w.y,t:t,pmm:pm>0?pm:txtMM()};S.notes.push(nn);closeModal();changed();if(af)noteAutoPlace(nn)}})}
/* Stage: Text auto-fit - obstacles (walls, furniture, other text, room tags, dimensions, door / window tags) and nearest free spot */
function rpHit(r,P){var bx=P.bb;if(bx[2]<r[0]||bx[0]>r[2]||bx[3]<r[1]||bx[1]>r[3])return false;var Q=P.p,n=Q.length;if(n<3)return true;
 for(var i=0;i<n;i++){var q=Q[i];if(q.x>r[0]&&q.x<r[2]&&q.y>r[1]&&q.y<r[3])return true}
 var C=[{x:r[0],y:r[1]},{x:r[2],y:r[1]},{x:r[2],y:r[3]},{x:r[0],y:r[3]}];for(var j=0;j<4;j++)if(inPoly(C[j].x,C[j].y,Q))return true;
 function X(a,b,c,d){function o(p,q,s){return (q.x-p.x)*(s.y-p.y)-(q.y-p.y)*(s.x-p.x)}return o(a,b,c)*o(a,b,d)<0&&o(c,d,a)*o(c,d,b)<0}
 for(i=0;i<n;i++)for(j=0;j<4;j++)if(X(Q[i],Q[(i+1)%n],C[j],C[(j+1)%4]))return true;return false}
function obP(p){var x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;p.forEach(function(q){x0=Math.min(x0,q.x);y0=Math.min(y0,q.y);x1=Math.max(x1,q.x);y1=Math.max(y1,q.y)});return {p:p,bb:[x0,y0,x1,y1]}}
function obRect(x0,y0,x1,y1){return obP([{x:x0,y:y0},{x:x1,y:y0},{x:x1,y:y1},{x:x0,y:y1}])}
function obLine(a,b,h){var L=Math.hypot(b.x-a.x,b.y-a.y)||1,nx=-(b.y-a.y)/L*h,ny=(b.x-a.x)/L*h;return obP([{x:a.x+nx,y:a.y+ny},{x:b.x+nx,y:b.y+ny},{x:b.x-nx,y:b.y-ny},{x:a.x-nx,y:a.y-ny}])}
function textObstacles(skip){var O=[],pmw=planN()/304.8,dbl=S.meta.dbl;
 S.segs.forEach(function(s){var P=dbl?wallPoly(s):null;O.push(P?obP(P):obLine(pt(s.a),pt(s.b),0.2))});
 (S.furn||[]).forEach(function(f){var X=fXform(f),D=fdims(f);O.push(obP([X(-D.w/2,-D.d/2),X(D.w/2,-D.d/2),X(D.w/2,D.d/2),X(-D.w/2,D.d/2)]))});
 (S.cols||[]).forEach(function(c){try{O.push(obP(colPoly(c)))}catch(e){}});
 if(typeof colsFromBelow==="function")colsFromBelow(S.cur).forEach(function(gh){try{O.push(obP(colPoly(gh.c)))}catch(e){}});
 (S.stairs||[]).forEach(function(st){try{if(typeof stairPts==="function")O.push(obP(stairPts(st)))}catch(e){}});
 (S.kcs||[]).forEach(function(k){try{if(typeof kcPoly==="function")O.push(obP(kcPoly(k)))}catch(e){}});
 S.notes.forEach(function(n){if(skip&&skip.indexOf(n)>=0)return;var b=noteBox(n);O.push(obRect(b[0],b[1],b[2],b[3]))});
 var rs=3.2*txtF()*pmw;S.labels.forEach(function(l){var w=Math.max(String(l.name||"").length,11)*rs*0.62/2;O.push(obRect(l.x-w,l.y-rs*1.4,l.x+w,l.y+rs*2.1))});
 S.dims.forEach(function(m){try{var G=dimGeom(m);O.push(obLine(G.A,G.B,2.3*txtF()*pmw*1.2))}catch(e){}});
 S.ops.forEach(function(o){var q=opWorld(o);if(!q)return;var T=dbl?wallT(q.s):0.5,ac=T/2+Math.max(o.type==="D"?q.w:0,(2.6+2.6*txtF()+1)*pmw),u=q.u,n=q.n,c=q.c,hw=q.w/2;
  O.push(obP([{x:c.x-u.x*hw-n.x*ac,y:c.y-u.y*hw-n.y*ac},{x:c.x+u.x*hw-n.x*ac,y:c.y+u.y*hw-n.y*ac},{x:c.x+u.x*hw+n.x*ac,y:c.y+u.y*hw+n.y*ac},{x:c.x-u.x*hw+n.x*ac,y:c.y-u.y*hw+n.y*ac}]))});
 (S.spots||[]).forEach(function(sp){O.push(obRect(sp.x-0.3,sp.y-1.2,sp.x+3,sp.y+0.2))});
 return O}
function noteHits(n,O,dx,dy){var b=noteBox(n),r=[b[0]+dx,b[1]+dy,b[2]+dx,b[3]+dy],c=0;for(var i=0;i<O.length;i++)if(rpHit(r,O[i]))c++;return c}
/* nearest free spot: rings around the tapped point, closest first */
function noteFreeSpot(n,O){if(!noteHits(n,O,0,0))return {dx:0,dy:0,hits:0};var h=noteH(n),st=Math.max(0.25,h*0.5),best=null,b0=noteHits(n,O,0,0);
 for(var r=st;r<=12;r+=st){var m=Math.max(8,Math.round(2*Math.PI*r/st));for(var i=0;i<m;i++){var a=i/m*Math.PI*2,dx=r*Math.cos(a),dy=r*Math.sin(a),c=noteHits(n,O,dx,dy);if(!c)return {dx:dx,dy:dy,hits:0};if(!best||c<best.hits)best={dx:dx,dy:dy,hits:c}}}
 return best&&best.hits<b0?best:{dx:0,dy:0,hits:b0}}
function noteAutoPlace(n){var O=textObstacles([n]),q=noteFreeSpot(n,O);if(!q.dx&&!q.dy){if(q.hits)toast("No clear spot nearby - text kept where you tapped");return false}
 snapshot();n.x+=q.dx;n.y+=q.dy;changed();toast("Text moved "+fi(Math.hypot(q.dx,q.dy))+" to a clear spot · Undo keeps it where you tapped");return true}
function autoArrange(){var L=S.notes.slice(),moved=0,left=0;if(!L.length){toast("No text notes on this level");return}snapshot();var fixed=[];
 L.forEach(function(n){var O=textObstacles(L.filter(function(x){return x!==n&&fixed.indexOf(x)<0}));var q=noteFreeSpot(n,O);if(q.dx||q.dy){n.x+=q.dx;n.y+=q.dy;moved++}if(q.hits)left++;fixed.push(n)});
 if(!moved)UNDO.pop();changed();toast(moved?("Moved "+moved+" text note"+(moved>1?"s":"")+" clear"+(left?" · "+left+" still tight":"")):(left?"No clear spot found for "+left+" note(s)":"Text is already clear"))}
/* ---- sheet canvas: select / drag the drawing, corner handles scale it, snaps to corners + centre ---- */
function vpPaper(p){return {x:(p.x-SV.ox)/SV.s,y:(p.y-SV.oy)/SV.s}}
function vpHandles(v){return [[v.cx-v.Wp/2,v.cy-v.Hp/2],[v.cx+v.Wp/2,v.cy-v.Hp/2],[v.cx+v.Wp/2,v.cy+v.Hp/2],[v.cx-v.Wp/2,v.cy+v.Hp/2]]}
function vpHitAt(c,p){var v=c.sh.d.vp,q=vpPaper(p),hr=16/SV.s,H=vpHandles(v);if(UI.vpSel)for(var i=0;i<4;i++)if(Math.abs(q.x-H[i][0])<hr&&Math.abs(q.y-H[i][1])<hr)return {k:"h",i:i};
 if(q.x>=v.x0&&q.x<=v.x1&&q.y>=v.y0&&q.y<=v.y1)return {k:"in"};return null}
var VPG=null;
function vpDown(e){if(!UI.clean||!e.isPrimary||(e.pointerType==="mouse"&&e.button!==0))return;if(window.V3&&V3.on)return;var c=null;try{c=vpCur()}catch(_){}if(!c)return;var p=lp(e),hit=vpHitAt(c,p);
 if(!UI.vpSel){if(hit)VPG={kind:"tap",sx:p.x,sy:p.y,id:e.pointerId};return}
 if(!hit){VPG={kind:"tapout",sx:p.x,sy:p.y,id:e.pointerId};return}
 e.stopPropagation();e.preventDefault();var v=c.sh.d.vp;VPG={kind:hit.k==="h"?"scale":"move",id:e.pointerId,sx:p.x,sy:p.y,c:c,v0:Object.assign({},v),hi:hit.i,snap0:false};render()}
function vpMove(e){if(!VPG||e.pointerId!==VPG.id)return;var p=lp(e),dd=Math.hypot(p.x-VPG.sx,p.y-VPG.sy);if(VPG.kind==="tap"||VPG.kind==="tapout"){if(dd>8)VPG.moved=true;return}
 e.preventDefault();if(dd<3&&!VPG.snap0)return;if(!VPG.snap0){snapshot();VPG.snap0=true}var v0=VPG.v0,c=VPG.c;
 if(VPG.kind==="move"){var cx=v0.cx+(p.x-VPG.sx)/SV.s,cy=v0.cy+(p.y-VPG.sy)/SV.s,th=10/SV.s,G=[],W=v0.Wp,H=v0.Hp;
  var xs=[[cx-W/2-VPAD.l,VPZ.x0],[cx+W/2+VPAD.r,VPZ.x1],[cx-W/2-VPAD.l+(W+VPAD.l+VPAD.r)/2,(VPZ.x0+VPZ.x1)/2]],ys=[[cy-H/2-VPAD.t,VPZ.y0],[cy+H/2+VPAD.b,VPZ.y1],[cy-H/2-VPAD.t+(H+VPAD.t+VPAD.b)/2,(VPZ.y0+VPZ.y1)/2]];
  for(var i=0;i<3;i++)if(Math.abs(xs[i][0]-xs[i][1])<th){cx+=xs[i][1]-xs[i][0];G.push({x:xs[i][1]});break}
  for(i=0;i<3;i++)if(Math.abs(ys[i][0]-ys[i][1])<th){cy+=ys[i][1]-ys[i][0];G.push({y:ys[i][1]});break}
  UI.vpG=G;vpWith(c,function(){vpSet({cx:cx,cy:cy,N:v0.fit?0:vpPrint(v0.N)})})}
 else{var H0=vpHandles(v0)[VPG.hi],d0=Math.hypot(H0[0]-v0.cx,H0[1]-v0.cy)||1,q=vpPaper(p),d1=Math.max(2,Math.hypot(q.x-v0.cx,q.y-v0.cy)),Np=vpPrint(v0.N)*d0/d1,best=VPSNAP[0];
  VPSNAP.forEach(function(s){if(Math.abs(Math.log(s/Np))<Math.abs(Math.log(best/Np)))best=s});UI.vpG=[];vpWith(c,function(){vpSet({N:best,cx:v0.cx,cy:v0.cy})})}
 vpRebuild(c);render()}
function vpUp(e){if(!VPG||e.pointerId!==VPG.id)return;var G=VPG;VPG=null;UI.vpG=null;
 if(G.kind==="tap"){if(!G.moved){UI.vpSel=true;updCtx();render();toast("Drawing selected - drag to move, corners to scale")}return}
 if(G.kind==="tapout"){if(!G.moved){UI.vpSel=false;updCtx();render()}return}
 if(G.snap0){changed();updCtx();var c=vpCur();if(c){var v=c.sh.d.vp;toast((G.kind==="scale"?"Scale ":"")+vpScaleTxt(v)+(vpOutside(v)?" · past the sheet border":""))}}else render()}
function vpInit(){var st=$("stage");if(!st||st._vp)return;st._vp=1;st.addEventListener("pointerdown",vpDown,true);window.addEventListener("pointermove",vpMove,true);window.addEventListener("pointerup",vpUp,true);window.addEventListener("pointercancel",function(e){if(VPG&&e.pointerId===VPG.id){VPG=null;UI.vpG=null;render()}},true)}
/* overlay on the sheet: frame, corner handles, snap guides, scale badge */
var _vpPaint=paintSheet;paintSheet=function(){_vpPaint.apply(this,arguments);var c=null;try{c=vpCur()}catch(e){}if(!c||!UI.vpSel)return;var v=c.sh.d.vp,s=SV.s;function X(x){return SV.ox+x*s}function Y(y){return SV.oy+y*s}
 g.save();g.strokeStyle="#e8590c";g.lineWidth=1.5;g.setLineDash([6,4]);g.strokeRect(X(v.x0),Y(v.y0),(v.x1-v.x0)*s,(v.y1-v.y0)*s);g.setLineDash([]);g.strokeStyle="rgba(232,89,12,.55)";g.strokeRect(X(v.cx-v.Wp/2),Y(v.cy-v.Hp/2),v.Wp*s,v.Hp*s);
 vpHandles(v).forEach(function(h){g.fillStyle="#fff";g.strokeStyle="#e8590c";g.lineWidth=2;g.fillRect(X(h[0])-7,Y(h[1])-7,14,14);g.strokeRect(X(h[0])-7,Y(h[1])-7,14,14)});
 (UI.vpG||[]).forEach(function(q){g.strokeStyle="#0ea5e9";g.lineWidth=1;g.setLineDash([4,3]);g.beginPath();if(q.x!=null){g.moveTo(X(q.x),Y(0));g.lineTo(X(q.x),Y(297))}else{g.moveTo(X(0),Y(q.y));g.lineTo(X(420),Y(q.y))}g.stroke();g.setLineDash([])});
 var t=vpScaleTxt(v)+(vpOutside(v)?"  · past border":"");g.font="bold 13px Roboto,Arial";var tw2=g.measureText(t).width+14;g.fillStyle=vpOutside(v)?"#b91c1c":"#e8590c";g.fillRect(X(v.x0),Y(v.y0)-22,tw2,20);g.fillStyle="#fff";g.textAlign="left";g.textBaseline="middle";g.fillText(t,X(v.x0)+7,Y(v.y0)-12);g.restore()};
var _vpSetClean=setClean;setClean=function(on){if(!on)UI.vpSel=false;return _vpSetClean.apply(this,arguments)};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",vpInit);else setTimeout(vpInit,0);
