/* ===== v2.1.6 Elevation element library: frames, balcony, louvers, cladding, lights, porch, gate ===== */
Object.assign(ICO,{
 eel:'<rect x="4" y="5" width="16" height="14" rx="1"/><rect x="7" y="8" width="4" height="8"/><path d="M13 10h5M13 13h5M13 16h4"/>',
 etpl:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 10h16M10 4v16"/>',
 erend:'<rect x="3" y="6" width="18" height="12" rx="1"/><path d="M3 15l5-4 3 2 4-4 6 6"/>'});
Object.assign(TD14,{
 eel:["Place","Place an elevation piece (frame, balcony, louvers, cladding…)","eel"],
 "a:etpl":["Template","Load a ready-made 2-floor elevation like the sample house","etpl"],
 "a:erend":["Colour","Toggle line drawing / colour-render view","erend"]});
Object.assign(HINTS,{eel:"Pick a piece in the option bar, then drag a box (snaps to levels and walls). Tap a piece to select · typed ft-in and colour in the bar."});
Object.assign(RLAB,{eel:"Place","a:etpl":"Template","a:erend":"Colour"});
ETOOL.eel=1;
function winStyleDimPopup(){var st=winStyleNew();
 modal('<div class="mt">Window '+({plain:"plain",shade:"sunshade",box:"box frame"}[st]||st)+' sizes</div><div class="ms">Typed feet-inches. New windows use these. Existing windows keep their own sizes until you edit them or tap Apply to all.</div>'+
  (st==="shade"?'<div class="row"><label class="fld">Projection depth<input id="wsD" value="'+escH(fi(UI.wsD||1.5))+'"></label><label class="fld">Slab thickness<input id="wsT" value="'+escH(fi(UI.wsT||0.5))+'"></label></div>':
   st==="box"?'<div class="row"><label class="fld">Frame width<input id="wsW" value="'+escH(fi(UI.wsW||0.5))+'"></label><label class="fld">Frame depth<input id="wsB" value="'+escH(fi(UI.wsB||0.75))+'"></label></div>':
   '<div class="ms">Plain windows have no extra slab or frame.</div>')+
  '<div class="row"><button class="bb" id="wsX">Cancel</button><button class="bb ok" id="wsOk">OK</button></div>',function(){
  $("wsX").onclick=closeModal;$("wsOk").onclick=function(){
   if(st==="shade"){var d=parseFI($("wsD").value),t=parseFI($("wsT").value);if(!(d>0&&d<10&&t>0&&t<4)){toast("e.g. depth 1'-6\" · thickness 0'-6\"");return}UI.wsD=d;UI.wsT=t}
   if(st==="box"){var w=parseFI($("wsW").value),b=parseFI($("wsB").value);if(!(w>0&&w<4&&b>0&&b<6)){toast("e.g. width 0'-6\" · depth 0'-9\"");return}UI.wsW=w;UI.wsB=b}
   if(S&&S.meta){S.meta.ws=S.meta.ws||{};S.meta.ws.k=st;if(UI.wsD)S.meta.ws.d=UI.wsD;if(UI.wsT)S.meta.ws.t=UI.wsT;if(UI.wsW)S.meta.ws.w=UI.wsW;if(UI.wsB)S.meta.ws.b=UI.wsB}
   closeModal();updCtx();toast("Defaults saved")}})}
function opWinDress(items,o,h0,h1,s0,s1,dep,c){if(!o||(o.type!=="W"&&o.type!=="V"))return;var st=winStyle(o);if(st==="plain")return;
 if(st==="shade"){var D=winShadeD(o),T=winShadeT(o),x0=h0-0.25,x1=h1+0.25,y0=s1,y1=s1+T,ox=Math.min(0.75,D*0.42),oy=Math.min(0.38,D*0.24);
  items.push({p:[[x0+ox,y0+oy],[x1+ox,y0+oy],[x1+ox,y1+oy],[x0+ox,y1+oy]],fill:"#a8a297",c:c,w:0.14,dep:dep-0.002,L:"WINDOWS"});
  items.push({p:[[x1,y0],[x1+ox,y0+oy],[x1+ox,y1+oy],[x1,y1]],fill:"#8f8a80",c:c,w:0.14,dep:dep-0.0021,L:"WINDOWS"});
  items.push({p:[[x0,y1],[x1,y1],[x1+ox,y1+oy],[x0+ox,y1+oy]],fill:"#d8d3c8",c:c,w:0.14,dep:dep-0.0022,L:"WINDOWS"});
  items.push({p:rect(x0,y0,x1,y1),fill:"#cfcac0",c:c,w:0.22,dep:dep-0.0023,L:"WINDOWS"});
  items.push({p:null,lines:[[x0,y0,x1,y0],[x0,y0,x0+ox,y0+oy],[x1,y0,x1+ox,y0+oy],[x0+ox,y0+oy,x1+ox,y0+oy]],c:"#4b5563",w:0.16,dep:dep-0.0024,L:"WINDOWS"});return}
 var W=winBoxW(o),B=winBoxD(o),x0=h0-W,x1=h1+W,y0=s0-W,y1=s1+W,ox=Math.min(0.7,B*0.48),oy=Math.min(0.42,B*0.3),fill="#6d737c",edge="#2a3038";
 items.push({p:[[x1,y0],[x1+ox,y0+oy],[x1+ox,y1+oy],[x1,y1]],fill:"#5c636c",c:edge,w:0.14,dep:dep-0.0016,L:"WINDOWS"});
 items.push({p:[[x0,y1],[x1,y1],[x1+ox,y1+oy],[x0+ox,y1+oy]],fill:"#9aa1a8",c:edge,w:0.14,dep:dep-0.00161,L:"WINDOWS"});
 items.push({p:rect(x0,y0,h0,y1),fill:fill,c:edge,w:0.24,dep:dep-0.0017,L:"WINDOWS"});
 items.push({p:rect(h1,y0,x1,y1),fill:fill,c:edge,w:0.24,dep:dep-0.0017,L:"WINDOWS"});
 items.push({p:rect(h0,y0,h1,s0),fill:fill,c:edge,w:0.24,dep:dep-0.0017,L:"WINDOWS"});
 items.push({p:rect(h0,s1,h1,y1),fill:fill,c:edge,w:0.24,dep:dep-0.0017,L:"WINDOWS"});
 items.push({p:null,lines:[[x0,y0,x0+ox,y0+oy],[x1,y0,x1+ox,y0+oy],[x1,y1,x1+ox,y1+oy],[x0,y1,x0+ox,y1+oy],[x1+ox,y0+oy,x1+ox,y1+oy],[x0+ox,y1+oy,x1+ox,y1+oy]],c:edge,w:0.16,dep:dep-0.0018,L:"WINDOWS"})}

