import { UserSettings } from "../../../../common/src/models/user";
import { Timestamp } from "firebase-admin/firestore";

export interface AuthFields {
  magicLinkToken: string;
  linkCreatedAt: string;
  linkUsed: boolean;
  loginFromAnonId: string | null;
}

export interface AnonymousUser {
  id: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  latestAnswerAt: Timestamp | null;
  latestPlanAt?: Timestamp;
  latestFeedbackAt?: Timestamp;
  latestDemographicAt?: Timestamp;
  campaignIds?: string[];
}

export interface AuthenticatedUser extends AnonymousUser, UserSettings {
  magicLinkToken: string;
  linkCreatedAt: string;
  linkUsed: boolean;
  loginFromAnonId: string;
}
