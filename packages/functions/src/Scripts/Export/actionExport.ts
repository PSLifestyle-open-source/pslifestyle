/* eslint-disable camelcase */
import { Action } from "../../../../common/src/schemas";
import { queryLatestImportedEntityVersion } from "../../CloudFunctions/Repository/utils";
import { collections } from "../../constants";
import { ActionsPerCountry } from "../../utils/models";
import { validateActions } from "../../utils/validators";
import { fetchActionsPerCountry } from "../ImportParsers/actionsFetchAndParse";
import { createFirestoreBatchUpdater } from "../createFirestoreBatchUpdater";
import { Firestore } from "firebase-admin/firestore";
import { sheets_v4 } from "googleapis";

import Sheets = sheets_v4.Sheets;

export async function handleActionData(
  actions: ActionsPerCountry,
  firestoreApiClient: Firestore,
  update?: boolean,
) {
  console.log("\n-----\nSTARTING Validating actions..\n-----\n.");
  const date = new Date();
  const version = update
    ? await queryLatestImportedEntityVersion(collections.importedActions)
    : date.toISOString();
  console.log(`${update ? "Updating" : "Creating"} ${version}`);

  for (const countryCode of Object.keys(actions)) {
    console.log(`Validating actions for ${countryCode}`);
    const countryActions = actions[countryCode];
    const validatedActions = validateActions(countryActions, countryCode);
    if (validatedActions.length !== countryActions.length) {
      throw new Error(
        "Not all actions were validated correctly. Nothing imported to database.",
      );
    }
  }

  try {
    await firestoreApiClient
      .collection(collections.importedActions)
      .doc(version)
      .set({ importDate: date });

    const firestoreBatchUpdater =
      createFirestoreBatchUpdater(firestoreApiClient);
    for (const countryCode of Object.keys(actions)) {
      const countryActions: Action[] = actions[countryCode];

      for (const action of countryActions) {
        await firestoreBatchUpdater.addItem({
          documentReference: firestoreApiClient
            .collection(collections.importedActions)
            .doc(version)
            .collection(countryCode)
            .doc(action.id),
          data: action,
        });
      }
    }

    await firestoreBatchUpdater.flushStorage();
    console.log("Actions were synced successfully.");
  } catch (error) {
    console.log(error);
    if (!update) {
      await firestoreApiClient
        .collection(collections.importedActions)
        .doc(version)
        .delete();
    }
    throw error;
  }
}

export async function actionExport(
  firestoreApiClient: Firestore,
  googleSheetApiClient: Sheets,
) {
  const actions = await fetchActionsPerCountry(googleSheetApiClient);
  if (!actions) {
    console.log("No actions found");
    return;
  }
  return handleActionData(actions, firestoreApiClient);
}
