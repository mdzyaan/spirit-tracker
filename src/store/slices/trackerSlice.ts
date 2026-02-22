import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { FarzSalahState } from "@/types/tracker";

export type TrackerField =
  | "quran"
  | "charity"
  | "fajr"
  | "dhuhr"
  | "asr"
  | "maghrib"
  | "isha"
  | "taraweeh";

export const TRACKER_FIELDS: TrackerField[] = [
  "quran",
  "charity",
  "fajr",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
  "taraweeh",
];

export const PRAYER_FIELDS: TrackerField[] = [
  "fajr",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
  "taraweeh",
];

export type TrackerDay = {
  id: string;
  user_id: string;
  year: number;
  day_number: number;
  date: string;
  quran: boolean;
  charity: boolean;
  fajr: FarzSalahState | null;
  dhuhr: FarzSalahState | null;
  asr: FarzSalahState | null;
  maghrib: FarzSalahState | null;
  isha: FarzSalahState | null;
  taraweeh: number | null;
};

export type TrackerStatus = "idle" | "loading" | "succeeded" | "failed";

type TrackerState = {
  status: TrackerStatus;
  error: string | null;
  year: number | null;
  days: TrackerDay[];
};

const initialState: TrackerState = {
  status: "idle",
  error: null,
  year: null,
  days: [],
};

/** Backward compatibility: normalize API payload (boolean farz/taraweeh → new types). */
function normalizeTrackerDays(days: TrackerDay[]): TrackerDay[] {
  return days.map((d) => {
    const day = { ...d };
    const farzFields = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;
    for (const f of farzFields) {
      const v = (day as Record<string, unknown>)[f];
      if (typeof v === "boolean") {
        (day as Record<string, unknown>)[f] = v ? "on_time" : null;
      }
    }
    const t = (day as Record<string, unknown>).taraweeh;
    if (typeof t === "boolean") {
      (day as Record<string, unknown>).taraweeh = t ? 20 : 0;
    }
    return day;
  });
}

const trackerSlice = createSlice({
  name: "tracker",
  initialState,
  reducers: {
    setTrackerStatus(state, action: PayloadAction<TrackerStatus>) {
      state.status = action.payload;
    },
    setTrackerError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setTrackerYear(state, action: PayloadAction<number | null>) {
      state.year = action.payload;
    },
    setTrackerDays(state, action: PayloadAction<TrackerDay[]>) {
      state.days = normalizeTrackerDays(action.payload);
    },
    updateDayField(
      state,
      action: PayloadAction<{
        dayNumber: number;
        field: TrackerField;
        value: boolean | FarzSalahState | null | number;
      }>
    ) {
      const { dayNumber, field, value } = action.payload;
      const day = state.days.find((d) => d.day_number === dayNumber);
      if (day) {
        (day as Record<string, unknown>)[field] = value;
      }
    },
    resetTracker() {
      return initialState;
    },
  },
});

export const {
  setTrackerStatus,
  setTrackerError,
  setTrackerYear,
  setTrackerDays,
  updateDayField,
  resetTracker,
} = trackerSlice.actions;
export default trackerSlice.reducer;
