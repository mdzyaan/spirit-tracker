# Ramadan Tracker

Next.js app to track Ramadan days: Quran, charity, and salah (Fajr, Dhuhr, Asr, Maghrib, Isha, Taraweeh).

## Stack

- Next.js 15 (App Router)
- TypeScript
- Supabase (Auth + Database)
- Redux Toolkit
- shadcn/ui + Tailwind CSS
- Monochromatic theme

## Setup

1. **Install**

   ```bash
   npm install
   ```

2. **Supabase**

   - Create a project at [supabase.com](https://supabase.com).
   - Copy `.env.example` to `.env.local` and set:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Run migrations (Supabase Dashboard SQL Editor or CLI):
     - Paste and run `supabase/migrations/001_schema.sql`
   - Enable Google OAuth in Authentication > Providers and add your redirect URL.

3. **Run**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). Root redirects to `/dashboard`. Use `/login` to sign in with Google (after OAuth is configured).

## Routes

- `/` — redirects to `/dashboard`
- `/login` — Google sign-in
- `/dashboard` — Ramadan tracker grid (30 days × Quran, Charity, 6 prayers)
- `/stats` — KPIs and charts
- `/settings` — Theme and profile

## Env

See `.env.example`. Required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
