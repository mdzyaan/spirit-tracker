"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "@/components/shared/Loader";

/**
 * Optional client guard: shows loader until auth is initialized, then redirects to login if not authenticated.
 * Middleware is the primary protection; this improves UX (no flash of protected content).
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { initialized, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initialized) return;
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [initialized, isAuthenticated, router]);

  if (!initialized) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }
  if (!isAuthenticated) {
    return null;
  }
  return <>{children}</>;
}
