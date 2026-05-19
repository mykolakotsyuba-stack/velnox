<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_assets', function (Blueprint $table) {
            $table->id();
            $table->string('entity_type'); // 'product' | 'product_table'
            $table->unsignedBigInteger('entity_id');
            $table->string('type'); // VARCHAR не ENUM: gallery|schema_png|schema_svg|model_3d|pdf|...
            $table->string('path');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->index(['entity_type', 'entity_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_assets');
    }
};
