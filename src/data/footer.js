import { ANCHORS, PATHS, toAnchor } from '@/routes/paths';

export const footerGroups = [
  {
    title: 'Produk',
    links: [
      { label: 'Cara kerja', to: toAnchor(ANCHORS.howItWorks) },
      { label: 'Empat profil', to: toAnchor(ANCHORS.profiles) },
      { label: 'Program pilot', to: toAnchor(ANCHORS.pilot) },
      { label: 'Pertanyaan', to: toAnchor(ANCHORS.faq) },
    ],
  },
  {
    title: 'Untuk Anda',
    links: [
      { label: 'Sekolah', to: PATHS.school },
      { label: 'Industri mitra', to: PATHS.industry },
      { label: 'Ajukan demo', to: PATHS.demo },
    ],
  },
];