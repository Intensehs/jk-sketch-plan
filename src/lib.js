/* ---- Reused from JK Construction Building Plans v2 (helpers, metrics, Dwg, PDF/DXF writers) ---- */
function $(id){return document.getElementById(id)}
function num(v){var n=parseFloat(v);return isFinite(n)?n:NaN}
function fmt(n,d){if(d===undefined)d=2;return String(+(+n).toFixed(d))}
function f2(n){return (+n).toFixed(2)}
function today(){var d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function niceDate(s){if(!s)return "";var p=s.split("-");if(p.length!==3)return s;var M=["January","February","March","April","May","June","July","August","September","October","November","December"];return (+p[2])+" "+M[+p[1]-1]+" "+p[0]}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function ascii(s){return String(s).replace(/[\u2018\u2019]/g,"'").replace(/[\u201c\u201d]/g,'"').replace(/[\u2013\u2014]/g,"-").replace(/\u00d7/g,"x").replace(/[^\x20-\x7e]/g,"?")}

/* ---------- Helvetica metrics (AFM widths, chars 32..126) ---------- */
var HW=[278,278,355,556,556,889,667,222,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,222,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584];
function tw(s,size,bold){s=ascii(s);var w=0;for(var i=0;i<s.length;i++){var c=s.charCodeAt(i);w+=(c>=32&&c<=126)?HW[c-32]:556}return w/1000*size*(bold?1.06:1)}
function wrap(s,size,maxw,bold){var words=String(s).split(/\s+/),lines=[],cur="";words.forEach(function(w){var t=cur?cur+" "+w:w;if(tw(t,size,bold)>maxw&&cur){lines.push(cur);cur=w}else cur=t});if(cur)lines.push(cur);return lines}

/* ---------- Drawing primitives (page mm, A3 420x297, y down) ---------- */
function Dwg(){this.p=[];this.k=1;this.ox=0;this.oy=0;this.minX=0;this.minY=0}
Dwg.prototype.line=function(x1,y1,x2,y2,o){o=o||{};this.p.push({t:"line",x1:x1,y1:y1,x2:x2,y2:y2,w:o.w||0.25,c:o.c||"#000000",dash:o.dash,L:o.L||"TEXT",nodxf:o.nodxf})};
Dwg.prototype.poly=function(pts,o){o=o||{};this.p.push({t:"poly",pts:pts,closed:o.closed!==false,w:o.w===undefined?0.25:o.w,c:o.c||"#000000",fill:o.fill,dash:o.dash,L:o.L||"TEXT",nodxf:o.nodxf,solid:o.solid})};
Dwg.prototype.img=function(x,y,w,h,key){this.p.push({t:"img",x:x,y:y,w:w,h:h,key:key||"logo",nodxf:true})};
Dwg.prototype.rect=function(x,y,w,h,o){this.poly([[x,y],[x+w,y],[x+w,y+h],[x,y+h]],o)};
// text: (x,y) anchor point, s font size mm, a start|middle|end, v base|mid|top, rot deg ccw
Dwg.prototype.text=function(x,y,str,s,o){o=o||{};var r=(o.rot||0)*Math.PI/180,v=o.v||"base",off=v==="mid"?0.36*s:(v==="top"?0.74*s:0);
 this.p.push({t:"text",x:x+off*Math.sin(r),y:y+off*Math.cos(r),s:s,str:String(str),a:o.a||"start",rot:o.rot||0,bold:!!o.bold,c:o.c||"#000000",L:o.L||"TEXT",nodxf:o.nodxf})};
Dwg.prototype.W2P=function(X,Y){return [this.ox+(X-this.minX)*this.k,this.oy-(Y-this.minY)*this.k]};
Dwg.prototype.P2W=function(x,y){return [(x-this.ox)/this.k+this.minX,(this.oy-y)/this.k+this.minY]};
function arrowHead(d,x,y,ux,uy,len,o){var wdt=len*0.33;d.poly([[x,y],[x-ux*len-uy*wdt,y-uy*len+ux*wdt],[x-ux*len+uy*wdt,y-uy*len-ux*wdt]],{w:0.1,fill:o.c||"#000",c:o.c||"#000",L:o.L})}

var SCALES=[10,20,25,50,75,100,125,150,200,250,300,400,500,750,1000,1250,1500,2000,2500,5000,10000,20000];
function chooseScale(Wft,Hft,aw,ah){for(var i=0;i<SCALES.length;i++){var k=304.8/SCALES[i];if(Wft*k<=aw&&Hft*k<=ah)return SCALES[i]}return SCALES[SCALES.length-1]}

function frame(d,title,subtitle){
 d.rect(6,6,408,285,{w:0.6});d.rect(10,10,400,277,{w:0.35});
 d.rect(10,10,400,9,{w:0.25,fill:"#16365c",c:"#16365c"});
 d.text(14,16.3,APP.toUpperCase(),4,{bold:true,c:"#ffffff"});
 d.text(406,16.3,"CTAK Construction",3,{a:"end",c:"#ffffff"});
 d.text(150,28,title,6.5,{a:"middle",bold:true});
 if(subtitle)d.text(150,34.5,subtitle,3,{a:"middle",c:"#333333"});
 d.line(10,281,410,281,{w:0.25});
 d.text(14,285.3,"Prepared with "+APP+"  |  generated "+niceDate(today()),2.6,{c:"#444444"});
 d.text(406,285.3,"Not to be used for statutory measurement without site verification",2.4,{a:"end",c:"#666666"});
}
function northArrow(d,x,y){d.poly([[x,y],[x-4,y+13],[x,y+10],[x+4,y+13]],{w:0.3,fill:"#16365c",c:"#16365c"});d.poly([[x,y],[x+4,y+13],[x,y+10]],{w:0.3,fill:"#ffffff",c:"#16365c"});d.text(x,y-2,"N",5,{a:"middle",bold:true})}
function gscale(d,x,y,k,N){var cands=[1,2,5,10,20,25,50,100,200,500,1000],step=1;for(var i=0;i<cands.length;i++){if(cands[i]*k>=12){step=cands[i];break}}
 var seg=step*k;d.text(x,y-5,"GRAPHIC SCALE (feet)",2.6,{bold:true});
 for(var j=0;j<4;j++){d.rect(x+j*seg,y,seg,2.2,{w:0.25,fill:j%2?"#ffffff":"#000000"});d.text(x+j*seg,y+6,fmt(j*step),2.4,{a:"middle"})}
 d.text(x+4*seg,y+6,fmt(4*step)+" ft",2.4,{a:"middle"});
 d.text(x,y+11,"Scale 1:"+N+" on A3  (1:"+Math.round(N*Math.SQRT2)+" on A4)",2.6,{});}
function infoBox(d,x,y,w,head,rows,lab){var h=7+rows.length*5.2+2;d.rect(x,y,w,h,{w:0.35});d.rect(x,y,w,7,{w:0.35,fill:"#16365c",c:"#16365c"});d.text(x+w/2,y+4.9,head,3.3,{a:"middle",bold:true,c:"#ffffff"});
 rows.forEach(function(r,i){var yy=y+7+5.2*(i+1)-1.2;if(r.length===1){d.text(x+2,yy,r[0],2.7,{bold:r.bold})}else{d.text(x+2,yy,r[0],2.7,{c:"#333333"});d.text(x+(lab||30),yy,r[1],2.7,{bold:r.bold})}});return y+h}
function noteBox(d,x,y,w,head,lines,s,col){s=s||2.5;var all=[];lines.forEach(function(l){wrap(l,s,w-4).forEach(function(t){all.push(t)})});var h=7+all.length*s*1.35+2;
 d.rect(x,y,w,h,{w:0.35});d.text(x+w/2,y+5,head,3.1,{a:"middle",bold:true,c:col||"#000000"});all.forEach(function(t,i){d.text(x+2,y+7+(i+1)*s*1.35-0.5,t,s,{c:col||"#000000"})});return y+h}
function rectUnion(rects,holes){function uq(a){a.sort(function(p,q){return p-q});var o=[];a.forEach(function(v){if(!o.length||v-o[o.length-1]>1e-6)o.push(v)});return o}
 var xs=[],ys=[];rects.concat(holes).forEach(function(r){xs.push(r[0],r[2]);ys.push(r[1],r[3])});xs=uq(xs);ys=uq(ys);
 var nx=xs.length-1,ny=ys.length-1,cov=[];
 function inR(r,x,y){return x>r[0]&&x<r[2]&&y>r[1]&&y<r[3]}
 for(var j=0;j<ny;j++){cov.push([]);for(var i=0;i<nx;i++){var x=(xs[i]+xs[i+1])/2,y=(ys[j]+ys[j+1])/2,k=false;
  for(var q=0;q<rects.length&&!k;q++)if(inR(rects[q],x,y))k=true;if(k)for(q=0;q<holes.length;q++)if(inR(holes[q],x,y)){k=false;break}cov[j].push(k)}}
 function C(i,j){return i>=0&&j>=0&&i<nx&&j<ny&&cov[j][i]}
 var fills=[],segs=[];
 for(j=0;j<ny;j++){var s=-1;for(i=0;i<=nx;i++){if(C(i,j)){if(s<0)s=i}else if(s>=0){fills.push([xs[s],ys[j],xs[i],ys[j+1]]);s=-1}}}
 for(j=0;j<=ny;j++){s=-1;for(i=0;i<=nx;i++){var e=i<nx&&C(i,j-1)!==C(i,j);if(e){if(s<0)s=i}else if(s>=0){segs.push([xs[s],ys[j],xs[i],ys[j]]);s=-1}}}
 for(i=0;i<=nx;i++){s=-1;for(j=0;j<=ny;j++){e=j<ny&&C(i-1,j)!==C(i,j);if(e){if(s<0)s=j}else if(s>=0){segs.push([xs[i],ys[s],xs[i],ys[j]]);s=-1}}}
 return {fills:fills,segs:segs}}
function rgb(h){h=String(h||"#000").replace("#","");if(h.length===3)h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];if(!/^[0-9a-fA-F]{6}/.test(h))h="000000";return [0,2,4].map(function(i){return (parseInt(h.substr(i,2),16)/255).toFixed(3)}).join(" ")}
function pdfStr(s){return "("+ascii(s).replace(/\\/g,"\\\\").replace(/\(/g,"\\(").replace(/\)/g,"\\)")+")"}
/* PDF writer: one Dwg or an array of Dwgs (one page each); optional JPEG logo (DCTDecode) */
/* Stage: Export - PDF writer used by the Export PDF tool */
function toPDF(ds,paper){if(!Array.isArray(ds))ds=[ds];var sc=(paper==="A4"?1/Math.SQRT2:1)*72/25.4,PW=420*sc,PH=297*sc;function X(x){return (x*sc).toFixed(2)}function Y(y){return (PH-y*sc).toFixed(2)}
 var logo=(typeof LOGO_B64==="string"&&LOGO_B64.length>100)?atob(LOGO_B64):null,useImg=false;
 function content(d){var s=["1 J 1 j"];
 d.p.forEach(function(p){if(p.t==="img"){if(!logo)return;useImg=true;s.push("q "+(p.w*sc).toFixed(2)+" 0 0 "+(p.h*sc).toFixed(2)+" "+X(p.x)+" "+(PH-(p.y+p.h)*sc).toFixed(2)+" cm /Im1 Do Q");return}
  if(p.t==="text"){var r=p.rot*Math.PI/180,cs=Math.cos(r),sn=Math.sin(r),fs=p.s*sc,w=tw(p.str,p.s,p.bold),sh=p.a==="middle"?w/2:(p.a==="end"?w:0);
   var x=p.x-sh*cs,y=p.y+sh*sn;s.push("BT /"+(p.bold?"F2":"F1")+" "+fs.toFixed(2)+" Tf "+rgb(p.c)+" rg "+cs.toFixed(4)+" "+sn.toFixed(4)+" "+(-sn).toFixed(4)+" "+cs.toFixed(4)+" "+X(x)+" "+Y(y)+" Tm "+pdfStr(p.str)+" Tj ET");return}
  s.push((p.w*sc).toFixed(2)+" w "+rgb(p.c)+" RG "+(p.dash?"["+p.dash.map(function(v){return (v*sc).toFixed(2)}).join(" ")+"] 0 d":"[] 0 d"));
  if(p.t==="line"){s.push(X(p.x1)+" "+Y(p.y1)+" m "+X(p.x2)+" "+Y(p.y2)+" l S");return}
  var path=p.pts.map(function(q,i){return X(q[0])+" "+Y(q[1])+(i?" l":" m")}).join(" ")+(p.closed?" h":"");
  if(p.fill){s.push(rgb(p.fill)+" rg "+path+(p.w>0?" B":" f"))}else s.push(path+" S")});
 return s.join("\n")}
 var C=ds.map(content),n=ds.length,objs=[],kids=[];
 // 1 catalog, 2 pages, 3 F1, 4 F2, 5 info, 6 image, then page/content pairs
 objs.push("<< /Type /Catalog /Pages 2 0 R >>");objs.push(null);
 objs.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");objs.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
 objs.push("<< /Title "+pdfStr(APP)+" /Producer "+pdfStr(APP)+" /Creator "+pdfStr(APP)+" >>");
 objs.push(useImg?"<< /Type /XObject /Subtype /Image /Width "+LOGO_W+" /Height "+LOGO_H+" /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length "+logo.length+" >>\nstream\n"+logo+"\nendstream":"<< >>");
 C.forEach(function(c,i){var po=7+i*2;kids.push(po+" 0 R");
  objs.push("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 "+PW.toFixed(2)+" "+PH.toFixed(2)+"] /Resources << /Font << /F1 3 0 R /F2 4 0 R >>"+(useImg?" /XObject << /Im1 6 0 R >>":"")+" >> /Contents "+(po+1)+" 0 R >>");
  objs.push("<< /Length "+c.length+" >>\nstream\n"+c+"\nendstream")});
 objs[1]="<< /Type /Pages /Kids ["+kids.join(" ")+"] /Count "+n+" >>";
 var out="%PDF-1.4\n%\xe2\xe3\xcf\xd3\n",offs=[];objs.forEach(function(o,i){offs.push(out.length);out+=(i+1)+" 0 obj\n"+o+"\nendobj\n"});
 var xr=out.length;out+="xref\n0 "+(objs.length+1)+"\n0000000000 65535 f \n";offs.forEach(function(o){out+=String(o).padStart(10,"0")+" 00000 n \n"});
 out+="trailer\n<< /Size "+(objs.length+1)+" /Root 1 0 R /Info 5 0 R >>\nstartxref\n"+xr+"\n%%EOF\n";return out}
