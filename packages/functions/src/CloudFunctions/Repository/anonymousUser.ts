import { collections } from "../../constants";
import { AnonymousUser } from "../Types/user";
import { addTimestamps } from "../Utilities/utilities";
import { campaignExists } from "./campaigns";
import * as admin from "firebase-admin";
import { DocumentSnapshot } from "firebase-admin/firestore";
import { v4 as uuidv4 } from "uuid";

export const findAnonymousUserById = async (
  anonId: string,
): Promise<AnonymousUser | null> => {
  const user = (await admin
    .firestore()
    .collection(collections.anonymousUsers)
    .doc(anonId)
    .get()) as DocumentSnapshot<AnonymousUser>;

  return user.data()
    ? ({ ...user.data(), id: user.id } as AnonymousUser)
    : null;
};

export const createAnonymousUser = async (
  campaignId?: string | null,
): Promise<string> => {
  const anonId = uuidv4();
  const createResult = await admin
    .firestore()
    .collection(collections.anonymousUsers)
    .doc(anonId)
    .set({
      ...addTimestamps(false),
      latestAnswerAt: null,
      version: 1,
      campaignIds:
        campaignId && (await campaignExists(campaignId)) ? [campaignId] : [],
    });

  if (!createResult.writeTime) {
    throw new Error("Failed to create anonymous user");
  }

  return anonId;
};
