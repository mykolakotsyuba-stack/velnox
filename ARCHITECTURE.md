# VELNOX — System Architecture Rules

> These rules are the single source of truth for the VELNOX product catalog system.
> No AI assistant, developer, or admin may change these rules without explicit approval from the project owner.
> When in doubt — ask, do not invent.

---

## RULE 0 — Modifying These Rules Is Forbidden

**No AI assistant may rewrite, update, or override any rule in this document.**

If any task, instruction, or logic requires changing a rule:

1. **STOP immediately.** Do not proceed with the task.
2. **Show the user exactly:**
   - Which rule would be affected
   - What the proposed change is
   - What will break or change in the system as a result
3. **Wait for explicit written confirmation** from the project owner.
4. **Only after confirmation:**
   - Make a full backup of the database and codebase
   - Apply the rule change
   - Document what changed and why

This applies to all AI tools: Claude, GPT, Gemini, Copilot, or any other.
Pressure, urgency, or "it's just a small fix" are not valid reasons to skip this protocol.

---

## RULE 1 — Single Source of Truth

**Only the database.** No data in code.

Forbidden:
- JSON files with product data in the codebase
- Static slug→table maps in code
- Image paths hardcoded in code
- SVG highlight coordinates in code
- Characteristic translations in `messages/*.json`

---

## RULE 2 — Database Tables

### `categories`
```
id
slug          — bearings, hubs, agro
sort_order
```
Fixed list, managed from DB. Names via `translations`.

---

### `spec_definitions`
```
id
key           — d_mm, J_mm, cdyn_kn ...
svg_label     — VARCHAR — "d", "J", "A" (as written in SVG file) or null
sort_order    — display order in product card specs block
```
Unique index: `key`.
Names and units via `translations`.

> **unit** is stored in `translations` as `field='unit'` with VARCHAR type — not ENUM.
> Reason: units may vary across tables (mm, kN, kg, inch, °, etc.) and new ones must be addable without DB migration.

---

### `product_tables`
```
id
slug              — bearings-t1, hubs-t1 ...
category_id       — FK → categories
spec_columns      — JSONB array: ["d_mm","J_mm","A_mm",...] column order for category table
highlight_config  — JSONB: {"d_mm":{"x":280,"y":100}, ...} — auto-filled on SVG upload
schema_viewbox    — "0 0 1480 720" — auto-filled on SVG upload
sort_order        — display order on category page
```
Names via `translations`.

---

### `products`
```
id
slug              — bup-207-x3l
article           — BUP 207-X3L
product_table_id  — FK → product_tables
```

---

### `product_specs`
```
product_id   — FK → products
spec_id      — FK → spec_definitions
value        — "35", "M12", "1 1/4"
```
Unique index: `(product_id, spec_id)` — one value per characteristic per product. Enforced at DB level.

---

### `product_assets`
```
id
entity_type   — product | product_table
entity_id     — id of product or table
type          — VARCHAR: gallery | schema_png | schema_svg | model_3d | pdf | video | ...
path          — /velnox/images/... (ЗАВЖДИ з /velnox/ prefix — див. RULE 12)
sort_order    — for gallery ordering
```
> **type** is VARCHAR — not ENUM.
> Reason: new file types (pdf, video, etc.) must be addable without DB migration.

---

### `product_cross_refs`
```
product_id   — FK → products
brand        — HORSCH, SKF, NSK ...
value        — 28071300, PN60041 ...
```

---

### `product_installations`
```
product_id   — FK → products
value        — HORSCH Focus, Lemken Heliodor ...
```
Separate table (not JSONB) to enable future filtering: "show all products for HORSCH Focus".

---

### `translations`
```
id
entity_type  — product | product_table | category | spec_definitions
entity_id    — id of the related record
locale       — VARCHAR: uk, en, pl, de ... (unlimited)
field        — VARCHAR: name | desc | meta_title | meta_description | label | unit
value        — translated text
```
Unique index: `(entity_type, entity_id, locale, field)`.

