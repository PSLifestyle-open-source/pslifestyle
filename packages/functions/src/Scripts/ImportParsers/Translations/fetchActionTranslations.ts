/* eslint-disable @typescript-eslint/no-explicit-any,camelcase */
// Connects to a Google Sheets document specified in object "opt" and retrieves the specified range.
// The Sheets doc needs to be shared to the service account email.
import { countryCodes } from "../../../../../common/src/models/countries";
import { Action } from "../../../../../common/src/schemas";
import {
  addCountryCodesToRecords,
  recordsToSingleArray,
  returnHeadersWithIndices,
  sortTranslationsByLanguageRemoveLanguageCodes,
} from "../../../utils/helpers";
import { createGoogleSheetsFetchSettings } from "../../Factory/createGoogleSheetsFetchSettings";
import { sheets_v4 } from "googleapis";

import Sheets = sheets_v4.Sheets;

async function challengesIdeasTranslationsPerCountry(
  countryCode: string,
  googleSheetApiClient: Sheets,
) {
  const results = await googleSheetApiClient.spreadsheets.values.get(
    createGoogleSheetsFetchSettings(`${countryCode}_ACT_2`),
  );
  const data = results.data.values;
  if (data === undefined || data === null) return;

  const headerArray = data[0];

  // keys are used to hand-pick the desired headers and values to replace them with desired ones
  const keysMap: Record<string, string> = {
    ID: "id",
    // 'Action identifier (automatic)': 'recommendationIdentifier',
    "Action title (English)": "actionTitle_en-GB",
    "Action description (English)": "actionDescription_en-GB",
  };

  const headersWithIndices: [string, number][] = returnHeadersWithIndices(
    headerArray,
    keysMap,
  );

  function parseRowObjects(data: any): any[] {
    return data.slice(1).map((row: any) => {
      const obj = {} as any;
      row.forEach((cell: any, i: number) => {
        headersWithIndices.forEach(([header, index]) => {
          // index for header and corresponding cell at any row is the same
          if (i === index) {
            if (cell) obj[header as keyof Action] = cell;
          }
        });
      });
      return obj;
    });
  }

  const countryChallengesIdeas: Action[] = parseRowObjects(data);
  return countryChallengesIdeas;
}

function createTranslationKeysOmitOldKeys(obj: any) {
  for (const [key, value] of Object.entries(obj)) {
    const objectType = key.slice(0, key.indexOf("_"));
    const langCode = key.slice(key.lastIndexOf("_") + 1);
    switch (objectType) {
      case "actionTitle":
        obj[`${obj.id}_${objectType}_${langCode}`] = value;
        delete obj[key];
        break;
      case "actionDescription":
        obj[`${obj.id}_${objectType}_${langCode}`] = value;
        delete obj[key];
        break;
      default:
        break;
    }
  }
  delete obj["id"];
  return obj;
}

export async function fetchAndParseActionTranslations(
  googleSheetApiClient: Sheets,
) {
  let translations: Record<string, string>[] = [];
  // const challengeIdeaData = await allChallengesIdeas();

  for (const countryCode of countryCodes) {
    try {
      const countryActionTranslations =
        await challengesIdeasTranslationsPerCountry(
          countryCode,
          googleSheetApiClient,
        );
      if (countryActionTranslations) {
        const completeObjects: Action[] = countryActionTranslations.map(
          (row) => {
            return createTranslationKeysOmitOldKeys(row);
          },
        );
        console.log("Actions parsed");
        const recordsInSingleArray = recordsToSingleArray(completeObjects);
        const recordsInSingleArrayWithCountryCodes = addCountryCodesToRecords(
          recordsInSingleArray,
          countryCode,
        );
        console.log(recordsInSingleArrayWithCountryCodes);

        translations = [
          ...translations,
          ...recordsInSingleArrayWithCountryCodes,
        ];
      }
    } catch {
      console.log("Fetching failed for", countryCode);
    }
  }
  return sortTranslationsByLanguageRemoveLanguageCodes(translations);
}
