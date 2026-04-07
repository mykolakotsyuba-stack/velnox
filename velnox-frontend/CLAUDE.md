# Velnox Frontend — Rules for AI Assistants

## Deploy

**ALWAYS use the expect script. NEVER run npm/node manually.**

```bash
cd /Users/localmac/Desktop/Велнокс
expect deploy_frontend_auto.exp
```

Do not run `npm run build`, `npm run start`, or any npm commands directly.  
Do not cd outside of `/Users/localmac/Desktop/Велнокс/` when deploying.

---

## Product Pages & SVG Drawings

Before editing any file in `src/features/products/`, read:

- [`src/features/products/CLAUDE.md`](src/features/products/CLAUDE.md) — short rules: what not to touch, key constants
- [`docs/svg-workflow.md`](docs/svg-workflow.md) — full SVG workflow: CorelDRAW export, Python processing, coordinate formulas, deploy checklist

**Critical rules (short version):**

1. `SVG_VB` constant in `BuqBlueprintViewer.tsx` must match the `viewBox` in `bearings-schema.svg`
2. No `padding` on `.panelImage` in CSS — it breaks overlay alignment
3. `aspect-ratio` in CSS must equal `viewBox_width / viewBox_height`
4. SVG served at `/velnox/images/schemes/` — the `/velnox` prefix is `basePath`, never omit it

---

## Project Structure

```
src/
  features/
    products/         ← product category pages + product cards
      ProductTemplate/blocks/BuqBlueprintViewer.tsx  ← SVG viewer with hover highlights
  entities/
    product/model/types.ts  ← ProductSpecs type
public/
  images/schemes/     ← SVG technical drawings
docs/
  svg-workflow.md     ← full SVG integration guide
```