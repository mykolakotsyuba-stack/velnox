'use client';

import { useState, useRef, useEffect } from 'react';
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
    { name: 'TECH SOLUTIONS Sp. z o.o.', country: 'Польща', logo: 'https://nte-bearings.com/wp-content/uploads/2025/02/techsolutions-europe-logo-1462363501.png', flag: '🇵🇱' },
    { name: 'ТОВ «ТТК»', country: 'Україна', logo: 'https://nte-bearings.com/wp-content/uploads/2025/11/ttk-logo-smaller.png', flag: '🇺🇦' },
    { name: 'ТОВ «Промкомпонент»', country: 'Україна', logo: 'https://nte-bearings.com/wp-content/uploads/2025/04/promcomponent-logo-small.png', flag: '🇺🇦' },
    { name: 'ТОВ «ТД ІРБІС»', country: 'Україна', logo: 'https://nte-bearings.com/wp-content/uploads/2025/11/logo-irbis-new-3.png', flag: '🇺🇦' },
];

type Distributor = typeof DISTRIBUTORS[0];

function OrderModal({ distributor, onClose }: { distributor: Distributor; onClose: () => void }) {
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const contact = [
            form.name,
            form.phone,
            form.email,
            `Дистриб'ютор: ${distributor.name}`,
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
                setError('Помилка при відправці. Спробуйте ще раз або зв\'яжіться з нами напряму.');
            }
        } catch {
            setError('Помилка з\'єднання. Перевірте підключення та спробуйте знову.');
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
                        <h3>Запит відправлено!</h3>
                        <p>Ваш запит успішно надіслано. Дистриб'ютор <strong>{distributor.name}</strong> зв'яжеться з вами найближчим часом.</p>
                        <button className={styles.formBtnClose} onClick={onClose}>Закрити</button>
                    </div>
                ) : (
                    <>
                        <span className={styles.modalTag}>ЗАМОВИТИ У ДИСТРИБ'ЮТОРА</span>
                        <h2 className={styles.modalTitle}>{distributor.name}</h2>
                        <p className={styles.modalDesc}>Заповніть форму, щоб відправити запит на покупку цього товару.</p>

                        <form className={styles.leadForm} onSubmit={handleSubmit}>
                            <div className={styles.formRow}>
                                <input required type="text" placeholder="Ваше ім'я або компанія"
                                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                            </div>
                            <div className={styles.formRow}>
                                <input required type="tel" placeholder="Телефон"
                                    value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                            </div>
                            <div className={styles.formRow}>
                                <input required type="email" placeholder="Email"
                                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                            </div>
                            <textarea className={styles.formFieldArea} rows={3} placeholder="Додаткове повідомлення або кількість деталей"
                                value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />

                            {error && <p className={styles.formError}>{error}</p>}

                            <button type="submit" className={styles.formSubmit} disabled={loading}>
                                {loading ? 'Відправляємо...' : 'Відправити запит'}
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
    const [selectedDistributor, setSelectedDistributor] = useState<Distributor | null>(null);
    const { ref, inView } = useInView(0.1);

    return (
        <section className={`${styles.container} print-hide`} ref={ref as React.RefObject<HTMLElement>}>
            <div className={`${styles.header} ${inView ? styles.fadeUp : ''}`}>
                <span className={styles.tag}>ПАРТНЕРСЬКА МЕРЕЖА</span>
                <h2 className={styles.title}>Авторизовані дистриб'ютори</h2>
            </div>

            <div className={styles.grid}>
                {DISTRIBUTORS.map((d, i) => (
                    <div
                        key={d.name}
                        className={`${styles.card} ${inView ? styles.cardIn : ''}`}
                        style={{ transitionDelay: `${i * 0.12}s` }}
                    >
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

                        <button
                            className={styles.orderButton}
                            onClick={() => setSelectedDistributor(d)}
                        >
                            <svg viewBox="0 0 24 24" width="14" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Замовити тут
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
