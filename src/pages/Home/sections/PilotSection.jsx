import { pilot } from '@/data/pilot';
import { ANCHORS } from '@/routes/paths';
import Button from '@/components/common/Button';
import Icon from '@/components/common/Icon';
import ProgressBar from '@/components/common/ProgressBar';
import Section from '@/components/common/Section';
import SectionHeading from '@/components/common/SectionHeading';
import styles from './PilotSection.module.css';

export default function PilotSection() {
  const { quota } = pilot;

  return (
    <Section id={ANCHORS.pilot} tone="primary" labelledBy="pilot-title">
      <div className={styles.grid}>
        <div>
          <SectionHeading id="pilot-title" title={pilot.title} lead={pilot.lead} />

          <div className={styles.quota}>
            <div className={styles.quotaHead}>
              <span>{pilot.quotaLabel}</span>
              <strong className={styles.quotaValue}>
                {quota.filled} dari {quota.total} {quota.unit}
              </strong>
            </div>
            <ProgressBar value={quota.filled} max={quota.total} label={pilot.quotaLabel} />
          </div>

          <div className={styles.action}>
            <Button to={pilot.cta.to} variant="inverse" size="lg">
              {pilot.cta.label}
            </Button>
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>{pilot.benefitsTitle}</h3>
          <ul className={styles.benefits}>
            {pilot.benefits.map((benefit) => (
              <li key={benefit} className={styles.benefit}>
                <Icon name="check" size={18} className={styles.check} />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
          <p className={styles.requirement}>{pilot.requirement}</p>
        </div>
      </div>
    </Section>
  );
}
