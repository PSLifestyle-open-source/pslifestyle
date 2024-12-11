import getCategoryFromSortKey from "../helpers/getCategoryFromSortKey";
import getChoiceNumericalValue from "../helpers/getChoiceNumericalValue";
import { evaluate } from "../helpers/securedMathjs";
import { QuestionChoiceType, QuestionType } from "../schemas";
import { MathScopes, Category } from "../types/genericTypes";
import {
  CalculatedAnswer,
  CategorizedFootprint,
  NewAnswer,
} from "../types/questionnaireTypes";

export type AnswersBuilder = {
  buildAnswers: (answers: NewAnswer[]) => {
    categorizedFootprint: CategorizedFootprint;
    calculatedAnswers: CalculatedAnswer[];
    fullMathScope: Record<string, number>;
  };
};

const buildFormulaVariable = (question: QuestionType): string => {
  return `QUESTION_${question.id}_FOOTPRINT`;
};

const calculateFormula = (
  question: QuestionType,
  fullMathScope: MathScopes,
): number => {
  return question.formula !== "0"
    ? evaluate(question.formula, fullMathScope)
    : 0;
};

const extractVariablesFromAnswer = (
  question: QuestionType,
  choiceObject: QuestionChoiceType,
  category: Category,
  answer: NewAnswer,
  fullMathScope: Record<string, number>,
): Record<string, number> => {
  // For all other types we want to calculate actual numbers and include them to the full math scope
  const answerVariables: Record<string, number> = {};

  const calculatedChoiceValue = getChoiceNumericalValue(
    choiceObject.choiceValue,
    fullMathScope,
  );
  fullMathScope[question.variableName] = calculatedChoiceValue;
  answerVariables[question.variableName] = calculatedChoiceValue;

  if (question.relatedVariableName && choiceObject.relatedVariableValue) {
    const calculatedChoiceValue = getChoiceNumericalValue(
      choiceObject.relatedVariableValue,
      fullMathScope,
    );
    fullMathScope[question.relatedVariableName] = calculatedChoiceValue;
    answerVariables[question.relatedVariableName] = calculatedChoiceValue;
  }
  answerVariables[buildFormulaVariable(question)] = calculateFormula(
    question,
    fullMathScope,
  );

  return answerVariables;
};

export const createAnswersBuilder = (
  questions: QuestionType[],
  constants: Record<string, number>,
): AnswersBuilder => {
  const questionsById: Record<string, QuestionType> = questions.reduce(
    (aggregator: Record<string, QuestionType>, question) => {
      aggregator[question.id] = question;

      return aggregator;
    },
    {},
  );

  return {
    buildAnswers: (answers: NewAnswer[]) => {
      const { calculatedAnswers, fullMathScope } = answers.reduce(
        ({ calculatedAnswers, fullMathScope }, answer) => {
          // Find original data
          const question = questionsById[answer.questionId];

          if (!question || !question.choices) {
            throw new Error(
              `Question ${question?.id || "NOID"} has no choices to select or question not found`,
            );
          }

          const category = getCategoryFromSortKey(question.sortKey);

          if (!category) {
            return { calculatedAnswers, fullMathScope };
          }

          const choiceObject = question.choices.find(
            (choice) => choice.choiceText === answer.choiceText,
          );

          if (!choiceObject) {
            throw new Error(
              `Question ${question.id} has missing requested choice`,
            );
          }

          const answerVariables = extractVariablesFromAnswer(
            question,
            choiceObject,
            category,
            answer,
            fullMathScope,
          );

          calculatedAnswers.push({
            questionId: question.id,
            questionText: question.questionText,
            choiceText: choiceObject.choiceText,
            choiceValue: choiceObject.choiceValue,
            category,
            label: question.label,
            footprint: calculateFormula(question, fullMathScope),
            sortKey: question.sortKey,
            variables: answerVariables,
          });

          return { calculatedAnswers, fullMathScope };
        },
        {
          calculatedAnswers: [] as CalculatedAnswer[],
          fullMathScope: { ...constants },
        },
      );

      return {
        categorizedFootprint: calculatedAnswers.reduce(
          (aggregate, calculatedAnswer) => {
            if (calculatedAnswer.category === "demographic") {
              return aggregate;
            }

            aggregate[calculatedAnswer.category] += calculatedAnswer.footprint;

            return aggregate;
          },
          {
            transport: 0,
            purchases: 0,
            housing: 0,
            food: 0,
          },
        ),
        calculatedAnswers,
        fullMathScope,
      };
    },
  };
};
