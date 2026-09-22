import { lazy, Suspense } from 'react';
import { rolePages } from '@/data/rolePages';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import Button from '@/components/common/Button';
import Section from '@/components/common/Section';
import ReadinessMatrix from '@/components/visuals/ReadinessMatrix';
import styles from './RolePage.module.css';

// Panggung demo berat (mesin penilaian, fixture, banyak panel), jadi dimuat terpisah
// dan hanya untuk halaman yang meminta lewat showDemo.
const DemoStage = lazy(() => import('@/demo/components/DemoStage'));
// Demo sisi industri, halaman terpisah, mesin dan fixture sama tapi arah baliknya:
// satu contoh mitra dicocokkan terhadap empat arketipe siswa, bukan sebaliknya.
const IndustryDemo = lazy(() => import('@/demo/components/IndustryDemo'));

// Satu templat untuk semua halaman peran. Isi diambil dari data/rolePages.js.
// statusBar, differentiator, showMatrix, showDemo, showIndustryDemo, metrics semuanya
// opsional: kalau tidak ada di data peran, bagian itu tidak dirender sama sekali,
// halaman lain tidak terpengaruh.
// showMatrix menampilkan widget ReadinessMatrix situs seperti sedia kala, tidak diubah.
// showDemo menampilkan panggung demo sekolah tiga tahap sebagai section baru dan
// berdiri sendiri, dengan data simulasinya sendiri, ditaruh setelah bagian manfaat
// dan sebelum CTA penutup. showIndustryDemo menampilkan demo sisi industri di posisi
// yang sama, untuk halaman industri mitra, tidak pernah dipasang bersamaan dengan
// showDemo di halaman yang sama. Tidak satu pun dari keduanya terhubung ke hero.
export default function RolePage({ roleKey }) {
  const page = rolePages[roleKey];
  useDocumentTitle(page.documentTitle);

  return (
    <>
      <Section
        tone="mist"
        spacing="hero"
        labelledBy="role-title"
        containerSize={page.showMatrix ? 'wide' : undefined}
      >
        <div className={page.showMatrix ? styles.heroGrid : undefined}>
          <div>
            <h1 id="role-title" className={styles.title}>
              {page.title}
            </h1>
            <p className={styles.lead}>{page.lead}</p>
            {page.differentiator ? <p className={styles.differentiator}>{page.differentiator}</p> : null}
            <div className={styles.heroAction}>
              <Button to={page.cta.action.to} size="lg">
                {page.cta.action.label}
              </Button>
            </div>
          </div>

          {page.showMatrix ? (
            <div className={styles.heroVisual}>
              <ReadinessMatrix />
            </div>
          ) : null}
        </div>
      </Section>

      {page.metrics ? (
        <Section tone="paper" spacing="compact" labelledBy="role-metrics">
          <p id="role-metrics" className={styles.metricsKicker}>
            {page.metricsLabel}
          </p>
          <div className={styles.metrics}>
            {page.metrics.map((metric) => (
              <div key={metric.label} className={styles.metric}>
                <p className={styles.metricValue}>{metric.value}</p>
                <p className={styles.metricLabel}>{metric.label}</p>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      <Section tone="paper" labelledBy="role-pains">
        <div className={styles.split}>
          <h2 id="role-pains">{page.painsTitle}</h2>
          <ul className={styles.pains}>
            {page.pains.map((pain) => (
              <li key={pain} className={styles.pain}>
                {pain}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="mist" labelledBy="role-gains">
        <h2 id="role-gains">{page.gainsTitle}</h2>
        <ul className={styles.gains}>
          {page.gains.map((gain) => (
            <li key={gain.title} className={styles.gain}>
              <h3 className={styles.gainTitle}>{gain.title}</h3>
              <p>{gain.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="paper" labelledBy="role-steps">
        <div className={styles.split}>
          <h2 id="role-steps">{page.stepsTitle}</h2>
          <ol className={styles.steps}>
            {page.steps.map((step, index) => (
              <li key={step.title} className={styles.step}>
                <span className={styles.stepNumber} aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {page.showDemo ? (
        <Suspense fallback={null}>
          <DemoStage />
        </Suspense>
      ) : null}

      {page.showIndustryDemo ? (
        <Suspense fallback={null}>
          <IndustryDemo />
        </Suspense>
      ) : null}

      <Section tone="primary" spacing="compact" labelledBy="role-cta">
        <div className={styles.cta}>
          <div>
            <h2 id="role-cta" className={styles.ctaTitle}>
              {page.cta.title}
            </h2>
            <p className={styles.ctaText}>{page.cta.text}</p>
          </div>
          <Button to={page.cta.action.to} variant="inverse" size="lg">
            {page.cta.action.label}
          </Button>
        </div>
      </Section>
    </>
  );
}