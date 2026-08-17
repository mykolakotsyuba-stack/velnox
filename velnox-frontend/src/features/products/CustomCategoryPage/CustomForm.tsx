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

interface ProductSchema {
    slug: string;
    article: string;
    images: { type: string; path: string }[];
}

export function CustomForm({ locale }: { locale: string }) {
    const t = useTranslations('oemPage.form');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [productSchemas, setProductSchemas] = useState<Record<string, ProductSchema>>({});
    const [activeSchemaTab, setActiveSchemaTab] = useState<string>('');

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

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        selectedProducts.forEach(p => {
            if (productSchemas[p.slug]) return;
            fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/v1/products/${p.slug}?locale=${locale}`,
                { headers: { Accept: 'application/json' } }
            )
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    if (!data) return;
                    setProductSchemas(prev => ({
                        ...prev,
                        [p.slug]: {
                            slug: data.slug,
                            article: data.article,
                            images: data.images || [],
                        },
                    }));
                })
                .catch(() => {});
        });
        if (selectedProducts.length > 0 && !activeSchemaTab) {
            setActiveSchemaTab(selectedProducts[0].slug);
        }
        if (selectedProducts.length === 0) {
            setActiveSchemaTab('');
        }
    }, [selectedProducts, locale, productSchemas, activeSchemaTab]);

    const isSelected = (p: Product) => selectedProducts.some(s => s.slug === p.slug);

    const toggleProduct = (p: Product) => {
        setSelectedProducts(prev => {
            const next = isSelected(p) ? prev.filter(s => s.slug !== p.slug) : [...prev, p];
            if (!isSelected(p)) {
                setActiveSchemaTab(p.slug);
            } else if (activeSchemaTab === p.slug && next.length > 0) {
                setActiveSchemaTab(next[0].slug);
            }
            return next;
        });
        setShowResults(true);
        inputRef.current?.focus();
    };

    const removeChip = (slug: string) => {
        setSelectedProducts(prev => {
            const next = prev.filter(s => s.slug !== slug);
            if (activeSchemaTab === slug && next.length > 0) {
                setActiveSchemaTab(next[0].slug);
            } else if (next.length === 0) {
                setActiveSchemaTab('');
            }
            return next;
        });
    };

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

    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('submitting');
        setError('');

        const fd = new FormData(e.currentTarget);
        const contact = [
            fd.get('name'), fd.get('email'), fd.get('phone'),
            fd.get('company') ? `Компанія: ${fd.get('company')}` : '',
        ].filter(Boolean).join(' / ');

        const products = selectedProducts.map(p => p.article).join(', ');
        const specs = ['d', 'D', 'BC', 'J', 'GHT', 'L', 'c_dyn', 'co', 'rpm']
            .map(k => { const v = fd.get(k); return v ? `${k}: ${v}` : ''; })
            .filter(Boolean).join('; ');

        const extra = [
            fd.get('environment') ? `Середовище: ${fd.get('environment')}` : '',
            fd.get('resource') ? `Ресурс: ${fd.get('resource')}` : '',
            fd.get('additional_info') ? `Додатково: ${fd.get('additional_info')}` : '',
        ].filter(Boolean).join('\n');

        const fullContact = [
            contact,
            products ? `Базові продукти: ${products}` : '',
            specs ? `Параметри: ${specs}` : '',
            extra,
        ].filter(Boolean).join('\n');

        // multipart so the attached drawings/files are actually sent (JSON drops them)
        const payload = new FormData();
        payload.append('contact', fullContact);
        payload.append('type', 'oem');
        files.forEach((f) => payload.append('files[]', f));

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/v1/leads/engineer`,
                { method: 'POST', headers: { Accept: 'application/json' }, body: payload }
            );
            const data = await res.json();
            if (data.success) { setStatus('success'); }
            else { setError('Помилка відправки'); setStatus('idle'); }
        } catch { setError('Помилка з\'єднання'); setStatus('idle'); }
    };

    const findMatchedOem = (product: Product, query: string): string | null => {
        if (!query || query.length < 1) return null;
        const q = query.toLowerCase();
        const fromOem = product.oem_cross?.find(oem => oem.toLowerCase().includes(q));
        if (fromOem) return fromOem;
        const crossRef = product.specs?.['Cross-Reference'] ?? '';
        const matchedLine = crossRef.split('\n').find(line => line.toLowerCase().includes(q));
        if (matchedLine) return matchedLine.trim();
        const bearing = product.specs?.['Bearing designation'] ?? '';
        const matchedBearing = bearing.split('\n').find(line => line.toLowerCase().includes(q));
        if (matchedBearing) return matchedBearing.trim();
        return null;
    };

    const getSchemaImages = (slug: string): string[] => {
        const schema = productSchemas[slug];
        if (!schema) return [];
        return schema.images
            .filter(img => img.type === 'schema_png')
            .map(img => img.path);
    };

    const schemasToShow = selectedProducts
        .filter(p => getSchemaImages(p.slug).length > 0);

    if (status === 'success') {
        return (
            <section className={styles.formSection}>
                <div className={styles.container}>
                    <div className={styles.formContainer}>
                        <h2 className={styles.formTitle}>{t('success')}</h2>
                        <p className={styles.formDesc}>{t('success_email')}</p>
                        <div className={styles.successMessage}>
                            {t('success_message')}
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

                        {/* Contacts */}
                        <div className={styles.formGroup}>
                            <h3 className={styles.groupTitle}>{t('section_contacts')}</h3>
                            <div className={styles.inputRow}>
                                <div className={styles.inputField}>
                                    <span className={styles.label}>{t('company')} *</span>
                                    <input required type="text" name="company" className={styles.input} />
                                </div>
                                <div className={styles.inputField}>
                                    <span className={styles.label}>{t('name')} *</span>
                                    <input required type="text" name="name" className={styles.input} />
                                </div>
                            </div>
                            <div className={styles.inputRow}>
                                <div className={styles.inputField}>
                                    <span className={styles.label}>{t('email')} *</span>
                                    <input required type="email" name="email" className={styles.input} />
                                </div>
                                <div className={styles.inputField}>
                                    <span className={styles.label}>{t('phone')}</span>
                                    <input type="tel" name="phone" className={styles.input} />
                                </div>
                            </div>
                        </div>

                        {/* Tech params — includes base product picker */}
                        <div className={styles.formGroup}>
                            <h3 className={styles.groupTitle}>{t('section_tech')}</h3>

                            <div className={styles.inputField} style={{ marginBottom: '24px' }}>
                                <span className={styles.label}>{t('base_product')}</span>
                                <div className={styles.comboboxWrapper} ref={searchRef}>
                                    <div
                                        className={styles.multiInputBox}
                                        onClick={() => inputRef.current?.focus()}
                                    >
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
                                                <div className={styles.comboboxEmpty}>{t('no_results')}</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Schema block — tabs for selected products */}
                            {schemasToShow.length > 0 && (
                                <div className={styles.schemaBlock}>
                                    <span className={styles.label}>{t('section_schema')}</span>
                                    {schemasToShow.length > 1 && (
                                        <div className={styles.schemaTabs}>
                                            {schemasToShow.map(p => (
                                                <button
                                                    key={p.slug}
                                                    type="button"
                                                    className={`${styles.schemaTab} ${activeSchemaTab === p.slug ? styles.schemaTabActive : ''}`}
                                                    onClick={() => setActiveSchemaTab(p.slug)}
                                                >
                                                    {p.article}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    <div className={styles.schemaImageWrapper}>
                                        {getSchemaImages(activeSchemaTab).map((imgPath, idx) => (
                                            <Image
                                                key={idx}
                                                src={imgPath}
                                                alt={`Schema ${activeSchemaTab}`}
                                                width={700}
                                                height={400}
                                                className={styles.schemaImage}
                                                unoptimized
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className={styles.inputRow}>
                                <div className={styles.inputField}>
                                    <span className={styles.label}>{t('d')}</span>
                                    <input type="text" name="d" className={styles.input} />
                                </div>
                                <div className={styles.inputField}>
                                    <span className={styles.label}>{t('D')}</span>
                                    <input type="text" name="D" className={styles.input} />
                                </div>
                            </div>
                            <div className={styles.inputRow}>
                                <div className={styles.inputField}>
                                    <span className={styles.label}>{t('BC')}</span>
                                    <input type="text" name="BC" className={styles.input} />
                                </div>
                                <div className={styles.inputField}>
                                    <span className={styles.label}>{t('J')}</span>
                                    <input type="text" name="J" className={styles.input} />
                                </div>
                            </div>
                            <div className={styles.inputRow}>
                                <div className={styles.inputField}>
                                    <span className={styles.label}>{t('GHT')}</span>
                                    <input type="text" name="GHT" className={styles.input} />
                                </div>
                                <div className={styles.inputField}>
                                    <span className={styles.label}>{t('L')}</span>
                                    <input type="text" name="L" className={styles.input} />
                                </div>
                            </div>
                            <div className={styles.inputRow}>
                                <div className={styles.inputField}>
                                    <span className={styles.label}>{t('c_dyn')}</span>
                                    <input type="text" name="c_dyn" className={styles.input} />
                                </div>
                                <div className={styles.inputField}>
                                    <span className={styles.label}>{t('co')}</span>
                                    <input type="text" name="co" className={styles.input} />
                                </div>
                            </div>
                            <div className={styles.inputRow}>
                                <div className={styles.inputField}>
                                    <span className={styles.label}>{t('rpm')}</span>
                                    <input type="text" name="rpm" className={styles.input} />
                                </div>
                            </div>
                        </div>

                        {/* Operating conditions */}
                        <div className={styles.formGroup}>
                            <h3 className={styles.groupTitle}>{t('section_ops')}</h3>

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
                                <input type="text" name="environment" className={styles.input} />
                            </div>
                            <div className={styles.inputField} style={{ marginBottom: '24px' }}>
                                <span className={styles.label}>{t('resource')}</span>
                                <input type="text" name="resource" className={styles.input} />
                            </div>
                            <div className={styles.inputField}>
                                <span className={styles.label}>{t('additional_info')}</span>
                                <textarea name="additional_info" className={`${styles.input} ${styles.textarea}`}></textarea>
                            </div>
                        </div>

                        {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', margin: '0 0 12px' }}>{error}</p>}
                        <button type="submit" className={styles.submitBtn} disabled={status === 'submitting'}>
                            {status === 'submitting' ? '...' : t('submit')}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