var EMAT={
 white:{n:"White paint",f:"#f4f0e6",s:"#c4beb2"},
 grey:{n:"Grey paint",f:"#c8ced4",s:"#8a929a"},
 wood:{n:"Wood panel",f:"#b07848",s:"#6a4324",h:"wood"},
 stone:{n:"Stone cladding",f:"#cbb9a0",s:"#8a7a68",h:"stone"},
 dark:{n:"Dark grey",f:"#4a525c",s:"#2a3038"},
 glass:{n:"Glass",f:"rgba(168,204,228,0.5)",s:"#3d4a55"},
 warm:{n:"Warm light",f:"#f5c16a",s:"#d48a2a"},
 metal:{n:"Metal",f:"#6d737c",s:"#3a3f46"}
};
var EKAT=[
 {k:"frame",n:"Box frame",g:"Openings",dw:6,dh:5,d:0.75,mat:"dark"},
 {k:"balcony",n:"Balcony",g:"Openings",dw:12,dh:3.5,d:3.5,mat:"white"},
 {k:"slider",n:"Sliding glass",g:"Openings",dw:8,dh:8,mat:"glass"},
 {k:"mdoor",n:"Main door",g:"Openings",dw:3.5,dh:7,mat:"wood"},
 {k:"vlouver",n:"Vert. louvers",g:"Cladding",dw:6,dh:8,mat:"wood"},
 {k:"hlouver",n:"Horiz. louvers",g:"Cladding",dw:8,dh:4,mat:"wood"},
 {k:"clad",n:"Cladding",g:"Cladding",dw:8,dh:8,mat:"stone"},
 {k:"cove",n:"Cove light",g:"Light",dw:10,dh:0.25,mat:"warm"},
 {k:"wlight",n:"Wall light",g:"Light",dw:0.45,dh:0.7,mat:"warm"},
 {k:"parapet",n:"Parapet band",g:"Roof",dw:16,dh:2.5,mat:"dark"},
 {k:"chajja",n:"Chajja / shade",g:"Roof",dw:8,dh:0.7,d:1.5,mat:"white"},
 {k:"roof",n:"Roof edge",g:"Roof",dw:16,dh:0.55,mat:"dark"},
 {k:"porch",n:"Porch slab",g:"Site",dw:16,dh:1.1,mat:"white"},
 {k:"pcol",n:"Porch column",g:"Site",dw:1.2,dh:10,mat:"white"},
 {k:"steps",n:"Steps",g:"Site",dw:6,dh:1.5,mat:"grey"},
 {k:"cwall",n:"Compound wall",g:"Site",dw:14,dh:5,mat:"grey"},
 {k:"pillar",n:"Pillar + light",g:"Site",dw:1.15,dh:5.5,mat:"grey"},
 {k:"gate",n:"Sliding gate",g:"Site",dw:10,dh:5,mat:"dark"}
];
function elevKat(k){for(var i=0;i<EKAT.length;i++)if(EKAT[i].k===k)return EKAT[i];return EKAT[0]}
function elevMat(m){if(m&&EMAT[m])return EMAT[m];if(m&&m.charAt(0)==="#")return {n:"Custom",f:m,s:"#333"};return EMAT.white}
function elevEls(){return elevDoc().els||[]}
function elevEl(id){var L=elevEls();for(var i=0;i<L.length;i++)if(L[i].id===id)return L[i];return null}
function elevElBox(el){return [el.x,el.y,el.x+(+el.w||0),el.y+(+el.h||0)]}
function elevInEl(w,el){var b=elevElBox(el);return w.x>=b[0]&&w.x<=b[2]&&w.y>=b[1]&&w.y<=b[3]}
function elevElHandle(w,el){if(!el)return null;var b=elevElBox(el),R=Math.max(0.35,10/V.s),hs=[[b[0],b[1],"sw"],[b[2],b[1],"se"],[b[0],b[3],"nw"],[b[2],b[3],"ne"]];
 for(var i=0;i<hs.length;i++)if(Math.hypot(w.x-hs[i][0],w.y-hs[i][1])<R)return hs[i][2];return null}

function elevFill(x,y,w,h,col){var a=w2s(x,y),c=w2s(x+w,y+h);g.fillStyle=col;g.fillRect(Math.min(a.x,c.x),Math.min(a.y,c.y),Math.abs(c.x-a.x),Math.abs(c.y-a.y))}
function elevStroke(x,y,w,h,col,lw){var a=w2s(x,y),c=w2s(x+w,y+h);g.strokeStyle=col;g.lineWidth=lw||1.4;g.strokeRect(Math.min(a.x,c.x)+0.5,Math.min(a.y,c.y)+0.5,Math.abs(c.x-a.x),Math.abs(c.y-a.y))}
function elevLine(x0,y0,x1,y1,col,lw,dash){var a=w2s(x0,y0),b=w2s(x1,y1);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.strokeStyle=col;g.lineWidth=lw||1.2;if(dash)g.setLineDash(dash);g.stroke();g.setLineDash([])}
function elevPoly(pts,fill,st,lw){if(!pts||!pts.length)return;g.beginPath();pts.forEach(function(p,i){var q=w2s(p[0],p[1]);i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y)});g.closePath();if(fill){g.fillStyle=fill;g.fill()}if(st){g.strokeStyle=st;g.lineWidth=lw||1.2;g.stroke()}}
function elevHatchWood(x,y,w,h,col){var step=0.55,i;for(i=x+0.15;i<x+w-0.05;i+=step)elevLine(i,y+0.05,i,y+h-0.05,col,1);
 for(i=y+0.4;i<y+h;i+=2.4)elevLine(x+0.05,i,x+w-0.05,i,col,0.7)}
