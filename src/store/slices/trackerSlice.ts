import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
  taraweeh: boolean;
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
      state.days = action.payload;
    },
    toggleDayField(
      state,
      action: PayloadAction<{ dayNumber: number; field: TrackerField; value: boolean }>
    ) {
      const { dayNumber, field, value } = action.payload;
      const day = state.days.find((d) => d.day_number === dayNumber);
      if (day) {
        day[field] = value;
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
  toggleDayField,
  resetTracker,
} = trackerSlice.actions;
export default trackerSlice.reducer;
