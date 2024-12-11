import { requestLinkPayloadSchema } from "../../../common/src/schemas/api-payload";
import { RequestLinkPayload } from "../../../common/src/types/api/payloadTypes";
import { UPDATE_APP_ERROR_MESSAGE } from "../constants";
import { EMULATE_EMAIL_SENDING } from "../currentEnv";
import { saveAscendUserData } from "./CompositeActions/saveAscendUserData";
import {
  createAuthenticatedUser,
  findAuthenticatedUserByEmail,
  updateMagicLink,
} from "./Repository/authenticatedUsers";
import EntityExistsError from "./Utilities/entityExistsError";
import { logError } from "./Utilities/logError";
import { sendMagicLink, writeMagicLinkToFile } from "./Utilities/sendMagicLink";
import { hashMail, randomString } from "./Utilities/utilities";
import * as functions from "firebase-functions";
import { info } from "firebase-functions/logger";

const maxAttempts = 3;

const assignMagicLinkToUser = async (
  email: string,
  anonId: string | null,
): Promise<string> => {
  if (!email) {
    throw new Error("Email is missing");
  }

  const magicLinkToken = randomString();
  const curDate = new Date();
  const curDateString = curDate.toISOString();

  await updateMagicLink(email, {
    magicLinkToken,
    linkUsed: false,
    linkCreatedAt: curDateString,
    loginFromAnonId: anonId,
  });

  return magicLinkToken;
};

async function v1Handler({
  anonId,
  ascend,
  email,
  languageCode,
}: RequestLinkPayload): Promise<void> {
  const hashedEmail = hashMail(email);
  info(`Request magic link email for user ${hashedEmail}`);

  try {
    if (!(await findAuthenticatedUserByEmail(email))) {
      info(`Creating user ${hashedEmail}`);
      await createAuthenticatedUser(email, []);
    }
  } catch (err) {
    if (!(err instanceof EntityExistsError)) {
      throw new functions.https.HttpsError(
        "internal",
        "Internal issue creating or finding user",
      );
    }
  }

  try {
    if (ascend) {
      info(`Preparing user ${hashedEmail} data for ascending`);
      await saveAscendUserData(email, ascend.answerSet, ascend.plan);
    }
  } catch (error) {
    logError("requestLinkV1", error, hashedEmail);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError(
      "internal",
      "Error when persisting user data for ascending",
    );
  }

  try {
    const magicLinkToken = await assignMagicLinkToUser(email, anonId);
    if (EMULATE_EMAIL_SENDING.equals(true).thenElse(true, false).value()) {
      writeMagicLinkToFile(email, magicLinkToken);
      return;
    } else {
      /**
       * Sending the link via email
       */
      for (let i = 0; i < maxAttempts; i++) {
        try {
          console.log("sendMagicLink running attempt: ", i + 1);
          if (await sendMagicLink(email, magicLinkToken, languageCode)) {
            console.log("Email sent");
            return;
          }
        } catch {
          logError(
            "requestLinkV1",
            new Error(`"Retrying sendMagicLink failed at attempt ${i + 1}`),
            hashedEmail,
          );
        }
      }
    }

    console.log("Not able to send the email with link");
    throw new functions.https.HttpsError(
      "internal",
      "Not able to send the email with link",
    );
  } catch (error) {
    logError("requestLinkV1", error, hashedEmail);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError(
      "internal",
      "Error when requesting link for user",
    );
  }
}

export async function handleRequestLink(
  params: RequestLinkPayload,
): Promise<void> {
  const payloadValidationOutput = requestLinkPayloadSchema.safeParse(params);

  if (!payloadValidationOutput.success) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Invalid or missing data",
      payloadValidationOutput,
    );
  }

  switch (params.version) {
    case 1:
      return v1Handler(params);
    default:
      throw new functions.https.HttpsError(
        "unimplemented",
        UPDATE_APP_ERROR_MESSAGE,
      );
  }
}
