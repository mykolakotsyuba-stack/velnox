<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('product_cross_refs', function (Blueprint $table) {
            // 'bearing' = equivalent bearing designation (SNR/FKL/PEER/SKF etc.)
            // 'application' = machine/application cross-ref (AMAZONE, Lemken, Gaspardo etc.)
            $table->string('type')->default('bearing')->after('value');
        });

        // Mark known application brands as 'application' type
        $applicationBrands = ['AMAZONE', 'Lemken', 'Gaspardo', 'Opall Agri', 'RBF', 'Z&S', 'Horsch'];
        DB::table('product_cross_refs')
            ->whereIn('brand', $applicationBrands)
            ->update(['type' => 'application']);
    }

    public function down(): void
    {
        Schema::table('product_cross_refs', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }
};
