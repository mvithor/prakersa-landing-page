import { privacyPage } from '@/data/privacy';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import Section from '@/components/common/Section';
import styles from './Privacy.module.css';

export default function Privacy() {
  useDocumentTitle(privacyPage.documentTitle);

  return (
    <Section tone="paper" spacing="hero" containerSize="narrow" labelledBy="privacy-title">
      <h1 id="privacy-title" className={styles.title}>
        {privacyPage.title}
      </h1>

      <p className={styles.reviewStatus}>
        {privacyPage.lastReviewed
          ? `Terakhir ditinjau penasihat hukum: ${privacyPage.lastReviewed}.`
          : 'Belum pernah ditinjau penasihat hukum.'}
      </p>

      {privacyPage.sections.map((section) => (
        <section key={section.id} className={styles.block}>
          <h2 className={styles.heading}>{section.heading}</h2>
          {section.body.map((paragraf, i) => (
            <p key={i} className={styles.body}>
              {paragraf}
            </p>
          ))}
        </section>
      ))}
    </Section>
  );
}