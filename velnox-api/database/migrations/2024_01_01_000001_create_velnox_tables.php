<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique(); // 'hubs', 'bearings', 'agro', 'kit', 'custom'
            $table->string('name_en');
            $table->string('name_uk');
            $table->string('name_pl');
            $table->unsignedTinyInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();          // '28071300-VX'
            $table->string('article');                 // '28071300 VX'
            $table->string('fkl_designation')->nullable(); // 'PL-127'
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();

            // Технічні параметри — JSONB для гнучкого розширення без міграцій
            $table->jsonb('specs')->default('{}');          // { d, D, B, C, alpha, mass, Cdyn, Co, Pu }
            $table->jsonb('oem_cross')->default('[]');       // ["28085600", "PN60041"]
            $table->jsonb('installations')->default('[]');   // ["HORSCH Focus", "HORSCH Joker"]

            // Переклади — 2-рівнева система з ТЗ
            $table->jsonb('translations')->default('{}');   // { uk: {...}, en: {...}, pl: {...} }

            $table->string('model_3d_url')->nullable();
            $table->string('drawing_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Індекси для швидкого пошуку по JSON-полях
            $table->index('category_id');
            $table->index('slug');
        });

        Schema::create('news_articles', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            // Категорія (з ТЗ): cost-efficiency | quality-control | oem-solutions
            $table->string('category');
            $table->string('cover_image')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->boolean('is_active')->default(true);
            // Переклади: { en: {title, excerpt, body}, uk: {...}, pl: {...} }
            $table->jsonb('translations')->default('{}');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('news_articles');
        Schema::dropIfExists('products');
        Schema::dropIfExists('categories');
    }
};
