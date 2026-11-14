/* ================= v1.4 REVIT-STYLE TYPES (walls, doors, windows, columns) + clipboard, measure, area, footing ================= */
var FAMN={wall:"Basic Wall",MD:"Main Door",D:"Single Door",TD:"Toilet Door",OP:"Opening",W:"Window",V:"Ventilator",col:"Concrete Column"};
var TCATN={wall:"Wall",door:"Door",win:"Window",col:"Column"};
/* Stage: Types - wall / door / window / column types used by the Wall, Door, Window and Column tools */
function defTypes(){return {wall:[{id:"w45",name:'Brick 4½"',th:4.5},{id:"w6",name:'Block 6"',th:6},{id:"w8",name:'Block 8"',th:8},{id:"w9",name:'Brick 9"',th:9}],
 door:[{id:"dMD35",k:"MD",w:3.5,h:7},{id:"dMD4",k:"MD",w:4,h:7},{id:"dD3",k:"D",w:3,h:7},{id:"dD275",k:"D",w:2.75,h:7},{id:"dTD25",k:"TD",w:2.5,h:7},{id:"dTD225",k:"TD",w:2.25,h:7},{id:"dOP3",k:"OP",w:3,h:7},{id:"dOP4",k:"OP",w:4,h:7}],
 win:[{id:"nW4",k:"W",w:4,h:4,sill:3},{id:"nW3",k:"W",w:3,h:4,sill:3},{id:"nW5",k:"W",w:5,h:4,sill:3},{id:"nW6",k:"W",w:6,h:4,sill:3},{id:"nV2",k:"V",w:2,h:1.5,sill:7},{id:"nV15",k:"V",w:1.5,h:1.5,sill:7}],
 col:[{id:"c99",w:9,d:9},{id:"c912",w:9,d:12},{id:"c1212",w:12,d:12},{id:"c915",w:9,d:15},{id:"c1218",w:12,d:18}]}}
function TY(cat){var m=S.meta;if(!m.types||typeof m.types!=="object")m.types=defTypes();var d=defTypes();Object.keys(d).forEach(function(k){if(!Array.isArray(m.types[k]))m.types[k]=d[k]});return m.types[cat]}
function tById(cat,id){return id?TY(cat).find(function(t){return t.id===id})||null:null}
function tFam(cat,t){return cat==="wall"?FAMN.wall:cat==="col"?FAMN.col:(FAMN[t.k]||t.k)}
function tName(cat,t){if(!t)return "";if(t.name)return t.name;if(cat==="col")return t.w+'" x '+t.d+'"';return t.k+" "+fi(t.w)+" x "+fi(t.h)}
function tFull(cat,t){return t?tFam(cat,t)+": "+tName(cat,t):"Custom (no type)"}
function catOf(k,e){return k==="seg"?"wall":k==="col"?"col":k==="op"?(e&&e.type!=="D"?"win":"door"):null}
function tMatch(cat,t,e){if(!t||!e)return false;if(cat==="wall")return Math.abs(wallIn(e)-t.th)<0.01;if(cat==="col")return (e.w===t.w&&e.d===t.d)||(e.w===t.d&&e.d===t.w);
 return opKind(e)===t.k&&Math.abs(e.w-t.w)<0.01&&Math.abs(opH(e)-t.h)<0.01}
function typeOf(cat,e){if(!e)return null;var id=cat==="wall"?e.wt:cat==="col"?e.ct:e.ot,t=tById(cat,id);if(t&&tMatch(cat,t,e))return t;return TY(cat).find(function(x){return tMatch(cat,x,e)})||null}
function applyType(cat,e,t){if(cat==="wall"){setWallTh(e,t.th);e.wt=t.id}else if(cat==="col"){var sw=e.w===t.d&&e.d===t.w&&t.w!==t.d;e.w=sw?t.d:t.w;e.d=sw?t.w:t.d;e.ct=t.id}
 else{var was=e.type;e.type=kType(t.k);e.dk=e.type==="D"?t.k:undefined;e.w=t.w;e.h=t.h;if(t.sill!=null)e.sill=t.sill;else if(was!==e.type)e.sill=OPSILL[e.type];e.ot=t.id}}
