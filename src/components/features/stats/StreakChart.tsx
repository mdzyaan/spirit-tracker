"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAppSelector } from "@/store/hooks";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function StreakChart() {
  const chartsData = useAppSelector((s) => s.stats.chartsData);
  const streak = chartsData?.streak ?? [];

  if (streak.length === 0) {
    return (
      <Card className="border-border">
        <CardHeader className="text-sm font-medium text-foreground">
          Streak
        </CardHeader>
        <CardContent className="h-48 flex items-center justify-center text-muted-foreground">
          No data yet
        </CardContent>
      </Card>
    );
  }

  const data = streak.map((s) => ({
    ...s,
    label: s.date.slice(5),
  }));

  return (
    <Card className="border-border">
      <CardHeader className="text-sm font-medium text-foreground">
        Streak
      </CardHeader>
      <CardContent className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10 }}
              stroke="var(--muted-foreground)"
            />
            <YAxis
              domain={[0, 1]}
              tick={{ fontSize: 10 }}
              stroke="var(--muted-foreground)"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
              }}
              labelStyle={{ color: "var(--foreground)" }}
            />
            <Line
              type="monotone"
              dataKey="streak"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={{ fill: "var(--primary)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
