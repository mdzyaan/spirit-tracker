-- Drop old normalized tracker tables (order matters due to FK constraints)
DROP TABLE IF EXISTS public.salah_logs CASCADE;
DROP TABLE IF EXISTS public.quran_logs CASCADE;
DROP TABLE IF EXISTS public.charity_logs CASCADE;
DROP TABLE IF EXISTS public.ramadan_days CASCADE;
DROP TABLE IF EXISTS public.ramadan_years CASCADE;
DROP TYPE IF EXISTS prayer_name_enum CASCADE;

-- Single flat table: one row per user per Ramadan day
-- All 8 trackable items are boolean columns — no joins needed
CREATE TABLE IF NOT EXISTS public.tracker_days (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year        INT         NOT NULL,
  day_number  INT         NOT NULL CHECK (day_number BETWEEN 1 AND 30),
  date        DATE        NOT NULL,
  quran       BOOLEAN     NOT NULL DEFAULT false,
  charity     BOOLEAN     NOT NULL DEFAULT false,
  fajr        BOOLEAN     NOT NULL DEFAULT false,
  dhuhr       BOOLEAN     NOT NULL DEFAULT false,
  asr         BOOLEAN     NOT NULL DEFAULT false,
  maghrib     BOOLEAN     NOT NULL DEFAULT false,
  isha        BOOLEAN     NOT NULL DEFAULT false,
  taraweeh    BOOLEAN     NOT NULL DEFAULT false,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, year, day_number)
);

-- Fast lookup for the primary query pattern: WHERE user_id = ? AND year = ?
CREATE INDEX IF NOT EXISTS idx_tracker_days_user_year
  ON public.tracker_days(user_id, year);

-- RLS: simple column equality — no joins, no subqueries
ALTER TABLE public.tracker_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own tracker_days"
  ON public.tracker_days
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- updated_at trigger
CREATE TRIGGER set_tracker_days_updated_at
  BEFORE UPDATE ON public.tracker_days
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
