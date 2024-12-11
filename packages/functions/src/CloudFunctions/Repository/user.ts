import { EitherLoggedInOrAnonUserId } from "../Utilities/types";
import { addTimestamps } from "../Utilities/utilities";
import { createUserRef } from "./utils";
import { Transaction } from "firebase-admin/firestore";

export const updateUser = async (
  transaction: Transaction,
  userId: EitherLoggedInOrAnonUserId,
  data: Record<string, unknown>,
): Promise<void> => {
  transaction.set(
    createUserRef(userId),
    {
      ...data,
      ...addTimestamps(true),
    },
    { merge: true },
  );
};
