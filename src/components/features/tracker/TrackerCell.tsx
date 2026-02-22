"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateDayField } from "@/store/slices/trackerSlice";
import { updateTrackerField } from "@/store/thunks/trackerThunks";
import { getQuranCharityCellContainerClassName } from "./cellStyles";
import { Check } from "lucide-react";
import type { TrackerDay, TrackerField } from "@/store/slices/trackerSlice";

type Props = {
  day: TrackerDay;
  field: TrackerField;
};

export function TrackerCell({ day, field }: Props) {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((s) => s.auth.session?.user?.id ?? s.auth.user?.id ?? "");
  const value = day[field] as boolean;

  const handleToggle = () => {
    const next = !value;
    dispatch(updateDayField({ dayNumber: day.day_number, field, value: next }));
    dispatch(
      updateTrackerField({
        userId,
        year: day.year,
        dayNumber: day.day_number,
        date: day.date,
        field,
        value: next,
        previousValue: value,
      })
    ).catch(() => {});
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleToggle();
        }
      }}
      className={getQuranCharityCellContainerClassName(value)}
    >
      {value && <Check className="h-5 w-5 text-semantics-brand-fg-link shrink-0" />}
    </div>
  );
}
