/* ===== v1.5 Import: image / camera / PDF (vector -> editable lines & walls, scanned -> calibrated underlay) ===== */
var ULIMG=null;
function ulKey(){return "jksp_ul_"+(typeof CURID!=="undefined"&&CURID?CURID:"cur")}
function ulMeta(){return S.meta.ul||null}
function ulLoad(){var m=ulMeta();if(!m){ULIMG=null;return}if(ULIMG&&ULIMG._k===m.k)return;var src=null;try{src=localStorage.getItem("jksp_ul_"+m.k)}catch(e){}if(!src){ULIMG=null;return}var im=new Image();im._k=m.k;im.onload=function(){ULIMG=im;render()};im.src=src}
function drawImgUL(){var m=ulMeta();if(!m||m.on===false||UI.clean)return;ulLoad();if(!ULIMG||!ULIMG.complete)return;var a=w2s(m.x,m.y),b=w2s(m.x+m.w,m.y+m.h);g.save();g.globalAlpha=m.op||0.5;g.drawImage(ULIMG,a.x,a.y,b.x-a.x,b.y-a.y);g.restore()}
function ulSet(dataURL,pxW,pxH,opt){opt=opt||{};var k=String(Date.now());try{localStorage.setItem("jksp_ul_"+k,dataURL)}catch(e){toast("Image too large to keep - try a smaller photo");return false}
 var old=ulMeta();if(old&&old.k)try{localStorage.removeItem("jksp_ul_"+old.k)}catch(e){}
 var c=s2w(CW/2,CH/2),wf=opt.wft||40,hf=wf*pxH/pxW;snapshot();S.meta.ul={k:k,x:c.x-wf/2,y:c.y-hf/2,w:wf,h:hf,op:0.5,on:true,src:opt.src||"image"};ULIMG=null;changed();return true}
/* image clean-up: perspective (4 corners) + grayscale/contrast */
function homog(src,dst){/* solve 8 params mapping dst->src (for inverse sampling) */var A=[],B=[];for(var i=0;i<4;i++){var x=dst[i][0],y=dst[i][1],u=src[i][0],v=src[i][1];A.push([x,y,1,0,0,0,-u*x,-u*y]);B.push(u);A.push([0,0,0,x,y,1,-v*x,-v*y]);B.push(v)}
 for(var c=0;c<8;c++){var p=c;for(var r=c+1;r<8;r++)if(Math.abs(A[r][c])>Math.abs(A[p][c]))p=r;var t=A[c];A[c]=A[p];A[p]=t;var tb=B[c];B[c]=B[p];B[p]=tb;for(var r2=0;r2<8;r2++){if(r2===c)continue;var f=A[r2][c]/A[c][c];for(var k=c;k<8;k++)A[r2][k]-=f*A[c][k];B[r2]-=f*B[c]}}
 return B.map(function(b,i){return b/A[i][i]})}
function warpImage(img,corners,clean){var W0=img.naturalWidth||img.width,H0=img.naturalHeight||img.height,s=document.createElement("canvas");s.width=W0;s.height=H0;var sx=s.getContext("2d");sx.drawImage(img,0,0);var SD=sx.getImageData(0,0,W0,H0).data;
 var q=corners,wT=Math.hypot(q[1][0]-q[0][0],q[1][1]-q[0][1]),wB=Math.hypot(q[2][0]-q[3][0],q[2][1]-q[3][1]),hL=Math.hypot(q[3][0]-q[0][0],q[3][1]-q[0][1]),hR=Math.hypot(q[2][0]-q[1][0],q[2][1]-q[1][1]),W=Math.round(Math.max(wT,wB)),H=Math.round(Math.max(hL,hR)),sc=Math.min(1,2200/Math.max(W,H));W=Math.round(W*sc);H=Math.round(H*sc);
 var h=homog(q,[[0,0],[W,0],[W,H],[0,H]]),o=document.createElement("canvas");o.width=W;o.height=H;var ox=o.getContext("2d"),OD=ox.createImageData(W,H),D=OD.data,lo=255,hi=0,G=new Uint8ClampedArray(W*H);
 for(var y=0;y<H;y++)for(var x=0;x<W;x++){var den=h[6]*x+h[7]*y+1,u=Math.round((h[0]*x+h[1]*y+h[2])/den),v=Math.round((h[3]*x+h[4]*y+h[5])/den),i=(y*W+x)*4;if(u<0||v<0||u>=W0||v>=H0){D[i]=D[i+1]=D[i+2]=255;D[i+3]=255;G[y*W+x]=255;continue}var j=(v*W0+u)*4;
  if(clean){var gy=0.299*SD[j]+0.587*SD[j+1]+0.114*SD[j+2];G[y*W+x]=gy;if(gy<lo)lo=gy;if(gy>hi)hi=gy}else{D[i]=SD[j];D[i+1]=SD[j+1];D[i+2]=SD[j+2]}D[i+3]=255}
 if(clean){var hist=new Array(256).fill(0);for(var k=0;k<G.length;k++)hist[G[k]|0]++;var acc=0,p5=0,p95=255;for(var b=0;b<256;b++){acc+=hist[b];if(acc<G.length*0.02)p5=b;if(acc<G.length*0.6)p95=b}p95=Math.max(p95,p5+20);
  for(var k2=0;k2<G.length;k2++){var vv=(G[k2]-p5)/(p95-p5);vv=Math.max(0,Math.min(1,vv));vv=Math.pow(vv,1.8)*255;D[k2*4]=D[k2*4+1]=D[k2*4+2]=vv}}
 ox.putImageData(OD,0,0);return o}
