import { useId, useRef, useState } from 'react';
import { audiences } from '@/data/audiences';
import { ANCHORS } from '@/routes/paths';
import { cn } from '@/utils/cn';
import Icon from '@/components/common/Icon';
import Section from '@/components/common/Section';
import SectionHeading from '@/components/common/SectionHeading';
import TextLink from '@/components/common/TextLink';
import styles from './AudiencesSection.module.css';

export default function AudiencesSection() {
  const { items } = audiences;
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef([]);
  const baseId = useId();

  const focusTab = (index) => {
    const next = (index + items.length) % items.length;
    setActiveIndex(next);
    tabRefs.current[next]?.focus();
  };

  const handleKeyDown = (event) => {
    const moves = {
      ArrowRight: activeIndex + 1,
      ArrowDown: activeIndex + 1,
      ArrowLeft: activeIndex - 1,
      ArrowUp: activeIndex - 1,
      Home: 0,
      End: items.length - 1,
    };
    if (event.key in moves) {
      event.preventDefault();
      focusTab(moves[event.key]);
    }
  };

  return (
    <Section id={ANCHORS.audiences} tone="mist" labelledBy="audiences-title">
      <SectionHeading id="audiences-title" title={audiences.title} lead={audiences.lead} />

      <div className={styles.tabs}>
        <div
          className={styles.tabList}
          role="tablist"
          aria-labelledby="audiences-title"
          onKeyDown={handleKeyDown}
        >
          {items.map((item, index) => {
            const selected = index === activeIndex;
            return (
              <button
                key={item.key}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${item.key}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel-${item.key}`}
                tabIndex={selected ? 0 : -1}
                className={cn(styles.tab, selected && styles.tabActive)}
                onClick={() => setActiveIndex(index)}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {items.map((item, index) => (
          <div
            key={item.key}
            role="tabpanel"
            id={`${baseId}-panel-${item.key}`}
            aria-labelledby={`${baseId}-tab-${item.key}`}
            hidden={index !== activeIndex}
            className={styles.panel}
          >
            <h3>{item.headline}</h3>
            <ul className={styles.points}>
              {item.points.map((point) => (
                <li key={point} className={styles.point}>
                  <Icon name="check" size={18} className={styles.check} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <TextLink to={item.cta.to}>{item.cta.label}</TextLink>
          </div>
        ))}
      </div>
    </Section>
  );
}