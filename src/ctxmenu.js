/* Stage: Modify - Select tool: quick-action context menu. Opens at the exact tap / click point on a selected object
   (only with the Select tool; never while drawing). Every button calls the same function as the toolbar / option bar. */
var CXM={el:null,down:null,ptrs:{}};
function cxmClose(){if(CXM.el){CXM.el.remove();CXM.el=null}}
function cxmItems(L){var A=[],one=L.length===1?L[0]:null,e=one?elGet(one):null,k=one?one.k:null;
 function add(id,icon,label,fn){A.push({id:id,icon:icon,label:label,fn:fn})}
 add("move","mv","Move",function(){ctxAction("xmove")});add("copy","copy","Copy",function(){ctxAction("xcopy")});
 add("rotate","rotate","Rotate",function(){ctxAction("xrot")});add("mirror","mirror","Mirror",function(){ctxAction("xmir")});
 if(k==="seg"&&e&&typeof sizePopup==="function")add("len","size","Length",function(){sizePopup(e)});
 if(k==="op"&&e&&e.type==="D")add("flip","mirror","Flip",function(){snapshot();e.flip=!e.flip;changed();updProps();toast("Door swing flipped")});
 if(k==="lab"&&e)add("rename","text","Rename",function(){roomPopup(e.x,e.y,e)});
 if(k==="dim"&&e&&typeof dimValuePopup==="function")add("dimval","dim","Value",function(){dimValuePopup(e)});
 if(k==="note"&&e&&typeof notePopup==="function")add("edit","edit","Edit",function(){notePopup(e)});
 if(k==="furn"&&e&&typeof furnSizePopup==="function")add("size","fsize","Edit size",function(){furnSizePopup(e)});
 if(k==="kc"&&e&&typeof kcPopup==="function")add("edit","edit","Edit counter",function(){kcPopup(e)});
 if(k==="stair"&&e&&typeof stairEditPopup==="function")add("edit","edit","Edit stair",function(){stairEditPopup(e)});
 if(typeof selCat==="function"&&selCat())add("type","match","Edit Type",function(){editTypeFor("sel")});
 add("props","props","Props",function(){if(!UI.props)propsOpen(true);else updProps()});
 add("pin","pin",(L.every(isPinned)?"Unpin":"Pin"),function(){ctxAction("xpin")});
 add("delete","del","Delete",function(){ctxAction("xdel")});
 return A}
function cxmName(r){var e=elGet(r);if(r.k==="op"&&e)return e.type==="W"?"Window":e.type==="V"?"Ventilator":(e.dk==="OP"?"Opening":"Door");if(r.k==="lab"&&e)return (isStair(e.name)?"Stair":"Room")+" · "+e.name;return (typeof EKN!=="undefined"&&EKN[r.k])||r.k}
function cxmOpen(cx,cy){cxmClose();var L=selEls();if(!L.length)return;var items=cxmItems(L);var d=document.createElement("div");d.id="cxm";d.setAttribute("role","menu");
 var one=L.length===1?L[0]:null;d.innerHTML='<div class="cxh">'+esc(one?cxmName(one):(L.length+" selected"))+'</div><div class="cxb">'+items.map(function(it){return '<button class="cxi'+(it.id==="delete"?" del":"")+'" data-cx="'+it.id+'" title="'+escH(it.label)+'">'+svgI(it.icon)+'<span>'+esc(it.label)+'</span></button>'}).join("")+'</div>';
 document.body.appendChild(d);CXM.el=d;
 d.addEventListener("pointerdown",function(e){e.stopPropagation()});
 items.forEach(function(it){d.querySelector('[data-cx="'+it.id+'"]').onclick=function(e){e.stopPropagation();cxmClose();it.fn()}});
 /* anchor the top-left corner at the tap point; shift only as much as needed to stay on screen */
 var w=d.offsetWidth,h=d.offsetHeight,vw=window.innerWidth,vh=window.innerHeight,m=4,x=cx,y=cy;
 /* one menu corner always sits on the tap point; pick the first corner whose menu does not cover a value label (inner length / clear distance) */
 var cr=$("cv").getBoundingClientRect(),H=(UI.tdHits||[]).map(function(b){return {l:cr.left+b.x-b.w/2-3,r:cr.left+b.x+b.w/2+3,t:cr.top+b.y-b.h/2-3,b:cr.top+b.y+b.h/2+3}});
 function fit(px,py){if(px+w>vw-m)px=Math.max(m,vw-m-w);if(py+h>vh-m)py=Math.max(m,vh-m-h);if(px<m)px=m;if(py<m)py=m;return {x:px,y:py}}
 function hits(P){return H.some(function(B){return P.x<B.r&&P.x+w>B.l&&P.y<B.b&&P.y+h>B.t})}
 var C=[fit(cx,cy),fit(cx-w,cy),fit(cx,cy-h),fit(cx-w,cy-h)],P=C[0];for(var ci=0;ci<C.length;ci++){if(!hits(C[ci])){P=C[ci];break}}x=P.x;y=P.y;d.style.left=x+"px";d.style.top=y+"px";CXM.pos={x:x,y:y,tapX:cx,tapY:cy}}
function cxmInit(){var c=$("cv");if(!c||c.__cxm)return;c.__cxm=1;
 c.addEventListener("pointerdown",function(e){if(e.isPrimary)CXM.ptrs={};CXM.ptrs[e.pointerId]=1;if(Object.keys(CXM.ptrs).length===1)CXM.down={x:e.clientX,y:e.clientY,t:Date.now(),multi:false};else if(CXM.down)CXM.down.multi=true;cxmClose()});
 c.addEventListener("pointermove",function(e){if(CXM.down&&Math.hypot(e.clientX-CXM.down.x,e.clientY-CXM.down.y)>6)CXM.down.moved=true});
 function up(e){delete CXM.ptrs[e.pointerId];var D=CXM.down;if(Object.keys(CXM.ptrs).length)return;CXM.down=null;
  if(!D||D.multi||D.moved||Date.now()-D.t>700||e.type==="pointercancel")return;
  if(UI.tool!=="sel"||UI.pick||UI.clean||(window.V3&&V3.on))return;var cx=e.clientX,cy=e.clientY;
  setTimeout(function(){if($("modal").classList.contains("show"))return;var r=c.getBoundingClientRect(),w=s2w(cx-r.left,cy-r.top),h=hitOne(w);
   if(!h||!selHas(h.k,h.id))return;cxmOpen(cx,cy)},0)}
 c.addEventListener("pointerup",up);c.addEventListener("pointercancel",up);
 c.addEventListener("wheel",cxmClose,{passive:true});window.addEventListener("resize",cxmClose);
 document.addEventListener("pointerdown",function(e){if(CXM.el&&!CXM.el.contains(e.target))cxmClose()},true);
 document.addEventListener("keydown",function(e){if(e.key==="Escape")cxmClose()},true);
 if(typeof setTool==="function"&&!setTool.__cxm){var _st=setTool;setTool=function(){cxmClose();return _st.apply(this,arguments)};setTool.__cxm=1}
 if(window.JKS&&JKS.setTool&&!JKS.setTool.__cxm){var _jt=JKS.setTool;JKS.setTool=function(){cxmClose();return _jt.apply(this,arguments)};JKS.setTool.__cxm=1}
 setInterval(function(){if(CXM.el&&(UI.tool!=="sel"||!selEls().length||(window.V3&&V3.on)))cxmClose()},250);
 if(typeof open3D==="function"){var _o3=open3D;open3D=function(){cxmClose();return _o3.apply(this,arguments)}}}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",cxmInit);else setTimeout(cxmInit,0);
