import { FunctionsErrorCode } from "firebase/functions";

export const constants = /^\S+@\S+\.\S+$/; // tests for non-whitespace, @, non-whitespace, a dot and non-whitespace

export const actionResultUrls = {
  userDeleted: "/#userDeleted",
};

const UNAUTHENTICATED: FunctionsErrorCode = "functions/unauthenticated";
const NOT_FOUND: FunctionsErrorCode = "functions/not-found";

export const FunctionsErrorCodes = { NOT_FOUND, UNAUTHENTICATED };
