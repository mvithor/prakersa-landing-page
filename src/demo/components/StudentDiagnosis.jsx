import styles from './Demo.module.css';
import { ProfilBadge, StatusUnitBadge, fmt } from './shared';
import { KOMPONEN_KEYS, LABEL_KOMPONEN, AMBANG_KRITIS_DEFAULT } from '../engine/konstanta';

const URUT_STATUS = { KRITIS: 0, LEMAH: 1, MEMENUHI: 2 };

function TrendMini({ periods, ambang }) {
  const W = 480;
  const H = 176;
  const ML = 28;
  const MR = 26;
  const MT = 10;
  const MB = 30;
  const PW = W - ML - MR;
  const PH = H - MT - MB;
  const x = (i) => ML + (periods.length === 1 ? PW / 2 : (i / (periods.length - 1)) * PW);
  const y = (v) => MT + (1 - (Math.max(20, Math.min(100, v)) - 20) / 80) * PH;

  const jalur = (kunci) => {
    let d = '';
    let buka = false;
    periods.forEach((p, i) => {
      if (p[kunci] === null) {
        buka = false;
        return;
      }
      d += `${buka ? 'L' : 'M'}${x(i).toFixed(1)} ${y(p[kunci]).toFixed(1)} `;
      buka = true;
    });
    return d.trim();
  };

  return (
    <div>
      <svg className={styles.trend} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Tren skor perilaku dan kompetensi per semester">
        {[20, 40, 60, 80, 100].map((t) => (
          <g key={t}>
            <line x1={ML} x2={W - MR} y1={y(t)} y2={y(t)} className={styles.tAxis} />
            <text x={ML - 4} y={y(t) + 3} textAnchor="end" className={styles.tText}>
              {t}
            </text>
          </g>
        ))}
        <line x1={ML} x2={W - MR} y1={y(ambang.perilaku)} y2={y(ambang.perilaku)} className={styles.tThr} />
        {ambang.kompetensi !== ambang.perilaku && (
          <line x1={ML} x2={W - MR} y1={y(ambang.kompetensi)} y2={y(ambang.kompetensi)} className={styles.tThr} />
        )}
        {periods.map((p, i) => (
          <text key={p.label} x={x(i)} y={H - 8} textAnchor="middle" className={styles.tText}>
            {p.label}
          </text>
        ))}
        <path d={jalur('perilaku')} className={styles.tCurvP} />
        <path d={jalur('kompetensi')} className={styles.tCurvK} />
      </svg>
      <div className={styles.trendLegend}>
        <span className={styles.lgP}>Perilaku</span>
        <span className={styles.lgK}>Kompetensi</span>
        <span style={{ color: 'inherit' }}>Garis putus-putus: ambang</span>
      </div>
    </div>
  );
}

function SkorKartu({ label, dimensi, ambang, sumber }) {
  const { sufficient, cumulative, status, alasan } = dimensi;
  if (!sufficient) {
    return (
      <div>
        <div className={styles.scoreLabel}>{label}</div>
        <div className={styles.scoreValue}>
          <small>Belum bisa disimpulkan</small>
        </div>
        <p className={`${styles.small} ${styles.muted}`}>{alasan}</p>
      </div>
    );
  }
  const persen = Math.max(0, Math.min(100, cumulative));
  const baik = status === 'BAIK';
  const tertahan = Boolean(dimensi.overridden) && cumulative >= ambang;
  const warna = baik ? '' : cumulative < AMBANG_KRITIS_DEFAULT ? styles.barLow : styles.barMid;
  return (
    <div>
      <div className={styles.scoreLabel}>{label}</div>
      <div className={styles.scoreValue}>
        {fmt(cumulative)}
        <small> dari 100</small>
      </div>
      <div className={styles.bar} aria-hidden="true">
        <div className={`${styles.barFill} ${warna}`} style={{ width: `${persen}%` }} />
        <div className={styles.barMark} style={{ left: `${ambang}%` }} />
      </div>
      <div className={`${styles.scoreStatus} ${baik ? styles.ok : styles.bad}`}>
        {baik
          ? `Memenuhi ambang ${ambang}`
          : tertahan
            ? `Di atas ambang ${ambang}, tetapi tertahan unit inti Kritis`
            : `Belum memenuhi ambang ${ambang}`}
      </div>
      <div className={`${styles.small} ${styles.muted}`}>{sumber}</div>
    </div>
  );
}

