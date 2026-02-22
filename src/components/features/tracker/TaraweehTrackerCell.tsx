"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateDayField } from "@/store/slices/trackerSlice";
import { updateTrackerField } from "@/store/thunks/trackerThunks";
import { getTaraweehCellContainerClassName } from "./cellStyles";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { TrackerDay } from "@/store/slices/trackerSlice";
import { Minus } from "lucide-react";
const TARAWEEH_OPTIONS = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20] as const;

type Props = {
  day: TrackerDay;
};

export function TaraweehTrackerCell({ day }: Props) {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((s) => s.auth.session?.user?.id ?? s.auth.user?.id ?? "");
  const value = day.taraweeh ?? 0;
  const [open, setOpen] = useState(false);

  const handleSelect = (n: number) => {
    const previous = day.taraweeh;
    const next = n === 0 ? null : n;
    dispatch(updateDayField({ dayNumber: day.day_number, field: "taraweeh", value: next }));
    dispatch(
      updateTrackerField({
        userId,
        year: day.year,
        dayNumber: day.day_number,
        date: day.date,
        field: "taraweeh",
        value: next ?? 0,
        previousValue: previous ?? 0,
      })
    ).catch(() => {});
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen((o) => !o);
            }
          }}
          className={getTaraweehCellContainerClassName(value)}
        >
          {value > 0 ? (
            <span className="text-sm font-medium text-semantics-brand-fg-link">{value}</span>
          ) : null}
        </div>
      </PopoverTrigger>
      <PopoverContent align="center" className="w-auto p-2">
        <div className="grid grid-cols-5 gap-1">
          {TARAWEEH_OPTIONS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => handleSelect(n)}
              className={cn(
                "rounded px-2 py-1.5 text-sm",
                n === 0
                  ? "text-semantics-base-fg-muted hover:bg-semantics-base-bg-hover"
                  : "hover:bg-semantics-brand-bg-glow",
                value === n && "bg-semantics-brand-bg-soft"
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
