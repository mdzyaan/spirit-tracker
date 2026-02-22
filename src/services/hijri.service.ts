const ALADHAN_BASE = "https://api.aladhan.com/v1";

export type HijriDate = {
  day: number;
  monthEn: string;
  year: string;
  formatted: string;
  month?: { number: number };
};

/** Result type for onboarding (check if Ramadan). */
export type HijriMonthResult = { month: { number: number } } | null;

type HijriApiResponse = {
  code?: number;
  data?: {
    hijri?: {
      day?: string;
      month?: { en?: string; number?: number };
      year?: string;
    };
  };
};

async function fetchHijriFromAladhan(ddMmYyyy: string): Promise<HijriApiResponse["data"] | null> {
  const url = `${ALADHAN_BASE}/gToH?date=${ddMmYyyy}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = (await res.json()) as HijriApiResponse;
    if (json.code !== 200 || !json.data?.hijri) return null;
    return json.data;
  } catch {
    return null;
  }
}

/**
 * Get Hijri date for a given Gregorian date using Aladhan API.
 * @param date - Gregorian date (default: today in local timezone)
 * @returns HijriDate or null on error
 */
export async function getHijriForDate(
  date?: Date
): Promise<HijriDate | null>;

/**
 * Get Hijri month for a given date (used by onboarding to check if Ramadan).
 * Lat/lng and calculation_method are accepted for API compatibility but gToH does not use them.
 */
export async function getHijriForDate(
  todayIso: string,
  _lat: number,
  _lng: number,
  _calculation_method: number
): Promise<HijriMonthResult>;

// Implementation supports both (date?) and (iso, lat, lng, method) for onboarding
export async function getHijriForDate(
  dateOrIso: Date | string | undefined,
  lat?: number,
  lng?: number,
  calculation_method?: number
): Promise<HijriDate | HijriMonthResult | null> {
  const date = typeof dateOrIso === "undefined" ? new Date() : dateOrIso;
  void lat;
  void lng;
  void calculation_method;
  let ddMmYyyy: string;
  if (typeof date === "string") {
    const [y, m, d] = date.split("-");
    if (!y || !m || !d) return null;
    ddMmYyyy = `${d}-${m}-${y}`;
  } else {
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();
    ddMmYyyy = `${String(d).padStart(2, "0")}-${String(m).padStart(2, "0")}-${y}`;
  }

  const data = await fetchHijriFromAladhan(ddMmYyyy);
  if (!data?.hijri) return null;

  const h = data.hijri;
  const monthNum = h.month?.number ?? 0;

  if (typeof date === "string") {
    return { month: { number: monthNum } };
  }

  const day = parseInt(h.day ?? "0", 10);
  const monthEn = h.month?.en ?? "";
  const year = h.year ?? "";
  const formatted = `${day} ${monthEn} ${year} AH`;
  return { day, monthEn, year, formatted, month: { number: monthNum } };
}
