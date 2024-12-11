import { callCloudFunc } from "./utils";
import { InitializeUserResponseData } from "@pslifestyle/common/src/types/api/responseTypes";
import { HttpsCallableResult } from "firebase/functions";

export const requestNewAnonymousUserInitialization = (
  campaignId?: string,
): Promise<HttpsCallableResult<InitializeUserResponseData>> =>
  callCloudFunc("initializeUser", {
    campaignId,
    version: 1,
  });

export const requestExistingAnonymousUserInitialization = (
  anonId: string,
  campaignId?: string,
): Promise<HttpsCallableResult<InitializeUserResponseData>> =>
  callCloudFunc("initializeUser", {
    user: { anonId },
    campaignId,
    version: 1,
  });

export const requestLoggedInUserInitialization = (
  email: string,
  sessionToken: string,
  campaignId?: string,
): Promise<HttpsCallableResult<InitializeUserResponseData>> =>
  callCloudFunc("initializeUser", {
    user: { email, sessionToken },
    campaignId,
    version: 1,
  });
