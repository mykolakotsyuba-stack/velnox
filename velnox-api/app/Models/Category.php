<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = [
        'slug',
        'sort_order',
    ];

    public function productTables(): HasMany
    {
        return $this->hasMany(ProductTable::class);
    }

    public function translations(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Translation::class, 'entity_id')
            ->where('entity_type', 'category');
    }
}
