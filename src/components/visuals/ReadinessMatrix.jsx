import { useId, useMemo, useState } from 'react';
import { matrixConfig, sampleStudents } from '@/data/matrix';
import { PROFILE_KEYS, getProfile, profiles } from '@/data/profiles';
import { useMounted } from '@/hooks/useMounted';
import { classifyStudent, countByProfile } from '@/utils/classifyStudent';
import { cn } from '@/utils/cn';
import ProfileMarker from '@/components/common/ProfileMarker';
import styles from './ReadinessMatrix.module.css';

const { axes, domain, thresholdRange, defaultThreshold, sliders } = matrixConfig;
const DIMENSIONS = ['behavior', 'competency'];

// Mengubah nilai 20 sampai 100 menjadi posisi 0 sampai 100 persen di bidang gambar.
const toPercent = (value) => ((value - domain.min) / (domain.max - domain.min)) * 100;

const describeCounts = (counts) =>
  profiles.map((profile) => `${profile.name} ${counts[profile.key]} siswa`).join(', ');

// Matriks kesiapan interaktif di hero. Ini elemen paling khas di halaman:
// titik siswa berangkat dari satu gerombol tanpa pembeda, lalu menyebar ke empat profil.
export default function ReadinessMatrix() {
  const [threshold, setThreshold] = useState(defaultThreshold);
  const [activeKey, setActiveKey] = useState(null);
  const settled = useMounted();
  const baseId = useId();

  const counts = useMemo(() => countByProfile(sampleStudents, threshold), [threshold]);
  const summary = describeCounts(counts);
  const activeProfile = activeKey ? getProfile(activeKey) : null;

  const xLine = toPercent(threshold.behavior);
  const yLine = toPercent(threshold.competency);

  const zones = [
    { key: PROFILE_KEYS.ready, style: { left: `${xLine}%`, right: 0, top: 0, bottom: `${yLine}%` } },
    { key: PROFILE_KEYS.behavior, style: { left: 0, width: `${xLine}%`, top: 0, bottom: `${yLine}%` } },
    { key: PROFILE_KEYS.competency, style: { left: `${xLine}%`, right: 0, bottom: 0, height: `${yLine}%` } },
    { key: PROFILE_KEYS.both, style: { left: 0, width: `${xLine}%`, bottom: 0, height: `${yLine}%` } },
  ];

  const handleThreshold = (dimension) => (event) => {
    const value = Number(event.target.value);
    setThreshold((current) => ({ ...current, [dimension]: value }));
  };

  const toggleProfile = (key) => setActiveKey((current) => (current === key ? null : key));

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>{matrixConfig.title}</h2>
        <p className={styles.note}>{matrixConfig.note}</p>
      </div>

      <div className={styles.plotArea}>
        <span className={styles.axisY} aria-hidden="true">
          {axes.y}
        </span>

        <div
          className={styles.plot}
          role="img"
          aria-label={`Sebaran ${sampleStudents.length} siswa contoh menurut perilaku kerja dan kompetensi. ${summary}.`}
        >
          {zones.map((zone) => (
            <span
              key={zone.key}
              className={cn(
                styles.zone,
                styles[`zone_${zone.key}`],
                activeKey && activeKey !== zone.key && styles.zoneDimmed,
              )}
              style={zone.style}
            >
              <span className={styles.zoneLabel}>{getProfile(zone.key).name}</span>
            </span>
          ))}

          <span className={styles.lineX} style={{ left: `${xLine}%` }} />
          <span className={styles.lineY} style={{ bottom: `${yLine}%` }} />

          {sampleStudents.map((student, index) => {
            const key = classifyStudent(student, threshold);
            return (
              <span
                key={student.id}
                className={cn(styles.dot, activeKey && activeKey !== key && styles.dotDimmed)}
                style={{
                  left: `${settled ? toPercent(student.behavior) : 50}%`,
                  bottom: `${settled ? toPercent(student.competency) : 50}%`,
                  '--dot-index': index,
                }}
              >
                <ProfileMarker profileKey={settled ? key : null} size="0.8125rem" />
              </span>
            );
          })}
        </div>

        <span className={styles.axisX} aria-hidden="true">
          {axes.x}
        </span>
      </div>

      <div className={styles.controls}>
        {DIMENSIONS.map((dimension) => {
          const inputId = `${baseId}-${dimension}`;
          return (
            <div key={dimension} className={styles.control}>
              <label className={styles.controlLabel} htmlFor={inputId}>
                {sliders[dimension]}
              </label>
              <output className={styles.controlValue} htmlFor={inputId}>
                {threshold[dimension]}
              </output>
              <input
                id={inputId}
                className={styles.range}
                type="range"
                min={thresholdRange.min}
                max={thresholdRange.max}
                step={1}
                value={threshold[dimension]}
                onChange={handleThreshold(dimension)}
                aria-valuetext={`${threshold[dimension]}. ${summary}`}
              />
            </div>
          );
        })}
      </div>

      <ul className={styles.legend}>
        {profiles.map((profile) => (
          <li key={profile.key}>
            <button
              type="button"
              className={cn(styles.legendItem, activeKey === profile.key && styles.legendActive)}
              aria-pressed={activeKey === profile.key}
              onClick={() => toggleProfile(profile.key)}
            >
              <ProfileMarker profileKey={profile.key} />
              <span className={styles.legendName}>{profile.name}</span>
              <span className={styles.legendCount}>{counts[profile.key]}</span>
            </button>
          </li>
        ))}
      </ul>

      <p className={styles.detail}>
        {activeProfile ? (
          <>
            <strong>{activeProfile.name}.</strong> {activeProfile.condition} {activeProfile.followUp}
          </>
        ) : (
          <>
            {matrixConfig.instruction} {matrixConfig.emptyHint}
          </>
        )}
      </p>
    </div>
  );
}
