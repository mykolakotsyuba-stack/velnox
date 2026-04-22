import { useTranslations } from 'next-intl';
import type { ProductSpecs } from '@/entities/product/model/types';
import styles from './SpecsTable.module.css';

interface SpecsTableProps {
    specs: ProductSpecs;
    hoveredSpec?: string | null;
    onHoverSpec?: (key: string | null) => void;
    isModal?: boolean;
}

export function SpecsTable({ specs, hoveredSpec, onHoverSpec, isModal = false }: SpecsTableProps) {
    const t = useTranslations('product');

    // Exclude catalog/reference fields shown in other blocks
    const EXCLUDE = new Set(['table_group', 'bearing_designation', 'brand_name', 'cross_reference', 'part_number']);
    const rows = Object.entries(specs).filter(([key, value]) => value != null && !EXCLUDE.has(key));

    if (rows.length === 0) return null;

    return (
        <section className={`${styles.section} ${isModal ? styles.isModal : ''}`}>
            <h2 className={styles.title}>{t('specs_table')}</h2>
            <table className={styles.table}>
                <tbody>
                    {rows.map(([key, value]) => {
                        const isHovered = hoveredSpec === key;
                        return (
                            <tr
                                key={key}
                                className={isHovered ? styles.activeRow : ''}
                                onMouseEnter={() => onHoverSpec?.(key)}
                                onMouseLeave={() => onHoverSpec?.(null)}
                                style={{
                                    cursor: onHoverSpec ? 'pointer' : 'default',
                                    backgroundColor: isHovered ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                    transition: 'background-color 0.2s ease'
                                }}
                            >
                                <th>{t.has(key) ? t(key) : key.replace(/_/g, ' ').toUpperCase()}</th>
                                <td>{value}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </section>
    );
}
