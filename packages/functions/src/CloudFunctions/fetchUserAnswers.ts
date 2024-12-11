import { fetchUserAnswersPayloadSchema } from "../../../common/src/schemas/api-payload";
import { FetchUserAnswersPayload } from "../../../common/src/types/api/payloadTypes";
import { SavedAnswerSetResponse } from "../../../common/src/types/api/responseTypes";
import { UPDATE_APP_ERROR_MESSAGE } from "../constants";
import { fetchLatestUserAnswerSet } from "./Repository/answers";
import { logError } from "./Utilities/logError";
import { hashMail } from "./Utilities/utilities";
import { verifyToken } from "./Utilities/verifyToken";
import * as functions from "firebase-functions";
import { info } from "firebase-functions/logger";

const v1Handler = async ({
  user,
}: FetchUserAnswersPayload): Promise<SavedAnswerSetResponse> => {
  const { email, sessionToken } = user;
  const hashedEmail = hashMail(email);
  try {
    info(`Fetch answers for user ${hashedEmail}`);
    await verifyToken(email, sessionToken);

    const answerSet = await fetchLatestUserAnswerSet(user);
    if (!answerSet) {
      throw new functions.https.HttpsError(
        "not-found",
        "Existing answers not found for user",
      );
    }

    return {
      ordinaryAnswers: answerSet.ordinaryAnswers,
      answerSetId: answerSet.metadata.createdAt.toDate().toISOString(),
      categorizedFootprint: answerSet.categorizedFootprint,
      countryCode: answerSet.metadata.countryCode,
    };
  } catch (error: unknown) {
    logError("fetchUserAnswersV1", error, hashedEmail);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError(
      "internal",
      "Internal error fetching user responses",
    );
  }
};

export const handleFetchUserAnswers = async (
  params: FetchUserAnswersPayload,
): Promise<SavedAnswerSetResponse> => {
  const payloadValidationOutput =
    fetchUserAnswersPayloadSchema.safeParse(params);

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
