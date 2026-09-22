# Skill Gap Advisor, situs publik

Situs pemasaran untuk Skill Gap Advisor (SGA), modul kesiapan PKL di atas Abseninaja. Dibangun dengan React 19, Vite 8, dan React Router 7.

Seluruh rancangan, teks, ikon, logo sementara, dan ilustrasi di repositori ini dibuat dari nol untuk SGA. Tidak ada aset, teks, nama, atau slogan milik situs lain di dalamnya. Pola bagiannya (hero, temuan, cara kerja, tab audiens, program pilot, rekam jejak, tanya jawab, ajakan penutup) adalah pola umum landing page dan diisi dengan materi tim sendiri.

## Prasyarat

Node.js `^20.19.0` atau `>=22.12.0` (syarat Vite 8) dan npm 10 ke atas. Pakai Node 24 LTS. Lini Node 20 sudah berakhir masa dukungannya pada 30 April 2026, jadi jangan dijadikan pilihan walaupun 20.19 secara teknis memenuhi syarat.

Periksa versi dengan `node -v` sebelum `npm install`. Pengguna nvm atau fnm cukup menjalankan `nvm install 24` sekali, lalu `nvm use` di folder proyek. Berkas `.nvmrc` sudah menunjuk ke Node 24, dan versi Node lain di komputer yang sama tidak terganggu.

Berkas `.npmrc` berisi `engine-strict=true`. Pada Node yang tidak didukung, `npm install` berhenti dengan galat `EBADENGINE` yang menyebut versi yang diminta dan versi yang terpasang. Jangan hapus baris itu. Penjelasannya ada di bagian Pemecahan masalah.

## Menjalankan

```bash
npm install        # memasang dependensi
npm run dev        # server pengembangan di http://localhost:5173
npm run build      # membangun versi produksi ke folder dist/
npm run preview    # melihat hasil build secara lokal
```

## Ketentuan desain yang dipakai

| Ketentuan | Nilai | Lokasi |
| --- | --- | --- |
| Warna primer | `#5E5CE6` beserta skala 50 sampai 900 | `src/styles/tokens.css` |
| Font primer | Poppins 500 dan 600 (judul, navigasi, tombol, angka) | `src/main.jsx`, `src/styles/tokens.css` |
| Font sekunder | Open Sans 400 dan 600 (teks isi) | `src/main.jsx`, `src/styles/tokens.css` |
| Gaya | CSS Modules per komponen, nilai diambil dari design tokens | `*.module.css` |

Font dipasang lokal lewat `@fontsource`, sehingga situs tidak mengirim permintaan ke server Google Fonts.

## Struktur folder

```text
sga-landing/
├── index.html                  Kerangka HTML, meta SEO dan Open Graph
├── vite.config.js              Konfigurasi Vite, alias "@" ke folder src
├── jsconfig.json               Alias "@" untuk editor
├── .env.example                Contoh variabel lingkungan
├── .npmrc                      engine-strict, menolak instalasi pada Node yang tidak didukung
├── .nvmrc                      Versi Node untuk nvm dan fnm
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx                Titik masuk, impor font dan gaya global
    ├── App.jsx                 Komponen akar
    ├── routes/
    │   ├── paths.js            Satu sumber untuk semua URL dan jangkar
    │   └── AppRoutes.jsx       Peta rute
    ├── layouts/
    │   └── MainLayout/         Kerangka halaman: bilah pengumuman, navbar, isi, footer
    ├── pages/
    │   ├── Home/
    │   │   ├── Home.jsx        Hanya menyusun urutan bagian
    │   │   └── sections/       Satu berkas per bagian beranda
    │   ├── RolePage/           Satu templat untuk /sekolah dan /industri
    │   ├── Demo/               Formulir permintaan demo, hook, dan kolom isian
    │   ├── Privacy/            Kerangka kebijakan privasi (masih draf)
    │   └── NotFound/           Halaman 404
    ├── components/
    │   ├── common/             Komponen dasar: Button, Section, Container, Icon, Logo, dan lain-lain
    │   ├── layout/             Navbar, Footer, AnnouncementBar, SkipLink, ScrollToTop, ScrollManager
    │   └── visuals/            ReadinessMatrix, matriks kesiapan interaktif di hero
    ├── data/                   SELURUH teks dan konten situs
    ├── hooks/                  useScrolled, useDismissible, useDocumentTitle, useMounted
    ├── services/               demoService.js, pengiriman formulir demo
    ├── utils/                  cn, classifyStudent, storage, validators
    └── styles/                 tokens.css, reset.css, global.css
```

