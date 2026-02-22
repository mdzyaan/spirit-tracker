export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string | null;
          avatar_url: string | null;
          country_code: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          avatar_url?: string | null;
          country_code?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          avatar_url?: string | null;
          country_code?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          latitude: number | null;
          longitude: number | null;
          country: string | null;
          calculation_method: number;
          timezone: string | null;
          ramadan_override_start: string | null;
          gender: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          latitude?: number | null;
          longitude?: number | null;
          country?: string | null;
          calculation_method?: number;
          timezone?: string | null;
          ramadan_override_start?: string | null;
          gender?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          latitude?: number | null;
          longitude?: number | null;
          country?: string | null;
          calculation_method?: number;
          timezone?: string | null;
          ramadan_override_start?: string | null;
          gender?: string | null;
          created_at?: string;
        };
      };
      hijri_calendar_cache: {
        Row: {
          id: string;
          year: number;
          month: number;
          day: number;
          latitude: number;
          longitude: number;
          method: number;
          data: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          year: number;
          month: number;
          day: number;
          latitude: number;
          longitude: number;
          method: number;
          data: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          year?: number;
          month?: number;
          day?: number;
          latitude?: number;
          longitude?: number;
          method?: number;
          data?: Json;
          created_at?: string;
        };
      };
      tracker_days: {
        Row: {
          id: string;
          user_id: string;
          year: number;
          day_number: number;
          date: string;
          quran: boolean;
          charity: boolean;
          fasting: boolean;
          fajr: string | null;
          dhuhr: string | null;
          asr: string | null;
          maghrib: string | null;
          isha: string | null;
          taraweeh: number | null;
          tahajud: number | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          year: number;
          day_number: number;
          date: string;
          quran?: boolean;
          charity?: boolean;
          fasting?: boolean;
          fajr?: string | null;
          dhuhr?: string | null;
          asr?: string | null;
          maghrib?: string | null;
          isha?: string | null;
          taraweeh?: number | null;
          tahajud?: number | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          year?: number;
          day_number?: number;
          date?: string;
          quran?: boolean;
          charity?: boolean;
          fasting?: boolean;
          fajr?: string | null;
          dhuhr?: string | null;
          asr?: string | null;
          maghrib?: string | null;
          isha?: string | null;
          taraweeh?: number | null;
          tahajud?: number | null;
          updated_at?: string;
        };
      };
    };
  };
}
