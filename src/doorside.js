/* Stage: Door side - one-tap Left/Right (hinge) and In/Out (swing side) chips drawn right beside a selected door.
   Uses the door's existing fields only: o.hinge (false = Left, true = Right, same as Props) and o.flip (which side of the
   wall the leaf swings to). In/Out is worked out from the rooms: "In" = swings into a room, "Out" = swings outside the
   building; between two rooms the chip names the room it opens into. Placement, flip, 3D, PDF and DXF are unchanged. */
function dsLineTool(){if(typeof cxmClose==="function")cxmClose();if(typeof setTool==="function")setTool("dline");else JKS.setTool("dline");UI.dlSt=UI.dlSt||"solid";if(typeof updCtx==="function")updCtx();toast("Line: drag (or tap 2 points) to draw a 2D line")}
function dsDoor(){if(UI.clean||UI.pick)return null;if(UI.tool==="sel"){var L=selEls();if(L.length===1&&L[0].k==="op"){var o=elGet(L[0]);if(o&&o.type==="D"&&o.dk!=="OP")return o}return null}
 if(UI.tool==="open"&&UI.dsLast){var q=(S.ops||[]).find(function(x){return x.id===UI.dsLast});if(q&&q.type==="D"&&q.dk!=="OP")return q}return null}
function dsHingeTxt(o){return o.hinge?"Right":"Left"}
/* which side the leaf swings to: {txt:"In"/"Out"/room name/"Side 1|2", kind} */
function dsSwing(o){var G=opWorld(o);if(!G)return {txt:o.flip?"Side 2":"Side 1",kind:"side"};var T=S.meta.dbl?wallT(G.s):0.3,sd=o.flip?-1:1,RI=roomsInfo();
 function room(sg){var p={x:G.c.x+G.n.x*sg*(T/2+0.8),y:G.c.y+G.n.y*sg*(T/2+0.8)},hit=null;RI.faces.forEach(function(f){if(!hit&&inPoly(p.x,p.y,f.pts))hit=f});return hit}
 var a=room(sd),b=room(-sd);if(a&&!b)return {txt:"In",kind:"in"};if(!a&&b)return {txt:"Out",kind:"out"};
 if(a&&b){var nm=a.labels&&a.labels[0]?a.labels[0].name:"";return {txt:nm?"Into "+nm:(o.flip?"Side 2":"Side 1"),kind:"room"}}return {txt:o.flip?"Side 2":"Side 1",kind:"side"}}
function dsToggle(o,what){if(!o)return;snapshot();if(what==="hinge"){o.hinge=!o.hinge;changed();toast("Hinge: "+dsHingeTxt(o))}else{o.flip=!o.flip;changed();toast("Door opens: "+dsSwing(o).txt)}updProps();updCtx();render()}
var _dsDsel=drawSelCanvas;drawSelCanvas=function(){var r=_dsDsel.apply(this,arguments);UI.dsHits=[];if(UI.tool==="sel")return r;var o=dsDoor();if(!o)return r;var G=opWorld(o);if(!G)return r;
 var T=S.meta.dbl?wallT(G.s):0.3,sd=o.flip?-1:1,big=(window.matchMedia&&matchMedia("(pointer:coarse)").matches)||CW<700,H=big?36:30,fs=big?14:13,gap=8;
 /* place the chips on the side away from the swing (so they never cover the leaf), just past the wall face */
 var off=T/2*V.s+H/2+34,c=w2s(G.c.x,G.c.y),nx=-G.n.x*sd,ny=-G.n.y*sd,cx=c.x+nx*off,cy=c.y+ny*off;
 var items=[{k:"hinge",t:"\u21c6 "+dsHingeTxt(o),tip:"Left / Right"},{k:"swing",t:"\u21c5 "+dsSwing(o).txt,tip:"In / Out"}];
 g.save();g.font="bold "+fs+"px Roboto,Arial,sans-serif";var ws=items.map(function(it){return Math.max(H+20,g.measureText(it.t).width+22)}),tot=ws[0]+ws[1]+gap,x=cx-tot/2;
 x=Math.max(6,Math.min(CW-tot-6,x));var y=Math.max(6,Math.min(CH-H-6,cy-H/2));
 items.forEach(function(it,i){var w=ws[i];g.fillStyle="rgba(255,255,255,.97)";rr(x,y,w,H,H/2);g.fill();g.lineWidth=2;g.strokeStyle="#e8590c";g.stroke();g.fillStyle="#9a3b06";g.textAlign="center";g.textBaseline="middle";g.fillText(it.t,x+w/2,y+H/2+0.5);
  UI.dsHits.push({k:it.k,x0:x,y0:y,x1:x+w,y1:y+H,door:o.id});x+=w+gap});g.restore();return r};
function dsHit(w){var H=UI.dsHits||[];if(!H.length)return null;var q=w2s(w.x,w.y);for(var i=0;i<H.length;i++){var h=H[i];if(q.x>=h.x0-4&&q.x<=h.x1+4&&q.y>=h.y0-4&&q.y<=h.y1+4)return h}return null}
var _dsDn=toolDown;toolDown=function(w,G){if((UI.tool==="sel"||UI.tool==="open")&&!UI.pick){var h=dsHit(w);if(h){G.kind="dside";G.ds=h;return true}}return _dsDn(w,G)};
var _dsMv=toolMove;toolMove=function(w,G,p){if(G.kind==="dside")return true;return _dsMv(w,G,p)};
var _dsUp=toolUp;toolUp=function(G,w){if(G.kind==="dside"){var o=(S.ops||[]).find(function(x){return x.id===G.ds.door});if(o)dsToggle(o,G.ds.k);return true}return _dsUp(G,w)};
/* remember the door just placed / edited with the Door tool so its chips show there too */
var _dsCh=changed;changed=function(){var r=_dsCh.apply(this,arguments);try{var n=(S.ops||[]).length;if(UI.tool==="open"){if(UI._dsN!=null&&n>UI._dsN){var l=S.ops[n-1];if(l&&l.type==="D")UI.dsLast=l.id}}UI._dsN=n}catch(e){}return r};
/* option bar + context menu actions */
var _dsCtx=ctxAction;ctxAction=function(k){if(k==="dline"){dsLineTool();return}if(k==="dhinge"||k==="dswing"){dsToggle(dsDoor()||(function(){var L=selEls();return L.length===1&&L[0].k==="op"?elGet(L[0]):null})(),k==="dhinge"?"hinge":"swing");return}return _dsCtx(k)};
function dsCtxHTML(){var o=dsDoor();if(!o)return "";return CDV+'<span class="tlab">Door</span>'+cbI("dhinge","",'\u21c6 '+dsHingeTxt(o),"Hinge side - Left / Right (one tap)",false,"ok2")+cbI("dswing","",'\u21c5 '+dsSwing(o).txt,"Opens - In / Out (one tap)",false,"ok2")+cbI("dline","dline","Line","Draw a 2D line (drag or tap 2 points)")}
