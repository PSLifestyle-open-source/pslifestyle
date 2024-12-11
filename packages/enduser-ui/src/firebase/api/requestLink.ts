import { callCloudFunc } from "./utils";
import { InitializeUserResponseData } from "@pslifestyle/common/src/types/api/responseTypes";
import { NewPlan } from "@pslifestyle/common/src/types/planTypes";
import { NewAnswerSet } from "@pslifestyle/common/src/types/questionnaireTypes";
import { HttpsCallableResult } from "firebase/functions";

export const requestMagicLinkEmail = (
  email: string,
  anonId: string,
  languageCode: string,
): Promise<HttpsCallableResult<InitializeUserResponseData>> =>
  callCloudFunc("requestLink", {
    email,
    anonId,
    languageCode,
    version: 1,
  });

export const requestMagicLinkEmailAndAscendUser = (
  email: string,
  anonId: string,
  languageCode: string,
  answerSet: NewAnswerSet,
  plan: NewPlan,
): Promise<HttpsCallableResult<InitializeUserResponseData>> =>
  callCloudFunc("requestLink", {
    email,
    anonId,
    languageCode,
    ascend: {
      answerSet,
      plan,
    },
    version: 1,
  });
