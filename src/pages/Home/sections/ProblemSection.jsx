import { problem } from '@/data/problem';
import { ANCHORS } from '@/routes/paths';
import Section from '@/components/common/Section';
import styles from './ProblemSection.module.css';

export default function ProblemSection() {
  return (
    <Section id={ANCHORS.problem} tone="paper" labelledBy="problem-title">
      <div className={styles.grid}>
        <div>
          <h2 id="problem-title" className={styles.title}>
            {problem.title}
          </h2>
          {problem.paragraphs.map((paragraph) => (
            <p key={paragraph} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
          <p className={styles.consequence}>{problem.consequence}</p>
        </div>

        <div>
          <h3 className={styles.momentsTitle}>{problem.momentsTitle}</h3>
          <ol className={styles.timeline}>
            {problem.moments.map((moment) => (
              <li key={moment.phase} className={styles.moment}>
                <h4 className={styles.phase}>{moment.phase}</h4>
                <p>{moment.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
