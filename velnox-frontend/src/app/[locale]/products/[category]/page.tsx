import { fetchProducts } from '@/entities/product/api/productApi';
import Link from 'next/link';
import { BearingsCategoryPage } from '@/features/products/BearingsCategoryPage/BearingsCategoryPage';
import { HubsCategoryPage } from '@/features/products/HubsCategoryPage/HubsCategoryPage';
import { AgroCategoryPage } from '@/features/products/AgroCategoryPage/AgroCategoryPage';
import { KitCategoryPage } from '@/features/products/KitCategoryPage/KitCategoryPage';
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

    if (category === 'agro') {
        const { data: agro } = await fetchProducts({ locale, category: 'agro', per_page: 1000 });
        return <AgroCategoryPage locale={locale} products={agro} />;
    }

    if (category === 'kit') {
        const { data: kit } = await fetchProducts({ locale, category: 'kit', per_page: 1000 });
        return <KitCategoryPage locale={locale} products={kit} />;
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
