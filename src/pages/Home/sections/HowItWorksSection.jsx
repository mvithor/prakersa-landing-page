import { useState } from 'react';
import { howItWorks } from '@/data/howItWorks';
import { ANCHORS } from '@/routes/paths';
import Section from '@/components/common/Section';
import SectionHeading from '@/components/common/SectionHeading';
import StepFlowDiagram from '@/components/visuals/StepFlowDiagram';
import styles from './HowItWorksSection.module.css';

const TONE_LABEL = {
  live: 'Berjalan',
  building: 'Sedang dibangun',
  vision: 'Visi',
};

export default function HowItWorksSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = howItWorks.steps.length;
  const step = howItWorks.steps[activeIndex];

  const goPrev = () => setActiveIndex((i) => (i - 1 + total) % total);
  const goNext = () => setActiveIndex((i) => (i + 1) % total);

  return (
    <Section id={ANCHORS.howItWorks} tone="mist" labelledBy="how-title" containerSize="wide">
      <SectionHeading id="how-title" title={howItWorks.title} lead={howItWorks.lead} />

      <div className={styles.layout}>
        <div className={styles.rail}>
          <StepFlowDiagram steps={howItWorks.steps} activeIndex={activeIndex} onSelect={setActiveIndex} />
        </div>

        <div key={step.id} className={styles.detail}>
          <div className={styles.detailHead}>
            <span className={styles.number} aria-hidden="true">
              {activeIndex + 1}
            </span>
            <span className={`${styles.tag} ${styles[`tag-${step.tone}`]}`}>
              {TONE_LABEL[step.tone]}
            </span>
          </div>

          <h3 className={styles.stepTitle}>{step.title}</h3>
          <p className={styles.stepText}>{step.text}</p>
          {step.insight ? <p className={styles.insight}>{step.insight}</p> : null}

          <div className={styles.nav}>
            <button type="button" onClick={goPrev} className={styles.navButton}>
              ← Sebelumnya
            </button>
            <span className={styles.navCount} aria-live="polite">
              {activeIndex + 1} / {total}
            </span>
            <button type="button" onClick={goNext} className={styles.navButton}>
              Berikutnya →
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
}