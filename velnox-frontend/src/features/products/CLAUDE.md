# Правила для features/products

---

## ⛔ КРИТИЧНО: Зображення — єдине джерело правди

**Єдине джерело правди для зображень: таблиця `product_assets` в БД. Ніяких хардкодів.**

- `productAssets.ts` — мертвий код зі старими захардкодженими шляхами. **Ніколи не імпортувати.** При нагоді — видалити.
- `ProductTemplate.tsx` бере `product.images` з API → `product_assets`. Так і має бути.

---

## ⛔ КРИТИЧНО: Файли нової таблиці — формат і назви

**Перед будь-якою роботою з новою таблицею — перевір файли. Якщо файлів немає або вони не відповідають правилам — СТОП, запитай у власника нові.**

### Правило іменування (обов'язково для всіх нових таблиць)

| Тип | Назва файлу | Приклад для BUQ-308-2T3H-DS |
|---|---|---|
| Фото продукту (головне) | `velnox-{article-slug}.webp` | `velnox-buq-308-2t3h-ds.webp` |
| Креслення 1, 2, 3 | `velnox-{article-slug}-drawing-{n}.webp` | `velnox-buq-308-2t3h-ds-drawing-1.webp` |
| Схема PNG (preview) | `velnox-{article-slug}-schema.webp` | `velnox-buq-308-2t3h-ds-schema.webp` |
| Схема SVG (vector) | `schema.svg` | `schema.svg` |

- Формат: **WebP** для фото/PNG. SVG лишається `.svg`.
- Якщо файли вже є зі старими назвами (jpeg/png без префіксу) — **уточни у власника**: залишати чи він дасть нові. Ніколи не конвертуй без підтвердження.

### Де лежать файли

```
public/images/products/<table-slug>/
  velnox-{article-slug}.webp
  velnox-{article-slug}-drawing-1.webp
  velnox-{article-slug}-drawing-2.webp
  velnox-{article-slug}-drawing-3.webp
  velnox-{article-slug}-schema.webp
  schema.svg
```

### Прив'язка схем — обов'язково, без цього схеми не відображаються

**schema_png (WebP) → над таблицею на категорійній сторінці:**
```sql
INSERT INTO product_assets (entity_type, entity_id, type, path, sort_order)
VALUES ('product_table', <table_id>, 'schema_png', '/velnox/images/products/<slug>/velnox-<article-slug>-schema.webp', 0);
```

**schema_svg → у вьювері на кожній картці продукту:**
```sql
INSERT INTO product_assets (entity_type, entity_id, type, path, sort_order)
VALUES ('product_table', <table_id>, 'schema_svg', '/velnox/images/products/<slug>/schema.svg', 0);
```

Без цих записів у `product_assets` — схема не з'явиться ні на категорійній сторінці, ні на картці товару.

---

## ⛔ КРИТИЧНО: Заміна зображень на сервері

### Проблема: rsync без --delete НЕ видаляє старі файли

`rsync` лише додає/оновлює файли. Старі папки залишаються на сервері навіть після видалення локально.

### Обов'язковий порядок при заміні зображень:

1. **Перед деплоєм**: SSH → вручну `rm -rf` старі директорії:
```bash
# У expect-сесії на сервері:
rm -rf /srv/projects/velnox/frontend/public/images/products/<old-dir>/
```

2. **Перевірити список** папок після:
```bash
ls /srv/projects/velnox/frontend/public/images/products/
```
Не повинно бути папок зі старими назвами (без `bearings-t2/` префіксу, без `velnox-` префіксу у файлах).

3. **Після деплою — завжди hard refresh**: Cmd+Shift+R (Mac) або Ctrl+Shift+R (Win).
   ISR cache (`revalidate: 60`) може обслуговувати стару версію сторінки.

4. **Якщо підозра на webpack cache** (показуються старі зображення після hard refresh):
```bash
# SSH на сервер:
rm -rf /srv/projects/velnox/frontend/.next/cache/
# Потім повний деплой
```

---

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
Приклад: `/velnox/images/products/bearings-t1/schema.svg`  
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

## Як оновити або додати product_table — спочатку визнач сценарій

### Сценарій A — дані є в БД, але НЕ в сідері
> Сідер — фінальний крок підтвердження. Якщо його немає — дані вважаються чорновими.

- **Ігнорувати все що є в БД** (продукти, specs, активи, зображення, креслення)
- Ігнорувати старі JSON-файли (`bearingsTable3.json` тощо)
- **Стартувати з чистого листа** — запитувати нові дані у власника

### Сценарій B — дані є і в БД, і в сідері, і задача "оновити"
- Уважно зчитати дані з БД, сідера і нового файлу/специфікації
- Знайти всі розбіжності
- **⛔ СТОП** — викласти знайдене власнику, уточнити чи правильно зрозумів
- Тільки після підтвердження вносити зміни

---

## Як додати нову product_table — двофазний процес

Повний чеклист зі стопами: [`docs/svg-workflow.md`](../../docs/svg-workflow.md) (розділ 10)

### ФАЗА 1 — Таблиця і структура (зупинка після кожного кроку)
1. Визначити сценарій (A або B) — перевірити сідер
2. Запитати: категорія + номер таблиці + назва
3. Запитати структуру колонок (`spec_columns`) — **кожна таблиця різна, не копіювати сліпо**
4. Внести дані (products, specs, cross_refs)
5. **⛔ СТОП** — власник перевіряє таблицю на сайті → "ok"

### ФАЗА 2 — Картки товарів (окремий чекліст зі стопами)
1. **Файли першим** — власник надає → перевіряємо назви/формат → якщо не відповідають правилам — повідомляємо одразу
2. **⛔ СТОП** — власник підтверджує файли
3. Галерея в БД (фото + креслення) → **⛔ СТОП** — власник перевіряє галерею
4. **3D модель** — перевірити `public/models/` чи є `{ARTICLE-SLUG}.glb`:
   - Є → додати `product_assets` запис: `entity_type='product'`, `type='model_3d'`, `path='/velnox/models/{ARTICLE-SLUG}.glb'`
   - Немає → стандартний шаблон, нічого не робити
   - **⛔ СТОП** — власник підтверджує шаблон картки (3D або стандартний)
5. Описи — **запитати у власника** uk/en/pl, не генерувати → **⛔ СТОП** — власник перевіряє тексти
6. Технічні характеристики → **⛔ СТОП** — власник підтверджує specs на картці
7. SVG схема: viewBox + highlight_config (п.9) + assets в БД → **⛔ СТОП** — власник перевіряє схему і підсвічування
8. Власник каже "все ок" → додаємо в сідер → коміт

---

## Деплой

```bash
cd /Users/localmac/Desktop/Велнокс
expect deploy_frontend_auto.exp
```
