import { initializeUserPayloadSchema } from "../../../common/src/schemas/api-payload";
import {
  InitializeUserPayload,
  LoggedInUser,
} from "../../../common/src/types/api/payloadTypes";
import { InitializeUserResponseData } from "../../../common/src/types/api/responseTypes";
import { UPDATE_APP_ERROR_MESSAGE } from "../constants";
import { assignCampaignIdsToExistingUser } from "./CompositeActions/assignCampaignIdsToExistingUser";
import {
  createAnonymousUser,
  findAnonymousUserById,
} from "./Repository/anonymousUser";
import { findAuthenticatedUserByEmail } from "./Repository/authenticatedUsers";
import { campaignExists, getCampaignsDetails } from "./Repository/campaigns";
import { logError } from "./Utilities/logError";
import { hashMail } from "./Utilities/utilities";
import { verifyToken } from "./Utilities/verifyToken";
import * as functions from "firebase-functions";
import { info } from "firebase-functions/logger";

const v1InitializeNewAnonUser = async (
  logout: boolean,
  campaignId?: string | null,
): Promise<InitializeUserResponseData> => {
  info("Initialize new anonymous user");
  const userId = await createAnonymousUser(campaignId);

  if (logout) {
    return {
      userId,
      downgrade: true,
      ...(await getCampaignsDetails(campaignId ? [campaignId] : [])),
    };
  }

  return {
    userId,
    ...(await getCampaignsDetails(campaignId ? [campaignId] : [])),
  };
};

const v1LoggedInUserHandler = async (
  { email, sessionToken }: LoggedInUser,
  campaignId?: string | null,
): Promise<InitializeUserResponseData> => {
  const hashedEmail = hashMail(email);
  try {
    info(`Initialize logged in user ${hashedEmail}`);
    await verifyToken(email, sessionToken);

    const user = await findAuthenticatedUserByEmail(email);

    if (!user) {
      info(`Downgrade session for user ${hashedEmail}`);
      return v1InitializeNewAnonUser(true, campaignId);
    }

    if (campaignId && (await campaignExists(campaignId))) {
      info(`Assigning campaign ID to user ${hashedEmail}`);
      const campaignIds = Array.from(
        new Set([...(user.campaignIds || []), campaignId]),
      );
      await assignCampaignIdsToExistingUser({ email }, user, campaignIds);

      return {
        userId: null,
        ...(await getCampaignsDetails(campaignIds)),
      };
    }

    return {
      userId: null,
      ...(await getCampaignsDetails(user.campaignIds || [])),
    };
  } catch (error) {
    logError("requestLinkV1", error, hashedEmail);

    if (
      error instanceof functions.https.HttpsError &&
      error.code === "unauthenticated"
    ) {
      return v1InitializeNewAnonUser(true, campaignId);
    }

    throw new functions.https.HttpsError(
      "internal",
      "Failed to initialize logged in user",
    );
  }
};

const v1ExistingAnonUserHandler = async (
  { anonId }: { anonId: string },
  campaignId?: string | null,
): Promise<InitializeUserResponseData> => {
  try {
    info("Initialize existing anonymous in user");
    const user = await findAnonymousUserById(anonId);

    if (!user) {
      return v1InitializeNewAnonUser(true, campaignId);
    }

    if (campaignId && (await campaignExists(campaignId))) {
      info("Assigning campaign ID to anonymous user");
      const campaignIds = Array.from(
        new Set([...(user.campaignIds || []), campaignId]),
      );

      await assignCampaignIdsToExistingUser({ anonId }, user, campaignIds);

      return {
        userId: null,
        ...(await getCampaignsDetails(campaignIds)),
      };
    }

    return {
      userId: null,
      ...(await getCampaignsDetails(user.campaignIds)),
    };
  } catch (error) {
    logError("requestLinkV1", error, "anon");

    throw new functions.https.HttpsError(
      "internal",
      "Failed to initialize anonymous user",
    );
  }
};

const v1Handler = async ({
  campaignId,
  user,
}: InitializeUserPayload): Promise<InitializeUserResponseData> => {
  if (!user) {
    return v1InitializeNewAnonUser(false, campaignId);
  }

  if ("anonId" in user) {
    return v1ExistingAnonUserHandler({ anonId: user.anonId }, campaignId);
  }

  return v1LoggedInUserHandler(
    { email: user.email, sessionToken: user.sessionToken },
    campaignId,
  );
};

export const handleInitializeUser = async (
  params: InitializeUserPayload,
): Promise<InitializeUserResponseData> => {
  const payloadValidationOutput = initializeUserPayloadSchema.safeParse(params);

  if (!payloadValidationOutput.success) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Invalid or missing data",
      payloadValidationOutput,
    );
  }

  switch (params.version) {
    case 1:
      try {
        return v1Handler(params);
      } catch (error: unknown) {
        logError(
          "initializeUserV1",
          error,
          params.user && "email" in params.user
            ? hashMail(params.user.email)
            : params.user?.anonId || "new",
        );

        throw error;
      }
    default:
      throw new functions.https.HttpsError(
        "unimplemented",
        UPDATE_APP_ERROR_MESSAGE,
      );
  }
};
