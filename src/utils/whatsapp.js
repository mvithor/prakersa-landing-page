export function buildWhatsAppMessage(fields, values, heading) {
  const lines = fields.map((field) => `${field.label}: ${values[field.name] || '-'}`);
  return [heading, '', ...lines].join('\n');
}

export function buildWhatsAppUrl(number, message) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(url) {
  const win = window.open(url, '_blank', 'noopener');
  if (!win) {
    // Kemungkinan besar jendela pop-up diblokir browser, navigasi
    // langsung sebagai jalan keluar, tetap sampai ke WhatsApp.
    window.location.href = url;
  }
}