<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = [
        'slug',     // 'hubs', 'bearings', 'agro', 'kit', 'custom'
        'name_en',
        'name_uk',
        'name_pl',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Назва категорії для заданої мови
     */
    public function getName(string $locale = 'en'): string
    {
        return $this->{"name_{$locale}"} ?? $this->name_en ?? '';
    }
}
