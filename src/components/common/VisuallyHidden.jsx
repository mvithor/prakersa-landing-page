import styles from './VisuallyHidden.module.css';

// Teks yang hanya dibaca pembaca layar.
export default function VisuallyHidden({ as: Tag = 'span', children }) {
  return <Tag className={styles.hidden}>{children}</Tag>;
}
