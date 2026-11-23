/* ===== v1.5 Structure / site / MEP sheets (each its own sheet + own PDF) ===== */
var STK=[];/* audit log of dimension values written on sheets (used by tests) */
function stLog(sheet,kind,val,label){STK.push({sheet:sheet,kind:kind,val:val,label:label})}
function stCols(){return S.L[0]&&S.L[0].cols||[]}
/* group into types: returns [{mark,items,key,...}] */
function groupBy(items,keyf,pre){var M={},out=[];items.forEach(function(it){var k=keyf(it);if(!M[k]){M[k]={mark:pre+(out.length+1),key:k,items:[]};out.push(M[k])}M[k].items.push(it)});return out}
function colTypes(cols){return groupBy(cols||stCols(),function(c){var r=colRB(c);return [c.w,c.d,r.n,r.dia,r.tie,r.sp,r.cov].join("|")},"C")}
function ftgTypes(cols){return groupBy(cols||stCols(),function(c){var f=ftgOf(c);return [f.l,f.w,f.t,f.dep,f.dia,f.sp].join("|")},"F")}
function beamTypes(beams){return groupBy(beams,function(m){var r=beamRB(m);return [m.w,m.d,m.cb?1:0,r.top,r.td,r.bot,r.bd,r.st,r.sp].join("|")},"B")}
function markOf(types,it){for(var i=0;i<types.length;i++)if(types[i].items.indexOf(it)>=0)return types[i].mark;return ""}
/* plan setup on paper: fit level content into box [x,y,w,h]; margin for grid chains */
function stSetup(d,lv,box,o){o=o||{};var X=[],Y=[];function e(p){X.push(p.x);Y.push(p.y)}
 withLevel(lv,function(){S.pts.forEach(e);S.cols.forEach(function(c){e(c);if(o.ftg){var f=ftgOf(c);e({x:c.x-f.w/2-1,y:c.y-f.l/2-1});e({x:c.x+f.w/2+1,y:c.y+f.l/2+1})}});
  if(o.beams)S.beams.forEach(function(m){e(m.a);e(m.b)});if(o.elec)(S.elec||[]).forEach(e);if(o.site)(S.cwalls||[]).forEach(function(w){w.pts.forEach(e)})});
 if(!X.length){X=[0,20];Y=[0,20]}var x0=Math.min.apply(null,X),x1=Math.max.apply(null,X),y0=Math.min.apply(null,Y),y1=Math.max.apply(null,Y),pad=o.pad==null?2:o.pad;x0-=pad;y0-=pad;x1+=pad;y1+=pad;
 var mg=o.mg==null?24:o.mg,aw=box[2]-mg-6,ah=box[3]-mg-6,Wf=x1-x0,Hf=y1-y0,N=chooseScale(Wf,Hf,aw,ah),k=304.8/N;
 d.k=k;d.minX=x0;d.minY=-y1;var cx=box[0]+mg+aw/2,cy=box[1]+mg+ah/2;d.ox=cx-Wf*k/2;d.oy=cy+Hf*k/2;
 return {N:N,k:k,R:function(x,y){return d.W2P(x,-y)}}}
function stWalls(d,R,lv,o){o=o||{};withLevel(lv,function(){S.segs.forEach(function(s){var a=pt(s.a),b=pt(s.b);if(!a||!b)return;var L=Math.hypot(b.x-a.x,b.y-a.y);if(L<1e-6)return;var t=wallT(s)/2,nx=-(b.y-a.y)/L*t,ny=(b.x-a.x)/L*t;
  var P=[R(a.x+nx,a.y+ny),R(b.x+nx,b.y+ny),R(b.x-nx,b.y-ny),R(a.x-nx,a.y-ny)];var st=o.style?o.style(s):{};d.poly(P,{w:st.w||0.18,c:st.c||"#9aa4b0",fill:st.fill||o.fill||"#eef1f4",L:"WALLS"})});
  if(o.ops!==false)S.ops.forEach(function(op){var q=opWorld(op);if(!q)return;var t=(S.meta.dbl?wallT(q.s):0.5)/2+0.02,A=R(q.p0.x+q.n.x*t,q.p0.y+q.n.y*t),B=R(q.p1.x+q.n.x*t,q.p1.y+q.n.y*t),C=R(q.p1.x-q.n.x*t,q.p1.y-q.n.y*t),D=R(q.p0.x-q.n.x*t,q.p0.y-q.n.y*t);d.poly([A,B,C,D],{w:0.1,c:"#cbd5e1",fill:"#ffffff",nodxf:true})})})}
