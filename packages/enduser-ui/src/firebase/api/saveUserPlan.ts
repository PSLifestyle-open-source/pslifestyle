import { callCloudFunc, getEitherLoggedInOrAnonUser } from "./utils";
import { NewPlan } from "@pslifestyle/common/src/types/planTypes";
import { HttpsCallableResult } from "firebase/functions";

export const saveUserPlan = (
  answerSetId: string,
  plan: NewPlan,
): Promise<HttpsCallableResult<object>> =>
  callCloudFunc("saveUserPlan", {
    version: 1,
    plan,
    answerSetId,
    user: getEitherLoggedInOrAnonUser(),
  });
