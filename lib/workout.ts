export type Exercise = {
  id: string;
  name: string;
  description: string;
  targetSets: number;
  targetReps: number;
  icon: "activity" | "dumbbell";
};

export type Session = {
  id: string;
  exerciseId: string;
  exerciseName: string;
  date: string;
  sets: number;
  reps: number;
  durationSeconds: number;
};

export const EXERCISES: Exercise[] = [
  { id: "wrist-curl", name: "Flexions du poignet", description: "Paumes vers le haut", targetSets: 3, targetReps: 12, icon: "activity" },
  { id: "reverse-curl", name: "Extensions du poignet", description: "Paumes vers le bas", targetSets: 3, targetReps: 12, icon: "activity" },
  { id: "farmer-hold", name: "Farmer hold", description: "Prise & stabilité", targetSets: 3, targetReps: 30, icon: "dumbbell" },
];

export function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainder = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

export function formatSessionDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

export function formatSessionTime(value: string) {
  return new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export function getRecentDayLabels(now = new Date()) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() - (6 - index));
    return new Intl.DateTimeFormat("fr-FR", { weekday: "narrow" }).format(date);
  });
}

export function getDailySessionCounts(sessions: Session[], now = new Date()) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    return sessions.filter((session) => session.date.slice(0, 10) === key).length;
  });
}

export function totalReps(sessions: Session[]) {
  return sessions.reduce((sum, session) => sum + session.reps, 0);
}

export function makeSession(exercise: Exercise, sets: number, reps: number, durationSeconds: number): Session {
  return { id: crypto.randomUUID(), exerciseId: exercise.id, exerciseName: exercise.name, date: new Date().toISOString(), sets, reps, durationSeconds };
}
