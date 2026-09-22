import { cn } from '@/utils/cn';
import styles from './Container.module.css';

// Pembatas lebar konten. size="narrow" untuk halaman teks panjang, size="wide" untuk section visual-heavy (hero, showcase produk).
export default function Container({ as: Tag = 'div', size = 'default', className, children, ...rest }) {
  return (
    <Tag
      className={cn(
        styles.container,
        size === 'narrow' && styles.narrow,
        size === 'wide' && styles.wide,
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}