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
import { getFarzStatesForGender, isFarzCompleted } from "@/types/tracker";
import { FARZ_SALAH_STATES } from "@/types/tracker";
import { TrackerCell } from "@/components/features/tracker/TrackerCell";
import { FarzIcon, FARZ_LABELS } from "@/components/features/tracker/PrayerTrackerCell";
import { TaraweehTrackerCell } from "@/components/features/tracker/TaraweehTrackerCell";
import { TahajudTrackerCell } from "@/components/features/tracker/TahajudTrackerCell";
import { getFarzCellClasses } from "@/components/features/tracker/cellStyles";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sun, Landmark, Moon, BookOpen, Heart, Minus } from "lucide-react";
import { getUserSettings } from "@/services/user-settings.service";
import { cn } from "@/lib/utils";

const FARZ_FIELDS = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;
const FARZ_LABELS_MAP: Record<(typeof FARZ_FIELDS)[number], string> = {
  fajr: "Fajr",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};

function DonePill({
  done,
  label,
  doneLabel,
}: {
  done: boolean;
  label?: string;
  /** When done and set, show this instead of "DONE" (e.g. "8 Rakat") */
  doneLabel?: string;
}) {
  if (done) {
    const text = doneLabel ?? "DONE";
    return (
      <span className="rounded-full px-2 py-0.5 text-xs font-medium bg-semantics-brand-bg-glow text-semantics-brand-fg-bold">
        {text}
      </span>
    );
  }
  if (label) {
    return (
      <span className="text-xs text-semantics-base-fg-muted">{label}</span>
    );
  }
  return null;
}

function LoggingRow({
  label,
  children,
  done,
  doneLabel,
  labelWhenDone,
}: {
  label: string;
  children: React.ReactNode;
  done: boolean;
  doneLabel?: string;
  /** When done, show this as the pill text instead of "DONE" (e.g. "8 Rakat") */
  labelWhenDone?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-semantics-base-bg-muted-default px-3 py-2 min-h-[48px] transition-colors duration-150">
      <div className="shrink-0 w-12 h-10 flex items-center justify-center rounded-md overflow-hidden">
        {children}
      </div>
      <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
      <DonePill done={done} label={doneLabel} doneLabel={labelWhenDone} />
    </div>
  );
}