var CATK={wall:["seg","segs"],col:["col","cols"],door:["op","ops"],win:["op","ops"]};
/* all instances of a type on every level: [{lv,e}] */
function allInst(cat,t){var out=[];S.L.forEach(function(L,i){withLevel(i,function(){(S[CATK[cat][1]]||[]).forEach(function(e){if(catOf(CATK[cat][0],e)!==cat)return;if(typeOf(cat,e)===t)out.push({lv:i,e:e})})})});return out}
function instRefs(cat,t){var k=CATK[cat][0];return (S[CATK[cat][1]]||[]).filter(function(e){return catOf(k,e)===cat&&typeOf(cat,e)===t}).map(function(e){return {k:k,id:e.id}})}
/* type used for NEW elements */
function curType(cat){if(cat==="wall"){var th=+(UI.wth||(UI.kind==="I"?S.meta.tin:S.meta.tout)),t=tById("wall",UI.wt);if(t&&Math.abs(t.th-th)<0.01)return t;return TY("wall").find(function(x){return Math.abs(x.th-th)<0.01})||null}
 if(cat==="col"){var z=UI.colSz||[9,9],c=tById("col",UI.ct);if(c&&c.w===z[0]&&c.d===z[1])return c;return TY("col").find(function(x){return x.w===z[0]&&x.d===z[1]})||null}
 if(cat==="op")return tById("door",UI.opt)||TY("door").find(function(x){return x.k==="OP"})||null;
 if(cat==="win")return tById("win",UI.nt)||TY("win")[0];
 return tById("door",UI.dt)||TY("door").find(function(x){return x.k==="D"})||TY("door")[0]}
function pickType(key,id){var cat=key==="op"?"door":key,t=tById(cat,id);if(!t)return;
 if(key==="wall"){UI.wt=t.id;UI.wth=t.th;UI.kind=t.th>=8?"O":"I"}else if(key==="col"){UI.ct=t.id;UI.colSz=[t.w,t.d]}else if(key==="win"){UI.nt=t.id;UI.opExp=true}else if(key==="op"){UI.opt=t.id;UI.opExp=true}else{UI.dt=t.id;UI.opExp=true}
 if(cat==="door"||cat==="win")UI.lastOp=t.k;toast("Type: "+tFull(cat,t))}
/* type used by the Door/Window tool popup (null = legacy behaviour) */
function opToolType(){if(UI.tool!=="open")return null;var f=UI.opFam||"D";if(f==="W")return curType("win");if(f==="OP")return curType("op");return UI.opExp||UI.dt?curType("door"):null}
/* ---------- type selector widget ---------- */
function tselHTML(key,cur,opt){opt=opt||{};var cat=opt.cat||(key==="op"?"door":key),L=TY(cat).filter(function(t){return key==="op"?t.k==="OP":key==="door"?t.k!=="OP":true}),G={},order=[];
 L.forEach(function(t){var f=tFam(cat,t);if(!G[f]){G[f]=[];order.push(f)}G[f].push(t)});
 var h='<select class="tsel" data-ts="'+key+'" data-cat="'+cat+'" title="Type Selector">'+(cur?'':'<option value="" selected>'+(opt.none||"Custom (no type)")+'</option>');
 order.forEach(function(f){h+='<optgroup label="'+escH(f)+'">'+G[f].map(function(t){return '<option value="'+escH(t.id)+'"'+(cur&&cur.id===t.id?' selected':'')+'>'+escH(tFull(cat,t))+'</option>'}).join("")+'</optgroup>'});
 return h+'<option value="__new">+ New type…</option></select>'}
function bindTsel(root,onPick){root.querySelectorAll("[data-ts]").forEach(function(s){s.onchange=function(){var key=s.dataset.ts,cat=s.dataset.cat;
 if(s.value==="__new"){var base=key==="sel"?selType():curType(key);newTypePopup(cat,base||null,key,function(t){onPick(key,t.id)});return}onPick(key,s.value)}})}
