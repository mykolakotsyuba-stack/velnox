'use client';

import { useState } from 'react';
import { Maximize2, X } from 'lucide-react';
import type { ProductSpecs } from '@/entities/product/model/types';
import { useTranslations } from 'next-intl';
import { SpecsTable } from './SpecsTable';
import styles from './BuqBlueprintViewer.module.css';

interface BuqBlueprintViewerProps {
    article: string;
    specs: ProductSpecs;
    hoveredSpec: string | null;
    onHoverSpec?: (key: string | null) => void;
}

// ─── CorelDRAW SVG coordinate system ─────────────────────────────────────────
// viewBox: 7552 -117381 12467 7053  (width × height in SVG user units)
// Positions below are actual SVG coordinates of each dimension label
const SVG_VB = '7000 -117700 13600 7400';  // bearing diagram area with margins

type DimLabel = {
    key: string;
    label: string;
    point: { x: number; y: number };
};

const DIM_LABELS: DimLabel[] = [
    { key: 'N',      label: 'N',  point: { x: 8973,  y: -116715 } },
    { key: 'B',      label: 'B',  point: { x: 15426, y: -116291 } },
    { key: 'd_mm',   label: 'd',  point: { x: 15466, y: -114079 } },
    { key: 'd_inch', label: 'd',  point: { x: 15466, y: -114079 } },
    { key: 'J',      label: 'J',  point: { x: 10595, y: -111873 } },
    { key: 'A2',     label: 'A2', point: { x: 13039, y: -111928 } },
    { key: 'A1',     label: 'A1', point: { x: 13964, y: -111623 } },
    { key: 'L',      label: 'L',  point: { x: 10618, y: -111442 } },
    { key: 'A',      label: 'A',  point: { x: 14351, y: -111284 } },
];

// Visual sizes in SVG user units (viewBox width 12467 ≈ 700–900px on screen)
const R = 200;           // highlight circle radius
const FS = 180;          // font size
const BOX_H = 380;       // value box height
const BOX_OFFSET = 460;  // box offset below circle center
const SW = 28;           // stroke width

function DimensionOverlay({ specs, hoveredSpec }: { specs: ProductSpecs; hoveredSpec: string | null }) {
    const activeLabels = DIM_LABELS.filter(d => d.key === hoveredSpec);
    if (!activeLabels.length) return null;

    return (
        <svg
            className={styles.svgOverlay}
            viewBox={SVG_VB}
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

export function BuqBlueprintViewer({ article, specs, hoveredSpec, onHoverSpec }: BuqBlueprintViewerProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const t = useTranslations('product');

    const innerContent = (
        <div className={styles.blueprintInner}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/velnox/images/schemes/bearings-schema.svg"
                alt={`BUQ Series Technical Drawing ${article}`}
                className={styles.panelImage}
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            />
            <DimensionOverlay specs={specs} hoveredSpec={hoveredSpec} />
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