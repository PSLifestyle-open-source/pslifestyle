import { history } from "../../app/Router";
import { initializeUserSession } from "../../app/session";
import { AppDispatch, RootState } from "../../app/store";
import { anonSessionActions } from "../../features/auth/anonSessionSlice";
import { authedSessionActions } from "../../features/auth/authedSessionSlice";
import { userPlanActions } from "../../features/plan/userPlanSlice";
import { questionnaireActions } from "../../features/questionnaire/questionnaireSlice";
import { userAnswersActions } from "../../features/questionnaire/userAnswersSlice";
import { notificationActions } from "./notificationSlice";
import { createAction } from "@reduxjs/toolkit";

export const resetStateForTesting = createAction<Partial<RootState>>(
  "resetStateForTesting",
);

export function resetEntityStores() {
  return (dispatch: AppDispatch) => {
    dispatch(userPlanActions.resetUserPlan());
    dispatch(userAnswersActions.resetUserAnswers());
    dispatch(questionnaireActions.resetQuestionnaire());
  };
}

export function fullyLogoutUser() {
  return (dispatch: AppDispatch) => {
    dispatch(resetEntityStores());
    dispatch(authedSessionActions.logOut());
    dispatch(anonSessionActions.clearAnonSession());
    history.push("/");
    initializeUserSession();
  };
}

export function userSessionExpired() {
  return (dispatch: AppDispatch) => {
    dispatch(fullyLogoutUser());
    dispatch(notificationActions.addNotification({ id: "sessionExpired" }));
  };
}

export const commonActions = {
  fullyLogoutUser,
  resetEntityStores,
};
