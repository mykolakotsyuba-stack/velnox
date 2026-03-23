'use client';

import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import styles from './custom.module.css';
import Image from 'next/image';

export function CustomForm() {
    const t = useTranslations('oemPage.form');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        // Mock process
        setTimeout(() => setStatus('success'), 1200);
    };

    if (status === 'success') {
        return (
            <section className={styles.formSection}>
                <div className={styles.container}>
                    <div className={styles.formContainer}>
                        <h2 className={styles.formTitle}>{t('success')}</h2>
                        <p className={styles.formDesc}>{t('success_email')}</p>
                        <div className={styles.successMessage}>
                            Відправлено. Ми зв'яжемося з вами найближчим часом.
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.formSection}>
            <Image
                src="/velnox/images/oem_blueprint_bg.png"
                alt="Blueprint Background"
                fill
                style={{ objectFit: 'cover', zIndex: 0, opacity: 0.05 }}
            />
            <div className={styles.container}>
                <div className={styles.formContainer} style={{ position: 'relative', zIndex: 2 }}>
                    <h2 className={styles.formTitle}>{t('title')}</h2>
                    <p className={styles.formDesc}>{t('desc')}</p>
                    <form onSubmit={handleSubmit}>
                        
                        <div className={styles.formGroup}>
                            <h3 className={styles.groupTitle}>{t('section_contacts')}</h3>
                            <div className={styles.inputRow}>
                                <div className={styles.inputField}>
                                    <span className={styles.label}>{t('company')} *</span>
                                    <input required type="text" className={styles.input} />
                                </div>
                                <div className={styles.inputField}>
                                    <span className={styles.label}>{t('name')} *</span>
                                    <input required type="text" className={styles.input} />
                                </div>
                            </div>
                            <div className={styles.inputRow}>
                                <div className={styles.inputField}>
                                    <span className={styles.label}>{t('email')} *</span>
                                    <input required type="email" className={styles.input} />
                                </div>
                                <div className={styles.inputField}>
                                    <span className={styles.label}>{t('phone')}</span>
                                    <input type="tel" className={styles.input} />
                                </div>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <h3 className={styles.groupTitle}>{t('section_tech')}</h3>
                            <div className={styles.inputRow}>
                                <div className={styles.inputField}>
                                    <span className={styles.label}>{t('d')}</span>
                                    <input type="text" className={styles.input} />
                                </div>
                                <div className={styles.inputField}>
                                    <span className={styles.label}>{t('D')}</span>
                                    <input type="text" className={styles.input} />
                                </div>
                            </div>
                            <div className={styles.inputRow}>
                                <div className={styles.inputField}>
                                    <span className={styles.label}>{t('BC')}</span>
                                    <input type="text" className={styles.input} />
                                </div>
                                <div className={styles.inputField}>
                                    <span className={styles.label}>{t('J')}</span>
                                    <input type="text" className={styles.input} />
                                </div>
                            </div>
                            <div className={styles.inputRow}>
                                <div className={styles.inputField}>
                                    <span className={styles.label}>{t('GHT')}</span>
                                    <input type="text" className={styles.input} />
                                </div>
                                <div className={styles.inputField}>
                                    <span className={styles.label}>{t('L')}</span>
                                    <input type="text" className={styles.input} />
                                </div>
                            </div>
                            <div className={styles.inputRow}>
                                <div className={styles.inputField}>
                                    <span className={styles.label}>{t('loads')}</span>
                                    <input type="text" className={styles.input} />
                                </div>
                                <div className={styles.inputField}>
                                    <span className={styles.label}>{t('rpm')}</span>
                                    <input type="text" className={styles.input} />
                                </div>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <h3 className={styles.groupTitle}>{t('section_ops')}</h3>
                            <div className={styles.inputField} style={{ marginBottom: '24px' }}>
                                <span className={styles.label}>{t('environment')}</span>
                                <input type="text" className={styles.input} />
                            </div>
                            <div className={styles.inputField} style={{ marginBottom: '24px' }}>
                                <span className={styles.label}>{t('resource')}</span>
                                <input type="text" className={styles.input} />
                            </div>
                            <div className={styles.inputField}>
                                <span className={styles.label}>Додаткова інформація</span>
                                <textarea className={`${styles.input} ${styles.textarea}`}></textarea>
                            </div>
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={status === 'submitting'}>
                            {status === 'submitting' ? '...' : t('submit')}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
