/* eslint-disable no-param-reassign,no-restricted-syntax */
import { evaluateConditionValue } from "../src/common/utils/filters";
import { fetchCombinedConstants } from "../src/firebase/db/constants";
import { fetchQuestionsForCountry } from "../src/firebase/db/questions";
import { evaluateFormula } from "@pslifestyle/common/src/helpers/evaluateFormula";
import { evaluate } from "@pslifestyle/common/src/helpers/securedMathjs";
import { Country } from "@pslifestyle/common/src/models/countries";
import {
  QuestionType,
  QuestionChoiceType,
  DisplayCondition,
} from "@pslifestyle/common/src/schemas";
import { MathScopes } from "@pslifestyle/common/src/types/genericTypes";

const fetchRawQuestions = async (country: Country) => {
  const questionsRequestResult = await fetchQuestionsForCountry(country);
  if (!questionsRequestResult) {
    throw new Error(`Could not fetch questions for country ${country.name}`);
  }

  const [_, questionnaireData] = questionsRequestResult;
  // Sliced to remove the positioning questions
  return questionnaireData
    .slice(1)
    .filter((question) => question.label !== "demographic");
};

const fetchRawConstants = async (countryCode: Country) => {
  const { constants } = await fetchCombinedConstants(countryCode);

  if (!constants) {
    throw new Error(`Could not fetch constants for country ${countryCode}`);
  }

  return constants;
};

const structuredClone = <T>(data: T): T => JSON.parse(JSON.stringify(data));

