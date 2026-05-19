# SVG Workflow: CorelDRAW → Velnox Next.js

Цей документ описує повний процес підготовки технічних SVG-креслень з CorelDRAW та їх інтеграції в продуктові сторінки.

---

## 1. Налаштування експорту CorelDRAW

File → Export → формат SVG. Обов'язкові параметри:

| Параметр | Значення |
|---|---|
| Export text as | **Text** (НЕ Curves) |
| Embed images | **Yes** |
| Embed font in file | **Yes** |
| Character subset | **Used Only** |
| Export hidden objects | No |

**Чому "As Text" критично**: "As Curves" перетворює літери на `<path>` — губляться `<text>` елементи, розміри шрифту, і неможливо розрахувати центрування підсвічування.

**Де зберігати**: Desktop, ASCII-назва файлу (наприклад `Untitled-1.svg`). CorelDRAW не може записати в шлях з кириличними символами — файл виходить ~468 байт (порожній).

**Перевірка**: Файл повинен бути > 100KB і містити `<text` елементи.

---

## 2. Координатна система CorelDRAW

CorelDRAW розміщує об'єкти **за межами сторінки** в SVG-координатах. Сторінка `viewBox` показує область `(0, 0)`, але реальне креслення знаходиться при **від'ємних Y-координатах** (наприклад, Y ≈ -117000).

### Як знайти правильний viewBox

```python
import re

with open('/Users/localmac/Desktop/Untitled-1.svg', 'r', encoding='utf-8') as f:
    content = f.read()

xs, ys = [], []

# polygon/polyline points
for pts in re.findall(r'points="([^"]+)"', content):
    for p in pts.strip().split():
        if ',' in p:
            x, y = p.split(',')
            xs.append(float(x)); ys.append(float(y))

# line x1/y1/x2/y2
for m in re.finditer(r'<line[^>]+>', content):
    tag = m.group()
    for attr in ['x1', 'x2']:
        v = re.search(rf'{attr}="([^"]+)"', tag)
        if v: xs.append(float(v.group(1)))
    for attr in ['y1', 'y2']:
        v = re.search(rf'{attr}="([^"]+)"', tag)
        if v: ys.append(float(v.group(1)))

# path M команди
for d in re.findall(r'd="([^"]+)"', content):
    for m in re.finditer(r'[Mm]\s*([-\d.]+)[,\s]+([-\d.]+)', d):
        xs.append(float(m.group(1))); ys.append(float(m.group(2)))

xmin, xmax = min(xs), max(xs)
ymin, ymax = min(ys), max(ys)
margin_x = (xmax - xmin) * 0.05
margin_y = (ymax - ymin) * 0.05
w = (xmax - xmin) + 2 * margin_x
h = (ymax - ymin) + 2 * margin_y

print(f'viewBox="{xmin-margin_x:.0f} {ymin-margin_y:.0f} {w:.0f} {h:.0f}"')
print(f'aspect-ratio: {w:.0f} / {h:.0f}')
```

**Поточний BUQ bearings**: `viewBox="7000 -117700 13600 7400"`, aspect-ratio `13600/7400`

---

## 3. Скрипт обробки SVG

```python
import re, xml.etree.ElementTree as ET

INPUT  = '/Users/localmac/Desktop/Untitled-1.svg'
OUTPUT = '/Users/localmac/Desktop/Велнокс/velnox-frontend/public/images/schemes/bearings-schema.svg'

VB = '7000 -117700 13600 7400'   # viewBox (змінити під нове креслення)
W, H = '1360', '740'              # px розміри (ті ж пропорції що й viewBox)

with open(INPUT, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Видалити DOCTYPE (ламає XML в браузері)
content = re.sub(r'<!DOCTYPE[^>]*>', '', content)

# 2. Виправити <svg> тег
def fix_svg_tag(m):
    tag = m.group(0)
    tag = re.sub(r'viewBox="[^"]*"', f'viewBox="{VB}"', tag)
    tag = re.sub(r'\bwidth="[^"]*"', f'width="{W}"', tag)
    tag = re.sub(r'\bheight="[^"]*"', f'height="{H}"', tag)
    if 'preserveAspectRatio' not in tag:
        tag = tag.rstrip('>')
        tag += ' preserveAspectRatio="xMidYMid meet">'
    return tag

content = re.sub(r'<svg\b[^>]*>', fix_svg_tag, content, count=1)

# 3. Валідація XML — обов'язково перед збереженням
try:
    ET.fromstring(content.encode('utf-8'))
    print("XML valid ✓")
except ET.ParseError as e:
    print(f"XML ERROR: {e}")
    exit(1)

with open(OUTPUT, 'w', encoding='utf-8') as f:
    f.write(content)
print(f"Saved → {OUTPUT}")
```

