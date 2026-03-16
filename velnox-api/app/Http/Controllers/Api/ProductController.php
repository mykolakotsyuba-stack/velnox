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
     * Table 2: Performance Data — GET /api/v1/products/tables/performance
     */
    public function tablePerformance(Request $request): JsonResponse
    {
        $locale = $request->get('locale', 'en');

        $products = Product::where('is_active', true)
            ->whereJsonContains('specs->table_group', 'performance')
            ->get()
            ->map(fn($p) => [
                'Part Number' => $p->specs['part_number'] ?? '-',
                'Bearing designation' => $p->specs['bearing_designation'] ?? $p->article,
                'Brand name' => $p->specs['brand_name'] ?? '-',
                'Cross-Refference' => $p->specs['cross_reference'] ?? '-',
                'Bore diameter d (mm)' => $p->specs['bore_diameter_d_mm'] ?? '-',
                'Total housing width A1 (mm)' => $p->specs['total_housing_width_a1_mm'] ?? '-',
                'Housing flange thickness A2 (mm)' => $p->specs['housing_flange_thickness_a2_mm'] ?? '-',
                'Distance between the holes J (mm)' => $p->specs['distance_between_holes_j_mm'] ?? '-',
                'Total length L (mm)' => $p->specs['total_length_l_mm'] ?? '-',
                'Hole / Thread H/T' => $p->specs['hole_thread_ht'] ?? '-',
                'Overall width A (mm)' => $p->specs['overall_width_a_mm'] ?? '-',
                'Mass kg' => $p->specs['mass_kg'] ?? '-',
                'Dynamic load rating Cdyn (kN)' => $p->specs['dynamic_load_rating_cdyn_kn'] ?? '-',
                'Static load rating Co (kN)' => $p->specs['static_load_rating_co_kn'] ?? '-',
                'Fatigue load limit Pu (kN)' => $p->specs['fatigue_load_limit_pu_kn'] ?? '-',
            ]);

        return response()->json($products);
    }

    /**
     * Table 3: Cross-References — GET /api/v1/products/tables/cross-references
     */
    public function tableCrossReferences(Request $request): JsonResponse
    {
        $products = Product::where('is_active', true)
            ->whereJsonContains('specs->table_group', 'cross-references')
            ->get()
            ->map(fn($p) => [
                'Part Number' => $p->article,
                'Bearing designation' => $p->specs['bearing_designation'] ?? '-',
                'Brand \nname' => $p->specs['brand_name'] ?? '-',
                'Cross-Refference' => $p->specs['cross_reference'] ?? '-',
                'Bore diameter d (mm)' => $p->specs['bore_diameter_d_mm'] ?? '-',
                'Total length L (mm)' => $p->specs['total_length_l_mm'] ?? '-',
                'Distance between the holes J (mm)' => $p->specs['distance_between_holes_j_mm'] ?? '-',
                'Hole / Thread H/T (mm)' => $p->specs['hole_thread_ht_mm'] ?? '-',
                'Overall width A (mm)' => $p->specs['overall_width_a_mm'] ?? '-',
                'Total housing width A1 (mm)' => $p->specs['total_housing_width_a1_mm'] ?? '-',
                'Housing flange thickness A2 (mm)' => $p->specs['housing_flange_thickness_a2_mm'] ?? '-',
                'Width inner ring B (mm)' => $p->specs['width_inner_ring_b_mm'] ?? '-',
                'Static load rating Co (kN)' => $p->specs['static_load_rating_co_kn'] ?? '-',
                'Dynamic load rating Cdyn (kN)' => $p->specs['dynamic_load_rating_cdyn_kn'] ?? '-',
                'Fatigue load limit Pu (kN)' => $p->specs['fatigue_load_limit_pu_kn'] ?? '-',
            ]);

        return response()->json($products);
    }

    /**
     * Table 4: Extended Specs — GET /api/v1/products/tables/extended-specs
     */
    public function tableExtendedSpecs(Request $request): JsonResponse
    {
        $products = Product::where('is_active', true)
            ->whereJsonContains('specs->table_group', 'extended-specs')
            ->get()
            ->map(fn($p) => [
                'Part Number' => $p->article,
                'Bearing designation' => $p->specs['bearing_designation'] ?? '-',
                'Brand \nname' => $p->specs['brand_name'] ?? '-',
                'Cross-Refference' => $p->specs['cross_reference'] ?? '-',
                'Bore diameter d (mm)' => $p->specs['bore_diameter_d_mm'] ?? '-',
                'Centering diameter d1 (mm)' => $p->specs['centering_diameter_d1_mm'] ?? '-',
                'Housing overall width L1 (mm)' => $p->specs['housing_overall_width_l1_mm'] ?? '-',
                'Distance between the holes J1 (mm)' => $p->specs['distance_between_holes_j1_mm'] ?? '-',
                'Housing overall width L2 (mm)' => $p->specs['housing_overall_width_l2_mm'] ?? '-',
                'Distance between the holes J2 (mm)' => $p->specs['distance_between_holes_j2_mm'] ?? '-',
                'Overall width A (mm)' => $p->specs['overall_width_a_mm'] ?? '-',
                'Flange width A1 (mm)' => $p->specs['flange_width_a1_mm'] ?? '-',
                'Flange width A2 (mm)' => $p->specs['flange_width_a2_mm'] ?? '-',
                'Centering diameter height A3 (mm)' => $p->specs['centering_diameter_height_a3_mm'] ?? '-',
                'Threaded hole size T' => $p->specs['threaded_hole_size_t'] ?? '-',
                'Hole diameter H (mm)' => $p->specs['hole_diameter_h_mm'] ?? '-',
                'Mass kg' => $p->specs['mass_kg'] ?? '-',
            ]);

        return response()->json($products);
    }

    /**
     * Table 5: Additional Data — GET /api/v1/products/tables/additional-data
     */
    public function tableAdditionalData(Request $request): JsonResponse
    {
        $products = Product::where('is_active', true)
            ->whereJsonContains('specs->table_group', 'additional-data')
            ->get()
            ->map(fn($p) => [
                'Part Number' => $p->article,
                'Bearing designation' => $p->specs['bearing_designation'] ?? '-',
                'Brand \nname' => $p->specs['brand_name'] ?? '-',
                'Cross-Refference' => $p->specs['cross_reference'] ?? '-',
                'Bore diameter d (mm)' => $p->specs['bore_diameter_d_mm'] ?? '-',
                'Outside diameter D (mm)' => $p->specs['outside_diameter_d_mm'] ?? '-',
                'Pitch circle diameter J (mm)' => $p->specs['pitch_circle_diameter_j_mm'] ?? '-',
                'Hole / Thread H/T' => $p->specs['hole_thread_ht'] ?? '-',
                'Overall width A (mm)' => $p->specs['overall_width_a_mm'] ?? '-',
                'Housing flange thickness A2 (mm)' => $p->specs['housing_flange_thickness_a2_mm'] ?? '-',
                'Width inner ring B (mm)' => $p->specs['width_inner_ring_b_mm'] ?? '-',
                'Mass kg' => $p->specs['mass_kg'] ?? '-',
                'Static load rating Co (kN)' => $p->specs['static_load_rating_co_kn'] ?? '-',
                'Dynamic load rating Cdyn (kN)' => $p->specs['dynamic_load_rating_cdyn_kn'] ?? '-',
                'Fatigue load limit Pu (kN)' => $p->specs['fatigue_load_limit_pu_kn'] ?? '-',
            ]);

        return response()->json($products);
    }

    /**
     * Hubs Table 1: 28071300 VX (Disk Harrows) — GET /api/v1/products/tables/hubs-table1
     */
    public function tableHubsTable1(Request $request): JsonResponse
    {
        $products = Product::where('is_active', true)
            ->whereJsonContains('specs->table_group', 'hubs-table1')
            ->get()
            ->map(fn($p) => [
                'Part Number' => $p->article,
                'Bearing designation' => $p->specs['bearing_designation'] ?? '-',
                'Brand name' => $p->specs['brand_name'] ?? '-',
                'J (mm)' => $p->specs['j_mm'] ?? '-',
                'D (mm)' => $p->specs['D_mm'] ?? '-',
                'D1 (mm)' => $p->specs['D1_mm'] ?? '-',
                'd (mm)' => $p->specs['d_mm'] ?? '-',
                'C (mm)' => $p->specs['C_mm'] ?? '-',
                'H/T' => $p->specs['hole_thread'] ?? '-',
                'G' => $p->specs['G'] ?? '-',
                'L (mm)' => $p->specs['L_mm'] ?? '-',
                'L1 (mm)' => $p->specs['L1_mm'] ?? '-',
                'F (mm)' => $p->specs['F_mm'] ?? '-',
                'Mass (kg)' => $p->specs['mass_kg'] ?? '-',
                'Cdyn (kN)' => $p->specs['cdyn_kn'] ?? '-',
                'Co (kN)' => $p->specs['co_kn'] ?? '-',
                'Pu (kN)' => $p->specs['pu_kn'] ?? '-',
            ]);

        return response()->json($products);
    }

    /**
     * Hubs Table 2: BAA-0004 VX (Cutting Nodes) — GET /api/v1/products/tables/hubs-table2
     */
    public function tableHubsTable2(Request $request): JsonResponse
    {
        $products = Product::where('is_active', true)
            ->whereJsonContains('specs->table_group', 'hubs-table2')
            ->get()
            ->map(fn($p) => [
                'Part Number' => $p->article,
                'Bearing designation' => $p->specs['bearing_designation'] ?? '-',
                'Brand name' => $p->specs['brand_name'] ?? '-',
                'J (mm)' => $p->specs['j_mm'] ?? '-',
                'D (mm)' => $p->specs['D_mm'] ?? '-',
                'H/T' => $p->specs['hole_thread'] ?? '-',
                'd (mm)' => $p->specs['d_mm'] ?? '-',
                'C (mm)' => $p->specs['C_mm'] ?? '-',
                'M' => $p->specs['M_thread'] ?? '-',
                'L (mm)' => $p->specs['L_mm'] ?? '-',
                'L1 (mm)' => $p->specs['L1_mm'] ?? '-',
                'E (mm)' => $p->specs['E_mm'] ?? '-',
                'F (mm)' => $p->specs['F_mm'] ?? '-',
                'Mass (kg)' => $p->specs['mass_kg'] ?? '-',
                'Cdyn (kN)' => $p->specs['cdyn_kn'] ?? '-',
                'Co (kN)' => $p->specs['co_kn'] ?? '-',
                'Pu (kN)' => $p->specs['pu_kn'] ?? '-',
            ]);

        return response()->json($products);
    }

    /**
     * Hubs Table 3: PL-140 VX (Seeders) — GET /api/v1/products/tables/hubs-table3
     */
    public function tableHubsTable3(Request $request): JsonResponse
    {
        $products = Product::where('is_active', true)
            ->whereJsonContains('specs->table_group', 'hubs-table3')
            ->get()
            ->map(fn($p) => [
                'Part Number' => $p->article,
                'Bearing designation' => $p->specs['bearing_designation'] ?? '-',
                'Brand name' => $p->specs['brand_name'] ?? '-',
                'J (mm)' => $p->specs['j_mm'] ?? '-',
                'D (mm)' => $p->specs['D_mm'] ?? '-',
                'D1 (mm)' => $p->specs['D1_mm'] ?? '-',
                'd (mm)' => $p->specs['d_mm'] ?? '-',
                'H/T' => $p->specs['hole_thread'] ?? '-',
                'L (mm)' => $p->specs['L_mm'] ?? '-',
                'B (mm)' => $p->specs['B_mm'] ?? '-',
                'Mass (kg)' => $p->specs['mass_kg'] ?? '-',
                'Cdyn (kN)' => $p->specs['cdyn_kn'] ?? '-',
                'Co (kN)' => $p->specs['co_kn'] ?? '-',
                'Pu (kN)' => $p->specs['pu_kn'] ?? '-',
            ]);

        return response()->json($products);
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
