import { hero } from '@/data/hero';
import { useRotatingIndex } from '@/hooks/useRotatingIndex';
import Button from '@/components/common/Button';
import Section from '@/components/common/Section';
import LayerFlowVisual from '@/components/visuals/LayerFlowVisual';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  const rotateIndex = useRotatingIndex(hero.titleRotating.length);

  return (
    <Section spacing="hero" labelledBy="hero-title" containerSize="wide" className={styles.hero}>
      <div className={styles.grid}>
        <div className={styles.copy}>
          {hero.kickers?.length > 0 && (
            <div className={styles.kickerRow}>
              {hero.kickers.map((kicker) => (
                <span
                  key={kicker.text}
                  className={
                    kicker.type === 'status'
                      ? styles.kickerStatus
                      : styles.kickerCategory
                  }
                >
                  {kicker.text}
                </span>
              ))}
            </div>
          )}

          <h1 id="hero-title" className={styles.title}>
            {hero.titleStatic}{' '}
            <span className={styles.rotatingWrap}>
              <span key={rotateIndex} className={styles.rotatingWord}>
                {hero.titleRotating[rotateIndex]}
              </span>
            </span>
          </h1>

          <p className={styles.lead}>{hero.lead}</p>

          <div className={styles.actions}>
            <Button to={hero.primaryCta.to} size="lg" className={styles.shineButton}>
              {hero.primaryCta.label}
            </Button>
            <Button to={hero.secondaryCta.to} size="lg" variant="secondary">
              {hero.secondaryCta.label}
            </Button>
          </div>
        </div>

        <div className={styles.visual}>
          <LayerFlowVisual />
        </div>
      </div>
    </Section>
  );
}