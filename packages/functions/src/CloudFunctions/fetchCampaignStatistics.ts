import {
  CampaignManagerRole,
  campaignManagerRoleName,
} from "../../../common/src/models/user";
import { fetchCampaignStatisticsPayloadSchema } from "../../../common/src/schemas/api-payload";
import { FetchCampaignStatisticsPayload } from "../../../common/src/types/api/payloadTypes";
import { CampaignStatisticsResponse } from "../../../common/src/types/api/responseTypes";
import { collections, UPDATE_APP_ERROR_MESSAGE } from "../constants";
import { findAuthenticatedUserByEmail } from "./Repository/authenticatedUsers";
import { findCampaign } from "./Repository/campaigns";
import { logError } from "./Utilities/logError";
import { hashMail } from "./Utilities/utilities";
import { validateCampaignAccess } from "./Utilities/validateCampaignAccess";
import { verifyToken } from "./Utilities/verifyToken";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

async function v1Handler({
  user: { email, sessionToken },
  campaignId,
}: FetchCampaignStatisticsPayload): Promise<CampaignStatisticsResponse> {
  const hashedEmail = hashMail(email);
  try {
    await verifyToken(email, sessionToken);

    const user = await findAuthenticatedUserByEmail(email);

    const campaignManagerOptions = (
      user?.roles.find(
        (role) => role.name === campaignManagerRoleName,
      ) as CampaignManagerRole
    )?.options;

    if (!user || !campaignManagerOptions) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "User does not have campaign manager role",
      );
    }

    const existingCampaign = await findCampaign(campaignId);

    if (!existingCampaign) {
      throw new functions.https.HttpsError(
        "not-found",
        `Campaign with ID ${campaignId} not found`,
      );
    }
    validateCampaignAccess(campaignManagerOptions, existingCampaign);

    const answersCountQuery = await admin
      .firestore()
      .collectionGroup(collections.answers)
      .where("metadata.campaignIds", "array-contains", campaignId)
      .count()
      .get();
    const plansCount = await admin
      .firestore()
      .collectionGroup(collections.plans)
      .where("metadata.campaignIds", "array-contains", campaignId)
      .count()
      .get();
    const feedbacksCount = await admin
      .firestore()
      .collectionGroup(collections.userFeedback)
      .where("metadata.campaignIds", "array-contains", campaignId)
      .count()
      .get();

    return {
      answersCount: answersCountQuery.data().count,
      plansCount: plansCount.data().count,
      feedbacksCount: feedbacksCount.data().count,
    };
  } catch (error: unknown) {
    logError("fetchCampaignStatisticsV1", error, hashedEmail);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError(
      "internal",
      "Error fetching campaigns",
    );
  }
}

export const handleFetchCampaignStatistics = async (
  params: FetchCampaignStatisticsPayload,
): Promise<CampaignStatisticsResponse> => {
  const payloadValidationOutput =
    fetchCampaignStatisticsPayloadSchema.safeParse(params);

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
