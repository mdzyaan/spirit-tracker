import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type StatsKPIs = {
  totalQuranDays: number;
  totalCharityDays: number;
  salahCompletionPercent: number;
  currentStreak: number;
  longestStreak: number;
};

export type Streaks = {
  current: number;
  longest: number;
};

export type ChartsData = {
  heatmap: { day: number; value: number }[];
  streak: { date: string; streak: number }[];
  completion: { category: string; completed: number; total: number }[];
  prayer: { prayer: string; completed: number; total: number }[];
};

export type StatsState = {
  stats: StatsKPIs | null;
  streaks: Streaks | null;
  chartsData: ChartsData | null;
  loading: boolean;
};

const initialState: StatsState = {
  stats: null,
  streaks: null,
  chartsData: null,
  loading: false,
};

const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    setStats(state, action: PayloadAction<StatsKPIs | null>) {
      state.stats = action.payload;
    },
    setStreaks(state, action: PayloadAction<Streaks | null>) {
      state.streaks = action.payload;
    },
    setChartsData(state, action: PayloadAction<ChartsData | null>) {
      state.chartsData = action.payload;
    },
    setStatsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const {
  setStats,
  setStreaks,
  setChartsData,
  setStatsLoading,
} = statsSlice.actions;
export default statsSlice.reducer;
