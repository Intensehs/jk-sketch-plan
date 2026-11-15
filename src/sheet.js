/* ================= v1.2 drawing sheets: A3 landscape, title block on the right (like a Revit / AutoCAD sheet) =================
   Sheet 1: Ground floor plan - thick walls, door swings, windows, rooms with clear sizes, furniture, stairs, dimensions.
   Sheet 2: Door & window details - 2D elevation + plan of each type, door/window schedule (sill / lintel), room & area schedule. */
var LOGO_B64="__LOGO_B64__",LOGO_W=__LOGO_W__,LOGO_H=__LOGO_H__,LOGO_IMG=null;
function logoImg(){if(!LOGO_IMG&&typeof Image!=="undefined"&&LOGO_B64.length>100){LOGO_IMG=new Image();LOGO_IMG.onload=function(){SHEET=SHEET;if(typeof render==="function")render()};LOGO_IMG.src="data:image/jpeg;base64,"+LOGO_B64}return LOGO_IMG}
logoImg();
function ang2page(dx,dy){var a=Math.atan2(-dy,dx)*180/Math.PI;if(a>90.001)a-=180;if(a<=-90.001)a+=180;return a}
var TBX=336;                           /* title block column: x 336..408 mm */
var DK="#111111",TL={L:"TITLE"};
function fsz(L){var t=Math.round(Math.abs(L)*12),f=Math.floor(t/12),i=t%12;return f+"'"+(i?i+'"':"")}
function fitT(d,x,y,str,s,maxW,o){str=String(str);var w=tw(str,s,o&&o.bold);if(w>maxW&&w>0)s=s*maxW/w;d.text(x,y,str,s,o)}
function nextDno(s){s=String(s||"A101");var m=s.match(/^(.*?)(\d+)(\D*)$/);if(!m)return s+"-2";var n=String(+m[2]+1);while(n.length<m[2].length)n="0"+n;return m[1]+n+m[3]}
function scaleTxt(N){return S.meta.paper==="A4"?"1 : "+Math.round(N*Math.SQRT2)+" @A4":"1 : "+N+" @A3"}
function revRows(){var m=S.meta,out=[];String(m.revs||"").split(/\n/).forEach(function(l){l=l.trim();if(!l)return;var p=l.split("|");if(p.length<2){var i=l.lastIndexOf(",");p=i>0?[l.slice(0,i),l.slice(i+1)]:[l,""]}out.push([p[0].trim(),(p[1]||"").trim()])});
 if(!out.length)out.push(["First issue",ddmmyy(m.date||today())]);return out}
function ddmmyy(s){var p=String(s||"").split("-");return p.length===3?p[2]+"/"+p[1]+"/"+p[0]:s}
function frameA(d){d.rect(5,5,410,287,{w:0.25,L:"TITLE"});d.rect(12,12,396,273,{w:0.7,L:"TITLE"});d.line(TBX,12,TBX,285,{w:0.7,L:"TITLE"})}
function compass(d,cx,cy,r){var c="#16365c",red="#c0392b";
 var circ=[];for(var i=0;i<=48;i++){var a=i/48*Math.PI*2;circ.push([cx+r*0.6*Math.cos(a),cy+r*0.6*Math.sin(a)])}d.poly(circ,{w:0.2,c:c,closed:false,L:"TITLE"});
 var circ2=circ.map(function(p){return [cx+(p[0]-cx)*0.82,cy+(p[1]-cy)*0.82]});d.poly(circ2,{w:0.12,c:c,closed:false,L:"TITLE"});
 [1,3,5,7,0,2,4,6].forEach(function(k){var a=-Math.PI/2+k*Math.PI/4,L=k%2?r*0.62:r,bw=k%2?r*0.1:r*0.17,ux=Math.cos(a),uy=Math.sin(a),px=-uy,py=ux,tip=[cx+ux*L,cy+uy*L];
  var l=[cx+px*bw,cy+py*bw],rr=[cx-px*bw,cy-py*bw],col=k===0?red:c;
  d.poly([[cx,cy],l,tip],{w:0.15,c:col,fill:col,L:"TITLE"});d.poly([[cx,cy],rr,tip],{w:0.15,c:col,fill:k===0?"#f3b2a9":"#ffffff",L:"TITLE"})});
 d.text(cx,cy-r-1.6,"N",3.6,{a:"middle",bold:true,L:"TITLE"})}
