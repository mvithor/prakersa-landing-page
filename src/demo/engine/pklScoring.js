// Port ESM dari services/pkl-scoring-service.js (backend).
// hitungMatchScore dan computeConfidence identik dengan backend.
// Deviasi yang disengaja (semuanya ditandai DEVIASI):
//  1. hitungNilaiKriteria: fallback "fit" untuk relevansi SKKNI (lihat konstanta.js).
//  2. hitungNilaiKriteria: extra trackRecord membawa jumlah sampel (n) untuk ditampilkan.
//  3. generateReasons: ditulis ulang. Versi backend selalu menulis "tinggi" dan
//     "berpengalaman" tanpa melihat nilainya, dan menyebut "bobot terbesar"
//     untuk kriteria yang bukan bobot terbesar profil tersebut.
//  4. hitungNilaiKriteria: kedisiplinan, supervisor, dan mentoring TIDAK LAGI dibaca
//     dari isian mandiri industri (kedisiplinan_input dkk). Sumbernya sekarang
//     evaluasiMagang, rata-rata dari evaluasi siswa yang pernah magang di situ, dan
//     dikunci gerbang jumlah sampel yang sama seperti trackRecord (MIN_SAMPEL_TRACK).
//     Industri tidak bisa lagi menaikkan skornya sendiri lewat isian formulir, karena
//     juri PIDI menandai isian mandiri sebagai sumber bias, semua industri cenderung
//     menilai dirinya tinggi. Industri baru tanpa riwayat magang sama sekali akan
//     tampil "belum ada data" pada ketiga kriteria ini, bukan angka default.

import { MIN_SAMPEL_TRACK, SKKNI_FALLBACK_FIT } from './konstanta';

export const CRITERIA_KEYS = ['kedisiplinan', 'supervisor', 'mentoring', 'skkni', 'trackRecord'];

export const LABEL_KUADRAN = {
  SP: 'Siap Penuh',
  RB: 'Risiko Behavior',
  RK: 'Risiko Kompetensi',
  RG: 'Risiko Ganda',
};

export const LABEL_KRITERIA = {
  kedisiplinan: 'Kedisiplinan',
  supervisor: 'Pengalaman supervisor',
  mentoring: 'Kemauan membimbing teknis',
  skkni: 'Relevansi unit SKKNI',
  trackRecord: 'Track record profil serupa',
};

// Bentuk untuk dipakai di tengah kalimat (singkatan tetap huruf besar).
export const LABEL_KRITERIA_KALIMAT = {
  kedisiplinan: 'kedisiplinan',
  supervisor: 'pengalaman supervisor',
  mentoring: 'kemauan membimbing teknis',
  skkni: 'relevansi unit SKKNI',
  trackRecord: 'track record profil serupa',
};

// Bobot default GLOBAL, cermin seed migrasi backend.
export const DEFAULT_WEIGHTS = {
  SP: { kedisiplinan: 0.1, supervisor: 0.2, mentoring: 0.1, skkni: 0.35, trackRecord: 0.25 },
  RB: { kedisiplinan: 0.4, supervisor: 0.3, mentoring: 0.1, skkni: 0.1, trackRecord: 0.1 },
  RK: { kedisiplinan: 0.1, supervisor: 0.1, mentoring: 0.3, skkni: 0.4, trackRecord: 0.1 },
  RG: { kedisiplinan: 0.25, supervisor: 0.3, mentoring: 0.15, skkni: 0.2, trackRecord: 0.1 },
};

const roundHalfUp = (x) => Math.round(x);
export const bintang = (nilai) => Math.round(nilai / 20);

