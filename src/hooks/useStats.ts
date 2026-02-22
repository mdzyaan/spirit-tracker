"use client";

import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setStats, setChartsData, setStatsLoading } from "@/store/slices/statsSlice";
import type { TrackerDay } from "@/store/slices/trackerSlice";

const PRAYER_FIELDS = ["fajr", "dhuhr", "asr", "maghrib", "isha", "taraweeh"] as const;

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
    const completedSalah = days.reduce(
      (acc, d) => acc + PRAYER_FIELDS.filter((p) => d[p]).length,
      0
    );
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

    const prayer = PRAYER_FIELDS.map((p) => ({
      prayer: p,
      completed: days.filter((d) => d[p]).length,
      total: days.length,
    }));

    dispatch(setChartsData({ heatmap, streak, completion, prayer }));
  }, [trackerStatus, days, dispatch]);

  const { stats, chartsData, loading } = useAppSelector((s) => s.stats);
  return { stats, chartsData, loading };
}
