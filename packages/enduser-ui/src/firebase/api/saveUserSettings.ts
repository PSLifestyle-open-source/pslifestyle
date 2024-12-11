import { callCloudFunc, getLoggedInUser } from "./utils";
import { UserSettings } from "@pslifestyle/common/src/models/user";
import { HttpsCallableResult } from "firebase/functions";

export const saveUserSettings = (
  targetUserEmail: string,
  userSettings: UserSettings,
): Promise<HttpsCallableResult<object>> =>
  callCloudFunc("saveUserSettings", {
    version: 1,
    targetUserEmail,
    userSettings,
    user: getLoggedInUser(),
  });
