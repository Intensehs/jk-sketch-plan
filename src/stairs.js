/* ================= Stairs as objects (Revit-style): drawn by their centre (walk) line =================
 Stage: Circulation - Stair objects. Each level keeps S.stairs = [{id, pts:[walk line bottom -> top], w (ft), td (tread inch), rmax (max riser inch),
 land (landing at turns, default on), ld (landing depth ft), fit:{x0,y0,w,h}+type/flip/swap when it was made by tapping a room}].
 The stair no longer depends on the room around it, so deleting walls or the stair itself never re-grows it (old delete bug). */
var ST_DEF={w:3.5,td:10,rmax:7};
function stWalkOn(){return S.meta.stWalk!==false}
function stClean(P){var out=[];(P||[]).forEach(function(p){if(!p||!isFinite(p.x)||!isFinite(p.y))return;var l=out[out.length-1];if(l&&Math.hypot(p.x-l.x,p.y-l.y)<0.05)return;out.push({x:p.x,y:p.y})});
 for(var i=1;i<out.length-1;i++){var a=out[i-1],b=out[i],c=out[i+1],ux=b.x-a.x,uy=b.y-a.y,vx=c.x-b.x,vy=c.y-b.y,cr=ux*vy-uy*vx,dt=ux*vx+uy*vy;if(Math.abs(cr)<1e-6*Math.hypot(ux,uy)*Math.hypot(vx,vy)+1e-9&&dt>0){out.splice(i,1);i--}}return out}
