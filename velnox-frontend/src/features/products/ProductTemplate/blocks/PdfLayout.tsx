import { forwardRef } from 'react';
import { useTranslations } from 'next-intl';
import type { ProductDTO, Locale } from '@/entities/product/model/types';
import styles from './PdfLayout.module.css';

interface PdfLayoutProps {
    product: ProductDTO;
    locale: Locale;
    pageUrl?: string;
}

export const PdfLayout = forwardRef<HTMLDivElement, PdfLayoutProps>(({ product, locale, pageUrl }, ref) => {
    const t = useTranslations('product');
    const tc = useTranslations('contacts');

    const translation = product.translations[locale] ?? product.translations['en'];
    const productName = translation?.product_name ?? product.article;
    const sealingDesc = translation?.sealing_desc;

    const rows = Object.entries(product.specs).filter(([_, value]) => value != null);

    // Contact data from contacts page translations (auto-updates when contacts page changes)
    const phone = tc('routing.block1.phone');
    const email = tc('routing.block3.email');

    // Social links — conditionally shown if non-empty
    const instagram = tc('socials.instagram');
    const facebook  = tc('socials.facebook');
    const telegram  = tc('socials.telegram');
    const linkedin  = tc('socials.linkedin');
    const hasSocials = [instagram, facebook, telegram, linkedin].some(s => s.trim() !== '');

    return (
        <div ref={ref} className={styles.a4Page}>

            {/* ── HEADER ── */}
            <header className={styles.header}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/velnox/images/velnox-logo-white.png"
                    alt="VELNOX"
                    className={styles.logoImg}
                    crossOrigin="anonymous"
                />
                <div className={styles.headerRight}>
                    <div className={styles.headerTitle}>КАТАЛОГ ПРОДУКЦІЇ</div>
                    <div className={styles.headerSub}>Підшипникові вузли / Bearing Units</div>
                </div>
            </header>

            <div className={styles.pageContent}>

                {/* ── TOP ROW: photo + title + meta ── */}
                <div className={styles.topRow}>
                    <div className={styles.photoCol}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/velnox/images/products/buq-bearing-photo.png"
                            alt={product.article}
                            className={styles.photo}
                            crossOrigin="anonymous"
                        />
                    </div>
                    <div className={styles.infoCol}>
                        <h1 className={styles.article}>{product.article}</h1>
                        <h2 className={styles.productName}>{productName}</h2>
                        {product.fkl_designation && (
                            <span className={styles.fklBadge}>
                                FKL: {product.fkl_designation}
                            </span>
                        )}
                        {sealingDesc && (
                            <p className={styles.sealingText}>{sealingDesc}</p>
                        )}
                    </div>
                </div>

                {/* ── DRAWING — large, full width ── */}
                <div className={styles.drawingSection}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionDot} />
                        <span className={styles.sectionTitle}>Технічне креслення</span>
                        <div className={styles.sectionLine} />
                    </div>
                    <div className={styles.drawingWrapper}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/velnox/images/schemes/bearings-schema.svg"
                            alt="Технічне креслення BUQ"
                            className={styles.drawing}
                            crossOrigin="anonymous"
                            width="1360"
                            height="740"
                        />
                    </div>
                </div>

                {/* ── BOTTOM 2 COLUMNS: specs + cross-refs ── */}
                <div className={styles.bottomRow}>

                    <div className={styles.specsCol}>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionDot} />
                            <span className={styles.sectionTitle}>Характеристики</span>
                            <div className={styles.sectionLine} />
                        </div>
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

                    <div className={styles.refsCol}>
                        {product.oem_cross && product.oem_cross.length > 0 && (
                            <div>
                                <div className={styles.sectionHeader}>
                                    <span className={styles.sectionDot} />
                                    <span className={styles.sectionTitle}>Крос-референси</span>
                                    <div className={styles.sectionLine} />
                                </div>
                                <ul className={styles.refList}>
                                    {product.oem_cross.slice(0, 14).map((ref, i) => (
                                        <li key={i}>{ref}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {product.installations && product.installations.length > 0 && (
                            <div style={{ marginTop: '12px' }}>
                                <div className={styles.sectionHeader}>
                                    <span className={styles.sectionDot} />
                                    <span className={styles.sectionTitle}>Застосування</span>
                                    <div className={styles.sectionLine} />
                                </div>
                                <ul className={styles.refList}>
                                    {product.installations.slice(0, 8).map((inst, i) => (
                                        <li key={i}>{inst}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* ── FOOTER — auto-pulls from contacts page translations ── */}
            <footer className={styles.footer}>
                <div className={styles.footerTop}>
                    <div className={styles.footerLeft}>
                        <strong>VELNOX</strong>
                        {phone && (
                            <span className={styles.footerContact}>{phone}</span>
                        )}
                        {email && (
                            <span className={styles.footerContact}>{email}</span>
                        )}
                    </div>
                    <div className={styles.footerRight}>
                        {hasSocials && (
                            <div className={styles.socials}>
                                {instagram && <span>Instagram: {instagram}</span>}
                                {facebook  && <span>Facebook: {facebook}</span>}
                                {telegram  && <span>Telegram: {telegram}</span>}
                                {linkedin  && <span>LinkedIn: {linkedin}</span>}
                            </div>
                        )}
                        <div className={styles.footerCopy}>
                            © {new Date().getFullYear()} VELNOX. Всі права захищено.
                        </div>
                    </div>
                </div>
                {pageUrl && (
                    <div className={styles.footerUrl}>{pageUrl}</div>
                )}
            </footer>
        </div>
    );
});

PdfLayout.displayName = 'PdfLayout';