export function hitungNilaiKriteria({
  industri,
  unitLemahKode = [],
  unitDilatihKode = [],
  skorUnitDilatih = [],
  trackRecordNilai = null,
  trackRecordN = null,
  kuadranSiswa,
}) {
  const slider = (v) => (v === null || v === undefined ? null : Number(v) * 20);

  let skkniValue = null;
  let skkniExtra = { mode: 'coverage', n: 0, m: unitLemahKode.length };
  if (unitLemahKode.length > 0) {
    const setDilatih = new Set(unitDilatihKode);
    const overlap = unitLemahKode.filter((k) => setDilatih.has(k)).length;
    skkniValue = (overlap / unitLemahKode.length) * 100;
    skkniExtra = { mode: 'coverage', n: overlap, m: unitLemahKode.length };
  } else if (SKKNI_FALLBACK_FIT && skorUnitDilatih.length > 0) {
    // DEVIASI 1
    skkniValue = skorUnitDilatih.reduce((a, b) => a + b, 0) / skorUnitDilatih.length;
    skkniExtra = { mode: 'fit', n: skorUnitDilatih.length, m: skorUnitDilatih.length };
  }

  let trValue = null;
  const trN = trackRecordN ? Number(trackRecordN[kuadranSiswa] ?? 0) : 0;
  if (trackRecordNilai && trN >= MIN_SAMPEL_TRACK) {
    const v = trackRecordNilai[kuadranSiswa];
    trValue = v === null || v === undefined ? null : Number(v);
  }

  // DEVIASI 4. evaluasiMagang.n adalah jumlah evaluasi magang total di industri ini,
  // lintas semua profil siswa, karena kedisiplinan/supervisor/mentoring adalah sifat
  // tempat kerja itu sendiri, bukan sifat yang berbeda per kuadran siswa seperti
  // trackRecord. Di bawah ambang sampel, ketiganya tidak tersedia sama sekali.
  const evalMagang = industri.evaluasiMagang || null;
  const evalN = evalMagang ? Number(evalMagang.n || 0) : 0;
  const evalCukup = evalN >= MIN_SAMPEL_TRACK;
  const nilaiEval = (kunci) => (evalCukup ? slider(evalMagang[kunci]) : null);

  const mk = (key, value, extra) => ({ key, value, available: value !== null, extra: extra || null });

  return [
    mk('kedisiplinan', nilaiEval('kedisiplinan'), { n: evalN }),
    mk('supervisor', nilaiEval('supervisor'), { n: evalN }),
    mk('mentoring', nilaiEval('mentoring'), { n: evalN }),
    mk('skkni', skkniValue, skkniExtra),
    mk('trackRecord', trValue, { nilai: trValue, n: trN }), // DEVIASI 2
  ];
}

export function hitungMatchScore(nilaiKriteria, bobotKuadran, evaluatorAktif) {
  const tersedia = nilaiKriteria.filter((k) => k.available);
  const sumW = tersedia.reduce((acc, k) => acc + Number(bobotKuadran[k.key] || 0), 0);

  const breakdown = nilaiKriteria.map((k) => {
    const bobot = Number(bobotKuadran[k.key] || 0);
    const bobotNormal = k.available && sumW > 0 ? bobot / sumW : 0;
    const kontribusi = k.available && k.value !== null ? bobotNormal * k.value : 0;
    return {
      key: k.key,
      value: k.available ? Math.round(k.value * 10) / 10 : null,
      available: k.available,
      bobot,
      bobot_normal: Math.round(bobotNormal * 1000) / 1000,
      kontribusi,
      extra: k.extra,
    };
  });

  const totalTertimbang = breakdown.reduce((acc, b) => acc + b.kontribusi, 0);
  const skorDasar = sumW > 0 ? roundHalfUp(totalTertimbang) : null;
  const bonus = evaluatorAktif ? 5 : 0;
  const matchScore = skorDasar === null ? null : Math.min(100, skorDasar + bonus);

  return { skorDasar, bonus, matchScore, breakdown };
}

export function computeConfidence(nilaiKriteria, bobotKuadran) {
  const totalBobotAsli = CRITERIA_KEYS.reduce((acc, key) => acc + Number(bobotKuadran[key] || 0), 0);
  const bobotTersedia = nilaiKriteria
    .filter((k) => k.available)
    .reduce((acc, k) => acc + Number(bobotKuadran[k.key] || 0), 0);
  const persen = totalBobotAsli > 0 ? (bobotTersedia / totalBobotAsli) * 100 : 0;
  let level = 'RENDAH';
  if (persen >= 70) level = 'TINGGI';
  else if (persen >= 40) level = 'SEDANG';
  return { level, persen: Math.round(persen) };
}

