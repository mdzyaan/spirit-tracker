import Image from "next/image";
import { LandingCta } from "@/components/features/landing/LandingCta";

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
              alt=""
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
                alt=""
                width={80}
                height={80}
                className="object-contain"
                unoptimized
              />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Track your Ramadan
              <br />
              <span className="text-primary">day by day</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              Log prayers, Quran, and taraweeh in one place. Build habits and see your progress throughout the blessed month.
            </p>
            <div className="mt-8">
              <LandingCta size="lg" />
            </div>
          </section>

          {/* Feature highlights with assets */}
          <section className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <Image
                  src="/assets/quran.png"
                  alt=""
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
                  alt=""
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
                  alt=""
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
          </section>

          {/* Bottom CTA */}
          <section className="mt-24 flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center sm:p-12">
            <Image
              src="/assets/moon.png"
              alt=""
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
