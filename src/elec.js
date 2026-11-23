/* ===== v1.5 Electrical points (Ceiling light tool) ===== */
var ELT=[["light","Ceiling light"],["fan","Ceiling fan"],["wlight","Wall light"],["tube","Tube light"],["sw","Light switch"],["fsw","Fan regulator / switch"],["sb","Switch board"],["s5","5A socket"],["s15","15A power socket"],["ac","AC point"],["tv","TV / data point"],["exh","Exhaust fan"],["db","DB board"]];
function elName(t){var r=ELT.find(function(e){return e[0]===t});return r?r[1]:t}
/* symbol as primitives in a unit box (size r) - used by canvas and sheet */
function elPrims(t,r){var P=[];function c(x,y,rr,f){P.push({k:"c",x:x,y:y,r:rr,f:f})}function l(x1,y1,x2,y2){P.push({k:"l",a:[x1,y1],b:[x2,y2]})}function tx(s){P.push({k:"t",s:s})}
 if(t==="light"){c(0,0,r);l(-r*0.7,-r*0.7,r*0.7,r*0.7);l(-r*0.7,r*0.7,r*0.7,-r*0.7)}
 else if(t==="fan"){c(0,0,r*0.25,1);for(var i=0;i<3;i++){var a=i*Math.PI*2/3;l(0,0,Math.cos(a)*r,Math.sin(a)*r)}c(0,0,r)}
 else if(t==="wlight"){c(0,0,r*0.6);l(-r,r*0.6,r,r*0.6)}
 else if(t==="tube"){l(-r*1.3,0,r*1.3,0);l(-r*1.3,-r*0.3,-r*1.3,r*0.3);l(r*1.3,-r*0.3,r*1.3,r*0.3)}
 else if(t==="sw"){c(0,0,r*0.3,1);l(0,0,r*0.8,-r*0.8);l(r*0.8,-r*0.8,r*1.1,-r*0.5)}
 else if(t==="fsw"){c(0,0,r*0.3,1);l(0,0,r*0.8,-r*0.8);tx("F")}
 else if(t==="sb"){P.push({k:"r",w:r*1.6,h:r});tx("SB")}
 else if(t==="s5"){P.push({k:"r",w:r*1.4,h:r*1.1});tx("5A")}
 else if(t==="s15"){P.push({k:"r",w:r*1.6,h:r*1.2,f:1});tx("15")}
 else if(t==="ac"){P.push({k:"r",w:r*1.8,h:r});tx("AC")}
 else if(t==="tv"){P.push({k:"r",w:r*1.6,h:r});tx("TV")}
 else if(t==="exh"){c(0,0,r);P.push({k:"r",w:r*1.2,h:r*1.2});tx("EF")}
 else if(t==="db"){P.push({k:"r",w:r*2,h:r*1.2,f:1});tx("DB")}
 return P}
var ELC="#b45309";
function drawElecCanvas(){if(!visOn("elec")||UI.clean)return;(S.elec||[]).forEach(function(e){var q=w2s(e.x,e.y),r=Math.max(7,0.5*V.s);g.save();g.translate(q.x,q.y);g.strokeStyle=e.id===UI.elSel?"#2563eb":ELC;g.fillStyle=g.strokeStyle;g.lineWidth=1.6;
 elPrims(e.t,r).forEach(function(p){if(p.k==="c"){g.beginPath();g.arc(p.x,p.y,p.r,0,7);p.f?g.fill():g.stroke()}else if(p.k==="l"){g.beginPath();g.moveTo(p.a[0],p.a[1]);g.lineTo(p.b[0],p.b[1]);g.stroke()}else if(p.k==="r"){if(p.f){g.globalAlpha=0.25;g.fillRect(-p.w/2,-p.h/2,p.w,p.h);g.globalAlpha=1}g.strokeRect(-p.w/2,-p.h/2,p.w,p.h)}else if(p.k==="t"){g.font="bold "+Math.round(r*0.75)+"px Roboto,Arial";g.textAlign="center";g.textBaseline="middle";g.fillText(p.s,0,0)}});g.restore()})}
