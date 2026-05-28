import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import styles from './PhotoGallery.module.css';

const MODEL_VIEWER_CDN = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';

function useModelViewerScript(enabled: boolean): boolean {
    const [ready, setReady] = useState(false);
    useEffect(() => {
        if (!enabled) return;
        if (typeof window === 'undefined') return;
        if (customElements.get('model-viewer')) { setReady(true); return; }
        if (document.querySelector(`script[src*="model-viewer"]`)) {
            const id = setInterval(() => {
                if (customElements.get('model-viewer')) { setReady(true); clearInterval(id); }
            }, 80);
            return () => clearInterval(id);
        }
        const s = document.createElement('script');
        s.type = 'module';
        s.src = MODEL_VIEWER_CDN;
        s.onload = () => {
            const id = setInterval(() => {
                if (customElements.get('model-viewer')) { setReady(true); clearInterval(id); }
            }, 80);
        };
        document.head.appendChild(s);
    }, [enabled]);
    return ready;
}

interface PhotoGalleryProps {
    images: string[];
    altText: string;
    model3dSrc?: string | null;
    hero?: boolean;
}

export function PhotoGallery({ images, altText, model3dSrc, hero = false }: PhotoGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [touchEndX, setTouchEndX] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [activeTab, setActiveTab] = useState<'photo' | '3d'>('photo');
    const [model3dActivated, setModel3dActivated] = useState(false);
    const [model3dLoaded, setModel3dLoaded] = useState(false);
    const modelRef = useRef<HTMLElement>(null);
    const scriptReady = useModelViewerScript(model3dActivated);

    const minSwipeDistance = 50;
    const has3D = !!model3dSrc;

    useEffect(() => {
        const el = modelRef.current;
        if (!el || !model3dActivated || !scriptReady) return;
        const onLoad = () => setModel3dLoaded(true);
        el.addEventListener('load', onLoad);
        // model-viewer may already be loaded by the time the listener attaches
        if ((el as unknown as { loaded?: boolean }).loaded) setModel3dLoaded(true);
        return () => el.removeEventListener('load', onLoad);
    }, [model3dActivated, scriptReady]);

    if (!images || images.length === 0) {
        return (
            <div className={styles.placeholder}>
                <span>No images available</span>
            </div>
        );
    }

    const nextImage = () => {
        if (activeIndex < images.length - 1) setActiveIndex(prev => prev + 1);
    };

    const prevImage = () => {
        if (activeIndex > 0) setActiveIndex(prev => prev - 1);
    };

    const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
        setTouchEndX(null);
        setIsDragging(true);
        if ('targetTouches' in e) {
            setTouchStartX(e.targetTouches[0].clientX);
        } else {
            setTouchStartX((e as React.MouseEvent).clientX);
        }
    };

    const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
        if (!isDragging) return;
        if ('targetTouches' in e) {
            setTouchEndX(e.targetTouches[0].clientX);
        } else {
            setTouchEndX((e as React.MouseEvent).clientX);
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        if (!touchStartX || touchEndX === null) return;
        const distance = touchStartX - touchEndX;
        if (distance > minSwipeDistance) nextImage();
        else if (distance < -minSwipeDistance) prevImage();
        setTouchStartX(null);
        setTouchEndX(null);
    };

    const handle3DTabClick = () => {
        setActiveTab('3d');
        if (!model3dActivated) setModel3dActivated(true);
    };

    return (
        <div className={`${styles.container} ${hero ? styles.heroContainer : ''}`}>
            {/* Tabs: Photo / 3D */}
            {has3D && (
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'photo' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('photo')}
                    >
                        <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="2" y="3" width="16" height="14" rx="2" />
                            <circle cx="7" cy="8" r="2" />
                            <path d="M2 14l4-4 3 3 4-5 5 6" strokeLinejoin="round" />
                        </svg>
                        <span>Фото</span>
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === '3d' ? styles.tab3dActive : styles.tab3dIdle}`}
                        onClick={handle3DTabClick}
                    >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                        <span>3D модель</span>
                    </button>
                </div>
            )}

            {/* Photo view */}
            <div
                className={`${styles.mainImageWrapper} ${hero ? styles.heroWrapper : ''}`}
                style={{ display: activeTab === 'photo' ? 'block' : 'none' }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleTouchStart}
                onMouseMove={handleTouchMove}
                onMouseUp={handleTouchEnd}
                onMouseLeave={handleTouchEnd}
            >
                <Image
                    src={images[activeIndex]}
                    alt={`${altText} - View ${activeIndex + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={styles.mainImage}
                    priority={activeIndex === 0}
                    draggable={false}
                />

                <div className={styles.swipeHintLeft} onClick={(e) => { e.stopPropagation(); prevImage(); }} style={{ opacity: activeIndex > 0 ? 1 : 0 }} />
                <div className={styles.swipeHintRight} onClick={(e) => { e.stopPropagation(); nextImage(); }} style={{ opacity: activeIndex < images.length - 1 ? 1 : 0 }} />

                {images.length > 1 && (
                    <div className={styles.bullets}>
                        {images.map((_, idx) => (
                            <div key={idx} className={`${styles.bullet} ${idx === activeIndex ? styles.bulletActive : ''}`} />
                        ))}
                    </div>
                )}
            </div>

            {/* 3D view */}
            {has3D && activeTab === '3d' && (
                <div className={`${styles.mainImageWrapper} ${styles.viewer3d}`}>
                    {model3dActivated && !scriptReady && (
                        <div className={styles.loader3d}>
                            <div className={styles.spinner} />
                            <span>Initialization...</span>
                        </div>
                    )}

                    {model3dActivated && scriptReady && (
                        <>
                            {!model3dLoaded && (
                                <div className={styles.loader3d}>
                                    <div className={styles.spinner} />
                                    <span>Loading 3D model...</span>
                                </div>
                            )}
                            {/* @ts-ignore */}
                            <model-viewer
                                ref={modelRef}
                                src={model3dSrc!}
                                alt={altText}
                                auto-rotate=""
                                camera-controls=""
                                shadow-intensity="0.8"
                                exposure="1"
                                loading="eager"
                                rotation-per-second="18deg"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    background: 'transparent',
                                    opacity: model3dLoaded ? 1 : 0,
                                    transition: 'opacity 0.5s ease',
                                }}
                            />
                        </>
                    )}

                    {model3dActivated && model3dLoaded && (
                        <p className={styles.hint3d}>Drag to rotate, scroll to zoom</p>
                    )}
                </div>
            )}

            {/* Thumbnails — only in photo mode */}
            {activeTab === 'photo' && images.length > 1 && (
                <div className={styles.thumbnails}>
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            className={`${styles.thumbnailWrapper} ${idx === activeIndex ? styles.active : ''}`}
                            onClick={() => { setActiveIndex(idx); setActiveTab('photo'); }}
                            aria-label={`View image ${idx + 1}`}
                        >
                            <Image
                                src={img}
                                alt={`${altText} thumbnail ${idx + 1}`}
                                fill
                                sizes="80px"
                                className={styles.thumbnailImage}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
