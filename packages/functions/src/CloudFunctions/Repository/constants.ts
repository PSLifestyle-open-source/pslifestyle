import { collections } from "../../constants";
import { queryLatestImportedEntityVersion } from "./utils";
import * as admin from "firebase-admin";

const defaultConstantsCollection = "DEFAULT";
const defaultConstantsDoc = "constants";

export const fetchConstants = async (
  countryCode: string,
  version: string,
): Promise<Record<string, number>> => {
  const [countryConstants, defaultConstants] = await Promise.all([
    admin
      .firestore()
      .collection(collections.importedConstants)
      .doc(version)
      .collection(countryCode)
      .doc(defaultConstantsDoc)
      .get(),
    admin
      .firestore()
      .collection(collections.importedConstants)
      .doc(version)
      .collection(defaultConstantsCollection)
      .doc(defaultConstantsDoc)
      .get(),
  ]);

  return {
    ...defaultConstants.data(),
    ...countryConstants.data(),
  };
};

export const fetchLatestConstants = async (
  countryCodes: string,
): Promise<Record<string, number>> => {
  return fetchConstants(
    countryCodes,
    await queryLatestImportedEntityVersion(collections.importedConstants),
  );
};
