// Pembungkus localStorage yang aman. Penyimpanan bisa diblokir browser
// (mode privat, kebijakan perangkat sekolah), jadi setiap akses dijaga try/catch.
export function readStorage(key, fallback = null) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
