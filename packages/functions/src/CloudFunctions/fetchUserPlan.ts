import { fetchUserPlanPayloadSchema } from "../../../common/src/schemas/api-payload";
import { FetchUserPlanPayload } from "../../../common/src/types/api/payloadTypes";
import { CalculatedPlan } from "../../../common/src/types/planTypes";
import { UPDATE_APP_ERROR_MESSAGE } from "../constants";
import { fetchLatestUserAnswerSet } from "./Repository/answers";
import { fetchLatestUserPlan } from "./Repository/plans";
import { logError } from "./Utilities/logError";
import { hashMail } from "./Utilities/utilities";
import { verifyToken } from "./Utilities/verifyToken";
import * as functions from "firebase-functions";
import { info } from "firebase-functions/logger";

async function v1Handler({
  user: { email, sessionToken },
}: FetchUserPlanPayload): Promise<CalculatedPlan> {
  const hashedEmail = hashMail(email);
  try {
    info(`Fetch plan for user ${hashedEmail}`);
    await verifyToken(email, sessionToken);

    const answerSet = await fetchLatestUserAnswerSet({
      email: email,
    });
    if (!answerSet) {
      return {
        selectedActions: [],
        alreadyDoThisActions: [],
        skippedActions: [],
      };
    }

    const plan = await fetchLatestUserPlan(
      { email: email },
      answerSet.metadata.createdAt.toDate().toISOString(),
    );

    if (!plan) {
      return {
        selectedActions: [],
        alreadyDoThisActions: [],
        skippedActions: [],
      };
    }

    return {
      selectedActions: plan.selectedActions,
      alreadyDoThisActions: plan.alreadyDoThisActions,
      skippedActions: plan.skippedActions,
    };
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

export const handleFetchUserPlan = async (
  params: FetchUserPlanPayload,
): Promise<CalculatedPlan> => {
  const payloadValidationOutput = fetchUserPlanPayloadSchema.safeParse(params);

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
