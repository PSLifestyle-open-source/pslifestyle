/* eslint-disable camelcase */
import { countries } from "../../../../common/src/models/countries";
import { FeedbackCardsPerCountry } from "../../utils/models";
import { createGoogleSheetsFetchSettings } from "../Factory/createGoogleSheetsFetchSettings";
import { sheets_v4 } from "googleapis";

import Sheets = sheets_v4.Sheets;

export type FeedbackCard = {
  id: string;
  order_number: string;
  [option_text_locale_name: string]: string;
};

const parseFeedbackCards = (
  headersRow: string[],
  rowsOfFeedbackCardsData: string[][],
): FeedbackCard[] => {
  const feedbackCards: Record<string, string>[] = [];
  rowsOfFeedbackCardsData.forEach((dataRow) => {
    const feedbackCard: Record<string, string> = {};
    headersRow.forEach(
      (header, index) =>
        (feedbackCard[
          header
            .toLowerCase()
            .replace(/ /g, "_")
            .replace("(", "")
            .replace(")", "")
        ] = dataRow[index]),
    );
    feedbackCards.push(feedbackCard);
  });

  return feedbackCards as FeedbackCard[];
};

const fetchFeedbackCardsFromMasterSource = async (
  googleSheetApiClient: Sheets,
  countryCode: string,
): Promise<FeedbackCard[]> => {
  const results = await googleSheetApiClient.spreadsheets.values.get(
    createGoogleSheetsFetchSettings(`${countryCode}_FeedbackCard`),
  );
  const rows = results.data.values as string[][] | null | undefined;
  if (!rows) {
    throw new Error(
      `Due to unknown reason, loading of feedback cards for country code "${countryCode}" returned no results.`,
    );
  }

  const [headersRow, ...dataRows] = rows;
  if (!dataRows.length) {
    throw new Error(
      `Due to unknown reason, there is no feedback cards rows for country code "${countryCode}".`,
    );
  }

  return parseFeedbackCards(headersRow, dataRows);
};

export const feedbackCardsFetchAndParse = async (
  googleSheetApiClient: Sheets,
) => {
  const idsProcessed: string[] = [];
  const doesCountryUseDuplicatedIds = (feedbackCards: FeedbackCard[]) => {
    if (
      feedbackCards.some((feedbackCard) =>
        idsProcessed.includes(feedbackCard.id),
      )
    ) {
      throw new Error(
        `One from following cards ${JSON.stringify(
          feedbackCards,
        )} uses duplicated ID as other. Please generate new ID.`,
      );
    }

    feedbackCards.forEach((feedbackCard) => idsProcessed.push(feedbackCard.id));
  };

  const groupedFeedbackCards: FeedbackCardsPerCountry = {};

  for (const country of countries) {
    groupedFeedbackCards[country.code] =
      await fetchFeedbackCardsFromMasterSource(
        googleSheetApiClient,
        country.code,
      );
    doesCountryUseDuplicatedIds(groupedFeedbackCards[country.code]);
  }

  return groupedFeedbackCards;
};
