---
description: How to deploy and work with the Velnox project
---

## ⚠️ TWO SERVERS — DEV and PROD (since 2026-06-02)

There are now **two** servers. Read this before any deploy.

| | DEV (test) | PROD (live) |
|---|---|---|
| Host | `ssh user@mail.irbis.ua` (`12345678`) | `ssh admin-site@velnox.eu` (`velnox-admin`) |
| URL | `http://mx.irbis.ua/velnox/` (sub-path) | `https://velnox.eu` (domain root) |
| Run mode | native systemd (`/srv/projects/velnox`) | **Docker** (`/home/admin-site/velnox`), isolated from other projects |
| DB | SQLite (live, seeded) | SQLite (copy of dev), bind-mount `data/database.sqlite` |
| Proxy | shared nginx, sub-path | host nginx → containers `127.0.0.1:8505/8506`, TLS |

**Golden rule: edit → deploy & TEST on DEV → only then ship to PROD.** Never deploy
untested code straight to prod. DEV is never reconfigured for prod.

**Deploy commands:**
```bash
# DEV (existing expect scripts — unchanged):
expect deploy_frontend_auto.exp      # or clean_deploy_frontend.exp
expect deploy_api_auto.exp
# PROD (after dev is verified):
export PROD_SSH_PASS='velnox-admin'
./deploy_prod.sh      # backup -> rsync code -> docker compose BUILD -> up -> smoke test
./backup_prod.sh      # DB + storage snapshot anytime
```

**PROD-specific gotchas (full details: Claude memory `prod-velnox-eu.md`):**
- `next.config.mjs` switches via build-env `DEPLOY_TARGET=prod`: prod = root domain,
  dev = `/velnox` sub-path. The frontend Dockerfile sets it. Default = dev.
