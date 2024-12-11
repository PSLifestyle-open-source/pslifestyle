import { tokenSignOptionsParamsType } from "./types";
import * as dotenv from "dotenv";
import { Timestamp } from "firebase-admin/firestore";
import { createHmac, randomBytes } from "node:crypto";

dotenv.config({ path: `${__dirname}/../../../.env.dev` });

export function randomString() {
  const size = 14;
  return randomBytes(size).toString("hex");
}

export function hashMail(email: string) {
  const hashKey = process.env.MAIL_HASHKEY?.replace(/"/g, "");
  if (!hashKey) throw Error("Mail hashkey not found");
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return createHmac("sha256", hashKey) // Change algorithm to preferred, do not use empty string
    .update(email.trim().toLowerCase())
    .digest("hex");
}

export function dateAgeInMinutes(linkCreationDate: Date) {
  const current = new Date();
  const linkCreatedAt = new Date(linkCreationDate);
  const difference = Math.abs(linkCreatedAt.getTime() - current.getTime());
  return difference / 1000 / 60;
}

export function constructURLEncodedBody(data: Record<string, string>): string {
  const formBody: string[] = [];
  for (const key of Object.keys(data)) {
    const encodedKey = encodeURIComponent(key);
    const encodedValue = encodeURIComponent(data[key]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  return formBody.join("&");
}

export function addSignOptionsForClientToken(): tokenSignOptionsParamsType {
  return {
    // Change these default values
    issuer: "default_issuer",
    subject: "default_subject",
    audience: "default_audience",
    expiresIn: "1h",
    algorithm: "RS256",
  };
}

export const addTimestamps = (isUpdate: boolean) => {
  const timestamp = Timestamp.fromDate(new Date());

  if (isUpdate) {
    return { updatedAt: timestamp };
  }
  return { createdAt: timestamp, updatedAt: timestamp };
};