function photoPopup(file,src){var url=URL.createObjectURL(file),img=new Image();img.onload=function(){photoEdit(img,src)};img.onerror=function(){toast("Could not read this image")};img.src=url}
function photoEdit(img,src){var W0=img.naturalWidth,H0=img.naturalHeight,cs=Math.min(1,560/Math.max(W0,H0)),cw=Math.round(W0*cs),ch=Math.round(H0*cs),C=[[0,0],[W0,0],[W0,H0],[0,H0]],m=0.04;C=[[W0*m,H0*m],[W0*(1-m),H0*m],[W0*(1-m),H0*(1-m)],[W0*m,H0*(1-m)]];
 modal('<div class="mt">'+(src==="camera"?"Photo of drawing":"Drawing image")+'</div><div class="ms">Drag the 4 orange corners to the paper corners to straighten it. Hand drawings and photos are <b>traced over</b> - lines are not converted automatically.</div><canvas id="phC" width="'+cw+'" height="'+ch+'" style="max-width:100%;touch-action:none;border:1px solid #ccc"></canvas>'+
 '<label class="fld"><input type="checkbox" id="phCl" checked> Clean up (grey + contrast)</label><label class="fld">Real width of the drawing area (approx., you calibrate after)<input id="phW" value="40\'"></label><div class="row"><button class="bb" id="phX">Cancel</button><button class="bb" id="phN">Use as is</button><button class="bb ok" id="phOk">Straighten &amp; place</button></div>',function(){
 var cv=$("phC"),x=cv.getContext("2d"),drag=-1;function draw(){x.drawImage(img,0,0,cw,ch);x.strokeStyle="#ea580c";x.lineWidth=2;x.beginPath();C.forEach(function(p,i){i?x.lineTo(p[0]*cs,p[1]*cs):x.moveTo(p[0]*cs,p[1]*cs)});x.closePath();x.stroke();C.forEach(function(p){x.fillStyle="#ea580c";x.beginPath();x.arc(p[0]*cs,p[1]*cs,9,0,7);x.fill()})}draw();
 function pos(e){var r=cv.getBoundingClientRect();return [(e.clientX-r.left)*cw/r.width/cs,(e.clientY-r.top)*ch/r.height/cs]}
 cv.onpointerdown=function(e){var p=pos(e),bd=1e9;C.forEach(function(c,i){var d=Math.hypot(c[0]-p[0],c[1]-p[1]);if(d<bd){bd=d;drag=i}});cv.setPointerCapture(e.pointerId)};cv.onpointermove=function(e){if(drag<0)return;var p=pos(e);C[drag]=[Math.max(0,Math.min(W0,p[0])),Math.max(0,Math.min(H0,p[1]))];draw()};cv.onpointerup=function(){drag=-1};
 function place(o){var wf=parseFI($("phW").value);if(!(wf>0))wf=40;var u=o.toDataURL("image/jpeg",0.82);closeModal();if(ulSet(u,o.width,o.height,{wft:wf,src:src}))calibStart()}
 $("phX").onclick=closeModal;$("phN").onclick=function(){var o=warpImage(img,[[0,0],[W0,0],[W0,H0],[0,H0]],$("phCl").checked);place(o)};$("phOk").onclick=function(){place(warpImage(img,C,$("phCl").checked))}})}
