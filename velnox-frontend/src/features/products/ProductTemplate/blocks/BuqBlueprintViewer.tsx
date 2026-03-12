'use client';

import { useState } from 'react';
import Image from 'next/image';
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

/**
 * BuqBlueprintViewer — two-panel blueprint viewer for BUQ flange bearing units.
 * Left panel: front view (Зображення для таблиці 1 -Photoroom.png)
 * Right panel: side cross-section view (Таблиця 1 Частина 2-Photoroom.png)
 *
 * SVG overlay annotations are precisely positioned to match the composite
 * reference drawing (Зведене_Таблиці_1-removebg-preview.png).
 *
 * Dimension labels:
 * Front view:  A (total housing width, top),  N (hole diameter, top-right),
 *              L (total length, bottom),        J (bolt-hole distance, left vertical)
 *              d (bore, center)
 * Side view:   B (width annotation, top),       d (bore, right side)
 *              A1 (housing width, bottom dashed), A2 (flange, bottom),  A (total, bottom)
 */

// ─── SVG constants (viewBox 1000×600) ─────────────────────────────────────
// Front view occupies left panel  ~ x 0–540   y 0–600
// Side view occupies right panel  ~ x 540–840  y 0–600
const FRONT = {
    // Front view occupies left panel
    x: 20, y: 20, w: 510, h: 560,
    cx: 260, cy: 300,
    boreR: 52,
};

const SIDE = {
    x: 560, y: 20, w: 230, h: 560,
    cx: 675,
};

// ─── Spec label definitions ────────────────────────────────────────────────
type DimLabel = {
    key: string;
    label: string;
    point: { x: number; y: number };
};

const DIM_LABELS: DimLabel[] = [
    { key: 'N', label: 'N', point: { x: 245, y: 29 } },
    { key: 'J', label: 'J', point: { x: 26, y: 168 } },
    { key: 'L', label: 'L', point: { x: 7, y: 168 } },
    { key: 'L', label: 'L', point: { x: 152, y: 301 } },
    { key: 'd_mm', label: 'd', point: { x: 442, y: 168 } },
    { key: 'd_inch', label: 'd', point: { x: 442, y: 168 } },
    { key: 'A2', label: 'A2', point: { x: 341, y: 294 } },
    { key: 'A1', label: 'A1', point: { x: 350, y: 318 } },
    { key: 'A', label: 'A', point: { x: 355, y: 341 } },
    { key: 'B', label: 'B', point: { x: 412, y: 59 } }
];

function ArrowHead({ x, y, dir }: { x: number; y: number; dir: 'left' | 'right' | 'up' | 'down' | 'none' }) {
    if (dir === 'none') return null;
    const pts: Record<string, string> = {
        left:  `${x},${y} ${x + 7},${y - 3.5} ${x + 7},${y + 3.5}`,
        right: `${x},${y} ${x - 7},${y - 3.5} ${x - 7},${y + 3.5}`,
        up:    `${x},${y} ${x - 3.5},${y + 7} ${x + 3.5},${y + 7}`,
        down:  `${x},${y} ${x - 3.5},${y - 7} ${x + 3.5},${y - 7}`,
    };
    return <polygon points={pts[dir]} className={styles.arrowHead} />;
}

function DimensionOverlay({
    labels, specs, hoveredSpec, onHoverSpec,
}: {
    labels: DimLabel[];
    specs: ProductSpecs;
    hoveredSpec: string | null;
    onHoverSpec?: (k: string | null) => void;
}) {
    // Some scaling helper if needed, but we use hardcoded 870x540.
    return (
        <svg 
            className={styles.svgOverlay} 
            viewBox="0 0 629 397" 
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 50,
                pointerEvents: 'none'
            }}
        >
            
            {/* ── dynamic dimensions ── */}
            {labels.map((dim, i) => {
                const isActive = hoveredSpec === dim.key;
                
                if (!isActive) return null;
                
                const val = specs[dim.key];
                const pt = dim.point;
                
                // Calculate text box width based on value length roughly
                const strVal = val != null ? String(val) : '';
                const boxWidth = Math.max(28, strVal.length * 8 + 12);

                return (
                    <g
                        key={`${dim.key}-${i}`}
                        style={{ opacity: 1, pointerEvents: 'none' }}
                    >
                        {/* Highlight circle directly over the physical letter */}
                        <circle 
                            cx={pt.x} 
                            cy={pt.y} 
                            r="11" 
                            fill="rgba(245, 158, 11, 0.3)" 
                            stroke="#f59e0b" 
                            strokeWidth="2" 
                        />

                        {/* Value box placed closely below the letter */}
                        {val != null && (
                            <g transform={`translate(${pt.x}, ${pt.y + 20})`}>
                                <rect 
                                    x={-boxWidth / 2} 
                                    y={-10} 
                                    width={boxWidth} 
                                    height="20" 
                                    rx="4" 
                                    fill="#111" 
                                    stroke="#f59e0b"
                                    strokeWidth="1"
                                />
                                <text 
                                    x={0} 
                                    y={1} 
                                    style={{fill: '#f59e0b', fontSize: '11px', fontWeight: 'bold'}} 
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                >
                                    {val}
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
            <Image
                src="/velnox/images/products/buq-drawing-composite.png"
                alt={`BUQ Blueprint ${article}`}
                fill
                className={styles.panelImage}
                style={{ objectFit: 'contain' }}
                priority
            />
            {/* SVG overlay with dimension lines */}
            <DimensionOverlay
                labels={DIM_LABELS}
                specs={specs}
                hoveredSpec={hoveredSpec}
                onHoverSpec={onHoverSpec}
            />
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

            {/* Fullscreen Modal */}
            <div className={`${styles.modalOverlay} ${isFullscreen ? styles.open : ''}`}>
                <div className={styles.modalContent}>
                    <button
                        className={styles.closeButton}
                        onClick={() => setIsFullscreen(false)}
                        aria-label="Close fullscreen"
                    >
                        <X size={32} />
                    </button>
                    <div className={styles.modalDrawing}>
                        {innerContent}
                    </div>
                    <div className={styles.modalSpecs}>
                        <SpecsTable
                            specs={specs}
                            hoveredSpec={hoveredSpec}
                            onHoverSpec={onHoverSpec}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
