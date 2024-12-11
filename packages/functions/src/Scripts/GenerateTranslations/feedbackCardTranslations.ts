/* eslint-disable camelcase */
import { englishNameToLanguageCode } from "../../../../common/src/models/languages";
import TranslationFileWriter from "../Factory/translationFileWriter";
import {
  FeedbackCard,
  feedbackCardsFetchAndParse,
} from "../ImportParsers/feedbackCardsFetchAndParse";
import { sheets_v4 } from "googleapis";

import Sheets = sheets_v4.Sheets;

const defaultLanguageFieldPrefix = "option_text";

const parseFeedbackCardsToTranslationFiles = (
  feedbackCardsPerCountry: Record<string, FeedbackCard[]>,
): Record<string, Record<string, string>> => {
  const fieldToLocaleCodeLookup: Record<string, string> = {};
  const getLocaleCode = (fieldName: string): string => {
    if (!fieldToLocaleCodeLookup[fieldName]) {
      const localeName = fieldName.split("_").pop();

      if (!localeName) {
        throw new Error("Locale name not found");
      }

      fieldToLocaleCodeLookup[fieldName] =
        englishNameToLanguageCode[
          localeName.charAt(0).toUpperCase() + localeName.slice(1)
        ];

      if (!fieldToLocaleCodeLookup[fieldName]) {
        throw new Error(`Could not find locale for field ${fieldName}`);
      }
    }

    return fieldToLocaleCodeLookup[fieldName];
  };

  const parsedCards: Record<string, Record<string, string>> = {};
  for (const countryCode in feedbackCardsPerCountry) {
    const countrySpecificCards = feedbackCardsPerCountry[countryCode];
    countrySpecificCards.forEach((feedbackCard) =>
      Object.entries(feedbackCard).forEach(([fieldName, translatedText]) => {
        if (!fieldName.startsWith(defaultLanguageFieldPrefix)) {
          return;
        }

        const localeCode = getLocaleCode(fieldName);

        if (!parsedCards[localeCode]) {
          parsedCards[localeCode] = {};
        }

        parsedCards[localeCode][`${feedbackCard.id}_${countryCode}`] =
          translatedText;
      }),
    );
  }

  return parsedCards;
};

export async function feedbackCardTranslations(
  googleSheetApiClient: Sheets,
  translationFileWriter: TranslationFileWriter,
): Promise<void> {
  console.log("Syncing Feedback cards started");

  const feedbackCardsPerCountry =
    await feedbackCardsFetchAndParse(googleSheetApiClient);
  translationFileWriter.persist(
    parseFeedbackCardsToTranslationFiles(feedbackCardsPerCountry),
  );
}
