import { callCloudFunc, getEitherLoggedInOrAnonUser } from "./utils";
import { Feedback } from "@pslifestyle/common/src/types/feedback";
import { HttpsCallableResult } from "firebase/functions";

export const saveUserFeedback = (
  answerSetId: string,
  feedback: Feedback,
): Promise<HttpsCallableResult<object>> =>
  callCloudFunc("saveUserFeedback", {
    version: 1,
    feedback,
    answerSetId,
    user: getEitherLoggedInOrAnonUser(),
  });
