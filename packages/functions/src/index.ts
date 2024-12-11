// without this, deploy fails on a false positive "never used"
// eslint-disable-next-line no-unused-vars
import { handleCheckLink } from "./CloudFunctions/checkLink";
import { handleDeleteUser } from "./CloudFunctions/deleteUser";
import { handleFetchCampaignStatistics } from "./CloudFunctions/fetchCampaignStatistics";
import { handleFetchCampaigns } from "./CloudFunctions/fetchCampaigns";
import { handleFetchUserAnswers } from "./CloudFunctions/fetchUserAnswers";
import { handleFetchUserPlan } from "./CloudFunctions/fetchUserPlan";
import { handleFetchUserSettings } from "./CloudFunctions/fetchUserSettings";
import { handleInitializeUser } from "./CloudFunctions/initializeUser";
import { handleRequestLink } from "./CloudFunctions/requestLink";
import { handleSaveCampaign } from "./CloudFunctions/saveCampaign";
import { handleSaveUserAnswers } from "./CloudFunctions/saveUserAnswers";
import { handleSaveUserFeedback } from "./CloudFunctions/saveUserFeedback";
import { handleSaveUserPlan } from "./CloudFunctions/saveUserPlan";
import { handleSaveUserSettings } from "./CloudFunctions/saveUserSettings";
import { handleDailyAnonUserCleanup } from "./SchedulerFunctions/dailyAnonUserCleanup";
import { handleRemoveAscendUserNotAuthenticatedOldData } from "./SchedulerFunctions/removeAscendUserNotAuthenticatedOldData";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

const FUNCTION_DEPLOY_REGION = "europe-west1";
const RUNTIME_OPTS = {
  maxInstances: 20,
};

admin.initializeApp();
admin.firestore().settings({ ignoreUndefinedProperties: true });

export const requestLink = functions
  .region(FUNCTION_DEPLOY_REGION)
  .runWith({
    ...RUNTIME_OPTS,
    secrets: [
      "FM_ACCOUNT_ID",
      "FM_CLIENT_ID",
      "FM_CLIENT_SECRET",
      "MAIL_HASHKEY",
      "RSA_PRIVATE_KEY",
    ],
  })
  .https.onCall(handleRequestLink);

export const saveUserAnswers = functions
  .region(FUNCTION_DEPLOY_REGION)
  .runWith({ ...RUNTIME_OPTS, secrets: ["RSA_PUBLIC_KEY", "MAIL_HASHKEY"] })
  .https.onCall(handleSaveUserAnswers);

export const saveUserPlan = functions
  .region(FUNCTION_DEPLOY_REGION)
  .runWith({ ...RUNTIME_OPTS, secrets: ["RSA_PUBLIC_KEY", "MAIL_HASHKEY"] })
  .https.onCall(handleSaveUserPlan);

export const saveUserFeedback = functions
  .region(FUNCTION_DEPLOY_REGION)
  .runWith({ ...RUNTIME_OPTS, secrets: ["RSA_PUBLIC_KEY", "MAIL_HASHKEY"] })
  .https.onCall(handleSaveUserFeedback);

export const checkLink = functions
  .region(FUNCTION_DEPLOY_REGION)
  .runWith({ ...RUNTIME_OPTS, secrets: ["MAIL_HASHKEY", "RSA_PRIVATE_KEY"] })
  .https.onCall(handleCheckLink);

export const initializeUser = functions
  .region(FUNCTION_DEPLOY_REGION)
  .runWith({ ...RUNTIME_OPTS, secrets: ["MAIL_HASHKEY", "RSA_PUBLIC_KEY"] })
  .https.onCall(handleInitializeUser);

export const fetchUserAnswers = functions
  .region(FUNCTION_DEPLOY_REGION)
  .runWith({ ...RUNTIME_OPTS, secrets: ["MAIL_HASHKEY", "RSA_PUBLIC_KEY"] })
  .https.onCall(handleFetchUserAnswers);

export const fetchUserSettings = functions
  .region(FUNCTION_DEPLOY_REGION)
  .runWith({ ...RUNTIME_OPTS, secrets: ["MAIL_HASHKEY", "RSA_PUBLIC_KEY"] })
  .https.onCall(handleFetchUserSettings);

export const fetchUserPlan = functions
  .region(FUNCTION_DEPLOY_REGION)
  .runWith({ ...RUNTIME_OPTS, secrets: ["MAIL_HASHKEY", "RSA_PUBLIC_KEY"] })
  .https.onCall(handleFetchUserPlan);

export const fetchCampaigns = functions
  .region(FUNCTION_DEPLOY_REGION)
  .runWith({ ...RUNTIME_OPTS, secrets: ["MAIL_HASHKEY", "RSA_PUBLIC_KEY"] })
  .https.onCall(handleFetchCampaigns);

export const fetchCampaignStatistics = functions
  .region(FUNCTION_DEPLOY_REGION)
  .runWith({ ...RUNTIME_OPTS, secrets: ["MAIL_HASHKEY", "RSA_PUBLIC_KEY"] })
  .https.onCall(handleFetchCampaignStatistics);

export const deleteUser = functions
  .region(FUNCTION_DEPLOY_REGION)
  .runWith({ ...RUNTIME_OPTS, secrets: ["MAIL_HASHKEY", "RSA_PUBLIC_KEY"] })
  .https.onCall(handleDeleteUser);

export const saveCampaign = functions
  .region(FUNCTION_DEPLOY_REGION)
  .runWith({ ...RUNTIME_OPTS, secrets: ["MAIL_HASHKEY", "RSA_PUBLIC_KEY"] })
  .https.onCall(handleSaveCampaign);

export const saveUserSettings = functions
  .region(FUNCTION_DEPLOY_REGION)
  .runWith({ ...RUNTIME_OPTS, secrets: ["MAIL_HASHKEY", "RSA_PUBLIC_KEY"] })
  .https.onCall(handleSaveUserSettings);

export const dailyAnonUserCleanup = functions
  .region(FUNCTION_DEPLOY_REGION)
  .pubsub.schedule("0 0 * * *")
  .onRun(handleDailyAnonUserCleanup);

export const removeAscendUserNotAuthenticatedOldData = functions
  .region(FUNCTION_DEPLOY_REGION)
  .pubsub.schedule("0 0 * * *")
  .onRun(handleRemoveAscendUserNotAuthenticatedOldData);
