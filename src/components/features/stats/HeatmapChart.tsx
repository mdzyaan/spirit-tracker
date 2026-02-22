"use client";

import { useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import type { ChartsData } from "@/store/slices/statsSlice";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type HeatmapItem = ChartsData["heatmap"][number];

export function HeatmapChart() {
  const chartsData = useAppSelector((s: RootState) => s.stats.chartsData);
  const heatmap: HeatmapItem[] = chartsData?.heatmap ?? [];

  if (heatmap.length === 0) {
    return (
      <Card className="border-border">
        <CardHeader className="text-sm font-medium text-foreground">
          Daily activity
        </CardHeader>
        <CardContent className="h-48 flex items-center justify-center text-muted-foreground">
          No data yet
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader className="text-sm font-medium text-foreground">
        Daily activity
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-10 gap-1">
          {heatmap.map(({ day, value }) => (
            <div
              key={day}
              className={`aspect-square rounded-sm border border-border flex items-center justify-center text-xs ${value === 0 ? "text-muted-foreground" : "text-primary-foreground font-bold"}`}
              style={{
                backgroundColor:
                  value === 0
                    ? "var(--muted)"
                    : value === 1
                      ? "var(--primary)"
                      : "var(--primary)",
                opacity: value === 0 ? 0.3 : 0.4 + value * 0.3,
              }}
              title={`Day ${day}`}
            >
              {day}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