/* selection → common category */
function selCat(){var L=selEls();if(!L.length)return null;var c=null;for(var i=0;i<L.length;i++){var e=elGet(L[i]),k=catOf(L[i].k,e);if(!k)return null;if(c&&c!==k)return null;c=k}return c}
function selType(){var c=selCat();if(!c)return undefined;var T=null;selEls().forEach(function(r,i){var t=typeOf(c,elGet(r));if(i===0)T=t;else if(T!==t)T=undefined});return T}
function setSelType(id){var c=selCat();if(!c)return;var t=tById(c,id);if(!t)return;var L=selEls().filter(function(r){return !isPinned(r)});if(!L.length){toast("Pinned - unpin first");return}snapshot();L.forEach(function(r){applyType(c,elGet(r),t)});changed();updCtx();updProps();toast(L.length+" × "+tFull(c,t))}
function selectSame(){var L=selEls();if(L.length!==1){toast("Select one wall / door / window / column first");return}var e=elGet(L[0]),c=catOf(L[0].k,e);if(!c){toast("Types: walls, doors, windows, columns");return}
 var t=typeOf(c,e),R;if(t)R=instRefs(c,t);else{var k=L[0].k;R=(S[CATK[c][1]]||[]).filter(function(x){return catOf(k,x)===c&&!typeOf(c,x)&&(c==="wall"?Math.abs(wallIn(x)-wallIn(e))<0.01:c==="col"?x.w===e.w&&x.d===e.d:opKind(x)===opKind(e)&&Math.abs(x.w-e.w)<0.01)}).map(function(x){return {k:k,id:x.id}})}
 setSel(R);toast(R.length+" instances of "+tFull(c,t)+" (this level)")}
/* ---------- Edit Type / New Type ---------- */
function newTypePopup(cat,base,key,done){var b=base||(key!=="sel"&&key!==cat&&key!=="op"?null:(key==="sel"?null:curType(key)))||TY(cat)[0],t=JSON.parse(JSON.stringify(b||{}));t.id="u"+Date.now().toString(36);t.custom=true;t.name=(tName(cat,b)||"Type")+" (custom)";editTypePopup(cat,t,done,true)}
/* Stage: Types - Edit Type */
function editTypePopup(cat,t,done,isNew){var st=JSON.parse(JSON.stringify(t)),n=isNew?0:allInst(cat,t).length,isDoor=cat==="door"||cat==="win";
 var kinds=cat==="door"?["MD","D","TD","OP"]:["W","V"];
 var f='<label class="fld">Type name<input id="etN" value="'+escH(tName(cat,st))+'"></label>';
 if(cat==="wall")f+='<label class="fld">Thickness (inch) - 4.5, 6, 8, 9 or any<input id="etT" inputmode="decimal" value="'+st.th+'"></label>';
 else if(cat==="col")f+='<div class="row"><label class="fld">Width (inch)<input id="etW" inputmode="decimal" value="'+st.w+'"></label><label class="fld">Depth (inch)<input id="etD" inputmode="decimal" value="'+st.d+'"></label></div>';
 else f+='<label class="fld">Family<select id="etK">'+kinds.map(function(k){return '<option value="'+k+'"'+(st.k===k?' selected':'')+'>'+FAMN[k]+' ('+k+')</option>'}).join("")+'</select></label><div class="row"><label class="fld">Width<input id="etW" value="'+fi(st.w)+'"></label><label class="fld">Height<input id="etH" value="'+fi(st.h)+'"></label>'+(cat==="win"?'<label class="fld">Sill<input id="etS" value="'+fi(st.sill!=null?st.sill:3)+'"></label>':'')+'</div>';
 modal('<div class="mt">'+(isNew?"New":"Edit")+' Type · '+(cat==="wall"?FAMN.wall:cat==="col"?FAMN.col:TCATN[cat])+'</div><div class="ms">'+(isNew?"Creates a new type you can pick in the Type Selector.":"Changes apply to all "+n+" instance"+(n===1?"":"s")+" on every level.")+'</div>'+f+
  '<div class="row">'+(isNew?'':'<button class="bb" id="etDup">Duplicate…</button>')+(!isNew&&t.custom&&!n?'<button class="bb del" id="etDel">Delete type</button>':'')+'</div><div class="row"><button class="bb" id="etX">Cancel</button><button class="bb ok" id="etOk">OK</button></div>',function(box){
  $("etX").onclick=closeModal;if($("etDup"))$("etDup").onclick=function(){closeModal();setTimeout(function(){newTypePopup(cat,t,cat,done)},30)};
  if($("etDel"))$("etDel").onclick=function(){snapshot();var L=TY(cat),i=L.indexOf(t);if(i>=0)L.splice(i,1);closeModal();changed();updCtx();updProps();toast("Type deleted")};
  $("etOk").onclick=function(){var nm=$("etN").value.trim(),v={};
   if(cat==="wall"){v.th=parseFloat($("etT").value);if(!(v.th>=2&&v.th<=36)){toast("Thickness 2 - 36 inch");return}}
   else if(cat==="col"){v.w=parseFloat($("etW").value);v.d=parseFloat($("etD").value);if(!(v.w>=6&&v.w<=48&&v.d>=6&&v.d<=48)){toast("Column 6 - 48 inch");return}}
   else{v.k=$("etK").value;v.w=parseFI($("etW").value);v.h=parseFI($("etH").value);if($("etS"))v.sill=parseFI($("etS").value);if(!(v.w>0.5&&v.w<=16&&v.h>0.5&&v.h<=12)){toast("Check width / height");return}}
   var dup=TY(cat).find(function(x){return x!==t&&x.id!==st.id&&tName(cat,x)===nm});if(dup&&nm){toast("A type with that name exists");return}
   snapshot();var inst=isNew?[]:allInst(cat,t);
   if(isNew){var T=Object.assign({},st,v);if(nm)T.name=nm;else delete T.name;TY(cat).push(T);t=T}
   else{Object.assign(t,v);if(nm&&nm!==tName(cat,Object.assign({},t,{name:undefined})))t.name=nm;else if(!t.custom&&cat!=="wall")delete t.name;else if(nm)t.name=nm;
    inst.forEach(function(q){withLevel(q.lv,function(){applyType(cat,q.e,t)})})}
   closeModal();changed();if(done)done(t);updCtx();updProps();toast((isNew?"New type ":"Type updated ")+tFull(cat,t)+(inst.length?" · "+inst.length+" instances":""))}})}
