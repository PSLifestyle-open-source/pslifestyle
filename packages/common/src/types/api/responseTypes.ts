import { UserRoles } from "../../models/user";
import { CalculatedAnswer, CategorizedFootprint } from "../questionnaireTypes";

export type CampaignRedirectDestination = "homepage" | "test";

export interface InitializeUserResponseData {
  userId: string | null;
  allowedCountries: string[];
  downgrade?: boolean;
  redirectDestination: CampaignRedirectDestination;
}

export interface CheckLinkResponseData {
  sessionToken: string;
  redirectDestination: "test" | "results" | "plan";
}

export interface SavedAnswerSetResponse {
  answerSetId: string;
  countryCode: string;
  ordinaryAnswers: CalculatedAnswer[];
  categorizedFootprint: CategorizedFootprint;
}

export interface CampaignStatisticsResponse {
  answersCount: number;
  plansCount: number;
  feedbacksCount: number;
}

export interface FetchUserSettingsResponse {
  roles: UserRoles;
}
