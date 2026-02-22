"use client";

import { TrackerCell } from "./TrackerCell";
import { PrayerTrackerCell } from "./PrayerTrackerCell";
import { TaraweehTrackerCell } from "./TaraweehTrackerCell";
import type { TrackerDay } from "@/store/slices/trackerSlice";
import { FARZ_FIELDS } from "@/types/tracker";

type Props = { day: TrackerDay };

export function TrackerRow({ day }: Props) {
  return (
    <div className="grid grid-cols-8 gap-px bg-border  grid-rows-1 h-[48px] box-border auto-rows-[47px]">
      <TrackerCell day={day} field="quran" />
      <TrackerCell day={day} field="charity" />
      {FARZ_FIELDS.map((field) => (
        <PrayerTrackerCell key={field} day={day} field={field} />
      ))}
      <TaraweehTrackerCell day={day} />
    </div>
  );
}
