import type { Metadata } from "next";
import "./globals.css";
import { ReduxProvider } from "@/store/provider";
import { AuthListener } from "@/components/features/auth/AuthListener";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Ramadan Tracker",
  description: "Track your Ramadan days — Quran, charity, and salah.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <ReduxProvider>
          <ThemeProvider>
            <AuthListener />
            {children}
            <SpeedInsights />
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
