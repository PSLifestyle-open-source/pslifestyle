/* eslint-disable @typescript-eslint/no-explicit-any,camelcase */
import TranslationFileWriter from "../Factory/translationFileWriter";
import { fetchAndParseActionTranslations } from "../ImportParsers/Translations/fetchActionTranslations";
import { fetchAndParseQuestionTranslations } from "../ImportParsers/Translations/fetchQuestionTranslations";
import { sheets_v4 } from "googleapis";

import Sheets = sheets_v4.Sheets;

function merge(current: any, updates: any) {
  for (const key of Object.keys(updates)) {
    // eslint-disable-next-line no-prototype-builtins
    if (!current.hasOwnProperty(key) || typeof updates[key] !== "object") {
      current[key] = updates[key];
    } else {
      merge(current[key], updates[key]);
    }
  }
  return current;
}

async function gatherTranslationsForAllLanguages(
  googleSheetsApiClient: Sheets,
) {
  const questionsActions = await fetchAndParseQuestionTranslations(
    googleSheetsApiClient,
  );
  const challengesIdeas = await fetchAndParseActionTranslations(
    googleSheetsApiClient,
  );
  return merge(questionsActions, challengesIdeas);
}

export const actionsAndQuestionsTranslations = async (
  googleSheetsApiClient: Sheets,
  translationFileWriter: TranslationFileWriter,
) => {
  const translationsByLang = await gatherTranslationsForAllLanguages(
    googleSheetsApiClient,
  );
  translationFileWriter.persist(translationsByLang);
};
