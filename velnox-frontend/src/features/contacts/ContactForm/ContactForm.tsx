'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import styles from './ContactForm.module.css';

export function ContactForm() {
    const t = useTranslations('contacts.form');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');
        
        // Simulate API call
        setTimeout(() => {
            setStatus('success');
        }, 1500);
    };

    if (status === 'success') {
        return (
            <div className={styles.successMessage}>
                <CheckCircle2 size={48} className={styles.successIcon} />
                <h3>{t('success')}</h3>
                <button 
                    onClick={() => setStatus('idle')}
                    className={styles.resetButton}
                >
                    {t('submit')}
                </button>
            </div>
        );
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fieldGroup}>
                <label htmlFor="name">{t('name')}</label>
                <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    placeholder={t('name_ph')}
                    required 
                    className={styles.input}
                />
            </div>

            <div className={styles.fieldGroup}>
                <label htmlFor="email">{t('email')}</label>
                <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder={t('email_ph')}
                    required 
                    className={styles.input}
                />
            </div>

            <div className={styles.fieldGroup}>
                <label htmlFor="company">{t('company')}</label>
                <input 
                    type="text" 
                    id="company" 
                    name="company" 
                    placeholder={t('company_ph')}
                    className={styles.input}
                />
            </div>

            <div className={styles.fieldGroup}>
                <label htmlFor="message">{t('message')}</label>
                <textarea 
                    id="message" 
                    name="message" 
                    placeholder={t('message_ph')}
                    required 
                    rows={4}
                    className={styles.textarea}
                />
            </div>

            <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={status === 'loading'}
            >
                {status === 'loading' ? (
                    <div className={styles.loader}></div>
                ) : (
                    <>
                        <span>{t('submit')}</span>
                        <ArrowRight size={18} />
                    </>
                )}
            </button>
        </form>
    );
}
