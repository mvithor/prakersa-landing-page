import { cn } from '@/utils/cn';
import styles from './MediaLinkCard.module.css';

// Kartu untuk merujuk ke sumber eksternal (liputan media, halaman pihak ketiga)
// yang tidak dihosting sebagai aset gambar sendiri, cuma ditautkan.
// Kalau link.image diisi, foto ditampilkan langsung dari server sumbernya
// (hotlink), lengkap dengan kredit sumber di atas foto. Foto itu tetap
// milik penerbit aslinya, bukan aset milik tim.
export default function MediaLinkCard({ link, className }) {
  if (!link?.url) return null;

  if (link.image) {
    return (
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(styles.photoCard, className)}
      >
        <img
          src={link.image}
          alt={link.imageAlt ?? link.label}
          className={styles.photo}
          loading="lazy"
        />
        {link.imageCredit ? <span className={styles.credit}>{link.imageCredit}</span> : null}
        <span className={styles.overlay}>
          <span className={styles.overlayIcon} aria-hidden="true">↗</span>
          <span className={styles.overlayLabel}>{link.label}</span>
        </span>
      </a>
    );
  }

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(styles.card, className)}
    >
      <span className={styles.icon} aria-hidden="true">↗</span>
      <span className={styles.label}>{link.label}</span>
      <span className={styles.hint}>Buka di tab baru</span>
    </a>
  );
}