function calibStart(){UI.calib=[];setTool("ulcal");toast("Calibrate: tap two points on the drawing whose real distance you know")}
var _tt15u=toolTap;toolTap=function(w){if(UI.tool==="ulcal"){var P=UI.calib=UI.calib||[];P.push({x:w.x,y:w.y});render();if(P.length===2){var d0=Math.hypot(P[1].x-P[0].x,P[1].y-P[0].y);fiPopup("Real distance","Type the real distance between the two points you tapped",d0,function(v){if(!(v>0))return;var f=v/d0,a=P[0];ulScaleAbout(a,f);UI.calib=[];setTool("draw");toast("Scale set ("+fi(v)+"). Now draw walls over it - all tools work")})}return true}return _tt15u.apply(this,arguments)};
function ulScaleAbout(a,f){snapshot();var m=ulMeta(),imp=UI.impIds||null;if(m){m.x=a.x+(m.x-a.x)*f;m.y=a.y+(m.y-a.y)*f;m.w*=f;m.h*=f}
 /* also scale imported PDF geometry (editable lines/walls/text) */ if(imp){S.dlines.forEach(function(l){if(!imp[l.id])return;[l.a,l.b].forEach(function(p){p.x=a.x+(p.x-a.x)*f;p.y=a.y+(p.y-a.y)*f})});S.notes.forEach(function(n){if(!imp[n.id])return;n.x=a.x+(n.x-a.x)*f;n.y=a.y+(n.y-a.y)*f;n.h=(n.h||0.6)*f});S.pts.forEach(function(p){if(!imp["p"+p.id])return;p.x=a.x+(p.x-a.x)*f;p.y=a.y+(p.y-a.y)*f})}changed()}
var _du15u=drawUnderlay;drawUnderlay=function(){_du15u.apply(this,arguments);if(UI.tool==="ulcal"&&UI.calib)UI.calib.forEach(function(p){var q=w2s(p.x,p.y);g.fillStyle="#dc2626";g.beginPath();g.arc(q.x,q.y,6,0,7);g.fill()})};
/* ---------- PDF ---------- */
function pdfLib(){return new Promise(function(res,rej){if(window.pdfjsLib)return res(window.pdfjsLib);var srcs=["pdfjs/pdf.min.js","https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js"],i=0;
 (function next(){if(i>=srcs.length)return rej(new Error("PDF reader could not load (needs internet the first time)"));var s=document.createElement("script"),u=srcs[i++];s.src=u;s.onload=function(){if(!window.pdfjsLib)return next();pdfjsLib.GlobalWorkerOptions.workerSrc=u.replace("pdf.min.js","pdf.worker.min.js");res(pdfjsLib)};s.onerror=next;document.head.appendChild(s)})()})}
function mmul(m,n){return [m[0]*n[0]+m[2]*n[1],m[1]*n[0]+m[3]*n[1],m[0]*n[2]+m[2]*n[3],m[1]*n[2]+m[3]*n[3],m[0]*n[4]+m[2]*n[5]+m[4],m[1]*n[4]+m[3]*n[5]+m[5]]}
async function pdfExtract(buf,pageNo){var L=await pdfLib(),doc=await L.getDocument({data:buf}).promise,pg=await doc.getPage(pageNo||1),vp=pg.getViewport({scale:1}),ol=await pg.getOperatorList(),O=L.OPS,ctm=[1,0,0,1,0,0],st=[],lines=[],lw=1,lws=[],pend=[],H=vp.viewBox[3],X0=vp.viewBox[0],Y0=vp.viewBox[1];
 function T(x,y){return [ctm[0]*x+ctm[2]*y+ctm[4]-X0,H-(ctm[1]*x+ctm[3]*y+ctm[5]-Y0)]}var imgs=0;
 for(var i=0;i<ol.fnArray.length;i++){var fn=ol.fnArray[i],a=ol.argsArray[i];
  if(fn===O.save){st.push(ctm.slice());lws.push(lw)}else if(fn===O.restore){ctm=st.pop()||[1,0,0,1,0,0];lw=lws.length?lws.pop():1}else if(fn===O.transform)ctm=mmul(ctm,a);
  else if(fn===O.setLineWidth)lw=a[0];
  else if(fn===O.stroke||fn===O.closeStroke||fn===O.fill||fn===O.eoFill||fn===O.fillStroke||fn===O.eoFillStroke||fn===O.closeFillStroke||fn===O.closeEOFillStroke||fn===O.endPath){var fil=fn===O.fill||fn===O.eoFill,strk=!fil&&fn!==O.endPath,ew=(lw||0.5)*Math.sqrt(Math.abs(ctm[0]*ctm[3]-ctm[1]*ctm[2]));pend.forEach(function(l){l.w=fil?-1:ew;l.f=fn!==O.stroke&&fn!==O.closeStroke&&fn!==O.endPath;if(fn===O.endPath)l.skip=1});pend=[]}
  else if(fn===O.paintImageXObject||fn===O.paintJpegXObject||fn===O.paintInlineImageXObject)imgs++;
  else if(fn===O.constructPath){var ops=a[0],cs=a[1],k=0,cur=null,start=null,n0=lines.length;for(var j=0;j<ops.length;j++){var op=ops[j];
   if(op===O.moveTo){cur=T(cs[k],cs[k+1]);start=cur;k+=2}else if(op===O.lineTo){var p=T(cs[k],cs[k+1]);if(cur)lines.push([cur,p]);cur=p;k+=2}
   else if(op===O.curveTo){var p2=T(cs[k+4],cs[k+5]);if(cur)lines.push([cur,p2]);cur=p2;k+=6}else if(op===O.curveTo2||op===O.curveTo3){var p3=T(cs[k+2],cs[k+3]);if(cur)lines.push([cur,p3]);cur=p3;k+=4}
   else if(op===O.closePath){if(cur&&start)lines.push([cur,start]);cur=start}else if(op===O.rectangle){var x=cs[k],y=cs[k+1],w=cs[k+2],h=cs[k+3],A=T(x,y),B=T(x+w,y),C=T(x+w,y+h),D=T(x,y+h);lines.push([A,B],[B,C],[C,D],[D,A]);k+=4}}for(var q=n0;q<lines.length;q++)pend.push(lines[q])}}
 var tc=await pg.getTextContent(),texts=tc.items.filter(function(t){return t.str&&t.str.trim()}).map(function(t){var m=t.transform;return {s:t.str,x:m[4]-X0,y:H-(m[5]-Y0),h:Math.hypot(m[2],m[3])}});
 return {doc:doc,page:pg,n:doc.numPages,W:vp.viewBox[2]-X0,H:H-Y0,lines:lines.filter(function(l){return !l.skip&&Math.hypot(l[1][0]-l[0][0],l[1][1]-l[0][1])>0.3}),texts:texts,imgs:imgs}}
