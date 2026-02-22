"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAppSelector } from "@/store/hooks";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function PrayerCompletionChart() {
  const chartsData = useAppSelector((s) => s.stats.chartsData);
  const prayer = chartsData?.prayer ?? [];

  if (prayer.length === 0) {
    return (
      <Card className="border-border">
        <CardHeader className="text-sm font-medium text-foreground">
          Prayer completion
        </CardHeader>
        <CardContent className="h-48 flex items-center justify-center text-muted-foreground">
          No data yet
        </CardContent>
      </Card>
    );
  }

  const data = prayer.map((p) => ({
    name: p.prayer.charAt(0).toUpperCase() + p.prayer.slice(1),
    completed: p.completed,
    total: p.total,
    pct: p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0,
  }));

  return (
    <Card className="border-border">
      <CardHeader className="text-sm font-medium text-foreground">
        Prayer completion
      </CardHeader>
      <CardContent className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 4, right: 4, left: 4, bottom: 4 }}
          >
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }}
              stroke="var(--muted-foreground)"
            />
            <YAxis
              tick={{ fontSize: 10 }}
              stroke="var(--muted-foreground)"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
              }}
              formatter={(value: number) => [value, "Days"]}
            />
            <Bar
              dataKey="completed"
              fill="var(--primary)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