> **ВАЖЛИВО**: При regex-заміні в Python НІКОЛИ не використовуй `'" \2'` в звичайному рядку — `\2` це ASCII-символ STX (не backreference!). Завжди використовуй функцію-замінювач або raw string `r'" \2'`.

---

## 4. Розрахунок координат кіл підсвічування

SVG `<text>` має координати `x, y` = **baseline + left anchor**. Коло підсвічування треба центрувати на видимій частині літери.

```
circle_cx = text_x + half_text_width     (центруємо горизонтально)
circle_cy = text_y - half_cap_height     (baseline → центр літери)
```

### Метрики шрифту Helvetica (CorelDRAW)

| Стиль | font-size | half-width 1 симв | half-width 2 симв | half cap-height |
|---|---|---|---|---|
| fnt0 | 282.22px | HALF1 = 78 | HALF2 = 155 | CAP0 = 102 |
| fnt1 | 352.78px | HALF1_F1 = 97 | — | CAP1 = 127 |

Загальна формула: `half_width = 0.275 × font_size × кількість_символів`, `half_cap = 0.36 × font_size`

### Як знайти координати `<text>` в SVG

Відкрити `bearings-schema.svg` в текстовому редакторі → знайти `<text` в потрібній секції → прочитати `x` і `y` атрибути.

---

## 5. DIM_LABELS — зберігається в БД, НЕ у компоненті

Дані підсвічування зберігаються у полі **`highlight_config`** (jsonb) таблиці `product_tables`.

### Формат highlight_config в БД

```json
{
  "d_mm":   [{"label": "d",  "x": 1319, "y": 1416}],
  "d_inch": [{"label": "d",  "x": 1319, "y": 1416}],
  "J_mm":   [{"label": "J",  "x": 555,  "y": 1788}],
  "A_mm":   [{"label": "A",  "x": 492,  "y": 974},
              {"label": "A",  "x": 491,  "y": 1890}]
}
```

- Ключ = spec key (RULE 13: bearings без prefix → `d_mm`; інші → `hub_d_mm`, тощо)
- `x, y` = **центр кола підсвічування** у координатах SVG viewBox (вже розраховані)
- Один ключ може мати кілька точок (наприклад, `A_mm` зображено у 3 видах)
- Два ключі на одній літері (наприклад, `d_mm` і `d_inch`) → однакові `x, y`

### Як API перетворює highlight_config → dim_labels

`ProductController.php` читає `highlight_config`, розгортає в масив:
```json
[
  {"key": "d_mm",   "label": "d", "point": {"x": 1319, "y": 1416}},
  {"key": "d_inch", "label": "d", "point": {"x": 1319, "y": 1416}},
  ...
]
```
Компонент `BuqBlueprintViewer` отримує цей масив через prop `dimLabels` — ніяких хардкодів у компоненті.

`SVG_VB_DEFAULT` у компоненті — лише fallback якщо `schema_viewbox` в БД порожній.

---

## 6. Правила вирівнювання overlay

Щоб overlay-SVG точно лежав поверх зображення:

1. `SVG_VB` в компоненті = `viewBox` в SVG-файлі
2. Обидва використовують `preserveAspectRatio="xMidYMid meet"`
3. **Без `padding`** на `.panelImage` — padding зміщує картинку всередині контейнера, а overlay займає весь контейнер
4. `blueprintWrapper` → `position: relative; overflow: hidden`
5. `aspect-ratio` в CSS = `viewBox_width / viewBox_height`

---

## 7. Шляхи до файлів

Конвенція для нових таблиць — за прикладом bearings-t1:

| Тип файлу | Локальний шлях | URL / БД path |
|---|---|---|
| SVG-схема | `public/images/products/<table-slug>/schema.svg` | `/velnox/images/products/<table-slug>/schema.svg` |
| PNG-схема (для таблиці категорії) | `public/images/products/<table-slug>/schema.png` | `/velnox/images/products/<table-slug>/schema.png` |
| Фото продукту | `public/images/products/<table-slug>/velnox-<article-slug>.webp` | `/velnox/images/products/<table-slug>/velnox-<article-slug>.webp` |
| Креслення 1,2,3 | `public/images/products/<table-slug>/velnox-<article-slug>-drawing-1.webp` | `/velnox/images/products/<table-slug>/velnox-<article-slug>-drawing-1.webp` |
| Компонент | `src/features/products/ProductTemplate/blocks/BuqBlueprintViewer.tsx` | — |

**Правило іменування**: `velnox-{article-slug}.webp`, `velnox-{article-slug}-drawing-{n}.webp`, `velnox-{article-slug}-schema.webp`  
**Prefix `/velnox`** — basePath з `next.config.mjs`. Без нього — 404.  
**SVG лишається як `.svg`** — векторний, WebP не потрібен.

---

## 8. Деплой

