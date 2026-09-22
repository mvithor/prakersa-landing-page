import { useId, useRef } from 'react';
import { demoFields, demoPage } from '@/data/demoForm';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import Button from '@/components/common/Button';
import Section from '@/components/common/Section';
import TextLink from '@/components/common/TextLink';
import FormField from './FormField';
import { useDemoForm } from './useDemoForm';
import styles from './Demo.module.css';

export default function Demo() {
  useDocumentTitle(demoPage.documentTitle);

  const formRef = useRef(null);
  const baseId = useId();
  const { values, errors, status, setValue, validateOnBlur, submit, consentName } = useDemoForm();
  const submitting = status === 'submitting';
  const consentId = `${baseId}-${consentName}`;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await submit();
    // Bila ada kolom yang salah, fokus dipindah ke kolom pertama yang bermasalah.
    if (result.firstInvalid) {
      formRef.current?.elements.namedItem(result.firstInvalid)?.focus();
    }
  };

  if (status === 'success') {
    return (
      <Section tone="mist" spacing="hero" containerSize="narrow" labelledBy="demo-success">
        <div className={styles.success} role="status">
          <h1 id="demo-success" className={styles.successTitle}>
            {demoPage.successTitle}
          </h1>
          <p className={styles.lead}>{demoPage.successText}</p>
          <div className={styles.successAction}>
            <Button to={demoPage.successAction.to} size="lg">
              {demoPage.successAction.label}
            </Button>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section tone="mist" spacing="hero" labelledBy="demo-title">
      <div className={styles.grid}>
        <div>
          <h1 id="demo-title" className={styles.title}>
            {demoPage.title}
          </h1>
          <p className={styles.lead}>{demoPage.lead}</p>

          <form ref={formRef} className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.fields}>
              {demoFields.map((field) => (
                <FormField
                  key={field.name}
                  field={field}
                  id={`${baseId}-${field.name}`}
                  value={values[field.name]}
                  error={errors[field.name]}
                  onChange={setValue}
                  onBlur={validateOnBlur}
                />
              ))}
            </div>

            <div className={styles.consent}>
              <input
                id={consentId}
                name={consentName}
                type="checkbox"
                className={styles.checkbox}
                checked={values[consentName]}
                aria-invalid={errors[consentName] ? true : undefined}
                aria-describedby={errors[consentName] ? `${consentId}-error` : undefined}
                onChange={(event) => setValue(consentName, event.target.checked)}
              />
              <label htmlFor={consentId} className={styles.consentLabel}>
                {demoPage.consentLabel}{' '}
                <TextLink to={demoPage.privacyLink.to}>{demoPage.privacyLink.label}</TextLink>
              </label>
            </div>
            {errors[consentName] ? (
              <p id={`${consentId}-error`} className={styles.consentError} role="alert">
                {errors[consentName]}
              </p>
            ) : null}

            {status === 'error' ? (
              <p className={styles.submitError} role="alert">
                {demoPage.errorText}
              </p>
            ) : null}

            <Button type="submit" size="lg" disabled={submitting} className={styles.submit}>
              {submitting ? demoPage.submittingLabel : demoPage.submitLabel}
            </Button>
          </form>
        </div>

        <aside className={styles.aside} aria-labelledby="demo-aside-title">
          <h2 id="demo-aside-title" className={styles.asideTitle}>
            {demoPage.asideTitle}
          </h2>
          <ol className={styles.asideSteps}>
            {demoPage.asideSteps.map((step, index) => (
              <li key={step} className={styles.asideStep}>
                <span className={styles.asideNumber} aria-hidden="true">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </Section>
  );
}
