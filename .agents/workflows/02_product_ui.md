---
description: Rules for product category pages and product cards (bearings, hubs, etc.) — layout, tables, blueprint viewer
---

# Product Pages — Rules

## Key Files

| Component | Path |
|---|---|
| Blueprint viewer (BUQ) | `velnox-frontend/src/features/products/ProductTemplate/blocks/BuqBlueprintViewer.tsx` |
| Blueprint CSS | `velnox-frontend/src/features/products/ProductTemplate/blocks/BuqBlueprintViewer.module.css` |
| Product types | `velnox-frontend/src/entities/product/model/types.ts` |
| SVG drawing | `velnox-frontend/public/images/schemes/bearings-schema.svg` |

## BuqBlueprintViewer — What Not to Touch

1. **`SVG_VB` constant** — must always match `viewBox` in `bearings-schema.svg`. Change both together or break nothing.
2. **`.panelImage` CSS** — no `padding`. It breaks overlay alignment (see `01_svg_rules.md`).
3. **`DIM_LABELS` array** — coordinates are calculated from font metrics, not guessed. See `docs/svg-workflow.md` section 4 before editing.
4. **`aspect-ratio`** in `.blueprintWrapper` — must equal `viewBox_width / viewBox_height`.

## Tables

Rules for product spec tables: `velnox-frontend/src/features/products/` — see table components.
- Use existing render functions, don't rewrite table logic
- Tables have horizontal scroll on mobile — don't remove `overflow-x: auto`
- Column headers use `text-transform: uppercase` + `letter-spacing`

## Fullscreen Modal

`BuqBlueprintViewer` has a fullscreen modal (`isFullscreen` state).  
Modal shows drawing (flex:2) + specs table (flex:1) side by side.  
On mobile (<1024px) they stack vertically.

## Static Assets Path

All static files use basePath `/velnox`:
- SVG drawings: `/velnox/images/schemes/`
- Product images: `/velnox/images/products/`

Never use relative paths or paths without the `/velnox` prefix.