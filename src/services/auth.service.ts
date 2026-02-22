import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/store/slices/authSlice";

export async function signInWithPassword(email: string, password: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signUp(
  email: string,
  password: string,
  name?: string
) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name ?? undefined } },
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
}

export async function getSession() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function signInWithGoogle(redirectTo: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });
  if (error) throw error;
}

export async function requestPasswordReset(email: string, redirectTo: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });
  if (error) throw error;
}

export async function updatePassword(newPassword: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient();
  console.log("getting profile", supabase, userId);
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, avatar_url, country_code, created_at, updated_at")
    .eq("id", userId)
    .single();
  console.log("🚀 ~ getProfile ~ data:", data, error)
  if (error || !data) return null;
  return {
    id: data.id,
    name: data.name,
    avatar_url: data.avatar_url,
    country_code: data.country_code ?? null,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

export async function updateProfile(
  userId: string,
  updates: { name?: string | null; avatar_url?: string | null; country_code?: string | null }
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId);
  if (error) throw error;
}
