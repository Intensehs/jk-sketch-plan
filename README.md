# CTAK BIM Module (web)

Static, offline-capable web version of CTAK BIM Module (formerly JK Sketch Plan; CTAK Construction).
Open `index.html` from any static host. Everything is in one file (three.js, dxf-parser inlined); no backend, no WebAssembly.

- Drawing tools of v1.4 (walls, doors, windows, levels, structure, annotate, modify), 3D view (all levels stacked, elevations, sections, mouse / one-finger orbit)
- Export PDF / DXF / PNG as browser downloads (Share button on phones)
- Import IFC (IFC2x3 / IFC4) and DXF exported from Revit -> editable walls, doors, windows, levels
- Installable PWA, works offline after the first visit. Drawings are stored in this browser (localStorage).

## Source
Readable sources are in `src/` (`shell.html` + `*.js`). Every tool is marked with a `/* Stage: ... */` comment (drawing tools, modify, annotate, structure, levels, 3D view, import, export). `src/build.py` inlines them into `index.html`.

## Themes
Top bar button **Dark / Light** (tooltip "Theme") switches between the default light theme and a classic dark theme; the choice is saved in this browser (`jksp_theme`). Exports always use print colours.

## Android APK
Release APKs live in `releases/`. They must be zipaligned and signed with APK Signature Scheme v1 + v2 + v3 (`apksigner`, not `jarsigner` alone). Android 11+ rejects `targetSdk >= 30` packages that only have JAR (v1) signing.

```bash
export JKSP_KEYSTORE=/path/to/jksp.keystore   # PKCS12, alias jksp; do not commit
export JKSP_STOREPASS=...                     # do not commit
scripts/sign_apk.sh unsigned.apk releases/CTAK_BIM_Module_v2.1.4.apk
```

The script strips any previous JAR signature, runs `zipalign -p 4`, then `apksigner sign --v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled true`, and verifies. Needs Android SDK build-tools on `PATH` or `ANDROID_HOME`. Keep `jksp_*` web storage keys unchanged.
