import { useCallback, useEffect, useRef, useState } from 'react';
import PlaceholderFigure from './PlaceholderFigure';
import styles from './FigureSlider.module.css';

const AUTOPLAY_INTERVAL = 4500;
const RESUME_DELAY_AFTER_TOUCH = 3000;

export default function FigureSlider({ figures, className }) {
  const trackRef = useRef(null);
  const resumeTimerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const isSingle = !figures || figures.length <= 1;

  const scrollToIndex = useCallback((index) => {
    const track = trackRef.current;
    const slide = track?.children[index];
    if (!slide) return;
    track.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' });
    setActiveIndex(index);
  }, []);

  const goToRelative = (delta) => {
    if (!figures) return;
    const next = (activeIndex + delta + figures.length) % figures.length;
    scrollToIndex(next);
  };

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const index = Math.round(track.scrollLeft / track.clientWidth);
    setActiveIndex(index);
  };

  const pauseForInteraction = () => {
    clearTimeout(resumeTimerRef.current);
    setIsPaused(true);
  };

  const scheduleResume = () => {
    clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => setIsPaused(false), RESUME_DELAY_AFTER_TOUCH);
  };

  useEffect(() => () => clearTimeout(resumeTimerRef.current), []);

  useEffect(() => {
    if (isSingle || isPaused) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const timer = setInterval(() => {
      setActiveIndex((current) => {
        const next = (current + 1) % figures.length;
        const track = trackRef.current;
        const slide = track?.children[next];
        if (slide) track.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' });
        return next;
      });
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [isSingle, isPaused, figures?.length]);

  if (!figures || figures.length === 0) return null;

  return (
    <div
      className={`${styles.slider} ${className ?? ''}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onPointerDown={pauseForInteraction}
      onPointerUp={scheduleResume}
      onPointerCancel={scheduleResume}
    >
      <div
        className={styles.track}
        ref={trackRef}
        onScroll={handleScroll}
        aria-roledescription="carousel"
        aria-label="Galeri dokumentasi"
      >
        {figures.map((figure, index) => (
          <div
            className={styles.slide}
            key={figure.label ?? index}
            aria-roledescription="slide"
            aria-label={`Foto ${index + 1} dari ${figures.length}`}
          >
            <PlaceholderFigure
                label={figure.label}
                src={figure.src}
                alt={figure.alt}
                className={styles.figureItem}
                />
          </div>
        ))}
      </div>

      {!isSingle && (
        <>
          <button
            type="button"
            className={`${styles.navButton} ${styles.navPrev}`}
            onClick={() => goToRelative(-1)}
            aria-label="Foto sebelumnya"
          >
            ‹
          </button>
          <button
            type="button"
            className={`${styles.navButton} ${styles.navNext}`}
            onClick={() => goToRelative(1)}
            aria-label="Foto berikutnya"
          >
            ›
          </button>

          <div className={styles.dots}>
            {figures.map((figure, index) => (
              <button
                key={figure.label ?? index}
                type="button"
                className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ''}`}
                onClick={() => scrollToIndex(index)}
                aria-label={`Ke foto ${index + 1}`}
                aria-current={index === activeIndex ? 'true' : undefined}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}