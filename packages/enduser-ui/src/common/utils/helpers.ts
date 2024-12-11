import getCategoryFromSortKey from "@pslifestyle/common/src/helpers/getCategoryFromSortKey";
import { evaluate, round } from "@pslifestyle/common/src/helpers/securedMathjs";
import { MathScopes } from "@pslifestyle/common/src/types/genericTypes";
import { CalculatedAnswer } from "@pslifestyle/common/src/types/questionnaireTypes";

export const fiveMinutesInterval = 5 * 60 * 1000;

export const getPercentageOfDifference = (numA: number, numB: number) => {
  if (numA > numB) return Math.round(((numA - numB) / numA) * 100);
  if (numA < numB) return Math.round(((numB - numA) / numB) * 100);
  return 0;
};

const findTranslKey = (
  answerText: string,
  questionId: string,
  translationMap: Record<string, string>,
) => {
  const arrayOfTranslationKeys = Object.keys(translationMap);
  const translKeyOfAnswer = arrayOfTranslationKeys.find(
    (key) => translationMap[key] === answerText && key.includes(questionId),
  );
  return translKeyOfAnswer || "";
};

export const isErrorWithMessage = (
  error: unknown,
): error is { message: string } =>
  typeof error === "object" && !!error && "message" in error;

/**
 * If given a number, returns that. If given a string, looks for its value from a given mathScope object
 * @param value
 * @param mathScope
 * @returns Numeric value for a variable
 */
export const getValueAsNumber = (
  value: string | number,
  mathScope: MathScopes,
): number => {
  if (typeof value === "number") return value;

  // the string cannot be converted into number -> it is a variable name or a formula
  if (Number.isNaN(Number(value))) return evaluate(value, mathScope);

  // the string can be converted into number
  return Number(value);
};

// choose translation key for the comparison string, based on two numbers
export const valueForComparison =
  (lessThan: string, equal: string, greaterThan: string) =>
  (a: number, b: number) => {
    if (a < b) return lessThan;
    if (a > b) return greaterThan;
    return equal;
  };

export const colors: { [key: string]: string } = {
  housing: "orange",
  transport: "purple",
  food: "pink",
  purchases: "cyan",
  other: "neutral",
  demographic: "green",
};

/**
 * Calculates total footprint per label
 * @param answers
 * @returns Object with labels as keys and sums as values. Example: { cars: 5, heating: 10 }
 */
export const parseLabelSums = (answers: CalculatedAnswer[]) =>
  answers.reduce(
    (acc, { label, footprint }) => {
      if (!acc[label]) acc[label] = 0;
      if (footprint) acc[label] += footprint;
      return acc;
    },
    {} as Record<string, number>,
  );

/**
 * Deducts in which category each label belongs to
 * @param answers
 * @returns Record<label, category>
 */
export const parseLabelCategories = (answers: CalculatedAnswer[]) =>
  answers.reduce(
    (acc, cur) => {
      acc[cur.label] = getCategoryFromSortKey(cur.sortKey) || "";
      return acc;
    },
    {} as Record<string, string>,
  );

export const getAnswerTranslationKeysOfLabels = (
  answers: CalculatedAnswer[],
  translationMap: Record<string, string>,
) =>
  answers.reduce(
    (acc, { label, questionId, choiceText }) => {
      const answerTranslKey = findTranslKey(
        choiceText,
        questionId,
        translationMap,
      );
      if (!acc[label]) acc[label] = [];
      acc[label].push({ id: questionId, answerTranslKey });
      return acc;
    },
    {} as Record<string, { id: string; answerTranslKey: string }[]>,
  );

export function createLabelObjects(
  answers: CalculatedAnswer[],
  translationMap: Record<string, string>,
) {
  const labelCategories = parseLabelCategories(answers);
  const totalSum = answers.reduce((acc, { footprint }) => acc + footprint, 0);
  const labelSums = parseLabelSums(answers);
  const answersByLabels = getAnswerTranslationKeysOfLabels(
    answers,
    translationMap,
  );
  const labelObjects = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const key of Object.keys(labelSums)) {
    const obj = {
      label: key,
      percent: (labelSums[key] / totalSum) * 100,
      labelFootprint: labelSums[key],
      answerTextsOfLabel: answersByLabels[key],
      themeColor: colors[labelCategories[key]],
    };
    labelObjects.push(obj);
  }
  return labelObjects.sort((a, b) =>
    a.labelFootprint > b.labelFootprint ? -1 : 1,
  );
}

export const getTodayDate = () => new Date().toISOString().slice(0, 10);

export const dataURLtoFile: (
  dataurl: string,
  filename: string,
) => File | null = (dataurl: string, filename: string) => {
  const [head, data] = dataurl.split(",");
  const type = head.match(/:(.*?);/)?.[1];

  const binaryData = Uint8Array.from(
    Array.from(atob(data)).map((char) => char.charCodeAt(0)),
  );
  return new File([binaryData], filename, { type });
};

export const getPercentage = (
  fractionalValue: number,
  totalValue: number,
  decimals = 1,
): number => {
  if (!fractionalValue || !totalValue) {
    return 0;
  }
  const percentValue = (fractionalValue / totalValue) * 100;

  return round(percentValue, decimals);
};
export const getPercentageDifference = (
  targetValue: number,
  actualValue: number,
  decimals = 1,
): number => {
  if (!targetValue || !actualValue) {
    return 0;
  }
  const percentageDifference =
    Math.abs((targetValue - actualValue) / targetValue) * 100;

  return round(percentageDifference, decimals);
};

export const getDifference = (value1: number, value2: number) => {
  if (!value1 || !value2) {
    return round(value1 || value2 || 0);
  }
  return round(Math.abs(value1 - value2));
};

export const assoc = <T extends keyof U, U>(obj: U, prop: T, value: U[T]) => ({
  ...obj,
  [prop]: value,
});

export const assocWith = <T extends keyof U, U, Z>(
  obj: U,
  prop: T,
  fn: (value: Z) => U[T],
  value: Z,
) => assoc(obj, prop, fn(value));

export const append = <T>(values: T[], value: T) => [...values, value];

export const appendIf = <T>(
  values: T[],
  pred: (value: T) => boolean,
  value: T,
) => [...values, ...(pred(value) ? [value] : [])];

export const mergeLeft = <T>(obj: T, toMerge: Partial<T>) => ({
  ...obj,
  ...toMerge,
});

export const update = <T>(values: T[], index: number, value: T) =>
  values.map((item, i) => (i === index ? value : item));

export const pick = <U, T extends keyof U>(obj: U, keys: T[]): Partial<U> =>
  keys.reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {});
