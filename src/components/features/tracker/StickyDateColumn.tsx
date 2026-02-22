"use client";

import { cn } from "@/lib/utils";
import type { TrackerDay } from "@/store/slices/trackerSlice";

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y!, m! - 1, d!);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

type Props = { days: TrackerDay[] };

export function StickyDateColumn({ days }: Props) {
  return (
    <div className="sticky left-0 z-50 flex flex-col min-w-[72px] bg-card border-r border-border">
      <div className="sticky top-0 z-20 h-8 text-xs flex items-center justify-center bg-muted border-b border-border font-medium text-muted-foreground text-sm shrink-0">
        Date
      </div>
      {days.map((day) => (
        <div
          key={day.id}
          className={cn(
            "h-[48px] box-border flex items-center justify-center border-b border-border text-sm font-medium text-foreground shrink-0"
          )}
        >
          {formatDate(day.date)}
        </div>
      ))}
    </div>
  );
}
