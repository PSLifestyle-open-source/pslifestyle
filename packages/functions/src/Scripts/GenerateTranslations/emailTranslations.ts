/* eslint-disable @typescript-eslint/no-explicit-any,camelcase */
// Connects to a Google Sheets document specified in object "opt" and retrieves the specified range.
// The Sheets doc needs to be shared to the service account email.
import { languagesList } from "../../../../common/src/models/languages";
import { returnHeadersWithIndices } from "../../utils/helpers";
import { createGoogleSheetsFetchSettings } from "../Factory/createGoogleSheetsFetchSettings";
import TranslationFileWriter from "../Factory/translationFileWriter";
import { sheets_v4 } from "googleapis";

import Sheets = sheets_v4.Sheets;

const fetchData = async (googleSheetsApiClient: Sheets) => {
  const results = await googleSheetsApiClient.spreadsheets.values.get(
    createGoogleSheetsFetchSettings("Static translations"),
  );
  const data = results.data.values;
  if (data === undefined || data === null) return;

  // take the first row to store all original headers
  const headerArray = data[0];

  // keys are used to hand-pick the desired headers and values
  const keysMap: Record<string, string> = {
    Group: "group",
    "Translation key": "key",
    "Text (English)": "text_en-GB",
    "Text (Finnish)": "text_fi-FI",
    "Text (Swedish)": "text_sv-FI",
    "Text (Estonian)": "text_et-EE",
    "Text (Greek)": "text_el-GR",
    "Text (Turkish)": "text_tr-TR",
    "Text (German)": "text_de-DE",
    "Text (Portuguese)": "text_pt-PT",
    "Text (Italian)": "text_it-IT",
    "Text (Slovene)": "text_sl-SI",
    "Text (Russian)": "text_ru-RU",
  };

  const headersWithIndices = returnHeadersWithIndices(headerArray, keysMap);

  // create objects with new headers as keys and cell contents as values
  // picking only the columns that hold the desired data
  return data.slice(1).map((row) => {
    const obj = {} as any;
    row.forEach((cell, i) => {
      headersWithIndices.forEach(([header, index]) => {
        // index for header and corresponding cell at any row is the same
        if (i === index && cell !== "") {
          obj[header] = cell.trim();
        }
      });
    });
    return obj;
  });
};

export const emailTranslations = async (
  googleSheetsApiClient: Sheets,
  translationFileWriter: TranslationFileWriter,
) => {
  const rows = await fetchData(googleSheetsApiClient);

  if (!rows || !rows.length) {
    throw new Error("No email translations to sync");
  }

  // Create objects for each language
  const translations = {} as any;
  languagesList.forEach((langCode) => {
    translations[langCode] = {} as any;
    const text = `text_${langCode}`;

    rows.forEach((row) => {
      if (row[text] && row.key) {
        if (!translations[langCode][row.group]) {
          translations[langCode][row.group] = {};
        }

        translations[langCode][row.group][row.key] = row[text];
      }
    });
  });

  const combinedEmailTranslations: {
    [languageCode: string]: Record<string, string>;
  } = {};
  languagesList.forEach((languageCode) => {
    combinedEmailTranslations[languageCode] =
      translations[languageCode]["signInEmail"];
  });

  translationFileWriter.persist(combinedEmailTranslations);
};