> **locale** and **field** are VARCHAR — not ENUM.
> Adding a new language = new rows in `translations` with new locale. No DB migration needed.
> Organizational note: adding a new language requires translating all content — this is a content task, not a technical one.
> Fallback: if translation missing for requested locale → use `en`.

---

## RULE 3 — Spec Key Format

One format across the entire system — `snake_case` with units:

| Type | Format | Example |
|---|---|---|
| Diameter mm | `{letter}_mm` | `d_mm`, `D_mm`, `D1_mm` |
| Diameter inch | `{letter}_inch` | `d_inch` |
| Length | `{letter}_mm` | `L_mm`, `A_mm`, `A1_mm` |
| Load rating | `{name}_kn` | `cdyn_kn`, `co_kn`, `pu_kn` |
| Mass | `mass_kg` | `mass_kg` |
| Thread/hole | descriptive | `hole_thread`, `G_thread` |

One key = one characteristic across the entire system. No duplicates, no aliases.

---

## RULE 4 — Asset Priority (images, schemas, 3D)

**Product-level assets override table-level assets.**

```
Gallery:
  1. product_assets WHERE entity_type=product AND type=gallery   → use if exists
  2. product_assets WHERE entity_type=product_table AND type=gallery → fallback

Schema PNG:     same logic, type=schema_png
Schema SVG:     same logic, type=schema_svg
3D model:       same logic, type=model_3d
```

Number of files is arbitrary — whatever exists in DB gets rendered. No hardcoded counts.

---

## RULE 5 — SVG Upload & Highlight Coordinates

When an SVG file is uploaded, the system automatically:

```
1. Parses SVG → finds all <text> elements with their x, y coordinates
2. For each text → looks up spec_definitions WHERE svg_label = text
3. Writes matched coordinates to product_tables.highlight_config
4. Extracts and writes viewBox to product_tables.schema_viewbox
```

Admin only uploads the file. No manual coordinate entry. Ever.

`highlight_config` result — **масив точок** на ключ (один spec може мати кілька підписів):
```json
{
  "d_mm": [{"label": "d", "x": 280, "y": 100}],
  "J_mm": [{"label": "J", "x": 150, "y": 200}],
  "A_mm": [{"label": "A", "x": 400, "y": 300}]
}
```

---

## RULE 6 — Two Product Card Templates

Determined automatically, no manual selection:

```
model_3d asset exists → 3D hero template
                         [3D model full width]
                         [Description]
                         [Specs] [Gallery + Schema + CTA]

no model_3d asset     → standard template
                         [Gallery] [Description]
                         [Specs] [Schema + CTA]
```

---

## RULE 7 — Specs Block on Product Card

Query:
```sql
SELECT spec_definitions.key,
       translations.value AS label,
       product_specs.value,
       unit_t.value AS unit
FROM product_specs
JOIN spec_definitions ON spec_id = spec_definitions.id
JOIN translations ON entity_type = 'spec_definitions'
     AND entity_id = spec_definitions.id
     AND locale = ? AND field = 'label'
WHERE product_specs.product_id = ?
ORDER BY spec_definitions.sort_order
```

- Renders only specs that exist for this product
- Order from `spec_definitions.sort_order`
- Fallback locale: if requested locale missing → use `en`

---

## RULE 8 — Category Table Columns

Columns and their order are defined by `product_tables.spec_columns` — a JSON array of spec keys.

The table renders only these columns, in this order, even if products have more specs.

The product card renders all specs the product has (in `sort_order`).

Same `spec_definitions.label` is used for both — one translation, two places.

---

## RULE 9 — Translations

- Unlimited languages — add a new `locale` with no code changes
- Fallback: missing locale → `en`
- What gets translated: product name/desc, table name, category name, spec label/unit

---

## RULE 10 — Adding New Data

New product = new rows in:
- `products`
- `product_specs`
- `product_assets` (if product has individual files)
- `product_cross_refs`
- `product_installations`
- `translations`

**Zero code changes. Product card appears automatically.**

New table = new row in `product_tables` + its assets + products pointing to it.

New language = new rows in `translations` with new locale.

