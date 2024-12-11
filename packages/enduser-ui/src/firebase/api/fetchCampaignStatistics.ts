import { callCloudFunc, getLoggedInUser } from "./utils";
import { CampaignStatisticsResponse } from "@pslifestyle/common/src/types/api/responseTypes";
import { HttpsCallableResult } from "firebase/functions";

export const fetchCampaignStatistics = (
  campaignId: string,
): Promise<HttpsCallableResult<CampaignStatisticsResponse>> =>
  callCloudFunc("fetchCampaignStatistics", {
    version: 1,
    user: getLoggedInUser(),
    campaignId,
  });