function elSheetSym(d,x,y,t,r){elPrims(t,r).forEach(function(p){if(p.k==="c")d.poly(circ(x+p.x,y+p.y,p.r,16),{w:0.2,c:ELC,fill:p.f?ELC:undefined,L:"ANNO"});else if(p.k==="l")d.line(x+p.a[0],y+p.a[1],x+p.b[0],y+p.b[1],{w:0.2,c:ELC,L:"ANNO"});else if(p.k==="r")d.rect(x-p.w/2,y-p.h/2,p.w,p.h,{w:0.2,c:ELC,fill:p.f?"#fde68a":undefined,L:"ANNO"});else if(p.k==="t")d.text(x,y,p.s,r*0.62,{a:"middle",v:"mid",bold:true,c:ELC,L:"ANNO"})})}
var _dsc15e=drawStructCanvas;drawStructCanvas=function(){_dsc15e.apply(this,arguments);try{drawElecCanvas()}catch(e){console.warn(e)}};
function elAt(w){var R=Math.max(0.8,12/V.s),best=null;(S.elec||[]).forEach(function(e){var d=Math.hypot(e.x-w.x,e.y-w.y);if(d<R){R=d;best=e}});return best}
var _tt15e=toolTap;toolTap=function(w){if(UI.tool==="elec"){var h=elAt(w);if(h){UI.elSel=h.id;elPopup(h);return true}snapshot();var e={id:nid(),x:Math.round(w.x*4)/4,y:Math.round(w.y*4)/4,t:UI.elT||"light"};lvArr("elec").push(e);UI.elSel=e.id;changed();toast(elName(e.t)+" placed - drag to move, tap to change");return true}return _tt15e.apply(this,arguments)};
var _td15e=toolDown;toolDown=function(w,G){if(UI.tool==="elec"){var h=elAt(w);if(h){G.kind="dragel";G.eid=h.id;G.snap=false;return true}}return _td15e.apply(this,arguments)};
var _tm15e=toolMove;toolMove=function(w,G,p){if(G.kind==="dragel"){if(G.moved){if(!G.snap){snapshot();G.snap=true}var e=(S.elec||[]).find(function(x){return x.id===G.eid});if(e){e.x=Math.round(w.x*4)/4;e.y=Math.round(w.y*4)/4;SHEET=null;render()}}return true}return _tm15e.apply(this,arguments)};
var _tu15e=toolUp;toolUp=function(G,w){if(G.kind==="dragel"){if(G.snap)changed();else{var e=(S.elec||[]).find(function(x){return x.id===G.eid});if(e){UI.elSel=e.id;elPopup(e)}}return true}return _tu15e.apply(this,arguments)};
function elPopup(e){modal('<div class="mt">Electrical point</div><div class="grid2">'+ELT.map(function(t){return '<button class="bb'+(t[0]===e.t?" ok":"")+'" data-el="'+t[0]+'">'+esc(t[1])+'</button>'}).join("")+'</div><div class="row"><button class="bb del" id="elDel">Delete</button><button class="bb" id="elX">Close</button></div>',function(b){
 b.querySelectorAll("[data-el]").forEach(function(x){x.onclick=function(){snapshot();e.t=x.dataset.el;closeModal();changed()}});$("elX").onclick=closeModal;$("elDel").onclick=function(){snapshot();S.elec=S.elec.filter(function(x){return x!==e});closeModal();changed()}})}
/* sheet */
function sh_elec(sh,lab,RI){var lv=sh.slv,d=stFrame(),U=stSetup(d,lv,[PX,PY,PW,PH],{elec:true,mg:12}),R=U.R,cnt={};stWalls(d,R,lv,{fill:"#e5e7eb"});
 var RIl=withLevel(lv,roomsInfo);RIl.faces.forEach(function(f){if(f.labels[0]){var c=R(f.cx,f.cy);d.text(c[0],c[1],f.labels[0].name,2,{a:"middle",c:"#64748b"})}});
 S.L[lv].elec.forEach(function(e){var p=R(e.x,e.y);elSheetSym(d,p[0],p[1],e.t,1.8);cnt[e.t]=(cnt[e.t]||0)+1});
 var rows=ELT.filter(function(t){return cnt[t[0]]}).map(function(t){return ["",t[1],cnt[t[0]]]}),y0=PY+12;rows.push({0:"",1:"TOTAL POINTS",2:S.L[lv].elec.length,bold:true});
 var y=table(d,TX,y0,[["Symbol",16],["Point",46],["Nos",16]],rows,{title:"ELECTRICAL LEGEND",rh:6});
 ELT.filter(function(t){return cnt[t[0]]}).forEach(function(t,i){elSheetSym(d,TX+8,y0+6+i*6+3,t[0],1.6)});
 stNote(d,TX,y+6,TW,"NOTES",["Point positions are approximate; switch boards at 4'-0\" from floor, sockets at 1'-0\" unless noted.","All wiring in concealed PVC conduit.","Confirm DB location and load with the electrician."]);stDone(d,sh,lab,RI,U.N,S.L[lv].name+" Electrical Layout")}
STB.elec=sh_elec;
