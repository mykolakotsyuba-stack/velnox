'use client';

import { useTranslations } from 'next-intl';
import React, { useState, useEffect, useRef } from 'react';
import styles from './custom.module.css';
import Image from 'next/image';
import { Search, Upload, X as CloseIcon, FileText, ExternalLink } from 'lucide-react';

interface Product {
    article: string;
    name: string;
    slug: string;
    category_id: string;
    oem_cross: string[];
}

export function CustomForm({ locale }: { locale: string }) {
    const t = useTranslations('oemPage.form');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
    
    // Searchable Select States
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    // File Upload States
    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle search fetch
    useEffect(() => {
        const fetchProducts = async () => {
            if (searchQuery.length < 2) {
                setSearchResults([]);
                return;
            }

            setIsSearching(true);
            try {
                const res = await fetch(`/api/v1/products?q=${encodeURIComponent(searchQuery)}&per_page=10`);
                const data = await res.json();
                setSearchResults(data.data || []);
            } catch (err) {
                console.error('Search error:', err);
            } finally {
                setIsSearching(false);
            }
        };

        const timer = setTimeout(fetchProducts, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Click outside search
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        // Mock process
        setTimeout(() => setStatus('success'), 1200);
    };

    const findMatchedOem = (product: Product, query: string) => {
        if (!query || query.length < 2) return null;
        const q = query.toLowerCase();
        return product.oem_cross.find(oem => oem.toLowerCase().includes(q));
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
                            
                            {/* NEW: Base Product Selector */}
                            <div className={styles.inputField} style={{ marginBottom: '24px' }}>
                                <span className={styles.label}>{t('base_product')}</span>
                                <div className={styles.comboboxWrapper} ref={searchRef}>
                                    <div style={{ position: 'relative' }}>
                                        <input 
                                            type="text" 
                                            className={styles.input} 
                                            placeholder={t('base_product_ph')}
                                            value={selectedProduct ? selectedProduct.article : searchQuery}
                                            onChange={(e) => {
                                                if (selectedProduct) setSelectedProduct(null);
                                                setSearchQuery(e.target.value);
                                                setShowResults(true);
                                            }}
                                            onFocus={() => setShowResults(true)}
                                            style={{ paddingLeft: '40px' }}
                                        />
                                        <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                                        {selectedProduct && (
                                            <button 
                                                type="button"
                                                onClick={() => { setSelectedProduct(null); setSearchQuery(''); }}
                                                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}
                                            >
                                                <CloseIcon size={16} />
                                            </button>
                                        )}
                                    </div>

                                    {showResults && (searchQuery.length >= 2 || isSearching) && (
                                        <div className={styles.comboboxResults}>
                                            {isSearching ? (
                                                <div className={styles.comboboxLoading}>...</div>
                                            ) : searchResults.length > 0 ? (
                                                searchResults.map((p) => {
                                                    const matchedOem = findMatchedOem(p, searchQuery);
                                                    return (
                                                        <div 
                                                            key={p.slug} 
                                                            className={styles.comboboxItem}
                                                            onClick={(e) => {
                                                                // Only select if the click wasn't on the external link icon
                                                                if (!(e.target as HTMLElement).closest(`.${styles.viewProductBtn}`)) {
                                                                    setSelectedProduct(p);
                                                                    setShowResults(false);
                                                                }
                                                            }}
                                                        >
                                                            <div className={styles.comboboxItemContent}>
                                                                <span className={styles.comboboxItemTitle}>{p.article}</span>
                                                                <span className={styles.comboboxItemSub}>{p.name}</span>
                                                                {matchedOem && (
                                                                    <span className={styles.comboboxItemOem}>OEM: {matchedOem}</span>
                                                                )}
                                                            </div>
                                                            <button 
                                                                type="button"
                                                                className={styles.viewProductBtn}
                                                                title="View Product"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    window.open(`/${locale}/products/${p.category_id}/${p.slug}`, '_blank');
                                                                }}
                                                            >
                                                                <ExternalLink size={16} />
                                                            </button>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className={styles.comboboxEmpty}>Нічого не знайдено</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

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
                            
                            {/* NEW: Multi-file Upload */}
                            <div className={styles.inputField} style={{ marginBottom: '24px' }}>
                                <span className={styles.label}>{t('files_label')}</span>
                                <div className={styles.fileUploadArea}>
                                    <label className={styles.fileInputLabel}>
                                        <Upload size={18} />
                                        {t('files_desc')}
                                        <input 
                                            type="file" 
                                            multiple 
                                            style={{ display: 'none' }} 
                                            onChange={handleFileChange}
                                            ref={fileInputRef}
                                        />
                                    </label>
                                    
                                    {files.length > 0 && (
                                        <div className={styles.fileList}>
                                            {files.map((file, idx) => (
                                                <div key={idx} className={styles.fileItem}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <FileText size={14} color="var(--color-accent)" />
                                                        <span className={styles.fileName}>{file.name}</span>
                                                    </div>
                                                    <button 
                                                        type="button" 
                                                        className={styles.fileRemove}
                                                        onClick={() => removeFile(idx)}
                                                    >
                                                        {t('remove')}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

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
