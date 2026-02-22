import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type RamadanState = {
  isRamadan: boolean;
  startDate: string | null;
  loaded: boolean;
};

const initialState: RamadanState = {
  isRamadan: false,
  startDate: null,
  loaded: false,
};

const ramadanSlice = createSlice({
  name: "ramadan",
  initialState,
  reducers: {
    setRamadanState(
      state,
      action: PayloadAction<{ isRamadan: boolean; startDate: string | null }>
    ) {
      state.isRamadan = action.payload.isRamadan;
      state.startDate = action.payload.startDate;
      state.loaded = true;
    },
    clearRamadanState(state) {
      state.isRamadan = false;
      state.startDate = null;
      state.loaded = true;
    },
  },
});

export const { setRamadanState, clearRamadanState } = ramadanSlice.actions;
export default ramadanSlice.reducer;