/* title block (right column). o: {title, dno, sheet, scale, RI} */
function tblock(d,o){var x=TBX,X2=408,w=X2-x,m=S.meta,RI=o.RI;
 function hl(y){d.line(x,y,X2,y,{w:0.35,L:"TITLE"})}
 function vl(xx,y0,y1){d.line(xx,y0,xx,y1,{w:0.25,L:"TITLE"})}
 function lab(xx,y,t){d.text(xx+1.3,y+2.7,t,1.75,{c:"#444444",L:"TITLE"})}
 function val(xx,y,ww,t,s,bold){fitT(d,xx+ww/2,y,ascii(t||"-"),s,ww-3,{a:"middle",bold:!!bold,L:"TITLE"})}
 // logo
 var lh=46,lw=lh*LOGO_W/LOGO_H;d.img(x+(w-lw)/2,14.5,lw,lh);hl(63);
 // north arrow
 compass(d,x+w/2,84.5,14);d.text(x+1.3,65.7,"NORTH",1.75,{c:"#444444",L:"TITLE"});hl(105);
 // revision table
 var c1=x+10,c2=x+50,y=105,rh=4.6;d.rect(x,y,w,5.6,{w:0,fill:"#e8edf3",L:"TITLE",nodxf:true});d.text(x+5,y+4,"No.",2.1,{a:"middle",bold:true,L:"TITLE"});d.text((c1+c2)/2,y+4,"Description",2.1,{a:"middle",bold:true,L:"TITLE"});d.text((c2+X2)/2,y+4,"Date",2.1,{a:"middle",bold:true,L:"TITLE"});
 hl(y+5.6);var R=revRows();for(var i=0;i<7;i++){var yy=y+5.6+(i+1)*rh;d.line(x,yy,X2,yy,{w:0.12,c:"#888888",L:"TITLE"});var r=R[i];if(r){d.text(x+5,yy-1.3,String(i+1),2,{a:"middle",L:"TITLE"});fitT(d,c1+1,yy-1.3,ascii(r[0]),2,c2-c1-2,{L:"TITLE"});fitT(d,(c2+X2)/2,yy-1.3,ascii(r[1]),2,X2-c2-2,{a:"middle",L:"TITLE"})}}
 vl(c1,y,y+5.6+7*rh);vl(c2,y,y+5.6+7*rh);y=y+5.6+7*rh;hl(y);
 // walls + areas
 var rows=[["WALLS",thA(m.tout)+" outer / "+thA(m.tin)+" inner"],["BUILT-UP AREA",sq(RI.plinth)+" sq.ft ("+f2(RI.plinth*0.09290304)+" sq.m)"],["CARPET AREA",sq(RI.carpet)+" sq.ft"]];
 rows.forEach(function(r,i){var yy=y+i*7;d.text(x+1.3,yy+2.7,r[0],1.75,{c:"#444444",L:"TITLE"});fitT(d,X2-1.5,yy+6,r[1],2.4,w-4,{a:"end",bold:true,L:"TITLE"});if(i)d.line(x,yy,X2,yy,{w:0.12,c:"#888888",L:"TITLE"})});
 y+=21;hl(y);
 // project / title / client
 lab(x,y,"PROJECT");val(x,y+12,w,m.proj||m.name||"Residence",4.2);y+=17;hl(y);
 lab(x,y,"TITLE");val(x,y+12.5,w,o.title,4.6);y+=18;hl(y);
 lab(x,y,"CLIENT");val(x,y+11.5,w,m.owner||"-",4.2);y+=16;hl(y);
 // drawn / checked / date
 var w3=w/3;["DRAWN BY","CHECKED BY","DATE"].forEach(function(t,i){lab(x+i*w3,y,t)});vl(x+w3,y,y+12);vl(x+2*w3,y,y+12);
 val(x,y+9,w3,m.drawn||"-",2.3);val(x+w3,y+9,w3,m.chk||"-",2.3);val(x+2*w3,y+9,w3,ddmmyy(m.date||today()),2.3);y+=12;hl(y);
 // scale / site
 var ws=w*0.42;lab(x,y,"SCALE");lab(x+ws,y,"SITE / LOCATION");vl(x+ws,y,y+12);val(x,y+9,ws,o.scale,2.6,true);val(x+ws,y+9,w-ws,m.site||"-",2.2);y+=12;hl(y);
 // drawing number / sheet
 var wn=w-17;lab(x,y,"DRAWING NUMBER");lab(x+wn,y,"SHEET");vl(x+wn,y,y+18);val(x,y+13.5,wn,o.dno,7,true);val(x+wn,y+12.5,17,o.sheet,3,true);y+=18;hl(y);
 // notes
 ["All dimensions in feet and inches.","Room sizes are clear inside sizes.","Do not scale - verify all sizes at site."].forEach(function(t,i){d.text(x+1.5,y+4+i*3.2,t,1.85,{c:"#333333",L:"TITLE"})});
 d.text(x+1.5,283,APP+" v"+VERSION+" - "+(m.drawn||"JK Construction"),1.6,{c:"#777777",L:"TITLE"})}
/* simple table; cols=[[title,width,align]], rows=[[...]] ; returns bottom y */
function table(d,x,y,cols,rows,o){o=o||{};var rh=o.rh||4.8,W=cols.reduce(function(a,c){return a+c[1]},0),hh=6;
 d.rect(x,y,W,hh,{w:0.3,fill:"#16365c",c:"#16365c",nodxf:true});var cx=x;cols.forEach(function(c){fitT(d,cx+c[1]/2,y+4.2,c[0],2.15,c[1]-1.5,{a:"middle",bold:true,c:"#ffffff",nodxf:true});cx+=c[1]});
 rows.forEach(function(r,i){var yy=y+hh+(i+1)*rh;if(r.bg)d.rect(x,yy-rh,W,rh,{w:0,fill:r.bg,nodxf:true});var cx2=x;cols.forEach(function(c,j){var t=r[j]==null?"":String(r[j]),al=c[2]||"middle";
   fitT(d,al==="start"?cx2+1.2:cx2+c[1]/2,yy-1.45,ascii(t),2.05,c[1]-2,{a:al,bold:!!r.bold||(j===0&&o.boldFirst),c:(r.cols&&r.cols[j])||"#000000",nodxf:true});cx2+=c[1]});
  d.line(x,yy,x+W,yy,{w:0.1,c:"#999999",nodxf:true})});
 var H=hh+rows.length*rh;d.rect(x,y,W,H,{w:0.3,nodxf:true});cx=x;cols.forEach(function(c,i){if(i)d.line(cx,y,cx,y+H,{w:0.12,c:"#777777",nodxf:true});cx+=c[1]});
 if(o.title)d.text(x,y-1.6,o.title,2.8,{bold:true,nodxf:true});return y+H}

