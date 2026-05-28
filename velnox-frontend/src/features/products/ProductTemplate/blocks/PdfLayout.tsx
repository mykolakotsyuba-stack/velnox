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
    const t    = useTranslations('product');
    const tcat = useTranslations('categories');
    const tc   = useTranslations('contacts');

    const productName = product.name;
    const desc = product.desc;

    const galleryImages = product.images
        .filter(i => i.type === 'gallery')
        .sort((a, b) => a.sort_order - b.sort_order);

    // Product photo — first gallery image
    const firstPhoto = galleryImages[0]?.path ?? null;

    // Drawing thumbnails — remaining gallery images (drawing-2, drawing-3, ...)
    const drawingImages = galleryImages.slice(1);

    // Schema — svg from product_table, fallback to schema_png/svg from product_assets
    const schemaSrc = product.schema_svg
        ?? product.images.find(i => i.type === 'schema_png')?.path
        ?? product.images.find(i => i.type === 'schema_svg')?.path
        ?? null;

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
                    <div className={styles.headerTitle}>{t('pdf_catalog_title')}</div>
                    <div className={styles.headerSub}>{tcat(product.category_slug)}</div>
                </div>
            </header>

            <div className={styles.pageContent}>

                {/* ── TOP ROW: photo + title + meta ── */}
                <div className={styles.topRow}>
                    <div className={styles.photoCol}>
                        {firstPhoto && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={firstPhoto}
                                alt={product.article}
                                className={styles.photo}
                                crossOrigin="anonymous"
                            />
                        )}
                    </div>
                    <div className={styles.infoCol}>
                        <h1 className={styles.article}>{product.article}</h1>
                        <h2 className={styles.productName}>{productName}</h2>
                        {desc && (
                            <p className={styles.sealingText}>{desc}</p>
                        )}
                    </div>
                </div>

                {/* ── DRAWING — large, full width ── */}
                <div className={styles.drawingSection}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionDot} />
                        <span className={styles.sectionTitle}>{t('pdf_drawing_title')}</span>
                        <div className={styles.sectionLine} />
                    </div>
                    <div className={styles.drawingWrapper}>
                        {schemaSrc && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={schemaSrc}
                                alt={`Технічне креслення ${product.article}`}
                                className={styles.drawing}
                                crossOrigin="anonymous"
                            />
                        )}
                    </div>
                </div>

                {/* ── BOTTOM 2 COLUMNS: specs + cross-refs ── */}
                <div className={styles.bottomRow}>

                    <div className={styles.specsCol}>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionDot} />
                            <span className={styles.sectionTitle}>{t('specs_table')}</span>
                            <div className={styles.sectionLine} />
                        </div>
                        <table className={styles.specsTable}>
                            <tbody>
                                {product.specs.map((spec) => (
                                    <tr key={spec.key}>
                                        <th className={styles.specKey}>{spec.label}</th>
                                        <td className={styles.specValue}>{spec.unit ? `${spec.value} ${spec.unit}` : spec.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className={styles.refsCol}>
                        {product.cross_refs.length > 0 && (
                            <div>
                                <div className={styles.sectionHeader}>
                                    <span className={styles.sectionDot} />
                                    <span className={styles.sectionTitle}>{t('cross_refs')}</span>
                                    <div className={styles.sectionLine} />
                                </div>
                                <ul className={styles.refList}>
                                    {product.cross_refs.slice(0, 14).map((ref, i) => (
                                        <li key={i}>{ref.brand}: {ref.value}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {product.installations.length > 0 && (
                            <div style={{ marginTop: '12px' }}>
                                <div className={styles.sectionHeader}>
                                    <span className={styles.sectionDot} />
                                    <span className={styles.sectionTitle}>{t('installations')}</span>
                                    <div className={styles.sectionLine} />
                                </div>
                                <ul className={styles.refList}>
                                    {product.installations.slice(0, 8).map((inst, i) => (
                                        <li key={i}>{inst}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {drawingImages.length > 0 && (
                            <div style={{ marginTop: '12px' }}>
                                <div className={styles.sectionHeader}>
                                    <span className={styles.sectionDot} />
                                    <span className={styles.sectionTitle}>{t('drawings')}</span>
                                    <div className={styles.sectionLine} />
                                </div>
                                <div className={styles.drawingThumbGrid}>
                                    {drawingImages.map((img, i) => (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            key={i}
                                            src={img.path}
                                            alt={`${t('drawings')} ${i + 1}`}
                                            className={styles.drawingThumb}
                                            crossOrigin="anonymous"
                                            loading="lazy"
                                        />
                                    ))}
                                </div>
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
                            © {new Date().getFullYear()} VELNOX. {t('pdf_copyright')}
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
