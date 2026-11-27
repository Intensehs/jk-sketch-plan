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
