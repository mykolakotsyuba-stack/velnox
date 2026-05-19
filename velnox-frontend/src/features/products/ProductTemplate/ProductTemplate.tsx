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

    // Name and description — already translated by API
    const productName = product.name;
    const desc = product.desc;

    // Gallery images from DB (RULE 4 priority already applied by API)
    const galleryImages = product.images
        .filter(i => i.type === 'gallery')
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(i => i.path);

    // Schema from DB (PNG takes priority over SVG for static display)
    const dbSchemaSrc = product.images.find(i => i.type === 'schema_png')?.path
        ?? product.images.find(i => i.type === 'schema_svg')?.path
        ?? null;

    // 3D model path from DB
    const model3dSrc = product.model_3d;

    // Schema overlay: SVG + dim_labels + viewBox come directly from API (product_tables via ProductController)
    const activeBlueprintConfig = (product.schema_svg && product.dim_labels?.length > 0)
        ? { svgSrc: product.schema_svg, viewBox: product.schema_viewbox ?? '', dimLabels: product.dim_labels }
        : null;
    const staticSchemaSrc = !activeBlueprintConfig ? dbSchemaSrc : null;

    // Adapter: blueprint viewers expect Record<string, string>
    const specsMap = Object.fromEntries(product.specs.map(s => [s.key, s.value]));

    return (
        <article className={styles.page}>
            <div className={styles.container} ref={containerRef}>
                {/* Навігація */}
                <Breadcrumbs
                    category={product.category_slug}
                    productName={productName}
                    locale={locale}
                />

                <ProductHeader
                    product={product}
                    locale={locale}
                    productName={productName}
                />

                <div className={styles.body}>

                    {model3dSrc ? (
                        /* ── Layout з 3D: hero 3D → опис → [спеки | галерея+CTA] → blueprint full-width ── */
                        <>
                            <ModelBlock3D
                                src={model3dSrc}
                                label={productName}
                                hero
                            />

                            {desc && (
                                <p className={styles.productDesc}>{desc}</p>
                            )}

                            <div
                                className={`${styles.technicalSection} ${styles.animateOnScroll} ${techSection.inView ? styles.inView : ''}`}
                                ref={techSection.ref as React.RefObject<HTMLDivElement>}
                            >
                                <div className={styles.specsColumn}>
                                    <SpecsTable specs={product.specs} hoveredSpec={hoveredSpec} onHoverSpec={setHoveredSpec} />
                                    {product.cross_refs.length > 0 && (
                                        <div style={{ opacity: techSection.inView ? 1 : 0, transform: techSection.inView ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease-out 0.2s' }}>
                                            <CrossReferences refs={product.cross_refs} />
                                        </div>
                                    )}
                                    {product.installations.length > 0 && (
                                        <div style={{ opacity: techSection.inView ? 1 : 0, transform: techSection.inView ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease-out 0.4s' }}>
                                            <Installations items={product.installations} />
                                        </div>
                                    )}
                                </div>
                                <div className={styles.drawingColumn}>
                                    <PhotoGallery images={galleryImages} altText={product.article} />
                                    {activeBlueprintConfig && (
                                        <BuqBlueprintViewer article={product.article} specs={specsMap} specsItems={product.specs} hoveredSpec={hoveredSpec} onHoverSpec={setHoveredSpec} dimLabels={activeBlueprintConfig.dimLabels} svgSrc={activeBlueprintConfig.svgSrc} viewBox={activeBlueprintConfig.viewBox} />
                                    )}
                                    {!activeBlueprintConfig && staticSchemaSrc && (
                                        <BlueprintViewer article={product.article} specs={specsMap} hoveredSpec={hoveredSpec} onHoverSpec={setHoveredSpec} schemaSrc={staticSchemaSrc} />
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
                                    <PhotoGallery images={galleryImages} altText={product.article} />
                                </aside>
                                <div className={styles.summary}>
                                    {desc && (
                                        <p className={styles.productDesc}>{desc}</p>
                                    )}
                                </div>
                            </div>

                            <div
                                className={`${styles.technicalSection} ${styles.animateOnScroll} ${techSection.inView ? styles.inView : ''}`}
                                ref={techSection.ref as React.RefObject<HTMLDivElement>}
                            >
                                <div className={styles.specsColumn}>
                                    <SpecsTable specs={product.specs} hoveredSpec={hoveredSpec} onHoverSpec={setHoveredSpec} />
                                    {product.cross_refs.length > 0 && (
                                        <div style={{ opacity: techSection.inView ? 1 : 0, transform: techSection.inView ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease-out 0.2s' }}>
                                            <CrossReferences refs={product.cross_refs} />
                                        </div>
                                    )}
                                    {product.installations.length > 0 && (
                                        <div style={{ opacity: techSection.inView ? 1 : 0, transform: techSection.inView ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease-out 0.4s' }}>
                                            <Installations items={product.installations} />
                                        </div>
                                    )}
                                </div>
                                <div className={styles.drawingColumn}>
                                    {activeBlueprintConfig && (
                                        <BuqBlueprintViewer article={product.article} specs={specsMap} specsItems={product.specs} hoveredSpec={hoveredSpec} onHoverSpec={setHoveredSpec} dimLabels={activeBlueprintConfig.dimLabels} svgSrc={activeBlueprintConfig.svgSrc} viewBox={activeBlueprintConfig.viewBox} />
                                    )}
                                    {!activeBlueprintConfig && staticSchemaSrc && (
                                        <BlueprintViewer article={product.article} specs={specsMap} hoveredSpec={hoveredSpec} onHoverSpec={setHoveredSpec} schemaSrc={staticSchemaSrc} />
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
