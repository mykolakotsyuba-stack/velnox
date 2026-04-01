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
function MetricCard({ value, label, suffix, desc, icon, active, delay }: {
    value: number | string; label: string; suffix?: string; desc?: string; icon?: React.ReactNode; active: boolean; delay: number;
}) {
    const isNumeric = typeof value === 'number';
    const target = isNumeric ? (value as number) : 0;
    const count = useCounter(target, active);
    
    return (
        <div className={`${styles.metricCard} ${active ? styles.metricCardVisible : ''}`}
            style={{ transitionDelay: `${delay}s` }}>
            {icon && <div className={styles.metricIcon}>{icon}</div>}
            <div className={styles.metricValue}>
                {isNumeric ? count : value}
                {suffix && <span className={styles.metricSuffix}>{suffix}</span>}
            </div>
            <div className={styles.metricLabel}>{label}</div>
            {desc && <p className={styles.metricDesc}>{desc}</p>}
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
            key: 'harrow',
            bg: '/velnox/images/industry-harrow.png',
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
            key: 'cultivator',
            bg: '/velnox/images/industry-cultivator.png',
        },
        {
            icon: (
                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="24" width="56" height="16" rx="2" />
                    <circle cx="16" cy="32" r="4" /><circle cx="32" cy="32" r="4" /><circle cx="48" cy="32" r="4" />
                    <path d="M8 24v-8M56 24v-8M4 40v8M60 40v8" />
                </svg>
            ),
            key: 'seeder',
            bg: '/velnox/images/industry-seeder.png',
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
            <ProductSlider locale={locale} />

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
                                onClick={() => {
                                    if (hoveredCard === i) {
                                        // Second tap: navigate
                                        window.location.href = `/${locale}/products/agro`;
                                    } else {
                                        // First tap: set as hovered
                                        setHoveredCard(i);
                                    }
                                }}
                            >
                                {/* Photo background */}
                                <div className={styles.cardPhotoBg}>
                                    <Image src={ind.bg} alt={ind.key} fill style={{ objectFit: 'cover' }} sizes="(max-width: 820px) 100vw, 33vw" quality={75} />
                                </div>
                                
                                {/* Default dark gradient at bottom */}
                                <div className={styles.cardDefaultOverlay} aria-hidden />

                                {/* Hover State Blue Reveal */}
                                <div className={`${styles.cardHoverOverlay} ${hoveredCard === i ? styles.fadeUp : ''}`} style={{ opacity: hoveredCard === i ? 1 : 0 }}>
                                    <div className={styles.cardIcon}>
                                        {ind.icon}
                                    </div>
                                    <div className={styles.cardHoverBody}>
                                        <p className={styles.cardText}>
                                            {t(`industries.${ind.key}.text`)}
                                        </p>
                                        <p className={styles.cardOem}>
                                            OEM: {t(`industries.${ind.key}.oem`)}
                                        </p>
                                    </div>
                                </div>

                                {/* Title bar (Always visible, part of the content animation) */}
                                <div className={styles.cardContent}>
                                    <h3 className={styles.cardTitle}>{t(`industries.${ind.key}.title`)}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════
                BLOCK 3 — OEM OPTIMIZATION (Parallax)
            ══════════════════════ */}
            <section className={styles.oemOptimization}>
                <div className={styles.oemOverlay} aria-hidden />
                
                <div className={styles.oemInner} ref={processRef.ref as React.RefObject<HTMLDivElement>}>
                    <div className={`${styles.oemHeader} ${processRef.inView ? styles.oemHeaderVisible : ''}`}>
                        <span className={styles.sectionTag}>{t('oem_optimization.tag')}</span>
                        <h2>{t('oem_optimization.title')}</h2>
                        <p>{t('oem_optimization.desc')}</p>
                    </div>

                    <div className={styles.oemGrid}>
                        {/* Step 1: Audit */}
                        <div 
                            className={`${styles.oemStep} ${processRef.inView ? styles.oemStepVisible : ''}`}
                            style={{ transitionDelay: '0.1s' }}
                        >
                            <div className={styles.oemIcon}>
                                <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="36" cy="36" r="16" />
                                    <path d="M48 48l12 12M30 36h12M36 30v12" strokeLinecap="round" />
                                    <path d="M25 65h30" strokeLinecap="round" />
                                </svg>
                            </div>
                            <h3>{t('oem_optimization.step1.title')}</h3>
                            <p>{t('oem_optimization.step1.text')}</p>
                        </div>

                        {/* Step 2: Selection */}
                        <div 
                            className={`${styles.oemStep} ${processRef.inView ? styles.oemStepVisible : ''}`}
                            style={{ transitionDelay: '0.3s' }}
                        >
                            <div className={styles.oemIcon}>
                                <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M20 30h40M60 30l-10-10M60 30l-10 10M60 50H20M20 50l10-10M20 50l10 10" strokeLinecap="round" strokeLinejoin="round" />
                                    <rect x="25" y="15" width="30" height="50" rx="3" opacity="0.2" />
                                </svg>
                            </div>
                            <h3>{t('oem_optimization.step2.title')}</h3>
                            <p>{t('oem_optimization.step2.text')}</p>
                        </div>

                        {/* Step 3: Supply */}
                        <div 
                            className={`${styles.oemStep} ${processRef.inView ? styles.oemStepVisible : ''}`}
                            style={{ transitionDelay: '0.5s' }}
                        >
                            <div className={styles.oemIcon}>
                                <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M20 40l20-10 20 10-20 10-20-10z" strokeLinejoin="round" />
                                    <path d="M20 40v15l20 10 20-10V40" strokeLinejoin="round" />
                                    <path d="M40 50v15" strokeLinecap="round" />
                                    <circle cx="48" cy="22" r="3" fill="currentColor" />
                                    <circle cx="32" cy="22" r="3" fill="currentColor" />
                                </svg>
                            </div>
                            <h3>{t('oem_optimization.step3.title')}</h3>
                            <p>{t('oem_optimization.step3.text')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════
                BLOCK 4 — STATS & RELIABILITY
            ══════════════════════ */}
            <section className={styles.quality} ref={qualityRef.ref as React.RefObject<HTMLElement>}>
                <div className={styles.sectionInner}>
                    <div className={`${styles.sectionHead} ${qualityRef.inView ? styles.fadeUp : ''}`}>
                        <span className={styles.sectionTag}>{t('stats.tag')}</span>
                        <h2 className={styles.sectionTitle}>{t('stats.title')}</h2>
                        <p className={styles.sectionDesc}>{t('stats.desc')}</p>
                    </div>

                    <div className={styles.metricsGrid}>
                        {/* Metric 1: Compatibility */}
                        <MetricCard 
                            value={100} 
                            suffix="%" 
                            label={t('stats.metrics.compatibility.title')} 
                            desc={t('stats.metrics.compatibility.desc')}
                            icon={
                                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10 20a10 10 0 1 1 0 20 10 10 0 0 1 0-20M38 20a10 10 0 1 1 0 20 10 10 0 0 1 0-20" opacity="0.2" />
                                    <path d="M24 10v28M10 24h28" />
                                    <path d="M14 14l20 20M34 14L14 34" strokeWidth="1" />
                                </svg>
                            }
                            active={qualityRef.inView} 
                            delay={0.1} 
                        />
                        {/* Metric 2: Resource */}
                        <MetricCard 
                            value={2000} 
                            suffix="+" 
                            label={t('stats.metrics.resource.title')} 
                            desc={t('stats.metrics.resource.desc')}
                            icon={
                                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="24" cy="24" r="18" />
                                    <path d="M24 12v12l8 4" />
                                    <path d="M42 24a18 18 0 0 1-18 18" strokeWidth="4" opacity="0.1" />
                                    <path d="M14 6l-2-2M34 6l2-2" />
                                </svg>
                            }
                            active={qualityRef.inView} 
                            delay={0.2} 
                        />
                        {/* Metric 3: Sealings */}
                        <MetricCard 
                            value="ZERO" 
                            label={t('stats.metrics.sealings.title')} 
                            desc={t('stats.metrics.sealings.desc')}
                            icon={
                                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M24 4l16 8v12c0 10-16 18-16 18S8 34 8 24V12l16-8z" />
                                    <path d="M24 28a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" fill="currentColor" />
                                    <path d="M30 14l-12 12" opacity="0.5" />
                                </svg>
                            }
                            active={qualityRef.inView} 
                            delay={0.3} 
                        />
                    </div>

                    <div className={`${styles.qualityCta} ${qualityRef.inView ? styles.fadeUp : ''}`} style={{ transitionDelay: '0.5s' }}>
                        <a href={`/${locale}/presentation.pdf`} className={styles.pdfBtn}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="18">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                <path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {t('stats.button')}
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
