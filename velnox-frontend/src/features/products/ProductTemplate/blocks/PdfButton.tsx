'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import type { ProductDTO, Locale } from '@/entities/product/model/types';
import { PdfLayout } from './PdfLayout';
import styles from './PdfButton.module.css';

interface PdfButtonProps {
    product: ProductDTO;
    locale: Locale;
}

export function PdfButton({ product, locale }: PdfButtonProps) {
    const t = useTranslations('product');
    const [isGenerating, setIsGenerating] = useState(false);
    const [showLayout, setShowLayout] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [pageUrl, setPageUrl] = useState('');
    const hiddenPdfRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setPageUrl(window.location.href);
    }, []);

    const safeArticle = product.article.replace(/[^a-zA-Z0-9-_]/g, '_');
    const filename = `VELNOX_Catalog_${safeArticle}.pdf`;

    useEffect(() => {
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [pdfUrl]);

    const handleGenerate = useCallback(async () => {
        if (isGenerating) return;

        try {
            setIsGenerating(true);
            setShowLayout(true);

            // Wait for PdfLayout to mount and images to load
            await new Promise(resolve => setTimeout(resolve, 600));

            if (!hiddenPdfRef.current) return;

            const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
                import('html2canvas'),
                import('jspdf'),
            ]);

            const canvas = await html2canvas(hiddenPdfRef.current, {
                scale: 1.5,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.85);

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            let heightLeft = pdfHeight;
            let position = 0;

            pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position -= pageHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
                heightLeft -= pageHeight;
            }

            const pdfArrayBuffer = pdf.output('arraybuffer');
            const blob = new Blob([pdfArrayBuffer], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            setPdfUrl(url);

        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Помилка при генерації PDF. Будь ласка, спробуйте ще раз.");
        } finally {
            setIsGenerating(false);
            setShowLayout(false);
        }
    }, [isGenerating, product, locale, pageUrl]);

    return (
        <>
            {pdfUrl ? (
                // Two options: download (may be blocked on HTTP) + open in new tab (always works)
                <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                    <a
                        href={pdfUrl}
                        download={filename}
                        className={`${styles.pdfButton} ${styles.ready}`}
                        title="Зберегти файл"
                        onClick={() => {
                            setTimeout(() => setPdfUrl(null), 3000);
                        }}
                    >
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        <span className={styles.buttonText}>Зберегти PDF</span>
                    </a>
                    <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.pdfButton} ${styles.ready}`}
                        title="Відкрити PDF у новій вкладці"
                        style={{ padding: '9px 14px' }}
                    >
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                    </a>
                </div>
            ) : (
                <button
                    className={`${styles.pdfButton} ${isGenerating ? styles.loading : ''}`}
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    aria-label="Згенерувати PDF"
                    title="Згенерувати PDF"
                >
                    {isGenerating ? (
                        <div className={styles.spinner}></div>
                    ) : (
                        <svg
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                        </svg>
                    )}
                    <span className={styles.buttonText}>
                        {isGenerating ? 'Генерація...' : 'Підготовка PDF'}
                    </span>
                </button>
            )}

            {showLayout && (
                <div
                    style={{
                        position: 'absolute',
                        top: '-9999px',
                        left: 0,
                        zIndex: -9999,
                        pointerEvents: 'none'
                    }}
                >
                    <PdfLayout
                        ref={hiddenPdfRef}
                        product={product}
                        locale={locale}
                        pageUrl={pageUrl}
                    />
                </div>
            )}
        </>
    );
}
