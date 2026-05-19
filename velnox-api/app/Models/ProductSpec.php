<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ProductSpec extends Pivot
{
    public $incrementing = false;

    protected $primaryKey = ['product_id', 'spec_id'];

    public $timestamps = false;

    protected $fillable = [
        'product_id',
        'spec_id',
        'value',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function specDefinition(): BelongsTo
    {
        return $this->belongsTo(SpecDefinition::class, 'spec_id');
    }
}