async function pdfRaster(pg){var vp=pg.getViewport({scale:1}),sc=Math.min(3,2400/Math.max(vp.width,vp.height)),v2=pg.getViewport({scale:sc}),c=document.createElement("canvas");c.width=Math.round(v2.width);c.height=Math.round(v2.height);await pg.render({canvasContext:c.getContext("2d"),viewport:v2}).promise;return c}
function pdfScaleGuess(texts){for(var i=0;i<texts.length;i++){var m=texts[i].s.match(/1\s*:\s*(\d{2,4})/);if(m)return +m[1]}return 0}
function pdfPopup(file){var r=new FileReader();r.onload=async function(){var buf=new Uint8Array(r.result);modal('<div class="mt">Import PDF</div><div class="ms" id="pdM">Reading '+esc(file.name)+'…</div><div class="row"><button class="bb" id="pdX">Close</button></div>',function(){$("pdX").onclick=closeModal});
 try{var X=await pdfExtract(buf.slice(),1),N=pdfScaleGuess(X.texts),vec=X.lines.length>=20;
  var h='<div class="ms">'+esc(file.name)+' · page 1 of '+X.n+' · <b>'+X.lines.length+'</b> vector lines, '+X.texts.length+' texts'+(X.imgs?', '+X.imgs+' image(s)':'')+'.</div>'+
  (vec?'<div class="ms" style="color:#166534">This is a <b>vector PDF</b> (from CAD / Revit / this app): lines become editable.</div>':'<div class="ms" style="color:#b45309">This looks like a <b>scanned / photo PDF</b>: it will be placed as a background to trace over. Automatic conversion of scans is not reliable.</div>')+
  '<label class="fld">Page<input id="pdP" type="number" min="1" max="'+X.n+'" value="1"></label><label class="fld">Drawing scale 1 : <input id="pdS" type="number" value="'+(N||100)+'"></label>'+(N?'<div class="ms">Scale 1:'+N+' read from the PDF.</div>':'<div class="ms">No scale found - you can calibrate with two points after import.</div>')+
  (vec?'<label class="fld"><input type="checkbox" id="pdW" checked> Convert line pairs to walls (best effort)</label><label class="fld"><input type="checkbox" id="pdT" checked> Skip border &amp; title block</label><label class="fld"><input type="checkbox" id="pdTx" checked> Bring texts (room names, notes)</label>':'')+
  '<label class="fld"><input type="checkbox" id="pdU" '+(vec?'':'checked')+'> Also place the page as a background</label>';
  $("mbox").innerHTML='<div class="mt">Import PDF</div>'+h+'<div class="row"><button class="bb" id="pdX">Cancel</button><button class="bb ok" id="pdOk">Import</button></div>';$("pdX").onclick=closeModal;
  $("pdOk").onclick=async function(){var pn=+$("pdP").value||1,sc=+$("pdS").value||100,opt={walls:$("pdW")&&$("pdW").checked,skipTB:$("pdT")&&$("pdT").checked,texts:$("pdTx")&&$("pdTx").checked,ul:$("pdU").checked};$("mbox").innerHTML='<div class="mt">Importing…</div>';
   try{var Y=pn===1?X:await pdfExtract(buf.slice(),pn);var res=pdfToModel(Y,sc,opt);if(opt.ul||!vec){var cv=await pdfRaster(Y.page),ft=Y.W*25.4/72*sc/304.8;ulSet(cv.toDataURL("image/jpeg",0.8),cv.width,cv.height,{wft:ft,src:"pdf"});if(res.o0){S.meta.ul.x=res.o0.x;S.meta.ul.y=res.o0.y;changed()}}
    closeModal();fitAll();render();modal('<div class="mt">PDF imported</div><div class="ms">'+(vec?res.lines+' editable lines, '+res.walls+' walls'+(res.texts?', '+res.texts+' texts':'')+'. Select / move / delete them like any drawing; new walls, columns and rooms snap to them.':'Placed as a background.')+'<br>If the size is not right, use <b>Calibrate</b>: tap two points and type the real distance.</div><div class="row"><button class="bb" id="piC">Calibrate</button><button class="bb ok" id="piOk">Start editing</button></div>',function(){$("piOk").onclick=closeModal;$("piC").onclick=function(){closeModal();calibStart()}})}
   catch(e){console.error(e);$("mbox").innerHTML='<div class="mt">Import failed</div><div class="ms">'+esc(e.message)+'</div><div class="row"><button class="bb" onclick="closeModal()">Close</button></div>'}}}
 catch(e){console.error(e);$("pdM").textContent="Could not read this PDF: "+e.message}};r.readAsArrayBuffer(file)}
