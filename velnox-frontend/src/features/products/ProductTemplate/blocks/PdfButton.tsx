'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import type { ProductDTO, Locale } from '@/entities/product/model/types';
import { PdfLayout } from './PdfLayout';
import styles from './PdfButton.module.css';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface PdfButtonProps {
    product: ProductDTO;
    locale: Locale;
}

export function PdfButton({ product, locale }: PdfButtonProps) {
    const t = useTranslations('product');
    const [isGenerating, setIsGenerating] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const hiddenPdfRef = useRef<HTMLDivElement>(null);

    const safeArticle = product.article.replace(/[^a-zA-Z0-9-_]/g, '_');
    const filename = `VELNOX_Catalog_${safeArticle}.pdf`;

    // Cleanup object URL on unmount or when generating a new one
    useEffect(() => {
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [pdfUrl]);

    const handleGenerate = async () => {
        if (!hiddenPdfRef.current || isGenerating) return;

        try {
            setIsGenerating(true);

            // Wait slightly to ensure fonts and images in the hidden container are loaded
            await new Promise(resolve => setTimeout(resolve, 300));

            // Capture the strictly styled A4 container
            const canvas = await html2canvas(hiddenPdfRef.current, {
                scale: 1.5, // 1.5 is enough for A4, keeps file size reasonable
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
            });

            // Use JPEG instead of PNG to drastically reduce file size
            const imgData = canvas.toDataURL('image/jpeg', 0.85);

            // Format A4 (210mm x 297mm)
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

            // First page
            pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
            heightLeft -= pageHeight;

            // Subsequent pages
            while (heightLeft >= 0) {
                position -= pageHeight; // Shift image UP by exactly one page height
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
                heightLeft -= pageHeight;
            }

            const blob = pdf.output('blob');
            const url = URL.createObjectURL(blob);

            // Instead of auto-clicking (which triggers Safari's filename bug), 
            // we shift to a state where the user clicks a native download link.
            setPdfUrl(url);

        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Помилка при генерації PDF. Будь ласка, спробуйте ще раз.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <>
            {pdfUrl ? (
                // Native synchronous download link (Preserves filename across all browsers)
                <a
                    href={pdfUrl}
                    download={filename}
                    className={`${styles.pdfButton} ${styles.ready}`}
                    title="Зберегти файл"
                    onClick={() => {
                        // Reset button state after a short delay so they can re-generate if needed
                        setTimeout(() => setPdfUrl(null), 3000);
                    }}
                >
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
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span className={styles.buttonText}>Зберегти Файл PDF</span>
                </a>
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

            {/* The hidden A4 layout that will be captured by html2canvas */}
            <div
                style={{
                    position: 'absolute',
                    top: '-9999px',
                    left: 0,
                    zIndex: -9999,
                    pointerEvents: 'none'
                }}
            >
                <PdfLayout ref={hiddenPdfRef} product={product} locale={locale} />
            </div>
        </>
    );
}
