"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Checkbox } from "@/components/ui/checkbox";
import { toggleDayField } from "@/store/slices/trackerSlice";
import { toggleTrackerField } from "@/store/thunks/trackerThunks";
import { cn } from "@/lib/utils";
import type { TrackerDay, TrackerField } from "@/store/slices/trackerSlice";

type Props = {
  day: TrackerDay;
  field: TrackerField;
};

export function TrackerCell({ day, field }: Props) {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((s) => s.auth.session?.user?.id ?? s.auth.user?.id ?? "");
  const isChecked = day[field];

  const handleToggle = () => {
    const next = !isChecked;
    // Optimistic update
    dispatch(toggleDayField({ dayNumber: day.day_number, field, value: next }));
    // Persist — rollback on failure
    dispatch(
      toggleTrackerField({
        userId,
        year: day.year,
        dayNumber: day.day_number,
        date: day.date,
        field,
        value: next,
        previous: isChecked,
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
      className={cn(
        "w-full min-h-[48px] h-full p-2 flex items-center justify-center bg-card cursor-pointer select-none border-b border-border last:border-b-0",
        isChecked && "bg-primary/10"
      )}
    >
      <Checkbox checked={isChecked} onCheckedChange={handleToggle} className="pointer-events-none" />
    </div>
  );
}
