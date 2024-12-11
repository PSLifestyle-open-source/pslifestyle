import anonSessionSlice from "../../features/auth/anonSessionSlice";
import authedSessionSlice from "../../features/auth/authedSessionSlice";
import locationSlice from "../../features/location/locationSlice";
import userPlanSlice from "../../features/plan/userPlanSlice";
import questionnaireSlice from "../../features/questionnaire/questionnaireSlice";
import userAnswersSlice from "../../features/questionnaire/userAnswersSlice";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import type { RenderOptions } from "@testing-library/react";
import { render as origRender } from "@testing-library/react";
import React from "react";
import { useDispatch, Provider } from "react-redux";

const rootReducer = combineReducers({
  anonSession: anonSessionSlice.reducer,
  authedSession: authedSessionSlice.reducer,
  location: locationSlice.reducer,
  questionnaire: questionnaireSlice.reducer,
  userAnswers: userAnswersSlice.reducer,
  userPlan: userPlanSlice.reducer,
});

export const setupStore = (preloadedState: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  });

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];

export function useAppDispatch() {
  return useDispatch<AppDispatch>();
}

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}

export function render(
  ui: React.ReactElement,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  const Wrapper = ({
    children,
  }: {
    children: React.ReactNode;
  }): JSX.Element => <Provider store={store}> {children} </Provider>;
  return { store, ...origRender(ui, { wrapper: Wrapper, ...renderOptions }) };
}
