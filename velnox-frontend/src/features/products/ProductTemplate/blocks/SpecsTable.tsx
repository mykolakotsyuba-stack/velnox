import { useTranslations } from 'next-intl';
import type { SpecItem } from '@/entities/product/model/types';
import styles from './SpecsTable.module.css';

interface SpecsTableProps {
    specs: SpecItem[];
    hoveredSpec?: string | null;
    onHoverSpec?: (key: string | null) => void;
    isModal?: boolean;
    /** Keys that have dim_labels on the blueprint (highlight on schema) */
    schemaKeys?: Set<string>;
}

/** Group 1: габаритні розміри — завжди першими */
const DIMENSIONAL_KEYS = new Set([
    'd_inch', 'd_mm', 'D_mm', 'B_mm', 'L_mm', 'J_mm',
    'A_mm', 'A1_mm', 'A2_mm', 'C_mm', 'Da_mm', 'N_mm', 'M_mm',
    // розділені ключі — той самий замір, окремий ключ на таблицю
    'shaft_d_mm', 'flange_A1_mm', 'mount_N_mm',
]);

/** Group 3: навантаження / маса — завжди останніми */
const LOAD_KEYS = new Set([
    'Cdyn_kN', 'Co_kN', 'Pu_kN', 'mass', 'Pr_kN', 'Fa_kN',
]);

function sortSpecs(specs: SpecItem[], schemaKeys: Set<string>): SpecItem[] {
    const group1: SpecItem[] = []; // габаритні
    const group2: SpecItem[] = []; // схемні (підсвічуються)
    const group3: SpecItem[] = []; // навантаження/маса
    const group4: SpecItem[] = []; // інші

    for (const spec of specs) {
        if (DIMENSIONAL_KEYS.has(spec.key)) {
            group1.push(spec);
        } else if (schemaKeys.has(spec.key)) {
            group2.push(spec);
        } else if (LOAD_KEYS.has(spec.key)) {
            group3.push(spec);
        } else {
            group4.push(spec);
        }
    }

    return [...group1, ...group2, ...group4, ...group3];
}

export function SpecsTable({ specs, hoveredSpec, onHoverSpec, isModal = false, schemaKeys }: SpecsTableProps) {
    const t = useTranslations('product');

    if (!specs || specs.length === 0) return null;

    const effectiveSchemaKeys = schemaKeys ?? new Set<string>();
    const orderedSpecs = sortSpecs(specs, effectiveSchemaKeys);

    // Find where dimensional specs end for divider
    let lastDimIdx = -1;
    orderedSpecs.forEach((s, i) => {
        if (DIMENSIONAL_KEYS.has(s.key)) lastDimIdx = i;
    });

    return (
        <section className={`${styles.section} ${isModal ? styles.isModal : ''}`}>
            <table className={styles.table}>
                <caption className={styles.title}>{t('specs_table')}</caption>
                <tbody>
                    {orderedSpecs.map((spec, idx) => {
                        const isDim = DIMENSIONAL_KEYS.has(spec.key);
                        const isHovered = hoveredSpec === spec.key;
                        const isDivider = idx === lastDimIdx && lastDimIdx < orderedSpecs.length - 1;
                        return (
                            <tr
                                key={spec.key}
                                className={`${isHovered ? styles.activeRow : ''} ${isDim ? styles.keyRow : ''} ${isDivider ? styles.dividerRow : ''}`}
                                onMouseEnter={() => onHoverSpec?.(spec.key)}
                                onMouseLeave={() => onHoverSpec?.(null)}
                            >
                                <th>{spec.label}</th>
                                <td>{spec.value}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </section>
    );
}
