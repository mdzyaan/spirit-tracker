"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import {
  fetchAyah,
  getCuratedKeyForDate,
  getRandomCuratedKey,
  getCachedAyah,
  setCachedAyah,
  type AyahData,
} from "@/services/ayah.service";

const AYAH_LABEL = "✨ New Beginnings";

export function AyahCard() {
  const [data, setData] = useState<AyahData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showArabic, setShowArabic] = useState(true);

  const loadAyah = useCallback(
    async (surah: number, ayah: number, useCache: boolean) => {
      const today = new Date();
      if (useCache) {
        const cached = getCachedAyah(today);
        if (cached) {
          setData(cached);
          setLoading(false);
          setError(false);
          return;
        }
      }
      setLoading(true);
      setError(false);
      const result = await fetchAyah(surah, ayah);
      if (result) {
        setData(result);
        setCachedAyah(today, result);
      } else {
        setError(true);
      }
      setLoading(false);
    },
    []
  );

  useEffect(() => {
    const today = new Date();
    const key = getCuratedKeyForDate(today);
    loadAyah(key.surah, key.ayah, true);
  }, [loadAyah]);

  const handleRefresh = () => {
    const key = data
      ? getRandomCuratedKey({ surah: data.surahNumber, ayah: data.ayahNumber })
      : getCuratedKeyForDate(new Date());
    loadAyah(key.surah, key.ayah, false);
  };

  if (loading && !data) {
    return (
      <Card className="border-semantics-base-border-1 bg-card overflow-hidden transition-shadow">
        <CardContent className="p-6 md:p-8">
          <Skeleton className="h-4 w-32 mb-4 rounded" />
          <Skeleton className="h-6 w-full max-w-md mb-2 rounded" />
          <Skeleton className="h-6 w-full max-w-sm rounded" />
          <Skeleton className="h-4 w-48 mt-4 rounded" />
        </CardContent>
      </Card>
    );
  }

  if (error && !data) {
    return (
      <Card className="border-semantics-base-border-1 bg-card overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <p className="text-sm text-semantics-base-fg-muted">
            Couldn&apos;t load the verse. Please try again.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => {
              const key = getCuratedKeyForDate(new Date());
              loadAyah(key.surah, key.ayah, false);
            }}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card className="border-semantics-base-border-1 bg-gradient-to-br from-semantics-base-bg-muted-default to-semantics-brand-bg-soft-default overflow-hidden shadow-sm transition-shadow">
      <CardContent className="p-6 md:p-8">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-wide text-semantics-base-fg-muted">
            {AYAH_LABEL}
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-semantics-base-fg-muted hover:text-foreground"
            onClick={handleRefresh}
            aria-label="Load another verse"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {showArabic && data.arabic && (
          <p
            className="mt-4 text-xl md:text-2xl font-medium text-foreground leading-relaxed text-right"
            dir="rtl"
            lang="ar"
          >
            {data.arabic}
          </p>
        )}

        <p className="mt-4 text-lg md:text-xl text-foreground leading-relaxed">
          {data.english}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowArabic((s) => !s)}
            className="text-xs text-semantics-base-fg-muted hover:text-foreground underline underline-offset-2"
          >
            {showArabic ? "Hide Arabic" : "Show Arabic"}
          </button>
          <span className="text-xs text-semantics-base-fg-muted">
            — Surah {data.surahName} ({data.surahNumber}:{data.ayahNumber})
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
