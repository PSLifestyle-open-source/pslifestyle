import { App } from "firebase-admin/app";
import { Firestore, getFirestore } from "firebase-admin/firestore";

const createFirestoreInstance = (firebaseApp: App): Firestore => {
  const firestore = getFirestore(firebaseApp);
  firestore.settings({ ignoreUndefinedProperties: true });

  return firestore;
};

export default createFirestoreInstance;
