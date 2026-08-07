<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    protected $fillable = [
        'type',
        'type_label',
        'to_email',
        'contact',
        'article',
        'files',
        'locale',
        'source',
        'ip',
        'user_agent',
        'status',
    ];

    protected $casts = [
        'files' => 'array',
    ];
}
