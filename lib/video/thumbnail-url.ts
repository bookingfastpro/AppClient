/** Formats seconds as "12 min" / "1 h 5 min", matching the app's metadata style. */
export function formatDuration(seconds: number) {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} h ${rest} min` : `${hours} h`;
}

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Débutant",
  intermediate: "Intermédiaire",
  advanced: "Avancé",
};

export function formatLevel(level: string | null) {
  if (!level) return null;
  return LEVEL_LABELS[level] ?? level;
}
