'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import styles from './index.module.css';

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

const DISTRIBUTORS = [
    { nameKey: 'd1_name' as const, countryKey: 'd1_country' as const, logo: 'https://nte-bearings.com/wp-content/uploads/2025/02/techsolutions-europe-logo-1462363501.png', flag: '🇵🇱' },
    { nameKey: 'd2_name' as const, countryKey: 'd2_country' as const, logo: 'https://nte-bearings.com/wp-content/uploads/2025/11/ttk-logo-smaller.png', flag: '🇺🇦' },
    { nameKey: 'd3_name' as const, countryKey: 'd3_country' as const, logo: 'https://nte-bearings.com/wp-content/uploads/2025/04/promcomponent-logo-small.png', flag: '🇺🇦' },
    { nameKey: 'd4_name' as const, countryKey: 'd4_country' as const, logo: 'https://nte-bearings.com/wp-content/uploads/2025/11/logo-irbis-new-3.png', flag: '🇺🇦' },
];

type Distributor = typeof DISTRIBUTORS[0];

function OrderModal({ distributor, onClose }: { distributor: Distributor; onClose: () => void }) {
    const t = useTranslations('distributors');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
    const distName = t(`partners.${distributor.nameKey}`);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const contact = [
            form.name,
            form.phone,
            form.email,
            `Distributor: ${distName}`,
            form.message,
        ].filter(Boolean).join(' / ');

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/v1/leads/engineer`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({ contact, type: 'batch' }),
                }
            );
            const data = await res.json();
            if (data.success) {
                setSent(true);
            } else {
                setError('Error');
            }
        } catch {
            setError('Error');
        } finally {
            setLoading(false);
        }
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
                            <svg viewBox="0 0 24 24" fill="none" stroke="#00953E" strokeWidth="1.5" width="48">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M8 12l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h3>{t('order.sent_title')}</h3>
                        <p>{t('order.sent_desc', { name: distName })}</p>
                        <button className={styles.formBtnClose} onClick={onClose}>{t('order.close')}</button>
                    </div>
                ) : (
                    <>
                        <span className={styles.modalTag}>{t('order.tag')}</span>
                        <h2 className={styles.modalTitle}>{distName}</h2>
                        <p className={styles.modalDesc}>{t('order.desc')}</p>

                        <form className={styles.leadForm} onSubmit={handleSubmit}>
                            <div className={styles.formRow}>
                                <input required type="text" placeholder={t('order.name_ph')}
                                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                            </div>
                            <div className={styles.formRow}>
                                <input required type="tel" placeholder={t('order.phone_ph')}
                                    value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                            </div>
                            <div className={styles.formRow}>
                                <input required type="email" placeholder="Email"
                                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                            </div>
                            <textarea className={styles.formFieldArea} rows={3} placeholder={t('order.message_ph')}
                                value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />

                            {error && <p className={styles.formError}>{error}</p>}

                            <button type="submit" className={styles.formSubmit} disabled={loading}>
                                {loading ? '...' : t('order.submit')}
                                {!loading && (
                                    <svg viewBox="0 0 16 16" fill="none" width="14">
                                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export function DistributorsBlock() {
    const t = useTranslations('distributors');
    const [selectedDistributor, setSelectedDistributor] = useState<Distributor | null>(null);
    const { ref, inView } = useInView(0.1);

    return (
        <section className={`${styles.container} print-hide`} ref={ref as React.RefObject<HTMLElement>}>
            <div className={`${styles.header} ${inView ? styles.fadeUp : ''}`}>
                <span className={styles.tag}>{t('partners.tag')}</span>
                <h2 className={styles.title}>{t('partners.title')}</h2>
            </div>

            <div className={styles.grid}>
                {DISTRIBUTORS.map((d, i) => (
                    <div
                        key={d.nameKey}
                        className={`${styles.card} ${inView ? styles.cardIn : ''}`}
                        style={{ transitionDelay: `${i * 0.12}s` }}
                    >
                        <div className={styles.cardScan} aria-hidden />

                        <div className={styles.cardLogoWrap}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={d.logo} alt={t(`partners.${d.nameKey}`)} className={styles.cardLogo} />
                        </div>
                        <div className={styles.cardMeta}>
                            <span className={styles.cardFlag}>{d.flag}</span>
                            <span className={styles.cardName}>{t(`partners.${d.nameKey}`)}</span>
                            <span className={styles.cardCountry}>{t(`partners.${d.countryKey}`)}</span>
                        </div>

                        <button
                            className={styles.orderButton}
                            onClick={() => setSelectedDistributor(d)}
                        >
                            <svg viewBox="0 0 24 24" width="14" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {t('partners.order_btn')}
                        </button>
                    </div>
                ))}
            </div>

            {selectedDistributor && (
                <OrderModal
                    distributor={selectedDistributor}
                    onClose={() => setSelectedDistributor(null)}
                />
            )}
        </section>
    );
}
