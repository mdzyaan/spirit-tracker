"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTracker } from "@/hooks/useTracker";
import { fetchTrackerData } from "@/store/thunks/trackerThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateDayField } from "@/store/slices/trackerSlice";
import { updateTrackerField } from "@/store/thunks/trackerThunks";
import type { TrackerDay } from "@/store/slices/trackerSlice";
import type { FarzSalahState } from "@/types/tracker";
import { getFarzStatesForGender, FARZ_SALAH_STATES } from "@/types/tracker";
import { FarzIcon, FARZ_LABELS } from "@/components/features/tracker/PrayerTrackerCell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Sun,
  Moon,
  BookOpen,
  Heart,
  Minus,
  Sunrise,
  Sunset,
  CloudSun,
  Star,
} from "lucide-react";
import { getUserSettings } from "@/services/user-settings.service";
import {
  getPrayerTimings,
  formatPrayerTime,
} from "@/services/prayer-times.service";
import type { PrayerTimings } from "@/services/prayer-times.service";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// ─── Constants ────────────────────────────────────────────────────────────────

const FARZ_FIELDS_ORDERED = [
  "fajr",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
] as const;

const TARAWEEH_OPTIONS = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20] as const;
const TAHAJUD_OPTIONS = [0, 2, 4, 6, 8] as const;

const PRAYER_LABEL: Record<(typeof FARZ_FIELDS_ORDERED)[number], string> = {
  fajr: "Fajr",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};

const FARZ_TO_TIMING_KEY: Record<
  (typeof FARZ_FIELDS_ORDERED)[number],
  keyof PrayerTimings
> = {
  fajr: "Fajr",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

type CardVariant = "base" | "brand" | "warning" | "error" | "na";

function getCardClasses(variant: CardVariant): string {
  const base =
    "rounded-xl border transition-all duration-300 active:scale-[0.98] cursor-pointer select-none";
  switch (variant) {
    case "brand":
      return cn(base, "border-semantics-brand-border-2 bg-semantics-brand-bg-glow");
    case "warning":
      return cn(base, "border-semantics-warning-border-2 bg-semantics-warning-bg-glow");
    case "error":
      return cn(base, "border-semantics-error-border-2 bg-semantics-error-bg-glow");
    case "na":
      return cn(base, "border-semantics-base-border-1 bg-semantics-base-bg-muted opacity-60");
    default:
      return cn(base, "border-semantics-base-border-1 bg-card");
  }
}

function getPrayerVariant(state: FarzSalahState | null): CardVariant {
  if (state === "mosque" || state === "on_time") return "brand";
  if (state === "qaza") return "warning";
  if (state === "missed") return "error";
  if (state === "not_applicable") return "na";
  return "base";
}

function countCompleted(day: TrackerDay): number {
  return [
    day.quran,
    day.fasting,
    day.charity,
    day.fajr !== null,
    day.dhuhr !== null,
    day.asr !== null,
    day.maghrib !== null,
    day.isha !== null,
    (day.taraweeh ?? 0) > 0,
    (day.tahajud ?? 0) > 0,
  ].filter(Boolean).length;
}

const PRAYER_ICONS: Record<(typeof FARZ_FIELDS_ORDERED)[number], React.ReactNode> = {
  fajr: <Sunrise className="h-5 w-5 text-semantics-base-fg-muted shrink-0" />,
  dhuhr: <Sun className="h-5 w-5 text-semantics-base-fg-muted shrink-0" />,
  asr: <CloudSun className="h-5 w-5 text-semantics-base-fg-muted shrink-0" />,
  maghrib: <Sunset className="h-5 w-5 text-semantics-base-fg-muted shrink-0" />,
  isha: <Moon className="h-5 w-5 text-semantics-base-fg-muted shrink-0" />,
};

const PRAYER_STATE_LABEL: Record<FarzSalahState, string> = {
  mosque: "Mosque",
  on_time: "On time",
  qaza: "Qaza",
  missed: "Missed",
  not_applicable: "N/A",
};

// ─── Shared sub-components ────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-semantics-base-fg-muted-2 px-1 pb-0.5">
      {children}
    </p>
  );
}

function StateBadge({
  variant,
  children,
}: {
  variant: CardVariant;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0",
        variant === "brand" &&
          "bg-semantics-brand-bg-soft text-semantics-brand-fg-bold",
        variant === "warning" &&
          "bg-semantics-warning-bg-soft text-semantics-warning-fg-bold",
        variant === "error" &&
          "bg-semantics-error-bg-soft text-semantics-error-fg-bold",
        (variant === "na" || variant === "base") &&
          "bg-semantics-base-bg-secondary text-semantics-base-fg-muted"
      )}
    >
      {children}
    </span>
  );
}

