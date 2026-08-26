<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // =========================================================
        // 1. CATEGORIES
        // =========================================================
        $categories = [
            ['slug' => 'bearings', 'sort_order' => 1],
            ['slug' => 'hubs',     'sort_order' => 2],
            ['slug' => 'agro',     'sort_order' => 3],
            ['slug' => 'kit',      'sort_order' => 4],
            ['slug' => 'custom',   'sort_order' => 5],
        ];

        foreach ($categories as $cat) {
            DB::table('categories')->updateOrInsert(['slug' => $cat['slug']], $cat);
        }

        $catId = fn(string $slug) => DB::table('categories')->where('slug', $slug)->value('id');

        // =========================================================
        // 2. SPEC DEFINITIONS
        // =========================================================
        $specs = [
            ['key' => 'd_mm',       'svg_label' => 'd',  'sort_order' => 1],
            ['key' => 'd_inch',     'svg_label' => null,  'sort_order' => 2],
            ['key' => 'A1_mm',      'svg_label' => 'A1', 'sort_order' => 3],
            ['key' => 'A2_mm',      'svg_label' => 'A2', 'sort_order' => 4],
            ['key' => 'J_mm',       'svg_label' => 'J',  'sort_order' => 5],
            ['key' => 'L_mm',       'svg_label' => 'L',  'sort_order' => 6],
            ['key' => 'N_mm',       'svg_label' => 'N',  'sort_order' => 7],
            ['key' => 'A_mm',       'svg_label' => 'A',  'sort_order' => 8],
            ['key' => 'mass_kg',    'svg_label' => null,  'sort_order' => 9],
            ['key' => 'cdyn_kn',    'svg_label' => null,  'sort_order' => 10],
            ['key' => 'co_kn',      'svg_label' => null,  'sort_order' => 11],
            ['key' => 'pu_kn',      'svg_label' => null,  'sort_order' => 12],
            ['key' => 'B_mm',       'svg_label' => 'B',   'sort_order' => 13],
            ['key' => 'D_mm',       'svg_label' => 'D',   'sort_order' => 14],
            ['key' => 'H_T',        'svg_label' => null,  'sort_order' => 15],
            ['key' => 'L1_mm',      'svg_label' => 'L1',  'sort_order' => 16],
            ['key' => 'L2_mm',      'svg_label' => 'L2',  'sort_order' => 17],
            ['key' => 'hub_J_mm',        'svg_label' => 'J',    'sort_order' => 20],
            ['key' => 'hub_D_mm',        'svg_label' => 'D',    'sort_order' => 21],
            ['key' => 'hub_D1_mm',       'svg_label' => 'D1',   'sort_order' => 22],
            ['key' => 'hub_d_mm',        'svg_label' => 'd',    'sort_order' => 23],
            ['key' => 'hub_C_mm',        'svg_label' => 'C',    'sort_order' => 24],
            ['key' => 'hub_hole_thread', 'svg_label' => null,   'sort_order' => 25],
            ['key' => 'hub_G',           'svg_label' => 'G',    'sort_order' => 26],
            ['key' => 'hub_L_mm',        'svg_label' => 'L',    'sort_order' => 27],
            ['key' => 'hub_L1_mm',       'svg_label' => 'L1',   'sort_order' => 28],
            ['key' => 'hub_F_mm',        'svg_label' => 'F',    'sort_order' => 29],
            ['key' => 'hub_M_thread',    'svg_label' => null,   'sort_order' => 30],
            ['key' => 'hub_E_mm',        'svg_label' => 'E',    'sort_order' => 31],
            ['key' => 'hub_B_mm',        'svg_label' => 'B',    'sort_order' => 32],
            ['key' => 'd1_mm',           'svg_label' => 'd1',   'sort_order' => 33],
            ['key' => 'r_12_mm',         'svg_label' => null,   'sort_order' => 34],
            // agro-t2 (DHU series)
            ['key' => 'C_mm',            'svg_label' => 'C',    'sort_order' => 35],
            ['key' => 'Da_mm',           'svg_label' => 'Da',   'sort_order' => 36],
            ['key' => 'Fr_kn',           'svg_label' => null,   'sort_order' => 37],
            ['key' => 'Fa_kn',           'svg_label' => null,   'sort_order' => 38],
            ['key' => 'A_fl_mm',         'svg_label' => 'A',    'sort_order' => 39],
            // agro-t3 (DHU S-series)
            ['key' => 'a_mm',            'svg_label' => null,   'sort_order' => 40],
            ['key' => 'M_mm',            'svg_label' => 'M',    'sort_order' => 41],
            // kit — не були зареєстровані, через це API віддавав сиру назву ключа
            ['key' => 'alpha_deg',       'svg_label' => 'α',    'sort_order' => 42],
            ['key' => 'E_mm',            'svg_label' => 'E',    'sort_order' => 43],
            // раніше реєструвались окремим блоком нижче по файлу — зведено сюди
            ['key' => 'J1_mm',           'svg_label' => 'J1',   'sort_order' => 44],
            ['key' => 'J2_mm',           'svg_label' => 'J2',   'sort_order' => 45],
            ['key' => 'A3_mm',           'svg_label' => 'A3',   'sort_order' => 46],
            ['key' => 'T_size',          'svg_label' => null,   'sort_order' => 47],
            ['key' => 'H_mm',            'svg_label' => 'H',    'sort_order' => 48],
            // розділені ключі: та сама буква, інший зміст у конкретних таблицях
            ['key' => 'flange_A1_mm',    'svg_label' => 'A1',   'sort_order' => 49],
            ['key' => 'shaft_d_mm',      'svg_label' => 'd',    'sort_order' => 50],
        ];

        foreach ($specs as $spec) {
            DB::table('spec_definitions')->updateOrInsert(['key' => $spec['key']], $spec);
        }

        $specId = fn(string $key) => DB::table('spec_definitions')->where('key', $key)->value('id');

        // =========================================================
        // 3. TRANSLATIONS — categories
        // =========================================================
        $catTranslations = [
            ['slug' => 'bearings', 'uk' => 'Підшипникові вузли',      'en' => 'Bearing Units',           'pl' => 'Węzły łożyskowe'],
            ['slug' => 'hubs',     'uk' => 'Аграрні ступичні вузли',  'en' => 'Agricultural Hub Units',  'pl' => 'Rolnicze węzły piasty'],
            ['slug' => 'agro',     'uk' => 'Спеціальні агропідшипники', 'en' => 'Special Agro Bearings',   'pl' => 'Specjalne łożyska agro'],
            ['slug' => 'kit',      'uk' => 'Збірні KIT-рішення',      'en' => 'Assembly KIT Solutions',  'pl' => 'Zestawy montażowe KIT'],
            ['slug' => 'custom',   'uk' => 'Кастомні OEM-рішення',    'en' => 'Custom OEM Solutions',    'pl' => 'Rozwiązania OEM na zamówienie'],
        ];

        foreach ($catTranslations as $t) {
            $id = $catId($t['slug']);
            foreach (['uk', 'en', 'pl'] as $locale) {
                DB::table('translations')->updateOrInsert(
                    ['entity_type' => 'category', 'entity_id' => $id, 'locale' => $locale, 'field' => 'name'],
                    ['value' => $t[$locale]]
                );
            }
        }

        // =========================================================
        // 4. TRANSLATIONS — spec_definitions (label + unit)
        // =========================================================
        $specTranslations = [
            // ЄДИНЕ джерело підписів характеристик. Не заводити другий словник нижче по файлу —
            // раніше їх було три, і пізніший тихо перекривав ранній.
            // en/pl — робоча версія, фінальні переклади окремим завданням.
            // --- Базові — підшипники, агро, KIT ---
            'd_mm'      => ['uk' => ['label' => 'Діаметр отвору d (мм)', 'unit' => 'мм'], 'en' => ['label' => 'Bore diameter d (mm)', 'unit' => 'mm'], 'pl' => ['label' => 'Średnica otworu d (mm)', 'unit' => 'mm']],
            'shaft_d_mm' => ['uk' => ['label' => 'Діаметр вала d (мм)', 'unit' => 'мм'], 'en' => ['label' => 'Shaft diameter d (mm)', 'unit' => 'mm'], 'pl' => ['label' => 'Średnica wału d (mm)', 'unit' => 'mm']],
            'd_inch'    => ['uk' => ['label' => 'Діаметр отвору d (дюйм)', 'unit' => 'дюйм'], 'en' => ['label' => 'Bore diameter d (inch)', 'unit' => 'in'], 'pl' => ['label' => 'Średnica otworu d (cal)', 'unit' => 'cal']],
            'D_mm'      => ['uk' => ['label' => 'Зовнішній діаметр D (мм)', 'unit' => 'мм'], 'en' => ['label' => 'Outside diameter D (mm)', 'unit' => 'mm'], 'pl' => ['label' => 'Średnica zewnętrzna D (mm)', 'unit' => 'mm']],
            'd1_mm'     => ['uk' => ['label' => 'Діаметр центрування d1 (мм)', 'unit' => 'мм'], 'en' => ['label' => 'Centering diameter d1 (mm)', 'unit' => 'mm'], 'pl' => ['label' => 'Średnica centrowania d1 (mm)', 'unit' => 'mm']],
            'B_mm'      => ['uk' => ['label' => 'Ширина внутрішнього кільця B (мм)', 'unit' => 'мм'], 'en' => ['label' => 'Inner ring width B (mm)', 'unit' => 'mm'], 'pl' => ['label' => 'Szerokość pierścienia wewnętrznego B (mm)', 'unit' => 'mm']],
            'C_mm'      => ['uk' => ['label' => 'Ширина зовнішнього кільця C (мм)', 'unit' => 'мм'], 'en' => ['label' => 'Outer ring width C (mm)', 'unit' => 'mm'], 'pl' => ['label' => 'Szerokość pierścienia zewnętrznego C (mm)', 'unit' => 'mm']],
            'A_mm'      => ['uk' => ['label' => 'Загальна ширина A (мм)', 'unit' => 'мм'], 'en' => ['label' => 'Overall width A (mm)', 'unit' => 'mm'], 'pl' => ['label' => 'Szerokość całkowita A (mm)', 'unit' => 'mm']],
            'A1_mm'     => ['uk' => ['label' => 'Загальна ширина корпусу A1 (мм)', 'unit' => 'мм'], 'en' => ['label' => 'Overall housing width A1 (mm)', 'unit' => 'mm'], 'pl' => ['label' => 'Całkowita szerokość obudowy A1 (mm)', 'unit' => 'mm']],
            'flange_A1_mm' => ['uk' => ['label' => 'Товщина фланця A1 (мм)', 'unit' => 'мм'], 'en' => ['label' => 'Flange thickness A1 (mm)', 'unit' => 'mm'], 'pl' => ['label' => 'Grubość kołnierza A1 (mm)', 'unit' => 'mm']],
            'A2_mm'     => ['uk' => ['label' => 'Товщина фланця корпусу A2 (мм)', 'unit' => 'мм'], 'en' => ['label' => 'Housing flange thickness A2 (mm)', 'unit' => 'mm'], 'pl' => ['label' => 'Grubość kołnierza obudowy A2 (mm)', 'unit' => 'mm']],
            'A3_mm'     => ['uk' => ['label' => 'Висота діаметру центрування A3 (мм)', 'unit' => 'мм'], 'en' => ['label' => 'Centering diameter height A3 (mm)', 'unit' => 'mm'], 'pl' => ['label' => 'Wysokość średnicy centrowania A3 (mm)', 'unit' => 'mm']],
            'A_fl_mm'   => ['uk' => ['label' => 'Відстань від фланця корпусу до торця внутрішнього кільця A (мм)', 'unit' => 'мм'], 'en' => ['label' => 'Flange face to inner ring end face distance A (mm)', 'unit' => 'mm'], 'pl' => ['label' => 'Odległość od kołnierza obudowy do czoła pierścienia wewn. A (mm)', 'unit' => 'mm']],
            'J_mm'      => ['uk' => ['label' => 'Відстань між отворами J (мм)', 'unit' => 'мм'], 'en' => ['label' => 'Bolt hole spacing J (mm)', 'unit' => 'mm'], 'pl' => ['label' => 'Rozstaw otworów J (mm)', 'unit' => 'mm']],
            'J1_mm'     => ['uk' => ['label' => 'Відстань між отворами J1 (мм)', 'unit' => 'мм'], 'en' => ['label' => 'Distance between holes J1 (mm)', 'unit' => 'mm'], 'pl' => ['label' => 'Rozstaw otworów J1 (mm)', 'unit' => 'mm']],
            'J2_mm'     => ['uk' => ['label' => 'Відстань між отворами J2 (мм)', 'unit' => 'мм'], 'en' => ['label' => 'Distance between holes J2 (mm)', 'unit' => 'mm'], 'pl' => ['label' => 'Rozstaw otworów J2 (mm)', 'unit' => 'mm']],
            'L_mm'      => ['uk' => ['label' => 'Загальна довжина L (мм)', 'unit' => 'мм'], 'en' => ['label' => 'Overall length L (mm)', 'unit' => 'mm'], 'pl' => ['label' => 'Długość całkowita L (mm)', 'unit' => 'mm']],
            'L1_mm'     => ['uk' => ['label' => 'Загальна ширина корпусу L1 (мм)', 'unit' => 'мм'], 'en' => ['label' => 'Housing overall width L1 (mm)', 'unit' => 'mm'], 'pl' => ['label' => 'Całkowita szerokość obudowy L1 (mm)', 'unit' => 'mm']],
            'L2_mm'     => ['uk' => ['label' => 'Загальна ширина корпусу L2 (мм)', 'unit' => 'мм'], 'en' => ['label' => 'Housing overall width L2 (mm)', 'unit' => 'mm'], 'pl' => ['label' => 'Całkowita szerokość obudowy L2 (mm)', 'unit' => 'mm']],
            'N_mm'      => ['uk' => ['label' => 'Діаметр отвору N (мм)', 'unit' => 'мм'], 'en' => ['label' => 'Bolt hole diameter N (mm)', 'unit' => 'mm'], 'pl' => ['label' => 'Średnica otworu N (mm)', 'unit' => 'mm']],
            'M_mm'      => ['uk' => ['label' => 'Розмір прямокутного отвору M (мм)', 'unit' => 'мм'], 'en' => ['label' => 'Rectangular hole size M (mm)', 'unit' => 'mm'], 'pl' => ['label' => 'Wymiar prostokątnego otworu M (mm)', 'unit' => 'mm']],
            'H_mm'      => ['uk' => ['label' => 'Отвір H (мм)', 'unit' => 'мм'], 'en' => ['label' => 'Hole diameter H (mm)', 'unit' => 'mm'], 'pl' => ['label' => 'Średnica otworu H (mm)', 'unit' => 'mm']],
            'H_T'       => ['uk' => ['label' => 'Отвір / Різьба H/T', 'unit' => ''], 'en' => ['label' => 'Hole / Thread H/T', 'unit' => ''], 'pl' => ['label' => 'Otwór / Gwint H/T', 'unit' => '']],
            'T_size'    => ['uk' => ['label' => 'Розмір різьби T', 'unit' => ''], 'en' => ['label' => 'Threaded hole size T', 'unit' => ''], 'pl' => ['label' => 'Rozmiar gwintu T', 'unit' => '']],
            'Da_mm'     => ['uk' => ['label' => 'Діаметр центрування Da (мм)', 'unit' => 'мм'], 'en' => ['label' => 'Centering diameter Da (mm)', 'unit' => 'mm'], 'pl' => ['label' => 'Średnica centrowania Da (mm)', 'unit' => 'mm']],
            'a_mm'      => ['uk' => ['label' => 'Розмір вала a (мм)', 'unit' => 'мм'], 'en' => ['label' => 'Shaft dimension a (mm)', 'unit' => 'mm'], 'pl' => ['label' => 'Wymiar wału a (mm)', 'unit' => 'mm']],
            'r_12_mm'   => ['uk' => ['label' => 'Розмір фаски r 1,2 (мм)', 'unit' => 'мм'], 'en' => ['label' => 'Chamfer dimension r 1,2 (mm)', 'unit' => 'mm'], 'pl' => ['label' => 'Wymiar fazowania r 1,2 (mm)', 'unit' => 'mm']],
            'alpha_deg' => ['uk' => ['label' => 'Кут контакту α (°)', 'unit' => '°'], 'en' => ['label' => 'Contact angle α (°)', 'unit' => '°'], 'pl' => ['label' => 'Kąt styku α (°)', 'unit' => '°']],
            'E_mm'      => ['uk' => ['label' => 'Відстань від торця до канавки E (мм)', 'unit' => 'мм'], 'en' => ['label' => 'Distance from face to groove E (mm)', 'unit' => 'mm'], 'pl' => ['label' => 'Odległość od czoła do rowka E (mm)', 'unit' => 'mm']],
            'Fr_kn'     => ['uk' => ['label' => 'Радіальне навантаження Fr (кН)', 'unit' => 'кН'], 'en' => ['label' => 'Radial load Fr (kN)', 'unit' => 'kN'], 'pl' => ['label' => 'Obciążenie promieniowe Fr (kN)', 'unit' => 'kN']],
            'Fa_kn'     => ['uk' => ['label' => 'Осьове навантаження Fa (кН)', 'unit' => 'кН'], 'en' => ['label' => 'Axial load Fa (kN)', 'unit' => 'kN'], 'pl' => ['label' => 'Obciążenie osiowe Fa (kN)', 'unit' => 'kN']],
            'cdyn_kn'   => ['uk' => ['label' => 'Динамічна вантажопідйомність Cdyn (кН)', 'unit' => 'кН'], 'en' => ['label' => 'Dynamic load rating Cdyn (kN)', 'unit' => 'kN'], 'pl' => ['label' => 'Nośność dynamiczna Cdyn (kN)', 'unit' => 'kN']],
            'co_kn'     => ['uk' => ['label' => 'Статична вантажопідйомність Co (кН)', 'unit' => 'кН'], 'en' => ['label' => 'Static load rating Co (kN)', 'unit' => 'kN'], 'pl' => ['label' => 'Nośność statyczna Co (kN)', 'unit' => 'kN']],
            'pu_kn'     => ['uk' => ['label' => 'Границя витривалості Pu (кН)', 'unit' => 'кН'], 'en' => ['label' => 'Fatigue load limit Pu (kN)', 'unit' => 'kN'], 'pl' => ['label' => 'Graniczne obciążenie zmęczeniowe Pu (kN)', 'unit' => 'kN']],
            'mass_kg'   => ['uk' => ['label' => 'Маса (кг)', 'unit' => 'кг'], 'en' => ['label' => 'Mass (kg)', 'unit' => 'kg'], 'pl' => ['label' => 'Masa (kg)', 'unit' => 'kg']],

            // --- Ступичні вузли — власні ключі за правилом №8 (однакова буква, інший зміст) ---
            'hub_d_mm'        => ['uk' => ['label' => 'Діаметр отвору d (мм)', 'unit' => 'мм'], 'en' => ['label' => 'Bore diameter d (mm)', 'unit' => 'mm'], 'pl' => ['label' => 'Średnica otworu d (mm)', 'unit' => 'mm']],
            'hub_D_mm'        => ['uk' => ['label' => 'Зовнішній діаметр D (мм)', 'unit' => 'мм'], 'en' => ['label' => 'Outside diameter D (mm)', 'unit' => 'mm'], 'pl' => ['label' => 'Średnica zewnętrzna D (mm)', 'unit' => 'mm']],
            'hub_D1_mm'       => ['uk' => ['label' => 'Зовнішній діаметр D1 (мм)', 'unit' => 'мм'], 'en' => ['label' => 'Outside diameter D1 (mm)', 'unit' => 'mm'], 'pl' => ['label' => 'Średnica zewnętrzna D1 (mm)', 'unit' => 'mm']],
            'hub_B_mm'        => ['uk' => ['label' => 'Ширина внутрішнього кільця B (мм)', 'unit' => 'мм'], 'en' => ['label' => 'Inner ring width B (mm)', 'unit' => 'mm'], 'pl' => ['label' => 'Szerokość pierścienia wewnętrznego B (mm)', 'unit' => 'mm']],
            'hub_C_mm'        => ['uk' => ['label' => 'Відстань C (мм)', 'unit' => 'мм'], 'en' => ['label' => 'Distance C (mm)', 'unit' => 'mm'], 'pl' => ['label' => 'Odległość C (mm)', 'unit' => 'mm']],
            'hub_E_mm'        => ['uk' => ['label' => 'Відстань E (мм)', 'unit' => 'мм'], 'en' => ['label' => 'Distance E (mm)', 'unit' => 'mm'], 'pl' => ['label' => 'Odległość E (mm)', 'unit' => 'mm']],
            'hub_F_mm'        => ['uk' => ['label' => 'Довжина різьбової частини F (мм)', 'unit' => 'мм'], 'en' => ['label' => 'Thread length F (mm)', 'unit' => 'mm'], 'pl' => ['label' => 'Długość gwintowa F (mm)', 'unit' => 'mm']],
            'hub_J_mm'        => ['uk' => ['label' => 'Відстань між отворами J (мм)', 'unit' => 'мм'], 'en' => ['label' => 'Bolt hole spacing J (mm)', 'unit' => 'mm'], 'pl' => ['label' => 'Rozstaw otworów J (mm)', 'unit' => 'mm']],
            'hub_L_mm'        => ['uk' => ['label' => 'Загальна довжина L (мм)', 'unit' => 'мм'], 'en' => ['label' => 'Total length L (mm)', 'unit' => 'mm'], 'pl' => ['label' => 'Długość całkowita L (mm)', 'unit' => 'mm']],
            'hub_L1_mm'       => ['uk' => ['label' => 'Глибина розточки L1 (мм)', 'unit' => 'мм'], 'en' => ['label' => 'Bore depth L1 (mm)', 'unit' => 'mm'], 'pl' => ['label' => 'Głębokość wytoczenia L1 (mm)', 'unit' => 'mm']],
            'hub_G'           => ['uk' => ['label' => 'Внутрішня різьба G', 'unit' => ''], 'en' => ['label' => 'Internal thread G', 'unit' => ''], 'pl' => ['label' => 'Gwint wewnętrzny G', 'unit' => '']],
            'hub_M_thread'    => ['uk' => ['label' => 'Різьба M', 'unit' => ''], 'en' => ['label' => 'Thread M', 'unit' => ''], 'pl' => ['label' => 'Gwint M', 'unit' => '']],
            'hub_hole_thread' => ['uk' => ['label' => 'Отвір / Різьба H/T', 'unit' => ''], 'en' => ['label' => 'Hole / Thread H/T', 'unit' => ''], 'pl' => ['label' => 'Otwór / Gwint H/T', 'unit' => '']],
        ];

        foreach ($specTranslations as $key => $locales) {
            $id = $specId($key);
            foreach ($locales as $locale => $fields) {
                foreach ($fields as $field => $value) {
                    DB::table('translations')->updateOrInsert(
                        ['entity_type' => 'spec_definitions', 'entity_id' => $id, 'locale' => $locale, 'field' => $field],
                        ['value' => $value]
                    );
                }
            }
        }

        // Hub spec translations

        // =========================================================
        // 5. PRODUCT TABLE: bearings-t1
        // =========================================================
        $bearingsCatId = $catId('bearings');

        DB::table('product_tables')->updateOrInsert(
            ['slug' => 'bearings-t1'],
            [
                'slug'            => 'bearings-t1',
                'category_id'     => $bearingsCatId,
                'spec_columns'    => json_encode(['d_mm', 'd_inch', 'A1_mm', 'A2_mm', 'J_mm', 'L_mm', 'N_mm', 'A_mm', 'mass_kg', 'cdyn_kn', 'co_kn', 'pu_kn']),
                'highlight_config' => '{"d_mm":[{"label":"d","x":1319,"y":1416}],"d_inch":[{"label":"d","x":1319,"y":1416}],"J_mm":[{"label":"J","x":555,"y":1788}],"A2_mm":[{"label":"A2","x":1063,"y":1786}],"A1_mm":[{"label":"A1","x":1124,"y":1830}],"L_mm":[{"label":"L","x":556,"y":1837}],"N_mm":[{"label":"N","x":270,"y":988}],"A_mm":[{"label":"A","x":492,"y":974},{"label":"A","x":491,"y":1890},{"label":"A","x":1153,"y":1868}]}',
                'schema_viewbox'  => '0 800 2400 1160',
                'sort_order'      => 1,
            ]
        );

        $tableId = fn(string $slug) => DB::table('product_tables')->where('slug', $slug)->value('id');
        $t1 = $tableId('bearings-t1');

        // Table-level translations
        foreach (['uk' => 'Підшипниковий вузол BUQ — Таблиця 1', 'en' => 'Bearing Unit BUQ — Table 1', 'pl' => 'Węzeł łożyskowy BUQ — Tabela 1'] as $locale => $name) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $t1, 'locale' => $locale, 'field' => 'name'],
                ['value' => $name]
            );
        }

        // Table-level assets
        $tableAssets = [
            ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t1/main.jpeg',    'sort_order' => 1],
            ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t1/drawing-1.png','sort_order' => 2],
            ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t1/drawing-2.png','sort_order' => 3],
            ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t1/drawing-3.png','sort_order' => 4],
            ['type' => 'schema_png', 'path' => '/velnox/images/products/bearings-t1/schema.png',  'sort_order' => 1],
            ['type' => 'schema_svg', 'path' => '/velnox/images/products/bearings-t1/schema.svg',  'sort_order' => 1],
        ];

        foreach ($tableAssets as $asset) {
            DB::table('product_assets')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $t1, 'type' => $asset['type'], 'path' => $asset['path']],
                ['sort_order' => $asset['sort_order']]
            );
        }

        // =========================================================
        // 5b. PRODUCT TABLE: bearings-t2
        //     (table record, translations, and assets only — no products)
        // =========================================================
        $extraTables = [
            [
                'slug'             => 'bearings-t2',
                'sort_order'       => 2,
                'schema_viewbox'   => '147 720 2059 773',
                'highlight_config' => [
                    'H_T'   => [['label' => 'H/T', 'x' => 251,  'y' => 734 ]],
                    'd_mm'  => [['label' => 'd',   'x' => 1050, 'y' => 1069]],
                    'A2_mm' => [['label' => 'A2',  'x' => 853,  'y' => 1366]],
                    'A1_mm' => [['label' => 'A1',  'x' => 903,  'y' => 1413]],
                    'A_mm'  => [['label' => 'A',   'x' => 892,  'y' => 1457], ['label' => 'A', 'x' => 383, 'y' => 1448]],
                    'J_mm'  => [['label' => 'J',   'x' => 450,  'y' => 1366]],
                    'L_mm'  => [['label' => 'L',   'x' => 450,  'y' => 1409]],
                ],
                'names'  => ['uk' => 'BUQ-308-2T3H-DS — Таблиця 2', 'en' => 'BUQ-308-2T3H-DS — Table 2', 'pl' => 'BUQ-308-2T3H-DS — Tabela 2'],
                'assets' => [
                    ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t2/velnox-buq-308-2t3h-ds.webp',          'sort_order' => 1],
                    ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t2/velnox-buq-308-2t3h-ds-drawing-1.webp', 'sort_order' => 2],
                    ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t2/velnox-buq-308-2t3h-ds-drawing-2.webp', 'sort_order' => 3],
                    ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t2/velnox-buq-308-2t3h-ds-drawing-3.webp', 'sort_order' => 4],
                    ['type' => 'schema_png', 'path' => '/velnox/images/products/bearings-t2/velnox-buq-308-2t3h-ds-schema.webp',   'sort_order' => 0],
                    ['type' => 'schema_svg', 'path' => '/velnox/images/products/bearings-t2/schema.svg',                            'sort_order' => 0],
                ],
            ],
        ];

        $t2SpecCols = ['d_mm','A1_mm','A2_mm','J_mm','L_mm','H_T','A_mm','mass_kg','cdyn_kn','co_kn','pu_kn'];
        $extraSpecCols = ['bearings-t2' => $t2SpecCols];

        foreach ($extraTables as $tbl) {
            DB::table('product_tables')->updateOrInsert(
                ['slug' => $tbl['slug']],
                [
                    'slug'             => $tbl['slug'],
                    'category_id'      => $bearingsCatId,
                    'spec_columns'     => json_encode($extraSpecCols[$tbl['slug']] ?? []),
                    'highlight_config' => json_encode($tbl['highlight_config'] ?? new \stdClass()),
                    'schema_viewbox'   => $tbl['schema_viewbox'] ?? null,
                    'sort_order'       => $tbl['sort_order'],
                ]
            );

            $tId = $tableId($tbl['slug']);

            foreach ($tbl['names'] as $locale => $name) {
                DB::table('translations')->updateOrInsert(
                    ['entity_type' => 'product_table', 'entity_id' => $tId, 'locale' => $locale, 'field' => 'name'],
                    ['value' => $name]
                );
            }

            foreach ($tbl['assets'] as $asset) {
                DB::table('product_assets')->updateOrInsert(
                    ['entity_type' => 'product_table', 'entity_id' => $tId, 'type' => $asset['type'], 'path' => $asset['path']],
                    ['sort_order' => $asset['sort_order']]
                );
            }
        }

        // =========================================================
        // 6. PRODUCTS — bearings-t1 (8 products, authoritative data)
        // =========================================================
        $products = [
            [
                'slug'    => 'buq-207-104-2x3h',
                'article' => 'BUQ 207-104-2X3H',
                'specs'   => [
                    'd_mm'    => '31.75',
                    'd_inch'  => '1 1/4',
                    'A1_mm'   => '34',
                    'A2_mm'   => '13',
                    'J_mm'    => '92',
                    'L_mm'    => '118',
                    'N_mm'    => '14',
                    'A_mm'    => '44.4',
                    'mass_kg' => '1.6',
                    'cdyn_kn' => '25.5',
                    'co_kn'   => '15.3',
                    'pu_kn'   => '0.643',
                ],
                'cross_refs' => [
                    ['brand' => 'SKF', 'value' => 'FYJ1.1/4TF (YEL 207-104 2F + FY507M)'],
                    ['brand' => 'SNR', 'value' => 'EXF207-20/UCF207-20'],
                ],
                'name_uk' => 'BUQ 207-104-2X3H',
                'name_en' => 'BUQ 207-104-2X3H',
                'name_pl' => 'BUQ 207-104-2X3H',
                'desc_uk' => 'Квадратний фланцевий підшипниковий вузол на 4 кріпильні отвори (аналог UCF 207-20 / SKF FYJ 1.1/4 TF) з дюймовою посадкою валу. Внутрішній діаметр d = 31.75 мм (1 1/4"), монтажна база J = 83 мм, Cdyn = 19.5 кН, Co = 11.3 кН, маса 1.1 кг. Система герметизації — комбінована: трикромкове контактне ущільнення доповнене двокромковим з обох сторін, що блокує проникнення пилу, вологи та абразиву у зону кочення. Виступає прямою геометричною заміною вузлів SKF FYJ 1.1/4 TF (YEL 207-104 2F + FY507M) і SNR EXF207-20 / UCF207-20; застосовується у ґрунтообробній та посівній техніці з дюймовими посадковими розмірами валів.',
                'meta_title_uk' => 'VELNOX BUQ 207-104-2X3H — фланцевий вузол 1 1/4", SKF FYJ 1.1/4 TF',
                'meta_desc_uk' => 'Фланцевий вузол VELNOX BUQ 207-104-2X3H, d=31.75 мм (1 1/4"), Cdyn 19.5 кН. Пряма заміна SKF FYJ 1.1/4 TF, SNR UCF207-20. Комбіноване ущільнення.',
            ],
            [
                'slug'    => 'buq-207-106-2x3h',
                'article' => 'BUQ 207-106-2X3H',
                'specs'   => [
                    'd_mm'    => '34.925',
                    'd_inch'  => '1 3/8',
                    'A1_mm'   => '34',
                    'A2_mm'   => '13',
                    'J_mm'    => '92',
                    'L_mm'    => '118',
                    'N_mm'    => '14',
                    'A_mm'    => '44.4',
                    'mass_kg' => '1.6',
                    'cdyn_kn' => '25.5',
                    'co_kn'   => '15.3',
                    'pu_kn'   => '0.643',
                ],
                'cross_refs' => [
                    ['brand' => 'SKF', 'value' => 'FYJ1.3/8TF'],
                    ['brand' => 'SNR', 'value' => 'EXF207-22/UCF207-22'],
                ],
                'name_uk' => 'BUQ 207-106-2X3H',
                'name_en' => 'BUQ 207-106-2X3H',
                'name_pl' => 'BUQ 207-106-2X3H',
                'desc_uk' => 'Квадратний фланцевий підшипниковий вузол на 4 кріпильні отвори (аналог UCF 207-22 / SKF FYJ 1.3/8 TF) з дюймовою посадкою валу. Внутрішній діаметр d = 34.925 мм (1 3/8"), міжцентрова відстань кріплень J = 92 мм, довжина корпусу L = 118 мм, Cdyn = 25.5 кН, Co = 15.3 кН, маса 1.6 кг. Комбінована система захисту VELNOX: трикромкове контактне ущільнення + двокромкове з обох сторін — для роботи в умовах підвищеного запилення та вологості. Повний геометричний аналог SKF FYJ 1.3/8 TF (YEL 207-106 2F + FY507M) і SNR EXF207-22 / UCF207-22; застосовується у ґрунтообробних агрегатах та прикочувальних котках з дюймовою посадкою.',
                'meta_title_uk' => 'VELNOX BUQ 207-106-2X3H — фланцевий вузол 1 3/8", SKF FYJ 1.3/8 TF',
                'meta_desc_uk' => 'Фланцевий вузол VELNOX BUQ 207-106-2X3H, d=34.925 мм (1 3/8"), Cdyn 25.5 кН, Co 15.3 кН. Пряма заміна SKF FYJ 1.3/8 TF, SNR UCF207-22. Комбінована система захисту.',
            ],
            [
                'slug'    => 'buq-207-2x3h',
                'article' => 'BUQ 207-2X3H',
                'specs'   => [
                    'd_mm'    => '35',
                    'A1_mm'   => '34',
                    'A2_mm'   => '13',
                    'J_mm'    => '92',
                    'L_mm'    => '118',
                    'N_mm'    => '14',
                    'A_mm'    => '44.4',
                    'mass_kg' => '1.6',
                    'cdyn_kn' => '25.5',
                    'co_kn'   => '15.3',
                    'pu_kn'   => '0.643',
                ],
                'cross_refs' => [
                    ['brand' => 'SKF', 'value' => 'FYJ40TF (YEL 207 2F + FY507M)'],
                    ['brand' => 'SNR', 'value' => 'EXF207/UCF207'],
                ],
                'name_uk' => 'BUQ 207-2X3H',
                'name_en' => 'BUQ 207-2X3H',
                'name_pl' => 'BUQ 207-2X3H',
                'desc_uk' => 'Квадратний фланцевий підшипниковий вузол на 4 кріпильні отвори метричного виконання (аналог UCF 207 / SKF FYJ 40 TF) з внутрішнім діаметром d = 35 мм. Монтажна база J = 92 мм, загальна ширина A = 44.4 мм, довжина L = 118 мм, Cdyn = 25.5 кН, Co = 15.3 кН, маса 1.45 кг. Захист підшипника забезпечує комбінована система ущільнень VELNOX: трикромкове контактне + двокромкове з обох сторін для агресивних польових умов. Пряма заміна SKF FYJ 40 TF (YEL 207 2F + FY507M) і SNR EXF207 / UCF207 у вузлах дискових борін, культиваторів та прикочувальних котків.',
                'meta_title_uk' => 'VELNOX BUQ 207-2X3H — фланцевий вузол d35, аналог SKF FYJ 40 TF',
                'meta_desc_uk' => 'Квадратний фланцевий вузол VELNOX BUQ 207-2X3H, d=35 мм, Cdyn 25.5 кН. 100% аналог SKF FYJ 40 TF, SNR UCF207. Трикромкове + двокромкове ущільнення.',
            ],
            [
                'slug'    => 'buq-208-108-2x3h',
                'article' => 'BUQ 208-108-2X3H',
                'specs'   => [
                    'd_mm'    => '38.1',
                    'd_inch'  => '1 1/2',
                    'A1_mm'   => '36',
                    'A2_mm'   => '14',
                    'J_mm'    => '102',
                    'L_mm'    => '130',
                    'N_mm'    => '16',
                    'A_mm'    => '51.2',
                    'mass_kg' => '1.95',
                    'cdyn_kn' => '30.7',
                    'co_kn'   => '19',
                    'pu_kn'   => '0.798',
                ],
                'cross_refs' => [
                    ['brand' => 'SKF', 'value' => 'FYJ 1.1/2 TF'],
                    ['brand' => 'SNR', 'value' => 'EXF208-24/UCF 208-24'],
                ],
                'name_uk' => 'BUQ 208-108-2X3H',
                'name_en' => 'BUQ 208-108-2X3H',
                'name_pl' => 'BUQ 208-108-2X3H',
                'desc_uk' => 'Квадратний фланцевий підшипниковий вузол на 4 кріпильні отвори (аналог UCF 208-24 / SKF FYJ 1.1/2 TF) з дюймовою посадкою валу. Внутрішній діаметр d = 38.1 мм (1 1/2"), монтажна база J = 102 мм, довжина корпусу L = 130 мм, Cdyn = 30.7 кН, Co = 19.0 кН, маса 1.95 кг. Комбіноване ущільнення VELNOX — трикромкове контактне + двокромкове з обох сторін підшипника — забезпечує стабільну роботу у вузлах з прямим контактом ґрунту. Пряма заміна SKF FYJ 1.1/2 TF (YEL 208-108 2F + FY508M) і SNR EXF208-24 / UCF 208-24 у сільгосптехніці з дюймовим валом.',
                'meta_title_uk' => 'VELNOX BUQ 208-108-2X3H — вузол 1 1/2", SKF FYJ 1.1/2 TF',
                'meta_desc_uk' => 'Фланцевий вузол VELNOX BUQ 208-108-2X3H, d=38.1 мм (1 1/2"), Cdyn 30.7 кН, Co 19 кН. Пряма заміна SKF FYJ 1.1/2 TF, SNR UCF 208-24. Комбіноване ущільнення.',
            ],
            [
                'slug'    => 'buq-208-2x3h',
                'article' => 'BUQ 208-2X3H',
                'specs'   => [
                    'd_mm'    => '40',
                    'A1_mm'   => '36',
                    'A2_mm'   => '14',
                    'J_mm'    => '102',
                    'L_mm'    => '130',
                    'N_mm'    => '16',
                    'A_mm'    => '51.2',
                    'mass_kg' => '1.95',
                    'cdyn_kn' => '30.7',
                    'co_kn'   => '19',
                    'pu_kn'   => '0.798',
                ],
                'cross_refs' => [
                    ['brand' => 'SKF', 'value' => 'FYJ40TF (YEL 208 2F + FY508M)'],
                    ['brand' => 'SNR', 'value' => 'EXF208/UCF208'],
                ],
                'name_uk' => 'BUQ 208-2X3H',
                'name_en' => 'BUQ 208-2X3H',
                'name_pl' => 'BUQ 208-2X3H',
                'desc_uk' => 'Квадратний фланцевий підшипниковий вузол на 4 кріпильні отвори метричного ряду (аналог UCF 208 / SKF FYJ 40 TF) з внутрішнім діаметром d = 40 мм. Монтажна база J = 102 мм, габаритна довжина L = 130 мм, Cdyn = 30.7 кН, Co = 19.0 кН, маса 1.95 кг. Комбінована система герметизації: трикромкове контактне ущільнення та додаткове двокромкове з кожної з сторін підшипника для блокування пилу, вологи та абразиву. Повний геометричний аналог SKF FYJ 40 TF (YEL 208 2F + FY508M) і SNR EXF208 / UCF208; застосовується у боронах, культиваторах та прикочувальних котках європейської сільгосптехніки.',
                'meta_title_uk' => 'VELNOX BUQ 208-2X3H — фланцевий вузол d40, UCF208 SKF FYJ 40 TF',
                'meta_desc_uk' => 'Квадратний фланцевий вузол VELNOX BUQ 208-2X3H, d=40 мм, Cdyn 30.7 кН, Co 19 кН. Пряма заміна SKF FYJ 40 TF, SNR UCF208. Комбіноване ущільнення.',
            ],
            [
                'slug'    => 'buq-209-2t3h',
                'article' => 'BUQ-209-2T3H',
                'specs'   => [
                    'd_mm'    => '45',
                    'A1_mm'   => '38',
                    'A2_mm'   => '16',
                    'J_mm'    => '105',
                    'L_mm'    => '137',
                    'N_mm'    => '16',
                    'A_mm'    => '52.2',
                    'mass_kg' => '2.41',
                    'cdyn_kn' => '33.2',
                    'co_kn'   => '21.9',
                    'pu_kn'   => '0.92',
                ],
                'cross_refs' => [
                    ['brand' => 'SKF', 'value' => 'FYJ 45 TF'],
                    ['brand' => 'SNR', 'value' => 'EXF 209/UCF 209'],
                ],
                'name_uk' => 'BUQ-209-2T3H',
                'name_en' => 'BUQ-209-2T3H',
                'name_pl' => 'BUQ-209-2T3H',
                'desc_uk' => 'Квадратний фланцевий підшипниковий вузол на 4 кріпильні отвори (аналог UCF 209 / SKF FYJ 45 TF) з внутрішнім діаметром d = 45 мм. Монтажна база J = 105 мм, габаритна довжина L = 137 мм, Cdyn = 33.2 кН, Co = 21.9 кН, маса 2.41 кг. Захист забезпечує комбінована система ущільнень VELNOX: трикромкове контактне у поєднанні з двокромковим з кожної з сторін підшипника — рішення для вузлів, що працюють у ґрунті та при ударних навантаженнях. Пряма заміна SKF FYJ 45 TF (YEL 209 2F + FY509M) і SNR EXF 209 / UCF 209 у культиваторах, боронах і прикочувальних котках.',
                'meta_title_uk' => 'VELNOX BUQ-209-2T3H — фланцевий вузол d45, аналог SKF FYJ 45 TF',
                'meta_desc_uk' => 'Фланцевий вузол VELNOX BUQ-209-2T3H, d=45 мм, Cdyn 33.2 кН, Co 21.9 кН. Пряма заміна SKF FYJ 45 TF, SNR UCF 209. Комбінована система ущільнень.',
            ],
            [
                'slug'    => 'buq-210-2x3h',
                'article' => 'BUQ 210-2X3H',
                'specs'   => [
                    'd_mm'    => '50',
                    'A1_mm'   => '40',
                    'A2_mm'   => '16',
                    'J_mm'    => '111',
                    'L_mm'    => '143',
                    'N_mm'    => '16',
                    'A_mm'    => '54.6',
                    'mass_kg' => '2.78',
                    'cdyn_kn' => '35.1',
                    'co_kn'   => '23.2',
                    'pu_kn'   => '0.974',
                ],
                'cross_refs' => [
                    ['brand' => 'SKF', 'value' => 'FYJ 50 TF'],
                    ['brand' => 'SNR', 'value' => 'EXF210/UCF 210'],
                ],
                'name_uk' => 'BUQ 210-2X3H',
                'name_en' => 'BUQ 210-2X3H',
                'name_pl' => 'BUQ 210-2X3H',
                'desc_uk' => 'Квадратний фланцевий підшипниковий вузол на 4 кріпильні отвори (аналог UCF 210 / SKF FYJ 50 TF) з внутрішнім діаметром d = 50 мм. Монтажна база J = 111 мм, довжина корпусу L = 143 мм, Cdyn = 35.1 кН, Co = 23.2 кН, маса 2.78 кг. Комбінована система захисту (трикромкове контактне + двокромкове ущільнення) дозволяє експлуатувати вузол у польових умовах з підвищеним запиленням та присутністю вологи. Пряма заміна SKF FYJ 50 TF (YEL 210 2F + FY510M) і SNR EXF210 / UCF 210; застосовується у важких ґрунтообробних агрегатах, прикочувальних котках та конвеєрних вузлах.',
                'meta_title_uk' => 'VELNOX BUQ 210-2X3H — фланцевий вузол d50, SKF FYJ 50 TF UCF210',
                'meta_desc_uk' => 'Фланцевий вузол VELNOX BUQ 210-2X3H, d=50 мм, Cdyn 35.1 кН, Co 23.2 кН. Пряма заміна SKF FYJ 50 TF, SNR UCF 210. Комбінована система захисту.',
            ],
            [
                'slug'    => 'buq-214-2t3h',
                'article' => 'BUQ-214-2T3H',
                'specs'   => [
                    'd_mm'    => '70',
                    'A1_mm'   => '50.3',
                    'A2_mm'   => '21.3',
                    'J_mm'    => '152',
                    'L_mm'    => '193',
                    'N_mm'    => '19',
                    'A_mm'    => '70.7',
                    'mass_kg' => '6.2',
                    'cdyn_kn' => '62.4',
                    'co_kn'   => '44',
                    'pu_kn'   => '1.848',
                ],
                'cross_refs' => [
                    ['brand' => 'SNR', 'value' => 'EXF 214/UCF 214'],
                ],
                'name_uk' => 'BUQ-214-2T3H',
                'name_en' => 'BUQ-214-2T3H',
                'name_pl' => 'BUQ-214-2T3H',
                'desc_uk' => 'Посилений квадратний фланцевий підшипниковий вузол на 4 кріпильні отвори (аналог UCF 214) з внутрішнім діаметром d = 70 мм — для важких радіальних навантажень. Монтажна база J = 152 мм, довжина корпусу L = 193 мм, Cdyn = 62.4 кН, Co = 44.0 кН, Pu = 1.848 кН, маса 2.6 кг. Комбінована система ущільнень VELNOX: трикромкове контактне + двокромкове для роботи в абразивному та вологому середовищі. Пряма заміна SNR EXF 214 / UCF 214; застосовується у важких дискових боронах, глибокорозпушувачах та промислових транспортерах з високими радіальними навантаженнями.',
                'meta_title_uk' => 'VELNOX BUQ-214-2T3H — посилений фланцевий вузол d70, UCF 214',
                'meta_desc_uk' => 'Посилений фланцевий вузол VELNOX BUQ-214-2T3H, d=70 мм, Cdyn 62.4 кН, Co 44 кН. Пряма заміна SNR UCF 214. Для важких борін та розпушувачів.',
            ],
        ];

        foreach ($products as $p) {
            DB::table('products')->updateOrInsert(
                ['slug' => $p['slug']],
                [
                    'slug'             => $p['slug'],
                    'article'          => $p['article'],
                    'product_table_id' => $t1,
                ]
            );

            $productId = DB::table('products')->where('slug', $p['slug'])->value('id');

            // product_specs
            foreach ($p['specs'] as $key => $value) {
                $sid = $specId($key);
                if (!$sid) continue;
                DB::table('product_specs')->updateOrInsert(
                    ['product_id' => $productId, 'spec_id' => $sid],
                    ['value' => $value]
                );
            }

            // product_cross_refs
            DB::table('product_cross_refs')->where('product_id', $productId)->delete();
            foreach ($p['cross_refs'] as $ref) {
                DB::table('product_cross_refs')->insert([
                    'product_id' => $productId,
                    'brand'      => $ref['brand'],
                    'value'      => $ref['value'],
                    'type'       => $ref['type'] ?? 'bearing',
                ]);
            }

            // translations
            foreach (['uk', 'en', 'pl'] as $locale) {
                DB::table('translations')->updateOrInsert(
                    ['entity_type' => 'product', 'entity_id' => $productId, 'locale' => $locale, 'field' => 'name'],
                    ['value' => $p["name_{$locale}"]]
                );
            }
            if (isset($p['desc_uk'])) {
                DB::table('translations')->updateOrInsert(
                    ['entity_type' => 'product', 'entity_id' => $productId, 'locale' => 'uk', 'field' => 'desc'],
                    ['value' => $p['desc_uk']]
                );
            }
            if (isset($p['meta_title_uk'])) {
                DB::table('translations')->updateOrInsert(
                    ['entity_type' => 'product', 'entity_id' => $productId, 'locale' => 'uk', 'field' => 'meta_title'],
                    ['value' => $p['meta_title_uk']]
                );
            }
            if (isset($p['meta_desc_uk'])) {
                DB::table('translations')->updateOrInsert(
                    ['entity_type' => 'product', 'entity_id' => $productId, 'locale' => 'uk', 'field' => 'meta_description'],
                    ['value' => $p['meta_desc_uk']]
                );
            }
        }

        // =========================================================
        // 7. PRODUCTS — bearings-t2
        // =========================================================
        $t2 = $tableId('bearings-t2');

        $extraProducts = [
            // ── bearings-t2: BUQ-308-2T3H-DS ──
            [
                'slug'     => 'buq-308-2t3h-ds',
                'article'  => 'BUQ-308-2T3H-DS',
                'table_id' => $t2,
                'specs'    => [
                    'd_mm'    => '40',
                    'A1_mm'   => '40.6',
                    'A2_mm'   => '19',
                    'J_mm'    => '101.5',
                    'L_mm'    => '130',
                    'H_T'     => 'M12',
                    'A_mm'    => '51.4',
                    'mass_kg' => '2.5',
                    'cdyn_kn' => '62.3',
                    'co_kn'   => '45.2',
                    'pu_kn'   => '1.898',
                ],
                'cross_refs' => [
                    ['brand' => 'SNR',     'value' => 'CE066',                                    'type' => 'bearing'],
                    ['brand' => 'FKL',     'value' => 'LSQFR308 TBT.H.T.Zn',                  'type' => 'bearing'],
                    ['brand' => 'SNR',     'value' => 'UC 308 X1',                              'type' => 'bearing'],
                    ['brand' => 'SNR',     'value' => 'UCF308 A01X1',                           'type' => 'bearing'],
                    ['brand' => 'PEER',    'value' => 'W308-40MM-FDT-MF-AP-SP1 (PER.W308RRBP52-F-A)',           'type' => 'bearing'],
                    ['brand' => 'PEER',    'value' => 'W308-40MM-FDT-MF-AP-SP1 W308RRBP52-F-B (BX-PER.W308RRBP52-F)', 'type' => 'bearing'],
                    ['brand' => 'SNR',     'value' => 'XUCF308B01B169',                         'type' => 'bearing'],
                    ['brand' => 'AMAZONE', 'value' => '957305 AMAZONE',                          'type' => 'application'],
                    ['brand' => 'AMAZONE', 'value' => 'CE066 AMAZONE',                           'type' => 'application'],
                    ['brand' => 'AMAZONE', 'value' => 'CE078 AMAZONE',                           'type' => 'application'],
                    ['brand' => 'FKL',     'value' => 'LSQFR308 TBS.H.T.Zn FKL',               'type' => 'application'],
                    ['brand' => 'RBF',     'value' => 'PN00042 RBF Housing',                     'type' => 'application'],
                    ['brand' => 'Z&S',     'value' => 'SL308MR3L Z&S',                          'type' => 'application'],
                    ['brand' => 'UCFE',    'value' => 'UCFE308 A01X1= UC308X1+FE308A01',        'type' => 'application'],
                    ['brand' => 'UCFE',    'value' => 'UCFE308 A01X1',                          'type' => 'application'],
                ],
                'name_uk' => 'BUQ-308-2T3H-DS',
                'name_en' => 'BUQ-308-2T3H-DS',
                'name_pl' => 'BUQ-308-2T3H-DS',
                'desc_uk'       => 'Посилений квадратний фланцевий підшипниковий вузол на 4 кріпильні отвори для прикочувальних котків (аналог UCF 308 / UC 308 X1) з внутрішнім діаметром d = 40 мм. Кріпильна база J = 101.5 мм, довжина корпусу L = 130 мм, різьблення H/T = M12, Cdyn = 62.3 кН, Co = 45.2 кН, Pu = 1.898 кН, маса 2.5 кг. Посилена комбінована система ущільнень (індекс -DS) забезпечує герметичний захист зони кочення від ґрунтового пилу, вологи та абразиву в умовах постійного контакту з ґрунтом. Пряма заміна SNR CE066, FKL LSQFR308 TBT.H.T., PEER W308-40MM-FDT-MF-AP-SP1 та SNR UCF308 A01X1; застосовується у прикочувальних котках AMAZONE (арт. 957305, CE066, CE078) та інших європейських ґрунтообробних агрегатів.',
                'meta_title_uk' => 'VELNOX BUQ-308-2T3H-DS — вузол котка d40, AMAZONE CE066',
                'meta_desc_uk'  => 'Підшипниковий вузол VELNOX BUQ-308-2T3H-DS (d=40 мм, Cdyn 62.3 кН) для котків. Пряма заміна AMAZONE CE066, 957305, SNR UC 308 X1.',
                'desc_en'       => 'Heavy-duty square flange bearing unit with 4 mounting holes for press wheels (equivalent to UCF 308 / UC 308 X1), bore diameter d = 40 mm. Mounting base J = 101.5 mm, housing length L = 130 mm, thread H/T = M12, Cdyn = 62.3 kN, Co = 45.2 kN, Pu = 1.898 kN, weight 2.5 kg. The reinforced combined sealing system (-DS) provides sealed protection of the rolling zone against soil dust, moisture and abrasives under continuous soil contact. Direct replacement for SNR CE066, FKL LSQFR308 TBT.H.T., PEER W308-40MM-FDT-MF-AP-SP1 and SNR UCF308 A01X1; used in AMAZONE press wheels (part no. 957305, CE066, CE078) and other European tillage equipment.',
                'meta_title_en' => 'VELNOX BUQ-308-2T3H-DS — press wheel unit d40, AMAZONE CE066',
                'meta_desc_en'  => 'VELNOX BUQ-308-2T3H-DS bearing unit (d=40 mm, Cdyn 62.3 kN) for press wheels. Direct replacement for AMAZONE CE066, 957305, SNR UC 308 X1.',
                'desc_pl'       => 'Wzmocniony kwadratowy kołnierzowy węzeł łożyskowy na 4 otwory montażowe do rolek dogniatających (zamiennik UCF 308 / UC 308 X1), średnica wewnętrzna d = 40 mm. Baza montażowa J = 101,5 mm, długość obudowy L = 130 mm, gwint H/T = M12, Cdyn = 62,3 kN, Co = 45,2 kN, Pu = 1,898 kN, masa 2,5 kg. Wzmocniony kombinowany system uszczelnień (-DS) zapewnia hermetyczną ochronę strefy toczenia przed pyłem glebowym, wilgocią i ścierniwem przy stałym kontakcie z glebą. Bezpośredni zamiennik SNR CE066, FKL LSQFR308 TBT.H.T., PEER W308-40MM-FDT-MF-AP-SP1 i SNR UCF308 A01X1; stosowany w rolkach dogniatających AMAZONE (nr art. 957305, CE066, CE078) i innych europejskich agregatach uprawowych.',
                'meta_title_pl' => 'VELNOX BUQ-308-2T3H-DS — węzeł rolki d40, AMAZONE CE066',
                'meta_desc_pl'  => 'Węzeł łożyskowy VELNOX BUQ-308-2T3H-DS (d=40 mm, Cdyn 62,3 kN) do rolek. Bezpośredni zamiennik AMAZONE CE066, 957305, SNR UC 308 X1.',
            ],
        ];

        foreach ($extraProducts as $p) {
            DB::table('products')->updateOrInsert(
                ['slug' => $p['slug']],
                ['slug' => $p['slug'], 'article' => $p['article'], 'product_table_id' => $p['table_id']]
            );
            $productId = DB::table('products')->where('slug', $p['slug'])->value('id');

            foreach ($p['specs'] as $key => $value) {
                $sid = $specId($key);
                if (!$sid) continue;
                DB::table('product_specs')->updateOrInsert(
                    ['product_id' => $productId, 'spec_id' => $sid],
                    ['value' => $value]
                );
            }

            DB::table('product_cross_refs')->where('product_id', $productId)->delete();
            foreach ($p['cross_refs'] as $ref) {
                DB::table('product_cross_refs')->insert(['product_id' => $productId, 'brand' => $ref['brand'], 'value' => $ref['value'], 'type' => $ref['type'] ?? 'bearing']);
            }

            foreach (['uk', 'en', 'pl'] as $locale) {
                DB::table('translations')->updateOrInsert(
                    ['entity_type' => 'product', 'entity_id' => $productId, 'locale' => $locale, 'field' => 'name'],
                    ['value' => $p["name_{$locale}"]]
                );
            }
            foreach (['uk', 'en', 'pl'] as $locale) {
                foreach (['desc' => 'desc', 'meta_title' => 'meta_title', 'meta_desc' => 'meta_description'] as $suffix => $field) {
                    $val = $p["{$suffix}_{$locale}"] ?? null;
                    if ($val) {
                        DB::table('translations')->updateOrInsert(
                            ['entity_type' => 'product', 'entity_id' => $productId, 'locale' => $locale, 'field' => $field],
                            ['value' => $val]
                        );
                    }
                }
            }
        }

        // =========================================================
        // 8. PRODUCT TABLE: bearings-t3
        // =========================================================
        DB::table('product_tables')->updateOrInsert(
            ['slug' => 'bearings-t3'],
            [
                'slug'          => 'bearings-t3',
                'category_id'   => $bearingsCatId,
                'spec_columns'  => json_encode(['d_mm','L_mm','J_mm','H_T','A_mm','A1_mm','A2_mm','B_mm','mass_kg','cdyn_kn','co_kn','pu_kn']),
                'highlight_config' => json_encode([
                    'd_mm'  => [['label' => 'd',   'x' => 1014, 'y' => 2401]],
                    'L_mm'  => [['label' => 'L',   'x' => 436,  'y' => 2715]],
                    'J_mm'  => [['label' => 'J',   'x' => 437,  'y' => 2678]],
                    'H_T'   => [['label' => 'H/T', 'x' => 244,  'y' => 2083]],
                    'A_mm'  => [['label' => 'A',   'x' => 372,  'y' => 2074], ['label' => 'A', 'x' => 368, 'y' => 2758]],
                    'A1_mm' => [['label' => 'A1',  'x' => 871,  'y' => 2723]],
                    'A2_mm' => [['label' => 'A2',  'x' => 824,  'y' => 2681]],
                    'B_mm'  => [['label' => 'B',   'x' => 913,  'y' => 2362]],
                ]),
                'schema_viewbox'  => '150 2036 2117 786',
                'sort_order'    => 3,
            ]
        );
        $t3 = $tableId('bearings-t3');

        foreach (['uk' => 'Підшипниковий вузол BUQ 309-2T3H', 'en' => 'Bearing Unit BUQ 309-2T3H', 'pl' => 'Węzeł łożyskowy BUQ 309-2T3H'] as $locale => $name) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $t3, 'locale' => $locale, 'field' => 'name'],
                ['value' => $name]
            );
        }

        foreach ([
            ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t3/velnox-buq-309-2t3h.webp',          'sort_order' => 1],
            ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t3/velnox-buq-309-2t3h-drawing-1.webp', 'sort_order' => 2],
            ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t3/velnox-buq-309-2t3h-drawing-2.webp', 'sort_order' => 3],
            ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t3/velnox-buq-309-2t3h-drawing-3.webp', 'sort_order' => 4],
            ['type' => 'schema_png', 'path' => '/velnox/images/products/bearings-t3/velnox-buq-309-2t3h-schema.webp',   'sort_order' => 0],
            ['type' => 'schema_svg', 'path' => '/velnox/images/products/bearings-t3/schema.svg',                          'sort_order' => 0],
        ] as $asset) {
            DB::table('product_assets')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $t3, 'type' => $asset['type'], 'path' => $asset['path']],
                ['sort_order' => $asset['sort_order']]
            );
        }

        // =========================================================
        // 9. PRODUCTS — bearings-t3
        // =========================================================
        $t3Products = [
            [
                'slug'    => 'buq-309-2t3h',
                'article' => 'BUQ 309-2T3H',
                'table_id' => $t3,
                'specs'   => [
                    'd_mm'    => '45',
                    'L_mm'    => '137',
                    'J_mm'    => '105',
                    'H_T'     => '14',
                    'A_mm'    => '54',
                    'A1_mm'   => '44',
                    'A2_mm'   => '22',
                    'B_mm'    => '51.1',
                    'mass_kg' => '3.4',
                    'cdyn_kn' => '59.6',
                    'co_kn'   => '80.8',
                    'pu_kn'   => '2.503',
                ],
                'cross_refs' => [
                    ['brand' => 'CT-AGRI',  'value' => 'CJI 309 GGG+19000509 (Assy)',  'type' => 'bearing'],
                    ['brand' => 'FKL',      'value' => 'LSQFR 309-2TB.H.T',            'type' => 'bearing'],
                    ['brand' => 'CT-AGRI',  'value' => 'LSQFR 309-2TB.H.T',            'type' => 'bearing'],
                    ['brand' => 'Farmet',   'value' => '4000412',                       'type' => 'application'],
                    ['brand' => 'Farmet',   'value' => 'M14581',                        'type' => 'application'],
                    ['brand' => 'Farmet',   'value' => '15626ND',                       'type' => 'application'],
                    ['brand' => 'Farmet',   'value' => '18888ND',                       'type' => 'application'],
                    ['brand' => 'Farmet',   'value' => 'M10257',                        'type' => 'application'],
                    ['brand' => 'Farmet',   'value' => 'M13082ND',                      'type' => 'application'],
                    ['brand' => 'Farmet',   'value' => 'M15626',                        'type' => 'application'],
                    ['brand' => 'Farmet',   'value' => 'M17627',                        'type' => 'application'],
                    ['brand' => 'Farmet',   'value' => 'M24607',                        'type' => 'application'],
                    ['brand' => '19000509А','value' => 'CJI309GGG+',                   'type' => 'application'],
                    ['brand' => 'FKL',      'value' => 'LEFG 209 TDT',                 'type' => 'application'],
                ],
                'name_uk' => 'BUQ 309-2T3H',
                'name_en' => 'BUQ 309-2T3H',
                'name_pl' => 'BUQ 309-2T3H',
                'desc_uk'       => 'Квадратний фланцевий підшипниковий вузол на 4 кріпильні отвори серії 309 для прикочувальних котків з внутрішнім діаметром d = 45 мм. Кріпильна база J = 105 мм, довжина корпусу L = 137 мм, ширина внутрішнього кільця B = 51.1 мм, Cdyn = 59.6 кН, Co = 80.8 кН, Pu = 2.503 кН. Посилена герметизація — трикромкове ущільнення в парі з двокромковим з кожної сторони — забезпечує ресурс у вузлах з ударними навантаженнями та абразивним середовищем. Пряма заміна FKL LSQFR 309 2TB.H.T та вузла CJI 309 GGG+19000509; використовується у прикочувальних котках Farmet (арт. 4000412, M14581, 15626ND, 18888ND, M10257, M13082ND, M15626, M17627, M24607, R17015300).',
                'meta_title_uk' => 'VELNOX BUQ 309-2T3H — вузол котка d45, Farmet M14581 LEFG 209 TDT',
                'meta_desc_uk'  => 'Фланцевий вузол VELNOX BUQ 309-2T3H, d=45 мм, Cdyn 59.6 кН. Пряма заміна Farmet M14581, 4000412, FKL LEFG 209 TDT. Для котків.',
                'desc_en'       => 'Square flange bearing unit with 4 mounting holes, 309 series, for press wheels, bore diameter d = 45 mm. Mounting base J = 105 mm, housing length L = 137 mm, inner ring width B = 51.1 mm, Cdyn = 59.6 kN, Co = 80.8 kN, Pu = 2.503 kN. Reinforced sealing — triple-lip seal paired with a double-lip seal on each side — ensures service life in assemblies subject to impact loads and abrasive environments. Direct replacement for FKL LSQFR 309 2TB.H.T and the CJI 309 GGG+19000509 assembly; used in Farmet press wheels (part no. 4000412, M14581, 15626ND, 18888ND, M10257, M13082ND, M15626, M17627, M24607, R17015300).',
                'meta_title_en' => 'VELNOX BUQ 309-2T3H — press wheel unit d45, Farmet M14581 LEFG 209 TDT',
                'meta_desc_en'  => 'Flange bearing unit VELNOX BUQ 309-2T3H, d=45 mm, Cdyn 59.6 kN. Direct replacement for Farmet M14581, 4000412, FKL LEFG 209 TDT. For press wheels.',
                'desc_pl'       => 'Kwadratowy kołnierzowy węzeł łożyskowy na 4 otwory montażowe, seria 309, do rolek dogniatających, średnica wewnętrzna d = 45 mm. Baza montażowa J = 105 mm, długość obudowy L = 137 mm, szerokość pierścienia wewnętrznego B = 51,1 mm, Cdyn = 59,6 kN, Co = 80,8 kN, Pu = 2,503 kN. Wzmocnione uszczelnienie — trójkrawędziowy uszczelniacz w parze z dwukrawędziowym po każdej stronie — zapewnia żywotność w węzłach narażonych na obciążenia udarowe i środowisko ścierne. Bezpośredni zamiennik FKL LSQFR 309 2TB.H.T i węzła CJI 309 GGG+19000509; stosowany w rolkach dogniatających Farmet (nr art. 4000412, M14581, 15626ND, 18888ND, M10257, M13082ND, M15626, M17627, M24607, R17015300).',
                'meta_title_pl' => 'VELNOX BUQ 309-2T3H — węzeł rolki d45, Farmet M14581 LEFG 209 TDT',
                'meta_desc_pl'  => 'Kołnierzowy węzeł łożyskowy VELNOX BUQ 309-2T3H, d=45 mm, Cdyn 59,6 kN. Bezpośredni zamiennik Farmet M14581, 4000412, FKL LEFG 209 TDT. Do rolek dogniatających.',
            ],
        ];

        foreach ($t3Products as $p) {
            DB::table('products')->updateOrInsert(
                ['slug' => $p['slug']],
                ['slug' => $p['slug'], 'article' => $p['article'], 'product_table_id' => $p['table_id']]
            );
            $productId = DB::table('products')->where('slug', $p['slug'])->value('id');

            foreach ($p['specs'] as $key => $value) {
                $sid = $specId($key);
                if (!$sid) continue;
                DB::table('product_specs')->updateOrInsert(
                    ['product_id' => $productId, 'spec_id' => $sid],
                    ['value' => $value]
                );
            }

            DB::table('product_cross_refs')->where('product_id', $productId)->delete();
            foreach ($p['cross_refs'] as $ref) {
                DB::table('product_cross_refs')->insert(['product_id' => $productId, 'brand' => $ref['brand'], 'value' => $ref['value'], 'type' => $ref['type']]);
            }

            foreach (['uk', 'en', 'pl'] as $locale) {
                DB::table('translations')->updateOrInsert(
                    ['entity_type' => 'product', 'entity_id' => $productId, 'locale' => $locale, 'field' => 'name'],
                    ['value' => $p["name_{$locale}"]]
                );
            }
            foreach (['uk', 'en', 'pl'] as $locale) {
                foreach (['desc' => 'desc', 'meta_title' => 'meta_title', 'meta_desc' => 'meta_description'] as $suffix => $field) {
                    $val = $p["{$suffix}_{$locale}"] ?? null;
                    if ($val) {
                        DB::table('translations')->updateOrInsert(
                            ['entity_type' => 'product', 'entity_id' => $productId, 'locale' => $locale, 'field' => $field],
                            ['value' => $val]
                        );
                    }
                }
            }

            // 3D model asset (file exists: public/models/BUQ-309-2T3H.glb)
            if ($p['slug'] === 'buq-309-2t3h') {
                DB::table('product_assets')->updateOrInsert(
                    ['entity_type' => 'product', 'entity_id' => $productId, 'type' => 'model_3d'],
                    ['path' => '/velnox/models/BUQ-309-2T3H.glb', 'sort_order' => 0]
                );
            }
        }

        // =========================================================
        // 12. PRODUCT TABLE: bearings-t4 (BUCR-SG-309-S2)
        // =========================================================
        DB::table('product_tables')->updateOrInsert(
            ['slug' => 'bearings-t4'],
            [
                'slug'             => 'bearings-t4',
                'category_id'      => $bearingsCatId,
                'spec_columns'     => json_encode(['d_mm','d1_mm','L1_mm','J1_mm','L2_mm','J2_mm','A_mm','flange_A1_mm','A2_mm','A3_mm','T_size','H_mm','mass_kg','cdyn_kn','co_kn','pu_kn']),
                'highlight_config' => json_encode([
                    'd_mm'   => [['label'=>'d',  'x'=>1168,'y'=>1004]],
                    'd1_mm'  => [['label'=>'d1', 'x'=>1513,'y'=>1003]],
                    'L1_mm'  => [['label'=>'L1', 'x'=>609, 'y'=>1465]],
                    'J1_mm'  => [['label'=>'J1', 'x'=>607, 'y'=>1415]],
                    'L2_mm'  => [['label'=>'L2', 'x'=>986, 'y'=>676]],
                    'J2_mm'  => [['label'=>'J2', 'x'=>939, 'y'=>723]],
                    'A_mm'   => [['label'=>'A',  'x'=>1350,'y'=>1465]],
                    'flange_A1_mm'  => [['label'=>'A1', 'x'=>1438,'y'=>1419]],
                    'A2_mm'  => [['label'=>'A2', 'x'=>1261,'y'=>1389]],
                    'A3_mm'  => [['label'=>'A3', 'x'=>1261,'y'=>1323]],
                    'T_size' => [['label'=>'T',  'x'=>243, 'y'=>774]],
                    'H_mm'   => [['label'=>'H',  'x'=>139, 'y'=>1008]],
                ]),
                'schema_viewbox'   => '90 444 2314 1389',
                'sort_order'       => 4,
            ]
        );
        $t4 = $tableId('bearings-t4');

        foreach (['uk' => 'BUCR-SG-309-S2 — Таблиця 4', 'en' => 'BUCR-SG-309-S2 — Table 4', 'pl' => 'BUCR-SG-309-S2 — Tabela 4'] as $locale => $name) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $t4, 'locale' => $locale, 'field' => 'name'],
                ['value' => $name]
            );
        }

        // gallery тепер на рівні product (entity_type='product') — вставляється нижче, в циклі $t4Products.
        // Старі рядки рівня product_table треба прибрати, інакше головне фото і креслення
        // дублюються в галереї (лишились у БД після b30529c).
        DB::table('product_assets')
            ->where('entity_type', 'product_table')->where('entity_id', $t4)
            ->where('type', 'gallery')->delete();
        foreach ([
            ['type' => 'schema_png', 'path' => '/velnox/images/products/bearings-t4/velnox-bucr-sg-309-s2-schema.webp', 'sort_order' => 0],
            ['type' => 'schema_svg', 'path' => '/velnox/images/products/bearings-t4/schema.svg',                         'sort_order' => 0],
        ] as $asset) {
            DB::table('product_assets')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $t4, 'type' => $asset['type'], 'path' => $asset['path']],
                ['sort_order' => $asset['sort_order']]
            );
        }

        // =========================================================
        // 13. PRODUCTS — bearings-t4
        // =========================================================
        $t4Products = [
            [
                'slug'    => 'bucr-sg-309-s2',
                'article' => 'BUCR-SG-309-S2',
                'specs'   => [
                    'd_mm'    => '45',
                    'd1_mm'   => '74',
                    'L1_mm'   => '152',
                    'J1_mm'   => '120',
                    'L2_mm'   => '150',
                    'J2_mm'   => '120',
                    'A_mm'    => '66.9',
                    'flange_A1_mm'   => '18',
                    'A2_mm'   => '12',
                    'A3_mm'   => '7',
                    'T_size'  => '4xM12x1.25',
                    'H_mm'    => '4x12.3',
                    'mass_kg' => '5.6',
                    'cdyn_kn' => '52.7',
                    'co_kn'   => '31.5',
                    'pu_kn'   => '1.32',
                ],
                'cross_refs' => [
                    ['brand' => 'CT-AGRI', 'value' => 'M43400468',                        'type' => 'bearing'],
                    ['brand' => '',         'value' => 'M43400468 H.60 S.PAR',             'type' => 'bearing'],
                    ['brand' => 'Ri.Ma',    'value' => 'M43400468 Bearing unit PN 0102',   'type' => 'bearing'],
                    ['brand' => 'FKL',      'value' => 'ZGKU 309 2S',                      'type' => 'bearing'],
                    ['brand' => 'RBF',      'value' => 'PN00102',                          'type' => 'bearing'],
                    ['brand' => 'GASPARDO', 'value' => '17014180',                         'type' => 'application'],
                    ['brand' => 'GASPARDO', 'value' => 'M23400435 — Bearing housing section', 'type' => 'application'],
                    ['brand' => 'GASPARDO', 'value' => 'M23400436 — Bearing housing section', 'type' => 'application'],
                    ['brand' => 'GASPARDO', 'value' => 'M43400413',                        'type' => 'application'],
                    ['brand' => 'GASPARDO', 'value' => 'M43400468',                        'type' => 'application'],
                    ['brand' => 'GASPARDO', 'value' => 'M43400468R',                       'type' => 'application'],
                    ['brand' => 'GASPARDO', 'value' => 'R17015300',                        'type' => 'application'],
                    ['brand' => 'GASPARDO', 'value' => 'M43400468 Bearing Unit',           'type' => 'application'],
                ],
                'name_uk' => 'BUCR-SG-309-S2',
                'name_en' => 'BUCR-SG-309-S2',
                'name_pl' => 'BUCR-SG-309-S2',
                'desc_uk' => 'Тандемний (здвоєний) підшипниковий вузол типу Gaspardo з двома симетричними корпусними секціями (L1 = 152 мм, L2 = 150 мм) та посадковим діаметром d = 45 мм, діаметром корпусу d1 = 74 мм, масою 5.6 кг. Монтажні бази J1 = J2 = 120 мм, кріплення 4×M12×1.25 з кожного боку, висота A = 66.9 мм; конструкція розрахована на асиметричне навантаження секційних вузлів посівних і ґрунтообробних комплексів. Посилена багатокромкова система ущільнень захищає підшипник від ґрунтової вологи, насіннєвого пилу та абразиву під час постійної польової роботи. Пряма заміна OEM-вузлів Gaspardo (арт. 17014180, M23400435, M23400436, M43400413, M43400468, M43400468R, R17015300), FKL ZGKU 309 2S та RBF PN00102; застосовується у висівних секціях та прикочувальних котках техніки Gaspardo/Maschio.',
                'desc_en' => 'Tandem (double) Gaspardo-type bearing unit with two symmetrical housing sections (L1 = 152 mm, L2 = 150 mm), bore diameter d = 45 mm, housing diameter d1 = 74 mm, weight 5.6 kg. Mounting bases J1 = J2 = 120 mm, fastening 4×M12×1.25 per side, height A = 66.9 mm; design is intended for asymmetric loading of sectional assemblies in seeding and tillage equipment. The reinforced multi-lip sealing system protects the bearing from soil moisture, seed dust and abrasives during continuous field operation. Direct replacement for Gaspardo OEM units (p/n 17014180, M23400435, M23400436, M43400413, M43400468, M43400468R, R17015300), FKL ZGKU 309 2S and RBF PN00102; used in seeding sections and press wheels of Gaspardo/Maschio equipment.',
                'desc_pl' => 'Tandemowy (podwójny) węzeł łożyskowy typu Gaspardo z dwiema symetrycznymi sekcjami obudowy (L1 = 152 mm, L2 = 150 mm), średnicą otworu d = 45 mm, średnicą obudowy d1 = 74 mm, masą 5,6 kg. Bazy montażowe J1 = J2 = 120 mm, mocowanie 4×M12×1,25 z każdej strony, wysokość A = 66,9 mm; konstrukcja przeznaczona do asymetrycznego obciążenia węzłów sekcyjnych agregatów siewnych i uprawowych. Wzmocniony wielokrawędziowy system uszczelnień chroni łożysko przed wilgocią glebową, pyłem nasiennym i ścierniwem podczas ciągłej pracy polowej. Bezpośredni zamiennik węzłów OEM Gaspardo (nr art. 17014180, M23400435, M23400436, M43400413, M43400468, M43400468R, R17015300), FKL ZGKU 309 2S i RBF PN00102; stosowany w sekcjach siewnych i rolkach dogniatających maszyn Gaspardo/Maschio.',
                'meta_title_uk' => 'VELNOX BUCR-SG-309-S2 — тандемний вузол Gaspardo M43400468',
                'meta_title_en' => 'VELNOX BUCR-SG-309-S2 — tandem Gaspardo bearing unit M43400468',
                'meta_title_pl' => 'VELNOX BUCR-SG-309-S2 — tandemowy węzeł Gaspardo M43400468',
                'meta_desc_uk'  => 'Тандемний вузол VELNOX BUCR-SG-309-S2 для Gaspardo, d=45 мм, 4×M12, маса 5.6 кг. Заміна Gaspardo M43400468, 17014180, FKL ZGKU 309 2S.',
                'meta_desc_en'  => 'Tandem bearing unit VELNOX BUCR-SG-309-S2 for Gaspardo, d=45 mm, 4×M12, weight 5.6 kg. Replacement for Gaspardo M43400468, 17014180, FKL ZGKU 309 2S.',
                'meta_desc_pl'  => 'Tandemowy węzeł łożyskowy VELNOX BUCR-SG-309-S2 do Gaspardo, d=45 mm, 4×M12, masa 5,6 kg. Zamiennik Gaspardo M43400468, 17014180, FKL ZGKU 309 2S.',
            ],
        ];

        foreach ($t4Products as $p) {
            DB::table('products')->updateOrInsert(
                ['slug' => $p['slug']],
                ['slug' => $p['slug'], 'article' => $p['article'], 'product_table_id' => $t4]
            );
            $productId = DB::table('products')->where('slug', $p['slug'])->value('id');

            foreach ($p['specs'] as $key => $value) {
                $sid = $specId($key);
                if (!$sid) continue;
                DB::table('product_specs')->updateOrInsert(
                    ['product_id' => $productId, 'spec_id' => $sid],
                    ['value' => $value]
                );
            }

            DB::table('product_cross_refs')->where('product_id', $productId)->delete();
            foreach ($p['cross_refs'] as $ref) {
                DB::table('product_cross_refs')->insert([
                    'product_id' => $productId,
                    'brand'      => $ref['brand'],
                    'value'      => $ref['value'],
                    'type'       => $ref['type'],
                ]);
            }

            foreach (['uk', 'en', 'pl'] as $locale) {
                DB::table('translations')->updateOrInsert(
                    ['entity_type' => 'product', 'entity_id' => $productId, 'locale' => $locale, 'field' => 'name'],
                    ['value' => $p["name_{$locale}"]]
                );
            }
            foreach (['uk', 'en', 'pl'] as $locale) {
                foreach (['desc' => 'desc', 'meta_title' => 'meta_title', 'meta_desc' => 'meta_description'] as $suffix => $field) {
                    $val = $p["{$suffix}_{$locale}"] ?? null;
                    if ($val) {
                        DB::table('translations')->updateOrInsert(
                            ['entity_type' => 'product', 'entity_id' => $productId, 'locale' => $locale, 'field' => $field],
                            ['value' => $val]
                        );
                    }
                }
            }

            // 3D model asset (file exists: public/models/BUCR-SG-309-S2.glb)
            if ($p['slug'] === 'bucr-sg-309-s2') {
                DB::table('product_assets')->updateOrInsert(
                    ['entity_type' => 'product', 'entity_id' => $productId, 'type' => 'model_3d'],
                    ['path' => '/velnox/models/BUCR-SG-309-S2.glb', 'sort_order' => 0]
                );
                // gallery (entity_type='product'): нові фото спочатку, потім старе фото + креслення
                foreach ([
                    ['path' => '/velnox/images/products/bearings-t4/velnox-bucr-sg-309-s2-photo-1.webp',  'sort_order' => 0],
                    ['path' => '/velnox/images/products/bearings-t4/velnox-bucr-sg-309-s2-photo-2.webp',  'sort_order' => 1],
                    ['path' => '/velnox/images/products/bearings-t4/velnox-bucr-sg-309-s2-photo-3.webp',  'sort_order' => 2],
                    ['path' => '/velnox/images/products/bearings-t4/velnox-bucr-sg-309-s2-photo-4.webp',  'sort_order' => 3],
                    ['path' => '/velnox/images/products/bearings-t4/velnox-bucr-sg-309-s2.webp',           'sort_order' => 4],
                    ['path' => '/velnox/images/products/bearings-t4/velnox-bucr-sg-309-s2-drawing-1.webp', 'sort_order' => 5],
                    ['path' => '/velnox/images/products/bearings-t4/velnox-bucr-sg-309-s2-drawing-2.webp', 'sort_order' => 6],
                ] as $img) {
                    DB::table('product_assets')->updateOrInsert(
                        ['entity_type' => 'product', 'entity_id' => $productId, 'type' => 'gallery', 'path' => $img['path']],
                        ['sort_order' => $img['sort_order']]
                    );
                }
            }
        }

        // =========================================================
        // 14. PRODUCT TABLE: bearings-t5 (BUP-207-X3L)
        // =========================================================
        DB::table('product_tables')->updateOrInsert(
            ['slug' => 'bearings-t5'],
            [
                'slug'             => 'bearings-t5',
                'category_id'      => $bearingsCatId,
                'spec_columns'     => json_encode(['d_mm','D_mm','J_mm','H_T','A_mm','A2_mm','B_mm','mass_kg','co_kn','cdyn_kn','pu_kn']),
                'highlight_config' => json_encode([
                    'd_mm'  => [['label' => 'd',   'x' => 401,  'y' => 2191]],
                    'D_mm'  => [['label' => 'D',   'x' => 759,  'y' => 2213]],
                    'J_mm'  => [['label' => 'J',   'x' => 417,  'y' => 2518]],
                    'H_T'   => [['label' => 'H/T', 'x' => 1083, 'y' => 2011]],
                    'A_mm'  => [['label' => 'A', 'x' => 348, 'y' => 1872], ['label' => 'A', 'x' => 342, 'y' => 2563], ['label' => 'A', 'x' => 911, 'y' => 2549]],
                    'A2_mm' => [['label' => 'A2',  'x' => 870,  'y' => 2497]],
                    'B_mm'  => [['label' => 'B',   'x' => 945,  'y' => 2171]],
                ]),
                'schema_viewbox'   => '101 1827 2262 836',
                'sort_order'       => 5,
            ]
        );
        $t5 = $tableId('bearings-t5');

        foreach (['uk' => 'BUP-207-X3L — Таблиця 5', 'en' => 'BUP-207-X3L — Table 5', 'pl' => 'BUP-207-X3L — Tabela 5'] as $locale => $name) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $t5, 'locale' => $locale, 'field' => 'name'],
                ['value' => $name]
            );
        }

        foreach ([
            // sort 1-5 зайняті студійними фото на рівні product (див. блок 15 нижче)
            ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t5/velnox-bup-207-x3l.webp',          'sort_order' => 6],
            ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t5/velnox-bup-207-x3l-drawing-1.webp', 'sort_order' => 7],
            ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t5/velnox-bup-207-x3l-drawing-2.webp', 'sort_order' => 8],
            ['type' => 'gallery',    'path' => '/velnox/images/products/bearings-t5/velnox-bup-207-x3l-drawing-3.webp', 'sort_order' => 9],
            ['type' => 'schema_png', 'path' => '/velnox/images/products/bearings-t5/velnox-bup-207-x3l-schema.webp',   'sort_order' => 0],
            ['type' => 'schema_svg', 'path' => '/velnox/images/products/bearings-t5/schema.svg',                         'sort_order' => 0],
        ] as $asset) {
            DB::table('product_assets')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $t5, 'type' => $asset['type'], 'path' => $asset['path']],
                ['sort_order' => $asset['sort_order']]
            );
        }

        // =========================================================
        // 15. PRODUCTS — bearings-t5 (BUP-207-X3L)
        // =========================================================
        $t5Products = [
            [
                'slug'    => 'bup-207-x3l',
                'article' => 'BUP 207-X3L',
                'specs'   => [
                    'd_mm'    => '35',
                    'D_mm'    => '125',
                    'J_mm'    => '100',
                    'H_T'     => 'M12',
                    'A_mm'    => '40',
                    'A2_mm'   => '20',
                    'B_mm'    => '28.3',
                    'mass_kg' => '1.7',
                    'co_kn'   => '15.3',
                    'cdyn_kn' => '25.5',
                    'pu_kn'   => '0.643',
                ],
                'cross_refs' => [
                    ['brand' => 'PEER',      'value' => '207XTR-R-DFC-A534 (PER.207RRSB-FC-A)',  'type' => 'bearing'],
                    ['brand' => 'RBF',       'value' => 'GH.PN 00032',                            'type' => 'bearing'],
                    ['brand' => 'FKL',       'value' => 'LSGR 207-TBS',                           'type' => 'bearing'],
                    ['brand' => 'CT-AGRI',   'value' => 'LSGR 207-TBS',                           'type' => 'bearing'],
                    ['brand' => 'NTE',       'value' => 'LSGR 207-TBS',                           'type' => 'bearing'],
                    ['brand' => 'RBF',       'value' => 'PN 00023',                               'type' => 'bearing'],
                    ['brand' => 'RBF',       'value' => 'PN 00032',                               'type' => 'bearing'],
                    ['brand' => 'LEMKEN',    'value' => '31910034 Lemken',                        'type' => 'application'],
                    ['brand' => 'LEMKEN',    'value' => '3199372 Lemken',                         'type' => 'application'],
                    ['brand' => 'OPALL AGRI','value' => '3421370 Opall Agri',                     'type' => 'application'],
                    ['brand' => 'INA/FAG',   'value' => 'F232812 - 0200 INA/FAG Bearing',        'type' => 'application'],
                    ['brand' => 'INA/FAG',   'value' => 'GGF35A08',                              'type' => 'application'],
                    ['brand' => 'INA/FAG',   'value' => 'GGME07 - AH07 INA/FAG Housing',        'type' => 'application'],
                    ['brand' => 'OPALL AGRI','value' => 'RCJ 35 35x118x39,9 4xM12',              'type' => 'application'],
                    ['brand' => 'SNR',       'value' => 'UC 207 X1 SNR Bearing',                 'type' => 'application'],
                ],
                'name_uk' => 'BUP 207-X3L',
                'name_en' => 'BUP 207-X3L',
                'name_pl' => 'BUP 207-X3L',
                'desc_uk'       => 'Підшипниковий вузол у круглому фланцевому корпусі типу RCJ 35 / UC 207 X1 для ґрунтообробної техніки Lemken з внутрішнім діаметром d = 35 мм та зовнішнім діаметром корпусу D = 125 мм. Монтажна база J = 100 мм під різьбу M12, загальна ширина A = 40 мм, ширина внутрішнього кільця B = 28.3 мм, Cdyn = 25.5 кН, Co = 15.3 кН, маса 1.7 кг. Система захисту — багатокромкове ущільнення серії X3L (трикромкове контактне з базової сторони + посилене фронтальне), розраховане на ударні навантаження ґрунтообробного диска. Повний геометричний аналог Lemken 31910034 / 3199372, Opall Agri 3421370, INA/FAG F232812-0200, PEER 207XTR-R-DFC-A534 та SNR UC 207 X1; застосовується у дискових боронах Lemken серій Rubin, Heliodor, Kristall.',
                'meta_title_uk' => 'VELNOX BUP 207-X3L — вузол Lemken d35, 31910034, UC 207 X1',
                'meta_desc_uk'  => 'Підшипниковий вузол VELNOX BUP 207-X3L для Lemken, d=35 мм, D=125 мм, Cdyn 25.5 кН. Заміна Lemken 31910034, 3199372, SNR UC 207 X1.',
                'desc_en'       => 'Bearing unit in a round flanged housing type RCJ 35 / UC 207 X1 for Lemken tillage equipment with bore diameter d = 35 mm and housing outer diameter D = 125 mm. Mounting base J = 100 mm for M12 bolts, overall width A = 40 mm, inner ring width B = 28.3 mm, Cdyn = 25.5 kN, Co = 15.3 kN, weight 1.7 kg. Protection system — multi-lip seal series X3L (triple-lip contact seal on the base side + reinforced frontal seal), designed for impact loads of a tillage disc. Full geometric equivalent of Lemken 31910034 / 3199372, Opall Agri 3421370, INA/FAG F232812-0200, PEER 207XTR-R-DFC-A534 and SNR UC 207 X1; used in Lemken disc harrows of the Rubin, Heliodor and Kristall series.',
                'meta_title_en' => 'VELNOX BUP 207-X3L — Lemken bearing unit d35, 31910034, UC 207 X1',
                'meta_desc_en'  => 'VELNOX BUP 207-X3L bearing unit for Lemken, d=35 mm, D=125 mm, Cdyn 25.5 kN. Replaces Lemken 31910034, 3199372, SNR UC 207 X1.',
                'desc_pl'       => 'Węzeł łożyskowy w okrągłej obudowie kołnierzowej typu RCJ 35 / UC 207 X1 do maszyn uprawowych Lemken ze średnicą otworu d = 35 mm i zewnętrzną średnicą obudowy D = 125 mm. Baza montażowa J = 100 mm pod śruby M12, szerokość całkowita A = 40 mm, szerokość pierścienia wewnętrznego B = 28,3 mm, Cdyn = 25,5 kN, Co = 15,3 kN, masa 1,7 kg. System uszczelnienia — wielowargowy uszczelniacz serii X3L (trójwargowy uszczelniacz stykowy od strony podstawy + wzmocniony uszczelniacz czołowy), zaprojektowany na obciążenia udarowe tarczy uprawowej. Pełny geometryczny odpowiednik Lemken 31910034 / 3199372, Opall Agri 3421370, INA/FAG F232812-0200, PEER 207XTR-R-DFC-A534 i SNR UC 207 X1; stosowany w bronach talerzowych Lemken serii Rubin, Heliodor, Kristall.',
                'meta_title_pl' => 'VELNOX BUP 207-X3L — węzeł Lemken d35, 31910034, UC 207 X1',
                'meta_desc_pl'  => 'Węzeł łożyskowy VELNOX BUP 207-X3L do Lemken, d=35 mm, D=125 mm, Cdyn 25,5 kN. Zamiennik Lemken 31910034, 3199372, SNR UC 207 X1.',
            ],
        ];

        foreach ($t5Products as $p) {
            DB::table('products')->updateOrInsert(
                ['slug' => $p['slug']],
                ['slug' => $p['slug'], 'article' => $p['article'], 'product_table_id' => $t5]
            );
            $productId = DB::table('products')->where('slug', $p['slug'])->value('id');

            foreach ($p['specs'] as $key => $value) {
                $sid = $specId($key);
                if (!$sid) continue;
                DB::table('product_specs')->updateOrInsert(
                    ['product_id' => $productId, 'spec_id' => $sid],
                    ['value' => $value]
                );
            }

            DB::table('product_cross_refs')->where('product_id', $productId)->delete();
            foreach ($p['cross_refs'] as $ref) {
                DB::table('product_cross_refs')->insert([
                    'product_id' => $productId,
                    'brand'      => $ref['brand'],
                    'value'      => $ref['value'],
                    'type'       => $ref['type'],
                ]);
            }

            foreach (['uk', 'en', 'pl'] as $locale) {
                DB::table('translations')->updateOrInsert(
                    ['entity_type' => 'product', 'entity_id' => $productId, 'locale' => $locale, 'field' => 'name'],
                    ['value' => $p["name_{$locale}"]]
                );
            }
            foreach (['uk', 'en', 'pl'] as $locale) {
                foreach (['desc' => 'desc', 'meta_title' => 'meta_title', 'meta_desc' => 'meta_description'] as $suffix => $field) {
                    $val = $p["{$suffix}_{$locale}"] ?? null;
                    if ($val) {
                        DB::table('translations')->updateOrInsert(
                            ['entity_type' => 'product', 'entity_id' => $productId, 'locale' => $locale, 'field' => $field],
                            ['value' => $val]
                        );
                    }
                }
            }

            // 3D model asset (file exists: public/models/BUP-207-X3L.glb)
            if ($p['slug'] === 'bup-207-x3l') {
                DB::table('product_assets')->updateOrInsert(
                    ['entity_type' => 'product', 'entity_id' => $productId, 'type' => 'model_3d'],
                    ['path' => '/velnox/models/BUP-207-X3L.glb', 'sort_order' => 0]
                );
                // студійні фото (sort 1-5) — головне фото + креслення лежать на рівні
                // product_table із sort 6-9, тож у галереї фото йдуть першими
                for ($i = 1; $i <= 5; $i++) {
                    DB::table('product_assets')->updateOrInsert(
                        [
                            'entity_type' => 'product', 'entity_id' => $productId, 'type' => 'gallery',
                            'path' => "/velnox/images/products/bearings-t5/velnox-bup-207-x3l-photo-{$i}.webp",
                        ],
                        ['sort_order' => $i]
                    );
                }
            }
        }

        // =========================================================
        // 16. PRODUCT TABLE: hubs-t1
        // =========================================================
        $hubsCatId = $catId('hubs');

        DB::table('product_tables')->updateOrInsert(
            ['slug' => 'hubs-t1'],
            [
                'slug'             => 'hubs-t1',
                'category_id'      => $hubsCatId,
                'spec_columns'     => json_encode(['hub_J_mm', 'hub_D_mm', 'hub_D1_mm', 'hub_d_mm', 'hub_C_mm', 'hub_hole_thread', 'hub_G', 'hub_L_mm', 'hub_L1_mm', 'hub_F_mm', 'mass_kg', 'cdyn_kn', 'co_kn', 'pu_kn']),
                'highlight_config' => json_encode([
                    'hub_J_mm'        => [['label' => 'J',   'x' => 355,  'y' => 856]],
                    'hub_D_mm'        => [['label' => 'D',   'x' => 1536, 'y' => 816]],
                    'hub_D1_mm'       => [['label' => 'D1',  'x' => 840,  'y' => 801]],
                    'hub_d_mm'        => [['label' => 'd',   'x' => 899,  'y' => 801]],
                    'hub_C_mm'        => [['label' => 'C',   'x' => 512,  'y' => 798]],
                    'hub_hole_thread' => [['label' => 'H/T', 'x' => 465,  'y' => 383]],
                    'hub_G'           => [['label' => 'G',   'x' => 931,  'y' => 693]],
                    'hub_L_mm'        => [['label' => 'L',   'x' => 1232, 'y' => 1126]],
                    'hub_L1_mm'       => [['label' => 'L1',  'x' => 935,  'y' => 992]],
                    'hub_F_mm'        => [['label' => 'F',   'x' => 1058, 'y' => 1059]],
                ]),
                'schema_viewbox'   => '80 270 2260 1240',
                'sort_order'       => 1,
            ]
        );

        $ht1 = $tableId('hubs-t1');

        foreach (['uk' => 'Ступичний вузол HORSCH — Таблиця 1', 'en' => 'Hub Unit HORSCH — Table 1', 'pl' => 'Węzeł piasty HORSCH — Tabela 1'] as $locale => $name) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $ht1, 'locale' => $locale, 'field' => 'name'],
                ['value' => $name]
            );
        }

        $ht1Products = [
            [
                'article' => '28071300 VX',
                'slug'    => '28071300-vx',
                'specs'   => [
                    'hub_J_mm'        => '106',
                    'hub_D_mm'        => '127.3',
                    'hub_D1_mm'       => '64.2',
                    'hub_d_mm'        => '55.7',
                    'hub_C_mm'        => '38',
                    'hub_hole_thread' => 'M12',
                    'hub_G'           => '2xM20',
                    'hub_L_mm'        => '106.5',
                    'hub_L1_mm'       => '2',
                    'hub_F_mm'        => '25',
                    'mass_kg'         => '3.81',
                    'cdyn_kn'         => '48.8',
                    'co_kn'           => '35.3',
                    'pu_kn'           => '1.483',
                ],
                'cross_refs' => [
                    ['brand' => 'HORSCH', 'value' => '28071300', 'type' => 'application'],
                    ['brand' => 'HORSCH', 'value' => '28077800', 'type' => 'application'],
                    ['brand' => 'HORSCH', 'value' => '28077900', 'type' => 'application'],
                    ['brand' => 'HORSCH', 'value' => '28085600', 'type' => 'application'],
                    ['brand' => '',       'value' => 'PN60041',  'type' => 'application'],
                ],
                'name_uk'       => '28071300 VX',
                'name_en'       => '28071300 VX',
                'name_pl'       => '28071300 VX',
                'desc_uk'       => 'Ступичний вузол у круглому фланцевому корпусі для ґрунтообробних машин HORSCH Focus / Joker з діаметром вала d = 55.7 мм та зовнішнім діаметром корпусу D = 127.3 мм; монтажний діаметр фланця J = 106 мм під кріплення M12, відстань між отворами C = 38 мм. Загальна довжина L = 106.5 мм, два мастильних ніпелі G 2×M20, динамічна вантажопідйомність Cdyn = 48.8 кН, статична Co = 35.3 кН, маса 3.81 кг. Захисна система — двокромкове контактне ущільнення з боку польового диска у поєднанні з металевим відбивачем бруду на фронтальній стороні, розраховане на роботу в умовах підвищеного абразивного та ударного навантаження. Прямий аналог HORSCH 28071300, 28077800, 28077900, 28085600 та PN60041; встановлюється на дискові сошники та диски культиваторів HORSCH серій Focus та Joker.',
                'meta_title_uk' => 'VELNOX 28071300 VX — ступичний вузол HORSCH d55.7, Focus/Joker',
                'meta_desc_uk'  => 'Ступичний вузол VELNOX 28071300 VX для HORSCH, d=55.7 мм, D=127.3 мм, Cdyn 48.8 кН. Аналог HORSCH 28071300, 28077800, 28085600, PN60041.',
                'desc_en'       => 'Hub bearing unit in a round flanged housing for HORSCH Focus / Joker tillage equipment with shaft bore d = 55.7 mm and housing outer diameter D = 127.3 mm; flange bolt circle J = 106 mm for M12 fastening, hole spacing C = 38 mm. Overall length L = 106.5 mm, two grease nipples G 2×M20, dynamic load rating Cdyn = 48.8 kN, static Co = 35.3 kN, weight 3.81 kg. Sealing system — double-lip contact seal on the field disc side combined with a metal dirt deflector on the front face, designed for high abrasive and impact loads in tillage conditions. Direct equivalent of HORSCH 28071300, 28077800, 28077900, 28085600 and PN60041; fitted to disc coulters and discs on HORSCH Focus and Joker series cultivators.',
                'meta_title_en' => 'VELNOX 28071300 VX — HORSCH hub unit d55.7, Focus/Joker',
                'meta_desc_en'  => 'VELNOX 28071300 VX hub unit for HORSCH, d=55.7 mm, D=127.3 mm, Cdyn 48.8 kN. Replaces HORSCH 28071300, 28077800, 28085600, PN60041.',
                'desc_pl'       => 'Węzeł piasty w okrągłej obudowie kołnierzowej do maszyn uprawowych HORSCH Focus / Joker ze średnicą otworu wału d = 55,7 mm i zewnętrzną średnicą obudowy D = 127,3 mm; koło podziałowe kołnierza J = 106 mm pod mocowanie M12, odstęp między otworami C = 38 mm. Długość całkowita L = 106,5 mm, dwa smarowniki G 2×M20, nośność dynamiczna Cdyn = 48,8 kN, statyczna Co = 35,3 kN, masa 3,81 kg. System uszczelnienia — dwuwargowy uszczelniacz stykowy od strony talerza polnego w połączeniu z metalowym deflektorem brudu od strony czołowej, zaprojektowany do pracy w warunkach wysokich obciążeń ściernych i udarowych. Bezpośredni odpowiednik HORSCH 28071300, 28077800, 28077900, 28085600 i PN60041; montowany w talerzowych redlicach i talerzach kultywatorów HORSCH serii Focus i Joker.',
                'meta_title_pl' => 'VELNOX 28071300 VX — węzeł piasty HORSCH d55.7, Focus/Joker',
                'meta_desc_pl'  => 'Węzeł piasty VELNOX 28071300 VX do HORSCH, d=55,7 mm, D=127,3 mm, Cdyn 48,8 kN. Zamiennik HORSCH 28071300, 28077800, 28085600, PN60041.',
            ],
        ];

        // product_assets for hubs-t1 (schema_png, schema_svg, gallery)
        $ht1AssetBase = '/velnox/images/products/hubs-t1';
        $ht1ArticleSlug = '28071300-vx';
        foreach ([
            ['type' => 'schema_png', 'path' => "{$ht1AssetBase}/velnox-{$ht1ArticleSlug}-schema.webp", 'sort_order' => 0],
            ['type' => 'schema_svg', 'path' => "{$ht1AssetBase}/schema.svg",                           'sort_order' => 0],
            // sort 1-2 зайняті студійними фото на рівні product (див. цикл $ht1Products нижче)
            ['type' => 'gallery',    'path' => "{$ht1AssetBase}/velnox-{$ht1ArticleSlug}.webp",         'sort_order' => 3],
            ['type' => 'gallery',    'path' => "{$ht1AssetBase}/velnox-{$ht1ArticleSlug}-drawing-1.webp",'sort_order' => 4],
            ['type' => 'gallery',    'path' => "{$ht1AssetBase}/velnox-{$ht1ArticleSlug}-drawing-2.webp",'sort_order' => 5],
            ['type' => 'gallery',    'path' => "{$ht1AssetBase}/velnox-{$ht1ArticleSlug}-drawing-3.webp",'sort_order' => 6],
        ] as $asset) {
            if ($asset['type'] === 'gallery') {
                // gallery: кілька рядків на таблицю, ключ включає path — інакше sort_order
                // наявних рядків не оновлюється і нові фото стають у випадкове місце
                DB::table('product_assets')->updateOrInsert(
                    ['entity_type' => 'product_table', 'entity_id' => $ht1, 'type' => 'gallery', 'path' => $asset['path']],
                    ['sort_order' => $asset['sort_order']]
                );
            } else {
                DB::table('product_assets')->updateOrInsert(
                    ['entity_type' => 'product_table', 'entity_id' => $ht1, 'type' => $asset['type']],
                    ['path' => $asset['path'], 'sort_order' => $asset['sort_order']]
                );
            }
        }

        foreach ($ht1Products as $p) {
            DB::table('products')->updateOrInsert(
                ['slug' => $p['slug']],
                ['slug' => $p['slug'], 'article' => $p['article'], 'product_table_id' => $ht1]
            );
            $productId = DB::table('products')->where('slug', $p['slug'])->value('id');

            foreach ($p['specs'] as $key => $value) {
                $sid = $specId($key);
                if (!$sid) continue;
                DB::table('product_specs')->updateOrInsert(
                    ['product_id' => $productId, 'spec_id' => $sid],
                    ['value' => $value]
                );
            }

            DB::table('product_cross_refs')->where('product_id', $productId)->delete();
            foreach ($p['cross_refs'] as $ref) {
                DB::table('product_cross_refs')->insert([
                    'product_id' => $productId,
                    'brand'      => $ref['brand'],
                    'value'      => $ref['value'],
                    'type'       => $ref['type'],
                ]);
            }

            // студійні фото (sort 1-2) — головне фото + креслення лежать на рівні
            // product_table із sort 3-6, тож у галереї фото йдуть першими
            for ($i = 1; $i <= 2; $i++) {
                DB::table('product_assets')->updateOrInsert(
                    [
                        'entity_type' => 'product', 'entity_id' => $productId, 'type' => 'gallery',
                        'path' => "{$ht1AssetBase}/velnox-{$ht1ArticleSlug}-photo-{$i}.webp",
                    ],
                    ['sort_order' => $i]
                );
            }

            foreach (['uk', 'en', 'pl'] as $locale) {
                DB::table('translations')->updateOrInsert(
                    ['entity_type' => 'product', 'entity_id' => $productId, 'locale' => $locale, 'field' => 'name'],
                    ['value' => $p["name_{$locale}"]]
                );
            }
            foreach (['uk', 'en', 'pl'] as $locale) {
                foreach (['desc' => 'desc', 'meta_title' => 'meta_title', 'meta_desc' => 'meta_description'] as $suffix => $field) {
                    $val = $p["{$suffix}_{$locale}"] ?? null;
                    if ($val) {
                        DB::table('translations')->updateOrInsert(
                            ['entity_type' => 'product', 'entity_id' => $productId, 'locale' => $locale, 'field' => $field],
                            ['value' => $val]
                        );
                    }
                }
            }
        }

        // =========================================================
        // 17. PRODUCT TABLE: hubs-t2
        // =========================================================
        DB::table('product_tables')->updateOrInsert(
            ['slug' => 'hubs-t2'],
            [
                'slug'             => 'hubs-t2',
                'category_id'      => $hubsCatId,
                'spec_columns'     => json_encode(['hub_J_mm', 'hub_D_mm', 'hub_hole_thread', 'hub_D1_mm', 'hub_C_mm', 'hub_M_thread', 'hub_L_mm', 'hub_L1_mm', 'hub_E_mm', 'hub_F_mm', 'mass_kg', 'cdyn_kn', 'co_kn', 'pu_kn']),
                'highlight_config' => json_encode([
                    'hub_J_mm'        => [['label' => 'J',   'x' => 497,  'y' => 2220]],
                    'hub_D_mm'        => [['label' => 'D',   'x' => 1600, 'y' => 2274]],
                    'hub_hole_thread' => [['label' => 'H/T', 'x' => 497,  'y' => 1825]],
                    'hub_M_thread'    => [['label' => 'M',   'x' => 878,  'y' => 2269]],
                    'hub_L_mm'        => [['label' => 'L',   'x' => 1269, 'y' => 1815]],
                    'hub_L1_mm'       => [['label' => 'L1',  'x' => 1351, 'y' => 1885]],
                    'hub_E_mm'        => [['label' => 'E',   'x' => 1147, 'y' => 1887]],
                    'hub_F_mm'        => [['label' => 'F',   'x' => 1031, 'y' => 1888]],
                ]),
                'schema_viewbox'   => '67 1478 2409 1734',
                'sort_order'       => 2,
            ]
        );

        $ht2 = $tableId('hubs-t2');

        foreach (['uk' => 'Ступичний вузол ріжучих вузлів — Таблиця 2', 'en' => 'Cutting Node Hub Unit — Table 2', 'pl' => 'Węzeł piasty węzłów tnących — Tabela 2'] as $locale => $name) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $ht2, 'locale' => $locale, 'field' => 'name'],
                ['value' => $name]
            );
        }

        $ht2Products = [
            [
                'article' => 'BAA-0004 VX',
                'slug'    => 'baa-0004-vx',
                'specs'   => [
                    'hub_J_mm'        => '98',
                    'hub_D_mm'        => '117',
                    'hub_hole_thread' => '4xM12x1.25',
                    'hub_D1_mm'       => '27.95',
                    'hub_C_mm'        => '25.4',
                    'hub_M_thread'    => 'M22x1.5',
                    'hub_L_mm'        => '102',
                    'hub_L1_mm'       => '60',
                    'hub_E_mm'        => '17',
                    'hub_F_mm'        => '25',
                    'mass_kg'         => '2.16',
                    'cdyn_kn'         => '42.9',
                    'co_kn'           => '36.3',
                    'pu_kn'           => '1.53',
                ],
                'cross_refs' => [
                    ['brand' => 'ХАРП', 'value' => '8395.TDA.5.05.015',    'type' => 'bearing'],
                    ['brand' => 'SKF',  'value' => 'AGHU2898X4E-DSCS',     'type' => 'bearing'],
                    ['brand' => 'NSK',  'value' => 'AHU28117A-01',          'type' => 'bearing'],
                    ['brand' => 'SKF',  'value' => 'BAA 0004',              'type' => 'bearing'],
                    ['brand' => 'FBJ',  'value' => 'BAA 0004 (SAH0004)',    'type' => 'bearing'],
                    ['brand' => 'INA',  'value' => 'F-673270.04.TILL',      'type' => 'bearing'],
                    ['brand' => 'PEER', 'value' => 'HUB 30мм ASSY (47661)', 'type' => 'bearing'],
                    ['brand' => 'PEER', 'value' => 'HUB-30Мм-X-ASSY-A221', 'type' => 'bearing'],
                    ['brand' => 'FKL',  'value' => 'IL-117-M22',            'type' => 'bearing'],
                    ['brand' => 'RBF',  'value' => 'PN 60014',              'type' => 'bearing'],
                    ['brand' => 'Holmer',     'value' => '1000042983',    'type' => 'application'],
                    ['brand' => 'Köckerling', 'value' => '642668',         'type' => 'application'],
                    ['brand' => 'Köckerling', 'value' => '910974',         'type' => 'application'],
                    ['brand' => '',           'value' => 'BAA 0004',       'type' => 'application'],
                    ['brand' => 'Gaspardo',   'value' => 'F06160015',      'type' => 'application'],
                    ['brand' => '',           'value' => 'IL40-98/4T-M22', 'type' => 'application'],
                    ['brand' => '',           'value' => 'Il50-98/4t-m22', 'type' => 'application'],
                    ['brand' => 'BEDNAR',     'value' => 'KM040110',       'type' => 'application'],
                    ['brand' => 'Farmet',     'value' => 'M11308',         'type' => 'application'],
                    ['brand' => 'RBF',        'value' => 'PN60014',        'type' => 'application'],
                    ['brand' => 'GASPARDO',   'value' => 'R18125110R',     'type' => 'application'],
                ],
                'name_uk'       => 'BAA-0004 VX',
                'name_en'       => 'BAA-0004 VX',
                'name_pl'       => 'BAA-0004 VX',
                'desc_uk'       => 'Компактна підшипникова маточина різального вузла з D-подібним отвором вала та 4 кріпильними отворами M12×1.25 на ділильному колі J = 98 мм; зовнішній діаметр корпусу 117 мм — геометричний аналог вузлів типу SKF BAA 0004 / INA F-673270.04.TILL. Посадковий діаметр вала D1 = 27.95 мм, розмір D-подібного пазу C = 25.4 мм, зовнішня різьба M22×1.5, загальна довжина L = 102 мм; динамічна вантажопідйомність Cdyn = 42.9 кН, статична Co = 36.3 кН, маса 2.16 кг. Маточина оснащена подвійним контактним ущільненням (тип DSCS / TILL) з обох сторін, розрахованим на роботу в абразивному агресивному середовищі ґрунтообробних операцій. Виступає прямою заміною OEM-вузлів Köckerling (642668, 910974), Bednar (KM040110), Gaspardo (F06160015, R18125110R) та Farmet (M11308); несучі аналоги: SKF BAA 0004, NSK AHU28117A-01, INA F-673270.04.TILL, ХАРП 8395.TDA.5.05.015.',
                'meta_title_uk' => 'VELNOX BAA-0004 VX — маточина різального вузла J98, SKF BAA 0004, INA F-673270',
                'meta_desc_uk'  => 'Підшипникова маточина VELNOX BAA-0004 VX, D1=27.95 мм, J=98 мм, Cdyn 42.9 кН. Заміна SKF BAA 0004, INA F-673270.04.TILL, Köckerling 642668, Bednar KM040110.',
                'desc_en'       => 'Compact bearing hub for cutting-node assemblies with a D-shaped shaft bore and 4 mounting holes M12×1.25 on bolt circle J = 98 mm; outer housing diameter 117 mm — geometric equivalent of SKF BAA 0004 / INA F-673270.04.TILL. Shaft bore D1 = 27.95 mm, D-shaped slot C = 25.4 mm, external thread M22×1.5, overall length L = 102 mm; dynamic load capacity Cdyn = 42.9 kN, static Co = 36.3 kN, weight 2.16 kg. The hub features double contact sealing (DSCS / TILL type) on both sides, designed for operation in abrasive soil-tillage conditions. Direct replacement for OEM units Köckerling (642668, 910974), Bednar (KM040110), Gaspardo (F06160015, R18125110R) and Farmet (M11308); bearing equivalents: SKF BAA 0004, NSK AHU28117A-01, INA F-673270.04.TILL.',
                'meta_title_en' => 'VELNOX BAA-0004 VX — cutting node hub J98, SKF BAA 0004, INA F-673270',
                'meta_desc_en'  => 'VELNOX BAA-0004 VX bearing hub, D1=27.95 mm, J=98 mm, Cdyn 42.9 kN. Replaces SKF BAA 0004, INA F-673270.04.TILL, Köckerling 642668, Bednar KM040110.',
                'desc_pl'       => 'Kompaktowy węzeł łożyskowy piasty elementu tnącego z otworem wałka w kształcie litery D i 4 otworami mocującymi M12×1.25 na kole podziałowym J = 98 mm; zewnętrzna średnica obudowy 117 mm — geometryczny odpowiednik SKF BAA 0004 / INA F-673270.04.TILL. Średnica otworu wału D1 = 27,95 mm, wymiar rowka D C = 25,4 mm, gwint zewnętrzny M22×1.5, długość całkowita L = 102 mm; nośność dynamiczna Cdyn = 42,9 kN, statyczna Co = 36,3 kN, masa 2,16 kg. Piasta wyposażona jest w podwójne uszczelnienie stykowe (typ DSCS / TILL) po obu stronach, przeznaczone do pracy w ściernym środowisku uprawy gleby. Bezpośredni zamiennik węzłów OEM Köckerling (642668, 910974), Bednar (KM040110), Gaspardo (F06160015, R18125110R) i Farmet (M11308); analogii łożyskowe: SKF BAA 0004, NSK AHU28117A-01, INA F-673270.04.TILL.',
                'meta_title_pl' => 'VELNOX BAA-0004 VX — piasta węzła tnącego J98, SKF BAA 0004, INA F-673270',
                'meta_desc_pl'  => 'Piasta łożyskowa VELNOX BAA-0004 VX, D1=27,95 mm, J=98 mm, Cdyn 42,9 kN. Zamiennik SKF BAA 0004, INA F-673270.04.TILL, Köckerling 642668, Bednar KM040110.',
            ],
        ];

        // product_assets for hubs-t2 (schema_png, schema_svg тільки — gallery тепер на рівні product)
        // Прибрати старі gallery-рядки рівня product_table — інакше головне фото і креслення
        // дублюються в галереї (лишились у БД після b30529c).
        DB::table('product_assets')
            ->where('entity_type', 'product_table')->where('entity_id', $ht2)
            ->where('type', 'gallery')->delete();
        $ht2AssetBase    = '/velnox/images/products/hubs-t2';
        $ht2ArticleSlug  = 'baa-0004-vx';
        foreach ([
            ['type' => 'schema_png', 'path' => "{$ht2AssetBase}/velnox-{$ht2ArticleSlug}-schema.webp", 'sort_order' => 0],
            ['type' => 'schema_svg', 'path' => "{$ht2AssetBase}/schema.svg",                            'sort_order' => 0],
        ] as $asset) {
            DB::table('product_assets')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $ht2, 'type' => $asset['type']],
                ['path' => $asset['path'], 'sort_order' => $asset['sort_order']]
            );
        }

        // =========================================================
        // 18. PRODUCT TABLE: hubs-t3
        // =========================================================
        DB::table('product_tables')->updateOrInsert(
            ['slug' => 'hubs-t3'],
            [
                'slug'             => 'hubs-t3',
                'category_id'      => $hubsCatId,
                'spec_columns'     => json_encode(['hub_J_mm', 'hub_D_mm', 'hub_D1_mm', 'hub_d_mm', 'hub_hole_thread', 'hub_L_mm', 'hub_B_mm', 'mass_kg', 'cdyn_kn', 'co_kn', 'pu_kn']),
                'highlight_config' => json_encode([
                    'hub_J_mm'        => [['label' => 'J',   'x' => 613,  'y' => 897]],
                    'hub_D_mm'        => [['label' => 'D',   'x' => 1079, 'y' => 940]],
                    'hub_D1_mm'       => [['label' => 'D1',  'x' => 1140, 'y' => 942]],
                    'hub_d_mm'        => [['label' => 'd',   'x' => 1197, 'y' => 942]],
                    'hub_hole_thread' => [['label' => 'H/T', 'x' => 578,  'y' => 440]],
                    'hub_B_mm'        => [['label' => 'B',   'x' => 1342, 'y' => 881]],
                ]),
                'schema_viewbox'   => '30 340 2420 1160',
                'sort_order'       => 3,
            ]
        );

        $ht3 = $tableId('hubs-t3');

        foreach (['uk' => 'Ступичний вузол сівалок — Таблиця 3', 'en' => 'Seeder Hub Unit — Table 3', 'pl' => 'Węzeł piasty siewnika — Tabela 3'] as $locale => $name) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $ht3, 'locale' => $locale, 'field' => 'name'],
                ['value' => $name]
            );
        }

        $ht3Products = [
            [
                'article' => 'PL-140 VX',
                'slug'    => 'pl-140-vx',
                'specs'   => [
                    'hub_J_mm'        => '104',
                    'hub_D_mm'        => '140',
                    'hub_D1_mm'       => '62',
                    'hub_d_mm'        => '30',
                    'hub_hole_thread' => 'M12',
                    'hub_L_mm'        => '35',
                    'hub_B_mm'        => '23.8',
                    'mass_kg'         => '1.5',
                    'cdyn_kn'         => '31',
                    'co_kn'           => '22.2',
                    'pu_kn'           => '0.932',
                ],
                'cross_refs' => [
                    ['brand' => 'FKL',      'value' => 'PL-140', 'type' => 'bearing'],
                    ['brand' => 'FBJ',      'value' => 'SAH017', 'type' => 'bearing'],
                    ['brand' => '',         'value' => '405814', 'type' => 'application'],
                    ['brand' => '',         'value' => '418531', 'type' => 'application'],
                    ['brand' => '',         'value' => '420013', 'type' => 'application'],
                    ['brand' => 'Vaderstad','value' => '420832', 'type' => 'application'],
                ],
                'name_uk' => 'PL-140 VX',
                'name_en' => 'PL-140 VX',
                'name_pl' => 'PL-140 VX',
                'desc_uk'        => 'Інтегрована підшипникова маточина сівалки з 4 кріпильними отворами M12 на ділильному колі J = 104 мм та зовнішнім діаметром корпусу D = 140 мм — геометричний аналог вузлів типу FKL PL-140 / FBJ SAH017. Посадковий діаметр вала D1 = 62 мм, загальна довжина L = 35 мм, ширина B = 23.8 мм; динамічна вантажопідйомність Cdyn = 31 кН, статична Co = 22.2 кН, маса 1.5 кг. Вузол оснащений контактним ущільненням з обох сторін для захисту від ґрунтового забруднення та вологи в умовах роботи посівних агрегатів. Пряма заміна OEM-вузлів Vaderstad (420832, 405814, 418531, 420013) та аналогів FKL PL-140, FBJ SAH017; застосовується у сівалках Vaderstad серій Rapid, Spirit, Tempo.',
                'desc_en'        => 'Integrated seeder bearing hub with 4 M12 mounting holes on a bolt circle J = 104 mm and housing outer diameter D = 140 mm — geometric equivalent of FKL PL-140 / FBJ SAH017 assemblies. Shaft bore D1 = 62 mm, overall length L = 35 mm, width B = 23.8 mm; dynamic load rating Cdyn = 31 kN, static Co = 22.2 kN, mass 1.5 kg. The assembly is fitted with contact seals on both sides to protect against soil contamination and moisture in seeder operating conditions. Direct replacement for Vaderstad OEM assemblies (420832, 405814, 418531, 420013) and equivalents FKL PL-140, FBJ SAH017; used in Vaderstad Rapid, Spirit, Tempo series seeders.',
                'desc_pl'        => 'Zintegrowana piastka łożyskowa siewnika z 4 otworami mocującymi M12 na okręgu podziałowym J = 104 mm i zewnętrzną średnicą obudowy D = 140 mm — geometryczny odpowiednik węzłów FKL PL-140 / FBJ SAH017. Średnica osadzenia wałka D1 = 62 mm, długość całkowita L = 35 mm, szerokość B = 23,8 mm; nośność dynamiczna Cdyn = 31 kN, statyczna Co = 22,2 kN, masa 1,5 kg. Węzeł wyposażony jest w uszczelnienia kontaktowe z obu stron zapewniające ochronę przed zanieczyszczeniem glebowym i wilgocią w warunkach pracy agregatów siewnych. Bezpośredni zamiennik węzłów OEM Vaderstad (420832, 405814, 418531, 420013) oraz odpowiedników FKL PL-140, FBJ SAH017; stosowany w siewnikach Vaderstad serii Rapid, Spirit, Tempo.',
                'meta_title_uk'  => 'VELNOX PL-140 VX — маточина сівалки Vaderstad J104, FKL PL-140, SAH017',
                'meta_title_en'  => 'VELNOX PL-140 VX — seeder hub Vaderstad J104, FKL PL-140, SAH017',
                'meta_title_pl'  => 'VELNOX PL-140 VX — piasta siewnika Vaderstad J104, FKL PL-140, SAH017',
                'meta_desc_uk'   => 'Підшипникова маточина VELNOX PL-140 VX для Vaderstad, D1=62 мм, J=104 мм, Cdyn 31 кН. Заміна FKL PL-140, FBJ SAH017, Vaderstad 420832.',
                'meta_desc_en'   => 'VELNOX PL-140 VX bearing hub for Vaderstad, D1=62 mm, J=104 mm, Cdyn 31 kN. Replaces FKL PL-140, FBJ SAH017, Vaderstad 420832.',
                'meta_desc_pl'   => 'Piastka łożyskowa VELNOX PL-140 VX do Vaderstad, D1=62 mm, J=104 mm, Cdyn 31 kN. Zamiennik FKL PL-140, FBJ SAH017, Vaderstad 420832.',
            ],
        ];

        // product_assets for hubs-t3 (schema_png, schema_svg, gallery)
        $ht3AssetBase   = '/velnox/images/products/hubs-t3';
        $ht3ArticleSlug = 'pl-140-vx';
        foreach ([
            ['type' => 'schema_png', 'path' => "{$ht3AssetBase}/velnox-{$ht3ArticleSlug}-schema.webp", 'sort_order' => 0],
            ['type' => 'schema_svg', 'path' => "{$ht3AssetBase}/schema.svg",                            'sort_order' => 0],
            ['type' => 'gallery',    'path' => "{$ht3AssetBase}/velnox-{$ht3ArticleSlug}.webp",          'sort_order' => 1],
            ['type' => 'gallery',    'path' => "{$ht3AssetBase}/velnox-{$ht3ArticleSlug}-drawing-1.webp",'sort_order' => 2],
            ['type' => 'gallery',    'path' => "{$ht3AssetBase}/velnox-{$ht3ArticleSlug}-drawing-2.webp",'sort_order' => 3],
        ] as $asset) {
            if ($asset['type'] === 'gallery') {
                $exists = DB::table('product_assets')
                    ->where('entity_type', 'product_table')->where('entity_id', $ht3)
                    ->where('type', 'gallery')->where('path', $asset['path'])->exists();
                if (!$exists) {
                    DB::table('product_assets')->insert([
                        'entity_type' => 'product_table', 'entity_id' => $ht3,
                        'type' => $asset['type'], 'path' => $asset['path'], 'sort_order' => $asset['sort_order'],
                    ]);
                }
            } else {
                DB::table('product_assets')->updateOrInsert(
                    ['entity_type' => 'product_table', 'entity_id' => $ht3, 'type' => $asset['type']],
                    ['path' => $asset['path'], 'sort_order' => $asset['sort_order']]
                );
            }
        }

        foreach ($ht3Products as $p) {
            DB::table('products')->updateOrInsert(
                ['slug' => $p['slug']],
                ['slug' => $p['slug'], 'article' => $p['article'], 'product_table_id' => $ht3]
            );
            $productId = DB::table('products')->where('slug', $p['slug'])->value('id');

            foreach ($p['specs'] as $key => $value) {
                $sid = $specId($key);
                if (!$sid) continue;
                DB::table('product_specs')->updateOrInsert(
                    ['product_id' => $productId, 'spec_id' => $sid],
                    ['value' => $value]
                );
            }

            DB::table('product_cross_refs')->where('product_id', $productId)->delete();
            foreach ($p['cross_refs'] as $ref) {
                DB::table('product_cross_refs')->insert([
                    'product_id' => $productId,
                    'brand'      => $ref['brand'],
                    'value'      => $ref['value'],
                    'type'       => $ref['type'],
                ]);
            }

            // model_3d asset for PL-140 VX
            DB::table('product_assets')->updateOrInsert(
                ['entity_type' => 'product', 'entity_id' => $productId, 'type' => 'model_3d'],
                ['path' => '/velnox/models/pl-140-vx.glb', 'sort_order' => 0]
            );

            foreach (['uk', 'en', 'pl'] as $locale) {
                DB::table('translations')->updateOrInsert(
                    ['entity_type' => 'product', 'entity_id' => $productId, 'locale' => $locale, 'field' => 'name'],
                    ['value' => $p["name_{$locale}"]]
                );
            }

            foreach (['desc' => 'desc', 'meta_title' => 'meta_title', 'meta_desc' => 'meta_description'] as $suffix => $field) {
                foreach (['uk', 'en', 'pl'] as $locale) {
                    $key = "{$suffix}_{$locale}";
                    if (!empty($p[$key])) {
                        DB::table('translations')->updateOrInsert(
                            ['entity_type' => 'product', 'entity_id' => $productId, 'locale' => $locale, 'field' => $field],
                            ['value' => $p[$key]]
                        );
                    }
                }
            }
        }

        foreach ($ht2Products as $p) {
            DB::table('products')->updateOrInsert(
                ['slug' => $p['slug']],
                ['slug' => $p['slug'], 'article' => $p['article'], 'product_table_id' => $ht2]
            );
            $productId = DB::table('products')->where('slug', $p['slug'])->value('id');

            foreach ($p['specs'] as $key => $value) {
                $sid = $specId($key);
                if (!$sid) continue;
                DB::table('product_specs')->updateOrInsert(
                    ['product_id' => $productId, 'spec_id' => $sid],
                    ['value' => $value]
                );
            }

            DB::table('product_cross_refs')->where('product_id', $productId)->delete();
            foreach ($p['cross_refs'] as $ref) {
                DB::table('product_cross_refs')->insert([
                    'product_id' => $productId,
                    'brand'      => $ref['brand'],
                    'value'      => $ref['value'],
                    'type'       => $ref['type'],
                ]);
            }

            // model_3d asset for BAA-0004 VX
            DB::table('product_assets')->updateOrInsert(
                ['entity_type' => 'product', 'entity_id' => $productId, 'type' => 'model_3d'],
                ['path' => '/velnox/models/baa-0004-vx.glb', 'sort_order' => 0]
            );

            // gallery (entity_type='product'): нові фото спочатку, потім старе фото + креслення
            foreach ([
                ['path' => '/velnox/images/products/hubs-t2/velnox-baa-0004-vx-photo-1.webp',  'sort_order' => 0],
                ['path' => '/velnox/images/products/hubs-t2/velnox-baa-0004-vx-photo-2.webp',  'sort_order' => 1],
                ['path' => '/velnox/images/products/hubs-t2/velnox-baa-0004-vx-photo-3.webp',  'sort_order' => 2],
                ['path' => '/velnox/images/products/hubs-t2/velnox-baa-0004-vx-photo-4.webp',  'sort_order' => 3],
                ['path' => '/velnox/images/products/hubs-t2/velnox-baa-0004-vx-photo-5.webp',  'sort_order' => 4],
                ['path' => '/velnox/images/products/hubs-t2/velnox-baa-0004-vx-photo-6.webp',  'sort_order' => 5],
                ['path' => '/velnox/images/products/hubs-t2/velnox-baa-0004-vx-photo-7.webp',  'sort_order' => 6],
                ['path' => '/velnox/images/products/hubs-t2/velnox-baa-0004-vx.webp',           'sort_order' => 7],
                ['path' => '/velnox/images/products/hubs-t2/velnox-baa-0004-vx-drawing-1.webp', 'sort_order' => 8],
                ['path' => '/velnox/images/products/hubs-t2/velnox-baa-0004-vx-drawing-2.webp', 'sort_order' => 9],
                ['path' => '/velnox/images/products/hubs-t2/velnox-baa-0004-vx-drawing-3.webp', 'sort_order' => 10],
            ] as $img) {
                DB::table('product_assets')->updateOrInsert(
                    ['entity_type' => 'product', 'entity_id' => $productId, 'type' => 'gallery', 'path' => $img['path']],
                    ['sort_order' => $img['sort_order']]
                );
            }

            foreach (['uk', 'en', 'pl'] as $locale) {
                DB::table('translations')->updateOrInsert(
                    ['entity_type' => 'product', 'entity_id' => $productId, 'locale' => $locale, 'field' => 'name'],
                    ['value' => $p["name_{$locale}"]]
                );
            }

            foreach (['desc' => 'desc', 'meta_title' => 'meta_title', 'meta_desc' => 'meta_description'] as $suffix => $field) {
                foreach (['uk', 'en', 'pl'] as $locale) {
                    $key = "{$suffix}_{$locale}";
                    if (!empty($p[$key])) {
                        DB::table('translations')->updateOrInsert(
                            ['entity_type' => 'product', 'entity_id' => $productId, 'locale' => $locale, 'field' => $field],
                            ['value' => $p[$key]]
                        );
                    }
                }
            }
        }

        // =========================================================
        // 19. PRODUCT TABLE: agro-t1 (Series 1726 / Special Agro Bearings)
        // =========================================================
        DB::table('product_tables')->updateOrInsert(
            ['slug' => 'agro-t1'],
            [
                'slug'             => 'agro-t1',
                'category_id'      => $catId('agro'),
                'spec_columns'     => json_encode(['d_mm','D_mm','B_mm','d1_mm','r_12_mm','cdyn_kn','co_kn','pu_kn','mass_kg']),
                'highlight_config' => json_encode([
                    'd_mm'    => [['label' => 'd',  'x' => 297,  'y' => 829]],
                    'D_mm'    => [['label' => 'D',  'x' => 246,  'y' => 833]],
                    'B_mm'    => [['label' => 'B',  'x' => 1256, 'y' => 422]],
                    'd1_mm'   => [['label' => 'd1', 'x' => 1129, 'y' => 832]],
                    'r_12_mm' => [['label' => 'r1', 'x' => 1368, 'y' => 613], ['label' => 'r2', 'x' => 1309, 'y' => 662]],
                ]),
                'schema_viewbox'   => '0 0 2480 1900',
                'sort_order'       => 1,
            ]
        );

        $at1 = DB::table('product_tables')->where('slug', 'agro-t1')->value('id');

        foreach (['uk' => 'Серія 1726 — спеціальні агропідшипники', 'en' => 'Series 1726 — Special Agro Bearings', 'pl' => 'Seria 1726 — specjalne łożyska agro'] as $locale => $name) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $at1, 'locale' => $locale, 'field' => 'name'],
                ['value' => $name]
            );
        }

        // product_assets for agro-t1 (schema_png, schema_svg at table level)
        DB::table('product_assets')->updateOrInsert(
            ['entity_type' => 'product_table', 'entity_id' => $at1, 'type' => 'schema_png'],
            ['path' => '/velnox/images/products/agro-t1/velnox-agro-t1-schema.webp', 'sort_order' => 0]
        );
        DB::table('product_assets')->updateOrInsert(
            ['entity_type' => 'product_table', 'entity_id' => $at1, 'type' => 'schema_svg'],
            ['path' => '/velnox/images/products/agro-t1/schema.svg', 'sort_order' => 0]
        );

        $at1Products = [
            [
                'article'  => '1726206-2RS1 VX',
                'slug'     => '1726206-2rs1-vx',
                'model_3d' => '1726206-2RS1.glb',
                'specs'   => ['d_mm'=>'30','D_mm'=>'62','B_mm'=>'16','d1_mm'=>'39.7','r_12_mm'=>'1','cdyn_kn'=>'19.5','co_kn'=>'11.2','pu_kn'=>'0.48','mass_kg'=>'0.18'],
                'cross_refs' => [
                    ['brand'=>'TIMKEN',     'value'=>'1726206 2RS',   'type'=>'bearing'],
                    ['brand'=>'NSK-RHP',    'value'=>'1726206 2RS',   'type'=>'bearing'],
                    ['brand'=>'SKF',        'value'=>'1726206 2RS1',  'type'=>'bearing'],
                    ['brand'=>'INA',        'value'=>'206 NPPB',      'type'=>'bearing'],
                    ['brand'=>'SKF',        'value'=>'XG206NPPB',     'type'=>'bearing'],
                    ['brand'=>'SNR',        'value'=>'6206 S EE',     'type'=>'bearing'],
                    ['brand'=>'NTE',        'value'=>'CS 206 2RS',    'type'=>'bearing'],
                    ['brand'=>'FBJ',        'value'=>'CS 206 2RS',    'type'=>'bearing'],
                    ['brand'=>'ZKL',        'value'=>'UD 206',        'type'=>'bearing'],
                    ['brand'=>'Dominoni',   'value'=>'10330',         'type'=>'application'],
                    ['brand'=>'CLAAS',      'value'=>'211156.0',      'type'=>'application'],
                    ['brand'=>'Rauch',      'value'=>'2152620',       'type'=>'application'],
                    ['brand'=>'KUHN',       'value'=>'81023064',      'type'=>'application'],
                    ['brand'=>'AGCO',       'value'=>'831087M1',      'type'=>'application'],
                    ['brand'=>'JD',         'value'=>'JD10386',       'type'=>'application'],
                    ['brand'=>'Capello',    'value'=>'PMS-000005',    'type'=>'application'],
                    ['brand'=>'Kverneland', 'value'=>'VF06215766',    'type'=>'application'],
                    ['brand'=>'KUHN',       'value'=>'YP800030',      'type'=>'application'],
                ],
                'name_uk'=>'1726206-2RS1 VX','name_en'=>'1726206-2RS1 VX','name_pl'=>'1726206-2RS1 VX',
                'desc_uk'       => 'Радіальний кульковий підшипник серії 1726 (тип 206) з розширеним внутрішнім кільцем діаметром d₁ = 39.7 мм — стандартний формат для монтажних вузлів сільськогосподарської техніки. Посадковий діаметр d = 30 мм, зовнішній D = 62 мм, ширина внутрішнього кільця B = 16 мм; динамічна вантажопідйомність — 19.5 кН, статична — 11.2 кН. Симетричне двостороннє контактне ущільнення 2RS1 утримує мастило та захищає зону кочення від ґрунтових частинок і вологи. Замінює SKF 1726206-2RS1, INA 206 NPPB, TIMKEN 1726206 2RS, SNR 6206 S EE; встановлюється в оригінальні вузли CLAAS (211156.0), KUHN (81023064, YP800030), John Deere (JD10386) та Kverneland (VF06215766).',
                'meta_title_uk' => 'VELNOX 1726206-2RS1 VX — d30 мм, SKF 1726206-2RS1, CLAAS 211156.0',
                'meta_desc_uk'  => 'Підшипник VELNOX 1726206-2RS1 VX, серія 1726: d=30 мм, D=62 мм, Cdyn 19.5 кН, 2RS1. Аналог SKF 1726206-2RS1, INA 206 NPPB. OEM: CLAAS 211156.0, KUHN 81023064.',
                'desc_en'       => 'Radial ball bearing of the 1726 series (type 206) with an extended inner ring (shoulder diameter d₁ = 39.7 mm), a standard format for mounting assemblies in agricultural equipment. Bore diameter d = 30 mm, outer diameter D = 62 mm, inner ring width B = 16 mm; dynamic load rating — 19.5 kN, static — 11.2 kN. Symmetric double-sided contact seal 2RS1 retains grease and isolates the raceway from soil particles and moisture. Direct replacement for SKF 1726206-2RS1, INA 206 NPPB, TIMKEN 1726206 2RS, SNR 6206 S EE; fits OEM assemblies of CLAAS (211156.0), KUHN (81023064, YP800030), John Deere (JD10386) and Kverneland (VF06215766).',
                'meta_title_en' => 'VELNOX 1726206-2RS1 VX — d30 mm, SKF 1726206-2RS1, CLAAS 211156.0',
                'meta_desc_en'  => 'VELNOX 1726206-2RS1 VX bearing, 1726 series: d=30 mm, D=62 mm, Cdyn 19.5 kN, 2RS1. Replaces SKF 1726206-2RS1, INA 206 NPPB. OEM: CLAAS 211156.0, KUHN 81023064.',
                'desc_pl'       => 'Promieniowe łożysko kulkowe serii 1726 (typ 206) z poszerzonym pierścieniem wewnętrznym (średnica oporowa d₁ = 39,7 mm) — standardowy wymiar dla węzłów montażowych maszyn rolniczych. Średnica otworu d = 30 mm, zewnętrzna D = 62 mm, szerokość pierścienia wewnętrznego B = 16 mm; nośność dynamiczna — 19,5 kN, statyczna — 11,2 kN. Symetryczne dwustronne uszczelnienie kontaktowe 2RS1 utrzymuje smar i chroni tor toczny przed cząstkami gleby i wilgocią. Zamiennik SKF 1726206-2RS1, INA 206 NPPB, TIMKEN 1726206 2RS, SNR 6206 S EE; pasuje do węzłów OEM CLAAS (211156.0), KUHN (81023064, YP800030), John Deere (JD10386) i Kverneland (VF06215766).',
                'meta_title_pl' => 'VELNOX 1726206-2RS1 VX — d30 mm, SKF 1726206-2RS1, CLAAS 211156.0',
                'meta_desc_pl'  => 'Łożysko VELNOX 1726206-2RS1 VX, seria 1726: d=30 mm, D=62 mm, Cdyn 19,5 kN, 2RS1. Zamiennik SKF 1726206-2RS1, INA 206 NPPB. OEM: CLAAS 211156.0, KUHN 81023064.',
            ],
            [
                'article'  => '1726207-2RS1 VX',
                'slug'     => '1726207-2rs1-vx',
                'model_3d' => '1726207-2RS1.glb',
                'specs'   => ['d_mm'=>'35','D_mm'=>'72','B_mm'=>'17','d1_mm'=>'46.1','r_12_mm'=>'1','cdyn_kn'=>'25.5','co_kn'=>'15.3','pu_kn'=>'0.25','mass_kg'=>'0.66'],
                'cross_refs' => [
                    ['brand'=>'TIMKEN',  'value'=>'1726207 2RS',   'type'=>'bearing'],
                    ['brand'=>'NSK-RHP', 'value'=>'1726207 2RS',   'type'=>'bearing'],
                    ['brand'=>'SKF',     'value'=>'1726207 2RS1',  'type'=>'bearing'],
                    ['brand'=>'INA',     'value'=>'207 NPPB',      'type'=>'bearing'],
                    ['brand'=>'SKF',     'value'=>'XG207NPPB',     'type'=>'bearing'],
                    ['brand'=>'SNR',     'value'=>'6207 SEE',      'type'=>'bearing'],
                    ['brand'=>'FBJ',     'value'=>'CS 207 2 RS',   'type'=>'bearing'],
                    ['brand'=>'INA',     'value'=>'G207-XL-NPPB',  'type'=>'bearing'],
                    ['brand'=>'Capello', 'value'=>'03.2026.00',    'type'=>'application'],
                    ['brand'=>'Ziegler', 'value'=>'12-058340',     'type'=>'application'],
                    ['brand'=>'CASE',    'value'=>'1407629R91',    'type'=>'application'],
                    ['brand'=>'CASE',    'value'=>'3166063R91',    'type'=>'application'],
                    ['brand'=>'MONOSEM', 'value'=>'4655.1',        'type'=>'application'],
                    ['brand'=>'Kuhn',    'value'=>'81043576',      'type'=>'application'],
                    ['brand'=>'MF',      'value'=>'831822M1',      'type'=>'application'],
                    ['brand'=>'',        'value'=>'B96.00264',     'type'=>'application'],
                ],
                'name_uk'=>'1726207-2RS1 VX','name_en'=>'1726207-2RS1 VX','name_pl'=>'1726207-2RS1 VX',
                'desc_uk'       => 'Радіальний кульковий підшипник серії 1726 (тип 207) з розширеним внутрішнім кільцем (d₁ = 46.1 мм) для вузлів посівної та ґрунтообробної техніки середнього типорозміру. Посадковий діаметр d = 35 мм, зовнішній D = 72 мм, ширина внутрішнього кільця B = 17 мм; динамічна вантажопідйомність — 25.5 кН, статична — 15.3 кН. Герметизація виконана двостороннім контактним ущільненням 2RS1 — гумові манжети з обох сторін ефективно блокують проникнення ґрунтових частинок. Аналог SKF 1726207-2RS1, INA G207-XL-NPPB, TIMKEN 1726207 2RS, SNR 6207 SEE; входить до вузлів сівалок MONOSEM (4655.1), Kuhn (81043576), CASE (1407629R91, 3166063R91) та Capello (03.2026.00).',
                'meta_title_uk' => 'VELNOX 1726207-2RS1 VX — d35 мм, SKF 1726207-2RS1, MONOSEM 4655.1',
                'meta_desc_uk'  => 'Підшипник VELNOX 1726207-2RS1 VX: d=35 мм, D=72 мм, Cdyn 25.5 кН, 2RS1. Аналог SKF 1726207-2RS1, INA G207-XL-NPPB. OEM: MONOSEM 4655.1, CASE 1407629R91.',
                'desc_en'       => 'Radial ball bearing of the 1726 series (type 207) with an extended inner ring (d₁ = 46.1 mm) for medium-size assemblies in seeder and tillage equipment. Bore diameter d = 35 mm, outer diameter D = 72 mm, inner ring width B = 17 mm; dynamic load rating — 25.5 kN, static — 15.3 kN. Double-sided contact seal 2RS1 — rubber lip on both sides — effectively blocks ingress of soil particles. Interchangeable with SKF 1726207-2RS1, INA G207-XL-NPPB, TIMKEN 1726207 2RS, SNR 6207 SEE; used in OEM assemblies of MONOSEM seeders (4655.1), Kuhn (81043576), CASE (1407629R91, 3166063R91) and Capello harvesters (03.2026.00).',
                'meta_title_en' => 'VELNOX 1726207-2RS1 VX — d35 mm, SKF 1726207-2RS1, MONOSEM 4655.1',
                'meta_desc_en'  => 'VELNOX 1726207-2RS1 VX bearing: d=35 mm, D=72 mm, Cdyn 25.5 kN, 2RS1. Replaces SKF 1726207-2RS1, INA G207-XL-NPPB. OEM: MONOSEM 4655.1, CASE 1407629R91.',
                'desc_pl'       => 'Promieniowe łożysko kulkowe serii 1726 (typ 207) z poszerzonym pierścieniem wewnętrznym (d₁ = 46,1 mm) do węzłów siewników i uprawiaków średniego rozmiaru. Średnica otworu d = 35 mm, zewnętrzna D = 72 mm, szerokość pierścienia wewnętrznego B = 17 mm; nośność dynamiczna — 25,5 kN, statyczna — 15,3 kN. Uszczelnienie dwustronne kontaktowe 2RS1 — gumowe wargowe z obu stron — skutecznie blokuje wnikanie cząstek glebowych. Zamiennik SKF 1726207-2RS1, INA G207-XL-NPPB, TIMKEN 1726207 2RS, SNR 6207 SEE; stosowany w siewnikach MONOSEM (4655.1), Kuhn (81043576), CASE (1407629R91, 3166063R91) i kombajnach Capello (03.2026.00).',
                'meta_title_pl' => 'VELNOX 1726207-2RS1 VX — d35 mm, SKF 1726207-2RS1, MONOSEM 4655.1',
                'meta_desc_pl'  => 'Łożysko VELNOX 1726207-2RS1 VX: d=35 mm, D=72 mm, Cdyn 25,5 kN, 2RS1. Zamiennik SKF 1726207-2RS1, INA G207-XL-NPPB. OEM: MONOSEM 4655.1, CASE 1407629R91.',
            ],
            [
                'article'  => '1726208-2RS1 VX',
                'slug'     => '1726208-2rs1-vx',
                'model_3d' => '1726208-2RS1.glb',
                'specs'   => ['d_mm'=>'40','D_mm'=>'80','B_mm'=>'18','d1_mm'=>'52','r_12_mm'=>'1.1','cdyn_kn'=>'30.7','co_kn'=>'19','pu_kn'=>'0.8','mass_kg'=>'0.32'],
                'cross_refs' => [
                    ['brand'=>'TIMKEN',     'value'=>'1726208 2RS',    'type'=>'bearing'],
                    ['brand'=>'SKF',        'value'=>'1726208 2RS1',   'type'=>'bearing'],
                    ['brand'=>'SKF',        'value'=>'XG208NPPB',      'type'=>'bearing'],
                    ['brand'=>'SNR',        'value'=>'6208 S EE',      'type'=>'bearing'],
                    ['brand'=>'FBJ',        'value'=>'CS 208 2RS',     'type'=>'bearing'],
                    ['brand'=>'INA',        'value'=>'G208-XL-NPPB',   'type'=>'bearing'],
                    ['brand'=>'ZKL',        'value'=>'UD 208',         'type'=>'bearing'],
                    ['brand'=>'Geringhoff', 'value'=>'025292',         'type'=>'application'],
                    ['brand'=>'Geringhoff', 'value'=>'025293',         'type'=>'application'],
                    ['brand'=>'Monosem',    'value'=>'30161042',       'type'=>'application'],
                    ['brand'=>'Monosem',    'value'=>'4655.1A',        'type'=>'application'],
                    ['brand'=>'LUK',        'value'=>'730004600',      'type'=>'application'],
                    ['brand'=>'JD',         'value'=>'AZ23315',        'type'=>'application'],
                    ['brand'=>'GASPARDO',   'value'=>'F04010184',      'type'=>'application'],
                ],
                'name_uk'=>'1726208-2RS1 VX','name_en'=>'1726208-2RS1 VX','name_pl'=>'1726208-2RS1 VX',
                'desc_uk'       => 'Радіальний кульковий підшипник серії 1726 (тип 208) з розширеним внутрішнім кільцем (d₁ = 52 мм) для навантажених вузлів жатних апаратів і сівалкових механізмів. Посадковий діаметр d = 40 мм, зовнішній D = 80 мм, ширина внутрішнього кільця B = 18 мм; динамічна вантажопідйомність — 30.7 кН, статична — 19.0 кН. Захист від абразивних частинок і вологи забезпечується симетричним контактним ущільненням 2RS1 з обох сторін. Прямий аналог SKF 1726208-2RS1, INA G208-XL-NPPB, TIMKEN 1726208 2RS, ZKL UD 208; замінює OEM-деталі жаток Geringhoff (025292, 025293), сівалок Monosem (4655.1A), John Deere (AZ23315) та Gaspardo (F04010184).',
                'meta_title_uk' => 'VELNOX 1726208-2RS1 VX — d40 мм, SKF 1726208-2RS1, Geringhoff, JD AZ23315',
                'meta_desc_uk'  => 'Підшипник VELNOX 1726208-2RS1 VX: d=40 мм, D=80 мм, Cdyn 30.7 кН, 2RS1. Аналог SKF 1726208-2RS1, INA G208-XL-NPPB. OEM: Geringhoff 025292, JD AZ23315.',
                'desc_en'       => 'Radial ball bearing of the 1726 series (type 208) with an extended inner ring (d₁ = 52 mm) for loaded assemblies in header cutting mechanisms and seeder units. Bore diameter d = 40 mm, outer diameter D = 80 mm, inner ring width B = 18 mm; dynamic load rating — 30.7 kN, static — 19.0 kN. Symmetric double-sided contact seal 2RS1 provides full protection against abrasive particles and moisture. Direct replacement for SKF 1726208-2RS1, INA G208-XL-NPPB, TIMKEN 1726208 2RS, ZKL UD 208; substitutes OEM parts in Geringhoff headers (025292, 025293), Monosem seeders (4655.1A), John Deere (AZ23315) and Gaspardo (F04010184).',
                'meta_title_en' => 'VELNOX 1726208-2RS1 VX — d40 mm, SKF 1726208-2RS1, Geringhoff, JD AZ23315',
                'meta_desc_en'  => 'VELNOX 1726208-2RS1 VX bearing: d=40 mm, D=80 mm, Cdyn 30.7 kN, 2RS1. Replaces SKF 1726208-2RS1, INA G208-XL-NPPB. OEM: Geringhoff 025292, JD AZ23315.',
                'desc_pl'       => 'Promieniowe łożysko kulkowe serii 1726 (typ 208) z poszerzonym pierścieniem wewnętrznym (d₁ = 52 mm) do obciążonych węzłów głowic tnących i mechanizmów siewnych. Średnica otworu d = 40 mm, zewnętrzna D = 80 mm, szerokość pierścienia wewnętrznego B = 18 mm; nośność dynamiczna — 30,7 kN, statyczna — 19,0 kN. Symetryczne kontaktowe uszczelnienie 2RS1 z obu stron chroni przed cząstkami ściernymi i wilgocią. Bezpośredni zamiennik SKF 1726208-2RS1, INA G208-XL-NPPB, TIMKEN 1726208 2RS, ZKL UD 208; zastępuje elementy OEM w hederach Geringhoff (025292, 025293), siewnikach Monosem (4655.1A), John Deere (AZ23315) i Gaspardo (F04010184).',
                'meta_title_pl' => 'VELNOX 1726208-2RS1 VX — d40 mm, SKF 1726208-2RS1, Geringhoff, JD AZ23315',
                'meta_desc_pl'  => 'Łożysko VELNOX 1726208-2RS1 VX: d=40 mm, D=80 mm, Cdyn 30,7 kN, 2RS1. Zamiennik SKF 1726208-2RS1, INA G208-XL-NPPB. OEM: Geringhoff 025292, JD AZ23315.',
            ],
            [
                'article'  => '1726209-2RS1 VX',
                'slug'     => '1726209-2rs1-vx',
                'model_3d' => '1726209-2RS1.glb',
                'specs'   => ['d_mm'=>'45','D_mm'=>'85','B_mm'=>'19','d1_mm'=>'56.6','r_12_mm'=>'1.1','cdyn_kn'=>'32.5','co_kn'=>'20.4','pu_kn'=>'0.92','mass_kg'=>'0.37'],
                'cross_refs' => [
                    ['brand'=>'TIMKEN',  'value'=>'1726209 2RS',    'type'=>'bearing'],
                    ['brand'=>'NSK-RHP', 'value'=>'1726209 2RS',    'type'=>'bearing'],
                    ['brand'=>'SKF',     'value'=>'1726209 2RS1',   'type'=>'bearing'],
                    ['brand'=>'INA',     'value'=>'209 NPPB',       'type'=>'bearing'],
                    ['brand'=>'SKF',     'value'=>'XG209NPPB',      'type'=>'bearing'],
                    ['brand'=>'FBJ',     'value'=>'CS 209 2RS',     'type'=>'bearing'],
                    ['brand'=>'Claas',   'value'=>'000212102.0',    'type'=>'application'],
                    ['brand'=>'Capello', 'value'=>'02.1032.00',     'type'=>'application'],
                    ['brand'=>'Ziegler', 'value'=>'12-058421',      'type'=>'application'],
                    ['brand'=>'NH',      'value'=>'340411240',      'type'=>'application'],
                    ['brand'=>'NH',      'value'=>'81004584',       'type'=>'application'],
                    ['brand'=>'MF',      'value'=>'831134M1',       'type'=>'application'],
                    ['brand'=>'MF',      'value'=>'LA340411277',    'type'=>'application'],
                    ['brand'=>'',        'value'=>'NWB00607',       'type'=>'application'],
                    ['brand'=>'Capello', 'value'=>'PMS-000007',     'type'=>'application'],
                    ['brand'=>'KUHN',    'value'=>'Z4009820',       'type'=>'application'],
                    ['brand'=>'GRIMME',  'value'=>'B96.00293',      'type'=>'application'],
                ],
                'name_uk'=>'1726209-2RS1 VX','name_en'=>'1726209-2RS1 VX','name_pl'=>'1726209-2RS1 VX',
                'desc_uk'       => 'Радіальний кульковий підшипник серії 1726 (тип 209) з розширеним внутрішнім кільцем (d₁ = 56.6 мм) для вузлів збиральних і посівних машин із підвищеним радіальним навантаженням. Посадковий діаметр d = 45 мм, зовнішній D = 85 мм, ширина внутрішнього кільця B = 19 мм; динамічна вантажопідйомність — 32.5 кН, статична — 20.4 кН. Двостороннє гумово-контактне ущільнення 2RS1 формує повну герметизацію зони кочення в умовах ґрунтового забруднення. Аналог SKF 1726209-2RS1, INA 209 NPPB, TIMKEN 1726209 2RS, FBJ CS 209 2RS; застосовується в оригінальних вузлах CLAAS (000212102.0), New Holland (81004584), Massey Ferguson (831134M1, LA340411277) та Capello (02.1032.00, PMS-000007).',
                'meta_title_uk' => 'VELNOX 1726209-2RS1 VX — d45 мм, SKF 1726209-2RS1, NH 81004584, MF 831134M1',
                'meta_desc_uk'  => 'Підшипник VELNOX 1726209-2RS1 VX: d=45 мм, D=85 мм, Cdyn 32.5 кН, 2RS1. Аналог SKF 1726209-2RS1. OEM: CLAAS 000212102.0, NH 81004584, MF 831134M1.',
                'desc_en'       => 'Radial ball bearing of the 1726 series (type 209) with an extended inner ring (d₁ = 56.6 mm) for assemblies in harvesting and seeding machines with elevated radial loads. Bore diameter d = 45 mm, outer diameter D = 85 mm, inner ring width B = 19 mm; dynamic load rating — 32.5 kN, static — 20.4 kN. Double-sided rubber contact seal 2RS1 provides full closure of the raceway in soil-contaminated field conditions. Cross-reference for SKF 1726209-2RS1, INA 209 NPPB, TIMKEN 1726209 2RS, FBJ CS 209 2RS; used in OEM assemblies of CLAAS (000212102.0), New Holland (81004584), Massey Ferguson (831134M1, LA340411277) and Capello (02.1032.00, PMS-000007).',
                'meta_title_en' => 'VELNOX 1726209-2RS1 VX — d45 mm, SKF 1726209-2RS1, NH 81004584, MF 831134M1',
                'meta_desc_en'  => 'VELNOX 1726209-2RS1 VX bearing: d=45 mm, D=85 mm, Cdyn 32.5 kN, 2RS1. Replaces SKF 1726209-2RS1. OEM: CLAAS 000212102.0, NH 81004584, MF 831134M1.',
                'desc_pl'       => 'Promieniowe łożysko kulkowe serii 1726 (typ 209) z poszerzonym pierścieniem wewnętrznym (d₁ = 56,6 mm) do węzłów maszyn żniwnych i siewnych z podwyższonym obciążeniem promieniowym. Średnica otworu d = 45 mm, zewnętrzna D = 85 mm, szerokość pierścienia wewnętrznego B = 19 mm; nośność dynamiczna — 32,5 kN, statyczna — 20,4 kN. Dwustronne gumowe uszczelnienie kontaktowe 2RS1 tworzy pełne uszczelnienie strefy tocznej w warunkach zanieczyszczenia glebowego. Zamiennik SKF 1726209-2RS1, INA 209 NPPB, TIMKEN 1726209 2RS, FBJ CS 209 2RS; stosowany w węzłach OEM CLAAS (000212102.0), New Holland (81004584), Massey Ferguson (831134M1, LA340411277) i Capello (02.1032.00, PMS-000007).',
                'meta_title_pl' => 'VELNOX 1726209-2RS1 VX — d45 mm, SKF 1726209-2RS1, NH 81004584, MF 831134M1',
                'meta_desc_pl'  => 'Łożysko VELNOX 1726209-2RS1 VX: d=45 mm, D=85 mm, Cdyn 32,5 kN, 2RS1. Zamiennik SKF 1726209-2RS1. OEM: CLAAS 000212102.0, NH 81004584, MF 831134M1.',
            ],
            [
                'article'  => '1726210-2RS1 VX',
                'slug'     => '1726210-2rs1-vx',
                'model_3d' => '1726210-2RS1.glb',
                'specs'    => ['d_mm'=>'50','D_mm'=>'90','B_mm'=>'20','d1_mm'=>'62.5','r_12_mm'=>'1.1','cdyn_kn'=>'35.1','co_kn'=>'23.2','pu_kn'=>'0.98','mass_kg'=>'0.41'],
                'cross_refs' => [
                    ['brand'=>'TIMKEN',  'value'=>'1726210 2RS',    'type'=>'bearing'],
                    ['brand'=>'NSK-RHP', 'value'=>'1726210 2RS',    'type'=>'bearing'],
                    ['brand'=>'SKF',     'value'=>'1726210 2RS1',   'type'=>'bearing'],
                    ['brand'=>'INA',     'value'=>'210 NPPB',       'type'=>'bearing'],
                    ['brand'=>'SKF',     'value'=>'XG210NPPB',      'type'=>'bearing'],
                    ['brand'=>'FBJ',     'value'=>'CS 210 2RS',     'type'=>'bearing'],
                    ['brand'=>'Dominoni','value'=>'11330',          'type'=>'application'],
                    ['brand'=>'Kuhn',    'value'=>'81005000',       'type'=>'application'],
                    ['brand'=>'Kuhn',    'value'=>'81005099',       'type'=>'application'],
                ],
                'name_uk'=>'1726210-2RS1 VX','name_en'=>'1726210-2RS1 VX','name_pl'=>'1726210-2RS1 VX',
                'desc_uk'       => 'Радіальний кульковий підшипник серії 1726 (тип 210) з розширеним внутрішнім кільцем (d₁ = 62.5 мм) — найбільший у ряду 172x200, розрахований на значні радіальні навантаження в ґрунтообробних вузлах. Посадковий діаметр d = 50 мм, зовнішній D = 90 мм, ширина внутрішнього кільця B = 20 мм; динамічна вантажопідйомність — 35.1 кН, статична — 23.2 кН. Контактне ущільнення 2RS1 — двостороннє, симетричне — забезпечує повний захист від механічних домішок і вологи в польових умовах. Технічний аналог SKF 1726210-2RS1, INA 210 NPPB, TIMKEN 1726210 2RS, FBJ CS 210 2RS; входить до складу вузлів Dominoni (11330) та Kuhn (81005000, 81005099).',
                'meta_title_uk' => 'VELNOX 1726210-2RS1 VX — d50 мм, SKF 1726210-2RS1, Dominoni 11330, Kuhn',
                'meta_desc_uk'  => 'Підшипник VELNOX 1726210-2RS1 VX: d=50 мм, D=90 мм, Cdyn 35.1 кН, 2RS1. Аналог SKF 1726210-2RS1, INA 210 NPPB. OEM: Dominoni 11330, Kuhn 81005000.',
                'desc_en'       => 'Radial ball bearing of the 1726 series (type 210) with an extended inner ring (d₁ = 62.5 mm) — the largest in the 172x200 range, designed for significant radial loads in tillage assemblies. Bore diameter d = 50 mm, outer diameter D = 90 mm, inner ring width B = 20 mm; dynamic load rating — 35.1 kN, static — 23.2 kN. Symmetric double-sided contact seal 2RS1 provides complete protection against mechanical contaminants and moisture under field conditions. Technical equivalent of SKF 1726210-2RS1, INA 210 NPPB, TIMKEN 1726210 2RS, FBJ CS 210 2RS; used in Dominoni (11330) and Kuhn (81005000, 81005099) assemblies.',
                'meta_title_en' => 'VELNOX 1726210-2RS1 VX — d50 mm, SKF 1726210-2RS1, Dominoni 11330, Kuhn',
                'meta_desc_en'  => 'VELNOX 1726210-2RS1 VX bearing: d=50 mm, D=90 mm, Cdyn 35.1 kN, 2RS1. Replaces SKF 1726210-2RS1, INA 210 NPPB. OEM: Dominoni 11330, Kuhn 81005000.',
                'desc_pl'       => 'Promieniowe łożysko kulkowe serii 1726 (typ 210) z poszerzonym pierścieniem wewnętrznym (d₁ = 62,5 mm) — największy w serii 172x200, przeznaczony na znaczne obciążenia promieniowe w węzłach uprawowych. Średnica otworu d = 50 mm, zewnętrzna D = 90 mm, szerokość pierścienia wewnętrznego B = 20 mm; nośność dynamiczna — 35,1 kN, statyczna — 23,2 kN. Symetryczne dwustronne uszczelnienie kontaktowe 2RS1 zapewnia pełną ochronę przed zanieczyszczeniami mechanicznymi i wilgocią w warunkach polowych. Odpowiednik techniczny SKF 1726210-2RS1, INA 210 NPPB, TIMKEN 1726210 2RS, FBJ CS 210 2RS; stosowany w węzłach Dominoni (11330) i Kuhn (81005000, 81005099).',
                'meta_title_pl' => 'VELNOX 1726210-2RS1 VX — d50 mm, SKF 1726210-2RS1, Dominoni 11330, Kuhn',
                'meta_desc_pl'  => 'Łożysko VELNOX 1726210-2RS1 VX: d=50 mm, D=90 mm, Cdyn 35,1 kN, 2RS1. Zamiennik SKF 1726210-2RS1, INA 210 NPPB. OEM: Dominoni 11330, Kuhn 81005000.',
            ],
            [
                'article'  => '1726306-2RS1 VX',
                'slug'     => '1726306-2rs1-vx',
                'model_3d' => '1726306-2RS1.glb',
                'specs'    => ['d_mm'=>'30','D_mm'=>'72','B_mm'=>'19','d1_mm'=>'44.6','r_12_mm'=>'1.1','cdyn_kn'=>'28.1','co_kn'=>'16','pu_kn'=>'0.67','mass_kg'=>'0.3'],
                'cross_refs' => [
                    ['brand'=>'SKF',  'value'=>'1726306 2RS1',   'type'=>'bearing'],
                    ['brand'=>'NTN',  'value'=>'CS306LLU',       'type'=>'bearing'],
                    ['brand'=>'NSK',  'value'=>'CS306DDU',       'type'=>'bearing'],
                    ['brand'=>'FAG',  'value'=>'76306-2RS',      'type'=>'bearing'],
                    ['brand'=>'SKF',  'value'=>'1726306-2RS1',   'type'=>'bearing'],
                    ['brand'=>'SNR',  'value'=>'6306SEE',        'type'=>'bearing'],
                    ['brand'=>'RHP',  'value'=>'1726306-2RS',    'type'=>'bearing'],
                    ['brand'=>'FKL',  'value'=>'1726306 2S.T',   'type'=>'bearing'],
                    ['brand'=>'',     'value'=>'580306 K7C17',   'type'=>'application'],
                ],
                'name_uk'=>'1726306-2RS1 VX','name_en'=>'1726306-2RS1 VX','name_pl'=>'1726306-2RS1 VX',
                'desc_uk'       => 'Радіальний кульковий підшипник серії 1726 типу 306 з розширеним внутрішнім кільцем (d₁ = 44.6 мм) — збільшений зовнішній діаметр D = 72 мм при тому самому посадковому d = 30 мм забезпечує вищу вантажопідйомність порівняно з типом 1726206. Ширина внутрішнього кільця B = 19 мм; динамічна вантажопідйомність — 28.1 кН, статична — 16.0 кН. Двостороннє контактне ущільнення 2RS1 забезпечує герметизацію в умовах ґрунтової вологи та абразивного пилу. Аналог SKF 1726306-2RS1, FAG 76306-2RS, NTN CS306LLU, NSK CS306DDU, SNR 6306SEE, RHP 1726306-2RS; застосовується у вузлах із підвищеними радіальними навантаженнями (арт. 580306 K7C17).',
                'meta_title_uk' => 'VELNOX 1726306-2RS1 VX — d30 D72 мм, SKF 1726306-2RS1, FAG 76306-2RS',
                'meta_desc_uk'  => 'Підшипник VELNOX 1726306-2RS1 VX серії 306: d=30 мм, D=72 мм, Cdyn 28.1 кН, 2RS1. Аналог SKF 1726306-2RS1, FAG 76306-2RS, NTN CS306LLU.',
                'desc_en'       => 'Radial ball bearing of the 1726 series type 306 with an extended inner ring (d₁ = 44.6 mm) — the larger outer diameter D = 72 mm at the same bore d = 30 mm delivers higher load capacity compared to type 1726206. Inner ring width B = 19 mm; dynamic load rating — 28.1 kN, static — 16.0 kN. Double-sided contact seal 2RS1 ensures sealing against soil moisture and abrasive dust. Interchangeable with SKF 1726306-2RS1, FAG 76306-2RS, NTN CS306LLU, NSK CS306DDU, SNR 6306SEE, RHP 1726306-2RS; used in high-radial-load agricultural assemblies (ref. 580306 K7C17).',
                'meta_title_en' => 'VELNOX 1726306-2RS1 VX — d30 D72 mm, SKF 1726306-2RS1, FAG 76306-2RS',
                'meta_desc_en'  => 'VELNOX 1726306-2RS1 VX bearing, series 306: d=30 mm, D=72 mm, Cdyn 28.1 kN, 2RS1. Replaces SKF 1726306-2RS1, FAG 76306-2RS, NTN CS306LLU.',
                'desc_pl'       => 'Promieniowe łożysko kulkowe serii 1726 typ 306 z poszerzonym pierścieniem wewnętrznym (d₁ = 44,6 mm) — zwiększona średnica zewnętrzna D = 72 mm przy tej samej średnicy otworu d = 30 mm zapewnia wyższą nośność w porównaniu do typu 1726206. Szerokość pierścienia wewnętrznego B = 19 mm; nośność dynamiczna — 28,1 kN, statyczna — 16,0 kN. Dwustronne kontaktowe uszczelnienie 2RS1 zapewnia hermetyzację przed wilgocią glebową i pyłem ściernym. Zamiennik SKF 1726306-2RS1, FAG 76306-2RS, NTN CS306LLU, NSK CS306DDU, SNR 6306SEE, RHP 1726306-2RS; stosowany w węzłach z podwyższonymi obciążeniami promieniowymi (ref. 580306 K7C17).',
                'meta_title_pl' => 'VELNOX 1726306-2RS1 VX — d30 D72 mm, SKF 1726306-2RS1, FAG 76306-2RS',
                'meta_desc_pl'  => 'Łożysko VELNOX 1726306-2RS1 VX serii 306: d=30 mm, D=72 mm, Cdyn 28,1 kN, 2RS1. Zamiennik SKF 1726306-2RS1, FAG 76306-2RS, NTN CS306LLU.',
            ],
            [
                'article'  => '1726309-2RS1 VX',
                'slug'     => '1726309-2rs1-vx',
                'model_3d' => '1726309-2RS1.glb',
                'specs'   => ['d_mm'=>'45','D_mm'=>'100','B_mm'=>'25','d1_mm'=>'62.1','r_12_mm'=>'1.5','cdyn_kn'=>'52.7','co_kn'=>'31.5','pu_kn'=>'1.34','mass_kg'=>'0.73'],
                'cross_refs' => [
                    ['brand'=>'TIMKEN', 'value'=>'1726309 2RS',    'type'=>'bearing'],
                    ['brand'=>'NSK',    'value'=>'1726309 2RS',    'type'=>'bearing'],
                    ['brand'=>'SKF',    'value'=>'1726309 2RS1',   'type'=>'bearing'],
                    ['brand'=>'NTN',    'value'=>'CS309LLU',       'type'=>'bearing'],
                    ['brand'=>'NSK',    'value'=>'CS309DDU',       'type'=>'bearing'],
                    ['brand'=>'FAG',    'value'=>'76309-2RS',      'type'=>'bearing'],
                    ['brand'=>'IMT',    'value'=>'61200120',       'type'=>'bearing'],
                    ['brand'=>'SNR',    'value'=>'1726309 2RS',    'type'=>'bearing'],
                    ['brand'=>'',       'value'=>'309NPPB',        'type'=>'application'],
                    ['brand'=>'GASPARDO','value'=>'F04010225R',    'type'=>'application'],
                    ['brand'=>'GASPARDO','value'=>'MG43400468',    'type'=>'application'],
                    ['brand'=>'GASPARDO','value'=>'23400434',      'type'=>'application'],
                    ['brand'=>'GASPARDO','value'=>'76100409',      'type'=>'application'],
                    ['brand'=>'GASPARDO','value'=>'61100438',      'type'=>'application'],
                    ['brand'=>'GASPARDO','value'=>'43400468',      'type'=>'application'],
                    ['brand'=>'ZARAMAK', 'value'=>'1726309 2RS1',  'type'=>'application'],
                ],
                'name_uk'=>'1726309-2RS1 VX','name_en'=>'1726309-2RS1 VX','name_pl'=>'1726309-2RS1 VX',
                'desc_uk'       => 'Радіальний кульковий підшипник серії 1726 типу 309 з розширеним внутрішнім кільцем (d₁ = 62.1 мм) — збільшений зовнішній діаметр D = 100 мм при посадковому d = 45 мм забезпечує суттєво вищу вантажопідйомність порівняно з типом 1726209. Ширина внутрішнього кільця B = 25 мм; динамічна вантажопідйомність — 52.7 кН, статична — 31.5 кН. Захист від польових забруднень реалізовано двостороннім контактним ущільненням 2RS1. Прямий аналог SKF 1726309-2RS1, FAG 76309-2RS, NTN CS309LLU, NSK CS309DDU, TIMKEN 1726309 2RS; є основним замінником у сівалках Gaspardo (F04010225R, MG43400468, 23400434, 76100409) та агрегатах ZARAMAK (1726309 2RS1).',
                'meta_title_uk' => 'VELNOX 1726309-2RS1 VX — d45 D100 мм, Cdyn 52.7 кН, SKF 1726309-2RS1, Gaspardo',
                'meta_desc_uk'  => 'Підшипник VELNOX 1726309-2RS1 VX серії 309: d=45 мм, D=100 мм, Cdyn 52.7 кН. Аналог SKF 1726309-2RS1, FAG 76309-2RS. OEM: Gaspardo F04010225R.',
                'desc_en'       => 'Radial ball bearing of the 1726 series type 309 with an extended inner ring (d₁ = 62.1 mm) — the larger outer diameter D = 100 mm at bore d = 45 mm delivers significantly higher load capacity compared to type 1726209. Inner ring width B = 25 mm; dynamic load rating — 52.7 kN, static — 31.5 kN. Double-sided contact seal 2RS1 provides field-condition protection against all types of contamination. Direct replacement for SKF 1726309-2RS1, FAG 76309-2RS, NTN CS309LLU, NSK CS309DDU, TIMKEN 1726309 2RS; primary OEM substitute in Gaspardo seeders (F04010225R, MG43400468, 23400434, 76100409) and ZARAMAK assemblies (1726309 2RS1).',
                'meta_title_en' => 'VELNOX 1726309-2RS1 VX — d45 D100 mm, Cdyn 52.7 kN, SKF 1726309-2RS1, Gaspardo',
                'meta_desc_en'  => 'VELNOX 1726309-2RS1 VX heavy series 309: d=45 mm, D=100 mm, Cdyn 52.7 kN. Replaces SKF 1726309-2RS1, FAG 76309-2RS. OEM: Gaspardo F04010225R.',
                'desc_pl'       => 'Promieniowe łożysko kulkowe serii 1726 typ 309 z poszerzonym pierścieniem wewnętrznym (d₁ = 62,1 mm) — zwiększona średnica zewnętrzna D = 100 mm przy średnicy otworu d = 45 mm zapewnia znacznie wyższą nośność w porównaniu do typu 1726209. Szerokość pierścienia wewnętrznego B = 25 mm; nośność dynamiczna — 52,7 kN, statyczna — 31,5 kN. Dwustronne kontaktowe uszczelnienie 2RS1 zapewnia ochronę przed wszystkimi rodzajami zanieczyszczeń polowych. Bezpośredni zamiennik SKF 1726309-2RS1, FAG 76309-2RS, NTN CS309LLU, NSK CS309DDU, TIMKEN 1726309 2RS; główny zamiennik OEM w siewnikach Gaspardo (F04010225R, MG43400468, 23400434, 76100409) i węzłach ZARAMAK (1726309 2RS1).',
                'meta_title_pl' => 'VELNOX 1726309-2RS1 VX — d45 D100 mm, Cdyn 52,7 kN, SKF 1726309-2RS1, Gaspardo',
                'meta_desc_pl'  => 'Łożysko VELNOX 1726309-2RS1 VX serii 309: d=45 mm, D=100 mm, Cdyn 52,7 kN. Zamiennik SKF 1726309-2RS1, FAG 76309-2RS. OEM: Gaspardo F04010225R.',
            ],
        ];

        foreach ($at1Products as $p) {
            DB::table('products')->updateOrInsert(
                ['slug' => $p['slug']],
                ['slug' => $p['slug'], 'article' => $p['article'], 'product_table_id' => $at1]
            );
            $productId = DB::table('products')->where('slug', $p['slug'])->value('id');

            foreach ($p['specs'] as $key => $value) {
                $sid = $specId($key);
                if (!$sid) continue;
                DB::table('product_specs')->updateOrInsert(
                    ['product_id' => $productId, 'spec_id' => $sid],
                    ['value' => $value]
                );
            }

            DB::table('product_cross_refs')->where('product_id', $productId)->delete();
            foreach ($p['cross_refs'] as $ref) {
                DB::table('product_cross_refs')->insert([
                    'product_id' => $productId,
                    'brand'      => $ref['brand'],
                    'value'      => $ref['value'],
                    'type'       => $ref['type'],
                ]);
            }

            foreach (['uk', 'en', 'pl'] as $locale) {
                DB::table('translations')->updateOrInsert(
                    ['entity_type' => 'product', 'entity_id' => $productId, 'locale' => $locale, 'field' => 'name'],
                    ['value' => $p["name_{$locale}"]]
                );
            }
            foreach (['uk', 'en', 'pl'] as $locale) {
                foreach (['desc' => 'desc', 'meta_title' => 'meta_title', 'meta_desc' => 'meta_description'] as $suffix => $field) {
                    $val = $p["{$suffix}_{$locale}"] ?? null;
                    if ($val) {
                        DB::table('translations')->updateOrInsert(
                            ['entity_type' => 'product', 'entity_id' => $productId, 'locale' => $locale, 'field' => $field],
                            ['value' => $val]
                        );
                    }
                }
            }

            if (!empty($p['model_3d'])) {
                DB::table('product_assets')->updateOrInsert(
                    ['entity_type' => 'product', 'entity_id' => $productId, 'type' => 'model_3d'],
                    ['path' => '/velnox/models/' . $p['model_3d'], 'sort_order' => 0]
                );
            }

            // gallery per product: студійні фото (де є) → головне фото → 3 креслення
            $galleryBase = '/velnox/images/products/agro-t1';
            $slug = $p['slug'];
            $photoCount = [
                '1726206-2rs1-vx' => 5,
                '1726210-2rs1-vx' => 5,
                '1726309-2rs1-vx' => 5,
            ][$slug] ?? 0;

            $gallery = [];
            for ($i = 1; $i <= $photoCount; $i++) {
                $gallery[] = "{$galleryBase}/velnox-{$slug}-photo-{$i}.webp";
            }
            $gallery[] = "{$galleryBase}/velnox-{$slug}.webp";
            for ($i = 1; $i <= 3; $i++) {
                $gallery[] = "{$galleryBase}/velnox-{$slug}-drawing-{$i}.webp";
            }
            foreach ($gallery as $idx => $path) {
                DB::table('product_assets')->updateOrInsert(
                    ['entity_type' => 'product', 'entity_id' => $productId, 'type' => 'gallery', 'path' => $path],
                    ['sort_order' => $idx + 1]
                );
            }
        }

        // =========================================================
        // 20. PRODUCT TABLE: agro-t2 (DHU series)
        // =========================================================
        DB::table('product_tables')->updateOrInsert(
            ['slug' => 'agro-t2'],
            [
                'slug'             => 'agro-t2',
                'category_id'      => $catId('agro'),
                'spec_columns'     => json_encode(['d_inch','d_mm','B_mm','C_mm','Da_mm','L_mm','A_fl_mm','flange_A1_mm','J_mm','N_mm','Fr_kn','Fa_kn','cdyn_kn','co_kn','mass_kg']),
                'highlight_config' => json_encode([
                    'd_mm'    => [['label' => 'd',  'x' => 1151, 'y' => 721]],
                    'd_inch'  => [['label' => 'd',  'x' => 1151, 'y' => 721]],
                    'Da_mm'   => [['label' => 'Da', 'x' => 889,  'y' => 720]],
                    'B_mm'    => [['label' => 'B',  'x' => 1015, 'y' => 764]],
                    'flange_A1_mm'   => [['label' => 'A1', 'x' => 922,  'y' => 419]],
                    'L_mm'    => [['label' => 'L',  'x' => 533,  'y' => 1011]],
                    'C_mm'    => [['label' => 'C',  'x' => 1039, 'y' => 1051]],
                    'A_fl_mm' => [['label' => 'A',  'x' => 1019, 'y' => 392]],
                ]),
                'schema_viewbox'   => '0 280 2380 870',
                'sort_order'       => 2,
            ]
        );

        $at2 = DB::table('product_tables')->where('slug', 'agro-t2')->value('id');

        foreach (['uk' => 'DHU — дискові фланцеві вузли', 'en' => 'DHU — Disc Hub Units', 'pl' => 'DHU — dyskowe węzły kołnierzowe'] as $locale => $name) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $at2, 'locale' => $locale, 'field' => 'name'],
                ['value' => $name]
            );
        }

        // product_assets for agro-t2 (schema_png, schema_svg at table level)
        DB::table('product_assets')->updateOrInsert(
            ['entity_type' => 'product_table', 'entity_id' => $at2, 'type' => 'schema_png'],
            ['path' => '/velnox/images/products/agro-t2/velnox-agro-t2-schema.webp', 'sort_order' => 0]
        );
        DB::table('product_assets')->updateOrInsert(
            ['entity_type' => 'product_table', 'entity_id' => $at2, 'type' => 'schema_svg'],
            ['path' => '/velnox/images/products/agro-t2/schema.svg', 'sort_order' => 0]
        );

        $at2Products = [
            [
                'article'  => 'DHU 1 1/2R209 VX',
                'slug'     => 'dhu-1-12r209-vx',
                'model_3d' => 'DHU-1-12R209.glb',
                'specs'    => [
                    'd_mm'    => '38.11',
                    'd_inch'  => '1.5004',
                    'flange_A1_mm'   => '3.5',
                    'J_mm'    => '127',
                    'L_mm'    => '127',
                    'N_mm'    => '13.5',
                    'mass_kg' => '1.63',
                    'cdyn_kn' => '32.5',
                    'co_kn'   => '20.4',
                    'B_mm'    => '42.85',
                    'C_mm'    => '22',
                    'Da_mm'   => '97',
                    'Fr_kn'   => '7.7',
                    'Fa_kn'   => '3.8',
                    'A_fl_mm' => '39',
                ],
                'cross_refs' => [
                    ['brand' => 'TIMKEN',     'value' => 'DHU 1 1/2 R209',          'type' => 'bearing'],
                    ['brand' => 'CT-AGRI',    'value' => 'DHU 1 1/2 R209 FD209RB',  'type' => 'bearing'],
                    ['brand' => 'RBF',        'value' => 'FD 209-1 1/2 RD',         'type' => 'bearing'],
                    ['brand' => 'PEER',       'value' => 'ST 491 B',                 'type' => 'bearing'],
                    ['brand' => 'PEER',       'value' => 'PER.GFD209RPPB52',         'type' => 'bearing'],
                    ['brand' => 'FKL',        'value' => 'GWST209PPB38',             'type' => 'bearing'],
                    ['brand' => 'KRAUSE',     'value' => '1934-12-0',                'type' => 'application'],
                    ['brand' => 'KRAUSE',     'value' => '40-109',                   'type' => 'application'],
                    ['brand' => 'Great Plains','value' => '822-208C',                'type' => 'application'],
                    ['brand' => 'JD',         'value' => 'AA53919',                  'type' => 'application'],
                    ['brand' => 'JD',         'value' => 'AN280333',                 'type' => 'application'],
                    ['brand' => 'KUHN',       'value' => 'Q4045130',                 'type' => 'application'],
                ],
                'translations' => [
                    'uk' => [
                        'desc'             => 'Дисковий фланцевий підшипниковий вузол на 4 кріпильні отвори для дискових борін та ґрунтообробної техніки з дюймовою посадкою валу. Внутрішній діаметр d = 38.1 мм (1 1/2"), монтажна база J = 127 мм, загальна довжина L = 127 мм, діаметр центрування Da = 97 мм, ширина внутрішнього кільця B = 42.85 мм, Cdyn = 32.5 кН, Co = 20.4 кН, маса 1.63 кг. Система захисту VX — багатокромкове контактне ущільнення з обох сторін підшипника — забезпечує надійну герметизацію зони кочення в умовах прямого контакту з ґрунтом, пилом та вологою. Пряма геометрична заміна TIMKEN DHU 1 1/2 R209, CT-AGRI FD209RB, RBF FD 209-1 1/2 RD, PEER ST 491 B та FKL GWST209PPB38; застосовується у дискових боронах та культиваторах KRAUSE (арт. 1934-12-0, 40-109), Great Plains (арт. 822-208C), John Deere (арт. AA53919, AN280333) та KUHN (арт. Q4045130).',
                        'meta_title'       => 'VELNOX DHU 1 1/2R209 VX — дисковий вузол 1 1/2", TIMKEN DHU 1 1/2 R209',
                        'meta_description' => 'Дисковий вузол VELNOX DHU 1 1/2R209 VX, d=38.1 мм (1 1/2"), Cdyn 32.5 кН, Co 20.4 кН. Заміна TIMKEN DHU 1 1/2 R209, FKL GWST209PPB38, Great Plains 822-208C.',
                    ],
                    'en' => [
                        'desc'             => 'Disc flanged bearing unit with 4 mounting holes for disc harrows and tillage equipment with inch shaft fit. Bore d = 38.1 mm (1 1/2"), mounting base J = 127 mm, overall length L = 127 mm, centring diameter Da = 97 mm, inner ring width B = 42.85 mm, Cdyn = 32.5 kN, Co = 20.4 kN, mass 1.63 kg. VX sealing system — multi-lip contact seals on both sides of the bearing — ensures reliable protection of the rolling zone in direct contact with soil, dust and moisture. Direct replacement for TIMKEN DHU 1 1/2 R209, CT-AGRI FD209RB, RBF FD 209-1 1/2 RD, PEER ST 491 B and FKL GWST209PPB38; used in disc harrows and cultivators from KRAUSE (part no. 1934-12-0, 40-109), Great Plains (part no. 822-208C), John Deere (part no. AA53919, AN280333) and KUHN (part no. Q4045130).',
                        'meta_title'       => 'VELNOX DHU 1 1/2R209 VX — disc hub unit 1 1/2", TIMKEN DHU 1 1/2 R209',
                        'meta_description' => 'Disc hub unit VELNOX DHU 1 1/2R209 VX, d=38.1 mm (1 1/2"), Cdyn 32.5 kN, Co 20.4 kN. Replacement for TIMKEN DHU 1 1/2 R209, FKL GWST209PPB38, Great Plains 822-208C.',
                    ],
                    'pl' => [
                        'desc'             => 'Dyskowy kołnierzowy węzeł łożyskowy na 4 otwory montażowe do bron dyskowych i maszyn uprawowych z calowym pasowaniem wału. Średnica wewnętrzna d = 38,1 mm (1 1/2"), baza montażowa J = 127 mm, długość całkowita L = 127 mm, średnica centrowania Da = 97 mm, szerokość pierścienia wewnętrznego B = 42,85 mm, Cdyn = 32,5 kN, Co = 20,4 kN, masa 1,63 kg. System uszczelnień VX — wielokrawędziowe uszczelnienie stykowe po obu stronach łożyska — zapewnia niezawodną ochronę strefy tocznej przy bezpośrednim kontakcie z glebą, pyłem i wilgocią. Bezpośredni zamiennik TIMKEN DHU 1 1/2 R209, CT-AGRI FD209RB, RBF FD 209-1 1/2 RD, PEER ST 491 B i FKL GWST209PPB38; stosowany w bronach dyskowych i kultywatorach KRAUSE (nr kat. 1934-12-0, 40-109), Great Plains (nr kat. 822-208C), John Deere (nr kat. AA53919, AN280333) i KUHN (nr kat. Q4045130).',
                        'meta_title'       => 'VELNOX DHU 1 1/2R209 VX — węzeł dyskowy 1 1/2", TIMKEN DHU 1 1/2 R209',
                        'meta_description' => 'Dyskowy węzeł łożyskowy VELNOX DHU 1 1/2R209 VX, d=38,1 mm (1 1/2"), Cdyn 32,5 kN, Co 20,4 kN. Zamiennik TIMKEN DHU 1 1/2 R209, FKL GWST209PPB38, Great Plains 822-208C.',
                    ],
                ],
            ],
        ];

        foreach ($at2Products as $p) {
            DB::table('products')->updateOrInsert(
                ['slug' => $p['slug']],
                ['slug' => $p['slug'], 'article' => $p['article'], 'product_table_id' => $at2]
            );
            $productId = DB::table('products')->where('slug', $p['slug'])->value('id');

            // specs
            foreach ($p['specs'] as $key => $value) {
                DB::table('product_specs')->updateOrInsert(
                    ['product_id' => $productId, 'spec_id' => $specId($key)],
                    ['value' => $value]
                );
            }

            // cross_refs
            DB::table('product_cross_refs')->where('product_id', $productId)->delete();
            foreach ($p['cross_refs'] as $ref) {
                DB::table('product_cross_refs')->insert([
                    'product_id' => $productId,
                    'brand'      => $ref['brand'],
                    'value'      => $ref['value'],
                    'type'       => $ref['type'],
                ]);
            }

            // translations (name already exists; add desc/meta)
            foreach ($p['translations'] as $locale => $fields) {
                foreach ($fields as $field => $value) {
                    DB::table('translations')->updateOrInsert(
                        ['entity_type' => 'product', 'entity_id' => $productId, 'locale' => $locale, 'field' => $field],
                        ['value' => $value]
                    );
                }
            }

            // model_3d
            DB::table('product_assets')->updateOrInsert(
                ['entity_type' => 'product', 'entity_id' => $productId, 'type' => 'model_3d'],
                ['path' => '/velnox/models/' . $p['model_3d'], 'sort_order' => 0]
            );

            // gallery: 6 студійних фото → головне фото → 3 креслення
            $galleryBase = '/velnox/images/products/agro-t2';
            $gallery = [];
            for ($i = 1; $i <= 6; $i++) {
                $gallery[] = "{$galleryBase}/velnox-dhu-1-1-2r209-vx-photo-{$i}.webp";
            }
            $gallery[] = "{$galleryBase}/velnox-dhu-1-1-2r209-vx.webp";
            for ($i = 1; $i <= 3; $i++) {
                $gallery[] = "{$galleryBase}/velnox-dhu-1-1-2r209-vx-drawing-{$i}.webp";
            }
            foreach ($gallery as $idx => $path) {
                DB::table('product_assets')->updateOrInsert(
                    ['entity_type' => 'product', 'entity_id' => $productId, 'type' => 'gallery', 'path' => $path],
                    ['sort_order' => $idx + 1]
                );
            }
        }

        // =========================================================
        // 21. PRODUCT TABLE: agro-t3 (DHU S — square bore disc hub)
        // =========================================================
        DB::table('product_tables')->updateOrInsert(
            ['slug' => 'agro-t3'],
            [
                'slug'         => 'agro-t3',
                'category_id'  => $catId('agro'),
                'spec_columns' => json_encode(['d_inch','d_mm','B_mm','C_mm','a_mm','Da_mm','L_mm','A_fl_mm','flange_A1_mm','J_mm','N_mm','M_mm','Fr_kn','Fa_kn','cdyn_kn','co_kn','mass_kg','pu_kn']),
                'sort_order'   => 3,
            ]
        );
        $at3 = DB::table('product_tables')->where('slug', 'agro-t3')->value('id');

        foreach ([
            'uk' => 'Таблиця 3: Габаритні розміри підшипникового вузла з квадратним отвором для дискової борони KRAUSE',
            'en' => 'Table 3: Dimensional specifications of square bore hub unit for KRAUSE disc harrow',
            'pl' => 'Tabela 3: Wymiary gabarytowe węzła łożyskowego z kwadratowym otworem do brony talerzowej KRAUSE',
        ] as $locale => $name) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $at3, 'locale' => $locale, 'field' => 'name'],
                ['value' => $name]
            );
        }

        // schema assets
        DB::table('product_assets')->updateOrInsert(
            ['entity_type' => 'product_table', 'entity_id' => $at3, 'type' => 'schema_png'],
            ['path' => '/velnox/images/products/agro-t3/velnox-dhu-1-14-s209-vx-schema.webp', 'sort_order' => 0]
        );
        DB::table('product_assets')->updateOrInsert(
            ['entity_type' => 'product_table', 'entity_id' => $at3, 'type' => 'schema_svg'],
            ['path' => '/velnox/images/products/agro-t3/schema.svg', 'sort_order' => 0]
        );

        // highlight_config + schema_viewbox
        DB::table('product_tables')->where('id', $at3)->update([
            'schema_viewbox'   => '0 1700 2480 940',
            'highlight_config' => json_encode([
                'd_mm'    => [['label' => 'd',  'x' => 455,  'y' => 2151]],
                'd_inch'  => [['label' => 'd',  'x' => 455,  'y' => 2151]],
                'B_mm'    => [['label' => 'B',  'x' => 995,  'y' => 2524]],
                'C_mm'    => [['label' => 'C',  'x' => 995,  'y' => 2482]],
                'a_mm'    => [['label' => 'a',  'x' => 475,  'y' => 2465]],
                'Da_mm'   => [['label' => 'Da', 'x' => 838,  'y' => 2149]],
                'L_mm'    => [['label' => 'L',  'x' => 475,  'y' => 2513]],
                'A_fl_mm' => [['label' => 'A',  'x' => 996,  'y' => 1804]],
                'flange_A1_mm'   => [['label' => 'A1', 'x' => 880,  'y' => 1829]],
                'J_mm'    => [['label' => 'J',  'x' => 495,  'y' => 2123]],
                'N_mm'    => [['label' => 'N',  'x' => 752,  'y' => 1886]],
                'M_mm'    => [['label' => 'M',  'x' => 600,  'y' => 1924]],
                'Fr_kn'   => [['label' => 'F',  'x' => 1132, 'y' => 1854]],
                'Fa_kn'   => [['label' => 'F',  'x' => 1313, 'y' => 1856]],
            ]),
        ]);

        // product
        DB::table('products')->updateOrInsert(
            ['slug' => 'dhu-1-14-s209-vx'],
            ['slug' => 'dhu-1-14-s209-vx', 'article' => 'DHU 1 1/4 S209 VX', 'product_table_id' => $at3]
        );
        $pt3 = DB::table('products')->where('slug', 'dhu-1-14-s209-vx')->value('id');

        foreach ([
            'd_inch'  => '1.3976', 'd_mm'    => '35.5',  'B_mm'    => '42.85', 'C_mm'    => '22',
            'a_mm'    => '32.8',   'Da_mm'   => '97',    'L_mm'    => '127',   'A_fl_mm' => '39',
            'flange_A1_mm'   => '3.5',    'J_mm'    => '127',   'N_mm'    => '13.5',  'M_mm'    => '17.5',
            'Fr_kn'   => '7.7',    'Fa_kn'   => '3.8',   'cdyn_kn' => '32.5',  'co_kn'   => '20.4',
            'mass_kg' => '1.63',   'pu_kn'   => '0.857',
        ] as $key => $val) {
            $sid = DB::table('spec_definitions')->where('key', $key)->value('id');
            DB::table('product_specs')->updateOrInsert(
                ['product_id' => $pt3, 'spec_id' => $sid],
                ['value' => $val]
            );
        }

        DB::table('product_cross_refs')->where('product_id', $pt3)->delete();
        foreach ([
            ['brand' => 'TIMKEN',       'value' => 'DHU 1 1/4 S209',                'type' => 'bearing'],
            ['brand' => 'CT-AGRI',      'value' => 'DHU 1 1/4 S209 FD209RK',        'type' => 'bearing'],
            ['brand' => 'NTE',          'value' => 'DHU 1 1/4 S209',                'type' => 'bearing'],
            ['brand' => 'RBF',          'value' => 'FD 209-1 1/4 SQ',               'type' => 'bearing'],
            ['brand' => 'PEER',         'value' => 'FD 209-1 1/4 SQ GFD209SPPB51', 'type' => 'bearing'],
            ['brand' => 'PEER',         'value' => 'FD 209K51-1 1/4 SQ-A342',       'type' => 'bearing'],
            ['brand' => 'FKL',          'value' => 'GWST 209 PPB29',                'type' => 'bearing'],
            ['brand' => 'KRAUSE',       'value' => '40-128',                         'type' => 'application'],
            ['brand' => 'Great Plains', 'value' => '822-209C',                       'type' => 'application'],
            ['brand' => 'CASE',         'value' => '84151226',                       'type' => 'application'],
            ['brand' => 'SUNFLOWER',    'value' => 'FK311007',                       'type' => 'application'],
            ['brand' => 'KUHN',         'value' => 'Q4008320',                       'type' => 'application'],
            ['brand' => 'KUHN',         'value' => 'Q4044290',                       'type' => 'application'],
        ] as $r) {
            DB::table('product_cross_refs')->insert(['product_id' => $pt3] + $r);
        }

        foreach (['uk', 'en', 'pl'] as $locale) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product', 'entity_id' => $pt3, 'locale' => $locale, 'field' => 'name'],
                ['value' => 'DHU 1 1/4 S209 VX']
            );
        }

        foreach ([
            'uk' => [
                'desc'             => 'Дисковий фланцевий підшипниковий вузол типу DHU S з квадратним отвором (M = 17.5 мм) для посадки на квадратний вал розміром 1 1/4". Внутрішній діаметр підшипника d = 35.5 мм (1.3976"), кріпильна база J = 127 мм, діаметр кріпильних отворів N = 13.5 мм, загальна довжина корпусу L = 127 мм, Da = 97 мм, Cdyn = 32.5 кН, Co = 20.4 кН, маса 1.63 кг. Конструкція розрахована на радіальні та осьові навантаження (Fr = 7.7 кН, Fa = 3.8 кН) у вузлах дискових борін з ударним характером та контактом з абразивним середовищем. Пряма заміна TIMKEN DHU 1 1/4 S209, NTE DHU 1 1/4 S209, RBF FD 209-1 1/4 SQ, PEER FD 209-1 1/4 SQ GFD209SPPB51, FKL GWST 209 PPB29; застосовується у дискових боронах KRAUSE (40-128), Great Plains (822-209C), CASE (84151226), SUNFLOWER (FK311007), KUHN (Q4008320, Q4044290).',
                'meta_title'       => 'VELNOX DHU 1 1/4 S209 VX — дисковий вузол квадрат, TIMKEN DHU 1 1/4 S209',
                'meta_description' => 'Дисковий фланцевий вузол VELNOX DHU 1 1/4 S209 VX, d=35.5 мм, квадрат M=17.5 мм, Cdyn 32.5 кН. Пряма заміна TIMKEN DHU 1 1/4 S209, FKL GWST 209 PPB29. KRAUSE, KUHN, CASE.',
            ],
            'en' => [
                'desc'             => 'Disc flange hub unit type DHU S with square bore (M = 17.5 mm) for 1 1/4" square shaft. Bearing bore d = 35.5 mm (1.3976"), bolt circle J = 127 mm, bolt hole diameter N = 13.5 mm, overall length L = 127 mm, Da = 97 mm, Cdyn = 32.5 kN, Co = 20.4 kN, weight 1.63 kg. Designed for radial and axial loads (Fr = 7.7 kN, Fa = 3.8 kN) in disc harrow hubs subject to impact loading and abrasive conditions. Direct replacement for TIMKEN DHU 1 1/4 S209, NTE DHU 1 1/4 S209, RBF FD 209-1 1/4 SQ, PEER FD 209-1 1/4 SQ GFD209SPPB51, FKL GWST 209 PPB29; fits KRAUSE (40-128), Great Plains (822-209C), CASE (84151226), SUNFLOWER (FK311007), KUHN (Q4008320, Q4044290).',
                'meta_title'       => 'VELNOX DHU 1 1/4 S209 VX — disc hub unit square bore, TIMKEN DHU 1 1/4 S209',
                'meta_description' => 'Disc flange hub unit VELNOX DHU 1 1/4 S209 VX, d=35.5 mm, square M=17.5 mm, Cdyn 32.5 kN. Replaces TIMKEN DHU 1 1/4 S209, FKL GWST 209 PPB29. KRAUSE, KUHN, CASE.',
            ],
            'pl' => [
                'desc'             => 'Dyskowy kołnierzowy węzeł piasty typu DHU S z otworem kwadratowym (M = 17,5 mm) do wału kwadratowego 1 1/4". Średnica wewnętrzna łożyska d = 35,5 mm (1,3976"), rozstaw śrub J = 127 mm, średnica otworów mocujących N = 13,5 mm, długość całkowita L = 127 mm, Da = 97 mm, Cdyn = 32,5 kN, Co = 20,4 kN, masa 1,63 kg. Przeznaczony do obciążeń promieniowych i osiowych (Fr = 7,7 kN, Fa = 3,8 kN) w węzłach bron talerzowych pracujących w warunkach udarowych i ściernych. Bezpośredni zamiennik TIMKEN DHU 1 1/4 S209, NTE DHU 1 1/4 S209, RBF FD 209-1 1/4 SQ, PEER FD 209-1 1/4 SQ GFD209SPPB51, FKL GWST 209 PPB29; pasuje do KRAUSE (40-128), Great Plains (822-209C), CASE (84151226), SUNFLOWER (FK311007), KUHN (Q4008320, Q4044290).',
                'meta_title'       => 'VELNOX DHU 1 1/4 S209 VX — dyskowy węzeł kwadrat, TIMKEN DHU 1 1/4 S209',
                'meta_description' => 'Dyskowy węzeł piasty VELNOX DHU 1 1/4 S209 VX, d=35,5 mm, kwadrat M=17,5 mm, Cdyn 32,5 kN. Zamiennik TIMKEN DHU 1 1/4 S209, FKL GWST 209 PPB29. KRAUSE, KUHN, CASE.',
            ],
        ] as $locale => $fields) {
            foreach ($fields as $field => $value) {
                DB::table('translations')->updateOrInsert(
                    ['entity_type' => 'product', 'entity_id' => $pt3, 'locale' => $locale, 'field' => $field],
                    ['value' => $value]
                );
            }
        }

        // gallery + 3D model
        DB::table('product_assets')->updateOrInsert(
            ['entity_type' => 'product', 'entity_id' => $pt3, 'type' => 'model_3d'],
            ['path' => '/velnox/models/DHU-1-14S209.glb', 'sort_order' => 0]
        );
        // gallery: 5 студійних фото → головне фото → 3 креслення
        $at3Base = '/velnox/images/products/agro-t3';
        $at3Gallery = [];
        for ($i = 1; $i <= 5; $i++) {
            $at3Gallery[] = "{$at3Base}/velnox-dhu-1-14-s209-vx-photo-{$i}.webp";
        }
        $at3Gallery[] = "{$at3Base}/velnox-dhu-1-14-s209-vx.webp";
        for ($i = 1; $i <= 3; $i++) {
            $at3Gallery[] = "{$at3Base}/velnox-dhu-1-14-s209-vx-drawing-{$i}.webp";
        }
        foreach ($at3Gallery as $idx => $path) {
            DB::table('product_assets')->updateOrInsert(
                ['entity_type' => 'product', 'entity_id' => $pt3, 'type' => 'gallery', 'path' => $path],
                ['sort_order' => $idx + 1]
            );
        }

        // =========================================================
        // 22. PRODUCT TABLE: agro-t4 (AA30941 — John Deere disc hub)
        // =========================================================
        DB::table('product_tables')->updateOrInsert(
            ['slug' => 'agro-t4'],
            [
                'slug'         => 'agro-t4',
                'category_id'  => $catId('agro'),
                'spec_columns' => json_encode(['d_inch','d_mm','B_mm','L_mm','flange_A1_mm','C_mm','Da_mm','D_mm','J_mm','N_mm','cdyn_kn','co_kn','mass_kg','pu_kn']),
                'sort_order'   => 4,
            ]
        );
        $at4 = DB::table('product_tables')->where('slug', 'agro-t4')->value('id');

        foreach ([
            'uk' => 'Таблиця 4: Габаритні розміри підшипникового вузла AA30941 для техніки John Deere',
            'en' => 'Table 4: Dimensional specifications of AA30941 hub unit for John Deere machinery',
            'pl' => 'Tabela 4: Wymiary gabarytowe węzła łożyskowego AA30941 do maszyn John Deere',
        ] as $locale => $name) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $at4, 'locale' => $locale, 'field' => 'name'],
                ['value' => $name]
            );
        }

        // schema assets
        DB::table('product_assets')->updateOrInsert(
            ['entity_type' => 'product_table', 'entity_id' => $at4, 'type' => 'schema_png'],
            ['path' => '/velnox/images/products/agro-t4/velnox-aa30941-vx-schema.webp', 'sort_order' => 0]
        );
        DB::table('product_assets')->updateOrInsert(
            ['entity_type' => 'product_table', 'entity_id' => $at4, 'type' => 'schema_svg'],
            ['path' => '/velnox/images/products/agro-t4/schema.svg', 'sort_order' => 0]
        );

        // highlight_config + schema_viewbox
        DB::table('product_tables')->where('id', $at4)->update([
            'schema_viewbox'   => '0 420 2480 1380',
            'highlight_config' => json_encode([
                'd_mm'   => [['label' => 'd',  'x' => 1259, 'y' => 940]],
                'd_inch' => [['label' => 'd',  'x' => 1259, 'y' => 940]],
                'flange_A1_mm'  => [['label' => 'A1', 'x' => 1413, 'y' => 572]],
                'Da_mm'  => [['label' => 'Da', 'x' => 1529, 'y' => 944]],
                'D_mm'   => [['label' => 'D',  'x' => 1662, 'y' => 944]],
                'J_mm'   => [['label' => 'J',  'x' => 371,  'y' => 880]],
                'N_mm'   => [['label' => 'N',  'x' => 515,  'y' => 545]],
                'C_mm'   => [['label' => 'C',  'x' => 1398, 'y' => 1281]],
                'L_mm'   => [['label' => 'L',  'x' => 521,  'y' => 1295]],
            ]),
        ]);

        // product
        DB::table('products')->updateOrInsert(
            ['slug' => 'aa30941-vx'],
            ['slug' => 'aa30941-vx', 'article' => 'AA30941 VX', 'product_table_id' => $at4]
        );
        $pt4 = DB::table('products')->where('slug', 'aa30941-vx')->value('id');

        foreach ([
            'd_inch'  => '1.781', 'd_mm'    => '45.24', 'B_mm'    => '36.53', 'L_mm'    => '48.5',
            'flange_A1_mm'   => '3.5',   'C_mm'    => '30.1',  'Da_mm'   => '93',    'D_mm'    => '150',
            'J_mm'    => '120.5', 'N_mm'    => '13.5',  'cdyn_kn' => '32.5',  'co_kn'   => '20.4',
            'mass_kg' => '1.836', 'pu_kn'   => '0.857',
        ] as $key => $val) {
            $sid = DB::table('spec_definitions')->where('key', $key)->value('id');
            DB::table('product_specs')->updateOrInsert(
                ['product_id' => $pt4, 'spec_id' => $sid],
                ['value' => $val]
            );
        }

        DB::table('product_cross_refs')->where('product_id', $pt4)->delete();
        foreach ([
            ['brand' => 'CT-AGRI', 'value' => 'AA30941',        'type' => 'bearing'],
            ['brand' => 'FKL',     'value' => 'GWST 209 PPB13', 'type' => 'bearing'],
            ['brand' => 'FKL',     'value' => 'GW209PPB13',     'type' => 'bearing'],
            ['brand' => 'KABAT',   'value' => 'P30941',         'type' => 'bearing'],
            ['brand' => 'RBF',     'value' => 'ST 209-1 3/4',   'type' => 'bearing'],
            ['brand' => 'Gasket',      'value' => 'A33968',     'type' => 'application'],
            ['brand' => 'Housing',     'value' => 'A34792',     'type' => 'application'],
            ['brand' => 'Housing',     'value' => 'A34793',     'type' => 'application'],
            ['brand' => 'Housing',     'value' => 'AA27172',    'type' => 'application'],
            ['brand' => 'JD – Assembly', 'value' => 'AA30941',  'type' => 'application'],
            ['brand' => 'Grease Nipple', 'value' => 'JD7806',   'type' => 'application'],
            ['brand' => 'bearing',     'value' => 'GW209PPB13', 'type' => 'application'],
        ] as $r) {
            DB::table('product_cross_refs')->insert(['product_id' => $pt4] + $r);
        }

        foreach (['uk', 'en', 'pl'] as $locale) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product', 'entity_id' => $pt4, 'locale' => $locale, 'field' => 'name'],
                ['value' => 'AA30941 VX']
            );
        }

        foreach ([
            'uk' => [
                'desc'             => 'Дисковий підшипниковий вузол AA30941 для дискових сівалок та ґрунтообробних агрегатів John Deere з посадковим діаметром d = 45.24 мм (1.781"). Зовнішній діаметр корпусу D = 150 мм, центрувальний діаметр Da = 93 мм, кріпильна база J = 120.5 мм, діаметр кріпильних отворів N = 13.5 мм, загальна довжина L = 48.5 мм, ширина C = 30.1 мм, маса 1.836 кг; Cdyn = 32.5 кН, Co = 20.4 кН, Pu = 0.857 кН. Корпус круглого перерізу з центруванням по діаметру Da — геометрія OEM-вузла John Deere. Пряма заміна CT-AGRI AA30941, FKL GWST 209 PPB13 / GW209PPB13, KABAT P30941, RBF ST 209-1 3/4; відповідає OEM-номерам John Deere A33968, A34792, A34793, AA27172, AA30941, JD7806.',
                'meta_title'       => 'VELNOX AA30941 VX — дисковий вузол John Deere, CT-AGRI AA30941',
                'meta_description' => 'Дисковий вузол VELNOX AA30941 VX для John Deere, d=45.24 мм, D=150 мм, Cdyn 32.5 кН. Заміна JD AA30941, CT-AGRI, FKL GW209PPB13. Для дискових посівних секцій.',
            ],
            'en' => [
                'desc'             => 'Disc hub unit AA30941 for John Deere disc seeders and tillage equipment, bore d = 45.24 mm (1.781"). Housing outer diameter D = 150 mm, centering diameter Da = 93 mm, bolt circle J = 120.5 mm, bolt hole diameter N = 13.5 mm, overall length L = 48.5 mm, width C = 30.1 mm, weight 1.836 kg; Cdyn = 32.5 kN, Co = 20.4 kN, Pu = 0.857 kN. Round housing with centering on diameter Da — OEM geometry for John Deere disc sections. Direct replacement for CT-AGRI AA30941, FKL GWST 209 PPB13 / GW209PPB13, KABAT P30941, RBF ST 209-1 3/4; matches John Deere OEM references A33968, A34792, A34793, AA27172, AA30941, JD7806.',
                'meta_title'       => 'VELNOX AA30941 VX — disc hub unit John Deere, CT-AGRI AA30941',
                'meta_description' => 'Disc hub unit VELNOX AA30941 VX for John Deere, d=45.24 mm, D=150 mm, Cdyn 32.5 kN. Replaces JD AA30941, CT-AGRI, FKL GW209PPB13. For disc seeder sections.',
            ],
            'pl' => [
                'desc'             => 'Dyskowy węzeł piasty AA30941 do siewników tarczowych i maszyn uprawowych John Deere, średnica wewnętrzna d = 45,24 mm (1,781"). Zewnętrzna średnica obudowy D = 150 mm, średnica centrująca Da = 93 mm, rozstaw śrub J = 120,5 mm, średnica otworów N = 13,5 mm, długość całkowita L = 48,5 mm, szerokość C = 30,1 mm, masa 1,836 kg; Cdyn = 32,5 kN, Co = 20,4 kN, Pu = 0,857 kN. Obudowa okrągła z centrowaniem na średnicy Da — geometria OEM John Deere. Bezpośredni zamiennik CT-AGRI AA30941, FKL GWST 209 PPB13 / GW209PPB13, KABAT P30941, RBF ST 209-1 3/4; odpowiada numerom OEM John Deere A33968, A34792, A34793, AA27172, AA30941, JD7806.',
                'meta_title'       => 'VELNOX AA30941 VX — dyskowy węzeł John Deere, CT-AGRI AA30941',
                'meta_description' => 'Dyskowy węzeł piasty VELNOX AA30941 VX do John Deere, d=45,24 mm, D=150 mm, Cdyn 32,5 kN. Zamiennik JD AA30941, CT-AGRI, FKL GW209PPB13. Do sekcji tarczowych.',
            ],
        ] as $locale => $fields) {
            foreach ($fields as $field => $value) {
                DB::table('translations')->updateOrInsert(
                    ['entity_type' => 'product', 'entity_id' => $pt4, 'locale' => $locale, 'field' => $field],
                    ['value' => $value]
                );
            }
        }

        // gallery (entity_type='product'): нові фото 0-4, старе фото + креслення 5-9
        foreach ([
            ['path' => '/velnox/images/products/agro-t4/velnox-aa30941-vx-photo-1.webp',  'sort_order' => 0],
            ['path' => '/velnox/images/products/agro-t4/velnox-aa30941-vx-photo-2.webp',  'sort_order' => 1],
            ['path' => '/velnox/images/products/agro-t4/velnox-aa30941-vx-photo-3.webp',  'sort_order' => 2],
            ['path' => '/velnox/images/products/agro-t4/velnox-aa30941-vx-photo-4.webp',  'sort_order' => 3],
            ['path' => '/velnox/images/products/agro-t4/velnox-aa30941-vx-photo-5.webp',  'sort_order' => 4],
            ['path' => '/velnox/images/products/agro-t4/velnox-aa30941-vx.webp',           'sort_order' => 5],
            ['path' => '/velnox/images/products/agro-t4/velnox-aa30941-vx-drawing-1.webp', 'sort_order' => 6],
            ['path' => '/velnox/images/products/agro-t4/velnox-aa30941-vx-drawing-2.webp', 'sort_order' => 7],
            ['path' => '/velnox/images/products/agro-t4/velnox-aa30941-vx-drawing-3.webp', 'sort_order' => 8],
            ['path' => '/velnox/images/products/agro-t4/velnox-aa30941-vx-drawing-4.webp', 'sort_order' => 9],
        ] as $asset) {
            DB::table('product_assets')->updateOrInsert(
                ['entity_type' => 'product', 'entity_id' => $pt4, 'type' => 'gallery', 'path' => $asset['path']],
                ['sort_order' => $asset['sort_order']]
            );
        }

        // =========================================================
        // 23. PRODUCT TABLE: kit-t1 (203KRR2-R3 VX — D-bore bearing)
        // =========================================================
        DB::table('product_tables')->updateOrInsert(
            ['slug' => 'kit-t1'],
            [
                'slug'             => 'kit-t1',
                'category_id'      => $catId('kit'),
                'spec_columns'     => json_encode(['d_mm','D_mm','B_mm','C_mm','mass_kg','cdyn_kn','co_kn','pu_kn']),
                'highlight_config' => json_encode([
                    'd_mm' => [['label' => 'd', 'x' => 233,  'y' => 757]],
                    'D_mm' => [['label' => 'D', 'x' => 176,  'y' => 759]],
                    'B_mm' => [['label' => 'B', 'x' => 1012, 'y' => 1061]],
                    'C_mm' => [['label' => 'C', 'x' => 1013, 'y' => 435]],
                ]),
                'schema_viewbox'   => '84 316 2193 1000',
                'sort_order'       => 1,
            ]
        );

        $kt1 = $tableId('kit-t1');

        foreach (['uk' => 'Спеціальні підшипники з D-подібним отвором', 'en' => 'Special Bearings with D-Bore', 'pl' => 'Specjalne łożyska z otworem D'] as $locale => $name) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $kt1, 'locale' => $locale, 'field' => 'name'],
                ['value' => $name]
            );
        }

        // Table-level assets (schema)
        foreach ([
            ['type' => 'schema_png', 'path' => '/velnox/images/products/kit-t1/velnox-203krr2-r3-vx-schema.webp', 'sort_order' => 0],
            ['type' => 'schema_svg', 'path' => '/velnox/images/products/kit-t1/schema.svg',                        'sort_order' => 0],
        ] as $asset) {
            DB::table('product_assets')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $kt1, 'type' => $asset['type'], 'path' => $asset['path']],
                ['sort_order' => $asset['sort_order']]
            );
        }

        // Product: 203KRR2-R3 VX
        DB::table('products')->updateOrInsert(
            ['slug' => '203krr2-r3-vx'],
            ['slug' => '203krr2-r3-vx', 'article' => '203KRR2-R3 VX', 'product_table_id' => $kt1]
        );
        $pk1 = DB::table('products')->where('slug', '203krr2-r3-vx')->value('id');

        // Specs
        foreach ([
            'd_mm'    => '16.26',
            'D_mm'    => '40',
            'B_mm'    => '18.29',
            'C_mm'    => '12',
            'mass_kg' => '0.07',
            'cdyn_kn' => '9.5',
            'co_kn'   => '4.75',
            'pu_kn'   => '0.2',
        ] as $key => $value) {
            $sid = $specId($key);
            if (!$sid) continue;
            DB::table('product_specs')->updateOrInsert(
                ['product_id' => $pk1, 'spec_id' => $sid],
                ['value' => $value]
            );
        }

        // Cross-refs
        DB::table('product_cross_refs')->where('product_id', $pk1)->delete();
        foreach ([
            ['value' => '203 KRR AH02',              'brand' => 'FKL',         'type' => 'bearing'],
            ['value' => '203 KRR AH02',              'brand' => 'INA',         'type' => 'bearing'],
            ['value' => '203 KRR2',                  'brand' => 'RBF',         'type' => 'bearing'],
            ['value' => '203 KRR2',                  'brand' => 'CT-AGRI',     'type' => 'bearing'],
            ['value' => '203 KRR2FD (PER.203RRY2)',  'brand' => 'PEER',        'type' => 'bearing'],
            ['value' => '203 KRR2-R3',               'brand' => 'CT-AGRI',     'type' => 'bearing'],
            ['value' => '203 RR2',                   'brand' => 'TIMKEN',      'type' => 'bearing'],
            ['value' => 'BB203 RR2',                 'brand' => 'TIMKEN',      'type' => 'bearing'],
            ['value' => 'BB203RR2FD',                'brand' => 'PEER',        'type' => 'bearing'],
            ['value' => '144819C91',                 'brand' => 'CASE',        'type' => 'application'],
            ['value' => '149261C91',                 'brand' => 'CASE',        'type' => 'application'],
            ['value' => '23091',                     'brand' => 'Will rich',   'type' => 'application'],
            ['value' => '3643380M1',                 'brand' => 'AGCO',        'type' => 'application'],
            ['value' => '520117',                    'brand' => 'Gehl',        'type' => 'application'],
            ['value' => '666624R91',                 'brand' => 'CASE',        'type' => 'application'],
            ['value' => '822-095C',                  'brand' => 'Great Plains', 'type' => 'application'],
            ['value' => 'AN100425',                  'brand' => 'JOHN DEERE',  'type' => 'application'],
            ['value' => 'B96.00410',                 'brand' => 'Grimme',      'type' => 'application'],
            ['value' => 'JD9214',                    'brand' => 'JOHN DEERE',  'type' => 'application'],
        ] as $ref) {
            DB::table('product_cross_refs')->insert(['product_id' => $pk1, 'value' => $ref['value'], 'brand' => $ref['brand'], 'type' => $ref['type']]);
        }

        // Product-level assets (gallery + 3D)
        foreach ([
            ['type' => 'gallery',   'path' => '/velnox/images/products/kit-t1/velnox-203krr2-r3-vx-photo-1.webp', 'sort_order' => 1],
            ['type' => 'gallery',   'path' => '/velnox/images/products/kit-t1/velnox-203krr2-r3-vx-photo-2.webp', 'sort_order' => 2],
            ['type' => 'gallery',   'path' => '/velnox/images/products/kit-t1/velnox-203krr2-r3-vx.webp',           'sort_order' => 3],
            ['type' => 'gallery',   'path' => '/velnox/images/products/kit-t1/velnox-203krr2-r3-vx-drawing-1.webp', 'sort_order' => 4],
            ['type' => 'gallery',   'path' => '/velnox/images/products/kit-t1/velnox-203krr2-r3-vx-drawing-2.webp', 'sort_order' => 5],
            ['type' => 'gallery',   'path' => '/velnox/images/products/kit-t1/velnox-203krr2-r3-vx-drawing-3.webp', 'sort_order' => 6],
            ['type' => 'model_3d',  'path' => '/velnox/models/203-KRR2-R3.glb',                                      'sort_order' => 0],
        ] as $asset) {
            DB::table('product_assets')->updateOrInsert(
                ['entity_type' => 'product', 'entity_id' => $pk1, 'type' => $asset['type'], 'path' => $asset['path']],
                ['sort_order' => $asset['sort_order']]
            );
        }

        // Translations: name + description (uk/en/pl)
        foreach (['uk', 'en', 'pl'] as $locale) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product', 'entity_id' => $pk1, 'locale' => $locale, 'field' => 'name'],
                ['value' => '203KRR2-R3 VX']
            );
        }

        foreach ([
            'uk' => 'Підшипник 203KRR2-R3 VX — однорядний радіальний кульковий підшипник із D-подібним отвором діаметром d = 16,26 мм для монтажу на плоский вал без додаткових стопорних елементів. Двобічне гумове ущільнення захищає від вологи та забруднень в умовах польових робіт. Зовнішній діаметр D = 40 мм, ширина внутрішнього кільця B = 18,29 мм, ширина зовнішнього кільця C = 12 мм. Динамічна вантажопідйомність Cdyn = 9,5 кН, статична Co = 4,75 кН. Застосовується в техніці CASE, John Deere, AGCO, Gehl, Grimme та Great Plains.',
            'en' => 'The 203KRR2-R3 VX is a single-row radial ball bearing with a D-shaped bore (d = 16.26 mm) designed for secure shaft retention without set screws in agricultural machinery. Double rubber seals protect against moisture and field contamination. Outer diameter D = 40 mm, inner ring width B = 18.29 mm, outer ring width C = 12 mm. Dynamic load capacity Cdyn = 9.5 kN, static Co = 4.75 kN. Compatible with CASE, John Deere, AGCO, Gehl, Grimme and Great Plains equipment.',
            'pl' => 'Łożysko 203KRR2-R3 VX to jednorzędowe promieniowe łożysko kulkowe z otworem w kształcie litery D (d = 16,26 mm) do montażu na wałach z płaszczyzną bez dodatkowych śrub ustalających. Podwójne uszczelnienia gumowe chronią przed wilgocią i zanieczyszczeniami podczas prac polowych. Średnica zewnętrzna D = 40 mm, szerokość pierścienia wewnętrznego B = 18,29 mm, szerokość pierścienia zewnętrznego C = 12 mm. Nośność dynamiczna Cdyn = 9,5 kN, statyczna Co = 4,75 kN. Kompatybilne z maszynami CASE, John Deere, AGCO, Gehl, Grimme i Great Plains.',
        ] as $locale => $desc) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product', 'entity_id' => $pk1, 'locale' => $locale, 'field' => 'desc'],
                ['value' => $desc]
            );
        }

        // =========================================================
        // 24. PRODUCT TABLE: kit-t2 (204PY3 VX — Round bore bearing)
        // =========================================================
        DB::table('product_tables')->updateOrInsert(
            ['slug' => 'kit-t2'],
            [
                'slug'             => 'kit-t2',
                'category_id'      => $catId('kit'),
                'spec_columns'     => json_encode(['d_mm','D_mm','B_mm','C_mm','mass_kg','cdyn_kn','co_kn']),
                'highlight_config' => json_encode([
                    'd_mm' => [['label' => 'd', 'x' => 293,  'y' => 2211]],
                    'D_mm' => [['label' => 'D', 'x' => 236,  'y' => 2218]],
                    'B_mm' => [['label' => 'B', 'x' => 1043, 'y' => 2493]],
                    'C_mm' => [['label' => 'C', 'x' => 1043, 'y' => 1891]],
                ]),
                'schema_viewbox'   => '143 1767 2229 881',
                'sort_order'       => 2,
            ]
        );

        $kt2 = $tableId('kit-t2');

        foreach (['uk' => 'Спеціальні підшипники з круглим отвором', 'en' => 'Special Bearings with Round Bore', 'pl' => 'Specjalne łożyska z okrągłym otworem'] as $locale => $name) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $kt2, 'locale' => $locale, 'field' => 'name'],
                ['value' => $name]
            );
        }

        foreach ([
            ['type' => 'schema_png', 'path' => '/velnox/images/products/kit-t2/velnox-204py3-vx-schema.webp', 'sort_order' => 0],
            ['type' => 'schema_svg', 'path' => '/velnox/images/products/kit-t2/schema.svg',                    'sort_order' => 0],
        ] as $asset) {
            DB::table('product_assets')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $kt2, 'type' => $asset['type'], 'path' => $asset['path']],
                ['sort_order' => $asset['sort_order']]
            );
        }

        DB::table('products')->updateOrInsert(
            ['slug' => '204py3-vx'],
            ['slug' => '204py3-vx', 'article' => '204PY3 VX', 'product_table_id' => $kt2]
        );
        $pk2 = DB::table('products')->where('slug', '204py3-vx')->value('id');

        foreach ([
            'd_mm'    => '16',
            'D_mm'    => '45.2',
            'B_mm'    => '18.67',
            'C_mm'    => '15.4',
            'mass_kg' => '0.13',
            'cdyn_kn' => '12.84',
            'co_kn'   => '6.65',
        ] as $key => $value) {
            $sid = $specId($key);
            if (!$sid) continue;
            DB::table('product_specs')->updateOrInsert(
                ['product_id' => $pk2, 'spec_id' => $sid],
                ['value' => $value]
            );
        }

        DB::table('product_cross_refs')->where('product_id', $pk2)->delete();
        foreach ([
            ['value' => '204 PF3 (PER.BB204RRP3-A)', 'brand' => 'PEER',    'type' => 'bearing'],
            ['value' => '204 PY2',                    'brand' => 'TIMKEN',  'type' => 'bearing'],
            ['value' => '204 PY3',                    'brand' => 'CT-AGRI', 'type' => 'bearing'],
            ['value' => '204 PY3',                    'brand' => 'RBF',     'type' => 'bearing'],
            ['value' => '204 PY3 (BB204RRY3)',        'brand' => 'TIMKEN',  'type' => 'bearing'],
            ['value' => '204 PY3',                    'brand' => 'PEER',    'type' => 'bearing'],
            ['value' => '06C04 2Z',                   'brand' => 'FKL',     'type' => 'bearing'],
            ['value' => '00240199',    'brand' => 'HORSCH',    'type' => 'application'],
            ['value' => '00310104',    'brand' => 'HORSCH',    'type' => 'application'],
            ['value' => '1260817R91',  'brand' => 'CASE',      'type' => 'application'],
            ['value' => '466635',      'brand' => 'Vaderstad',  'type' => 'application'],
            ['value' => '820-003C',    'brand' => 'GP',         'type' => 'application'],
            ['value' => '822-011C',    'brand' => 'GP',         'type' => 'application'],
            ['value' => '822-067C',    'brand' => 'GP',         'type' => 'application'],
            ['value' => 'AA21480',     'brand' => 'JD',         'type' => 'application'],
            ['value' => 'CA139',       'brand' => 'AMAZONE',    'type' => 'application'],
            ['value' => 'GA2014',      'brand' => 'KINZE',      'type' => 'application'],
            ['value' => 'K3030210',    'brand' => 'KUHN',       'type' => 'application'],
        ] as $ref) {
            DB::table('product_cross_refs')->insert(['product_id' => $pk2, 'value' => $ref['value'], 'brand' => $ref['brand'], 'type' => $ref['type']]);
        }

        foreach ([
            ['type' => 'gallery',  'path' => '/velnox/images/products/kit-t2/velnox-204py3-vx-photo-1.webp', 'sort_order' => 1],
            ['type' => 'gallery',  'path' => '/velnox/images/products/kit-t2/velnox-204py3-vx-photo-2.webp', 'sort_order' => 2],
            ['type' => 'gallery',  'path' => '/velnox/images/products/kit-t2/velnox-204py3-vx-photo-3.webp', 'sort_order' => 3],
            ['type' => 'gallery',  'path' => '/velnox/images/products/kit-t2/velnox-204py3-vx.webp',           'sort_order' => 4],
            ['type' => 'gallery',  'path' => '/velnox/images/products/kit-t2/velnox-204py3-vx-drawing-1.webp', 'sort_order' => 5],
            ['type' => 'gallery',  'path' => '/velnox/images/products/kit-t2/velnox-204py3-vx-drawing-2.webp', 'sort_order' => 6],
            ['type' => 'gallery',  'path' => '/velnox/images/products/kit-t2/velnox-204py3-vx-drawing-3.webp', 'sort_order' => 7],
            ['type' => 'model_3d', 'path' => '/velnox/models/204-PY3.glb',                                     'sort_order' => 0],
        ] as $asset) {
            DB::table('product_assets')->updateOrInsert(
                ['entity_type' => 'product', 'entity_id' => $pk2, 'type' => $asset['type'], 'path' => $asset['path']],
                ['sort_order' => $asset['sort_order']]
            );
        }

        foreach (['uk', 'en', 'pl'] as $locale) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product', 'entity_id' => $pk2, 'locale' => $locale, 'field' => 'name'],
                ['value' => '204PY3 VX']
            );
        }

        foreach ([
            'uk' => 'Підшипник 204PY3 VX — однорядний радіальний кульковий підшипник із круглим отвором діаметром d = 16 мм для прецизійного монтажу в посівних і ґрунтообробних секціях. Двобічне гумове ущільнення забезпечує захист від пилу та вологи. Зовнішній діаметр D = 45,2 мм, ширина внутрішнього кільця B = 18,67 мм, ширина зовнішнього кільця C = 15,4 мм, маса 0,13 кг. Динамічна вантажопідйомність Cdyn = 12,84 кН, статична Co = 6,65 кН. Пряма заміна TIMKEN 204 PY2 / BB204RRY3, PEER 204 PF3, FKL 06C04 2Z. Застосовується в техніці HORSCH, CASE, Vaderstad, Great Plains, John Deere, AMAZONE, KINZE та KUHN.',
            'en' => 'The 204PY3 VX is a single-row radial ball bearing with a round bore (d = 16 mm) for precision mounting in seeding and tillage sections. Double rubber seals protect against dust and moisture. Outer diameter D = 45.2 mm, inner ring width B = 18.67 mm, outer ring width C = 15.4 mm, weight 0.13 kg. Dynamic load capacity Cdyn = 12.84 kN, static Co = 6.65 kN. Direct replacement for TIMKEN 204 PY2 / BB204RRY3, PEER 204 PF3, FKL 06C04 2Z. Compatible with HORSCH, CASE, Vaderstad, Great Plains, John Deere, AMAZONE, KINZE and KUHN equipment.',
            'pl' => 'Łożysko 204PY3 VX to jednorzędowe promieniowe łożysko kulkowe z okrągłym otworem (d = 16 mm) do precyzyjnego montażu w sekcjach siewnych i uprawowych. Podwójne uszczelnienia gumowe chronią przed kurzem i wilgocią. Średnica zewnętrzna D = 45,2 mm, szerokość pierścienia wewnętrznego B = 18,67 mm, szerokość pierścienia zewnętrznego C = 15,4 mm, masa 0,13 kg. Nośność dynamiczna Cdyn = 12,84 kN, statyczna Co = 6,65 kN. Bezpośredni zamiennik TIMKEN 204 PY2 / BB204RRY3, PEER 204 PF3, FKL 06C04 2Z. Kompatybilne z maszynami HORSCH, CASE, Vaderstad, Great Plains, John Deere, AMAZONE, KINZE i KUHN.',
        ] as $locale => $desc) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product', 'entity_id' => $pk2, 'locale' => $locale, 'field' => 'desc'],
                ['value' => $desc]
            );
        }

        // =========================================================
        // 25. PRODUCT TABLE: kit-t3 (5203KYY3 VX — Double-row ball bearing)
        // =========================================================
        DB::table('product_tables')->updateOrInsert(
            ['slug' => 'kit-t3'],
            [
                'slug'             => 'kit-t3',
                'category_id'      => $catId('kit'),
                'spec_columns'     => json_encode(['d_mm','d1_mm','D_mm','B_mm','C_mm','alpha_deg','mass_kg','cdyn_kn','co_kn','pu_kn']),
                'highlight_config' => json_encode([
                    'B_mm'      => [['label' => 'B', 'x' => 951, 'y' => 927]],
                    'C_mm'      => [['label' => 'C', 'x' => 951, 'y' => 433]],
                    'alpha_deg' => [['label' => "\u{03b1}", 'x' => 1025, 'y' => 661], ['label' => "\u{03b1}", 'x' => 873, 'y' => 661]],
                ]),
                'schema_viewbox'   => '120 280 2150 800',
                'sort_order'       => 3,
            ]
        );

        $kt3 = $tableId('kit-t3');

        foreach (['uk' => 'Дворядні кулькові підшипники', 'en' => 'Double-Row Ball Bearings', 'pl' => 'Dwurzędowe łożyska kulkowe'] as $locale => $name) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $kt3, 'locale' => $locale, 'field' => 'name'],
                ['value' => $name]
            );
        }

        foreach ([
            ['type' => 'schema_png', 'path' => '/velnox/images/products/kit-t3/velnox-5203kyy3-vx-schema.webp', 'sort_order' => 0],
            ['type' => 'schema_svg', 'path' => '/velnox/images/products/kit-t3/schema.svg',                      'sort_order' => 0],
        ] as $asset) {
            DB::table('product_assets')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $kt3, 'type' => $asset['type'], 'path' => $asset['path']],
                ['sort_order' => $asset['sort_order']]
            );
        }

        DB::table('products')->updateOrInsert(
            ['slug' => '5203kyy3-vx'],
            ['slug' => '5203kyy3-vx', 'article' => '5203KYY3 VX', 'product_table_id' => $kt3]
        );
        $pk3 = DB::table('products')->where('slug', '5203kyy3-vx')->value('id');

        foreach ([
            'd_mm'      => '16.256',
            'd1_mm'     => '23.5',
            'D_mm'      => '40',
            'B_mm'      => '44.12',
            'C_mm'      => '39.12',
            'alpha_deg' => '30',
            'mass_kg'   => '0.218',
            'cdyn_kn'   => '14.2',
            'co_kn'     => '8.8',
            'pu_kn'     => '0.37',
        ] as $key => $value) {
            $sid = $specId($key);
            if (!$sid) continue;
            DB::table('product_specs')->updateOrInsert(
                ['product_id' => $pk3, 'spec_id' => $sid],
                ['value' => $value]
            );
        }

        DB::table('product_cross_refs')->where('product_id', $pk3)->delete();
        foreach ([
            ['value' => '5203 KPP2 (PER.5203RPP2)',       'brand' => 'PEER',      'type' => 'bearing'],
            ['value' => '5203 KPP2-A (PER.5203RPP2-A)',   'brand' => 'PEER',      'type' => 'bearing'],
            ['value' => '5203 KYY2 (PER.5203RYY2)',        'brand' => 'PEER',      'type' => 'bearing'],
            ['value' => '5203 KYY2',                       'brand' => 'RBF',       'type' => 'bearing'],
            ['value' => '5203 KYY2',                       'brand' => 'RBK',       'type' => 'bearing'],
            ['value' => '5203 KYY2',                       'brand' => 'TIMKEN',    'type' => 'bearing'],
            ['value' => '5203 KYY2',                       'brand' => 'CT-AGRI',   'type' => 'bearing'],
            ['value' => '5203 KYY2 (SL-5203 2T)',          'brand' => 'FKL',       'type' => 'bearing'],
            ['value' => 'DAC 164044 2RS',                  'brand' => 'NSK-RHP',   'type' => 'bearing'],
            ['value' => 'DAC 164044 2RS',                  'brand' => 'JTEKT',     'type' => 'bearing'],
            ['value' => 'F04100150R',  'brand' => 'GASPARDO',     'type' => 'application'],
            ['value' => '40-156',      'brand' => 'KRAUSE',       'type' => 'application'],
            ['value' => 'GA6171',      'brand' => 'KINZE',        'type' => 'application'],
            ['value' => '822-170C',    'brand' => 'GREAT PLAINS', 'type' => 'application'],
            ['value' => 'Y00513900',   'brand' => 'AMAZONE',      'type' => 'application'],
            ['value' => 'SN7218',      'brand' => 'SUNFLOWER',    'type' => 'application'],
            ['value' => '7140A',       'brand' => 'MONOSEM',      'type' => 'application'],
            ['value' => 'AN212132',    'brand' => 'JOHN DEERE',   'type' => 'application'],
            ['value' => '81101640',    'brand' => 'KUHN',         'type' => 'application'],
            ['value' => 'CA150',       'brand' => 'AMAZONE',      'type' => 'application'],
            ['value' => '900125',      'brand' => 'MONOSEM',      'type' => 'application'],
            ['value' => '310926',      'brand' => 'HORSCH',       'type' => 'application'],
            ['value' => 'AC676096',    'brand' => 'KVERNELAND',   'type' => 'application'],
            ['value' => '240216',      'brand' => 'HORSCH',       'type' => 'application'],
            ['value' => 'GA5641',      'brand' => 'KINZE',        'type' => 'application'],
        ] as $ref) {
            DB::table('product_cross_refs')->insert(['product_id' => $pk3, 'value' => $ref['value'], 'brand' => $ref['brand'], 'type' => $ref['type']]);
        }

        foreach ([
            ['type' => 'gallery',  'path' => '/velnox/images/products/kit-t3/velnox-5203kyy3-vx.webp',           'sort_order' => 0],
            ['type' => 'gallery',  'path' => '/velnox/images/products/kit-t3/velnox-5203kyy3-vx-drawing-1.webp', 'sort_order' => 1],
            ['type' => 'gallery',  'path' => '/velnox/images/products/kit-t3/velnox-5203kyy3-vx-drawing-2.webp', 'sort_order' => 2],
            ['type' => 'gallery',  'path' => '/velnox/images/products/kit-t3/velnox-5203kyy3-vx-drawing-3.webp', 'sort_order' => 3],
            ['type' => 'model_3d', 'path' => '/velnox/models/5203-KYY3.glb',                                     'sort_order' => 0],
        ] as $asset) {
            DB::table('product_assets')->updateOrInsert(
                ['entity_type' => 'product', 'entity_id' => $pk3, 'type' => $asset['type'], 'path' => $asset['path']],
                ['sort_order' => $asset['sort_order']]
            );
        }

        foreach (['uk', 'en', 'pl'] as $locale) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product', 'entity_id' => $pk3, 'locale' => $locale, 'field' => 'name'],
                ['value' => '5203KYY3 VX']
            );
        }

        foreach ([
            'uk' => 'Підшипник 5203KYY3 VX — дворядний радіально-упорний кульковий підшипник із круглим отвором діаметром d = 16,256 мм та кутом контакту α = 30°. Призначений для роботи в умовах комбінованих радіальних та осьових навантажень у посівних секціях та дискових агрегатах. Зовнішній діаметр D = 40 мм, ширина внутрішнього кільця B = 44,12 мм, ширина зовнішнього кільця C = 39,12 мм, діаметр бурту d1 = 23,5 мм, маса 0,218 кг. Динамічна вантажопідйомність Cdyn = 14,2 кН, статична Co = 8,8 кН, Pu = 0,37 кН. Пряма заміна TIMKEN/RBF/CT-AGRI 5203 KYY2, FKL SL-5203 2T, NSK-RHP DAC 164044 2RS. Застосовується в техніці GASPARDO, KRAUSE, KINZE, Great Plains, AMAZONE, SUNFLOWER, MONOSEM, John Deere, KUHN, HORSCH та KVERNELAND.',
            'en' => 'The 5203KYY3 VX is a double-row angular contact ball bearing with a round bore (d = 16.256 mm) and contact angle α = 30°. Designed for combined radial and axial loads in seeding sections and disc tillage equipment. Outer diameter D = 40 mm, inner ring width B = 44.12 mm, outer ring width C = 39.12 mm, shoulder diameter d1 = 23.5 mm, weight 0.218 kg. Dynamic load capacity Cdyn = 14.2 kN, static Co = 8.8 kN, Pu = 0.37 kN. Direct replacement for TIMKEN/RBF/CT-AGRI 5203 KYY2, FKL SL-5203 2T, NSK-RHP DAC 164044 2RS. Compatible with GASPARDO, KRAUSE, KINZE, Great Plains, AMAZONE, SUNFLOWER, MONOSEM, John Deere, KUHN, HORSCH and KVERNELAND equipment.',
            'pl' => 'Łożysko 5203KYY3 VX to dwurzędowe skośne łożysko kulkowe z okrągłym otworem (d = 16,256 mm) i kątem kontaktu α = 30°. Przeznaczone do pracy przy kombinowanych obciążeniach promieniowych i osiowych w sekcjach siewnych i maszynach talerzowych. Średnica zewnętrzna D = 40 mm, szerokość pierścienia wewnętrznego B = 44,12 mm, szerokość pierścienia zewnętrznego C = 39,12 mm, średnica kołnierza d1 = 23,5 mm, masa 0,218 kg. Nośność dynamiczna Cdyn = 14,2 kN, statyczna Co = 8,8 kN, Pu = 0,37 kN. Bezpośredni zamiennik TIMKEN/RBF/CT-AGRI 5203 KYY2, FKL SL-5203 2T, NSK-RHP DAC 164044 2RS. Kompatybilne z maszynami GASPARDO, KRAUSE, KINZE, Great Plains, AMAZONE, SUNFLOWER, MONOSEM, John Deere, KUHN, HORSCH i KVERNELAND.',
        ] as $locale => $desc) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product', 'entity_id' => $pk3, 'locale' => $locale, 'field' => 'desc'],
                ['value' => $desc]
            );
        }

        // =========================================================
        // 26. PRODUCT TABLE: kit-t4 (5206KPP3 VX — Double-row D-bore)
        // =========================================================
        DB::table('product_tables')->updateOrInsert(
            ['slug' => 'kit-t4'],
            [
                'slug'             => 'kit-t4',
                'category_id'      => $catId('kit'),
                'spec_columns'     => json_encode(['cdyn_kn','co_kn','D_mm','d_mm','C_mm','mass_kg','B_mm','alpha_deg']),
                'highlight_config' => json_encode([
                    'd_mm'      => [['label' => 'd', 'x' => 232, 'y' => 2195], ['label' => 'd', 'x' => 1122, 'y' => 2196]],
                    'D_mm'      => [['label' => 'D', 'x' => 177, 'y' => 2197]],
                    'B_mm'      => [['label' => 'B', 'x' => 928, 'y' => 2448]],
                    'C_mm'      => [['label' => 'C', 'x' => 933, 'y' => 1920]],
                    'alpha_deg' => [['label' => 'α', 'x' => 837, 'y' => 2153], ['label' => 'α', 'x' => 1020, 'y' => 2150]],
                ]),
                'schema_viewbox'   => '143 1847 2129 737',
                'sort_order'       => 4,
            ]
        );

        $kt4 = $tableId('kit-t4');

        foreach (['uk' => 'Дворядні підшипники з D-подібним отвором', 'en' => 'Double-Row Bearings with D-Bore', 'pl' => 'Dwurzędowe łożyska z otworem D'] as $locale => $name) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $kt4, 'locale' => $locale, 'field' => 'name'],
                ['value' => $name]
            );
        }

        foreach ([
            ['type' => 'schema_png', 'path' => '/velnox/images/products/kit-t4/velnox-5206kpp3-vx-schema.webp', 'sort_order' => 0],
            ['type' => 'schema_svg', 'path' => '/velnox/images/products/kit-t4/schema.svg',                      'sort_order' => 0],
        ] as $asset) {
            DB::table('product_assets')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $kt4, 'type' => $asset['type'], 'path' => $asset['path']],
                ['sort_order' => $asset['sort_order']]
            );
        }

        DB::table('products')->updateOrInsert(
            ['slug' => '5206kpp3-vx'],
            ['slug' => '5206kpp3-vx', 'article' => '5206KPP3 VX', 'product_table_id' => $kt4]
        );
        $pk4 = DB::table('products')->where('slug', '5206kpp3-vx')->value('id');

        foreach ([
            'd_mm'      => '30.15',
            'D_mm'      => '62',
            'B_mm'      => '50',
            'C_mm'      => '37',
            'alpha_deg' => '25',
            'mass_kg'   => '0.5',
            'cdyn_kn'   => '28.7',
            'co_kn'     => '21.8',
        ] as $key => $value) {
            $sid = $specId($key);
            if (!$sid) continue;
            DB::table('product_specs')->updateOrInsert(
                ['product_id' => $pk4, 'spec_id' => $sid],
                ['value' => $value]
            );
        }

        DB::table('product_cross_refs')->where('product_id', $pk4)->delete();
        foreach ([
            ['value' => '5206 KPP3',                  'brand' => 'PFI',     'type' => 'bearing'],
            ['value' => '5206 KPP3',                  'brand' => 'TIMKEN',  'type' => 'bearing'],
            ['value' => '5206 KPP3',                  'brand' => 'RBF',     'type' => 'bearing'],
            ['value' => '5206 KPP3',                  'brand' => 'CT-AGRI', 'type' => 'bearing'],
            ['value' => '5206 KPP3',                  'brand' => 'FKL',     'type' => 'bearing'],
            ['value' => '5206 KPP3 (PER.5206RPP3)',   'brand' => 'PEER',    'type' => 'bearing'],
            ['value' => '822-215C',                    'brand' => 'GREAT PLAINS', 'type' => 'application'],
            ['value' => '87283953',                    'brand' => 'CASE',         'type' => 'application'],
            ['value' => 'AN261766/AN261637',           'brand' => 'JD',           'type' => 'application'],
            ['value' => 'GA8603',                      'brand' => 'KINZE 3000',   'type' => 'application'],
            ['value' => 'GA8641',                      'brand' => 'KINZE',        'type' => 'application'],
        ] as $ref) {
            DB::table('product_cross_refs')->insert(['product_id' => $pk4, 'value' => $ref['value'], 'brand' => $ref['brand'], 'type' => $ref['type']]);
        }

        foreach ([
            ['type' => 'model_3d', 'path' => '/velnox/models/5206-KPP3.glb',                                 'sort_order' => 0],
            ['type' => 'gallery',  'path' => '/velnox/images/products/kit-t4/velnox-5206kpp3-vx.webp',           'sort_order' => 0],
            ['type' => 'gallery',  'path' => '/velnox/images/products/kit-t4/velnox-5206kpp3-vx-photo-1.webp',   'sort_order' => 1],
            ['type' => 'gallery',  'path' => '/velnox/images/products/kit-t4/velnox-5206kpp3-vx-drawing-1.webp', 'sort_order' => 2],
            ['type' => 'gallery',  'path' => '/velnox/images/products/kit-t4/velnox-5206kpp3-vx-drawing-2.webp', 'sort_order' => 3],
            ['type' => 'gallery',  'path' => '/velnox/images/products/kit-t4/velnox-5206kpp3-vx-drawing-3.webp', 'sort_order' => 4],
        ] as $asset) {
            DB::table('product_assets')->updateOrInsert(
                ['entity_type' => 'product', 'entity_id' => $pk4, 'type' => $asset['type'], 'path' => $asset['path']],
                ['sort_order' => $asset['sort_order']]
            );
        }

        foreach (['uk', 'en', 'pl'] as $locale) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product', 'entity_id' => $pk4, 'locale' => $locale, 'field' => 'name'],
                ['value' => '5206KPP3 VX']
            );
        }

        foreach ([
            'uk' => 'Підшипник 5206KPP3 VX — дворядний радіально-упорний кульковий підшипник із D-подібним отвором діаметром d = 30,15 мм та кутом контакту α = 25°. Конструкція D-bore забезпечує надійне фіксування на валу без стопорних елементів. Зовнішній діаметр D = 62 мм, ширина внутрішнього кільця B = 50 мм, ширина зовнішнього кільця C = 37 мм, маса 0,5 кг. Динамічна вантажопідйомність Cdyn = 28,7 кН, статична Co = 21,8 кН. Пряма заміна PFI/TIMKEN/RBF/CT-AGRI/FKL 5206 KPP3, PEER 5206RPP3. Застосовується в техніці Great Plains (822-215C), CASE (87283953), John Deere (AN261766/AN261637) та KINZE (GA8603, GA8641).',
            'en' => 'The 5206KPP3 VX is a double-row angular contact ball bearing with a D-shaped bore (d = 30.15 mm) and contact angle α = 25°. The D-bore design ensures secure shaft retention without additional locking elements. Outer diameter D = 62 mm, inner ring width B = 50 mm, outer ring width C = 37 mm, weight 0.5 kg. Dynamic load capacity Cdyn = 28.7 kN, static Co = 21.8 kN. Direct replacement for PFI/TIMKEN/RBF/CT-AGRI/FKL 5206 KPP3, PEER 5206RPP3. Compatible with Great Plains (822-215C), CASE (87283953), John Deere (AN261766/AN261637) and KINZE (GA8603, GA8641) equipment.',
            'pl' => 'Łożysko 5206KPP3 VX to dwurzędowe skośne łożysko kulkowe z otworem w kształcie litery D (d = 30,15 mm) i kątem kontaktu α = 25°. Konstrukcja D-bore zapewnia pewne mocowanie na wale bez dodatkowych elementów blokujących. Średnica zewnętrzna D = 62 mm, szerokość pierścienia wewnętrznego B = 50 mm, szerokość pierścienia zewnętrznego C = 37 mm, masa 0,5 kg. Nośność dynamiczna Cdyn = 28,7 kN, statyczna Co = 21,8 kN. Bezpośredni zamiennik PFI/TIMKEN/RBF/CT-AGRI/FKL 5206 KPP3, PEER 5206RPP3. Kompatybilne z maszynami Great Plains (822-215C), CASE (87283953), John Deere (AN261766/AN261637) i KINZE (GA8603, GA8641).',
        ] as $locale => $desc) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product', 'entity_id' => $pk4, 'locale' => $locale, 'field' => 'desc'],
                ['value' => $desc]
            );
        }

        // =========================================================
        // 27. PRODUCT TABLE: kit-t5 (885154B VX — Needle bearing)
        // =========================================================
        DB::table('product_tables')->updateOrInsert(
            ['slug' => 'kit-t5'],
            [
                'slug'             => 'kit-t5',
                'category_id'      => $catId('kit'),
                'spec_columns'     => json_encode(['d_mm','d1_mm','D_mm','L_mm','C_mm','E_mm','mass_kg','cdyn_kn','co_kn','pu_kn']),
                'highlight_config' => json_encode((object)[]),
                'schema_viewbox'   => '',
                'sort_order'       => 5,
            ]
        );

        $kt5 = $tableId('kit-t5');

        foreach (['uk' => 'Спеціальні голкові підшипники', 'en' => 'Special Needle Bearings', 'pl' => 'Specjalne łożyska igiełkowe'] as $locale => $name) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $kt5, 'locale' => $locale, 'field' => 'name'],
                ['value' => $name]
            );
        }

        foreach ([
            ['type' => 'schema_png', 'path' => '/velnox/images/products/kit-t5/velnox-885154b-vx-schema.webp', 'sort_order' => 0],
        ] as $asset) {
            DB::table('product_assets')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $kt5, 'type' => $asset['type'], 'path' => $asset['path']],
                ['sort_order' => $asset['sort_order']]
            );
        }

        DB::table('products')->updateOrInsert(
            ['slug' => '885154b-vx'],
            ['slug' => '885154b-vx', 'article' => '885154B VX', 'product_table_id' => $kt5]
        );
        $pk5 = DB::table('products')->where('slug', '885154b-vx')->value('id');

        foreach ([
            'd_mm'    => '15.88',
            'd1_mm'   => '12',
            'D_mm'    => '30',
            'L_mm'    => '69',
            'C_mm'    => '38.8',
            'E_mm'    => '5',
            'mass_kg' => '0.183',
            'cdyn_kn' => '5.15',
            'co_kn'   => '2.94',
            'pu_kn'   => '0.124',
        ] as $key => $value) {
            $sid = $specId($key);
            if (!$sid) continue;
            DB::table('product_specs')->updateOrInsert(
                ['product_id' => $pk5, 'spec_id' => $sid],
                ['value' => $value]
            );
        }

        DB::table('product_cross_refs')->where('product_id', $pk5)->delete();
        foreach ([
            ['value' => '885154B',                   'brand' => 'CT-AGRI',       'type' => 'bearing'],
            ['value' => 'IB06930 SRS',               'brand' => 'RBF',           'type' => 'bearing'],
            ['value' => 'IB06930 SRS',               'brand' => 'JTEKT (Koyo)',  'type' => 'bearing'],
            ['value' => 'PN 00043',                  'brand' => 'RBF',           'type' => 'bearing'],
            ['value' => 'WP5203-KRP2-N-A217',        'brand' => 'PEER',          'type' => 'bearing'],
            ['value' => '00310131',    'brand' => 'Horsch',       'type' => 'application'],
            ['value' => '201765C91',   'brand' => 'CASE',         'type' => 'application'],
            ['value' => '227914R91',   'brand' => 'CASE',         'type' => 'application'],
            ['value' => '822-023C',    'brand' => 'Great Plains', 'type' => 'application'],
            ['value' => '885154B',     'brand' => 'JD',           'type' => 'application'],
            ['value' => '96140018',    'brand' => 'HORSCH',       'type' => 'application'],
            ['value' => 'AN131668',    'brand' => 'JD',           'type' => 'application'],
            ['value' => 'AN131688',    'brand' => 'JD',           'type' => 'application'],
        ] as $ref) {
            DB::table('product_cross_refs')->insert(['product_id' => $pk5, 'value' => $ref['value'], 'brand' => $ref['brand'], 'type' => $ref['type']]);
        }

        foreach ([
            ['type' => 'model_3d', 'path' => '/velnox/models/885154B.glb',                                    'sort_order' => 0],
            ['type' => 'gallery',  'path' => '/velnox/images/products/kit-t5/velnox-885154b-vx.webp',           'sort_order' => 0],
            ['type' => 'gallery',  'path' => '/velnox/images/products/kit-t5/velnox-885154b-vx-photo-1.webp',   'sort_order' => 1],
            ['type' => 'gallery',  'path' => '/velnox/images/products/kit-t5/velnox-885154b-vx-photo-2.webp',   'sort_order' => 2],
            ['type' => 'gallery',  'path' => '/velnox/images/products/kit-t5/velnox-885154b-vx-photo-3.webp',   'sort_order' => 3],
            ['type' => 'gallery',  'path' => '/velnox/images/products/kit-t5/velnox-885154b-vx-photo-4.webp',   'sort_order' => 4],
            ['type' => 'gallery',  'path' => '/velnox/images/products/kit-t5/velnox-885154b-vx-drawing-1.webp', 'sort_order' => 5],
            ['type' => 'gallery',  'path' => '/velnox/images/products/kit-t5/velnox-885154b-vx-drawing-2.webp', 'sort_order' => 6],
        ] as $asset) {
            DB::table('product_assets')->updateOrInsert(
                ['entity_type' => 'product', 'entity_id' => $pk5, 'type' => $asset['type'], 'path' => $asset['path']],
                ['sort_order' => $asset['sort_order']]
            );
        }

        foreach (['uk', 'en', 'pl'] as $locale) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product', 'entity_id' => $pk5, 'locale' => $locale, 'field' => 'name'],
                ['value' => '885154B VX']
            );
        }

        foreach ([
            'uk' => 'Підшипник 885154B VX — спеціальний голковий підшипник із посадковим діаметром d = 15,88 мм та внутрішнім діаметром обойми d1 = 12 мм. Зовнішній діаметр D = 30 мм, довжина L = 69 мм, ширина зовнішнього кільця C = 38,8 мм, відстань до буртика E = 5 мм, маса 0,183 кг. Динамічна вантажопідйомність Cdyn = 5,15 кН, статична Co = 2,94 кН, Pu = 0,124 кН. Голкова конструкція забезпечує високу радіальну вантажопідйомність при мінімальному радіальному перерізі. Пряма заміна CT-AGRI 885154B, RBF/JTEKT (Koyo) IB06930 SRS, RBF PN 00043, PEER WP5203-KRP2-N-A217. Застосовується в техніці Horsch (00310131, 96140018), CASE (201765C91, 227914R91), Great Plains (822-023C) та John Deere (885154B, AN131668, AN131688).',
            'en' => 'The 885154B VX is a special needle bearing with bore diameter d = 15.88 mm and inner race diameter d1 = 12 mm. Outer diameter D = 30 mm, length L = 69 mm, outer ring width C = 38.8 mm, shoulder distance E = 5 mm, weight 0.183 kg. Dynamic load capacity Cdyn = 5.15 kN, static Co = 2.94 kN, Pu = 0.124 kN. The needle roller design provides high radial load capacity with minimal radial cross-section. Direct replacement for CT-AGRI 885154B, RBF/JTEKT (Koyo) IB06930 SRS, RBF PN 00043, PEER WP5203-KRP2-N-A217. Compatible with Horsch (00310131, 96140018), CASE (201765C91, 227914R91), Great Plains (822-023C) and John Deere (885154B, AN131668, AN131688) equipment.',
            'pl' => 'Łożysko 885154B VX to specjalne łożysko igiełkowe o średnicy otworu d = 15,88 mm i średnicy wewnętrznej bieżni d1 = 12 mm. Średnica zewnętrzna D = 30 mm, długość L = 69 mm, szerokość pierścienia zewnętrznego C = 38,8 mm, odległość do kołnierza E = 5 mm, masa 0,183 kg. Nośność dynamiczna Cdyn = 5,15 kN, statyczna Co = 2,94 kN, Pu = 0,124 kN. Konstrukcja igiełkowa zapewnia wysoką nośność promieniową przy minimalnym przekroju poprzecznym. Bezpośredni zamiennik CT-AGRI 885154B, RBF/JTEKT (Koyo) IB06930 SRS, RBF PN 00043, PEER WP5203-KRP2-N-A217. Kompatybilne z maszynami Horsch (00310131, 96140018), CASE (201765C91, 227914R91), Great Plains (822-023C) i John Deere (885154B, AN131668, AN131688).',
        ] as $locale => $desc) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product', 'entity_id' => $pk5, 'locale' => $locale, 'field' => 'desc'],
                ['value' => $desc]
            );
        }

        // =========================================================
        // 28. PRODUCT TABLE: kit-t6 (AA205DD VX — D-bore Great Plains)
        // =========================================================
        DB::table('product_tables')->updateOrInsert(
            ['slug' => 'kit-t6'],
            [
                'slug'             => 'kit-t6',
                'category_id'      => $catId('kit'),
                'spec_columns'     => json_encode(['shaft_d_mm','d1_mm','D_mm','B_mm','C_mm','alpha_deg','mass_kg','cdyn_kn','co_kn','pu_kn']),
                'highlight_config' => json_encode([
                    'shaft_d_mm'      => [['label' => 'd', 'x' => 251, 'y' => 2248]],
                    'd1_mm'     => [['label' => 'd1', 'x' => 1076, 'y' => 2245]],
                    'D_mm'      => [['label' => 'D', 'x' => 208, 'y' => 2250]],
                    'B_mm'      => [['label' => 'B', 'x' => 966, 'y' => 2516]],
                    'C_mm'      => [['label' => 'C', 'x' => 963, 'y' => 1938]],
                    'alpha_deg' => [['label' => 'α', 'x' => 997, 'y' => 2194]],
                ]),
                'schema_viewbox'   => '174 1788 2105 793',
                'sort_order'       => 6,
            ]
        );

        $kt6 = $tableId('kit-t6');

        foreach (['uk' => 'Підшипники з D-подібним отвором (Great Plains)', 'en' => 'Bearings with D-Bore (Great Plains)', 'pl' => 'Łożyska z otworem D (Great Plains)'] as $locale => $name) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $kt6, 'locale' => $locale, 'field' => 'name'],
                ['value' => $name]
            );
        }

        foreach ([
            ['type' => 'schema_png', 'path' => '/velnox/images/products/kit-t6/velnox-aa205dd-vx-schema.webp', 'sort_order' => 0],
            ['type' => 'schema_svg', 'path' => '/velnox/images/products/kit-t6/schema.svg',                     'sort_order' => 0],
        ] as $asset) {
            DB::table('product_assets')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $kt6, 'type' => $asset['type'], 'path' => $asset['path']],
                ['sort_order' => $asset['sort_order']]
            );
        }

        DB::table('products')->updateOrInsert(
            ['slug' => 'aa205dd-vx'],
            ['slug' => 'aa205dd-vx', 'article' => 'AA205DD VX', 'product_table_id' => $kt6]
        );
        $pk6 = DB::table('products')->where('slug', 'aa205dd-vx')->value('id');

        foreach ([
            'shaft_d_mm'      => '16',
            'd1_mm'     => '33.74',
            'D_mm'      => '53.086',
            'B_mm'      => '19.4',
            'C_mm'      => '18.288',
            'alpha_deg' => '25',
            'mass_kg'   => '0.21',
            'cdyn_kn'   => '14.02',
            'co_kn'     => '7.82',
            'pu_kn'     => '0.328',
        ] as $key => $value) {
            $sid = $specId($key);
            if (!$sid) continue;
            DB::table('product_specs')->updateOrInsert(
                ['product_id' => $pk6, 'spec_id' => $sid],
                ['value' => $value]
            );
        }

        DB::table('product_cross_refs')->where('product_id', $pk6)->delete();
        foreach ([
            ['value' => '188-001V (AA 205 DD)',        'brand' => 'Great Plains', 'type' => 'bearing'],
            ['value' => '205 GP',                      'brand' => 'Great Plains', 'type' => 'bearing'],
            ['value' => '205 PP13',                    'brand' => 'RBF',          'type' => 'bearing'],
            ['value' => 'PER.BB205RPP13',              'brand' => 'PEER',         'type' => 'bearing'],
            ['value' => 'AA 205 DD',                   'brand' => 'RBK',          'type' => 'bearing'],
            ['value' => 'AA 205 DD',                   'brand' => 'CT-AGRI',      'type' => 'bearing'],
            ['value' => 'AA 205 DD (376905 EKL19)',    'brand' => 'HARP',         'type' => 'bearing'],
            ['value' => 'AA 205 DD (SL5316-2T)',       'brand' => 'FKL',          'type' => 'bearing'],
            ['value' => '100-001V',    'brand' => '',       'type' => 'application'],
            ['value' => '188-001V',    'brand' => '',       'type' => 'application'],
            ['value' => '205DDS5/8',   'brand' => '',       'type' => 'application'],
            ['value' => '205GP',       'brand' => '',       'type' => 'application'],
            ['value' => '205VVH1',     'brand' => '',       'type' => 'application'],
            ['value' => '40-172',      'brand' => 'KRAUSE', 'type' => 'application'],
            ['value' => '822-236C',    'brand' => 'GP',     'type' => 'application'],
            ['value' => 'BB 205 RPP13','brand' => 'PEER',   'type' => 'application'],
        ] as $ref) {
            DB::table('product_cross_refs')->insert(['product_id' => $pk6, 'value' => $ref['value'], 'brand' => $ref['brand'], 'type' => $ref['type']]);
        }

        foreach ([
            ['type' => 'gallery', 'path' => '/velnox/images/products/kit-t6/velnox-aa205dd-vx.webp',           'sort_order' => 0],
            ['type' => 'gallery', 'path' => '/velnox/images/products/kit-t6/velnox-aa205dd-vx-drawing-1.webp', 'sort_order' => 1],
            ['type' => 'gallery', 'path' => '/velnox/images/products/kit-t6/velnox-aa205dd-vx-drawing-2.webp', 'sort_order' => 2],
            ['type' => 'gallery', 'path' => '/velnox/images/products/kit-t6/velnox-aa205dd-vx-drawing-3.webp', 'sort_order' => 3],
        ] as $asset) {
            DB::table('product_assets')->updateOrInsert(
                ['entity_type' => 'product', 'entity_id' => $pk6, 'type' => $asset['type'], 'path' => $asset['path']],
                ['sort_order' => $asset['sort_order']]
            );
        }

        foreach (['uk', 'en', 'pl'] as $locale) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product', 'entity_id' => $pk6, 'locale' => $locale, 'field' => 'name'],
                ['value' => 'AA205DD VX']
            );
        }

        foreach ([
            'uk' => 'Підшипник AA205DD VX — радіальний кульковий підшипник із D-подібним отвором діаметром d = 16 мм та кутом контакту α = 25° для посівних секцій Great Plains. Діаметр бурту d1 = 33,74 мм, зовнішній діаметр D = 53,086 мм, ширина внутрішнього кільця B = 19,4 мм, ширина зовнішнього кільця C = 18,288 мм, маса 0,21 кг. Динамічна вантажопідйомність Cdyn = 14,02 кН, статична Co = 7,82 кН, Pu = 0,328 кН. Пряма заміна Great Plains 188-001V / 205 GP, RBF 205 PP13, PEER BB205RPP13, HARP 376905 EKL19, FKL SL5316-2T. Застосовується в сівалках Great Plains (822-236C) та техніці KRAUSE (40-172).',
            'en' => 'The AA205DD VX is a radial ball bearing with a D-shaped bore (d = 16 mm) and contact angle α = 25° for Great Plains seeding sections. Shoulder diameter d1 = 33.74 mm, outer diameter D = 53.086 mm, inner ring width B = 19.4 mm, outer ring width C = 18.288 mm, weight 0.21 kg. Dynamic load capacity Cdyn = 14.02 kN, static Co = 7.82 kN, Pu = 0.328 kN. Direct replacement for Great Plains 188-001V / 205 GP, RBF 205 PP13, PEER BB205RPP13, HARP 376905 EKL19, FKL SL5316-2T. Compatible with Great Plains seeders (822-236C) and KRAUSE (40-172) equipment.',
            'pl' => 'Łożysko AA205DD VX to promieniowe łożysko kulkowe z otworem w kształcie litery D (d = 16 mm) i kątem kontaktu α = 25° do sekcji siewnych Great Plains. Średnica kołnierza d1 = 33,74 mm, średnica zewnętrzna D = 53,086 mm, szerokość pierścienia wewnętrznego B = 19,4 mm, szerokość pierścienia zewnętrznego C = 18,288 mm, masa 0,21 kg. Nośność dynamiczna Cdyn = 14,02 kN, statyczna Co = 7,82 kN, Pu = 0,328 kN. Bezpośredni zamiennik Great Plains 188-001V / 205 GP, RBF 205 PP13, PEER BB205RPP13, HARP 376905 EKL19, FKL SL5316-2T. Kompatybilne z siewnikami Great Plains (822-236C) i maszynami KRAUSE (40-172).',
        ] as $locale => $desc) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product', 'entity_id' => $pk6, 'locale' => $locale, 'field' => 'desc'],
                ['value' => $desc]
            );
        }

        // =========================================================
        // 29. PRODUCT TABLE: kit-t7 (AA59196 VX — Double-row round bore)
        // =========================================================
        DB::table('product_tables')->updateOrInsert(
            ['slug' => 'kit-t7'],
            [
                'slug'             => 'kit-t7',
                'category_id'      => $catId('kit'),
                'spec_columns'     => json_encode(['shaft_d_mm','D_mm','B_mm','C_mm','alpha_deg','mass_kg','cdyn_kn','co_kn','pu_kn']),
                'highlight_config' => json_encode([
                    'shaft_d_mm'      => [['label' => 'd', 'x' => 224, 'y' => 708]],
                    'D_mm'      => [['label' => 'D', 'x' => 176, 'y' => 707]],
                    'B_mm'      => [['label' => 'B', 'x' => 883, 'y' => 942]],
                    'C_mm'      => [['label' => 'C', 'x' => 873, 'y' => 442]],
                    'alpha_deg' => [['label' => 'α', 'x' => 802, 'y' => 649], ['label' => 'α', 'x' => 929, 'y' => 648]],
                ]),
                'schema_viewbox'   => '142 337 2165 727',
                'sort_order'       => 7,
            ]
        );

        $kt7 = $tableId('kit-t7');

        foreach (['uk' => 'Дворядні кулькові підшипники з круглим отвором', 'en' => 'Double-Row Ball Bearings with Round Bore', 'pl' => 'Dwurzędowe łożyska kulkowe z okrągłym otworem'] as $locale => $name) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $kt7, 'locale' => $locale, 'field' => 'name'],
                ['value' => $name]
            );
        }

        foreach ([
            ['type' => 'schema_png', 'path' => '/velnox/images/products/kit-t7/velnox-aa59196-vx-schema.webp', 'sort_order' => 0],
            ['type' => 'schema_svg', 'path' => '/velnox/images/products/kit-t7/schema.svg',                     'sort_order' => 0],
        ] as $asset) {
            DB::table('product_assets')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $kt7, 'type' => $asset['type'], 'path' => $asset['path']],
                ['sort_order' => $asset['sort_order']]
            );
        }

        DB::table('products')->updateOrInsert(
            ['slug' => 'aa59196-vx'],
            ['slug' => 'aa59196-vx', 'article' => 'AA59196 VX', 'product_table_id' => $kt7]
        );
        $pk7 = DB::table('products')->where('slug', 'aa59196-vx')->value('id');

        foreach ([
            'shaft_d_mm'      => '16.027',
            'D_mm'      => '45.225',
            'B_mm'      => '26',
            'C_mm'      => '22.82',
            'alpha_deg' => '20',
            'mass_kg'   => '0.19',
            'cdyn_kn'   => '16.3',
            'co_kn'     => '10.9',
            'pu_kn'     => '0.458',
        ] as $key => $value) {
            $sid = $specId($key);
            if (!$sid) continue;
            DB::table('product_specs')->updateOrInsert(
                ['product_id' => $pk7, 'spec_id' => $sid],
                ['value' => $value]
            );
        }

        DB::table('product_cross_refs')->where('product_id', $pk7)->delete();
        foreach ([
            ['value' => '5204 KRY2-R-A268 (PER.5204RRY2)', 'brand' => 'PEER',    'type' => 'bearing'],
            ['value' => '5204 РУ3',                         'brand' => 'RBF',     'type' => 'bearing'],
            ['value' => 'A59196',                            'brand' => 'CT-AGRI', 'type' => 'bearing'],
            ['value' => 'P59196',                            'brand' => 'KABAT',   'type' => 'bearing'],
            ['value' => '60021679', 'brand' => 'HORSCH', 'type' => 'application'],
            ['value' => '60054734', 'brand' => 'HORSCH', 'type' => 'application'],
            ['value' => 'AA104813', 'brand' => 'JD',     'type' => 'application'],
            ['value' => 'AA59196',  'brand' => 'JD',     'type' => 'application'],
            ['value' => 'GA26920',  'brand' => 'KINZE',  'type' => 'application'],
        ] as $ref) {
            DB::table('product_cross_refs')->insert(['product_id' => $pk7, 'value' => $ref['value'], 'brand' => $ref['brand'], 'type' => $ref['type']]);
        }

        // gallery (entity_type='product'): нові фото 0-4, старе фото + креслення 5-8
        foreach ([
            ['path' => '/velnox/images/products/kit-t7/velnox-aa59196-vx-photo-1.webp',  'sort_order' => 0],
            ['path' => '/velnox/images/products/kit-t7/velnox-aa59196-vx-photo-2.webp',  'sort_order' => 1],
            ['path' => '/velnox/images/products/kit-t7/velnox-aa59196-vx-photo-3.webp',  'sort_order' => 2],
            ['path' => '/velnox/images/products/kit-t7/velnox-aa59196-vx-photo-4.webp',  'sort_order' => 3],
            ['path' => '/velnox/images/products/kit-t7/velnox-aa59196-vx-photo-5.webp',  'sort_order' => 4],
            ['path' => '/velnox/images/products/kit-t7/velnox-aa59196-vx.webp',           'sort_order' => 5],
            ['path' => '/velnox/images/products/kit-t7/velnox-aa59196-vx-drawing-1.webp', 'sort_order' => 6],
            ['path' => '/velnox/images/products/kit-t7/velnox-aa59196-vx-drawing-2.webp', 'sort_order' => 7],
            ['path' => '/velnox/images/products/kit-t7/velnox-aa59196-vx-drawing-3.webp', 'sort_order' => 8],
        ] as $asset) {
            DB::table('product_assets')->updateOrInsert(
                ['entity_type' => 'product', 'entity_id' => $pk7, 'type' => 'gallery', 'path' => $asset['path']],
                ['sort_order' => $asset['sort_order']]
            );
        }

        foreach (['uk', 'en', 'pl'] as $locale) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product', 'entity_id' => $pk7, 'locale' => $locale, 'field' => 'name'],
                ['value' => 'AA59196 VX']
            );
        }

        foreach ([
            'uk' => 'Підшипник AA59196 VX — дворядний радіально-упорний кульковий підшипник із круглим отвором діаметром d = 16,027 мм та кутом контакту α = 20°. Дворядна конструкція забезпечує підвищену осьову жорсткість в посівних секціях та прикочувальних вузлах. Зовнішній діаметр D = 45,225 мм, ширина внутрішнього кільця B = 26 мм, ширина зовнішнього кільця C = 22,82 мм, маса 0,19 кг. Динамічна вантажопідйомність Cdyn = 16,3 кН, статична Co = 10,9 кН, Pu = 0,458 кН. Пряма заміна PEER 5204 KRY2-R-A268, RBF 5204 РУ3, CT-AGRI A59196, KABAT P59196. Застосовується в техніці HORSCH (60021679, 60054734), John Deere (AA104813, AA59196) та KINZE (GA26920).',
            'en' => 'The AA59196 VX is a double-row angular contact ball bearing with a round bore (d = 16.027 mm) and contact angle α = 20°. The double-row design provides increased axial rigidity in seeding sections and press wheel assemblies. Outer diameter D = 45.225 mm, inner ring width B = 26 mm, outer ring width C = 22.82 mm, weight 0.19 kg. Dynamic load capacity Cdyn = 16.3 kN, static Co = 10.9 kN, Pu = 0.458 kN. Direct replacement for PEER 5204 KRY2-R-A268, RBF 5204 РУ3, CT-AGRI A59196, KABAT P59196. Compatible with HORSCH (60021679, 60054734), John Deere (AA104813, AA59196) and KINZE (GA26920) equipment.',
            'pl' => 'Łożysko AA59196 VX to dwurzędowe skośne łożysko kulkowe z okrągłym otworem (d = 16,027 mm) i kątem kontaktu α = 20°. Dwurzędowa konstrukcja zapewnia zwiększoną sztywność osiową w sekcjach siewnych i zespołach rolek dogniatających. Średnica zewnętrzna D = 45,225 mm, szerokość pierścienia wewnętrznego B = 26 mm, szerokość pierścienia zewnętrznego C = 22,82 mm, masa 0,19 kg. Nośność dynamiczna Cdyn = 16,3 kN, statyczna Co = 10,9 kN, Pu = 0,458 kN. Bezpośredni zamiennik PEER 5204 KRY2-R-A268, RBF 5204 РУ3, CT-AGRI A59196, KABAT P59196. Kompatybilne z maszynami HORSCH (60021679, 60054734), John Deere (AA104813, AA59196) i KINZE (GA26920).',
        ] as $locale => $desc) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product', 'entity_id' => $pk7, 'locale' => $locale, 'field' => 'desc'],
                ['value' => $desc]
            );
        }

        // =========================================================
        // 30. PRODUCT TABLE: kit-t8 (F-562024.02KLQ VX — Serviceable units)
        // =========================================================
        DB::table('product_tables')->updateOrInsert(
            ['slug' => 'kit-t8'],
            [
                'slug'             => 'kit-t8',
                'category_id'      => $catId('kit'),
                'spec_columns'     => json_encode(['d_mm','D_mm','B_mm','C_mm','alpha_deg','mass_kg','cdyn_kn','co_kn','pu_kn']),
                'highlight_config' => json_encode([
                    'd_mm'      => [['label' => 'd', 'x' => 248, 'y' => 1877]],
                    'D_mm'      => [['label' => 'D', 'x' => 200, 'y' => 1878]],
                    'B_mm'      => [['label' => 'B', 'x' => 898, 'y' => 2123]],
                    'C_mm'      => [['label' => 'C', 'x' => 895, 'y' => 1593]],
                    'alpha_deg' => [['label' => 'α', 'x' => 839, 'y' => 1830]],
                ]),
                'schema_viewbox'   => '166 1465 2079 719',
                'sort_order'       => 8,
            ]
        );

        $kt8 = $tableId('kit-t8');

        foreach (['uk' => 'Підшипники для обслуговуваних вузлів', 'en' => 'Bearings for Serviceable Units', 'pl' => 'Łożyska do jednostek serwisowych'] as $locale => $name) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $kt8, 'locale' => $locale, 'field' => 'name'],
                ['value' => $name]
            );
        }

        foreach ([
            ['type' => 'schema_png', 'path' => '/velnox/images/products/kit-t8/velnox-f-562024-02klq-vx-schema.webp', 'sort_order' => 0],
            ['type' => 'schema_svg', 'path' => '/velnox/images/products/kit-t8/schema.svg',                            'sort_order' => 0],
        ] as $asset) {
            DB::table('product_assets')->updateOrInsert(
                ['entity_type' => 'product_table', 'entity_id' => $kt8, 'type' => $asset['type'], 'path' => $asset['path']],
                ['sort_order' => $asset['sort_order']]
            );
        }

        DB::table('products')->updateOrInsert(
            ['slug' => 'f-562024-02klq-vx'],
            ['slug' => 'f-562024-02klq-vx', 'article' => 'F-562024.02KLQ VX', 'product_table_id' => $kt8]
        );
        $pk8 = DB::table('products')->where('slug', 'f-562024-02klq-vx')->value('id');

        foreach ([
            'd_mm'      => '16.027',
            'D_mm'      => '60',
            'B_mm'      => '22.5',
            'C_mm'      => '22.9',
            'alpha_deg' => '25',
            'mass_kg'   => '0.31',
            'cdyn_kn'   => '22',
            'co_kn'     => '15.2',
            'pu_kn'     => '0.64',
        ] as $key => $value) {
            $sid = $specId($key);
            if (!$sid) continue;
            DB::table('product_specs')->updateOrInsert(
                ['product_id' => $pk8, 'spec_id' => $sid],
                ['value' => $value]
            );
        }

        DB::table('product_cross_refs')->where('product_id', $pk8)->delete();
        foreach ([
            ['value' => '23042700',        'brand' => 'CT-AGRI', 'type' => 'bearing'],
            ['value' => 'F-562024.02.KLQ', 'brand' => 'INA',     'type' => 'bearing'],
            ['value' => 'F-562024.02.KLQ', 'brand' => 'NTE',     'type' => 'bearing'],
            ['value' => 'F-562024.02.KLQ', 'brand' => 'CT-AGRI', 'type' => 'bearing'],
            ['value' => 'PN 008',          'brand' => 'RBF',     'type' => 'bearing'],
            ['value' => 'IL20-71/6T-B16',  'brand' => 'FKL',     'type' => 'bearing'],
        ] as $ref) {
            DB::table('product_cross_refs')->insert(['product_id' => $pk8, 'value' => $ref['value'], 'brand' => $ref['brand'], 'type' => $ref['type']]);
        }

        foreach ([
            ['type' => 'model_3d', 'path' => '/velnox/models/F-562024-02-KLQ.glb',                                    'sort_order' => 0],
            ['type' => 'gallery',  'path' => '/velnox/images/products/kit-t8/velnox-f-562024-02klq-vx.webp',           'sort_order' => 0],
            ['type' => 'gallery',  'path' => '/velnox/images/products/kit-t8/velnox-f-562024-02klq-vx-drawing-1.webp', 'sort_order' => 1],
            ['type' => 'gallery',  'path' => '/velnox/images/products/kit-t8/velnox-f-562024-02klq-vx-drawing-2.webp', 'sort_order' => 2],
            ['type' => 'gallery',  'path' => '/velnox/images/products/kit-t8/velnox-f-562024-02klq-vx-drawing-3.webp', 'sort_order' => 3],
        ] as $asset) {
            DB::table('product_assets')->updateOrInsert(
                ['entity_type' => 'product', 'entity_id' => $pk8, 'type' => $asset['type'], 'path' => $asset['path']],
                ['sort_order' => $asset['sort_order']]
            );
        }

        foreach (['uk', 'en', 'pl'] as $locale) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product', 'entity_id' => $pk8, 'locale' => $locale, 'field' => 'name'],
                ['value' => 'F-562024.02KLQ VX']
            );
        }

        foreach ([
            'uk' => 'Підшипник F-562024.02KLQ VX — дворядний радіально-упорний кульковий підшипник із круглим отвором діаметром d = 16,027 мм та кутом контакту α = 25° для обслуговуваних вузлів сільськогосподарської техніки. Зовнішній діаметр D = 60 мм, ширина внутрішнього кільця B = 22,5 мм, ширина зовнішнього кільця C = 22,9 мм, маса 0,31 кг. Динамічна вантажопідйомність Cdyn = 22 кН, статична Co = 15,2 кН, Pu = 0,64 кН. Збільшений зовнішній діаметр забезпечує підвищену несучу здатність при компактних габаритах. Пряма заміна INA/NTE F-562024.02.KLQ, CT-AGRI 23042700, RBF PN 008, FKL IL20-71/6T-B16.',
            'en' => 'The F-562024.02KLQ VX is a double-row angular contact ball bearing with a round bore (d = 16.027 mm) and contact angle α = 25° for serviceable agricultural machinery units. Outer diameter D = 60 mm, inner ring width B = 22.5 mm, outer ring width C = 22.9 mm, weight 0.31 kg. Dynamic load capacity Cdyn = 22 kN, static Co = 15.2 kN, Pu = 0.64 kN. The enlarged outer diameter provides increased load capacity in a compact design. Direct replacement for INA/NTE F-562024.02.KLQ, CT-AGRI 23042700, RBF PN 008, FKL IL20-71/6T-B16.',
            'pl' => 'Łożysko F-562024.02KLQ VX to dwurzędowe skośne łożysko kulkowe z okrągłym otworem (d = 16,027 mm) i kątem kontaktu α = 25° do serwisowanych węzłów maszyn rolniczych. Średnica zewnętrzna D = 60 mm, szerokość pierścienia wewnętrznego B = 22,5 mm, szerokość pierścienia zewnętrznego C = 22,9 mm, masa 0,31 kg. Nośność dynamiczna Cdyn = 22 kN, statyczna Co = 15,2 kN, Pu = 0,64 kN. Powiększona średnica zewnętrzna zapewnia zwiększoną nośność przy kompaktowych wymiarach. Bezpośredni zamiennik INA/NTE F-562024.02.KLQ, CT-AGRI 23042700, RBF PN 008, FKL IL20-71/6T-B16.',
        ] as $locale => $desc) {
            DB::table('translations')->updateOrInsert(
                ['entity_type' => 'product', 'entity_id' => $pk8, 'locale' => $locale, 'field' => 'desc'],
                ['value' => $desc]
            );
        }

        // =========================================================
        // ПРИБИРАННЯ: значення характеристик, яких уже немає в spec_columns
        // =========================================================
        // Перейменування ключа (напр. d_mm -> shaft_d_mm) створює новий рядок у
        // product_specs, а старий лишається — і картка показує дві колонки з тим
        // самим числом. Контролер віддає всі product_specs, не звіряючись зі
        // spec_columns, тож прибирати треба тут.
        foreach (DB::table('product_tables')->get(['id', 'spec_columns']) as $pt) {
            $cols = json_decode($pt->spec_columns ?? '[]', true);
            if (!is_array($cols) || !$cols) continue;   // порожні spec_columns — не чіпаємо
            $allowed    = DB::table('spec_definitions')->whereIn('key', $cols)->pluck('id');
            $productIds = DB::table('products')->where('product_table_id', $pt->id)->pluck('id');
            if ($productIds->isEmpty()) continue;
            DB::table('product_specs')
                ->whereIn('product_id', $productIds)
                ->whereNotIn('spec_id', $allowed)
                ->delete();
        }

    }
}
