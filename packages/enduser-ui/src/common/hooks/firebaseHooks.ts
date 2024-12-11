import { AppDispatch } from "../../app/store";
import { anonSessionSelectors } from "../../features/auth/anonSessionSlice";
import {
  authedSessionActions,
  authedSessionSelectors,
} from "../../features/auth/authedSessionSlice";
import { locationSelectors } from "../../features/location/locationSlice";
import { userPlanSelectors } from "../../features/plan/userPlanSlice";
import { questionnaireSelectors } from "../../features/questionnaire/questionnaireSlice";
import {
  userAnswersActions,
  userAnswersSelectors,
} from "../../features/questionnaire/userAnswersSlice";
import {
  requestMagicLinkEmailAndAscendUser,
  requestMagicLinkEmail,
} from "../../firebase/api/requestLink";
import {
  createCampaign,
  updateCampaign,
} from "../../firebase/api/saveCampaign";
import { saveUserAnswers } from "../../firebase/api/saveUserAnswers";
import { saveUserFeedback } from "../../firebase/api/saveUserFeedback";
import { saveUserPlan } from "../../firebase/api/saveUserPlan";
import { useCombinedConstantsForCurrentCountry } from "../../firebase/db/constants";
import { FirebaseError } from "@firebase/util";
import {
  UpdateCampaign,
  NewCampaign,
  EitherAnonOrLoggedInUser,
  LoggedInUser,
} from "@pslifestyle/common/src/types/api/payloadTypes";
import { t } from "i18next";
import { isEmpty } from "lodash";
import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useEitherLoggedInOrAnonUser = (): EitherAnonOrLoggedInUser => {
  const authenticatedUser = useSelector(authedSessionSelectors.user);
  const anonUserId = useSelector(anonSessionSelectors.anonId);

  if (authenticatedUser) {
    return {
      email: authenticatedUser.email,
      sessionToken: authenticatedUser.sessionToken,
    };
  }

  if (!anonUserId) {
    throw new Error("User is missing anon ID");
  }
  return { anonId: anonUserId };
};

export const useLoggedInUser = (): LoggedInUser => {
  const authenticatedUser = useSelector(authedSessionSelectors.user);

  if (!authenticatedUser) {
    throw new Error("User is not authenticated to perform this action");
  }

  return {
    email: authenticatedUser.email,
    sessionToken: authenticatedUser.sessionToken,
  };
};

