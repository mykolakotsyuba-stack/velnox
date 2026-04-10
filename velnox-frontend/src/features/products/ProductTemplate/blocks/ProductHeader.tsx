import type { ProductDTO, Locale } from '@/entities/product/model/types';
import { PdfButton } from './PdfButton';
import styles from './ProductHeader.module.css';

interface ProductHeaderProps {
    product: ProductDTO;
    locale: Locale;
    productName: string;
}

export function ProductHeader({ product, productName, locale }: ProductHeaderProps) {
    return (
        <header className={styles.header}>
            <div className={styles.headerTop}>
                <div>
                    <h1 className={styles.title}>{product.article}</h1>
                    <div className={styles.subtitle}>{productName}</div>
                </div>
                <PdfButton product={product} locale={locale} />
            </div>

            <div className={styles.meta}>
                {product.fkl_designation && (
                    <span className={styles.badge}>FKL: {product.fkl_designation}</span>
                )}
                <span className={styles.badge}>ISO/DIN Standard</span>
            </div>
        </header>
    );
}
