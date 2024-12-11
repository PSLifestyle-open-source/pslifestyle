import {
  checkLinkPayloadSchema,
  deleteUserPayloadSchema,
  updateCampaignSchema,
  fetchCampaignsPayloadSchema,
  fetchUserAnswersPayloadSchema,
  fetchUserPlanPayloadSchema,
  initializeUserPayloadSchema,
  newCampaignSchema,
  requestLinkPayloadSchema,
  saveCampaignPayloadSchema,
  saveUserAnswersPayloadSchema,
  saveUserFeedbackPayloadSchema,
  saveUserPlanPayloadSchema,
  fetchCampaignStatisticsPayloadSchema,
  fetchUserSettingsPayloadSchema,
  saveUserSettingsPayloadSchema,
} from "../../schemas/api-payload";
import { z } from "zod";

export interface LoggedInUser {
  email: string;
  sessionToken: string;
}

export interface AnonymousUser {
  anonId: string;
}

export type NewCampaign = z.infer<typeof newCampaignSchema>;

export type UpdateCampaign = z.infer<typeof updateCampaignSchema>;

export type EitherAnonOrLoggedInUser = LoggedInUser | AnonymousUser;

export type InitializeUserPayload = z.infer<typeof initializeUserPayloadSchema>;

export type RequestLinkPayload = z.infer<typeof requestLinkPayloadSchema>;

export type DeleteUserPayload = z.infer<typeof deleteUserPayloadSchema>;

export type CheckLinkPayload = z.infer<typeof checkLinkPayloadSchema>;

export type FetchUserAnswersPayload = z.infer<
  typeof fetchUserAnswersPayloadSchema
>;

export type FetchUserPlanPayload = z.infer<typeof fetchUserPlanPayloadSchema>;

export type FetchUserSettingsPayload = z.infer<
  typeof fetchUserSettingsPayloadSchema
>;

export type SaveUserPlanPayload = z.infer<typeof saveUserPlanPayloadSchema>;

export type SaveUserAnswersPayload = z.infer<
  typeof saveUserAnswersPayloadSchema
>;

export type SaveUserFeedbackPayload = z.infer<
  typeof saveUserFeedbackPayloadSchema
>;
export type SaveUserSettingsPayload = z.infer<
  typeof saveUserSettingsPayloadSchema
>;

export type SaveCampaignPayload = z.infer<typeof saveCampaignPayloadSchema>;

export type FetchCampaignsPayload = z.infer<typeof fetchCampaignsPayloadSchema>;

export type FetchCampaignStatisticsPayload = z.infer<
  typeof fetchCampaignStatisticsPayloadSchema
>;