export function usePersistUserAnswers() {
  const initialState = { success: false, error: false, loading: false };
  const dispatch = useDispatch<AppDispatch>();
  const [state, setState] = useState(initialState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const reset = useCallback(() => setState(initialState), []);
  const answers = useSelector(questionnaireSelectors.answers);
  const metadata = useSelector(questionnaireSelectors.metadata);
  const country = useSelector(locationSelectors.country);

  const sendAnswersToBackend = useCallback(async () => {
    try {
      if (!navigator.onLine) {
        throw new Error(t("error.noInternet", { ns: "common" }));
      }
      if (!country) {
        throw new Error("Country not set");
      }
      if (!metadata) {
        console.log("Questionnaire metadata not provided");
        throw new Error("Questionnaire metadata not provided");
      }

      setState({
        success: false,
        error: false,
        loading: true,
      });
      const calculatedAnswers = await saveUserAnswers({
        answers,
        metadata,
      });
      const {
        ordinaryAnswers: calculatedOrdinaryAnswers,
        answerSetId,
        categorizedFootprint,
      } = calculatedAnswers.data;
      dispatch(
        userAnswersActions.initializeUserAnswers({
          answerSetId,
          ordinaryAnswers: calculatedOrdinaryAnswers,
          categorizedFootprint,
        }),
      );
      setState({
        success: true,
        error: false,
        loading: false,
      });
    } catch (error: unknown) {
      setState({
        success: false,
        error: true,
        loading: false,
      });
    }
  }, [country, metadata, answers, dispatch]);

  return useMemo(
    () => ({ sendAnswersToBackend, state, reset }),
    [sendAnswersToBackend, state, reset],
  );
}

export function useAscendUser() {
  const initialState = {
    success: false,
    loading: false,
    error: false,
    userHasPlan: false,
  };
  const planExistsErrorCode = "functions/already-exists";

  const dispatch = useDispatch<AppDispatch>();
  const [state, setState] = useState(initialState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const reset = useCallback(() => setState(initialState), []);
  const answers = useSelector(questionnaireSelectors.answers);
  const metadata = useSelector(questionnaireSelectors.metadata);
  const language = useSelector(locationSelectors.language);
  const anonId = useSelector(anonSessionSelectors.anonId);
  const country = useSelector(locationSelectors.country);
  const selectedActions = useSelector(userPlanSelectors.selectedActions);
  const alreadyDoThisActions = useSelector(
    userPlanSelectors.alreadyDoThisActions,
  );
  const skippedActions = useSelector(userPlanSelectors.skippedActions);

  const ascendUserToBackend = useCallback(
    async (email: string) => {
      if (!country) {
        console.log("cannot persist user plan, loading");
        return;
      }

      if (!anonId || !language || !metadata) {
        console.log("cannot persist user plan, missing anonId");
        return;
      }

      if (!Object.keys(selectedActions).length && !skippedActions.length) {
        return;
      }

      try {
        setState({
          loading: true,
          success: false,
          error: false,
          userHasPlan: false,
        });
        await requestMagicLinkEmailAndAscendUser(
          email,
          anonId,
          language,
          { answers, metadata },
          {
            selectedActions: selectedActions.map((selectedAction) => ({
              id: selectedAction.id,
              state: selectedAction.state,
            })),
            alreadyDoThisActions: alreadyDoThisActions.map(
              (alreadyDoThisAction) => ({
                id: alreadyDoThisAction.id,
                state: alreadyDoThisAction.state,
              }),
            ),
            skippedActions,
          },
        );
        setState({
          loading: false,
          success: true,
          error: false,
          userHasPlan: false,
        });
        dispatch(authedSessionActions.setMagicLinkEmail(email));
      } catch (error) {
        if (error instanceof FirebaseError) {
          setState({
            loading: false,
            success: false,
            error: true,
            userHasPlan: error.code === planExistsErrorCode,
          });
          return;
        }
        setState({
          loading: false,
          success: false,
          error: true,
          userHasPlan: false,
        });
      }
    },
    [
      answers,
      anonId,
      country,
      dispatch,
      language,
      metadata,
      selectedActions,
      alreadyDoThisActions,
      skippedActions,
    ],
  );

  return useMemo(
    () => ({ ascendUserToBackend, state, reset }),
    [ascendUserToBackend, state, reset],
  );
}

// Combine constants with variables from user answers
export function useFullMathScope() {
  const allVariables = useSelector(userAnswersSelectors.allVariables);
  const {
    data: constantsResponseData,
    error: constantsError,
    isLoading: isLoadingConstants,
  } = useCombinedConstantsForCurrentCountry();

  const fullMathScope = useMemo(
    () =>
      constantsResponseData && !isEmpty(allVariables)
        ? { ...constantsResponseData[1], ...allVariables }
        : null,
    [constantsResponseData, allVariables],
  );

  return useMemo(
    () => ({
      loading: isLoadingConstants,
      error: constantsError,
      fullMathScope,
    }),
    [isLoadingConstants, constantsError, fullMathScope],
  );
}

export function usePersistCampaign() {
  const initialState = {
    success: false,
    loading: false,
    error: false,
  };
  const [state, setState] = useState(initialState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const reset = useCallback(() => setState(initialState), []);

  const sendCampaignToBackend = useCallback(
    async (campaign: NewCampaign | UpdateCampaign): Promise<void> => {
      try {
        setState({
          success: false,
          error: false,
          loading: true,
        });

        if ("id" in campaign) {
          await updateCampaign(campaign);
        } else {
          await createCampaign(campaign);
        }

        setState({
          success: true,
          error: false,
          loading: false,
        });
      } catch (error: unknown) {
        console.log(error);
        setState({
          success: false,
          error: true,
          loading: false,
        });
      }
    },
    [],
  );
  return useMemo(
    () => ({ sendCampaignToBackend, state, reset }),
    [sendCampaignToBackend, state, reset],
  );
}

export function usePersistFeedback() {
  const initialState = { success: false, error: false, loading: false };
  const [state, setState] = useState(initialState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const reset = useCallback(() => setState(initialState), []);
  const answerSetId = useSelector(userAnswersSelectors.answerSetId);
  const country = useSelector(locationSelectors.country);

  const sendFeedbackToBackend = useCallback(
    async (selectedOptions: string[]): Promise<void> => {
      try {
        if (!country) {
          throw new Error("Country not set");
        }

        if (!answerSetId) {
          throw new Error("Answer set is not created");
        }

        setState({
          success: false,
          error: false,
          loading: true,
        });
        await saveUserFeedback(answerSetId, {
          selectedOptions,
        });
        setState({
          success: true,
          error: false,
          loading: false,
        });
      } catch (error: unknown) {
        setState({
          success: false,
          error: true,
          loading: false,
        });
      }
    },
    [answerSetId, country],
  );
  return useMemo(
    () => ({ sendFeedbackToBackend, state, reset }),
    [sendFeedbackToBackend, state, reset],
  );
}

export function usePersistUserPlan() {
  const initialState = { success: false, error: false, loading: false };
  const [state, setState] = useState(initialState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const reset = useCallback(() => setState(initialState), []);
  const answerSetId = useSelector(userAnswersSelectors.answerSetId);
  const country = useSelector(locationSelectors.country);
  const selectedActions = useSelector(userPlanSelectors.selectedActions);
  const alreadyDoThisActions = useSelector(
    userPlanSelectors.alreadyDoThisActions,
  );
  const skippedActions = useSelector(userPlanSelectors.skippedActions);

  const sendPlanToBackend = useCallback(async () => {
    try {
      if (!country) {
        console.log("cannot persist user plan, loading");
        return;
      }

      if (!answerSetId) {
        throw new Error("Answer set is not created");
      }

      if (!selectedActions.length && !skippedActions.length) {
        return;
      }

      setState({
        success: false,
        error: false,
        loading: true,
      });
      await saveUserPlan(answerSetId, {
        selectedActions: selectedActions.map((selectedAction) => ({
          id: selectedAction.id,
          state: selectedAction.state,
        })),
        alreadyDoThisActions: alreadyDoThisActions.map(
          (alreadyDoThisAction) => ({
            id: alreadyDoThisAction.id,
            state: alreadyDoThisAction.state,
          }),
        ),
        skippedActions,
      });
      setState({
        success: true,
        error: false,
        loading: false,
      });
    } catch (error: unknown) {
      setState({
        success: false,
        error: true,
        loading: false,
      });
    }
  }, [
    country,
    answerSetId,
    selectedActions,
    alreadyDoThisActions,
    skippedActions,
  ]);

  return useMemo(
    () => ({ sendPlanToBackend, state, reset }),
    [sendPlanToBackend, state, reset],
  );
}

export function useRequestMagicLink() {
  const initialState = { success: false, error: "", loading: false };
  const dispatch = useDispatch<AppDispatch>();
  const [state, setState] = useState(initialState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const reset = useCallback(() => setState(initialState), []);
  const language = useSelector(locationSelectors.language);
  const anonId = useSelector(anonSessionSelectors.anonId);

  const requestMagicLink = useCallback(
    async (email: string) => {
      setState({ loading: true, success: false, error: "" });
      if (!anonId) {
        console.log("Missing Anon ID during login");
        setState({
          loading: false,
          success: false,
          error: "Error requesting magic link",
        });
        return;
      }

      try {
        await requestMagicLinkEmail(email, anonId, language || "en-GB");
        setState({
          loading: false,
          success: true,
          error: "",
        });
        dispatch(authedSessionActions.setMagicLinkEmail(email));
      } catch (err) {
        console.log(err);
        setState({
          loading: false,
          success: false,
          error: "Error requesting magic link",
        });
      }
    },
    [anonId, dispatch, language],
  );

  return useMemo(
    () => ({ state, reset, requestMagicLink }),
    [state, reset, requestMagicLink],
  );
}
