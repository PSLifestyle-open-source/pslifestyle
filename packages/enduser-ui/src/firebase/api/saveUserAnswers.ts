import { callCloudFunc, getEitherLoggedInOrAnonUser } from "./utils";
import { SavedAnswerSetResponse } from "@pslifestyle/common/src/types/api/responseTypes";
import { NewAnswerSet } from "@pslifestyle/common/src/types/questionnaireTypes";
import { HttpsCallableResult } from "firebase/functions";

export const saveUserAnswers = (
  answerSet: NewAnswerSet,
): Promise<HttpsCallableResult<SavedAnswerSetResponse>> =>
  callCloudFunc("saveUserAnswers", {
    version: 1,
    answerSet,
    user: getEitherLoggedInOrAnonUser(),
  });
