-- Replace key-value user_settings with structured Ramadan settings.
-- Existing users will have no row until they complete onboarding.

DROP TRIGGER IF EXISTS set_user_settings_updated_at ON public.user_settings;
DROP POLICY IF EXISTS "Users can manage own settings" ON public.user_settings;
DROP TABLE IF EXISTS public.user_settings;

CREATE TABLE public.user_settings (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  latitude              DOUBLE PRECISION,
  longitude             DOUBLE PRECISION,
  country               TEXT,
  calculation_method    INT NOT NULL DEFAULT 2,
  timezone              TEXT,
  ramadan_override_start DATE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own settings"
  ON public.user_settings
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Hijri calendar cache for AlAdhan gToH API (one row per Gregorian date + location + method)
CREATE TABLE public.hijri_calendar_cache (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year       INT NOT NULL,
  month      INT NOT NULL,
  day        INT NOT NULL,
  latitude   DOUBLE PRECISION NOT NULL,
  longitude  DOUBLE PRECISION NOT NULL,
  method     INT NOT NULL,
  data       JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(year, month, day, latitude, longitude, method)
);

ALTER TABLE public.hijri_calendar_cache ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read and insert cache entries (shared cache)
CREATE POLICY "Authenticated can read hijri cache"
  ON public.hijri_calendar_cache FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Authenticated can insert hijri cache"
  ON public.hijri_calendar_cache FOR INSERT
  TO authenticated WITH CHECK (true);
