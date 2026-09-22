import { cn } from '@/utils/cn';
import Container from './Container';
import styles from './Section.module.css';

// Satu-satunya komponen yang mengatur jarak vertikal dan warna latar antarbagian.
// tone: paper | mist | ink | primary
// spacing: default | compact | hero
export default function Section({
  id,
  tone = 'paper',
  spacing = 'default',
  labelledBy,
  containerSize,
  className,
  children,
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(styles.section, styles[tone], styles[spacing], className)}
    >
      <Container size={containerSize}>{children}</Container>
    </section>
  );
}