function stFrame(title){var d=new Dwg();frameA(d);return d}
function stDone(d,sh,lab,RI,N,title){tblock(d,{title:title||sh.title,dno:sh.no,sheet:lab,scale:N?scaleTxt(N):"As shown",RI:RI});sh.d=d;sh.N=N}
function stNote(d,x,y,w,head,lines){return noteBox(d,x,y,w,head,lines,1.9)}
function colShape(d,R,c,o){o=o||{};var P=colPoly(c).map(function(p){return R(p.x,p.y)});d.poly(P,{w:0.3,c:"#000000",fill:o.fill||"#1f2937",L:"COLUMNS"})}
var PX=16,PY=16,PW=234,PH=265,TX=254,TW=78;/* plan box and table strip */
/* ---------- 1. Column & grid layout ---------- */
function shColGrid(sh,lab,RI){var d=stFrame(),cols=stCols(),G=autoGrid(),T=colTypes(cols),U=stSetup(d,0,[PX,PY,PW,PH]),R=U.R;stWalls(d,R,0);sheetGrid(d,R,G,{both:true});
 cols.forEach(function(c){colShape(d,R,c);var p=R(c.x,c.y);d.text(p[0]+2,p[1]-2,markOf(T,c),2,{bold:true,L:"ANNO"})});
 /* column-to-column c/c: nearest neighbour on the same row and the same column line */
 var tol=0.35;cols.forEach(function(c){var r=null,b=null;cols.forEach(function(o){if(o===c)return;if(Math.abs(o.y-c.y)<tol&&o.x>c.x&&(!r||o.x<r.x))r=o;if(Math.abs(o.x-c.x)<tol&&o.y>c.y&&(!b||o.y<b.y))b=o});
  if(r){var A=R(c.x,c.y),B=R(r.x,r.y),D=r.x-c.x;d.line(A[0],A[1]+3,B[0],B[1]+3,{w:0.12,c:"#b45309",L:"DIMS"});d.text((A[0]+B[0])/2,A[1]+2.4,fi(D),1.7,{a:"middle",c:"#b45309",L:"DIMS"});stLog(sh.key,"cc-x",D,fi(D))}
  if(b){var A2=R(c.x,c.y),B2=R(b.x,b.y),D2=b.y-c.y;d.line(A2[0]+3,A2[1],B2[0]+3,B2[1],{w:0.12,c:"#b45309",L:"DIMS"});d.text(A2[0]+2.4,(A2[1]+B2[1])/2,fi(D2),1.7,{a:"middle",rot:90,c:"#b45309",L:"DIMS"});stLog(sh.key,"cc-y",D2,fi(D2))}});
 if(G){for(var i=0;i<G.V.length-1;i++)stLog(sh.key,"grid-x",G.V[i+1].v-G.V[i].v,fi(G.V[i+1].v-G.V[i].v));for(var j=0;j<G.H.length-1;j++)stLog(sh.key,"grid-y",G.H[j+1].v-G.H[j].v,fi(G.H[j+1].v-G.H[j].v))}
 var y=table(d,TX,PY+6,[["Mark",12],["Size (in)",18],["Nos",10],["Grid",38,"start"]],T.map(function(t){return [t.mark,t.items[0].w+" x "+t.items[0].d,t.items.length,t.items.map(function(c){return colGridRef(c,G)}).join(", ")]}),{title:"COLUMN SCHEDULE"});
 y=table(d,TX,y+8,[["Mark",14],["Main bars",30],["Ties",34]],T.map(function(t){var r=colRB(t.items[0]);return [t.mark,r.n+" - "+r.dia+" mm",r.tie+" mm @ "+r.sp+" c/c"]}),{title:"REINFORCEMENT"});
 stNote(d,TX,y+6,TW,"NOTES",["Total columns: "+cols.length+".","Grid lines pass through column centres. Letters A, B, C... run top to bottom, numbers 1, 2, 3... left to right.","All grid distances are centre to centre in ft-in (mm).","Orange figures: c/c distance between adjacent columns."]);
 stDone(d,sh,lab,RI,U.N)}
/* ---------- 2. Centre marking ---------- */
function shCMark(sh,lab,RI){var d=stFrame(),cols=stCols(),G=autoGrid(),U=stSetup(d,0,[PX,PY,PW,PH]),R=U.R;stWalls(d,R,0,{fill:"#f6f7f9",ops:false});sheetGrid(d,R,G,{both:true});
 var o0=G?{x:G.V[0].v,y:G.H[0].v}:{x:0,y:0};
 cols.forEach(function(c){var p=R(c.x,c.y);d.poly(circ(p[0],p[1],1.6),{w:0.25,c:"#c0392b",L:"ANNO"});d.line(p[0]-3,p[1],p[0]+3,p[1],{w:0.25,c:"#c0392b",L:"ANNO"});d.line(p[0],p[1]-3,p[0],p[1]+3,{w:0.25,c:"#c0392b",L:"ANNO"});d.text(p[0]+2,p[1]+3.6,colGridRef(c,G),1.7,{c:"#c0392b",L:"ANNO"})});
 var rows=cols.slice().sort(function(a,b){return (a.y-b.y)||(a.x-b.x)}).map(function(c,i){var dx=c.x-o0.x,dy=c.y-o0.y;stLog(sh.key,"off-x",dx,fi(dx));stLog(sh.key,"off-y",dy,fi(dy));return [i+1,colGridRef(c,G),fi(dx)+" / "+mmF(dx),fi(dy)+" / "+mmF(dy)]});
 var y=table(d,TX,PY+6,[["#",7],["Grid",13],["X from 1 ft-in / mm",29],["Y from A ft-in / mm",29]],rows.slice(0,40),{title:"CENTRE POINTS (from grid A-1)",rh:4.2});
 stNote(d,TX,y+6,TW,"SETTING OUT",["Fix reference point at grid A-1 (first column centre).","Mark X along grid A and Y along grid 1 with tape; check every rectangle with diagonals.","Red cross = column centre."+(rows.length>40?" (first 40 listed)":"")]);stDone(d,sh,lab,RI,U.N)}
