# BearingsCategoryPage — Заморожені специфікації таблиць

## КРИТИЧНЕ ПРАВИЛО

**НІКОЛИ не змінюй структуру колонок жодної з 5 таблиць без явної вказівки з НОВОЮ специфікацією.**

---

## Обов'язкові елементи для кожної таблиці з Part Number

Кожна таблиця, що має `part_number` (Позначення Velnox), **ОБОВ'ЯЗКОВО** повинна мати:

1. **Гіперпосилання** на картку товару — **ЗАВЖДИ** якщо є `part_number`:
```tsx
const slugN = articleToSlug(row['part_number'] || '');
<td data-label="Позначення Velnox" className={styles.partNumCell}>
    <Link href={`/${locale}/products/bearings/${slugN}`} className={styles.designationLink}>
        {row['part_number'] || '-'}
        {row['has_model_3d'] && <span className={styles.badge3d}>3D</span>}
    </Link>
</td>
```

2. **Позначка 3D** (`badge3d`) — **ТІЛЬКИ якщо** `row['has_model_3d'] === true`
   - Умова: у `product_assets` є запис `entity_type='product', type='model_3d'` для цього продукту
   - API повертає `has_model_3d: true` лише якщо такий запис є в БД
   - **Не всі продукти мають 3D модель** — без запису в БД badge не показується (це правильна поведінка)

3. **`has_model_3d`** має бути у `setTableNData` маппінгу: `has_model_3d: p.has_model_3d ?? false`

4. **Як перевірити чи є 3D:** `ls public/models/{article-slug}.glb` — якщо файл є → додати в сідер:
```php
DB::table('product_assets')->updateOrInsert(
    ['entity_type' => 'product', 'entity_id' => $productId, 'type' => 'model_3d'],
    ['path' => '/velnox/models/{ARTICLE-SLUG}.glb', 'sort_order' => 0]
);
```

**Why:** без Link — користувач не може перейти на картку. Badge3D рендериться тільки якщо `has_model_3d` true — умова перевіряється на рівні API через `product_assets`, не хардкодиться.

---
Правила нижче — джерело правди. Вони мають пріоритет над будь-якими "покращеннями" або "вирівнюванням з іншими сторінками".

**МОВА ПІДПИСІВ — АВТОПЕРЕКЛАД:**
- **Нон-spec колонки** (article, cross_ref, brand) → `t('block2.table1.col_article')` / `col_cross_ref` / `col_brand` з next-intl messages (uk/en/pl). Еталон мова — українська.
- **Spec колонки** (d_mm, A1, J, Cdyn, ...) → `table1SpecLabels[T1_COL_TO_SPEC[col]]` — приходять з API `/product-tables/bearings-t1?locale=…` поле `spec_labels`. Fallback — повний укр текст.
- Не міняти підписи на статичний рядок без явної вказівки. Не видаляти fallback.

**ПЕРЕНОС ТЕКСТУ В ЗАГОЛОВКАХ:** `white-space: normal` на `.techTable th` в десктопному медіа-запиті — так задумано. Довгі підписи мають переноситись на новий рядок, а не розширювати колонку. Не повертати `white-space: nowrap`.

---

## Таблиця 1 — BUQ стандартні вузли (T1)

**Дані:** API `/v1/products/tables/buq-standard` → об'єкти зі **camelCase/underscore** полями  
**Компонент:** `sortedT1`, `filteredT1`, `tog1`, `sc1`, `sd1`

| # | col (ключ) | label (УКР) | hasFilter |
|---|---|---|---|
| 1 | `article` | Позначення Velnox | ні |
| 2 | `cross_ref` | Перехресні аналоги | ні |
| 3 | `brand` | Бренд | так |
| 4 | `d_mm` | Діаметр отвору d (мм) | так |
| 5 | `d_inch` | Діаметр отвору d (дюйм) | так |
| 6 | `A1` | Загальна ширина корпусу A1 (мм) | так |
| 7 | `A2` | Товщина фланця корпусу A2 (мм) | так |
| 8 | `J` | Відстань між отворами J (мм) | так |
| 9 | `L` | Загальна довжина L (мм) | так |
| 10 | `N` | Діаметр отвору N (мм) | так |
| 11 | `A` | Загальна ширина A (мм) | так |
| 12 | `mass_kg` | Маса (кг) | так |
| 13 | `Cdyn` | Динамічна вантажо&#x2011;підйомність Cdyn (кН) | так |
| 14 | `Co` | Статична вантажо&#x2011;підйомність Co (кН) | так |
| 15 | `Pu` | Гранична втомна міцність Pu (кН) | так |
| 16 | *(actionCol)* | — | — |

**tbody:** `row.article`, `row.cross_ref`, `row.brand`, `row.d_mm`, `row.d_inch ?? '—'`, `row.A1`, `row.A2`, `row.J`, `row.L`, `row.N`, `row.A`, `row.mass_kg`, `row.Cdyn`, `row.Co`, `row.Pu`

