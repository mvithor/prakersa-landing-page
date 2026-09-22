// Menggabungkan nama kelas dan membuang nilai kosong.
// Contoh: cn(styles.button, isActive && styles.active)
export function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}
