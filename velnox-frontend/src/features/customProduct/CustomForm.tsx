'use client';

import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import styles from './oem.module.css';

export function OemForm() {
    const t = useTranslations('oemPage.form');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('submitting');
        setError('');

        const fd = new FormData(e.currentTarget);
        const contact = [
            fd.get('name'), fd.get('email'), fd.get('phone'),
            fd.get('company') ? `Компанія: ${fd.get('company')}` : '',
            fd.get('position') ? `Посада: ${fd.get('position')}` : '',
        ].filter(Boolean).join(' / ');

        const specs = ['d', 'D', 'BC', 'J', 'GHT', 'L', 'loads', 'rpm', 'resource', 'environment']
            .map(k => { const v = fd.get(k); return v ? `${k}: ${v}` : ''; })
            .filter(Boolean).join('; ');

        const fullContact = specs ? `${contact}\nТехнічні параметри: ${specs}` : contact;

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/v1/leads/engineer`,
                { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                  body: JSON.stringify({ contact: fullContact, type: 'oem' }) }
            );
            const data = await res.json();
            if (data.success) { setStatus('success'); }
            else { setError('Помилка відправки'); setStatus('error'); }
        } catch { setError('Помилка з\'єднання'); setStatus('error'); }
    };

    return (
        <section className={styles.formSection}>
            <div className={styles.formOverlay} />
            <div className={styles.formContainer}>
                <h2 className={styles.formTitle}>{t('title')}</h2>
                <p className={styles.formDesc}>{t('desc')}</p>

                {status === 'success' ? (
                    <div className={styles.successMessage}>
                        <p>{t('success')}</p>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>{t('success_email')}</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <h3 className={styles.groupTitle}>{t('section_contacts')}</h3>
                            <div className={styles.inputRow}>
                                <div className={styles.inputField}>
                                    <label className={styles.label}>{t('name')} *</label>
                                    <input type="text" name="name" className={styles.input} required />
                                </div>
                                <div className={styles.inputField}>
                                    <label className={styles.label}>{t('company')} *</label>
                                    <input type="text" name="company" className={styles.input} required />
                                </div>
                                <div className={styles.inputField}>
                                    <label className={styles.label}>{t('position')}</label>
                                    <input type="text" name="position" className={styles.input} />
                                </div>
                                <div className={styles.inputField}>
                                    <label className={styles.label}>{t('email')} *</label>
                                    <input type="email" name="email" className={styles.input} required />
                                </div>
                                <div className={styles.inputField}>
                                    <label className={styles.label}>{t('phone')}</label>
                                    <input type="tel" name="phone" className={styles.input} />
                                </div>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <h3 className={styles.groupTitle}>{t('section_tech')}</h3>
                            <div className={styles.inputRow}>
                                <div className={styles.inputField}>
                                    <label className={styles.label}>{t('d')}</label>
                                    <input type="text" name="d" className={styles.input} />
                                </div>
                                <div className={styles.inputField}>
                                    <label className={styles.label}>{t('D')}</label>
                                    <input type="text" name="D" className={styles.input} />
                                </div>
                                <div className={styles.inputField}>
                                    <label className={styles.label}>{t('BC')}</label>
                                    <input type="text" name="BC" className={styles.input} />
                                </div>
                                <div className={styles.inputField}>
                                    <label className={styles.label}>{t('J')}</label>
                                    <input type="text" name="J" className={styles.input} />
                                </div>
                                <div className={styles.inputField}>
                                    <label className={styles.label}>{t('GHT')}</label>
                                    <input type="text" name="GHT" className={styles.input} />
                                </div>
                                <div className={styles.inputField}>
                                    <label className={styles.label}>{t('L')}</label>
                                    <input type="text" name="L" className={styles.input} />
                                </div>
                                <div className={styles.inputField}>
                                    <label className={styles.label}>{t('loads')}</label>
                                    <input type="text" name="loads" className={styles.input} />
                                </div>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <h3 className={styles.groupTitle}>{t('section_ops')}</h3>
                            <div className={styles.inputRow}>
                                <div className={styles.inputField}>
                                    <label className={styles.label}>{t('rpm')}</label>
                                    <input type="text" name="rpm" className={styles.input} />
                                </div>
                                <div className={styles.inputField}>
                                    <label className={styles.label}>{t('resource')}</label>
                                    <input type="text" name="resource" className={styles.input} />
                                </div>
                                <div className={styles.inputField} style={{ gridColumn: '1 / -1' }}>
                                    <label className={styles.label}>{t('environment')}</label>
                                    <textarea name="environment" className={`${styles.input} ${styles.textarea}`} />
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className={styles.submitBtn} 
                            disabled={status === 'submitting'}
                        >
                            {status === 'submitting' ? '...' : t('submit')}
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
}
