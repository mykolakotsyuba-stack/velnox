<?php

namespace App\Http\Controllers\Api;

use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    /**
     * GET /api/v1/categories?locale=uk
     */
    public function index(Request $request): JsonResponse
    {
        $locale = $request->get('locale', 'en');

        $categories = Category::orderBy('sort_order')->get();
        $catIds     = $categories->pluck('id')->toArray();

        $names = DB::table('translations')
            ->where('entity_type', 'category')
            ->whereIn('entity_id', $catIds)
            ->whereIn('locale', [$locale, 'en'])
            ->where('field', 'name')
            ->get()
            ->groupBy('entity_id');

        $data = $categories->map(function ($c) use ($names, $locale) {
            $nameRows = $names->get($c->id, collect());
            $name = $nameRows->firstWhere('locale', $locale)?->value
                 ?? $nameRows->firstWhere('locale', 'en')?->value
                 ?? $c->slug;

            return ['slug' => $c->slug, 'name' => $name];
        });

        return response()->json(['data' => $data]);
    }

    /**
     * GET /api/v1/categories/{slug}?locale=uk
     */
    public function show(string $slug, Request $request): JsonResponse
    {
        $locale   = $request->get('locale', 'en');
        $category = Category::where('slug', $slug)->firstOrFail();

        $name = DB::table('translations')
            ->where('entity_type', 'category')
            ->where('entity_id', $category->id)
            ->where('locale', $locale)
            ->where('field', 'name')
            ->value('value')
            ?? DB::table('translations')
                ->where('entity_type', 'category')
                ->where('entity_id', $category->id)
                ->where('locale', 'en')
                ->where('field', 'name')
                ->value('value')
            ?? $category->slug;

        // Tables in this category with their slugs
        $tables = DB::table('product_tables')
            ->where('category_id', $category->id)
            ->orderBy('sort_order')
            ->pluck('slug');

        return response()->json([
            'slug'   => $category->slug,
            'name'   => $name,
            'tables' => $tables,
        ]);
    }
}
