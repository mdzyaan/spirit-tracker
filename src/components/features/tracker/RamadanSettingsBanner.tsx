"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import { getUserSettings } from "@/services/user-settings.service";

const DISMISS_KEY = "ramadan_preference_prompt_dismissed";

export function RamadanSettingsBanner() {
  const user = useAppSelector((s) => s.auth.user);
  const [dismissed, setDismissed] = useState(true);
  const [hasSettings, setHasSettings] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      setDismissed(localStorage.getItem(DISMISS_KEY) === "true");
    } catch {
      setDismissed(false);
    }
  }, []);

  useEffect(() => {
    if (!user?.id) {
      setHasSettings(null);
      return;
    }
    getUserSettings(user.id)
      .then((row) => {
        const hasCountry = !!(row?.country?.trim());
        const hasOverride = !!(row?.ramadan_override_start);
        setHasSettings(hasCountry || hasOverride);
      })
      .catch(() => setHasSettings(false));
  }, [user?.id]);

  const handleDismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, "true");
      setDismissed(true);
    } catch {
      setDismissed(true);
    }
  };

  const show =
    user &&
    hasSettings === false &&
    !dismissed;

  if (!show) return null;

  return (
    <div className="mb-4 flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
      <span>
        Set your country or Ramadan start date in{" "}
        <Link
          href="/settings"
          className="font-medium text-foreground underline underline-offset-2 hover:no-underline"
        >
          Settings
        </Link>{" "}
        for accurate tracking.
      </span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="shrink-0"
        onClick={handleDismiss}
        aria-label="Dismiss"
      >
        Dismiss
      </Button>
    </div>
  );
}