### Aturan main

Konten tidak pernah ditulis di dalam komponen. Setiap bagian membaca teksnya dari berkas di `src/data`, sehingga anggota tim yang tidak menulis kode tetap bisa menyunting salinan.

Komponen hanya memakai variabel dari `src/styles/tokens.css`. Nilai warna, ukuran, atau radius mentah tidak boleh muncul di berkas `*.module.css`.

`Section` adalah satu-satunya pengatur jarak vertikal dan warna latar antarbagian. Bagian baru cukup dibungkus `Section` dan tidak perlu mengatur padding sendiri.

Semua tautan internal mengambil alamat dari `src/routes/paths.js`. Perubahan URL dilakukan di satu tempat.

## Mengubah konten

| Yang ingin diubah | Berkas |
| --- | --- |
| Nama situs, kontak, media sosial, badan hukum | `src/data/site.js` |
| Bilah pengumuman di atas navbar | `src/data/announcement.js` |
| Menu navigasi | `src/data/navigation.js` |
| Judul dan ajakan di hero | `src/data/hero.js` |
| Data contoh dan ambang awal matriks | `src/data/matrix.js` |
| Angka temuan riset | `src/data/findings.js` |
| Uraian masalah | `src/data/problem.js` |
| Langkah cara kerja | `src/data/howItWorks.js` |
| Empat profil kesiapan | `src/data/profiles.js` |
| Tab audiens | `src/data/audiences.js` |
| Pembeda | `src/data/differentiators.js` |
| Program pilot | `src/data/pilot.js` |
| Rekam jejak | `src/data/trackRecord.js` |
| Tanya jawab | `src/data/faq.js` |
| Ajakan penutup | `src/data/closingCta.js` |
| Footer | `src/data/footer.js` |
| Halaman /sekolah dan /industri | `src/data/rolePages.js` |
| Label, pilihan, dan pesan formulir demo | `src/data/demoForm.js` |
| Kerangka kebijakan privasi | `src/data/privacy.js` |

Bilah pengumuman yang sudah ditutup pengunjung tidak muncul lagi. Ganti nilai `id` di `announcement.js` setiap kali isinya berubah agar pengumuman baru tetap terlihat.

## Mengubah warna dan font

Warna diubah di `src/styles/tokens.css`. Bila warna primer diganti, perbarui seluruh skala `--color-primary-50` sampai `--color-primary-900`, lalu samakan `theme-color` di `index.html` dan warna di `public/favicon.svg`.

Font diubah di dua tempat. Impor berkas font ada di `src/main.jsx`, sedangkan nama keluarga font ada di variabel `--font-display` dan `--font-body` di `tokens.css`. Hanya bobot yang diimpor yang tersedia, jadi menambah bobot baru berarti menambah satu baris impor.

## Menambah halaman peran baru

Tambahkan satu entri di `src/data/rolePages.js` dengan bentuk yang sama seperti `school` atau `industry`, tambahkan alamatnya di `src/routes/paths.js`, lalu daftarkan satu rute di `src/routes/AppRoutes.jsx`.

```jsx
<Route path={PATHS.teacher} element={<RolePage key="teacher" roleKey="teacher" />} />
```

