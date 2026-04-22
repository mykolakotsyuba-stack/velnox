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
const SVG_VB_DEFAULT = '892 -13810 1480 720';
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
    aspect-ratio: 1480 / 720;  /* = viewBox width / height */
}
```

### 4. DIM_LABELS — координати центрів літер, не baseline

`point.x` і `point.y` в `DIM_LABELS` — це **центр кола підсвічування**, не координати `<text>` елемента з SVG.

Формула (Helvetica, CorelDRAW):
```
circle_cx = text_x + half_text_width
circle_cy = text_y - half_cap_height
```

Метрики шрифту (нова схема, bearings-schema.svg):
- `fnt0 = 41.66px`: half-width 1 символ ≈ advance/1000 * 41.66/2, cap_half ≈ 14.87
- Glyph advances: A=666, B=667, J=499, L=556, N=722, d=556 (units per 1000)

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