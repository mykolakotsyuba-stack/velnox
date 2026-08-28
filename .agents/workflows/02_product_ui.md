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
## Підписи характеристик — єдине джерело (2026-08-27)

Підписи колонок беруться **тільки з БД** (`translations` для `spec_definitions`, uk/en/pl):
картка — через `spec.label` у `SpecsTable.tsx`, категорійні таблиці — через `spec_labels`
з `/api/v1/product-tables/{slug}` у `buildCols` (`label: sl[key] || key`).

⚠️ У `velnox-frontend/messages/{uk,en,pl}.json` лежить **мертвий** словник підписів
(`product.d_mm`, `product.cdyn_kn`, `bearingsPage.cols.*` …) — 0 використань у коді,
але він застарілий. Правити треба сідер, не месиджі.

**Правило ключа (власник):** ключ = назва + буква + одиниця, а не буква. Однакова буква
з різним змістом у різних таблицях → окремі ключі: `hub_d_mm`/`hub_bore_d_mm`,
`hub_C_mm`/`hub_dshape_C_mm`, `N_mm`/`mount_N_mm`, `d1_mm`/`needle_d1_mm`/`agro_d1_mm`,
`A1_mm`/`flange_A1_mm`, `d_mm`/`shaft_d_mm`.

**Прод, коли змінився лише сидер — без rebuild:** rsync `DatabaseSeeder.php` у
`~/velnox/api/database/seeders/`, потім `docker compose cp` того ж файла в контейнер
`velnox-api:/var/www/database/seeders/` і `docker compose exec -T velnox-api
php artisan db:seed --class=DatabaseSeeder --force`. Код у прод-образі запечений —
без `cp` контейнер бачить старий файл. Сторінки після цього ще ~хвилину віддають
старий ISR-кеш: питати кожну двічі.

### Два правила, куплені регресією 2026-08-28

**1. Перейменував або розділив ключ у сідері — грепни фронт на старий ключ.**
Категорійні сторінки більше не тримають ключі в коді (усі чотири будують колонки
з `spec_columns`), але один рукописний список лишився: `DIMENSIONAL_KEYS` у
`ProductTemplate/blocks/SpecsTable.tsx` — він задає, які рядки йдуть першим блоком
на картці. Ключа немає в списку → рядок з'їжджає в кінець таблиці.

```bash
grep -rn --include="*.ts" --include="*.tsx" "'<старий_ключ>'" velnox-frontend/src
```

**2. Після seed-деплою перевіряй КАТЕГОРІЙНІ сторінки в браузері, не тільки картки.**
Картка рендериться на сервері — її видно через `curl`. Категорійна тягне таблиці
клієнтським `fetch` у `useEffect`, тож у HTML від `curl` даних немає взагалі, і
поламка виглядає як порожня сторінка. Саме так «—» замість трьох колонок на
/products/agro проскочило повз 655 автоперевірок API і виїхало на прод.

Мінімальна перевірка після деплою — по одній категорії кожного типу:
відкрити в браузері, порахувати комірки з «—» у колонках із одиницями.
