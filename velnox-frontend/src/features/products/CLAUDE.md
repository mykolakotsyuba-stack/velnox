# Правила для features/products

## SVG технічні креслення — обов'язково читати перед правкою

Продуктові картки і категорійні сторінки використовують SVG-схеми з CorelDRAW з інтерактивним overlay підсвічування розмірів. Є низка нетривіальних правил, порушення яких ламає відображення.

### Файли

| Компонент | Файл |
|---|---|
| Вьювер креслення BUQ | `ProductTemplate/blocks/BuqBlueprintViewer.tsx` |
| CSS вьювера | `ProductTemplate/blocks/BuqBlueprintViewer.module.css` |
| CSS шаблону | `ProductTemplate/ProductTemplate.module.css` |

---

## Правила SVG overlay (DimensionOverlay)

### 1. viewBox — з БД, не з компонента

`schema_viewbox` з `product_tables` → передається через API → prop `viewBox` компонента.
`SVG_VB_DEFAULT` у `BuqBlueprintViewer.tsx` — лише fallback.

### 2. DIM_LABELS — у БД, не у компоненті

Дані підсвічування зберігаються у `product_tables.highlight_config` (jsonb):
```json
{
  "d_mm":   [{"label": "d",  "x": 1319, "y": 1416}],
  "d_inch": [{"label": "d",  "x": 1319, "y": 1416}],
  "A_mm":   [{"label": "A",  "x": 492,  "y": 974},
              {"label": "A",  "x": 491,  "y": 1890}]
}
```
- `x, y` = **центр кола** у координатах SVG viewBox (вже розраховані з метрик шрифту)
- API (ProductController) перетворює → `dim_labels[]` → компонент отримує через prop
- Ніяких хардкодів у компоненті

Формула розрахунку центру (CorelDRAW Helvetica):
```
circle_cx = text_x + half_text_width    (center horizontally)
circle_cy = text_y - half_cap_height    (baseline → letter center)
```
Метрики: `half_width ≈ 0.275 × font_size × char_count`, `half_cap ≈ 0.36 × font_size`

### 3. Без padding на зображенні

У `BuqBlueprintViewer.module.css`:
```css
.panelImage {
    object-fit: contain;
    /* НЕ ДОДАВАЙ padding — overlay зміститься відносно картинки */
}
```

### 4. aspect-ratio — динамічний, не в CSS

`aspect-ratio` задається через inline style безпосередньо в компоненті:
```tsx
style={{ aspectRatio: viewBoxAspect(effectiveViewBox) }}
```
де `effectiveViewBox` = `schema_viewbox` з БД. Кожна схема автоматично має правильні пропорції.
**Не чіпати CSS для aspect-ratio** — там його немає і не повинно бути.

### 5. Шлях до SVG-файлу

```
/velnox/images/products/<table-slug>/schema.svg
```
Приклад (еталон): `/velnox/images/products/bearings-t1/schema.svg`  
Префікс `/velnox` — `basePath` з `next.config.mjs`. Без нього — 404.
В БД `product_assets.path` ЗАВЖДИ з `/velnox/`.

---

## Правило модального вікна — КРИТИЧНО

`BuqBlueprintViewer` рендерить `position:fixed` модалку. Є два CSS-пастки:

### Пастка 1 — align-items:center ламає висоту

ПРАВИЛЬНИЙ ланцюжок (не змінювати):
```
overlay:  position:fixed; inset:0; display:flex; align-items:stretch; padding:8px
content:  flex:1; min-height:0
drawing:  flex:1; min-height:0; flex-direction:column
wrapper:  flex:1; min-height:0; position:relative
img:      width:100%; height:100%; objectFit:contain; display:block
```

### Пастка 2 — transform на батьківському елементі ламає position:fixed

`transform: translateY(0)` (навіть identity!) на батьківському елементі створює новий CSS containing block.
`position:fixed` дочірніх елементів прив'язується до батька, а не до viewport → модалка рендериться посеред сторінки.

**Зафіксоване рішення** (`ProductTemplate.module.css`):
```css
.inView {
    opacity: 1 !important;
    transform: none !important;   /* НЕ translateY(0) — identity transform все одно ламає fixed */
}
```

Якщо додаєш CSS-анімацію (translateY) до будь-якого предка `BuqBlueprintViewer`, переконайся що settled-стан використовує `transform: none`, а не `translateY(0)`.

---

## Як додати нову product_table

**Повний чеклист (з нуля)**: [`docs/svg-workflow.md`](../../docs/svg-workflow.md) (розділ 10)  
**SVG + highlight_config**: [`docs/svg-workflow.md`](../../docs/svg-workflow.md) (розділ 9)

Коротко — що потрібно для нової таблиці:
1. **Файли**: фото + креслення → WebP (`velnox-{article-slug}.webp`), schema.png + schema.svg
2. **БД product_tables**: slug, category_slug, spec_columns, (highlight_config + schema_viewbox — після SVG)
3. **БД product_assets (table)**: schema_png (`entity_type='product_table'`) → відображається НАД таблицею на сторінці категорії; schema_svg — для інтерактивного viewer на картці
4. **БД products + product_specs**: один рядок на продукт, spec values
5. **БД translations**: name/desc на uk/en/pl
6. **БД product_assets (product)**: gallery (sort_order=0 → фото, 1,2,3 → креслення)
7. **БД product_cross_refs**: якщо є аналоги
8. **SVG**: CorelDRAW As Text → Python bounding box → скрипт обробки → highlight_config → schema_viewbox
9. **Картки клікабельні**: slug у БД → `/products/{category_slug}/{slug}`

---

## Деплой

```bash
cd /Users/localmac/Desktop/Велнокс
expect deploy_frontend_auto.exp
```
