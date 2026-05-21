import { apiFetch } from '@/shared/lib/api';
import type { ProductDTO, ProductListItem, ProductTableDTO, Locale } from '../model/types';

interface ProductListResponse {
    data: ProductListItem[];
    meta: { total: number; current_page?: number; last_page?: number };
}

export async function fetchProducts(params?: {
    locale?:   Locale;
    category?: string;
    page?:     number;
    per_page?: number;
}): Promise<ProductListResponse> {
    return apiFetch<ProductListResponse>('/products', { params });
}

export async function fetchProduct(slug: string, locale: Locale = 'en'): Promise<ProductDTO> {
    return apiFetch<ProductDTO>(`/products/${slug}`, { params: { locale } });
}

export async function fetchProductTable(slug: string, locale: Locale = 'en'): Promise<ProductTableDTO> {
    return apiFetch<ProductTableDTO>(`/product-tables/${slug}`, { params: { locale } });
}
