import { cn } from '@/utils/cn';
import styles from './FormField.module.css';

// Satu kolom formulir: label, kontrol, petunjuk, dan pesan galat yang terhubung lewat aria.
export default function FormField({ field, id, value, error, onChange, onBlur }) {
  const hintId = field.hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  const shared = {
    id,
    name: field.name,
    value,
    required: field.required,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    onChange: (event) => onChange(field.name, event.target.value),
    onBlur: () => onBlur(field.name),
    className: cn(styles.control, error && styles.invalid),
  };

  let control;
  if (field.type === 'select') {
    control = (
      <select {...shared}>
        <option value="">Pilih peran</option>
        {field.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  } else if (field.type === 'textarea') {
    control = <textarea {...shared} rows={4} />;
  } else {
    control = (
      <input
        {...shared}
        type={field.type}
        autoComplete={field.autoComplete}
        inputMode={field.type === 'tel' ? 'tel' : undefined}
      />
    );
  }

  return (
    <div className={cn(styles.field, field.type === 'textarea' && styles.wide)}>
      <label className={styles.label} htmlFor={id}>
        {field.label}
        {field.required ? null : <span className={styles.optional}> (opsional)</span>}
      </label>
      {control}
      {field.hint ? (
        <p id={hintId} className={styles.hint}>
          {field.hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
