import { firestoreInstancePromise } from "./firebaseInit";
import {
  collection,
  query,
  Query,
  QueryConstraint,
  getDocs as firestoreGetDocs,
  getDoc as firestoreGetDoc,
  doc,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import { getStorage as getFirebaseStorage } from "firebase/storage";

export const buildQuery = async (
  collectionName: string,
  ...queryConstraints: QueryConstraint[]
): Promise<Query> => {
  const firestoreInstance = await firestoreInstancePromise;
  return query(
    collection(firestoreInstance, collectionName),
    ...queryConstraints,
  );
};

export const buildDocReference = async (
  path: string,
  ...pathSegments: string[]
): Promise<DocumentReference> => {
  const firestoreInstance = await firestoreInstancePromise;
  return doc(firestoreInstance, path, ...pathSegments);
};

export const getDoc = <T>(
  reference: DocumentReference<T>,
): Promise<DocumentSnapshot<T>> => firestoreGetDoc(reference);
export const getDocs = <T>(rawQuery: Query<T>): Promise<QuerySnapshot<T>> =>
  firestoreGetDocs(rawQuery);

export const getStorage = async () => {
  await firestoreInstancePromise;
  return getFirebaseStorage();
};
