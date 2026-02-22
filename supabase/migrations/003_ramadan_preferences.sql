-- Ramadan preferences: country (for API-based start) + per-year manual overrides

-- Add country_code to profiles (ISO 3166-1 alpha-2, e.g. TR, SA, US)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS country_code TEXT;

-- Per-year manual override for Ramadan start date
CREATE TABLE IF NOT EXISTS public.user_ramadan_overrides (
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year       INT         NOT NULL,
  start_date DATE        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, year)
);

-- RLS
ALTER TABLE public.user_ramadan_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own ramadan overrides"
  ON public.user_ramadan_overrides
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
