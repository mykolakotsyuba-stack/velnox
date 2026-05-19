<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use App\Models\Translation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    /**
     * GET /api/v1/products?category=bearings&locale=uk
     */
    public function index(Request $request): JsonResponse
    {
        $locale = $request->get('locale', 'en');

        $query = DB::table('products')
            ->join('product_tables', 'products.product_table_id', '=', 'product_tables.id')
            ->join('categories', 'product_tables.category_id', '=', 'categories.id')
            ->select('products.id', 'products.slug', 'products.article', 'categories.slug as category_slug');

        if ($category = $request->get('category')) {
            $query->where('categories.slug', $category);
        }

        $products   = $query->get();
        $productIds = $products->pluck('id')->toArray();

        $names = DB::table('translations')
            ->where('entity_type', 'product')
            ->whereIn('entity_id', $productIds)
            ->whereIn('locale', [$locale, 'en'])
            ->where('field', 'name')
            ->get()
            ->groupBy('entity_id');

        $data = $products->map(function ($p) use ($names, $locale) {
            $nameRows = $names->get($p->id, collect());
            $name = $nameRows->firstWhere('locale', $locale)?->value
                 ?? $nameRows->firstWhere('locale', 'en')?->value
                 ?? $p->article;

            return [
                'slug'     => $p->slug,
                'article'  => $p->article,
                'category' => $p->category_slug,
                'name'     => $name,
            ];
        });

        return response()->json([
            'data' => $data,
            'meta' => ['total' => $data->count()],
        ]);
    }

    /**
     * GET /api/v1/products/{slug}?locale=uk
     *
     * Full product card:
     *   specs   → ordered array [{key, label, value, unit}]
     *   images  → product-level overrides table-level by type (RULE 4)
     */
    public function show(string $slug, Request $request): JsonResponse
    {
        $locale  = $request->get('locale', 'en');
        $product = Product::with('productTable.category')->where('slug', $slug)->firstOrFail();

        // ── Specs ──
        $rawSpecs = DB::table('product_specs')
            ->join('spec_definitions', 'product_specs.spec_id', '=', 'spec_definitions.id')
            ->where('product_specs.product_id', $product->id)
            ->orderBy('spec_definitions.sort_order')
            ->select('spec_definitions.id as spec_def_id', 'spec_definitions.key', 'product_specs.value')
            ->get();

        $specDefIds = $rawSpecs->pluck('spec_def_id')->unique()->toArray();

        $specTrans = DB::table('translations')
            ->where('entity_type', 'spec_definitions')
            ->whereIn('entity_id', $specDefIds)
            ->whereIn('locale', [$locale, 'en'])
            ->whereIn('field', ['label', 'unit'])
            ->get()
            ->groupBy('entity_id');

        $specs = $rawSpecs->map(function ($s) use ($specTrans, $locale) {
            $trans = $specTrans->get($s->spec_def_id, collect());
            $label = $trans->first(fn($t) => $t->locale === $locale && $t->field === 'label')
                  ?? $trans->first(fn($t) => $t->locale === 'en'     && $t->field === 'label');
            $unit  = $trans->first(fn($t) => $t->locale === $locale && $t->field === 'unit')
                  ?? $trans->first(fn($t) => $t->locale === 'en'     && $t->field === 'unit');
            return [
                'key'   => $s->key,
                'label' => $label?->value ?? $s->key,
                'value' => $s->value,
                'unit'  => $unit?->value  ?? '',
            ];
        });

        // ── Cross refs ──
        $crossRefs = DB::table('product_cross_refs')
            ->where('product_id', $product->id)
            ->select('brand', 'value', 'type')
            ->get()
            ->map(fn($r) => ['brand' => $r->brand, 'value' => $r->value, 'type' => $r->type ?? 'bearing']);

        // ── Installations ──
        $installations = DB::table('product_installations')
            ->where('product_id', $product->id)
            ->pluck('value');

        // ── Images: product-level overrides table-level by type (RULE 4) ──
        $tableAssets   = DB::table('product_assets')
            ->where('entity_type', 'product_table')
            ->where('entity_id', $product->product_table_id)
            ->orderBy('sort_order')->get();

        $productAssets = DB::table('product_assets')
            ->where('entity_type', 'product')
            ->where('entity_id', $product->id)
            ->orderBy('sort_order')->get();

        $byType = [];
        foreach ($tableAssets as $a) {
            $byType[$a->type][] = ['type' => $a->type, 'path' => $a->path, 'sort_order' => $a->sort_order];
        }
        foreach ($productAssets as $a) {
            $byType[$a->type] = [['type' => $a->type, 'path' => $a->path, 'sort_order' => $a->sort_order]];
        }

        $images = [];
        foreach ($byType as $assets) {
            foreach ($assets as $img) {
                $images[] = $img;
            }
        }
        usort($images, fn($a, $b) => $a['sort_order'] <=> $b['sort_order']);

        // ── Name & desc ──
        $name = Translation::where('entity_type', 'product')->where('entity_id', $product->id)
                    ->where('locale', $locale)->where('field', 'name')->value('value')
             ?? Translation::where('entity_type', 'product')->where('entity_id', $product->id)
                    ->where('locale', 'en')->where('field', 'name')->value('value')
             ?? $product->article;

        $desc = Translation::where('entity_type', 'product')->where('entity_id', $product->id)
                    ->where('locale', $locale)->where('field', 'desc')->value('value');

        $metaTitle = Translation::where('entity_type', 'product')->where('entity_id', $product->id)
                        ->where('locale', $locale)->where('field', 'meta_title')->value('value');

        $metaDesc = Translation::where('entity_type', 'product')->where('entity_id', $product->id)
                        ->where('locale', $locale)->where('field', 'meta_description')->value('value');

        $model3d = collect($images)->firstWhere('type', 'model_3d');

        // ── Schema overlay data from product_tables ──
        $productTable = DB::table('product_tables')
            ->where('id', $product->product_table_id)
            ->first();

        $schemaSvg = DB::table('product_assets')
            ->where('entity_type', 'product_table')
            ->where('entity_id', $product->product_table_id)
            ->where('type', 'schema_svg')
            ->orderBy('sort_order')
            ->value('path');

        $dimLabels = [];
        $highlightConfig = json_decode($productTable->highlight_config ?? '{}', true) ?? [];
        foreach ($highlightConfig as $specKey => $points) {
            foreach ($points as $pt) {
                $dimLabels[] = [
                    'key'   => $specKey,
                    'label' => $pt['label'],
                    'point' => ['x' => $pt['x'], 'y' => $pt['y']],
                ];
            }
        }

        return response()->json([
            'slug'               => $product->slug,
            'article'            => $product->article,
            'name'               => $name,
            'desc'               => $desc,
            'product_table_slug' => $product->productTable?->slug,
            'category_slug'      => $product->productTable?->category?->slug,
            'specs'              => $specs->values(),
            'cross_refs'         => $crossRefs->values(),
            'installations'      => $installations->values(),
            'images'             => $images,
            'model_3d'           => $model3d ? $model3d['path'] : null,
            'schema_svg'         => $schemaSvg,
            'dim_labels'         => $dimLabels,
            'schema_viewbox'     => $productTable->schema_viewbox ?? null,
            'meta_title'         => $metaTitle,
            'meta_description'   => $metaDesc,
        ]);
    }

    public function import(): JsonResponse
    {
        return response()->json(['message' => 'Not implemented in new architecture'], 501);
    }
}