/* ---------- 3. Column kambi (rebar) detail ---------- */
function colSection(d,cx,cy,c,r,sc){var W=mmI(c.w)*sc,H=mmI(c.d)*sc,x=cx-W/2,y=cy-H/2;d.rect(x,y,W,H,{w:0.4,fill:"#f1f5f9",L:"DETAIL"});var cv=r.cov*sc,tie=r.tie*sc;d.rect(x+cv,y+cv,W-2*cv,H-2*cv,{w:0.35,c:"#b91c1c",L:"DETAIL"});
 var n=Math.max(4,r.n),rr=Math.max(0.5,r.dia*sc/2),ix=x+cv+tie/2+rr,iy=y+cv+tie/2+rr,iw=W-2*(cv+tie/2+rr),ih=H-2*(cv+tie/2+rr),pts=[[ix,iy],[ix+iw,iy],[ix+iw,iy+ih],[ix,iy+ih]],extra=n-4,long=ih>=iw;
 var per=[Math.ceil(extra/2),Math.floor(extra/2)];for(var s=0;s<2;s++)for(var k=1;k<=per[s];k++){var t=k/(per[s]+1);pts.push(long?[s?ix+iw:ix,iy+ih*t]:[ix+iw*t,s?iy+ih:iy])}
 pts.forEach(function(p){d.poly(circ(p[0],p[1],rr,14),{w:0.1,fill:"#111827",L:"DETAIL"})});
 d.line(x,y+H+3,x+W,y+H+3,{w:0.15,L:"DIMS"});d.text(cx,y+H+2.4,mmI(c.w)+" ("+c.w+'")',1.8,{a:"middle",L:"DIMS"});d.line(x-3,y,x-3,y+H,{w:0.15,L:"DIMS"});d.text(x-3.6,cy,mmI(c.d)+" ("+c.d+'")',1.8,{a:"middle",rot:90,L:"DIMS"});return pts.length}
function shKambi(sh,lab,RI){var d=stFrame(),T=colTypes(),G=autoGrid(),cells=T.slice(0,6),cw=(TBX-4-16)/3,ch=150;
 cells.forEach(function(t,i){var c=t.items[0],r=colRB(c),x0=16+(i%3)*cw,y0=18+Math.floor(i/3)*ch/2,sc=Math.min((cw-30)/Math.max(mmI(c.w),mmI(c.d)),0.09);
  d.rect(x0+2,y0,cw-4,ch/2-4,{w:0.2,c:"#94a3b8",nodxf:true});d.text(x0+5,y0+5,"COLUMN "+t.mark+" - "+c.w+'" x '+c.d+'" ('+mmI(c.w)+" x "+mmI(c.d)+" mm)",2.4,{bold:true});
  var nb=colSection(d,x0+cw/2-10,y0+ch/4+2,c,r,sc);d.text(x0+cw-34,y0+18,nb+" - "+r.dia+" mm main",2,{c:"#111827"});d.text(x0+cw-34,y0+23,r.tie+" mm ties @ "+r.sp+" c/c",2,{c:"#b91c1c"});d.text(x0+cw-34,y0+28,"Cover "+r.cov+" mm",2);d.text(x0+cw-34,y0+33,"Nos: "+t.items.length,2);d.text(x0+cw-34,y0+38,"Grid: "+t.items.slice(0,4).map(function(c2){return colGridRef(c2,G)}).join(" ")+(t.items.length>4?"...":""),1.7);
  stLog(sh.key,"colsize",c.w,c.w+" x "+c.d)});
 /* bar schedule: per floor height */
 var H=(S.L[0].h||10),rows=[],tot=0;T.forEach(function(t){var c=t.items[0],r=colRB(c),n=t.items.length,lap=50*r.dia/304.8,Lm=(H+lap+ftgOf(c).dep)*0.3048,mw=kgm(r.dia)*Lm*r.n*n,per=2*((mmI(c.w)-2*r.cov)+(mmI(c.d)-2*r.cov))/1000+0.15,nt=Math.ceil((H+ftgOf(c).dep)*304.8/r.sp)+1,tw2=kgm(r.tie)*per*nt*n;tot+=mw+tw2;
  rows.push([t.mark,n,r.n+" - "+r.dia+" mm",(Lm).toFixed(2)+" m",mw.toFixed(1),nt+" x "+per.toFixed(2)+" m",tw2.toFixed(1)])});rows.push({0:"TOTAL",6:tot.toFixed(1)+" kg",bold:true});
 var y=table(d,16,18+ch+4,[["Mark",14],["Nos",10],["Main bars",30],["Bar length",24],["Main kg",20],["Ties (nos x length)",40],["Ties kg",20]],rows,{title:"BAR SCHEDULE (column from footing to first floor, lap 50d)"});
 stNote(d,200,18+ch+4,128,"NOTES",["Rebar sizes are as chosen in Kambi Detail Drawing for each column.","Unit weight = d x d / 162 kg/m.","Typical guidance only - get the design checked by a structural engineer."+(T.length>6?" Only 6 types drawn here.":"")]);stDone(d,sh,lab,RI,0,"Column Kambi Detail")}
