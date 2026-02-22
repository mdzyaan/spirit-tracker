"use client";

import { TrackerCell } from "./TrackerCell";
import { PrayerTrackerCell } from "./PrayerTrackerCell";
import type { TrackerDay, TrackerField } from "@/store/slices/trackerSlice";

const PRAYER_FIELDS: TrackerField[] = [
  "fajr",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
  "taraweeh",
];

type Props = { day: TrackerDay };

export function TrackerRow({ day }: Props) {
  return (
    <div className="grid grid-cols-8 gap-px bg-border  grid-rows-1 h-[48px] box-border auto-rows-[47px]">
      <TrackerCell day={day} field="quran" />
      <TrackerCell day={day} field="charity" />
      {PRAYER_FIELDS.map((field) => (
        <PrayerTrackerCell key={field} day={day} field={field} />
      ))}
    </div>
  );
}
