import { useTranslations } from 'next-intl';
import type { SpecItem } from '@/entities/product/model/types';
import styles from './SpecsTable.module.css';

interface SpecsTableProps {
    specs: SpecItem[];
    hoveredSpec?: string | null;
    onHoverSpec?: (key: string | null) => void;
    isModal?: boolean;
}

export function SpecsTable({ specs, hoveredSpec, onHoverSpec, isModal = false }: SpecsTableProps) {
    const t = useTranslations('product');

    if (!specs || specs.length === 0) return null;

    return (
        <section className={`${styles.section} ${isModal ? styles.isModal : ''}`}>
            <h2 className={styles.title}>{t('specs_table')}</h2>
            <table className={styles.table}>
                <tbody>
                    {specs.map((spec) => {
                        const isHovered = hoveredSpec === spec.key;
                        const displayValue = spec.unit ? `${spec.value} ${spec.unit}` : spec.value;
                        return (
                            <tr
                                key={spec.key}
                                className={isHovered ? styles.activeRow : ''}
                                onMouseEnter={() => onHoverSpec?.(spec.key)}
                                onMouseLeave={() => onHoverSpec?.(null)}
                                style={{
                                    cursor: onHoverSpec ? 'pointer' : 'default',
                                    backgroundColor: isHovered ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                    transition: 'background-color 0.2s ease'
                                }}
                            >
                                <th>{spec.label}</th>
                                <td>{displayValue}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </section>
    );
}
