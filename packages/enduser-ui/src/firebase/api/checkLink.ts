import { callCloudFunc } from "./utils";
import { CheckLinkResponseData } from "@pslifestyle/common/src/types/api/responseTypes";
import { HttpsCallableResult } from "firebase/functions";

export function checkLink(
  email: string,
  magicLinkTokenFromLink: string,
): Promise<HttpsCallableResult<CheckLinkResponseData>> {
  return callCloudFunc("checkLink", {
    email,
    magicLinkTokenFromLink,
    version: 1,
  });
}
