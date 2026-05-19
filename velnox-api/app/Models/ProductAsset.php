<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductAsset extends Model
{
    protected $fillable = [
        'entity_type',
        'entity_id',
        'type',
        'path',
        'sort_order',
    ];
}
