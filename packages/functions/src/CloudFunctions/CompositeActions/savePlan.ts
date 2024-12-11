import { CalculatedPlan } from "../../../../common/src/types/planTypes";
import { collections } from "../../constants";
import { updateUser } from "../Repository/user";
import { createUserRef } from "../Repository/utils";
import { PlanMetadata } from "../Types/plan";
import { EitherLoggedInOrAnonUserId } from "../Utilities/types";
import { Transaction } from "firebase-admin/firestore";

export const savePlan = async (
  transaction: Transaction,
  userId: EitherLoggedInOrAnonUserId,
  answerSetId: string,
  plan: CalculatedPlan,
  planMetadata: PlanMetadata,
) => {
  await updateUser(transaction, userId, {
    latestPlanAt: planMetadata.createdAt,
  });

  const planRef = createUserRef(userId)
    .collection(collections.answers)
    .doc(answerSetId)
    .collection(collections.plans)
    .doc(planMetadata.createdAt.toDate().toISOString());

  transaction.set(planRef, {
    ...plan,
    metadata: planMetadata,
  });
};