---

## Таблиця 2 — BUQ-308-2T3H-DS (T2)

**Дані:** API → рядки з **рядковими ключами в лапках** (API CSV-стиль)  
**Компонент:** `sortedT2`, `filteredT2`, `tog2`, `sc2`, `sd2`

| # | col (ключ API) | label | hasFilter |
|---|---|---|---|
| 1 | `Part Number` | Part No | ні |
| 2 | `Bearing designation` | Designation | ні |
| 3 | `Brand name` | Brand | так |
| 4 | `Cross-Refference` | Cross-Ref | ні |
| 5 | `Bore diameter d (mm)` | Bore d | так |
| 6 | `Total housing width A1 (mm)` | A1 | так |
| 7 | `Housing flange thickness A2 (mm)` | A2 | так |
| 8 | `Distance between the holes J (mm)` | J | так |
| 9 | `Total length L (mm)` | L | так |
| 10 | `Hole / Thread H/T` | H/T | так |
| 11 | `Overall width A (mm)` | A | так |
| 12 | `Mass kg` | Mass | так |
| 13 | `Dynamic load rating Cdyn (kN)` | Cdyn | так |
| 14 | `Static load rating Co (kN)` | Co | так |
| 15 | `Fatigue load limit Pu (kN)` | Pu | так |

**Немає actionCol** у T2.

---

## Таблиця 3 — BUQ-309-2T3H (T3)

**Дані:** API → рядки з рядковими ключами. Ключ Brand: `Brand \nname` (з newline!)  
**Компонент:** `sortedT3`, `filteredT3`, `tog3`, `sc3`, `sd3`

| # | col (ключ API) | label | hasFilter |
|---|---|---|---|
| 1 | `Part Number` | Part Number | ні |
| 2 | `Bearing designation` | Bearing Designation | ні |
| 3 | `Brand \nname` | Brand | так |
| 4 | `Cross-Refference` | Cross-Reference | ні |
| 5 | `Bore diameter d (mm)` | Bore d (mm) | так |
| 6 | `Total length L (mm)` | Length L (mm) | так |
| 7 | `Distance between the holes J (mm)` | J (mm) | так |
| 8 | `Hole / Thread H/T (mm)` | H/T (mm) | так |
| 9 | `Overall width A (mm)` | A (mm) | так |
| 10 | `Total housing width A1 (mm)` | A1 (mm) | так |
| 11 | `Housing flange thickness A2 (mm)` | A2 (mm) | так |
| 12 | `Width inner ring B (mm)` | B (mm) | так |
| 13 | `Static load rating Co (kN)` | Co (kN) | так |
| 14 | `Dynamic load rating Cdyn (kN)` | Cdyn (kN) | так |
| 15 | `Fatigue load limit Pu (kN)` | Pu (kN) | так |

**Немає actionCol** у T3.

---

## Таблиця 4 — BUCR-SG-309-S2 (T4)

**Дані:** API `/v1/product-tables/bearings-t4` → `p.specs.*` (short snake_case keys) + cross_refs  
**Компонент:** `sortedT4`, `filteredT4`, `tog4`, `sc4`, `sd4`

**setTable4Data маппінг (зафіксовано — не змінювати без явної вказівки):**
- `part_number` ← `p.article`
- `bearing_designation` ← `bearingRefs.map(r.value).join('\n')`
- `brand_name` ← `bearingRefs.map(r.brand).join('\n')`
- `cross_reference` ← `appRefs.map(r.value).join('\n')`
- `bore_diameter_d_mm` ← `p.specs.d_mm`
- `centering_diameter_d1_mm` ← `p.specs.d1_mm`
- `housing_overall_width_l1_mm` ← `p.specs.L1_mm`
- `distance_between_holes_j1_mm` ← `p.specs.J1_mm`
- `housing_overall_width_l2_mm` ← `p.specs.L2_mm`
- `distance_between_holes_j2_mm` ← `p.specs.J2_mm`
- `overall_width_a_mm` ← `p.specs.A_mm`
- `flange_width_a1_mm` ← `p.specs.A1_mm`
- `flange_width_a2_mm` ← `p.specs.A2_mm`
- `centering_diameter_height_a3_mm` ← `p.specs.A3_mm`
- `threaded_hole_size_t` ← `p.specs.T_size`
- `hole_diameter_h_mm` ← `p.specs.H_mm`
- `mass_kg` ← `p.specs.mass_kg`