Templat `pages/RolePage` tidak perlu disentuh.

## Menyambungkan formulir demo

Formulir saat ini berjalan dalam mode simulasi dan tidak mengirim data ke mana pun. Untuk menyambungkannya, salin `.env.example` menjadi `.env`, isi `VITE_DEMO_ENDPOINT` dengan alamat endpoint backend, lalu bangun ulang. Endpoint menerima `POST` berisi JSON. Logika pengiriman ada di `src/services/demoService.js`, validasi di `src/utils/validators.js`.

Formulir ini mengumpulkan data pribadi (nama, surel, nomor telepon). Jangan aktifkan endpoint sebelum kebijakan privasi selesai dan tempat penyimpanan datanya jelas.

## Mengganti gambar pengganti dan logo

Setiap kotak abu bergaris dengan tulisan "Ganti dengan ..." berasal dari komponen `PlaceholderFigure`. Simpan gambar milik tim di `src/assets/`, lalu ganti pemanggilan `PlaceholderFigure` di bagian terkait dengan `<img>` yang memiliki `alt`, `width`, dan `height`.

Logo di `src/components/common/Logo.jsx` dan `public/favicon.svg` adalah logo sementara. Ganti keduanya dengan logo resmi dari tim desain.

Pakai hanya aset yang haknya dimiliki tim, yaitu tangkapan layar produk sendiri, foto kegiatan sendiri dengan izin orang yang tampak di dalamnya, atau gambar berlisensi bebas yang lisensinya dicatat.

## Wajib diverifikasi sebelum tayang

Setiap klaim yang belum dipastikan diberi komentar `VERIFIKASI` di `src/data`. Jalankan `grep -rn "VERIFIKASI" src` untuk melihat semuanya.

- [ ] **Status produk.** Hero, cara kerja, dan halaman peran memakai kalimat kala kini seolah produk sudah berjalan. Dokumen tim belum sepakat soal ini: satu catatan menyebut enam modul inti berjalan di staging, sedangkan Proposal Tahap 3 menyebut SGA masih di tahap desain dengan kode dimulai Agustus 2026. Tetapkan satu versi yang bisa dibuktikan lewat demo, lalu samakan `hero.js`, `howItWorks.js`, `rolePages.js`, dan `faq.js` dengan versi itu.
- [ ] **Ukuran sampel.** Kolom `sample` di `findings.js` masih kosong. Angka 61,1% tanpa n menyesatkan, dan nilainya cocok dengan 11 dari 18 responden. Isi n yang sebenarnya dari dokumen referensi riset.
- [ ] **Angka 19 institusi dan 5 wilayah** di `trackRecord.js` belum dicocokkan dengan dokumen referensi riset.
- [ ] **Keterwakilan data.** Survei condong ke sekolah negeri, sedangkan sasaran awal adalah sekolah swasta. Jangan menulis temuan seolah mewakili seluruh SMK.
- [ ] **Angka Abseninaja bukan angka SGA.** Angka 2.000 lebih pengguna aktif di `hero.js` dan `trackRecord.js` sudah diberi keterangan. Jangan hapus keterangan itu.
- [ ] **Program pilot.** Kuota 5 sekolah, terisi 0, daftar manfaat, syarat, dan kalimat "Program pilot untuk SMK sedang dibuka" di `pilot.js` dan `announcement.js` adalah usulan, bukan keputusan tim. Matikan bilah pengumuman (`enabled: false`) sampai program itu benar-benar ada.
- [ ] **Skema biaya** di `faq.js` harus sama dengan model keuangan yang sudah diaudit tim.
- [ ] **Nama dan logo pihak lain.** Jangan mencantumkan nama sekolah atau logo mitra tanpa izin tertulis. Jangan menyiratkan dukungan Bank Indonesia, OJK, atau AFTECH. Status peserta hackathon bukan dukungan lembaga.
- [ ] **Kepatuhan UU PDP.** Situs tidak boleh mengklaim patuh. Halaman `/kebijakan-privasi` masih kerangka berlabel draf dan harus diisi bersama penasihat hukum, terutama soal persetujuan orang tua atau wali karena sebagian besar subjek data adalah anak.
- [ ] **Kontak.** `site.js` masih berisi `halo@example.com`. Kolom yang dikosongkan otomatis tidak ditampilkan di footer.
- [ ] **Badan hukum.** `legalEntity` di `site.js` diisi hanya bila badan hukumnya sudah ada.