function stLv(){return curLv()}
/* geometry: flights along each leg, landings (or 2 winders at a 90° turn when landing is off) at the bends; risers from the level height */
function stGeo(st,H){var P=stClean(st.pts);if(P.length<2)return null;H=H||wallH();
 var W=clamp(+st.w||ST_DEF.w,1.5,20),T=clamp((+st.td||ST_DEF.td)/12,6/12,18/12),rmax=clamp((+st.rmax||ST_DEF.rmax)/12,4/12,9/12),land=st.land!==false,ld=Math.max(W,+st.ld||W);
 var nR=Math.max(2,Math.ceil(H/rmax-1e-6)),R=H/nR,legs=[],i;
 for(i=0;i<P.length-1;i++){var a=P[i],b=P[i+1],L=Math.hypot(b.x-a.x,b.y-a.y),u={x:(b.x-a.x)/L,y:(b.y-a.y)/L};legs.push({a:a,b:b,L:L,u:u,nv:{x:-u.y,y:u.x}})}
 var F=legs.length,ct=[null];for(i=1;i<F;i++){var d=legs[i-1].u.x*legs[i].u.x+legs[i-1].u.y*legs[i].u.y;ct.push(land||Math.abs(d)>0.17?"land":"wind")}
 legs.forEach(function(g,j){g.s0=j?W/2:0;g.e0=j<F-1?(ct[j+1]==="land"?ld-W/2:W/2):0;g.av=Math.max(0,g.L-g.s0-g.e0);g.cap=Math.floor(g.av/T+1e-6)});
 var nWind=ct.filter(function(c){return c==="wind"}).length,need=Math.max(0,nR-F-nWind),left=need;
 legs.forEach(function(g){g.n=Math.min(g.cap,left);left-=g.n});var rem=left,created=nR-rem;
 function at(p,u,s,n,o){return {x:p.x+u.x*s+n.x*o,y:p.y+u.y*s+n.y*o}}
 function rect(g,s0,s1){return [at(g.a,g.u,s0,g.nv,-W/2),at(g.a,g.u,s1,g.nv,-W/2),at(g.a,g.u,s1,g.nv,W/2),at(g.a,g.u,s0,g.nv,W/2)]}
 var steps=[],c=0,lands=[];
 legs.forEach(function(g,j){for(var t=0;t<g.n;t++){c++;steps.push({pts:rect(g,g.s0+t*T,g.s0+(t+1)*T),z:c*R,leg:j})}
  var endT=g.s0+g.n*T;c++;
  if(j<F-1){var V=g.b,go=legs[j+1];
   if(ct[j+1]==="land"){var back=Math.max(g.L-endT,ld-W/2),Lp=[at(V,g.u,-back,g.nv,-W/2),at(V,g.u,W/2,g.nv,-W/2),at(V,g.u,W/2,g.nv,W/2),at(V,g.u,-back,g.nv,W/2)];var o={pts:Lp,z:c*R,landing:true,k:j+1};steps.push(o);lands.push(o)}
   else{if(g.L-W/2-endT>0.02)steps.push({pts:rect(g,endT,g.L-W/2),z:c*R,landing:true,gap:true});
    var A0=at(V,g.u,-W/2,go.u,-W/2),A1=at(V,g.u,W/2,go.u,-W/2),A2=at(V,g.u,W/2,go.u,W/2),A3=at(V,g.u,-W/2,go.u,W/2);
    steps.push({pts:[A3,A0,A1],z:c*R,winder:true});c++;steps.push({pts:[A1,A2,A3],z:c*R,winder:true})}}
  else if(g.L-endT>0.1)steps.push({pts:rect(g,endT,g.L),z:c*R,landing:true,top:true})});
 /* U-turn with a short middle leg: the two landings become one */
 for(i=1;i<F-1;i++){var g=legs[i];if(g.n===0&&ct[i]==="land"&&ct[i+1]==="land"){var L1=lands.find(function(o){return o.k===i}),L2=lands.find(function(o){return o.k===i+1});
  if(L1&&L2){var g0=legs[i-1],pp=L1.pts.concat(L2.pts),org=L1.pts[0],ss=pp.map(function(p){return (p.x-org.x)*g0.u.x+(p.y-org.y)*g0.u.y}),oo=pp.map(function(p){return (p.x-org.x)*g0.nv.x+(p.y-org.y)*g0.nv.y}),
   s0=Math.min.apply(null,ss),s1=Math.max.apply(null,ss),o0=Math.min.apply(null,oo),o1=Math.max.apply(null,oo);
   L1.pts=[at(org,g0.u,s0,g0.nv,o0),at(org,g0.u,s1,g0.nv,o0),at(org,g0.u,s1,g0.nv,o1),at(org,g0.u,s0,g0.nv,o1)];L1.z=Math.max(L1.z,L2.z);steps.splice(steps.indexOf(L2),1);lands.splice(lands.indexOf(L2),1)}}}
 var walk=P.slice();walk[0]=at(P[0],legs[0].u,Math.min(T/2,legs[0].L/3),legs[0].nv,0);
 var e=walk[walk.length-1],q0=walk[walk.length-2],ux=e.x-q0.x,uy=e.y-q0.y,ul=Math.hypot(ux,uy)||1;ux/=ul;uy/=ul;var hl=Math.min(0.75,ul*0.4),hw=0.3,q={x:e.x-ux*hl,y:e.y-uy*hl};
 var head=[e,{x:q.x-uy*hw,y:q.y+ux*hw},{x:q.x+uy*hw,y:q.y-ux*hw}],l0=legs[0],upS=Math.min(T*0.5+1.2,l0.L*0.4);
 var nT=steps.filter(function(s){return !s.landing&&!s.winder}).length,run=legs.reduce(function(s,g){return s+g.L},0);
 var G={id:st.id,obj:st,W:W,T:T,R:R,nR:nR,H:H,created:created,remaining:rem,nTreads:nT,land:land,ld:ld,legs:F,run:run,steps:steps,walk:walk,head:head,
  outline:steps.map(function(s){return s.pts}),treads:[],cut:null,arrow:stWalkOn()?walk:[],showWalk:stWalkOn(),up:at(P[0],l0.u,upS,l0.nv,Math.min(0.9,W*0.25)),ang:Math.atan2(l0.u.y,l0.u.x)};
 G.box=G.outline[0];G.n=nT;G.info=nR+" risers @ "+fmt(R*12,2)+"\" · treads "+fmt(T*12,1)+"\""+(rem?" · "+created+" created, "+rem+" remaining":"");
 G.warn=rem?"Run too short: "+created+" risers created, "+rem+" remaining - make the centre line longer by about "+fi(rem*T):"";return G}