export const preparePathsToTest = async (country: Country) => {
  const questions = (await fetchRawQuestions(country)).reverse();
  const constants = await fetchRawConstants(country);

  let variablesWithoutMatchLookup: Record<string, true> = {};
  let conditionsWithoutMatchLookup: {
    [questionKey: string]: { [variableName: string]: DisplayCondition[] };
  } = {};
  const questionChoicesNeededToTestFutureQuestionLookup: {
    questionKey: string;
    choices: QuestionChoiceType[];
  }[] = [];
  const pastAnswersNeededByQuestionToBeAvailableLookup: {
    [questionWithConditionKey: string]: {
      [pastQuestionKey: string]: Record<string | number, true>;
    };
  } = {};

  const checkDanglingVariable = async (danglingVariables: string[]) => {
    const variablesWithoutConnectedValue = danglingVariables.filter(
      (variable) => !(variable in constants),
    );

    if (variablesWithoutConnectedValue.length) {
      throw new Error(
        `Following variables cannot be connected to any value: ${variablesWithoutConnectedValue.join(
          ", ",
        )}`,
      );
    }
  };

  const findConditionsNeedingAMatch = (question: QuestionType) => {
    if ("displayCondition" in question) {
      const conditionsUsedVariables =
        question?.displayCondition?.map((condition) => [
          condition.variableName,
          [],
        ]) || [];
      const conditionsByVariableName = Object.fromEntries(
        conditionsUsedVariables,
      );

      question?.displayCondition?.forEach((condition) => {
        conditionsByVariableName[condition.variableName].push(condition);
      });

      conditionsWithoutMatchLookup = {
        ...conditionsWithoutMatchLookup,
        [question.sortKey]: conditionsByVariableName,
      };
    }
  };

  const findVariablesNeedingAMatch = (question: QuestionType) => {
    const wordsWithUnderscoreRegex = /\b\w*_[a-zA-Z0-9_]*\w*\b/g;

    if ("formula" in question && String(question.formula) !== "0") {
      variablesWithoutMatchLookup = {
        ...variablesWithoutMatchLookup,
        ...(question.formula
          .match(wordsWithUnderscoreRegex)
          ?.reduce((aggregator: Record<string, true>, word) => {
            aggregator[word] = true;

            return aggregator;
          }, {}) || {}),
      };
    }
  };

  const prepareVariablesNamesProvidedByQuestion = (question: QuestionType) => {
    const variablesNames = [question.variableName];
    if (question.relatedVariableName) {
      variablesNames.push(question.relatedVariableName);
    }

    return variablesNames;
  };

  const isQuestionProvidingVariableNeededByAnotherQuestion = (
    questionVariablesNames: string[],
  ) =>
    questionVariablesNames.some(
      (variableName) => variableName in variablesWithoutMatchLookup,
    );

  const checkIfQuestionProvidesVariablesUsedByLaterQuestion = (
    question: QuestionType,
    questionVariablesNames: string[],
  ) => {
    if (
      isQuestionProvidingVariableNeededByAnotherQuestion(questionVariablesNames)
    ) {
      questionVariablesNames.forEach((variableName) => {
        delete variablesWithoutMatchLookup[variableName];
      });
    }

    return {};
  };

  const createMathScopeForChoice = (
    variablesNames: string[],
    choice: QuestionChoiceType,
  ): MathScopes => ({
    ...variablesNames.reduce(
      (aggregator: Record<string, number>, variableName) => {
        if (typeof choice.choiceValue === "string") {
          aggregator[variableName] = evaluate(choice.choiceValue, constants);
        }
        if (typeof choice.choiceValue === "number") {
          aggregator[variableName] = choice.choiceValue;
        }

        return aggregator;
      },
      {},
    ),
    ...constants,
  });

  const isChoiceFulfillingConditions = (
    questionVariablesNames: string[],
    choice: QuestionChoiceType,
    conditions: DisplayCondition[],
  ) =>
    conditions.every((condition) => {
      const mathScope = createMathScopeForChoice(
        questionVariablesNames,
        choice,
      );
      return evaluateFormula(
        mathScope,
        condition.variableName,
        condition.operator,
        evaluateConditionValue(condition.value, mathScope),
      );
    });

  const checkIfQuestionResolvesConditionUsedByLaterQuestion = (
    question: QuestionType,
    questionVariablesNames: string[],
  ) => {
    const selectedChoices = new Set<QuestionChoiceType>();
    for (const [
      questionWithConditionKey,
      conditionsPerVariableName,
    ] of Object.entries(conditionsWithoutMatchLookup)) {
      for (const questionVariableName of questionVariablesNames) {
        if (questionVariableName in conditionsPerVariableName) {
          const matchingChoices = question?.choices?.filter((choice) =>
            isChoiceFulfillingConditions(
              questionVariablesNames,
              choice,
              conditionsPerVariableName[questionVariableName],
            ),
          );
          const notMatchingChoice = question?.choices?.find(
            (choice) =>
              !isChoiceFulfillingConditions(
                questionVariablesNames,
                choice,
                conditionsPerVariableName[questionVariableName],
              ),
          );
          if (!matchingChoices || !matchingChoices.length) {
            throw new Error(
              `Conditions ${JSON.stringify(
                conditionsPerVariableName[questionVariableName],
              )} cannot be fulfilled.`,
            );
          }
          selectedChoices.add(matchingChoices[0]);
          if (notMatchingChoice) {
            selectedChoices.add(notMatchingChoice);
          }

          if (
            !(
              questionWithConditionKey in
              pastAnswersNeededByQuestionToBeAvailableLookup
            )
          ) {
            pastAnswersNeededByQuestionToBeAvailableLookup[
              questionWithConditionKey
            ] = {};
          }
          pastAnswersNeededByQuestionToBeAvailableLookup[
            questionWithConditionKey
          ][question.sortKey] = matchingChoices.reduce(
            (aggregator: Record<string | number, true>, matchingChoice) => {
              aggregator[matchingChoice.choiceText] = true;

              return aggregator;
            },
            {},
          );

          delete conditionsWithoutMatchLookup[questionWithConditionKey][
            questionVariableName
          ];
        }
      }

      if (
        !Object.keys(conditionsWithoutMatchLookup[questionWithConditionKey])
          .length
      ) {
        delete conditionsWithoutMatchLookup[questionWithConditionKey];
      }
    }
    if (!selectedChoices.size && question.choices) {
      selectedChoices.add(question.choices[0]);
    }
    questionChoicesNeededToTestFutureQuestionLookup.push({
      questionKey: question.sortKey,
      choices: Array.from(selectedChoices),
    });
  };

  const buildPaths = () => {
    const pathsToTest: { questionKey: string; choice: QuestionChoiceType }[][] =
      [[]];
    for (const {
      questionKey,
      choices,
    } of questionChoicesNeededToTestFutureQuestionLookup.reverse()) {
      const pathsToUse =
        questionKey in pastAnswersNeededByQuestionToBeAvailableLookup
          ? pathsToTest.filter((path) =>
              Object.entries(
                pastAnswersNeededByQuestionToBeAvailableLookup[questionKey],
              ).every(([answeringQuestionKey, matchingChoiceTexts]) =>
                path.find(
                  (pathStep) =>
                    pathStep.questionKey === answeringQuestionKey &&
                    pathStep.choice.choiceText in matchingChoiceTexts,
                ),
              ),
            )
          : pathsToTest;
      const firstChoice = choices.shift() as QuestionChoiceType;
      const clonedExistingPathsOriginal = choices.length
        ? structuredClone(pathsToUse)
        : null;
      pathsToUse.forEach((pathToUse) => {
        pathToUse.push({ questionKey, choice: firstChoice });
      });

      if (clonedExistingPathsOriginal) {
        choices.forEach((choice) => {
          const clonedExistingPathsForChoice = structuredClone(
            clonedExistingPathsOriginal,
          );
          clonedExistingPathsForChoice.forEach((clonedExistingPath) => {
            clonedExistingPath.push({ questionKey, choice });
          });

          pathsToTest.push(...clonedExistingPathsForChoice);
        });
      }
    }

    return pathsToTest;
  };

  // We do everything recursively backward, because this way we know what last question needs, and we are able
  // to determine whether question(s) which will be displayed before it are capable of providing the information.
  const prepareLookupsAndFindMatchesForQuestions = (
    questionsToBeProcessed: QuestionType[],
  ) => {
    const currentQuestion = questionsToBeProcessed.shift();
    if (!currentQuestion) {
      return;
    }

    findVariablesNeedingAMatch(currentQuestion);
    findConditionsNeedingAMatch(currentQuestion);

    const variablesNamesToCheck =
      prepareVariablesNamesProvidedByQuestion(currentQuestion);
    checkIfQuestionProvidesVariablesUsedByLaterQuestion(
      currentQuestion,
      variablesNamesToCheck,
    );
    checkIfQuestionResolvesConditionUsedByLaterQuestion(
      currentQuestion,
      variablesNamesToCheck,
    );
    prepareLookupsAndFindMatchesForQuestions(questionsToBeProcessed);
  };

  prepareLookupsAndFindMatchesForQuestions(questions);
  if (conditionsWithoutMatchLookup.length) {
    throw new Error(
      `Following conditions cannot be connected to any value: ${JSON.stringify(
        conditionsWithoutMatchLookup,
      )}`,
    );
  }
  await checkDanglingVariable(Object.keys(variablesWithoutMatchLookup));

  return buildPaths();
};
