'use client';

import { useState, useRef, useEffect } from 'react';
import type { ProductDTO, Locale } from '@/entities/product/model/types';
import { Breadcrumbs } from './blocks/Breadcrumbs';
import { BlueprintViewer } from './blocks/BlueprintViewer';
import { BuqBlueprintViewer } from './blocks/BuqBlueprintViewer';
import { SpecsTable } from './blocks/SpecsTable';
import { CrossReferences } from './blocks/CrossReferences';
import { Installations } from './blocks/Installations';
import { CtaBlock } from '@/widgets/CtaBlock';
import { PhotoGallery } from './blocks/PhotoGallery';
import { ModelBlock3D } from './blocks/VisualPanel';
import { getProductImages, PRODUCT_3D } from './productAssets';
import { BLUEPRINT_MAP, SCHEMA_CONFIG } from './blueprintAssets';
import { DistributorsBlock } from '@/widgets/DistributorsBlock';
import { ProductHeader } from './blocks/ProductHeader';
import styles from './ProductTemplate.module.css';

interface ProductTemplateProps {
    product: ProductDTO;
    locale: Locale;
}

/**
 * ProductTemplate — SINGLETON шаблон для ВСІХ карток товарів VELNOX
 *
 * Щоб додати новий блок на ВСІ товари (напр. <DistributorsBlock />) —
 * додайте компонент лише в цей файл, і він з'явиться скрізь.
 */
/**
 * Intersection Observer Hook
 */
function useInView(threshold = 0.1) {
    const ref = useRef<HTMLElement>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);
    return { ref, inView };
}

export function ProductTemplate({ product, locale }: ProductTemplateProps) {
    const [hoveredSpec, setHoveredSpec] = useState<string | null>(null);
    const techSection = useInView(0.1);
    const containerRef = useRef<HTMLDivElement>(null);

    // i18n fallback: якщо locale відсутній — використовується EN
    const translation = product.translations[locale] ?? product.translations['en'];
    const productName = translation?.product_name ?? product.article;
    const sealingDesc = translation?.sealing_desc;

    const isBuq = product.article.toUpperCase().startsWith('BUQ');

    const apiImages = product.images?.filter(i => i.type !== 'schema').map(i => i.path);
    const demoImages = apiImages?.length ? apiImages : getProductImages(product.slug, product.article);

    const model3d = PRODUCT_3D[product.slug];

    const blueprint = (product.schema_key ? SCHEMA_CONFIG[product.schema_key] : null)
        ?? BLUEPRINT_MAP[product.slug];

    return (
        <article className={styles.page}>
            <div className={styles.container} ref={containerRef}>
                {/* Навігація */}
                <Breadcrumbs
                    category={product.category_id}
                    productName={productName}
                    locale={locale}
                />

                <ProductHeader
                    product={product}
                    locale={locale}
                    productName={productName}
                />

                <div className={styles.body}>

                    {model3d ? (
                        /* ── Layout з 3D: hero 3D → опис → [спеки | галерея+схема+CTA] ── */
                        <>
                            <ModelBlock3D
                                src={model3d.file}
                                label={productName}
                                sizeMb={model3d.sizeMb}
                                hero
                            />

                            {sealingDesc && (
                                <p className={styles.productDesc}>{sealingDesc}</p>
                            )}

                            <div
                                className={`${styles.technicalSection} ${styles.animateOnScroll} ${techSection.inView ? styles.inView : ''}`}
                                ref={techSection.ref as React.RefObject<HTMLDivElement>}
                            >
                                <div className={styles.specsColumn}>
                                    <SpecsTable specs={product.specs} hoveredSpec={hoveredSpec} onHoverSpec={setHoveredSpec} />
                                    {product.oem_cross?.length > 0 && (
                                        <div style={{ opacity: techSection.inView ? 1 : 0, transform: techSection.inView ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease-out 0.2s' }}>
                                            <CrossReferences refs={product.oem_cross} />
                                        </div>
                                    )}
                                    {product.installations?.length > 0 && (
                                        <div style={{ opacity: techSection.inView ? 1 : 0, transform: techSection.inView ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease-out 0.4s' }}>
                                            <Installations items={product.installations} />
                                        </div>
                                    )}
                                </div>
                                <div className={styles.drawingColumn}>
                                    <PhotoGallery images={demoImages} altText={product.article} />
                                    {product.category_id === 'bearings' && isBuq && (
                                        <BuqBlueprintViewer article={product.article} specs={product.specs} hoveredSpec={hoveredSpec} onHoverSpec={setHoveredSpec} dimLabels={blueprint?.dimLabels} svgSrc={blueprint?.svgSrc} viewBox={blueprint?.viewBox} />
                                    )}
                                    {product.category_id === 'bearings' && !isBuq && (
                                        <BlueprintViewer article={product.article} specs={product.specs} hoveredSpec={hoveredSpec} onHoverSpec={setHoveredSpec} />
                                    )}
                                    <div style={{ opacity: techSection.inView ? 1 : 0, transform: techSection.inView ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease-out 0.3s' }}>
                                        <CtaBlock product={product} locale={locale} />
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* ── Layout без 3D: [галерея | опис] → [спеки | схема+CTA] ── */
                        <>
                            <div className={styles.topSection}>
                                <aside className={styles.visual}>
                                    <PhotoGallery images={demoImages} altText={product.article} />
                                </aside>
                                <div className={styles.summary}>
                                    {sealingDesc && (
                                        <p className={styles.productDesc}>{sealingDesc}</p>
                                    )}
                                </div>
                            </div>

                            <div
                                className={`${styles.technicalSection} ${styles.animateOnScroll} ${techSection.inView ? styles.inView : ''}`}
                                ref={techSection.ref as React.RefObject<HTMLDivElement>}
                            >
                                <div className={styles.specsColumn}>
                                    <SpecsTable specs={product.specs} hoveredSpec={hoveredSpec} onHoverSpec={setHoveredSpec} />
                                    {product.oem_cross?.length > 0 && (
                                        <div style={{ opacity: techSection.inView ? 1 : 0, transform: techSection.inView ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease-out 0.2s' }}>
                                            <CrossReferences refs={product.oem_cross} />
                                        </div>
                                    )}
                                    {product.installations?.length > 0 && (
                                        <div style={{ opacity: techSection.inView ? 1 : 0, transform: techSection.inView ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease-out 0.4s' }}>
                                            <Installations items={product.installations} />
                                        </div>
                                    )}
                                </div>
                                <div className={styles.drawingColumn}>
                                    {product.category_id === 'bearings' && isBuq && (
                                        <BuqBlueprintViewer article={product.article} specs={product.specs} hoveredSpec={hoveredSpec} onHoverSpec={setHoveredSpec} dimLabels={blueprint?.dimLabels} svgSrc={blueprint?.svgSrc} viewBox={blueprint?.viewBox} />
                                    )}
                                    {product.category_id === 'bearings' && !isBuq && (
                                        <BlueprintViewer article={product.article} specs={product.specs} hoveredSpec={hoveredSpec} onHoverSpec={setHoveredSpec} />
                                    )}
                                    <div style={{ opacity: techSection.inView ? 1 : 0, transform: techSection.inView ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease-out 0.3s' }}>
                                        <CtaBlock product={product} locale={locale} />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/*
            === ЩОБ ДОДАТИ НОВИЙ БЛОК НА ВСІ ТОВАРИ ===
            Додайте компонент тут ↓
          */}
                    <div className="print-hide">
                        <DistributorsBlock />
                    </div>
                </div>
            </div>
        </article>
    );
}
