'use client';

import { useCallback, useEffect, useState } from 'react';
import styles from './admin.module.css';

const API = process.env.NEXT_PUBLIC_API_URL ?? '/velnox-api/api';
const PW_KEY = 'velnox_admin_pw';

interface LeadFile { name: string; path: string }
interface Lead {
    id: number;
    type: string;
    type_label: string | null;
    to_email: string | null;
    contact: string;
    article: string | null;
    files: LeadFile[] | null;
    locale: string | null;
    source: string | null;
    ip: string | null;
    status: string;
    created_at: string | null;
}
interface Stats {
    total: number;
    by_type: Record<string, number>;
    by_status: Record<string, number>;
    by_locale: Record<string, number>;
    by_day: { d: string; c: number }[];
}
interface ApiResponse {
    stats: Stats;
    leads: Lead[];
    pagination: { current_page: number; last_page: number; per_page: number; total: number };
}

const TYPE_LABELS: Record<string, string> = {
    analogue: 'Підбір за зразком',
    resource: 'Прорахунок ресурсу',
    batch: 'Замовлення партії',
    custom: 'Кастомне рішення',
    oem: 'OEM-запит',
    distributor: 'Дистриб’ютор',
    contact: 'Контактна форма',
};

function fmtDate(iso: string | null): string {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AdminLeadsPage() {
    const [pw, setPw] = useState('');
    const [authed, setAuthed] = useState(false);
    const [data, setData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // filters
    const [type, setType] = useState('');
    const [status, setStatus] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const fetchLeads = useCallback(async (password: string, p = 1, f: { type?: string; status?: string; search?: string } = {}) => {
        setLoading(true);
        setError('');
        try {
            const qs = new URLSearchParams({ page: String(p), per_page: '30' });
            if (f.type) qs.set('type', f.type);
            if (f.status) qs.set('status', f.status);
            if (f.search) qs.set('search', f.search);
            const res = await fetch(`${API}/v1/admin/leads?${qs.toString()}`, {
                headers: { 'X-Admin-Password': password, Accept: 'application/json' },
            });
            if (res.status === 401) {
                setAuthed(false);
                localStorage.removeItem(PW_KEY);
                setError('Невірний пароль');
                return;
            }
            if (!res.ok) throw new Error('http ' + res.status);
            const json: ApiResponse = await res.json();
            setData(json);
            setAuthed(true);
            localStorage.setItem(PW_KEY, password);
        } catch {
            setError('Помилка завантаження');
        } finally {
            setLoading(false);
        }
    }, []);

    // auto-login if we already have a stored password
    useEffect(() => {
        const stored = typeof window !== 'undefined' ? localStorage.getItem(PW_KEY) : null;
        if (stored) {
            setPw(stored);
            fetchLeads(stored, 1);
        }
    }, [fetchLeads]);

    const applyFilters = (p = 1) => {
        setPage(p);
        fetchLeads(pw, p, { type, status, search });
    };

    const logout = () => {
        localStorage.removeItem(PW_KEY);
        setAuthed(false);
        setData(null);
        setPw('');
    };

    if (!authed) {
        return (
            <div className={styles.gate}>
                <form
                    className={styles.gateBox}
                    onSubmit={(e) => { e.preventDefault(); fetchLeads(pw, 1); }}
                >
                    <h1 className={styles.gateTitle}>VELNOX · Заявки</h1>
                    <p className={styles.gateHint}>Закрита панель. Введіть пароль доступу.</p>
                    <input
                        type="password"
                        className={styles.gateInput}
                        placeholder="Пароль"
                        value={pw}
                        onChange={(e) => setPw(e.target.value)}
                        autoFocus
                    />
                    {error && <p className={styles.gateError}>{error}</p>}
                    <button type="submit" className={styles.gateBtn} disabled={loading || !pw}>
                        {loading ? 'Перевірка…' : 'Увійти'}
                    </button>
                </form>
            </div>
        );
    }

    const stats = data?.stats;

    return (
        <div className={styles.wrap}>
            <div className={styles.header}>
                <h1 className={styles.title}>Заявки з форм</h1>
                <button className={styles.logout} onClick={logout}>Вийти</button>
            </div>

            {stats && (
                <div className={styles.statsRow}>
                    <div className={styles.statCard}>
                        <span className={styles.statNum}>{stats.total}</span>
                        <span className={styles.statLbl}>Усього</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statNum}>{stats.by_status.sent ?? 0}</span>
                        <span className={styles.statLbl}>Надіслано</span>
                    </div>
                    <div className={`${styles.statCard} ${(stats.by_status.failed ?? 0) > 0 ? styles.statCardWarn : ''}`}>
                        <span className={styles.statNum}>{stats.by_status.failed ?? 0}</span>
                        <span className={styles.statLbl}>Помилка пошти</span>
                    </div>
                    <div className={styles.statCardWide}>
                        <span className={styles.statLbl}>За типом</span>
                        <div className={styles.chips}>
                            {Object.entries(stats.by_type).map(([k, v]) => (
                                <span key={k} className={styles.chip}>{TYPE_LABELS[k] ?? k}: <b>{v}</b></span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.filters}>
                <select className={styles.select} value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="">Усі типи</option>
                    {Object.keys(TYPE_LABELS).map((k) => <option key={k} value={k}>{TYPE_LABELS[k]}</option>)}
                </select>
                <select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="">Усі статуси</option>
                    <option value="sent">Надіслано</option>
                    <option value="failed">Помилка</option>
                    <option value="new">Новий</option>
                </select>
                <input
                    className={styles.searchInput}
                    placeholder="Пошук (контакт / артикул)…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') applyFilters(1); }}
                />
                <button className={styles.applyBtn} onClick={() => applyFilters(1)} disabled={loading}>
                    {loading ? '…' : 'Застосувати'}
                </button>
            </div>

            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Дата</th>
                            <th>Тип</th>
                            <th>Контакт</th>
                            <th>Артикул</th>
                            <th>Файли</th>
                            <th>Мова</th>
                            <th>Статус</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.leads.map((l) => (
                            <tr key={l.id}>
                                <td className={styles.nowrap}>{fmtDate(l.created_at)}</td>
                                <td><span className={styles.typeTag}>{l.type_label ?? l.type}</span></td>
                                <td className={styles.contactCell}>{l.contact}</td>
                                <td className={styles.nowrap}>{l.article ?? '—'}</td>
                                <td>
                                    {l.files && l.files.length > 0 ? l.files.map((f, i) => (
                                        <a
                                            key={i}
                                            className={styles.fileLink}
                                            href={`${API}/v1/admin/leads/${l.id}/file/${i}?key=${encodeURIComponent(pw)}`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >{f.name}</a>
                                    )) : '—'}
                                </td>
                                <td className={styles.nowrap}>{l.locale ?? '—'}</td>
                                <td>
                                    <span className={`${styles.status} ${l.status === 'failed' ? styles.statusFail : l.status === 'sent' ? styles.statusOk : ''}`}>
                                        {l.status === 'sent' ? 'надіслано' : l.status === 'failed' ? 'помилка' : l.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {(!data || data.leads.length === 0) && (
                            <tr><td colSpan={7} className={styles.empty}>{loading ? 'Завантаження…' : 'Немає заявок'}</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {data && data.pagination.last_page > 1 && (
                <div className={styles.pager}>
                    <button disabled={page <= 1 || loading} onClick={() => applyFilters(page - 1)}>← Назад</button>
                    <span>Сторінка {data.pagination.current_page} / {data.pagination.last_page}</span>
                    <button disabled={page >= data.pagination.last_page || loading} onClick={() => applyFilters(page + 1)}>Далі →</button>
                </div>
            )}
        </div>
    );
}
