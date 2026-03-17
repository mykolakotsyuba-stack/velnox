import { useTranslations } from 'next-intl';
import { ContactForm } from '@/features/contacts/ContactForm/ContactForm';
import { Phone, Mail } from 'lucide-react';
import styles from './Contacts.module.css';

export default function ContactsPage() {
    const t = useTranslations('contacts');

    return (
        <div className={styles.wrapper}>
            <div className={styles.gridOverlay} />
            
            <main className={styles.container}>
                <div className={styles.contentGrid}>
                    <div className={styles.leftColumn}>
                        <section className={styles.headerSection}>
                            <h1 className={styles.title}>{t('hero.title')}</h1>
                            <p className={styles.subtitle}>
                                {t('hero.text')}
                            </p>
                        </section>

                        <section className={styles.contactBlocks}>
                            {/* Block 1: Engineering */}
                            <div className={styles.routingBlock}>
                                <h3 className={styles.blockTitle}>{t('routing.block1.title')}</h3>
                                <p className={styles.blockDesc}>{t('routing.block1.desc')}</p>
                                <div className={styles.blockContacts}>
                                    <a href={`tel:${t('routing.block1.phone')}`} className={styles.contactItem}>
                                        <Phone size={18} />
                                        <span>{t('routing.block1.phone')}</span>
                                    </a>
                                    <a href={`mailto:${t('routing.block1.email')}`} className={styles.contactItem}>
                                        <Mail size={18} />
                                        <span>{t('routing.block1.email')}</span>
                                    </a>
                                </div>
                            </div>

                            {/* Block 2: Sales */}
                            <div className={styles.routingBlock}>
                                <h3 className={styles.blockTitle}>{t('routing.block2.title')}</h3>
                                <p className={styles.blockDesc}>{t('routing.block2.desc')}</p>
                                <div className={styles.blockContacts}>
                                    <a href={`tel:${t('routing.block2.phone')}`} className={styles.contactItem}>
                                        <Phone size={18} />
                                        <span>{t('routing.block2.phone')}</span>
                                    </a>
                                    <a href={`mailto:${t('routing.block2.email')}`} className={styles.contactItem}>
                                        <Mail size={18} />
                                        <span>{t('routing.block2.email')}</span>
                                    </a>
                                </div>
                            </div>

                            {/* Block 3: General */}
                            <div className={styles.routingBlock}>
                                <h3 className={styles.blockTitle}>{t('routing.block3.title')}</h3>
                                <div className={styles.blockContacts}>
                                    <a href={`mailto:${t('routing.block3.email')}`} className={styles.contactItem}>
                                        <Mail size={18} />
                                        <span>{t('routing.block3.email')}</span>
                                    </a>
                                </div>
                            </div>
                        </section>
                    </div>

                    <section className={styles.formSection}>
                        <div className={styles.formCard}>
                            <header className={styles.formHeader}>
                                <h2 className={styles.formTitle}>{t('form.title')}</h2>
                                <p className={styles.formSubtitle}>{t('form.subtitle')}</p>
                            </header>
                            <ContactForm />
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