/* convert PDF geometry to model (feet). y: page y-down == world y-down */
function pdfToModel(X,N,opt){var f=25.4/72*N/304.8,c=s2w(CW/2,CH/2),L=X.lines.slice();
 if(opt.skipTB){var Wp=X.W,Hp=X.H;L=L.filter(function(l){var len=Math.hypot(l[1][0]-l[0][0],l[1][1]-l[0][1]);if(len>0.6*Wp||len>0.8*Hp)return false;if(Wp>Hp*1.2&&Math.max(l[0][0],l[1][0])>Wp*0.795)return false;return Math.min(l[0][0],l[1][0])>Wp*0.035&&Math.min(l[0][1],l[1][1])>Hp*0.035&&Math.max(l[0][1],l[1][1])<Hp*0.965})}
 var xs=[],ys=[];L.forEach(function(l){xs.push(l[0][0],l[1][0]);ys.push(l[0][1],l[1][1])});var mx=xs.length?(Math.min.apply(null,xs)+Math.max.apply(null,xs))/2:0,my=ys.length?(Math.min.apply(null,ys)+Math.max.apply(null,ys))/2:0;
 function W(p){return {x:c.x+(p[0]-mx)*f,y:c.y+(p[1]-my)*f}}
 function toW(A){return A.map(function(l){return [W(l[0]),W(l[1])]}).filter(function(s){return Math.hypot(s[1].x-s[0].x,s[1].y-s[0].y)>0.02})}
 /* wall faces = the heaviest pen (or filled outlines); thin pens (dimensions, hatching, furniture) stay as lines */
 var mxw=0;L.forEach(function(l){if(l.w>mxw&&Math.hypot(l[1][0]-l[0][0],l[1][1]-l[0][1])*f>1.2)mxw=l.w});
 var heavy=L.filter(function(l){return l.w===undefined||l.w<0||l.w>=0.6*mxw}),light=L.filter(function(l){return !(l.w===undefined||l.w<0||l.w>=0.6*mxw)});
 var segsH=mergeLines(toW(heavy)),usedH=opt.walls?wallPairs(segsH):{walls:[],used:{}};
 if(opt.walls&&usedH.walls.length<3){segsH=mergeLines(toW(L));light=[];usedH=wallPairs(segsH)}
 var segs=segsH.concat(mergeLines(toW(light))),used=usedH;
 snapshot();var imp={},nw=0,nt=0;
 if(opt.walls&&used.walls.length){var W2=bridgeWalls(joinWallEnds(used.walls));W2.forEach(function(w){var a=ensurePoint({x:w.a.x,y:w.a.y}),b=ensurePoint({x:w.b.x,y:w.b.y});imp["p"+a]=1;imp["p"+b]=1;var s=addSeg(a,b,w.t>=8?"O":"I");if(s){setWallTh(s,w.t);nw++}});planarize();S.pts.forEach(function(p){imp["p"+p.id]=1})}
 var nl=0;segs.forEach(function(s,i){if(used.used[i])return;var d={id:nid(),a:{x:s[0].x,y:s[0].y},b:{x:s[1].x,y:s[1].y},st:"solid",imp:1};S.dlines.push(d);imp[d.id]=1;nl++});
 if(opt.texts)X.texts.forEach(function(t){if(opt.skipTB&&X.W>X.H*1.2&&t.x>X.W*0.795)return;var p=W([t.x,t.y]),n={id:nid(),x:p.x,y:p.y,t:t.s,h:Math.max(0.3,t.h*f)};S.notes.push(n);imp[n.id]=1;nt++});
 UI.impIds=imp;changed();return {lines:nl,walls:nw,texts:nt,o0:W([0,0])}}
