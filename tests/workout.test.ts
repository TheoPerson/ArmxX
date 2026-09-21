import { describe, expect, it } from "vitest";
import { getDailySessionCounts, totalReps, type Session } from "@/lib/workout";

const now = new Date("2026-09-21T12:00:00.000Z");
const sessions: Session[] = [
  { id: "a", exerciseId: "wrist-curl", exerciseName: "Flexions", date: "2026-09-21T09:00:00.000Z", sets: 3, reps: 36, durationSeconds: 120 },
  { id: "b", exerciseId: "reverse-curl", exerciseName: "Extensions", date: "2026-09-19T09:00:00.000Z", sets: 2, reps: 24, durationSeconds: 100 },
];

describe("workout calculations", () => {
  it("totals repetitions across sessions", () => expect(totalReps(sessions)).toBe(60));
  it("builds a seven day session series ending today", () => expect(getDailySessionCounts(sessions, now)).toEqual([0, 0, 0, 0, 1, 0, 1]));
});
