"use client";

import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setStats, setChartsData, setStatsLoading } from "@/store/slices/statsSlice";
import type { TrackerDay } from "@/store/slices/trackerSlice";
import { isFarzCompleted, type FarzSalahState } from "@/types/tracker";

const FARZ_FIELDS = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;
const PRAYER_FIELDS = [...FARZ_FIELDS, "taraweeh"] as const;

function computeStreaks(days: TrackerDay[]): { current: number; longest: number } {
  let current = 0;
  let longest = 0;
  let run = 0;
  // Walk backwards from latest day
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].quran) {
      run++;
      if (i === days.length - 1) current = run;
      longest = Math.max(longest, run);
    } else {
      if (current === 0 && run > 0) current = run;
      run = 0;
    }
  }
  if (current === 0 && run > 0) current = run;
  return { current, longest };
}

export function useStats() {
  const dispatch = useAppDispatch();
  const days = useAppSelector((s) => s.tracker.days);
  const trackerStatus = useAppSelector((s) => s.tracker.status);

  useEffect(() => {
    if (trackerStatus !== "succeeded" || days.length === 0) return;

    dispatch(setStatsLoading(false));

    // KPIs
    const totalQuranDays = days.filter((d) => d.quran).length;
    const totalCharityDays = days.filter((d) => d.charity).length;
    const totalSalahSlots = days.length * PRAYER_FIELDS.length;
    const completedSalah = days.reduce((acc, d) => {
      const farzCompleted = FARZ_FIELDS.filter((p) =>
        isFarzCompleted(d[p] as FarzSalahState | null)
      ).length;
      const taraweehCompleted = (d.taraweeh ?? 0) > 0 ? 1 : 0;
      return acc + farzCompleted + taraweehCompleted;
    }, 0);
    const salahCompletionPercent =
      totalSalahSlots > 0 ? Math.round((completedSalah / totalSalahSlots) * 100) : 0;
    const { current: currentStreak, longest: longestStreak } = computeStreaks(days);

    dispatch(
      setStats({ totalQuranDays, totalCharityDays, salahCompletionPercent, currentStreak, longestStreak })
    );

    // Charts data
    const heatmap = days.map((d) => ({
      day: d.day_number,
      value: (d.quran ? 1 : 0) + (d.charity ? 1 : 0),
    }));

    const streak = days.map((d) => ({
      date: d.date,
      streak: d.quran ? 1 : 0,
    }));

    const completion = [
      { category: "Quran", completed: totalQuranDays, total: days.length },
      { category: "Charity", completed: totalCharityDays, total: days.length },
    ];

    const prayer = PRAYER_FIELDS.map((p) => {
      const completed =
        p === "taraweeh"
          ? days.filter((d) => (d.taraweeh ?? 0) > 0).length
          : days.filter((d) => isFarzCompleted(d[p] as FarzSalahState | null)).length;
      return { prayer: p, completed, total: days.length };
    });

    dispatch(setChartsData({ heatmap, streak, completion, prayer }));
  }, [trackerStatus, days, dispatch]);

  const { stats, chartsData, loading } = useAppSelector((s) => s.stats);
  return { stats, chartsData, loading };
}
