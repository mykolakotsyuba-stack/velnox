import { forwardRef } from 'react';
import { useTranslations } from 'next-intl';
import type { ProductDTO, Locale } from '@/entities/product/model/types';
import styles from './PdfLayout.module.css';

interface PdfLayoutProps {
    product: ProductDTO;
    locale: Locale;
}

export const PdfLayout = forwardRef<HTMLDivElement, PdfLayoutProps>(({ product, locale }, ref) => {
    const t = useTranslations('product');
    const translation = product.translations[locale] ?? product.translations['en'];
    const productName = translation?.product_name ?? product.article;
    const sealingDesc = translation?.sealing_desc;

    // Filter non-null specs
    const rows = Object.entries(product.specs).filter(([_, value]) => value != null);

    return (
        <div ref={ref} className={styles.a4Page}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.logo}>VELNOX</div>
                <div className={styles.headerTitle}>КАТАЛОГ ПРОДУКЦІЇ</div>
            </header>

            <div className={styles.pageContent}>
                {/* Title Section */}
                <div className={styles.titleSection}>
                    <h1 className={styles.title}>{product.article}</h1>
                    <h2 className={styles.subtitle}>{productName}</h2>
                    {product.fkl_designation && (
                        <div className={styles.fklBadge}>Аналог FKL: {product.fkl_designation}</div>
                    )}
                </div>

                {/* Top Row: Photo & Info */}
                <div className={styles.topRow}>
                    <div className={styles.photoWrapper}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/velnox/images/products/bearing-photo-1.webp" alt={product.article} className={styles.photo} crossOrigin="anonymous" />
                    </div>
                    <div className={styles.infoWrapper}>
                        {sealingDesc && (
                            <div className={styles.infoBlock}>
                                <h3>Система ущільнень</h3>
                                <p>{sealingDesc}</p>
                            </div>
                        )}
                        {product.oem_cross && product.oem_cross.length > 0 && (
                            <div className={styles.infoBlock}>
                                <h3>Крос-референси (Аналоги)</h3>
                                <ul className={styles.crossList}>
                                    {product.oem_cross.slice(0, 10).map((refString, idx) => (
                                        <li key={idx}>{refString}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {product.installations && product.installations.length > 0 && (
                            <div className={styles.infoBlock}>
                                <h3>Застосування</h3>
                                <ul className={styles.crossList}>
                                    {product.installations.slice(0, 8).map((inst, idx) => (
                                        <li key={idx}>{inst}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Drawing */}
                <div className={styles.drawingSection}>
                    <h3 className={styles.sectionTitle}>Технічне креслення</h3>
                    <div className={styles.drawingWrapper}>
                        <div className={styles.drawingInner}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/velnox/images/blueprint-base.png" alt="Креслення" className={styles.drawing} crossOrigin="anonymous" />
                        </div>
                    </div>
                </div>

                {/* Specs */}
                <div className={styles.specsSection}>
                    <h3 className={styles.sectionTitle}>Технічні характеристики</h3>
                    <table className={styles.specsTable}>
                        <tbody>
                            {rows.map(([key, value]) => {
                                const valStr = typeof value === 'object' && value !== null
                                    ? `${(value as any).value ?? ''} ${(value as any).unit ?? ''}`.trim()
                                    : String(value);

                                const label = t.has(key) ? t(key) : key.replace(/_/g, ' ').toUpperCase();

                                return (
                                    <tr key={key}>
                                        <th className={styles.specKey}>{label}</th>
                                        <td className={styles.specValue}>{valStr}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Distributor Block */}
                <div className={styles.distributorBlock}>
                    <h3>Офіційний дистриб'ютор VELNOX</h3>
                    <p>ТОВ "ВЕЛНОКС Україна" — надійні підшипникові вузли для сільськогосподарської техніки.<br />
                        Тел: +38 (000) 000-00-00 | Email: info@velnox.com</p>
                </div>
            </div>

            {/* Footer */}
            <footer className={styles.footer}>
                <div>© {new Date().getFullYear()} <span>VELNOX</span>. Всі права захищено.</div>
                <div>velnox.com</div>
            </footer>
        </div>
    );
});

PdfLayout.displayName = 'PdfLayout';
