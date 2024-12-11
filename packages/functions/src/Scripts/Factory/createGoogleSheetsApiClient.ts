/* eslint-disable camelcase */
import { CredentialBody } from "google-auth-library";
import { google, sheets_v4 } from "googleapis";

import Sheets = sheets_v4.Sheets;

const createGoogleSheetsApiClient = (credentials: CredentialBody): Sheets => {
  const clientEmail = credentials.client_email;
  const privateKey = credentials.private_key;

  const client = new google.auth.JWT(clientEmail, undefined, privateKey, [
    "https://www.googleapis.com/auth/spreadsheets.readonly",
  ]);

  return google.sheets({ version: "v4", auth: client });
};

export default createGoogleSheetsApiClient;
