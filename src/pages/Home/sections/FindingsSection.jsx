import { findings } from '@/data/findings';
import Section from '@/components/common/Section';
import styles from './FindingsSection.module.css';

export default function FindingsSection() {
  return (
    <Section tone="paper" spacing="compact" labelledBy="findings-title" className={styles.section}>
      <h2 id="findings-title" className={styles.title}>
        {findings.title}
      </h2>
      <ul className={styles.list}>
        {findings.items.map((item) => (
          <li key={item.value} className={styles.item}>
            <p className={styles.value}>{item.value}</p>
            <p className={styles.text}>{item.text}</p>
            {item.sample ? <p className={styles.sample}>{item.sample}</p> : null}
          </li>
        ))}
      </ul>
      <p className={styles.source}>{findings.source}</p>
    </Section>
  );
}
