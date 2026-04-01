'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import styles from './about.module.css';

/* ─── InView Hook ─────────────────────────────────────────── */
function useInView(threshold = 0.15) {
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

/* ─── Counter Hook ────────────────────────────────────────── */
function useCounter(target: number, duration = 1800, active = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!active) return;
        let start = 0;
        const step = Math.ceil(target / (duration / 16));
        const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(start);
        }, 16);
        return () => clearInterval(timer);
    }, [target, duration, active]);
    return count;
}

/* ─── Stats Card ──────────────────────────────────────────── */
function StatCard({ icon, value, suffix, label, delay, active }: {
    icon: React.ReactNode; value: number; suffix: string; label: string; delay: string; active: boolean;
}) {
    const count = useCounter(value, 1600, active);
    return (
        <div className={`${styles.statCard} ${active ? styles.statCardVisible : ''}`} style={{ transitionDelay: delay }}>
            <div className={styles.statIcon}>{icon}</div>
            <div className={styles.statNumber}>
                {count}<span className={styles.statSuffix}>{suffix}</span>
            </div>
            <div className={styles.statLabel}>{label}</div>
        </div>
    );
}

/* ─── Audience Sector ─────────────────────────────────────── */
function AudienceSector({ icon, title, desc, bgImg, index, active }: {
    icon: React.ReactNode; title: string; desc: string; bgImg: string; index: number; active: boolean;
}) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            className={`${styles.audienceSector} ${active ? styles.sectorVisible : ''}`}
            style={{ transitionDelay: `${0.1 + index * 0.12}s` }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className={`${styles.sectorBg} ${hovered ? styles.sectorBgActive : ''}`}>
                <Image src={bgImg} alt={title} fill style={{ objectFit: 'cover' }} className={styles.sectorImg} />
                <div className={styles.sectorOverlay} />
            </div>
            <div className={styles.sectorContent}>
                <div className={styles.sectorIcon}>{icon}</div>
                <h3 className={styles.sectorTitle}>{title}</h3>
                <p className={`${styles.sectorDesc} ${hovered ? styles.sectorDescVisible : ''}`}>{desc}</p>
            </div>
        </div>
    );
}

