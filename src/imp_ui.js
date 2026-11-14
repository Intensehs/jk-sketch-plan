/* ================= JK Sketch Plan Web - Import dialog + apply to drawing ================= */
var IMP={};
/* Stage: Import (IFC/DXF) - Import tool: file picker (top-row Import, Menu, View ribbon) */
function importPopup(){modal('<div class="mt">Import IFC / DXF</div><div class="ms">Revit: File &gt; Export &gt; IFC, or Export &gt; CAD Formats &gt; DXF. Walls, doors and windows become normal editable objects.</div>'+
 '<label class="bb pri" style="display:flex;align-items:center;justify-content:center;cursor:pointer">Choose file (.ifc / .dxf)<input type="file" id="impFile" accept=".ifc,.dxf,.rvt,.rfa,.dwg,.ifczip" style="display:none"></label>'+
 '<div id="impBody"></div><div class="row"><button class="bb" id="impX">Close</button></div>',function(){$("impX").onclick=closeModal;$("impFile").onchange=function(e){var f=e.target.files[0];if(f)impRead(f)}})}
function impRead(f){var n=f.name,ext=(n.split(".").pop()||"").toLowerCase();IMP={file:n};var B=$("impBody");
 if(ext==="rvt"||ext==="rfa"||ext==="rte"){B.innerHTML='<div class="imperr"><b>Revit .'+ext+' files cannot be opened directly</b> (closed Autodesk format).<br>In Revit: <b>File → Export → IFC</b> (best: keeps levels, wall thickness, doors, windows) or <b>File → Export → CAD Formats → DXF</b> for a plan view. Then import that file here.</div>';return}
 if(ext==="dwg"){B.innerHTML='<div class="imperr"><b>DWG is not supported.</b> Save as / export <b>DXF</b> from AutoCAD or Revit, then import the DXF.</div>';return}
 if(ext==="ifczip"){B.innerHTML='<div class="imperr"><b>.ifczip</b>: unzip it first (or export plain .ifc from Revit) and import the .ifc file.</div>';return}
 if(ext!=="ifc"&&ext!=="dxf"){B.innerHTML='<div class="imperr">Pick a .ifc or .dxf file.</div>';return}
 B.innerHTML='<p class="ms">Reading '+esc(n)+' ('+Math.round(f.size/1024)+' KB)…</p>';
 var r=new FileReader();r.onload=function(){setTimeout(function(){try{if(ext==="ifc"){IMP.kind="ifc";IMP.model=JKI.parseIFC(String(r.result));impShow()}else{IMP.kind="dxf";IMP.raw=JKI.readDXF(String(r.result));IMP.unit=IMP.raw.units;IMP.roles={};Object.keys(IMP.raw.layers).forEach(function(k){IMP.roles[k]=IMP.raw.layers[k].role});IMP.single=false;impDxfConv();impShow()}}catch(err){B.innerHTML='<div class="imperr">Could not read this file: '+esc(err.message||err)+'</div>'}},20)};r.readAsText(f)}
