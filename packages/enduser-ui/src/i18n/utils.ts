import { getStorage } from "../firebase/FirestoreClient";
import { getDownloadURL, ref } from "firebase/storage";

export const commonNamespaces = [
  "accessibility",
  "authentication",
  "common",
  "feedback",
  "frontpage",
  "intros",
  "management",
  "questionnaire",
  "recommendations",
  "results",
];

export const regionalNamespaces = [
  "feedbackCardsTranslations",
  "questionAndRecommendationTranslations",
];

const storage = getStorage();

async function getRegionTranslationsUrl(
  countryCode: string,
  language: string,
  ns: string,
) {
  const path = `/i18n/${language}/${ns}.json`;
  const starsRef = ref(await storage, path);
  const url = await getDownloadURL(starsRef);
  return url;
}

async function getCommonTranslationsUrl(language: string, ns: string) {
  const path = `/i18n/${language}/${ns}.json`;
  const starsRef = ref(await storage, path);
  const url = await getDownloadURL(starsRef);
  return url;
}

export function formatLanguageCode(languageCode: string, countryCode: string) {
  return `${languageCode}:${countryCode}`;
}

export function parseLanguageCode(language: string | null) {
  if (!language) {
    throw new Error("Language code is null");
  }
  const [languageCode, countryCode] = language.split(":");
  return { languageCode, countryCode };
}

export async function getTranslationUrl(countryLanguage: string, ns: string) {
  const { languageCode, countryCode } = parseLanguageCode(countryLanguage);
  if (regionalNamespaces.includes(ns)) {
    return getRegionTranslationsUrl(countryCode, languageCode, ns);
  }
  if (commonNamespaces.includes(ns)) {
    return getCommonTranslationsUrl(languageCode, ns);
  }
  throw new Error(`Unknown namespace ${ns}`);
}
