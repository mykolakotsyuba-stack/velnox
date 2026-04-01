'use client';

import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import styles from './oem.module.css';

export function OemForm() {
    const t = useTranslations('oemPage.form');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('submitting');
        
        // Mock API submission logic. Let's add an artificial delay.
        setTimeout(() => {
            setStatus('success');
        }, 1500);
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
                                    <input type="text" className={styles.input} required />
                                </div>
                                <div className={styles.inputField}>
                                    <label className={styles.label}>{t('company')} *</label>
                                    <input type="text" className={styles.input} required />
                                </div>
                                <div className={styles.inputField}>
                                    <label className={styles.label}>{t('position')}</label>
                                    <input type="text" className={styles.input} />
                                </div>
                                <div className={styles.inputField}>
                                    <label className={styles.label}>{t('email')} *</label>
                                    <input type="email" className={styles.input} required />
                                </div>
                                <div className={styles.inputField}>
                                    <label className={styles.label}>{t('phone')}</label>
                                    <input type="tel" className={styles.input} />
                                </div>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <h3 className={styles.groupTitle}>{t('section_tech')}</h3>
                            <div className={styles.inputRow}>
                                <div className={styles.inputField}>
                                    <label className={styles.label}>{t('d')}</label>
                                    <input type="text" className={styles.input} />
                                </div>
                                <div className={styles.inputField}>
                                    <label className={styles.label}>{t('D')}</label>
                                    <input type="text" className={styles.input} />
                                </div>
                                <div className={styles.inputField}>
                                    <label className={styles.label}>{t('BC')}</label>
                                    <input type="text" className={styles.input} />
                                </div>
                                <div className={styles.inputField}>
                                    <label className={styles.label}>{t('J')}</label>
                                    <input type="text" className={styles.input} />
                                </div>
                                <div className={styles.inputField}>
                                    <label className={styles.label}>{t('GHT')}</label>
                                    <input type="text" className={styles.input} />
                                </div>
                                <div className={styles.inputField}>
                                    <label className={styles.label}>{t('L')}</label>
                                    <input type="text" className={styles.input} />
                                </div>
                                <div className={styles.inputField}>
                                    <label className={styles.label}>{t('loads')}</label>
                                    <input type="text" className={styles.input} />
                                </div>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <h3 className={styles.groupTitle}>{t('section_ops')}</h3>
                            <div className={styles.inputRow}>
                                <div className={styles.inputField}>
                                    <label className={styles.label}>{t('rpm')}</label>
                                    <input type="text" className={styles.input} />
                                </div>
                                <div className={styles.inputField}>
                                    <label className={styles.label}>{t('resource')}</label>
                                    <input type="text" className={styles.input} />
                                </div>
                                <div className={styles.inputField} style={{ gridColumn: '1 / -1' }}>
                                    <label className={styles.label}>{t('environment')}</label>
                                    <textarea className={`${styles.input} ${styles.textarea}`} />
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
