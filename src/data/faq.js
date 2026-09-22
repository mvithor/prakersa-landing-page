import { PATHS } from '@/routes/paths';

// VERIFIKASI: jawaban tentang status fitur harus mengikuti kondisi produk hari ini.
export const faq = {
  title: 'Pertanyaan yang sering kami terima',
  items: [
    {
      question: 'Apakah Prakersa menggantikan penilaian guru?',
      answer:
        'Tidak. Guru tetap menilai seperti biasa lewat observasi dan rubrik. Prakersa hanya meminta guru menandai unit SKKNI pada penilaian itu, lalu menyusunnya menjadi profil kesiapan kerja.',
    },
    {
      question: 'Apakah sekolah harus memakai Abseninaja?',
      answer:
        'Ya. Prakersa adalah modul di atas Abseninaja. Data kehadiran, tugas, dan perizinan yang menjadi dasar dimensi perilaku bersumber dari sana.',
    },
    {
      question: 'Apa yang belum bisa dilakukan Prakersa saat ini?',
      answer:
        'Usulan penempatan bergantung pada riwayat evaluasi industri, sehingga ketepatannya bertambah seiring siklus PKL berjalan, bukan sempurna sejak hari pertama. Pemantauan selama PKL sedang kami kembangkan. Penemuan talenta setelah PKL baru ada di peta jalan.',
    },
    {
      question: 'Siapa yang bisa melihat profil siswa?',
      answer:
        'Akses dibatasi menurut peran. Guru hanya melihat siswa yang diajarnya, Kepala Jurusan melihat jurusannya, dan industri mitra hanya menerima ringkasan profil yang diizinkan sekolah.',
      link: { label: 'Baca kebijakan privasi', to: PATHS.privacy },
    },
    {
      question: 'Bagaimana skema biayanya?',
      answer:
        'Sekolah berlangganan per tahun dengan besaran yang menyesuaikan jumlah siswa. Industri mitra tidak dikenai biaya. Rincian kami sampaikan dalam sesi demo.',
    },
  ],
};
