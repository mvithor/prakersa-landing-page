// Engine pencocokan industri untuk demo. Alur mengikuti diagram Matching Engine:
// Step 0 kelayakan, Step 1 filter, Step 2 skor, Step 2.5 keyakinan, Step 3 flag,
// Step 4 urutan. Fungsi skor ada di pklScoring.js.

import { scoreIndustriUntukSiswa, DEFAULT_WEIGHTS, LABEL_KRITERIA_KALIMAT } from './pklScoring';
import { RANK_MODE, AMBANG_PERINGATAN_TRACK } from './konstanta';
import { isKlasifikasi } from './profile';

const URUTAN_KEYAKINAN = { TINGGI: 0, SEDANG: 1, RENDAH: 2 };

// Step 0
export function evaluasiKelayakan(profil) {
  if (!isKlasifikasi(profil.statusProfil)) {
    return {
      ok: false,
      kode: 'DATA_BELUM_CUKUP',
      pesan: 'Belum bisa dicocokkan: data siswa belum cukup untuk menyimpulkan profil.',
    };
  }
  const gagalK3 = profil.kompetensi.unit.find((u) => u.sebab === 'GAGAL_K3');
  if (gagalK3) {
    return {
      ok: false,
      kode: 'GAGAL_K3',
      pesan: `Belum bisa diproses PKL: unit "${gagalK3.judul}" belum tuntas syarat keselamatan kerja.`,
    };
  }
  return { ok: true };
}

// Step 1
export function filterIndustri(daftar, siswa) {
  const lolos = [];
  const tersingkir = [];
  for (const industri of daftar) {
    if (!industri.aktif) tersingkir.push({ industri, alasan: 'Status nonaktif' });
    else if (!industri.jurusan.includes(siswa.jurusan)) tersingkir.push({ industri, alasan: 'Jurusan tidak diterima' });
    else if (industri.terisi >= industri.kapasitas) tersingkir.push({ industri, alasan: 'Kapasitas periode ini penuh' });
    else lolos.push(industri);
  }
  return { lolos, tersingkir };
}

function bandingkan(a, b, mode) {
  if (mode === 'keyakinan-dulu') {
    const d = URUTAN_KEYAKINAN[a.confidence.level] - URUTAN_KEYAKINAN[b.confidence.level];
    if (d !== 0) return d;
  }
  if (b.match_score !== a.match_score) return b.match_score - a.match_score;
  return a.industri.nama.localeCompare(b.industri.nama);
}

// lens: kuadran yang dipakai untuk bobot dan track record. Default = profil siswa sendiri.
export function cocokkanIndustri({ siswa, profil, daftarIndustri, lens, mode = RANK_MODE }) {
  const kelayakan = evaluasiKelayakan(profil);
  if (!kelayakan.ok) return { status: 'BLOKIR', kelayakan };

  const kuadran = lens || profil.statusProfil;
  const bobotKuadran = DEFAULT_WEIGHTS[kuadran];
  const { lolos, tersingkir } = filterIndustri(daftarIndustri, siswa);

  const skorUnit = Object.fromEntries(
    profil.kompetensi.unit.filter((u) => u.skor !== null).map((u) => [u.kode, u.skor]),
  );

  const hasil = lolos.map((industri) => {
    const skorUnitDilatih = industri.unitDilatih.map((k) => skorUnit[k]).filter((v) => v !== undefined);
    const skor = scoreIndustriUntukSiswa({
      industri,
      unitLemahKode: profil.unitLemahKode,
      unitDilatihKode: industri.unitDilatih,
      skorUnitDilatih,
      trackRecordNilai: industri.trackRecord ? industri.trackRecord.nilai : null,
      trackRecordN: industri.trackRecord ? industri.trackRecord.n : null,
      kuadranSiswa: kuadran,
      bobotKuadran,
      evaluatorAktif: industri.evaluatorAktif,
    });

    // Step 3: dua flag independen, satu kandidat bisa kena keduanya.
    const flags = [];
    const tr = skor.breakdown.find((b) => b.key === 'trackRecord');
    if (tr.available && tr.value < AMBANG_PERINGATAN_TRACK) {
      flags.push({ kode: 'RIWAYAT_KURANG_BAIK', teks: 'Riwayat kurang baik untuk profil serupa' });
    }
    if (skor.confidence.level === 'RENDAH') {
      const tersisa = skor.breakdown.filter((b) => b.available).map((b) => LABEL_KRITERIA_KALIMAT[b.key]);
      flags.push({
        kode: 'DATA_TERBATAS',
        teks: `Data industri masih terbatas, rekomendasi terutama berdasarkan ${tersisa.join(' dan ')}`,
      });
    }
    return { industri, ...skor, flags };
  });

  const urutan = hasil
    .sort((a, b) => bandingkan(a, b, mode))
    .map((h, i) => ({ ...h, peringkat: i + 1, rekomendasi: i < 3 }));

  return { status: 'OK', kuadran, mode, bobotKuadran, urutan, tersingkir, jumlahIndustri: daftarIndustri.length };
}

