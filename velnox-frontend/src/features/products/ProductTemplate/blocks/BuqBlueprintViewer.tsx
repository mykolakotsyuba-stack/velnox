'use client';

import { useState } from 'react';
import { Maximize2, X } from 'lucide-react';
import type { ProductSpecs } from '@/entities/product/model/types';
import { useTranslations } from 'next-intl';
import { SpecsTable } from './SpecsTable';
import styles from './BuqBlueprintViewer.module.css';

import type { DimLabel } from '../blueprintAssets';

interface BuqBlueprintViewerProps {
    article: string;
    specs: ProductSpecs;
    hoveredSpec: string | null;
    onHoverSpec?: (key: string | null) => void;
    dimLabels?: DimLabel[];
    svgSrc?: string;
    viewBox?: string;
}

const SVG_VB_DEFAULT = '892 -13810 1480 720';

function parseVbH(vb: string): number {
    const parts = vb.trim().split(/\s+/);
    return parseFloat(parts[3]) || 720;
}

function DimensionOverlay({ specs, hoveredSpec, dimLabels, viewBox }: {
    specs: ProductSpecs;
    hoveredSpec: string | null;
    dimLabels: DimLabel[];
    viewBox: string;
}) {
    const vbH = parseVbH(viewBox);
    const scale = vbH / 7400;
    const R = Math.round(200 * scale);
    const FS = Math.round(180 * scale);
    const BOX_H = Math.round(380 * scale);
    const BOX_OFFSET = Math.round(460 * scale);
    const SW = Math.max(1, Math.round(28 * scale));

    const activeLabels = dimLabels.filter(d => d.key === hoveredSpec);
    if (!activeLabels.length) return null;

    return (
        <svg
            className={styles.svgOverlay}
            viewBox={viewBox}
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 50, pointerEvents: 'none' }}
        >
            {activeLabels.map((dim, i) => {
                const val = specs[dim.key];
                const pt = dim.point;
                const strVal = val != null ? String(val) : '';
                const boxW = Math.max(620, strVal.length * 150 + 260);

                return (
                    <g key={`${dim.key}-${i}`} style={{ pointerEvents: 'none' }}>
                        <circle cx={pt.x} cy={pt.y} r={R} fill="rgba(245,158,11,0.3)" stroke="#f59e0b" strokeWidth={SW} />
                        {val != null && (
                            <g transform={`translate(${pt.x},${pt.y + BOX_OFFSET})`}>
                                <rect x={-boxW / 2} y={-BOX_H / 2} width={boxW} height={BOX_H} rx={60} fill="#111" stroke="#f59e0b" strokeWidth={SW * 0.7} />
                                <text x={0} y={0} fontSize={FS} fill="#f59e0b" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">
                                    {strVal}
                                </text>
                            </g>
                        )}
                    </g>
                );
            })}
        </svg>
    );
}

export function BuqBlueprintViewer({
    article, specs, hoveredSpec, onHoverSpec,
    dimLabels = [], svgSrc = '/velnox/images/schemes/bearings-schema.svg', viewBox = SVG_VB_DEFAULT,
}: BuqBlueprintViewerProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const t = useTranslations('product');

    const innerContent = (
        <div className={styles.blueprintInner}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={svgSrc}
                alt={`BUQ Series Technical Drawing ${article}`}
                className={styles.panelImage}
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            />
            <DimensionOverlay specs={specs} hoveredSpec={hoveredSpec} dimLabels={dimLabels} viewBox={viewBox} />
        </div>
    );

    return (
        <>
            <section className={styles.container}>
                <h2 className={styles.title}>
                    {t('technical_drawing', { defaultMessage: 'Технічне креслення' })}
                </h2>
                <div
                    className={styles.blueprintWrapper}
                    onClick={() => setIsFullscreen(true)}
                    title={t('expand', { defaultMessage: 'Розгорнути' })}
                >
                    <button className={styles.expandButton} aria-label="Expand blueprint">
                        <Maximize2 size={20} />
                    </button>
                    {innerContent}
                </div>
            </section>

            <div className={`${styles.modalOverlay} ${isFullscreen ? styles.open : ''}`}>
                <div className={styles.modalContent}>
                    <button className={styles.closeButton} onClick={() => setIsFullscreen(false)} aria-label="Close fullscreen">
                        <X size={32} />
                    </button>
                    <div className={styles.modalDrawing}>
                        {innerContent}
                    </div>
                    <div className={styles.modalSpecs}>
                        <SpecsTable specs={specs} hoveredSpec={hoveredSpec} onHoverSpec={onHoverSpec} />
                    </div>
                </div>
            </div>
        </>
    );
}