function impDxfConv(){IMP.model=JKI.convertDXF(IMP.raw,IMP.roles,IMP.unit,{single:IMP.single,singleTh:4.5})}
function impCounts(m){var c={w:0,d:0,win:0};m.levels.forEach(function(L){c.w+=L.walls.length;L.ops.forEach(function(o){if(o.type==="D")c.d++;else c.win++})});return c}
/* Stage: Import (IFC/DXF) - dialog: DXF layer roles, units, preview, summary */
function impShow(){var m=IMP.model,B=$("impBody"),c=impCounts(m),h="";
 if(IMP.kind==="dxf"){var L=IMP.raw.layers;h+='<div class="ms" style="margin-top:8px"><b>Layers</b> – choose what each layer is</div><div class="implay">'+Object.keys(L).sort().map(function(k){var l=L[k];return '<div class="impl"><span title="'+escH(Object.keys(l.types).join(", "))+'">'+esc(k)+' <small>('+l.count+')</small></span><select data-lay="'+escH(k)+'">'+[["ignore","Ignore"],["wall","Walls"],["door","Doors"],["window","Windows"]].map(function(o){return '<option value="'+o[0]+'"'+(IMP.roles[k]===o[0]?" selected":"")+'>'+o[1]+'</option>'}).join("")+'</select></div>'}).join("")+'</div>'+
  '<div class="row"><label class="fld">Drawing units'+(IMP.raw.guessed?" (guessed)":"")+'<select id="impU">'+["mm","cm","m","inch","feet"].map(function(u){return '<option'+(IMP.unit===u?" selected":"")+'>'+u+'</option>'}).join("")+'</select></label>'+
  '<label class="fld">Single lines<select id="impS"><option value="0"'+(IMP.single?"":" selected")+'>Skip unpaired lines</option><option value="1"'+(IMP.single?" selected":"")+'>Import as 4½" walls</option></select></label></div>'}
 else h+='<div class="ms" style="margin-top:8px">'+esc(m.schema)+' · units: '+esc(m.units)+(m.app?' · from '+esc(m.app):'')+' · '+m.levels.length+' level(s): '+m.levels.map(function(L){return esc(L.name)+' ('+L.walls.length+' walls)'}).join(", ")+'</div>';
 h+='<canvas id="impCv" width="560" height="300" style="width:100%;max-width:560px;height:auto;border:1px solid #cbd5e1;border-radius:8px;background:#fff;display:block;margin:6px auto"></canvas>';
 h+='<div class="impsum" id="impSum"><b>'+c.w+' walls · '+c.d+' doors · '+c.win+' windows</b>'+impSkip(m)+'</div>';
 h+='<div class="row"><label class="fld">Put into<select id="impT"><option value="new">New drawing</option><option value="cur">Current drawing'+(m.levels.length>1?" (levels from current up)":" – current level")+'</option></select></label></div>';
 h+='<div class="row"><button class="bb ok" id="impGo"'+(c.w?"":" disabled")+'>Import '+c.w+' walls</button></div>';B.innerHTML=h;impPreview();
 B.querySelectorAll("[data-lay]").forEach(function(s){s.onchange=function(){IMP.roles[s.dataset.lay]=s.value;impDxfConv();impShow()}});
 if($("impU"))$("impU").onchange=function(){IMP.unit=this.value;impDxfConv();impShow()};if($("impS"))$("impS").onchange=function(){IMP.single=this.value==="1";impDxfConv();impShow()};
 $("impGo").onclick=function(){var res=impApply(m,$("impT").value);closeModal();setTimeout(function(){impResult(res)},60)}}
function impSkip(m){var k=Object.keys(m.skipped||{});return (k.length?'<div class="ms">Skipped: '+k.map(function(x){return esc(x)+' ×'+m.skipped[x]}).join(" · ")+'</div>':'')+((m.notes||[]).length?'<div class="imperr">'+m.notes.map(esc).join("<br>")+'</div>':'')}
function impPreview(){var cvp=$("impCv");if(!cvp)return;var x=cvp.getContext("2d"),m=IMP.model,L=m.levels[0];x.clearRect(0,0,cvp.width,cvp.height);
 var P=[];if(IMP.kind==="dxf"){(IMP.raw.dxf.entities||[]).forEach(function(e){(e.vertices||[]).forEach(function(v){P.push({x:v.x*JKI.UNITS[IMP.unit],y:v.y*JKI.UNITS[IMP.unit]})})})}
 m.levels.forEach(function(L){L.walls.forEach(function(w){P.push(w.a,w.b)})});if(!P.length)return;
 var x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;P.forEach(function(p){x0=Math.min(x0,p.x);x1=Math.max(x1,p.x);y0=Math.min(y0,p.y);y1=Math.max(y1,p.y)});var s=Math.min((cvp.width-20)/(x1-x0||1),(cvp.height-20)/(y1-y0||1));
 function T(p){return [10+(p.x-x0)*s,cvp.height-10-(p.y-y0)*s]}
 if(IMP.kind==="dxf"){var k=JKI.UNITS[IMP.unit];x.lineWidth=1;(IMP.raw.dxf.entities||[]).forEach(function(e){if(!e.vertices||e.vertices.length<2)return;var r=IMP.roles[e.layer||"0"];x.strokeStyle=r==="ignore"?"#e2e8f0":r==="wall"?"#94a3b8":r==="door"?"#fdba74":"#93c5fd";x.beginPath();e.vertices.forEach(function(v,i){var q=T({x:v.x*k,y:v.y*k});i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1])});x.stroke()})}
 x.lineCap="round";L.walls.forEach(function(w){var a=T(w.a),b=T(w.b);x.strokeStyle="rgba(22,54,92,.85)";x.lineWidth=Math.max(2,w.th/12*s);x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.stroke()});
 L.ops.forEach(function(o){var c=T(o);x.fillStyle=o.type==="D"?"#c2410c":"#1d4ed8";x.beginPath();x.arc(c[0],c[1],Math.max(3,o.w*s/2),0,7);x.globalAlpha=.6;x.fill();x.globalAlpha=1})}
