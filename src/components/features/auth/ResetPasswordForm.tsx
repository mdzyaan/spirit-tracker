"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { updatePassword, getSession } from "@/services/auth.service";

const SESSION_CHECK_TIMEOUT_MS = 2500;

export function ResetPasswordForm() {
  const router = useRouter();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    getSession()
      .then((session) => {
        if (cancelled) return;
        if (session) {
          setHasSession(true);
          setSessionChecked(true);
          return;
        }
        timeoutId = setTimeout(() => {
          if (cancelled) return;
          getSession().then((s) => {
            if (cancelled) return;
            setHasSession(!!s);
            setSessionChecked(true);
          });
        }, SESSION_CHECK_TIMEOUT_MS);
      })
      .catch(() => {
        if (!cancelled) setSessionChecked(true);
      });
    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await updatePassword(password);
      setSuccess(true);
      setTimeout(() => {
        router.push("/login?reset=success");
        router.refresh();
      }, 1500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  if (!sessionChecked) {
    return (
      <Card className="w-full max-w-sm border-border bg-card">
        <CardContent className="py-12 text-center text-muted-foreground">
          Loading…
        </CardContent>
      </Card>
    );
  }

  if (!hasSession) {
    return (
      <Card className="w-full max-w-sm border-border bg-card">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-xl">Invalid or expired link</CardTitle>
          <CardDescription>
            This reset link is invalid or has expired. Request a new one from the sign-in page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="default" className="w-full" asChild>
            <Link href="/login">Back to sign in</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (success) {
    return (
      <Card className="w-full max-w-sm border-border bg-card">
        <CardContent className="py-12 text-center">
          <p className="text-foreground">Password updated. Redirecting to sign in…</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm border-border bg-card">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-2 relative w-12 h-12 mx-auto">
          <Image
            src="/assets/islam-crescent.png"
            alt="Ramadan Tracker"
            width={48}
            height={48}
            className="object-contain"
            unoptimized
          />
        </div>
        <CardTitle className="text-xl">Set new password</CardTitle>
        <CardDescription>
          Enter your new password below.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            variant="default"
            size="lg"
            disabled={loading}
          >
            {loading ? "Updating…" : "Update password"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">
            Back to sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
