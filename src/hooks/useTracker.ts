"use client";

import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchTrackerData } from "@/store/thunks/trackerThunks";
import { useAuth } from "./useAuth";

export function useTracker() {
  const { user, session, initialized } = useAuth();
  const dispatch = useAppDispatch();
  const { days, year, status, error } = useAppSelector((s) => s.tracker);

  const userId = user?.id ?? session?.user?.id;

  useEffect(() => {
    if (!initialized || !userId) return;
    if (status !== "idle") return;
    dispatch(fetchTrackerData({ userId, year: year ?? undefined }));
  }, [initialized, userId, status, year, dispatch]);

  return { days, year, status, error };
}
