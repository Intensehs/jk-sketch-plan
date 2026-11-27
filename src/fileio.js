/* Stage: File - Save File / Open File (.jksp project file = the full drawing as JSON: every level, walls, doors, windows,
   rooms, dims, text, types and settings). Save uses the File System Access picker where the browser has it (repeat saves
   overwrite the same file), else a normal download. Open restores the drawing; Recent files keeps the last few in this browser. */
var FIO={handle:null,hname:"",sig:null,MAXR:6};
function fioSig(){try{return JSON.stringify(S)}catch(e){return ""}}
function fioEmpty(){return !S.L.some(function(L){return LVK.some(function(k){return L[k]&&L[k].length})})}
function fioDate(){var d=new Date();return String(d.getDate()).padStart(2,"0")+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+d.getFullYear()}
function fioName(){var n=(S.meta.proj||S.meta.name||APP).replace(/[\\/:*?"<>|]+/g," ").replace(/\s+/g," ").trim().slice(0,60)||APP;
 n=n.replace(/\s*\d{1,2}-\d{1,2}-\d{4}(\s+\d{1,2}:\d{2})?$/,"").trim()||APP;return n+" "+fioDate()+".jksp"}
function fioPack(){return {format:"jksp",app:APP,version:1,saved:new Date().toISOString(),id:CURID||null,doc:JSON.parse(JSON.stringify(S))}}
function fioText(){return JSON.stringify(fioPack())}
/* recent files: index jksp_recent [{k,name,t}] + data jksp_rf_<k> */
function fioRecent(){return LS.get("jksp_recent",[])}
function fioRemember(name,text){try{var L=fioRecent().filter(function(e){return e.name!==name}),k="r"+Date.now().toString(36);
  localStorage.setItem("jksp_rf_"+k,text);L.unshift({k:k,name:name,t:Date.now()});
  L.slice(FIO.MAXR).forEach(function(e){try{localStorage.removeItem("jksp_rf_"+e.k)}catch(x){}});localStorage.setItem("jksp_recent",JSON.stringify(L.slice(0,FIO.MAXR)))}catch(e){}}
function fioDone(name,how){FIO.sig=fioSig();FIO.hname=name;toast(how+" "+name)}
async function fileSave(asNew){autosave();var text=fioText(),blob=new Blob([text],{type:"application/json"});
 if(window.showSaveFilePicker&&!window.Android){try{var h=(!asNew&&FIO.handle)?FIO.handle:await window.showSaveFilePicker({suggestedName:fioName(),types:[{description:APP+" file",accept:{"application/json":[".jksp"]}}]});
   if(h.requestPermission){var p=await h.requestPermission({mode:"readwrite"});if(p!=="granted")throw new Error("permission")}
   var w=await h.createWritable();await w.write(blob);await w.close();FIO.handle=h;fioRemember(h.name,text);fioDone(h.name,"Saved");updFileBadge();return h.name}
  catch(e){if(e&&e.name==="AbortError")return null;/* fall back to a download */}}
 var name=fioName();saveFile(name,blob,"application/json");fioRemember(name,text);FIO.sig=fioSig();FIO.hname=name;updFileBadge();return name}
/* parse + validate a project file; throws a friendly Error, never touches the current drawing */
function fioParse(text){var o;try{o=JSON.parse(text)}catch(e){throw new Error("This file is not a "+APP+" file (it could not be read).")}
 var d=o&&o.format==="jksp"?o.doc:o;if(!d||typeof d!=="object"||Array.isArray(d))throw new Error("This file does not contain a drawing.");
 var ok=Array.isArray(d.L)?d.L.every(function(L){return L&&Array.isArray(L.pts)&&Array.isArray(L.segs)}):(Array.isArray(d.pts)&&Array.isArray(d.segs));
 if(!ok)throw new Error("This file does not contain a "+APP+" drawing.");
 var D=JSON.parse(JSON.stringify(d));D.meta=Object.assign(blank().meta,D.meta||{});D=docify(D);if(!(D.nid>0))D.nid=1;
 var mx=0;D.L.forEach(function(L){LVK.forEach(function(k){(L[k]||[]).forEach(function(x){if(x&&x.id>mx)mx=x.id})})});if(D.nid<=mx)D.nid=mx+1;
 return D}
function fioConfirm(){if(fioEmpty())return true;if(FIO.sig&&FIO.sig===fioSig())return true;
 return confirm("Open this file and replace the drawing on screen?\n\nThe current drawing is not saved to a file. It stays in Menu > My drawings (saved in this browser).")}
function fioLoad(text,name,handle){var D;try{D=fioParse(text)}catch(e){fioError(e.message,name);return false}
 if(!fioConfirm())return false;autosave();S=D;S.furn=S.furn||[];CURID="d"+Date.now().toString(36);UNDO=[];REDO=[];UI.chain=null;UI.chainFree=null;UI.sel=[];
 if(typeof setClean==="function")setClean(false);fitAll();changed();DIRTY=true;autosave();updTitle();FIO.handle=handle||null;fioRemember(name,text);fioDone(name,"Opened");updFileBadge();return true}
function fioError(msg,name){modal('<div class="mt">Could not open file</div><div class="ms">'+esc(name||"")+'</div><p style="font-size:15px;line-height:1.45">'+esc(msg)+'<br>Your current drawing was not changed.</p><div class="row"><button class="bb ok" id="feOk">OK</button></div>',function(){$("feOk").onclick=closeModal})}
async function fileOpen(){if(window.showOpenFilePicker&&!window.Android){try{var hs=await window.showOpenFilePicker({multiple:false,types:[{description:APP+" file",accept:{"application/json":[".jksp",".json"]}}]});
   var h=hs[0],f=await h.getFile();closeModal();fioLoad(await f.text(),f.name,h);return}catch(e){if(e&&e.name==="AbortError")return}}
 var inp=document.createElement("input");inp.type="file";inp.accept=".jksp,.json,application/json";inp.style.display="none";document.body.appendChild(inp);
 inp.onchange=function(){var f=inp.files&&inp.files[0];inp.remove();if(!f)return;var r=new FileReader();r.onload=function(){closeModal();fioLoad(String(r.result),f.name,null)};r.onerror=function(){fioError("The file could not be read.",f.name)};r.readAsText(f)};inp.click()}
function fioOpenRecent(k){var e=fioRecent().find(function(x){return x.k===k}),t=null;try{t=localStorage.getItem("jksp_rf_"+k)}catch(x){}
 if(!e||!t){fioError("This recent file is no longer stored in the browser. Use Open File to pick it again.",e&&e.name);return}closeModal();fioLoad(t,e.name,null)}
function updFileBadge(){var b=$("bSave");if(b)b.title=FIO.hname?("Save File ("+FIO.hname+") · Ctrl+S"):"Save File · Ctrl+S"}
/* File popup: Save / Save As / Open / Recent files */
function filePopup(){var R=fioRecent(),canPick=!!window.showSaveFilePicker&&!window.Android;
 modal('<div class="mt">File</div><div class="ms">'+(FIO.hname?"Current file: <b>"+esc(FIO.hname)+"</b>":"Save the whole drawing (all floors) as a .jksp file, open it again later.")+'</div>'+
  '<div class="grid2"><button class="bb ok" id="fiSave">Save File<small>'+(FIO.handle?"overwrite "+esc(FIO.hname):canPick?"choose where to save":"download .jksp")+'</small></button>'+
  (canPick&&FIO.handle?'<button class="bb" id="fiSaveAs">Save As…<small>new file</small></button>':'')+
  '<button class="bb pri" id="fiOpen">Open File<small>.jksp / .json</small></button></div>'+
  '<div class="ms" style="margin-top:10px"><b>Recent files</b> (kept in this browser)</div>'+
  (R.length?R.map(function(e){return '<div class="file"><div><b>'+esc(e.name)+'</b><small>'+new Date(e.t).toLocaleString("en-GB")+'</small></div><button class="bb pri" data-rf="'+e.k+'">Open</button></div>'}).join(""):'<p class="ms">No recent files yet.</p>')+
  '<div class="row"><button class="bb" id="fiX">Close</button></div>',function(box){
  $("fiSave").onclick=function(){closeModal();fileSave(false)};if($("fiSaveAs"))$("fiSaveAs").onclick=function(){closeModal();fileSave(true)};
  $("fiOpen").onclick=function(){fileOpen()};$("fiX").onclick=closeModal;
  box.querySelectorAll("[data-rf]").forEach(function(b){b.onclick=function(){fioOpenRecent(b.dataset.rf)}})})}
function fioInit(){var s=$("bSave"),o=$("bOpen");if(s)s.onclick=function(){fileSave(false)};if(o)o.onclick=filePopup;updFileBadge();
 document.addEventListener("keydown",function(e){if(!(e.ctrlKey||e.metaKey)||e.altKey)return;var k=(e.key||"").toLowerCase();if(k!=="s"&&k!=="o")return;
  if(window.V3&&V3.on)return;e.preventDefault();if(k==="s")fileSave(e.shiftKey);else filePopup()},true);
 if(typeof railAction==="function"&&!railAction.__fio){var _ra=railAction;railAction=function(a){if(a==="fsave"){fileSave(false);return}if(a==="fopen"){filePopup();return}return _ra.apply(this,arguments)};railAction.__fio=1}
 FIO.sig=null}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",function(){setTimeout(fioInit,0)});else setTimeout(fioInit,0);
