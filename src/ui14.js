/* ================= v1.4 UI: modern line icons, Revit ribbon panels, compact option bar, slide-over properties, focus mode ================= */
Object.assign(ICO,{
 sel:'<path d="M4.04 4.6a.5.5 0 0 1 .6-.6l16 6.5a.5.5 0 0 1-.1.95l-6.1 1.6a2 2 0 0 0-1.4 1.4l-1.6 6.1a.5.5 0 0 1-.95.1z"/>',
 window:'<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M12 3v18M4 12h16"/>',
 opening:'<path d="M3 21V5h18v16"/><path d="M8 21v-9h8v9" stroke-dasharray="2.5 2"/>',
 col:'<rect x="8" y="4" width="8" height="16" rx="1"/><path d="M5 4h14M5 20h14"/>',
 beam:'<path d="M2 8.5h20M2 15.5h20"/><path d="M6 8.5v7M18 8.5v7M12 8.5v7" stroke-dasharray="1.5 2"/>',
 slab:'<path d="m2 11 10-5 10 5-10 5z"/><path d="m2 15 10 5 10-5"/>',
 ceil:'<path d="M3 4h18M3 20h18"/><path d="M12 7.5v9M9.5 9.5 12 7l2.5 2.5M9.5 14.5 12 17l2.5-2.5"/>',
 roof2:'<path d="M2.5 11 12 4l9.5 7"/><path d="M5 9.2V20h14V9.2"/>',
 stair:'<path d="M3 20h5v-5h5v-5h5V5h3"/>',
 rail:'<path d="M3 6h18M5 6v14M19 6v14M9.7 6v14M14.3 6v14"/>',
 room:'<rect x="3" y="3" width="18" height="18" rx="1.5"/><path d="M3 12h8v9M11 3v4.5"/>',
 rtag:'<rect x="3" y="3" width="18" height="18" rx="1.5"/><path d="M7 9.5h10M7 13h6"/>',
 area:'<path d="M3 3h18v18H3z" stroke-dasharray="3 2.5"/><path d="M7 17V7l10 10z"/>',
 level:'<path d="M3 8h12M3 17h12" stroke-dasharray="3 2"/><path d="m15 8 3-3 3 3zM15 17l3-3 3 3z"/>',
 grid2:'<circle cx="12" cy="5" r="2.75"/><path d="M12 7.75V22" stroke-dasharray="4 2 1 2"/>',
 footing:'<path d="M9.5 3h5v10h-5z"/><path d="M4 13h16v5H4z"/><path d="M2 21.5h20" stroke-dasharray="2 2"/>',
 dim:'<path d="M3 16h18M3 12v8M21 12v8"/><path d="m6.5 14-2 2 2 2M17.5 14l2 2-2 2"/><path d="M9 8h6"/>',
 spot:'<path d="m4 13 4 6 4-6z"/><path d="M12 13h9M14 9h7"/>',
 dline:'<path d="M4 20 20 4"/><circle cx="4" cy="20" r="1.5"/><circle cx="20" cy="4" r="1.5"/>',
 text:'<path d="M4 7V4h16v3M9 20h6M12 4v16"/>',
 tags:'<path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19"/><path d="M9.6 5H4a1 1 0 0 0-1 1v5.6a2 2 0 0 0 .6 1.4l6 6a2.4 2.4 0 0 0 3.4 0l3.6-3.6a2.4 2.4 0 0 0 0-3.4l-6-6A2 2 0 0 0 9.6 5"/><circle cx="7" cy="9" r="1"/>',
 sec:'<path d="M6.5 12h11" stroke-dasharray="3 2"/><circle cx="4" cy="12" r="2.5"/><circle cx="20" cy="12" r="2.5"/><path d="M4 9.5V6l2 1.5M20 9.5V6l-2 1.5"/>',
 elev:'<path d="M3 21h18"/><path d="M5 21V10l7-6 7 6v11"/><rect x="9.5" y="14" width="5" height="7"/>',
 plan:'<rect x="3" y="3" width="18" height="18" rx="1.5"/><path d="M3 10h7v11M10 14h11M15 3v4"/>',
 sheets:'<rect x="2.5" y="4" width="19" height="16" rx="2"/><path d="M15.5 4v16M15.5 14.5h6"/>',
 pdf:'<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v5h5M12 18v-6M9 15l3 3 3-3"/>',
 vg:'<path d="M2.1 12.3a1 1 0 0 1 0-.6 10.8 10.8 0 0 1 19.8 0 1 1 0 0 1 0 .6 10.8 10.8 0 0 1-19.8 0"/><circle cx="12" cy="12" r="3"/>',
 thin:'<path d="M4 6h16" stroke-width="3"/><path d="M4 12h16"/><path d="M4 18h16" stroke-width="1"/>',
 align:'<rect x="6" y="14" width="9" height="6" rx="1.5"/><rect x="6" y="4" width="15" height="6" rx="1.5"/><path d="M2 2v20"/>',
 offset:'<path d="M4 7h16"/><path d="M4 17h16" stroke-dasharray="3 2.5"/><path d="M12 9.5v5M10 12.5l2 2 2-2"/>',
 mirror:'<path d="m3 7 5 5-5 5zM21 7l-5 5 5 5zM12 20v2M12 14v2M12 8v2M12 2v2"/>',
 mv:'<path d="M5 9 2 12l3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/>',
 copy:'<rect x="8" y="8" width="14" height="14" rx="2"/><path d="M4 16a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2"/>',
 rotate:'<path d="M21 12a9 9 0 1 1-9-9c2.5 0 4.9 1 6.7 2.7L21 8"/><path d="M21 3v5h-5"/>',
 trim:'<circle cx="6" cy="6" r="3"/><path d="M8.1 8.1 12 12M20 4 8.1 15.9"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>',
 split:'<path d="M3 12h6.5M14.5 12H21"/><path d="M12 3v18" stroke-dasharray="2 2.5"/>',
 array:'<rect x="2" y="9" width="5" height="6" rx="1"/><rect x="9.5" y="9" width="5" height="6" rx="1"/><rect x="17" y="9" width="5" height="6" rx="1"/>',
 pin:'<path d="M12 17v5"/><path d="M9 10.8a2 2 0 0 1-1.1 1.8l-1.8.9A2 2 0 0 0 5 15.2V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.8a2 2 0 0 0-1.1-1.8l-1.8-.9A2 2 0 0 1 15 10.8V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>',
 corner:'<path d="M5 19V9a4 4 0 0 1 4-4h10"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="5" r="2"/><rect x="3.5" y="3.5" width="3" height="3" rx=".5"/>',
 clipcopy:'<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M16 4h2a2 2 0 0 1 2 2v4M21 14H11"/><path d="m15 10-4 4 4 4"/>',
 paste:'<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 14h6M9 18h4"/>',
 match:'<path d="m14.6 2.6 6.8 6.8-9.9 9.9a2 2 0 0 1-2.8 0l-4-4a2 2 0 0 1 0-2.8z"/><path d="m5 14-3 8 8-3"/>',
 measure:'<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0z"/><path d="m14.5 12.5 2-2M11.5 9.5l2-2M8.5 6.5l2-2M17.5 15.5l2-2"/>',
 size:'<path d="M4 8v8M20 8v8M4 12h16"/><path d="m7.5 9.5-2.5 2.5 2.5 2.5M16.5 9.5l2.5 2.5-2.5 2.5"/>',
 del:'<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',x:'<path d="M18 6 6 18M6 6l12 12"/>',check:'<path d="M20 6 9 17l-5-5"/>',
 edit:'<path d="M21.2 6.8a2.8 2.8 0 0 0-4-4L3.8 16.2a2 2 0 0 0-.5.8l-1.3 4.4a.5.5 0 0 0 .6.6l4.4-1.3a2 2 0 0 0 .8-.5z"/>',
 poly:'<path d="m12 2.5 9 7-3.5 11h-11L3 9.5z"/>',angle:'<path d="M3 21h18M3 21 15 6"/><path d="M9 21a7 7 0 0 0-1.6-4.5"/>',
 pen:'<path d="m12 19 7-7 3 3-7 7z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18z"/><path d="m2 2 7.6 7.6"/><circle cx="11" cy="11" r="2"/>',
 filter:'<path d="M22 3H2l8 9.5V19l4 2v-8.5z"/>',selall:'<path d="M5 3a2 2 0 0 0-2 2M19 3a2 2 0 0 1 2 2M21 19a2 2 0 0 1-2 2M5 21a2 2 0 0 1-2-2M9 3h1M9 21h1M14 3h1M14 21h1M3 9v1M21 9v1M3 14v1M21 14v1"/>',
 same:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
 back:'<path d="m12 19-7-7 7-7M19 12H5"/>',chain:'<path d="M9 17H7A5 5 0 0 1 7 7h2M15 7h2a5 5 0 0 1 0 10h-2M8 12h8"/>',
 lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',unlock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.8-1.2"/>',
 sofa:ICO.sofa,door:ICO.door,draw:ICO.draw,wall:ICO.draw,move:'<path d="M5 9 2 12l3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/>'});
