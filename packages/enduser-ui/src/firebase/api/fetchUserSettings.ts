import { callCloudFunc, getLoggedInUser } from "./utils";
import { UserSettings } from "@pslifestyle/common/src/models/user";
import { HttpsCallableResult } from "firebase/functions";

export const fetchUserSettings = (
  targetUserEmail: string,
): Promise<HttpsCallableResult<UserSettings>> =>
  callCloudFunc("fetchUserSettings", {
    version: 1,
    user: getLoggedInUser(),
    targetUserEmail,
  });