function stairById(id){return (S.stairs||[]).find(function(s){return s.id===id})}
function stairPts(st){var G=stGeo(st);if(!G)return (st.pts||[]).map(function(p){return {x:p.x,y:p.y}});var out=[];G.outline.forEach(function(P){P.forEach(function(p){out.push(p)})});return out}
function stairHitD(st,w){var G=stGeo(st);if(!G)return 1e9;for(var i=0;i<G.outline.length;i++)if(inPoly(w.x,w.y,G.outline[i]))return 0;
 var d=1e9,P=stClean(st.pts);for(i=0;i<P.length-1;i++)d=Math.min(d,d2seg(w,P[i],P[i+1])-G.W/2);return Math.max(0,d)}
/* ---------- room-fitted stair (tap inside a room with the Stair tool, or a room named "Staircase") ---------- */
function stFitFace(f){var sd=f.side,db=S.meta.dbl&&sd,il=db?sd.l/2:0.25,ir=db?sd.r/2:0.25,it=db?sd.t/2:0.25,ib=db?sd.b/2:0.25;var r={x0:f.bx+il,y0:f.by+it,w:f.w-il-ir,h:f.h-it-ib};return (r.w<1.5||r.h<1.5)?null:r}
function stFitPath(fit,type,flip,swap){var horiz=fit.w>=fit.h,L=horiz?fit.w:fit.h,W=horiz?fit.h:fit.w;
 function P(a,b){if(flip)a=L-a;if(swap)b=W-b;return horiz?{x:fit.x0+a,y:fit.y0+b}:{x:fit.x0+b,y:fit.y0+a}}
 if(type==="U"&&W<4.5)type="straight";if(type==="L"&&(W<5||L<6))type="straight";
 if(type==="U"){var Wf=(W-0.33)/2;return {type:"U",w:Wf,ld:Wf,pts:[P(0,Wf/2),P(L-Wf/2,Wf/2),P(L-Wf/2,W-Wf/2),P(0,W-Wf/2)]}}
 if(type==="L"){var Wl=Math.min(Math.max(3,W*0.45),W-2);return {type:"L",w:Wl,ld:Wl,pts:[P(0,Wl/2),P(L-Wl/2,Wl/2),P(L-Wl/2,W)]}}
 return {type:"straight",w:W,ld:W,pts:[P(0,W/2),P(L,W/2)]}}
function stApplyFit(st){if(!st.fit)return;var r=stFitPath(st.fit,st.type||"straight",st.flip,st.swap);st.pts=r.pts;st.w=Math.round(r.w*1200)/1200;st.ld=r.ld;st.type=r.type}
function stFromFace(f,lab){var fit=stFitFace(f);if(!fit)return null;var s=(lab&&lab.st)||{};var st={id:nid(),pts:[],w:3.5,td:s.tread||10,rmax:7,land:true,fit:fit,type:s.type||"straight",flip:!!(lab&&lab.flip),swap:!!(lab&&lab.swap)};
 if(lab){st.lab=lab.id;lab.sid=st.id}stApplyFit(st);return st}
/* old drawings: a room named "Staircase" (no stair object yet) becomes a stair object once; it then lives on its own */
function stMigrate(RI){if(!S.stairs)return;(RI||roomsInfo()).faces.forEach(function(f){var lab=f.labels.find(function(l){return isStair(l.name)});if(!lab)return;
  if(!lab.sid){var st=stFromFace(f,lab);if(st){S.stairs.push(st);DIRTY_ST=true}return}
  var s2=stairById(lab.sid);if(s2&&s2.fit&&lab.st){var sig=[lab.st.type||"straight",!!lab.flip,!!lab.swap,lab.st.tread||10].join();if(s2.sig!==sig){if(s2.sig!=null){s2.type=lab.st.type||"straight";s2.flip=!!lab.flip;s2.swap=!!lab.swap;s2.td=lab.st.tread||10;stApplyFit(s2)}s2.sig=sig}}})}
