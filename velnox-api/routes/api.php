<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductTableController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\LeadController;

Route::prefix('v1')->group(function () {

    // Categories
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{slug}', [CategoryController::class, 'show']);

    // Product table (for category page)
    Route::get('/product-tables/{slug}', [ProductTableController::class, 'show']);

    // Products
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{slug}', [ProductController::class, 'show']);

    // News
    Route::get('/news', [NewsController::class, 'index']);
    Route::get('/news/{slug}', [NewsController::class, 'show']);

    // Leads
    Route::post('/leads/engineer', [LeadController::class, 'engineerRequest']);

    // Import from 1C (token-protected)
    Route::middleware('auth:sanctum')->post('/import/products', [ProductController::class, 'import']);
});
