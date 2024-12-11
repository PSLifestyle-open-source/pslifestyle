import { userSessionExpired } from "../common/store/actions";
import { anonSessionActions } from "../features/auth/anonSessionSlice";
import { locationActions } from "../features/location/locationSlice";
import {
  requestExistingAnonymousUserInitialization,
  requestLoggedInUserInitialization,
  requestNewAnonymousUserInitialization,
} from "../firebase/api/initializeUser";
import { history } from "./Router";
import { AppStore } from "./store";
import { CampaignRedirectDestination } from "@pslifestyle/common/src/types/api/responseTypes";

let store: AppStore;

export const injectStore = (_store: AppStore) => {
  store = _store;
};

export const initializeUserSession = async () => {
  const { dispatch } = store;
  const { user } = store.getState().authedSession;
  const { anonId } = store.getState().anonSession;
  const urlSearchParams = new URLSearchParams(window.location.search);
  const campaignId = urlSearchParams.get("campaign") || undefined;

  const handleRedirect = (
    redirectDestination: CampaignRedirectDestination,
  ): void => {
    if (window.location.pathname === "/") {
      history.push(
        redirectDestination === "homepage" ? "/" : `/${redirectDestination}`,
      );
    }
  };

  const handleAllowedCountries = (allowedCountries: string[]) => {
    dispatch(locationActions.setAllowedCountries(allowedCountries));
    if (allowedCountries.length === 1) {
      dispatch(locationActions.setCountryCode(allowedCountries[0], true));
    }
  };

  async function initializeLoggedInUser(email: string, sessionToken: string) {
    const { data } = await requestLoggedInUserInitialization(
      email,
      sessionToken,
      campaignId,
    );

    if (data.downgrade) {
      if (!data.userId) {
        throw new Error(
          "Not received user id despite of session being downgraded",
        );
      }
      dispatch(userSessionExpired());
      dispatch(anonSessionActions.setAnonSession(data.userId));
    }
    handleAllowedCountries(data.allowedCountries);
    handleRedirect(data.redirectDestination);
  }

  async function initializeExistingAnonymousUser(
    anonId: string,
    campaignId: string | undefined,
  ) {
    const { data } = await requestExistingAnonymousUserInitialization(
      anonId,
      campaignId,
    );
    if (data.downgrade) {
      if (!data.userId) {
        dispatch(anonSessionActions.clearAnonSession());
        throw new Error(
          "Not received user id despite session being downgraded",
        );
      }
      dispatch(anonSessionActions.setAnonSession(data.userId));
    }
    handleAllowedCountries(data.allowedCountries);
    handleRedirect(data.redirectDestination);
  }

  async function initializeNewAnonymousUser(campaignId: string | undefined) {
    const { data } = await requestNewAnonymousUserInitialization(campaignId);
    if (!data.userId) {
      throw new Error(
        "Expected to receive user id when initializing new anonymous user",
      );
    }
    dispatch(anonSessionActions.setAnonSession(data.userId));
    handleAllowedCountries(data.allowedCountries);
    handleRedirect(data.redirectDestination);
  }

  if (user) {
    await initializeLoggedInUser(user.email, user.sessionToken);
  } else if (anonId) {
    await initializeExistingAnonymousUser(anonId, campaignId);
  } else {
    await initializeNewAnonymousUser(campaignId);
  }
};
