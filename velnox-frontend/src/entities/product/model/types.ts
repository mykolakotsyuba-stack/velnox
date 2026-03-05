/**
 * VELNOX Product Types
 * Відповідають JSON-структурі з ТЗ
 */

export interface ProductSpecs {
    d?: number | null;
    D?: number | null;
    B?: number | null;
    C?: number | null;
    alpha?: number | null;
    mass?: number | null;
    Cdyn?: number | null;
    Co?: number | null;
    Pu?: number | null;
    [key: string]: number | null | undefined; // дозволяє кастомні параметри
}

export interface ProductTranslation {
    product_name: string;
    sealing_config?: string;
    sealing_desc?: string;
}

export interface ProductTranslations {
    en?: ProductTranslation;
    uk?: ProductTranslation;
    pl?: ProductTranslation;
    [locale: string]: ProductTranslation | undefined;
}

/** Повна картка товару (відповідь /api/v1/products/{slug}) */
export interface ProductDTO {
    article: string;
    fkl_designation?: string;
    slug: string;
    category_id: string;
    specs: ProductSpecs;
    oem_cross: string[];
    installations: string[];
    model_3d_url?: string | null;
    drawing_url?: string | null;
    translations: ProductTranslations;
}

/** Елемент списку товарів (/api/v1/products) */
export interface ProductListItem {
    slug: string;
    article: string;
    category: string;
    name: string;
    specs: ProductSpecs;
}

export type Locale = 'en' | 'pl' | 'uk';

/** Категорія продуктів */
export interface CategoryDTO {
    slug: string;
    name: string;
    product_count: number;
}
