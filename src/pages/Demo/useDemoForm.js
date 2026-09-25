import { useCallback, useState } from 'react';
import { demoFields, demoPage } from '@/data/demoForm';
import { normalizePhone, runValidators, validators } from '@/utils/validators';
import { buildWhatsAppMessage, buildWhatsAppUrl, openWhatsApp } from '@/utils/whatsapp';

const CONSENT = 'consent';

const initialValues = {
  ...Object.fromEntries(demoFields.map((field) => [field.name, ''])),
  [CONSENT]: false,
};

// Aturan validasi per kolom, disusun dari konfigurasi di data/demoForm.js.
function rulesFor(field) {
  const rules = [];
  if (field.required) rules.push(validators.required(field.label));
  if (field.type === 'email') rules.push(validators.email);
  if (field.type === 'tel') rules.push(validators.phone);
  return rules;
}

function validateField(name, value) {
  if (name === CONSENT) {
    return runValidators(value, [validators.checked(demoPage.consentError)]);
  }
  const field = demoFields.find((item) => item.name === name);
  // Kolom opsional yang kosong tidak perlu divalidasi formatnya.
  if (!field.required && !String(value).trim()) return '';
  return runValidators(value, rulesFor(field));
}

// Seluruh logika formulir demo: nilai, galat, dan status pengiriman.
// Tidak ada server atau database di sini. "Mengirim" berarti membuka
// WhatsApp dengan pesan yang sudah terisi dari data formulir, pengguna
// sendiri yang menekan kirim di sana.
export function useDemoForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  const setValue = useCallback((name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    // Galat dihapus begitu pengguna mulai memperbaiki kolomnya.
    setErrors((current) => (current[name] ? { ...current, [name]: '' } : current));
  }, []);

  const validateOnBlur = useCallback(
    (name) => {
      setErrors((current) => ({ ...current, [name]: validateField(name, values[name]) }));
    },
    [values],
  );

  const submit = useCallback(async () => {
    const names = [...demoFields.map((field) => field.name), CONSENT];
    const nextErrors = Object.fromEntries(
      names.map((name) => [name, validateField(name, values[name])]),
    );
    setErrors(nextErrors);

    const firstInvalid = names.find((name) => nextErrors[name]);
    if (firstInvalid) return { ok: false, firstInvalid };

    setStatus('submitting');
    try {
      const finalValues = { ...values, whatsapp: normalizePhone(values.whatsapp) };
      const message = buildWhatsAppMessage(demoFields, finalValues, 'Permintaan demo Prakersa baru');
      const url = buildWhatsAppUrl(demoPage.whatsappNumber, message);
      openWhatsApp(url);
      setStatus('success');
      return { ok: true };
    } catch {
      setStatus('error');
      return { ok: false };
    }
  }, [values]);

  return { values, errors, status, setValue, validateOnBlur, submit, consentName: CONSENT };
}