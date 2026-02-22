"use client";

import { useAppSelector } from "@/store/hooks";

export function useAuth() {
  const user = useAppSelector((s) => s.auth.user);
  const session = useAppSelector((s) => s.auth.session);
  const initialized = useAppSelector((s) => s.auth.initialized);
  const loading = useAppSelector((s) => s.auth.loading);
  return {
    user,
    session,
    isAuthenticated: !!session,
    initialized,
    loading,
  };
}
