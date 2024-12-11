import { buildQuery, getDocs } from "../FirestoreClient";
import { limit, orderBy } from "firebase/firestore";

export const queryLatestEntityVersion = async (
  collectionName: string,
): Promise<string> => {
  try {
    const queryConstantSets = await buildQuery(
      collectionName,
      orderBy("importDate", "desc"),
      limit(1),
    );
    const queryConstantSetsSnapshot = await getDocs(queryConstantSets);
    return queryConstantSetsSnapshot.docs[0].id;
  } catch (e) {
    console.log("error queryLatestVersion", e);
    throw e;
  }
};
