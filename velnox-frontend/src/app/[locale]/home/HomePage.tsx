'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import styles from './home.module.css';
import { ProductSlider } from './ProductSlider';

/* ─── useInView hook ─────────────────────────────────────────────────── */
function useInView(threshold = 0.15) {
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

/* ─── Animated counter ───────────────────────────────────────────────── */
function useCounter(target: number, active: boolean, duration = 1600) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        if (!active) return;
        let cur = 0;
        const step = target / (duration / 16);
        const t = setInterval(() => {
            cur += step;
            if (cur >= target) { setVal(target); clearInterval(t); }
            else setVal(Math.floor(cur));
        }, 16);
        return () => clearInterval(t);
    }, [active, target, duration]);
    return val;
}

/* ─── Ripple effect ──────────────────────────────────────────────────── */
function useRipple() {
    const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
    const addRipple = useCallback((e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();
        setRipples(r => [...r, { x, y, id }]);
        setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 700);
    }, []);
    return { ripples, addRipple };
}

/* ─── Metric card with counter ──────────────────────────────────────── */
function MetricCard({ value, label, suffix, active, delay }: {
    value: number; label: string; suffix: string; active: boolean; delay: number;
}) {
    const count = useCounter(value, active);
    return (
        <div className={`${styles.metricCard} ${active ? styles.metricCardVisible : ''}`}
            style={{ transitionDelay: `${delay}s` }}>
            <div className={styles.metricValue}>{count}<span className={styles.metricSuffix}>{suffix}</span></div>
            <div className={styles.metricLabel}>{label}</div>
        </div>
    );
}

