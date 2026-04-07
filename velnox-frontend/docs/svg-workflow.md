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

## 5. DIM_LABELS в BuqBlueprintViewer.tsx

```tsx
const DIM_LABELS: DimLabel[] = [
    { key: 'N',      label: 'N',  point: { x: text_x + HALF1,    y: text_y - CAP0 } },
    { key: 'B',      label: 'B',  point: { x: text_x + HALF1_F1, y: text_y - CAP1 } },
    // ...
];
```

- `key` — відповідає полю в `ProductSpecs` (наприклад `'d_mm'`, `'A2'`)
- Якщо два ключі на одній літері (`d_mm` і `d_inch`) — `point` однаковий
- `SVG_VB` константа = viewBox SVG-файлу (змінювати разом)

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

## 9. Чеклист для нового SVG-креслення

- [ ] CorelDRAW: As Text, Embed Font, Used Only
- [ ] Зберегти на Desktop з ASCII-назвою
- [ ] Файл > 100KB, є `<text` елементи
- [ ] Python: знайти bounding box → viewBox з margin
- [ ] Запустити скрипт обробки (п.3)
- [ ] Валідація `ET.fromstring()` пройшла без помилок
- [ ] Скопіювати в `public/images/schemes/`
- [ ] Оновити `SVG_VB` в компоненті
- [ ] Оновити `aspect-ratio` в CSS
- [ ] Знайти `<text` координати кожної літери-розміру
- [ ] Розрахувати `point` для `DIM_LABELS`
- [ ] Перевірити що немає `padding` на `.panelImage`
- [ ] Деплой і візуальна перевірка