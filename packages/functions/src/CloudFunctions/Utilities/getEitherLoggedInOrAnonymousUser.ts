import { findAnonymousUserById } from "../Repository/anonymousUser";
import { findAuthenticatedUserByEmail } from "../Repository/authenticatedUsers";
import { AnonymousUser, AuthenticatedUser } from "../Types/user";
import { EitherLoggedInOrAnonUserId } from "./types";

export const getEitherLoggedInOrAnonymousUser = async (
  userId: EitherLoggedInOrAnonUserId,
): Promise<AuthenticatedUser | AnonymousUser | null> => {
  return "anonId" in userId
    ? await findAnonymousUserById(userId.anonId)
    : await findAuthenticatedUserByEmail(userId.email);
};