/* Stage: Sheets - plan sheet with CTAK title block (Export PDF/DXF/PNG) */
function buildSheet(O){O=O||{};
 var d=new Dwg(),d2=new Dwg(),RI=roomsInfo(),m=S.meta,dbl=m.dbl,A4=m.paper==="A4";
 frameA(d);frameA(d2);
 var TT=planTitle(O),DN=O.dno||m.dno||"A101",SH=O.sheet||"1 / 2";
 if(!S.pts.length){d.text(170,150,"(empty drawing)",6,{a:"middle",c:"#888888"});tblock(d,{title:TT,dno:DN,sheet:SH,scale:"-",RI:RI});tblock(d2,{title:"Door & Window Details",dno:nextDno(m.dno),sheet:"2 / 2",scale:"As shown",RI:RI});return {d:d,d2:d2,RI:RI,N:0}}
 // extents to the outer faces of the walls
 var wx0=Infinity,wy0=Infinity,wx1=-Infinity,wy1=-Infinity;function ext(p){wx0=Math.min(wx0,p.x);wy0=Math.min(wy0,p.y);wx1=Math.max(wx1,p.x);wy1=Math.max(wy1,p.y)}
 S.pts.forEach(ext);planExt(ext);if(dbl)S.segs.forEach(function(s){var P=wallPoly(s);if(P)P.forEach(ext)});
 var Wf=Math.max(wx1-wx0,1),Hf=Math.max(wy1-wy0,1);
 /* room for overall + chain dimensions on top / left, chain only on bottom / right */
 var ax0=16+25,ax1=TBX-4-13,ay0=16+24,ay1=264-13,N=chooseScale(Wf,Hf,ax1-ax0,ay1-ay0),k=304.8/N;
 d.k=k;d.minX=wx0;d.minY=-wy1;d.ox=(ax0+ax1)/2-Wf*k/2;d.oy=(ay0+ay1)/2+Hf*k/2;
 function R(x,y){return d.W2P(x,-y)}
 function RP(p){return R(p.x,p.y)}
 var G=S.ops.map(function(o){var q=opWorld(o);if(q){q.o=o;q.T=dbl?wallT(q.s):0.5}return q}).filter(Boolean);
 // ---- walls: union of thick wall rectangles minus openings -> clean double lines + solid fill ----
 var _wb=function(){if(dbl){var rects=[],holes=[],oblique=[];
  var FCo=(typeof fillOn==="function"&&fillOn())?function(q){var A=pt(q.a),B=pt(q.b);return Math.abs(A.x-B.x)<1e-6||Math.abs(A.y-B.y)<1e-6}:null;
  S.segs.forEach(function(s){var a=pt(s.a),b=pt(s.b),t=wallT(s)/2,e0=nodeExt(s,s.a,FCo),e1=nodeExt(s,s.b,FCo);
   if(Math.abs(a.y-b.y)<1e-6){var lo=a.x<b.x?[a.x-e0,b.x+e1]:[b.x-e1,a.x+e0];rects.push([lo[0],a.y-t,lo[1],a.y+t])}
   else if(Math.abs(a.x-b.x)<1e-6){var lo2=a.y<b.y?[a.y-e0,b.y+e1]:[b.y-e1,a.y+e0];rects.push([a.x-t,lo2[0],a.x+t,lo2[1]])}
   else oblique.push(s)});
  G.forEach(function(q){var t=q.T/2+0.03;if(Math.abs(q.u.y)<1e-6)holes.push([Math.min(q.p0.x,q.p1.x),q.c.y-t,Math.max(q.p0.x,q.p1.x),q.c.y+t]);else if(Math.abs(q.u.x)<1e-6)holes.push([q.c.x-t,Math.min(q.p0.y,q.p1.y),q.c.x+t,Math.max(q.p0.y,q.p1.y)])});
  var U=rectUnion(rects,holes);
  U.fills.forEach(function(f){var a=R(f[0],f[1]),b=R(f[2],f[3]);d.poly([a,[b[0],a[1]],b,[a[0],b[1]]],{w:0,fill:"#3a3a3a",L:"WALLFILL",solid:true})});
  U.segs.forEach(function(sg){var a=R(sg[0],sg[1]),b=R(sg[2],sg[3]);d.line(a[0],a[1],b[0],b[1],{w:0.45,c:DK,L:"WALLS"})});
  /* Stage: Filled corners - sheets (PDF / PNG / DXF): straight walls already merge; sloped joins get filled patches */
  if(typeof fillOn==="function"&&fillOn()&&oblique.length){var isOb=function(q){return oblique.indexOf(q)>=0},CP=cornerPatches(isOb).filter(function(c){return isOb(c.a)||isOb(c.b)}),PP=CP.map(function(c){var P=c.P.map(RP);if(P.length===3)P.push(P[2]);return P}),OP=oblique.map(function(s){return wallPolyF(s).map(RP)}),SP=[];
   CP.forEach(function(c){[c.a,c.b].forEach(function(q){if(isOb(q))return;var A=pt(q.a),B=pt(q.b),fromA=Math.hypot(A.x-c.N.x,A.y-c.N.y)<0.02,o=fromA?B:A,L=Math.hypot(o.x-c.N.x,o.y-c.N.y),h=wallT(q)/2,k=Math.min(L,4*h)/L,u={x:(o.x-c.N.x)*k,y:(o.y-c.N.y)*k},n={x:-(o.y-c.N.y)/L*h,y:(o.x-c.N.x)/L*h};
    SP.push([RP({x:c.N.x+n.x,y:c.N.y+n.y}),RP({x:c.N.x+u.x+n.x,y:c.N.y+u.y+n.y}),RP({x:c.N.x+u.x-n.x,y:c.N.y+u.y-n.y}),RP({x:c.N.x-n.x,y:c.N.y-n.y})])})});
   OP.forEach(function(P){d.poly(P,{w:0.45,c:DK,L:"WALLS"})});PP.forEach(function(P){d.poly(P,{w:0.45,c:DK,L:"WALLS",nodxf:true})});
   OP.concat(PP).forEach(function(P){d.poly(P,{w:0,fill:"#3a3a3a",L:"WALLFILL",solid:true})});SP.forEach(function(P){d.poly(P,{w:0,fill:"#3a3a3a",L:"WALLFILL",solid:true,nodxf:true})})}
  else oblique.forEach(function(s){var P=wallPoly(s).map(RP);d.poly(P,{w:0.45,c:DK,fill:"#3a3a3a",L:"WALLS"})})}
 else S.segs.forEach(function(s){var a=RP(pt(s.a)),b=RP(pt(s.b));d.line(a[0],a[1],b[0],b[1],{w:0.7,c:DK,L:"WALLS"})});
 };if(typeof fillOn==="function"&&fillOn())withFillGeom(_wb);else _wb();
 // ---- furniture, staircase ----
 if(visOn("furn"))(S.furn||[]).forEach(function(f){drawFurnSheet(d,R,f)});
 stairsSheet(d,RP,RI);if(typeof kcSheet==="function"&&visOn("furn"))kcSheet(d,RP);
 // ---- openings ----
 var cnt={MD:0,D:0,TD:0,OP:0,W:0,V:0};
 G.forEach(function(q){var o=q.o,T=q.T,col=opCol(o),LY=opLayer(o),n=q.n,u=q.u,c=q.c,w=q.w,O={w:0.2,c:DK,L:LY};if(!MARKG||!o._mark)o._mark=opKind(o)+(++cnt[opKind(o)]);
  function P(along,across){return R(c.x+u.x*along+n.x*across,c.y+u.y*along+n.y*across)}
  function L(a0,c0,a1,c1,oo){var A=P(a0,c0),B=P(a1,c1);d.line(A[0],A[1],B[0],B[1],oo||O)}
  d.poly([P(-w/2,-T/2),P(w/2,-T/2),P(w/2,T/2),P(-w/2,T/2)],{w:0,fill:"#ffffff",nodxf:true});
  if(dbl){L(-w/2,-T/2,-w/2,T/2,{w:0.45,c:DK,L:"WALLS"});L(w/2,-T/2,w/2,T/2,{w:0.45,c:DK,L:"WALLS"})}
  if(o.type==="W"){L(-w/2,-T/2,w/2,-T/2,{w:0.25,c:DK,L:LY});L(-w/2,0,w/2,0,{w:0.18,c:DK,L:LY});L(-w/2,T/2,w/2,T/2,{w:0.25,c:DK,L:LY})}
  else if(o.type==="V"){L(-w/2,-T/2,w/2,-T/2,{w:0.2,c:DK,L:LY});L(-w/2,0,w/2,0,{w:0.15,c:DK,L:LY,dash:[0.8,0.6]});L(-w/2,T/2,w/2,T/2,{w:0.2,c:DK,L:LY})}
  else if(o.dk==="OP"){L(-w/2,-T/2,w/2,-T/2,{w:0.18,c:DK,L:LY,dash:[1.2,0.8]});L(-w/2,T/2,w/2,T/2,{w:0.18,c:DK,L:LY,dash:[1.2,0.8]})}
  else{var sd=o.flip?-1:1,h=o.hinge?w/2:-w/2,e=-h,v0=sd*T/2,dir=e>h?1:-1,lt=Math.min(1.5/12,w*0.06);
   d.poly([P(h,v0),P(h,v0+sd*w),P(h+dir*lt,v0+sd*w),P(h+dir*lt,v0)],{w:o.dk==="MD"?0.35:0.28,c:DK,fill:"#ffffff",L:LY});
   var arc=[];for(var i=0;i<=24;i++){var th=i/24*Math.PI/2;arc.push(P(h+(e-h)*Math.cos(th),v0+sd*w*Math.sin(th)))}d.poly(arc,{w:0.16,c:DK,closed:false,L:LY})}
  var sd2=o.type==="D"?-(o.flip?-1:1):1,lp=P(0,sd2*(T/2+2.6/k));d.text(lp[0],lp[1],o._mark,2.3,{a:"middle",v:"mid",bold:true,c:col,L:LY,rot:ang2page(u.x,u.y)});
  var lp2=P(0,sd2*(T/2+5.2/k));d.text(lp2[0],lp2[1],o.type==="D"?fi(o.w)+" x "+fi(opH(o)):"SILL "+lvl(opSill(o)),1.6,{a:"middle",v:"mid",c:"#555555",L:LY,rot:ang2page(u.x,u.y)})});
 planExtras(d,R,k);
 // ---- dimensions: wall-wise (centre-line) chain outside + overall to outer faces ----
 var dc="#1a1a1a";
 function insideAny(x,y){return RI.faces.some(function(f){return inPoly(x,y,f.pts)})}
 function tick(x,y,ux,uy,s){var nx=-uy,ny=ux;d.line(x-(ux+nx)*s,y-(uy+ny)*s,x+(ux+nx)*s,y+(uy+ny)*s,{w:0.3,c:dc,L:"DIMS"})}
 if(visOn("dims"))S.segs.forEach(function(s){var a=pt(s.a),b=pt(s.b),L=segLen(s);if(L<0.3)return;var u={x:(b.x-a.x)/L,y:(b.y-a.y)/L},n={x:-u.y,y:u.x},mm={x:(a.x+b.x)/2,y:(a.y+b.y)/2},e=0.35;
  var i1=insideAny(mm.x+n.x*e,mm.y+n.y*e),i2=insideAny(mm.x-n.x*e,mm.y-n.y*e);if(i1&&i2)return;if(!i1&&!i2&&RI.faces.length)return;
  var t=dbl?wallT(s)/2:0,rot=ang2page(u.x,u.y),sg=i1?-1:1,off=t+7/k,A=R(a.x+n.x*sg*off,a.y+n.y*sg*off),B=R(b.x+n.x*sg*off,b.y+n.y*sg*off);
  d.line(A[0],A[1],B[0],B[1],{w:0.18,c:dc,L:"DIMS"});
  [a,b].forEach(function(p){var e0=R(p.x+n.x*sg*(t+1.2/k),p.y+n.y*sg*(t+1.2/k)),e1=R(p.x+n.x*sg*(off+1.5/k),p.y+n.y*sg*(off+1.5/k));d.line(e0[0],e0[1],e1[0],e1[1],{w:0.13,c:dc,L:"DIMS"})});
  var pu=[B[0]-A[0],B[1]-A[1]],pl=Math.hypot(pu[0],pu[1]);tick(A[0],A[1],pu[0]/pl,pu[1]/pl,0.9);tick(B[0],B[1],pu[0]/pl,pu[1]/pl,0.9);
  var tp=R(mm.x+n.x*sg*(off+1.3/k),mm.y+n.y*sg*(off+1.3/k));d.text(tp[0],tp[1],fi(L),2.3,{a:"middle",v:"mid",c:dc,L:"DIMS",rot:rot})});
 var o0=R(wx0,wy0),o1=R(wx1,wy1),yy=o0[1]-17,xx=o0[0]-17;
 d.line(o0[0],yy,o1[0],yy,{w:0.22,c:dc,L:"DIMS"});tick(o0[0],yy,1,0,1.1);tick(o1[0],yy,1,0,1.1);d.line(o0[0],yy-1.5,o0[0],o0[1]-1.2,{w:0.12,c:dc,L:"DIMS"});d.line(o1[0],yy-1.5,o1[0],o0[1]-1.2,{w:0.12,c:dc,L:"DIMS"});
 d.text((o0[0]+o1[0])/2,yy-1.4,fi(Wf).replace("'-","' - "),2.8,{a:"middle",bold:true,c:dc,L:"DIMS"});
 d.line(xx,o0[1],xx,o1[1],{w:0.22,c:dc,L:"DIMS"});tick(xx,o0[1],0,1,1.1);tick(xx,o1[1],0,1,1.1);d.line(xx-1.5,o0[1],o0[0]-1.2,o0[1],{w:0.12,c:dc,L:"DIMS"});d.line(xx-1.5,o1[1],o0[0]-1.2,o1[1],{w:0.12,c:dc,L:"DIMS"});
 d.text(xx-1.4,(o0[1]+o1[1])/2,fi(Hf).replace("'-","' - "),2.8,{a:"middle",bold:true,c:dc,L:"DIMS",rot:90});
 // ---- room names + clear sizes ----
 var un=0,sched=[];
 if(visOn("rooms"))RI.faces.forEach(function(f){var lab=f.labels[0],name=lab?lab.name:"Room "+(++un),at=lab?R(lab.x,lab.y):R(f.cx,f.cy);
  var l1=ascii(name).toUpperCase(),l2=(f.rect?"":"~")+fsz(f.cw)+" X "+fsz(f.ch),l3=sq(f.carpet)+" sq.ft";
  var s=Math.min(3.2,0.85*f.cw*k/Math.max(tw(l1,1,true),tw(l2,1)),f.ch*k/5.2);s=Math.max(s,1.3);
  d.text(at[0],at[1]-s*0.75,l1,s,{a:"middle",v:"mid",bold:true,L:"TEXT"});d.text(at[0],at[1]+s*0.6,l2,s*0.88,{a:"middle",v:"mid",L:"TEXT"});d.text(at[0],at[1]+s*1.75,l3,s*0.68,{a:"middle",v:"mid",c:"#555555",L:"TEXT"});
  sched.push({name:name,f:f});
  f.labels.slice(1).forEach(function(l2b){var q=R(l2b.x,l2b.y);d.text(q[0],q[1],ascii(l2b.name).toUpperCase(),2.4,{a:"middle",v:"mid",bold:true})})});
 S.labels.filter(function(l){return !LABF[l.id]}).forEach(function(l){var q=R(l.x,l.y);d.text(q[0],q[1],ascii(l.name).toUpperCase(),2.6,{a:"middle",v:"mid",bold:true,c:"#555555"})});
 // ---- view title + graphic scale ----
 var vt=ascii(TT).toUpperCase(),vc=[22,273];var cc=[];for(var i2=0;i2<=36;i2++){var a2=i2/36*Math.PI*2;cc.push([vc[0]+4.2*Math.cos(a2),vc[1]+4.2*Math.sin(a2)])}
 d.poly(cc,{w:0.35,closed:false,nodxf:true});d.text(vc[0],vc[1]+1.3,"1",3.6,{a:"middle",bold:true,nodxf:true});var vw=Math.max(tw(vt,4.2,true),60);d.line(vc[0]+4.2,vc[1],vc[0]+8+vw,vc[1],{w:0.5,nodxf:true});
 d.text(vc[0]+7,vc[1]-1.4,vt,4.2,{bold:true,nodxf:true});d.text(vc[0]+7,vc[1]+4.4,"SCALE "+scaleTxt(N),2.4,{nodxf:true});
 var gst=[1,2,5,10,20,25,50,100,200,500,1000].find(function(v){return v*k>=12})||1;gscale(d,TBX-12-4*gst*k-8,266,k,N);
 tblock(d,{title:TT,dno:DN,sheet:SH,scale:scaleTxt(N),RI:RI});
 if(!O.noD2)sheet2(d2,G,RI,sched);
 return {d:d,d2:d2,RI:RI,N:N}}

