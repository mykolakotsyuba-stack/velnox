import type { ProductDTO, Locale } from '@/entities/product/model/types';
import { PdfButton } from './PdfButton';
import styles from './ProductHeader.module.css';

interface ProductHeaderProps {
    product: ProductDTO;
    locale: Locale;
    productName: string;
}

export function ProductHeader({ product, productName, locale }: ProductHeaderProps) {
    /* h1 = повна назва товару (SEO + AI),
       артикул — під h1 як мета-інфо */
    const displayTitle = productName !== product.article
        ? productName
        : product.article;

    return (
        <header className={styles.header}>
            <div className={styles.headerTop}>
                <div>
                    <h1 className={styles.title}>{displayTitle}</h1>
                    {productName !== product.article && (
                        <span className={styles.article}>{product.article}</span>
                    )}
                </div>
                <PdfButton product={product} locale={locale} />
            </div>
        </header>
    );
}
