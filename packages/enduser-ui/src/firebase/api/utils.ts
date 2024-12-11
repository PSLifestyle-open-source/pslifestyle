import { USE_EMULATOR } from "../../app/config";
import { AppStore } from "../../app/store";
import { userSessionExpired } from "../../common/store/actions";
import { FunctionsErrorCodes } from "../../features/auth/constants";
import { FirebaseError } from "@firebase/util";
import {
  EitherAnonOrLoggedInUser,
  LoggedInUser,
} from "@pslifestyle/common/src/types/api/payloadTypes";
import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
  HttpsCallableResult,
} from "firebase/functions";

let store: AppStore;

export const injectStore = (_store: AppStore) => {
  store = _store;
};

export const getEitherLoggedInOrAnonUser = (): EitherAnonOrLoggedInUser => {
  const authenticatedUser = store.getState().authedSession.user;
  const anonUserId = store.getState().anonSession.anonId;

  if (authenticatedUser) {
    return {
      email: authenticatedUser.email,
      sessionToken: authenticatedUser.sessionToken,
    };
  }

  if (!anonUserId) {
    throw new Error("User is missing anon ID");
  }
  return { anonId: anonUserId };
};

export const getLoggedInUser = (): LoggedInUser => {
  const authenticatedUser = store.getState().authedSession.user;

  if (!authenticatedUser) {
    throw new Error("User is not authenticated to perform this action");
  }

  return {
    email: authenticatedUser.email,
    sessionToken: authenticatedUser.sessionToken,
  };
};

const FUNCTION_DEPLOY_REGION = "europe-west1";

export const callCloudFunc = async <T>(
  funcName: string,
  paramObject: unknown,
): Promise<HttpsCallableResult<T>> => {
  const functions = getFunctions(undefined, FUNCTION_DEPLOY_REGION);

  if (USE_EMULATOR) {
    connectFunctionsEmulator(functions, "localhost", 5001);
  }

  const callBackend = httpsCallable<unknown, T>(functions, funcName);
  try {
    return await callBackend(paramObject);
  } catch (error) {
    if (
      error instanceof FirebaseError &&
      error.code === FunctionsErrorCodes.UNAUTHENTICATED
    ) {
      store.dispatch(userSessionExpired());
    }
    return Promise.reject(error);
  }
};
