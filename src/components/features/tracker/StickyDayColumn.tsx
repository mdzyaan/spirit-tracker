"use client";

import { cn } from "@/lib/utils";
import type { TrackerDay } from "@/store/slices/trackerSlice";

type Props = { days: TrackerDay[] };

export function StickyDayColumn({ days }: Props) {
  return (
    <div className="sticky left-[72px] z-50 flex flex-col min-w-[56px] bg-card border-r border-border">
      <div className="sticky top-0 z-20 h-8 text-xs flex items-center justify-center bg-muted border-b border-border font-medium text-muted-foreground text-sm shrink-0">
        Day
      </div>
      {days.map((day) => (
        <div
          key={day.id}
          className={cn(
            "h-[48px] box-border flex items-center justify-center border-b border-border text-sm font-medium text-foreground shrink-0"
          )}
        >
          {day.day_number}
        </div>
      ))}
    </div>
  );
}
