import { evaluateFormula } from "../helpers/evaluateFormula";
import isNumber from "../helpers/isNumber";
import { evaluate } from "../helpers/securedMathjs";
import { DisplayCondition, MathScopes } from "../types/genericTypes";
import type {
  ActionCategory,
  CalculatedAction,
  ImpactFormula,
  RawRecommendedAction,
} from "../types/planTypes";

export type ActionsBuilder = {
  calculateApplicableActionsImpact: (
    actions: RawRecommendedAction[],
  ) => CalculatedAction[];
  prepareApplicableActions: (
    actions: RawRecommendedAction[],
  ) => RawRecommendedAction[];
};

const matchCondition = (
  fullMathScope: MathScopes,
  condition: DisplayCondition,
): boolean => {
  const { operator, variableName, value } = condition;
  const isValueNumeric = isNumber(value);

  try {
    const numberValue = isValueNumeric
      ? +value
      : evaluate(value as string, fullMathScope);
    return evaluateFormula(fullMathScope, variableName, operator, numberValue);
  } catch (error) {
    return false;
  }
};

const calculateImpact = (
  fullMathScope: MathScopes,
  impactFormulas: ImpactFormula[],
): number => {
  if (!Array.isArray(impactFormulas)) {
    return 0;
  }

  const matchingFormula = impactFormulas.find((formula) =>
    formula.conditions.every((condition) =>
      matchCondition(fullMathScope, condition),
    ),
  );
  if (!matchingFormula) {
    return 0;
  }

  return evaluate(matchingFormula.formula, fullMathScope);
};

export const createActionsBuilder = (
  actionsVersion: string,
  fullMathScope: MathScopes,
  totalFootprint: number,
): ActionsBuilder => {
  return {
    prepareApplicableActions: (actions: RawRecommendedAction[]) => {
      return actions.filter((action) => {
        return (
          !action.displayCondition ||
          action.displayCondition.every((condition) =>
            matchCondition(fullMathScope, condition),
          )
        );
      });
    },
    calculateApplicableActionsImpact: (
      actions: RawRecommendedAction[],
    ): CalculatedAction[] => {
      const failedActions: { actionId: string; reason: unknown }[] = [];

      const calculatedActions: CalculatedAction[] = actions.reduce(
        (aggregator, action) => {
          try {
            const calculatedImpact = calculateImpact(
              fullMathScope,
              action.impactFormulas,
            );

            aggregator.push({
              state: "new",
              actionsVersion,
              skipIdsIfSelected: action.skipIdsIfSelected || [],
              calculatedImpact: calculatedImpact,
              percentReduction: (calculatedImpact / totalFootprint) * 100,
              id: action.id,
              category: action.category.toLowerCase() as ActionCategory,
              tags: action.tags,
              type: action.type,
              title: action.title,
            });

            return aggregator;
          } catch (error: unknown) {
            failedActions.push({
              actionId: action.id,
              reason: error instanceof Error ? error.message : "Unknown",
            });
            return aggregator;
          }
        },
        [] as CalculatedAction[],
      );

      if (failedActions.length) {
        // Complete a structured log entry.
        const logEntry = Object.assign({
          severity: "WARNING",
          message: `Calculation of some actions failed. List of failed actions`,
          failedActions,
          fullMathScope,
          component: "actionCalculator",
        });
        console.log(JSON.stringify(logEntry));
      }

      return calculatedActions;
    },
  };
};
