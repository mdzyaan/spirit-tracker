import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";

export type UserSettingsRow = Database["public"]["Tables"]["user_settings"]["Row"];
export type UserSettingsInsert = Database["public"]["Tables"]["user_settings"]["Insert"];
export type UserSettingsUpdate = Database["public"]["Tables"]["user_settings"]["Update"];

export async function getUserSettings(
  userId: string
): Promise<UserSettingsRow | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/** Only keys present in payload are written; the rest come from existing row (no wiping). */
export async function upsertUserSettings(
  userId: string,
  payload: Partial<Omit<UserSettingsInsert, "user_id" | "created_at">>
): Promise<UserSettingsRow> {
  const supabase = createClient();
  const existing = await getUserSettings(userId);
  const merged: UserSettingsInsert = {
    user_id: userId,
    latitude: "latitude" in payload ? (payload.latitude ?? null) : (existing?.latitude ?? null),
    longitude: "longitude" in payload ? (payload.longitude ?? null) : (existing?.longitude ?? null),
    country: "country" in payload ? (payload.country ?? null) : (existing?.country ?? null),
    calculation_method: "calculation_method" in payload ? (payload.calculation_method ?? 2) : (existing?.calculation_method ?? 2),
    timezone: "timezone" in payload ? (payload.timezone ?? null) : (existing?.timezone ?? null),
    ramadan_override_start: "ramadan_override_start" in payload ? (payload.ramadan_override_start ?? null) : (existing?.ramadan_override_start ?? null),
  };
  const { data, error } = await supabase
    .from("user_settings")
    .upsert(merged, { onConflict: "user_id" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Returns the manual Ramadan start date (YYYY-MM-DD) if set, else null. */
export async function getRamadanOverrideStart(
  userId: string
): Promise<string | null> {
  const row = await getUserSettings(userId);
  return row?.ramadan_override_start ?? null;
}

/** Set or clear the single Ramadan start override date. */
export async function setRamadanOverrideStart(
  userId: string,
  date: string | null
): Promise<void> {
  await upsertUserSettings(userId, { ramadan_override_start: date });
}
