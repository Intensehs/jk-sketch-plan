/* ================= v1.3 LEVELS (multi-floor). Each level keeps its own model; S.pts / S.segs / ... point at the current level ================= */
var LVK=["pts","segs","labels","ops","furn","cols","beams","dims","notes","spots","dlines","rails","stairs","kcs","dcircs"];
var LVNAMES=["Ground Floor","First Floor","Second Floor","Third Floor","Fourth Floor","Fifth Floor"];
/* Stage: Levels - Level tool: data for one floor */
function newLevel(name,h){var L={id:0,name:name,h:h||10,slab:5,ceil:9.5};LVK.forEach(function(k){L[k]=[]});return L}
function docify(D){if(!D)return D;D.meta=D.meta||{};
 if(!Array.isArray(D.L)){var L0=newLevel("Ground Floor",+D.meta.wh||10);LVK.forEach(function(k){var v=Object.getOwnPropertyDescriptor(D,k);if(v&&Array.isArray(v.value))L0[k]=v.value;delete D[k]});D.L=[L0];D.cur=0}
 D.L.forEach(function(L,i){LVK.forEach(function(k){if(!Array.isArray(L[k]))L[k]=[]});if(!L.id)L.id=900000+i;if(!(L.h>0))L.h=10;if(L.slab==null)L.slab=5;if(L.ceil==null)L.ceil=Math.max(7,L.h-0.5);if(!L.name)L.name=LVNAMES[i]||("Level "+i)});
 if(!(D.cur>=0&&D.cur<D.L.length))D.cur=0;
 D.grids=Array.isArray(D.grids)?D.grids:[];D.secs=Array.isArray(D.secs)?D.secs:[];D.v=3;
 var m=D.meta;if(!m.roof)m.roof={type:"flat",par:3,pitch:25,ov:1.5,ridge:"auto"};if(!m.vis)m.vis={};
 LVK.forEach(function(k){delete D[k];Object.defineProperty(D,k,{configurable:true,enumerable:false,get:function(){return D.L[D.cur][k]},set:function(v){D.L[D.cur][k]=v}})});
 return D}
function curLv(){return S.L[S.cur]}
function lvElev(i){var z=0;for(var j=0;j<i&&j<S.L.length;j++)z+=S.L[j].h;return z}
function withLevel(i,fn){var c=S.cur;S.cur=i;try{return fn()}finally{S.cur=c}}
function lvHas(i){var L=S.L[i];return L&&(L.segs.length||L.cols.length||L.labels.length||L.furn.length)}
function topLevel(){var t=0;S.L.forEach(function(L,i){if(L.segs.length)t=i});return t}
function lvTitle(i){return (S.L[i]||{}).name||"Level"}
/* Stage: Levels - switch the active floor; drawing tools then work on that floor */
function setLevel(i){if(i<0||i>=S.L.length)return;autosave();S.cur=i;UI.sel=[];UI.chain=null;UI.chainFree=null;SHEET=null;changed();updCtx();updLevelBadge();toast("Level: "+S.L[i].name+"  (elev "+lvl(lvElev(i))+")")}
function updLevelBadge(){var b=$("lvBadge");if(b)b.textContent=S.L[S.cur].name+"  "+lvl(lvElev(S.cur))}
/* copy walls (+ openings, rooms, columns, beams, furniture if asked) of level i to level j */
/* Stage: Levels - copy a floor up (walls, openings, rooms) */
function copyLevel(i,j,opts){var A=S.L[i],B=S.L[j],pm={},sm={};
 A.pts.forEach(function(p){var id=nid();pm[p.id]=id;B.pts.push({id:id,x:p.x,y:p.y})});
 A.segs.forEach(function(s){var id=nid();sm[s.id]=id;var c=JSON.parse(JSON.stringify(s));c.id=id;c.a=pm[s.a];c.b=pm[s.b];B.segs.push(c)});
 if(opts.ops)A.ops.forEach(function(o){if(!sm[o.seg])return;var c=JSON.parse(JSON.stringify(o));c.id=nid();c.seg=sm[o.seg];B.ops.push(c)});
 ["labels","cols","beams"].concat(opts.furn?["furn"]:[]).forEach(function(k){if(k==="labels"&&!opts.rooms)return;A[k].forEach(function(e){var c=JSON.parse(JSON.stringify(e));c.id=nid();B[k].push(c)})});
 withLevel(j,function(){planarize()})}