function editTypeFor(key){var c=key==="sel"?selCat():(key==="op"?"door":key),t=key==="sel"?selType():curType(key);if(!c)return;if(!t){newTypePopup(c,null,key,function(nt){if(key==="sel")setSelType(nt.id);else pickType(key,nt.id);updCtx()});return}
 editTypePopup(c,t,function(){updCtx()})}
/* ---------- creation hooks ---------- */
var _addCol0=addCol;addCol=function(x,y,q){var c=_addCol0(x,y,q);if(c){var t=curType("col");if(t)c.ct=t.id}return c};
/* ---------- clipboard (Copy / Paste aligned to current level) ---------- */
/* Stage: Modify - Copy to Clipboard tool */
function clipCopy(){var L=selEls().filter(function(r){return r.k!=="grid"&&r.k!=="sec"});if(!L.length){toast("Select elements, then Copy to clipboard");setTool("sel");return}
 var segs={},items=[];L.forEach(function(r){var e=elGet(r);if(!e)return;var c=JSON.parse(JSON.stringify(e));if(r.k==="seg"){var a=pt(e.a),b=pt(e.b);c._a={x:a.x,y:a.y};c._b={x:b.x,y:b.y};segs[e.id]=1}items.push({k:r.k,e:c})});
 S.ops.forEach(function(o){if(segs[o.seg]&&!L.some(function(r){return r.k==="op"&&r.id===o.id}))items.push({k:"op",e:JSON.parse(JSON.stringify(o))})});
 UI.clip={items:items,lv:S.cur};updCtx();toast(items.length+" copied · switch level and Paste (aligned)")}