function elevHatchStone(x,y,w,h,col){var rw=1.35,rh=0.7,yy,xx,odd;
 for(yy=y,odd=0;yy<y+h-0.05;yy+=rh,odd^=1){for(xx=x+(odd?0.55:0);xx<x+w-0.1;xx+=rw){
  var ww=Math.min(rw-0.08,x+w-xx-0.06),hh=Math.min(rh-0.08,y+h-yy-0.06);if(ww>0.2&&hh>0.15)elevStroke(xx+0.04,yy+0.04,ww,hh,col,0.8)}}}
function elevShadow(x,y,w,h){if(!UI.eRend)return;g.save();g.globalAlpha=0.16;elevFill(x+0.28,y-0.12,w,h,"#1a1a1a");g.restore()}
function elevGlow(x,y,w,h){var a=w2s(x,y+h*0.5),c=w2s(x+w,y+h*0.5),grd=g.createLinearGradient(a.x,a.y-18,a.x,a.y+18);
 grd.addColorStop(0,"rgba(255,186,80,0)");grd.addColorStop(0.45,"rgba(255,196,90,0.85)");grd.addColorStop(1,"rgba(255,170,50,0)");
 g.fillStyle=grd;g.fillRect(Math.min(a.x,c.x),a.y-22,Math.abs(c.x-a.x),44);
 g.fillStyle="#f8d48a";g.globalAlpha=0.95;g.fillRect(Math.min(a.x,c.x),a.y-2,Math.abs(c.x-a.x),4);g.globalAlpha=1}

function elevDrawEl(el,rend){var k=el.k,x=+el.x,y=+el.y,w=+el.w,h=+el.h,M=elevMat(el.mat),d=+el.d||elevKat(k).d||0;
 if(k==="cove"){elevGlow(x,y,w,Math.max(h,0.2));return}
 if(k==="wlight"){elevDrawWlight(x,y,w,h,rend);return}
 if(k==="clad"){elevShadow(x,y,w,h);elevFill(x,y,w,h,M.f);if(M.h==="wood")elevHatchWood(x,y,w,h,M.s);if(M.h==="stone")elevHatchStone(x,y,w,h,M.s);elevStroke(x,y,w,h,M.s,1.2);return}
 if(k==="vlouver"){elevDrawVlouver(x,y,w,h,M,rend);return}
 if(k==="hlouver"){elevDrawHlouver(x,y,w,h,M,rend);return}
 if(k==="frame"){elevDrawFrame(x,y,w,h,d,M,rend);return}
 if(k==="balcony"){elevDrawBalcony(x,y,w,h,M,rend);return}
 if(k==="slider"){elevDrawSlider(x,y,w,h,M,rend);return}
 if(k==="mdoor"){elevDrawMdoor(x,y,w,h,M,rend);return}
 if(k==="parapet"){elevShadow(x,y,w,h);elevFill(x,y,w,h,M.f);elevFill(x-0.08,y+h-0.28,w+0.16,0.28,elevMat("grey").f);elevStroke(x,y,w,h,M.s,1.3);return}
 if(k==="chajja"||k==="porch"||k==="roof"){elevDrawSlab(x,y,w,h,d,M,rend);return}
 if(k==="pcol"){elevShadow(x,y,w,h);elevFill(x,y,w,h,M.f);elevStroke(x,y,w,h,M.s,1.4);elevFill(x-0.08,y+h-0.2,w+0.16,0.2,elevMat("grey").f);return}
 if(k==="steps"){elevDrawSteps(x,y,w,h,M,rend);return}
 if(k==="cwall"){elevShadow(x,y,w,h);elevFill(x,y,w,h,M.f);elevFill(x,y+h-0.35,w,0.35,elevMat("grey").f);elevStroke(x,y,w,h,M.s,1.3);return}
 if(k==="pillar"){elevShadow(x,y,w,h);elevFill(x,y,w,h,M.f);elevStroke(x,y,w,h,M.s,1.4);elevDrawWlight(x+w*0.15,y+h*0.55,w*0.7,h*0.12,rend);return}
 if(k==="gate"){elevDrawGate(x,y,w,h,M,rend);return}
 elevShadow(x,y,w,h);elevFill(x,y,w,h,M.f);elevStroke(x,y,w,h,M.s,1.2)}
function elevDrawFrame(x,y,w,h,d,M,rend){var ox=Math.max(0.25,d*0.55),oy=Math.max(0.18,d*0.4),t=Math.max(0.28,Math.min(w,h)*0.08);
 if(rend)elevShadow(x,y,w,h);
 elevPoly([[x+ox,y+oy],[x+w+ox,y+oy],[x+w+ox,y+h+oy],[x+ox,y+h+oy]],rend?shade(M.f,-18):M.f,M.s,1);
 elevLine(x,y,x+ox,y+oy,M.s,1);elevLine(x+w,y,x+w+ox,y+oy,M.s,1);elevLine(x+w,y+h,x+w+ox,y+h+oy,M.s,1);elevLine(x,y+h,x+ox,y+h+oy,M.s,1);
 elevFill(x,y,w,t,M.f);elevFill(x,y+h-t,w,t,M.f);elevFill(x,y,t,h,M.f);elevFill(x+w-t,y,t,h,M.f);
 elevStroke(x,y,w,h,M.s,2.2);elevStroke(x+t,y+t,w-2*t,h-2*t,M.s,1.1)}
function elevDrawBalcony(x,y,w,h,M,rend){var sh=Math.min(0.55,h*0.18),rh=h-sh,ox=0.45;
 if(rend)elevShadow(x,y,w,h);
 elevFill(x-0.15,y,w+0.3,sh,M.f);elevStroke(x-0.15,y,w+0.3,sh,M.s,1.4);
 elevFill(x,y+sh,w,rh,elevMat("glass").f);elevStroke(x,y+sh,w,rh,elevMat("metal").s,1.3);
 elevLine(x,y+h,x+w,y+h,elevMat("metal").s,2.4);
 for(var t=0;t<=1.001;t+=1/Math.max(3,Math.round(w/3.2)))elevLine(x+w*t,y+sh,x+w*t,y+h,elevMat("metal").s,1.1);
 if(rend)elevGlow(x,y+sh*0.35,w,0.15)}
