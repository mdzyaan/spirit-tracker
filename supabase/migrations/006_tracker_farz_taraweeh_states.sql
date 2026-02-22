-- Farz Salah: boolean -> TEXT (nullable), values: mosque, on_time, qaza, missed, not_applicable
-- Taraweeh: boolean -> SMALLINT (0-20 in steps of 2), 0 = not prayed
-- Backfill: true -> 'on_time' / 20, false -> NULL / 0

-- Allow NULL on Farz columns before type change (USING produces NULL for false)
ALTER TABLE public.tracker_days
  ALTER COLUMN fajr DROP NOT NULL,
  ALTER COLUMN dhuhr DROP NOT NULL,
  ALTER COLUMN asr DROP NOT NULL,
  ALTER COLUMN maghrib DROP NOT NULL,
  ALTER COLUMN isha DROP NOT NULL;

ALTER TABLE public.tracker_days
  ALTER COLUMN fajr TYPE TEXT USING (CASE WHEN fajr THEN 'on_time' ELSE NULL END),
  ALTER COLUMN dhuhr TYPE TEXT USING (CASE WHEN dhuhr THEN 'on_time' ELSE NULL END),
  ALTER COLUMN asr TYPE TEXT USING (CASE WHEN asr THEN 'on_time' ELSE NULL END),
  ALTER COLUMN maghrib TYPE TEXT USING (CASE WHEN maghrib THEN 'on_time' ELSE NULL END),
  ALTER COLUMN isha TYPE TEXT USING (CASE WHEN isha THEN 'on_time' ELSE NULL END);

-- Drop boolean default before type change, then set new default
ALTER TABLE public.tracker_days ALTER COLUMN taraweeh DROP DEFAULT;
ALTER TABLE public.tracker_days
  ALTER COLUMN taraweeh TYPE SMALLINT USING (CASE WHEN taraweeh THEN 20 ELSE 0 END);
ALTER TABLE public.tracker_days ALTER COLUMN taraweeh SET DEFAULT 0;
