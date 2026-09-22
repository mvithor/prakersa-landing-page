import { PATHS } from '@/routes/paths';

export const audiences = {
  title: 'Untuk siapa Prakersa dibangun',
  lead: 'Sekolah butuh percaya diri menempatkan siswa. Industri butuh siswa yang sudah punya gambaran diri sebelum masuk. Pemerintah butuh data kesiapan kerja yang bisa dipercaya, bukan survei yang jarang dijawab. Ketiganya dilayani dari satu sumber data yang sama.',

  items: [
    {
      key: 'sekolah',
      label: 'Untuk Sekolah',
      headline: 'Lihat kesiapan siswa sebelum PKL, bukan setelah masalah terjadi',
      points: [
        'Profil kesiapan kerja per siswa sejak kelas 10, bukan catatan kehadiran dan nilai yang berhenti jadi arsip.',
        'Sinyal masalah tertangkap di minggu pertama PKL, bukan di laporan akhir bulan (Sedang dibangun).',
        'Kepala Jurusan tetap yang memutuskan penempatan, sistem hanya merekomendasikan.',
        // Poin baru: BKK disapai lewat beban kerjanya sendiri, bukan tab terpisah.
        'BKK tidak lagi mengandalkan survei manual yang jarang dijawab untuk melapor ke Dinas, datanya sudah terkumpul sejak siswa masih di sekolah.',
      ],
      cta: { label: 'Ajukan demo sekolah', to: PATHS.demo },
    },
    {
      key: 'industri',
      label: 'Untuk Industri',
      headline: 'Terima siswa magang dengan profil, bukan tebakan',
      points: [
        '5 dari 5 industri yang kami wawancarai di Makassar menerima siswa PKL tanpa profil apa pun sebelumnya.',
        'Evaluasi pembimbing industri cukup diisi 5 menit, langsung memperbarui profil siswa (Sedang dibangun).',
        'Profil terverifikasi menggabungkan dua tahun data sekolah, empat bulan evaluasi langsung, dan hasil UKK (Visi).',
      ],
      cta: { label: 'Saya dari industri mitra', to: PATHS.industry },
    },
    {
      key: 'pemerintah',
      label: 'Untuk Pemerintah',
      headline: 'Data kesiapan kerja yang bisa dipertanggungjawabkan, bukan survei yang jarang dijawab',
      points: [
        'Tracer study manual saat ini gagal di titik paling dasar, satu sekolah cuma dapat 15 respons dari ratusan lulusan lewat Google Form.',
        'Profil terverifikasi dari siklus PKL bisa jadi dasar pelaporan yang lebih bisa dipercaya daripada survei sukarela pasca-lulus (Visi).',
        'Pola gap kompetensi lintas angkatan bisa jadi sinyal kebutuhan industri untuk perencanaan kurikulum vokasi (Visi).',
      ],
      // PLACEHOLDER, lihat catatan di bawah kode. Jangan tayang sebelum ini diganti nyata.
      cta: { label: 'Diskusikan kolaborasi data', to: 'mailto:GANTI@domain-kalian.id?subject=Diskusi%20kolaborasi%20data' },
    },
  ],
};