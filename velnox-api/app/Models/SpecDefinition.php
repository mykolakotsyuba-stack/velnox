<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SpecDefinition extends Model
{
    protected $fillable = [
        'key',
        'svg_label',
        'sort_order',
    ];

    public function productSpecs(): HasMany
    {
        return $this->hasMany(ProductSpec::class, 'spec_id');
    }

    public function translations(): HasMany
    {
        return $this->hasMany(Translation::class, 'entity_id')
            ->where('entity_type', 'spec_definitions');
    }
}