```bash
cd /Users/localmac/Desktop/Велнокс
expect deploy_frontend_auto.exp
```

---

## 9. Чеклист: підключення SVG для нової product_table

### A. Підготовка SVG-файлу
- [ ] CorelDRAW: As Text, Embed Font, Used Only
- [ ] Зберегти на Desktop з ASCII-назвою (наприклад `Untitled-1.svg`)
- [ ] Перевірити: файл > 100KB і є `<text` елементи
- [ ] Python: bounding-box скрипт (п.2) → отримати viewBox з 5% margin
- [ ] Python: скрипт обробки (п.3) — видалити DOCTYPE, виставити viewBox/width/height
- [ ] Валідація `ET.fromstring()` без помилок
- [ ] Скопіювати в `public/images/products/<table-slug>/schema.svg`
- [ ] Завантажити на сервер + додати запис `product_assets`:
  - `entity_type = 'product_table'`, `entity_id = <id таблиці>`, `type = 'schema_svg'`
  - `path = '/velnox/images/products/<table-slug>/schema.svg'`

### B. Розрахунок кіл підсвічування
- [ ] Відкрити SVG в текстовому редакторі → знайти `<text` для кожної літери-розміру
- [ ] Для кожної літери прочитати `x` і `y` (baseline + left anchor)
- [ ] Розрахувати центр кола: `cx = x + half_text_width`, `cy = y - half_cap_height`
  - Метрики шрифту — п.4
- [ ] Скласти `highlight_config` JSON:
  ```json
  {"d_mm":[{"label":"d","x":CX,"y":CY}], "d_inch":[{"label":"d","x":CX,"y":CY}], ...}
  ```
  - Дотримуватись RULE 13: bearings → без prefix, hubs → `hub_`, тощо
  - Якщо літера зображена в кількох видах → масив з кількох точок

### C. Оновити БД (рядок product_tables для цієї таблиці)
- [ ] `highlight_config` = JSON з кроку B
- [ ] `schema_viewbox` = рядок viewBox (наприклад `'0 800 2400 1160'`)

### D. CSS фронтенду
- [ ] `aspect-ratio` НЕ потрібно чіпати — задається динамічно через inline style з viewBox prop. Кожна схема має свої пропорції автоматично.
- [ ] Перевірити що немає `padding` на `.panelImage`

### E. Деплой і перевірка
- [ ] `expect deploy_frontend_auto.exp` з `/Users/localmac/Desktop/Велнокс`
- [ ] Відкрити сторінку товару → ховер на кожен spec → коло з'являється на правій літері

---

## 10. Повний чеклист: додавання нової product_table з нуля

> Користувач надає: файли (фото, креслення, SVG) або скріни таблиці зі специфікаціями.  
> ШІ генерує SQL на основі файлів і шаблону bearings-t1.

### A. Зображення — підготовка та конвенція

**Конвертація в WebP** (нові таблиці — тільки WebP):
```bash
# macOS: brew install webp
cwebp -q 85 main.jpeg -o velnox-buq-308-2t3h-ds.webp
cwebp -q 85 drawing-1.png -o velnox-buq-308-2t3h-ds-drawing-1.webp
```

| Тип файлу | Назва файлу |
|---|---|
| Фото продукту (головне) | `velnox-{article-slug}.webp` |
| Креслення 1, 2, 3 | `velnox-{article-slug}-drawing-{n}.webp` |
| Схема PNG (для таблиці категорії) | `schema.png` (спільна для таблиці, не для продукту) |
| Схема SVG (для картки товару) | `schema.svg` (спільна для таблиці) |

Розмістити в: `public/images/products/<table-slug>/`

---

### B. БД — product_tables

```sql
INSERT INTO product_tables (slug, category_slug, name, spec_columns, highlight_config, schema_viewbox)
VALUES (
  'bearings-t2',
  'bearings',
  'BUQ-308-2T3H-DS — Таблиця 2',
  '["d_mm","A1_mm","A2_mm","J_mm","L_mm","H_T","A_mm","mass_kg","cdyn_kn","co_kn","pu_kn"]',
  NULL,   -- заповнити після кроку C (SVG)
  NULL    -- заповнити після кроку C (SVG)
);
```

- `category_slug` — повинен існувати в таблиці `categories`
- `spec_columns` — JSON-масив ключів у порядку відображення в таблиці
- `highlight_config` і `schema_viewbox` — заповнюються після обробки SVG (чеклист п.9)

---

### C. БД — product_assets для таблиці (schema_png + schema_svg)

