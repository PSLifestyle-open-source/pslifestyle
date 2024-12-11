import { AppDispatch, RootState } from "../../app/store";
import { resetStateForTesting } from "../../common/store/actions";
import { createDeepEqualSelector } from "../../common/store/utils";
import { formatLanguageCode, parseLanguageCode } from "../../i18n/utils";
import {
  Country,
  getCountryObjectByCode,
} from "@pslifestyle/common/src/models/countries";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import i18next from "i18next";

export interface LocationState {
  country: Country | null;
  language: string | null;
  allowedCountries: string[];
}

const initialState: LocationState = {
  country: null,
  language: null,
  allowedCountries: [],
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setCountry(state, action: PayloadAction<Country>) {
      state.country = action.payload;
    },
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload;
    },
    setAllowedCountries(state, action: PayloadAction<string[]>) {
      state.allowedCountries = action.payload;
    },
    resetCountry(state) {
      state.country = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      resetStateForTesting,
      (_state, action) => action.payload.location,
    );
  },
});

export default locationSlice;

function setLanguageWithI18n(language: string) {
  return async () => {
    i18next.changeLanguage(language);
  };
}

function setCountryCode(countryCode: string, forceCountryLanguage = false) {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const foundCountry = getCountryObjectByCode(countryCode);
    if (!foundCountry) {
      return;
    }

    const currentLanguage = getState().location.language;
    const countryLanguage = formatLanguageCode(
      parseLanguageCode(currentLanguage).languageCode,
      foundCountry.code,
    );
    const countryLanguageDefault = formatLanguageCode(
      foundCountry.languages[0],
      foundCountry.code,
    );
    const finalLanguage =
      forceCountryLanguage ||
      !currentLanguage ||
      !foundCountry.languages.includes(
        parseLanguageCode(countryLanguage).languageCode,
      )
        ? countryLanguageDefault
        : countryLanguage;

    dispatch(locationSlice.actions.setCountry(foundCountry));
    dispatch(setLanguageWithI18n(finalLanguage));
  };
}

export const locationActions = {
  ...locationSlice.actions,
  setLanguageWithI18n,
  setCountryCode,
};

const selectCountry = createDeepEqualSelector(
  [(state) => state.location.country],
  (country: Country | null) => country,
);

export const locationSelectors = {
  country: selectCountry,
  language: (state: RootState) => state.location.language,
  allowedCountries: (state: RootState) => state.location.allowedCountries,
};
