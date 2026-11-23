/* ===== v1.5 Room types + room furniture palette ===== */
["Lawn Area"].forEach(function(r){if(ROOMS.indexOf(r)<0)ROOMS.push(r)});if(ROOMS.indexOf("Utility")<0)ROOMS.push("Utility");TAM["Lawn Area"]="புல்வெளி";TAM["Utility"]=TAM["Utility"]||"யூட்டிலிட்டி";
Object.assign(FURN,{wmach:{n:"Washing machine",cat:"Utility",w:2,d:2,h:3},usink:{n:"Utility sink",cat:"Utility",w:2,d:1.5,h:2.8},ushelf:{n:"Storage shelf",cat:"Utility",w:3,d:1.25,h:6},
 plant:{n:"Plant / tree",cat:"Lawn",w:2,d:2,h:4},bench:{n:"Garden bench",cat:"Lawn",w:4,d:1.5,h:2.6},gseat:{n:"Garden table + 2 chairs",cat:"Lawn",w:4,d:3,h:2.5},swing:{n:"Swing",cat:"Lawn",w:5,d:3,h:7}});
if(!FCATS.some(function(c){return c[0]==="Utility"}))FCATS.push(["Utility","யூட்டிலிட்டி"],["Lawn","புல்வெளி"]);
var _fs15=furnSym;furnSym=function(type,w,d,f){var L=-w/2,R=w/2,B=-d/2,F=d/2,P=[];function r(x0,y0,x1,y1,o){P.push({t:"r",x0:x0,y0:y0,x1:x1,y1:y1,o:o||{}})}function c(cx,cy,rr,o){var pts=[];for(var i=0;i<24;i++){var a=i/24*Math.PI*2;pts.push([cx+rr*Math.cos(a),cy+rr*Math.sin(a)])}P.push({t:"p",pts:pts,closed:true,o:o||{}})}function l(x0,y0,x1,y1){P.push({t:"l",x0:x0,y0:y0,x1:x1,y1:y1,o:{}})}
 if(type==="wmach"){r(L,B,R,F);c(0,0.1,Math.min(w,d)*0.32);c(0,0.1,Math.min(w,d)*0.2);return P}
 if(type==="usink"){r(L,B,R,F);r(L+0.2,B+0.2,R-0.2,F-0.2,{fill:4});c(0,0,0.08);return P}
 if(type==="ushelf"){r(L,B,R,F);l(L,0,R,0);return P}
 if(type==="plant"){var m=Math.min(w,d)/2;c(0,0,m);c(0,0,m*0.55);for(var i=0;i<6;i++){var a=i*Math.PI/3;l(0,0,Math.cos(a)*m,Math.sin(a)*m)}return P}
 if(type==="bench"){r(L,B,R,F);l(L,B+d*0.3,R,B+d*0.3);return P}
 if(type==="gseat"){c(0,0,0.9);r(L,-0.6,L+0.9,0.6);r(R-0.9,-0.6,R,0.6);return P}
 if(type==="swing"){r(L,B,R,F);r(L+0.8,-0.6,R-0.8,0.6,{fill:4});return P}
 return _fs15.apply(this,arguments)};
var RFC={Bedroom:["dbed","sbed","wardrobe","sidetable"],Hall:["sofaset","sofa3","sofa1","ctable","tvunit","dining4"],Dining:["dining4","dining6"],Kitchen:["counterL","counterS","fridge","cyl"],Toilet:["wcw","wci","basin","shower","bucket"],Pooja:["pooja"],Utility:["wmach","usink","ushelf"],Lawn:["plant","bench","gseat","swing"],Sit:["sofa1","plant","bench"],Portico:["plant"]};
function roomCat(n){n=String(n||"").toLowerCase();if(/bed/.test(n))return "Bedroom";if(/hall|living/.test(n))return "Hall";if(/dining/.test(n))return "Dining";if(/kitchen/.test(n))return "Kitchen";if(/toilet|bath|wc/.test(n))return "Toilet";if(/pooja/.test(n))return "Pooja";if(/utility|wash/.test(n))return "Utility";if(/lawn|garden/.test(n))return "Lawn";if(/sit/.test(n))return "Sit";if(/portico|parking/.test(n))return "Portico";return null}
function furnPalette(x,y,name){var cat=roomCat(name),list=cat?RFC[cat]:Object.keys(FURN).filter(function(k){return !FURN[k].km}).slice(0,12);
 return '<div class="ms" style="margin-top:8px"><b>Furniture for '+esc(name||"this room")+'</b> - tap to place</div><div class="grid2" id="rfPal">'+list.filter(function(k){return FURN[k]}).map(function(k){return '<button class="bb" data-fk="'+k+'">'+svgI("sofa")+esc(FURN[k].n)+'<small>'+fsz(FURN[k].w)+' x '+fsz(FURN[k].d)+'</small></button>'}).join("")+'</div>'}
var _rp15=roomPopup;roomPopup=function(x,y,lab){_rp15.apply(this,arguments);try{var box=$("mbox"),row=box.querySelector(".row:last-child");if(!row)return;var f=faceAt(x,y),cx=f?f.cx:x,cy=f?f.cy:y;row.insertAdjacentHTML("beforebegin",furnPalette(x,y,lab&&lab.name));
 box.querySelectorAll("[data-fk]").forEach(function(b){b.onclick=function(){closeModal();addFurn(b.dataset.fk,cx,cy);changed();toast(FURN[b.dataset.fk].n+" placed - use Furniture tool to drag / rotate")}})}catch(e){console.warn(e)}};
