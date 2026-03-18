<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class KitTableSeeder extends Seeder
{
    public function run(): void
    {
        $kitCategory = Category::where('slug', 'kit')->first();
        if (!$kitCategory) {
            $this->command->error('Category "kit" not found!');
            return;
        }

        // Mapping table numbers to CSV filenames (Cyrillic)
        $files = [
            1  => 'Для сівалок Таблця 1.csv',
            2  => 'Для сівалок таблиця 2.csv',
            3  => 'Для сівалок таблиця 3.csv',
            5  => 'Для сівалок таблиця 5.csv',
            6  => 'Для сівалок таблиця 6.csv',
            7  => 'Для сівалок таблиця 7 .csv',
            8  => 'Для сівалок таблиця 8.csv',
            9  => 'Для сівалок таблиця 9.csv',
            10 => 'Для сівалок таблиця 10.csv',
            11 => 'Для сівалок таблиця 11.csv',
            12 => 'Для сівалок таблиця 12.csv',
        ];

        // Column keys for each table (matching KitCategoryPage.tsx TABLE_COLS)
        $tableCols = [
            1 => ['Part Number', 'Bearing designation', 'Brand name', 'Cross-Reference', 'd (mm)', 'D (mm)', 'B (mm)', 'C (mm)', 'Mass (kg)', 'Cdyn (kN)', 'Co (kN)', 'Pu (kN)'],
            2 => ['Part Number', 'Bearing designation', 'Brand name', 'Cross-Reference', 'd (mm)', 'D (mm)', 'B (mm)', 'C (mm)', 'Mass (kg)', 'Cdyn (kN)', 'Co (kN)'],
            3 => ['Part Number', 'Bearing designation', 'Brand name', 'Cross-Reference', 'd (mm)', 'd1 (mm)', 'D (mm)', 'B (mm)', 'C (mm)', 'α (°)', 'Mass (kg)', 'Cdyn (kN)', 'Co (kN)', 'Pu (kN)'],
            5 => ['Part Number', 'Bearing designation', 'Brand name', 'Cross-Reference', 'd (mm)', 'D (mm)', 'B (mm)', 'C (mm)', 'α (°)', 'Mass (kg)', 'Cdyn (kN)', 'Co (kN)'],
            6 => ['Part Number', 'Bearing designation', 'Brand name', 'Cross-Reference', 'd (mm)', 'd_groove (mm)', 'D (mm)', 'L (mm)', 'C (mm)', 'e (mm)', 'Mass (kg)', 'Cdyn (kN)', 'Co (kN)', 'Pu (kN)'],
            7 => ['Part Number', 'Bearing designation', 'Brand name', 'Cross-Reference', 'd (mm)', 'd1 (mm)', 'D (mm)', 'B (mm)', 'C (mm)', 'α (°)', 'Mass (kg)', 'Cdyn (kN)', 'Co (kN)', 'Pu (kN)'],
            8 => ['Part Number', 'Bearing designation', 'Brand name', 'Cross-Reference', 'd (mm)', 'D (mm)', 'B (mm)', 'C (mm)', 'α (°)', 'Mass (kg)', 'Cdyn (kN)', 'Co (kN)', 'Pu (kN)'],
            9 => ['Part Number', 'Bearing designation', 'Brand name', 'Cross-Reference', 'd (mm)', 'D (mm)', 'B (mm)', 'C (mm)', 'α (°)', 'Mass (kg)', 'Cdyn (kN)', 'Co (kN)', 'Pu (kN)'],
            10 => ['Part Number', 'Bearing designation', 'Brand name', 'Cross-Reference'],
            11 => ['Part Number', 'Bearing designation', 'Brand name', 'Cross-Reference'],
            12 => ['Part Number', 'Bearing designation', 'Brand name', 'Cross-Reference'],
        ];

        foreach ($files as $num => $filename) {
            $path = base_path('../' . $filename); // Files are in the root directory relative to velnox-api
            if (!file_exists($path)) {
                $this->command->warn("File not found: $path");
                continue;
            }

            $handle = fopen($path, 'r');
            $rowCount = 0;
            $cols = $tableCols[$num];

            while (($data = fgetcsv($handle, 2000, ';')) !== FALSE) {
                $rowCount++;
                
                // Skip if first column is empty or matches header or sub-header
                if (empty($data[0]) || $data[0] === 'Part Number' || str_contains($data[0], '(mm)')) {
                    continue;
                }

                $specs = ['table_group' => "kit-table$num"];
                foreach ($cols as $index => $key) {
                    $specs[$key] = isset($data[$index]) ? trim($data[$index]) : '-';
                }

                $article = $data[0];
                $slug = Str::slug($article . "-kit-t$num");

                $this->command->info("Creating product: $article (slug: $slug) for table $num");

                Product::updateOrCreate(
                    ['slug' => $slug],
                    [
                        'article'     => $article,
                        'category_id' => $kitCategory->id,
                        'specs'       => $specs,
                        'is_active'   => true,
                    ]
                );
            }
            $this->command->info("Finished table $num: processed $rowCount rows");
            fclose($handle);
        }
    }
}
