import { collections } from "../../constants";
import { updateUser } from "../Repository/user";
import { createUserRef } from "../Repository/utils";
import { FeedbackMetadata } from "../Types/feedback";
import { EitherLoggedInOrAnonUserId } from "../Utilities/types";
import { Transaction } from "firebase-admin/firestore";

export const saveFeedback = async (
  transaction: Transaction,
  userId: EitherLoggedInOrAnonUserId,
  answerSetId: string,
  selectedOptions: string[],
  metadata: FeedbackMetadata,
) => {
  await updateUser(transaction, userId, {
    latestFeedbackAt: metadata.createdAt,
  });

  const feedbackRef = createUserRef(userId)
    .collection(collections.answers)
    .doc(answerSetId)
    .collection(collections.userFeedback)
    .doc(metadata.createdAt.toDate().toISOString());

  transaction.set(feedbackRef, { selectedOptions, metadata });
};