| # | col (ключ рядка) | label (УКР) | hasFilter |
|---|---|---|---|
| 1 | `part_number` | Позначення Velnox | ні |
| 2 | `bearing_designation` | Позначення підшипника | ні |
| 3 | `brand_name` | Бренд | так |
| 4 | `cross_reference` | Перехресні аналоги | ні |
| 5 | `bore_diameter_d_mm` | Діаметр отвору d (мм) | так |
| 6 | `centering_diameter_d1_mm` | Центруючий діаметр d1 (мм) | так |
| 7 | `housing_overall_width_l1_mm` | Загальна ширина корпусу L1 (мм) | так |
| 8 | `distance_between_holes_j1_mm` | Відстань між отворами J1 (мм) | так |
| 9 | `housing_overall_width_l2_mm` | Загальна ширина корпусу L2 (мм) | так |
| 10 | `distance_between_holes_j2_mm` | Відстань між отворами J2 (мм) | так |
| 11 | `overall_width_a_mm` | Загальна ширина A (мм) | так |
| 12 | `flange_width_a1_mm` | Ширина фланця A1 (мм) | так |
| 13 | `flange_width_a2_mm` | Ширина фланця A2 (мм) | так |
| 14 | `centering_diameter_height_a3_mm` | Висота центруючого діаметра A3 (мм) | так |
| 15 | `threaded_hole_size_t` | Різьбовий отвір T | так |
| 16 | `hole_diameter_h_mm` | Діаметр отвору H (мм) | так |
| 17 | `mass_kg` | Маса (кг) | так |
| 18 | *(actionCol — кнопка Запит)* | — | — |

---

## Таблиця 5 — BUP-207-X3L (T5)

**Дані:** API → рядки з рядковими ключами. Ключ Brand: `Brand \\nname` (подвійний escape!)  
**Компонент:** `sortedT5`, `filteredT5`, `tog5`, `sc5`, `sd5`

| # | col (ключ API) | label | hasFilter |
|---|---|---|---|
| 1 | `Part Number` | Part No | ні |
| 2 | `Bearing designation` | Designation | ні |
| 3 | `Brand \\nname` | Brand | так |
| 4 | `Cross-Refference` | Cross-Ref | ні |
| 5 | `Bore diameter d (mm)` | Bore d | так |
| 6 | `Outside diameter D (mm)` | Out D | так |
| 7 | `Pitch circle diameter J (mm)` | Pitch J | так |
| 8 | `Hole / Thread H/T` | H/T | так |
| 9 | `Overall width A (mm)` | A | так |
| 10 | `Housing flange thickness A2 (mm)` | A2 | так |
| 11 | `Width inner ring B (mm)` | B | так |
| 12 | `Mass kg` | Mass | так |
| 13 | `Static load rating Co (kN)` | Co | так |
| 14 | `Dynamic load rating Cdyn (kN)` | Cdyn | так |
| 15 | `Fatigue load limit Pu (kN)` | Pu | так |

**Немає actionCol** у T5.

---

## Правила CSS / діаграм

- `.tableDiagramContainer` — завжди **білий фон (`background: #ffffff`)**, `width: 100%`
- `.techTable th` — `white-space: normal` (дозволяти перенос рядків у заголовках)
- Горизонтальний скрол таблиці — **лише всередині `.tableScroll`**, не на рівні сторінки

## ⛔ ЗАБОРОНА ХАРДКОДУ В ТАБЛИЦЯХ — ЄДИНЕ ДЖЕРЕЛО ПРАВДИ

**Ніяких захардкоджених назв колонок або даних в коді. Все в одному місці — БД + messages.**

### Назви колонок (заголовки thead):

| Тип колонки | Звідки береться підпис | Приклад |
|---|---|---|
| **Spec-колонки** (d_mm, D_mm, J_mm, H_T, A_mm...) | `tableNSpecLabels['spec_key']` — з API `/product-tables/{slug}?locale=` поле `spec_labels` | `table5SpecLabels['d_mm'] \|\| t('cols.d_mm')` |
| **Non-spec колонки** (part_number, bearing_designation, brand, cross_ref) | `t('cols.*')` — з `messages/uk\|en\|pl.json` → `bearingsPage.cols.*` | `t('cols.part_number')` |

### Чому це правило існує:
Без нього підписи хардкодились лише українською і не перекладались при зміні мови. API вже повертає `spec_labels` з правильним locale — треба лише підключити стан.

### Як додати spec_labels для нової таблиці:
```tsx
const [tableNSpecLabels, setTableNSpecLabels] = useState<Record<string, string>>({});
// у fetch:
if (dataN.table?.spec_labels) setTableNSpecLabels(dataN.table.spec_labels);
// у thead:
<Th col="bore_diameter_d_mm" label={tableNSpecLabels['d_mm'] || t('cols.d_mm')} ... />
```

---

## Правила роботи ШІ

1. Якщо тебе просять правити `/products/hubs` — **не відкривай і не правь** `BearingsCategoryPage.tsx` або `bearings.module.css`
2. Якщо тебе просять правити `/products/bearings` — **не відкривай і не правь** `HubsCategoryPage.tsx` або `hubs.module.css`
3. Перед будь-якою зміною колонок — перечитай таблицю специфікацій вище. Змінювати дозволено тільки якщо є явна нова специфікація від користувача.
4. **Ніколи не хардкодити підписи колонок** — дивись розділ "ЗАБОРОНА ХАРДКОДУ" вище.
