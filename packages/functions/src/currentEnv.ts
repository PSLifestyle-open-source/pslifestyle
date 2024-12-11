import { defineBoolean, defineString } from "firebase-functions/params";

export const CURRENT_ENV = defineString("CURRENT_ENV", {
  default: "dev",
}); // 'dev'  or 'prod'

export const EMULATE_EMAIL_SENDING = defineBoolean("EMULATE_EMAIL_SENDING", {
  default: false,
}); // true  or false
