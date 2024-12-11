import { saveUserAnswersPayloadSchema } from "../../../common/src/schemas/api-payload";
import { SaveUserAnswersPayload } from "../../../common/src/types/api/payloadTypes";
import { SavedAnswerSetResponse } from "../../../common/src/types/api/responseTypes";
import { UPDATE_APP_ERROR_MESSAGE } from "../constants";
import { saveAnswerSet } from "./CompositeActions/saveAnswerSet";
import { getEitherLoggedInOrAnonymousUser } from "./Utilities/getEitherLoggedInOrAnonymousUser";
import { logError } from "./Utilities/logError";
import { prepareCalculatedAnswerSet } from "./Utilities/prepareCalculatedAnswerSet";
import { hashMail } from "./Utilities/utilities";
import { verifyToken } from "./Utilities/verifyToken";
import * as admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import { info } from "firebase-functions/logger";

async function v1Handler({
  user,
  answerSet,
}: SaveUserAnswersPayload): Promise<SavedAnswerSetResponse> {
  const userId = "email" in user ? hashMail(user.email) : user.anonId;

  try {
    info(`Start saving answers for user ${userId}`);
    if ("email" in user) {
      await verifyToken(user.email, user.sessionToken);
    }

    info(`Calculating answers for user ${userId}`);
    const userEntity = await getEitherLoggedInOrAnonymousUser(user);
    const calculatedAnswerSet = await prepareCalculatedAnswerSet(answerSet);
    const answerSetMetadata = {
      createdAt: Timestamp.fromDate(new Date()),
      campaignIds: userEntity?.campaignIds || [],
      countryCode: answerSet.metadata.countryCode,
      constantsVersion: answerSet.metadata.constantsVersion,
      questionnaireVersion: answerSet.metadata.questionnaireVersion,
    };

    info(`Persist answers for user ${userId}`);
    await admin.firestore().runTransaction(async (t) => {
      await saveAnswerSet(t, user, calculatedAnswerSet, answerSetMetadata);
    });

    return {
      answerSetId: answerSetMetadata.createdAt.toDate().toISOString(),
      countryCode: answerSetMetadata.countryCode,
      ordinaryAnswers: calculatedAnswerSet.ordinaryAnswers,
      categorizedFootprint: calculatedAnswerSet.categorizedFootprint,
    };
  } catch (error: unknown) {
    logError("saveUserAnswersV1", error, userId);

    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError(
      "internal",
      "Internal error saving user response",
    );
  }
}

export const handleSaveUserAnswers = async (
  params: SaveUserAnswersPayload,
): Promise<SavedAnswerSetResponse> => {
  const payloadValidationOutput =
    saveUserAnswersPayloadSchema.safeParse(params);

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
