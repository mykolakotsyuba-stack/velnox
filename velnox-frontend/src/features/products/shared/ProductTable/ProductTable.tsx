'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import styles from './productTable.module.css';

export interface ColDef {
    key: string;
    label: string;
    hasFilter?: boolean;
    width?: string;
}

export interface ProductTableProps {
    columns: ColDef[];
    rows: Record<string, any>[];
    renderCell?: (colKey: string, row: Record<string, any>) => React.ReactNode;
    actionCell?: (row: Record<string, any>) => React.ReactNode;
}

type SortDir = 'asc' | 'desc' | null;

/* ─── Combined sort+filter dropdown for one column ─── */
function ColMenu({
    col,
    sortCol,
    sortDir,
    onSort,
    filterOptions,
    selectedFilters,
    onFilterChange,
}: {
    col: string;
    sortCol: string | null;
    sortDir: SortDir;
    onSort: (dir: SortDir) => void;
    filterOptions: string[];
    selectedFilters: string[];
    onFilterChange: (val: string) => void;
}) {
    const t = useTranslations('table');
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const isActive = sortCol === col || selectedFilters.length > 0;

    useEffect(() => {
        if (!open) return;
        const close = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, [open]);

    const currentDir = sortCol === col ? sortDir : null;

    return (
        <div className={styles.colMenu} ref={ref}>
            <button
                className={`${styles.colMenuBtn}${isActive ? ' ' + styles.colMenuBtnActive : ''}`}
                onClick={e => { e.stopPropagation(); setOpen(v => !v); }}
                title={t('table.sort_filter')}
            >
                <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
                    <circle cx="4" cy="5" r="1.5" />
                    <circle cx="12" cy="5" r="1.5" />
                    <circle cx="4" cy="11" r="1.5" />
                    <circle cx="12" cy="11" r="1.5" />
                </svg>
            </button>

            {open && (
                <div className={styles.colDropdown} onClick={e => e.stopPropagation()}>
                    {/* Sort section */}
                    <div className={styles.colDropdownSection}>
                        <button
                            className={`${styles.sortOption}${currentDir === 'asc' ? ' ' + styles.sortOptionActive : ''}`}
                            onClick={() => { onSort(currentDir === 'asc' ? null : 'asc'); setOpen(false); }}
                        >
                            <span>↑</span> {t('sort_asc')}
                        </button>
                        <button
                            className={`${styles.sortOption}${currentDir === 'desc' ? ' ' + styles.sortOptionActive : ''}`}
                            onClick={() => { onSort(currentDir === 'desc' ? null : 'desc'); setOpen(false); }}
                        >
                            <span>↓</span> {t('sort_desc')}
                        </button>
                    </div>

                    {/* Filter section */}
                    {filterOptions.length > 0 && (
                        <>
                            <div className={styles.colDropdownDivider} />
                            <div className={styles.colDropdownSection}>
                                {filterOptions.map(opt => (
                                    <label key={opt} className={styles.filterOption}>
                                        <input
                                            type="checkbox"
                                            checked={selectedFilters.includes(opt)}
                                            onChange={() => onFilterChange(opt)}
                                        />
                                        {opt}
                                    </label>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

/* ─── Main Table ─── */
export function ProductTable({ columns, rows, renderCell, actionCell }: ProductTableProps) {
    const t = useTranslations('table');
    const locale = useLocale();
    const [sortCol, setSortCol] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<SortDir>(null);
    const [filters, setFilters] = useState<Record<string, string[]>>({});

    const handleSort = useCallback((col: string, dir: SortDir) => {
        setSortCol(dir ? col : null);
        setSortDir(dir);
    }, []);

    const handleFilterChange = useCallback((col: string, val: string) => {
        setFilters(prev => {
            const cur = prev[col] || [];
            return { ...prev, [col]: cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val] };
        });
    }, []);

    const filterOptions = useMemo(() => {
        const opts: Record<string, string[]> = {};
        for (const col of columns) {
            if (!col.hasFilter) continue;
            const seen = new Set<string>();
            for (const row of rows) {
                const v = String(row[col.key] ?? '').trim();
                if (v && v !== '-' && v !== '—') seen.add(v);
            }
            opts[col.key] = Array.from(seen).sort((a, b) => {
                const an = parseFloat(a), bn = parseFloat(b);
                return !isNaN(an) && !isNaN(bn) ? an - bn : a.localeCompare(b);
            });
        }
        return opts;
    }, [rows, columns]);

    const sorted = useMemo(() => {
        if (!sortCol || !sortDir) return rows;
        return [...rows].sort((a, b) => {
            const av = a[sortCol] ?? '', bv = b[sortCol] ?? '';
            const an = parseFloat(String(av)), bn = parseFloat(String(bv));
            const cmp = !isNaN(an) && !isNaN(bn) ? an - bn : String(av).localeCompare(String(bv));
            return sortDir === 'asc' ? cmp : -cmp;
        });
    }, [rows, sortCol, sortDir]);

    const filtered = useMemo(() => {
        return sorted.filter(row => {
            for (const [col, vals] of Object.entries(filters)) {
                if (!vals.length) continue;
                if (!vals.includes(String(row[col] ?? '').trim())) return false;
            }
            return true;
        });
    }, [sorted, filters]);

    const hasAction = !!actionCell;
    const colCount = columns.length + (hasAction ? 1 : 0);

    return (
        <div className={styles.tableScroll}>
            <table className={styles.techTable} lang={locale}>
                <thead>
                    <tr>
                        {columns.map(col => (
                            <th key={col.key} style={col.width ? { width: col.width } : undefined}>
                                <div className={styles.thInner}>
                                    <span className={styles.thLabel}>{col.label}</span>
                                    <ColMenu
                                        col={col.key}
                                        sortCol={sortCol}
                                        sortDir={sortDir}
                                        onSort={dir => handleSort(col.key, dir)}
                                        filterOptions={col.hasFilter ? (filterOptions[col.key] || []) : []}
                                        selectedFilters={filters[col.key] || []}
                                        onFilterChange={val => handleFilterChange(col.key, val)}
                                    />
                                </div>
                            </th>
                        ))}
                        {hasAction && <th className={styles.actionCol} />}
                    </tr>
                </thead>
                <tbody>
                    {filtered.length === 0 ? (
                        <tr>
                            <td colSpan={colCount} className={styles.emptyState}>
                                {t('empty')}
                            </td>
                        </tr>
                    ) : filtered.map((row, i) => (
                        <tr key={i}>
                            {columns.map(col => (
                                <td key={col.key} data-label={col.label}>
                                    {renderCell
                                        ? (renderCell(col.key, row) ?? (row[col.key] ?? '—'))
                                        : (row[col.key] ?? '—')}
                                </td>
                            ))}
                            {hasAction && (
                                <td className={styles.actionCol} data-label="">
                                    {actionCell!(row)}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
