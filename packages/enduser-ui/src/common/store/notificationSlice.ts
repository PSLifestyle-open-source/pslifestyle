import { RootState } from "../../app/store";
import { createSelector, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Notification {
  id: string;
}

export interface NotificationState {
  notifications: { [id: string]: Notification };
}

const initialState: NotificationState = { notifications: {} };

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification(state, { payload }: PayloadAction<Notification>) {
      state.notifications[payload.id] = payload;
    },
    deleteNotification(state, { payload }: PayloadAction<string>) {
      delete state.notifications[payload];
    },
  },
});

const notifications = (state: RootState) => state.notification.notifications;

export default notificationSlice;

export const notificationActions = notificationSlice.actions;

export const notificationSelectors = {
  notifications: createSelector([notifications], (messages) =>
    Object.values(messages),
  ),
};
