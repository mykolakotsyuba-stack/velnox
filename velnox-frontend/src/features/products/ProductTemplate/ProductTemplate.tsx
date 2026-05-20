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

    const productName = product.name;
    const desc = product.desc;

    const galleryImages = product.images
        .filter(i => i.type === 'gallery')
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(i => i.path);

    const dbSchemaSrc = product.images.find(i => i.type === 'schema_png')?.path
        ?? product.images.find(i => i.type === 'schema_svg')?.path
        ?? null;

    const model3dSrc = product.model_3d;

    const activeBlueprintConfig = (product.schema_svg && product.dim_labels?.length > 0)
        ? { svgSrc: product.schema_svg, viewBox: product.schema_viewbox ?? '', dimLabels: product.dim_labels }
        : null;
    const staticSchemaSrc = !activeBlueprintConfig ? dbSchemaSrc : null;

    const specsMap = Object.fromEntries(product.specs.map(s => [s.key, s.value]));

    // Shared blueprint block (same in both layouts)
    const blueprintBlock = activeBlueprintConfig ? (
        <BuqBlueprintViewer
            article={product.article}
            specs={specsMap}
            specsItems={product.specs}
            hoveredSpec={hoveredSpec}
            onHoverSpec={setHoveredSpec}
            dimLabels={activeBlueprintConfig.dimLabels}
            svgSrc={activeBlueprintConfig.svgSrc}
            viewBox={activeBlueprintConfig.viewBox}
        />
    ) : staticSchemaSrc ? (
        <BlueprintViewer
            article={product.article}
            specs={specsMap}
            hoveredSpec={hoveredSpec}
            onHoverSpec={setHoveredSpec}
            schemaSrc={staticSchemaSrc}
        />
    ) : null;

    // Shared specs column content (same in both layouts)
    const specsColumnContent = (
        <>
            <SpecsTable specs={product.specs} hoveredSpec={hoveredSpec} onHoverSpec={setHoveredSpec} />
            {product.cross_refs.length > 0 && (
                <div style={{ opacity: techSection.inView ? 1 : 0, transform: techSection.inView ? 'none' : 'translateY(20px)', transition: 'opacity 0.6s ease-out 0.2s, transform 0.6s ease-out 0.2s' }}>
                    <CrossReferences refs={product.cross_refs} />
                </div>
            )}
            {product.installations.length > 0 && (
                <div style={{ opacity: techSection.inView ? 1 : 0, transform: techSection.inView ? 'none' : 'translateY(20px)', transition: 'opacity 0.6s ease-out 0.4s, transform 0.6s ease-out 0.4s' }}>
                    <Installations items={product.installations} />
                </div>
            )}
        </>
    );

    return (
        <article className={styles.page}>
            <div className={styles.container}>
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

                    {model3dSrc && (
                        /* ── 3D hero — тільки для товарів з 3D моделлю ── */
                        <ModelBlock3D src={model3dSrc} label={productName} hero />
                    )}

                    {/* ── Верхній блок: [галерея (sticky) | опис] — однаковий для обох layout'ів ── */}
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

                    {/* ── Технічна секція: [спеки | схема+CTA] — однакова для обох layout'ів ── */}
                    <div
                        className={`${styles.technicalSection} ${styles.animateOnScroll} ${techSection.inView ? styles.inView : ''}`}
                        ref={techSection.ref as React.RefObject<HTMLDivElement>}
                    >
                        <div className={styles.specsColumn}>
                            {specsColumnContent}
                        </div>
                        <div className={styles.drawingColumn}>
                            {blueprintBlock}
                            <div style={{ opacity: techSection.inView ? 1 : 0, transform: techSection.inView ? 'none' : 'translateY(20px)', transition: 'opacity 0.6s ease-out 0.3s, transform 0.6s ease-out 0.3s' }}>
                                <CtaBlock product={product} locale={locale} />
                            </div>
                        </div>
                    </div>

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
