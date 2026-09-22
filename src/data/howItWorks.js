export const howItWorks = {
  title: 'Cara kerja, dari data harian sampai penempatan kerja',
  lead: 'Lima langkah berurutan, bukan lima fitur terpisah. Tiap langkah kami beri status jujur, mana yang sudah berjalan, mana yang sedang dibangun, mana yang masih visi, supaya Anda tahu persis bagian mana yang bisa diandalkan hari ini.',

  steps: [
    {
      id: 'data-masuk',
      title: 'Data Masuk',
      tone: 'live',
      text: 'Setiap hari, dua aliran data masuk: kehadiran dan pola kerja siswa dari Abseninaja, serta capaian unit kompetensi yang diinput guru produktif sesuai jadwal semester.',
      insight: 'Aliran perilaku berjalan otomatis lewat Abseninaja, dipakai 2.000+ pengguna aktif sejak Januari 2026. Aliran kompetensi kini juga berjalan penuh, diisi guru produktif tiap semester.',
    },
    {
      id: 'skor-diagnosis',
      title: 'Skor & Diagnosis',
      tone: 'live',
      text: 'Scoring Engine mengolah dua aliran data itu jadi profil kesiapan kerja per siswa, empat kuadran: Siap Penuh, Risiko Behavior, Risiko Kompetensi, atau Risiko Ganda.',
      insight: 'Kalau satu unit kompetensi kritis (K3) belum tuntas remedial, status siswa tertahan apa pun skor lainnya, bukan sekadar rata-rata angka. Mesin ini sudah berjalan penuh.',
    },
    {
      id: 'penempatan-pkl',
      title: 'Penempatan PKL',
      tone: 'live',
      text: 'Profil siswa dicocokkan dengan kriteria industri mitra lewat mesin pencocokan berbasis aturan, lalu diajukan sebagai rekomendasi penempatan.',
      insight: 'Sistem mengusulkan, Kepala Jurusan yang memutuskan, bisa menerima, mengubah, atau menunda. Alur pengambilan keputusan ini sudah berjalan penuh.',
    },
    {
      id: 'validasi-industri',
      title: 'Validasi Industri',
      tone: 'building',
      text: 'Selama empat bulan PKL, pembimbing industri menilai siswa lewat lima kategori yang sama: kedisiplinan, inisiatif, adaptasi, kerja sama, dan kompetensi keahlian, dilengkapi hasil Uji Kompetensi Keahlian.',
      insight: 'Formulir evaluasi dan peringatan dini otomatis ke guru saat performa turun sedang dibangun, ditargetkan siap sebelum siklus PKL pertama selesai.',
    },
    {
      id: 'penempatan-kerja',
      title: 'Penempatan Kerja',
      tone: 'vision',
      text: 'Profil yang sudah tervalidasi membuka tiga jalur: rekrutmen langsung dari mitra PKL, penemuan talenta oleh industri non-mitra, atau siswa mencari kerja mandiri dengan profil terverifikasi di tangan.',
      insight: 'Hasil penempatan mengalir balik lewat dua sinyal: mengkalibrasi ulang ambang skor di langkah dua, dan memetakan kebutuhan industri lintas angkatan.',
    },
  ],
};