import { evaluateFormula } from "@pslifestyle/common/src/helpers/evaluateFormula";
import { evaluate } from "@pslifestyle/common/src/helpers/securedMathjs";
import {
  DisplayCondition,
  QuestionType,
} from "@pslifestyle/common/src/schemas";
import { MathScopes } from "@pslifestyle/common/src/types/genericTypes";

export function evaluateConditionValue(
  value: number | string,
  mathScope: MathScopes,
) {
  if (/^-?[0-9]+(?:\.[0-9]+)?$/.test(value.toString())) return value; // is numeric value
  return evaluate(value as string, mathScope); // if value is a variable, it is evaluated with mathjs
}

export const filterQuestions = (
  mathScope: MathScopes,
  availableQuestions: QuestionType[],
): QuestionType[] => {
  if (availableQuestions.length === 0) return [];
  const filtered: QuestionType[] = [];
  availableQuestions.forEach((question: QuestionType) => {
    if (question.displayCondition) {
      // The question passes until one of the check fails and sets shouldQuestionShow false
      let shouldQuestionShow = true;
      let conditionEvaluation = false;
      question.displayCondition.forEach((condition: DisplayCondition) => {
        if (mathScope[condition.variableName] !== undefined) {
          const evaluatedValue = evaluateConditionValue(
            condition.value,
            mathScope,
          );
          conditionEvaluation = evaluateFormula(
            mathScope,
            condition.variableName,
            condition.operator,
            evaluatedValue,
          );
          if (!conditionEvaluation) shouldQuestionShow = false;
        }
      });
      // temporary filtering condition to take out demographic questions
      if (shouldQuestionShow) filtered.push(question);
    } else {
      filtered.push(question);
    }
  });

  return filtered;
};
