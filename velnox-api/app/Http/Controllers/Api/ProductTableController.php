<?php

namespace App\Http\Controllers\Api;

use App\Models\ProductTable;
use App\Models\Translation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;

class ProductTableController extends Controller
{
    /**
     * GET /api/v1/product-tables/{slug}?locale=uk
     *
     * Returns table metadata + all products with specs and cross-refs.
     * Used by category page table view.
     */
    public function show(string $slug, Request $request): JsonResponse
    {
        $locale = $request->get('locale', 'en');

        $table = ProductTable::where('slug', $slug)->firstOrFail();
        $specColumns = $table->spec_columns ?? [];

        // Table name (with fallback to EN)
        $tableName = $this->getTranslation('product_table', $table->id, $locale, 'name')
            ?? $table->slug;

        // Spec definitions for columns in this table
        $specDefs = DB::table('spec_definitions')
            ->whereIn('key', $specColumns)
            ->get()
            ->keyBy('key');

        $specIds = $specDefs->pluck('id')->toArray();

        // All translations for these specs (both requested locale and EN as fallback)
        $specTrans = DB::table('translations')
            ->where('entity_type', 'spec_definitions')
            ->whereIn('entity_id', $specIds)
            ->whereIn('locale', [$locale, 'en'])
            ->whereIn('field', ['label', 'unit'])
            ->get();

        $specLabels = [];
        $specUnits  = [];
        foreach ($specColumns as $key) {
            if (!isset($specDefs[$key])) {
                $specLabels[$key] = $key;
                $specUnits[$key]  = '';
                continue;
            }
            $specId = $specDefs[$key]->id;

            $label = $specTrans->where('entity_id', $specId)->where('locale', $locale)->where('field', 'label')->first()
                  ?? $specTrans->where('entity_id', $specId)->where('locale', 'en')->where('field', 'label')->first();
            $unit  = $specTrans->where('entity_id', $specId)->where('locale', $locale)->where('field', 'unit')->first()
                  ?? $specTrans->where('entity_id', $specId)->where('locale', 'en')->where('field', 'unit')->first();

            $specLabels[$key] = $label?->value ?? $key;
            $specUnits[$key]  = $unit?->value  ?? '';
        }

        // Products in this table
        $products   = DB::table('products')->where('product_table_id', $table->id)->get();
        $productIds = $products->pluck('id')->toArray();

        // All specs for these products (filter by spec_columns if defined, else return all)
        $specsQuery = DB::table('product_specs')
            ->join('spec_definitions', 'product_specs.spec_id', '=', 'spec_definitions.id')
            ->whereIn('product_specs.product_id', $productIds)
            ->select('product_specs.product_id', 'spec_definitions.key', 'product_specs.value');
        if (!empty($specColumns)) {
            $specsQuery->whereIn('spec_definitions.key', $specColumns);
        }
        $allSpecs = $specsQuery->get()->groupBy('product_id');

        // All cross-refs for these products
        $allCrossRefs = DB::table('product_cross_refs')
            ->whereIn('product_id', $productIds)
            ->select('product_id', 'brand', 'value')
            ->get()
            ->groupBy('product_id');

        $productsData = $products->map(function ($p) use ($allSpecs, $allCrossRefs) {
            $specs = [];
            foreach ($allSpecs->get($p->id, collect()) as $spec) {
                $specs[$spec->key] = $spec->value;
            }
            $crossRefs = $allCrossRefs->get($p->id, collect())
                ->map(fn($r) => ['brand' => $r->brand, 'value' => $r->value])
                ->values()
                ->all();

            return [
                'slug'       => $p->slug,
                'article'    => $p->article,
                'specs'      => $specs,
                'cross_refs' => $crossRefs,
            ];
        })->values();

        $schemaSrc = DB::table('product_assets')
            ->where('entity_type', 'product_table')
            ->where('entity_id', $table->id)
            ->where('type', 'schema_png')
            ->orderBy('sort_order')
            ->value('path');

        return response()->json([
            'table' => [
                'slug'         => $table->slug,
                'name'         => $tableName,
                'spec_columns' => $specColumns,
                'spec_labels'  => $specLabels,
                'spec_units'   => $specUnits,
                'schema_src'   => $schemaSrc,
            ],
            'products' => $productsData,
        ]);
    }

    private function getTranslation(string $entityType, int $entityId, string $locale, string $field): ?string
    {
        return Translation::where('entity_type', $entityType)
            ->where('entity_id', $entityId)
            ->where('locale', $locale)
            ->where('field', $field)
            ->value('value')
            ?? Translation::where('entity_type', $entityType)
                ->where('entity_id', $entityId)
                ->where('locale', 'en')
                ->where('field', $field)
                ->value('value');
    }
}