function mergeLines(S0){var out=[],tolA=0.01,tolD=0.03;S0.forEach(function(s){var dx=s[1].x-s[0].x,dy=s[1].y-s[0].y,L=Math.hypot(dx,dy),u={x:dx/L,y:dy/L};if(u.x<-1e-9||(Math.abs(u.x)<1e-9&&u.y<0)){s=[s[1],s[0]];u={x:-u.x,y:-u.y}}
 for(var i=0;i<out.length;i++){var o=out[i];if(Math.abs(o.u.x*u.y-o.u.y*u.x)>tolA)continue;var px=s[0].x-o.a.x,py=s[0].y-o.a.y;if(Math.abs(px*o.u.y-py*o.u.x)>tolD)continue;var t0=px*o.u.x+py*o.u.y,t1=(s[1].x-o.a.x)*o.u.x+(s[1].y-o.a.y)*o.u.y,lo=Math.min(t0,t1),hi=Math.max(t0,t1);if(lo>o.L+tolD||hi<-tolD)continue;
  var nlo=Math.min(0,lo),nhi=Math.max(o.L,hi);o.a={x:o.a.x+o.u.x*nlo,y:o.a.y+o.u.y*nlo};o.L=nhi-nlo;return}
 out.push({a:s[0],u:u,L:L})});return out.map(function(o){return [o.a,{x:o.a.x+o.u.x*o.L,y:o.a.y+o.u.y*o.L}]})}
/* parallel face pairs 3"-15" apart -> wall centre lines */
function wallPairs(segs){var walls=[],used={},info=segs.map(function(s){var dx=s[1].x-s[0].x,dy=s[1].y-s[0].y,L=Math.hypot(dx,dy);return {L:L,u:{x:dx/L,y:dy/L}}});
 var cand=[];for(var i=0;i<segs.length;i++){if(info[i].L<1.2)continue;for(var j=i+1;j<segs.length;j++){if(info[j].L<1.2)continue;var a=info[i],b=info[j];if(Math.abs(a.u.x*b.u.y-a.u.y*b.u.x)>0.017)continue;
  var px=segs[j][0].x-segs[i][0].x,py=segs[j][0].y-segs[i][0].y,dist=Math.abs(px*a.u.y-py*a.u.x);if(dist<0.28||dist>1.3)continue;
  var t0=px*a.u.x+py*a.u.y,t1=(segs[j][1].x-segs[i][0].x)*a.u.x+(segs[j][1].y-segs[i][0].y)*a.u.y,lo=Math.max(0,Math.min(t0,t1)),hi=Math.min(a.L,Math.max(t0,t1)),ov=hi-lo;if(ov<1||(ov<0.5*Math.min(a.L,b.L)&&ov<3))continue;cand.push({i:i,j:j,d:dist,lo:lo,hi:hi})}}
 var UI2={};function prj(k,P){var s=segs[k],u=info[k].u;return (P.x-s[0].x)*u.x+(P.y-s[0].y)*u.y}function busy(k,lo,hi){return (UI2[k]||[]).some(function(r){return Math.min(hi,r[1])-Math.max(lo,r[0])>0.3})}function take(k,lo,hi){(UI2[k]=UI2[k]||[]).push([lo,hi]);var cov=UI2[k].reduce(function(a,r){return a+r[1]-r[0]},0);if(cov>=0.5*info[k].L)used[k]=1}
 cand.sort(function(p,q){return p.d-q.d});cand.forEach(function(c){var s0=segs[c.i],u0=info[c.i].u,P0={x:s0[0].x+u0.x*c.lo,y:s0[0].y+u0.y*c.lo},P1={x:s0[0].x+u0.x*c.hi,y:s0[0].y+u0.y*c.hi},j0=prj(c.j,P0),j1=prj(c.j,P1),jl=Math.min(j0,j1),jh=Math.max(j0,j1);
  if(busy(c.i,c.lo,c.hi)||busy(c.j,jl,jh))return;take(c.i,c.lo,c.hi);take(c.j,jl,jh);var s=segs[c.i],u=info[c.i].u,n={x:-u.y,y:u.x},sgn=((segs[c.j][0].x-s[0].x)*n.x+(segs[c.j][0].y-s[0].y)*n.y)>0?1:-1,o=c.d/2*sgn;
  walls.push({a:{x:s[0].x+u.x*c.lo+n.x*o,y:s[0].y+u.y*c.lo+n.y*o},b:{x:s[0].x+u.x*c.hi+n.x*o,y:s[0].y+u.y*c.hi+n.y*o},t:snapTh(c.d*12)})});return {walls:walls,used:used}}
