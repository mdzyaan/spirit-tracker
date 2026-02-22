import type { Metadata } from "next";
import Image from "next/image";
import { LandingCta } from "@/components/features/landing/LandingCta";

export const metadata: Metadata = {
  title: "Ramadan Tracker — Perfect Your Ramadan Day by Day",
  description:
    "Track prayers, Quran, and taraweeh during Ramadan. For everyone — boys and girls perfecting their life with Ramzan. Build habits and see your progress.",
  keywords: [
    "Ramadan",
    "Ramzan",
    "prayer tracker",
    "Quran tracker",
    "taraweeh",
    "salah",
    "Islamic habits",
  ],
  openGraph: {
    title: "Ramadan Tracker — Perfect Your Ramadan Day by Day",
    description:
      "Track prayers, Quran, and taraweeh during Ramadan. For everyone — boys and girls perfecting their life with Ramzan.",
    images: [{ url: "/assets/lantern-colored.png", width: 80, height: 80, alt: "Ramadan lantern" }],
  },
  twitter: {
    card: "summary",
    title: "Ramadan Tracker — Perfect Your Ramadan Day by Day",
    description:
      "Track prayers, Quran, and taraweeh during Ramadan. For everyone — boys and girls perfecting their life with Ramzan.",
  },
};

export default function HomePage() {
  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Soft brand glow behind hero */}
        <div
          className="pointer-events-none fixed inset-0 z-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -20%, var(--semantics-brand-bg-soft-default), transparent)",
          }}
        />
        <header className="relative z-10 flex items-center justify-between border-b border-border bg-card/80 px-4 py-3 backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-2">
            <Image
              src="/assets/islam-crescent.png"
              alt="Islamic crescent logo"
              width={32}
              height={32}
              className="object-contain"
              unoptimized
            />
            <span className="font-semibold text-foreground">Ramadan Tracker</span>
          </div>
          <nav className="flex items-center gap-2">
            <LandingCta variant="outline" size="lg" />
          </nav>
        </header>

        <main className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:py-20">
          {/* Hero */}
          <section className="flex flex-col items-center text-center">
            <div className="mb-6 flex justify-center">
              <Image
                src="/assets/lantern-colored.png"
                alt="Decorative Ramadan lantern"
                width={80}
                height={80}
                className="object-contain"
                unoptimized
              />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Perfect your Ramadan
              <br />
              <span className="text-primary">day by day</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              For everyone — log prayers, Quran, and taraweeh in one place. Build habits and see your progress throughout the blessed month.
            </p>
            <div className="mt-8">
              <LandingCta size="lg" />
            </div>
          </section>

          {/* For everyone — boys and girls perfecting life with Ramzan */}
          <section className="mt-24 flex flex-col items-center text-center">
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
              For everyone — perfect your life with Ramzan
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Boys and girls use Ramadan Tracker to build consistency: track salah, Quran, and taraweeh so you can perfect your habits during the blessed month.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
              <div className="flex flex-col items-center gap-2">
                <Image
                  src="/assets/muslim-boy.png"
                  alt="Boy using Ramadan Tracker to perfect his Ramadan"
                  width={120}
                  height={120}
                  className="rounded-full object-cover ring-2 ring-border"
                  unoptimized
                />
                <span className="text-sm font-medium text-foreground">For boys</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Image
                  src="/assets/muslim-girl.png"
                  alt="Girl using Ramadan Tracker to perfect her Ramadan"
                  width={120}
                  height={120}
                  className="rounded-full object-cover ring-2 ring-border"
                  unoptimized
                />
                <span className="text-sm font-medium text-foreground">For girls</span>
              </div>
            </div>
          </section>

          {/* Feature highlights with assets */}
          <section className="mt-24" aria-labelledby="features-heading">
            <h2 id="features-heading" className="sr-only">
              Track what matters
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <Image
                  src="/assets/quran.png"
                  alt="Quran reading icon"
                  width={32}
                  height={32}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <h3 className="font-semibold text-foreground">Quran</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Mark days you read and keep a simple streak.
              </p>
            </div>
            <div className="flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <Image
                  src="/assets/mosque.png"
                  alt="Mosque and prayer icon"
                  width={32}
                  height={32}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <h3 className="font-semibold text-foreground">Salah & Taraweeh</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Track five daily prayers and taraweeh completion.
              </p>
            </div>
            <div className="flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center sm:col-span-2 lg:col-span-1">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <Image
                  src="/assets/star.png"
                  alt="Streak and achievement star icon"
                  width={32}
                  height={32}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <h3 className="font-semibold text-foreground">Streaks & stats</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                See your current streak and completion over time.
              </p>
            </div>
            </div>
          </section>

          {/* Bottom CTA */}
          <section className="mt-24 flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center sm:p-12">
            <Image
              src="/assets/moon.png"
              alt="Crescent moon"
              width={48}
              height={48}
              className="mb-4 object-contain opacity-90"
              unoptimized
            />
            <h2 className="text-2xl font-semibold text-foreground">
              Ready for this Ramadan?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Create an account and start tracking in seconds.
            </p>
            <LandingCta size="lg" className="mt-6" />
          </section>
        </main>

        <footer className="relative z-10 border-t border-border bg-card/50 py-6 text-center text-sm text-muted-foreground">
          <p>Ramadan Tracker — track prayers, Quran & taraweeh.</p>
        </footer>
      </div>
    </>
  );
}
