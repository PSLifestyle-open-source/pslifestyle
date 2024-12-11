import { callCloudFunc, getLoggedInUser } from "./utils";
import { SavedAnswerSetResponse } from "@pslifestyle/common/src/types/api/responseTypes";
import { HttpsCallableResult } from "firebase/functions";

export const fetchUserAnswers = (): Promise<
  HttpsCallableResult<SavedAnswerSetResponse>
> =>
  callCloudFunc("fetchUserAnswers", {
    version: 1,
    user: getLoggedInUser(),
  });
