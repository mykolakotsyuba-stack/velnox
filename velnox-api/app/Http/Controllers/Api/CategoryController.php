<?php

namespace App\Http\Controllers\Api;

use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class CategoryController extends Controller
{
    /**
     * Всі активні категорії
     * GET /api/v1/categories?locale=en
     */
    public function index(Request $request): JsonResponse
    {
        $locale = $request->get('locale', 'en');

        $categories = Category::where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(fn($c) => [
                'slug'          => $c->slug,
                'name'          => $c->getName($locale),
                'product_count' => $c->products()->where('is_active', true)->count(),
            ]);

        return response()->json(['data' => $categories]);
    }

    /**
     * Категорія + перелік товарів у ній
     * GET /api/v1/categories/{slug}?locale=en
     */
    public function show(string $slug, Request $request): JsonResponse
    {
        $locale = $request->get('locale', 'en');

        $category = Category::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return response()->json([
            'slug'  => $category->slug,
            'name'  => $category->getName($locale),
        ]);
    }
}
