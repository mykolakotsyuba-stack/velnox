'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './about.module.css';

/* ─── Intersection Observer Hook ──────────────────────────────────────── */
function useInView(threshold = 0.12) {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);
    return { ref, inView };
}

/* ─── Parallax Hook ────────────────────────────────────────────────────── */
function useParallax() {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const handleMove = useCallback((e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 14;
        setPos({ x, y });
    }, []);
    useEffect(() => {
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, [handleMove]);
    return pos;
}

/* ─── Magnetic Button Hook ─────────────────────────────────────────────── */
function useMagnetic() {
    const ref = useRef<HTMLAnchorElement>(null);
    const [delta, setDelta] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const onMove = (e: MouseEvent) => {
            const r = el.getBoundingClientRect();
            const x = e.clientX - (r.left + r.width / 2);
            const y = e.clientY - (r.top + r.height / 2);
            const dist = Math.sqrt(x * x + y * y);
            setDelta(dist < 140 ? { x: x * 0.3, y: y * 0.3 } : { x: 0, y: 0 });
        };
        const onLeave = () => setDelta({ x: 0, y: 0 });
        window.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        return () => {
            window.removeEventListener('mousemove', onMove);
            el.removeEventListener('mouseleave', onLeave);
        };
    }, []);
    return { ref, delta };
}

/* ─── Animated Counter ─────────────────────────────────────────────────── */
function useCounter(target: number, active: boolean, duration = 1800) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        if (!active) return;
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) { setValue(target); clearInterval(timer); }
            else { setValue(Math.floor(start)); }
        }, 16);
        return () => clearInterval(timer);
    }, [active, target, duration]);
    return value;
}

/* ─── SVG Blueprint ────────────────────────────────────────────────────── */
function BlueprintSVG({ animate }: { animate: boolean }) {
    return (
        <svg viewBox="0 0 400 300" className={`${styles.blueprint} ${animate ? styles.blueprintDraw : ''}`} xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1a3a5c" strokeWidth="0.5" />
                </pattern>
                <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                    <path d="M 0 0 L 6 3 L 0 6 z" fill="#2d7dd2" />
                </marker>
            </defs>
            <rect width="400" height="300" fill="#040f1c" />
            <rect width="400" height="300" fill="url(#grid)" />
            <circle cx="200" cy="150" r="110" fill="none" stroke="#2d7dd2" strokeWidth="1.5" className={styles.drawPath} strokeDasharray="692" strokeDashoffset="692" />
            <circle cx="200" cy="150" r="80" fill="none" stroke="#2d7dd2" strokeWidth="1" className={styles.drawPath} strokeDasharray="503" strokeDashoffset="503" style={{ animationDelay: '0.3s' }} />
            <circle cx="200" cy="150" r="55" fill="none" stroke="#2d7dd2" strokeWidth="1.5" className={styles.drawPath} strokeDasharray="346" strokeDashoffset="346" style={{ animationDelay: '0.6s' }} />
            <circle cx="200" cy="150" r="30" fill="none" stroke="#4a9edd" strokeWidth="1" className={styles.drawPath} strokeDasharray="188" strokeDashoffset="188" style={{ animationDelay: '0.8s' }} />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const cx = 200 + Math.cos(rad) * 67.5;
                const cy = 150 + Math.sin(rad) * 67.5;
                return <circle key={i} cx={cx} cy={cy} r="8" fill="none" stroke="#2d7dd2" strokeWidth="1" className={styles.drawPath} strokeDasharray="50" strokeDashoffset="50" style={{ animationDelay: `${0.9 + i * 0.08}s` }} />;
            })}
            <line x1="200" y1="30" x2="200" y2="10" stroke="#2d7dd2" strokeWidth="0.8" className={styles.drawPath} strokeDasharray="30" strokeDashoffset="30" style={{ animationDelay: '1.7s' }} markerEnd="url(#arrow)" />
            <line x1="310" y1="150" x2="330" y2="150" stroke="#2d7dd2" strokeWidth="0.8" className={styles.drawPath} strokeDasharray="30" strokeDashoffset="30" style={{ animationDelay: '1.9s' }} markerEnd="url(#arrow)" />
            <line x1="200" y1="270" x2="200" y2="290" stroke="#2d7dd2" strokeWidth="0.8" className={styles.drawPath} strokeDasharray="30" strokeDashoffset="30" style={{ animationDelay: '2.1s' }} markerEnd="url(#arrow)" />
            <text x="210" y="8" fill="#2d7dd2" fontSize="9" fontFamily="monospace" className={styles.fadeLabel} style={{ animationDelay: '2.3s' }}>Ø 220.6</text>
            <text x="332" y="154" fill="#2d7dd2" fontSize="9" fontFamily="monospace" className={styles.fadeLabel} style={{ animationDelay: '2.4s' }}>R 110</text>
            <text x="205" y="298" fill="#2d7dd2" fontSize="9" fontFamily="monospace" className={styles.fadeLabel} style={{ animationDelay: '2.5s' }}>PL-127</text>
            <text x="165" y="153" fill="#4a9edd" fontSize="8" fontFamily="monospace" className={styles.fadeLabel} style={{ animationDelay: '2.6s' }}>Cdyn 48.8 kN</text>
        </svg>
    );
}

