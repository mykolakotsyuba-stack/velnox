'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import type { ProductDTO, Locale } from '@/entities/product/model/types';
import { Breadcrumbs } from './blocks/Breadcrumbs';
import { VisualBlock } from './blocks/VisualBlock';
import { BlueprintViewer } from './blocks/BlueprintViewer';
import { BuqBlueprintViewer } from './blocks/BuqBlueprintViewer';
import { SealingBlock } from './blocks/SealingBlock';
import { SpecsTable } from './blocks/SpecsTable';
import { CrossReferences } from './blocks/CrossReferences';
import { Installations } from './blocks/Installations';
import { CtaBlock } from '@/widgets/CtaBlock';
import { PhotoGallery } from './blocks/PhotoGallery';
import { DistributorsBlock } from '@/widgets/DistributorsBlock';
import { PdfButton } from './blocks/PdfButton';
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
    const t = useTranslations('product');
    const [hoveredSpec, setHoveredSpec] = useState<string | null>(null);
    const techSection = useInView(0.1);
    const containerRef = useRef<HTMLDivElement>(null);

    // i18n fallback: якщо locale відсутній — використовується EN
    const translation = product.translations[locale] ?? product.translations['en'];
    const productName = translation?.product_name ?? product.article;
    const sealingDesc = translation?.sealing_desc;

    // Gallery images: BUQ series gets product-specific images, others get generic
    const isBuq = product.article.toUpperCase().startsWith('BUQ');
    const demoImages = isBuq
        ? [
            '/velnox/images/products/buq-bearing-photo.png',
            '/velnox/images/products/buq-drawing-1.png',
            '/velnox/images/products/buq-drawing-2.png',
            '/velnox/images/products/buq-drawing-3.png',
          ]
        : [
            '/velnox/images/products/bearing-photo-1.webp',
            '/velnox/images/products/bearing-photo-2.webp',
          ];

    return (
        <article className={styles.page}>
            <div className={styles.container} ref={containerRef}>
                {/* Навігація */}
                <Breadcrumbs
                    category={product.category_id}
                    productName={productName}
                    locale={locale}
                />

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

                <div className={styles.body}>

                    {/* Верхній блок: Галерея та Основна інфа/Аналоги */}
                    <div className={styles.topSection}>
                        <aside className={styles.visual}>
                            {/* Нова галерея замість VisualBlock */}
                            <PhotoGallery
                                images={demoImages}
                                altText={product.article}
                            />
                        </aside>

                        <div className={styles.summary}>
                            {/* Система ущільнень залишається вгорі як важливий тех. опис */}
                            {sealingDesc && (
                                <SealingBlock
                                    config={translation?.sealing_config}
                                    description={sealingDesc}
                                    label={t('sealing')}
                                />
                            )}
                        </div>
                    </div>

                    {/* Нижній блок: Технічні характеристики та Креслення */}
                    <div
                        className={`${styles.technicalSection} ${styles.animateOnScroll} ${techSection.inView ? styles.inView : ''}`}
                        ref={techSection.ref as React.RefObject<HTMLDivElement>}
                    >
                        <div className={styles.specsColumn}>
                            {/* Зведена таблиця параметрів */}
                            <SpecsTable
                                specs={product.specs}
                                hoveredSpec={hoveredSpec}
                                onHoverSpec={setHoveredSpec}
                            />

                            {/* Аналоги перенесені сюди для видовження колонки */}
                            {product.oem_cross?.length > 0 && (
                                <div style={{ opacity: techSection.inView ? 1 : 0, transform: techSection.inView ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease-out 0.2s' }}>
                                    <CrossReferences refs={product.oem_cross} />
                                </div>
                            )}

                            {/* Застосування перенесено сюди */}
                            {product.installations?.length > 0 && (
                                <div style={{ opacity: techSection.inView ? 1 : 0, transform: techSection.inView ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease-out 0.4s' }}>
                                    <Installations items={product.installations} />
                                </div>
                            )}
                        </div>

                        <div className={styles.drawingColumn}>
                            {/* Інтерактивне креслення */}
                            {product.category_id === 'bearings' && isBuq && (
                                <BuqBlueprintViewer
                                    article={product.article}
                                    specs={product.specs}
                                    hoveredSpec={hoveredSpec}
                                    onHoverSpec={setHoveredSpec}
                                />
                            )}
                            {product.category_id === 'bearings' && !isBuq && (
                                <BlueprintViewer
                                    article={product.article}
                                    specs={product.specs}
                                    hoveredSpec={hoveredSpec}
                                    onHoverSpec={setHoveredSpec}
                                />
                            )}

                            {/* B2B Call to Action перенесено під креслення */}
                            <div style={{ opacity: techSection.inView ? 1 : 0, transform: techSection.inView ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease-out 0.3s' }}>
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
