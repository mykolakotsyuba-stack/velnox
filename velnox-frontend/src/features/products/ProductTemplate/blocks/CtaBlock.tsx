'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './CtaBlock.module.css';

interface CtaBlockProps {
    article: string;
}

type RequestType = 'analogue' | 'resource' | 'batch' | 'custom';
const REQUEST_TYPE_VALUES: RequestType[] = ['analogue', 'resource', 'batch', 'custom'];

function ContactModal({ article, onClose }: { article: string; onClose: () => void }) {
    const t = useTranslations('product');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [type, setType] = useState<RequestType>('batch');
    const [contact, setContact] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const contactValue = `${contact} / ${t('cta.article_prefix')} ${article}`;

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

                            <textarea
                                className={styles.contactArea}
                                required
                                rows={3}
                                placeholder={t('cta.placeholder')}
                                value={contact}
                                onChange={e => setContact(e.target.value)}
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

export function CtaBlock({ article }: CtaBlockProps) {
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
                    </div>
                </div>
            </section>

            {modalOpen && (
                <ContactModal article={article} onClose={() => setModalOpen(false)} />
            )}
        </>
    );
}
