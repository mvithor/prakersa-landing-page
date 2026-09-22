import { faq } from '@/data/faq';
import { ANCHORS } from '@/routes/paths';
import Icon from '@/components/common/Icon';
import Section from '@/components/common/Section';
import SectionHeading from '@/components/common/SectionHeading';
import TextLink from '@/components/common/TextLink';
import styles from './FaqSection.module.css';

// Memakai <details> bawaan browser: aksesibel tanpa JavaScript tambahan.
export default function FaqSection() {
  return (
    <Section id={ANCHORS.faq} tone="mist" labelledBy="faq-title">
      <div className={styles.grid}>
        <SectionHeading id="faq-title" title={faq.title} />

        <div className={styles.list}>
          {faq.items.map((item) => (
            <details key={item.question} className={styles.item}>
              <summary className={styles.question}>
                <span>{item.question}</span>
                <Icon name="chevronDown" size={20} className={styles.chevron} />
              </summary>
              <div className={styles.answer}>
                <p>{item.answer}</p>
                {item.link ? (
                  <p className={styles.answerLink}>
                    <TextLink to={item.link.to}>{item.link.label}</TextLink>
                  </p>
                ) : null}
              </div>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}
