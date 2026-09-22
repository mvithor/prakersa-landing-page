import { PROFILE_KEYS } from '@/data/profiles';

// Logika dua dimensi yang sama dengan konsep produk:
// perilaku dan kompetensi dinilai terpisah, lalu dipetakan ke empat profil.
export function classifyStudent(student, threshold) {
  const behaviorOk = student.behavior >= threshold.behavior;
  const competencyOk = student.competency >= threshold.competency;

  if (behaviorOk && competencyOk) return PROFILE_KEYS.ready;
  if (!behaviorOk && competencyOk) return PROFILE_KEYS.behavior;
  if (behaviorOk && !competencyOk) return PROFILE_KEYS.competency;
  return PROFILE_KEYS.both;
}

export function countByProfile(students, threshold) {
  const counts = {
    [PROFILE_KEYS.ready]: 0,
    [PROFILE_KEYS.behavior]: 0,
    [PROFILE_KEYS.competency]: 0,
    [PROFILE_KEYS.both]: 0,
  };
  students.forEach((student) => {
    counts[classifyStudent(student, threshold)] += 1;
  });
  return counts;
}