/* ---------- 4. Earthwork ---------- */
function shEarth(sh,lab,RI){var d=stFrame(),cols=stCols(),G=autoGrid(),U=stSetup(d,0,[PX,PY,PW,PH],{ftg:true}),R=U.R,ws=0.5,FT=ftgTypes(cols);stWalls(d,R,0,{fill:"#f6f7f9",ops:false});sheetGrid(d,R,G,{dims:true});
 cols.forEach(function(c){var f=ftgOf(c),a=R(c.x-f.w/2-ws,c.y-f.l/2-ws),b=R(c.x+f.w/2+ws,c.y+f.l/2+ws);d.rect(a[0],a[1],b[0]-a[0],b[1]-a[1],{w:0.3,c:"#92400e",fill:"#fde68a",L:"FOOTINGS"});var p=R(c.x,c.y);d.text(p[0],p[1]+1,"P"+markOf(FT,c).slice(1),1.8,{a:"middle",bold:true,c:"#92400e"})});
 var tot=0,rows=FT.map(function(t){var f=ftgOf(t.items[0]),L=f.l+2*ws,W=f.w+2*ws,D=f.dep+f.pcc/12,v=L*W*D*t.items.length;tot+=v;stLog(sh.key,"pit-l",L,fi(L));return ["P"+t.mark.slice(1),fi(W)+" x "+fi(L),fi(D),t.items.length,v.toFixed(0),(v*0.0283168).toFixed(2)]});
 rows.push({0:"TOTAL",4:tot.toFixed(0),5:(tot*0.0283168).toFixed(2),bold:true});
 var y=table(d,TX,PY+6,[["Pit",9],["Size W x L",25],["Depth",12],["Nos",8],["cu.ft",12],["cu.m",12]],rows,{title:"EXCAVATION QUANTITY"});
 stNote(d,TX,y+6,TW,"NOTES",["Pit = footing size + 6\" working space each side.","Depth = footing depth below ground + 3\" PCC bed.","Pit centres = column centres (see centre marking sheet)."]);stDone(d,sh,lab,RI,U.N,"Earthwork (Excavation) Plan")}
/* ---------- 5. Footing ---------- */
function shFooting(sh,lab,RI){var d=stFrame(),cols=stCols(),G=autoGrid(),FT=ftgTypes(cols),U=stSetup(d,0,[PX,PY,PW,175],{ftg:true,mg:22}),R=U.R;stWalls(d,R,0,{fill:"#f6f7f9",ops:false});sheetGrid(d,R,G);
 cols.forEach(function(c){var f=ftgOf(c),a=R(c.x-f.w/2,c.y-f.l/2),b=R(c.x+f.w/2,c.y+f.l/2);d.rect(a[0],a[1],b[0]-a[0],b[1]-a[1],{w:0.3,c:"#334155",fill:"#e2e8f0",L:"FOOTINGS"});colShape(d,R,c);var p=R(c.x,c.y);d.text(p[0],b[1]-0.8,markOf(FT,c),1.8,{a:"middle",bold:true})});
 /* typical section */
 var f=ftgOf(cols[0]),sx=30,sy=200,sc=Math.min(60/(f.w*304.8),70/((f.dep+1)*304.8)),fw=f.w*304.8*sc,ft=f.t*304.8*sc,dep=f.dep*304.8*sc,pc=f.pcc*25.4*sc,cwid=(cols[0]?mmI(cols[0].w):230)*sc,gx=sx+40,gl=sy;
 d.line(sx,gl,sx+100,gl,{w:0.35,L:"DETAIL"});d.text(sx+101,gl+1,"GL",2);d.rect(gx-fw/2-2*sc*100,gl+dep,fw+4*sc*100,pc,{w:0.25,fill:"#e5e7eb",L:"DETAIL"});d.rect(gx-fw/2,gl+dep-ft,fw,ft,{w:0.4,fill:"#cbd5e1",L:"DETAIL"});d.rect(gx-cwid/2,gl-8,cwid,dep-ft+8,{w:0.4,fill:"#94a3b8",L:"DETAIL"});
 d.line(gx-fw/2+2,gl+dep-2,gx+fw/2-2,gl+dep-2,{w:0.4,c:"#b91c1c",L:"DETAIL"});for(var i=0;i<7;i++){var xx=gx-fw/2+3+i*(fw-6)/6;d.poly(circ(xx,gl+dep-3.2,0.5,10),{w:0.1,fill:"#b91c1c",L:"DETAIL"})}
 d.line(gx+fw/2+4,gl,gx+fw/2+4,gl+dep,{w:0.15,L:"DIMS"});d.text(gx+fw/2+5,gl+dep/2,fi(f.dep)+" below GL",1.8,{L:"DIMS"});d.text(gx-fw/2,gl+dep+pc+4,"Footing "+fi(f.w)+" wide, "+fi(f.t)+" thick, PCC 3\" below",1.8);d.text(sx,sy-12,"TYPICAL FOOTING SECTION",2.6,{bold:true});
 var rows=FT.map(function(t){var g2=ftgOf(t.items[0]),v=g2.l*g2.w*g2.t*t.items.length*0.0283168;stLog(sh.key,"ftg-l",g2.l,fi(g2.l));stLog(sh.key,"ftg-w",g2.w,fi(g2.w));return [t.mark,fi(g2.l)+" x "+fi(g2.w),fi(g2.t),fi(g2.dep),g2.dia+" @ "+g2.sp+" both ways",t.items.length,v.toFixed(2)]});
 table(d,140,192,[["Mark",12],["Size L x W",30],["Thk",14],["Depth",14],["Bottom mesh (mm)",40],["Nos",10],["Conc. cu.m",20]],rows,{title:"FOOTING SCHEDULE"});
 stNote(d,TX,PY+6,TW,"NOTES",["Footing centre = column centre.","Sizes from the Footing size picker (per column or all).","Concrete M20, PCC 1:4:8 3\" bed.","Typical guidance - check with structural engineer."]);stDone(d,sh,lab,RI,U.N,"Footing Layout & Detail")}
