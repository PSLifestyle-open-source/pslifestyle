import { checkLinkPayloadSchema } from "../../../common/src/schemas/api-payload";
import { CheckLinkPayload } from "../../../common/src/types/api/payloadTypes";
import { CheckLinkResponseData } from "../../../common/src/types/api/responseTypes";
import { UPDATE_APP_ERROR_MESSAGE } from "../constants";
import { mergeAscendDataToUser } from "./CompositeActions/mergeAscendDataToUser";
import { upgradeUserDataToV1 } from "./CompositeActions/upgradeUserDataToV1";
import {
  findAuthenticatedUserByEmail,
  useMagicLinkAndMigrateDataFromAnonUser,
} from "./Repository/authenticatedUsers";
import { logError } from "./Utilities/logError";
import { addSignOptionsForClientToken, hashMail } from "./Utilities/utilities";
import { validateMagicLink } from "./Utilities/validateMagicLink";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { info } from "firebase-functions/logger";
import * as jwt from "jsonwebtoken";

const jwtRsaPvtSecret =
  process.env.RSA_PRIVATE_KEY?.replace(/"/g, "").replace(/\\n/g, "\n") ??
  "empty";

// Verifies a magic link token parsed from email link
async function v1Handler({
  email,
  magicLinkTokenFromLink,
}: CheckLinkPayload): Promise<CheckLinkResponseData> {
  const hashedEmail = hashMail(email);
  try {
    info(`Check magic link token for user ${hashedEmail}`);
    const user = await findAuthenticatedUserByEmail(email);

    if (!user) {
      throw new functions.https.HttpsError(
        "not-found",
        "User not found or magic link is invalid",
      );
    }

    const { loginFromAnonId, roles, campaignIds } = user;

    info(`Validate magic link for user ${hashedEmail}`);
    validateMagicLink(user, magicLinkTokenFromLink);

    await admin.firestore().runTransaction(async (t) => {
      info(`Merge ascended data for user ${hashedEmail}`);
      info(`Data merged for user ${hashedEmail}`);
      info(`Migrate data for user ${hashedEmail}`);
      await useMagicLinkAndMigrateDataFromAnonUser(
        email,
        loginFromAnonId,
        campaignIds,
      );
      await mergeAscendDataToUser(t, email);
      await upgradeUserDataToV1(t, user, email);
    });

    const signOptions = addSignOptionsForClientToken();
    const sessionToken = jwt.sign(
      { email, roles: roles || [] },
      jwtRsaPvtSecret,
      signOptions,
    );

    // Re-fetch the data in case user received them from merging
    const updatedUser = await findAuthenticatedUserByEmail(email);

    if (updatedUser?.latestPlanAt) {
      return { sessionToken, redirectDestination: "plan" };
    }

    if (updatedUser?.latestAnswerAt) {
      return { sessionToken, redirectDestination: "results" };
    }

    return { sessionToken, redirectDestination: "test" };
  } catch (error: unknown) {
    logError("handleCheckLinkV1", error, hashedEmail, {
      magicLinkTokenFromLink,
    });
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError(
      "internal",
      "Error happened when checking magic link",
    );
  }
}

export async function handleCheckLink(
  params: CheckLinkPayload,
): Promise<CheckLinkResponseData> {
  const payloadValidationOutput = checkLinkPayloadSchema.safeParse(params);

  if (!payloadValidationOutput.success) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Invalid or missing data",
      payloadValidationOutput,
    );
  }

  switch (params.version) {
    case 1:
      return await v1Handler(params);
    default:
      throw new functions.https.HttpsError(
        "unimplemented",
        UPDATE_APP_ERROR_MESSAGE,
      );
  }
}
