import {
  deleteAll,
  MAX_WRITES_PER_BATCH,
} from "../CloudFunctions/Repository/utils";
import { collections } from "../constants";
import * as admin from "firebase-admin";

const getYesterdayDate = () => {
  const date = new Date(); // Today!
  date.setDate(date.getDate() - 1); // Yesterday!

  return date;
};

/**
 * Delete all anonymous users which have no answers created in 24H
 */
export const handleDailyAnonUserCleanup = async (): Promise<void> => {
  const yesterdayDate = getYesterdayDate();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const oldEntities = await admin
      .firestore()
      .collection(collections.anonymousUsers)
      .where("latestAnswerAt", "==", null)
      .where("updatedAt", "<", yesterdayDate)
      .limit(MAX_WRITES_PER_BATCH)
      .get();

    if (!oldEntities.docs.length) {
      break;
    }

    await deleteAll(oldEntities);
  }
};
