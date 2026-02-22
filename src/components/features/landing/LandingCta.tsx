"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getSession } from "@/services/auth.service";

type LandingCtaProps = {
  variant?: "solid" | "outline";
  size?: "sm" | "lg";
  className?: string;
};

export function LandingCta({ variant = "solid", size = "lg", className }: LandingCtaProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    getSession().then((session) => setIsLoggedIn(!!session));
  }, []);

  if (isLoggedIn === null) {
    return (
      <Button
        variant={variant}
        styleVariant="primary"
        size={size}
        className={className}
        disabled
      >
        …
      </Button>
    );
  }

  if (isLoggedIn) {
    return (
      <Button variant={variant} styleVariant="primary" size={size} className={className}>
        <Link href="/dashboard">Dashboard</Link>
      </Button>
    );
  }

  return (
    <Button variant={variant} styleVariant="primary" size={size} className={className}>
      <Link href="/login">Get started</Link>
    </Button>
  );
}
