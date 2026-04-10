'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ProductDTO, Locale } from '@/entities/product/model/types';
import { PdfButton } from '@/features/products/ProductTemplate/blocks/PdfButton';
import styles from './index.module.css';

interface CtaBlockProps {
    product: ProductDTO;
    locale: Locale;
}

const REQUEST_TYPES = [
    { value: 'analogue', label: 'Підбір за зразком' },
    { value: 'resource', label: 'Прорахунок ресурсу' },
    { value: 'batch',    label: 'Замовлення партії' },
    { value: 'custom',   label: 'Кастомне рішення' },
] as const;

function ContactModal({ article, onClose }: { article: string; onClose: () => void }) {
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [type, setType] = useState<'analogue' | 'resource' | 'batch' | 'custom'>('batch');
    const [contact, setContact] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const contactValue = `${contact} / Артикул: ${article}`;

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/v1/leads/engineer`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({ contact: contactValue, type }),
                }
            );
            const data = await res.json();
            if (data.success) {
                setSent(true);
            } else {
                setError('Помилка при відправці. Спробуйте ще раз.');
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
                <button className={styles.modalClose} onClick={onClose} aria-label="Закрити">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20">
                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                    </svg>
                </button>

                {sent ? (
                    <div className={styles.successState}>
                        <div className={styles.successIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="#00953E" strokeWidth="1.5" width="52">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M8 12l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h3>Запит надіслано!</h3>
                        <p>Наш інженер розгляне ваш запит і зв'яжеться з вами найближчим часом.</p>
                        <button className={styles.btnClose} onClick={onClose}>Закрити</button>
                    </div>
                ) : (
                    <>
                        <span className={styles.modalTag}>ЗАПИТ ДО ІНЖЕНЕРА</span>
                        <h2 className={styles.modalTitle}>Артикул: <strong>{article}</strong></h2>
                        <p className={styles.modalDesc}>Оберіть тип запиту та вкажіть контактні дані — ми зв'яжемося з вами.</p>

                        <form onSubmit={handleSubmit} className={styles.leadForm}>
                            <div className={styles.typeGrid}>
                                {REQUEST_TYPES.map(rt => (
                                    <button
                                        key={rt.value}
                                        type="button"
                                        className={`${styles.typeBtn} ${type === rt.value ? styles.typeBtnActive : ''}`}
                                        onClick={() => setType(rt.value)}
                                    >
                                        {rt.label}
                                    </button>
                                ))}
                            </div>

                            <textarea
                                className={styles.contactArea}
                                required
                                rows={3}
                                placeholder="Ваше ім'я, телефон, email або будь-яке повідомлення"
                                value={contact}
                                onChange={e => setContact(e.target.value)}
                            />

                            {error && <p className={styles.formError}>{error}</p>}

                            <button type="submit" className={styles.formSubmit} disabled={loading}>
                                {loading ? 'Відправляємо...' : 'Надіслати запит'}
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

export function CtaBlock({ product, locale }: CtaBlockProps) {
    const t = useTranslations('product');
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <section className={`${styles.section} print-hide`}>
                <div className={styles.content}>
                    <h2 className={styles.title}>{t('cta_title')}</h2>
                    <p className={styles.desc}>{t('cta_desc')}</p>
                    <div className={styles.actions}>
                        <button className={styles.btnPrimary} onClick={() => setModalOpen(true)}>
                            {t('btn_contact')}
                        </button>
                        <PdfButton product={product} locale={locale} />
                    </div>
                </div>
            </section>

            {modalOpen && (
                <ContactModal article={product.article} onClose={() => setModalOpen(false)} />
            )}
        </>
    );
}
