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

### ⛔ КРИТИЧНО: три пастки при розрахунку viewBox

#### Пастка 1 — `<path d=...>` всередині `<g transform="matrix(...)">` мають ЛОКАЛЬНІ координати

CorelDRAW може обгорнути частину елементів у трансформовану групу (`<g transform="matrix(...)">`).  
Координати `d=` всередині такої групи — **локальні**, не глобальні. Наївний bbox-скрипт бере їх як є і отримує хибні межі.

**Перевірка перед bbox:**
```python
import re
with open('schema.svg', 'r', encoding='utf-8') as f:
    content = f.read()
g_transforms = re.findall(r'<g[^>]*transform="([^"]*)"', content)
print(f"Transformed groups: {len(g_transforms)}")
for t in g_transforms: print(f"  {t}")
```
Якщо є — виключи вміст цих груп з bbox або застосуй матрицю вручну.

#### Пастка 2 — `<image>` елемент (3D фото) розтягує viewBox

CorelDRAW вставляє 3D фото як `<image x=... y=... width=... height=...>` в SVG. Це **частина креслення** — її треба показувати, тому `<image>` **включається** в bbox за замовчуванням.

**Перевір наявність:**
```python
for m in re.finditer(r'<image([^>]+)>', content):
    tag = m.group(1)
    x = re.search(r'\bx="([^"]+)"', tag)
    w = re.search(r'\bwidth="([^"]+)"', tag)
    print(f"image: x={x and x.group(1)} w={w and w.group(1)}")
```

**Правило:** `<image>` включати в bbox. Не виключати — інакше схема обріжеться по правому краю.

#### Пастка 3 — рамка документа CorelDRAW отруює y_min

CorelDRAW додає path-рамку всього документа (зазвичай 1 точка на y=0 або поза межами малюнка). Path-bbox знаходить цю точку і повертає y_min=0 — тоді viewBox включає весь порожній простір над малюнком, і схема "падає" в низ панелі.

**Рішення:** y_min визначати з текстових міток (вони завжди на малюнку, ніколи на рамці). Path-bbox використовувати тільки для x і для перевірки.

#### Пастка 4 — aspect ratio після розрахунку

Після отримання viewBox:
```python
vb_parts = viewbox_string.split()
aspect = float(vb_parts[2]) / float(vb_parts[3])
print(f"Aspect ratio: {aspect:.2f}")
```
**Нормальний діапазон:** 1.2 – 3.0. Якщо `<image>` є в схемі — aspect може бути 2.5–3.0, це нормально.

---

### Правильний скрипт bbox (текстові мітки = anchor для y; `<image>` включається)

**Принцип:** y_min береться з найвищої текстової мітки (не з path bbox) — це захищає від рамки документа CorelDRAW.

```python
import re, xml.etree.ElementTree as ET

svg_path = 'schema.svg'
with open(svg_path, 'r', encoding='utf-8') as f:
    content = f.read()

tree = ET.parse(svg_path)
root = tree.getroot()

# ── 1. y range з текстових міток (захист від рамки документа) ──
text_ys = []
for elem in root.iter():
    tag = elem.tag.split('}')[-1] if '}' in elem.tag else elem.tag
    if tag == 'text':
        txt = ''.join(elem.itertext()).strip()
        if txt:  # будь-який текст = частина малюнка
            y = elem.get('y')
            if y:
                try: text_ys.append(float(y))
                except: pass

text_y_min = min(text_ys)
text_y_max = max(text_ys)
# Робоча y-зона: від найвищого тексту (мінус відступ) до кінця
y_zone_min = text_y_min - 80
y_zone_max = text_y_max + 80

# ── 2. x range з paths у робочій y-зоні ──
def parse_path_pts(d):
    tokens = re.findall(r'[MmLlHhVvCcSsQqTtAaZz]|[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?', d)
    cx, cy, pts = 0.0, 0.0, []
    i = 0; cmd = 'M'
    while i < len(tokens):
        t = tokens[i]
        if re.match(r'[MmLlHhVvCcSsQqTtAaZz]', t):
            cmd = t; i += 1; continue
        try:
            if cmd in ('M','L','C','S','Q','T'):
                x,y=float(tokens[i]),float(tokens[i+1]); pts.append((x,y)); cx,cy=x,y; i+=2
                if cmd=='C': i+=4
                elif cmd in ('S','Q'): i+=2
            elif cmd in ('m','l','c','s','q','t'):
                x,y=cx+float(tokens[i]),cy+float(tokens[i+1]); pts.append((x,y)); cx,cy=x,y; i+=2
                if cmd=='c': i+=4
                elif cmd in ('s','q'): i+=2
            elif cmd=='H': cx=float(tokens[i]); pts.append((cx,cy)); i+=1
            elif cmd=='h': cx+=float(tokens[i]); pts.append((cx,cy)); i+=1
            elif cmd=='V': cy=float(tokens[i]); pts.append((cx,cy)); i+=1
            elif cmd=='v': cy+=float(tokens[i]); pts.append((cx,cy)); i+=1
            elif cmd in ('A','a'):
                if cmd=='A': x,y=float(tokens[i+5]),float(tokens[i+6])
                else: x,y=cx+float(tokens[i+5]),cy+float(tokens[i+6])
                pts.append((x,y)); cx,cy=x,y; i+=7
            else: i+=1
        except: i+=1
    return pts

xs_filtered = []
for elem in root.iter():
    tag = elem.tag.split('}')[-1] if '}' in elem.tag else elem.tag
    if tag == 'path':
        d = elem.get('d','')
        if d:
            for x,y in parse_path_pts(d):
                if y_zone_min <= y <= y_zone_max:
                    xs_filtered.append(x)
    elif tag == 'image':  # embedded photo — включаємо в x range
        x = float(elem.get('x', 0))
        w = float(elem.get('width', 0))
        xs_filtered.extend([x, x+w])

x0 = min(xs_filtered) - 30 if xs_filtered else 0
x1 = max(xs_filtered) + 30 if xs_filtered else 2000
w  = x1 - x0
h  = y_zone_max - y_zone_min

print(f'viewBox: "{x0:.0f} {y_zone_min:.0f} {w:.0f} {h:.0f}"')
print(f'aspect:  {w/h:.2f}  (норма: 1.2–3.0)')
print(f'text y range: {text_y_min:.0f} – {text_y_max:.0f}')
```

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

