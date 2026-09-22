// Port ESM dari utils/ambang-status-unit.js (backend). Isi fungsi tidak diubah.

export const AMBANG_STATUS_UNIT = {
  kompetensi_inti: { kritis_max: 45, lemah_max: 75, override_gate2a: true },
  kompetensi_umum: { kritis_max: 25, lemah_max: 75, override_gate2a: false },
  kompetensi_pilihan: { kritis_max: 25, lemah_max: 75, override_gate2a: false },
};

export const KATEGORI_VALID = Object.keys(AMBANG_STATUS_UNIT);

export function getAmbangKategori(kategori) {
  const ambang = AMBANG_STATUS_UNIT[kategori];
  if (!ambang) {
    throw new Error(
      `Kategori unit SKKNI tidak dikenali: "${kategori}". Kategori valid: ${KATEGORI_VALID.join(', ')}.`,
    );
  }
  return ambang;
}

export function getStatusUnit(kategori, ketercapaianUnit) {
  const { kritis_max, lemah_max } = getAmbangKategori(kategori);
  if (ketercapaianUnit < kritis_max) return 'KRITIS';
  if (ketercapaianUnit < lemah_max) return 'LEMAH';
  return 'MEMENUHI';
}

export function isOverrideTrigger(kategori, statusUnit) {
  const { override_gate2a } = getAmbangKategori(kategori);
  return override_gate2a && statusUnit === 'KRITIS';
}

export const BOBOT_KATEGORI_KOMPETENSI = {
  kompetensi_inti: 0.7,
  kompetensi_umum: 0.2,
  kompetensi_pilihan: 0.1,
};

export function hitungCompetencyScoreKomposit(rataRataPerKategori) {
  let totalBobot = 0;
  let totalTertimbang = 0;

  for (const kategori of Object.keys(BOBOT_KATEGORI_KOMPETENSI)) {
    const nilai = rataRataPerKategori[kategori];
    if (nilai === null || nilai === undefined) continue;

    const bobot = BOBOT_KATEGORI_KOMPETENSI[kategori];
    totalBobot += bobot;
    totalTertimbang += bobot * nilai;
  }

  if (totalBobot === 0) return null;
  return totalTertimbang / totalBobot;
}