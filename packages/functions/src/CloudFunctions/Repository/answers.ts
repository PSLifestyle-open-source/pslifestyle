import { collections } from "../../constants";
import { SavedAnswerSet } from "../Types/answers";
import { EitherLoggedInOrAnonUserId } from "../Utilities/types";
import { createUserRef } from "./utils";

export const fetchLatestUserAnswerSet = async (
  userId: EitherLoggedInOrAnonUserId,
): Promise<SavedAnswerSet | null> => {
  const results = await createUserRef(userId)
    .collection(collections.answers)
    .orderBy("metadata.createdAt", "desc")
    .limit(1)
    .get();

  if (results.size === 0) {
    return null;
  }

  return results.docs[0].data() as SavedAnswerSet;
};
