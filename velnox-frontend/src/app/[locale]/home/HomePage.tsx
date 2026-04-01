'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import styles from './home.module.css';
import { ProductSlider } from './ProductSlider';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '/velnox-api/api';

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
    
    // ──────────────────────────────────────────────────────────────────────────
    // CTA: Request to Engineer
    // ──────────────────────────────────────────────────────────────────────────
    const [ctaStatus, setCtaStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errMsg, setErrMsg] = useState('');
    const [contact, setContact] = useState('');
    const [reqType, setReqType] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const f = e.target.files[0];
            setFile(f);
            if (f.type.startsWith('image/')) {
                setPreviewUrl(URL.createObjectURL(f));
            } else {
                setPreviewUrl(null); // non-image file
            }
        }
    };

    const handleCtaSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCtaStatus('loading');
        setErrMsg('');

        try {
            const payload = new FormData();
            payload.append('contact', contact);
            payload.append('type', reqType);
            if (file) {
                payload.append('file', file);
            }

            const res = await fetch(`${API_BASE}/v1/leads/engineer`, {
                method: 'POST',
                headers: { Accept: 'application/json' },
                body: payload,
            });

            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.error ?? 'error');
            
            setCtaStatus('success');
            setContact('');
            setReqType('');
            setFile(null);
            setPreviewUrl(null);
        } catch (err: any) {
            setErrMsg('Помилка відправки. Будь ласка, перевірте дані або спробуйте пізніше.');
            setCtaStatus('error');
        }
    };

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

    return (
        <div className={styles.page}>

            {/* ══ PRODUCT SLIDER — FIRST SCREEN ══ */}
            <ProductSlider locale={locale} />

            {/* ══════════════════════
                BLOCK 1 — STATS & RELIABILITY (Moved up)
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
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
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
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
                                    <circle cx="12" cy="12" r="5" />
                                </svg>
                            }
                            active={qualityRef.inView} 
                            delay={0.2} 
                        />
                        {/* Metric 3: Protection (100%) */}
                        <MetricCard 
                            value={100} 
                            suffix="%"
                            label={t('stats.metrics.sealings.title')} 
                            desc={t('stats.metrics.sealings.desc')}
                            icon={
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
                                    <path d="M8 12L11 15L16 9" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 6V7M12 17V18" strokeLinecap="round" />
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
                BLOCK 2 — OEM OPTIMIZATION (Parallax)
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
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="12" cy="12" r="3" opacity="0.2" />
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
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                                    <path d="M7 21l-4-4 4-4M3 17h18M17 3l4 4-4 4M21 7H3" strokeLinecap="round" strokeLinejoin="round" />
                                    <rect x="8" y="8" width="8" height="8" rx="1" opacity="0.2" />
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
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                                    <path d="M21 8l-9-4-9 4 9 4 9-4z" strokeLinejoin="round" />
                                    <path d="M3 8v8l9 4 9-4V8" strokeLinejoin="round" />
                                    <path d="M12 12v8" strokeLinecap="round" />
                                    <path d="M12 4v4" opacity="0.3" />
                                </svg>
                            </div>
                            <h3>{t('oem_optimization.step3.title')}</h3>
                            <p>{t('oem_optimization.step3.text')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════
                BLOCK 3 — INDUSTRIES
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
                                    <Image 
                                        src={ind.bg} 
                                        alt={ind.key} 
                                        fill 
                                        style={{ objectFit: 'cover' }} 
                                        sizes="(max-width: 820px) 100vw, 33vw" 
                                        quality={75} 
                                        priority={i === 0} 
                                    />
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
                BLOCK 5 — CTA (Request to Engineer) v2
            ══════════════════════ */}
            <section className={`${styles.cta} ${ctaRef.inView ? styles.ctaVisible : ''}`} ref={ctaRef.ref as React.RefObject<HTMLElement>}>
                <div className={styles.ctaBgLayer}>
                    {/* Background Photo */}
                    <div className={styles.ctaPhotoBg}>
                        <Image 
                            src="/velnox/images/cta-bg.png" 
                            alt="Engineering background" 
                            fill 
                            style={{ objectFit: 'cover' }} 
                            sizes="100vw"
                            quality={85}
                        />
                    </div>
                    {/* Gradient Overlay for Text Readability */}
                    <div className={styles.ctaOverlay} />
                    {/* Blueprint Seal Blueprint Wireframe */}
                    <div className={styles.ctaBlueprint} />
                </div>

                <div className={styles.ctaInner}>
                    {/* LEFT (60%) */}
                    <div className={styles.ctaInfo}>
                        <h2 className={styles.ctaTitle}>{t('cta.title')}</h2>
                        <p className={styles.ctaDesc}>{t('cta.desc')}</p>
                        
                        {/* Logos row (Grayscale text badges) */}
                        <div className={styles.ctaLogos}>
                            <span className={styles.oemBadge}>JOHN DEERE</span>
                            <span className={styles.oemBadge}>CASE IH</span>
                            <span className={styles.oemBadge}>CLAAS</span>
                            <span className={styles.oemBadge}>HORSCH</span>
                            <span className={styles.oemBadge}>BEDNAR</span>
                        </div>
                    </div>

                    {/* RIGHT (40%) */}
                    <div className={styles.ctaFormCard}>
                        {ctaStatus === 'success' ? (
                            <div className={styles.ctaSuccess}>
                                <svg className={styles.successIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <h3>{t('cta.form.success_title')}</h3>
                                <p>{t('cta.form.success_desc')}</p>
                            </div>
                        ) : (
                            <form className={styles.formGrid} onSubmit={handleCtaSubmit}>
                                {/* Contact Field */}
                                <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                                    <input 
                                        type="text" 
                                        className={styles.fieldInput} 
                                        placeholder=" " 
                                        required 
                                        value={contact}
                                        onChange={e => setContact(e.target.value)}
                                    />
                                    <label className={styles.fieldLabel}>{t('cta.form.contact')}</label>
                                </div>
                                
                                {/* Request Type */}
                                <div className={`${styles.fieldGroup} ${styles.fullWidth}`}>
                                    <select 
                                        className={styles.fieldSelect} 
                                        required
                                        value={reqType}
                                        onChange={e => setReqType(e.target.value)}
                                    >
                                        <option value="" disabled>{t('cta.form.type_options.placeholder')}</option>
                                        <option value="analogue">🔍 {t('cta.form.type_options.analogue')}</option>
                                        <option value="resource">📐 {t('cta.form.type_options.resource')}</option>
                                        <option value="batch">📦 {t('cta.form.type_options.batch')}</option>
                                        <option value="custom">⚙️ {t('cta.form.type_options.custom')}</option>
                                    </select>
                                    <label className={styles.fieldLabel}>{t('cta.form.type')}</label>
                                </div>

                                {/* AI Drop Zone */}
                                <div className={`${styles.fieldGroup} ${styles.fullWidth} ${styles.dropZone}`}>
                                    <input 
                                        type="file" 
                                        accept=".jpg,.jpeg,.png,.heic,.webp"
                                        className={styles.fileInput}
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                    />
                                    <div 
                                        className={styles.dropZoneInner}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {previewUrl ? (
                                            <div className={styles.previewContainer}>
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={previewUrl} alt="Preview" className={styles.filePreview} />
                                                <span className={styles.fileName}>{file?.name}</span>
                                            </div>
                                        ) : file ? (
                                            <div className={styles.previewContainer}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.dropIcon}>
                                                    <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9zM13 2v7h7" />
                                                </svg>
                                                <span className={styles.fileName}>{file.name}</span>
                                            </div>
                                        ) : (
                                            <>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className={styles.dropIcon}>
                                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                                                </svg>
                                                <span className={styles.dropText}>{t('cta.form.upload')}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Error */}
                                {ctaStatus === 'error' && (
                                    <div className={`${styles.fullWidth} ${styles.formError}`}>
                                        {errMsg}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className={styles.fullWidth}>
                                    <button 
                                        type="submit" 
                                        className={styles.ctaSubmit}
                                        disabled={ctaStatus === 'loading'}
                                    >
                                        {ctaStatus === 'loading' ? (
                                            <>
                                                <div className={styles.loader} />
                                                <span>{t('cta.form.sending')}</span>
                                            </>
                                        ) : (
                                            <span>{t('cta.form.submit')}</span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
