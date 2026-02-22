"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateDayField } from "@/store/slices/trackerSlice";
import { updateTrackerField } from "@/store/thunks/trackerThunks";
import { getFarzCellContainerClassName } from "./cellStyles";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, Clock, Minus, X, Medal } from "lucide-react";
import type { TrackerDay, TrackerField } from "@/store/slices/trackerSlice";
import type { FarzSalahState } from "@/types/tracker";
import { FARZ_SALAH_STATES } from "@/types/tracker";

type Props = {
  day: TrackerDay;
  field: TrackerField;
};

const FARZ_LABELS: Record<FarzSalahState, string> = {
  mosque: "Mosque",
  on_time: "On time",
  qaza: "Qaza",
  missed: "Missed",
  not_applicable: "N/A",
};

function FarzIcon({ state }: { state: FarzSalahState | null }) {
  if (state === "mosque") return <Medal className="h-5 w-5 shrink-0 text-semantics-brand-fg-link" />;
  if (state === "on_time") return <Check className="h-5 w-5 shrink-0 text-semantics-brand-fg-link" />;
  if (state === "qaza") return <Clock className="h-5 w-5 shrink-0 text-semantics-warning-fg-link" />;
  if (state === "missed") return <X className="h-5 w-5 shrink-0 text-semantics-error-fg-link" />;
  return <div className="h-5 w-5 " />;
}

export function PrayerTrackerCell({ day, field }: Props) {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((s) => s.auth.session?.user?.id ?? s.auth.user?.id ?? "");
  const state = day[field] as FarzSalahState | null;
  const [open, setOpen] = useState(false);

  const handleSelect = (value: FarzSalahState | null) => {
    const previous = state;
    dispatch(updateDayField({ dayNumber: day.day_number, field, value }));
    dispatch(
      updateTrackerField({
        userId,
        year: day.year,
        dayNumber: day.day_number,
        date: day.date,
        field,
        value,
        previousValue: previous,
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
          className={getFarzCellContainerClassName(state)}
        >
          <span className="flex items-center justify-center gap-1">
            <FarzIcon state={state} />
            {state === "mosque" && (
              <span className="text-xs font-medium text-semantics-brand-fg-link">Mosque</span>
            )}
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent align="center" className="w-auto p-1">
        <div className="flex flex-col gap-0.5">
          {FARZ_SALAH_STATES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSelect(s)}
              className="flex items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-semantics-base-bg-hover"
            >
              <FarzIcon state={s} />
              <span>{FARZ_LABELS[s]}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleSelect(null)}
            className="flex items-center gap-2 rounded px-2 py-1.5 text-left text-sm text-semantics-base-fg-muted hover:bg-semantics-base-bg-hover"
          >
            <Minus className="h-5 w-5 shrink-0" />
            <span>Clear</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