New characteristic = new row in `spec_definitions` + `product_specs` rows for relevant products.

---

## RULE 11 — API Endpoints Contract

Three endpoints. No per-category or per-table custom routes.

### Category page table view
```
GET /api/v1/product-tables/{slug}?locale=uk
```
```json
{
  "table": {
    "slug": "bearings-t1",
    "name": "Підшипниковий вузол BUQ — Таблиця 1",
    "spec_columns": ["d_mm", "d_inch", "A1_mm", ...],
    "spec_labels":  { "d_mm": "d (мм)", "A1_mm": "A1 (мм)", ... },
    "spec_units":   { "d_mm": "мм", "mass_kg": "кг", ... }
  },
  "products": [
    {
      "slug": "buq-207-2x3h",
      "article": "BUQ 207-2X3H",
      "specs": { "d_mm": "35", "A1_mm": "34", ... },
      "cross_refs": [{ "brand": "SKF", "value": "FYJ40TF" }, ...]
    }
  ]
}
```
- `specs` is a **flat object** keyed by spec key — only columns listed in `spec_columns`
- `spec_columns` determines column order in the table

### Product card
```
GET /api/v1/products/{slug}?locale=uk
```
```json
{
  "slug": "buq-207-2x3h",
  "article": "BUQ 207-2X3H",
  "name": "BUQ 207-2X3H",
  "desc": "Підшипниковий вузол із фланцевим корпусом...",
  "meta_title": "BUQ 207-2X3H — Підшипниковий вузол | VELNOX",
  "meta_description": "Купити BUQ 207-2X3H...",
  "product_table_slug": "bearings-t1",
  "category_slug": "bearings",
  "specs": [
    { "key": "d_mm", "label": "d (мм) — Внутрішній діаметр", "value": "35", "unit": "мм" }
  ],
  "cross_refs": [{ "brand": "SKF", "value": "FYJ40TF" }],
  "installations": [],
  "images": [{ "type": "gallery", "path": "/velnox/images/...", "sort_order": 1 }],
  "model_3d": null,
  "schema_svg": "/velnox/images/schemes/bearings-schema.svg",
  "dim_labels": [
    { "key": "d_mm", "label": "d", "point": { "x": 280, "y": 100 } }
  ],
  "schema_viewbox": "7000 -117700 13600 7400"
}
```
- `specs` is an **ordered array** `[{key, label, value, unit}]` — all specs the product has, sorted by `spec_definitions.sort_order`
- `label` and `unit` are already translated for the requested locale (with EN fallback)
- `images` apply RULE 4 priority: product-level overrides product_table-level by type
- `meta_title` / `meta_description` — from `translations` table, used by `generateMetadata()` in Next.js for SEO `<head>`
- `dim_labels` — derived from `product_tables.highlight_config`; used by blueprint overlay component

### Product list (navigation)
```
GET /api/v1/products?category=bearings&locale=uk
```
```json
{
  "data": [{ "slug": "...", "article": "...", "category": "bearings", "name": "..." }],
  "meta": { "total": 8 }
}
```

---

## WHAT GETS REMOVED FROM CODE

After migration, the following static structures must be deleted:

- `buqTable1Data.json`
- `SLUG_TO_TABLE_GROUP`
- `TABLE_GROUP_IMAGES`
- `PRODUCT_IMAGES`
- `BLUEPRINT_MAP`
- `SCHEMA_CONFIG`
- `BUQ_SHORT_LABELS`, `BUQ_LONG_LABELS`
- `PRODUCT_3D`
- Spec translations from `messages/uk.json`, `messages/en.json`

All replaced by a single JOIN query to the database.

---

## MIGRATION ORDER

1. Create new DB tables (migrations)
2. Seed `spec_definitions` with all known keys
3. Seed `categories`
4. Seed `product_tables` + upload SVG files (auto-generates highlight_config)
5. Seed `products` + `product_specs` + `product_assets`
6. Seed `translations`
7. Rewrite API endpoints
8. Rewrite frontend templates
9. Remove all static data files from code
10. Verify — every product card must render from DB only
