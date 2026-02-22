import { getRamadanStartDate } from "@/services/tracker.service";
import { getRamadanOverrideStart } from "@/services/user-settings.service";

const ALADHAN_BASE = "https://api.aladhan.com/v1";
const RAMADAN_HIJRI_MONTH = 9;

/** In-memory cache: year -> YYYY-MM-DD. */
const startDateCache = new Map<number, string>();

/**
 * Get Ramadan 1st Gregorian date for a given year using Aladhan Hijri calendar.
 * Returns YYYY-MM-DD. Falls back to getRamadanStartDate on error.
 */
export async function getRamadanStartByYear(year: number): Promise<string> {
  const cached = startDateCache.get(year);
  // if (cached) return cached;

  const hijriYear = 1445 + (year - 2024);
  const url = `${ALADHAN_BASE}/hToGCalendar/${RAMADAN_HIJRI_MONTH}/${hijriYear}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Aladhan ${res.status}`);
    const json = (await res.json()) as {
      code?: number;
      data?: Array<{ gregorian?: { date?: string } }>;
    };
    if (json.code !== 200 || !json.data?.length) throw new Error("Invalid response");
    const first = json.data[0];
    const ddmmyyyy = first.gregorian?.date;
    if (!ddmmyyyy) throw new Error("No date");
    const [d, m, y] = ddmmyyyy.split("-");
    const gregorianYear = parseInt(y!, 10);
    if (gregorianYear !== year) {
      const altHijri = hijriYear + (gregorianYear > year ? -1 : 1);
      const altUrl = `${ALADHAN_BASE}/hToGCalendar/${RAMADAN_HIJRI_MONTH}/${altHijri}`;
      const altRes = await fetch(altUrl);
      if (!altRes.ok) throw new Error("Alt year fetch failed");
      const altJson = (await altRes.json()) as { code?: number; data?: Array<{ gregorian?: { date?: string } }> };
      if (altJson.code !== 200 || !altJson.data?.length) throw new Error("Alt invalid");
      const altDdmmyyyy = altJson.data[0].gregorian?.date;
      if (!altDdmmyyyy) throw new Error("No alt date");
      const [ad, am, ay] = altDdmmyyyy.split("-");
      const out = `${ay}-${am!.padStart(2, "0")}-${ad!.padStart(2, "0")}`;
      startDateCache.set(year, out);
      return out;
    }
    const out = `${y}-${m!.padStart(2, "0")}-${d!.padStart(2, "0")}`;
    startDateCache.set(year, out);
    return out;
  } catch {
    const fallback = getRamadanStartDate(year);
    return fallback;
  }
}

/**
 * Resolve Ramadan start date for a user and year:
 * 1. If user has ramadan_override_start and its year matches → use it.
 * 2. Else use Aladhan API by year, fallback to getRamadanStartDate on error.
 */
export async function getRamadanStartForUser(
  userId: string,
  year: number
): Promise<string> {
  const override = await getRamadanOverrideStart(userId);
  if (override) {
    const overrideYear = new Date(override + "T12:00:00Z").getUTCFullYear();
    if (overrideYear === year) return override;
  }
  return getRamadanStartByYear(year);
}
