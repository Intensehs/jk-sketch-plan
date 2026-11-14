#!/usr/bin/env python3
"""Inline web/src/* into the single offline file web/index.html."""
import pathlib
R=pathlib.Path(__file__).resolve().parent; S=R/"src"
ICONS={
"undo":'<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
"redo":'<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>',
"fit":'<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><rect x="8" y="8" width="8" height="8" rx="1"/>',
"clean":'<rect x="2.5" y="4" width="19" height="16" rx="2"/><path d="M15.5 4v16M15.5 14.5h6"/>',
"menu":'<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>',
"levels":'<path d="m12 3 9 4.5-9 4.5-9-4.5z"/><path d="m3 12 9 4.5 9-4.5"/><path d="m3 16.5 9 4.5 9-4.5"/>',
"props":'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M15 3v18"/>',
"close":'<path d="m15 18-6-6 6-6"/>',
"cad":'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="m8 16 4-9 4 9M9.5 13h5"/>',
"spin":'<path d="M21 12a9 9 0 1 1-2.64-6.36L21 8"/><path d="M21 3v5h-5"/>',
"roof":'<path d="M2.5 11 12 4l9.5 7"/><path d="M5 9.2V20h14V9.2"/>',
"tag":'<path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
"grid":'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>',
"img":'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
"dxf":'<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v5h5"/><path d="m10 12.5-2 2.5 2 2.5M14 12.5l2 2.5-2 2.5"/>',
"cube":'<path d="M21 8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7z"/><path d="M3.3 7 12 12l8.7-5M12 22V12"/>',
"sofa":'<path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/><path d="M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0z"/><path d="M4 18v2M20 18v2"/>',
"draw":'<rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M3 9.5h18M3 14.5h18M9 4v5.5M15 4v5.5M12 9.5v5M7 14.5V20M17 14.5V20"/>',
"wall":'<rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M3 9.5h18M3 14.5h18M9 4v5.5M15 4v5.5M12 9.5v5M7 14.5V20M17 14.5V20"/>',
"move":'<path d="M5 9 2 12l3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/>',
"size":'<path d="M4 8v8M20 8v8M4 12h16"/><path d="m7.5 9.5-2.5 2.5 2.5 2.5M16.5 9.5l2.5 2.5-2.5 2.5"/>',
"room":'<rect x="3" y="3" width="18" height="18" rx="1.5"/><path d="M3 12h8v9M11 3v4.5"/>',
"door":'<path d="M2 21h20"/><path d="M13 4h3a2 2 0 0 1 2 2v15"/><path d="M13 3.5v17.5l-6-1.8V5.2z"/><path d="M10.2 12.2v.1"/>',
"del":'<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>',
"focus":'<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>',
"unfocus":'<path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3"/>',
"import":'<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
"sliders":'<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M2 14h4M10 8h4M18 16h4"/>',
}
def svg(n): return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">'+ICONS[n]+'</svg>'
h=(S/"shell.html").read_text(encoding="utf-8")
for k in ICONS: h=h.replace("__%s__"%k,svg(k))
V=R/"vendor"
h=h.replace("/*__THREE__*/","/* three.js r128 (MIT) - inlined for offline use */\n"+(V/"three.min.js").read_text(encoding="utf-8")).replace("/*__ORBIT__*/","/* three.js r128 OrbitControls (MIT) */\n"+(V/"OrbitControls.js").read_text(encoding="utf-8"))
import json
V13="\n".join((S/f).read_text(encoding="utf-8") for f in ["levels.js","struct.js","modify.js","annot.js","views.js","props.js","types.js","ui14.js","tdim.js"]).replace("__ICONS_JSON__",json.dumps(ICONS))
h=h.replace("/*__V13__*/",V13).replace("/*__IMP__*/",(S/"imp_parse.js").read_text(encoding="utf-8")+"\n"+(S/"imp_ui.js").read_text(encoding="utf-8")).replace("/*__THEME__*/",(S/"theme.js").read_text(encoding="utf-8")).replace("/*__CXM__*/",(S/"ctxmenu.js").read_text(encoding="utf-8")).replace("/*__DXFP__*/","/* dxf-parser 1.1.2 (MIT) */\n"+(V/"dxf-parser.min.js").read_text(encoding="utf-8"))
h=h.replace("/*__FURN__*/",(S/"furn.js").read_text(encoding="utf-8"))
h=h.replace("/*__V3D__*/",(S/"v3d.js").read_text(encoding="utf-8")+"\n"+(S/"f3d.js").read_text(encoding="utf-8"))
h=h.replace("/*__LIB__*/",(S/"lib.js").read_text(encoding="utf-8")).replace("/*__APP__*/",(S/"app.js").read_text(encoding="utf-8")+"\n"+(S/"sheet.js").read_text(encoding="utf-8"))
import base64,io
from PIL import Image
LG=pathlib.Path("/workspace/ctak_logo.png");LJ=R/"vendor"/"ctak_logo.jpg"
if not LJ.exists():
    im=Image.open(LG).convert("RGB");im.thumbnail((360,520));im.save(LJ,"JPEG",quality=88)
im=Image.open(LJ);h=h.replace("__LOGO_B64__",base64.b64encode(LJ.read_bytes()).decode()).replace("__LOGO_W__",str(im.size[0])).replace("__LOGO_H__",str(im.size[1]))
D=R.parent/"dist";D.mkdir(exist_ok=True);(D/"index.html").write_text(h,encoding="utf-8");(R/"index.html").write_text(h,encoding="utf-8"); print("built",R/"index.html",len(h))