var DIRTY_ST=false;
function stairsAll(RI){try{stMigrate(RI)}catch(e){}return (S.stairs||[]).map(function(st){return stGeo(st)}).filter(Boolean)}
function stSyncLab(st){if(!st.lab)return;var l=S.labels.find(function(x){return x.id===st.lab});if(!l)return;l.st=l.st||{};l.st.type=st.type||"straight";l.flip=!!st.flip;l.swap=!!st.swap;l.st.tread=st.td||10;st.sig=[l.st.type,l.flip,l.swap,l.st.tread].join()}
/* ---------- plan drawing ---------- */
function drawStairsPlan(RI){if(!visOn("stairs"))return;stairsAll(RI).forEach(function(G){function ln(P,col,w,cl,dash){if(!P||P.length<2)return;g.beginPath();P.forEach(function(p,i){var q=w2s(p.x,p.y);i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y)});if(cl)g.closePath();g.strokeStyle=col;g.lineWidth=w;g.setLineDash(dash||[]);g.stroke();g.setLineDash([])}
  G.steps.forEach(function(s){if(s.landing){g.beginPath();s.pts.forEach(function(p,i){var q=w2s(p.x,p.y);i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y)});g.closePath();g.fillStyle="rgba(47,122,59,.10)";g.fill()}ln(s.pts,"#2f7a3b",s.landing?1.6:1.2,true)});
  if(G.showWalk){ln(G.walk,"#14532d",2,false,[9,4]);var a=w2s(G.walk[0].x,G.walk[0].y);g.beginPath();g.arc(a.x,a.y,4,0,7);g.fillStyle="#14532d";g.fill();
   g.beginPath();G.head.forEach(function(p,i){var q=w2s(p.x,p.y);i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y)});g.closePath();g.fillStyle="#14532d";g.fill();var u=w2s(G.up.x,G.up.y);pill(u.x,u.y,"UP",'#14532d','#fff',13)}
  if(G.remaining){var z=w2s(G.walk[G.walk.length-1].x,G.walk[G.walk.length-1].y);pill(z.x,z.y-18,G.remaining+" remaining","#b45309","#fff",11)}})}
/* sheets / PDF / DXF */
function stairsSheet(d,RP,RI){if(!visOn("stairs"))return;stairsAll(RI).forEach(function(G2){var o={w:0.22,c:"#222222",L:"STAIRS"};function PL(P,cl,oo){if(P&&P.length>1)d.poly(P.map(RP),Object.assign({closed:!!cl},oo||o))}
  G2.steps.forEach(function(s){PL(s.pts,true,s.landing?{w:0.3,c:"#222222",L:"STAIRS"}:o)});
  if(G2.showWalk){PL(G2.walk,false,{w:0.3,c:"#222222",L:"STAIRS"});d.poly(G2.head.map(RP),{w:0.1,fill:"#222222",c:"#222222",L:"STAIRS"});var u=RP(G2.up);d.text(u[0],u[1],"UP",2.8,{a:"middle",v:"mid",bold:true,c:"#222222",L:"STAIRS",rot:ang2page(Math.cos(G2.ang),Math.sin(G2.ang))})}})}
