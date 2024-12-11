import { User, UserRoles } from "../../../../common/src/models/user";
import { collections } from "../../constants";
import { AuthenticatedUser, AuthFields } from "../Types/user";
import { addTimestamps, hashMail } from "../Utilities/utilities";
import { findAnonymousUserById } from "./anonymousUser";
import * as admin from "firebase-admin";
import { DocumentSnapshot, Transaction } from "firebase-admin/firestore";

export const findAuthenticatedUserByEmail = async (
  email: string,
): Promise<AuthenticatedUser | null> => {
  const emailHash = hashMail(email);
  const user = (await admin
    .firestore()
    .collection(collections.authenticatedUsers)
    .doc(emailHash)
    .get()) as DocumentSnapshot<AuthenticatedUser>;

  return user.data()
    ? ({ ...user.data(), id: user.id } as AuthenticatedUser)
    : null;
};

export const createAuthenticatedUser = async (
  email: string,
  roles: Array<User["roles"]>,
): Promise<void> => {
  if (!email) {
    throw new Error("Invalid or missing data");
  }

  const emailHash = hashMail(email);
  const createResult = await admin
    .firestore()
    .collection(collections.authenticatedUsers)
    .doc(emailHash)
    .set({
      ...addTimestamps(false),
      roles,
      campaignIds: [],
      version: 1,
    });

  if (!createResult.writeTime) {
    throw new Error(
      "Error occurred while updating campaign ID to authorized user",
    );
  }
};

export const upgradeUserToV1Model = async (
  transaction: Transaction,
  user: AuthenticatedUser,
): Promise<void> => {
  const newUserData: Omit<AuthenticatedUser, "id"> & { id?: string } = {
    ...user,
  };
  delete newUserData.id;

  const createResult = await admin
    .firestore()
    .collection(collections.authenticatedUsers)
    .doc(user.id)
    .set({
      ...addTimestamps(false),
      ...newUserData,
      roles: user.roles || [],
      campaignIds: user.campaignIds || [],
      version: 1,
    });

  if (!createResult.writeTime) {
    throw new Error(
      "Error occurred while updating campaign ID to authorized user",
    );
  }
};

export const updateMagicLink = async (
  email: string,
  auth: AuthFields,
): Promise<void> => {
  if (!email) {
    throw new Error("Invalid or missing data");
  }

  const emailHash = hashMail(email);
  const updateResult = await admin
    .firestore()
    .collection(collections.authenticatedUsers)
    .doc(emailHash)
    .set(
      {
        ...addTimestamps(true),
        ...auth,
      },
      { merge: true },
    );

  if (!updateResult.writeTime) {
    throw new Error("Error occurred while updating magic link");
  }
};

export const updateUserSettings = async (
  email: string,
  settings: { roles: UserRoles },
): Promise<void> => {
  if (!email) {
    throw new Error("Invalid or missing data");
  }

  const emailHash = hashMail(email);
  const updateResult = await admin
    .firestore()
    .collection(collections.authenticatedUsers)
    .doc(emailHash)
    .set(
      {
        ...settings,
      },
      { merge: true },
    );

  if (!updateResult.writeTime) {
    throw new Error("Error occurred while updating user settings");
  }
};

export const deleteAuthenticatedUser = async (email: string): Promise<void> => {
  const hashedEmail = hashMail(email);
  const userRef: admin.firestore.DocumentReference = admin
    .firestore()
    .collection(collections.authenticatedUsers)
    .doc(hashedEmail);

  const bulkWriter = admin.firestore().bulkWriter();
  // Delete user and all subcollections first, such as answers
  await admin.firestore().recursiveDelete(userRef, bulkWriter);
  await bulkWriter.flush();
};

export const useMagicLinkAndMigrateDataFromAnonUser = async (
  email: string,
  anonId: string,
  loggedInUserCampaignIds?: string[],
) => {
  const anonUser = await findAnonymousUserById(anonId);
  const emailHash = hashMail(email);
  const updateResult = await admin
    .firestore()
    .collection(collections.authenticatedUsers)
    .doc(emailHash)
    .set(
      {
        ...addTimestamps(true),
        linkUsed: true,
        campaignIds: anonUser
          ? [
              ...new Set([
                ...(loggedInUserCampaignIds || []),
                ...(anonUser.campaignIds || []),
              ]),
            ]
          : loggedInUserCampaignIds || [],
      },
      { merge: true },
    );

  if (!updateResult.writeTime) {
    throw new Error("Error occurred while updating magic link");
  }
};
