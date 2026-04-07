---
description: Rules for working with SVG technical drawings — CorelDRAW export, coordinate system, overlay alignment
---

# SVG Technical Drawings — Rules

Full guide: `velnox-frontend/docs/svg-workflow.md`

## CorelDRAW Export (CRITICAL)

Export → SVG with these exact settings:
- **Export text as: Text** (NOT Curves — curves destroy `<text>` elements, breaks everything)
- Embed images: Yes
- Embed font in file: Yes
- Character subset: Used Only
- Save to Desktop with ASCII filename (Cyrillic path breaks export → file is ~468 bytes)

## Coordinate System

CorelDRAW places content at **negative Y coordinates** in SVG space. The viewBox must target the actual drawing area, not (0,0).

Current BUQ bearings viewBox: `7000 -117700 13600 7400`

To find viewBox for a new drawing, run the Python coordinate finder in `velnox-frontend/docs/svg-workflow.md` section 2.

## SVG Processing Before Use

Always run the processing script (docs/svg-workflow.md section 3) to:
1. Remove DOCTYPE
2. Set correct viewBox, width, height, preserveAspectRatio
3. Validate XML with `ET.fromstring()` — if this fails, do NOT deploy

## Overlay Alignment Rules

File: `velnox-frontend/src/features/products/ProductTemplate/blocks/BuqBlueprintViewer.tsx`

- `SVG_VB` constant **must equal** the viewBox in `bearings-schema.svg`
- **No `padding`** on `.panelImage` in CSS — padding shifts image while overlay fills container → circles appear offset
- `aspect-ratio` in CSS = `viewBox_width / viewBox_height` (currently `13600 / 7400`)
- Overlay SVG: `position: absolute; top:0; left:0; width:100%; height:100%; pointer-events:none`

## Circle Center Calculation (DIM_LABELS)

SVG `<text>` x,y = baseline + left anchor. Circle must be centered on the visible letter:

```
circle_cx = text_x + half_text_width
circle_cy = text_y - half_cap_height
```

Font metrics (Helvetica, CorelDRAW):
- fnt0 (282px): HALF1=78 (1 char), HALF2=155 (2 chars), CAP0=102
- fnt1 (353px): HALF1_F1=97 (1 char), CAP1=127

## Static File Path

SVG files in `public/images/schemes/` are served at `/velnox/images/schemes/filename.svg`  
The `/velnox` prefix is `basePath` in `next.config.mjs` — never omit it.