/* eslint-disable @typescript-eslint/no-explicit-any */
import { QuestionChoiceType } from "../../../common/src/schemas";
import { EntireQuestion } from "./models";
import * as dotenv from "dotenv";

dotenv.config({ path: `${__dirname}/../../../.env` });

// create an array with objects that hold the new headers along with their index in the Sheets file
// this enables changing the order of the columns in the Sheets file without effecting the fetch
function returnHeadersWithIndices(
  headerArray: string[],
  keysMap: Record<string, string>,
) {
  const headers: [string, number][] = headerArray.map((header, index) => {
    return [keysMap[header], index];
  });
  return headers.filter((headerTuple) => headerTuple[0]);
}

function assignIdToChoiceRows(rows: EntireQuestion[]) {
  let currentId: string;
  rows.forEach((row: EntireQuestion) => {
    if (row.id) {
      currentId = row.id;
      return;
    } else {
      row.id = currentId;
    }
  });
  return rows;
}

export function choicesToQuestions(rows: EntireQuestion[]) {
  // Gather choices and action choices in their own arrays under question id
  const questionChoicesAndActions: {
    [key: string]: { choices: QuestionChoiceType[] };
  } = {};
  rows.forEach((row: EntireQuestion) => {
    if (row.id) questionChoicesAndActions[row.id] = { choices: [] };
  });

  rows.forEach((row: EntireQuestion) => {
    if (row.id && row.choiceText) {
      const choiceObject = {
        choiceText: row.choiceText,
        choiceValue: Number(row.choiceValue) || row.choiceValue,
        choiceTranslationKey: row.choiceTranslationKey,
        ...(row.relatedVariableValue && {
          relatedVariableValue: row.relatedVariableValue,
        }),
      } as QuestionChoiceType;
      questionChoicesAndActions[row.id]["choices"].push(
        choiceObject as QuestionChoiceType,
      );
    }
  });

  rows.forEach((row: EntireQuestion) => {
    if (row.id && row.questionText !== "") {
      row.choices = questionChoicesAndActions[row.id].choices;
    }
  });
  return rows.filter(
    (row: EntireQuestion) => row.questionText !== "" && row.variableName,
  );
}

const operators: string[] = ["===", "!==", ">=", "<=", ">", "<"];

const recordsToSingleArray = (rows: any[]) => {
  const allTranslationsArray: Record<string, string>[] = [];
  rows.forEach((row) => {
    for (const [key, value] of Object.entries(row)) {
      if (key) {
        allTranslationsArray.push({ [key]: value } as Record<string, string>);
      }
    }
  });
  if (allTranslationsArray) return allTranslationsArray;
  return [];
};

// Sort records to their own languages using the language code and then strip it from the key
function sortTranslationsByLanguageRemoveLanguageCodes(
  arr: Record<string, string>[],
) {
  const contentByLanguage: any = {};
  arr.forEach((record) => {
    for (const [key, value] of Object.entries(record)) {
      const languageCode = key.slice(-5);
      if (!contentByLanguage[languageCode]) {
        contentByLanguage[languageCode] = {};
      }
      const idAndContent = key.slice(0, -6);
      contentByLanguage[languageCode][idAndContent] = value;
    }
  });
  return contentByLanguage;
}

export {
  returnHeadersWithIndices,
  assignIdToChoiceRows,
  operators,
  recordsToSingleArray,
  sortTranslationsByLanguageRemoveLanguageCodes,
};

export const parseConditionStrings = (
  conditionStrings: string[],
): { variableName: string; operator: string; value: string | number }[] => {
  const parsedConditions: {
    variableName: string;
    operator: string;
    value: string | number;
  }[] = [];

  conditionStrings.forEach((condition: string) => {
    operators.every((operator) => {
      const operatorStartIndex = condition.indexOf(operator);
      if (operatorStartIndex >= 0) {
        const variableName = condition.substring(0, operatorStartIndex).trim();
        let value;
        const valueRaw = condition
          .substring(operatorStartIndex + operator.length)
          .trim();
        const valueNumbered = Number(valueRaw);

        if (!isNaN(valueNumbered)) {
          value = valueNumbered;
        } else {
          value = valueRaw.toString();
        }

        const obj = { variableName, operator, value };
        parsedConditions.push(obj);
        return false;
      }
      return true;
    });
  });

  return parsedConditions;
};

export const addCountryCodesToRecords = (
  arrayOfRecords: Record<string, string>[],
  countryCode: string,
) => {
  const newArray: Record<string, string>[] = [];
  arrayOfRecords.forEach((record) => {
    for (const [key, value] of Object.entries(record)) {
      const indexOfCountryCode = key.lastIndexOf("_");
      const newKey =
        key.substring(0, indexOfCountryCode) +
        "_" +
        countryCode +
        key.substring(indexOfCountryCode);
      newArray.push({ [newKey]: value });
    }
  });
  return newArray;
};