/* Stage: Levels - Level tool popup (add, copy, open, height, rename) */
function levelsPopup(){var rows=S.L.map(function(L,i){return i}).reverse().map(function(i){var L=S.L[i];
  return '<div class="file"><div><b>'+esc(L.name)+(i===S.cur?' (open)':'')+'</b><small>Elevation '+lvl(lvElev(i))+' · floor to floor '+fi(L.h)+' · '+L.segs.length+' walls</small></div>'+
   '<button class="bb pri" data-lo="'+i+'">Open</button><button class="bb" data-lh="'+i+'">Height</button><button class="bb" data-lr="'+i+'">Rename</button>'+(S.L.length>1?'<button class="bb del" data-ld="'+i+'">×</button>':'')+'</div>'}).join("");
 modal('<div class="mt">Levels / தளங்கள்</div><div class="ms">Like Revit levels: each floor has its own plan. 3D and elevations show all floors stacked.</div>'+rows+
  '<div class="row"><button class="bb ok" id="lvAdd">+ Add level above<small>'+(LVNAMES[S.L.length]||"Level "+S.L.length)+'</small></button><button class="bb ok" id="lvTer">+ Terrace<small>stair cabin / parapet</small></button></div>'+
  '<div class="row"><button class="bb pri" id="lvCopy">Copy this floor UP<small>walls, doors, windows, rooms, columns → '+esc(S.L[S.cur+1]?S.L[S.cur+1].name:"new level")+'</small></button><button class="bb" id="lvCopyW">Copy walls only UP</button></div>'+
  '<div class="row"><button class="bb" id="lvX">Close</button></div>',function(box){
  box.querySelectorAll("[data-lo]").forEach(function(b){b.onclick=function(){closeModal();setLevel(+b.dataset.lo);fitAll()}});
  box.querySelectorAll("[data-lh]").forEach(function(b){b.onclick=function(){var i=+b.dataset.lh,v=parseFI(prompt("Floor-to-floor height of "+S.L[i].name+" (e.g. 10'0\")",fi(S.L[i].h)));if(v>=7&&v<=30){snapshot();S.L[i].h=v;changed();levelsPopup()}}});
  box.querySelectorAll("[data-lr]").forEach(function(b){b.onclick=function(){var i=+b.dataset.lr,n=prompt("Level name",S.L[i].name);if(n){snapshot();S.L[i].name=n.trim();changed();levelsPopup();updLevelBadge()}}});
  box.querySelectorAll("[data-ld]").forEach(function(b){b.onclick=function(){var i=+b.dataset.ld;if(!confirm("Delete level "+S.L[i].name+" and everything on it? (Undo can bring it back)"))return;snapshot();S.L.splice(i,1);if(S.cur>=S.L.length)S.cur=S.L.length-1;changed();levelsPopup();updLevelBadge()}});
  $("lvAdd").onclick=function(){snapshot();var L=newLevel(LVNAMES[S.L.length]||"Level "+S.L.length,curLv().h);L.id=nid();S.L.push(L);changed();closeModal();setLevel(S.L.length-1)};
  $("lvTer").onclick=function(){snapshot();var L=newLevel("Terrace",8);L.id=nid();S.L.push(L);changed();closeModal();setLevel(S.L.length-1);toast("Terrace: draw the stair cabin; open roof parts get parapet in 3D")};
  function cp(full){var i=S.cur;if(!curLv().segs.length){toast("This level is empty");return}snapshot();if(i+1>=S.L.length){var L=newLevel(LVNAMES[i+1]||"Level "+(i+1),curLv().h);L.id=nid();S.L.push(L)}
   else if(S.L[i+1].segs.length&&!confirm(S.L[i+1].name+" already has walls. Add a copy on top of them?"))return;
   copyLevel(i,i+1,{ops:full,rooms:full,furn:false});closeModal();setLevel(i+1);toast("Copied to "+S.L[i+1].name+" - edit what is different")}
  $("lvCopy").onclick=function(){cp(true)};$("lvCopyW").onclick=function(){cp(false)};$("lvX").onclick=closeModal})}
/* underlay: the level below in light grey (Revit "Underlay") */
function drawUnderlay(){if(S.cur<1||!visOn("underlay"))return;var i=S.cur-1;withLevel(i,function(){g.save();g.globalAlpha=0.5;
 S.segs.forEach(function(s){var P=wallPoly(s);if(!P)return;g.beginPath();P.forEach(function(p,k){var q=w2s(p.x,p.y);k?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y)});g.closePath();g.fillStyle="#d9dee6";g.fill();g.strokeStyle="#aab4c2";g.lineWidth=1;g.stroke()});g.restore()})}
/* feet-inch text parser: 10'6"  10'-6"  10 6  10.5  126" */
function parseFI(t){if(t==null)return NaN;t=String(t).trim().replace(/[′’]/g,"'").replace(/[″”]/g,'"');if(!t)return NaN;var neg=false;if(/^[-−]/.test(t)){neg=true;t=t.replace(/^[-−]\s*/,"")}if(/^\+/.test(t))t=t.slice(1).trim();var v=NaN;
 var m=t.match(/^(\d+(?:\.\d+)?)\s*'\s*-?\s*(\d+(?:\.\d+)?)?\s*"?$/);if(m)v=(+m[1])+(m[2]?(+m[2])/12:0);
 else if((m=t.match(/^(\d+(?:\.\d+)?)\s*"$/)))v=+m[1]/12;else if((m=t.match(/^(\d+)\s+(\d+(?:\.\d+)?)$/)))v=+m[1]+(+m[2])/12;else{var n=parseFloat(t);if(isFinite(n)&&/^\d*\.?\d+$/.test(t))v=n}
 return neg?-v:v}
