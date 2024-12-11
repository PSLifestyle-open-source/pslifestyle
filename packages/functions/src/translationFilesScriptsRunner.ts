import { createGoogleSheetsApiClient } from "./Scripts/Factory";
import createFirebaseApp from "./Scripts/Factory/createFirebaseApp";
import { createGoogleStorageClient } from "./Scripts/Factory/createGoogleStorageClient";
import { createTranslationDiskFileWriter } from "./Scripts/Factory/createTranslationDiskFileWriter";
import { createTranslationStorageFileWriter } from "./Scripts/Factory/createTranslationStorageFileWriter";
import { actionsAndQuestionsTranslations } from "./Scripts/GenerateTranslations/actionsAndQuestionsTranslations";
import { emailTranslations } from "./Scripts/GenerateTranslations/emailTranslations";
import { feedbackCardTranslations } from "./Scripts/GenerateTranslations/feedbackCardTranslations";
import { locizeTranslations } from "./Scripts/GenerateTranslations/locizeTranslations";
import { RawServiceAccountType } from "./rawServiceAccountType";
import * as dotenv from "dotenv";

dotenv.config({ path: `${__dirname}/../.env` });

const availableScripts = [
  "actionsAndQuestionsTranslations",
  "feedbackCardTranslations",
  "emailTranslations",
  "locizeTranslations",
] as const;
const requiredEnvironmentVariables: Record<string, string> = {
  SERVICE_ACCOUNT:
    "SERVICE_ACCOUNT env var is missing. Generate serviceAccount file, Use BASE64 encoding on content of that file and add it to the .env.{environment_name} file.",
};

type availableScriptsType = (typeof availableScripts)[number];

const areAllScriptsSupported = (
  scriptsToRun: string[],
): scriptsToRun is availableScriptsType[] => {
  return scriptsToRun.every((scriptToRun) =>
    availableScripts.includes(scriptToRun as availableScriptsType),
  );
};

const exportScriptsRunner = async () => {
  const scriptsToRun = process.argv[2] ? process.argv[2].split(",") : [];

  if (!scriptsToRun) {
    console.log("No scripts to run");
    return;
  }

  if (!areAllScriptsSupported(scriptsToRun)) {
    throw new Error("Unsupported script was called");
  }

  for (const requiredEnvVar in requiredEnvironmentVariables) {
    if (!process.env[requiredEnvVar]) {
      throw new Error(requiredEnvironmentVariables[requiredEnvVar]);
    }
  }
  const serviceAccount: RawServiceAccountType = JSON.parse(
    Buffer.from(process.env.SERVICE_ACCOUNT || "", "base64").toString("ascii"),
  );

  const firebaseApp = createFirebaseApp(serviceAccount);
  const googleSheetsApiClient = createGoogleSheetsApiClient(serviceAccount);
  const googleStorage = createGoogleStorageClient(firebaseApp);

  for (const scriptToRun of scriptsToRun) {
    try {
      switch (scriptToRun) {
        case "actionsAndQuestionsTranslations":
          await actionsAndQuestionsTranslations(
            googleSheetsApiClient,
            createTranslationStorageFileWriter(
              "questionAndRecommendationTranslations.json",
              googleStorage,
            ),
          );
          break;
        case "feedbackCardTranslations":
          await feedbackCardTranslations(
            googleSheetsApiClient,
            createTranslationStorageFileWriter(
              "feedbackCardsTranslations.json",
              googleStorage,
            ),
          );
          break;
        case "emailTranslations":
          await emailTranslations(
            googleSheetsApiClient,
            createTranslationDiskFileWriter(
              "emailTranslations",
              `${__dirname}/CloudFunctions/Utilities/EmailTranslations`,
            ),
          );
          break;
        case "locizeTranslations":
          await locizeTranslations(
            createTranslationStorageFileWriter,
            googleStorage,
          );
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
};

exportScriptsRunner()
  .then(() => {
    console.log("Scripts executed successfully");
  })
  .catch((error) => {
    console.error("Error executing scripts", error);
  });
