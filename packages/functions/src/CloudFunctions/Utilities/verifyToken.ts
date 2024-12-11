import { verifyTokenParamsType } from "./types";
import { addSignOptionsForClientToken } from "./utilities";
import * as functions from "firebase-functions";
import * as jwt from "jsonwebtoken";

const jwtRsaPublicSecret =
  process.env.RSA_PUBLIC_KEY?.replace(/\\n/g, "\n") ?? "empty";

export async function verifyToken(
  userEmail: string,
  sessionToken: string,
): Promise<void> {
  if (!userEmail || !sessionToken) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Invalid authentication credentials",
    );
  }

  return new Promise((resolve) => {
    jwt.verify(sessionToken, jwtRsaPublicSecret, (err, user) => {
      console.log("in jwt.verify", { err });
      if (err) {
        console.log("Client token verification error: ", err);
        let message = "Unknown client token verification error";
        if (err.name === "TokenExpiredError") {
          message = "Client token expired";
        }
        if (err.name === "JsonWebTokenError") {
          message = "Client token verification failed";
        }
        throw new functions.https.HttpsError("unauthenticated", message);
      }
      const { email, iss, aud, sub } = user as verifyTokenParamsType;
      const signOptions = addSignOptionsForClientToken();

      const errors = [];
      if (email !== userEmail) {
        errors.push("Email mismatch in function token");
      }
      if (iss !== signOptions.issuer) {
        errors.push("Issuer mismatch in function token");
      }
      if (aud !== signOptions.audience) {
        errors.push("Audience mismatch in function token");
      }
      if (sub !== signOptions.subject) {
        errors.push("Subject mismatch in function token");
      }

      if (errors.length > 0) {
        console.log(
          "We have errors! resolving that it cannot be verified! verification errors were",
          errors,
        );

        throw new functions.https.HttpsError(
          "unauthenticated",
          "Function token could not be verified",
        );
      }

      resolve(undefined);
    });
  });
}
