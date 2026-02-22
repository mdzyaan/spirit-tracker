import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Theme = "light" | "dark";

type UIState = {
  theme: Theme;
  loadingStates: Record<string, boolean>;
  modals: Record<string, boolean>;
};

const initialState: UIState = {
  theme: "light",
  loadingStates: {},
  modals: {},
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
    },
    setLoading(
      state,
      action: PayloadAction<{ key: string; value: boolean }>
    ) {
      const { key, value } = action.payload;
      state.loadingStates[key] = value;
    },
    openModal(state, action: PayloadAction<string>) {
      state.modals[action.payload] = true;
    },
    closeModal(state, action: PayloadAction<string>) {
      state.modals[action.payload] = false;
    },
  },
});

export const { setTheme, setLoading, openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;
