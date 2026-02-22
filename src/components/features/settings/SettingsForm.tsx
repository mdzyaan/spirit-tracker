"use client";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setTheme } from "@/store/slices/uiSlice";
import { setUser } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { COUNTRY_OPTIONS } from "@/lib/countries";
import { CALCULATION_METHODS } from "@/lib/calculation-methods";
import { getProfile, updateProfile } from "@/services/auth.service";
import {
  getUserSettings,
  upsertUserSettings,
  getRamadanOverrideStart,
  setRamadanOverrideStart,
} from "@/services/user-settings.service";
import { cn } from "@/lib/utils";

export function SettingsForm() {
  const theme = useAppSelector((s) => (s as { ui: { theme: "light" | "dark" } }).ui.theme);
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();

  const [country, setCountry] = useState<string>("");
  const [calculationMethod, setCalculationMethod] = useState<number>(2);
  const [overrideDate, setOverrideDate] = useState<string>("");
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const userId = user?.id ?? null;

  useEffect(() => {
    if (!userId) return;
    getUserSettings(userId)
      .then((row) => {
        if (row) {
          setCountry(row.country ?? "");
          setCalculationMethod(row.calculation_method);
          setOverrideDate(row.ramadan_override_start ?? "");
        }
        setSettingsLoaded(true);
      })
      .catch(() => setSettingsLoaded(true));
  }, [userId]);

  useEffect(() => {
    if (user) {
      getProfile(user.id).then((p) => dispatch(setUser(p ?? null)));
    }
  }, [user?.id, dispatch]);

  const handleSaveCountryAndMethod = async () => {
    if (!userId) return;
    setSaving(true);
    setMessage(null);
    try {
      await upsertUserSettings(userId, {
        country: country || null,
        calculation_method: calculationMethod,
      });
      setMessage("Settings saved.");
    } catch {
      setMessage("Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveOverride = async () => {
    if (!userId) return;
    setSaving(true);
    setMessage(null);
    try {
      await setRamadanOverrideStart(userId, overrideDate || null);
      setMessage(overrideDate ? "Override saved." : "Override cleared.");
    } catch {
      setMessage("Failed to save override.");
    } finally {
      setSaving(false);
    }
  };

  const handleClearOverride = async () => {
    if (!userId) return;
    setSaving(true);
    setMessage(null);
    try {
      await setRamadanOverrideStart(userId, null);
      setOverrideDate("");
      setMessage("Override cleared.");
    } catch {
      setMessage("Failed to clear override.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-md">
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Switch between light and dark theme.</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button
            variant={theme === "light" ? "secondary" : "outline"}
            size="sm"
            onClick={() => dispatch(setTheme("light"))}
          >
            Light
          </Button>
          <Button
            variant={theme === "dark" ? "secondary" : "outline"}
            size="sm"
            onClick={() => dispatch(setTheme("dark"))}
          >
            Dark
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Ramadan</CardTitle>
          <CardDescription>
            Country and calculation method for Hijri dates. Optionally set a manual start date.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="ramadan-country">Country</Label>
            <select
              id="ramadan-country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              disabled={!settingsLoaded}
              className={cn(
                "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              )}
            >
              <option value="">— None —</option>
              {COUNTRY_OPTIONS.map(({ code, name }) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Calculation method</Label>
            <select
              value={calculationMethod}
              onChange={(e) => setCalculationMethod(Number(e.target.value))}
              disabled={!settingsLoaded}
              className={cn(
                "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              )}
            >
              {CALCULATION_METHODS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ramadan-override">Manual Ramadan start (optional)</Label>
            <div className="flex flex-wrap items-center gap-2">
              <input
                id="ramadan-override"
                type="date"
                value={overrideDate}
                onChange={(e) => setOverrideDate(e.target.value)}
                disabled={!settingsLoaded}
                className={cn(
                  "flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                )}
              />
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={handleSaveOverride}
                disabled={saving || !settingsLoaded}
              >
                Save override
              </Button>
              {overrideDate && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleClearOverride}
                  disabled={saving || !settingsLoaded}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={handleSaveCountryAndMethod}
            disabled={saving || !settingsLoaded}
          >
            Save location & method
          </Button>
          {message && (
            <p className="text-sm text-muted-foreground">{message}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
