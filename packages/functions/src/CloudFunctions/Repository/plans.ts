import { collections } from "../../constants";
import { SavedPlan } from "../Types/plan";
import { EitherLoggedInOrAnonUserId } from "../Utilities/types";
import { createUserRef } from "./utils";

export const fetchLatestUserPlan = async (
  userId: EitherLoggedInOrAnonUserId,
  answerSetId: string,
): Promise<SavedPlan | null> => {
  const plan = await createUserRef(userId)
    .collection(collections.answers)
    .doc(answerSetId)
    .collection(collections.plans)
    .orderBy("metadata.createdAt", "desc")
    .limit(1)
    .get();

  return plan.size > 0 ? (plan.docs[0].data() as SavedPlan) : null;
};
