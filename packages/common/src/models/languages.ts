import { Country } from "./countries";

export const languagesList = ["en-GB"];

export const englishNameToLanguageCode: Record<string, string> = {
  English: "en-GB",
};

export const defaultLanguageName = "English";

export type LanguageType = {
  nativeName: string;
};

export type LanguagesObjType = {
  [key: string]: LanguageType;
};

export interface LanguageOptionType {
  label: string;
  value: string;
}

export const defaultLanguageCode = "en-GB";

export const languagesConfig: LanguagesObjType = {
  "en-GB": { nativeName: "English" },
};

export const LANGUAGE_OPTIONS: LanguageOptionType[] = Object.keys(
  languagesConfig,
).reduce(
  (acc: LanguageOptionType[], languageCode) => [
    ...acc,
    { label: languagesConfig[languageCode].nativeName, value: languageCode },
  ],
  [],
);

export const languageOptionsForCountry = (country: Country) => {
  return country.languages.map((languageCode: string) =>
    LANGUAGE_OPTIONS.find((option) => option.value === languageCode),
  ) as LanguageOptionType[];
};

export const getLanguageNativeName = (language: string | null): string => {
  try {
    return languagesConfig[language as string]?.nativeName ?? "";
  } catch {
    return "";
  }
};