// ---------------------------------------------------------------------------
// Arah balik: untuk SATU industri, jalankan skor yang sama terhadap beberapa
// siswa contoh (biasanya satu per kuadran). Dipakai demo sisi industri.
// Sengaja tidak melalui evaluasiKelayakan atau filterIndustri, karena daftar
// siswa contoh di sini sudah dipastikan valid oleh pemanggilnya (arketipe
// terklasifikasi, tidak gagal K3). Fungsi skornya (scoreIndustriUntukSiswa)
// sama persis dengan yang dipakai cocokkanIndustri, cuma arah pemanggilannya
// dibalik: di sana industri banyak dicoba untuk satu siswa, di sini siswa
// banyak dicoba untuk satu industri.
export function cocokkanMitraTerhadapSiswaContoh(industri, daftarSiswaContoh) {
  return daftarSiswaContoh.map(({ siswa, profil }) => {
    const kuadran = profil.statusProfil;
    const bobotKuadran = DEFAULT_WEIGHTS[kuadran];
    const skorUnit = Object.fromEntries(
      profil.kompetensi.unit.filter((u) => u.skor !== null).map((u) => [u.kode, u.skor]),
    );
    const skorUnitDilatih = industri.unitDilatih.map((k) => skorUnit[k]).filter((v) => v !== undefined);
    const skor = scoreIndustriUntukSiswa({
      industri,
      unitLemahKode: profil.unitLemahKode,
      unitDilatihKode: industri.unitDilatih,
      skorUnitDilatih,
      trackRecordNilai: industri.trackRecord ? industri.trackRecord.nilai : null,
      trackRecordN: industri.trackRecord ? industri.trackRecord.n : null,
      kuadranSiswa: kuadran,
      bobotKuadran,
      evaluatorAktif: industri.evaluatorAktif,
    });

    const flags = [];
    const tr = skor.breakdown.find((b) => b.key === 'trackRecord');
    if (tr.available && tr.value < AMBANG_PERINGATAN_TRACK) {
      flags.push({ kode: 'RIWAYAT_KURANG_BAIK', teks: 'Riwayat kurang baik untuk profil serupa' });
    }
    if (skor.confidence.level === 'RENDAH') {
      const tersisa = skor.breakdown.filter((b) => b.available).map((b) => LABEL_KRITERIA_KALIMAT[b.key]);
      flags.push({
        kode: 'DATA_TERBATAS',
        teks: tersisa.length
          ? `Data masih terbatas, rekomendasi terutama berdasarkan ${tersisa.join(' dan ')}`
          : 'Data masih sangat terbatas',
      });
    }

    return { siswa, profil, kuadran, ...skor, flags };
  });
}

// Simulasi murni, tidak pernah mengubah fixture asli: mengembalikan SALINAN
// industri dengan satu evaluasi magang buruk ditambahkan ke riwayatnya,
// seolah satu siswa baru saja dipulangkan. Dipakai demo sisi industri untuk
// menunjukkan kalibrasi ulang sebagai perilaku sistem, bukan cuma teks.
export function terapkanSimulasiDipulangkan(industri, kuadranBuruk = 'RG', nilaiBuruk = 2) {
  const evalLama = industri.evaluasiMagang || { n: 0, kedisiplinan: null, supervisor: null, mentoring: null };
  const nBaru = evalLama.n + 1;
  const gabungEval = (lama) =>
    Math.round((((lama ?? nilaiBuruk) * evalLama.n + nilaiBuruk) / nBaru) * 10) / 10;

  const trLama = industri.trackRecord || { nilai: {}, n: {} };
  const trNLama = trLama.n[kuadranBuruk] || 0;
  const trNilaiLama = trLama.nilai[kuadranBuruk] ?? nilaiBuruk * 10;
  const trNBaru = trNLama + 1;
  const trNilaiBaru = Math.round(((trNilaiLama * trNLama + nilaiBuruk * 10) / trNBaru) * 10) / 10;

  return {
    ...industri,
    evaluasiMagang: {
      n: nBaru,
      kedisiplinan: gabungEval(evalLama.kedisiplinan),
      supervisor: gabungEval(evalLama.supervisor),
      mentoring: gabungEval(evalLama.mentoring),
    },
    trackRecord: {
      nilai: { ...trLama.nilai, [kuadranBuruk]: trNilaiBaru },
      n: { ...trLama.n, [kuadranBuruk]: trNBaru },
    },
  };
}