/* beam section detail cell */
function beamSection(d,x,y,w,dp,rb,sc,title){var W=mmI(w)*sc,H=mmI(dp)*sc;d.text(x,y-3,title,2.2,{bold:true});d.rect(x,y,W,H,{w:0.4,fill:"#f1f5f9",L:"DETAIL"});var cv=rb.cov*sc;d.rect(x+cv,y+cv,W-2*cv,H-2*cv,{w:0.3,c:"#b91c1c",L:"DETAIL"});
 function row(n,dia,yy){var r=Math.max(0.45,dia*sc/2);for(var i=0;i<n;i++){var xx=x+cv+r+0.4+(n>1?i*(W-2*cv-2*r-0.8)/(n-1):(W-2*cv-2*r-0.8)/2);d.poly(circ(xx,yy,r,12),{w:0.1,fill:"#111827",L:"DETAIL"})}}
 row(rb.top,rb.td,y+cv+1.2);row(rb.bot,rb.bd,y+H-cv-1.2);d.line(x,y+H+2.5,x+W,y+H+2.5,{w:0.15,L:"DIMS"});d.text(x+W/2,y+H+2,mmI(w)+" ("+w+'")',1.6,{a:"middle",L:"DIMS"});d.line(x-2.5,y,x-2.5,y+H,{w:0.15,L:"DIMS"});d.text(x-3,y+H/2,mmI(dp)+" ("+dp+'")',1.6,{a:"middle",rot:90,L:"DIMS"});
 d.text(x+W+3,y+3,"Top "+rb.top+" - "+rb.td+" mm",1.8);d.text(x+W+3,y+7,"Bottom "+rb.bot+" - "+rb.bd+" mm",1.8);d.text(x+W+3,y+11,"Stirrups "+rb.st+" mm @ "+rb.sp,1.8,{c:"#b91c1c"});d.text(x+W+3,y+15,"Cover "+rb.cov+" mm",1.8)}
