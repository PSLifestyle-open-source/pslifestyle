import { callCloudFunc } from "./utils";
import { HttpsCallableResult } from "firebase/functions";

export function deleteUser(
  email: string,
  sessionToken: string,
): Promise<HttpsCallableResult> {
  return callCloudFunc("deleteUser", {
    version: 1,
    user: { email, sessionToken },
  });
}
