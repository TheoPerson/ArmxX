import { describe, expect, it } from "vitest";
import { parseImport, toCsv, toJson } from "@/lib/export";
import type { Session } from "@/lib/workout";

const session: Session = {
  id: "session-1",
  exerciseId: "wrist-curl",
  exerciseName: "Flexions, paumes vers le haut",
  date: "2026-09-21T09:00:00.000Z",
  sets: 3,
  reps: 36,
  durationSeconds: 120,
};

describe("data export contract", () => {
  it("creates a versioned JSON envelope that can be imported", () => {
    const payload = JSON.parse(toJson([session]));
    expect(payload.version).toBe(1);
    expect(parseImport(payload)).toEqual([session]);
  });

  it("escapes commas and quotes in CSV values", () => {
    const csv = toCsv([session]);
    expect(csv).toContain('"Flexions, paumes vers le haut"');
  });

  it("rejects malformed imports before persistence", () => {
    expect(() => parseImport({ version: 1, sessions: [{ id: "broken" }] })).toThrow("invalides");
  });

  it("rejects unsupported versions and unsafe numeric values", () => {
    expect(() => parseImport({ version: 2, sessions: [session] })).toThrow("Version JSON");
    expect(() => parseImport({ version: 1, sessions: [{ ...session, reps: -1 }] })).toThrow("invalides");
    expect(() => parseImport({ version: 1, sessions: [{ ...session, date: "not-a-date" }] })).toThrow("invalides");
  });
});
