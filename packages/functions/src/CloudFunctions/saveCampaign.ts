import {
  CampaignManagerRole,
  campaignManagerRoleName,
} from "../../../common/src/models/user";
import { saveCampaignPayloadSchema } from "../../../common/src/schemas/api-payload";
import {
  UpdateCampaign,
  NewCampaign,
  SaveCampaignPayload,
} from "../../../common/src/types/api/payloadTypes";
import { UPDATE_APP_ERROR_MESSAGE } from "../constants";
import { findAuthenticatedUserByEmail } from "./Repository/authenticatedUsers";
import {
  createCampaign,
  findCampaign,
  updateCampaign,
} from "./Repository/campaigns";
import { logError } from "./Utilities/logError";
import { hashMail } from "./Utilities/utilities";
import { validateCampaignAccess } from "./Utilities/validateCampaignAccess";
import { verifyToken } from "./Utilities/verifyToken";
import * as functions from "firebase-functions";
import { info } from "firebase-functions/logger";

const handleNewCampaign = async (
  campaignManagerOptions: CampaignManagerRole["options"],
  campaign: NewCampaign,
): Promise<void> => {
  info("Start creating campaign", campaign);

  validateCampaignAccess(campaignManagerOptions, campaign);

  await createCampaign(campaign);
  info("Campaign created", campaign);
};
const handleUpdateCampaign = async (
  campaignManagerOptions: CampaignManagerRole["options"],
  campaign: UpdateCampaign,
): Promise<void> => {
  info("Start updating campaign", campaign);
  const existingCampaign = await findCampaign(campaign.id);

  if (!existingCampaign) {
    throw new functions.https.HttpsError(
      "not-found",
      `Campaign with ID ${campaign.id} not found`,
    );
  }

  validateCampaignAccess(campaignManagerOptions, existingCampaign);

  await updateCampaign(campaign);
  info("Campaign updated", campaign);
};

// Saves user's answers in database
async function v1Handler({
  user: { email, sessionToken },
  campaign,
}: SaveCampaignPayload): Promise<object> {
  try {
    info("Start processing campaign", campaign);
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

    if ("id" in campaign) {
      await handleUpdateCampaign(campaignManagerOptions, campaign);
    } else {
      await handleNewCampaign(campaignManagerOptions, campaign);
    }

    return {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logError("saveCampaignV1", error, hashMail(email));
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError("internal", "Error saving user plan");
  }
}

export const handleSaveCampaign = async (
  params: SaveCampaignPayload,
): Promise<object> => {
  const payloadValidationOutput = saveCampaignPayloadSchema.safeParse(params);

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