function PrayerOptionsList({
  options,
  currentState,
  onSelect,
}: {
  options: FarzSalahState[];
  currentState: FarzSalahState | null;
  onSelect: (s: FarzSalahState | null) => void;
}) {
  return (
    <div className="flex flex-col gap-0.5 p-2">
      {options.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onSelect(s)}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm w-full text-left transition-colors",
            currentState === s
              ? "bg-semantics-brand-bg-glow text-semantics-brand-fg-bold font-medium"
              : "hover:bg-semantics-base-bg-hover"
          )}
        >
          <FarzIcon state={s} /> 
          <span>{FARZ_LABELS[s]}</span>
        </button>
      ))}
      <button
        type="button"
        onClick={() => onSelect(null)}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm w-full text-left text-semantics-base-fg-muted hover:bg-semantics-base-bg-hover transition-colors"
      >
        <Minus className="h-5 w-5 shrink-0" />
        <span>Clear</span>
      </button>
    </div>
  );
}

function RakatGrid({
  options,
  currentValue,
  onSelect,
}: {
  options: readonly number[];
  currentValue: number;
  onSelect: (n: number) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-2 p-4">
      {options.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onSelect(n)}
          className={cn(
            "rounded-lg py-2.5 text-sm font-medium transition-colors",
            n === 0
              ? "text-semantics-base-fg-muted hover:bg-semantics-base-bg-hover"
              : cn(
                  "hover:bg-semantics-brand-bg-glow",
                  currentValue === n &&
                    "bg-semantics-brand-bg-soft text-semantics-brand-fg-bold"
                )
          )}
        >
          {n === 0 ? "—" : n}
        </button>
      ))}
    </div>
  );
}

// Inline expand (desktop) wrapper
function InlineExpand({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden transition-all duration-300",
        open ? "max-h-[400px] mt-1" : "max-h-0"
      )}
    >
      <div className="rounded-xl border border-semantics-base-border-1 bg-card shadow-sm">
        {children}
      </div>
    </div>
  );
}

// ─── Boolean card (Fasting / Quran / Charity) ─────────────────────────────────

function BooleanCard({
  icon,
  label,
  value,
  onToggle,
}: {
  icon: React.ReactNode;
  label: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      className={cn(
        getCardClasses(value ? "brand" : "base"),
        "flex items-center gap-3 px-4 py-3"
      )}
    >
      {icon}
      <span className="flex-1 text-sm font-medium">{label}</span>
      {value && <StateBadge variant="brand">Done</StateBadge>}
    </div>
  );
}

// ─── Prayer card (Fajr–Isha) ──────────────────────────────────────────────────