/* wall runs on a level as beam lines (plinth beam) */
function pbRuns(lv){return withLevel(lv,function(){return S.segs.map(function(s){var a=pt(s.a),b=pt(s.b);return a&&b?{a:{x:a.x,y:a.y},b:{x:b.x,y:b.y},L:Math.hypot(b.x-a.x,b.y-a.y)}:null}).filter(Boolean)})}
/* ---------- 6. Plinth beam ---------- */
function shPlinth(sh,lab,RI){var d=stFrame(),pb=pbCfg(),G=autoGrid(),U=stSetup(d,0,[PX,PY,PW,180],{mg:22}),R=U.R,runs=pbRuns(0),tot=0;
 runs.forEach(function(m){var L=m.L,nx=-(m.b.y-m.a.y)/L*pb.w/24,ny=(m.b.x-m.a.x)/L*pb.w/24;d.poly([R(m.a.x+nx,m.a.y+ny),R(m.b.x+nx,m.b.y+ny),R(m.b.x-nx,m.b.y-ny),R(m.a.x-nx,m.a.y-ny)],{w:0.25,c:"#9a3412",fill:"#fed7aa",L:"BEAMS"});tot+=L;
  if(L*U.k>18){var c=R((m.a.x+m.b.x)/2,(m.a.y+m.b.y)/2),ang=ang2page(m.b.x-m.a.x,m.b.y-m.a.y);d.text(c[0],c[1]-1.2,"PB "+fi(L),1.6,{a:"middle",rot:ang,c:"#9a3412",L:"BEAMS"});stLog(sh.key,"pb-len",L,fi(L))}});
 sheetGrid(d,R,G);stCols().forEach(function(c){colShape(d,R,c)});
 beamSection(d,40,212,pb.w,pb.d,pb,0.12,"PLINTH BEAM SECTION PB "+pb.w+'" x '+pb.d+'"');
 var lap=50/1000,Lm=tot*0.3048,top=kgm(pb.td)*Lm*pb.top*(1+lap),bot=kgm(pb.bd)*Lm*pb.bot*(1+lap),per=2*((mmI(pb.w)-2*pb.cov)+(mmI(pb.d)-2*pb.cov))/1000+0.15,ns=Math.ceil(Lm*1000/pb.sp)+runs.length,stk=kgm(pb.st)*per*ns;
 table(d,150,200,[["Item",40],["Detail",50],["Qty",30],["kg",20]],[["Total plinth beam length",fi(tot)+" ("+Lm.toFixed(2)+" m)","",""],["Top bars",pb.top+" - "+pb.td+" mm",(Lm*pb.top).toFixed(1)+" m",top.toFixed(1)],["Bottom bars",pb.bot+" - "+pb.bd+" mm",(Lm*pb.bot).toFixed(1)+" m",bot.toFixed(1)],["Stirrups",pb.st+" mm @ "+pb.sp+" c/c",ns+" nos x "+per.toFixed(2)+" m",stk.toFixed(1)],{0:"TOTAL STEEL",3:(top+bot+stk).toFixed(1),bold:true}],{title:"PLINTH BEAM STEEL"});
 stLog(sh.key,"pb-total",tot,fi(tot));
 stNote(d,TX,PY+6,TW,"NOTES",["Plinth beam runs under every wall of the ground floor, centred on the wall line.","Size "+pb.w+'" x '+pb.d+'" ('+mmI(pb.w)+" x "+mmI(pb.d)+" mm).","Lap 50d, steel +5% for laps.","Typical guidance - check with structural engineer."]);stDone(d,sh,lab,RI,U.N,"Plinth Beam Layout & Section")}
/* ---------- 7. Slab beam layout (per level) ---------- */
function shSlabBeam(sh,lab,RI){var lv=sh.slv,d=stFrame(),bm=S.L[lv].beams,BT=beamTypes(bm),G=withLevel(lv,function(){return autoGrid()}),U=stSetup(d,lv,[PX,PY,PW,180],{beams:true,mg:22}),R=U.R;stWalls(d,R,lv,{fill:"#f6f7f9",ops:false});sheetGrid(d,R,G);
 bm.forEach(function(m){var P=beamPoly(m).map(function(p){return R(p.x,p.y)});d.poly(P,{w:0.25,c:m.cb?"#7c3aed":"#9a3412",dash:m.cb?[0.8,0.6]:[1.6,0.8],L:"BEAMS"});var L=Math.hypot(m.b.x-m.a.x,m.b.y-m.a.y),c=R((m.a.x+m.b.x)/2,(m.a.y+m.b.y)/2);
  d.text(c[0],c[1]-1.4,markOf(BT,m)+(m.cb?" (CB)":"")+" "+fi(L),1.7,{a:"middle",rot:ang2page(m.b.x-m.a.x,m.b.y-m.a.y),c:m.cb?"#7c3aed":"#9a3412",L:"BEAMS"});stLog(sh.key,"beam-len",L,fi(L))});
 withLevel(lv,function(){S.cols.forEach(function(c){colShape(d,R,c)})});
 BT.slice(0,3).forEach(function(t,i){var m=t.items[0];beamSection(d,22+i*62,214,m.w,m.d,beamRB(m),Math.min(0.1,40/mmI(m.d)),t.mark+(m.cb?" CONCEALED ":" ")+m.w+'"x'+m.d+'"')});
 table(d,210,200,[["Mark",11],["Type",18],["Size (in)",15],["Top",16],["Bottom",16],["Stirrups",22],["Nos",8],["Length",18]],BT.map(function(t){var m=t.items[0],r=beamRB(m),L=t.items.reduce(function(a,b){return a+Math.hypot(b.b.x-b.a.x,b.b.y-b.a.y)},0);return [t.mark,m.cb?"Concealed":"Normal",m.w+" x "+m.d,r.top+"-"+r.td,r.bot+"-"+r.bd,r.st+" @ "+r.sp,t.items.length,fi(L)]}),{title:"BEAM SCHEDULE"});
 stNote(d,TX,PY+6,TW,"LEGEND",["Brown dashed: normal (drop) beam.","Purple dotted (CB): concealed beam within slab depth.","Sizes width x depth in inches; bars in mm.","Typical guidance - check with structural engineer."]);stDone(d,sh,lab,RI,U.N,S.L[lv].name+" Slab Beam Layout")}
