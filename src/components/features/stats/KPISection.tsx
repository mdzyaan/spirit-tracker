"use client";

import Image from "next/image";
import { useAppSelector } from "@/store/hooks";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function KPISection() {
  const stats = useAppSelector((s) => s.stats.stats);
  const loading = useAppSelector((s) => s.stats.loading);

  const kpis = [
    { label: "Quran days", value: stats?.totalQuranDays ?? 0, icon: "/assets/quran.png" },
    { label: "Charity days", value: stats?.totalCharityDays ?? 0 },
    { label: "Salah completion %", value: `${stats?.salahCompletionPercent ?? 0}%`, icon: "/assets/mosque.png" },
    { label: "Current streak", value: stats?.currentStreak ?? 0, icon: "/assets/hot-streak.png" },
    { label: "Longest streak", value: stats?.longestStreak ?? 0, icon: "/assets/star.png" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {kpis.map((kpi) => (
        <Card key={kpi.label} className="border-border">
          <CardHeader className="pb-1 text-sm font-medium text-muted-foreground flex flex-row items-center gap-2">
            {kpi.icon && (
              <span className="relative w-5 h-5 shrink-0">
                <Image
                  src={kpi.icon}
                  alt=""
                  width={20}
                  height={20}
                  className="object-contain"
                  unoptimized
                />
              </span>
            )}
            {kpi.label}
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-2xl font-semibold text-muted-foreground">—</p>
            ) : (
              <p className="text-2xl font-semibold text-foreground">{kpi.value}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
