<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Product — основна сутність каталогу VELNOX
 *
 * @property string $slug           Артикул (URL-slug), напр. "28071300-VX"
 * @property string $article        Оригінальний артикул, напр. "28071300 VX"
 * @property string $fkl_designation  Внутрішнє позначення FKL (напр. "PL-127")
 * @property int    $category_id
 * @property array  $specs          JSONB: { d, D, B, C, alpha, mass, Cdyn, Co, Pu }
 * @property array  $oem_cross      JSONB: ["28085600", "PN60041", ...]
 * @property array  $installations  JSONB: ["HORSCH Focus", "HORSCH Joker", ...]
 * @property array  $translations   JSONB: { uk: {...}, en: {...}, pl: {...} }
 * @property string|null $model_3d_url
 * @property string|null $drawing_url
 */
class Product extends Model
{
    protected $fillable = [
        'slug',
        'article',
        'fkl_designation',
        'category_id',
        'specs',
        'oem_cross',
        'installations',
        'translations',
        'model_3d_url',
        'drawing_url',
        'is_active',
    ];

    protected $casts = [
        'specs'         => 'array',
        'oem_cross'     => 'array',
        'installations' => 'array',
        'translations'  => 'array',
        'is_active'     => 'boolean',
    ];

    // ===== RELATIONS =====

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    // ===== HELPERS =====

    /**
     * Повертає переклад для заданої мови з fallback на EN
     */
    public function getTranslation(string $locale): array
    {
        return $this->translations[$locale]
            ?? $this->translations['en']
            ?? [];
    }

    /**
     * Формує масив у форматі JSON з ТЗ VELNOX
     */
    public function toApiArray(string $locale = 'en'): array
    {
        return [
            'article'          => $this->article,
            'fkl_designation'  => $this->fkl_designation,
            'slug'             => $this->slug,
            'category_id'      => $this->category->slug ?? $this->category_id,
            'specs'            => $this->specs,
            'oem_cross'        => $this->oem_cross ?? [],
            'installations'    => $this->installations ?? [],
            'model_3d_url'     => $this->model_3d_url,
            'drawing_url'      => $this->drawing_url,
            'translations'     => $this->translations,
        ];
    }
}
