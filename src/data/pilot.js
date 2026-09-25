import { PATHS } from '@/routes/paths';

export const pilot = {
  title: 'Program pilot untuk SMK',
  lead: 'Kami mendampingi sekolah pilot lebih dulu, agar ambang tiap jurusan dikalibrasi bersama Kepala Jurusan, bukan ditebak dari jauh.',
  quota: { total: 8, filled: 3, unit: 'sekolah' },
  quotaLabel: 'Slot pilot terisi',
  benefitsTitle: 'Yang didapat sekolah pilot',
  benefits: [
    'Pendampingan pemetaan mata pelajaran ke unit SKKNI bersama Kepala Jurusan.',
    'Kalibrasi ambang per jurusan sebelum profil pertama dibuat.',
    'Pelatihan input kompetensi untuk guru produktif.',
    'Dasbor profil empat klasifikasi untuk Kepala Jurusan.',
    'Industri mitra sekolah ikut serta tanpa biaya.',
  ],
  requirement:
    'Syarat: sekolah memakai atau bersedia memakai Abseninaja, karena data perilaku bersumber dari sana.',
  cta: { label: 'Ajukan demo sekolah', to: PATHS.demo },
};
