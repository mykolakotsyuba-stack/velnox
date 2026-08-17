'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, ArrowRight, Paperclip, FileText, X as CloseIcon } from 'lucide-react';
import styles from './ContactForm.module.css';

export function ContactForm() {
    const t = useTranslations('contacts.form');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const addFiles = (list: FileList | null) => {
        if (!list || list.length === 0) return;
        setFiles(prev => [...prev, ...Array.from(list)]);
        // clear so re-picking the same file still fires onChange
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');
        setError('');

        const fd = new FormData(e.currentTarget);
        const contact = [
            fd.get('name'),
            fd.get('email'),
            fd.get('phone'),
            fd.get('company') ? `Компанія: ${fd.get('company')}` : '',
            fd.get('message') ? `Повідомлення: ${fd.get('message')}` : '',
        ].filter(Boolean).join(' / ');

        // multipart so the optional attachment is actually sent (JSON drops files)
        const payload = new FormData();
        payload.append('contact', contact);
        payload.append('type', 'contact');
        files.forEach((f) => payload.append('files[]', f));

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/v1/leads/engineer`,
                {
                    method: 'POST',
                    headers: { Accept: 'application/json' },
                    body: payload,
                }
            );
            const data = await res.json();
            if (data.success) {
                setStatus('success');
            } else {
                setError(t('error'));
                setStatus('error');
            }
        } catch {
            setError(t('error'));
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className={styles.successMessage}>
                <CheckCircle2 size={48} className={styles.successIcon} />
                <h3>{t('success')}</h3>
                <button
                    onClick={() => { setStatus('idle'); setFiles([]); }}
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
                    required
                    className={styles.input}
                />
            </div>

            <div className={styles.fieldGroup}>
                <label htmlFor="phone">{t('phone')}</label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
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
                    className={styles.input}
                />
            </div>

            <div className={styles.fieldGroup}>
                <label htmlFor="message">{t('message')}</label>
                <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className={styles.textarea}
                />
            </div>

            <div className={styles.fileUpload}>
                <label className={styles.fileLabel}>
                    <input
                        type="file"
                        name="file"
                        multiple
                        ref={fileInputRef}
                        className={styles.fileInput}
                        onChange={(e) => addFiles(e.target.files)}
                    />
                    <Paperclip size={18} />
                    <div className={styles.fileTexts}>
                        <span className={styles.fileAction}>{t('file_label')}</span>
                        <span className={styles.fileDesc}>{t('file_desc')}</span>
                    </div>
                </label>

                {files.length > 0 && (
                    <div className={styles.selectedFiles}>
                        {files.map((f, idx) => (
                            <div key={idx} className={styles.selectedFile}>
                                <FileText size={16} className={styles.selectedFileIcon} />
                                <span className={styles.selectedFileName}>{f.name}</span>
                                <span className={styles.selectedFileSize}>
                                    {(f.size / 1024).toFixed(0)} KB
                                </span>
                                <button
                                    type="button"
                                    className={styles.removeFile}
                                    onClick={() => removeFile(idx)}
                                    aria-label="Remove file"
                                >
                                    <CloseIcon size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {status === 'error' && error && (
                <p style={{ color: '#ef4444', fontSize: '0.9rem' }}>{error}</p>
            )}

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