/* selected stair: outline highlight + tappable info label */
function stairSelDraw(st){var G=stGeo(st);if(!G)return;g.save();G.outline.forEach(function(P){g.beginPath();P.forEach(function(p,i){var q=w2s(p.x,p.y);i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y)});g.closePath();g.fillStyle="rgba(14,165,233,.22)";g.fill();g.strokeStyle=st.pin?"#7c3aed":"#0ea5e9";g.lineWidth=2.4;g.stroke()});g.restore()}
function stLabelText(G){return "W "+fi(G.W)+" · R "+fmt(G.R*12,2)+"\" · T "+fmt(G.T*12,1)+"\" · "+G.nR+"R"+(G.remaining?" ("+G.remaining+" left)":"")}
var _stDsel=drawSelCanvas;drawSelCanvas=function(){var r=_stDsel.apply(this,arguments);if(UI.clean)return r;
 if(UI.stPv&&UI.stPv.length>1){var pv={id:-1,pts:UI.stPv,w:UI.stW||ST_DEF.w,td:ST_DEF.td,rmax:ST_DEF.rmax,land:UI.stLand!==false},G=stGeo(pv);if(G){g.save();g.globalAlpha=0.7;G.outline.forEach(function(P){g.beginPath();P.forEach(function(p,i){var q=w2s(p.x,p.y);i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y)});g.closePath();g.strokeStyle="#2563eb";g.lineWidth=1.4;g.stroke()});
   g.beginPath();G.walk.forEach(function(p,i){var q=w2s(p.x,p.y);i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y)});g.setLineDash([9,4]);g.lineWidth=2;g.stroke();g.setLineDash([]);g.restore()}}
 var L=selEls();if(UI.tool!=="sel"||L.length!==1||UI.box||L[0].k!=="stair")return r;var st=elGet(L[0]),G2=stGeo(st);if(!G2)return r;
 var P=G2.walk,m=Math.floor((P.length-1)/2),a=w2s(P[m].x,P[m].y),b=w2s(P[m+1].x,P[m+1].y),ang=Math.atan2(b.y-a.y,b.x-a.x),off=G2.W/2*V.s+16;
 var tx=stLabelText(G2),lx=(a.x+b.x)/2+Math.sin(ang)*off,ly=(a.y+b.y)/2-Math.cos(ang)*off,cvE=$("cv");g.font="600 12px Inter,Roboto,Arial,sans-serif";var lw=g.measureText(tx).width+14,cw=cvE?cvE.clientWidth:9999,chh=cvE?cvE.clientHeight:9999;lx=clamp(lx,lw/2+6,Math.max(lw/2+6,cw-lw/2-6));ly=clamp(ly,16,Math.max(16,chh-16));var hb=tdLabel(lx,ly,tx,true);hb.stair=st;UI.tdHits=UI.tdHits||[];UI.tdHits.push(hb);return r};
/* ---------- draw a stair by dragging its centre line (walk line) ---------- */
function stSnapPath(raw){var P=rdp(raw,Math.max(0.5,10/V.s));if(P.length<2)return [];var out=[{x:gsnap(P[0].x),y:gsnap(P[0].y)}],step=UI.ortho===0?0:(UI.ortho===45?45:90);
 for(var i=1;i<P.length;i++){var o=out[out.length-1],dx=P[i].x-o.x,dy=P[i].y-o.y,L=Math.hypot(dx,dy);if(L<0.75)continue;var an=Math.atan2(dy,dx);if(step){var s=step*Math.PI/180;an=Math.round(an/s)*s}L=Math.max(0.5,Math.round(L*2)/2);
  out.push({x:Math.round((o.x+Math.cos(an)*L)*1200)/1200,y:Math.round((o.y+Math.sin(an)*L)*1200)/1200})}return stClean(out)}
function stNew(pts,extra){var st=Object.assign({id:nid(),pts:pts,w:UI.stW||ST_DEF.w,td:ST_DEF.td,rmax:ST_DEF.rmax,land:UI.stLand!==false},extra||{});return st}
var _stDn=toolDown;toolDown=function(w,G){if(UI.tool==="stair"&&!UI.pick){G.kind="stairdraw";G.path=[w];return true}return _stDn(w,G)};
var _stMv=toolMove;toolMove=function(w,G,p){if(G.kind==="stairdraw"){var l=G.path[G.path.length-1];if(Math.hypot(w.x-l.x,w.y-l.y)*V.s>2)G.path.push(w);if(G.moved){UI.stPv=stSnapPath(G.path);var pv=UI.stPv,L=0;for(var i=1;i<pv.length;i++)L+=Math.hypot(pv[i].x-pv[i-1].x,pv[i].y-pv[i-1].y);showHud("Stair run "+fi(L)+(pv.length>2?" · "+(pv.length-2)+" turn"+(pv.length>3?"s":""):""));render()}return true}return _stMv(w,G,p)};
var _stUp=toolUp;toolUp=function(G,w){if(G.kind==="tdim"&&G.td&&G.td.stair){stairEditPopup(G.td.stair);return true}
 if(G.kind==="stairdraw"){var pv=G.moved?stSnapPath(G.path.concat([w])):null;UI.stPv=null;if(pv&&pv.length>=2){snapshot();var st=stNew(pv);S.stairs.push(st);changed();var Gx=stGeo(st);toast("Stair: "+(Gx?Gx.info:""))}else if(!G.moved)tapTool(w);else render();return true}
 return _stUp(G,w)};
