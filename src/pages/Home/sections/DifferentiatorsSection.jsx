import { differentiators } from '@/data/differentiators';
import Section from '@/components/common/Section';
import SectionHeading from '@/components/common/SectionHeading';
import styles from './DifferentiatorsSection.module.css';

export default function DifferentiatorsSection() {
  return (
    <Section tone="paper" labelledBy="diff-title">
      <div className={styles.grid}>
        <SectionHeading
          id="diff-title"
          title={differentiators.title}
          lead={differentiators.lead}
        />

        <dl className={styles.list}>
          {differentiators.items.map((item) => (
            <div key={item.term} className={styles.row}>
              <dt className={styles.term}>{item.term}</dt>
              <dd className={styles.detail}>{item.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
