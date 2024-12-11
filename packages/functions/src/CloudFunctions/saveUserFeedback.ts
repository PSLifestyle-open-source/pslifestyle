import { saveUserFeedbackPayloadSchema } from "../../../common/src/schemas/api-payload";
import { SaveUserFeedbackPayload } from "../../../common/src/types/api/payloadTypes";
import { collections, UPDATE_APP_ERROR_MESSAGE } from "../constants";
import { saveFeedback } from "./CompositeActions/saveFeedback";
import { createUserRef } from "./Repository/utils";
import { SavedAnswerSet } from "./Types/answers";
import { logError } from "./Utilities/logError";
import { hashMail } from "./Utilities/utilities";
import { verifyToken } from "./Utilities/verifyToken";
import * as admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import { info } from "firebase-functions/logger";

// Saves user's answers in database
async function v1Handler({
  user,
  feedback,
  answerSetId,
}: SaveUserFeedbackPayload): Promise<object> {
  const userId = "email" in user ? hashMail(user.email) : user.anonId;

  try {
    info(`Start saving feedback for user ${userId}`);
    if ("email" in user) {
      await verifyToken(user.email, user.sessionToken);
    }

    const answerSetResponse = await createUserRef(user)
      .collection(collections.answers)
      .doc(answerSetId)
      .get();

    const answerSet = answerSetResponse.data() as SavedAnswerSet | undefined;

    if (!answerSet) {
      throw new functions.https.HttpsError(
        "not-found",
        "Answer set not found to create feedback for",
      );
    }

    info(`Persist feedback for user ${userId}`);
    await admin.firestore().runTransaction(async (t) => {
      await saveFeedback(t, user, answerSetId, feedback.selectedOptions, {
        createdAt: Timestamp.fromDate(new Date()),
        campaignIds: answerSet.metadata.campaignIds || [],
      });
    });

    return {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logError("saveUserAnswersV1", error, userId);

    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError("internal", "Error saving user plan");
  }
}

export const handleSaveUserFeedback = async (
  params: SaveUserFeedbackPayload,
): Promise<object> => {
  const payloadValidationOutput =
    saveUserFeedbackPayloadSchema.safeParse(params);

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
