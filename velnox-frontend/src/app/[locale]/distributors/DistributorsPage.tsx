'use client';

import { useTranslations } from 'next-intl';
import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './distributors.module.css';

/* ─── In-view hook ─────────────────────────────────── */
function useInView(threshold = 0.12) {
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

/* ─── Count-up hook ────────────────────────────────── */
function useCountUp(target: number, duration = 1800, active = false) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        if (!active) return;
        let start: number | null = null;
        const step = (ts: number) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3); // ease-out cubic
            setValue(Math.round(ease * target));
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [active, target, duration]);
    return value;
}

/* ─── Lead form modal ─────────────────────────────── */
function LeadModal({ onClose }: { onClose: () => void }) {
    const t = useTranslations('distributors');
    const [sent, setSent] = useState(false);
    const [form, setForm] = useState({ company: '', name: '', phone: '', email: '', country: '', message: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
    };

    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.modalClose} onClick={onClose} aria-label="Close">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20">
                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                    </svg>
                </button>

                {sent ? (
                    <div className={styles.successState}>
                        <div className={styles.successIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M8 12l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h3>{t('form.success_title')}</h3>
                        <p>{t('form.success_body')}</p>
                        <button className={styles.formBtnClose} onClick={onClose}>{t('form.close')}</button>
                    </div>
                ) : (
                    <>
                        <span className={styles.modalTag}>{t('form.tag')}</span>
                        <h2 className={styles.modalTitle}>{t('form.title')}</h2>
                        <p className={styles.modalDesc}>{t('form.desc')}</p>

                        <form className={styles.leadForm} onSubmit={handleSubmit}>
                            <div className={`${styles.formRow} ${styles.formField1}`}>
                                <input required type="text" placeholder={t('form.company_ph')}
                                    value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
                                <input required type="text" placeholder={t('form.country_ph')}
                                    value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
                            </div>
                            <div className={`${styles.formRow} ${styles.formField2}`}>
                                <input required type="text" placeholder={t('form.name_ph')}
                                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                <input required type="tel" placeholder="+380 / +48 / +49..."
                                    value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                            </div>
                            <input className={styles.formField3} required type="email" placeholder="contact@company.com"
                                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                            <textarea className={styles.formField4} rows={4} placeholder={t('form.message_ph')}
                                value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                            <button type="submit" className={styles.formSubmit}>
                                {t('form.submit')}
                                <svg viewBox="0 0 16 16" fill="none" width="14">
                                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}


/* ─── Main page ────────────────────────────────────── */
export function DistributorsPage() {
    const t = useTranslations('distributors');
    const [showModal, setShowModal] = useState(false);
    const heroRef = useInView(0.05);
    const gridRef = useInView(0.08);

    const count5 = useCountUp(5, 1400, heroRef.inView);
    const count2 = useCountUp(2, 1000, heroRef.inView);
    const count100 = useCountUp(100, 2000, heroRef.inView);

    useEffect(() => {
        document.body.style.overflow = showModal ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [showModal]);

    const DISTRIBUTORS = [
        { name: 'TECH SOLUTIONS Sp. z o.o.', country: 'Польща', logo: 'https://nte-bearings.com/wp-content/uploads/2025/02/techsolutions-europe-logo-1462363501.png', flag: '🇵🇱', isAuthorized: true },
        { name: 'ТОВ «ТТК»', country: 'Україна', logo: 'https://nte-bearings.com/wp-content/uploads/2025/11/ttk-logo-smaller.png', flag: '🇺🇦', isAuthorized: false },
        { name: 'ПП «Промподшипник»', country: 'Україна', logo: 'https://nte-bearings.com/wp-content/uploads/2025/11/prompsh-logo-bigger.png', flag: '🇺🇦', isAuthorized: false },
        { name: 'ТОВ «Промкомпонент»', country: 'Україна', logo: 'https://nte-bearings.com/wp-content/uploads/2025/04/promcomponent-logo-small.png', flag: '🇺🇦', isAuthorized: false },
        { name: 'ТОВ «ТД ІРБІС»', country: 'Україна', logo: 'https://nte-bearings.com/wp-content/uploads/2025/11/logo-irbis-new-3.png', flag: '🇺🇦', isAuthorized: false },
    ];

    return (
        <div className={styles.page}>
            {showModal && <LeadModal onClose={() => setShowModal(false)} />}

            {/* ══ HERO ══ */}
            <section className={styles.hero} ref={heroRef.ref as React.RefObject<HTMLElement>}>
                <div className={styles.heroBg} aria-hidden />
                {/* Floating orbs */}
                <div className={styles.orb1} aria-hidden />
                <div className={styles.orb2} aria-hidden />
                <div className={styles.orb3} aria-hidden />

                <div className={styles.heroInner}>
                    <div className={styles.heroContent}>
                        <p className={`${styles.heroEyebrow} ${heroRef.inView ? styles.animIn : ''}`}
                            style={{ animationDelay: '0.05s' }}>
                            <span className={styles.eyebrowLine} />
                            {t('hero.eyebrow')}
                        </p>
                        <h1 className={`${styles.heroTitle} ${heroRef.inView ? styles.animIn : ''}`}
                            style={{ animationDelay: '0.18s' }}>
                            {t('hero.title')}
                        </h1>
                        <p className={`${styles.heroDesc} ${heroRef.inView ? styles.animIn : ''}`}
                            style={{ animationDelay: '0.32s' }}>
                            {t('hero.desc')}
                        </p>

                        {/* Stats row — count-up numbers */}
                        <div className={`${styles.heroStats} ${heroRef.inView ? styles.animIn : ''}`}
                            style={{ animationDelay: '0.48s' }}>
                            <div className={styles.stat}>
                                <span className={styles.statNum}>{count5}</span>
                                <span className={styles.statLabel}>{t('hero.stat_partners')}</span>
                            </div>
                            <div className={styles.statDivider} />
                            <div className={styles.stat}>
                                <span className={styles.statNum}>{count2}</span>
                                <span className={styles.statLabel}>{t('hero.stat_countries')}</span>
                            </div>
                            <div className={styles.statDivider} />
                            <div className={styles.stat}>
                                <span className={styles.statNum}>{count100}%</span>
                                <span className={styles.statLabel}>{t('hero.stat_certified')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ GRID ══ */}
            <section className={styles.gridSection} ref={gridRef.ref as React.RefObject<HTMLElement>}>
                <div className={styles.sectionInner}>
                    <div className={`${styles.sectionHead} ${gridRef.inView ? styles.fadeUp : ''}`}>
                        <span className={styles.sectionTag}>{t('grid.tag')}</span>
                        <h2 className={styles.sectionTitle}>{t('grid.title')}</h2>
                    </div>

                    <div className={styles.distributorGrid}>
                        {DISTRIBUTORS.map((d, i) => (
                            <div
                                key={d.name}
                                className={`${styles.distCard} ${gridRef.inView ? styles.distCardIn : ''} ${d.isAuthorized ? styles.distCardAuth : ''}`}
                                style={{ transitionDelay: `${i * 0.12}s` }}
                            >
                                {/* Scan-line sweep on hover */}
                                <div className={styles.cardScan} aria-hidden />

                                <div className={styles.cardLogoWrap}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={d.logo} alt={d.name} className={styles.cardLogo} />
                                </div>
                                <div className={styles.cardMeta}>
                                    <span className={styles.cardFlag}>{d.flag}</span>
                                    <span className={styles.cardName}>{d.name}</span>
                                    <span className={styles.cardCountry}>{d.country}</span>
                                </div>
                                <div className={styles.cardBadge}>
                                    <svg viewBox="0 0 16 16" width="12" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M8 1l1.8 3.6L14 5.5l-3 2.9.7 4.1L8 10.4l-3.7 2.1.7-4.1L2 5.5l4.2-.9L8 1z" strokeLinejoin="round" />
                                    </svg>
                                    {t('grid.badge')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


        </div>
    );
}


