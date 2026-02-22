import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Profile = {
  id: string;
  name: string | null;
  avatar_url: string | null;
  country_code: string | null;
  created_at?: string;
  updated_at?: string;
};

export type Session = {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  user?: { id: string; email?: string };
};

type AuthState = {
  user: Profile | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
};

const initialState: AuthState = {
  user: null,
  session: null,
  loading: false,
  initialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<Profile | null>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
      state.session = null;
    },
    setSession(state, action: PayloadAction<Session | null>) {
      state.session = action.payload;
    },
    setInitialized(state, action: PayloadAction<boolean>) {
      state.initialized = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setUser, clearUser, setSession, setInitialized, setLoading } =
  authSlice.actions;
export default authSlice.reducer;
