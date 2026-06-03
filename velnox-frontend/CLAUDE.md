# Velnox Frontend — Rules for AI Assistants

## Deploy — TWO servers (test on DEV, then PROD)

**NEVER run npm/node/docker locally.** Edit → deploy & test on **DEV** → only then **PROD**.

```bash
cd /Users/localmac/Desktop/Велнокс
# DEV (test) — http://mx.irbis.ua/velnox/  (sub-path, native)
expect deploy_frontend_auto.exp        # or clean_deploy_frontend.exp
# PROD (live) — https://velnox.eu       (root domain, Docker) — after DEV is verified
export PROD_SSH_PASS='velnox-admin' && ./deploy_prod.sh
```

- `prod` = domain root via build-env `DEPLOY_TARGET=prod` (frontend Dockerfile); `dev` = `/velnox` sub-path. Keep the `/velnox/` prefix on assets — prod nginx strips it.
- `public/`/images are **baked into the Docker image** → `deploy_prod.sh` rebuilds (a bare `restart` won't pick up new images).
- Do not run `npm run build/start` or `docker` locally; do not cd outside `/Users/localmac/Desktop/Велнокс/`.
- Full rules: `../.agents/workflows/00_server_rules.md` and `../DEPLOYMENT_GUIDE.md` (→ "PROD — velnox.eu").

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