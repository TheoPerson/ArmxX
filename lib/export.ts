import type { Session } from "./workout";

export type ExportPayload = { version: 1; exportedAt: string; sessions: Session[] };

export function createPayload(sessions: Session[]): ExportPayload {
  return { version: 1, exportedAt: new Date().toISOString(), sessions };
}

export function toJson(sessions: Session[]) {
  return JSON.stringify(createPayload(sessions), null, 2);
}

function csvCell(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

export function toCsv(sessions: Session[]) {
  const header = ["id", "exercise", "date", "sets", "reps", "duration_seconds"].join(",");
  const rows = sessions.map((session) => [session.id, session.exerciseName, session.date, session.sets, session.reps, session.durationSeconds].map(csvCell).join(","));
  return [header, ...rows].join("\n");
}

export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function parseImport(value: unknown) {
  if (!value || typeof value !== "object") throw new Error("Format JSON non reconnu.");
  const candidate = value as { sessions?: unknown };
  if (!Array.isArray(candidate.sessions)) throw new Error("Le fichier ne contient pas de sessions.");
  const sessions = candidate.sessions.filter((item): item is Session => {
    if (!item || typeof item !== "object") return false;
    const session = item as Partial<Session>;
    return typeof session.id === "string" && typeof session.exerciseId === "string" && typeof session.exerciseName === "string" && typeof session.date === "string" && typeof session.sets === "number" && typeof session.reps === "number" && typeof session.durationSeconds === "number";
  });
  if (sessions.length !== candidate.sessions.length) throw new Error("Une ou plusieurs sessions sont invalides.");
  return sessions;
}
