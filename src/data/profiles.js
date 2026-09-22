// Kunci profil dipakai di logika klasifikasi, warna, dan bentuk penanda.
export const PROFILE_KEYS = {
  ready: 'siap',
  behavior: 'behavior',
  competency: 'kompetensi',
  both: 'ganda',
};

// Nama profil mengikuti penamaan di produk.
export const profiles = [
  {
    key: PROFILE_KEYS.ready,
    name: 'Siap Penuh',
    condition: 'Perilaku kerja dan kompetensi sama-sama di atas ambang jurusan.',
    followUp:
      'Penempatan mengutamakan relevansi teknis dengan unit kompetensi yang sudah dikuasai siswa.',
  },
  {
    key: PROFILE_KEYS.behavior,
    name: 'Risiko Behavior',
    condition:
      'Kompetensi memadai, tetapi kehadiran, ketepatan tugas, atau sikap kerja belum stabil.',
    followUp:
      'Dicocokkan dengan industri yang pembimbingnya mengawasi dengan ketat, bukan industri yang paling bergengsi.',
  },
  {
    key: PROFILE_KEYS.competency,
    name: 'Risiko Kompetensi',
    condition: 'Disiplin kerja baik, tetapi ada unit kompetensi yang belum mencapai ambang.',
    followUp:
      'Guru punya dasar memberi materi tambahan pada unit yang tertinggal sebelum siswa berangkat.',
  },
  {
    key: PROFILE_KEYS.both,
    name: 'Risiko Ganda',
    condition: 'Perilaku kerja dan kompetensi sama-sama di bawah ambang.',
    followUp:
      'Intervensi terstruktur berjalan lebih dulu. Kepala Jurusan dapat menunda penempatan sampai profil membaik.',
  },
];

export const profilesSection = {
  title: 'Empat profil, bukan satu angka',
  lead: 'Satu skor gabungan menyembunyikan penyebabnya. Dua siswa dengan angka yang sama bisa butuh penanganan yang berlawanan, Prakersa memisahkannya sejak awal.',
};

export const getProfile = (key) => profiles.find((profile) => profile.key === key);
