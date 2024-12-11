import { callCloudFunc, getEitherLoggedInOrAnonUser } from "./utils";
import {
  UpdateCampaign,
  NewCampaign,
} from "@pslifestyle/common/src/types/api/payloadTypes";
import { HttpsCallableResult } from "firebase/functions";

export const createCampaign = (
  campaign: NewCampaign,
): Promise<HttpsCallableResult<object>> =>
  callCloudFunc("saveCampaign", {
    version: 1,
    campaign,
    user: getEitherLoggedInOrAnonUser(),
  });

export const updateCampaign = (
  campaign: UpdateCampaign,
): Promise<HttpsCallableResult<object>> =>
  callCloudFunc("saveCampaign", {
    version: 1,
    campaign,
    user: getEitherLoggedInOrAnonUser(),
  });