var LAYCOL={WALLFILL:8,TITLE:9,WALLS:7,DIMS:5,TEXT:7,OPENINGS:4,DOORS:1,WINDOWS:4,ROOMS:8,STAIRS:3,FURNITURE:30};
/* Stage: Export - DXF writer used by the Export DXF tool */
function toDXF(d,layers){var o=[];function g(c,v){o.push(String(c));o.push(String(v))}
 g(0,"SECTION");g(2,"HEADER");g(9,"$ACADVER");g(1,"AC1009");g(9,"$INSUNITS");g(70,2);g(9,"$MEASUREMENT");g(70,0);g(0,"ENDSEC");
 g(0,"SECTION");g(2,"TABLES");g(0,"TABLE");g(2,"LTYPE");g(70,1);g(0,"LTYPE");g(2,"CONTINUOUS");g(70,0);g(3,"Solid line");g(72,65);g(73,0);g(40,0.0);g(0,"ENDTAB");
 g(0,"TABLE");g(2,"LAYER");g(70,layers.length);layers.forEach(function(l){g(0,"LAYER");g(2,l);g(70,0);g(62,LAYCOL[l]||7);g(6,"CONTINUOUS")});g(0,"ENDTAB");
 g(0,"TABLE");g(2,"STYLE");g(70,1);g(0,"STYLE");g(2,"STANDARD");g(70,0);g(40,0.0);g(41,1.0);g(50,0.0);g(71,0);g(42,0.2);g(3,"txt");g(4,"");g(0,"ENDTAB");
 g(0,"ENDSEC");g(0,"SECTION");g(2,"ENTITIES");
 function W(x,y){var p=d.P2W(x,y);return [p[0].toFixed(4),p[1].toFixed(4)]}
 d.p.forEach(function(p){if(p.nodxf)return;var L=layers.indexOf(p.L)>=0?p.L:"TEXT";
  if(p.t==="line"){var a=W(p.x1,p.y1),b=W(p.x2,p.y2);g(0,"LINE");g(8,L);g(10,a[0]);g(20,a[1]);g(30,0);g(11,b[0]);g(21,b[1]);g(31,0)}
  else if(p.t==="poly"&&p.solid&&p.pts.length===4){var q0=W(p.pts[0][0],p.pts[0][1]),q1=W(p.pts[1][0],p.pts[1][1]),q2=W(p.pts[2][0],p.pts[2][1]),q3=W(p.pts[3][0],p.pts[3][1]);
   g(0,"SOLID");g(8,L);g(10,q0[0]);g(20,q0[1]);g(30,0);g(11,q1[0]);g(21,q1[1]);g(31,0);g(12,q3[0]);g(22,q3[1]);g(32,0);g(13,q2[0]);g(23,q2[1]);g(33,0)}
  else if(p.t==="poly"){g(0,"POLYLINE");g(8,L);g(66,1);g(10,0);g(20,0);g(30,0);g(70,p.closed?1:0);p.pts.forEach(function(q){var a=W(q[0],q[1]);g(0,"VERTEX");g(8,L);g(10,a[0]);g(20,a[1]);g(30,0)});g(0,"SEQEND");g(8,L)}
  else{var a=W(p.x,p.y),h=(p.s*0.72/d.k).toFixed(4);g(0,"TEXT");g(8,L);g(10,a[0]);g(20,a[1]);g(30,0);g(40,h);g(1,ascii(p.str));if(p.rot)g(50,p.rot.toFixed(3));g(7,"STANDARD");
   if(p.a!=="start"){g(72,p.a==="middle"?1:2);g(11,a[0]);g(21,a[1]);g(31,0)}}});
 g(0,"ENDSEC");g(0,"EOF");return o.join("\r\n")+"\r\n"}
function dataURLtoBlob(u){var i=u.indexOf(","),head=u.slice(5,i),b64=/;base64/.test(head),mime=head.split(";")[0]||"application/octet-stream",body=u.slice(i+1);
 if(!b64)return new Blob([decodeURIComponent(body)],{type:mime});var s=atob(body),a=new Uint8Array(s.length);for(var k=0;k<s.length;k++)a[k]=s.charCodeAt(k);return new Blob([a],{type:mime})}
function bin(s){var u=new Uint8Array(s.length);for(var i=0;i<s.length;i++)u[i]=s.charCodeAt(i)&255;return u}
