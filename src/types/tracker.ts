/** Farz Salah cell state (Fajr, Dhuhr, Asr, Maghrib, Isha). */
export type FarzSalahState =
  | "mosque"
  | "on_time"
  | "qaza"
  | "missed"
  | "not_applicable";

export const FARZ_SALAH_STATES: FarzSalahState[] = [
  "mosque",
  "on_time",
  "qaza",
  "missed",
  "not_applicable",
];

export type FarzField = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";

export const FARZ_FIELDS: FarzField[] = [
  "fajr",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
];

export function isFarzField(
  field: string
): field is FarzField {
  return FARZ_FIELDS.includes(field as FarzField);
}

/** States that count as "completed" for stats (mosque, on_time, qaza). */
export const FARZ_COMPLETED_STATES: FarzSalahState[] = [
  "mosque",
  "on_time",
  "qaza",
];

export function isFarzCompleted(state: FarzSalahState | null): boolean {
  return state !== null && FARZ_COMPLETED_STATES.includes(state);
}
