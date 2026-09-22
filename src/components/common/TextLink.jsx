import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import styles from './TextLink.module.css';

// Tautan teks bergaris bawah. "to" untuk internal, "href" untuk eksternal.
export default function TextLink({ to, href, className, children, ...rest }) {
  const classes = cn(styles.link, className);

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={classes} {...rest}>
      {children}
    </a>
  );
}
