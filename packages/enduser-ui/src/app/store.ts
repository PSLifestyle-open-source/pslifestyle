import notificationSlice from "../common/store/notificationSlice";
import anonSessionSlice from "../features/auth/anonSessionSlice";
import authedSessionSlice from "../features/auth/authedSessionSlice";
import locationSlice from "../features/location/locationSlice";
import userPlanSlice from "../features/plan/userPlanSlice";
import questionnaireSlice from "../features/questionnaire/questionnaireSlice";
import userAnswersSlice from "../features/questionnaire/userAnswersSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import storageSession from "redux-persist/lib/storage/session";

const anonSessionConfig = {
  key: "anonSession",
  storage: storageSession,
};

const authedSessionConfig = {
  key: "auth",
  storage,
};

const locationConfig = {
  key: "location",
  storage,
};

const questionnaireConfig = {
  key: "questionnaire",
  storage: storageSession,
};

const answersConfig = {
  key: "userAnswers",
  storage: storageSession,
};

const planConfig = {
  key: "userPlan",
  storage: storageSession,
};

export const store = configureStore({
  devTools: true,
  reducer: combineReducers({
    notification: notificationSlice.reducer,
    anonSession: persistReducer(anonSessionConfig, anonSessionSlice.reducer),
    authedSession: persistReducer(
      authedSessionConfig,
      authedSessionSlice.reducer,
    ),
    location: persistReducer(locationConfig, locationSlice.reducer),
    questionnaire: persistReducer(
      questionnaireConfig,
      questionnaireSlice.reducer,
    ),
    userAnswers: persistReducer(answersConfig, userAnswersSlice.reducer),
    userPlan: persistReducer(planConfig, userPlanSlice.reducer),
  }),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export function useAppDispatch() {
  return useDispatch<AppDispatch>();
}
