import { PATHS } from '@/routes/paths';

export const hero = {
  kickers: [
    { type: 'status', text: 'PT Terdaftar · Kemenkumham' },
    { type: 'category', text: 'Infrastruktur Kesiapan Kerja Vokasi' },
  ],

  titleStatic: 'Kesiapan kerja SMK, bukan lagi tebakan.',
  titleRotating: [
    'Terpantau sejak kelas 10.',
    'Diuji industri selama PKL.',
    'Terverifikasi sampai dunia kerja.',
  ],

  lead: 'Prakersa membangun profil kesiapan kerja siswa sejak kelas 10, dari data perilaku harian Abseninaja dan capaian kompetensi berbasis SKKNI yang diinput guru produktif, lalu memvalidasinya bertahap lewat evaluasi industri selama PKL. Hasilnya satu alur data yang utuh dari sekolah sampai dunia kerja',

  primaryCta: { label: 'Lihat aliran infrastruktur', to: '#cara-kerja' },
  secondaryCta: { label: 'Saya dari industri mitra', to: PATHS.industry },
};