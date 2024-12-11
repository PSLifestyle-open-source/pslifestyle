import { RawRecommendedAction } from "../../../../common/src/types/planTypes";
import { collections } from "../../constants";
import { queryLatestImportedEntityVersion } from "./utils";
import * as admin from "firebase-admin";

export const fetchLatestActions = async (
  countryCode: string,
): Promise<{ version: string; actions: RawRecommendedAction[] }> => {
  const latestVersion = await queryLatestImportedEntityVersion(
    collections.importedActions,
  );
  const actions = await admin
    .firestore()
    .collection(collections.importedActions)
    .doc(latestVersion)
    .collection(countryCode)
    .get();

  return {
    version: latestVersion,
    actions: actions.docs.map((doc) => doc.data()) as RawRecommendedAction[],
  };
};
