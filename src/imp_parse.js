/* ================= JK Sketch Plan Web - IFC / DXF import (parsers -> neutral model in feet) =================
   Model: {src, units, levels:[{name,elev,h,walls:[{a:{x,y},b:{x,y},th,h,name}],ops:[{x,y,w,h,sill,type,dk,name,host}]}], skipped:{reason:count}, notes:[]}
   x/y in feet, CAD Y-up (flipped to the app's Y-down later); th in inches. */
var JKI=(function(){
"use strict";
function bump(o,k,n){o[k]=(o[k]||0)+(n||1)}
/* ---------------- STEP (ISO 10303-21) reader, lazy per entity ---------------- */
function stepIndex(txt){var E=new Map(),n=txt.length,i=txt.indexOf("DATA;");if(i<0)i=0;else i+=5;
 while(i<n){var h=txt.indexOf("#",i);if(h<0)break;var j=h+1;while(j<n){var c=txt.charCodeAt(j);if(c<48||c>57)break;j++}
  var id=+txt.slice(h+1,j);while(j<n&&txt.charCodeAt(j)<=32)j++;if(txt[j]!=="="){i=j;continue}j++;while(j<n&&txt.charCodeAt(j)<=32)j++;
  var p=txt.indexOf("(",j);if(p<0)break;var type=txt.slice(j,p).trim().toUpperCase();
  /* statement end: ';' outside strings */var k=p,ins=false;for(;k<n;k++){var ch=txt.charCodeAt(k);if(ch===39){ins=!ins}else if(ch===59&&!ins)break}
  E.set(id,{t:type,s:p,e:k,a:null});i=k+1}
 return E}
function parseArgs(txt,s,e){var i=s;function ws(){while(i<e&&txt.charCodeAt(i)<=32)i++}
 function val(){ws();var c=txt[i];
  if(c==="("){i++;var L=[];ws();if(txt[i]===")"){i++;return L}for(;;){L.push(val());ws();if(txt[i]===","){i++;continue}if(txt[i]===")"){i++;break}if(i>=e)break}return L}
  if(c==="'"){var j=i+1,o="";for(;;){var q=txt.indexOf("'",j);if(q<0||q>=e){o+=txt.slice(j,e);i=e;break}o+=txt.slice(j,q);if(txt[q+1]==="'"){o+="'";j=q+2}else{i=q+1;break}}return o}
  if(c==="#"){var j2=i+1;while(j2<e&&/[0-9]/.test(txt[j2]))j2++;var r={ref:+txt.slice(i+1,j2)};i=j2;return r}
  if(c==="$"){i++;return null}if(c==="*"){i++;return null}
  if(c==="."){var j3=txt.indexOf(".",i+1);var en=txt.slice(i+1,j3);i=j3+1;return {en:en}}
  if(/[A-Za-z]/.test(c)){var j4=i;while(j4<e&&/[A-Za-z0-9_]/.test(txt[j4]))j4++;var tn=txt.slice(i,j4).toUpperCase();i=j4;ws();if(txt[i]==="("){var inner=val();return {typ:tn,v:inner[0]}}return {en:tn}}
  var j5=i;while(j5<e&&/[-+0-9.eE]/.test(txt[j5]))j5++;var num=parseFloat(txt.slice(i,j5));i=j5;return num}
 var v=val();return Array.isArray(v)?v:[v]}
function Step(txt){var E=stepIndex(txt);var self={E:E,
 get:function(r){if(r==null)return null;var id=typeof r==="object"?r.ref:r;var x=E.get(id);if(!x)return null;if(!x.a)x.a=parseArgs(txt,x.s,x.e+0);return {id:id,t:x.t,a:x.a}},
 byType:function(T){var out=[];E.forEach(function(x,id){if(T.indexOf(x.t)>=0)out.push(id)});return out},
 header:txt.slice(0,Math.min(txt.length,4000))};
 return self}
/* ---------------- 3D transforms (row-major 4x4 as 12 numbers: [r00 r01 r02 tx, r10 r11 r12 ty, r20 r21 r22 tz]) ---------------- */
var I4=[1,0,0,0,0,1,0,0,0,0,1,0];
function mul(A,B){var C=new Array(12);for(var r=0;r<3;r++){for(var c=0;c<3;c++)C[r*4+c]=A[r*4]*B[c]+A[r*4+1]*B[4+c]+A[r*4+2]*B[8+c];C[r*4+3]=A[r*4]*B[3]+A[r*4+1]*B[7]+A[r*4+2]*B[11]+A[r*4+3]}return C}
function app(M,p){var x=p[0],y=p[1],z=p[2]||0;return [M[0]*x+M[1]*y+M[2]*z+M[3],M[4]*x+M[5]*y+M[6]*z+M[7],M[8]*x+M[9]*y+M[10]*z+M[11]]}
function norm(v){var l=Math.hypot(v[0],v[1],v[2]||0)||1;return [v[0]/l,v[1]/l,(v[2]||0)/l]}
function cross(a,b){return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]}
/* ---------------- IFC ---------------- */
/* Stage: Import (IFC) - IfcWall -> walls, IfcDoor/IfcWindow -> openings, IfcBuildingStorey -> levels */
function parseIFC(txt,opt){opt=opt||{};var F=Step(txt),skipped={},notes=[];
 function G(r){return F.get(r)}
 function coords(p){var e=G(p);return e&&e.a[0]?e.a[0].map(Number):[0,0,0]}
 function dir(p,d){var e=G(p);return e?e.a[0].map(Number):d}
 function ax(p){var e=G(p);if(!e)return I4.slice();var o=coords(e.a[0]);
  if(e.t==="IFCAXIS2PLACEMENT2D"){var x2=e.a[1]?dir(e.a[1],[1,0]):[1,0];x2=norm([x2[0],x2[1],0]);return [x2[0],-x2[1],0,o[0],x2[1],x2[0],0,o[1],0,0,1,0]}
  var z=e.a[1]?norm(dir(e.a[1],[0,0,1])):[0,0,1],x=e.a[2]?norm(dir(e.a[2],[1,0,0])):(Math.abs(z[2])>0.9?[1,0,0]:norm(cross([0,0,1],z)));
  var d=x[0]*z[0]+x[1]*z[1]+x[2]*z[2];x=norm([x[0]-d*z[0],x[1]-d*z[1],x[2]-d*z[2]]);var y=cross(z,x);
  return [x[0],y[0],z[0],o[0],x[1],y[1],z[1],o[1],x[2],y[2],z[2],o[2]||0]}
 var PC={};function place(r){if(!r)return I4.slice();var id=r.ref;if(PC[id])return PC[id];var e=G(r),M=I4.slice();
  if(e&&e.t==="IFCLOCALPLACEMENT"){M=ax(e.a[1]);if(e.a[0])M=mul(place(e.a[0]),M)}PC[id]=M;return M}
 /* units */
 var scale=1,unitName="metre (assumed)";
 F.byType(["IFCUNITASSIGNMENT"]).slice(0,1).forEach(function(id){G(id).a[0].forEach(function(u){var e=G(u);if(!e)return;
  if(e.t==="IFCSIUNIT"&&e.a[1]&&e.a[1].en==="LENGTHUNIT"){var pf=e.a[2]&&e.a[2].en,m={MILLI:0.001,CENTI:0.01,DECI:0.1,KILO:1000}[pf]||1;scale=m;unitName=(pf?pf.toLowerCase():"")+"metre"}
  else if(e.t==="IFCCONVERSIONBASEDUNIT"&&e.a[1]&&e.a[1].en==="LENGTHUNIT"){var nm=String(e.a[2]||"").toUpperCase();var mw=G(e.a[3]);var f=mw&&mw.a[0]&&mw.a[0].v!=null?+mw.a[0].v:NaN;
   var base=1;if(mw&&mw.a[1]){var bu=G(mw.a[1]);if(bu&&bu.t==="IFCSIUNIT"){var p2=bu.a[2]&&bu.a[2].en;base={MILLI:0.001,CENTI:0.01,DECI:0.1}[p2]||1}}
   scale=isFinite(f)?f*base:(/INCH/.test(nm)?0.0254:0.3048);unitName=nm.toLowerCase()}})});
 var toFt=scale/0.3048;
 /* relations */
 var cont={},voids={},fills={},mats={};
 F.byType(["IFCRELCONTAINEDINSPATIALSTRUCTURE"]).forEach(function(id){var e=G(id),st=e.a[5]&&e.a[5].ref;(e.a[4]||[]).forEach(function(r){if(r&&r.ref)cont[r.ref]=st})});
 F.byType(["IFCRELVOIDSELEMENT"]).forEach(function(id){var e=G(id);if(e.a[4]&&e.a[5])voids[e.a[5].ref]=e.a[4].ref});
 F.byType(["IFCRELFILLSELEMENT"]).forEach(function(id){var e=G(id);if(e.a[4]&&e.a[5])fills[e.a[5].ref]=e.a[4].ref});
 F.byType(["IFCRELASSOCIATESMATERIAL"]).forEach(function(id){var e=G(id);(e.a[4]||[]).forEach(function(r){if(r&&r.ref)mats[r.ref]=e.a[5]&&e.a[5].ref})});
 F.byType(["IFCRELAGGREGATES"]).forEach(function(id){var e=G(id);var par=e.a[4]&&e.a[4].ref,pe=G(par);(e.a[5]||[]).forEach(function(r){if(r&&r.ref&&!cont[r.ref]&&pe&&pe.t==="IFCBUILDINGSTOREY")cont[r.ref]=par})});
 function layerTh(id){var m=G(mats[id]);if(!m)return null;if(m.t==="IFCMATERIALLAYERSETUSAGE")m=G(m.a[0]);if(m&&m.t==="IFCMATERIALLAYERSET"){var t=0;(m.a[0]||[]).forEach(function(l){var L=G(l);if(L)t+=+L.a[1]||0});return t>0?t:null}return null}
 /* geometry helpers: local-space points of Body / Axis */
 function curvePts(r,M,out,warn){var e=G(r);if(!e)return;
  if(e.t==="IFCPOLYLINE"){e.a[0].forEach(function(p){out.push(app(M,coords(p)))});return}
  if(e.t==="IFCINDEXEDPOLYCURVE"){var pl=G(e.a[0]);if(!pl)return;pl.a[0].forEach(function(c){out.push(app(M,c.map(Number)))});return}
  if(e.t==="IFCTRIMMEDCURVE"){var b=G(e.a[0]);function tp(T){var pt=null,par=null;(T||[]).forEach(function(x){if(x&&x.ref){var q=G(x);if(q&&q.t==="IFCCARTESIANPOINT")pt=coords(x)}else if(x&&x.typ==="IFCPARAMETERVALUE")par=+x.v;else if(typeof x==="number")par=x});return {pt:pt,par:par}}
   var t1=tp(e.a[1]),t2=tp(e.a[2]);
   if(b&&b.t==="IFCLINE"){var P=coords(b.a[0]),V=G(b.a[1]),D=V?dir(V.a[0],[1,0,0]):[1,0,0],mg=V?+V.a[1]||1:1;D=norm(D);
    function at(t){return t.pt?t.pt:[P[0]+D[0]*t.par*mg,P[1]+D[1]*t.par*mg,(P[2]||0)+D[2]*t.par*mg]}out.push(app(M,at(t1)));out.push(app(M,at(t2)));return}
   if(b&&(b.t==="IFCCIRCLE"||b.t==="IFCELLIPSE")){warn.curved=1;var C=mul(M,ax(b.a[0])),R=+b.a[1];function ca(t){if(t.pt)return app(M,t.pt);var a=t.par*Math.PI/180;return app(C,[R*Math.cos(a),R*Math.sin(a),0])}out.push(ca(t1));out.push(ca(t2));return}
   return}
  if(e.t==="IFCCOMPOSITECURVE"){(e.a[0]||[]).forEach(function(sg){var s=G(sg);if(s)curvePts(s.a[2],M,out,warn)});return}
  if(e.t==="IFCLINE"){return}}
 function profilePts(r,M,out,warn){var e=G(r);if(!e)return;
  if(e.t==="IFCRECTANGLEPROFILEDEF"||e.t==="IFCRECTANGLEHOLLOWPROFILEDEF"){var P=mul(M,e.a[2]?ax(e.a[2]):I4),X=+e.a[3]/2,Y=+e.a[4]/2;[[-X,-Y],[X,-Y],[X,Y],[-X,Y]].forEach(function(p){out.push(app(P,p))});return}
  if(e.t==="IFCARBITRARYCLOSEDPROFILEDEF"||e.t==="IFCARBITRARYPROFILEDEFWITHVOIDS"){curvePts(e.a[2],M,out,warn);return}
  if(e.t==="IFCDERIVEDPROFILEDEF"){profilePts(e.a[2],M,out,warn);return}}
 function solidPts(r,M,out,warn,depth){var e=G(r);if(!e||depth>6)return;
  if(e.t==="IFCEXTRUDEDAREASOLID"||e.t==="IFCEXTRUDEDAREASOLIDTAPERED"){var P=mul(M,e.a[1]?ax(e.a[1]):I4),D=dir(e.a[2],[0,0,1]),d=+e.a[3]||0,b=[];profilePts(e.a[0],I4,b,warn);
   b.forEach(function(p){out.push(app(P,p));out.push(app(P,[p[0]+D[0]*d,p[1]+D[1]*d,(p[2]||0)+D[2]*d]))});return}
  if(e.t==="IFCBOOLEANCLIPPINGRESULT"||e.t==="IFCBOOLEANRESULT"){solidPts(e.a[1],M,out,warn,depth+1);return}
  if(e.t==="IFCMAPPEDITEM"){var src=G(e.a[0]),T=G(e.a[1]),Mt=M;if(T){var o=coords(T.a[2]),x=T.a[0]?dir(T.a[0],[1,0,0]):[1,0,0],y=T.a[1]?dir(T.a[1],[0,1,0]):[0,1,0],s=T.a[3]!=null?+T.a[3]:1;Mt=mul(M,[x[0]*s,y[0]*s,0,o[0],x[1]*s,y[1]*s,0,o[1],0,0,s,o[2]||0])}
   if(src){var Mo=mul(Mt,ax(src.a[0])),rep=G(src.a[1]);if(rep)(rep.a[3]||[]).forEach(function(it){solidPts(it,Mo,out,warn,depth+1)})}return}
  if(e.t==="IFCFACETEDBREP"||e.t==="IFCFACEBASEDSURFACEMODEL"||e.t==="IFCPOLYGONALFACESET"||e.t==="IFCTRIANGULATEDFACESET"){
   if(e.t==="IFCPOLYGONALFACESET"||e.t==="IFCTRIANGULATEDFACESET"){var pl=G(e.a[0]);if(pl)pl.a[0].forEach(function(c){out.push(app(M,c.map(Number)))});return}
   /* brep: walk shell -> faces -> loops -> points */var sh=G(e.a[0]);var shells=e.t==="IFCFACETEDBREP"?[sh]:(e.a[0]||[]).map(G);
   shells.forEach(function(s){if(!s)return;(s.a[0]||[]).forEach(function(f){var fc=G(f);if(!fc)return;(fc.a[0]||[]).forEach(function(b){var bd=G(b);var lp=bd&&G(bd.a[0]);if(lp&&lp.t==="IFCPOLYLOOP")lp.a[0].forEach(function(p){out.push(app(M,coords(p)))})})})});return}
  if(e.t==="IFCBOUNDINGBOX"){var c=coords(e.a[0]),X=+e.a[1],Y=+e.a[2],Z=+e.a[3];[[0,0,0],[X,Y,Z]].forEach(function(q){out.push(app(M,[c[0]+q[0],c[1]+q[1],(c[2]||0)+q[2]]))});return}}
 function reps(prod){var pds=G(prod.a[6]);var R={};if(!pds)return R;(pds.a[2]||[]).forEach(function(r){var e=G(r);if(!e)return;var idn=String(e.a[1]||"").toLowerCase();if(!R[idn])R[idn]=[];R[idn]=R[idn].concat(e.a[3]||[])});return R}
 function bbox(P){var b={x0:Infinity,y0:Infinity,z0:Infinity,x1:-Infinity,y1:-Infinity,z1:-Infinity};P.forEach(function(p){b.x0=Math.min(b.x0,p[0]);b.x1=Math.max(b.x1,p[0]);b.y0=Math.min(b.y0,p[1]);b.y1=Math.max(b.y1,p[1]);b.z0=Math.min(b.z0,p[2]||0);b.z1=Math.max(b.z1,p[2]||0)});return P.length?b:null}
 /* storeys */
 var ST=F.byType(["IFCBUILDINGSTOREY"]).map(function(id){var e=G(id),M=place(e.a[5]);var el=e.a[9]!=null?+e.a[9]:M[11];var z=M?M[11]:el;if(!isFinite(z))z=el||0;return {id:id,name:String(e.a[2]||e.a[7]||("Level "+id)),z:z,walls:[],ops:[]}}).sort(function(a,b){return a.z-b.z});
 if(!ST.length)ST=[{id:0,name:"Ground Floor",z:0,walls:[],ops:[]}];
 var SI={};ST.forEach(function(s){SI[s.id]=s});
 function storeyOf(id,z){var s=SI[cont[id]];if(s)return s;var h=voids[id]?null:null;var best=ST[0];ST.forEach(function(q){if(z>=q.z-0.2/toFt)best=q});return best}
 var WT=["IFCWALL","IFCWALLSTANDARDCASE","IFCWALLELEMENTEDCASE"],wallById={};
 F.byType(WT).forEach(function(id){var e=G(id),M=place(e.a[5]),R=reps(e),warn={};
  var bodyL=[];(R.body||[]).concat(R[""]||[]).forEach(function(it){solidPts(it,I4,bodyL,warn,0)});
  var axL=[];(R.axis||[]).forEach(function(it){curvePts(it,I4,axL,warn)});
  var bb=bbox(bodyL),lt=layerTh(id),th,cy,x0,x1,swap=false;
  if(bb&&(bb.y1-bb.y0)>(bb.x1-bb.x0)*1.05&&!axL.length)swap=true;
  if(bb){var tY=swap?bb.x1-bb.x0:bb.y1-bb.y0;th=lt||tY;cy=swap?(bb.x0+bb.x1)/2:(bb.y0+bb.y1)/2}else if(lt){th=lt;cy=0}else{bump(skipped,"Wall without readable geometry");return}
  var pts2;if(axL.length>=2){pts2=axL.map(function(p){return [p[0],p[1]]});
   /* axis may be on a face: centre from body */if(bb&&!swap){var ay=(pts2[0][1]+pts2[pts2.length-1][1])/2;if(Math.abs(ay-cy)>th*0.05)pts2=pts2.map(function(p){return [p[0],p[1]+(cy-ay)]})}}
  else if(bb){pts2=swap?[[cy,bb.y0],[cy,bb.y1]]:[[bb.x0,cy],[bb.x1,cy]]}
  else{bump(skipped,"Wall without axis or body");return}
  if(warn.curved)bump(skipped,"Curved wall (imported as straight chord)");
  var z0=bb?bb.z0:0,z1=bb?bb.z1:3/toFt,W0=app(M,[0,0,z0]),st=storeyOf(id,W0[2]);
  for(var i=0;i+1<pts2.length;i++){var A=app(M,[pts2[i][0],pts2[i][1],0]),B=app(M,[pts2[i+1][0],pts2[i+1][1],0]);var L=Math.hypot(B[0]-A[0],B[1]-A[1])*toFt;if(L<0.1)continue;
   var w={a:{x:A[0]*toFt,y:A[1]*toFt},b:{x:B[0]*toFt,y:B[1]*toFt},th:th*toFt*12,h:(z1-z0)*toFt,name:String(e.a[2]||""),ifc:id};st.walls.push(w);(wallById[id]=wallById[id]||[]).push(w)}});
 ["IFCCURTAINWALL","IFCSLAB","IFCCOLUMN","IFCBEAM","IFCSTAIR","IFCSTAIRFLIGHT","IFCRAILING","IFCROOF","IFCFURNISHINGELEMENT","IFCCOVERING","IFCMEMBER","IFCPLATE","IFCFOOTING","IFCSPACE","IFCBUILDINGELEMENTPROXY","IFCFLOWTERMINAL"].forEach(function(T){var n=F.byType([T]).length;if(n)bump(skipped,T.replace(/^IFC/,"Ifc").replace(/(ELEMENT|WALL|FLIGHT|TERMINAL|PROXY)$/,function(m){return m.charAt(0)+m.slice(1).toLowerCase()}),n)});
 [["IFCDOOR","D"],["IFCWINDOW","W"],["IFCDOORSTANDARDCASE","D"],["IFCWINDOWSTANDARDCASE","W"]].forEach(function(tp){F.byType([tp[0]]).forEach(function(id){var e=G(id),M=place(e.a[5]);
  var oh=e.a[8]!=null?+e.a[8]:NaN,ow=e.a[9]!=null?+e.a[9]:NaN;var op=fills[id],host=op?voids[op]:null,ctr=null,z0=null,ohB=null,owB=null;
  if(op){var oe=G(op),Mo=place(oe.a[5]),P=[];var R=reps(oe);(R.body||[]).concat(R[""]||[]).forEach(function(it){solidPts(it,I4,P,{},0)});var b=bbox(P);
   if(b){var c=app(Mo,[(b.x0+b.x1)/2,(b.y0+b.y1)/2,b.z0]);ctr=c;z0=c[2];ohB=b.z1-b.z0;owB=Math.max(b.x1-b.x0,b.y1-b.y0);/* width = side along the wall */
    var hw=wallById[host]&&wallById[host][0];if(hw){var ux=hw.b.x-hw.a.x,uy=hw.b.y-hw.a.y,ul=Math.hypot(ux,uy);ux/=ul;uy/=ul;var cs=[[b.x0,b.y0],[b.x1,b.y0],[b.x1,b.y1],[b.x0,b.y1]].map(function(q){var w=app(Mo,[q[0],q[1],0]);return w[0]*ux+w[1]*uy});owB=(Math.max.apply(0,cs)-Math.min.apply(0,cs))*toFt/toFt}}}
  if(!isFinite(ow))ow=owB;if(!isFinite(oh))oh=ohB;
  if(!(ow>0)){bump(skipped,(tp[1]==="D"?"Door":"Window")+" without size");return}
  if(!ctr){/* IFC convention: placement at the lower-left of the lining, X along the width */ctr=app(M,[ow/2,0,0]);z0=ctr[2]}
  var st=storeyOf(host||id,ctr[2]);var sill=Math.max(0,(z0-st.z)*toFt);
  var name=String(e.a[2]||""),type=tp[1],dk;if(type==="D"){dk=/main|entr|front/i.test(name)?"MD":/toilet|bath|wc|wash/i.test(name)?"TD":"D"}else if((oh*toFt)<=2.2&&sill>=5)type="V";
  st.ops.push({x:ctr[0]*toFt,y:ctr[1]*toFt,w:ow*toFt,h:(oh>0?oh:(type==="D"?7/toFt:4/toFt))*toFt,sill:sill,type:type,dk:dk,name:name,host:host?wallById[host]:null})})});
 var levels=ST.map(function(s,i){var nx=ST[i+1],h=nx?(nx.z-s.z)*toFt:0;if(!(h>=6&&h<=30)){var mh=0;s.walls.forEach(function(w){mh=Math.max(mh,w.h)});h=mh>=6&&mh<=30?mh:10}
  return {name:s.name,elev:s.z*toFt,h:Math.round(h*12)/12,walls:s.walls,ops:s.ops}}).filter(function(L){return L.walls.length||L.ops.length});
 if(!levels.length)notes.push("No walls found in this IFC file");
 var schema=(F.header.match(/FILE_SCHEMA\s*\(\s*\(\s*'([^']+)'/i)||[])[1]||"?";var app0=(F.header.match(/FILE_NAME\s*\([^;]*?'[^']*'\s*,\s*'[^']*'\s*,\s*\([^)]*\)\s*,\s*\([^)]*\)\s*,\s*'([^']*)'/i)||[])[1]||"";
 return {src:"ifc",units:unitName,schema:schema,app:app0,levels:levels,skipped:skipped,notes:notes}}

/* ---------------- DXF ---------------- */
var DXFU={0:null,1:["inch",1/12],2:["feet",1],4:["mm",1/304.8],5:["cm",1/30.48],6:["m",1/0.3048]};
var UNITS={mm:1/304.8,cm:1/30.48,m:1/0.3048,inch:1/12,feet:1};
/* Stage: Import (DXF) - read layers and units */
function readDXF(txt){var P=new DxfParser();var d=P.parseSync(txt);var layers={};
 function L(n){n=n||"0";if(!layers[n])layers[n]={name:n,count:0,types:{},role:"ignore"};return layers[n]}
 (d.entities||[]).forEach(function(e){var l=L(e.layer);l.count++;bump(l.types,e.type)});
 var iu=d.header&&d.header.$INSUNITS,u=DXFU[iu]?DXFU[iu][0]:null;
 /* guess units from extents when unitless */
 var bb=extents(d);if(!u){var ext=Math.max(bb.x1-bb.x0,bb.y1-bb.y0);u=ext>2000?"mm":ext>300?"inch":"feet";u={g:u}.g;d.__guess=true}
 Object.keys(layers).forEach(function(k){var l=layers[k],n=k.toLowerCase(),blk=Object.keys(l.types).indexOf("INSERT")>=0;
  if(/wall|wand|mur|^a-wall|^s-wall|brick|masonry/.test(n)&&!/fill|hatch|patt|text|dim/.test(n))l.role="wall";
  else if(/door|^a-door|\bdr\b|kathavu/.test(n))l.role="door";else if(/win|glaz|wndw|vent/.test(n))l.role="window"});
 /* block names also mark doors / windows even when on layer 0 */
 return {dxf:d,layers:layers,units:u,guessed:!!d.__guess,ext:bb}}
function extents(d){var b={x0:Infinity,y0:Infinity,x1:-Infinity,y1:-Infinity};function a(p){if(!p||!isFinite(p.x))return;b.x0=Math.min(b.x0,p.x);b.x1=Math.max(b.x1,p.x);b.y0=Math.min(b.y0,p.y);b.y1=Math.max(b.y1,p.y)}
 (d.entities||[]).forEach(function(e){(e.vertices||[]).forEach(a);a(e.position);a(e.center)});if(!isFinite(b.x0))b={x0:0,y0:0,x1:1,y1:1};return b}
function blockBox(d,name,depth){var B=d.blocks&&d.blocks[name];if(!B||depth>4)return null;var b={x0:Infinity,y0:Infinity,x1:-Infinity,y1:-Infinity};function a(x,y){b.x0=Math.min(b.x0,x);b.x1=Math.max(b.x1,x);b.y0=Math.min(b.y0,y);b.y1=Math.max(b.y1,y)}
 (B.entities||[]).forEach(function(e){if(e.vertices)e.vertices.forEach(function(p){a(p.x,p.y)});if(e.type==="ARC"||e.type==="CIRCLE"){var c=e.center,r=e.radius;if(e.type==="CIRCLE"){a(c.x-r,c.y-r);a(c.x+r,c.y+r)}else{var s=e.startAngle,en=e.endAngle;if(en<s)en+=Math.PI*2;a(c.x,c.y);for(var t=s;t<=en+1e-9;t+=Math.PI/16)a(c.x+r*Math.cos(t),c.y+r*Math.sin(t));a(c.x+r*Math.cos(en),c.y+r*Math.sin(en))}}
  if(e.type==="INSERT"){var q=blockBox(d,e.name,depth+1);if(q){var T=insXf(e);[[q.x0,q.y0],[q.x1,q.y0],[q.x1,q.y1],[q.x0,q.y1]].forEach(function(p){var w=T(p[0],p[1]);a(w.x,w.y)})}}});
 if(!isFinite(b.x0))return null;var bp=B.position||{x:0,y:0};b.x0-=bp.x||0;b.x1-=bp.x||0;b.y0-=bp.y||0;b.y1-=bp.y||0;return b}
function insXf(e){var sx=e.xScale!=null?e.xScale:1,sy=e.yScale!=null?e.yScale:1,r=(e.rotation||0)*Math.PI/180,c=Math.cos(r),s=Math.sin(r),p=e.position||{x:0,y:0};return function(x,y){x*=sx;y*=sy;return {x:p.x+x*c-y*s,y:p.y+x*s+y*c}}}
/* convert using user choices: roles {layer:role}, units key, opts {minT,maxT (in), single (bool), singleTh (in)} */
/* Stage: Import (DXF) - wall lines -> walls (double lines -> thickness), door/window blocks -> openings */
function convertDXF(R,roles,unit,opts){opts=opts||{};var d=R.dxf,k=UNITS[unit]||1,skipped={},notes=[];var minT=(opts.minT||2)/12,maxT=(opts.maxT||16)/12;
 function role(e){var r=roles[e.layer||"0"]||"ignore";if(e.type==="INSERT"&&r!=="wall"){var n=(e.name||"").toLowerCase();if(/door|^dr|kathavu/.test(n))return "door";if(/win|glaz|wndw|vent/.test(n))return "window"}return r}
 var lines=[],ins=[],arcs=[],wlines=[];
 function P(p){return {x:p.x*k,y:p.y*k}}
 (d.entities||[]).forEach(function(e){var r=role(e);if(r==="ignore"){return}
  if(r==="wall"){if(e.type==="LINE"&&e.vertices&&e.vertices.length>=2)lines.push([P(e.vertices[0]),P(e.vertices[1])]);
   else if((e.type==="LWPOLYLINE"||e.type==="POLYLINE")&&e.vertices){var v=e.vertices.map(P);var bul=e.vertices.some(function(q){return q.bulge});if(bul)bump(skipped,"Wall arcs (bulges) imported as straight chords");for(var i=0;i+1<v.length;i++)lines.push([v[i],v[i+1]]);if(e.shape||e.closed)lines.push([v[v.length-1],v[0]])}
   else bump(skipped,"Wall-layer "+e.type);return}
  if(e.type==="INSERT"){ins.push({e:e,r:r});return}
  if(e.type==="ARC"&&r==="door"){arcs.push(e);return}
  if(e.type==="LINE"&&r==="window"){wlines.push([P(e.vertices[0]),P(e.vertices[1])]);return}
  if(e.type==="LWPOLYLINE"&&r==="window"&&e.vertices){var v2=e.vertices.map(P);for(var j=0;j+1<v2.length;j++)wlines.push([v2[j],v2[j+1]]);return}
  bump(skipped,(r==="door"?"Door":"Window")+"-layer "+e.type)});
 lines=lines.filter(function(l){return Math.hypot(l[1].x-l[0].x,l[1].y-l[0].y)>0.15});
 /* pair parallel face lines -> centre line + thickness */
 var info=lines.map(function(l){var dx=l[1].x-l[0].x,dy=l[1].y-l[0].y,L=Math.hypot(dx,dy),u={x:dx/L,y:dy/L};if(u.x<-1e-9||(Math.abs(u.x)<1e-9&&u.y<0)){u={x:-u.x,y:-u.y};l=[l[1],l[0]]}return {l:l,u:u,L:L,min:Infinity}});
 var cand=[];var cell=Math.max(maxT*4,6),grid={};function key(x,y){return Math.floor(x/cell)+","+Math.floor(y/cell)}
 info.forEach(function(a,i){var n=Math.max(1,Math.ceil(a.L/cell));var seen={};for(var s=0;s<=n;s++){var x=a.l[0].x+(a.l[1].x-a.l[0].x)*s/n,y=a.l[0].y+(a.l[1].y-a.l[0].y)*s/n,kk=key(x,y);if(!seen[kk]){seen[kk]=1;(grid[kk]=grid[kk]||[]).push(i)}}});
 function near(i){var a=info[i],out={};var n=Math.max(1,Math.ceil(a.L/cell));for(var s=0;s<=n;s++){var x=a.l[0].x+(a.l[1].x-a.l[0].x)*s/n,y=a.l[0].y+(a.l[1].y-a.l[0].y)*s/n,cx=Math.floor(x/cell),cy=Math.floor(y/cell);for(var ox=-1;ox<=1;ox++)for(var oy=-1;oy<=1;oy++)(grid[(cx+ox)+","+(cy+oy)]||[]).forEach(function(j){if(j>i)out[j]=1})}return Object.keys(out).map(Number)}
 info.forEach(function(a,i){near(i).forEach(function(j){var b=info[j];if(Math.abs(a.u.x*b.u.y-a.u.y*b.u.x)>0.035)return;var nx=-a.u.y,ny=a.u.x;var dist=(b.l[0].x-a.l[0].x)*nx+(b.l[0].y-a.l[0].y)*ny;var d=Math.abs(dist);if(d<minT||d>maxT)return;
  var t0=0,t1=a.L,s0=(b.l[0].x-a.l[0].x)*a.u.x+(b.l[0].y-a.l[0].y)*a.u.y,s1=(b.l[1].x-a.l[0].x)*a.u.x+(b.l[1].y-a.l[0].y)*a.u.y;var lo=Math.max(t0,Math.min(s0,s1)),hi=Math.min(t1,Math.max(s0,s1));var ov=hi-lo;if(ov<Math.min(0.5,Math.min(a.L,b.L)*0.4))return;
  cand.push({i:i,j:j,d:d,dist:dist,lo:lo,hi:hi});a.min=Math.min(a.min,d);b.min=Math.min(b.min,d)})});
 var used={},walls=[];cand.forEach(function(c){var a=info[c.i],b=info[c.j];if(c.d>a.min*1.12+0.01||c.d>b.min*1.12+0.01)return;used[c.i]=used[c.j]=1;
  var nx=-a.u.y,ny=a.u.x,o=c.dist/2;var A={x:a.l[0].x+a.u.x*c.lo+nx*o,y:a.l[0].y+a.u.y*c.lo+ny*o},B={x:a.l[0].x+a.u.x*c.hi+nx*o,y:a.l[0].y+a.u.y*c.hi+ny*o};walls.push({a:A,b:B,th:c.d*12})});
 var unp=info.filter(function(a,i){return !used[i]});
 if(opts.single){unp.forEach(function(a){walls.push({a:a.l[0],b:a.l[1],th:opts.singleTh||4.5,single:true})})}else if(unp.length)bump(skipped,"Unpaired wall lines (jambs, wall ends)",unp.length);
 /* round thickness to 1/2 inch */walls.forEach(function(w){w.th=Math.max(2,Math.round(w.th*2)/2)});
 /* openings (before merging, so gaps with an opening can be bridged) */
 var ops=[];
 ins.forEach(function(it){var e=it.e,b=blockBox(d,e.name,0);if(!b){bump(skipped,"Empty block "+e.name);return}var T=insXf(e);var cs=[[b.x0,b.y0],[b.x1,b.y0],[b.x1,b.y1],[b.x0,b.y1]].map(function(p){var w=T(p[0],p[1]);return {x:w.x*k,y:w.y*k}});
  var c={x:(cs[0].x+cs[2].x)/2,y:(cs[0].y+cs[2].y)/2};var r0=(e.rotation||0)*Math.PI/180;ops.push({corners:cs,x:c.x,y:c.y,ins:{x:e.position.x*k,y:e.position.y*k},rot:r0,type:it.r==="door"?"D":"W",name:e.name||"",src:"block"})});
 arcs.forEach(function(e){var r=e.radius*k;if(r<1.2||r>6){bump(skipped,"Door-layer arc (not a door swing)");return}var c={x:e.center.x*k,y:e.center.y*k},s={x:c.x+Math.cos(e.startAngle)*r,y:c.y+Math.sin(e.startAngle)*r},t={x:c.x+Math.cos(e.endAngle)*r,y:c.y+Math.sin(e.endAngle)*r};ops.push({hinge:c,r:r,ends:[s,t],x:c.x,y:c.y,type:"D",name:"arc",src:"arc"})});
 walls=mergeColinear(walls,ops);snapEnds(walls);
 /* host + position */
 var out=[];ops.forEach(function(o){var best=null,bd=Infinity;var probes=o.src==="arc"?[o.hinge]:[{x:o.x,y:o.y},o.ins];
  walls.forEach(function(w){probes.forEach(function(probe){var q=proj(probe,w.a,w.b);var lim=w.th/24+(o.src==="block"?1.5:0.6);if(q.d<lim&&q.t>-0.02&&q.t<1.02&&q.d<bd){bd=q.d;best={w:w,q:q}}})});
  if(!best){bump(skipped,(o.type==="D"?"Door":"Window")+" not on a wall");return}var w=best.w,L=Math.hypot(w.b.x-w.a.x,w.b.y-w.a.y),u={x:(w.b.x-w.a.x)/L,y:(w.b.y-w.a.y)/L};
  var cx,wd;if(o.src==="arc"){var ends=o.ends.map(function(p){return proj(p,w.a,w.b)});var e=ends[0].d<ends[1].d?o.ends[0]:o.ends[1];var dirn=(e.x-o.hinge.x)*u.x+(e.y-o.hinge.y)*u.y;wd=o.r;cx=best.q.t*L+(dirn>=0?1:-1)*o.r/2}
  else{var ts=o.corners.map(function(p){return (p.x-w.a.x)*u.x+(p.y-w.a.y)*u.y});var lo=Math.min.apply(0,ts),hi=Math.max.apply(0,ts);wd=hi-lo;cx=(lo+hi)/2;
   /* door blocks include the swing: the extent along the wall is still the leaf width */}
  if(!(wd>0.8&&wd<20)){bump(skipped,(o.type==="D"?"Door":"Window")+" with odd size");return}
  var type=o.type,dk;if(type==="D")dk=/main|entr|front|md/i.test(o.name)?"MD":/toilet|bath|wc|td/i.test(o.name)?"TD":"D";else if(wd<=2.6&&/vent|\bv\b/i.test(o.name))type="V";
  out.push({x:w.a.x+u.x*cx,y:w.a.y+u.y*cx,w:Math.round(wd*24)/24,type:type,dk:dk,name:o.name,hostW:w})});
 /* windows drawn as plain lines on the window layer */
 var groups=[];wlines.forEach(function(l){var m={x:(l[0].x+l[1].x)/2,y:(l[0].y+l[1].y)/2},Ll=Math.hypot(l[1].x-l[0].x,l[1].y-l[0].y);if(Ll<0.8)return;var best=null;walls.forEach(function(w){var L=Math.hypot(w.b.x-w.a.x,w.b.y-w.a.y),ux=(w.b.x-w.a.x)/L,uy=(w.b.y-w.a.y)/L;if(Math.abs(((l[1].x-l[0].x)*uy-(l[1].y-l[0].y)*ux)/Ll)>0.05)return;var q=proj(m,w.a,w.b);if(q.d<=w.th/24+0.15&&(!best||q.d<best.d))best={w:w,d:q.d,ux:ux,uy:uy}});
  if(!best)return;var w=best.w,t0=(l[0].x-w.a.x)*best.ux+(l[0].y-w.a.y)*best.uy,t1=(l[1].x-w.a.x)*best.ux+(l[1].y-w.a.y)*best.uy,lo=Math.min(t0,t1),hi=Math.max(t0,t1);
  var g=groups.find(function(g){return g.w===w&&lo<g.hi-0.05&&hi>g.lo+0.05});if(g){g.lo=Math.min(g.lo,lo);g.hi=Math.max(g.hi,hi)}else groups.push({w:w,lo:lo,hi:hi,ux:best.ux,uy:best.uy})});
 groups.forEach(function(g){var c=(g.lo+g.hi)/2,wd=g.hi-g.lo;if(out.some(function(o){return o.hostW===g.w&&Math.abs(((o.x-g.w.a.x)*g.ux+(o.y-g.w.a.y)*g.uy)-c)<wd/2}))return;out.push({x:g.w.a.x+g.ux*c,y:g.w.a.y+g.uy*c,w:Math.round(wd*24)/24,type:"W",name:"lines",hostW:g.w})});
 out.forEach(function(o){if(o.type==="D"){o.h=7;o.sill=0}else if(o.type==="V"){o.h=1.5;o.sill=7}else{o.h=4;o.sill=3}});
 walls.forEach(function(w){w.h=10});
 if(!walls.length)notes.push("No walls found - pick the wall layer(s) and check units");
 return {src:"dxf",units:unit,levels:[{name:"Imported",elev:0,h:10,walls:walls,ops:out}],skipped:skipped,notes:notes,unpaired:unp.length}}
function proj(p,a,b){var dx=b.x-a.x,dy=b.y-a.y,L2=dx*dx+dy*dy;if(L2<1e-12)return {t:0,d:Math.hypot(p.x-a.x,p.y-a.y)};var t=((p.x-a.x)*dx+(p.y-a.y)*dy)/L2,tc=Math.max(0,Math.min(1,t));return {t:t,d:Math.hypot(p.x-(a.x+dx*tc),p.y-(a.y+dy*tc))}}
/* merge colinear centre lines of equal thickness; bridge small gaps and gaps that hold an opening */
function mergeColinear(W,ops){var done=false,guard=0;
 while(!done&&guard++<50){done=true;outer:for(var i=0;i<W.length;i++)for(var j=i+1;j<W.length;j++){var a=W[i],b=W[j];if(Math.abs(a.th-b.th)>0.6)continue;
   var L=Math.hypot(a.b.x-a.a.x,a.b.y-a.a.y),ux=(a.b.x-a.a.x)/L,uy=(a.b.y-a.a.y)/L,Lb=Math.hypot(b.b.x-b.a.x,b.b.y-b.a.y);if(Lb<1e-6)continue;
   if(Math.abs(ux*(b.b.y-b.a.y)/Lb-uy*(b.b.x-b.a.x)/Lb)>0.03)continue;var off=Math.abs(-(b.a.x-a.a.x)*uy+(b.a.y-a.a.y)*ux);if(off>Math.max(0.06,a.th/12*0.25))continue;
   var s0=(b.a.x-a.a.x)*ux+(b.a.y-a.a.y)*uy,s1=(b.b.x-a.a.x)*ux+(b.b.y-a.a.y)*uy,lo=Math.min(s0,s1),hi=Math.max(s0,s1);var gap=Math.max(lo-L,0-hi);
   var ok=gap<=Math.max(a.th,b.th)/12*1.6+0.1;
   if(!ok&&gap<=16){var g0=gap===lo-L?L:hi,g1=gap===lo-L?lo:0;ok=ops.some(function(o){var p=o.src==="arc"?o.hinge:(o.ins&&Math.abs(-(o.ins.x-a.a.x)*uy+(o.ins.y-a.a.y)*ux)<Math.abs(-(o.x-a.a.x)*uy+(o.y-a.a.y)*ux)?o.ins:o);var t=(p.x-a.a.x)*ux+(p.y-a.a.y)*uy,n=Math.abs(-(p.x-a.a.x)*uy+(p.y-a.a.y)*ux);return t>=g0-0.6&&t<=g1+0.6&&n<a.th/24+1.2})}
   if(!ok)continue;var n0=Math.min(0,lo),n1=Math.max(L,hi);var a0={x:a.a.x,y:a.a.y};a.a={x:a0.x+ux*n0,y:a0.y+uy*n0};a.b={x:a0.x+ux*n1,y:a0.y+uy*n1};a.th=Math.max(a.th,b.th);W.splice(j,1);done=false;break outer}}
 return W}
/* corner / T joins: pull loose ends onto the nearest other centre line */
function snapEnds(W){for(var pass=0;pass<2;pass++)W.forEach(function(w){["a","b"].forEach(function(k){var p=w[k],other=w[k==="a"?"b":"a"];var best=null,bd=Infinity;
  W.forEach(function(v){if(v===w)return;["a","b"].forEach(function(kk){var d=Math.hypot(v[kk].x-p.x,v[kk].y-p.y);if(d<0.03&&d<bd){bd=d;best={x:v[kk].x,y:v[kk].y,end:1}}})});if(best&&best.end){w[k]=best;return}
  W.forEach(function(v){var dx=v.b.x-v.a.x,dy=v.b.y-v.a.y,L2=dx*dx+dy*dy;if(L2<1e-9)return;var L=Math.sqrt(L2);var wl=Math.hypot(w.b.x-w.a.x,w.b.y-w.a.y),wx=(p.x-other.x)/wl,wy=(p.y-other.y)/wl;if(Math.abs(wx*dy/L-wy*dx/L)<0.2)return;/* not parallel */
   /* intersection of w's line with v's line */var den=wx*dy-wy*dx;var t=((v.a.x-p.x)*dy-(v.a.y-p.y)*dx)/den;var X={x:p.x+wx*t,y:p.y+wy*t};var s=((X.x-v.a.x)*dx+(X.y-v.a.y)*dy)/L2;
   var lim=Math.max(w.th,v.th)/12*0.75+0.15;if(Math.abs(t)<=lim&&s>-lim/L&&s<1+lim/L&&Math.abs(t)<bd){bd=Math.abs(t);best=X;
    /* extend v too when the join is past its end (L corner) */best.v=v;best.s=s}});
  if(best){w[k]={x:best.x,y:best.y};var v=best.v;if(v&&(best.s<0||best.s>1)){var kk=best.s<0?"a":"b";v[kk]={x:best.x,y:best.y}}}})})}
return {parseIFC:parseIFC,readDXF:readDXF,convertDXF:convertDXF,UNITS:UNITS,Step:Step}})();
if(typeof module!=="undefined")module.exports=JKI;
