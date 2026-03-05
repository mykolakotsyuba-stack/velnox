<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ProductListResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class ProductController extends Controller
{
    /**
     * Список товарів з фільтрацією
     * GET /api/v1/products?category=hubs&cdyn_min=30&locale=en
     */
    public function index(Request $request): JsonResponse
    {
        $locale = $request->get('locale', 'en');

        $query = Product::with('category')
            ->where('is_active', true);

        // Фільтр по категорії
        if ($category = $request->get('category')) {
            $query->whereHas('category', fn($q) => $q->where('slug', $category));
        }

        // Фільтр по Cdyn
        if ($min = $request->get('cdyn_min')) {
            $query->whereRaw("(specs->>'Cdyn')::numeric >= ?", [$min]);
        }
        if ($max = $request->get('cdyn_max')) {
            $query->whereRaw("(specs->>'Cdyn')::numeric <= ?", [$max]);
        }

        // Пошук по OEM cross ref
        if ($oem = $request->get('oem')) {
            $query->whereJsonContains('oem_cross', $oem);
        }

        $perPage = $request->get('per_page', 24);
        $products = $query->paginate($perPage);

        return response()->json([
            'data' => $products->getCollection()->map(
                fn($p) => [
                    'slug'    => $p->slug,
                    'article' => $p->article,
                    'category'=> $p->category?->slug,
                    'specs'   => $p->specs,
                    'name'    => $p->getTranslation($locale)['product_name'] ?? $p->article,
                ]
            ),
            'meta' => [
                'total'        => $products->total(),
                'per_page'     => $products->perPage(),
                'current_page' => $products->currentPage(),
                'last_page'    => $products->lastPage(),
            ],
        ]);
    }

    /**
     * Картка товару — повний JSON за форматом ТЗ
     * GET /api/v1/products/{slug}?locale=en
     */
    public function show(string $slug, Request $request): JsonResponse
    {
        $product = Product::with('category')
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return response()->json($product->toApiArray(
            $request->get('locale', 'en')
        ));
    }

    /**
     * Імпорт товарів з 1С (захищений Sanctum-токеном)
     * POST /api/v1/import/products
     * Body: JSON-масив товарів
     */
    public function import(Request $request): JsonResponse
    {
        $items = $request->json()->all();
        $imported = 0;

        foreach ($items as $item) {
            Product::updateOrCreate(
                ['slug' => $item['slug'] ?? str($item['article'])->slug()],
                [
                    'article'         => $item['article'],
                    'fkl_designation' => $item['fkl_designation'] ?? null,
                    'category_id'     => Category::where('slug', $item['category_id'])->value('id'),
                    'specs'           => $item['specs'] ?? [],
                    'oem_cross'       => $item['oem_cross'] ?? [],
                    'installations'   => $item['installations'] ?? [],
                    'translations'    => $item['translations'] ?? [],
                    'is_active'       => true,
                ]
            );
            $imported++;
        }

        return response()->json(['imported' => $imported]);
    }
}
