/* ================= Classic dark theme + theme toggle (web build) =================
   Stage: UI theme - <html data-theme="dark"> recolours the app UI, the on-screen plan canvas and the 3D background.
   Exports (PDF / DXF / PNG) and the Sheets paper preview keep their normal print colours. */
var THEME={key:"jksp_theme"};
function themeIsDark(){return document.documentElement.getAttribute("data-theme")==="dark"}
/* screen-only colour map for the plan canvas: neutral greys invert to warm darks, strong colours are lifted and muted */
var _thC={};
function themeMapColor(v){if(typeof v!=="string")return v;var k=v;if(_thC[k]!==undefined)return _thC[k];var r,g2,b,a=1,m;var s=v.trim().toLowerCase();
 if(s[0]==="#"){if(s.length===4){r=parseInt(s[1]+s[1],16);g2=parseInt(s[2]+s[2],16);b=parseInt(s[3]+s[3],16)}else if(s.length>=7){r=parseInt(s.slice(1,3),16);g2=parseInt(s.slice(3,5),16);b=parseInt(s.slice(5,7),16);if(s.length===9)a=parseInt(s.slice(7,9),16)/255}else return (_thC[k]=v)}
 else if((m=s.match(/^rgba?\(([^)]+)\)$/))){var p=m[1].split(",").map(function(x){return parseFloat(x)});r=p[0];g2=p[1];b=p[2];if(p.length>3)a=p[3]}
 else if(s==="white"){r=g2=b=255}else if(s==="black"){r=g2=b=0}else return (_thC[k]=v);
 r/=255;g2/=255;b/=255;var mx=Math.max(r,g2,b),mn=Math.min(r,g2,b),L=(mx+mn)/2,S=0,H=0,d=mx-mn;
 if(d>1e-6){S=L>0.5?d/(2-mx-mn):d/(mx+mn);H=mx===r?((g2-b)/d+(g2<b?6:0)):mx===g2?((b-r)/d+2):((r-g2)/d+4);H*=60}
 if(d<0.17){L=0.09+0.83*(1-L);H=38;S=0.12}            /* paper, ink, grid, wall greys -> charcoal / parchment */
 else if(L>0.8){L=0.24;S=Math.min(S,0.35)}              /* pastel room fills -> deep muted tints */
 else{if(L<0.5)L=0.5+(0.5-L)*0.45;S=S*0.75}             /* door / window / dimension colours -> lifted, muted */
 function h2r(p,q,t){if(t<0)t+=1;if(t>1)t-=1;return t<1/6?p+(q-p)*6*t:t<1/2?q:t<2/3?p+(q-p)*(2/3-t)*6:p}
 var q=L<0.5?L*(1+S):L+S-L*S,pp=2*L-q,h=H/360,R=Math.round(h2r(pp,q,h+1/3)*255),G=Math.round(h2r(pp,q,h)*255),B=Math.round(h2r(pp,q,h-1/3)*255);
 return (_thC[k]="rgba("+R+","+G+","+B+","+a+")")}
function themeHookCanvas(){if(typeof g==="undefined"||!g||g.__thHooked)return;var P=CanvasRenderingContext2D.prototype;
 ["fillStyle","strokeStyle"].forEach(function(n){var D=Object.getOwnPropertyDescriptor(P,n);Object.defineProperty(g,n,{configurable:true,get:function(){return D.get.call(this)},
  set:function(v){D.set.call(this,(themeIsDark()&&!(typeof UI!=="undefined"&&UI.clean))?themeMapColor(v):v)}})});g.__thHooked=true}
function themeApply(t,save){document.documentElement.setAttribute("data-theme",t==="dark"?"dark":"light");if(save)try{localStorage.setItem(THEME.key,JSON.stringify(t))}catch(e){}
 var b=document.getElementById("bTheme");if(b){var dk=t==="dark";b.innerHTML=(dk?THEME.sun:THEME.moon)+"<span>"+(dk?"Light":"Dark")+"</span>";b.classList.toggle("on",false)}
 var mc=document.querySelector('meta[name="theme-color"]');if(mc)mc.setAttribute("content",t==="dark"?"#1a1a1a":"#16365c");
 if(typeof render==="function"&&typeof S!=="undefined"&&S)try{render()}catch(e){}if(window.V3&&V3.on&&typeof applyStyle==="function")try{applyStyle(V3.style)}catch(e){}}
THEME.moon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg>';
THEME.sun='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
/* 3D view: dusk background + matching fog in the dark theme (AutoCAD-style modes already dark) */
if(typeof applyStyle==="function"){var _thApply=applyStyle;applyStyle=function(){var r=_thApply.apply(this,arguments);try{if(themeIsDark()&&T3&&T3.scene&&!document.getElementById("v3d").classList.contains("cad")){T3.scene.background=new THREE.Color("#2a2724");if(T3.scene.fog)T3.scene.fog.color=new THREE.Color("#2a2724")}}catch(e){}return r}}
function themeInit(){themeHookCanvas();var b=document.getElementById("bTheme");if(b&&!b.__th){b.__th=1;b.onclick=function(){themeApply(themeIsDark()?"light":"dark",true)}}themeApply(themeIsDark()?"dark":"light",false)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",themeInit);else setTimeout(themeInit,0);