- Keep using the `/velnox/` prefix on ALL asset paths (rule #9). On prod, host nginx
  `location ^~ /velnox/` strips it and re-routes — code/DB stay identical to dev.
- SSR data fetch reads env **`INTERNAL_API_URL=http://velnox-api/api/v1`** (set in
  `deploy/docker-compose.yml`). Missing it → 500 on category/product pages.
- `public/` is **baked into the Docker image** (`COPY public`). New/changed images
  need `docker compose build` (which `deploy_prod.sh` does) — a bare `restart` won't
  pick them up.
- Media cache = `max-age` WITHOUT `immutable` (a bad response can't stick for a year);
  `_next/static` stays immutable (content-hashed).
- The bind-mounted `data/database.sqlite` is chowned to www-data by the api container
  → edit it on the host with `sudo`. Always `./backup_prod.sh` before DB edits.
- Prod artifacts in repo: `deploy/docker-compose.yml`, `deploy/velnox.eu.nginx.conf`,
  `velnox-{frontend,api}/Dockerfile`, `velnox-api/docker/start.sh`, `deploy_prod.sh`,
  `backup_prod.sh`. See `DEPLOYMENT_GUIDE.md` → "PROD — velnox.eu".

---

# Always follow these rules for Velnox:
1. **Never run or install** Node.js, PHP, or Composer locally. 
2. The local machine is ONLY for code editing and syncing.
3. Always refer to `/Users/localmac/Desktop/Велнокс/DEPLOYMENT_GUIDE.md` for architecture and deployment info.
4. Testing is done by deploying to **DEV** (`mx.irbis.ua`) first; promote to **PROD** (`velnox.eu`) only after dev verification (see the two-servers table above).
5. **DATABASE BACKUP**: BEFORE every commit, you MUST create a backup of the SQLite database.
   - Command: `cp velnox-api/database/database.sqlite velnox-api/database/backups/$(date +%Y%m%d_%H%M%S)_database.sqlite`
6. **DUAL COMMIT & PUSH**: Every change MUST be committed locally AND pushed to GitHub (`origin main`).
7. **RSYNC SAFETY** (added 2026-05-19): All deploy `.exp` scripts MUST include `--exclude "database/*.sqlite" --exclude "storage/*.sqlite"` in rsync commands. Without this, the local empty DB overwrites the server's seeded database → complete data loss. Verify this exclusion before running any deploy script.
8. **SPEC KEY NAMESPACING** (added 2026-05-19): Bearings spec keys have no prefix (`J_mm`, `d_mm`, `L`, etc.). All other categories use a category prefix (`hub_J_mm`, `hub_D_mm`, `seal_*`, etc.). Same key name in different categories = different semantic meaning → must be different keys.
9. **IMAGE PATH RULE** (added 2026-05-19, corrected after testing): ALL image paths everywhere (DB, hardcoded in components, fallbacks) MUST include the full `/velnox/` prefix: `/velnox/images/...`, `/velnox/models/...`. Reason: nginx `location /velnox/` proxies to Next.js; browser requests without `/velnox/` return 404. `<Image>` with `unoptimized: true` renders src AS-IS without adding basePath. Diagnosis: nginx `GET /images/... 404` = missing `/velnox/` prefix.
10. **3D MODEL CHECK** (added 2026-05-20): When adding product cards (Phase 2), check `public/models/{ARTICLE-SLUG}.glb`. If exists → add `product_assets` record: `entity_type='product'`, `type='model_3d'`, `path='/velnox/models/{ARTICLE-SLUG}.glb'`. ⛔ STOP — owner confirms: if 3D model exists → confirm it renders and works correctly on the card; if not → confirm standard template. 3D models for current products: BUQ-309-2T3H ✅, BUCR-SG-309-S2 ✅, BUP-207-X3L ✅. T1 and T2 — no 3D models. Never hardcode slug lists in frontend code (RULE 1) — template switches automatically via DB.
11. **TABLE UPDATE SCENARIOS** (added 2026-05-20): Before updating any product_table, check whether it exists in the seeder.
    - **Scenario A — data in DB but NOT in seeder**: Treat as clean slate. Ignore all existing DB data (products, specs, assets, images, old JSON files). Ask owner for fresh data.
    - **Scenario B — data in BOTH DB and seeder, task is "update"**: Carefully read DB, seeder, and new file/spec. Find all discrepancies. ⛔ STOP — present findings to owner, confirm understanding before making any changes.
    - Reason: seeder = owner-verified final data. DB without seeder = unverified draft.
12. **DESCRIPTION VALIDATION** (added 2026-05-20): Before adding any product description to the seeder: (1) fix grammar in all locales; (2) verify ALL numeric values (d, J, L, B, Cdyn, Co, Pu, mass) against `product_specs` in DB — zero discrepancies allowed; (3) show corrected text in chat and get owner confirmation. Reason: owner may copy values from documents which may contain errors — DB is the single source of truth for specs.
13. **⛔ NEVER ENABLE NEXT IMAGE OPTIMIZER** (added 2026-05-29): `next.config.mjs` has `images: { unoptimized: true }` — this is INTENTIONAL because **sharp is NOT installed on the server**. Removing it (or setting `false`) makes Next.js try to optimize via sharp → **ALL site images return 500/404**, not just the ones you touched. When asked to improve Lighthouse/PageSpeed, do NOT enable the built-in optimizer. (Full perf rules: Claude memory `feedback_frontend_performance.md`.)
14. **RESPONSIVE IMAGES ARE MANUAL** (added 2026-05-29): Because `unoptimized:true` disables srcset, Next `<Image>` `sizes`/`quality` do nothing for file size. For adaptive hero/background images, generate an `-m.webp` (~800px) variant and use native `<picture>` + `<source media="(max-width:820px)">` with a raw `<img>` (`fetchPriority="high"` + `loading="eager"` on the LCP element). Example: `src/app/[locale]/home/ProductSlider.tsx`.
15. **WEBP GENERATION = PYTHON PILLOW** (added 2026-05-29): On this machine `sips -s format webp` does NOT create a file (lists path, writes nothing); `cwebp`/`ffmpeg` may be absent. Use Python Pillow: `Image.open(src).convert('RGB')`, `.thumbnail((800,800))` for mobile, `.save(out, 'WEBP', quality=82, method=6)`. Verify resulting file size.
16. **LCP: GATE HERO ENTRANCE ANIMATIONS** (added 2026-05-29): If hero background/title fades in via CSS opacity/entrance animation, the browser records LCP only after the animation settles — a big FCP↔LCP gap (e.g. 1.1s→4.4s) means perf work on images alone won't help. Gate entrance animations behind a `firstPaint` flag so the first frame renders at final state instantly; resume animation on first slide change. SSR-consistent → no hydration flash. Example: `ProductSlider.tsx` `firstPaint` + `.bgLayerInstant`.
17. **CURL DIAGNOSTIC** (added 2026-05-29): `curl /velnox/uk/` (trailing slash) → 308 redirect → 10 bytes. Use `curl -sL "http://mx.irbis.ua/velnox/uk"` (no slash, `-L` follows redirect).
18. **⛔ DEPLOY DOES NOT RUN `npm install`** (added 2026-05-29): `deploy_frontend_auto.exp` only runs `npm run build` on the server — no install/ci. Adding a package to package.json is NOT enough; the server won't have it and the build fails with "Cannot find module". To add a dependency: add to package.json AND install it on the server separately (or temporarily add `npm install` to the deploy script). Build only happens on the server (no local node), so such errors only surface after deploy.
19. **RENDER-BLOCKING CSS = MOBILE LCP CEILING** (added 2026-05-29): Lighthouse mobile flags render-blocking CSS (~310ms) as the main remaining LCP lever — the filmstrip is blank until CSS loads. Image preload + smaller images squeeze the rest but CSS is the ceiling. The only in-framework fix is `experimental.optimizeCss: true` (inlines critical CSS), but it requires the `critters` package which isn't installed (see #18 → build fails). Do it deliberately: critters in package.json → install on server → enable flag → verify build. Expected: ~-300ms mobile LCP/FCP.
20. **METADATA/`<title>` ON EVERY ROUTE, LOCALIZED** (added 2026-05-29): Root layout (`src/app/[locale]/layout.tsx`) sets no title → pages without their own metadata trigger Lighthouse "no `<title>`" (hurts SEO/a11y). Project pattern (about/news/products): `const meta: Record<locale,{title,description}>` + `export async function generateMetadata` selecting by locale. Every new page must add localized title/description (uk/en/pl) + OG. Home fixed 2026-05-29 → SEO 82→100.
21. **PDF CATALOG LINKS** (added 2026-06-03): All PDF download buttons MUST use `/velnox/files/velnox-catalog-{locale}.pdf` (locale-aware, static file in `public/files/`). NEVER use `/{locale}/presentation.pdf` — Next.js treats it as a page route, returns 200 HTML, and crawlers cascade into fake `/presentation.pdf/about` URLs. When replacing catalogs with real localized versions, swap the files — the code stays the same. Files: `velnox-catalog-uk.pdf`, `velnox-catalog-en.pdf`, `velnox-catalog-pl.pdf`.
22. **SEO: CANONICAL + ALTERNATES + ROBOTS** (added 2026-06-03): Every page MUST use `seoMeta(locale, pathname)` from `src/shared/lib/seo.ts` in its `generateMetadata`. This utility generates: `<link rel="canonical">` → `https://velnox.eu/{locale}{path}`, hreflang alternates for en/uk/pl, `og:url`, and `robots: noindex` when `DEPLOY_TARGET !== 'prod'`. Canonical always points to `velnox.eu` (prod domain) regardless of where the page is served. The Dockerfile runner stage MUST have `ENV DEPLOY_TARGET=prod` — without it, dynamic (ƒ) pages get `noindex` at runtime even though SSG pages built correctly. Dev is closed from indexing by design.
23. **PRODUCT PHOTO PIPELINE** (added 2026-08-25): Studio photo batches arrive as RGBA cut-outs with an *inconsistent* folder layout — always `find . -type d` first. Process with Pillow: crop to the **alpha bbox** + 30px margin, flatten onto **white** (the gallery wrapper is `#fff` and every existing photo is white RGB), save **WebP q82 method=6, long side ≤1200px** (the cap every existing photo/drawing in those folders already uses). Name `velnox-{article-slug}-photo-{N}.webp`, taking the slug from the **existing file in the folder**, not from the product slug in the DB — they differ (product `dhu-1-12r209-vx`, files `dhu-1-1-2r209-vx`). Order: photo-1 = full view of the part (never a thin side profile), the packaging shot goes last. Verify each folder against the catalogue by reading the article laser-etched on the part — a mis-filed frame turned up in batch 3.
    - ⛔ **Files go ONLY in `velnox-frontend/public/images/products/{table-slug}/`.** `velnox-api/public/...` serves nothing (dev rsyncs only `velnox-frontend/`); batch 2 (b30529c) put 21 photos there and they 404'd on dev for three months.
    - ⛔ **Seeder gallery must use `updateOrInsert` keyed on path**, not "insert if path missing" — the latter never updates `sort_order` on an already-seeded DB, so new photos collide with the existing main/drawing numbers. Photos get sort 1..N, then main, then drawings. If a table's gallery was ever moved from `entity_type='product_table'` to `'product'`, **delete the old table-level rows explicitly** or the main photo and drawings appear twice (bearings-t4, hubs-t2 had 10 and 15 entries instead of 7 and 11).
    - Deploy (DEV): `expect deploy_api_seed_only.exp` (rsync + `db:seed`, no migrate) then `expect clean_deploy_frontend.exp`. ⛔ `deploy_api_migrate_seed.exp` runs `migrate:fresh` — that **wipes the `leads` table** with real form submissions. Verify with a `curl` status check per file plus opening the card.
    - ⛔ **PROD: `deploy_prod.sh` does NOT seed.** It backs up, rsyncs, rebuilds the images and restarts — the photos get baked into the image, but the bind-mounted `data/database.sqlite` is preserved and `start.sh` only runs `migrate --force`, so **no new `product_assets` rows appear**. After every `./deploy_prod.sh` that carries seeder data, run the seeder inside the container: `sudo docker compose exec -T velnox-api php artisan db:seed --class=DatabaseSeeder --force`. The seeder is prod-safe — no truncate, no `migrate:fresh`, `leads` untouched. Verify with `curl -I https://velnox.eu/images/products/{table}/{file}` (prod nginx strips the `/velnox/` prefix).
