import { buildQuery, getDocs } from "../FirestoreClient";
import { queryLatestEntityVersion } from "./common";
import { Country } from "@pslifestyle/common/src/models/countries";
import { FeedbackCard } from "@pslifestyle/common/src/types/feedback";
import { orderBy } from "firebase/firestore";

export const fetchFeedbackCards = async (
  chosenCountry: Country,
): Promise<[string, FeedbackCard[]] | null> => {
  const collectionName = "feedbackCards";
  try {
    const feedbackCardsVersion = await queryLatestEntityVersion(collectionName);

    // Second query for the actual questions
    const queryPath = `${collectionName}/${feedbackCardsVersion}/${chosenCountry.code}/`;
    const queryFeedbackCards = buildQuery(queryPath, orderBy("sortKey"));
    const queryResults = await getDocs(await queryFeedbackCards);
    const feedbackCards = queryResults.docs;
    const feedbackCardsFromDb: FeedbackCard[] = feedbackCards
      .filter(Boolean)
      .map((question) => question.data() as FeedbackCard);
    if (!feedbackCardsFromDb.length) return null;
    return [feedbackCardsVersion, feedbackCardsFromDb];
  } catch (e) {
    console.log(e);
  }

  return null;
};
