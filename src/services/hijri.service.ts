import { createClient } from "@/lib/supabase/client";

const ALADHAN_GTOH = "https://api.aladhan.com/v1/gToH";
const RAMADAN_HIJRI_MONTH = 9;

export type HijriResult = {
  date: string;
  day: string;
  month: { number: number };
  year: string;
};

export type GToHResponse = {
  code?: number;
  data?: HijriResult;
};

/** Format YYYY-MM-DD to DD-MM-YYYY for Aladhan API. */
function toDdMmYyyy(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`;
}

/**
 * Fetch Hijri date for a Gregorian date using Aladhan gToH.
 * Uses hijri_calendar_cache: same (year, month, lat, lng, method) returns cached data.
 */
export async function getHijriForDate(
  dateIso: string,
  latitude: number,
  longitude: number,
  method: number
): Promise<HijriResult | null> {
  const [y, m, d] = dateIso.split("-").map(Number);
  const supabase = createClient();

  const { data: cached } = await supabase
    .from("hijri_calendar_cache")
    .select("data")
    .eq("year", y!)
    .eq("month", m!)
    .eq("day", d!)
    .eq("latitude", latitude)
    .eq("longitude", longitude)
    .eq("method", method)
    .maybeSingle();

  if (cached?.data && typeof cached.data === "object" && "date" in (cached.data as object)) {
    const parsed = cached.data as unknown as HijriResult;
    if (parsed.month?.number != null) return parsed;
  }

  const dateParam = toDdMmYyyy(dateIso);
  const url = `${ALADHAN_GTOH}?date=${dateParam}&latitude=${latitude}&longitude=${longitude}&method=${method}`;

  const res = await fetch(url);
  if (!res.ok) return null;
  const json = (await res.json()) as GToHResponse;
  if (json.code !== 200 || !json.data) return null;

  const data = json.data;
  await supabase.from("hijri_calendar_cache").insert({
    year: y!,
    month: m!,
    day: d!,
    latitude,
    longitude,
    method,
    data: data as unknown as Record<string, unknown>,
  });

  return data;
}

/** Returns true if the given date falls in Ramadan (Hijri month 9) for the given location/method. */
export async function isRamadanDate(
  dateIso: string,
  latitude: number,
  longitude: number,
  method: number
): Promise<boolean> {
  const hijri = await getHijriForDate(dateIso, latitude, longitude, method);
  return hijri?.month?.number === RAMADAN_HIJRI_MONTH;
}
