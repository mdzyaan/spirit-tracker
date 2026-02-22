"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useAppSelector } from "@/store/hooks";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function CompletionBarChart() {
  const chartsData = useAppSelector((s) => s.stats.chartsData);
  const completion = chartsData?.completion ?? [];

  if (completion.length === 0) {
    return (
      <Card className="border-border">
        <CardHeader className="text-sm font-medium text-foreground">
          Completion overview
        </CardHeader>
        <CardContent className="h-48 flex items-center justify-center text-muted-foreground">
          No data yet
        </CardContent>
      </Card>
    );
  }

  const data = completion.map((c) => ({
    name: c.category,
    completed: c.completed,
    total: c.total,
    pct: c.total > 0 ? Math.round((c.completed / c.total) * 100) : 0,
  }));

  return (
    <Card className="border-border">
      <CardHeader className="text-sm font-medium text-foreground">
        Completion overview
      </CardHeader>
      <CardContent className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 24, left: 4, bottom: 4 }}
          >
            <XAxis
              type="number"
              domain={[0, 30]}
              tick={{ fontSize: 10 }}
              stroke="var(--muted-foreground)"
            />
            <YAxis
              type="category"
              dataKey="name"
              width={60}
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
            <Bar dataKey="completed" fill="var(--primary)" radius={[0, 4, 4, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill="var(--primary)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
