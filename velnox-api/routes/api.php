<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\NewsController;

/*
|--------------------------------------------------------------------------
| VELNOX API Routes
|--------------------------------------------------------------------------
|
| База: /api/v1/
| Всі відповіді — JSON у форматі згідно ТЗ VELNOX
|
*/

Route::prefix('v1')->group(function () {

    // Категорії продуктів
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{slug}', [CategoryController::class, 'show']);

    // Продукти
    Route::get('/products', [ProductController::class, 'index']);       // ?category=hubs&cdyn_min=30&cdyn_max=100&locale=en
    Route::get('/products/{slug}', [ProductController::class, 'show']); // ?locale=en

    // Tables для сторінки bearings
    Route::get('/products/tables/performance', [ProductController::class, 'tablePerformance']);
    Route::get('/products/tables/cross-references', [ProductController::class, 'tableCrossReferences']);
    Route::get('/products/tables/extended-specs', [ProductController::class, 'tableExtendedSpecs']);
    Route::get('/products/tables/additional-data', [ProductController::class, 'tableAdditionalData']);

    // Новини
    Route::get('/news', [NewsController::class, 'index']);              // ?category=oem-solutions&locale=en
    Route::get('/news/{slug}', [NewsController::class, 'show']);

    // Імпорт з 1С (захищений API-токеном)
    Route::middleware('auth:sanctum')->post('/import/products', [ProductController::class, 'import']);
});
