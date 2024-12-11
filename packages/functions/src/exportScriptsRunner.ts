import { actionExport } from "./Scripts/Export/actionExport";
import { constantExport } from "./Scripts/Export/constantExport";
import { feedbackCardExport } from "./Scripts/Export/feedbackCardExport";
import { questionExport } from "./Scripts/Export/questionExport";
import {
  createFirestoreApiClient,
  createGoogleSheetsApiClient,
} from "./Scripts/Factory";
import createFirebaseApp from "./Scripts/Factory/createFirebaseApp";
import { RawServiceAccountType } from "./rawServiceAccountType";

const availableScripts = [
  "actionExport",
  "constantExport",
  "questionExport",
  "feedbackCardExport",
] as const;
const requiredEnvironmentVariables: Record<string, string> = {
  SERVICE_ACCOUNT:
    "SERVICE_ACCOUNT env var is missing. Generate serviceAccount file, Use BASE64 encoding on content of that file and add it to the .env.{environment_name} file.",
};

type availableScriptsType = (typeof availableScripts)[number];

const isScriptSupported = (
  scriptToRun: string,
): scriptToRun is availableScriptsType => {
  return availableScripts.includes(scriptToRun as availableScriptsType);
};

const exportScriptsRunner = async () => {
  const scriptToRun = process.argv[2];

  if (!isScriptSupported(scriptToRun)) {
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
  const firestoreApiClient = createFirestoreApiClient(firebaseApp);

  try {
    switch (scriptToRun) {
      case "questionExport":
        await questionExport(firestoreApiClient, googleSheetsApiClient);
        break;
      case "actionExport":
        await actionExport(firestoreApiClient, googleSheetsApiClient);
        break;
      case "constantExport":
        await constantExport(firestoreApiClient, googleSheetsApiClient);
        break;
      case "feedbackCardExport":
        await feedbackCardExport(firestoreApiClient, googleSheetsApiClient);
        break;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exportScriptsRunner()
  .then(() => {
    console.log("Scripts executed successfully");
  })
  .catch((error) => {
    console.error("Error executing scripts", error);
  });
