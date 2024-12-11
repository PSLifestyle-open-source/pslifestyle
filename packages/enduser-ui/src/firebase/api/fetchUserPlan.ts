import { callCloudFunc, getLoggedInUser } from "./utils";
import { CalculatedPlan } from "@pslifestyle/common/src/types/planTypes";
import { HttpsCallableResult } from "firebase/functions";

export const fetchUserPlan = (): Promise<HttpsCallableResult<CalculatedPlan>> =>
  callCloudFunc("fetchUserPlan", {
    version: 1,
    user: getLoggedInUser(),
  });