function elevDrawSlider(x,y,w,h,M,rend){if(rend)elevShadow(x,y,w,h);
 elevFill(x,y,w,h,M.f||elevMat("glass").f);elevStroke(x,y,w,h,M.s,1.6);
 var t=0.22;elevStroke(x+t,y+t,w-2*t,h-2*t,M.s,1);
 elevLine(x+w*0.5,y+t,x+w*0.5,y+h-t,M.s,1.6);
 elevLine(x+w*0.25,y+t+0.3,x+w*0.25,y+h-t-0.3,M.s,0.8);
 elevLine(x+w*0.75,y+t+0.3,x+w*0.75,y+h-t-0.3,M.s,0.8);
 elevFill(x+w*0.47,y+h*0.46,w*0.06,0.35,elevMat("metal").f)}
function elevDrawMdoor(x,y,w,h,M,rend){if(rend)elevShadow(x,y,w,h);
 elevFill(x,y,w,h,M.f);elevStroke(x,y,w,h,M.s,1.8);
 var t=0.18,pw=w*0.46;elevStroke(x+t,y+t,pw,h-2*t,M.s,1);elevStroke(x+w-t-pw,y+t,pw,h-2*t,M.s,1);
 elevFill(x+w*0.42,y+h*0.48,0.18,0.18,elevMat("metal").f);elevHatchWood(x+t,y+t,w-2*t,h-2*t,M.s)}
function elevDrawVlouver(x,y,w,h,M,rend){if(rend)elevShadow(x,y,w,h);elevFill(x,y,w,h,shade(M.f,-22));elevStroke(x,y,w,h,M.s,1.2);
 var n=Math.max(4,Math.round(w/0.42)),fw=w/n,i;
 for(i=0;i<n;i++){var fx=x+i*fw+fw*0.12,fw2=fw*0.62;elevFill(fx,y+0.08,fw2,h-0.16,M.f);elevStroke(fx,y+0.08,fw2,h-0.16,M.s,0.9);
  if(rend)elevFill(fx+fw2*0.7,y+0.08,fw2*0.3,h-0.16,shade(M.f,-28))}}
function elevDrawHlouver(x,y,w,h,M,rend){if(rend)elevShadow(x,y,w,h);elevFill(x,y,w,h,shade(M.f,-18));
 var n=Math.max(3,Math.round(h/0.38)),fh=h/n,i;
 for(i=0;i<n;i++){var fy=y+i*fh+fh*0.12;elevFill(x+0.06,fy,w-0.12,fh*0.62,M.f);elevStroke(x+0.06,fy,w-0.12,fh*0.62,M.s,0.8)}
 elevStroke(x,y,w,h,M.s,1.2)}
function elevDrawSlab(x,y,w,h,d,M,rend){if(rend)elevShadow(x,y,w,h);elevFill(x,y,w,h,M.f);elevStroke(x,y,w,h,M.s,1.4);
 elevFill(x,y,w,Math.min(0.18,h*0.35),shade(M.f,-20));if(rend)elevGlow(x,y+h*0.15,w,0.12)}
function elevDrawSteps(x,y,w,h,M,rend){var n=Math.max(2,Math.round(h/0.5)),i,rh=h/n,rw;
 for(i=0;i<n;i++){rw=w*(0.55+0.45*(i+1)/n);elevFill(x+(w-rw)/2,y+i*rh,rw,rh-0.04,M.f);elevStroke(x+(w-rw)/2,y+i*rh,rw,rh-0.04,M.s,1)}}
function elevDrawGate(x,y,w,h,M,rend){if(rend)elevShadow(x,y,w,h);elevFill(x,y,w,0.18,M.s);elevFill(x,y+h-0.22,w,0.22,M.s);
 var n=Math.max(6,Math.round(w/0.38)),i,sw=w/n;
 for(i=0;i<n;i++)if(i%2===0)elevFill(x+i*sw+sw*0.12,y+0.2,sw*0.7,h-0.42,M.f);
 elevStroke(x,y,w,h,M.s,1.4);elevFill(x+w*0.46,y+h*0.45,w*0.08,0.28,elevMat("metal").f)}
function elevDrawWlight(x,y,w,h,rend){if(rend){g.save();g.globalAlpha=0.35;elevFill(x-0.35,y-0.2,w+0.7,h+0.8,"#f5c16a");g.restore()}
 elevFill(x,y,w,h,elevMat("metal").f);elevStroke(x,y,w,h,elevMat("metal").s,1);elevFill(x+w*0.15,y+h*0.35,w*0.7,h*0.45,"#f8d48a")}
function shade(hex,amt){if(!hex||hex.indexOf("rgb")===0)return hex;hex=hex.replace("#","");if(hex.length===3)hex=hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
 var n=parseInt(hex,16),r=clamp(((n>>16)&255)+amt,0,255),gv=clamp(((n>>8)&255)+amt,0,255),b=clamp((n&255)+amt,0,255);
 return "#"+((1<<24)+(r<<16)+(gv<<8)+b).toString(16).slice(1)}

function elevDrawEls(){var rend=!!UI.eRend,L=elevEls().slice().sort(function(a,b){return (a.y-b.y)||(a.x-b.x)});
 L.forEach(function(el){elevDrawEl(el,rend)});
 var sel=UI.eSel&&UI.eSel.k==="eel"?elevEl(UI.eSel.id):null;
 if(sel){var b=elevElBox(sel);elevStroke(b[0],b[1],b[2]-b[0],b[3]-b[1],"#e8590c",2);
  [[b[0],b[1]],[b[2],b[1]],[b[0],b[3]],[b[2],b[3]]].forEach(function(p){var q=w2s(p[0],p[1]);g.fillStyle="#fff";g.strokeStyle="#e8590c";g.lineWidth=1.5;g.beginPath();g.rect(q.x-5,q.y-5,10,10);g.fill();g.stroke()})}
 if(UI.eRect){var a=UI.eRect.a,c=UI.eRect.b,x=Math.min(a.x,c.x),y=Math.min(a.y,c.y),ww=Math.abs(c.x-a.x),hh=Math.abs(c.y-a.y);
  elevStroke(x,y,ww,hh,"#e8590c",2);g.setLineDash([6,4]);elevStroke(x,y,ww,hh,"#e8590c",1.2);g.setLineDash([]);
  var q=w2s(x+ww/2,y+hh);g.fillStyle="#e8590c";g.font="bold 12px Roboto,Arial";g.textAlign="center";g.fillText(fi(ww)+" × "+fi(hh),q.x,q.y-8)}}