export function kualifikasiTrackRecord(nilai) {
  if (nilai >= 80) return 'baik';
  if (nilai >= 60) return 'memadai';
  return 'perlu perhatian';
}

const tingkat = (v) => (v >= 4 ? 'tinggi' : v === 3 ? 'sedang' : 'rendah');
const toneSkala = (v) => (v >= 4 ? 'plus' : v === 3 ? 'netral' : 'minus');

// DEVIASI 3. Mengembalikan { tone, text } supaya UI bisa menandai alasan positif,
// netral, atau negatif. Tiga kontribusi tertinggi, sama seperti backend.
export function generateReasons(breakdown, kuadranSiswa, bobotKuadran) {
  const tersedia = breakdown.filter((b) => b.available && b.value !== null);
  const top3 = [...tersedia].sort((a, b) => b.kontribusi - a.kontribusi).slice(0, 3);
  const kunciTerbesar = CRITERIA_KEYS.reduce(
    (maks, k) => (bobotKuadran[k] > bobotKuadran[maks] ? k : maks),
    CRITERIA_KEYS[0],
  );

  return top3.map((b) => {
    const skala = bintang(b.value);
    switch (b.key) {
      case 'kedisiplinan':
        return {
          tone: toneSkala(skala),
          text: `Kedisiplinan ${tingkat(skala)} (${skala}/5) dari ${b.extra?.n ?? 0} evaluasi magang${
            kunciTerbesar === 'kedisiplinan' ? `, faktor bobot terbesar untuk ${LABEL_KUADRAN[kuadranSiswa]}` : ''
          }`,
        };
      case 'supervisor':
        return {
          tone: toneSkala(skala),
          text:
            skala >= 4
              ? `Supervisor berpengalaman (${skala}/5) menurut ${b.extra?.n ?? 0} evaluasi magang sebelumnya`
              : `Pengalaman supervisor ${tingkat(skala)} (${skala}/5) dari ${b.extra?.n ?? 0} evaluasi magang`,
        };
      case 'mentoring':
        return {
          tone: toneSkala(skala),
          text: `Kemauan membimbing teknis ${tingkat(skala)} (${skala}/5) dari ${b.extra?.n ?? 0} evaluasi magang`,
        };
      case 'skkni': {
        const { mode, n, m } = b.extra || {};
        if (mode === 'fit') {
          return {
            tone: b.value >= 75 ? 'plus' : 'netral',
            text: `Siswa kuat pada ${n} unit yang dilatih di sini (rata-rata ${Math.round(b.value)})`,
          };
        }
        return {
          tone: n === m ? 'plus' : n === 0 ? 'minus' : 'netral',
          text: `Unit SKKNI: ${n} dari ${m} unit lemah siswa dilatih di sini`,
        };
      }
      case 'trackRecord':
        return {
          tone: b.value >= 80 ? 'plus' : b.value >= 60 ? 'netral' : 'minus',
          text: `Track record: ${Math.round(b.value)}% siswa profil serupa berhasil, ${kualifikasiTrackRecord(
            b.value,
          )} (${b.extra?.n ?? 0} siswa)`,
        };
      default:
        return null;
    }
  }).filter(Boolean);
}

export function scoreIndustriUntukSiswa(params) {
  const { bobotKuadran, evaluatorAktif, kuadranSiswa } = params;
  const nilaiKriteria = hitungNilaiKriteria(params);
  const skor = hitungMatchScore(nilaiKriteria, bobotKuadran, evaluatorAktif);
  const confidence = computeConfidence(nilaiKriteria, bobotKuadran);
  const reasons = skor.matchScore === null ? [] : generateReasons(skor.breakdown, kuadranSiswa, bobotKuadran);
  return {
    match_score: skor.matchScore,
    skor_dasar: skor.skorDasar,
    bonus: skor.bonus,
    confidence,
    reasons,
    breakdown: skor.breakdown,
  };
}