/* ─── Stat Item ─────────────────────────────────────────────────────────── */
function StatItem({ target, suffix, label, active, delay }: {
    target: number; suffix: string; label: string; active: boolean; delay: number;
}) {
    const value = useCounter(target, active);
    return (
        <div
            className={`${styles.statItem} ${active ? styles.statItemVisible : ''}`}
            style={{ transitionDelay: `${delay}s` }}
        >
            <div className={styles.statNumber}>
                {value}<span>{suffix}</span>
            </div>
            <div className={styles.statLabel}>{label}</div>
        </div>
    );
}

/* ─── Main Component ────────────────────────────────────────────────────── */
export function AboutPage({ locale }: { locale: string }) {
    const t = useTranslations('about');

    const parallax = useParallax();
    const stats = useInView(0.2);
    const philosophy = useInView();
    const oem = useInView();
    const custom = useInView();
    const cta = useInView();

    const [heroVisible, setHeroVisible] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setHeroVisible(true), 80);
        return () => clearTimeout(timer);
    }, []);

    // Before/After slider
    const [sliderX, setSliderX] = useState(50);
    const sliderRef = useRef<HTMLDivElement>(null);
    const dragging = useRef(false);
    const onSliderMove = useCallback((clientX: number) => {
        if (!sliderRef.current) return;
        const rect = sliderRef.current.getBoundingClientRect();
        const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
        setSliderX(pct);
    }, []);

    const { ref: magnetRef, delta: magnetDelta } = useMagnetic();

    const OEM_CARDS = [
        { icon: '⬡', titleKey: 'oem.cards.metal_title', textKey: 'oem.cards.metal_text' },
        { icon: '◎', titleKey: 'oem.cards.tolerance_title', textKey: 'oem.cards.tolerance_text' },
        { icon: '▲', titleKey: 'oem.cards.engineer_title', textKey: 'oem.cards.engineer_text' },
        { icon: '◈', titleKey: 'oem.cards.resource_title', textKey: 'oem.cards.resource_text' },
    ];

    return (
        <div className={styles.page}>

            {/* ══ BLOCK 1: HERO ══ */}
            <section className={styles.hero}>
                <div className={styles.heroInner}>
                    <div className={styles.heroText}>
                        <div className={`${styles.revealWrap} ${heroVisible ? styles.revealed : ''}`}>
                            <p className={styles.heroEyebrow}>{t('hero.eyebrow')}</p>
                        </div>
                        <div className={`${styles.revealWrap} ${heroVisible ? styles.revealed : ''}`} style={{ transitionDelay: '0.12s' }}>
                            <h1 className={styles.heroTitle}>
                                {t('hero.title_line1')}<br />
                                <em>{t('hero.title_line2')}<br />{t('hero.title_line3')}</em>
                            </h1>
                        </div>
                        <div className={`${styles.revealWrap} ${heroVisible ? styles.revealed : ''}`} style={{ transitionDelay: '0.28s' }}>
                            <p className={styles.heroDesc}>
                                {t('hero.desc1')}<strong>{t('hero.desc_brand')}</strong>{t('hero.desc2')}
                            </p>
                        </div>
                        <div className={`${styles.revealWrap} ${heroVisible ? styles.revealed : ''}`} style={{ transitionDelay: '0.42s' }}>
                            <p className={styles.heroFocus}>
                                {t('hero.focus1')}<strong>{t('hero.focus_em')}</strong>{t('hero.focus2')}
                            </p>
                        </div>
                    </div>

                    <div
                        className={`${styles.heroBearing} ${heroVisible ? styles.bearingVisible : ''}`}
                        style={{ transform: `perspective(900px) rotateY(${parallax.x * 0.5}deg) rotateX(${-parallax.y * 0.35}deg)` }}
                    >
                        <div className={styles.bearingGlow} />
                        <Image
                            src="/images/bearing-hub-3d.png"
                            alt="VELNOX PL-127 Bearing Hub"
                            width={580}
                            height={580}
                            priority
                            className={styles.bearingImg}
                        />
                    </div>
                </div>
                <div className={styles.scrollHint}><span /></div>
            </section>

            {/* ══ STATS BAR ══ */}
            <div className={styles.statsBar} ref={stats.ref}>
                <div className={styles.statsInner}>
                    <StatItem target={12} suffix="+" label={t('stats.years')} active={stats.inView} delay={0} />
                    <StatItem target={400} suffix="+" label={t('stats.clients')} active={stats.inView} delay={0.12} />
                    <StatItem target={98} suffix="%" label={t('stats.repeatability')} active={stats.inView} delay={0.24} />
                    <StatItem target={50} suffix="+" label={t('stats.products')} active={stats.inView} delay={0.36} />
                </div>
            </div>

            {/* ══ BLOCK 2: PHILOSOPHY ══ */}
            <section className={styles.philosophy} ref={philosophy.ref}>
                <div className={`${styles.philosophyInner} ${philosophy.inView ? styles.sectionVisible : ''}`}>
                    <div className={styles.philosophyText}>
                        <span className={styles.sectionTag}>{t('philosophy.tag')}</span>
                        <h2 className={styles.sectionTitle}>
                            {t('philosophy.title_line1')}<br /><em>{t('philosophy.title_line2')}</em>
                        </h2>
                        <p className={styles.sectionBody}>{t('philosophy.body1')}</p>
                        <p className={styles.sectionBody} style={{ marginTop: '20px' }}>{t('philosophy.body2')}</p>
                    </div>
                    <div className={styles.philosophyVisual}>
                        <BlueprintSVG animate={philosophy.inView} />
                    </div>
                </div>
            </section>

            {/* ══ BLOCK 3: OEM QUALITY ══ */}
            <section className={styles.oemSection} ref={oem.ref}>
                <div className={styles.oemInner}>
                    <div className={`${styles.oemHeader} ${oem.inView ? styles.sectionVisible : ''}`}>
                        <span className={styles.sectionTag}>{t('oem.tag')}</span>
                        <h2 className={styles.sectionTitle}>
                            {t('oem.title_line1')}<br /><em>{t('oem.title_line2')}</em>
                        </h2>
                        <p className={styles.sectionBodyCenter}>{t('oem.intro')}</p>
                    </div>
                    <div className={styles.oemGrid}>
                        {OEM_CARDS.map((card, i) => (
                            <div
                                key={i}
                                className={`${styles.oemCard} ${oem.inView ? styles.oemCardVisible : ''}`}
                                style={{ transitionDelay: `${i * 0.12}s` }}
                            >
                                <div className={styles.oemIcon}>{card.icon}</div>
                                <h3 className={styles.oemCardTitle}>{t(card.titleKey as Parameters<typeof t>[0])}</h3>
                                <p className={styles.oemCardText}>{t(card.textKey as Parameters<typeof t>[0])}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ BLOCK 4: CUSTOMIZATION SLIDER ══ */}
            <section className={styles.customSection} ref={custom.ref}>
                <div className={`${styles.customInner} ${custom.inView ? styles.sectionVisible : ''}`}>
                    <div className={styles.customText}>
                        <span className={styles.sectionTag}>{t('custom.tag')}</span>
                        <h2 className={styles.sectionTitle}>
                            {t('custom.title_line1')}<br /><em>{t('custom.title_line2')}</em>
                        </h2>
                        <p className={styles.sectionBody}>{t('custom.body1')}</p>
                        <p className={styles.sectionBody} style={{ marginTop: '20px' }}>{t('custom.body2')}</p>
                    </div>

                    <div
                        className={styles.sliderWrap}
                        ref={sliderRef}
                        onMouseDown={() => { dragging.current = true; }}
                        onMouseUp={() => { dragging.current = false; }}
                        onMouseMove={(e) => { if (dragging.current) onSliderMove(e.clientX); }}
                        onMouseLeave={() => { dragging.current = false; }}
                        onTouchMove={(e) => onSliderMove(e.touches[0].clientX)}
                    >
                        <div className={styles.sliderBase}>
                            <div className={styles.sliderBearing}>
                                <div className={styles.mockBearing}>
                                    <div className={styles.mbOuter} /><div className={styles.mbInner} />
                                    <div className={styles.mbLabel}>STANDARD</div>
                                </div>
                            </div>
                            <p className={styles.sliderCaption}>{t('custom.slider_standard')}</p>
                        </div>
                        <div className={styles.sliderCustom} style={{ clipPath: `inset(0 ${100 - sliderX}% 0 0)` }}>
                            <div className={styles.sliderBearing}>
                                <div className={styles.mockBearing}>
                                    <div className={styles.mbOuter} /><div className={styles.mbInner} />
                                    <div className={styles.mbSeal} /><div className={styles.mbForged} /><div className={styles.mbDirt} />
                                    <div className={styles.mbLabelCustom}>CUSTOM</div>
                                </div>
                            </div>
                            <p className={styles.sliderCaptionCustom}>{t('custom.slider_custom')}</p>
                        </div>
                        <div className={styles.sliderHandle} style={{ left: `${sliderX}%` }}>
                            <div className={styles.sliderLine} />
                            <div className={styles.sliderKnob}>
                                <svg width="18" height="18" viewBox="0 0 18 18">
                                    <path d="M5 9 L1 5 L1 13 Z" fill="white" />
                                    <path d="M13 9 L17 5 L17 13 Z" fill="white" />
                                </svg>
                            </div>
                        </div>
                        <div className={styles.sliderLabels}>
                            <span>{t('custom.slider_left')}</span>
                            <span>{t('custom.slider_right')}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ BLOCK 5: CTA ══ */}
            <section className={styles.ctaSection} ref={cta.ref}>
                <div className={`${styles.ctaInner} ${cta.inView ? styles.ctaVisible : ''}`}>
                    <span className={styles.sectionTag}>{t('cta.tag')}</span>
                    <h2 className={styles.ctaTitle}>
                        {t('cta.title_line1')}<br />
                        {t('cta.title_line2')}<br />
                        {t('cta.title_line3')}<em>{t('cta.title_line3_em')}</em>
                    </h2>
                    <p className={styles.ctaBody}>{t('cta.body')}</p>
                    <a
                        href={`/${locale}/contacts`}
                        ref={magnetRef}
                        className={styles.ctaButton}
                        style={{ transform: `translate(${magnetDelta.x}px, ${magnetDelta.y}px)` }}
                    >
                        {t('cta.button')}
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                </div>
                <div className={styles.ctaBgGrid} aria-hidden />
            </section>

        </div>
    );
}
