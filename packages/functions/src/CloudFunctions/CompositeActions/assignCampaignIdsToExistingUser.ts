import { collections } from "../../constants";
import { updateUser } from "../Repository/user";
import { createUserRef } from "../Repository/utils";
import { AnonymousUser, AuthenticatedUser } from "../Types/user";
import { EitherLoggedInOrAnonUserId } from "../Utilities/types";
import * as admin from "firebase-admin";

export const assignCampaignIdsToExistingUser = async (
  userId: EitherLoggedInOrAnonUserId,
  user: AuthenticatedUser | AnonymousUser,
  campaignIds: string[],
): Promise<void> => {
  await admin.firestore().runTransaction(async (t) => {
    await updateUser(t, userId, { campaignIds });

    if (!user.latestAnswerAt) {
      return;
    }

    t.set(
      createUserRef(userId)
        .collection(collections.answers)
        .doc(user.latestAnswerAt.toDate().toISOString()),
      { campaignIds },
      { merge: true },
    );

    if (!user.latestPlanAt) {
      return;
    }

    t.set(
      createUserRef(userId)
        .collection(collections.answers)
        .doc(user.latestAnswerAt.toDate().toISOString())
        .collection(collections.plans)
        .doc(user.latestPlanAt.toDate().toISOString()),
      { campaignIds },
      { merge: true },
    );
  });
};
