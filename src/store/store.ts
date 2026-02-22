import type { Reducer } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/slices/authSlice";
import trackerReducer from "@/store/slices/trackerSlice";
import statsReducer from "@/store/slices/statsSlice";
import type { StatsState } from "@/store/slices/statsSlice";
import uiReducer from "@/store/slices/uiSlice";
import ramadanReducer from "@/store/slices/ramadanSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tracker: trackerReducer,
    stats: statsReducer as Reducer<StatsState>,
    ui: uiReducer,
    ramadan: ramadanReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
