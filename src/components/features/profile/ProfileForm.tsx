"use client";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getProfile, updateProfile } from "@/services/auth.service";
import { COUNTRY_OPTIONS } from "@/lib/countries";
import { cn } from "@/lib/utils";

export function ProfileForm() {
  const user = useAppSelector((s) => s.auth.user);
  const session = useAppSelector((s) => s.auth.session);
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const userId = user?.id ?? null;
  const email = session?.user?.email ?? "";

  useEffect(() => {
    if (!userId) return;
    getProfile(userId)
      .then((profile) => {
        if (profile) {
          setName(profile.name ?? "");
          setAvatarUrl(profile.avatar_url ?? "");
          setCountryCode(profile.country_code ?? "");
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [userId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);
    setMessage(null);
    try {
      await updateProfile(userId, {
        name: name || null,
        avatar_url: avatarUrl || null,
        country_code: countryCode || null,
      });
      const updated = await getProfile(userId);
      dispatch(setUser(updated ?? null));
      setMessage("Profile saved.");
    } catch {
      setMessage("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!loaded && !userId) {
    return (
      <Card className="border-border">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Sign in to view your profile.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border-border">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>View and edit your details. Email cannot be changed.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarUrl || undefined} alt="" />
              <AvatarFallback className="text-lg">
                {name ? name.slice(0, 2).toUpperCase() : email ? email.slice(0, 2).toUpperCase() : "?"}
              </AvatarFallback>
            </Avatar>
            <Label htmlFor="profile-avatar" className="text-xs text-muted-foreground">
              Avatar URL
            </Label>
            <Input
              id="profile-avatar"
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-name">Name</Label>
            <Input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-email">Email</Label>
            <Input
              id="profile-email"
              type="email"
              value={email}
              readOnly
              disabled
              className="w-full bg-muted cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-country">Country</Label>
            <select
              id="profile-country"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className={cn(
                "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              )}
            >
              <option value="">— Select —</option>
              {COUNTRY_OPTIONS.map(({ code, name: countryName }) => (
                <option key={code} value={code}>
                  {countryName}
                </option>
              ))}
            </select>
          </div>
          {message && (
            <p className={cn("text-sm", message.startsWith("Failed") ? "text-destructive" : "text-muted-foreground")}>
              {message}
            </p>
          )}
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
