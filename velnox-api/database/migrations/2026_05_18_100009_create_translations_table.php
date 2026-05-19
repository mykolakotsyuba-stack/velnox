<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('translations', function (Blueprint $table) {
            $table->id();
            $table->string('entity_type'); // product|product_table|category|spec_definitions
            $table->unsignedBigInteger('entity_id');
            $table->string('locale'); // uk|en|pl|... VARCHAR не ENUM
            $table->string('field');  // name|desc|label|unit VARCHAR не ENUM
            $table->text('value');
            $table->timestamps();
            $table->unique(['entity_type', 'entity_id', 'locale', 'field']);
            $table->index(['entity_type', 'entity_id', 'locale']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('translations');
    }
};
