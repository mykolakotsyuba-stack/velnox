'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL ?? '/velnox-api/api';

export default function DownloadPage() {
    const { token } = useParams<{ token: string }>();
    const [status, setStatus] = useState<'loading' | 'downloading' | 'error' | 'expired'>('loading');
    const [fileName, setFileName] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (!token) return;
        fetch(`${API}/v1/downloads/${token}`)
            .then(r => r.json())
            .then(data => {
                if (!data.success) {
                    setStatus(data.error === 'expired' ? 'expired' : 'error');
                    setErrorMsg(data.error);
                    return;
                }
                setFileName(data.file_label ?? '');
                setStatus('downloading');
                // Запускаємо завантаження файлу — GA4 фіксує UTM з поточного URL
                const a = document.createElement('a');
                a.href = data.file_url;
                a.download = (data.file_label ?? 'model') + '.glb';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            })
            .catch(() => {
                setStatus('error');
                setErrorMsg('network');
            });
    }, [token]);

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center',
            justifyContent: 'center', background: 'var(--color-bg)',
            fontFamily: 'var(--font-sans, system-ui)',
        }}>
            <div style={{
                maxWidth: 480, width: '100%', margin: '0 20px',
                background: 'var(--color-surface, #fff)',
                border: '1px solid var(--color-border, #e5e7eb)',
                borderRadius: 16, overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}>
                {/* Header */}
                <div style={{ background: '#1a2e4a', padding: '24px 32px' }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>
                        VELN<span style={{ color: '#e8a020' }}>O</span>X
                    </span>
                </div>
                <div style={{ background: '#e8a020', height: 3 }} />

                <div style={{ padding: '40px 32px', textAlign: 'center' }}>

                    {status === 'loading' && (
                        <>
                            <div style={{
                                width: 48, height: 48, border: '3px solid #e5e7eb',
                                borderTopColor: '#e8a020', borderRadius: '50%',
                                animation: 'spin 1s linear infinite', margin: '0 auto 24px',
                            }} />
                            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                            <p style={{ color: 'var(--color-text-muted, #6b7280)', margin: 0 }}>Перевіряємо посилання…</p>
                        </>
                    )}

                    {status === 'downloading' && (
                        <>
                            <div style={{
                                width: 64, height: 64, background: 'rgba(232,160,32,0.1)',
                                borderRadius: '50%', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', margin: '0 auto 24px',
                            }}>
                                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#e8a020" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                                </svg>
                            </div>
                            <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 700, color: '#1a2e4a' }}>
                                Завантаження розпочато
                            </h2>
                            <p style={{ margin: '0 0 24px', color: '#6b7280', fontSize: 14 }}>
                                {fileName && <><strong>{fileName}</strong> · </>}GLB 3D модель
                            </p>
                            <p style={{ margin: 0, fontSize: 12, color: '#9ca3af' }}>
                                Якщо завантаження не почалось —{' '}
                                <a
                                    href="#"
                                    style={{ color: '#e8a020' }}
                                    onClick={e => { e.preventDefault(); window.location.reload(); }}
                                >
                                    натисніть тут
                                </a>
                            </p>
                        </>
                    )}

                    {status === 'expired' && (
                        <>
                            <div style={{
                                width: 64, height: 64, background: 'rgba(239,68,68,0.1)',
                                borderRadius: '50%', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', margin: '0 auto 24px',
                            }}>
                                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#ef4444" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                            </div>
                            <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 700, color: '#1a2e4a' }}>
                                Посилання застаріло
                            </h2>
                            <p style={{ margin: '0 0 24px', color: '#6b7280', fontSize: 14 }}>
                                Термін дії посилання (24 год) минув. Зробіть новий запит.
                            </p>
                            <a href="/velnox/uk/products/test-3d"
                               style={{ display: 'inline-block', background: '#e8a020', color: '#fff', textDecoration: 'none', padding: '12px 32px', borderRadius: 8, fontWeight: 600, fontSize: 14 }}>
                                Отримати нове посилання
                            </a>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div style={{
                                width: 64, height: 64, background: 'rgba(239,68,68,0.1)',
                                borderRadius: '50%', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', margin: '0 auto 24px',
                            }}>
                                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#ef4444" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                                </svg>
                            </div>
                            <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 700, color: '#1a2e4a' }}>
                                Посилання недійсне
                            </h2>
                            <p style={{ margin: '0 0 24px', color: '#6b7280', fontSize: 14 }}>
                                Посилання не знайдено або вже не дійсне.
                            </p>
                            <a href="/velnox/uk/products/test-3d"
                               style={{ display: 'inline-block', background: '#1a2e4a', color: '#fff', textDecoration: 'none', padding: '12px 32px', borderRadius: 8, fontWeight: 600, fontSize: 14 }}>
                                Повернутись
                            </a>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}
