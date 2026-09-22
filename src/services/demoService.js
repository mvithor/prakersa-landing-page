// Pengiriman permintaan demo.
//
// SAAT INI MASIH SIMULASI: data belum dikirim ke mana pun.
// Untuk menyambungkan ke backend, isi VITE_DEMO_ENDPOINT di file .env
// (lihat .env.example). Endpoint diharapkan menerima POST berisi JSON.
const ENDPOINT = import.meta.env.VITE_DEMO_ENDPOINT;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function submitDemoRequest(payload) {
  if (!ENDPOINT) {
    await wait(700);
    if (import.meta.env.DEV) {
      console.info('[demoService] Mode simulasi. Data yang akan dikirim:', payload);
    }
    return { ok: true, simulated: true };
  }

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Permintaan demo gagal terkirim (status ${response.status}).`);
  }

  return { ok: true, simulated: false };
}
