"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { getHijriForDate } from "@/services/hijri.service";
import { Skeleton } from "@/components/ui/skeleton";

function getGreeting(): string {
  // const hour = new Date().getHours();
  // if (hour >= 5 && hour < 12) return "Good Morning";
  // if (hour >= 12 && hour < 17) return "Good Afternoon";
  return "Assalamualaikum";
}

function getEnglishDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function GreetingHeader() {
  const { user } = useAuth();
  const [hijri, setHijri] = useState<string | null>(null);
  const [hijriLoading, setHijriLoading] = useState(true);
  const [hijriError, setHijriError] = useState(false);

  const displayName = user?.name?.trim() || "there";
  const greeting = getGreeting();
  const englishDate = getEnglishDate();

  useEffect(() => {
    let cancelled = false;
    setHijriLoading(true);
    setHijriError(false);
    getHijriForDate(new Date())
      .then((result) => {
        if (!cancelled && result) setHijri(result.formatted);
        if (!cancelled && !result) setHijriError(true);
      })
      .catch(() => {
        if (!cancelled) setHijriError(true);
      })
      .finally(() => {
        if (!cancelled) setHijriLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <header className="space-y-1">
      <h1 className="text-2xl font-bold text-foreground tracking-tight">
        {greeting}, {displayName}
      </h1>
      <p className="text-sm text-semantics-base-fg-muted">
        {englishDate}
      </p>
      {hijriLoading && (
        <Skeleton className="h-5 w-48 rounded" />
      )}
      {!hijriLoading && hijri && (
        <p className="text-sm text-semantics-base-fg-muted">
          {hijri}
        </p>
      )}
      {!hijriLoading && hijriError && (
        <p className="text-sm text-semantics-base-fg-muted">—</p>
      )}
    </header>
  );
}
