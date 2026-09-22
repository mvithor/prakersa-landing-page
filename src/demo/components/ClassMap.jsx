import styles from './Demo.module.css';
import { Marker, fmt } from './shared';
import { PROFIL_META, isKlasifikasi } from '../engine/profile';

const W = 420;
const H = 380;
const ML = 44;
const MR = 12;
const MT = 12;
const MB = 40;
const PW = W - ML - MR;
const PH = H - MT - MB;
const MIN = 20;
const MAX = 100;
const TICKS = [20, 40, 60, 80, 100];

const klem = (v) => Math.max(MIN, Math.min(MAX, v));
export const petaX = (v) => ML + ((klem(v) - MIN) / (MAX - MIN)) * PW;
export const petaY = (v) => MT + (1 - (klem(v) - MIN) / (MAX - MIN)) * PH;

function Shape({ kode }) {
  const cls = `${styles[`mk_${kode}`]} ${styles.mapShape}`;
  if (kode === 'SP') return <circle r="6" className={cls} />;
  if (kode === 'RB') return <polygon points="0,-7.5 7.5,6 -7.5,6" className={cls} />;
  if (kode === 'RK') return <rect x="-6" y="-6" width="12" height="12" className={cls} />;
  return <polygon points="0,-8.5 8.5,0 0,8.5 -8.5,0" className={cls} />;
}

export default function ClassMap({ profilList, ambang, selectedId, onSelect }) {
  const xT = petaX(ambang.perilaku);
  const yT = petaY(ambang.kompetensi);
  const x0 = ML;
  const x1 = ML + PW;
  const y0 = MT;
  const y1 = MT + PH;

  const titik = profilList.filter(
    (p) => isKlasifikasi(p.statusProfil) && p.perilaku.cumulative !== null && p.kompetensi.cumulative !== null,
  );
  // Siswa terpilih digambar terakhir supaya tidak tertutup titik lain.
  const urut = [...titik].sort((a, b) => (a.id === selectedId) - (b.id === selectedId));
  const belumCukup = profilList.filter((p) => !isKlasifikasi(p.statusProfil));

  const pilih = (id) => onSelect && onSelect(id);

  return (
    <div className={styles.mapWrap}>
      <svg
        className={styles.map}
        viewBox={`0 0 ${W} ${H}`}
        role="group"
        aria-label="Peta kelas: perilaku kerja pada sumbu horizontal, kompetensi pada sumbu vertikal"
      >
        <rect x={x0} y={y0} width={xT - x0} height={yT - y0} className={styles.qFill_RB} />
        <rect x={xT} y={y0} width={x1 - xT} height={yT - y0} className={styles.qFill_SP} />
        <rect x={x0} y={yT} width={xT - x0} height={y1 - yT} className={styles.qFill_RG} />
        <rect x={xT} y={yT} width={x1 - xT} height={y1 - yT} className={styles.qFill_RK} />

        {TICKS.map((t) => (
          <g key={t}>
            <text x={petaX(t)} y={H - MB + 14} textAnchor="middle" className={styles.mapTick}>
              {t}
            </text>
            <text x={ML - 6} y={petaY(t) + 3} textAnchor="end" className={styles.mapTick}>
              {t}
            </text>
          </g>
        ))}

        <line x1={xT} x2={xT} y1={y0} y2={y1} className={styles.mapLine} />
        <line x1={x0} x2={x1} y1={yT} y2={yT} className={styles.mapLine} />

        <text x={x0 + 6} y={y0 + 14} className={styles.mapQLabel}>
          Risiko behavior
        </text>
        <text x={x1 - 6} y={y0 + 14} textAnchor="end" className={styles.mapQLabel}>
          Siap penuh
        </text>
        <text x={x0 + 6} y={y1 - 8} className={styles.mapQLabel}>
          Risiko ganda
        </text>
        <text x={x1 - 6} y={y1 - 8} textAnchor="end" className={styles.mapQLabel}>
          Risiko kompetensi
        </text>

        <text x={ML + PW / 2} y={H - 6} textAnchor="middle" className={styles.mapAxis}>
          Perilaku kerja
        </text>
        <text
          transform={`translate(12 ${MT + PH / 2}) rotate(-90)`}
          textAnchor="middle"
          className={styles.mapAxis}
        >
          Kompetensi
        </text>

        {urut.map((p) => {
          const kode = PROFIL_META[p.statusProfil].kode;
          const aktif = p.id === selectedId;
          const label = `${p.nama}, ${PROFIL_META[p.statusProfil].label}, perilaku ${fmt(p.perilaku.cumulative)}, kompetensi ${fmt(
            p.kompetensi.cumulative,
          )}${p.kompetensi.overridden ? ', ada unit inti kritis' : ''}`;
          return (
            <g
              key={p.id}
              className={styles.mapPt}
              transform={`translate(${petaX(p.perilaku.cumulative)} ${petaY(p.kompetensi.cumulative)})`}
              role="button"
              tabIndex={0}
              aria-label={label}
              aria-pressed={aktif}
              onClick={() => pilih(p.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  pilih(p.id);
                }
              }}
            >
              <title>{label}</title>
              <circle r="14" className={styles.mapHit} />
              {p.kompetensi.overridden && <circle r="12" className={styles.mapGate} />}
              {aktif && <circle r="15" className={styles.mapSel} />}
              <Shape kode={kode} />
            </g>
          );
        })}
      </svg>

      <div className={styles.legend}>
        {['SP', 'RB', 'RK', 'RG'].map((k) => (
          <span key={k}>
            <Marker kode={k} size={12} />
            {PROFIL_META[k].label}
          </span>
        ))}
        <span>
          <i className={styles.gateKey} aria-hidden="true" />
          Tertahan unit inti Kritis
        </span>
      </div>

      {belumCukup.length > 0 && (
        <div className={styles.dbcTray}>
          <span className={styles.muted}>Data belum cukup, belum bisa dipetakan:</span>
          <div className={styles.chips} style={{ marginTop: '0.4rem' }}>
            {belumCukup.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`${styles.chip} ${p.id === selectedId ? styles.chipOn : ''}`}
                aria-pressed={p.id === selectedId}
                onClick={() => pilih(p.id)}
              >
                <Marker kode="DBC" size={11} /> {p.nama}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
