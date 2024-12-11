import { collections } from "../../constants";
import { updateUser } from "../Repository/user";
import { createUserRef } from "../Repository/utils";
import {
  CalculatedAnswerSet,
  SavedAnswerSet,
  SavedAnswerSetMetadata,
} from "../Types/answers";
import { EitherLoggedInOrAnonUserId } from "../Utilities/types";
import { Timestamp, Transaction } from "firebase-admin/firestore";

export const saveAnswerSet = async (
  transaction: Transaction,
  userId: EitherLoggedInOrAnonUserId,
  calculatedAnswerSet: CalculatedAnswerSet,
  answerSetMetadata: SavedAnswerSetMetadata,
): Promise<SavedAnswerSet> => {
  const userDataToUpdate: {
    latestAnswerAt: Timestamp;
    latestDemographicAt?: Timestamp;
  } = {
    latestAnswerAt: answerSetMetadata.createdAt,
  };

  if (calculatedAnswerSet.demographicAnswers.length) {
    userDataToUpdate.latestDemographicAt = answerSetMetadata.createdAt;
  }
  await updateUser(transaction, userId, userDataToUpdate);

  transaction.set(createUserRef(userId), userDataToUpdate, { merge: true });

  const answersRef = createUserRef(userId)
    .collection(collections.answers)
    .doc(answerSetMetadata.createdAt.toDate().toISOString());

  const answerSetToSave = {
    ...calculatedAnswerSet,
    metadata: answerSetMetadata,
  };

  transaction.set(answersRef, answerSetToSave);

  return answerSetToSave;
};
