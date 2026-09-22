import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import styles from './Button.module.css';

// Tombol serbaguna.
// "to"   -> tautan internal (React Router)
// "href" -> tautan eksternal
// selain itu -> <button>
// variant: primary | secondary | inverse | outlineInverse
export default function Button({
  to,
  href,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  children,
  ...rest
}) {
  const classes = cn(
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    className,
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