/* ---------- 8. Slab rebar (per level) ---------- */
function shSlabRB(sh,lab,RI){var lv=sh.slv,d=stFrame(),U=stSetup(d,lv,[PX,PY,PW,185],{mg:14}),R=U.R,RIl=withLevel(lv,roomsInfo),rows=[],cfg=slabRB();stWalls(d,R,lv,{fill:"#e5e7eb",ops:false});
 RIl.faces.forEach(function(f,i){var lx=Math.min(f.w,f.h),ly=Math.max(f.w,f.h);if(lx<2)return;var p=slabPanelRB(lx,ly),shortX=f.w<=f.h,mk="S"+(rows.length+1),c=R(f.cx,f.cy),nm=f.labels[0]?f.labels[0].name:"";
  /* main bars along short span, distribution / long bars along long span */
  function bar(horiz,col,off,txt){var a=horiz?R(f.bx+0.6,f.cy+off):R(f.cx+off,f.by+0.6),b=horiz?R(f.bx+f.w-0.6,f.cy+off):R(f.cx+off,f.by+f.h-0.6);d.line(a[0],a[1],b[0],b[1],{w:0.35,c:col,L:"DETAIL"});
   [a,b].forEach(function(q,j){var s=j?-1:1;if(horiz)d.line(q[0],q[1],q[0]+s*0.01,q[1]-1.5,{w:0.35,c:col,L:"DETAIL"});else d.line(q[0],q[1],q[0]-1.5,q[1]+s*0.01,{w:0.35,c:col,L:"DETAIL"})});
   var m=[(a[0]+b[0])/2,(a[1]+b[1])/2];d.text(m[0]+(horiz?0:-1),m[1]+(horiz?-1:0),txt,1.6,{a:"middle",rot:horiz?0:90,c:col,L:"DETAIL"})}
  bar(shortX,"#b91c1c",0,"#"+p.md+" @ "+p.ms+" (main)");bar(!shortX,"#1d4ed8",lx*0.18,"#"+p.ld+" @ "+p.ls+(p.one?" (dist.)":" (long)"));
  d.text(c[0],c[1]+5,mk+(nm?" "+nm:""),1.8,{a:"middle",bold:true});
  stLog(sh.key,"panel-lx",lx,fi(lx));rows.push([mk,nm,fi(lx)+" x "+fi(ly),p.one?"One-way":"Two-way",p.t+'"',p.md+" @ "+p.ms,p.ld+" @ "+p.ls,p.warn?"Check span":""])});
 /* slab section */
 var t=cfg.t,sx=24,sy=216,sc=0.1,H=t*25.4*sc;d.text(sx,sy-4,"TYPICAL SLAB SECTION",2.4,{bold:true});d.rect(sx,sy,110,H,{w:0.4,fill:"#f1f5f9",L:"DETAIL"});d.line(sx+2,sy+H-cfg.cov*sc,sx+108,sy+H-cfg.cov*sc,{w:0.4,c:"#b91c1c",L:"DETAIL"});
 for(var i=0;i<12;i++)d.poly(circ(sx+5+i*9,sy+H-cfg.cov*sc-0.8,0.45,10),{w:0.1,fill:"#1d4ed8",L:"DETAIL"});d.text(sx,sy+H+5,t+'" ('+Math.round(t*25.4)+" mm) slab, clear cover "+cfg.cov+" mm - main bars bottom (red), distribution bars (blue)",1.8);
 table(d,150,200,[["Panel",12],["Room",26],["Lx x Ly",28],["Type",16],["Thk",9],["Main",18],["Dist/Long",19],["",15]],rows,{title:"SLAB REINFORCEMENT"});
 stNote(d,TX,PY+6,TW,"NOTES",["Main bars (red) along the short span Lx, at bottom; distribution / long-span bars (blue) above them.","Ly/Lx > 2 = one-way slab.",cfg.auto?"Bar sizes auto-chosen from span (typical residential guidance).":"Bar sizes as typed in Slab Kambi Detail.","Typical guidance only - get the slab design checked by a structural engineer."]);stDone(d,sh,lab,RI,U.N,S.L[lv].name+" Slab Kambi Detail")}
