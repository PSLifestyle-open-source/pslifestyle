/* eslint-disable camelcase */
import { defaultLanguageName } from "../../../../common/src/models/languages";
import { queryLatestImportedEntityVersion } from "../../CloudFunctions/Repository/utils";
import { collections } from "../../constants";
import { FeedbackCardsPerCountry } from "../../utils/models";
import { feedbackCardsFetchAndParse } from "../ImportParsers/feedbackCardsFetchAndParse";
import { createFirestoreBatchUpdater } from "../createFirestoreBatchUpdater";
import { Firestore } from "firebase-admin/firestore";
import { sheets_v4 } from "googleapis";

import Sheets = sheets_v4.Sheets;

const defaultLanguageFieldPrefix = "option_text";
const defaultLanguageField = `${defaultLanguageFieldPrefix}_${defaultLanguageName.toLowerCase()}`;

export const parseFeedbackCardsToFirestore = (
  feedbackCardsPerCountry: FeedbackCardsPerCountry,
): Record<string, { id: string; text: string; sortKey: string }[]> => {
  const parsedCards: Record<
    string,
    { id: string; text: string; sortKey: string }[]
  > = {};

  for (const countryCode in feedbackCardsPerCountry) {
    parsedCards[countryCode] = feedbackCardsPerCountry[countryCode].map(
      (feedbackCard) => ({
        id: feedbackCard.id,
        text: feedbackCard[defaultLanguageField],
        sortKey: feedbackCard.order_number,
      }),
    );
  }

  return parsedCards;
};

export const persistToFirestore = async (
  firestoreApiClient: Firestore,
  feedbackCardsPerCountryToPersist: Record<
    string,
    { id: string; text: string }[]
  >,
  update?: boolean,
): Promise<void> => {
  const date = new Date();
  const version = update
    ? await queryLatestImportedEntityVersion(collections.importedFeedback)
    : date.toISOString();
  console.log(`${update ? "Updating" : "Creating"} ${version}`);

  try {
    await firestoreApiClient
      .collection(collections.importedFeedback)
      .doc(version)
      .set({ importDate: date });

    const firestoreBatchUpdater =
      createFirestoreBatchUpdater(firestoreApiClient);
    for (const countryCode of Object.keys(feedbackCardsPerCountryToPersist)) {
      const feedbackCardForCountry =
        feedbackCardsPerCountryToPersist[countryCode];

      for (const feedbackCard of feedbackCardForCountry) {
        await firestoreBatchUpdater.addItem({
          documentReference: firestoreApiClient
            .collection(collections.importedFeedback)
            .doc(version)
            .collection(countryCode)
            .doc(feedbackCard.id),
          data: feedbackCard,
        });
      }
    }

    await firestoreBatchUpdater.flushStorage();
    console.log("Actions were synced successfully.");
  } catch (error) {
    console.log(error);
    if (!update) {
      await firestoreApiClient
        .collection(collections.importedFeedback)
        .doc(version)
        .delete();
    }
    throw error;
  }
};

export async function feedbackCardExport(
  firestoreApiClient: Firestore,
  googleSheetApiClient: Sheets,
): Promise<void> {
  console.log("Syncing Feedback cards started");

  const feedbackCardsPerCountry =
    await feedbackCardsFetchAndParse(googleSheetApiClient);
  const feedbackCardsToStoreInFirestore = parseFeedbackCardsToFirestore(
    feedbackCardsPerCountry,
  );
  await persistToFirestore(firestoreApiClient, feedbackCardsToStoreInFirestore);
}