function svgI(k){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">'+(ICO[k]||ICO.draw)+'</svg>'}
/* tool / action definitions: [label, long tip, icon] */
/* Stage: v1.4 drawing tools - every rail tool: [label, tooltip, icon] */
var TD14={draw:["Wall","Draw walls of the selected wall type","draw"],door:["Door","Place a door on a wall (door types)","door"],window:["Window","Place a window / ventilator (window types)","window"],opening:["Opening","Wall opening without shutter","opening"],
 furn:["Component","Furniture & fixtures","sofa"],col:["Column","Structural column (column types)","col"],roof:["Roof","Flat + parapet, gable, hip","roof2"],"a:ceil":["Ceiling","Ceiling height for this level","ceil"],slab:["Floor","Floor slab & floor-to-floor height","slab"],
 stair:["Stair","Straight / L / U stair with risers","stair"],kc:["Counter","Kitchen counter top - drag along the walls (straight / L / U)","kcount"],"a:kmod":["Modular","Modular kitchen units: base, sink, hob, drawer, corner, wall, tall, chimney","kmod"],"a:ksched":["Kitchen List","Modular kitchen schedule: unit, size, count (CSV)","ksched"],rail:["Railing","Draw a railing","rail"],room:["Room","Tap inside walls to name a room","room"],"a:rtag":["Room Tag","Tag a room (tap inside it)","rtag"],"a:area":["Area","Room areas & built-up per level","area"],
 "a:levels":["Level","Levels: add, copy floor up, switch","level"],grid:["Grid","Draw grid lines / auto grids","grid2"],beam:["Beam","Draw a beam (auto on walls)","beam"],"a:found":["Isolated Footing","Footings under columns","footing"],
 dim:["Aligned","Aligned dimension","dim"],spot:["Spot Level","Spot elevation","spot"],dline:["Detail Line","Solid / dashed detail line","dline"],text:["Text","Text note","text"],"a:tag":["Tag","Door / window / room tags","tags"],
 "a:v3d":["3D View","Open the 3D view (all levels)","cube"],sec:["Section","Draw a section line","sec"],"a:elev":["Elevation","N / S / E / W elevations","elev"],"a:plan":["Plan View","Floor plans: switch level","plan"],
 "a:sheets":["Sheets","Sheet set with CTAK title block","sheets"],"a:pdf":["Export PDF","PDF of all sheets","pdf"],"a:import":["Import","Import IFC / DXF exported from Revit","import"],"a:fillc":["Filled","Filled wall corners (solid joins) - on / off","fillc"],"a:fsave":["Save File","Save the drawing as a .jksp file (Ctrl+S)","fsave"],"a:fopen":["Open File","Open a saved .jksp file or a recent file (Ctrl+O)","fopen"],"a:vg":["Visibility/Graphics","Show / hide categories","vg"],"a:thin":["Thin Lines","Thin lines on screen","thin"],
 sel:["Select","Tap / box select (L→R window, R→L crossing)","sel"],align:["Align","Align to a reference line","align"],offset:["Offset","Parallel copy at a distance","offset"],"a:xmir":["Mirror","Mirror the selection","mirror"],"a:xmove":["Move","Move the selection","mv"],
 "a:xcopy":["Copy","Copy the selection (move copy)","copy"],"a:xrot":["Rotate","Rotate the selection","rotate"],trim:["Trim/Extend","Trim / extend walls to corner","trim"],split:["Split","Split a wall","split"],"a:xarr":["Array","Linear array","array"],
 "a:xpin":["Pin","Pin / unpin the selection","pin"],del:["Delete","Tap items to delete","del"],move:["Edit Corners","Drag corners / room names","corner"],"a:ccopy":["Copy to Clipboard","Copy selection to clipboard","clipcopy"],
 "a:cpaste":["Paste","Paste aligned to the current level","paste"],wall:["Match Type","Tap a wall to change its type","match"],meas:["Measure","Measure between two points","measure"],size:["Size","Tap a wall to type its length","size"]};
/* Stage: v1.4 ribbon - tabs and panels: Architecture, Structure, Annotate, View (incl. Import), Modify */
var PANELS={arch:["Architecture",[["Build","Build",["draw","door","window","furn","col","roof","a:ceil","slab"]],["Circulation","Circul.",["stair","rail"]],["Kitchen","Kitchen",["kc","a:kmod","a:ksched"]],["Room & Area","Room",["room","a:rtag","a:area"]],["Opening","Opening",["opening"]],["Datum","Datum",["a:levels","grid"]]]],
 struct:["Structure",[["Structure","Struct.",["beam","col","slab"]],["Foundation","Found.",["a:found"]],["Datum","Datum",["grid","a:levels"]]]],
 anno:["Annotate",[["Dimension","Dim.",["dim","spot"]],["Detail","Detail",["dline"]],["Text","Text",["text"]],["Tag","Tag",["a:tag","room"]]]],
 view:["View",[["File","File",["a:fsave","a:fopen"]],["Create","Create",["a:v3d","sec","a:elev","a:plan"]],["Sheet Composition","Sheets",["a:sheets","a:pdf"]],["Import","Import",["a:import"]],["Graphics","Graphics",["a:vg","a:thin","a:fillc"]]]],
 modify:["Modify",[["Select","Select",["sel"]],["Modify","Modify",["align","offset","a:xmir","a:xmove","a:xcopy","a:xrot","trim","split","a:xarr","a:xpin","del","move"]],["Clipboard","Clipb.",["a:ccopy","a:cpaste","wall"]],["Measure","Measure",["meas","size"]]]]};
var OPF={door:"D",window:"W",opening:"OP"};
function panelTools(k){var o=[];PANELS[k][1].forEach(function(p){p[2].forEach(function(t){o.push(OPF[t]?"open":t)})});return o}
TABS={};Object.keys(PANELS).forEach(function(k){TABS[k]=[PANELS[k][0],panelTools(k)]});
function tabOf(t){return Object.keys(PANELS).find(function(k){return TABS[k][1].indexOf(t)>=0})}
function showTool(t){var k=tabOf(t);if(k&&UI.tab!==k){UI.tab=k;buildRail()}return k}
function buildTabs(){var t=$("tabs");t.innerHTML=Object.keys(PANELS).map(function(k){return '<button class="tab" data-tab="'+k+'">'+PANELS[k][0]+'</button>'}).join("");
 t.querySelectorAll("[data-tab]").forEach(function(b){b.onclick=function(){UI.tab=b.dataset.tab;buildRail();var L=TABS[UI.tab][1].filter(function(x){return x.indexOf("a:")<0});if(UI.tab!=="view"&&L.indexOf(UI.tool)<0&&L.length)setTool(L[0]);else{markRail();updCtx()}}})}
/* Toolbar labels: short name shown under each rail icon (full name stays in the tooltip) */
var RLAB={"a:fsave":"Save","a:fopen":"Open","a:vg":"Visibility","a:found":"Footing","a:ccopy":"Clip Copy","a:cpaste":"Paste",trim:"Trim",move:"Corners",wall:"Match",dline:"Detail",spot:"Spot","a:thin":"Thin","a:pdf":"PDF","a:elev":"Elev","a:plan":"Plan",furn:"Comp.",dim:"Dim","a:rtag":"Room Tag","a:v3d":"3D View","a:levels":"Level","a:xmir":"Mirror","a:xarr":"Array","a:xpin":"Pin","a:xrot":"Rotate","a:xcopy":"Copy","a:xmove":"Move","a:sheets":"Sheets","a:import":"Import","a:ceil":"Ceiling","a:area":"Area","a:tag":"Tag"};
function railBtn(it){var d=TD14[it]||[it,"","draw"],tip=' title="'+escH(d[0]+(d[1]?" - "+d[1]:""))+'" data-tip="'+escH(d[0])+'" data-tips="'+escH(d[1])+'"';
 if(OPF[it])return '<button class="tool" data-t="open" data-of="'+OPF[it]+'"'+tip+'>'+svgI(d[2])+'<small>'+(RLAB[it]||d[0])+'</small></button>';
 if(it.indexOf("a:")===0)return '<button class="tool act" data-a="'+it.slice(2)+'"'+tip+'>'+svgI(d[2])+'<small>'+(RLAB[it]||d[0])+'</small></button>';
 return '<button class="tool" data-t="'+it+'"'+tip+'>'+svgI(d[2])+'<small>'+(RLAB[it]||d[0])+'</small></button>'}
function buildRail(){var r=$("tools");r.innerHTML=PANELS[UI.tab][1].map(function(p){return '<div class="rph" title="'+escH(p[0])+'">'+p[1]+'</div>'+p[2].map(railBtn).join("")}).join("");
 r.querySelectorAll("[data-t]").forEach(function(b){b.onclick=function(){if(b.dataset.of){UI.opFam=b.dataset.of;if(b.dataset.of!=="D")UI.opExp=true}else if(b.dataset.t==="open")UI.opFam="D";setTool(b.dataset.t);if(b.dataset.t==="open"){markRail();updCtx()}}});
 r.querySelectorAll("[data-a]").forEach(function(b){b.onclick=function(){railAction(b.dataset.a)}});markRail()}
function markRail(){document.querySelectorAll("#tools .tool").forEach(function(b){b.classList.toggle("on",b.dataset.t===UI.tool&&(!b.dataset.of||b.dataset.of===(UI.opFam||"D")))});document.querySelectorAll("#tabs .tab").forEach(function(b){b.classList.toggle("on",b.dataset.tab===UI.tab)});var fb=document.querySelector('#tools [data-a="fillc"]');if(fb)fb.classList.toggle("on",!!(S&&S.meta&&S.meta.fillc))}
function needSel(k,name){if(selEls().length){ctxAction(k);return}if(UI.tool!=="sel")setTool("sel");toast("Select elements first, then tap "+name)}
/* Stage: v1.4 ribbon - one-shot rail actions (Levels, 3D View, Sheets, Export PDF, Import, ...) */
function railAction(a){if(a==="import"){importPopup();return}if(a==="fillc"){fillToggle();return}if(a==="levels")levelsPopup();else if(a==="elev")openSheetBy("elev");else if(a==="sheets"){setClean(true)}else if(a==="v3d")open3D("3d");else if(a==="vg")vgPopup();
 else if(a==="ceil")floorPopup();else if(a==="area")areaPopup();else if(a==="rtag"){setTool("room");toast("Room Tag: tap inside a room to tag / rename it")}else if(a==="found")footingPopup();else if(a==="tag")tagPopup();
 else if(a==="plan"){if(UI.clean)setClean(false);levelsPopup()}else if(a==="pdf")exportPDF();else if(a==="thin"){UI.thin=!UI.thin;LS.set("jksp_thin",UI.thin);toast("Thin lines "+(UI.thin?"ON":"OFF"));updCtx();render()}
 else if(a==="xmir")needSel("xmir","Mirror");else if(a==="xmove")needSel("xmove","Move");else if(a==="xcopy")needSel("xcopy","Copy");else if(a==="xrot")needSel("xrot","Rotate");else if(a==="xarr")needSel("xarr","Array");else if(a==="xpin")needSel("xpin","Pin");
 else if(a==="ccopy")clipCopy();else if(a==="cpaste")clipPaste()}
Object.assign(HINTS,{meas:"Tap two points (or drag) to measure · snaps to corners, faces and grids",open:"Tap a wall to place the selected type",sel:"Tap to select · box: L→R window, R→L crossing · selected wall: tap a temporary dimension to edit it",wall:"Match Type: tap a wall to change its type / thickness"});
/* ---------- option bar ---------- */
function cbI(k,ic,t,tip,on,cls){return '<button class="cb'+(on?" on":"")+(cls?" "+cls:"")+'" data-c="'+k+'" title="'+escH(tip||t)+'">'+(ic?svgI(ic):"")+(t?'<span>'+t+'</span>':'')+'</button>'}
function cb(k,t,s,on,cls){return cbI(k,null,t,s,on,cls)}
var CDV='<span class="cdv"></span>';
function toolLabel(T){if(T==="open"){var f=UI.opFam||"D";return f==="W"?TD14.window:f==="OP"?TD14.opening:TD14.door}return TD14[T]||[T,"","draw"]}
function typeBar(key,cur){var cat=key==="op"?"door":key;return '<span class="tlab">Type</span>'+tselHTML(key,cur)+cbI("tedit:"+key,"edit","","Edit Type ("+tFull(cat,cur)+")")}
/* Stage: Option bar - options for the active tool */
function updCtx(){var c=$("ctx");if(!c)return;var h="",T=UI.tool;
 if(UI.clean){var L=(SHEET&&SHEET.list)||sheetList(),cur=UI.sheetKey||(L[0]&&L[0].key);
  h='<span class="ctl">'+svgI("sheets")+'Sheets</span>'+cbI("back","back","Back to drawing","",true)+cbI("pdf","pdf","PDF","all sheets")+cbI("dxf","dxf","DXF","this sheet")+cbI("png","img","PNG")+cbI("det","edit","Details","title block")+CDV+cb("pg1","Plan","Sheet 1",/^plan/.test(cur))+cb("pg2","Door & Window","details",cur==="dw")+
   L.filter(function(s){return s.key!=="dw"&&s.key!=="plan0"}).map(function(s){return cb("sh:"+s.key,esc(s.no)+" <span style=\"font-weight:400;color:#64748b\">"+esc(s.short)+"</span>","",s.key===cur)}).join("")+CDV+cbI("v3d","cube","3D View")+cbI("cad","cad","AutoCAD 3D")}
 else{var tl=toolLabel(T);h='<span class="ctl">'+svgI(tl[2])+tl[0]+'</span>'+cbI("lv","levels",esc(curLv().name),"Level "+lvl(lvElev(S.cur))+" - tap to switch",false,"lvb");
  if(T==="draw")h+=CDV+typeBar("wall",curType("wall"))+cbI("wth","","Thickness "+thTxt(UI.wth||S.meta.tout),"Custom thickness for new walls")+CDV+cbI("new","plus","New line")+cbI("close","poly","Close")+cbI("ortho","angle",UI.ortho===90?"90°":UI.ortho===45?"45°":"Free","Angle snap",true)+cbI("chain","chain","Continue","Continue from last end",UI.chainOn);
  if(T==="open"){var f=UI.opFam||"D";h+=CDV+(f==="W"?typeBar("win",curType("win")):f==="OP"?typeBar("op",curType("op")):typeBar("door",curType("door")))}
  if(T==="col")h+=CDV+typeBar("col",curType("col"))+cbI("crot","rotate",(UI.colRot||0)+"°","Rotate new columns")+cbI("cauto","plus","Auto at corners","",false,"ok2")+cbI("cgrid","grid","At grid crossings","",false,"ok2");
  if(T==="furn"){var fs=furnSel();h+=CDV+cbI("fadd","plus","Add furniture","",true)+(fs?cbI("frot","rotate","Rotate 90°")+cbI("fdup","copy","Duplicate")+cbI("fdel","del","Delete","",false,"warn")+cbI("fdone","check","Done")+'<span class="cnt">'+esc(FURN[fs.type].n)+'</span>':'')}
  if(T==="wall")h+=CDV+cbI("wdef","wall","Defaults: outer "+thTxt(S.meta.tout)+" · inner "+thTxt(S.meta.tin),"",true)+TY("wall").map(function(t){return '<span class="cb" style="pointer-events:none"><i style="width:10px;height:10px;border-radius:3px;background:'+thCol(t.th)+'"></i>'+esc(tName("wall",t))+'</span>'}).join("");
  if(T==="sel"){var n=selEls().length,sc=selCat(),st=sc?selType():undefined;h+=CDV+'<span class="cnt">'+n+' selected</span>';
   if(sc){h+=CDV+'<span class="tlab">Type</span>'+tselHTML("sel",st||null,{cat:sc,none:st===undefined?"(varies)":"Custom (no type)"})+cbI("tedit:sel","edit","","Edit Type")+(n===1?cbI("xsame","same","All instances","Select all instances of this type (this level)"):"")}
   if(n===1&&UI.sel[0].k==="dim"){var de=elGet(UI.sel[0]);h+=CDV+cbI("dval","edit","Edit value","Type a new dimension value - moves the attached wall")+cbI("dlock",de.lock?"lock":"unlock",de.lock?"Locked":"Lock","Lock this dimension",!!de.lock)}
   h+=CDV+cbI("xmove","mv","Move")+cbI("xcopy","copy","Copy")+cbI("xrot","rotate","Rotate")+cbI("xmir","mirror","Mirror")+cbI("xarr","array","Array")+cbI("xpin","pin",n&&selEls().every(isPinned)?"Unpin":"Pin")+cbI("xdel","del","Delete","",false,"warn")+CDV+cbI("xfil","filter","Filter")+cbI("xall","selall","All")+cbI("xadd","plus","Add","Multi-select",UI.addSel)+cbI("xclr","x","Clear")+CDV+cbI("ccopy","clipcopy","","Copy to clipboard")+cbI("cpaste","paste","","Paste aligned",false)}
  if(T==="beam")h+=CDV+BEAMSZ.map(function(z){var on=(UI.beamSz||[9,18])[0]===z[0]&&(UI.beamSz||[9,18])[1]===z[1];return cb("bs:"+z[0]+"x"+z[1],z[0]+'"×'+z[1]+'"',"width x depth",on)}).join("")+cbI("bauto","plus","Auto on walls","",false,"ok2");
  if(T==="grid")h+=CDV+cbI("gauto","plus","Auto grids","from walls",false,"ok2")+cbI("cgrid","col","Columns at crossings");
  if(T==="dim"||T==="beam"||T==="rail"||T==="dline"||T==="sec"||T==="grid"||T==="meas")h+=cbI("ortho","angle",UI.ortho===90?"90°":UI.ortho===45?"45°":"Free","Angle snap",true);
  if(T==="dline")h+=cb("dls","Solid","",(UI.dlSt||"solid")==="solid")+cb("dld","Dashed","",UI.dlSt==="dash");
  if(T==="trim")h+=CDV+cb("tmc","Corner","2 walls",UI.trimMode!=="one")+cb("tmo","Extend / trim to boundary","1 wall",UI.trimMode==="one");
  if(T==="offset")h+=CDV+cbI("ofd","offset","Distance "+fi(UI.offD||3),"tap to change",true)+cb("ofr","Full straight wall","",UI.offRun);
  if(T==="sec")h+=CDV+cbI("secv","sec","Open section views",S.secs.length+" sections");
  if(T==="stair")h+=CDV+cbI("rfl","slab","Floor height","stair risers follow it");
  if(T==="slab")h+=CDV+cbI("rfl","slab","Floor / ceiling","heights",true)+cbI("lv2","level","Levels","add / copy floor");
  if(T==="roof")h+=CDV+cbI("rfr","roof2","Roof: "+roofCfg().type,"Roof settings",true);
  if(T==="meas"&&UI.meas)h+=CDV+'<span class="cnt">'+fi(UI.meas.L)+'</span><span class="tlab">ΔX '+fi(UI.meas.dx)+' · ΔY '+fi(UI.meas.dy)+'</span>';
  if(T==="align"||T==="trim"||(UI.pick&&UI.pick.k))h+=cbI("pickx","x","Cancel pick");
  h+=CDV+cbI("pen","pen","Pen",UI.penOnly?"Pen only ON (palm safe)":"Pen only OFF",UI.penOnly)+cbI("grid","grid",["Grid off","Grid","Grid+"][UI.grid],"Background grid",!!UI.grid)+cbI("thin","thin","Thin","Thin lines",UI.thin)+cbI("fillc","fillc","Filled","Filled wall corners",!!S.meta.fillc)}
 c.innerHTML=h;c.querySelectorAll("[data-c]").forEach(function(b){b.onclick=function(){ctxAction(b.dataset.c)}});
 bindTsel(c,function(key,id){if(key==="sel")setSelType(id);else pickType(key,id);updCtx();updProps();render()});
 var hn=$("hint");if(hn)hn.textContent=UI.clean?"Sheets":(UI.pick&&UI.pick.k==="mirror"?"Tap 2 points for the mirror axis":HINTS[T]||"");updLevelBadge();var bo=$("bOpt");if(bo)bo.classList.toggle("on",!UI.noopt)}
var _ctx0=ctxAction;ctxAction=function(k){if(k.indexOf("tedit:")===0){editTypeFor(k.slice(6));return}
 if(k==="xsame"){selectSame();return}if(k==="fillc"){fillToggle();return}if(k==="ccopy"){clipCopy();return}if(k==="cpaste"){clipPaste();return}
 if(k==="dval"){var e=selEls()[0];if(e&&e.k==="dim")dimValuePopup(elGet(e));return}if(k==="dlock"){var r=selEls()[0];if(r&&r.k==="dim"){var d=elGet(r);snapshot();d.lock=!d.lock;changed();updCtx();updProps();toast(d.lock?"Dimension locked":"Dimension unlocked")}return}
 return _ctx0(k)};
/* ---------- properties: slide-over with Type Selector ---------- */
propsOpen=function(on){UI.props=!!on;$("app").classList.toggle("pr",UI.props);$("bProps").classList.toggle("on",UI.props);LS.set("jksp_props14",UI.props);updProps()};
var _up0=updProps;updProps=function(){_up0();var P=$("props");if(!P||!UI.props)return;var ph=P.querySelector(".ph");if(!ph)return;var h="",sc=selCat(),n=selEls().length;
 if(sc){var st=selType();h='<div class="tsbox"><span class="tlab">Type Selector</span>'+tselHTML("sel",st||null,{cat:sc,none:st===undefined?"(varies)":"Custom (no type)"})+'<div class="tsrow"><button class="sb" id="ptEdit">'+svgI("edit")+'Edit Type</button>'+(n===1?'<button class="sb" id="ptSame">'+svgI("same")+'Select all instances</button>':'')+'</div></div>'}
 else if(!n){var key=UI.tool==="draw"?"wall":UI.tool==="col"?"col":UI.tool==="open"?((UI.opFam||"D")==="W"?"win":(UI.opFam==="OP"?"op":"door")):null;
  if(key)h='<div class="tsbox"><span class="tlab">Type Selector · new '+TCATN[key==="op"?"door":key].toLowerCase()+'s</span>'+tselHTML(key,curType(key))+'<div class="tsrow"><button class="sb" id="ptEdit">'+svgI("edit")+'Edit Type</button></div></div>'}
 if(!h)return;ph.insertAdjacentHTML("afterend",h);var ed=$("ptEdit");if(ed)ed.onclick=function(){editTypeFor(sc?"sel":key)};var sm=$("ptSame");if(sm)sm.onclick=selectSame;
 bindTsel(P,function(k,id){if(k==="sel")setSelType(id);else pickType(k,id);updCtx();updProps();render()});
 var x=$("prX");if(x){x.innerHTML=svgI("x");x.title="Close"}};
/* ---------- focus mode / option bar / auto-hide / long-press tips ---------- */
/* Stage: Focus mode - full-screen canvas, active tool unchanged */
function setFocus(on){UI.focus=!!on;$("app").classList.toggle("focus",UI.focus);$("bFocus").classList.toggle("on",UI.focus);setTimeout(resize,20);toast(UI.focus?"Focus mode - full-screen canvas":"Focus mode off")}
function initTips(){var tip=$("tip"),tm=0,hideT=0;function hide(){clearTimeout(tm);clearTimeout(hideT);hideT=setTimeout(function(){tip.style.display="none"},700)}
 document.addEventListener("pointerdown",function(e){var b=e.target.closest&&e.target.closest("[data-tip]");clearTimeout(tm);if(!b)return;tm=setTimeout(function(){var r=b.getBoundingClientRect(),inRail=!!b.closest("#tools");tip.innerHTML=esc(b.dataset.tip)+(b.dataset.tips?'<small>'+esc(b.dataset.tips)+'</small>':'');tip.style.display="block";
  var tw=tip.offsetWidth,th=tip.offsetHeight;if(inRail){tip.style.left=(r.right+8)+"px";tip.style.top=Math.max(4,r.top+r.height/2-th/2)+"px"}else{tip.style.left=Math.min(innerWidth-tw-4,Math.max(4,r.left+r.width/2-tw/2))+"px";tip.style.top=(r.bottom+6)+"px"}},420)},true);
 ["pointerup","pointercancel","pointerleave"].forEach(function(ev){document.addEventListener(ev,hide,true)})}
function initAutoHide(){var cv=$("cv"),app=$("app"),t1=0,t2=0;cv.addEventListener("pointerdown",function(){clearTimeout(t2);clearTimeout(t1);t1=setTimeout(function(){if(!UI.clean)app.classList.add("drawing")},160)});
 function up(){clearTimeout(t1);clearTimeout(t2);t2=setTimeout(function(){app.classList.remove("drawing")},350)}cv.addEventListener("pointerup",up);cv.addEventListener("pointercancel",up)}
initV13=function(){UI.sel=[];UI.tab="arch";UI.thin=LS.get("jksp_thin",false);UI.noopt=LS.get("jksp_noopt",false);$("app").classList.toggle("noopt",UI.noopt);buildTabs();buildRail();
 $("bProps").onclick=function(){propsOpen(!UI.props)};$("bLv").onclick=levelsPopup;$("bFocus").onclick=function(){setFocus(!UI.focus)};$("fxExit").onclick=function(){setFocus(false)};
 $("fxUndo").onclick=function(){undo()};$("fxRedo").onclick=function(){redo()};$("fxFit").onclick=function(){$("bFit").click()};
 $("bOpt").onclick=function(){UI.noopt=!UI.noopt;LS.set("jksp_noopt",UI.noopt);$("app").classList.toggle("noopt",UI.noopt);updCtx();toast(UI.noopt?"Option bar hidden":"Option bar shown")};
 document.addEventListener("keydown",function(e){if($("modal").classList.contains("show")||/INPUT|TEXTAREA|SELECT/.test((e.target||{}).tagName||""))return;if(e.key==="Delete"&&selEls().length)doDelete();else if(e.key==="Escape"){if(UI.focus){setFocus(false);return}UI.pick=null;UI.lpA=null;UI.dimPend=null;clearSel();updCtx();render()}
  else if((e.ctrlKey||e.metaKey)&&e.key==="z"){undo()}else if((e.ctrlKey||e.metaKey)&&e.key==="y"){redo()}else if((e.ctrlKey||e.metaKey)&&e.key==="c"){clipCopy()}else if((e.ctrlKey||e.metaKey)&&e.key==="v"){clipPaste()}else if(e.key==="F11"||(e.key==="f"&&e.altKey)){setFocus(!UI.focus)}});
 initTips();initAutoHide();propsOpen(LS.get("jksp_props14",false));updCtx()};
var _st0=setTool;setTool=function(t){_st0(t);if(UI.props)updProps()};
