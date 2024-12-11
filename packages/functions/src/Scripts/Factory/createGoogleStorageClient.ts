/* eslint-disable camelcase */
import { App } from "firebase-admin/app";
import { getStorage, Storage } from "firebase-admin/storage";

// Create a root reference
export const createGoogleStorageClient = (firebaseApp: App): Storage => {
  return getStorage(firebaseApp);
};
