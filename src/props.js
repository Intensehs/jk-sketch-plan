/* ================= v1.3 RIBBON (tabs) + PROPERTIES panel + Visibility/Graphics ================= */
var ICO=Object.assign(__ICONS_JSON__,{
 sel:'<path d="M5 3l13 7-6 1.6L9.5 18z"/><path d="M12.5 12l5 6"/>',col:'<rect x="8" y="3" width="8" height="18"/><path d="M8 3l8 18M16 3L8 21"/>',beam:'<path d="M2 9h20v6H2z" stroke-dasharray="3 2"/>',
 stair:'<path d="M3 21h4v-4h4v-4h4V9h4V5h2"/>',rail:'<path d="M3 8h18M5 8v12M10 8v12M14 8v12M19 8v12"/>',slab:'<path d="M2 14l10-5 10 5-10 5z"/><path d="M2 14v3l10 5 10-5v-3"/>',
 roof2:'<path d="M2 12L12 4l10 8"/><path d="M5 10v10h14V10"/>',grid2:'<circle cx="12" cy="4" r="2.6"/><path d="M12 6.6V22" stroke-dasharray="4 2 1 2"/><circle cx="4" cy="12" r="2.6"/><path d="M6.6 12H22" stroke-dasharray="4 2 1 2"/>',
 dim:'<path d="M3 15h18M3 11v8M21 11v8M5.5 17l-2.5-2 2.5-2M18.5 17l2.5-2-2.5-2"/><path d="M9 8h6"/>',text:'<path d="M5 5h14M12 5v15M9 20h6"/>',spot:'<path d="M4 13l4 6 4-6z"/><path d="M12 13h9M14 9h7"/>',
 dline:'<path d="M3 20L21 4"/><circle cx="3" cy="20" r="1.5"/><circle cx="21" cy="4" r="1.5"/>',sec:'<path d="M3 13h18" stroke-dasharray="5 2 1 2"/><path d="M3 13v6M21 13v6M3 19l3-2M21 19l-3-2"/><circle cx="4" cy="7" r="3"/><circle cx="20" cy="7" r="3"/>',
 levels:'<path d="M3 7h14M3 12h14M3 17h14"/><path d="M19 4l2 3-2 3M19 14l2 3-2 3"/>',elev:'<path d="M3 20h18M5 20V10l7-5 7 5v10"/><rect x="8" y="13" width="3" height="7"/><rect x="13.5" y="12" width="3.5" height="3"/>',
 vg:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',align:'<path d="M4 3v18"/><path d="M8 6h11v4H8zM8 14h7v4H8z"/>',
 trim:'<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.5 8.5L20 20M8.5 15.5L20 4"/>',split:'<path d="M3 12h7M14 12h7"/><path d="M12 5v14" stroke-dasharray="2 2"/>',
 offset:'<path d="M4 7h16M4 17h16"/><path d="M12 9v6M10 13l2 2 2-2"/>',props:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M15 3v18M17.5 8h1M17.5 12h1M17.5 16h1"/>'});
function svgI(k){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+(ICO[k]||ICO.draw)+'</svg>'}
var TD={draw:["Wall","வரை","draw"],move:["Corners","நகர்த்து","move"],size:["Size","அளவு","size"],wall:["Thickness","தடிமன்","wall"],room:["Room/Tag","அறை","room"],open:["Door/Win","கதவு","door"],furn:["Component","மரச்சாமான்","sofa"],del:["Delete","அழி","del"],
 sel:["Select","தேர்வு","sel"],col:["Column","தூண்","col"],beam:["Beam","பீம்","beam"],stair:["Stairs","படி","stair"],rail:["Railing","கைப்பிடி","rail"],slab:["Floor","தளம்","slab"],roof:["Roof","கூரை","roof2"],
 grid:["Grid","கட்டம்","grid2"],dim:["Dimension","அளவு கோடு","dim"],text:["Text","எழுத்து","text"],spot:["Spot Level","மட்டம்","spot"],dline:["Detail Line","கோடு","dline"],sec:["Section","வெட்டு","sec"],
 align:["Align","சீரமை","align"],trim:["Trim/Extend","வெட்டு","trim"],split:["Split","பிரி","split"],offset:["Offset","இணை","offset"],
 "a:levels":["Levels","தளங்கள்","levels"],"a:elev":["Elevations","முகப்பு","elev"],"a:sheets":["Sheets","PDF தாள்","clean"],"a:v3d":["3D View","3D","cube"],"a:vg":["Visibility","காட்சி","vg"]};
var TABS={arch:["Architecture",["draw","wall","size","room","open","furn","stair","rail","slab","roof","move"]],struct:["Structure",["col","beam","slab","stair","grid","wall"]],anno:["Annotate",["dim","text","spot","dline","grid","room"]],
 view:["View",["a:levels","a:elev","sec","a:sheets","a:v3d","a:vg"]],modify:["Modify",["sel","move","align","trim","split","offset","del"]]};
function buildTabs(){var t=$("tabs");t.innerHTML=Object.keys(TABS).map(function(k){return '<button class="tab" data-tab="'+k+'">'+TABS[k][0]+'</button>'}).join("");
 t.querySelectorAll("[data-tab]").forEach(function(b){b.onclick=function(){UI.tab=b.dataset.tab;buildRail();var L=TABS[UI.tab][1].filter(function(x){return x.indexOf("a:")<0});if(L.indexOf(UI.tool)<0&&L.length)setTool(L[0]);else markRail()}})}
function buildRail(){var r=$("tools");r.innerHTML=TABS[UI.tab][1].map(function(t){var d=TD[t];return t.indexOf("a:")===0?'<button class="tool act" data-a="'+t.slice(2)+'">'+svgI(d[2])+d[0]+'<small>'+d[1]+'</small></button>':'<button class="tool" data-t="'+t+'">'+svgI(d[2])+d[0]+'<small>'+d[1]+'</small></button>'}).join("");
 r.querySelectorAll("[data-t]").forEach(function(b){b.onclick=function(){setTool(b.dataset.t)}});r.querySelectorAll("[data-a]").forEach(function(b){b.onclick=function(){railAction(b.dataset.a)}});markRail()}
function markRail(){document.querySelectorAll("#tools .tool").forEach(function(b){b.classList.toggle("on",b.dataset.t===UI.tool)});document.querySelectorAll("#tabs .tab").forEach(function(b){b.classList.toggle("on",b.dataset.tab===UI.tab)})}
function railAction(a){if(a==="levels")levelsPopup();else if(a==="elev")openSheetBy("elev");else if(a==="sheets"){setClean(true)}else if(a==="v3d")open3D("3d");else if(a==="vg")vgPopup()}
/* Stage: all - switches the active tool (UI.tool) and its hint */
function setTool(t){if(UI.tool!==t){UI.pick=null;UI.lpA=null;UI.dimPend=null;UI.lp=null;UI.selSeg=null}UI.tool=t;
 if(!TABS[UI.tab]||TABS[UI.tab][1].indexOf(t)<0){var tb=Object.keys(TABS).find(function(k){return TABS[k][1].indexOf(t)>=0});if(tb){UI.tab=tb;buildRail()}}
 markRail();if(t!=="sel"&&UI.sel&&UI.sel.length){UI.sel=[];updProps()}if(UI.clean)setClean(false);updCtx();render()}
var HINTS={wall:"Tap a wall to set its thickness · colour = thickness (4½\" teal, 6\" purple, 8\" brown, 9\" slate)",furn:"Tap empty floor to add furniture · drag to move · snaps to walls",draw:"Draw walls with pen / finger · length shows live",move:"Drag corners or room names · tap wall for type",size:"Tap a wall to type its real size",room:"Tap inside a room to name it (room tag)",open:"Tap a wall to add door / window / opening",del:"Tap any item to delete",
 sel:"Tap to select · drag box: left→right = window, right→left = crossing · drag a selected item to move",col:"Tap to place a column (snaps to wall corners & grid crossings)",beam:"Drag (or tap 2 points) to draw a beam - dashed in plan",stair:"Tap inside a room to make a staircase (straight / L / U)",rail:"Drag (or tap 2 points) to draw a railing",slab:"Tap the plan: floor slab, ceiling & floor height",roof:"Tap the plan: roof type (flat + parapet, gable, hip)",
 grid:"Drag a grid line - vertical = 1,2,3 · horizontal = A,B,C",dim:"Tap point 1, point 2, then where the dimension line sits",text:"Tap to add a text note (tap a note to edit)",spot:"Tap to place a spot level",dline:"Drag (or tap 2 points) to draw a detail line",sec:"Drag a section line across the house → section view",
 align:"Tap the reference line first, then the wall / item to align",trim:"Tap wall 1 then wall 2 (keep sides you tap) - makes the corner",split:"Tap a wall where to split it",offset:"Tap near a wall on the side you want the parallel copy"};
function cb(k,t,s,on,cls){return '<button class="cb'+(on?" on":"")+(cls?" "+cls:"")+'" data-c="'+k+'">'+t+(s?'<small>'+s+'</small>':'')+'</button>'}
function updCtx(){var c=$("ctx");if(!c)return;var h="",T=UI.tool;
 if(UI.clean){var L=(SHEET&&SHEET.list)||sheetList(),cur=UI.sheetKey||(L[0]&&L[0].key);
  h=cb("back","✎ Back to drawing","வரைபடம்",true)+cb("pdf","PDF","all sheets")+cb("dxf","DXF","this sheet")+cb("png","PNG")+cb("det","Details","title block")+cb("pg1","Plan","Sheet 1",/^plan/.test(cur))+cb("pg2","Door & Window","details",cur==="dw")+
   L.filter(function(s){return s.key!=="dw"&&s.key!=="plan0"}).map(function(s){return cb("sh:"+s.key,esc(s.no),esc(s.short),s.key===cur)}).join("")+cb("v3d","3D View","முப்பரிமாணம்",true)+cb("cad","AutoCAD 3D")}
 else{h=cb("lv","▤ "+esc(curLv().name),"level "+lvl(lvElev(S.cur))+" ▾",false,"lvb");
  if(T==="draw")h+=cb("new","＋ New line","புதிய கோடு")+cb("close","⬠ Close","மூடு")+cb("ortho",UI.ortho===90?"90° Straight":UI.ortho===45?"45° Angles":"Free angle","snap",true)+cb("wth","Wall "+thTxt(UI.wth||S.meta.tout),"new walls · thickness",true);
  if(T==="furn"){var fs=furnSel();h+=cb("fadd","＋ Add furniture","மரச்சாமான்",true)+(fs?cb("frot","⟳ Rotate 90°")+cb("fdup","Duplicate")+cb("fdel","Delete","",false,"warn")+cb("fdone","Done")+'<span style="align-self:center;font-weight:700;color:#16365c;white-space:nowrap">'+esc(FURN[fs.type].n)+'</span>':'')}
  if(T==="wall")h+=cb("wdef","Defaults","outer "+thTxt(S.meta.tout)+" · inner "+thTxt(S.meta.tin),true)+THP.map(function(p){return '<span class="cb" style="border-color:'+thCol(p[0])+';color:'+thCol(p[0])+';pointer-events:none">'+thTxt(p[0])+'<small>'+p[1]+'</small></span>'}).join("");
  if(T==="sel"){var n=selEls().length;h+='<span class="cnt">'+n+' selected</span>'+cb("xmove","✥ Move","drag or type")+cb("xcopy","❐ Copy")+cb("xrot","⟳ Rotate")+cb("xmir","⇋ Mirror")+cb("xarr","⋯ Array","linear")+cb("xpin",selEls().length&&selEls().every(isPinned)?"Unpin":"Pin")+cb("xdel","Delete","",false,"warn")+cb("xfil","Filter")+cb("xall","Select all")+cb("xadd","Add: "+(UI.addSel?"ON":"OFF"),"multi-select",UI.addSel)+cb("xclr","Clear")}
  if(T==="col")h+=COLSZ.map(function(z){var on=(UI.colSz||[9,9])[0]===z[0]&&(UI.colSz||[9,9])[1]===z[1];return cb("cs:"+z[0]+"x"+z[1],z[0]+'" x '+z[1]+'"',"RCC",on)}).join("")+cb("crot","Rotate "+(UI.colRot||0)+"°")+cb("cauto","Auto at corners","wall junctions",false,"ok2")+cb("cgrid","At grid crossings","",false,"ok2");
  if(T==="beam")h+=BEAMSZ.map(function(z){var on=(UI.beamSz||[9,18])[0]===z[0]&&(UI.beamSz||[9,18])[1]===z[1];return cb("bs:"+z[0]+"x"+z[1],z[0]+'" x '+z[1]+'"',"width x depth",on)}).join("")+cb("bauto","Auto on walls","",false,"ok2");
  if(T==="grid")h+=cb("gauto","Auto grids","from walls",false,"ok2")+cb("cgrid","Columns at crossings")+cb("ortho",UI.ortho===90?"90°":UI.ortho===45?"45°":"Free","snap",true);
  if(T==="dim"||T==="beam"||T==="rail"||T==="dline"||T==="sec")h+=(T==="dim"?"":"")+(T!=="grid"?cb("ortho",UI.ortho===90?"90°":UI.ortho===45?"45°":"Free","snap",true):"");
  if(T==="dline")h+=cb("dls","Solid","",(UI.dlSt||"solid")==="solid")+cb("dld","Dashed","",UI.dlSt==="dash");
  if(T==="trim")h+=cb("tmc","Corner","2 walls",UI.trimMode!=="one")+cb("tmo","Extend / trim to boundary","1 wall",UI.trimMode==="one");
  if(T==="offset")h+=cb("ofd","Distance "+fi(UI.offD||3),"tap to change",true)+cb("ofr","Full straight wall: "+(UI.offRun?"ON":"OFF"),"",UI.offRun);
  if(T==="sec")h+=cb("secv","Open section views",S.secs.length+" sections");
  if(T==="stair")h+=cb("rfl","Floor height","stair risers follow it");
  if(T==="slab")h+=cb("rfl","Floor / ceiling","heights",true)+cb("lv2","Levels","add / copy floor");
  if(T==="roof")h+=cb("rfr","Roof settings",roofCfg().type,true);
  if(T==="align"||T==="trim"||(UI.pick&&UI.pick.k))h+=cb("pickx","✕ Cancel pick");
  h+=cb("pen","✒ Pen only: "+(UI.penOnly?"ON":"OFF"),"palm safe",UI.penOnly)+cb("grid","Grid: "+["Off","Faint","On"][UI.grid],"கட்டம்",!!UI.grid)+cb("thin","Thin lines: "+(UI.thin?"ON":"OFF"),"",UI.thin);
  if(T==="draw")h+=cb("chain","Continue: "+(UI.chainOn?"ON":"OFF"),"from last end",UI.chainOn)}
 c.innerHTML=h;c.querySelectorAll("[data-c]").forEach(function(b){b.onclick=function(){ctxAction(b.dataset.c)}});var hn=$("hint");if(hn)hn.textContent=UI.clean?"Sheets":(UI.pick&&UI.pick.k==="mirror"?"Tap 2 points for the mirror axis":HINTS[T]||"");updLevelBadge()}
function ctxAction(k){if(/^f(add|rot|dup|del|done)$/.test(k)){furnAction(k);return}
 if(k==="new")newLine();else if(k==="close")autoClose();else if(k==="ortho"){UI.ortho=UI.ortho===90?45:(UI.ortho===45?0:90);toast(UI.ortho?"Snap "+UI.ortho+"°":"Free angle")}
 else if(k==="kind"){UI.kind=UI.kind==="O"?"I":"O";toast(UI.kind==="O"?"Next walls: outer":"Next walls: inner")}else if(k==="wth"){newWallPopup();return}
 else if(k==="wdef"){thickDefaultsPopup();return}else if(k==="pg1"){UI.sheetKey="plan"+(S.L[S.cur].segs.length?S.cur:0);UI.page=1}else if(k==="pg2"){UI.sheetKey="dw";UI.page=2}else if(k.indexOf("sh:")===0){UI.sheetKey=k.slice(3)}
 else if(k==="pen"){UI.penOnly=!UI.penOnly;LS.set("jksp_pen",UI.penOnly);toast(UI.penOnly?"Pen only: fingers pan / zoom":"Finger drawing ON")}
 else if(k==="grid"){UI.grid=(UI.grid+1)%3;LS.set("jksp_grid",UI.grid)}else if(k==="chain"){UI.chainOn=!UI.chainOn}else if(k==="thin"){UI.thin=!UI.thin;LS.set("jksp_thin",UI.thin)}
 else if(k==="back")setClean(false);else if(k==="pdf")exportPDF();else if(k==="dxf")exportDXF();else if(k==="png")exportPNG();else if(k==="det")detailsPopup();else if(k==="v3d"){open3D("3d");return}else if(k==="cad"){open3D("cad");return}
 else if(k==="lv"||k==="lv2"){levelsPopup();return}
 else if(k==="xmove"){if(!selEls().length){toast("Select something first");return}dirDist("Move",function(dx,dy){doMove(dx,dy,false)});return}
 else if(k==="xcopy"){if(!selEls().length){toast("Select something first");return}dirDist("Copy",function(dx,dy){doMove(dx,dy,true)});return}
 else if(k==="xrot"){if(!selEls().length){toast("Select something first");return}rotatePopup();return}else if(k==="xmir"){mirrorPopup();return}else if(k==="xarr"){arrayPopup();return}
 else if(k==="xpin")doPin();else if(k==="xdel")doDelete();else if(k==="xfil"){filterPopup();return}else if(k==="xall"){setSel(allRefs());toast(UI.sel.length+" selected")}else if(k==="xadd")UI.addSel=!UI.addSel;else if(k==="xclr")clearSel();
 else if(k.indexOf("cs:")===0){UI.colSz=k.slice(3).split("x").map(Number)}else if(k==="crot"){UI.colRot=((UI.colRot||0)+90)%180}else if(k==="cauto")autoCols();else if(k==="cgrid")gridCols();
 else if(k.indexOf("bs:")===0){UI.beamSz=k.slice(3).split("x").map(Number)}else if(k==="bauto")autoBeams();else if(k==="gauto")autoGrids();
 else if(k==="dls")UI.dlSt="solid";else if(k==="dld")UI.dlSt="dash";else if(k==="tmc"){UI.trimMode="corner";UI.pick=null}else if(k==="tmo"){UI.trimMode="one";UI.pick=null}
 else if(k==="ofd"){offsetDistPopup();return}else if(k==="ofr")UI.offRun=!UI.offRun;else if(k==="secv"){if(!S.secs.length){toast("Draw a section line first");return}openSheetBy("sec",0);return}
 else if(k==="rfl"){floorPopup();return}else if(k==="rfr"){roofPopup();return}else if(k==="pickx"){UI.pick=null;UI.selSeg=null;UI.lpA=null;UI.dimPend=null}
 updCtx();render()}
/* ---------- properties panel ---------- */
function propsOpen(on){UI.props=on;$("app").classList.toggle("pr",on);$("bProps").classList.toggle("on",on);LS.set("jksp_props",on);updProps();setTimeout(resize,30)}
function pf(lab,key,val,o){o=o||{};if(o.ro)return '<div class="pf"><label>'+lab+'</label><div class="ro">'+val+'</div></div>';
 if(o.opts)return '<div class="pf"><label>'+lab+'</label><select data-p="'+key+'">'+o.opts.map(function(x){return '<option value="'+escH(x[0])+'"'+(String(x[0])===String(val)?" selected":"")+'>'+esc(x[1])+'</option>'}).join("")+'</select></div>';
 return '<div class="pf"><label>'+lab+'</label><input data-p="'+key+'" value="'+escH(val)+'"'+(o.num?' inputmode="decimal"':'')+'></div>'}
/* Stage: Properties panel - shows the selected element / active tool settings */
function updProps(){var P=$("props");if(!P||!UI.props)return;var L=selEls(),h='<div class="ph"><b>Properties</b><button class="cb" id="prX">×</button></div>',lv=curLv();
 if(!L.length){h+='<div class="pt">Floor Plan: '+esc(lv.name)+'</div>'+pf("Level name","lv.name",lv.name)+pf("Elevation","",lvl(lvElev(S.cur)),{ro:1})+pf("Floor to floor","lv.h",fi(lv.h))+pf("Slab (inch)","lv.slab",lv.slab,{num:1})+pf("Ceiling height","lv.ceil",fi(lv.ceil))+
   pf("Walls / openings","",lv.segs.length+" / "+lv.ops.length,{ro:1})+pf("Default outer wall","m.tout",S.meta.tout,{num:1})+pf("Default inner wall","m.tin",S.meta.tin,{num:1})+pf("Roof","",roofCfg().type,{ro:1})+'<div class="pn">Tap an element (Modify → Select) to edit its type, size, level and offset.</div>'}
 else if(L.length>1){var cnt={};L.forEach(function(r){cnt[r.k]=(cnt[r.k]||0)+1});h+='<div class="pt">'+L.length+' elements</div>'+Object.keys(cnt).map(function(k){return pf(EKN[k],"",cnt[k],{ro:1})}).join("")+(cnt.seg===L.length?pf("Thickness (inch) - all","mseg.th",""):"")+'<div class="pn">Use Move / Copy / Rotate / Mirror / Array in the bar above.</div>'}
 else{var r=L[0],e=elGet(r);h+='<div class="pt">'+EKN[r.k]+(e.pin?" · pinned":"")+'</div>';
  if(r.k==="seg"){var run=wallRun(e);h+=pf("Inner length (clear)","",fi(segInner(e).L),{ro:1})+pf("Length (c/c)","seg.len",fi(segLen(e)))+pf("Full straight wall","",fi(run.len),{ro:1})+pf("Thickness (inch)","seg.th",wallIn(e),{num:1})+pf("Function","seg.k",e.k==="I"?"I":"O",{opts:[["O","Exterior"],["I","Interior"]]})+pf("Base level","",lv.name,{ro:1})+pf("Unconnected height","",fi(lv.h),{ro:1})+pf("Openings","",S.ops.filter(function(o){return o.seg===e.id}).length,{ro:1})}
  else if(r.k==="op"){h+=pf("Family","op.dk",opKind(e),{opts:OK5.map(function(k){return [k,k+" "+OKN[k]]})})+pf("Width","op.w",fi(e.w))+pf("Height","op.h",fi(opH(e)))+pf("Sill height","op.sill",fi(opSill(e)))+pf("Lintel level","",lvl(opSill(e)+opH(e)),{ro:1})+pf("Mark","",e._mark||"-",{ro:1})+(e.type==="D"?pf("Swing","op.flip",e.flip?"1":"0",{opts:[["0","Side 1"],["1","Side 2"]]})+pf("Hinge","op.hinge",e.hinge?"1":"0",{opts:[["0","Left"],["1","Right"]]}):"")+pf("Offset along wall","op.t",fmt(e.t*100,0)+"%",{ro:1})}
  else if(r.k==="furn"){var D=fdims(e);h+=pf("Family","",FURN[e.type].n,{ro:1})+pf("Width","f.w",fi(D.w))+pf("Depth","f.d",fi(D.d))+pf("Rotation (°)","f.rot",e.rot||0,{num:1})}
  else if(r.k==="lab"){var f=LABF[e.id];h+=pf("Name","lab.name",e.name)+(f?pf("Clear size","",sizeText(f),{ro:1})+pf("Carpet area","",sq(f.carpet)+" sq.ft",{ro:1}):"")+(isStair(e.name)?pf("Stair type","lab.st",(e.st&&e.st.type)||"straight",{opts:[["straight","Straight"],["L","L-shape"],["U","U / dog-legged"]]}):"")}
  else if(r.k==="stair")h+=stairProps(e);
  else if(r.k==="col")h+=pf("Width (inch)","col.w",e.w,{num:1})+pf("Depth (inch)","col.d",e.d,{num:1})+pf("Rotation (°)","col.rot",e.rot||0,{num:1})+pf("Material","",e.w>=9?"RCC M20":"RCC",{ro:1})+pf("Height","",fi(lv.h)+" (level)",{ro:1});
  else if(r.k==="beam")h+=pf("Width (inch)","beam.w",e.w,{num:1})+pf("Depth (inch)","beam.d",e.d,{num:1})+pf("Length","",fi(Math.hypot(e.b.x-e.a.x,e.b.y-e.a.y)),{ro:1})+pf("Top","",lvl(lvElev(S.cur)+lv.h-lv.slab/12)+" (slab soffit)",{ro:1});
  else if(r.k==="dim")h+=pf("Value","dim.val",fi(dimGeom(e).L))+pf("Offset","dim.off",fi(e.off||0))+pf("Lock","dim.lock",e.lock?"1":"0",{opts:[["0","Unlocked"],["1","Locked"]]})+'<div class="pn">Edit Value to move the attached wall (second end moves).</div>';
  else if(r.k==="note")h+=pf("Text","note.t",e.t)+pf("Size","note.h",noteH(e),{opts:[[0.45,"Small"],[0.6,"Medium"],[0.9,"Large"]]});
  else if(r.k==="spot")h+=pf("Label","spot.lab",e.lab||"FFL",{opts:["FFL","TOS","SILL","LINTEL","GL","RL"].map(function(x){return [x,x]})})+pf("Level","spot.z",(spotZ(e)<0?"-":"")+fi(spotZ(e)));
  else if(r.k==="dline")h+=pf("Style","dline.st",e.st||"solid",{opts:[["solid","Solid"],["dash","Dashed"]]})+pf("Length","",fi(Math.hypot(e.b.x-e.a.x,e.b.y-e.a.y)),{ro:1});
  else if(r.k==="rail")h+=pf("Height","rail.h",fi(e.h||3))+pf("Length","",fi(Math.hypot(e.b.x-e.a.x,e.b.y-e.a.y)),{ro:1});
  else if(r.k==="grid")h+=pf("Name","grid.name",e.name)+pf("Length","",fi(Math.hypot(e.b.x-e.a.x,e.b.y-e.a.y)),{ro:1});
  else if(r.k==="sec")h+=pf("Name","sec.name",e.name)+pf("Look direction","sec.flip",e.flip?"1":"0",{opts:[["0","Side 1"],["1","Side 2 (flip)"]]})+'<button class="bb pri" id="prSec" style="width:100%;margin-top:6px">Open section view</button>'}
 if(L.length)h+='<div class="row"><button class="bb" id="prPin">'+(L.every(isPinned)?"Unpin":"Pin")+'</button><button class="bb del" id="prDel">Delete</button></div>';
 P.innerHTML=h;$("prX").onclick=function(){propsOpen(false)};if($("prPin"))$("prPin").onclick=doPin;if($("prDel"))$("prDel").onclick=doDelete;
 if($("prSec"))$("prSec").onclick=function(){openSheetBy("sec",S.secs.indexOf(elGet(L[0])))};
 P.querySelectorAll("[data-p]").forEach(function(inp){inp.onchange=function(){propSet(inp.dataset.p,inp.value,L)}})}
function propSet(key,v,L){var e=L.length===1?elGet(L[0]):null,lv=curLv(),num=parseFloat(v),ft=parseFI(v);if(key.indexOf("stair.")===0){stairPropSet(key,v,e);return}snapshot();var ok=true;
 switch(key){case "lv.name":lv.name=v.trim()||lv.name;break;case "lv.h":if(ft>=7&&ft<=30)lv.h=ft;else ok=false;break;case "lv.slab":if(num>=3&&num<=12)lv.slab=num;else ok=false;break;case "lv.ceil":if(ft>=6&&ft<=lv.h)lv.ceil=ft;else ok=false;break;
  case "m.tout":if(num>=2&&num<=36)S.meta.tout=num;else ok=false;break;case "m.tin":if(num>=2&&num<=36)S.meta.tin=num;else ok=false;break;
  case "mseg.th":if(num>=2&&num<=36)L.forEach(function(r){setWallTh(elGet(r),num)});else ok=false;break;
  case "seg.len":if(ft>0.1){UNDO.pop();var a=pt(e.a),b=pt(e.b);setLength(a,b,ft);updProps();return}ok=false;break;
  case "seg.th":if(num>=2&&num<=36)setWallTh(e,num);else ok=false;break;case "seg.k":e.k=v;break;
  case "op.dk":e.type=kType(v);e.dk=e.type==="D"?v:undefined;break;case "op.w":if(ft>0.2)e.w=ft;else ok=false;break;case "op.h":if(ft>0.3)e.h=ft;else ok=false;break;case "op.sill":if(ft>=0)e.sill=ft;else ok=false;break;
  case "op.flip":e.flip=v==="1";break;case "op.hinge":e.hinge=v==="1";break;
  case "f.w":if(ft>0.3)e.w=ft;else ok=false;break;case "f.d":if(ft>0.3)e.d=ft;else ok=false;break;case "f.rot":e.rot=((num||0)%360+360)%360;break;
  case "lab.name":e.name=v.trim()||e.name;break;case "lab.st":e.st=e.st||{};e.st.type=v;break;
  case "col.w":if(num>=6&&num<=48)e.w=num;else ok=false;break;case "col.d":if(num>=6&&num<=48)e.d=num;else ok=false;break;case "col.rot":e.rot=((num||0)%360+360)%360;break;
  case "beam.w":if(num>=4&&num<=36)e.w=num;else ok=false;break;case "beam.d":if(num>=6&&num<=48)e.d=num;else ok=false;break;
  case "dim.val":UNDO.pop();editDimValue(e,ft);updProps();return;case "dim.lock":e.lock=v==="1";break;case "dim.off":if(isFinite(ft))e.off=(e.off<0?-1:1)*Math.abs(ft);break;case "note.t":e.t=v;break;case "note.h":e.h=+v;break;case "spot.lab":e.lab=v;break;case "spot.z":if(isFinite(ft))e.z=ft;else ok=false;break;
  case "dline.st":e.st=v;break;case "rail.h":if(ft>1&&ft<8)e.h=ft;else ok=false;break;case "grid.name":e.name=v.trim().toUpperCase()||e.name;break;case "sec.name":e.name=v.trim()||e.name;break;case "sec.flip":e.flip=v==="1";break;default:ok=false}
 if(!ok){UNDO.pop();toast("Value not valid");updProps();return}changed();updProps();updLevelBadge()}
/* ---------- Visibility / Graphics ---------- */
var VGC=[["walls","Walls"],["doors","Doors / Windows"],["furn","Furniture"],["rooms","Rooms / tags"],["stairs","Stairs"],["cols","Columns"],["beams","Beams"],["rails","Railings"],["dims","Dimensions"],["grids","Grids"],["text","Text / spot levels"],["dlines","Detail lines"],["secs","Section marks"],["underlay","Underlay (floor below)"]];
/* Stage: View - Visibility/Graphics tool */
function vgPopup(){var v=S.meta.vis||{};modal('<div class="mt">Visibility / Graphics</div><div class="ms">Show or hide categories in the plan, sheets and PDF (like Revit VG)</div><div class="grid2">'+VGC.map(function(c){return '<button class="bb'+(v[c[0]]!==false?' on':'')+'" data-vg="'+c[0]+'">'+c[1]+'</button>'}).join("")+'</div>'+
 '<div class="ms" style="margin-top:10px"><b>Line weight</b> in PDF</div><div class="grid2">'+[[0.7,"Thin"],[1,"Normal"],[1.35,"Heavy"]].map(function(x){return '<button class="bb'+(Math.abs((+S.meta.lw||1)-x[0])<0.01?' on':'')+'" data-lw="'+x[0]+'">'+x[1]+'</button>'}).join("")+'</div>'+
 '<div class="row"><button class="bb'+(UI.thin?' on':'')+'" id="vgThin">Thin lines on screen: '+(UI.thin?"ON":"OFF")+'</button></div><div class="row"><button class="bb" id="vgAll">Show all</button><button class="bb ok" id="vgOk">Done</button></div>',function(box){
 box.querySelectorAll("[data-vg]").forEach(function(b){b.onclick=function(){var k=b.dataset.vg;S.meta.vis=S.meta.vis||{};if(S.meta.vis[k]===false)delete S.meta.vis[k];else S.meta.vis[k]=false;b.classList.toggle("on",S.meta.vis[k]!==false);changed()}});
 box.querySelectorAll("[data-lw]").forEach(function(b){b.onclick=function(){S.meta.lw=+b.dataset.lw;box.querySelectorAll("[data-lw]").forEach(function(x){x.classList.toggle("on",x===b)});changed()}});
 $("vgThin").onclick=function(){UI.thin=!UI.thin;LS.set("jksp_thin",UI.thin);this.classList.toggle("on",UI.thin);this.textContent="Thin lines on screen: "+(UI.thin?"ON":"OFF");render()};
 $("vgAll").onclick=function(){S.meta.vis={};closeModal();changed();toast("All categories visible")};$("vgOk").onclick=closeModal})}
function initV13(){UI.sel=[];UI.tab="arch";UI.thin=LS.get("jksp_thin",false);buildTabs();buildRail();$("bProps").onclick=function(){propsOpen(!UI.props)};$("bLv").onclick=levelsPopup;
 document.addEventListener("keydown",function(e){if($("modal").classList.contains("show")||/INPUT|TEXTAREA|SELECT/.test((e.target||{}).tagName||""))return;if(e.key==="Delete"&&selEls().length)doDelete();else if(e.key==="Escape"){UI.pick=null;UI.lpA=null;UI.dimPend=null;clearSel();updCtx();render()}
  else if((e.ctrlKey||e.metaKey)&&e.key==="z"){undo()}else if((e.ctrlKey||e.metaKey)&&e.key==="y"){redo()}});
 propsOpen(LS.get("jksp_props",window.innerWidth>=1100))}