var _stTap=toolTap;toolTap=function(w){if(UI.tool==="stair"&&!UI.pick){var hit=(S.stairs||[]).find(function(s){return stairHitD(s,w)===0});if(hit){stairEditPopup(hit);return true}}return _stTap(w)};
/* tap inside a room with the Stair tool: a room-fitted stair object (Straight / L / U) */
function stairPopup(x,y){var RI=roomsInfo(),f=faceAt(x,y,RI.faces);if(!f){toast("Drag along the stair centre line to draw it, or tap inside a closed room");return}
 var lab=f.labels.find(function(l){return isStair(l.name)}),st=lab&&lab.sid&&stairById(lab.sid);if(st){stairEditPopup(st);return}
 snapshot();if(!lab){lab={id:nid(),x:f.cx,y:f.cy,name:"Staircase",st:{type:"straight"}};if(f.labels[0]&&!isStair(f.labels[0].name)){f.labels[0].name="Staircase";lab=f.labels[0];lab.st={type:"straight"}}else S.labels.push(lab)}
 lab.st=lab.st||{type:"straight"};st=stFromFace(f,lab);if(!st){UNDO.pop();toast("Room too small for a stair");return}st.land=UI.stLand!==false;if(!lab.st.type||lab.st.type==="straight"){var best=null;["straight","L","U"].forEach(function(t){st.type=t;stApplyFit(st);var G=stGeo(st);if(G&&G.type!==0&&st.type===t&&(!best||G.remaining<best.r))best={t:t,r:G.remaining}});st.type=best?best.t:"straight";stApplyFit(st)}S.stairs.push(st);stSyncLab(st);changed();stairEditPopup(st)}
