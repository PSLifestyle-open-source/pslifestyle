import {
  CampaignManagerRole,
  campaignManagerRoleName,
} from "../../../common/src/models/user";
import { fetchCampaignsPayloadSchema } from "../../../common/src/schemas/api-payload";
import { FetchCampaignsPayload } from "../../../common/src/types/api/payloadTypes";
import { Campaign } from "../../../common/src/types/campaign";
import { UPDATE_APP_ERROR_MESSAGE } from "../constants";
import { findAuthenticatedUserByEmail } from "./Repository/authenticatedUsers";
import { findCampaignsList } from "./Repository/campaigns";
import { logError } from "./Utilities/logError";
import { hashMail } from "./Utilities/utilities";
import { verifyToken } from "./Utilities/verifyToken";
import * as functions from "firebase-functions";

async function v1Handler({
  user: { email, sessionToken },
}: FetchCampaignsPayload): Promise<Campaign[]> {
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

    return await findCampaignsList(campaignManagerOptions.countries);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logError("fetchCampaignsV1", error, hashedEmail);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError(
      "internal",
      "Error fetching campaigns",
    );
  }
}

export const handleFetchCampaigns = async (
  params: FetchCampaignsPayload,
): Promise<Campaign[]> => {
  const payloadValidationOutput = fetchCampaignsPayloadSchema.safeParse(params);

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
