const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_ID_PATTERN = /^(?:\+62|62|0)8[1-9][0-9]{6,11}$/;

export const normalizePhone = (value) => value.replace(/[\s().-]/g, '');

// Setiap validator mengembalikan pesan galat (string) atau string kosong bila valid.
// Pesan menjelaskan apa yang salah dan cara memperbaikinya.
export const validators = {
  required: (label) => (value) =>
    String(value ?? '').trim() ? '' : `${label} belum diisi.`,

  email: (value) =>
    EMAIL_PATTERN.test(String(value).trim())
      ? ''
      : 'Format email belum benar. Contoh: nama@sekolah.sch.id',

  phone: (value) =>
    PHONE_ID_PATTERN.test(normalizePhone(String(value)))
      ? ''
      : 'Nomor WhatsApp belum benar. Contoh: 081234567890',

  checked: (message) => (value) => (value ? '' : message),
};

// Menjalankan daftar validator secara berurutan dan berhenti di galat pertama.
export function runValidators(value, rules = []) {
  for (const rule of rules) {
    const message = rule(value);
    if (message) return message;
  }
  return '';
}
