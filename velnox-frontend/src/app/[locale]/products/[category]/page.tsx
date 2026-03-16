import { fetchProducts } from '@/entities/product/api/productApi';
import Link from 'next/link';
import { BearingsCategoryPage } from '@/features/products/BearingsCategoryPage/BearingsCategoryPage';
import { HubsCategoryPage } from '@/features/products/HubsCategoryPage/HubsCategoryPage';
import type { Locale } from '@/entities/product/model/types';

interface CategoryPageProps {
    params: { locale: Locale; category: string };
}

export default async function CategoryPage({ params: { locale, category } }: CategoryPageProps) {
    if (category === 'bearings') {
        const { data: bearings } = await fetchProducts({ locale, category: 'bearings', per_page: 1000 });
        return <BearingsCategoryPage locale={locale} products={bearings} />;
    }

    if (category === 'hubs') {
        const { data: hubs } = await fetchProducts({ locale, category: 'hubs', per_page: 1000 });
        return <HubsCategoryPage locale={locale} products={hubs} />;
    }

    const { data: products } = await fetchProducts({ locale, category });

    return (
        <main>
            <h1>{category}</h1>
            <div>
                {products.map((product) => (
                    <Link key={product.slug} href={`/${locale}/products/${category}/${product.slug}`}>
                        <div>
                            <h3>{product.name}</h3>
                            <p>{product.article}</p>
                            {product.specs.Cdyn && <p>Cdyn: {product.specs.Cdyn} kN</p>}
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    );
}
