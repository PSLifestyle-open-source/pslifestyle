/* eslint-disable @typescript-eslint/no-explicit-any,camelcase */
import { countryCodes } from "../../../../../common/src/models/countries";
import { languagesList } from "../../../../../common/src/models/languages";
import {
  addCountryCodesToRecords,
  assignIdToChoiceRows,
  recordsToSingleArray,
  returnHeadersWithIndices,
  sortTranslationsByLanguageRemoveLanguageCodes,
} from "../../../utils/helpers";
import { createGoogleSheetsFetchSettings } from "../../Factory/createGoogleSheetsFetchSettings";
import { sheets_v4 } from "googleapis";

import Sheets = sheets_v4.Sheets;

// keys are used to hand-pick the desired headers and values to replace them with camelCasing
const keysMap: Record<string, string> = {
  "Sort key": "sortKey",
  ID: "id",
  "Text (English)": "question_text_en-GB",
  "Description/explanation text (English)": "questionDescription_text_en-GB",
  "Choice text": "choice_text_en-GB",
};

async function parseCountryTranslations(
  googleSheetsApiClient: Sheets,
  countryCode: string,
) {
  const results = await googleSheetsApiClient.spreadsheets.values.get(
    createGoogleSheetsFetchSettings(countryCode),
  );
  const data = results.data.values;
  if (data === undefined || data === null) return;

  // take the first row to store all original headers
  const headerArray = data[0];
  const headersWithIndices = returnHeadersWithIndices(headerArray, keysMap);

  // create objects with new headers as keys and cell contents as values
  // picking only the columns that hold the desired data
  const rows: any[] = data.slice(1).map((row) => {
    const obj = {} as any;
    row.forEach((cell, i) => {
      headersWithIndices.forEach(([header, index]) => {
        // index for header and corresponding cell at any row is the same
        if (i === index && cell !== "") {
          obj[header] = cell;
        }
      });
    });
    return obj;
  });

  const rowsWithIds: any[] = assignIdToChoiceRows(rows);

  // Give choices, actionChoices and actionChoiceDescriptions an index, such as q1_choice1, q1_choice2
  let currentQuestion: string;
  let currentChoiceIndex: number;
  rowsWithIds.forEach((row: any) => {
    if (!currentQuestion) {
      currentQuestion = row.id;
      currentChoiceIndex = 0;
    }
    if (row.id === currentQuestion) {
      currentChoiceIndex += 1;
      row["choiceTranslationKey"] = `${row.id}_choice${currentChoiceIndex}`;
    }
    if (row.id !== currentQuestion) {
      currentQuestion = row.id;
      currentChoiceIndex = 1;
      row["choiceTranslationKey"] = `${row.id}_choice${currentChoiceIndex}`;
    }
  });

  // Create (proper) translation keys for everything + the language code
  rowsWithIds.forEach((row) => {
    for (const [key, value] of Object.entries(row)) {
      const objectType = key.slice(0, key.indexOf("_"));
      switch (objectType) {
        case "question":
          row[`${row.id}_${key.slice(key.lastIndexOf("_") + 1)}`] = value;
          break;
        case "choice":
          row[
            `${row.choiceTranslationKey}_${key.slice(-key.indexOf("_") + 1)}`
          ] = value;
          break;
        case "questionDescription":
          row[`${row.id}_description_${key.slice(key.lastIndexOf("_") + 1)}`] =
            value;
          break;
      }
    }
  });

  // Remove keys that will not be used anymore
  rowsWithIds.forEach((row: any) => {
    delete row.id;
    delete row.descriptionTranslationKey;
    delete row.choiceTranslationKey;

    languagesList.forEach((langCode) => {
      delete row[`question_text_${langCode}`];
      delete row[`choice_text_${langCode}`];
      delete row[`questionDescription_text_${langCode}`];
    });
  });
  const translationsInSingleArray = recordsToSingleArray(rowsWithIds);
  return addCountryCodesToRecords(translationsInSingleArray, countryCode);
}

export async function fetchAndParseQuestionTranslations(
  googleSheetsApiClient: Sheets,
) {
  let translations: Record<string, string>[] = [];
  for (const countryCode of countryCodes) {
    const sheetData: Record<string, string>[] | undefined =
      await parseCountryTranslations(googleSheetsApiClient, countryCode);
    if (sheetData) {
      translations = [...translations, ...sheetData];
    }
  }
  return await sortTranslationsByLanguageRemoveLanguageCodes(translations);
}
