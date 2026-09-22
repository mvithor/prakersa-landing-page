import styles from './StepFlowDiagram.module.css';

const TONE_LABEL = {
  live: 'Berjalan',
  building: 'Sedang dibangun',
  vision: 'Visi',
};

const VIEW_W = 780;
const VIEW_MARGIN = 25;
const NODE_GAP = 20;
const NODE_HEIGHT = 92;
const NODE_Y = 20;
const CURVE_DIP = 100;
const CURVE_INSET = 60;

export default function StepFlowDiagram({ steps, activeIndex, onSelect }) {
  const n = steps.length;
  const nodeWidth = (VIEW_W - 2 * VIEW_MARGIN - (n - 1) * NODE_GAP) / n;
  const nodeX = (i) => VIEW_MARGIN + i * (nodeWidth + NODE_GAP);
  const centerX = (i) => nodeX(i) + nodeWidth / 2;
  const centerY = NODE_Y + NODE_HEIGHT / 2;
  const bottomY = NODE_Y + NODE_HEIGHT;
  const curveY = bottomY + CURVE_DIP;
  // Titik terendah kurva secara visual (bukan titik kontrolnya) ada di bottomY + 0.75*CURVE_DIP
  // untuk kurva kubik simetris seperti ini. Label ditaruh di curveY, bukan curveY-14 seperti
  // sebelumnya, supaya jaraknya ke kurva sungguhan cukup lega, tidak mepet lagi.
  const labelY = curveY;
  const viewHeight = curveY + 34;

  const edges = steps.slice(0, -1).map((_, j) => ({
    key: `edge-${j}`,
    x1: nodeX(j) + nodeWidth,
    x2: nodeX(j + 1),
    active: activeIndex === j + 1,
  }));

  const feedbackActive = activeIndex === 0;
  const firstCenter = centerX(0);
  const lastCenter = centerX(n - 1);
  const labelCenter = (firstCenter + lastCenter) / 2;

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span>Alur Sistem</span>
        <span className={styles.liveBadge}>
          <span className={styles.liveDot} />
          Alur Hidup
        </span>
      </div>

      <svg
        className={styles.diagram}
        viewBox={`0 0 ${VIEW_W} ${viewHeight}`}
        role="group"
        aria-label="Lima langkah cara kerja, pilih satu node untuk melihat detailnya"
      >
        {edges.map((edge) => (
          <line
            key={edge.key}
            className={`${styles.edge} ${edge.active ? styles.edgeActive : ''}`}
            x1={edge.x1}
            y1={centerY}
            x2={edge.x2}
            y2={centerY}
          />
        ))}

        <path
          className={`${styles.feedbackPath} ${feedbackActive ? styles.feedbackPathActive : ''}`}
          d={`M${lastCenter},${bottomY} C ${lastCenter - CURVE_INSET},${curveY} ${firstCenter + CURVE_INSET},${curveY} ${firstCenter},${bottomY}`}
          fill="none"
        />
        <rect x={labelCenter - 54} y={labelY - 13} width="108" height="26" rx="13" className={styles.feedbackLabelBg} />
        <text
          x={labelCenter}
          y={labelY + 4}
          textAnchor="middle"
          className={`${styles.feedbackLabel} ${feedbackActive ? styles.feedbackLabelActive : ''}`}
        >
          sinyal kalibrasi
        </text>

        {steps.map((step, index) => {
          const isActive = index === activeIndex;
          return (
            <foreignObject key={step.id} x={nodeX(index)} y={NODE_Y} width={nodeWidth} height={NODE_HEIGHT}>
              <div xmlns="http://www.w3.org/1999/xhtml" className={styles.nodeWrap}>
                <button
                  type="button"
                  onClick={() => onSelect(index)}
                  className={`${styles.node} ${styles[`tone-${step.tone}`]} ${isActive ? styles.nodeActive : ''}`}
                  aria-current={isActive ? 'step' : undefined}
                  aria-label={`${step.title}, status ${TONE_LABEL[step.tone]}`}
                >
                  <span className={styles.nodeTop}>
                    <span className={styles.nodeCode}>{String(index + 1).padStart(2, '0')}</span>
                    <span className={styles.nodeDot} aria-hidden="true" />
                  </span>
                  <span className={styles.nodeTitle}>{step.title}</span>
                </button>
              </div>
            </foreignObject>
          );
        })}
      </svg>

      <p className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles['dot-live']}`} /> Berjalan
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles['dot-building']}`} /> Sedang dibangun
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles['dot-vision']}`} /> Visi
        </span>
      </p>
    </div>
  );
}