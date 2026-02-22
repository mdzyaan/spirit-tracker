"use client";

import { HeatmapChart } from "./HeatmapChart";
import { StreakChart } from "./StreakChart";
import { CompletionBarChart } from "./CompletionBarChart";
import { PrayerCompletionChart } from "./PrayerCompletionChart";

export function StatsCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <HeatmapChart />
      <StreakChart />
      <CompletionBarChart />
      <PrayerCompletionChart />
    </div>
  );
}
