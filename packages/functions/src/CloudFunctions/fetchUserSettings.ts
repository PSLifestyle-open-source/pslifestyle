import { fetchUserSettingsPayloadSchema } from "../../../common/src/schemas/api-payload";
import { FetchUserSettingsPayload } from "../../../common/src/types/api/payloadTypes";
import { FetchUserSettingsResponse } from "../../../common/src/types/api/responseTypes";
import { UPDATE_APP_ERROR_MESSAGE } from "../constants";
import { findAuthenticatedUserByEmail } from "./Repository/authenticatedUsers";
import { logError } from "./Utilities/logError";
import { hashMail } from "./Utilities/utilities";
import { verifyToken } from "./Utilities/verifyToken";
import * as functions from "firebase-functions";
import { info } from "firebase-functions/logger";

async function v1Handler({
  user: { email, sessionToken },
  targetUserEmail,
}: FetchUserSettingsPayload): Promise<FetchUserSettingsResponse> {
  const hashedEmail = hashMail(email);
  try {
    info(`Fetch plan for user ${hashedEmail}`);
    await verifyToken(email, sessionToken);
    const user = await findAuthenticatedUserByEmail(targetUserEmail);

    if (!user) {
      throw new functions.https.HttpsError(
        "not-found",
        "User with provided email does not exist",
      );
    }

    return { roles: user.roles };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logError("fetchUserPlanV1", error, hashedEmail);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError(
      "internal",
      "Error fetching user plan",
    );
  }
}

export const handleFetchUserSettings = async (
  params: FetchUserSettingsPayload,
): Promise<FetchUserSettingsResponse> => {
  const payloadValidationOutput =
    fetchUserSettingsPayloadSchema.safeParse(params);

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
};
