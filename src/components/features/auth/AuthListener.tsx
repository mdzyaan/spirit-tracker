"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAppDispatch } from "@/store/hooks";
import {
  setUser,
  setSession,
  setInitialized,
  setLoading,
} from "@/store/slices/authSlice";
import { resetTracker } from "@/store/slices/trackerSlice";
import { clearRamadanState } from "@/store/slices/ramadanSlice";
import { getProfile } from "@/services/auth.service";

export function AuthListener() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let supabase;
    try {
      supabase = createClient();
    } catch {
      dispatch(setInitialized(true));
      dispatch(setLoading(false));
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        dispatch(
          setSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token ?? undefined,
            expires_at: session.expires_at,
            user: { id: session.user.id, email: session.user.email },
          })
        );
        // Mark initialized immediately so the tracker can start loading.
        // getProfile is deferred outside the callback to avoid deadlocking
        // the Supabase internal auth lock with a simultaneous DB query.
        dispatch(setInitialized(true));
        dispatch(setLoading(false));

        const uid = session.user.id;
        setTimeout(async () => {
          try {
            const profile = await getProfile(uid);
            dispatch(setUser(profile ?? null));
          } catch {
            dispatch(setUser(null));
          }
        }, 0);
      } else {
        dispatch(setSession(null));
        dispatch(setUser(null));
        dispatch(setInitialized(true));
        dispatch(setLoading(false));
        if (event === "SIGNED_OUT") {
          dispatch(resetTracker());
          dispatch(clearRamadanState());
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return null;
}
