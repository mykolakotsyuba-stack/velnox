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

1. `SVG_VB_DEFAULT` in `BuqBlueprintViewer.tsx` is only a fallback — actual `viewBox` comes from DB (`schema_viewbox` per table)
2. No `padding` on `.panelImage` in CSS — it breaks overlay alignment
3. `aspect-ratio` is set dynamically via inline style `viewBoxAspect(effectiveViewBox)` — NOT in CSS
4. Each table has its own SVG at `/velnox/images/products/<table-slug>/schema.svg` — the `/velnox` prefix is `basePath`, never omit it

---

## Project Structure

```
src/
  features/
    products/         ← product category pages + product cards
      ProductTemplate/blocks/BuqBlueprintViewer.tsx  ← SVG viewer with hover highlights
  entities/
    product/model/types.ts  ← ProductSpecs type
  widgets/
    CtaBlock/         ← CTA section with contact modal (onModalOpen/onModalClose props)
    DistributorsBlock/ ← distributors grid with order modal
public/
  images/products/    ← per-table directories with SVG schemas, photos, drawings
docs/
  svg-workflow.md     ← full SVG integration guide
```