import styles from './Demo.module.css';
import { PROFIL_META } from '../engine/profile';

const nf = (d) => new Intl.NumberFormat('id-ID', { minimumFractionDigits: d, maximumFractionDigits: d });
const cache = {};
export function fmt(n, d = 0) {
  if (n === null || n === undefined || Number.isNaN(n)) return '-';
  if (!cache[d]) cache[d] = nf(d);
  return cache[d].format(n);
}

// Bentuk penanda berbeda per profil supaya tidak bergantung pada warna saja.
export function Marker({ kode, size = 14 }) {
  const cls = styles[`mk_${kode}`];
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" focusable="false" className={styles.marker}>
      {kode === 'SP' && <circle cx="8" cy="8" r="6" className={cls} />}
      {kode === 'RB' && <polygon points="8,1.5 14.5,13.5 1.5,13.5" className={cls} />}
      {kode === 'RK' && <rect x="2.5" y="2.5" width="11" height="11" className={cls} />}
      {kode === 'RG' && <polygon points="8,0.8 15.2,8 8,15.2 0.8,8" className={cls} />}
      {kode === 'DBC' && <circle cx="8" cy="8" r="5.5" className={cls} />}
    </svg>
  );
}

const AVATAR_COLORS = ['av0', 'av1', 'av2', 'av3', 'av4'];

// Avatar huruf berwarna untuk kartu industri (A, B, C, ...), menggantikan
// nomor peringkat polos supaya kartu punya identitas visual yang lebih kuat.
export function AvatarLetter({ index, ariaLabel }) {
  const i = ((index % 26) + 26) % 26;
  const letter = String.fromCharCode(65 + i);
  const cls = styles[AVATAR_COLORS[index % AVATAR_COLORS.length]];
  return (
    <span
      className={`${styles.avatar} ${cls}`}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    >
      {letter}
    </span>
  );
}

export function kodeTampil(statusProfil) {
  return PROFIL_META[statusProfil]?.kode ?? 'DBC';
}

export function ProfilBadge({ statusProfil }) {
  const meta = PROFIL_META[statusProfil];
  return (
    <span className={`${styles.badge} ${styles[`badge_${meta.kode}`]}`}>
      <Marker kode={meta.kode} size={12} />
      {meta.label}
    </span>
  );
}

const LABEL_KEYAKINAN = { TINGGI: 'tinggi', SEDANG: 'sedang', RENDAH: 'rendah' };

export function KeyakinanBadge({ level, persen }) {
  return (
    <span
      className={`${styles.badge} ${styles[`conf_${level}`]}`}
      title="Seberapa lengkap data industri ini untuk profil siswa. Bukan ukuran akurasi."
    >
      Keyakinan data {LABEL_KEYAKINAN[level]}, {persen}% data terisi
    </span>
  );
}

export function StatusUnitBadge({ status }) {
  const teks = status === 'KRITIS' ? 'Kritis' : status === 'LEMAH' ? 'Lemah' : 'Memenuhi';
  return <span className={`${styles.badge} ${styles[`unit_${status}`]}`}>{teks}</span>;
}

export function gulirKe(id) {
  if (typeof document === 'undefined') return;
  const el = document.getElementById(id);
  if (!el) return;
  const kurangiGerak =
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (el.scrollIntoView) el.scrollIntoView({ behavior: kurangiGerak ? 'auto' : 'smooth', block: 'start' });
}