/* ─── Main component ─────────────────────────────────────────────────── */
export function HomePage({ locale }: { locale: string }) {
    const t = useTranslations('home');

    // Hero
    const [heroIn, setHeroIn] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [searchVal, setSearchVal] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    useEffect(() => { setTimeout(() => setHeroIn(true), 80); }, []);
    const onFocus = () => { setSearchFocused(true); setShowDropdown(true); };
    const onBlur = () => { setTimeout(() => { setSearchFocused(false); setShowDropdown(false); }, 180); };

    // Industries
    const industryRef = useInView(0.1);
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    // Process / Engineering
    const processRef = useInView(0.1);
    const [progressStep, setProgressStep] = useState(0);
    useEffect(() => {
        if (!processRef.inView) return;
        const timers = [
            setTimeout(() => setProgressStep(1), 200),
            setTimeout(() => setProgressStep(2), 700),
            setTimeout(() => setProgressStep(3), 1200),
        ];
        return () => timers.forEach(clearTimeout);
    }, [processRef.inView]);

    // Quality
    const qualityRef = useInView(0.15);

    // CTA
    const ctaRef = useInView(0.2);
    const { ripples: r1, addRipple: rip1 } = useRipple();
    const { ripples: r2, addRipple: rip2 } = useRipple();

    const POPULAR = [
        'LEFG 209 TDT', 'PL-127', '32008 X', 'VKHB 2090', 'BAH-0038 B'
    ];

    const INDUSTRIES = [
        {
            icon: (
                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 48h56M8 48V36l8-8h8l4-12h8l4 12h8l8 8v12" />
                    <circle cx="16" cy="52" r="4" /><circle cx="48" cy="52" r="4" />
                    <path d="M24 36h16M32 24v12" />
                </svg>
            ),
            key: 'agro',
        },
        {
            icon: (
                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="36" width="24" height="16" rx="2" />
                    <rect x="12" y="28" width="16" height="8" />
                    <path d="M28 44h20l8-16H28M36 52h8M32 52v-4" />
                    <circle cx="14" cy="52" r="4" /><circle cx="44" cy="52" r="4" />
                </svg>
            ),
            key: 'construction',
        },
        {
            icon: (
                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="24" width="56" height="16" rx="2" />
                    <circle cx="16" cy="32" r="4" /><circle cx="32" cy="32" r="4" /><circle cx="48" cy="32" r="4" />
                    <path d="M8 24v-8M56 24v-8M4 40v8M60 40v8" />
                </svg>
            ),
            key: 'industrial',
        },
    ];

    const PROCESS_STEPS = [
        { icon: '🔍', key: 'analyze' },
        { icon: '📐', key: 'design' },
        { icon: '⚙️', key: 'produce' },
    ];

    return (
        <div className={styles.page}>

            {/* ══ PRODUCT SLIDER — FIRST SCREEN ══ */}
            <ProductSlider />

            {/* ══════════════════════
                SEARCH / ACTION HERO
            ══════════════════════ */}
            <section className={styles.hero}>
                {/* Blueprint grid bg */}
                <div className={styles.heroBg} aria-hidden />
                <div className={`${styles.heroOverlay} ${searchFocused ? styles.heroOverlayDim : ''}`} aria-hidden />

                <div className={styles.heroInner}>
                    {/* Left: copy + search */}
                    <div className={styles.heroLeft}>
                        <div className={`${styles.revealWrap} ${heroIn ? styles.revealed : ''}`}>
                            <p className={styles.heroEyebrow}>
                                <span className={styles.eyebrowLine} />
                                {t('hero.eyebrow')}
                            </p>
                        </div>
                        <div className={`${styles.revealWrap} ${heroIn ? styles.revealed : ''}`} style={{ transitionDelay: '0.1s' }}>
                            <h1 className={styles.heroTitle}>{t('hero.title')}</h1>
                        </div>
                        <div className={`${styles.revealWrap} ${heroIn ? styles.revealed : ''}`} style={{ transitionDelay: '0.2s' }}>
                            <p className={styles.heroSubtitle}>{t('hero.subtitle')}</p>
                        </div>

                        {/* Search bar */}
                        <div className={`${styles.revealWrap} ${heroIn ? styles.revealed : ''}`} style={{ transitionDelay: '0.32s' }}>
                            <div className={`${styles.searchWrap} ${searchFocused ? styles.searchFocused : ''}`}>
                                <div className={styles.searchBar}>
                                    {/* Search icon */}
                                    <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                                    </svg>

                                    <input
                                        type="text"
                                        className={styles.searchInput}
                                        placeholder={t('hero.search_placeholder')}
                                        value={searchVal}
                                        onChange={e => setSearchVal(e.target.value)}
                                        onFocus={onFocus}
                                        onBlur={onBlur}
                                    />

                                    {/* QR icon */}
                                    <button className={styles.searchToolBtn} title={t('hero.scan_title')} aria-label={t('hero.scan_title')}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                            <path d="M3 7V4h3M21 7V4h-3M3 17v3h3M21 17v3h-3" strokeLinecap="round" strokeLinejoin="round" />
                                            <rect x="7" y="7" width="4" height="4" rx="0.5" /><rect x="13" y="7" width="4" height="4" rx="0.5" />
                                            <rect x="7" y="13" width="4" height="4" rx="0.5" /><rect x="13" y="13" width="4" height="4" rx="0.5" />
                                        </svg>
                                    </button>

                                    {/* Micrometer / advanced search */}
                                    <button className={`${styles.searchToolBtn} ${styles.searchAdvanced}`} title={t('hero.advanced_title')} aria-label={t('hero.advanced_title')}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                            <path d="M3 12h2M19 12h2M12 3v2M12 19v2" strokeLinecap="round" />
                                            <circle cx="12" cy="12" r="4" />
                                            <path d="M5.6 5.6l1.4 1.4M16.9 16.9l1.5 1.5M5.6 18.4l1.4-1.4M16.9 7.1l1.5-1.5" strokeLinecap="round" />
                                        </svg>
                                        <span>{t('hero.advanced_label')}</span>
                                    </button>
                                </div>

                                {/* Dropdown */}
                                {showDropdown && (
                                    <div className={styles.searchDropdown}>
                                        <p className={styles.dropdownHeading}>{t('hero.popular_label')}</p>
                                        {POPULAR.map(q => (
                                            <button key={q} className={styles.dropdownItem}
                                                onMouseDown={() => setSearchVal(q)}>
                                                <svg viewBox="0 0 16 16" width="14" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                    <circle cx="7" cy="7" r="5" /><path d="M13 13l-2.5-2.5" strokeLinecap="round" />
                                                </svg>
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: bearing image */}
                    <div className={`${styles.heroBearing} ${heroIn ? styles.heroBearingIn : ''}`}>
                        <div className={styles.bearingGlow} />
                        <Image
                            src="/velnox/images/bearing-hub-3d.png"
                            alt="VELNOX PL-127 Bearing Hub"
                            width={620}
                            height={620}
                            priority
                            className={styles.bearingImg}
                        />
                    </div>
                </div>

                {/* Scroll hint */}
                <div className={styles.scrollHint}><span /></div>
            </section>

            {/* ══════════════════════
                BLOCK 2 — INDUSTRIES
            ══════════════════════ */}
            <section className={styles.industries} ref={industryRef.ref as React.RefObject<HTMLElement>}>
                <div className={styles.sectionInner}>
                    <div className={`${styles.sectionHead} ${industryRef.inView ? styles.fadeUp : ''}`}>
                        <span className={styles.sectionTag}>{t('industries.tag')}</span>
                        <h2 className={styles.sectionTitle}>{t('industries.title')}</h2>
                        <p className={styles.sectionDesc}>{t('industries.desc')}</p>
                    </div>

                    <div className={styles.industryGrid}>
                        {INDUSTRIES.map((ind, i) => (
                            <div
                                key={ind.key}
                                className={`${styles.industryCard} ${industryRef.inView ? styles.industryCardIn : ''}`}
                                style={{ transitionDelay: `${i * 0.15}s` }}
                                onMouseEnter={() => setHoveredCard(i)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                {/* Background photo overlay */}
                                <div className={`${styles.cardPhotoBg} ${hoveredCard === i ? styles.cardPhotoBgVisible : ''}`}
                                    style={{ backgroundImage: `url(/velnox/images/industry-${ind.key}.jpg)` }} />
                                <div className={styles.cardContent}>
                                    <div className={`${styles.cardIcon} ${hoveredCard === i ? styles.cardIconFilled : ''}`}>
                                        {ind.icon}
                                    </div>
                                    <h3 className={styles.cardTitle}>{t(`industries.${ind.key}.title`)}</h3>
                                    <p className={styles.cardText}>{t(`industries.${ind.key}.text`)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════
                BLOCK 3 — OEM PROCESS
            ══════════════════════ */}
            <section className={styles.process} ref={processRef.ref as React.RefObject<HTMLElement>}>
                <div className={styles.sectionInner}>
                    <div className={`${styles.sectionHead} ${processRef.inView ? styles.fadeUp : ''}`}>
                        <span className={styles.sectionTag}>{t('process.tag')}</span>
                        <h2 className={styles.sectionTitle}>{t('process.title')}</h2>
                        <p className={styles.sectionDesc}>{t('process.desc')}</p>
                    </div>

                    <div className={styles.processTrack}>
                        {/* Progress bar connecting steps */}
                        <div className={styles.progressRail}>
                            <div
                                className={styles.progressFill}
                                style={{ width: progressStep === 0 ? '0%' : progressStep === 1 ? '16%' : progressStep === 2 ? '50%' : '100%' }}
                            />
                        </div>

                        {PROCESS_STEPS.map((step, i) => (
                            <div
                                key={step.key}
                                className={`${styles.processStep} ${progressStep > i ? styles.stepActive : ''}`}
                            >
                                <div className={styles.stepBubble}>
                                    <span className={styles.stepEmoji}>{step.icon}</span>
                                    <div className={styles.stepNum}>{i + 1}</div>
                                </div>
                                <h3 className={styles.stepTitle}>{t(`process.steps.${step.key}.title`)}</h3>
                                <p className={styles.stepText}>{t(`process.steps.${step.key}.text`)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════
                BLOCK 4 — QUALITY
            ══════════════════════ */}
            <section className={styles.quality} ref={qualityRef.ref as React.RefObject<HTMLElement>}>
                <div className={styles.sectionInner}>
                    <div className={`${styles.sectionHead} ${qualityRef.inView ? styles.fadeUp : ''}`}>
                        <span className={styles.sectionTag}>{t('quality.tag')}</span>
                        <h2 className={styles.sectionTitle}>{t('quality.title')}</h2>
                        <p className={styles.sectionDesc}>{t('quality.desc')}</p>
                    </div>

                    <div className={styles.metricsGrid}>
                        <MetricCard value={100} suffix="%" label={t('quality.metric1')} active={qualityRef.inView} delay={0} />
                        <MetricCard value={9001} suffix="" label="ISO" active={qualityRef.inView} delay={0.12} />
                        <MetricCard value={1} suffix="μm" label={t('quality.metric3')} active={qualityRef.inView} delay={0.24} />
                        <MetricCard value={24} suffix="h" label={t('quality.metric4')} active={qualityRef.inView} delay={0.36} />
                    </div>

                    <div className={`${styles.qualityCta} ${qualityRef.inView ? styles.fadeUp : ''}`} style={{ transitionDelay: '0.5s' }}>
                        <a href={`/${locale}/protocols.pdf`} className={styles.pdfBtn} target="_blank" rel="noopener">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                <path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {t('quality.download_btn')}
                        </a>
                    </div>
                </div>
            </section>

            {/* ══════════════════════
                BLOCK 5 — CTA
            ══════════════════════ */}
            <section className={styles.cta} ref={ctaRef.ref as React.RefObject<HTMLElement>}>
                <div className={styles.ctaBgGrid} aria-hidden />
                <div className={`${styles.ctaInner} ${ctaRef.inView ? styles.ctaVisible : ''}`}>
                    <span className={styles.sectionTag}>{t('cta.tag')}</span>
                    <h2 className={styles.ctaTitle}>{t('cta.title')}</h2>
                    <p className={styles.ctaDesc}>{t('cta.desc')}</p>
                    <div className={styles.ctaButtons}>
                        <a
                            href={`/${locale}/products`}
                            className={styles.btnPrimary}
                            onClick={rip1}
                        >
                            {r1.map(rp => (
                                <span key={rp.id} className={styles.ripple}
                                    style={{ left: rp.x, top: rp.y }} />
                            ))}
                            {t('cta.btn_catalog')}
                            <svg viewBox="0 0 16 16" fill="none" width="16">
                                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>
                        <a
                            href={`/${locale}/contacts`}
                            className={styles.btnOutline}
                            onClick={rip2}
                        >
                            {r2.map(rp => (
                                <span key={rp.id} className={styles.ripple}
                                    style={{ left: rp.x, top: rp.y }} />
                            ))}
                            {t('cta.btn_engineer')}
                        </a>
                    </div>
                </div>
            </section>

        </div>
    );
}