function elevHitEl(w){var L=elevEls(),i,el,h;for(i=L.length-1;i>=0;i--){el=L[i];
  if(UI.eSel&&UI.eSel.k==="eel"&&UI.eSel.id===el.id){h=elevElHandle(w,el);if(h)return {k:"eel",id:el.id,e:el,handle:h}}
  if(elevInEl(w,el))return {k:"eel",id:el.id,e:el}}return null}

function elevPlaceEl(k,a,b){var C=elevKat(k||UI.eKind||"frame"),x,y,w,h;
 if(b){x=Math.min(a.x,b.x);y=Math.min(a.y,b.y);w=Math.abs(b.x-a.x);h=Math.abs(b.y-a.y)}
 else{w=C.dw;h=C.dh;x=a.x;y=a.y}
 if(w<0.35)w=C.dw;if(h<0.12)h=C.dh;
 snapshot();var el={id:nid(),k:C.k,x:Math.round(x*4)/4,y:Math.round(y*4)/4,w:Math.round(w*4)/4,h:Math.round(h*4)/4,mat:C.mat};
 if(C.d)el.d=C.d;elevEnsure().els.push(el);UI.eSel={k:"eel",id:el.id};changed();toast(C.n+"  "+fi(el.w)+" × "+fi(el.h));return el}