/** Prayer row: label left, state badge right, click opens bottom popover with same options as PrayerTrackerCell. */
function PrayerLoggingRow({
  day,
  field,
  allowedStates,
  label,
}: {
  day: TrackerDay;
  field: (typeof FARZ_FIELDS)[number];
  allowedStates: FarzSalahState[] | undefined;
  label: string;
}) {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(
    (s) => s.auth.session?.user?.id ?? s.auth.user?.id ?? ""
  );
  const state = day[field] as FarzSalahState | null;
  const [open, setOpen] = useState(false);
  const options = allowedStates ?? FARZ_SALAH_STATES;
  const styles = getFarzCellClasses(state);

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

  const done = isFarzCompleted(state);
  const doneLabel =
    state === "mosque"
      ? "Mosque"
      : state === "on_time"
        ? "On time"
        : state === "qaza"
          ? "Qaza"
          : state === "missed"
            ? "Missed"
            : state === "not_applicable"
              ? "N/A"
              : undefined;

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
          className={cn(
            "flex items-center gap-3 rounded-lg min-h-[48px] px-3 py-2 cursor-pointer select-none transition-colors duration-150",
            styles.bg,
            styles.hover
          )}
        >
          <div className="shrink-0 w-12 h-10 flex items-center justify-center rounded-md overflow-hidden">
            <FarzIcon state={state} />
          </div>
          <span className="flex-1 text-sm font-medium text-foreground">
            {label}
          </span>
          <DonePill done={done} label={done ? undefined : doneLabel} />
        </div>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" className="w-auto p-1">
        <div className="flex flex-col gap-0.5">
          {options.map((s) => (
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

/** Fasting: single large pill row. Left icon + label, right DONE/SKIPPED. Click toggles. */
function FastingPillRow({ day }: { day: TrackerDay }) {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(
    (s) => s.auth.session?.user?.id ?? s.auth.user?.id ?? ""
  );
  const value = day.fasting;

  const handleToggle = () => {
    const next = !value;
    dispatch(
      updateDayField({ dayNumber: day.day_number, field: "fasting", value: next })
    );
    dispatch(
      updateTrackerField({
        userId,
        year: day.year,
        dayNumber: day.day_number,
        date: day.date,
        field: "fasting",
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
      className={cn(
        "flex items-center gap-3 rounded-full min-h-[52px] px-4 py-3 cursor-pointer select-none transition-colors duration-150",
        value
          ? "bg-semantics-brand-bg-glow hover:bg-semantics-brand-bg-glow-hover"
          : "bg-semantics-base-bg-muted-default hover:bg-semantics-base-bg-muted-hover"
      )}
    >
      <Sun className="h-5 w-5 shrink-0 text-semantics-base-fg-muted" />
      <span className="flex-1 text-sm font-medium text-foreground">Fasting</span>
      <span
        className={cn(
          "rounded-full px-2.5 py-0.5 text-xs font-medium",
          value
            ? "bg-semantics-brand-bg-soft-default text-semantics-brand-fg-bold"
            : "text-semantics-base-fg-muted"
        )}
      >
        {value ? "DONE" : "SKIPPED"}
      </span>
    </div>
  );
}

type TodayLoggingCardProps = {
  allowedFarzStates: FarzSalahState[] | null;
};

export function TodayLoggingCard({ allowedFarzStates }: TodayLoggingCardProps) {
  const dispatch = useAppDispatch();
  const { user, session, initialized } = useAuth();
  const userId = user?.id ?? session?.user?.id;
  const { days, status, error } = useTracker();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const todayDay = useMemo(
    () => days.find((d) => d.date === todayStr) ?? null,
    [days, todayStr]
  );

  const handleRetry = () => {
    if (userId) {
      dispatch(fetchTrackerData({ userId, year: undefined }));
    }
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
        <CardHeader className="pb-2">
          <p className="text-xs font-medium uppercase tracking-wide text-semantics-base-fg-muted">
            Today&apos;s logging
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!todayDay) {
    return (
      <Card className="border-semantics-base-border-1 bg-card">
        <CardHeader className="pb-2">
          <p className="text-xs font-medium uppercase tracking-wide text-semantics-base-fg-muted">
            Today&apos;s logging
          </p>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <p className="text-sm text-semantics-base-fg-muted">
            Today is not a Ramadan day, or data is still loading.
          </p>
        </CardContent>
      </Card>
    );
  }

  const day = todayDay;

  return (
    <Card className="border-semantics-base-border-1 bg-card overflow-hidden transition-shadow">
      <CardHeader className="pb-2">
        <p className="text-xs font-medium uppercase tracking-wide text-semantics-base-fg-muted">
          Today&apos;s logging
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Fasting — large pill */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-semantics-base-fg-muted">
            <Sun className="h-3.5 w-3.5" />
            <span>Fasting</span>
          </div>
          <FastingPillRow day={day} />
        </div>

        {/* Prayers — row + bottom popover */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-semantics-base-fg-muted">
            <Landmark className="h-3.5 w-3.5" />
            <span>Prayers</span>
          </div>
          <div className="space-y-2">
            {FARZ_FIELDS.map((field) => (
              <PrayerLoggingRow
                key={field}
                day={day}
                field={field}
                allowedStates={allowedFarzStates ?? undefined}
                label={FARZ_LABELS_MAP[field]}
              />
            ))}
          </div>
        </div>

        {/* Taraweeh — X Rakat or placeholder */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-semantics-base-fg-muted">
            <Moon className="h-3.5 w-3.5" />
            <span>Taraweeh</span>
          </div>
          <LoggingRow
            label="Taraweeh"
            done={(day.taraweeh ?? 0) > 0}
            doneLabel={(day.taraweeh ?? 0) > 0 ? undefined : "—"}
            labelWhenDone={
              (day.taraweeh ?? 0) > 0 ? `${day.taraweeh} Rakat` : undefined
            }
          >
            <TaraweehTrackerCell day={day} />
          </LoggingRow>
        </div>

        {/* Tahajud */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-semantics-base-fg-muted">
            <Moon className="h-3.5 w-3.5" />
            <span>Tahajud</span>
          </div>
          <LoggingRow label="Tahajud" done={(day.tahajud ?? 0) > 0}>
            <TahajudTrackerCell day={day} />
          </LoggingRow>
        </div>

        {/* Quran */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-semantics-base-fg-muted">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Quran</span>
          </div>
          <LoggingRow label="Quran" done={day.quran}>
            <TrackerCell day={day} field="quran" />
          </LoggingRow>
        </div>

        {/* Charity */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-semantics-base-fg-muted">
            <Heart className="h-3.5 w-3.5" />
            <span>Charity</span>
          </div>
          <LoggingRow label="Charity" done={day.charity}>
            <TrackerCell day={day} field="charity" />
          </LoggingRow>
        </div>
      </CardContent>
    </Card>
  );
}

export function TodayLoggingCardWithGender() {
  const { user, session } = useAuth();
  const userId = user?.id ?? session?.user?.id;
  const [gender, setGender] = useState<"male" | "female" | null>(null);

  useEffect(() => {
    if (!userId) return;
    getUserSettings(userId)
      .then((row) => {
        const g = row?.gender;
        setGender(g === "male" || g === "female" ? g : null);
      })
      .catch(() => setGender(null));
  }, [userId]);

  const allowedFarzStates = useMemo(
    () => getFarzStatesForGender(gender),
    [gender]
  );

  return <TodayLoggingCard allowedFarzStates={allowedFarzStates} />;
}
