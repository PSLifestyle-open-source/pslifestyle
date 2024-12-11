import { store } from "../app/store";
import { locationActions } from "../features/location/locationSlice";

export default {
  name: "customLocalStorage",

  lookup: function lookup() {
    const { country, language } = store.getState().location;
    if (country) {
      store.dispatch(locationActions.setCountryCode(country.code));
    }
    return language || undefined;
  },
  cacheUserLanguage: function cacheUserLanguage(language: string) {
    store.dispatch(locationActions.setLanguage(language));
  },
};
