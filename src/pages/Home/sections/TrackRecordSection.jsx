import { trackRecord } from '@/data/trackRecord';
import { ANCHORS } from '@/routes/paths';
import FigureSlider from '@/components/common/FigureSlider';
import MediaLinkCard from '@/components/common/MediaLinkCard';
import PKLStatusFigure from '@/components/common/PKLStatusFigure';
import Section from '@/components/common/Section';
import SectionHeading from '@/components/common/SectionHeading';
import styles from './TrackRecordSection.module.css';

export default function TrackRecordSection() {
  return (
    <Section id={ANCHORS.trackRecord} tone="paper" labelledBy="track-title">
      <SectionHeading id="track-title" title={trackRecord.title} lead={trackRecord.lead} />

      <div className={styles.items}>
        {trackRecord.items.map((item) => (
          <article key={item.key} className={styles.item}>
            <div className={styles.body}>
              <p className={styles.kind}>{item.kind}</p>
              <h3 className={styles.name}>{item.name}</h3>
              <p className={styles.description}>{item.description}</p>

              <dl className={styles.facts}>
                {item.facts.map((fact) => (
                  <div key={fact.label} className={styles.fact}>
                    <dt className={styles.factLabel}>{fact.label}</dt>
                    <dd className={styles.factValue}>{fact.value}</dd>
                  </div>
                ))}
              </dl>

              {item.note ? <p className={styles.note}>{item.note}</p> : null}
            </div>

            {item.statusFigure ? (
              <PKLStatusFigure className={styles.figure} />
            ) : item.figures && item.figures.length > 0 ? (
              <FigureSlider figures={item.figures} className={styles.figure} />
            ) : item.externalLink ? (
              <MediaLinkCard link={item.externalLink} className={styles.figure} />
            ) : null}
          </article>
        ))}
      </div>
    </Section>
  );
}