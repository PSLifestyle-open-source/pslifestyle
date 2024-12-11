import type { RootState } from "../../app/store";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AnonSessionState {
  anonId: string | null;
}

const initialState: AnonSessionState = { anonId: null };

const anonSessionSlice = createSlice({
  name: "anonSession",
  initialState,
  reducers: {
    setAnonSession(state, action: PayloadAction<string>) {
      state.anonId = action.payload;
    },
    clearAnonSession(state) {
      state.anonId = null;
    },
  },
});

export default anonSessionSlice;
export const anonSessionActions = anonSessionSlice.actions;
export const anonSessionSelectors = {
  anonId: (state: RootState) => state.anonSession.anonId,
};
