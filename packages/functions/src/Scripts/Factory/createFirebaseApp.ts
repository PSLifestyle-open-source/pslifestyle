import { RawServiceAccountType } from "../../rawServiceAccountType";
import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";
import { App, initializeApp } from "firebase-admin/app";

const createFirebaseApp = (serviceAccount: RawServiceAccountType): App => {
  return initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
    storageBucket: `${serviceAccount.project_id}.firebasestorage.app`,
  });
};

export default createFirebaseApp;
