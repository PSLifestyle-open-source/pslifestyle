/* eslint-disable camelcase */
import { queryLatestImportedEntityVersion } from "../../CloudFunctions/Repository/utils";
import { collections } from "../../constants";
import { ConstantsPerCountry } from "../../utils/models";
import { fetchAndParseConstants } from "../ImportParsers/constantFetchAndParse";
import { createFirestoreBatchUpdater } from "../createFirestoreBatchUpdater";
import { Firestore } from "firebase-admin/firestore";
import { sheets_v4 } from "googleapis";

import Sheets = sheets_v4.Sheets;

export async function handleConstants(
  data: ConstantsPerCountry,
  firestoreApiClient: Firestore,
  update?: boolean,
) {
  const date = new Date();
  const version = update
    ? await queryLatestImportedEntityVersion(collections.importedConstants)
    : date.toISOString();
  console.log(`${update ? "Updating" : "Creating"} ${version}`);
  const firestoreBatchUpdater = createFirestoreBatchUpdater(firestoreApiClient);
  try {
    // A date field is created first to make the document "physical" in the collection (can be an empty field as well)
    await firestoreApiClient
      .collection(collections.importedConstants)
      .doc(version)
      .set({ importDate: date });

    for (const key of Object.keys(data)) {
      await firestoreBatchUpdater.addItem({
        documentReference: firestoreApiClient
          .collection(collections.importedConstants)
          .doc(version)
          .collection(key)
          .doc("constants"),
        data: data[key],
        options: { merge: true },
      });
    }

    await firestoreBatchUpdater.flushStorage();
    console.log("Successfully parsed constants taken to database.");
  } catch (error) {
    console.log(error);
    if (!update) {
      await firestoreApiClient
        .collection(collections.importedConstants)
        .doc(version)
        .delete();
    }
    throw error;
  }
}

export async function constantExport(
  firestoreApiClient: Firestore,
  googleSheetsApiClient: Sheets,
) {
  const data = await fetchAndParseConstants(googleSheetsApiClient);
  if (!data) {
    console.error("No constants found");
    return;
  }
  return handleConstants(data, firestoreApiClient);
}