/* Stage: Modify - Paste tool (aligned to the current level) */
function clipPaste(){var C=UI.clip;if(!C||!C.items.length){toast("Clipboard empty - select and Copy first");return}snapshot();var same=C.lv===S.cur,off=same?2:0,pm={},sm={},out=[];
 function P(q){var x=q.x+off,y=q.y+off,k=x.toFixed(3)+","+y.toFixed(3);if(pm[k])return pm[k];var ex=S.pts.find(function(p){return Math.abs(p.x-x)<0.01&&Math.abs(p.y-y)<0.01}),id=ex?ex.id:nid();if(!ex)S.pts.push({id:id,x:x,y:y});pm[k]=id;return id}
 function sh(c){if(!off)return;if(c.a&&c.a.x!=null){c.a.x+=off;c.a.y+=off;c.b.x+=off;c.b.y+=off}else if(c.x!=null){c.x+=off;c.y+=off}}
 C.items.forEach(function(it){if(it.k==="op")return;var c=JSON.parse(JSON.stringify(it.e)),old=c.id;c.id=nid();delete c.pin;
  if(it.k==="seg"){c.a=P(c._a);c.b=P(c._b);delete c._a;delete c._b;var ex=S.segs.find(function(s){return (s.a===c.a&&s.b===c.b)||(s.a===c.b&&s.b===c.a)});if(ex){sm[old]=ex.id;return}sm[old]=c.id}else sh(c);
  S[EK[it.k]].push(c);out.push({k:it.k,id:c.id})});
 C.items.forEach(function(it){if(it.k!=="op")return;var c=JSON.parse(JSON.stringify(it.e));if(!sm[c.seg])return;c.seg=sm[c.seg];if(S.ops.some(function(o){return o.seg===c.seg&&Math.abs(o.t-c.t)<0.02}))return;c.id=nid();delete c.pin;S.ops.push(c);out.push({k:"op",id:c.id})});
 planarize();changed();UI.tool="sel";setSel(out);markRail();toast(out.length+" pasted"+(same?" (offset 2' on same level)":" aligned on "+curLv().name))}
/* ---------- Measure (tap 2 points / drag) ---------- */
LINE2.meas=1;
var _commit0=commitLine;commitLine=function(t,a,b){if(t!=="meas")return _commit0(t,a,b);var L=Math.hypot(b.x-a.x,b.y-a.y);UI.lp={a:{x:a.x,y:a.y},b:{x:b.x,y:b.y}};UI.meas={L:L,dx:Math.abs(b.x-a.x),dy:Math.abs(b.y-a.y)};
 showHud(fi(L));setTimeout(hideHud,2200);toast("Distance "+fi(L)+"  ·  ΔX "+fi(UI.meas.dx)+"  ·  ΔY "+fi(UI.meas.dy));updCtx();render()};
/* ---------- Room & Area, Tags ---------- */
/* Stage: Room & Area - Area tool */
function areaPopup(){var rows="",tot=0;S.L.forEach(function(L,i){withLevel(i,function(){if(!S.segs.length)return;var R=roomsInfo();rows+='<tr><td colspan="3" style="padding-top:8px"><b>'+esc(L.name)+'</b> · built-up '+sq(R.plinth)+' sq.ft · carpet '+sq(R.carpet)+'</td></tr>';tot+=R.plinth;
  S.labels.forEach(function(l){var f=LABF[l.id];if(f)rows+='<tr><td>'+esc(l.name)+'</td><td>'+sizeText(f)+'</td><td style="text-align:right">'+sq(f.carpet)+'</td></tr>'})})});
 modal('<div class="mt">Room & Area</div><div class="ms">Room areas (clear / carpet) per level · total built-up '+sq(tot)+' sq.ft ('+sq(tot*0.092903)+' sq.m)</div><div style="max-height:52vh;overflow:auto"><table style="width:100%;border-collapse:collapse;font-size:13px">'+rows+'</table></div><div class="row"><button class="bb ok" id="arOk">Done</button></div>',function(){$("arOk").onclick=closeModal})}