function stairEditPopup(st){
 function body(){var G=stGeo(st)||{},lv=stLv(),nx=S.L[S.cur+1];return '<div class="mt">Staircase</div><div class="ms">'+esc(lv.name)+' → '+(nx?esc(nx.name):"top of level")+' · floor to floor '+fi(wallH())+'<br><b>'+(G.nR||"-")+' risers needed @ '+fmt((G.R||0)*12,2)+'"</b> · '+(G.created||0)+' created'+(G.remaining?', <span class="warn">'+G.remaining+' remaining</span>':', 0 remaining')+'<br>Width '+fi(G.W||0)+' · tread '+fmt((G.T||0)*12,1)+'" · '+(G.nTreads||0)+' treads'+(G.warn?'<br><span class="warn">'+G.warn+'</span>':'')+'</div>'+
  (st.fit?'<div class="grid2">'+[["straight","Straight"],["L","L-shape"],["U","U / dog-legged"]].map(function(t){return '<button class="bb'+((st.type||"straight")===t[0]?' on':'')+'" data-sty="'+t[0]+'">'+t[1]+'</button>'}).join("")+'</div>':'')+
  '<div class="row"><button class="bb" id="stFl">Flip UP direction ⇆</button>'+(st.fit?'<button class="bb" id="stSw">Swap side ⇅</button>':'')+'</div>'+
  '<div class="row"><button class="bb" id="stWd">Width '+fi(G.W||st.w)+' ✎</button><button class="bb" id="stLd"'+(st.land===false?' disabled':'')+'>Landing depth '+fi(G.ld||st.w)+' ✎</button></div>'+
  '<div class="row"><button class="bb" id="stTd">Tread −1"</button><div class="bb" style="display:flex;align-items:center;justify-content:center">Tread '+(st.td||10)+'"</div><button class="bb" id="stTu">Tread +1"</button></div>'+
  '<div class="row"><button class="bb" id="stRd">Max riser −½"</button><div class="bb" style="display:flex;align-items:center;justify-content:center">Max riser '+(st.rmax||7)+'"</div><button class="bb" id="stRu">Max riser +½"</button></div>'+
  '<div class="row"><button class="bb'+(st.land!==false?' on':'')+'" id="stLa">Landing at turns: '+(st.land!==false?"ON":"OFF")+'</button><button class="bb'+(stWalkOn()?' on':'')+'" id="stWk">Walk line: '+(stWalkOn()?"SHOW":"HIDE")+'</button></div>'+
  '<div class="row"><button class="bb del" id="stDel">Delete stair</button><button class="bb ok" id="stOk">Done</button></div>'}
 function ch(fn){snapshot();fn();if(st.fit)stSyncLab(st);changed();updProps();re()}
 function bind(box){box.querySelectorAll("[data-sty]").forEach(function(b){b.onclick=function(){ch(function(){st.type=b.dataset.sty;stApplyFit(st)})}});
  $("stFl").onclick=function(){ch(function(){if(st.fit){st.flip=!st.flip;stApplyFit(st)}else st.pts.reverse()})};if($("stSw"))$("stSw").onclick=function(){ch(function(){st.swap=!st.swap;stApplyFit(st)})};
  $("stTd").onclick=function(){ch(function(){st.td=Math.max(8,(st.td||10)-1)})};$("stTu").onclick=function(){ch(function(){st.td=Math.min(14,(st.td||10)+1)})};
  $("stRd").onclick=function(){ch(function(){st.rmax=Math.max(5,(st.rmax||7)-0.5)})};$("stRu").onclick=function(){ch(function(){st.rmax=Math.min(8,(st.rmax||7)+0.5)})};
  $("stLa").onclick=function(){ch(function(){st.land=st.land===false})};$("stWk").onclick=function(){ch(function(){S.meta.stWalk=!stWalkOn()})};
  $("stWd").onclick=function(){fiPopup("Stair width","Clear width of the flight (and landing)",stGeo(st).W,function(v){if(!(v>=1.5&&v<=20)){toast("Width 1'-6\" to 20'-0\"");return}snapshot();st.w=v;if(st.ld&&st.ld<v)st.ld=v;delete st.fit;changed();updProps();stairEditPopup(st)})};
  $("stLd").onclick=function(){if(st.land===false)return;fiPopup("Landing depth","Along the incoming flight (at least the stair width)",stGeo(st).ld,function(v){var G=stGeo(st);if(!(v>=G.W-1e-6&&v<=30)){toast("Landing depth must be at least the width "+fi(G.W));return}snapshot();st.ld=v;changed();updProps();stairEditPopup(st)})};
  $("stDel").onclick=function(){closeModal();UI.sel=[{k:"stair",id:st.id}];doDelete()};$("stOk").onclick=closeModal}
 function re(){if(!stairById(st.id)){closeModal();return}$("mbox").innerHTML=body();bind($("mbox"))}modal(body(),bind)}
/* ---------- properties panel ---------- */
function stairProps(st){var G=stGeo(st)||{},lv=stLv(),nx=S.L[S.cur+1];
 return pf("Width","stair.w",fi(G.W||st.w))+pf("Riser height","",fmt((G.R||0)*12,2)+'"',{ro:1})+pf("Tread (inch)","stair.td",st.td||10,{num:1})+pf("Max riser (inch)","stair.rmax",st.rmax||7,{num:1})+
  pf("Risers needed","",(G.nR||0)+"  ("+fi(G.H||0)+" ÷ "+fmt((G.R||0)*12,2)+'")',{ro:1})+pf("Risers created","",(G.created||0)+" · "+(G.remaining||0)+" remaining",{ro:1})+pf("Treads","",G.nTreads||0,{ro:1})+
  pf("Landing at turns","stair.land",st.land===false?"0":"1",{opts:[["1","On"],["0","Off (winders at 90°)"]]})+pf("Landing depth","stair.ld",fi(G.ld||st.w))+pf("Walk line (all stairs)","stair.walk",stWalkOn()?"1":"0",{opts:[["1","Show"],["0","Hide"]]})+
  pf("Run (centre line)","",fi(G.run||0),{ro:1})+pf("Base level","",esc(lv.name),{ro:1})+pf("Top level","",nx?esc(nx.name):"Top of "+esc(lv.name),{ro:1})+
  '<button class="bb pri" id="prStair" style="width:100%;margin-top:6px">Edit stair…</button>'+(G.warn?'<div class="pn warn">'+G.warn+'</div>':'')}
