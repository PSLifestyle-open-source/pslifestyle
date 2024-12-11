import { collections } from "../constants";
import * as admin from "firebase-admin";

const getYesterdayDate = () => {
  const date = new Date(); // Today!
  date.setDate(date.getDate() - 1); // Yesterday!

  return date;
};

/**
 * Deleted daily ascend data which were not merged to logged-in user
 */
export async function handleRemoveAscendUserNotAuthenticatedOldData(): Promise<void> {
  console.log("Unauthenticated data cleanup started");
  const yesterdayDate = getYesterdayDate();

  const oldEntities = await admin
    .firestore()
    .collection(collections.ascendUserDataStorage)
    .where("createdAt", "<", yesterdayDate)
    .get();

  const bulkWriter = admin.firestore().bulkWriter();
  for (const document of oldEntities.docs) {
    console.log(`Deleting authenticated data id ${document.id}`);
    await admin.firestore().recursiveDelete(document.ref, bulkWriter);
  }

  await bulkWriter.flush();

  console.log("Unauthenticated data cleanup finished");
}