function snapTh(t){var C=[3,4,4.5,6,9,13.5],b=null;C.forEach(function(c){if(Math.abs(c-t)<=0.8&&(b===null||Math.abs(c-t)<Math.abs(b-t)))b=c});return b!==null?b:Math.round(t*2)/2}
/* join collinear walls of the same thickness across door / window gaps (<= 5 ft) so rooms close; re-place doors after import */
function bridgeWalls(W){var ch=true;while(ch){ch=false;for(var i=0;i<W.length&&!ch;i++)for(var j=i+1;j<W.length&&!ch;j++){var a=W[i],b=W[j];if(Math.abs(a.t-b.t)>0.6)continue;var ux=a.b.x-a.a.x,uy=a.b.y-a.a.y,La=Math.hypot(ux,uy);if(La<1e-6)continue;ux/=La;uy/=La;
  var vx=b.b.x-b.a.x,vy=b.b.y-b.a.y,Lb=Math.hypot(vx,vy);if(Lb<1e-6||Math.abs(ux*vy-uy*vx)/Lb>0.01)continue;var off=Math.abs((b.a.x-a.a.x)*uy-(b.a.y-a.a.y)*ux);if(off>0.06)continue;
  var t1=(b.a.x-a.a.x)*ux+(b.a.y-a.a.y)*uy,t2=(b.b.x-a.a.x)*ux+(b.b.y-a.a.y)*uy,lo=Math.min(t1,t2),hi=Math.max(t1,t2),gap=lo>La?lo-La:(hi<0?-hi:0);if(gap>5)continue;
  var nlo=Math.min(0,lo),nhi=Math.max(La,hi),A={x:a.a.x+ux*nlo,y:a.a.y+uy*nlo},B={x:a.a.x+ux*nhi,y:a.a.y+uy*nhi};W[i]={a:A,b:B,t:Math.max(a.t,b.t)};W.splice(j,1);ch=true}}return W}
/* extend wall ends to meet neighbouring wall centre lines (corners / tees) */
function joinWallEnds(W){W.forEach(function(w){["a","b"].forEach(function(e){var p=w[e],q=e==="a"?w.b:w.a,best=null,bd=1e9;W.forEach(function(o){if(o===w)return;var ux=p.x-q.x,uy=p.y-q.y,L=Math.hypot(ux,uy);ux/=L;uy/=L;var vx=o.b.x-o.a.x,vy=o.b.y-o.a.y,den=ux*vy-uy*vx;if(Math.abs(den)<0.2)return;
  var t=((o.a.x-p.x)*vy-(o.a.y-p.y)*vx)/den,s=((o.a.x-p.x)*uy-(o.a.y-p.y)*ux)/den;if(Math.abs(t)>Math.max(w.t,o.t)/12+0.15)return;if(s<-0.08||s>1.08)return;if(Math.abs(t)<bd){bd=Math.abs(t);best={x:p.x+ux*t,y:p.y+uy*t}}});if(best){p.x=best.x;p.y=best.y}})});return W}
