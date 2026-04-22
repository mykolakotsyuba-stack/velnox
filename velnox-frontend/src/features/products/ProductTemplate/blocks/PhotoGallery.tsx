import Image from 'next/image';
import { useState } from 'react';
import styles from './PhotoGallery.module.css';

interface PhotoGalleryProps {
    images: string[];
    altText: string;
    hero?: boolean;
}

export function PhotoGallery({ images, altText, hero = false }: PhotoGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [touchEndX, setTouchEndX] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Threshold for swipe
    const minSwipeDistance = 50;

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
        setTouchEndX(null); // Reset end 
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
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            nextImage();
        } else if (isRightSwipe) {
            prevImage();
        }

        // Reset values
        setTouchStartX(null);
        setTouchEndX(null);
    };

    return (
        <div className={`${styles.container} ${hero ? styles.heroContainer : ''}`}>
            <div
                className={`${styles.mainImageWrapper} ${hero ? styles.heroWrapper : ''}`}
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
                    className={styles.mainImage}
                    priority
                    draggable={false} // Disable native image drag to allow our custom swipe
                />

                {/* Optional UI hints for desktop/mobile swiping */}
                <div className={styles.swipeHintLeft} onClick={(e) => { e.stopPropagation(); prevImage(); }} style={{ opacity: activeIndex > 0 ? 1 : 0 }} />
                <div className={styles.swipeHintRight} onClick={(e) => { e.stopPropagation(); nextImage(); }} style={{ opacity: activeIndex < images.length - 1 ? 1 : 0 }} />

                {/* Bullets for mobile styling */}
                {images.length > 1 && (
                    <div className={styles.bullets}>
                        {images.map((_, idx) => (
                            <div key={idx} className={`${styles.bullet} ${idx === activeIndex ? styles.bulletActive : ''}`} />
                        ))}
                    </div>
                )}
            </div>

            {images.length > 1 && (
                <div className={styles.thumbnails}>
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            className={`${styles.thumbnailWrapper} ${idx === activeIndex ? styles.active : ''}`}
                            onClick={() => setActiveIndex(idx)}
                            aria-label={`View image ${idx + 1}`}
                        >
                            <Image
                                src={img}
                                alt={`${altText} thumbnail ${idx + 1}`}
                                fill
                                className={styles.thumbnailImage}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
