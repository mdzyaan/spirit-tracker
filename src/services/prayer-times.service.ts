const ALADHAN_BASE = "https://api.aladhan.com/v1";

export type PrayerTimings = {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};

type AladhanTimingsResponse = {
  code?: number;
  data?: {
    timings?: {
      Fajr?: string;
      Dhuhr?: string;
      Asr?: string;
      Maghrib?: string;
      Isha?: string;
    };
  };
};

/**
 * Fetch today's prayer times from Aladhan API using stored user coordinates.
 * Returns null if location is not set or the API call fails.
 */
export async function getPrayerTimings(
  lat: number,
  lng: number,
  method: number
): Promise<PrayerTimings | null> {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lng),
      method: String(method),
    });
    const res = await fetch(
      `${ALADHAN_BASE}/timings/${timestamp}?${params}`
    );
    if (!res.ok) return null;
    const json = (await res.json()) as AladhanTimingsResponse;
    if (json.code !== 200 || !json.data?.timings) return null;
    const t = json.data.timings;
    if (!t.Fajr || !t.Dhuhr || !t.Asr || !t.Maghrib || !t.Isha) return null;
    return {
      Fajr: t.Fajr,
      Dhuhr: t.Dhuhr,
      Asr: t.Asr,
      Maghrib: t.Maghrib,
      Isha: t.Isha,
    };
  } catch {
    return null;
  }
}

/** Format a 24h time string like "05:31" to "5:31 AM" */
export function formatPrayerTime(time: string): string {
  const [hourStr, minStr] = time.split(":");
  const hour = parseInt(hourStr ?? "0", 10);
  const min = minStr ?? "00";
  const period = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${min} ${period}`;
}
