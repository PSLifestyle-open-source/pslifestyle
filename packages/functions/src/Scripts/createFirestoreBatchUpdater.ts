import {
  DocumentReference,
  Firestore,
  SetOptions,
} from "firebase-admin/firestore";

const MAX_BATCH_SIZE = 400; // Max is 500, but let's leave some spare space

type FullStorageItem = {
  documentReference: DocumentReference;
  data: unknown;
  options?: undefined;
};
type PartialStorageItem = {
  documentReference: DocumentReference;
  data: Partial<unknown>;
  options: SetOptions;
};
type BatchItem = FullStorageItem | PartialStorageItem;

export const createFirestoreBatchUpdater = (firestoreApiClient: Firestore) => {
  let batchStorage: BatchItem[] = [];

  const flushStorage = async (): Promise<void> => {
    if (batchStorage.length === 0) {
      return;
    }

    const batchUpdate = firestoreApiClient.batch();
    // The condition isn't really needed, but it is done to fulfill type narrowing
    batchStorage.forEach((storageItem) =>
      storageItem.options !== undefined
        ? batchUpdate.set(
            storageItem.documentReference,
            storageItem.data,
            storageItem.options,
          )
        : batchUpdate.set(storageItem.documentReference, storageItem.data),
    );

    await batchUpdate
      .commit()
      .then(() => {
        console.log(`${batchStorage.length} entities persisted`);
        batchStorage = [];
      })
      .catch((error) => {
        console.log(
          "Data export to Firestore failed with following error",
          error,
        );
      });
  };

  return {
    addItem: async (batchItem: BatchItem): Promise<void> => {
      batchStorage.push(batchItem);

      if (batchStorage.length >= MAX_BATCH_SIZE) {
        await flushStorage();
      }
    },
    flushStorage,
  };
};