/* ---------- 9. Wall marking ---------- */
function shWallMark(sh,lab,RI){var lv=sh.slv||0,d=stFrame(),U=stSetup(d,lv,[PX,PY,PW,PH]),R=U.R,G=autoGrid(),acc={};
 function sty(s){var t=wallIn(s);return t>=8.5?{fill:"#1f2937",c:"#000000",w:0.25}:t>=5.5?{fill:"#6b7280",c:"#000000",w:0.2}:{fill:"#ffffff",c:"#000000",w:0.25}}
 stWalls(d,R,lv,{style:sty});sheetGrid(d,R,G,{dims:false});S.L[lv].cols.forEach(function(c){colShape(d,R,c,{fill:"#dc2626"})});
 S.L[lv].segs.forEach(function(s){withLevel(lv,function(){var a=pt(s.a),b=pt(s.b);if(!a||!b)return;var L=Math.hypot(b.x-a.x,b.y-a.y),t=wallIn(s),k=t>=8.5?"9":t>=5.5?"6":"4.5";acc[k]=(acc[k]||0)+L;
  if(L*U.k>14){var nx=-(b.y-a.y)/L,ny=(b.x-a.x)/L,o=wallT(s)/2+0.9,c=R((a.x+b.x)/2+nx*o,(a.y+b.y)/2+ny*o);d.text(c[0],c[1],fi(L),1.6,{a:"middle",v:"mid",rot:ang2page(b.x-a.x,b.y-a.y),L:"DIMS"});stLog(sh.key,"wall-len",L,fi(L))}})});
 withLevel(lv,function(){S.ops.forEach(function(o){var q=opWorld(o);if(!q)return;var c=R(q.c.x,q.c.y);d.text(c[0],c[1]-1.5,(o.mark||(opKind?opKind(o):"OP"))+" "+fi(o.w),1.5,{a:"middle",c:"#1d4ed8",L:"ANNO"})})});
 var rows=[["9\" (230 mm) main / outer / load-bearing wall",acc["9"]?fi(acc["9"]):"-"],["6\" (150 mm) wall",acc["6"]?fi(acc["6"]):"-"],["4.5\" (115 mm) partition wall",acc["4.5"]?fi(acc["4.5"]):"-"]];
 var y=table(d,TX,PY+6,[["Wall type",52],["Length",26]],rows,{title:"WALL LEGEND"});
 stNote(d,TX,y+6,TW,"NOTES",["Black fill = 9\" walls, grey = 6\", white = 4.5\" partitions. Red = RCC column.","Figures beside each wall = centre-line length.","Blue = door / window / opening mark and width.","Walls set out from the column centre grid (see centre marking sheet)."]);stDone(d,sh,lab,RI,U.N,S.L[lv].name+" Wall Marking Plan")}
/* ---------- register sheets ---------- */
var _sl15=sheetList;sheetList=function(){var L=_sl15.apply(this,arguments),add=[],c0=stCols().length;
 if(S.L[0]&&(S.L[0].cwalls||[]).length)L.unshift({key:"site",st:"site",no:"A001",title:"Site Plan - Compound Wall & Setback",short:"Site / Compound"});
 if(c0){add.push({key:"colgrid",st:"colgrid",no:"S101",title:"Column & Grid Layout",short:"Column + Grid"});add.push({key:"cmark",st:"cmark",no:"S102",title:"Centre Marking Plan",short:"Centre Mark"});
  add.push({key:"kambi",st:"kambi",no:"S103",title:"Column Kambi Detail",short:"Column Kambi"});add.push({key:"earth",st:"earth",no:"S104",title:"Earthwork (Excavation) Plan",short:"Earthwork"});add.push({key:"ftg",st:"ftg",no:"S105",title:"Footing Layout & Detail",short:"Footing"})}
 if(S.L[0]&&S.L[0].segs.length&&(c0||stMeta().pb))add.push({key:"pbeam",st:"pbeam",no:"S106",title:"Plinth Beam Layout & Section",short:"Plinth Beam"});
 S.L.forEach(function(Lv,i){if(Lv.segs.length&&(c0||stMeta().wm))add.push({key:i?"wmark"+i:"wmark",st:"wmark",slv:i,no:"S4"+String(i+1).padStart(2,"0"),title:Lv.name+" Wall Marking Plan",short:Lv.name.split(" ")[0]+" Wall Marking"})});
 S.L.forEach(function(Lv,i){if((Lv.beams||[]).length)add.push({key:"sbeam"+i,st:"sbeam",slv:i,no:"S2"+String(i+1).padStart(2,"0"),title:Lv.name+" Slab Beam Layout",short:Lv.name.split(" ")[0]+" Beams"})});
 S.L.forEach(function(Lv,i){if(Lv.segs.length&&stMeta().slab)add.push({key:"srb"+i,st:"srb",slv:i,no:"S3"+String(i+1).padStart(2,"0"),title:Lv.name+" Slab Kambi Detail",short:Lv.name.split(" ")[0]+" Slab Rebar"})});
 S.L.forEach(function(Lv,i){if((Lv.elec||[]).length)add.push({key:"elec"+i,st:"elec",slv:i,no:"E1"+String(i+1).padStart(2,"0"),title:Lv.name+" Electrical Layout",short:Lv.name.split(" ")[0]+" Electrical"})});
 return L.concat(add)};
var STB={colgrid:shColGrid,cmark:shCMark,kambi:shKambi,earth:shEarth,ftg:shFooting,pbeam:shPlinth,wmark:shWallMark,sbeam:shSlabBeam,srb:shSlabRB};
var _bss15=buildSheetSet;buildSheetSet=function(){var r=_bss15.apply(this,arguments),N=r.list.length;STK=[];
 r.list.forEach(function(sh,k){if(!sh.st)return;var fn=STB[sh.st]||(typeof window!=="undefined"&&window["sh_"+sh.st]);if(!fn)return;try{fn(sh,(k+1)+" / "+N,r.RI)}catch(e){console.error("sheet "+sh.key,e);var d=stFrame();d.text(170,150,"Could not build this sheet: "+e.message,4,{a:"middle",c:"#b91c1c"});stDone(d,sh,(k+1)+" / "+N,r.RI,0)}});return r};
