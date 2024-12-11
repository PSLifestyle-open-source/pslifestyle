import { deleteUserPayloadSchema } from "../../../common/src/schemas/api-payload";
import { DeleteUserPayload } from "../../../common/src/types/api/payloadTypes";
import { UPDATE_APP_ERROR_MESSAGE } from "../constants";
import { deleteAuthenticatedUser } from "./Repository/authenticatedUsers";
import { logError } from "./Utilities/logError";
import { hashMail } from "./Utilities/utilities";
import { verifyToken } from "./Utilities/verifyToken";
import * as functions from "firebase-functions";
import { info } from "firebase-functions/logger";

async function v1Handler({
  user: { email, sessionToken },
}: DeleteUserPayload): Promise<void> {
  const hashedEmail = hashMail(email);
  try {
    info(`Try to delete user ${hashedEmail}`);
    await verifyToken(email, sessionToken);

    await deleteAuthenticatedUser(email);
  } catch (error) {
    logError("deleteUserV1", error, hashedEmail);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError(
      "internal",
      "Internal error deleting user",
    );
  }
}

export async function handleDeleteUser(
  params: DeleteUserPayload,
): Promise<void> {
  const payloadValidationOutput = deleteUserPayloadSchema.safeParse(params);

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
