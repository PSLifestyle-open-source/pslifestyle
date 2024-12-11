import { createActionsBuilder } from "../../../../common/src/dataBuilders/actionsBuilder";
import { MathScopes } from "../../../../common/src/types/genericTypes";
import {
  CalculatedAction,
  CalculatedPlan,
  NewPlan,
  NewAddedAction,
} from "../../../../common/src/types/planTypes";
import { fetchLatestActions } from "../Repository/actions";
import { fetchLatestConstants } from "../Repository/constants";
import { fetchLatestUserPlan } from "../Repository/plans";
import { SavedAnswerSet } from "../Types/answers";
import { SavedPlan } from "../Types/plan";
import { EitherLoggedInOrAnonUserId } from "./types";

const resolveReceivedActions = (
  newActions: NewAddedAction[],
  oldPlan: SavedPlan | null,
  latestCalculatedActions: CalculatedAction[],
): CalculatedAction[] => {
  return newActions
    .map((newAction) => {
      const newSelectedActionUpdatedData = latestCalculatedActions.find(
        (latestAction) => latestAction.id === newAction.id,
      );

      if (newSelectedActionUpdatedData) {
        return { ...newSelectedActionUpdatedData, ...newAction };
      }

      const newSelectedActionOldData = oldPlan?.selectedActions.find(
        (oldAction) => oldAction.id === newAction.id,
      );

      if (newSelectedActionOldData) {
        return { ...newSelectedActionOldData, ...newAction };
      }

      return null;
    })
    .filter(
      (newSelectedAction): newSelectedAction is CalculatedAction =>
        newSelectedAction !== null,
    );
};

export const calculatePlan = async (
  answerSet: SavedAnswerSet,
  user: EitherLoggedInOrAnonUserId,
  plan: NewPlan,
): Promise<CalculatedPlan> => {
  const oldPlan = await fetchLatestUserPlan(
    user,
    answerSet.metadata.createdAt.toDate().toISOString(),
  );
  const { actions: recommendedActions, version: actionsVersion } =
    await fetchLatestActions(answerSet.metadata.countryCode);

  const constants = await fetchLatestConstants(answerSet.metadata.countryCode);

  const allVariables: MathScopes = answerSet.ordinaryAnswers.reduce(
    (aggregator, answer) => ({ ...aggregator, ...answer.variables }),
    {},
  );

  const calculator = createActionsBuilder(
    actionsVersion,
    {
      ...constants,
      ...allVariables,
    },
    Object.values(answerSet.categorizedFootprint).reduce(
      (sum, categoryFootprint) => sum + categoryFootprint,
    ),
  );

  const calculatedApplicableActions =
    calculator.calculateApplicableActionsImpact(
      calculator.prepareApplicableActions(recommendedActions),
    );

  return {
    skippedActions: plan.skippedActions,
    selectedActions: resolveReceivedActions(
      plan.selectedActions,
      oldPlan,
      calculatedApplicableActions,
    ),
    alreadyDoThisActions: resolveReceivedActions(
      plan.alreadyDoThisActions,
      oldPlan,
      calculatedApplicableActions,
    ),
  };
};