```sql
-- schema.png — показується ВГОРІ таблиці на сторінці категорії (bearings, hubs тощо)
INSERT INTO product_assets (entity_type, entity_id, type, path, sort_order)
VALUES ('product_table', <table_id>, 'schema_png', '/velnox/images/products/bearings-t2/schema.png', 0);

-- schema.svg — інтерактивний viewer на картці товару
INSERT INTO product_assets (entity_type, entity_id, type, path, sort_order)
VALUES ('product_table', <table_id>, 'schema_svg', '/velnox/images/products/bearings-t2/schema.svg', 0);
```

> `schema_png` → API повертає як `table.schema_src` → відображається над таблицею в BearingsCategoryPage.  
> `schema_svg` → API повертає як `product.schema_svg` → BuqBlueprintViewer на картці.

---

### D. БД — products (один рядок на продукт)

```sql
INSERT INTO products (slug, article, product_table_id, category_slug)
VALUES ('buq-308-2t3h-ds', 'BUQ-308-2T3H-DS', <table_id>, 'bearings');
```

- `slug` — URL-safe, унікальний. Генерується з артикулу: нижній регістр, пробіли/спецсимволи → дефіс
- Назва картки клікабельна → `/products/<category_slug>/<slug>`

---

### E. БД — product_specs

```sql
INSERT INTO product_specs (product_id, spec_key, value)
VALUES
  (<product_id>, 'd_mm',    '40'),
  (<product_id>, 'A1_mm',   '56'),
  (<product_id>, 'A2_mm',   '21'),
  (<product_id>, 'J_mm',    '101.5'),
  (<product_id>, 'L_mm',    '130'),
  (<product_id>, 'H_T',     '1.1/4'),
  (<product_id>, 'A_mm',    '51.2'),
  (<product_id>, 'mass_kg', '2.5'),
  (<product_id>, 'cdyn_kn', '62.3'),
  (<product_id>, 'co_kn',   '45.2'),
  (<product_id>, 'pu_kn',   '1.898');
```

---

### F. БД — translations

```sql
-- Назва продукту (uk/en/pl)
INSERT INTO translations (entity_type, entity_id, locale, field, value)
VALUES
  ('product', <product_id>, 'uk', 'name', 'Підшипниковий вузол BUQ-308-2T3H-DS'),
  ('product', <product_id>, 'en', 'name', 'Bearing Unit BUQ-308-2T3H-DS'),
  ('product', <product_id>, 'pl', 'name', 'Jednostka łożyskowa BUQ-308-2T3H-DS');

-- Опис (якщо є)
INSERT INTO translations (entity_type, entity_id, locale, field, value)
VALUES ('product', <product_id>, 'uk', 'desc', 'Чавунний квадратний фланцевий корпус...');
```

---

### G. БД — product_assets для продукту (фото + креслення)

```sql
-- Головне фото (gallery, sort_order=0)
INSERT INTO product_assets (entity_type, entity_id, type, path, sort_order)
VALUES ('product', <product_id>, 'gallery', '/velnox/images/products/bearings-t2/velnox-buq-308-2t3h-ds.webp', 0);

-- Креслення (gallery, sort_order=1,2,3...)
INSERT INTO product_assets (entity_type, entity_id, type, path, sort_order)
VALUES
  ('product', <product_id>, 'gallery', '/velnox/images/products/bearings-t2/velnox-buq-308-2t3h-ds-drawing-1.webp', 1),
  ('product', <product_id>, 'gallery', '/velnox/images/products/bearings-t2/velnox-buq-308-2t3h-ds-drawing-2.webp', 2);
```

> Перший gallery-елемент (sort_order=0) — головне фото на картці і в PDF.  
> Решта gallery-елементи — креслення, показуються як thumbnails.

---

### H. БД — product_cross_refs (якщо є)

```sql
INSERT INTO product_cross_refs (product_id, brand, value)
VALUES
  (<product_id>, 'SKF',  'FYJ 40 TF'),
  (<product_id>, 'SNR',  'EXF308/UCF308'),
  (<product_id>, 'FAG',  'UCF208');
```

---

### I. Клікабельні картки (перевірка)

На сторінці категорії (`/products/bearings`) картки продуктів мають:
- Заголовок — `<Link href="/{locale}/products/{category_slug}/{slug}">` — клікабельний за статтею
- API: `GET /api/v1/products?category=bearings&locale=uk` → повертає `slug` для кожного продукту

Перевірити: `slug` в БД збігається з роутом; `category_slug` правильний.

---

### J. SVG + highlight_config (чеклист п.9)

Виконати повний чеклист з **розділу 9** після того як є SVG-файл.

---

### K. Деплой і перевірка

- [ ] `expect deploy_frontend_auto.exp` з `/Users/localmac/Desktop/Велнокс`
- [ ] Сторінка категорії: схема над таблицею, всі рядки таблиці, назви клікабельні
- [ ] Картка товару: фото завантажується, схема з'являється, ховер підсвічує розміри
- [ ] PDF: фото + схема + специфікації + креслення — все з БД, без хардкоду