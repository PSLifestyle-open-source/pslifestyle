import { ContainerLoader } from "../common/components/loaders/ContainerLoader";
import { useFullMathScope } from "../common/hooks/firebaseHooks";
import { authedSessionSelectors } from "../features/auth/authedSessionSlice";
import { locationActions } from "../features/location/locationSlice";
import { userPlanActions } from "../features/plan/userPlanSlice";
import {
  fetchSavedAnswers,
  userAnswersSelectors,
} from "../features/questionnaire/userAnswersSlice";
import { fetchUserPlan } from "../firebase/api/fetchUserPlan";
import { useActionsForCurrentCountry } from "../firebase/db/recommendedActions";
import { useAppDispatch } from "./store";
import { createActionsBuilder } from "@pslifestyle/common/src/dataBuilders/actionsBuilder";
import { CalculatedAction } from "@pslifestyle/common/src/types/planTypes";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const updateActionsWithNewData = (
  actionsToUpdate: CalculatedAction[],
  latestCalculatedActions: CalculatedAction[],
) =>
  actionsToUpdate.map((actionToUpdate) => {
    // If we have newer version of data for action, we want to update persisted plan
    const latestActionObject = latestCalculatedActions.find(
      (action) =>
        action.id === actionToUpdate.id &&
        action.actionsVersion !== actionToUpdate.actionsVersion,
    );

    return latestActionObject
      ? {
          ...latestActionObject,
          state: actionToUpdate.state,
        }
      : actionToUpdate;
  });

export const InitializationWrapper = () => {
  const dispatch = useAppDispatch();
  const user = useSelector(authedSessionSelectors.user);
  const totalFootprint = useSelector(userAnswersSelectors.totalFootprint);
  const { fullMathScope } = useFullMathScope();
  const { data: actions } = useActionsForCurrentCountry();

  const [initializingAnswers, setInitializingAnswers] = useState(true);
  const [initializingPlan, setInitializingPlan] = useState(true);

  useEffect(() => {
    async function initAnswers() {
      setInitializingAnswers(true);
      if (user) {
        try {
          const { countryCode } = await dispatch(fetchSavedAnswers()).unwrap();
          dispatch(locationActions.setCountryCode(countryCode, false));
        } catch (error) {
          console.log((error as Error).message || error);
        }
      }
      setInitializingAnswers(false);
    }
    initAnswers();
  }, [dispatch, user]);

  useEffect(() => {
    async function initPlan() {
      setInitializingPlan(true);
      if (actions && fullMathScope) {
        try {
          const userPlanResponse = user ? await fetchUserPlan() : undefined;
          const userPlan = userPlanResponse?.data;

          const [actionsVersion, recommendedActions] = actions;

          const calculator = createActionsBuilder(
            actionsVersion,
            fullMathScope,
            totalFootprint,
          );

          const applicableActions = calculator.calculateApplicableActionsImpact(
            calculator.prepareApplicableActions(recommendedActions),
          );
          dispatch(
            userPlanActions.initializeUserPlan({
              applicableActions,
              selectedActions: userPlan
                ? updateActionsWithNewData(
                    userPlan.selectedActions,
                    applicableActions,
                  )
                : undefined,
              alreadyDoThisActions: userPlan
                ? updateActionsWithNewData(
                    userPlan.alreadyDoThisActions,
                    applicableActions,
                  )
                : undefined,
              skippedActions: userPlan?.skippedActions,
            }),
          );
        } catch (error) {
          console.log((error as Error).message || error);
        }
      }
      setInitializingPlan(false);
    }
    initPlan();
  }, [dispatch, totalFootprint, user, fullMathScope, actions]);

  return (
    <ContainerLoader loading={initializingAnswers || initializingPlan}>
      <Outlet />
    </ContainerLoader>
  );
};
