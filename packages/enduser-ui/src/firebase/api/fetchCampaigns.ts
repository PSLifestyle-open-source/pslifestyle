import { callCloudFunc, getLoggedInUser } from "./utils";
import { Campaign } from "@pslifestyle/common/src/types/campaign";
import { HttpsCallableResult } from "firebase/functions";

export const fetchCampaigns = (): Promise<HttpsCallableResult<Campaign[]>> =>
  callCloudFunc("fetchCampaigns", {
    version: 1,
    user: getLoggedInUser(),
  });
