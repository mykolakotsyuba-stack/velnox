# Правила для features/products

## SVG технічні креслення — обов'язково читати перед правкою

Продуктові картки і категорійні сторінки використовують SVG-схеми з CorelDRAW з інтерактивним overlay підсвічування розмірів. Є низка нетривіальних правил, порушення яких ламає відображення.

### Файли

| Компонент | Файл |
|---|---|
| Вьювер креслення BUQ | `ProductTemplate/blocks/BuqBlueprintViewer.tsx` |
| SVG-схема (статика) | `public/images/schemes/bearings-schema.svg` |
| CSS вьювера | `ProductTemplate/blocks/BuqBlueprintViewer.module.css` |

---

## Правила SVG overlay (DimensionOverlay)

### 1. viewBox має бути однаковий у SVG-файлі і в компоненті

```tsx
// BuqBlueprintViewer.tsx
const SVG_VB = '7000 -117700 13600 7400';
```

Цей рядок ПОВИНЕН збігатися з `viewBox` атрибутом у `bearings-schema.svg`. Якщо змінив SVG-файл — онови і константу.

### 2. Без padding на зображенні

У `BuqBlueprintViewer.module.css`:
```css
.panelImage {
    object-fit: contain;
    /* НЕ ДОДАВАЙ padding: тут — overlay зміститься відносно картинки */
}
```

### 3. aspect-ratio в CSS = пропорції viewBox

```css
.blueprintWrapper {
    aspect-ratio: 13600 / 7400;  /* = viewBox width / height */
}
```

### 4. DIM_LABELS — координати центрів літер, не baseline

`point.x` і `point.y` в `DIM_LABELS` — це **центр кола підсвічування**, не координати `<text>` елемента з SVG.

Формула (Helvetica, CorelDRAW):
```
circle_cx = text_x + half_text_width
circle_cy = text_y - half_cap_height
```

Метрики шрифту:
- `fnt0 = 282px`: HALF1=78 (1 симв), HALF2=155 (2 симв), CAP0=102
- `fnt1 = 353px`: HALF1_F1=97 (1 симв), CAP1=127

### 5. Шлях до SVG-файлу

```tsx
src="/velnox/images/schemes/bearings-schema.svg"
```

Префікс `/velnox` — це `basePath` з `next.config.mjs`. Без нього — 404.

---

## Як оновити SVG-креслення (CorelDRAW → проект)

Повний workflow з усіма деталями: [`docs/svg-workflow.md`](../../docs/svg-workflow.md)

Коротко:
1. CorelDRAW: Export → SVG → **As Text** (не Curves!), Embed Font, Used Only
2. Зберігати на Desktop з ASCII-назвою (не кирилиця в шляху)
3. Python: знайти реальний viewBox, видалити DOCTYPE, валідувати XML
4. Скопіювати в `public/images/schemes/`
5. Оновити `SVG_VB` і `aspect-ratio` в компоненті якщо viewBox змінився
6. Оновити `DIM_LABELS` якщо змінились координати літер

---

## Деплой

```bash
cd /Users/localmac/Desktop/Велнокс
expect deploy_frontend_auto.exp
```