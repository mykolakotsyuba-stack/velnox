import { useTranslations } from 'next-intl';
import { ContactForm } from '@/features/contacts/ContactForm/ContactForm';
import styles from './Contacts.module.css';

export default function ContactsPage() {
    const t = useTranslations('contacts');

    return (
        <div className={styles.wrapper}>
            <div className={styles.gridOverlay} />
            
            <main className={styles.container}>
                <section className={styles.headerSection}>
                    <h1 className={styles.title}>{t('hero.title')}</h1>
                    <p className={styles.subtitle}>
                        {t('hero.text')}
                    </p>
                </section>

                <div className={styles.contentGrid}>
                    <section className={styles.contactBlock}>
                        <div className={styles.contactCard}>
                            <h2 className={styles.contactTitle}>{t('primary.title')}</h2>
                            <a href={`mailto:${t('primary.email')}`} className={styles.emailLink}>
                                {t('primary.email')}
                            </a>
                        </div>

                        <div className={styles.trustBlock}>
                            <p className={styles.trustText}>
                                {t('trust.text')}
                            </p>
                        </div>
                    </section>

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

                <footer className={styles.footer}>
                    {t('footer')}
                </footer>
            </main>
        </div>
    );
}
