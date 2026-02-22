"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { signInWithPassword, signUp, requestPasswordReset } from "@/services/auth.service";

type Mode = "signin" | "signup" | "forgot";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get("reset") === "success") {
      setResetSuccess(true);
      router.replace("/login", { scroll: false });
    }
  }, [searchParams, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithPassword(email, password);
      router.push("/dashboard");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSignUpSuccess(false);
    try {
      const data = await signUp(email, password, name || undefined);
      if (data.session) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setSignUpSuccess(true);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMode = () => {
    setMode((m) => (m === "signin" ? "signup" : "signin"));
    setError(null);
    setSignUpSuccess(false);
    setForgotSuccess(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Enter your email address.");
      return;
    }
    setLoading(true);
    setError(null);
    setForgotSuccess(false);
    try {
      const redirectTo = `${window.location.origin}/auth/callback?next=/reset-password`;
      await requestPasswordReset(email.trim(), redirectTo);
      setForgotSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  const showForgotForm = () => {
    setMode("forgot");
    setError(null);
    setForgotSuccess(false);
  };

  const backToSignIn = () => {
    setMode("signin");
    setError(null);
    setForgotSuccess(false);
  };

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
        <CardTitle className="text-xl">Ramadan Tracker</CardTitle>
        <CardDescription>
          {mode === "signin"
            ? "Sign in to track your Ramadan days."
            : mode === "forgot"
              ? "Enter your email and we’ll send you a link to reset your password."
              : "Create an account to get started."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {signUpSuccess && (
          <p className="text-sm text-foreground bg-muted p-3 rounded-md">
            Check your email to confirm your account, then sign in below.
          </p>
        )}
        {forgotSuccess && (
          <p className="text-sm text-foreground bg-muted p-3 rounded-md">
            Check your email for a link to reset your password. The link may take a few minutes to arrive.
          </p>
        )}
        {resetSuccess && (
          <p className="text-sm text-foreground bg-muted p-3 rounded-md">
            Your password has been updated. Sign in with your new password.
          </p>
        )}
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        {mode === "signin" ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={showForgotForm}
                  className="text-sm text-primary underline-offset-4 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              variant="default"
              size="lg"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        ) : mode === "forgot" ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Email</Label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              variant="default"
              size="lg"
              disabled={loading}
            >
              {loading ? "Sending…" : "Send reset link"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={backToSignIn}
            >
              Back to sign in
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name (optional)</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              variant="default"
              size="lg"
              disabled={loading}
            >
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </form>
        )}
        <p className="text-center text-sm text-muted-foreground">
          {mode === "signin" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={handleToggleMode}
                className="text-primary underline-offset-4 hover:underline"
              >
                Create account
              </button>
            </>
          ) : mode === "forgot" ? (
            <>
              Remember your password?{" "}
              <button
                type="button"
                onClick={backToSignIn}
                className="text-primary underline-offset-4 hover:underline"
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={handleToggleMode}
                className="text-primary underline-offset-4 hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </CardContent>
    </Card>
  );
}
