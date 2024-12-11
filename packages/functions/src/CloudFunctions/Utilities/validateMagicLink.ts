import { AuthenticatedUser } from "../Types/user";
import { dateAgeInMinutes } from "./utilities";
import * as functions from "firebase-functions";

export const validateMagicLink = (
  user: AuthenticatedUser,
  receivedMagicLinkToken: string,
): void => {
  const { magicLinkToken, linkUsed, linkCreatedAt } = user;
  const linkAge = dateAgeInMinutes(new Date(linkCreatedAt));

  const errors = [];
  if (magicLinkToken !== receivedMagicLinkToken) {
    errors.push("Magic link tokens mismatch");
  }
  if (linkUsed) {
    errors.push("Magic link has already been used");
  }
  if (linkAge > 15) {
    errors.push("Magic link expired");
  }

  if (errors.length) {
    console.log("Ran into magic link verification errors for: ", errors);
    throw new functions.https.HttpsError(
      "permission-denied",
      "User not found or magic link is invalid",
    );
  }
};