/* Stage: Annotate - Tag tool */
function tagPopup(){var c={};S.ops.forEach(function(o){var k=opKind(o);c[k]=(c[k]||0)+1});var v=S.meta.vis||{};
 modal('<div class="mt">Tags</div><div class="ms">Doors / windows are tagged automatically (D1, W1…) in sheets and schedules. Room tags: tap a room with Room Tag.</div><div class="grid2">'+OK5.filter(function(k){return c[k]}).map(function(k){return '<div class="bb" style="display:flex;flex-direction:column;justify-content:center"><b>'+k+' × '+c[k]+'</b><small>'+OKN[k]+'</small></div>'}).join("")+'</div>'+
  '<div class="row"><button class="bb'+(v.rooms!==false?' on':'')+'" id="tgR">Room tags: '+(v.rooms!==false?"shown":"hidden")+'</button><button class="bb'+(v.doors!==false?' on':'')+'" id="tgD">Door / window tags: '+(v.doors!==false?"shown":"hidden")+'</button></div><div class="row"><button class="bb ok" id="tgOk">Done</button></div>',function(){
  function tg(k){S.meta.vis=S.meta.vis||{};if(S.meta.vis[k]===false)delete S.meta.vis[k];else S.meta.vis[k]=false;closeModal();changed();tagPopup()}
  $("tgR").onclick=function(){tg("rooms")};$("tgD").onclick=function(){tg("doors")};$("tgOk").onclick=closeModal})}
/* ---------- Foundation: isolated footings under columns (lowest level) ---------- */
function ftgCfg(){var f=S.meta.ftg||{};return {on:!!f.on,w:+f.w||4,l:+f.l||4,dep:+f.dep||5}}
/* Stage: Foundation - Isolated Footing tool */
function footingPopup(){var f=ftgCfg();modal('<div class="mt">Foundation · Isolated footings</div><div class="ms">Footing under every column of the ground level (dashed in plan, layer FOOTINGS). '+S.L[0].cols.length+' columns on ground.</div>'+
 '<div class="row"><label class="fld">Width<input id="fgW" value="'+fi(f.w)+'"></label><label class="fld">Length<input id="fgL" value="'+fi(f.l)+'"></label><label class="fld">Depth below GL<input id="fgD" value="'+fi(f.dep)+'"></label></div>'+
 '<div class="row"><button class="bb'+(f.on?' on':'')+'" id="fgOn">Footings: '+(f.on?"ON":"OFF")+'</button><button class="bb" id="fgC">Auto columns at corners</button></div><div class="row"><button class="bb" id="fgX">Cancel</button><button class="bb ok" id="fgOk">OK</button></div>',function(){
 var on=f.on;$("fgOn").onclick=function(){on=!on;this.classList.toggle("on",on);this.textContent="Footings: "+(on?"ON":"OFF")};$("fgX").onclick=closeModal;
 $("fgC").onclick=function(){closeModal();withLevel(0,function(){autoCols()});changed()};
 $("fgOk").onclick=function(){var w=parseFI($("fgW").value),l=parseFI($("fgL").value),d=parseFI($("fgD").value);if(!(w>=1.5&&w<=15&&l>=1.5&&l<=15&&d>=1&&d<=20)){toast("Check sizes");return}snapshot();S.meta.ftg={on:on,w:w,l:l,dep:d};closeModal();changed();toast(on?"Footings "+fi(w)+" x "+fi(l)+" under "+S.L[0].cols.length+" columns":"Footings off")}})}
function ftgRects(){var f=ftgCfg();if(!f.on||S.cur!==0)return [];return S.cols.map(function(c){var a=(c.rot||0)*Math.PI/180,cs=Math.cos(a),sn=Math.sin(a),w=f.w/2,l=f.l/2;return [[-w,-l],[w,-l],[w,l],[-w,l]].map(function(p){return {x:c.x+p[0]*cs-p[1]*sn,y:c.y+p[0]*sn+p[1]*cs}})})}
var _dsc0=drawStructCanvas;drawStructCanvas=function(){if(visOn("cols"))ftgRects().forEach(function(P){g.beginPath();P.forEach(function(p,i){var q=W2(p);i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y)});g.closePath();g.strokeStyle="#64748b";g.lineWidth=1.2;g.setLineDash([7,4]);g.stroke();g.setLineDash([])});return _dsc0.apply(this,arguments)};
var _pex0=planExtras;planExtras=function(d,R,k){if(visOn("cols"))ftgRects().forEach(function(P){d.poly(P.map(function(p){return R(p.x,p.y)}),{w:0.18,c:"#555555",dash:[1.5,0.9],L:"FOOTINGS"})});return _pex0.apply(this,arguments)};
