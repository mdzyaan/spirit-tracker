const AYAH_API = "https://api.alquran.cloud/v1";

/** Curated uplifting verses: mercy, fasting, reward, love, forgiveness. (surah, ayah) */
export const CURATED_AYAT: Array<{ surah: number; ayah: number }> = [
  { surah: 2, ayah: 183 },   // Fasting prescribed
  { surah: 2, ayah: 186 },   // When My servants ask you about Me, I am near
  { surah: 2, ayah: 277 },   // Those who believe and do righteous deeds
  { surah: 3, ayah: 31 },    // Say, if you love Allah, follow me
  { surah: 3, ayah: 134 },   // Those who spend in ease and hardship, control anger, pardon people
  { surah: 4, ayah: 36 },    // Worship Allah, be kind to parents
  { surah: 5, ayah: 32 },    // Whoever saves a life
  { surah: 7, ayah: 56 },    // Do not spread corruption; He has mercy
  { surah: 9, ayah: 71 },    // Believers, men and women, are allies; they enjoin good
  { surah: 14, ayah: 7 },    // If you are grateful, I will increase you
  { surah: 17, ayah: 24 },   // Lower to them the wing of humility out of mercy
  { surah: 25, ayah: 63 },   // Servants of the Merciful walk gently
  { surah: 28, ayah: 77 },   // Do good; Allah loves the doers of good
  { surah: 39, ayah: 53 },   // Do not despair of Allah's mercy
  { surah: 42, ayah: 30 },   // Whatever affliction is from yourselves
  { surah: 57, ayah: 21 },   // Race toward forgiveness from your Lord
  { surah: 93, ayah: 5 },    // Your Lord will give you and you will be pleased
  { surah: 94, ayah: 5 },    // With hardship comes ease
  { surah: 2, ayah: 152 },   // Remember Me; I will remember you
];

export type AyahData = {
  arabic: string;
  english: string;
  surahName: string;
  surahNumber: number;
  ayahNumber: number;
};

/** Simple hash of a string to index into curated list. */
function hashToIndex(str: string, max: number): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h % max;
}

/** Pick a curated verse key for the given date (stable per day). */
export function getCuratedKeyForDate(date: Date): { surah: number; ayah: number } {
  const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  const idx = hashToIndex(key, CURATED_AYAT.length);
  return CURATED_AYAT[idx]!;
}

/** Pick a random different key from curated list (for refresh). */
export function getRandomCuratedKey(current?: { surah: number; ayah: number }): { surah: number; ayah: number } {
  const filtered = current
    ? CURATED_AYAT.filter((k) => k.surah !== current.surah || k.ayah !== current.ayah)
    : CURATED_AYAT;
  const arr = filtered.length ? filtered : CURATED_AYAT;
  return arr[Math.floor(Math.random() * arr.length)]!;
}

/** Fetch one verse (Arabic + English) from Al-Quran Cloud. */
export async function fetchAyah(surah: number, ayah: number): Promise<AyahData | null> {
  const url = `${AYAH_API}/ayah/${surah}:${ayah}/editions/ar.quran-uthmani,en.sahih`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = (await res.json()) as {
      code?: number;
      data?: Array<{
        text?: string;
        edition?: { language?: string };
        surah?: { englishName?: string; number?: number };
        numberInSurah?: number;
      }>;
    };
    if (json.code !== 200 || !json.data?.length) return null;
    const arabicItem = json.data.find((d) => d.edition?.language === "ar");
    const englishItem = json.data.find((d) => d.edition?.language === "en");
    const surahInfo = arabicItem?.surah ?? englishItem?.surah;
    if (!surahInfo || !englishItem?.text) return null;
    return {
      arabic: arabicItem?.text ?? "",
      english: englishItem.text,
      surahName: surahInfo.englishName ?? "",
      surahNumber: surahInfo.number ?? surah,
      ayahNumber: englishItem.numberInSurah ?? ayah,
    };
  } catch {
    return null;
  }
}

const CACHE_KEY_PREFIX = "ayah_card_";

/** Get cache key for date. */
export function getAyahCacheKey(date: Date): string {
  const d = date.getDate();
  const m = date.getMonth();
  const y = date.getFullYear();
  return `${CACHE_KEY_PREFIX}${y}-${m}-${d}`;
}

/** Load cached Ayah from localStorage (client only). */
export function getCachedAyah(date: Date): AyahData | null {
  if (typeof window === "undefined") return null;
  try {
    const key = getAyahCacheKey(date);
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as AyahData;
  } catch {
    return null;
  }
}

/** Save Ayah to cache (client only). */
export function setCachedAyah(date: Date, data: AyahData): void {
  if (typeof window === "undefined") return;
  try {
    const key = getAyahCacheKey(date);
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
}