function PrayerCard({
  day,
  field,
  allowedStates,
  prayerTime,
  expanded,
  onToggleExpand,
  isMobile,
}: {
  day: TrackerDay;
  field: (typeof FARZ_FIELDS_ORDERED)[number];
  allowedStates: FarzSalahState[] | undefined;
  prayerTime: string | undefined;
  expanded: boolean;
  onToggleExpand: () => void;
  isMobile: boolean;
}) {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(
    (s) => s.auth.session?.user?.id ?? s.auth.user?.id ?? ""
  );
  const state = day[field] as FarzSalahState | null;
  const options = allowedStates ?? FARZ_SALAH_STATES;
  const variant = getPrayerVariant(state);

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
    if (expanded) onToggleExpand();
  };

  const optionsList = (
    <PrayerOptionsList
      options={options}
      currentState={state}
      onSelect={handleSelect}
    />
  );

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={onToggleExpand}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggleExpand();
          }
        }}
        className={cn(
          getCardClasses(variant),
          "flex items-center gap-3 px-4 py-3"
        )}
      >
        {PRAYER_ICONS[field]}
        <div className="flex flex-1 flex-col min-w-0">
          <span className="text-sm font-medium leading-tight">
            {PRAYER_LABEL[field]}
          </span>
          {!state && (
            <span className="text-xs text-semantics-base-fg-muted-2 leading-tight">
              Tap to log
            </span>
          )}
        </div>
        {state && (
          <StateBadge variant={variant}>
            {PRAYER_STATE_LABEL[state]}
          </StateBadge>
        )}
        {prayerTime && (
          <span className="text-xs text-semantics-base-fg-muted shrink-0">
            {prayerTime}
          </span>
        )}
       
      </div>

      {!isMobile && (
        <InlineExpand open={expanded}>{optionsList}</InlineExpand>
      )}

      {isMobile && (
        <Sheet
          open={expanded}
          onOpenChange={(o) => {
            if (!o) onToggleExpand();
          }}
        >
          <SheetContent side="bottom" className="rounded-t-2xl pb-8" hideCloseButton>
            <SheetHeader className="pb-1 pt-5 px-4">
              <SheetTitle className="flex items-center gap-2 text-base font-semibold">
                {PRAYER_ICONS[field]}
                {PRAYER_LABEL[field]}
              </SheetTitle>
            </SheetHeader>
            {optionsList}
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}

// ─── Rakat card (Taraweeh / Tahajud) ─────────────────────────────────────────

function RakatCard({
  day,
  field,
  label,
  icon,
  options,
  expanded,
  onToggleExpand,
  isMobile,
}: {
  day: TrackerDay;
  field: "taraweeh" | "tahajud";
  label: string;
  icon: React.ReactNode;
  options: readonly number[];
  expanded: boolean;
  onToggleExpand: () => void;
  isMobile: boolean;
}) {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(
    (s) => s.auth.session?.user?.id ?? s.auth.user?.id ?? ""
  );
  const value = (day[field] ?? 0) as number;
  const logged = value > 0;

  const handleSelect = (n: number) => {
    const previous = day[field];
    const next = n === 0 ? null : n;
    dispatch(
      updateDayField({ dayNumber: day.day_number, field, value: next })
    );
    dispatch(
      updateTrackerField({
        userId,
        year: day.year,
        dayNumber: day.day_number,
        date: day.date,
        field,
        value: next ?? 0,
        previousValue: (previous ?? 0) as number,
      })
    ).catch(() => {});
    if (expanded) onToggleExpand();
  };

  const grid = (
    <RakatGrid options={options} currentValue={value} onSelect={handleSelect} />
  );

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={onToggleExpand}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggleExpand();
          }
        }}
        className={cn(
          getCardClasses(logged ? "brand" : "base"),
          "flex items-center gap-3 px-4 py-3"
        )}
      >
        {icon}
        <div className="flex flex-1 flex-col min-w-0">
          <span className="text-sm font-medium leading-tight">{label}</span>
          {!logged && (
            <span className="text-xs text-semantics-base-fg-muted-2 leading-tight">
              Tap to log
            </span>
          )}
        </div>
        {logged && (
          <StateBadge variant="brand">{value} Rakat</StateBadge>
        )}
      </div>

      {!isMobile && <InlineExpand open={expanded}>{grid}</InlineExpand>}

      {isMobile && (
        <Sheet
          open={expanded}
          onOpenChange={(o) => {
            if (!o) onToggleExpand();
          }}
        >
          <SheetContent side="bottom" className="rounded-t-2xl pb-8" hideCloseButton>
            <SheetHeader className="pb-1 pt-5 px-4">
              <SheetTitle className="flex items-center gap-2 text-base font-semibold">
                {icon}
                {label}
              </SheetTitle>
            </SheetHeader>
            {grid}
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}

// ─── Main card ────────────────────────────────────────────────────────────────

type TodayLoggingCardProps = {
  allowedFarzStates: FarzSalahState[] | null;
  prayerTimings: PrayerTimings | null;
};

export function TodayLoggingCard({
  allowedFarzStates,
  prayerTimings,
}: TodayLoggingCardProps) {
  const dispatch = useAppDispatch();
  const { user, session, initialized } = useAuth();
  const userId = user?.id ?? session?.user?.id;
  const { days, status, error } = useTracker();
  const isMobile = useIsMobile();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayDay = useMemo(
    () => days.find((d) => d.date === todayStr) ?? null,
    [days, todayStr]
  );

  const handleRetry = () => {
    if (userId) dispatch(fetchTrackerData({ userId, year: undefined }));
  };

  const toggleExpand = (id: string) => {
    setExpandedCard((prev) => (prev === id ? null : id));
  };

  const handleBooleanToggle = (
    day: TrackerDay,
    field: "quran" | "charity" | "fasting"
  ) => {
    const next = !day[field];
    dispatch(updateDayField({ dayNumber: day.day_number, field, value: next }));
    dispatch(
      updateTrackerField({
        userId: userId ?? "",
        year: day.year,
        dayNumber: day.day_number,
        date: day.date,
        field,
        value: next,
        previousValue: day[field],
      })
    ).catch(() => {});
  };

  if (!initialized || !userId) {
    return (
      <Card className="border-semantics-base-border-1 bg-card">
        <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <p className="text-sm text-semantics-base-fg-muted">
            Sign in to load your tracker
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (status === "failed") {
    return (
      <Card className="border-semantics-base-border-1 bg-card">
        <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <p className="text-sm text-semantics-error-fg-link">
            {error ?? "Failed to load tracker"}
          </p>
          <Button variant="outline" size="sm" onClick={handleRetry}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (status === "loading" || status === "idle") {
    return (
      <Card className="border-semantics-base-border-1 bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="h-3 w-10 rounded" />
          </div>
          <Skeleton className="mt-2 h-1.5 w-full rounded-full" />
        </CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 10 }, (_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!todayDay) {
    return (
      <Card className="border-semantics-base-border-1 bg-card">
        <CardContent className="py-8 text-center">
          <p className="text-sm text-semantics-base-fg-muted">
            Today is not a Ramadan day, or data is still loading.
          </p>
        </CardContent>
      </Card>
    );
  }

  const day = todayDay;
  const completed = countCompleted(day);
  const total = 10;

  return (
    <div className="border-semantics-base-border-1 bg-card overflow-hidden">
      <div className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold text-foreground">
              {format(new Date(), "EEEE, MMM d")}
            </p>
            <p className="text-xs text-semantics-base-fg-muted">
              Ramadan · Day {day.day_number}
            </p>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-sm font-semibold text-semantics-brand-fg-link">
              {completed} / {total}
            </span>
            <span className="text-xs text-semantics-base-fg-muted">completed</span>
          </div>
        </div>
        <div className="mt-2 h-1.5 w-full rounded-full bg-semantics-base-bg-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-semantics-brand-bg transition-all duration-500"
            style={{ width: `${(completed / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-5">
        {/* Salah */}
        <div className="space-y-2">
          <SectionLabel>Salah</SectionLabel>
          {FARZ_FIELDS_ORDERED.map((field) => {
            const timingKey = FARZ_TO_TIMING_KEY[field];
            const rawTime = prayerTimings?.[timingKey];
            const prayerTime = rawTime ? formatPrayerTime(rawTime) : undefined;
            return (
              <PrayerCard
                key={field}
                day={day}
                field={field}
                allowedStates={allowedFarzStates ?? undefined}
                prayerTime={prayerTime}
                expanded={expandedCard === field}
                onToggleExpand={() => toggleExpand(field)}
                isMobile={isMobile}
              />
            );
          })}
        </div>

        {/* Ibadah */}
        <div className="space-y-2">
          <SectionLabel>Ibadah</SectionLabel>
          <BooleanCard
            icon={
              <Sun className="h-5 w-5 text-semantics-base-fg-muted shrink-0" />
            }
            label="Fasting"
            value={day.fasting}
            onToggle={() => handleBooleanToggle(day, "fasting")}
          />
          <BooleanCard
            icon={
              <BookOpen className="h-5 w-5 text-semantics-base-fg-muted shrink-0" />
            }
            label="Quran"
            value={day.quran}
            onToggle={() => handleBooleanToggle(day, "quran")}
          />
          <BooleanCard
            icon={
              <Heart className="h-5 w-5 text-semantics-base-fg-muted shrink-0" />
            }
            label="Charity"
            value={day.charity}
            onToggle={() => handleBooleanToggle(day, "charity")}
          />
          <RakatCard
            day={day}
            field="taraweeh"
            label="Taraweeh"
            icon={
              <Moon className="h-5 w-5 text-semantics-base-fg-muted shrink-0" />
            }
            options={TARAWEEH_OPTIONS}
            expanded={expandedCard === "taraweeh"}
            onToggleExpand={() => toggleExpand("taraweeh")}
            isMobile={isMobile}
          />
          <RakatCard
            day={day}
            field="tahajud"
            label="Tahajud"
            icon={
              <Star className="h-5 w-5 text-semantics-base-fg-muted shrink-0" />
            }
            options={TAHAJUD_OPTIONS}
            expanded={expandedCard === "tahajud"}
            onToggleExpand={() => toggleExpand("tahajud")}
            isMobile={isMobile}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Gender + prayer times wrapper ───────────────────────────────────────────

export function TodayLoggingCardWithGender() {
  const { user, session } = useAuth();
  const userId = user?.id ?? session?.user?.id;
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [prayerTimings, setPrayerTimings] = useState<PrayerTimings | null>(
    null
  );

  useEffect(() => {
    if (!userId) return;
    getUserSettings(userId)
      .then(async (row) => {
        const g = row?.gender;
        setGender(g === "male" || g === "female" ? g : null);

        const lat = row?.latitude ?? null;
        const lng = row?.longitude ?? null;
        const method = row?.calculation_method ?? 2;

        if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)) {
          const timings = await getPrayerTimings(lat, lng, method);
          setPrayerTimings(timings);
        }
      })
      .catch(() => setGender(null));
  }, [userId]);

  const allowedFarzStates = useMemo(
    () => getFarzStatesForGender(gender),
    [gender]
  );

  return (
    <TodayLoggingCard
      allowedFarzStates={allowedFarzStates}
      prayerTimings={prayerTimings}
    />
  );
}
