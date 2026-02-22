"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/services/auth.service";
import { upsertUserSettings } from "@/services/user-settings.service";
import { getHijriForDate } from "@/services/hijri.service";
import { setRamadanState } from "@/store/slices/ramadanSlice";
import { useAppDispatch } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { COUNTRY_OPTIONS } from "@/lib/countries";
import {
  CALCULATION_METHODS,
  suggestMethodForCountry,
} from "@/lib/calculation-methods";
import { getCountryCodeFromCoords } from "@/services/geo.service";
import { cn } from "@/lib/utils";

const RAMADAN_HIJRI_MONTH = 9;

type Step = 1 | 2 | 3;

type FormState = {
  latitude: number | null;
  longitude: number | null;
  country: string;
  calculation_method: number;
  ramadan_override_start: string | null;
};

const defaultState: FormState = {
  latitude: null,
  longitude: null,
  country: "",
  calculation_method: 2,
  ramadan_override_start: null,
};

export function OnboardingForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>(defaultState);
  const [detecting, setDetecting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDetectLocation = useCallback(async () => {
    setDetecting(true);
    setError(null);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported.");
      setDetecting(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        let countryCode = "";
        let calculationMethod = 2;
        try {
          const code = await getCountryCodeFromCoords(lat, lng);
          if (code) {
            countryCode = code;
            calculationMethod = suggestMethodForCountry(code);
          }
        } catch {
          // keep country empty if reverse geocode fails
        }
        setForm((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          country: countryCode,
          calculation_method: calculationMethod,
        }));
        setDetecting(false);
      },
      () => {
        setError("Could not get location.");
        setDetecting(false);
      }
    );
  }, []);

  const handleCountryChange = (countryCode: string) => {
    setForm((prev) => ({
      ...prev,
      country: countryCode,
      calculation_method: suggestMethodForCountry(countryCode),
    }));
  };

  const handleSave = async () => {
    const session = await getSession();
    if (!session?.user?.id) {
      setError("Not signed in.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const lat = form.latitude ?? 0;
      const lng = form.longitude ?? 0;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? null;

      await upsertUserSettings(session.user.id, {
        latitude: form.latitude ?? undefined,
        longitude: form.longitude ?? undefined,
        country: form.country || null,
        calculation_method: form.calculation_method,
        timezone,
        ramadan_override_start: form.ramadan_override_start || null,
      });

      const today = new Date();
      const todayIso = today.toISOString().slice(0, 10);
      let isRamadan = false;
      if (lat !== 0 || lng !== 0) {
        const hijri = await getHijriForDate(
          todayIso,
          lat,
          lng,
          form.calculation_method
        );
        isRamadan = hijri?.month?.number === RAMADAN_HIJRI_MONTH;
      }
      dispatch(
        setRamadanState({
          isRamadan,
          startDate: form.ramadan_override_start ?? null,
        })
      );

      router.replace("/dashboard");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-border">
      <CardHeader>
        <CardTitle>Set up Ramadan</CardTitle>
        <CardDescription>
          {step === 1 && "Set your location for prayer times and Hijri dates."}
          {step === 2 && "Choose a calculation method for lunar dates."}
          {step === 3 && "Review and save."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {step === 1 && (
          <>
            <div className="space-y-2">
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={handleDetectLocation}
                disabled={detecting}
              >
                {detecting ? "Detecting…" : "Detect my location"}
              </Button>
              {form.latitude != null && form.longitude != null && (
                <p className="text-xs text-muted-foreground">
                  {form.latitude.toFixed(4)}, {form.longitude.toFixed(4)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="onboarding-country">Country</Label>
              <select
                id="onboarding-country"
                value={form.country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className={cn(
                  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                )}
              >
                <option value="">— Select —</option>
                {COUNTRY_OPTIONS.map(({ code, name }) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <Button type="button" onClick={() => setStep(2)}>
              Next
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="space-y-2">
              <Label>Calculation method</Label>
              <div className="flex flex-col gap-2">
                {CALCULATION_METHODS.map(({ value, label }) => (
                  <label
                    key={value}
                    className={cn(
                      "flex items-center gap-2 rounded-md border border-border p-3 cursor-pointer",
                      form.calculation_method === value &&
                        "border-primary bg-muted/50"
                    )}
                  >
                    <input
                      type="radio"
                      name="method"
                      value={value}
                      checked={form.calculation_method === value}
                      onChange={() =>
                        setForm((prev) => ({ ...prev, calculation_method: value }))
                      }
                      className="h-4 w-4"
                    />
                    <span className="text-sm font-medium">{label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button type="button" onClick={() => setStep(3)}>
                Next
              </Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                Location:{" "}
                {form.latitude != null && form.longitude != null
                  ? `${form.latitude.toFixed(2)}, ${form.longitude.toFixed(2)}`
                  : "—"}
                {form.country && ` · ${form.country}`}
              </p>
              <p>
                Method:{" "}
                {CALCULATION_METHODS.find((m) => m.value === form.calculation_method)
                  ?.label ?? form.calculation_method}
              </p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save and continue"}
              </Button>
            </div>
          </>
        )}

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </CardContent>
    </Card>
  );
}