/* ---------- share (WhatsApp etc.) ---------- */
async function shareBlob(blob,name,text){var f=null;try{f=new File([blob],name,{type:blob.type})}catch(e){}
 if(window.Android&&(typeof window.Android.endShare==="function"||typeof window.Android.shareFile==="function")){var r=new FileReader();r.onload=function(){var u=String(r.result),b64=u.slice(u.indexOf(",")+1),A=window.Android,CH=196608;
   if(typeof A.endShare==="function"){var id="sh_"+Date.now()+"_"+Math.random().toString(36).slice(2);A.beginSave(id,name,blob.type,b64.length);for(var i=0;i<b64.length;i+=CH)A.appendSave(id,b64.slice(i,i+CH));A.endShare(id,text||"")}else A.shareFile(name,b64,blob.type,text||"")};r.readAsDataURL(blob);return}
 if(f&&navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f],title:name,text:text||""});return}catch(e){if(e&&e.name==="AbortError")return}}
 saveFile(name,blob,blob.type);setTimeout(function(){window.open("https://wa.me/?text="+encodeURIComponent((text||"Drawing")+" - PDF saved on this device as "+name+", attach it in WhatsApp."),"_blank")},600);toast("PDF downloaded - attach it in WhatsApp")}
function sheetPDFBlob(list){var f=+S.meta.lw||1;return new Blob([bin(toPDF(list.map(function(s){return lwScaled(s.d,f)}),S.meta.paper||"A3"))],{type:"application/pdf"})}
function sheetByKey(k){var r=buildSheetSet();SHEET=SHEET||r;return r.list.find(function(s){return s.key===k})}
function exportSheetPDF(k,share){var sh=sheetByKey(k);if(!sh||!sh.d){toast("Sheet not ready");return}var b=sheetPDFBlob([sh]),nm=fname("pdf").replace(/\.pdf$/,"_"+(sh.no+"-"+sh.short).replace(/[^A-Za-z0-9]+/g,"-")+".pdf");if(share)shareBlob(b,nm,(S.meta.name||"Drawing")+" - "+sh.title);else saveFile(nm,b,"application/pdf")}
function shareAllPDF(){var r=buildSheetSet();shareBlob(sheetPDFBlob(r.list),fname("pdf"),(S.meta.name||"Drawing")+" - all drawings ("+r.list.length+" sheets)")}
/* hook import popup: PDF / image / camera / backups */
var _ir15=impRead;impRead=function(f){var ext=(f.name.split(".").pop()||"").toLowerCase();if(ext==="pdf"){closeModal();pdfPopup(f);return}if(/^(jpe?g|png|webp|heic)$/.test(ext)||/^image\//.test(f.type)){closeModal();photoPopup(f,"image");return}
 if(ext==="jksp"||ext==="json"){var r=new FileReader();r.onload=function(){closeModal();fioLoad(String(r.result),f.name,null)};r.readAsText(f);return}return _ir15.apply(this,arguments)};
var _ip15=importPopup;importPopup=function(){_ip15.apply(this,arguments);var i=$("impFile");if(i){i.accept=".pdf,.jpg,.jpeg,.png,.webp,.ifc,.dxf,.jksp,.json,.rvt,.rfa,.dwg,.ifczip,application/pdf,image/*";var lb=i.parentNode;if(lb&&lb.firstChild&&lb.firstChild.nodeType===3)lb.firstChild.textContent="Choose file (PDF, photo, DXF, IFC, backup)"}
 var mt=document.querySelector("#mbox .mt");if(mt)mt.textContent="Open / Import drawing"};
function pickFile(accept,capture,cb){var inp=document.createElement("input");inp.type="file";inp.accept=accept;if(capture)inp.setAttribute("capture",capture);inp.style.display="none";document.body.appendChild(inp);inp.onchange=function(){var f=inp.files&&inp.files[0];inp.remove();if(f)cb(f)};inp.click()}
function importPDFAction(){pickFile("application/pdf,.pdf",null,pdfPopup)}
function cameraAction(){pickFile("image/*","environment",function(f){photoPopup(f,"camera")})}
/* PWA share target / launch queue: open shared PDF */
if(window.launchQueue&&window.launchQueue.setConsumer)window.launchQueue.setConsumer(async function(p){if(p.files&&p.files.length){var f=await p.files[0].getFile();setTimeout(function(){impRead(f)},800)}});
/* Android: a PDF / photo / backup shared or opened from WhatsApp, Files etc. arrives in chunks from the app wrapper */
var JKIN={};window.jkInBegin=function(id){JKIN[id]=[]};window.jkInPart=function(id,s){(JKIN[id]=JKIN[id]||[]).push(s)};
window.jkInEnd=function(id,name,mime){var b64=(JKIN[id]||[]).join("");delete JKIN[id];try{var bin=atob(b64),u=new Uint8Array(bin.length);for(var i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);var f=new File([u],name||"shared.pdf",{type:mime||""});setTimeout(function(){impRead(f)},300);return "1"}catch(e){toast("Could not open the shared file");return "0"}};