/* ================= sheet 2: door & window 2D details ================= */
function opLoc(q,RI){RI=q.RI||RI;var out=[];[1,-1].forEach(function(sg){var off=q.T/2+0.6,x=q.c.x+q.n.x*off*sg,y=q.c.y+q.n.y*off*sg,f=faceAt(x,y,RI.faces);var nm=f?(f.labels[0]?f.labels[0].name:"Room"):"Outside";if(out.indexOf(nm)<0)out.push(nm)});return out}
function sheet2(d,G,RI,sched,O){var m=S.meta;O=O||{};
 tblock(d,{title:O.title||"Door & Window Details",dno:O.dno||nextDno(m.dno||"A101"),sheet:O.sheet||"2 / 2",scale:"As shown",RI:RI});
 // groups by kind + size + levels
 var grp={},ord=[];G.forEach(function(q){var o=q.o,kd=opKind(o),key=kd+"|"+fi(o.w)+"|"+fi(opH(o))+"|"+fi(opSill(o));if(!grp[key]){grp[key]={key:key,kind:kd,o:o,q:q,w:q.w,h:opH(o),sill:opSill(o),marks:[],locs:[],T:q.T};ord.push(key)}
  var g2=grp[key];g2.marks.push(o._mark);opLoc(q,RI).forEach(function(l){if(g2.locs.indexOf(l)<0)g2.locs.push(l)})});
 ord.sort(function(a,b){var d0=OK5.indexOf(grp[a].kind)-OK5.indexOf(grp[b].kind);return d0||grp[b].w-grp[a].w});
 var GS=ord.map(function(k2){return grp[k2]});
 function mk(g2){return g2.marks.length>2?g2.marks[0]+" - "+g2.marks[g2.marks.length-1]:g2.marks.join(", ")}
 d.text(18,20.5,"DOOR & WINDOW DETAILS - ELEVATION & PLAN",3.8,{bold:true});
 var X0=16,X1=TBX-4,Y0=25,Y1=176;
 if(!GS.length){d.rect(X0,Y0,X1-X0,Y1-Y0,{w:0.2,c:"#999999"});d.text((X0+X1)/2,(Y0+Y1)/2,"No doors / windows added yet - use the Door/Win tool.",4,{a:"middle",c:"#888888"})}
 else{var shown=GS.slice(0,12),n=shown.length,rows=n<=6?1:2,cols=Math.ceil(n/rows),cw=(X1-X0)/cols,ch=(Y1-Y0)/rows;
  var maxW=0,maxL=0,maxP=0;shown.forEach(function(g2){maxW=Math.max(maxW,g2.w);maxL=Math.max(maxL,g2.sill+g2.h);maxP=Math.max(maxP,g2.T+(g2.kind==="W"||g2.kind==="V"?0.6:g2.w))});
  var needH=(maxL+1.35)+(maxP+0.4),needW=maxW+2,ks=Math.min((ch-30)/needH,(cw-26)/needW),N2=SCALES.find(function(s){return 304.8/s<=ks})||200;ks=304.8/N2;
  d.text(X1,20.5,"Elevations and plans at 1 : "+(m.paper==="A4"?Math.round(N2*Math.SQRT2):N2)+"  ("+(m.paper||"A3")+")",2.4,{a:"end",c:"#444444"});
  shown.forEach(function(g2,i){var r=Math.floor(i/cols),c=i%cols,cx0=X0+c*cw,cy0=Y0+r*ch;d.rect(cx0,cy0,cw,ch,{w:0.2,c:"#9aa4b0"});detailCell(d,g2,cx0,cy0,cw,ch,ks,maxL,mk(g2),needH)});
  if(GS.length>12)d.text(X1,Y1+3,"+ "+(GS.length-12)+" more types in the schedule below",2.2,{a:"end",c:"#8b1a1a"})}
 // ---- door & window schedule ----
 var ty=186,rowsT=GS.map(function(g2){var r=[mk(g2),OKN[g2.kind],fi(g2.w),fi(g2.h),g2.kind==="MD"||g2.kind==="D"||g2.kind==="TD"||g2.kind==="OP"?"FFL":lvl(g2.sill),lvl(g2.sill+g2.h),String(g2.marks.length),g2.locs.join(" / ")];r.cols=[opCol(g2.o)];return r});
 if(!rowsT.length)rowsT=[["-","No openings","","","","","",""]];
 var maxRows=Math.floor((281-ty-6)/4.6);if(rowsT.length>maxRows)rowsT=rowsT.slice(0,maxRows-1).concat([["...","","","","","","",""]]);
 table(d,X0,ty,[["Mark",22],["Type",34],["Width",17],["Height",17],["Sill",16],["Lintel",16],["Nos",10],["Location",50,"start"]],rowsT,{rh:4.6,title:"DOOR & WINDOW SCHEDULE",boldFirst:true});
 // ---- room schedule ----
 var rs=sched.map(function(r,i){return [ascii(r.name),(r.f.rect?"":"~")+fsz(r.f.cw)+" x "+fsz(r.f.ch),sq(r.f.carpet)]});
 var maxR=Math.floor((281-ty-6)/4.6)-3;if(rs.length>maxR)rs=rs.slice(0,maxR-1).concat([["...","",""]]);
 var t1=["CARPET TOTAL","",sq(RI.carpet)];t1.bold=true;var t2=["BUILT-UP (outer)","",sq(RI.plinth)];t2.bold=true;t2.bg="#eef3f9";var t3=["","",f2(RI.plinth*0.09290304)+" sq.m"];
 table(d,X0+188,ty,[["Room",30,"start"],["Clear size",28],["sq.ft",16]],rs.concat([t1,t2,t3]),{rh:4.6,title:"ROOM SCHEDULE"});
 // ---- wall legend + notes ----
 var nx=X0+266,nw=X1-nx,lens={};S.L.forEach(function(Lv,li){withLevel(li,function(){S.segs.forEach(function(s){var v=fmt(wallIn(s));lens[v]=(lens[v]||0)+segLen(s)})})});
 var wr=Object.keys(lens).sort(function(a,b){return b-a}).map(function(v){return [v+'" '+thName(v),fmt(lens[v],1)+" rft"]});
 var ny=table(d,nx,ty,[["Wall",nw*0.58,"start"],["Length",nw*0.42]],wr,{rh:4.6,title:"WALL THICKNESS"})+4;
 if(typeof kitSchedRows==="function"){var kr=kitSchedRows().map(function(r){return [ascii(r[0]),r[1],String(r[2])]});if(kr.length){var mk2=Math.max(1,Math.floor((262-ny)/4.6)-2);if(kr.length>mk2)kr=kr.slice(0,mk2-1).concat([["...","",""]]);ny=table(d,nx,ny,[["Kitchen unit",nw*0.44,"start"],["Size (mm)",nw*0.42],["Nos",nw*0.14]],kr,{rh:4.6,title:"MODULAR KITCHEN"})+4}}
 var notes=["Levels are from finished floor level FFL +0'-0\".","Sill = bottom of window. Lintel = top of opening.","RCC lintel band shown 6\" deep with 6\" bearing each side (typical).","Door swing and hinge side as marked on plan (sheet 1).","Wall lengths are centre-line running feet."];
 noteBox(d,nx,ny,nw,"NOTES",notes,1.9)}

