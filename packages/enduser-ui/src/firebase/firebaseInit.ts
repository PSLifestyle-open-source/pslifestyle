import { USE_EMULATOR } from "../app/config";
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

// Initialize Firebase asynchronously and return the Firestore instance
export async function initializeFirebase() {
  const firebaseInstance = initializeApp(firebaseConfig);
  const firestore = getFirestore(firebaseInstance);
  if (USE_EMULATOR) {
    connectFirestoreEmulator(firestore, "localhost", 8080);
  }

  return firestore;
}

// Store the initialized Firestore instance
export const firestoreInstancePromise = initializeFirebase();
