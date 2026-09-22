import { cn } from '@/utils/cn';
import styles from './ProfileMarker.module.css';

// Penanda profil. Setiap profil punya warna DAN bentuk sendiri,
// sehingga tetap terbaca bagi pengguna dengan buta warna.
// profileKey kosong menghasilkan titik netral.
export default function ProfileMarker({ profileKey, size = '0.875rem', className }) {
  return (
    <span
      aria-hidden="true"
      className={cn(styles.marker, profileKey ? styles[profileKey] : styles.neutral, className)}
      style={{ '--marker-size': size }}
    />
  );
}