function stairPropSet(key,v,e){var ft=parseFI(v),num=parseFloat(v),ok=true;if(!e)return;snapshot();
 switch(key){case "stair.w":if(ft>=1.5&&ft<=20){e.w=ft;if(e.ld&&e.ld<ft)e.ld=ft;delete e.fit}else ok=false;break;
  case "stair.td":if(num>=6&&num<=18)e.td=num;else ok=false;break;case "stair.rmax":if(num>=4&&num<=9)e.rmax=num;else ok=false;break;
  case "stair.land":e.land=v!=="0";break;case "stair.ld":var G=stGeo(e);if(ft>=G.W-1e-6&&ft<=30)e.ld=ft;else ok=false;break;case "stair.walk":S.meta.stWalk=v!=="0";break}
 if(!ok){UNDO.pop();toast("Value out of range")}else{if(e.fit)stSyncLab(e);changed()}updProps()}
var _stUpd=updProps;updProps=function(){_stUpd.apply(this,arguments);var b=$("prStair");if(b){var L=selEls();if(L.length===1&&L[0].k==="stair"){var st=elGet(L[0]);b.onclick=function(){stairEditPopup(st)}}}};
/* ---------- 3D: risers needed from this level to the next ---------- */
function stairReport(){var out=[];S.L.forEach(function(L,i){withLevel(i,function(){(S.stairs||[]).forEach(function(st,j){var G=stGeo(st);if(!G)return;var nx=S.L[i+1];
  out.push({level:L.name,to:nx?nx.name:"top",nR:G.nR,R:G.R,created:G.created,remaining:G.remaining,H:G.H,txt:L.name+" → "+(nx?nx.name:"top")+": "+fi(G.H)+" ÷ "+fmt(G.R*12,2)+"\" = "+G.nR+" risers needed · "+G.created+" created · "+G.remaining+" remaining"})})})});return out}
function stair3DInfo(){var st=$("v3stairs");if(!st){var host=$("v3stage");if(!host)return;st=document.createElement("div");st.id="v3stairs";host.appendChild(st)}
 var R=stairReport();if(!R.length||!visOn("stairs")){st.style.display="none";return}st.style.display="block";
 st.innerHTML='<b>Stairs</b>'+R.map(function(r){return '<div class="'+(r.remaining?"warn":"")+'">'+esc(r.txt)+'</div>'}).join("")}
if(typeof build3D==="function"){var _stB3=build3D;build3D=function(){var r=_stB3.apply(this,arguments);try{stair3DInfo()}catch(e){}return r}}
/* ---------- option bar chips for the Stair tool ---------- */
var _stCtxA=ctxAction;ctxAction=function(k){if(k==="stw"){fiPopup("New stair width","Width of the next stair you draw",UI.stW||ST_DEF.w,function(v){if(v>=1.5&&v<=20){UI.stW=v;updCtx()}else toast("Width 1'-6\" to 20'-0\"")});return}
 if(k==="stland"){UI.stLand=UI.stLand===false;updCtx();toast("Landing at turns "+(UI.stLand!==false?"ON":"OFF (winders)"));return}
 if(k==="stwalk"){snapshot();S.meta.stWalk=!stWalkOn();changed();updCtx();toast("Stair walk line "+(stWalkOn()?"shown":"hidden"));return}return _stCtxA(k)};
var _stUctx=updCtx;updCtx=function(){_stUctx.apply(this,arguments);if(UI.tool!=="stair")return;var c=$("ctx");if(!c||$("stChips"))return;var sp=document.createElement("span");sp.id="stChips";sp.style.display="contents";
 sp.innerHTML=cb("stw","Width "+fi(UI.stW||ST_DEF.w),"next stair")+cb("stland","Landing","at turns",UI.stLand!==false)+cb("stwalk","Walk line","show / hide",stWalkOn());c.appendChild(sp);
 sp.querySelectorAll("[data-c]").forEach(function(b){b.onclick=function(ev){ev.stopPropagation();ctxAction(b.dataset.c)}})};
