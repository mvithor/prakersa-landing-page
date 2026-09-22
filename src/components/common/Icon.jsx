// Ikon garis sederhana buatan sendiri, tanpa pustaka tambahan.
const PATHS = {
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  chevronDown: 'M6 9l6 6 6-6',
  arrowUp: 'M12 19V5M5.5 11.5L12 5l6.5 6.5',
  mail: 'M4 6.5h16v11H4zM4 7l8 6.5L20 7',
  phone:
    'M6.5 4h3l1.5 4-2 1.5a11 11 0 005.5 5.5l1.5-2 4 1.5v3a1.5 1.5 0 01-1.5 1.5A15.5 15.5 0 015 5.5 1.5 1.5 0 016.5 4z',
};

export default function Icon({ name, size = 20, className }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
