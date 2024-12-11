import { saveUserPlanPayloadSchema } from "../../../common/src/schemas/api-payload";
import { SaveUserPlanPayload } from "../../../common/src/types/api/payloadTypes";
import { collections, UPDATE_APP_ERROR_MESSAGE } from "../constants";
import { savePlan } from "./CompositeActions/savePlan";
import { createUserRef } from "./Repository/utils";
import { SavedAnswerSet } from "./Types/answers";
import { calculatePlan } from "./Utilities/calculatePlan";
import { logError } from "./Utilities/logError";
import { hashMail } from "./Utilities/utilities";
import { verifyToken } from "./Utilities/verifyToken";
import * as admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import { info } from "firebase-functions/logger";

// Saves user's answers in database
async function v1Handler({
  answerSetId,
  user,
  plan,
}: SaveUserPlanPayload): Promise<object> {
  const userId = "email" in user ? hashMail(user.email) : user.anonId;

  try {
    info(`Start saving plan for user ${userId}`);
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
        "Answer set not found to create plan for",
      );
    }

    info(`Calculating plan for user ${userId}`);
    const calculatedPlan = await calculatePlan(answerSet, user, plan);
    info(`Persist plan for user ${userId}`);
    await admin.firestore().runTransaction(async (t) => {
      await savePlan(t, user, answerSetId, calculatedPlan, {
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

export const handleSaveUserPlan = async (
  params: SaveUserPlanPayload,
): Promise<object> => {
  const payloadValidationOutput = saveUserPlanPayloadSchema.safeParse(params);

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
