# BearingsCategoryPage — Заморожені специфікації таблиць

## КРИТИЧНЕ ПРАВИЛО

**НІКОЛИ не змінюй структуру колонок жодної з 5 таблиць без явної вказівки з НОВОЮ специфікацією.**
Правила нижче — джерело правди. Вони мають пріоритет над будь-якими "покращеннями" або "вирівнюванням з іншими сторінками".

---

## Таблиця 1 — BUQ стандартні вузли (T1)

**Дані:** API `/v1/products/tables/buq-standard` → об'єкти зі **camelCase/underscore** полями  
**Компонент:** `sortedT1`, `filteredT1`, `tog1`, `sc1`, `sd1`

| # | col (ключ) | label | hasFilter |
|---|---|---|---|
| 1 | `article` | Part Number | ні |
| 2 | `cross_ref` | Cross-Reference | ні |
| 3 | `brand` | Brand | так |
| 4 | `d_mm` | d (mm) | так |
| 5 | `d_inch` | d (inch) | так |
| 6 | `A1` | A1 (mm) | так |
| 7 | `A2` | A2 (mm) | так |
| 8 | `J` | J (mm) | так |
| 9 | `L` | L (mm) | так |
| 10 | `N` | N (mm) | так |
| 11 | `A` | A (mm) | так |
| 12 | `mass_kg` | Mass (kg) | так |
| 13 | `Cdyn` | Cdyn (kN) | так |
| 14 | `Co` | Co (kN) | так |
| 15 | `Pu` | Pu (kN) | так |
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

**Дані:** API → рядки з рядковими ключами. Ключ Brand: `Brand \\nname` (подвійний escape!)  
**Компонент:** `sortedT4`, `filteredT4`, `tog4`, `sc4`, `sd4`

| # | col (ключ API) | label | hasFilter |
|---|---|---|---|
| 1 | `Part Number` | Part Number | ні |
| 2 | `Bearing designation` | Bearing Designation | ні |
| 3 | `Brand \\nname` | Brand | так |
| 4 | `Cross-Refference` | Cross-Reference | ні |
| 5 | `Bore diameter d (mm)` | Bore d (mm) | так |
| 6 | `Centering diameter d1 (mm)` | d1 (mm) | так |
| 7 | `Housing overall width L1 (mm)` | L1 (mm) | так |
| 8 | `Distance between the holes J1 (mm)` | J1 (mm) | так |
| 9 | `Housing overall width L2 (mm)` | L2 (mm) | так |
| 10 | `Distance between the holes J2 (mm)` | J2 (mm) | так |
| 11 | `Overall width A (mm)` | A (mm) | так |
| 12 | `Flange width A1 (mm)` | A1 (mm) | так |
| 13 | `Flange width A2 (mm)` | A2 (mm) | так |
| 14 | `Centering diameter height A3 (mm)` | A3 (mm) | так |
| 15 | `Threaded hole size T` | T | так |
| 16 | `Hole diameter H (mm)` | H (mm) | так |
| 17 | `Mass kg` | Mass (kg) | так |

**Немає actionCol** у T4.

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

## Правила роботи ШІ

1. Якщо тебе просять правити `/products/hubs` — **не відкривай і не правь** `BearingsCategoryPage.tsx` або `bearings.module.css`
2. Якщо тебе просять правити `/products/bearings` — **не відкривай і не правь** `HubsCategoryPage.tsx` або `hubs.module.css`
3. Перед будь-якою зміною колонок — перечитай таблицю специфікацій вище. Змінювати дозволено тільки якщо є явна нова специфікація від користувача.
