import { useAppDispatch } from "../../app/store";
import { formatLanguageCode, parseLanguageCode } from "../../i18n/utils";
import { locationActions, locationSelectors } from "./locationSlice";
import {
  languagesConfig,
  LanguageOptionType,
  languageOptionsForCountry,
} from "@pslifestyle/common/src/models/languages";
import { ReactElement, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Select from "react-select";

export const LanguageSelection = (): ReactElement | null => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const country = useSelector(locationSelectors.country);
  const language = useSelector(locationSelectors.language);

  const handleLanguageChange = useCallback(
    (selectedLanguage: LanguageOptionType) => {
      if (!country || !selectedLanguage) {
        return;
      }
      dispatch(
        locationActions.setLanguageWithI18n(
          formatLanguageCode(selectedLanguage.value, country.code),
        ),
      );
    },
    [country, dispatch],
  );

  const chosenLanguage = useMemo(() => {
    try {
      const { languageCode } = parseLanguageCode(language);
      if (languagesConfig[languageCode]) {
        return {
          label: languagesConfig[languageCode].nativeName,
          value: `${languageCode}`,
        };
      }
    } catch (e) {
      if (e instanceof Error && e.message === "Language code is null") {
        return null;
      }
    }
    return null;
  }, [language]);

  const languageOptions = useMemo(
    () => (country ? languageOptionsForCountry(country) : []),
    [country],
  );

  return (
    <>
      <label className="title-md" htmlFor="languageSelector">
        {t("langChoice", { ns: "frontpage" })}
      </label>
      <Select
        id="languageSelector"
        value={chosenLanguage}
        options={languageOptions}
        isSearchable={false}
        onChange={(evt) => handleLanguageChange(evt as LanguageOptionType)}
      />
    </>
  );
};
