'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './ProductSlider.module.css';

interface Slide {
    bgImg: string;
    tag: string;
    title: string;
    body: string;
    spec: string;
    cta1?: string;
    cta2?: string;
    link1: string;
    link2: string;
}

export function ProductSlider({ locale }: { locale: string }) {
    const t = useTranslations('home.slider');
    const [active, setActive] = useState(0);
    const [animDir, setAnimDir] = useState<'left' | 'right'>('right');
    const [isAnimating, setIsAnimating] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const SLIDES: Slide[] = [
        {
            bgImg: '/velnox/images/bg_seeder_highspeed.png',
            tag: t('slide1.tag'),
            title: t('slide1.title'),
            body: t('slide1.body'),
            spec: t('slide1.spec'),
            cta1: t('slide1.cta1'),
            cta2: t('slide1.cta2'),
            link1: `/${locale}/products/agro`,
            link2: `/${locale}/contacts`,
        },
        {
            bgImg: '/velnox/images/bg_agro.png',
            tag: t('slide2.tag'),
            title: t('slide2.title'),
            body: t('slide2.body'),
            spec: t('slide2.spec'),
            cta1: t('slide2.cta1'),
            cta2: t('slide2.cta2'),
            link1: `/${locale}/products/bearings`,
            link2: `/${locale}/contacts`,
        },
        {
            bgImg: '/velnox/images/bg_hub_kit_macro.png',
            tag: t('slide3.tag'),
            title: t('slide3.title'),
            body: t('slide3.body'),
            spec: t('slide3.spec'),
            cta1: t('slide3.cta1'),
            cta2: t('slide3.cta2'),
            link1: `/${locale}/distributors`,
            link2: `/${locale}/contacts`,
        },
    ];

    const goTo = useCallback((idx: number, dir: 'left' | 'right' = 'right') => {
        if (isAnimating) return;
        setIsAnimating(true);
        setAnimDir(dir);
        setTimeout(() => {
            setActive(idx);
            setIsAnimating(false);
        }, 420);
    }, [isAnimating]);

    const next = useCallback(() => {
        goTo((active + 1) % SLIDES.length, 'right');
    }, [active, SLIDES.length, goTo]);

    const prev = useCallback(() => {
        goTo((active - 1 + SLIDES.length) % SLIDES.length, 'left');
    }, [active, SLIDES.length, goTo]);

    // Auto-advance
    useEffect(() => {
        intervalRef.current = setInterval(next, 6000);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [next]);

    const resetTimer = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(next, 6000);
    }, [next]);

    const slide = SLIDES[active];

    return (
        <section className={styles.slider}>
            {/* Background image (blurred, full bleed) */}
            <div className={styles.sliderBg}>
                {SLIDES.map((s, i) => (
                    <div key={i} className={`${styles.bgLayer} ${i === active ? styles.bgLayerActive : ''}`}>
                        <Image src={s.bgImg} alt="" fill style={{ objectFit: 'cover' }} quality={60} />
                    </div>
                ))}
                <div className={styles.bgOverlay} />
                <div className={styles.bgVignette} />
            </div>

            {/* Slide rail */}
            <div className={styles.sliderInner}>
                {/* Left: content */}
                <div className={`${styles.slideContent} ${isAnimating ? (animDir === 'right' ? styles.exitLeft : styles.exitRight) : styles.slideIn}`}>
                    <span className={styles.slideTag}>
                        <span className={styles.tagPulse} />
                        {slide.tag}
                    </span>

                    <h2 className={styles.slideTitle}>{slide.title}</h2>
                    <p className={styles.slideBody}>{slide.body}</p>

                    <div className={styles.slideSpec}>
                        <svg viewBox="0 0 16 16" width="14" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="8" cy="8" r="6" /><path d="M8 5v4l2.5 2.5" strokeLinecap="round" />
                        </svg>
                        {slide.spec}
                    </div>

                    <div className={styles.slideActions}>
                        <Link href={slide.link1} className={styles.slideBtn}>
                            {slide.cta1 || t('cta_details')}
                            <svg viewBox="0 0 16 16" fill="none" width="14">
                                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                        <Link href={slide.link2} className={styles.slideBtnGhost}>
                            {slide.cta2 || t('cta_engineer')}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className={styles.controls}>
                {/* Prev/Next arrows */}
                <button className={`${styles.arrow} ${styles.arrowPrev}`} onClick={() => { prev(); resetTimer(); }} aria-label="Previous">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20">
                        <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                {/* Dots */}
                <div className={styles.dots}>
                    {SLIDES.map((_, i) => (
                        <button
                            key={i}
                            className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
                            onClick={() => { goTo(i, i > active ? 'right' : 'left'); resetTimer(); }}
                            aria-label={`Slide ${i + 1}`}
                        />
                    ))}
                </div>

                <button className={`${styles.arrow} ${styles.arrowNext}`} onClick={() => { next(); resetTimer(); }} aria-label="Next">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20">
                        <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            {/* Progress bar */}
            <div className={styles.progressBar}>
                <div key={active} className={styles.progressFill} />
            </div>
        </section>
    );
}
