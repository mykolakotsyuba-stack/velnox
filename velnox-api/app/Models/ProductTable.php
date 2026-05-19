<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductTable extends Model
{
    protected $fillable = [
        'slug',
        'category_id',
        'spec_columns',
        'highlight_config',
        'schema_viewbox',
        'sort_order',
    ];

    protected $casts = [
        'spec_columns'     => 'array',
        'highlight_config' => 'array',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function assets(): HasMany
    {
        return $this->hasMany(ProductAsset::class, 'entity_id')
            ->where('entity_type', 'product_table');
    }

    public function translations(): HasMany
    {
        return $this->hasMany(Translation::class, 'entity_id')
            ->where('entity_type', 'product_table');
    }
}
