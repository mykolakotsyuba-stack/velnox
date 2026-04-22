<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            $table->string('product_slug');
            $table->string('path');
            $table->enum('type', ['render', 'photo', 'schema'])->default('render');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index('product_slug');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_images');
    }
};
