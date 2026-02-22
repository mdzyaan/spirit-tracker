import type { FarzSalahState } from "@/types/tracker";
import type { TrackerDay } from "@/store/slices/trackerSlice";

const FARZ_FIELDS = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;

/** Dim class for tracker row/column hover overlay (state-aware). */
export function getHoverDimClass(field: string, day: TrackerDay): string {
  if (field === "quran" || field === "charity") {
    return (day[field as "quran" | "charity"] ? "tracker-hover-dim-brand" : "tracker-hover-dim-muted");
  }
  if (FARZ_FIELDS.includes(field as (typeof FARZ_FIELDS)[number])) {
    const state = day[field as (typeof FARZ_FIELDS)[number]] as FarzSalahState | null;
    if (state === "mosque" || state === "on_time") return "tracker-hover-dim-brand";
    if (state === "qaza") return "tracker-hover-dim-warning";
    if (state === "missed") return "tracker-hover-dim-error";
    return "tracker-hover-dim-muted";
  }
  if (field === "taraweeh") {
    return (day.taraweeh ?? 0) > 0 ? "tracker-hover-dim-brand" : "tracker-hover-dim-muted";
  }
  return "tracker-hover-dim-muted";
}

const BASE =
  " transition-colors duration-150 min-h-[48px] h-full p-2 flex items-center justify-center cursor-pointer select-none w-full";

export type FarzCellStyle = {
  bg: string;
  border: string;
  hover: string;
};

export function getFarzCellClasses(
  state: FarzSalahState | null
): FarzCellStyle {
  switch (state) {
    case "mosque":
      return {
        bg: "bg-semantics-brand-bg-glow",
        border: "",
        // border: "border border-semantics-brand-border-1",
        hover: "hover:bg-semantics-brand-bg-glow-hover",
      };
    case "on_time":
      return {
        bg: "bg-semantics-brand-bg-glow",
        border: "",
        // border: "border border-semantics-brand-border-1",
        hover: "hover:bg-semantics-brand-bg-glow-hover",
      };
    case "qaza":
      return {
        bg: "bg-semantics-warning-bg-glow",
        border: "",
        // border: "border border-semantics-warning-border-1",
        hover: "hover:bg-semantics-warning-bg-glow-hover",
      };
    case "missed":
      return {
        bg: "bg-semantics-error-bg-glow",
        border: "",
        // border: "border border-semantics-error-border-1",
        hover: "hover:bg-semantics-error-bg-glow-hover",
      };
    case "not_applicable":
      return {
        bg: "",
        // bg: "bg-semantics-base-bg-muted",
        border: "",
        // border: "border border-semantics-base-border-1",
        hover: "hover:bg-semantics-base-bg-muted-hover",
      };
    default:
      return {
        bg: "",
        // bg: "bg-semantics-base-bg-muted",
        border: "",
        // border: "border border-semantics-base-border-1",
        hover: "hover:bg-semantics-base-bg-muted-hover",
      };
  }
}

export type TaraweehCellStyle = {
  bg: string;
  border: string;
  hover: string;
};

export function getTaraweehCellClasses(value: number | null): TaraweehCellStyle {
  if (value != null && value > 0) {
    const strongBorder =
      value >= 8
        ? "border-semantics-brand-border-2"
        : "border-semantics-brand-border-1";
    return {
      bg: "bg-semantics-brand-bg-glow",
      border: ``,
      // border: `border ${strongBorder}`,
      hover: "hover:bg-semantics-brand-bg-glow-hover",
    };
  }
  return {
    bg: "",
    // bg: "bg-semantics-base-bg-muted",
    border: "",
    // border: "border border-semantics-base-border-1",
    hover: "hover:bg-semantics-base-bg-muted-hover",
  };
}

export type QuranCharityCellStyle = {
  bg: string;
  border: string;
  hover: string;
};

export function getQuranCharityCellClasses(value: boolean): QuranCharityCellStyle {
  if (value) {
    return {
      bg: "bg-semantics-brand-bg-glow",
      border: "",
      // border: "border border-semantics-brand-border-1",
      hover: "hover:bg-semantics-brand-bg-glow-hover",
    };
  }
  return {
    bg: "bg-transparent",
    border: "",
    // border: "border border-semantics-base-border-1",
    hover: "hover:bg-semantics-base-bg-muted-hover",
  };
}

export function getFarzCellContainerClassName(state: FarzSalahState | null): string {
  const s = getFarzCellClasses(state);
  return [BASE, s.bg, s.border, s.hover].filter(Boolean).join(" ");
}

export function getTaraweehCellContainerClassName(value: number | null): string {
  const s = getTaraweehCellClasses(value);
  return [BASE, s.bg, s.border, s.hover].filter(Boolean).join(" ");
}

export function getQuranCharityCellContainerClassName(value: boolean): string {
  const s = getQuranCharityCellClasses(value);
  return [BASE, s.bg, s.border, s.hover].filter(Boolean).join(" ");
}
