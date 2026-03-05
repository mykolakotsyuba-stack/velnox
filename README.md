# VELNOX B2B Engineering Portal

Headless B2B-портал для OEM-виробників, конструкторських відділів та дистриб'юторів.

## Структура проекту

```
Велнокс/
├── velnox-api/          # Backend: Laravel 11 + Filament 3 (Admin + REST API)
└── velnox-frontend/     # Frontend: Next.js 14 + TypeScript + FSD + i18n
```

---

## Backend (`velnox-api/`)

**Стек**: Laravel 11, Filament 3, PostgreSQL

### Встановлення

```bash
cd velnox-api
composer install
cp .env.example .env
php artisan key:generate

# Налаштуйте .env (DB_DATABASE, DB_USERNAME, DB_PASSWORD)

php artisan migrate --seed       # Міграції + демо-дані (28071300 VX)
php artisan make:filament-user   # Створити admin-акаунт
php artisan serve                # http://localhost:8000
```

### URL-адреси
| URL | Опис |
|---|---|
| `http://localhost:8000/admin` | Filament адмінка |
| `http://localhost:8000/api/v1/products` | Список товарів |
| `http://localhost:8000/api/v1/products/28071300-VX` | Картка товару |
| `http://localhost:8000/api/v1/categories` | Категорії |
| `http://localhost:8000/api/v1/news` | Новини |

### Імпорт з 1С
```bash
# POST /api/v1/import/products
# Authorization: Bearer {IMPORT_API_TOKEN}
# Body: JSON-масив товарів (формат з ТЗ)
```

---

## Frontend (`velnox-frontend/`)

**Стек**: Next.js 14 (App Router), TypeScript, next-intl, CSS Modules

### Встановлення

```bash
cd velnox-frontend
npm install
# .env.local вже налаштований на http://localhost:8000
npm run dev           # http://localhost:3000
```

### Маршрути
| URL | Сторінка |
|---|---|
| `/en` | Головна (EN) |
| `/uk` | Головна (UA) |
| `/pl` | Головна (PL) |
| `/en/products` | Каталог категорій |
| `/en/products/hubs` | Список ступиць |
| `/en/products/hubs/28071300-VX` | Картка товару |
| `/en/news` | Новини |
| `/en/about` | Про нас |

### Архітектура (FSD)
```
src/
├── app/[locale]/       # Роутинг (Next.js App Router)
├── widgets/            # Header, Footer
├── features/           # products/, news/ (ізольовані фічі)
│   └── products/
│       └── ProductTemplate/   # ← SINGLETON для всіх карток
├── entities/           # Типи + API-виклики
└── shared/             # MainLayout, утиліти, i18n
```

### i18n (3 мови)
- Статичний інтерфейс → `messages/en.json`, `uk.json`, `pl.json`
- Динамічний контент (назви товарів, описи) → із `translations` поля API
- **Fallback**: якщо переклад відсутній → автоматично EN

---

## Додати новий блок на ВСІ картки товарів

Відкрийте `src/features/products/ProductTemplate/ProductTemplate.tsx` та додайте компонент:

```tsx
// Блок з'явиться на всіх товарах одночасно
<DistributorsBlock locale={locale} category={product.category_id} />
```
