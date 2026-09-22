import { PATHS } from '@/routes/paths';

// Bilah pengumuman di atas navigasi. Ganti "id" setiap kali isi berubah
// agar pengunjung yang pernah menutup bilah lama tetap melihat pengumuman baru.
// Set "enabled: false" untuk mematikan.
export const announcement = {
  enabled: true,
  id: 'pilot-smk-2026',
  text: 'Program pilot untuk SMK sedang dibuka.',
  link: { label: 'Ajukan demo', to: PATHS.demo },
};