### ⛔ Як відрізнити розмірну мітку від анотації перерізу

CorelDRAW часто ставить **анотації перерізу** типу "A–A", "B–B" разом із розмірними мітками. Обидва — просто `<text>` у SVG, але в `highlight_config` мають потрапляти **тільки розмірні мітки**.

**Ознаки анотації перерізу (НЕ включати в highlight_config):**
- Текст виду `"A-"`, `"А"` (кирилиця!) або `"B"` з'являється парою поруч: `x1 ≈ x2`, `y1 = y2`
- Знаходиться **у верхній частині** SVG (y < ~800 для типового bearings креслення)
- Пов'язаний з лінією-стрілкою перерізу, а не з розмірною лінією знизу

**Ознаки розмірної мітки (включати):**
- Текст `"A"`, `"J"`, `"L"`, `"d"` тощо, що з'являється **зі стрілками з обох боків** (розмірна лінія)
- Знаходиться в **нижній або правій частині** креслення (типово y > 1000 для bearings)
- Для одного розміру, що показаний у кількох видах — буде **кілька однакових текстів** на різних x (всі включаємо)

**Правило:** якщо та сама літера зустрічається і у верхній (y < mid), і в нижній (y > mid) частині SVG — верхня = анотація перерізу, нижня = розмірна мітка. Включаємо **тільки нижню**.

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

| Файл | Шлях |
|---|---|
| SVG-схема | `public/images/schemes/bearings-schema.svg` |
| URL в браузері | `/velnox/images/schemes/bearings-schema.svg` |
| Компонент | `src/features/products/ProductTemplate/blocks/BuqBlueprintViewer.tsx` |
| CSS | `src/features/products/ProductTemplate/blocks/BuqBlueprintViewer.module.css` |

Префікс `/velnox` — `basePath` з `next.config.mjs`. Без нього файл не знайдеться.

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
- [ ] Скопіювати в `public/images/schemes/<нова-назва>.svg`
- [ ] Завантажити на сервер + додати запис `product_assets`:
  - `entity_type = 'product_table'`, `entity_id = <id таблиці>`, `type = 'schema_svg'`
  - `path = '/velnox/images/schemes/<нова-назва>.svg'` (З prefix `/velnox/`)

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

## 10. Правила заміни зображень — обов'язково

### Проблема rsync без --delete

Скрипт `deploy_frontend_auto.exp` використовує `rsync` БЕЗ `--delete`.  
Старі файли залишаються на сервері навіть після видалення локально.  
Це призводить до появи старих зображень на картках продуктів.

### Порядок при заміні/додаванні нових зображень:

**Крок 1** — перед деплоєм видалити стару директорію з сервера:
```bash
# через expect-сесію або окремий скрипт:
rm -rf /srv/projects/velnox/frontend/public/images/products/<old-dir>/
ls /srv/projects/velnox/frontend/public/images/products/  # перевірити
```

**Крок 2** — деплой:
```bash
cd /Users/localmac/Desktop/Велнокс
expect deploy_frontend_auto.exp
```

**Крок 3** — перевірка: **обов'язково Cmd+Shift+R** (hard refresh).  
ISR cache (`revalidate: 60`) може показати стару версію сторінки звичайним F5.

**Якщо після hard refresh все одно старі фото** — webpack cache:
```bash
# SSH на сервер, видалити webpack cache:
rm -rf /srv/projects/velnox/frontend/.next/cache/
# Потім повний деплой знову
```

### Єдине джерело правди для зображень

Всі шляхи до зображень — тільки в таблиці `product_assets` в БД.  
`productAssets.ts` — мертвий код, не імпортувати і не оновлювати.  
При нагоді — видалити файл `ProductTemplate/productAssets.ts`.