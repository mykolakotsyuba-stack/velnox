'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Maximize2, X } from 'lucide-react';
import type { ProductSpecs } from '@/entities/product/model/types';
import { SpecsTable } from './SpecsTable';
import styles from './BlueprintViewer.module.css';
import { useTranslations } from 'next-intl';

interface BlueprintViewerProps {
    article: string;
    specs: ProductSpecs;
    hoveredSpec: string | null;
    onHoverSpec?: (key: string | null) => void;
    schemaSrc?: string;
}

export function BlueprintViewer({
    article,
    specs,
    hoveredSpec,
    onHoverSpec,
    schemaSrc,
}: BlueprintViewerProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const t = useTranslations('product');

    // Coordinats mapping for the 1024x1024 base blueprint image
    // These coordinates map the JSON spec keys ('d_mm', 'J', 'L', etc.) 
    // to their physical locations on the drawing template.
    const markers: Record<string, { x: number; y: number; label: string; width?: number; height?: number; type: 'horizontal' | 'vertical' | 'diameter' }> = {
        'd_mm': { x: 280, y: 512, label: 'd', width: 200, type: 'diameter' }, // front view center bore
        'd_inch': { x: 280, y: 560, label: 'd_in', width: 200, type: 'diameter' },
        'J': { x: 286, y: 200, label: 'J', width: 330, type: 'horizontal' }, // distance between holes
        'L': { x: 100, y: 512, label: 'L', height: 620, type: 'vertical' }, // total height/length front view
        'N': { x: 470, y: 280, label: 'N', width: 60, type: 'diameter' }, // hole diameter
        'A': { x: 800, y: 920, label: 'A', width: 150, type: 'horizontal' }, // total width side view
        'A1': { x: 740, y: 880, label: 'A1', width: 110, type: 'horizontal' }, // housing width side view
        'A2': { x: 680, y: 840, label: 'A2', width: 50, type: 'horizontal' }, // flange thickness side view
    };

    const renderOverlay = () => (
        <svg
            className={styles.overlay}
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Branding Replacement */}
            <text
                x="120" y="512"
                className={styles.brandText}
                transform="rotate(-90 120 512)"
            >
                VELNOX
            </text>
            <text
                x="470" y="512"
                className={styles.designationText}
                transform="rotate(-90 470 512)"
            >
                {article}
            </text>

            {/* Dynamic Markers */}
            {Object.entries(markers).map(([key, marker]) => {
                const isActive = hoveredSpec === key;
                if (specs[key] == null && !isActive) return null; // Only render if spec exists or is hovered

                return (
                    <g
                        key={key}
                        className={`${styles.marker} ${isActive ? styles.active : ''}`}
                        onMouseEnter={() => onHoverSpec?.(key)}
                        onMouseLeave={() => onHoverSpec?.(null)}
                    >
                        {marker.type === 'horizontal' && (
                            <line
                                x1={marker.x - (marker.width || 0) / 2}
                                y1={marker.y}
                                x2={marker.x + (marker.width || 0) / 2}
                                y2={marker.y}
                                className={styles.markerLine}
                            />
                        )}
                        {marker.type === 'vertical' && (
                            <line
                                x1={marker.x}
                                y1={marker.y - (marker.height || 0) / 2}
                                x2={marker.x}
                                y2={marker.y + (marker.height || 0) / 2}
                                className={styles.markerLine}
                            />
                        )}
                        {/* Simplified Diameter marker as horizontal line across center */}
                        {marker.type === 'diameter' && (
                            <line
                                x1={marker.x - (marker.width || 0) / 2}
                                y1={marker.y}
                                x2={marker.x + (marker.width || 0) / 2}
                                y2={marker.y}
                                className={styles.markerLine}
                            />
                        )}

                        {/* Background box for text readability */}
                        <rect
                            x={marker.x - 20}
                            y={marker.y - 12}
                            width={40}
                            height={24}
                            fill={isActive ? '#11141c' : 'rgba(255,255,255,0.7)'}
                            rx={4}
                        />
                        <text x={marker.x} y={marker.y + 5} className={styles.markerText}>
                            {marker.label}
                        </text>
                    </g>
                );
            })}
        </svg>
    );

    return (
        <>
            <section className={styles.container}>
                <h2 className={styles.title}>{t('technical_drawing', { defaultMessage: 'Інтерактивне креслення' })}</h2>

                <div
                    className={styles.blueprintWrapper}
                    onClick={() => setIsFullscreen(true)}
                    title={t('expand', { defaultMessage: 'Розгорнути' })}
                >
                    <button className={styles.expandButton} aria-label="Expand blueprint">
                        <Maximize2 size={20} />
                    </button>

                    <Image
                        src={schemaSrc ?? '/velnox/images/blueprint-base.png'}
                        alt={`Blueprint ${article}`}
                        fill
                        className={styles.blueprintImage}
                        priority
                    />

                    {!schemaSrc && renderOverlay()}
                </div>
            </section>

            {/* Fullscreen Interactive Modal */}
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
                        <div style={{ position: 'relative', width: '100%', height: '100%', maxWidth: '800px', maxHeight: '800px', aspectRatio: '1/1' }}>
                            <Image
                                src={schemaSrc ?? '/velnox/images/blueprint-base.png'}
                                alt={`Blueprint ${article} Fullscreen`}
                                fill
                                className={styles.blueprintImage}
                            />
                            {!schemaSrc && renderOverlay()}
                        </div>
                    </div>

                    <div className={styles.modalSpecs}>
                        <SpecsTable
                            specs={specs}
                            hoveredSpec={hoveredSpec}
                            onHoverSpec={onHoverSpec}
                            isModal={true}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
