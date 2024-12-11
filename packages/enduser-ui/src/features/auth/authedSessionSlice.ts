import { RootState } from "../../app/store";
import { User } from "@pslifestyle/common/src/models/user";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AuthedSessionState {
  magicLinkEmail: string | null;
  user: User | null;
}

const initialState: AuthedSessionState = { magicLinkEmail: null, user: null };

const authedSessionSlice = createSlice({
  name: "authedSession",
  initialState,
  reducers: {
    logOut() {
      return initialState;
    },
    setMagicLinkEmail(state, action: PayloadAction<string>) {
      state.magicLinkEmail = action.payload;
    },
    setUserLoggedIn(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
  },
});

export default authedSessionSlice;
export const authedSessionActions = authedSessionSlice.actions;
export const authedSessionSelectors = {
  magicLinkEmail: (state: RootState) => state.authedSession.magicLinkEmail,
  user: (state: RootState) => state.authedSession.user,
};
