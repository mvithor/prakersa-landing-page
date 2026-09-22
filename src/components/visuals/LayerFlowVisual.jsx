import { flowVisual } from '@/data/flowVisual';
import { useRotatingIndex } from '@/hooks/useRotatingIndex';
import styles from './LayerFlowVisual.module.css';

export default function LayerFlowVisual() {
  const tickerIndex = useRotatingIndex(flowVisual.ticker.length, 2600);

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={styles.panelLabel}>{flowVisual.panelLabel}</span>
        <span className={styles.liveBadge}>
          <span className={styles.liveDot} />
          {flowVisual.statusLabel}
        </span>
      </div>

      <svg
        className={styles.diagram}
        viewBox="0 0 640 300"
        role="img"
        aria-label="Diagram alur Hulu ke Jembatan ke Hilir, dengan sinyal kalibrasi kembali ke Hulu"
      >
        {/* Kurva sinyal balik, garis saja, tanpa kepala panah */}
        <path
          className={styles.feedbackPath}
          d="M535,130 C 565,238 75,238 105,130"
          fill="none"
        />

        {/* Label ditaruh sebagai teks biasa, koordinat tetap, selalu tegak apa pun arah kurvanya */}
        <rect x="256" y="207" width="128" height="24" rx="12" className={styles.feedbackLabelBg} />
        <text x="320" y="223" textAnchor="middle" className={styles.feedbackLabel}>
          sinyal kalibrasi
        </text>

        <line className={styles.forwardPath} x1="190" y1="80" x2="231" y2="80" />
        <line className={styles.forwardPath} x1="405" y1="80" x2="446" y2="80" />

        <circle className={`${styles.particle} ${styles.particleA}`} r="5" />
        <circle className={`${styles.particle} ${styles.particleB}`} r="5" />
        <circle className={`${styles.particle} ${styles.particleFeedback}`} r="4.5" />

        <g transform="translate(20,30)">
          <rect className={`${styles.node} ${styles.nodeLive}`} width="170" height="100" rx="16" />
          <circle className={`${styles.statusDot} ${styles.dotLive}`} cx="152" cy="18" r="4" />
          <text x="18" y="24" className={styles.nodeCode}>H1</text>
          <text x="18" y="55" className={styles.nodeTitle}>{flowVisual.stages[0].title}</text>
          <text x="18" y="80" className={styles.nodeSubtitle}>{flowVisual.stages[0].subtitle}</text>
        </g>

        <g transform="translate(235,30)">
          <rect className={`${styles.node} ${styles.nodeBuilding}`} width="170" height="100" rx="16" />
          <circle className={`${styles.statusDot} ${styles.dotBuilding}`} cx="152" cy="18" r="4" />
          <text x="18" y="24" className={styles.nodeCode}>H2</text>
          <text x="18" y="55" className={styles.nodeTitle}>{flowVisual.stages[1].title}</text>
          <text x="18" y="80" className={styles.nodeSubtitle}>{flowVisual.stages[1].subtitle}</text>
        </g>

        <g transform="translate(450,30)">
          <rect className={`${styles.node} ${styles.nodeVision}`} width="170" height="100" rx="16" />
          <circle className={`${styles.statusDot} ${styles.dotVision}`} cx="152" cy="18" r="4" />
          <text x="18" y="24" className={styles.nodeCode}>H3</text>
          <text x="18" y="55" className={styles.nodeTitle}>{flowVisual.stages[2].title}</text>
          <text x="18" y="80" className={styles.nodeSubtitle}>{flowVisual.stages[2].subtitle}</text>
        </g>
      </svg>

      <p className={styles.legend}>
        {flowVisual.stages.map((s, i) => (
          <span key={s.id} className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles[`dot-${s.tone}`]}`} />
            {s.title} · {s.status}
            {i < flowVisual.stages.length - 1 && <span className={styles.legendSep}>·</span>}
          </span>
        ))}
      </p>

      <p className={styles.ticker} key={tickerIndex}>
        {flowVisual.ticker[tickerIndex]}
      </p>
    </div>
  );
}