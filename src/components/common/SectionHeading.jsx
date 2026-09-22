import { cn } from '@/utils/cn';
import styles from './SectionHeading.module.css';

// Judul bagian dengan paragraf pengantar opsional.
export default function SectionHeading({ id, title, lead, as: Tag = 'h2', className }) {
  return (
    <header className={cn(styles.heading, className)}>
      <Tag id={id} className={styles.title}>
        {title}
      </Tag>
      {lead ? <p className={styles.lead}>{lead}</p> : null}
    </header>
  );
}
