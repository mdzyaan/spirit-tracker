"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState, useMemo } from "react";
import { useAppSelector } from "@/store/hooks";
import { getUserSettings } from "@/services/user-settings.service";
import {
  getPrayerTimings,
  getNextPrayer,
  formatCountdown,
} from "@/services/prayer-times.service";
import type { NextPrayer } from "@/services/prayer-times.service";
import { Skeleton } from "@/components/ui/skeleton";
import { Moon, MapPin } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export function GreetingHeader() {
  const { user } = useAuth();
  const userId = user?.id;

  const [nextPrayer, setNextPrayer] = useState<NextPrayer | null>(null);
  const [secondsUntil, setSecondsUntil] = useState<number>(0);
  const [prayerLoading, setPrayerLoading] = useState(true);
  const [locationMissing, setLocationMissing] = useState(false);

  const displayName = user?.name?.trim() || "there";
  const englishDate = format(new Date(), "EEEE, d MMMM yyyy");

  // Get today's Ramadan day number from the tracker store (same source as TodayLoggingCard)
  const days = useAppSelector((s) => s.tracker.days);
  const trackerStatus = useAppSelector((s) => s.tracker.status);
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayDayNumber = useMemo(
    () => days.find((d) => d.date === todayStr)?.day_number ?? null,
    [days, todayStr]
  );
  const ramadanLabel = todayDayNumber !== null ? `Ramadan · Day ${todayDayNumber}` : null;
  const ramadanLoading = trackerStatus === "idle" || trackerStatus === "loading";

  // Fetch prayer times and initialise next prayer
  useEffect(() => {
    if (!userId) {
      setPrayerLoading(false);
      return;
    }
    let cancelled = false;
    setPrayerLoading(true);
    getUserSettings(userId)
      .then(async (row) => {
        const lat = row?.latitude ?? null;
        const lng = row?.longitude ?? null;
        const method = row?.calculation_method ?? 2;
        if (lat === null || lng === null) {
          setLocationMissing(true);
          return;
        }
        const timings = await getPrayerTimings(lat, lng, method);
        if (!timings || cancelled) return;
        const next = getNextPrayer(timings);
        setNextPrayer(next);
        setSecondsUntil(next.secondsUntil);
      })
      .catch(() => {/* silent — prayer section hidden */})
      .finally(() => { if (!cancelled) setPrayerLoading(false); });
    return () => { cancelled = true; };
  }, [userId]);

  // Live countdown tick
  useEffect(() => {
    if (!nextPrayer) return;
    const id = setInterval(() => {
      setSecondsUntil((s) => {
        if (s <= 1) return 0;
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [nextPrayer]);

  const showPrayer = !prayerLoading && nextPrayer !== null;
  const showRight = prayerLoading || showPrayer || locationMissing;

  return (
    <div className="rounded-2xl border border-semantics-base-border-1 bg-card px-6 py-6 flex gap-4 overflow-hidden">
      {/* ── Left: greeting + dates ── */}
      <div className="flex flex-col justify-center gap-1 flex-1 min-w-0">
        <p className="text-sm font-medium uppercase tracking-widest text-semantics-base-fg-muted">
          Assalamualaikum
        </p>
        <h1 className="text-2xl font-bold text-foreground tracking-tight truncate">
          {displayName}
        </h1>

        <div className="mt-3 space-y-0.5">
          <p className="text-sm font-medium text-foreground">
            {englishDate}
          </p>
          {ramadanLoading ? (
            <Skeleton className="h-4 w-36 rounded" />
          ) : ramadanLabel ? (
            <p className="text-xs text-semantics-base-fg-muted">{ramadanLabel}</p>
          ) : null}
        </div>
      </div>

      {/* ── Vertical divider ── */}
      {showRight && (
        <div className="w-px bg-semantics-base-border-1 self-stretch shrink-0" />
      )}

      {/* ── Right: next prayer or location CTA ── */}
      {prayerLoading ? (
        <div className="flex flex-col items-center justify-center gap-2 w-28 shrink-0">
          <Skeleton className="h-3 w-20 rounded" />
          <Skeleton className="h-7 w-16 rounded" />
          <Skeleton className="h-5 w-20 rounded" />
          <Skeleton className="h-3 w-14 rounded" />
        </div>
      ) : showPrayer ? (
        <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-semantics-base-bg-muted px-4 py-4 w-32 shrink-0 text-center">
          <div className="flex items-center gap-1">
            <Moon className="h-3 w-3 text-semantics-base-fg-muted" />
            <p className="text-[10px] font-semibold uppercase tracking-widest text-semantics-base-fg-muted">
              Next
            </p>
          </div>
          <p className="text-xl font-bold text-foreground leading-tight">
            {nextPrayer!.name}
          </p>
          <p className="text-sm font-medium text-foreground">
            {nextPrayer!.formattedTime}
          </p>
          <div className="w-8 border-t border-semantics-base-border-1 my-0.5" />
          <p className="text-xs text-semantics-base-fg-muted font-medium tabular-nums">
            {formatCountdown(secondsUntil)}
          </p>
        </div>
      ) : locationMissing ? (
        <Link href="/settings" className="shrink-0">
          <div className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-semantics-base-bg-muted px-4 py-4 w-32 text-center transition-colors hover:bg-semantics-base-bg-soft cursor-pointer">
            <MapPin className="h-4 w-4 text-semantics-base-fg-muted" />
            <p className="text-xs font-semibold text-foreground leading-tight">Set location</p>
            <p className="text-[10px] text-semantics-base-fg-muted leading-tight">for prayer times</p>
          </div>
        </Link>
      ) : null}
    </div>
  );
}
