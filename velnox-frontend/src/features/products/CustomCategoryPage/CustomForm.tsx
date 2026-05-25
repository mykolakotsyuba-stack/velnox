'use client';

import { useTranslations } from 'next-intl';
import React, { useState, useEffect, useRef } from 'react';
import styles from './custom.module.css';
import Image from 'next/image';
import { Search, Upload, X as CloseIcon, FileText, ExternalLink, Check } from 'lucide-react';

interface Product {
    article: string;
    name: string;
    slug: string;
    category: string;
    oem_cross: string[];
    specs?: Record<string, string>;
}

export function CustomForm({ locale }: { locale: string }) {
    const t = useTranslations('oemPage.form');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    // Multi-select States
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // File Upload States
    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch all products once (shown on open without query)
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const params = new URLSearchParams({ per_page: '20', locale });
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/v1/products?${params}`,
                    { headers: { Accept: 'application/json' } }
                );
                if (!res.ok) return;
                const data = await res.json() as { data: Product[] };
                setAllProducts(data.data || []);
            } catch { /* silent */ }
        };
        fetchAll();
    }, [locale]);

    // Filtered search
    useEffect(() => {
        if (searchQuery.length < 1) {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        const timer = setTimeout(async () => {
            try {
                const params = new URLSearchParams({ q: searchQuery, per_page: '12', locale });
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/v1/products?${params}`,
                    { headers: { Accept: 'application/json' } }
                );
                if (!res.ok) throw new Error(`${res.status}`);
                const data = await res.json() as { data: Product[] };
                setSearchResults(data.data || []);
            } catch (err) {
                console.error('Search error:', err);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, locale]);

    // Click outside → close dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isSelected = (p: Product) => selectedProducts.some(s => s.slug === p.slug);

    const toggleProduct = (p: Product) => {
        setSelectedProducts(prev =>
            isSelected(p) ? prev.filter(s => s.slug !== p.slug) : [...prev, p]
        );
        // Keep dropdown open + keep query so user can keep picking
        setShowResults(true);
        inputRef.current?.focus();
    };

    const removeChip = (slug: string) => {
        setSelectedProducts(prev => prev.filter(s => s.slug !== slug));
    };

    // What to display: filtered results or all products
    const displayList = searchQuery.length >= 1 ? searchResults : allProducts;

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

    const findMatchedOem = (product: Product, query: string): string | null => {
        if (!query || query.length < 1) return null;
        const q = query.toLowerCase();
        // Search oem_cross array
        const fromOem = product.oem_cross?.find(oem => oem.toLowerCase().includes(q));
        if (fromOem) return fromOem;
        // Search specs Cross-Reference (KIT products)
        const crossRef = product.specs?.['Cross-Reference'] ?? '';
        const matchedLine = crossRef.split('\n').find(line => line.toLowerCase().includes(q));
        if (matchedLine) return matchedLine.trim();
        // Search specs Bearing designation
        const bearing = product.specs?.['Bearing designation'] ?? '';
        const matchedBearing = bearing.split('\n').find(line => line.toLowerCase().includes(q));
        if (matchedBearing) return matchedBearing.trim();
        return null;
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

                            {/* Multi-select Product Picker */}
                            <div className={styles.inputField} style={{ marginBottom: '24px' }}>
                                <span className={styles.label}>{t('base_product')}</span>
                                <div className={styles.comboboxWrapper} ref={searchRef}>

                                    {/* Input box with chips inside */}
                                    <div
                                        className={styles.multiInputBox}
                                        onClick={() => inputRef.current?.focus()}
                                    >
                                        {/* Selected chips */}
                                        {selectedProducts.map(p => (
                                            <span key={p.slug} className={styles.chip}>
                                                <span className={styles.chipLabel}>{p.article}</span>
                                                <button
                                                    type="button"
                                                    className={styles.chipRemove}
                                                    onMouseDown={e => { e.preventDefault(); removeChip(p.slug); }}
                                                >
                                                    <CloseIcon size={11} />
                                                </button>
                                            </span>
                                        ))}

                                        {/* Search input */}
                                        <div className={styles.multiInputInner}>
                                            <Search size={15} className={styles.multiSearchIcon} />
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                className={styles.multiInput}
                                                placeholder={selectedProducts.length === 0 ? t('base_product_ph') : ''}
                                                value={searchQuery}
                                                onChange={e => {
                                                    setSearchQuery(e.target.value);
                                                    setShowResults(true);
                                                }}
                                                onFocus={() => setShowResults(true)}
                                            />
                                            {isSearching && (
                                                <span className={styles.multiSpinner} />
                                            )}
                                        </div>
                                    </div>

                                    {/* Dropdown — always opens on focus */}
                                    {showResults && (
                                        <div className={styles.comboboxResults}>
                                            {isSearching ? (
                                                <div className={styles.comboboxLoading}>...</div>
                                            ) : displayList.length > 0 ? (
                                                displayList.map(p => {
                                                    const matched = findMatchedOem(p, searchQuery);
                                                    const selected = isSelected(p);
                                                    return (
                                                        <div
                                                            key={p.slug}
                                                            className={`${styles.comboboxItem} ${selected ? styles.comboboxItemSelected : ''}`}
                                                            onMouseDown={e => {
                                                                e.preventDefault();
                                                                if (!(e.target as HTMLElement).closest(`.${styles.viewProductBtn}`)) {
                                                                    toggleProduct(p);
                                                                }
                                                            }}
                                                        >
                                                            <span className={styles.comboboxCheck}>
                                                                {selected && <Check size={14} />}
                                                            </span>
                                                            <div className={styles.comboboxItemContent}>
                                                                <span className={styles.comboboxItemTitle}>{p.article}</span>
                                                                <span className={styles.comboboxItemSub}>{p.name}</span>
                                                                {matched && (
                                                                    <span className={styles.comboboxItemOem}>OEM: {matched}</span>
                                                                )}
                                                            </div>
                                                            <button
                                                                type="button"
                                                                className={styles.viewProductBtn}
                                                                title="View Product"
                                                                onMouseDown={e => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    window.open(`/velnox/${locale}/products/${p.category}/${p.slug}`, '_blank');
                                                                }}
                                                            >
                                                                <ExternalLink size={15} />
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
