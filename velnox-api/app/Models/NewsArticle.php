<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NewsArticle extends Model
{
    protected $fillable = [
        'slug',
        'category',      // 'cost-efficiency' | 'quality-control' | 'oem-solutions'
        'cover_image',
        'published_at',
        'is_active',
        'translations',  // JSONB: { en: { title, excerpt, body }, uk: {...}, pl: {...} }
    ];

    protected $casts = [
        'translations' => 'array',
        'published_at' => 'datetime',
        'is_active'    => 'boolean',
    ];

    public function getTranslation(string $locale = 'en'): array
    {
        return $this->translations[$locale]
            ?? $this->translations['en']
            ?? [];
    }
}
