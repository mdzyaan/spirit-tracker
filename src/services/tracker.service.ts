import { createClient } from "@/lib/supabase/client";
import type { TrackerDay, TrackerField } from "@/store/slices/trackerSlice";
import { getRamadanStartForUser } from "@/services/ramadan.service";

export { getRamadanStartForUser };

const RAMADAN_START_MONTH = 2; // March (0-indexed) — placeholder; update per year

export function getRamadanStartDate(year: number): string {
  // Approximate start date — update this map as needed for accurate lunar dates
  const overrides: Record<number, string> = {
    2025: "2025-03-01",
    2026: "2026-02-18",
  };
  if (overrides[year]) return overrides[year];
  return `${year}-0${RAMADAN_START_MONTH + 1}-01`;
}

export async function loadDays(
  userId: string,
  year: number
): Promise<TrackerDay[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tracker_days")
    .select("*")
    .eq("user_id", userId)
    .eq("year", year)
    .order("day_number");
  if (error) throw error;
  return (data ?? []) as TrackerDay[];
}

/** Add n days to YYYY-MM-DD; uses calendar math only (no timezone). */
function addDays(yyyyMmDd: string, n: number): string {
  const d = new Date(yyyyMmDd + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export async function initDays(
  userId: string,
  year: number
): Promise<TrackerDay[]> {
  const supabase = createClient();
  const startDateStr = await getRamadanStartForUser(userId, year);
  const rows = Array.from({ length: 30 }, (_, i) => ({
    user_id: userId,
    year,
    day_number: i + 1,
    date: addDays(startDateStr, i),
  }));
  const { data, error } = await supabase
    .from("tracker_days")
    .upsert(rows, { onConflict: "user_id,year,day_number", ignoreDuplicates: true })
    .select("*")
    .order("day_number");
  if (error) throw error;
  return (data ?? []) as TrackerDay[];
}

/**
 * If existing tracker_days have the wrong start date (e.g. user changed override),
 * update only the date column for each row so checkmarks are preserved.
 */
export async function syncTrackerDatesToStart(
  userId: string,
  year: number
): Promise<TrackerDay[]> {
  const startDateStr = await getRamadanStartForUser(userId, year);
  const existing = await loadDays(userId, year);
  if (existing.length === 0) return existing;
  const expectedDateForDay = (dayNum: number) =>
    addDays(startDateStr, dayNum - 1);
  const supabase = createClient();
  for (const day of existing) {
    const expected = expectedDateForDay(day.day_number);
    if (day.date !== expected) {
      const { error } = await supabase
        .from("tracker_days")
        .update({ date: expected })
        .eq("id", day.id);
      if (error) throw error;
    }
  }
  return loadDays(userId, year);
}

export async function toggleDay(
  userId: string,
  year: number,
  dayNumber: number,
  date: string,
  field: TrackerField,
  value: boolean
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("tracker_days").upsert(
    {
      user_id: userId,
      year,
      day_number: dayNumber,
      date,
      [field]: value,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,year,day_number" }
  );
  if (error) throw error;
}
