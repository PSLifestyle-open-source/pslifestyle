import { saveUserSettingsPayloadSchema } from "../../../common/src/schemas/api-payload";
import { SaveUserSettingsPayload } from "../../../common/src/types/api/payloadTypes";
import { UPDATE_APP_ERROR_MESSAGE } from "../constants";
import { updateUserSettings } from "./Repository/authenticatedUsers";
import { logError } from "./Utilities/logError";
import { hashMail } from "./Utilities/utilities";
import { verifyToken } from "./Utilities/verifyToken";
import * as functions from "firebase-functions";
import { info } from "firebase-functions/logger";

// Saves user's answers in database
async function v1Handler({
  user,
  targetUserEmail,
  userSettings,
}: SaveUserSettingsPayload): Promise<object> {
  const userId = hashMail(targetUserEmail);
  try {
    if ("email" in user) {
      await verifyToken(user.email, user.sessionToken);
    }

    await updateUserSettings(targetUserEmail, userSettings);

    info(`Settings saved for user ${userId}`);

    return {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logError("saveUserSettingsV1", error, userId);

    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError(
      "internal",
      "Error saving user settings",
    );
  }
}

export const handleSaveUserSettings = async (
  params: SaveUserSettingsPayload,
): Promise<object> => {
  const payloadValidationOutput =
    saveUserSettingsPayloadSchema.safeParse(params);

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
