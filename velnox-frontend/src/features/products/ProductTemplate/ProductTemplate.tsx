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
    const [isCtaModalOpen, setIsCtaModalOpen] = useState(false);
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

    // Keys that have dim_labels on the blueprint (for specs ordering)
    const schemaKeys = new Set(product.dim_labels?.map(dl => dl.key) ?? []);

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

                    {/* ── Top: [gallery (sticky) | desc + CTA] ── */}
                    <div className={styles.topSection}>
                        <aside className={styles.visual}>
                            <PhotoGallery
                                images={galleryImages}
                                altText={product.article}
                                model3dSrc={model3dSrc}
                            />
                        </aside>
                        <div className={styles.summary}>
                            {desc && (
                                <p className={styles.productDesc}>{desc}</p>
                            )}
                            <div className={styles.ctaInline}>
                                <CtaBlock
                                    product={product}
                                    locale={locale}
                                    onModalOpen={() => setIsCtaModalOpen(true)}
                                    onModalClose={() => setIsCtaModalOpen(false)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Technical: [specs | blueprint + cross-refs] ── */}
                    <div
                        className={`${styles.technicalSection} ${styles.animateOnScroll} ${techSection.inView ? styles.inView : ''}`}
                        ref={techSection.ref as React.RefObject<HTMLDivElement>}
                    >
                        <div className={styles.specsColumn}>
                            <SpecsTable specs={product.specs} hoveredSpec={hoveredSpec} onHoverSpec={setHoveredSpec} schemaKeys={schemaKeys} />
                            {product.installations.length > 0 && (
                                <Installations items={product.installations} />
                            )}
                        </div>
                        <div
                            className={styles.drawingColumn}
                            style={{ visibility: isCtaModalOpen ? 'hidden' : 'visible' }}
                        >
                            {blueprintBlock}
                            {product.cross_refs.length > 0 && (
                                <CrossReferences refs={product.cross_refs} />
                            )}
                        </div>
                    </div>

                    {/* ── Distributors (full-width, one row) ── */}
                    <div className="print-hide">
                        <DistributorsBlock />
                    </div>
                </div>
            </div>
        </article>
    );
}