/* ─── Main Component ──────────────────────────────────────── */
export function AboutPage({ locale }: { locale: string }) {
    const t = useTranslations('about');

    /* Hero visibility */
    const [heroVisible, setHeroVisible] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setHeroVisible(true), 80);
        return () => clearTimeout(timer);
    }, []);

    /* Section refs */
    const statsSection = useInView(0.1);
    const philosophySection = useInView(0.1);
    const customSection = useInView(0.1);
    const qualitySection = useInView(0.1);
    const audienceSection = useInView(0.08);

    /* Philosophy card hovers */
    const [phiHovered1, setPhiHovered1] = useState(false);
    const [phiHovered2, setPhiHovered2] = useState(false);

    return (
        <div className={styles.page}>

            {/* ══ BLOCK A: HERO ══ */}
            <section className={styles.hero}>
                <div className={styles.heroGrid} aria-hidden />
                <div className={styles.heroOrb1} aria-hidden />
                <div className={styles.heroOrb2} aria-hidden />

                <div className={styles.heroInner}>
                    <div className={`${styles.heroContent} ${heroVisible ? styles.heroVisible : ''}`}>
                        <div className={styles.heroEyebrow}>
                            <span className={styles.eyebrowLine} />
                            {t('hero.eyebrow')}
                        </div>
                        <h1 className={styles.heroTitle}>{t('hero.title')}</h1>
                        <p className={styles.heroLead}>{t('hero.lead')}</p>
                        <a href={`/${locale}/contacts`} className={styles.heroCta}>
                            {t('hero.cta')}
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>
                    </div>

                    {/* Hero visual — Agrihub 3D render */}
                    <div className={`${styles.heroVisual} ${heroVisible ? styles.heroVisualVisible : ''}`}>
                        <div className={styles.heroImageWrapper}>
                            <Image src="/velnox/images/about/hero_bearing_final.png" alt="VELNOX Engineering" fill className={styles.heroGeneratedImg} priority />
                            <div className={styles.heroImageOverlay} />
                        </div>
                    </div>
                </div>

                <div className={styles.scrollHint}><span /></div>
            </section>

            {/* ══ BLOCK B: TECHNICAL DASHBOARD ══ */}
            <section className={styles.statsSection} ref={statsSection.ref}>
                <div className={styles.sectionInner}>
                    <div className={`${styles.sectionHeader} ${statsSection.inView ? styles.fadeUp : ''}`}>
                        <span className={styles.sectionTag}>{t('stats.tag')}</span>
                        <h2 className={styles.sectionTitle}>{t('stats.title')}</h2>
                    </div>

                    <div className={styles.statsGrid}>
                        <StatCard
                            active={statsSection.inView}
                            delay="0.05s"
                            value={12}
                            suffix={t('stats.s1_suffix')}
                            label={t('stats.s1_label')}
                            icon={
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="1.5" />
                                    <circle cx="16" cy="16" r="4" stroke="currentColor" strokeWidth="1.5" />
                                    {[0, 60, 120, 180, 240, 300].map((a, i) => {
                                        const r = (a * Math.PI) / 180;
                                        const x1 = 16 + Math.cos(r) * 7;
                                        const y1 = 16 + Math.sin(r) * 7;
                                        const x2 = 16 + Math.cos(r) * 9;
                                        const y2 = 16 + Math.sin(r) * 9;
                                        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1.2" />;
                                    })}
                                </svg>
                            }
                        />
                        <StatCard
                            active={statsSection.inView}
                            delay="0.15s"
                            value={400}
                            suffix={t('stats.s2_suffix')}
                            label={t('stats.s2_label')}
                            icon={
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <rect x="4" y="4" width="10" height="10" stroke="currentColor" strokeWidth="1.5" />
                                    <rect x="18" y="4" width="10" height="10" stroke="currentColor" strokeWidth="1.5" />
                                    <rect x="4" y="18" width="10" height="10" stroke="currentColor" strokeWidth="1.5" />
                                    <rect x="18" y="18" width="10" height="10" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            }
                        />
                        <StatCard
                            active={statsSection.inView}
                            delay="0.25s"
                            value={98}
                            suffix={t('stats.s3_suffix')}
                            label={t('stats.s3_label')}
                            icon={
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <path d="M 6 26 L 6 6 L 26 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M 6 22 L 12 14 L 18 18 L 26 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <line x1="10" y1="6" x2="10" y2="28" stroke="currentColor" strokeWidth="0.7" strokeDasharray="2 2" />
                                    <line x1="6" y1="18" x2="28" y2="18" stroke="currentColor" strokeWidth="0.7" strokeDasharray="2 2" />
                                </svg>
                            }
                        />
                        <StatCard
                            active={statsSection.inView}
                            delay="0.35s"
                            value={50}
                            suffix={t('stats.s4_suffix')}
                            label={t('stats.s4_label')}
                            icon={
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <rect x="3" y="14" width="26" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                                    <circle cx="10" cy="19" r="2.5" stroke="currentColor" strokeWidth="1.2" />
                                    <circle cx="22" cy="19" r="2.5" stroke="currentColor" strokeWidth="1.2" />
                                    <path d="M 10 14 L 10 8 M 22 14 L 22 8" stroke="currentColor" strokeWidth="1.2" />
                                    <path d="M 8 8 L 24 8" stroke="currentColor" strokeWidth="1.2" />
                                    <path d="M 8 5 L 24 5" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" />
                                </svg>
                            }
                        />
                    </div>
                </div>
            </section>


            {/* ══ BLOCK D: ENGINEERING PHILOSOPHY & OEM FOCUS ══ */}
            <section className={styles.philosophySection} ref={philosophySection.ref}>
                <div className={styles.philosophyOverlay} />
                <div className={styles.sectionInner} style={{ position: 'relative', zIndex: 2 }}>
                    <div className={`${styles.sectionHeader} ${philosophySection.inView ? styles.fadeUp : ''}`} style={{ marginBottom: '48px' }}>
                        <span className={`${styles.sectionTag} ${styles.sectionTagLight}`}>{t('philosophy.tag')}</span>
                        <h2 className={`${styles.sectionTitle} ${styles.sectionTitleLight}`}>{t('philosophy.title')}</h2>
                    </div>

                    <div className={styles.philosophyGrid}>
                        <div
                            className={`${styles.philosophyCard} ${philosophySection.inView ? styles.phiCardVisible : ''}`}
                            style={{ transitionDelay: '0.1s' }}
                            onMouseEnter={() => setPhiHovered1(true)}
                            onMouseLeave={() => setPhiHovered1(false)}
                        >
                            <div className={`${styles.phiCardBg} ${phiHovered1 ? styles.phiCardBgActive : ''}`}>
                                <Image src="/velnox/images/about/phi_left.png" alt="Blueprint" fill className={styles.phiCardImg} />
                                <div className={styles.phiCardOverlay} />
                            </div>
                            <div className={styles.phiCardAccent} />
                            <div className={`${styles.phiIcon} ${phiHovered1 ? styles.phiIconActive : ''}`}>
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                    <circle cx="14" cy="14" r="9" stroke="currentColor" strokeWidth="1.5" />
                                    <circle cx="14" cy="14" r="4" stroke="currentColor" strokeWidth="1.5" />
                                    <line x1="14" y1="5" x2="14" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <line x1="23" y1="14" x2="26" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <line x1="5" y1="14" x2="2" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <line x1="14" y1="23" x2="14" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </div>
                            <div className={styles.phiCardContent}>
                                <h3 className={styles.phiCardTitle}>{t('philosophy.p1_title')}</h3>
                                <p className={`${styles.phiCardText} ${phiHovered1 ? styles.phiCardTextVisible : ''}`}>{t('philosophy.p1_text')}</p>
                            </div>
                        </div>

                        <div
                            className={`${styles.philosophyCard} ${philosophySection.inView ? styles.phiCardVisible : ''}`}
                            style={{ transitionDelay: '0.25s' }}
                            onMouseEnter={() => setPhiHovered2(true)}
                            onMouseLeave={() => setPhiHovered2(false)}
                        >
                            <div className={`${styles.phiCardBg} ${phiHovered2 ? styles.phiCardBgActive : ''}`}>
                                <Image src="/velnox/images/about/industry-agro.jpg" alt="Action" fill className={styles.phiCardImg} />
                                <div className={styles.phiCardOverlay} />
                            </div>
                            <div className={styles.phiCardAccent} />
                            <div className={`${styles.phiIcon} ${phiHovered2 ? styles.phiIconActive : ''}`}>
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                    <rect x="3" y="3" width="9" height="9" stroke="currentColor" strokeWidth="1.5" />
                                    <rect x="16" y="3" width="9" height="9" stroke="currentColor" strokeWidth="1.5" />
                                    <rect x="3" y="16" width="9" height="9" stroke="currentColor" strokeWidth="1.5" />
                                    <rect x="16" y="16" width="9" height="9" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            </div>
                            <div className={styles.phiCardContent}>
                                <h3 className={styles.phiCardTitle}>{t('philosophy.p2_title')}</h3>
                                <p className={`${styles.phiCardText} ${phiHovered2 ? styles.phiCardTextVisible : ''}`}>{t('philosophy.p2_text')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ BLOCK E: CUSTOMIZATION & SCHEMA ══ */}
            <section className={styles.customSection}>
                <div className={styles.sectionInner} ref={customSection.ref as React.RefObject<HTMLDivElement>}>
                    <div className={styles.customLayout}>
                        {/* Left: text */}
                        <div className={`${styles.customContent} ${customSection.inView ? styles.customVisible : ''}`}>
                            <span className={styles.sectionTag}>{t('custom.tag')}</span>
                            <h2 className={styles.sectionTitle}>{t('custom.title')}</h2>
                            <p className={styles.customText}>{t('custom.text')}</p>
                            
                            <div className={styles.customCases}>
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className={styles.caseItem}>
                                        <div className={styles.casePoint} />
                                        <div className={styles.caseTextWrapper}>
                                            <h4 className={styles.caseTitle}>{t(`custom.case${i}_title`)}</h4>
                                            <p className={styles.caseDesc}>{t(`custom.case${i}_text`)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.customGoal}>
                                <span className={styles.goalLine} />
                                <p>{t('custom.goal')}</p>
                            </div>
                        </div>

                        {/* Right: Technical Schema */}
                        <div className={`${styles.customVisual} ${customSection.inView ? styles.customVisualVisible : ''}`}>
                            <div className={styles.schemaContainer}>
                                <Image src="/velnox/images/about/custom_seal_final.png" alt="Engineering Schema" fill className={styles.schemaImg} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ══ BLOCK E-2: QUALITY ══ */}
                <div className={styles.sectionInner} ref={qualitySection.ref as React.RefObject<HTMLDivElement>} style={{ marginTop: '80px' }}>
                    <div className={`${styles.qualityLayout} ${qualitySection.inView ? styles.qualityVisible : ''}`}>
                        <div className={styles.qualityHeaderRow}>
                            <h2 className={styles.qualityTitle}>{t('quality.title')}</h2>
                            <p className={styles.qualityDesc}>{t('quality.text')}</p>
                        </div>
                        <div className={styles.qualityList}>
                            {[
                                {
                                    id: 1,
                                    icon: (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 2v20M2 12h20M7.5 7.5l9 9M7.5 16.5l9-9"/>
                                            <circle cx="12" cy="12" r="10"/>
                                        </svg>
                                    ),
                                    title: t('quality.list_item_1')
                                },
                                {
                                    id: 2,
                                    icon: (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                                            <polyline points="3.29 7 12 12 20.71 7"/>
                                            <line x1="12" y1="22" x2="12" y2="12"/>
                                        </svg>
                                    ),
                                    title: t('quality.list_item_2')
                                },
                                {
                                    id: 3,
                                    icon: (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"/>
                                            <circle cx="12" cy="12" r="10" strokeDasharray="4 4"/>
                                        </svg>
                                    ),
                                    title: t('quality.list_item_3')
                                }
                            ].map((item, idx) => (
                                <div 
                                    key={item.id} 
                                    className={`${styles.qualityCard} ${qualitySection.inView ? styles.qualityCardVisible : ''}`}
                                    style={{ transitionDelay: `${0.1 + idx * 0.15}s` }}
                                >
                                    <div className={styles.qCardIcon}>{item.icon}</div>
                                    <div className={styles.qCardContent}>
                                        <span className={styles.qCardText}>{item.title}</span>
                                    </div>
                                    <div className={styles.qCardDecoration} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ BLOCK F: TARGET AUDIENCE ══ */}
            <section className={styles.audienceSection} ref={audienceSection.ref}>
                <div className={styles.audienceOverlay} />
                <div className={styles.audienceGrid2} aria-hidden />
                <div className={`${styles.sectionInner} ${styles.sectionInnerWide}`} style={{ position: 'relative', zIndex: 2 }}>
                    <div className={`${styles.sectionHeader} ${audienceSection.inView ? styles.fadeUp : ''}`} style={{ textAlign: 'center', marginBottom: '56px' }}>
                        <span className={`${styles.sectionTag} ${styles.sectionTagLight}`} style={{ justifyContent: 'center' }}>{t('audience.tag')}</span>
                        <h2 className={`${styles.sectionTitle} ${styles.sectionTitleLight}`}>{t('audience.title')}</h2>
                        <p className={styles.audienceIntro}>{t('audience.desc')}</p>
                    </div>

                    <div className={styles.audienceSectors}>
                        <AudienceSector
                            active={audienceSection.inView}
                            index={0}
                            bgImg="/velnox/images/about/aud_oem.png"
                            title={t('audience.s1_title')}
                            desc={t('audience.s1_desc')}
                            icon={
                                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                                    <rect x="4" y="14" width="28" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
                                    <circle cx="11" cy="21" r="3.5" stroke="currentColor" strokeWidth="1.3" />
                                    <circle cx="25" cy="21" r="3.5" stroke="currentColor" strokeWidth="1.3" />
                                    <path d="M 11 14 L 11 8 M 25 14 L 25 8" stroke="currentColor" strokeWidth="1.3" />
                                    <path d="M 9 8 L 27 8" stroke="currentColor" strokeWidth="1.3" />
                                </svg>
                            }
                        />
                        <AudienceSector
                            active={audienceSection.inView}
                            index={1}
                            bgImg="/velnox/images/about/aud_eng.png"
                            title={t('audience.s2_title')}
                            desc={t('audience.s2_desc')}
                            icon={
                                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                                    <line x1="4" y1="8" x2="32" y2="8" stroke="currentColor" strokeWidth="1.5" />
                                    <line x1="4" y1="16" x2="24" y2="16" stroke="currentColor" strokeWidth="1.5" />
                                    <line x1="4" y1="24" x2="20" y2="24" stroke="currentColor" strokeWidth="1.5" />
                                    <circle cx="28" cy="27" r="5" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M 28 24 L 28 27 L 30 29" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                                </svg>
                            }
                        />
                        <AudienceSector
                            active={audienceSection.inView}
                            index={2}
                            bgImg="/velnox/images/about/aud_dist.png"
                            title={t('audience.s3_title')}
                            desc={t('audience.s3_desc')}
                            icon={
                                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                                    <circle cx="18" cy="18" r="13" stroke="currentColor" strokeWidth="1.5" />
                                    <ellipse cx="18" cy="18" rx="6" ry="13" stroke="currentColor" strokeWidth="1.2" />
                                    <line x1="5" y1="18" x2="31" y2="18" stroke="currentColor" strokeWidth="1.2" />
                                    <line x1="9" y1="11" x2="27" y2="11" stroke="currentColor" strokeWidth="0.9" strokeDasharray="2 2" />
                                    <line x1="9" y1="25" x2="27" y2="25" stroke="currentColor" strokeWidth="0.9" strokeDasharray="2 2" />
                                </svg>
                            }
                        />
                        <AudienceSector
                            active={audienceSection.inView}
                            index={3}
                            bgImg="/velnox/images/about/aud_agro.png"
                            title={t('audience.s4_title')}
                            desc={t('audience.s4_desc')}
                            icon={
                                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                                    <path d="M 4 28 L 4 18 L 12 12 L 20 18 L 20 28" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                                    <path d="M 20 28 L 20 22 L 32 14 L 32 28" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                                    <line x1="2" y1="28" x2="34" y2="28" stroke="currentColor" strokeWidth="1.5" />
                                    <rect x="14" y="22" width="5" height="6" stroke="currentColor" strokeWidth="1.2" />
                                </svg>
                            }
                        />
                    </div>

                    {/* Footer CTA */}
                    <div className={`${styles.audienceCta} ${audienceSection.inView ? styles.audienceCtaVisible : ''}`}>
                        <a href={`/${locale}/contacts`} className={styles.ctaButtonPrimary}>
                            {t('audience.cta')}
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>
                        <a href={`/${locale}/contacts`} className={styles.ctaButtonSecondary}>
                            {t('audience.cta2')}
                        </a>
                    </div>
                </div>
            </section>

        </div>
    );
}
