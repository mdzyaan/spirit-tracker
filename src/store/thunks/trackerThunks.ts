import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "../store";
import {
  setTrackerStatus,
  setTrackerError,
  setTrackerYear,
  setTrackerDays,
  updateDayField,
} from "../slices/trackerSlice";
import type { TrackerDay, TrackerField } from "../slices/trackerSlice";
import type { TrackerFieldValue } from "@/services/tracker.service";
import * as trackerService from "@/services/tracker.service";

const FETCH_TIMEOUT_MS = 15000;

export const fetchTrackerData = createAsyncThunk<
  void,
  { userId: string; year?: number },
  { state: RootState; dispatch: AppDispatch }
>("tracker/fetch", async ({ userId, year }, { dispatch }) => {
  dispatch(setTrackerStatus("loading"));
  dispatch(setTrackerError(null));

  const y = year ?? new Date().getFullYear();

  const fetchPromise = (async () => {
    let days = await trackerService.loadDays(userId, y);
    if (days.length === 0) {
      days = await trackerService.initDays(userId, y);
    } else {
      const startDate = await trackerService.getRamadanStartForUser(userId, y);
      const expectedFirst = days[0]?.date;
      if (expectedFirst && expectedFirst !== startDate) {
        days = await trackerService.syncTrackerDatesToStart(userId, y);
      }
    }
    return { y, days };
  })();

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(
      () => reject(new Error("Request timed out. Please check your connection and try again.")),
      FETCH_TIMEOUT_MS
    )
  );

  try {
    const { y: resolvedYear, days } = await Promise.race([fetchPromise, timeoutPromise]);
    dispatch(setTrackerYear(resolvedYear));
    dispatch(setTrackerDays(days as TrackerDay[]));
    dispatch(setTrackerStatus("succeeded"));
  } catch (err) {
    const message =
      err && typeof err === "object" && "message" in err
        ? String((err as { message: unknown }).message)
        : "Failed to load tracker";
    dispatch(setTrackerError(message));
    dispatch(setTrackerStatus("failed"));
    throw err;
  }
});

export const updateTrackerField = createAsyncThunk<
  void,
  {
    userId: string;
    year: number;
    dayNumber: number;
    date: string;
    field: TrackerField;
    value: TrackerFieldValue;
    previousValue: TrackerFieldValue;
  },
  { state: RootState; dispatch: AppDispatch }
>(
  "tracker/updateField",
  async (
    { userId, year, dayNumber, date, field, value, previousValue },
    { dispatch }
  ) => {
    try {
      await trackerService.updateDayField(
        userId,
        year,
        dayNumber,
        date,
        field,
        value
      );
    } catch {
      dispatch(updateDayField({ dayNumber, field, value: previousValue }));
      throw new Error("Failed to save");
    }
  }
);