/* model (feet, Y-up) -> app objects (Y-down) */
/* Stage: Import (IFC/DXF) - converts to normal walls / doors / windows / levels (then editable with every tool) */
function impApply(m,target){snapshot();var prev=[UI.wth,UI.wt];UI.wth=null;UI.wt=null;
 var mnx=Infinity,mxy=-Infinity;m.levels.forEach(function(L){L.walls.forEach(function(w){mnx=Math.min(mnx,w.a.x,w.b.x);mxy=Math.max(mxy,w.a.y,w.b.y)})});var ox=-mnx,oy=mxy;
 function Q(p){return {x:Math.round((p.x+ox)*1000)/1000,y:Math.round((oy-p.y)*1000)/1000}}
 var base=0;if(target==="new"){autosave();S=blank();CURID=null;UNDO=[];REDO=[];S.meta.name=(IMP.file||"Imported").replace(/\.[^.]+$/,"");S.meta.proj=S.meta.name}else base=S.cur;
 var res={walls:0,doors:0,windows:0,lost:0,levels:[]};
 m.levels.forEach(function(L,li){var idx=base+li;while(S.L.length<=idx){var nl=newLevel(LVNAMES[S.L.length]||("Level "+S.L.length),L.h||10);nl.id=nid();S.L.push(nl)}
  if(target==="new"||!S.L[idx].segs.length){S.L[idx].name=L.name||S.L[idx].name;if(L.h>=6)S.L[idx].h=L.h;S.L[idx].ceil=Math.max(7,S.L[idx].h-0.5)}
  S.cur=idx;var map=new Map();
  L.walls.forEach(function(w){var a=Q(w.a),b=Q(w.b);if(Math.hypot(a.x-b.x,a.y-b.y)<0.1)return;var pa=ensurePoint(a),pb=ensurePoint(b),s=addSeg(pa,pb,"O");if(!s)return;setWallTh(s,Math.round(w.th*2)/2);map.set(w,s);res.walls++});
  L.ops.forEach(function(o){var c=Q(o),best=null,bd=Infinity,hosts=o.host?o.host.map(function(w){return map.get(w)}).filter(Boolean):(o.hostW&&map.get(o.hostW)?[map.get(o.hostW)]:[]);
   (hosts.length?hosts:S.segs).forEach(function(s){var q=projSeg(c.x,c.y,pt(s.a),pt(s.b));if(q.d<bd){bd=q.d;best={s:s,q:q}}});
   if(!best||bd>wallT(best.s)/2+1.5){res.lost++;return}var no={id:nid(),seg:best.s.id,t:clamp(best.q.t,0,1),type:o.type,w:Math.round(o.w*24)/24,sill:Math.round(o.sill*12)/12,h:Math.round(o.h*12)/12};if(o.type==="D")no.dk=o.dk||"D";S.ops.push(no);if(o.type==="D")res.doors++;else res.windows++});
  planarize();res.levels.push((S.L[idx].name)+": "+S.segs.length+" walls, "+S.ops.length+" openings")});
 S.cur=base;UI.wth=prev[0];UI.wt=prev[1];res.skipped=m.skipped;res.notes=m.notes;res.file=IMP.file;
 if(typeof updLevelBadge==="function")updLevelBadge();setClean(false);fitAll();changed();updTitle();autosave();window.JKS_LASTIMPORT=res;return res}
/* Stage: Import (IFC/DXF) - result summary; Open 3D */
function impResult(r){modal('<div class="mt">Import done</div><div class="impsum"><b>'+r.walls+' walls · '+r.doors+' doors · '+r.windows+' windows</b><div class="ms">'+r.levels.map(esc).join("<br>")+'</div>'+(r.lost?'<div class="ms">'+r.lost+' opening(s) had no host wall and were skipped</div>':'')+impSkip({skipped:r.skipped,notes:r.notes})+'</div>'+
 '<div class="ms">Walls were joined at corners / T-junctions (a wall drawn in one piece may now be split into several segments). Everything is editable and shows in 3D.</div><div class="row"><button class="bb" id="irX">Close</button><button class="bb pri" id="ir3">Open 3D</button></div>',function(){$("irX").onclick=closeModal;$("ir3").onclick=function(){closeModal();open3D("3d")}})}
