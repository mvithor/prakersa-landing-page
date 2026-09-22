import { closingCta } from '@/data/closingCta';
import { demoPage } from '@/data/demoForm';
import { buildWhatsAppUrl } from '@/utils/whatsapp';
import Button from '@/components/common/Button';
import Section from '@/components/common/Section';
import styles from './ClosingCtaSection.module.css';

export default function ClosingCtaSection() {
  const offtakerUrl = buildWhatsAppUrl(demoPage.whatsappNumber, closingCta.cta.message);

  return (
    <Section tone="ink" labelledBy="closing-title" className={styles.section}>
      <div className={styles.grid}>
        <div>
          <p className={styles.kicker}>{closingCta.kicker}</p>
          <h2 id="closing-title">{closingCta.title}</h2>
          <p className={styles.text}>{closingCta.text}</p>
        </div>

        <div className={styles.actions}>
          <Button
            href={offtakerUrl}
            size="lg"
            variant="outlineInverse"
            target="_blank"
            rel="noopener noreferrer"
          >
            {closingCta.cta.label}
          </Button>
        </div>
      </div>
    </Section>
  );
}