import { ANCHORS, PATHS, toAnchor } from '@/routes/paths';

export const mainNav = [
  { label: 'Masalah', to: toAnchor(ANCHORS.problem) },
  { label: 'Cara kerja', to: toAnchor(ANCHORS.howItWorks) },
  { label: 'Empat profil', to: toAnchor(ANCHORS.profiles) },
  { label: 'Untuk sekolah', to: PATHS.school },
  { label: 'Untuk industri', to: PATHS.industry },
  { label: 'Pertanyaan', to: toAnchor(ANCHORS.faq) },
];

export const navCta = { label: 'Ajukan demo', to: PATHS.demo };
