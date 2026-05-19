<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_specs', function (Blueprint $table) {
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('spec_id')->constrained('spec_definitions')->cascadeOnDelete();
            $table->string('value');
            $table->primary(['product_id', 'spec_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_specs');
    }
};
