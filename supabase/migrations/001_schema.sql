-- Profiles: 1:1 with auth.users, created on first login
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Ramadan years: one per user per year
CREATE TABLE IF NOT EXISTS public.ramadan_years (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  year INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, year)
);

-- Ramadan days: 30 per ramadan_year
CREATE TABLE IF NOT EXISTS public.ramadan_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ramadan_year_id UUID NOT NULL REFERENCES public.ramadan_years(id) ON DELETE CASCADE,
  day_number INT NOT NULL CHECK (day_number >= 1 AND day_number <= 30),
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(ramadan_year_id, day_number)
);

-- Quran logs: one per ramadan_day
CREATE TABLE IF NOT EXISTS public.quran_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ramadan_day_id UUID NOT NULL REFERENCES public.ramadan_days(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  quantity NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(ramadan_day_id)
);

-- Charity logs: one per ramadan_day
CREATE TABLE IF NOT EXISTS public.charity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ramadan_day_id UUID NOT NULL REFERENCES public.ramadan_days(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  amount NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(ramadan_day_id)
);

-- Prayer names enum
CREATE TYPE prayer_name_enum AS ENUM (
  'fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'taraweeh'
);

-- Salah logs: up to 6 per ramadan_day (one per prayer)
CREATE TABLE IF NOT EXISTS public.salah_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ramadan_day_id UUID NOT NULL REFERENCES public.ramadan_days(id) ON DELETE CASCADE,
  prayer_name prayer_name_enum NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  dhikr_count INT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(ramadan_day_id, prayer_name)
);

-- Trigger: create profile on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS: profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS: ramadan_years
ALTER TABLE public.ramadan_years ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own ramadan_years"
  ON public.ramadan_years
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS: ramadan_days (via ramadan_years)
ALTER TABLE public.ramadan_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage ramadan_days via own year"
  ON public.ramadan_days
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.ramadan_years ry
      WHERE ry.id = ramadan_days.ramadan_year_id AND ry.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.ramadan_years ry
      WHERE ry.id = ramadan_days.ramadan_year_id AND ry.user_id = auth.uid()
    )
  );

-- RLS: quran_logs (via ramadan_days -> ramadan_years)
ALTER TABLE public.quran_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage quran_logs via own year"
  ON public.quran_logs
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.ramadan_days rd
      JOIN public.ramadan_years ry ON ry.id = rd.ramadan_year_id
      WHERE rd.id = quran_logs.ramadan_day_id AND ry.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.ramadan_days rd
      JOIN public.ramadan_years ry ON ry.id = rd.ramadan_year_id
      WHERE rd.id = quran_logs.ramadan_day_id AND ry.user_id = auth.uid()
    )
  );

-- RLS: charity_logs
ALTER TABLE public.charity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage charity_logs via own year"
  ON public.charity_logs
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.ramadan_days rd
      JOIN public.ramadan_years ry ON ry.id = rd.ramadan_year_id
      WHERE rd.id = charity_logs.ramadan_day_id AND ry.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.ramadan_days rd
      JOIN public.ramadan_years ry ON ry.id = rd.ramadan_year_id
      WHERE rd.id = charity_logs.ramadan_day_id AND ry.user_id = auth.uid()
    )
  );

-- RLS: salah_logs
ALTER TABLE public.salah_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage salah_logs via own year"
  ON public.salah_logs
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.ramadan_days rd
      JOIN public.ramadan_years ry ON ry.id = rd.ramadan_year_id
      WHERE rd.id = salah_logs.ramadan_day_id AND ry.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.ramadan_days rd
      JOIN public.ramadan_years ry ON ry.id = rd.ramadan_year_id
      WHERE rd.id = salah_logs.ramadan_day_id AND ry.user_id = auth.uid()
    )
  );

-- updated_at trigger helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at to profiles, quran_logs, charity_logs, salah_logs
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_quran_logs_updated_at
  BEFORE UPDATE ON public.quran_logs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_charity_logs_updated_at
  BEFORE UPDATE ON public.charity_logs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_salah_logs_updated_at
  BEFORE UPDATE ON public.salah_logs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
