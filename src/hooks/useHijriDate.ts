"use client";

import { useEffect, useState } from "react";

function toDDMMYYYY(d: Date): string {
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

const HIJRI_MONTH_NAMES = [
  "Muharram",
  "Safar",
  "Rabi al-Awwal",
  "Rabi al-Thani",
  "Jumada al-Awwal",
  "Jumada al-Thani",
  "Rajab",
  "Sha'ban",
  "Ramadan",
  "Shawwal",
  "Dhu al-Qi'dah",
  "Dhu al-Hijjah",
];

export type HijriDate = {
  day: number;
  month: number;
  year: number;
  monthName: string;
  formatted: string;
} | null;

function formatHijri(day: number, month: number, year: number): string {
  const monthName = HIJRI_MONTH_NAMES[month - 1] ?? "—";
  return `${day} ${monthName} ${year} AH`;
}

export function useHijriDate(): { hijri: HijriDate; loading: boolean; error: boolean } {
  const [hijri, setHijri] = useState<HijriDate>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const today = new Date();
    const dateStr = toDDMMYYYY(today);

    setLoading(true);
    setError(false);
    fetch(`https://api.aladhan.com/v1/gToH?date=${dateStr}`)
      .then((res) => res.json())
      .then((data) => {
        const h = data?.data?.hijri;
        if (h?.day && h?.month?.number && h?.year) {
          setHijri({
            day: Number(h.day),
            month: Number(h.month.number),
            year: Number(h.year),
            monthName: h.month.en ?? HIJRI_MONTH_NAMES[Number(h.month.number) - 1],
            formatted: formatHijri(
              Number(h.day),
              Number(h.month.number),
              Number(h.year)
            ),
          });
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return { hijri, loading, error };
}
