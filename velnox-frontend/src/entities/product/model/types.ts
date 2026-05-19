/**
 * VELNOX Product Types — new normalized architecture
 */

export type Locale = 'en' | 'pl' | 'uk';

// ── Spec item as returned by /products/{slug} ──
export interface SpecItem {
    key:   string;
    label: string;
    value: string;
    unit:  string;
}

// ── Cross-reference ──
export interface CrossRef {
    brand: string;
    value: string;
}

// ── Asset / image ──
export interface ProductImage {
    type:       string; // gallery | schema_png | schema_svg | model_3d | pdf | ...
    path:       string;
    sort_order: number;
}

export interface DimLabel {
    key:   string;
    label: string;
    point: { x: number; y: number };
}

/** Full product card — response from /api/v1/products/{slug} */
export interface ProductDTO {
    slug:               string;
    article:            string;
    name:               string;
    desc:               string | null;
    product_table_slug: string;
    category_slug:      string;
    specs:              SpecItem[];
    cross_refs:         CrossRef[];
    installations:      string[];
    images:             ProductImage[];
    model_3d:           string | null;
    schema_svg:         string | null;
    dim_labels:         DimLabel[];
    schema_viewbox:     string | null;
    meta_title:         string | null;
    meta_description:   string | null;
}

/** Row in product table — part of ProductTableDTO.products */
export interface ProductTableRow {
    slug:       string;
    article:    string;
    specs:      Record<string, string>;
    cross_refs: CrossRef[];
}

/** Response from /api/v1/product-tables/{slug} */
export interface ProductTableDTO {
    table: {
        slug:         string;
        name:         string;
        spec_columns: string[];
        spec_labels:  Record<string, string>;
        spec_units:   Record<string, string>;
    };
    products: ProductTableRow[];
}

/** Slim list item — response from /api/v1/products */
export interface ProductListItem {
    slug:     string;
    article:  string;
    category: string;
    name:     string;
}

/** Category */
export interface CategoryDTO {
    slug:   string;
    name:   string;
    tables: string[];
}
