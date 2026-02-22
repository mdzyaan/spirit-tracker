"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/store/hooks";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppSelector((s) => s.ui.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return <>{children}</>;
}
