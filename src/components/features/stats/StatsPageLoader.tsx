"use client";

import { useStats } from "@/hooks/useStats";
import { useTracker } from "@/hooks/useTracker";

export function StatsPageLoader() {
  // Ensure tracker data is loaded (handles direct navigation to /stats)
  useTracker();
  useStats();
  return null;
}
