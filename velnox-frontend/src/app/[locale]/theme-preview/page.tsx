import styles from './ThemePreview.module.css';
import { getTranslations } from 'next-intl/server';

export default async function ThemePreview() {
    const t = await getTranslations('nav');

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.intro}>
                <h1>Кольорові варіації (Theme Proposals)</h1>
                <p>Експозиція трьох варіантів дизайну, ізольована від основних стилів сайту.</p>
            </div>

            <div className={styles.grid}>
                {/* 1. Industrial Dark */}
                <div className={styles.variant1}>
                    <header className={styles.v1Header}>
                        <div className={styles.v1HeaderTitle}>VELNOX</div>
                        <div className={styles.v1Nav}>
                            <span>Продукти ▾</span>
                            <span>Контакти</span>
                        </div>
                    </header>
                    <div className={styles.v1Body}>
                        <h2>Варіант 1: Industrial Dark</h2>
                        <p style={{ marginBottom: 20, color: '#aaa', fontSize: '0.9rem' }}>Акцент на силі та надійності</p>

                        <div className={styles.v1Card}>
                            <h3>Підшипник UCP208</h3>
                            <p>Серія високоякісних підшипникових вузлів для важкої промисловості.</p>
                            <button className={styles.v1Button}>Замовити 3D модель</button>

                            <table className={styles.v1Table}>
                                <thead>
                                    <tr>
                                        <th>Параметр</th>
                                        <th>Значення</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Внутрішній діаметр, d (мм)</td>
                                        <td>40.00</td>
                                    </tr>
                                    <tr>
                                        <td>Статичне навантаження, C0 (кН)</td>
                                        <td>18.00</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* 2. Engineering Clean */}
                <div className={styles.variant2}>
                    <header className={styles.v2Header}>
                        <div className={styles.v2HeaderTitle}>VELNOX</div>
                        <div className={styles.v2Nav}>
                            <span>Продукти ▾</span>
                            <span>Контакти</span>
                        </div>
                    </header>
                    <div className={styles.v2Body}>
                        <h2 style={{ color: '#00953E' }}>Варіант 2: Engineering Clean</h2>
                        <p style={{ marginBottom: 20, color: '#444', fontSize: '0.9rem' }}>Акцент на точності та системності</p>

                        <div className={styles.v2Card}>
                            <h3>Підшипник UCP208</h3>
                            <p>Серія високоякісних підшипникових вузлів для важкої промисловості.</p>
                            <button className={styles.v2Button}>Замовити 3D модель</button>

                            <table className={styles.v2Table}>
                                <thead>
                                    <tr>
                                        <th>Параметр</th>
                                        <th>Значення</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Внутрішній діаметр, d (мм)</td>
                                        <td>40.00</td>
                                    </tr>
                                    <tr>
                                        <td>Статичне навантаження, C0 (кН)</td>
                                        <td>18.00</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* 3. High-Tech Indigo */}
                <div className={styles.variant3}>
                    <header className={styles.v3Header}>
                        <div className={styles.v3HeaderTitle}>VELNOX</div>
                        <div className={styles.v3Nav}>
                            <span>Продукти ▾</span>
                            <span>Контакти</span>
                        </div>
                    </header>
                    <div className={styles.v3Body}>
                        <h2>Варіант 3: High-Tech Indigo</h2>
                        <p style={{ marginBottom: 20, color: '#ccc', fontSize: '0.9rem' }}>Акцент на технологічності та інноваціях</p>

                        <div className={styles.v3Card}>
                            <h3>Підшипник UCP208</h3>
                            <p>Серія високоякісних підшипникових вузлів для важкої промисловості.</p>
                            <button className={styles.v3Button}>Заказать зразок</button>

                            <table className={styles.v3Table}>
                                <thead>
                                    <tr>
                                        <th>Параметр</th>
                                        <th>Значення</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Внутрішній діаметр, d (мм)</td>
                                        <td>40.00</td>
                                    </tr>
                                    <tr>
                                        <td>Статичне навантаження, C0 (кН)</td>
                                        <td>18.00</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
