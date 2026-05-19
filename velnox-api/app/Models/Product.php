<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'slug',
        'article',
        'product_table_id',
    ];

    public function productTable(): BelongsTo
    {
        return $this->belongsTo(ProductTable::class);
    }

    public function specs(): HasMany
    {
        return $this->hasMany(ProductSpec::class);
    }

    public function assets(): HasMany
    {
        return $this->hasMany(ProductAsset::class, 'entity_id')
            ->where('entity_type', 'product');
    }

    public function crossRefs(): HasMany
    {
        return $this->hasMany(ProductCrossRef::class);
    }

    public function installations(): HasMany
    {
        return $this->hasMany(ProductInstallation::class);
    }

    public function translations(): HasMany
    {
        return $this->hasMany(Translation::class, 'entity_id')
            ->where('entity_type', 'product');
    }
}