export default function StudentDiagnosis({ profil, siswa, ambang }) {
  const { perilaku, kompetensi } = profil;
  const jumlahKritisInti = kompetensi.unitKritisInti.length;
  const unitUrut = [...kompetensi.unit]
    .filter((u) => u.skor !== null)
    .sort((a, b) => URUT_STATUS[a.status] - URUT_STATUS[b.status] || a.skor - b.skor);
  const periodsTren = profil.tren.filter((p) => p.perilaku !== null || p.kompetensi !== null);
  const gagalK3 = kompetensi.unit.find((u) => u.sebab === 'GAGAL_K3');

  return (
    <div>
      <div className={styles.diagHead}>
        <div>
          <div className={styles.diagName}>{siswa.nama}</div>
          <div className={`${styles.small} ${styles.muted}`}>
            {siswa.kelas}, {siswa.id}, nama fiktif
          </div>
        </div>
        <ProfilBadge statusProfil={profil.statusProfil} />
      </div>

      <div className={styles.scores}>
        <SkorKartu
          label="Perilaku kerja"
          dimensi={perilaku}
          ambang={ambang.perilaku}
          sumber="Otomatis dari presensi dan perizinan"
        />
        <SkorKartu
          label="Kompetensi"
          dimensi={kompetensi}
          ambang={ambang.kompetensi}
          sumber="Input guru produktif per unit SKKNI"
        />
      </div>

      {kompetensi.sufficient && kompetensi.overridden && (
        <div className={`${styles.notice} ${styles.noticeBad}`}>
          {kompetensi.cumulative >= ambang.kompetensi
            ? `Skor kompetensi ${fmt(kompetensi.cumulative)} sudah di atas ambang ${ambang.kompetensi}, tetapi `
            : ''}
          {jumlahKritisInti} unit kompetensi inti berstatus Kritis, jadi status kompetensi tetap belum siap.
        </div>
      )}
      {gagalK3 && (
        <div className={`${styles.notice} ${styles.noticeBad}`}>
          Unit K3 belum tuntas. Siswa tidak bisa diproses untuk penempatan PKL sampai remedial praktik selesai.
        </div>
      )}
      {perilaku.sufficient && perilaku.status === 'KURANG' && (
        <div className={styles.notice}>
          Skor perilaku dihitung dari rata-rata tertimbang dengan bobot lebih tinggi pada 6 bulan terakhir.
        </div>
      )}

      {perilaku.sufficient && (
        <>
          <div className={styles.sectionLabel}>Rincian perilaku kerja</div>
          <div className={styles.breakdown}>
            {KOMPONEN_KEYS.map((k) => {
              const v = perilaku.perKomponen[k];
              const nilai = v === null ? 0 : v;
              const warna = v === null || v >= ambang.perilaku ? '' : v < AMBANG_KRITIS_DEFAULT ? styles.barLow : styles.barMid;
              return (
                <div key={k} className={styles.breakRow}>
                  <span>{LABEL_KOMPONEN[k]}</span>
                  <div className={styles.bar} aria-hidden="true">
                    <div className={`${styles.barFill} ${warna}`} style={{ width: `${nilai}%` }} />
                    <div className={styles.barMark} style={{ left: `${ambang.perilaku}%` }} />
                  </div>
                  <span className={styles.breakVal}>{fmt(v)}</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className={styles.sectionLabel}>Unit kompetensi SKKNI</div>
      {unitUrut.length === 0 ? (
        <p className={`${styles.small} ${styles.muted}`}>Belum ada unit yang dinilai.</p>
      ) : (
        <div className={styles.units}>
          {unitUrut.map((u) => (
            <div key={u.kode} className={styles.unitRow}>
              <span>
                {u.judul}
                <span className={styles.unitCode}>
                  {u.kode}
                  {u.kategori === 'kompetensi_inti' ? ', unit inti' : ''}
                </span>
              </span>
              <span className={styles.unitScore}>{fmt(u.skor)}</span>
              <StatusUnitBadge status={u.status} />
            </div>
          ))}
        </div>
      )}

      {periodsTren.length >= 2 && (
        <>
          <div className={styles.sectionLabel}>Tren per semester</div>
          <TrendMini periods={periodsTren} ambang={ambang} />
          <p className={`${styles.small} ${styles.muted}`}>
            Grafik menampilkan skor tiap semester yang sudah selesai. Skor di atas adalah rata-rata tertimbang seluruh
            riwayat, jadi bisa berbeda dari titik terakhir grafik.
          </p>
        </>
      )}
    </div>
  );
}