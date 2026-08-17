'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ProductDTO, Locale } from '@/entities/product/model/types';
import { PdfButton } from '@/features/products/ProductTemplate/blocks/PdfButton';
import styles from './index.module.css';

interface CtaBlockProps {
    product: ProductDTO;
    locale: Locale;
    onModalOpen?: () => void;
    onModalClose?: () => void;
}

const REQUEST_TYPE_VALUES = ['analogue', 'resource', 'batch', 'custom'] as const;

function ContactModal({ article, onClose }: { article: string; onClose: () => void }) {
    const t = useTranslations('product');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [type, setType] = useState<'analogue' | 'resource' | 'batch' | 'custom'>('batch');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const contactValue = [name, phone, email, message]
            .filter(Boolean).join(' / ') + ` / ${t('cta.article_prefix')} ${article}`;

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
                setError(t('cta.error_send'));
            }
        } catch {
            setError(t('cta.error_connection'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.modalClose} onClick={onClose} aria-label={t('cta.close')}>
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
                        <h3>{t('cta.sent_title')}</h3>
                        <p>{t('cta.sent_desc')}</p>
                        <button className={styles.btnClose} onClick={onClose}>{t('cta.close')}</button>
                    </div>
                ) : (
                    <>
                        <span className={styles.modalTag}>{t('cta.request_tag')}</span>
                        <h2 className={styles.modalTitle}>{t('cta.article_prefix')} <strong>{article}</strong></h2>
                        <p className={styles.modalDesc}>{t('cta.modal_desc')}</p>

                        <form onSubmit={handleSubmit} className={styles.leadForm}>
                            <div className={styles.typeGrid}>
                                {REQUEST_TYPE_VALUES.map(val => (
                                    <button
                                        key={val}
                                        type="button"
                                        className={`${styles.typeBtn} ${type === val ? styles.typeBtnActive : ''}`}
                                        onClick={() => setType(val)}
                                    >
                                        {t(`cta.type_${val}` as any)}
                                    </button>
                                ))}
                            </div>

                            <input
                                className={styles.contactInput}
                                type="text"
                                required
                                placeholder={t('cta.ph_name')}
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                            <input
                                className={styles.contactInput}
                                type="tel"
                                required
                                placeholder={t('cta.ph_phone')}
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                            />
                            <input
                                className={styles.contactInput}
                                type="email"
                                placeholder={t('cta.ph_email')}
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                            <textarea
                                className={styles.contactArea}
                                rows={3}
                                placeholder={t('cta.ph_message')}
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                            />

                            {error && <p className={styles.formError}>{error}</p>}

                            <button type="submit" className={styles.formSubmit} disabled={loading}>
                                {loading ? t('cta.sending') : t('cta.submit')}
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

export function CtaBlock({ product, locale, onModalOpen, onModalClose }: CtaBlockProps) {
    const t = useTranslations('product');
    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => { setModalOpen(true); onModalOpen?.(); };
    const closeModal = () => { setModalOpen(false); onModalClose?.(); };

    return (
        <>
            <section className={`${styles.section} print-hide`}>
                <div className={styles.content}>
                    <h2 className={styles.title}>{t('cta_title')}</h2>
                    <p className={styles.desc}>{t('cta_desc')}</p>
                    <div className={styles.actions}>
                        <button className={styles.btnPrimary} onClick={openModal}>
                            {t('btn_contact')}
                        </button>
                        <a
                            href={`/velnox/files/velnox-catalog-${locale}.pdf`}
                            download="VELNOX_Catalog.pdf"
                            className={styles.btnOutline}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            {t('btn_pdf')}
                        </a>
                    </div>
                </div>
            </section>

            {modalOpen && (
                <ContactModal article={product.article} onClose={closeModal} />
            )}
        </>
    );
}