## Deploy ke VPS dengan Nginx

Situs ini aplikasi satu halaman dengan rute di sisi klien. Server harus mengembalikan `index.html` untuk semua alamat yang bukan berkas, kalau tidak `/sekolah` atau `/demo` akan menghasilkan 404 saat dimuat ulang.

```nginx
server {
    listen 80;
    server_name contoh-domain.id;
    root /var/www/sga-landing/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Jalankan `npm run build`, unggah isi folder `dist/` ke `root` di atas, lalu pasang HTTPS (misalnya dengan Certbot) sebelum domain diumumkan.

## Pemecahan masalah

### `Error: Cannot find native binding` saat `npm run dev` atau `npm run build`

Penyebabnya versi Node di bawah syarat, bukan bug npm seperti yang tertulis di pesan galat itu. Vite 8 memakai Rolldown, yang membutuhkan paket native per platform, misalnya `@rolldown/binding-darwin-arm64` di Mac Apple Silicon. Paket itu berstatus dependensi opsional dan mensyaratkan Node `^20.19.0 || >=22.12.0`. Pada Node yang lebih lama, npm melewati dependensi opsional yang syarat `engines`-nya tidak cocok tanpa pesan apa pun, sehingga instalasi terlihat berhasil padahal binding tidak pernah terpasang.

Pesan galat menyarankan menghapus `package-lock.json` dan `node_modules` lalu memasang ulang. Saran itu tidak menyelesaikan masalah ini. Hasil reproduksi pada Node 20.13.1 menunjukkan galat yang sama muncul lagi, dan `package-lock.json` proyek ini sudah memuat binding untuk semua platform sehingga tidak perlu dihapus.

Perbaikannya adalah menaikkan Node, lalu memasang ulang dependensi.

```bash
node -v              # harus 24.x, atau minimal 20.19 / 22.12
rm -rf node_modules
npm install
npm run dev
```

### `npm error code EBADENGINE` saat `npm install`

Itu pengaman yang sengaja dipasang lewat `.npmrc`. Naikkan Node seperti di atas. Mematikan `engine-strict` hanya memindahkan kegagalan ke tahap berikutnya dengan pesan yang lebih membingungkan.

## Yang sudah dan belum diuji

Sudah diuji: instalasi dari nol dan `npm run build` pada Node 22 dan Node 24 di Linux x64, serta perilaku gagal cepat pada Node 20.13.1. Belum pernah diuji di macOS maupun Windows. `package-lock.json` memuat binding native untuk kedua sistem itu, tetapi instalasinya di sana belum pernah dijalankan oleh pembuat proyek ini.

`npm run build` berhasil tanpa peringatan, dan keenam rute (`/`, `/sekolah`, `/industri`, `/demo`, `/kebijakan-privasi`, serta alamat yang tidak ada) dirender di sisi server tanpa galat, tanpa nilai `undefined`, tanpa tautan kosong, dan tanpa `id` ganda.

Belum diuji: tampilan visual di peramban. Lingkungan pembuatannya tidak memiliki peramban, sehingga tata letak, jarak, tampilan seluler, dan animasi matriks belum pernah dilihat mata. Periksa di Chrome, Safari, dan satu ponsel Android sebelum tayang, termasuk navigasi dengan papan ketik dan mode gerak dikurangi (`prefers-reduced-motion`).
