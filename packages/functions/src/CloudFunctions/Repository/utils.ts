import { collections } from "../../constants";
import { EitherLoggedInOrAnonUserId } from "../Utilities/types";
import { hashMail } from "../Utilities/utilities";
import * as admin from "firebase-admin";
import { firestore } from "firebase-admin";
import { DocumentData, QuerySnapshot } from "firebase-admin/firestore";

export const MAX_WRITES_PER_BATCH = 500;

export const deleteAll = async (collection: QuerySnapshot<DocumentData>) => {
  const commitBatchPromises: DocumentData[] = [];

  const writeBatch = firestore().batch();
  collection.docs.forEach((doc) => writeBatch.delete(doc.ref));
  commitBatchPromises.push(writeBatch.commit());

  await Promise.all(commitBatchPromises);
};

export const createUserRef = (user: EitherLoggedInOrAnonUserId) => {
  return "email" in user
    ? admin
        .firestore()
        .collection(collections.authenticatedUsers)
        .doc(hashMail(user.email))
    : admin.firestore().collection(collections.anonymousUsers).doc(user.anonId);
};

export const queryLatestImportedEntityVersion = async (
  collectionName: string,
): Promise<string> => {
  try {
    const latestVersionEntity = await admin
      .firestore()
      .collection(collectionName)
      .orderBy("importDate", "desc")
      .limit(1)
      .get();

    return latestVersionEntity.docs[0].id;
  } catch (e) {
    console.log("error queryLatestVersion", e);
    throw e;
  }
};
