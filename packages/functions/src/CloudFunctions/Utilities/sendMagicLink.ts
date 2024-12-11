import { CURRENT_ENV } from "../../currentEnv";
import { magicLinkRequestBody } from "./magicLinkRequestBody";
import { constructURLEncodedBody } from "./utilities";
import axios from "axios";
import * as functions from "firebase-functions";
import { writeFileSync } from "fs";

const accountId = process.env.FM_ACCOUNT_ID?.replace(/"/g, "") || "empty";
const clientId = process.env.FM_CLIENT_ID?.replace(/"/g, "") || "empty";
const clientSecret = process.env.FM_CLIENT_SECRET?.replace(/"/g, "") || "empty";

// From: https://flowmailer.com/academy/fmacademy/rest-api-guidelines
// This function will be called from cloud task through a queue.

const appURL = "https://your-app-url-here";
console.log("using appURL =", appURL, "because CURRENT_ENV =", CURRENT_ENV);

async function requestAccessToken() {
  const requestBody: Record<string, string> = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
    scope: "api", // optional
  };

  try {
    const response = await axios.post(
      "https://login.flowmailer.net/oauth/token",
      constructURLEncodedBody(requestBody),
      {
        headers: {
          Accept: "application/vnd.flowmailer.v1.12+json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    if (response.status === 200) {
      // The request was successful,
      // Access token can be found in the JSON encoded response
      // Token valid for 1 minute
      console.log("FlowMailer access token ok!");
      return response.data.access_token;
    }
    console.log("FlowMailer access token retrieve error", response);
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Authentication error, FlowMailer access token retrieve error",
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response.status === 400) {
      // If bad request, return ok so the queue will not try again
      console.log(
        "FM Access token retrieve failed. Error description",
        error.response.data,
      );
      throw new functions.https.HttpsError(
        "ok",
        "Bad request for FM access token",
      );
    }
    // Otherwise let the queue try again by throwing other than 400
    console.log("There is an error: ", error);
    throw new functions.https.HttpsError("internal", "Authentication error");
  }
}

export function writeMagicLinkToFile(email: string, magicLinkToken: string) {
  const magicLink = `http://localhost:3000/checklogin?=${magicLinkToken}`;
  const tokenFile = `/tmp/${email}`;
  console.log(`Writing magic link ${magicLink} to ${tokenFile}`);
  writeFileSync(tokenFile, magicLink, {});
}

export async function sendMagicLink(
  email: string,
  magicLinkToken: string,
  languageCode: string,
): Promise<boolean> {
  const requestBody = magicLinkRequestBody(
    email,
    languageCode,
    appURL,
    magicLinkToken,
  );
  const url = `https://api.flowmailer.net/${accountId}/messages/submit`;

  try {
    // get access token before sending email
    const token = await requestAccessToken();
    const response = await axios.post(url, JSON.stringify(requestBody), {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.flowmailer.v1.12+json;charset=UTF-8",
        "Content-Type": "application/vnd.flowmailer.v1.12+json;charset=UTF-8",
      },
    });
    if (response.status === 201) {
      console.log("Magic link successfully sent");
      return true;
    }
    console.log("Email send error", response);
    return false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log(err.response.data.allErrors);
    return false;
  }
}
