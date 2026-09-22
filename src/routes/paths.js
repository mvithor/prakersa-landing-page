// Daftar alamat halaman. Semua tautan internal mengambil dari sini
// supaya perubahan URL cukup dilakukan di satu tempat.
export const PATHS = {
  home: '/',
  school: '/sekolah',
  industry: '/industri',
  demo: '/demo',
  privacy: '/kebijakan-privasi',
};

// Jangkar bagian di halaman beranda.
export const ANCHORS = {
  problem: 'masalah',
  howItWorks: 'cara-kerja',
  profiles: 'profil',
  audiences: 'untuk-siapa',
  pilot: 'pilot',
  trackRecord: 'rekam-jejak',
  faq: 'pertanyaan',
};

export const toAnchor = (anchor) => `${PATHS.home}#${anchor}`;