function elevElPopup(el){if(!el)return;var C=elevKat(el.k),mats=Object.keys(EMAT);
 modal('<div class="mt">'+esc(C.n)+'</div><div class="ms">Size in feet-inches. Snaps to level lines when you drag the corners.</div>'+
  '<div class="row"><label class="fld">Width<input id="elW" value="'+escH(fi(el.w))+'"></label><label class="fld">Height<input id="elH" value="'+escH(fi(el.h))+'"></label></div>'+
  (C.d!=null?'<label class="fld">Depth / projection<input id="elD" value="'+escH(fi(el.d!=null?el.d:C.d))+'"></label>':'')+
  '<div class="ms">Material / colour</div><div class="row" id="elMats" style="flex-wrap:wrap;gap:6px">'+mats.map(function(m){var M=EMAT[m];
   return '<button class="bb'+(el.mat===m?' on':'')+'" data-m="'+m+'" style="border-left:8px solid '+M.f+'">'+esc(M.n)+'</button>'}).join("")+
   '<button class="bb" id="elCol">Custom…</button></div>'+
  '<div class="row"><button class="bb del" id="elDel">Delete</button><button class="bb" id="elX">Cancel</button><button class="bb ok" id="elOk">OK</button></div>',function(box){
  var mat=el.mat||C.mat;
  box.querySelectorAll("[data-m]").forEach(function(b){b.onclick=function(){mat=b.dataset.m;box.querySelectorAll("[data-m]").forEach(function(x){x.classList.toggle("on",x===b)})}});
  $("elCol").onclick=function(){var v=prompt("Hex colour #rrggbb",el.mat&&el.mat.charAt(0)==="#"?el.mat:"#c8ced4");if(v&&/^#?[0-9a-fA-F]{6}$/.test(v)){mat=v.charAt(0)==="#"?v:"#"+v;toast("Custom colour")}};
  $("elX").onclick=closeModal;$("elDel").onclick=function(){snapshot();elevEnsure().els=elevEnsure().els.filter(function(q){return q.id!==el.id});UI.eSel=null;closeModal();changed()};
  $("elOk").onclick=function(){var W=parseFI($("elW").value),H=parseFI($("elH").value),D=$("elD")?parseFI($("elD").value):null;
   if(!(W>0.15&&W<80)){toast("Width e.g. 8'-0\"");return}if(!(H>0.08&&H<40)){toast("Height e.g. 5'-0\"");return}
   snapshot();el.w=W;el.h=H;el.mat=mat;if(D!=null&&isFinite(D))el.d=D;closeModal();changed()}})}

function elevTplPopup(){modal('<div class="mt">Elevation templates</div><div class="ms">Ready-made fronts. Elements stay on this elevation (additive — old files without them still open).</div>'+
  '<div class="row" style="flex-direction:column;align-items:stretch;gap:8px">'+
  '<button class="bb ok" id="tp1">Modern 2-floor villa<small>wood louvers, stone, glass balcony, porch, gate — matches the reference</small></button>'+
  '<button class="bb ok" id="tp2">Simple box villa<small>white + wood frames, sliding glass, parapet</small></button>'+
  '<button class="bb ok" id="tp3">Three window styles<small>Plain · Sunshade · Box frame on one elevation</small></button></div>'+
  '<div class="row"><button class="bb" id="tpX">Cancel</button></div>',function(){
  $("tpX").onclick=closeModal;$("tp1").onclick=function(){closeModal();elevApplyTpl("modern")};$("tp2").onclick=function(){closeModal();elevApplyTpl("simple")};$("tp3").onclick=function(){closeModal();elevApplyTpl("styles")}})}

function elevRectWalls(x0,y0,x1,y1){var A=ensurePoint({x:x0,y:y0}),B=ensurePoint({x:x1,y:y0}),C=ensurePoint({x:x1,y:y1}),D=ensurePoint({x:x0,y:y1});
 addSeg(A,B,"O");addSeg(B,C,"O");addSeg(C,D,"O");addSeg(D,A,"O");planarize()}
function elevFindSouth(x){var best=null,bd=9e9;S.segs.forEach(function(s){var a=pt(s.a),b=pt(s.b);if(!a||!b)return;if(Math.abs(a.y-b.y)>0.2)return;
  var y=(a.y+b.y)/2,lo=Math.min(a.x,b.x),hi=Math.max(a.x,b.x);if(x<lo-0.2||x>hi+0.2)return;if(y<bd){bd=y;best=s}});return best}
function elevPutOp(x,w,type,dk,sill,h,ws){var s=elevFindSouth(x);if(!s)return null;var a=pt(s.a),b=pt(s.b),L=Math.hypot(b.x-a.x,b.y-a.y);if(L<0.2)return null;
 var t=((x-a.x)*(b.x-a.x)+(0)*(b.y-a.y))/ (L*L);t=clamp(t,0.08,0.92);
 var o={id:nid(),seg:s.id,t:t,type:type,w:w};if(type==="D")o.dk=dk||"MD";if(sill!=null)o.sill=sill;if(h!=null)o.h=h;if(type==="W"||type==="V")winStyleWrite(o,ws||"plain");S.ops.push(o);return o}
function elevElAdd(k,x,y,w,h,mat,d){var C=elevKat(k),el={id:nid(),k:k,x:x,y:y,w:w,h:h,mat:mat||C.mat};if(d!=null||C.d)el.d=d!=null?d:C.d;elevEnsure().els.push(el);return el}

function elevSeedVillaPlan(){if(S.L[0]&&S.L[0].segs.length)return false;
 snapshot();S.cur=0;S.L[0].h=10;S.L[0].name="Ground Floor";
 elevRectWalls(0,0,28,22);elevRectWalls(20,-10,38,0);
 S.labels.push({id:nid(),x:14,y:11,name:"Hall"},{id:nid(),x:29,y:-5,name:"Portico/Parking"});
 elevPutOp(12.5,6,"W","W",0.4,7,"box");elevPutOp(23.2,3.5,"D","MD",0,7);
 if(S.L.length<2){var L=newLevel("First Floor",10);L.id=nid();S.L.push(L)}
 S.cur=1;S.L[1].h=10;elevRectWalls(0,0,28,22);elevRectWalls(8,-4,20,0);
 S.labels.push({id:nid(),x:14,y:11,name:"Bedroom"});elevPutOp(14,8,"W","W",1.2,7.2,"shade");
 S.cur=0;if(typeof roofCfg==="function"){S.meta.roof=S.meta.roof||{};S.meta.roof.type="flat";S.meta.roof.par=2.5}
 S.meta.ttl="Front Elevation";S.meta.dno="A201";return true}
function elevSeedStylePlan(){if(S.L[0]&&S.L[0].segs.length)return false;
 snapshot();S.cur=0;S.L[0].h=10;S.L[0].name="Ground Floor";
 elevRectWalls(0,0,40,16);S.labels.push({id:nid(),x:20,y:8,name:"Hall"});
 var a=elevPutOp(7,6,"W","W",3,4,"plain"),b=elevPutOp(20,6,"W","W",3,4,"shade"),c=elevPutOp(33,6,"W","W",3,4,"box");
 if(b){b.wsD=1.5;b.wsT=0.5}if(c){c.wsW=0.5;c.wsB=0.75}
 S.meta.ttl="Window styles";S.meta.dno="A202";return true}
function elevApplyTpl(kind){snapshot();
 if(kind==="styles"){var seededS=elevSeedStylePlan();elevEnsure().face="S";elevEnsure().sill=3;elevEnsure().lintel=7;elevEnsure().els=[];
  elevEnsure().notes.push({id:nid(),x:4,y:-2.4,t:"PLAIN",h:0.7},{id:nid(),x:16.5,y:-2.4,t:"SUNSHADE",h:0.7},{id:nid(),x:29.2,y:-2.4,t:"BOX FRAME",h:0.7});
  UI.eRend=false;UI.tab="elev";UI.tool="eline";elevEnter();
  if(typeof buildTabs==="function")buildTabs();if(typeof buildRail==="function")buildRail();elevFit();updCtx();render();
  toast("Three window styles"+(seededS?" · sample plan + elevation":" · labels added"));return}
 var seeded=elevSeedVillaPlan();elevEnsure().face="S";elevEnsure().sill=3;elevEnsure().lintel=7;elevEnsure().els=[];
 var A=elevEnsure();
 if(kind==="simple"){
  elevElAdd("clad",0,0,28,10,"white");elevElAdd("clad",0,10,28,10,"white");
  elevElAdd("parapet",0,20,28,2.5,"dark");elevElAdd("roof",-0.2,22.3,28.4,0.45,"dark");
  elevElAdd("slider",10,0.4,8,7.2,"glass");elevElAdd("frame",9.4,0.1,9.2,8,"dark",0.7);
  elevElAdd("mdoor",20.5,0,3.5,7,"wood");elevElAdd("vlouver",1.5,11,6,8,"wood");
  elevElAdd("slider",10,11.2,8,7.5,"glass");elevElAdd("frame",9.4,10.8,9.2,8.2,"dark",0.7);
  elevElAdd("chajja",9,7.8,10,0.7,"white",1.4);elevElAdd("cove",0,9.85,28,0.2,"warm");
 }else{
  /* modern 2-floor villa — layout of the attached reference */
  elevElAdd("clad",0,0,28,10,"white");elevElAdd("clad",0,10,28,10.4,"white");
  elevElAdd("clad",-0.4,9.55,28.8,0.9,"dark");
  elevElAdd("clad",7.2,0,11.2,8.1,"stone");
  elevElAdd("slider",8.6,0.35,8.2,7.2,"glass");elevElAdd("frame",8.1,0.05,9.2,8,"dark",0.8);
  elevElAdd("mdoor",20.8,0,3.6,7,"wood");
  elevElAdd("vlouver",1.2,11.1,6.2,8.2,"wood");elevElAdd("frame",0.85,10.75,6.9,8.9,"dark",0.65);
  elevElAdd("slider",10.2,11.15,8.4,7.4,"glass");elevElAdd("frame",9.6,10.7,9.6,8.2,"dark",0.75);
  elevElAdd("balcony",8.4,10,12.2,3.6,"white",3.2);
  elevElAdd("vlouver",20.6,11.1,6.4,8.2,"wood");elevElAdd("frame",20.2,10.75,7.2,8.9,"dark",0.65);
  elevElAdd("parapet",-0.15,20.2,28.3,2.2,"dark");elevElAdd("roof",-0.35,22.2,28.7,0.5,"dark");
  elevElAdd("chajja",7.8,7.9,10.6,0.65,"white",1.5);
  elevElAdd("cove",8.2,10.05,12.6,0.22,"warm");elevElAdd("cove",20,9.55,18,0.22,"warm");elevElAdd("cove",0,20.15,28,0.2,"warm");
  elevElAdd("porch",20,9.35,18,1.15,"white",2);
  elevElAdd("pcol",35.4,0,1.35,9.4,"white");
  elevElAdd("steps",21.2,-1.5,6.2,1.5,"grey");
  elevElAdd("cwall",-3,-1.5,11.2,5,"grey");elevElAdd("gate",8.2,-1.5,9.6,5,"dark");
  elevElAdd("cwall",38.2,-1.5,5.2,5,"grey");
  elevElAdd("pillar",-3.3,-1.5,1.2,5.6,"grey");elevElAdd("pillar",7.6,-1.5,1.2,5.6,"grey");
  elevElAdd("pillar",17.4,-1.5,1.2,5.6,"grey");elevElAdd("pillar",37.6,-1.5,1.2,5.6,"grey");
  elevElAdd("pillar",42.2,-1.5,1.2,5.6,"grey");
  elevElAdd("wlight",-3.05,2.4,0.55,0.7,"warm");elevElAdd("wlight",7.85,2.4,0.55,0.7,"warm");
  elevElAdd("wlight",36.6,4.2,0.5,0.65,"warm");
 }
 A.face="S";UI.eRend=true;UI.tab="elev";UI.tool="eline";elevEnter();
 if(typeof buildTabs==="function")buildTabs();if(typeof buildRail==="function")buildRail();elevFit();updCtx();render();
 toast((kind==="simple"?"Simple box villa":"Modern 2-floor villa")+(seeded?" · sample plan + elevation":" · elevation pieces placed"))}

function elevPaintSky(){var grd=g.createLinearGradient(0,0,0,CH);grd.addColorStop(0,"#7ec8ea");grd.addColorStop(0.55,"#c5e7f6");grd.addColorStop(1,"#eef4ea");
 g.fillStyle=grd;g.fillRect(0,0,CW,CH)}
function elevPaintRenderWalls(){var Vv=elevView(elevFace()),its=(Vv.items||[]).slice().sort(elevPaintOrder);
 its.forEach(function(it){if(it.p&&it.p.length){g.beginPath();it.p.forEach(function(p,i){var q=w2s(p[0],p[1]);i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y)});g.closePath();
   g.fillStyle=it.fill||"#f3ede2";g.globalAlpha=0.98;g.fill();g.globalAlpha=1;g.strokeStyle=it.c||"#2b2b2b";g.lineWidth=UI.thin?1:Math.max(1.1,(it.w||0.25)*2.6);g.stroke()}
  (it.lines||[]).forEach(function(l){elevLine(l[0],l[1],l[2],l[3],it.c||"#444",1.3)})})}

var _paintElevLib=paintElev;
paintElev=function(){if(!g)return;
 if(UI.eRend){g.setTransform(DPR,0,0,DPR,0,0);elevPaintSky();elevPaintRenderWalls();elevDrawGround();elevDrawEls();
  if(typeof scaleBar==="function")scaleBar();
  var fi2=elevFaceInfo(),n=(elevDoc().els||[]).length;
  $("info").innerHTML="<b>"+esc(fi2.n)+" elevation</b> · colour render · "+n+" piece"+(n===1?"":"s")+" · sill "+fi(elevDoc().sill)+" · lintel "+fi(elevDoc().lintel);
  return}
 _paintElevLib();elevDrawEls();
 var n2=(elevDoc().els||[]).length;if(n2){var el=$("info");if(el)el.innerHTML+=" · "+n2+" library piece"+(n2===1?"":"s")}}

var _elevHitLib=elevHit;
elevHit=function(w){var h=elevHitEl(w);return h||_elevHitLib(w)};
var _elevDelLib=elevDelete;
elevDelete=function(h){if(h&&h.k==="eel"){snapshot();elevEnsure().els=elevEnsure().els.filter(function(x){return x.id!==h.id});UI.eSel=null;changed();toast("Deleted");return}
 _elevDelLib(h)};

var _elevUpd=elevUpdCtx;
elevUpdCtx=function(){_elevUpd();var c=$("ctx");if(!c)return;var T=UI.tool,sel=UI.eSel&&UI.eSel.k==="eel"?elevEl(UI.eSel.id):null;
 var extra="";
 extra+=CDV+cb("erend",UI.eRend?"Colour":"Line",UI.eRend?"colour-render view":"line drawing",!!UI.eRend);
 extra+=cbI("etpl","etpl","Template","sample elevations",true);
 if(T==="eel"){extra+=CDV;EKAT.forEach(function(C){extra+=cb("ek:"+C.k,C.n,C.g,(UI.eKind||"frame")===C.k)})}
 if(sel){var C=elevKat(sel.k);extra+=CDV+'<span class="ctl">'+esc(C.n)+'</span>'+cbI("elw","dim","W "+fi(sel.w),"typed width",true)+cbI("elh","dim","H "+fi(sel.h),"typed height",true)+cbI("elmat","wall",elevMat(sel.mat).n,"material / colour",true)+cbI("elpop","edit","Edit","size and colour",true)}
 if(extra){c.insertAdjacentHTML("beforeend",extra);c.querySelectorAll("[data-c]").forEach(function(b){if(!b._eok){b._eok=1;b.onclick=function(){ctxAction(b.dataset.c)}}})}
 var hn=$("hint");if(hn&&T==="eel")hn.textContent=HINTS.eel};

var _elevCtxLib=elevCtx;
elevCtx=function(k){
 if(k==="erend"){UI.eRend=!UI.eRend;toast(UI.eRend?"Colour-render view":"Line drawing");return true}
 if(k==="etpl"){elevTplPopup();return true}
 if(k.indexOf("ek:")===0){UI.eKind=k.slice(3);UI.tool="eel";toast(elevKat(UI.eKind).n);return true}
 if(k==="elw"||k==="elh"){var el=UI.eSel&&elevEl(UI.eSel.id);if(!el)return true;elevElPopup(el);return true}
 if(k==="elmat"||k==="elpop"){var el2=UI.eSel&&elevEl(UI.eSel.id);if(el2)elevElPopup(el2);return true}
 return _elevCtxLib(k)};
var _raLib=railAction;
railAction=function(a){if(a==="etpl"){elevTplPopup();return}if(a==="erend"){UI.eRend=!UI.eRend;updCtx();render();toast(UI.eRend?"Colour-render view":"Line drawing");return}return _raLib.apply(this,arguments)};

var _ttLib=toolTap;
toolTap=function(w){
 if(UI.elev&&UI.tool==="eel"){var h=elevHitEl(w);
  if(h){if(UI.eSel&&UI.eSel.id===h.id)elevElPopup(h.e);else{UI.eSel={k:"eel",id:h.id};updCtx();render()}return true}
  elevPlaceEl(UI.eKind||"frame",elevSnap(w),null);return true}
 if(UI.elev&&UI.tool==="edel"){var h2=elevHitEl(w);if(h2){elevDelete(h2);return true}}
 return _ttLib(w)};
var _tdLib=toolDown;
toolDown=function(w,G){
 if(UI.elev&&UI.tool==="eel"){var h=elevHitEl(w);
  if(h&&h.handle){G.kind="ehandle";G.el=h.e;G.handle=h.handle;G.box=elevElBox(h.e);snapshot();return true}
  if(h){G.kind="emove";G.el=h.e;G.dx=w.x-h.e.x;G.dy=w.y-h.e.y;UI.eSel={k:"eel",id:h.id};snapshot();return true}
  G.kind="erect";G.a=elevSnap(w);return true}
 return _tdLib(w,G)};
var _tmLib=toolMove;
toolMove=function(w,G,p){
 if(UI.elev&&G.kind==="erect"){if(G.moved){UI.eRect={a:G.a,b:elevSnap(w,G.a)};showHud(fi(Math.abs(UI.eRect.b.x-G.a.x))+" × "+fi(Math.abs(UI.eRect.b.y-G.a.y)));render()}return true}
 if(UI.elev&&G.kind==="emove"&&G.el){var p2=elevSnap(w);G.el.x=Math.round((p2.x-G.dx)*4)/4;G.el.y=Math.round((p2.y-G.dy)*4)/4;showHud(fi(G.el.x)+", "+lvl(G.el.y));render();return true}
 if(UI.elev&&G.kind==="ehandle"&&G.el){var q=elevSnap(w),B=G.box,el=G.el,h=G.handle;
  var x0=h.indexOf("w")>=0?q.x:B[0],x1=h.indexOf("e")>=0?q.x:B[2],y0=h.indexOf("s")>=0?q.y:B[1],y1=h.indexOf("n")>=0?q.y:B[3];
  el.x=Math.min(x0,x1);el.y=Math.min(y0,y1);el.w=Math.max(0.25,Math.abs(x1-x0));el.h=Math.max(0.12,Math.abs(y1-y0));
  showHud(fi(el.w)+" × "+fi(el.h));render();return true}
 return _tmLib(w,G,p)};
var _tuLib=toolUp;
toolUp=function(G,w){
 if(UI.elev&&G.kind==="erect"){hideHud();var r=UI.eRect;UI.eRect=null;
  if(G.moved&&r)elevPlaceEl(UI.eKind||"frame",r.a,r.b);else elevPlaceEl(UI.eKind||"frame",elevSnap(w),null);
  render();return true}
 if(UI.elev&&(G.kind==="emove"||G.kind==="ehandle")){hideHud();changed();updCtx();render();return true}
 return _tuLib(G,w)};

var _elevExp=elevExport;
elevExport=function(kind){
 if(UI.eRend&&kind==="png"){elevExportRender();return}
 var e=elevDoc();if(e.els&&e.els.length){
  var _aug=elevAugment;elevAugment=function(Vv){Vv=_aug(Vv);elevEls().forEach(function(el){var M=elevMat(el.mat);
   Vv.items.push({p:[[el.x,el.y],[el.x+el.w,el.y],[el.x+el.w,el.y+el.h],[el.x,el.y+el.h]],fill:M.f.indexOf("rgb")===0?"#cfe3f5":M.f,c:M.s,w:0.22,dep:-1.5,L:"ELEV"});
   if(el.k==="vlouver"){var n=Math.max(4,Math.round(el.w/0.42)),fw=el.w/n,i;for(i=0;i<n;i++)Vv.items.push({p:[[el.x+i*fw+fw*0.12,el.y],[el.x+i*fw+fw*0.74,el.y],[el.x+i*fw+fw*0.74,el.y+el.h],[el.x+i*fw+fw*0.12,el.y+el.h]],fill:M.f,c:M.s,w:0.12,dep:-1.51,L:"ELEV"})}
  });return Vv};
  try{_elevExp(kind)}finally{elevAugment=_aug}return}
 _elevExp(kind)};
function elevExportRender(){var c=document.createElement("canvas"),W=1920,H=1080,old={s:V.s,ox:V.ox,oy:V.oy,w:CW,h:CH,cv:cv,g:g};
 c.width=W;c.height=H;cv=c;g=c.getContext("2d");CW=W;CH=H;DPR=1;elevFit();
 var b=elevBox();V.s=Math.min((W-80)/(b[2]-b[0]),(H-80)/(b[3]-b[1]));V.ox=W/2-(b[0]+b[2])/2*V.s;V.oy=H/2+(b[1]+b[3])/2*V.s;
 paintElev();var fi2=elevFaceInfo();
 c.toBlob(function(blob){cv=old.cv;g=old.g;CW=old.w;CH=old.h;V.s=old.s;V.ox=old.ox;V.oy=old.oy;DPR=window.devicePixelRatio||1;render();
  saveFile(fname("png").replace(/\.png$/,"_"+fi2.n+"_Elevation_Colour.png"),blob,"image/png");toast("PNG: colour "+fi2.n+" elevation")}, "image/png")}