/* one elevation + plan detail for a door / window type */
function detailCell(d,g2,cx0,cy0,cw,ch,ks,maxL,mark,cell2H){var w=g2.w,h=g2.h,sl=g2.sill,ln=sl+h,isD=g2.kind==="MD"||g2.kind==="D"||g2.kind==="TD"||g2.kind==="OP",col=OKC[g2.kind],o=g2.o;
 d.text(cx0+cw/2,cy0+5,mark,2.8,{a:"middle",bold:true,c:col});fitT(d,cx0+cw/2,cy0+8.8,OKN[g2.kind].toUpperCase(),1.9,cw-4,{a:"middle",c:"#333333"});
 var Wt=w+2,ex=cx0+(cw-Wt*ks)/2+3,spare=Math.max(0,(ch-30)-cell2H*ks),ey=cy0+12+spare*0.45+(maxL+1.05)*ks;
 function E(x,z){return [ex+x*ks,ey-z*ks]}
 function rc(x0,z0,x1,z1,o2){var a=E(x0,z0),b=E(x1,z1);d.poly([a,[b[0],a[1]],b,[a[0],b[1]]],o2)}
 function ln2(x0,z0,x1,z1,o2){var a=E(x0,z0),b=E(x1,z1);d.line(a[0],a[1],b[0],b[1],o2||{w:0.2})}
 var top=ln+0.9;
 // masonry around the opening + brick hatch
 rc(0,0,Wt,top,{w:0.25,fill:"#efe7da",c:"#8a7f70"});
 for(var hx=-top;hx<Wt;hx+=0.55){var x0=Math.max(hx,0),z0=x0-hx,x1=Math.min(hx+top,Wt),z1=x1-hx;if(x1>x0)ln2(x0,z0,x1,z1,{w:0.08,c:"#c9bba5"})}
 // lintel band and sill
 rc(0.5,ln,w+1.5,ln+0.5,{w:0.25,fill:"#b9b9b9",c:"#555555"});
 if(!isD&&sl>0.05)rc(0.8,sl-0.15,w+1.2,sl,{w:0.2,fill:"#cfcfcf",c:"#555555"});
 // opening + frame
 rc(1,sl,w+1,ln,{w:0.35,fill:"#ffffff",c:DK});
 if(g2.kind==="OP"){}
 else if(isD){var fr=0.25;rc(1+fr,0,w+1-fr,ln-fr,{w:0.25,c:DK});var L0=1+fr,L1=w+1-fr,Z1=ln-fr,hingeL=!o.hinge;
  if(g2.kind==="TD"){rc(L0+0.18,0.3,L1-0.18,Z1-0.2,{w:0.15,c:"#444444"});for(var lz=0.45;lz<1.7;lz+=0.2)ln2(L0+0.35,lz,L1-0.35,lz,{w:0.12,c:"#444444"})}
  else{var cols2=g2.kind==="MD"?2:1,rws=g2.kind==="MD"?3:4,pw=(L1-L0-0.5)/cols2,ph=(Z1-0.6)/rws;
   for(var ci=0;ci<cols2;ci++)for(var ri=0;ri<rws;ri++){var px0=L0+0.25+ci*pw+0.08,pz0=0.35+ri*ph+0.08;rc(px0,pz0,px0+pw-0.16,pz0+ph-0.16,{w:0.15,c:"#444444",fill:g2.kind==="MD"?"#f3e3cf":undefined})}}
  var hx2=hingeL?L1-0.3:L0+0.3;rc(hx2-0.06,3.0,hx2+0.06,3.6,{w:0.15,fill:"#444444",c:"#444444"});
  var hX=hingeL?L0:L1,lX=hingeL?L1:L0;ln2(lX,0.05,hX,Z1/2,{w:0.12,c:"#666666",dash:[1,0.7]});ln2(lX,Z1-0.05,hX,Z1/2,{w:0.12,c:"#666666",dash:[1,0.7]})}
 else{var fr2=0.17,X0=1+fr2,X1=w+1-fr2,Z0=sl+fr2,Z1b=ln-fr2;rc(X0,Z0,X1,Z1b,{w:0.25,c:DK});
  if(g2.kind==="V"){rc(X0+0.05,Z0+0.05,X1-0.05,Z1b-0.05,{w:0.12,fill:"#dbeaf7",c:"#5b7fa6"});for(var vz=Z0+0.2;vz<Z1b-0.05;vz+=0.2)ln2(X0+0.05,vz,X1-0.05,vz,{w:0.15,c:"#5b7fa6"})}
  else{var nsh=w>=3?2:1,sw=(X1-X0)/nsh;for(var si=0;si<nsh;si++){var a0=X0+si*sw;rc(a0,Z0,a0+sw,Z1b,{w:0.22,c:DK});rc(a0+0.14,Z0+0.14,a0+sw-0.14,Z1b-0.14,{w:0.12,fill:"#dbeaf7",c:"#5b7fa6"});
    // diagonal shutter-opening lines (hinge at outer jamb)
    var hxs=si===0?a0:a0+sw,lxs=si===0?a0+sw:a0;ln2(lxs,Z0,hxs,(Z0+Z1b)/2,{w:0.1,c:"#7f8fa3",dash:[0.8,0.6]});ln2(lxs,Z1b,hxs,(Z0+Z1b)/2,{w:0.1,c:"#7f8fa3",dash:[0.8,0.6]})}
   for(var gx=X0+0.42;gx<X1-0.1;gx+=0.42)ln2(gx,Z0+0.02,gx,Z1b-0.02,{w:0.1,c:"#555555"})}}
 // FFL + ground
 ln2(-0.4,0,Wt+0.4,0,{w:0.5,c:DK});for(var gx2=-0.3;gx2<Wt+0.3;gx2+=0.35)ln2(gx2,0,gx2-0.25,-0.25,{w:0.08,c:"#777777"});
 // level marks (left)
 function lev(z,t,b){var p=E(-0.15,z);d.poly([[p[0],p[1]],[p[0]-1.2,p[1]-1.2],[p[0]+1.2,p[1]-1.2]],{w:0.1,fill:"#1d3f7a",c:"#1d3f7a"});d.text(p[0]-1.8,p[1]-0.3,t,1.55,{a:"end",bold:!!b,c:"#1d3f7a"})}
 lev(0,"FFL +0'-0\"");lev(ln,"LINTEL "+lvl(ln),true);if(!isD&&sl>0.05)lev(sl,"SILL "+lvl(sl),true);
 // dimensions: width on top, height + sill on the right
 var dz=top+0.25,A=E(1,dz),B=E(w+1,dz),dc="#1d3f7a";d.line(A[0],A[1]-2,B[0],B[1]-2,{w:0.15,c:dc});[A,B].forEach(function(P){d.line(P[0],P[1]-3.2,P[0],P[1]+0.3,{w:0.1,c:dc});d.line(P[0]-0.8,P[1]-1.2,P[0]+0.8,P[1]-2.8,{w:0.25,c:dc})});
 d.text((A[0]+B[0])/2,A[1]-2.7,fi(w),2.1,{a:"middle",bold:true,c:dc});
 var rx=E(Wt,0)[0]+2.6;function vd(z0,z1,t){var a=E(0,z0)[1],b=E(0,z1)[1];d.line(rx,a,rx,b,{w:0.15,c:dc});[a,b].forEach(function(y){d.line(rx-0.8,y+0.8,rx+0.8,y-0.8,{w:0.25,c:dc});d.line(rx-1.6,y,rx+0.6,y,{w:0.1,c:dc})});d.text(rx+1.6,(a+b)/2,t,1.9,{a:"middle",v:"mid",c:dc,rot:90})}
 if(!isD&&sl>0.05)vd(0,sl,fi(sl));vd(sl,ln,fi(h));
 // plan (same scale) under the elevation
 var T=g2.T,py=ey+0.6*ks+5;function Pp(x,a){return [ex+x*ks,py+a*ks]}
 function prc(x0,a0,x1,a1,o2){var p=Pp(x0,a0),q=Pp(x1,a1);d.poly([p,[q[0],p[1]],q,[p[0],q[1]]],o2)}
 prc(0,0,1,T,{w:0.3,fill:"#3a3a3a",c:DK});prc(w+1,0,Wt,T,{w:0.3,fill:"#3a3a3a",c:DK});
 function pl(x0,a0,x1,a1,o2){var p=Pp(x0,a0),q=Pp(x1,a1);d.line(p[0],p[1],q[0],q[1],o2||{w:0.2,c:DK})}
 if(g2.kind==="OP"){}
 else if(isD){var hl=!o.hinge,hx3=hl?1:w+1,ex3=hl?w+1:1,lt=Math.min(1.5/12,w*0.06),dr=hl?1:-1;var pp=[Pp(hx3,T),Pp(hx3,T+w),Pp(hx3+dr*lt,T+w),Pp(hx3+dr*lt,T)];d.poly(pp,{w:0.25,c:DK,fill:"#ffffff"});
  var arc=[];for(var i=0;i<=20;i++){var th=i/20*Math.PI/2;arc.push(Pp(hx3+(ex3-hx3)*Math.cos(th),T+w*Math.sin(th)))}d.poly(arc,{w:0.14,c:DK,closed:false})}
 else{pl(1,0,w+1,0,{w:0.22,c:DK});pl(1,T/2,w+1,T/2,{w:0.15,c:DK,dash:g2.kind==="V"?[0.8,0.6]:undefined});pl(1,T,w+1,T,{w:0.22,c:DK})}
 d.text(Pp(Wt,0)[0]+1.2,Pp(0,T/2)[1]+0.7,"PLAN",1.6,{c:"#555555"});
 // caption
 var cy=cy0+ch-6.2;fitT(d,cx0+cw/2,cy,"SIZE "+fi(w)+" x "+fi(h),2.3,cw-3,{a:"middle",bold:true});
 fitT(d,cx0+cw/2,cy+3.6,"Nos: "+g2.marks.length+"   "+(isD?"Lintel "+lvl(ln):"Sill "+lvl(sl)+"  Lintel "+lvl(ln))+"   Wall "+thA(T*12),1.8,cw-3,{a:"middle",c:"#333333"})}
