import customLocalstorageDetection from "./customLocalStorageDetection";
import {
  commonNamespaces,
  formatLanguageCode,
  getTranslationUrl,
  regionalNamespaces,
} from "./utils";
import {
  countries,
  countryLanguages,
} from "@pslifestyle/common/src/models/countries";
import { defaultLanguageCode } from "@pslifestyle/common/src/models/languages";
import i18next, { BackendModule } from "i18next";
import LanguageDetector, {
  DetectorOptions,
} from "i18next-browser-languagedetector";
import { locizePlugin } from "locize";
import { initReactI18next } from "react-i18next";

// We might need extra typing for the t() function (so far no errors though)
// "In order to infer the appropriate type for t function, you should use type augmentation to override the Resources type."
// https://github.com/i18next/react-i18next/tree/master/example/react-typescript4.1/no-namespaces
// or https://github.com/i18next/react-i18next/tree/master/example/react-typescript4.1/namespaces

const options: DetectorOptions = {
  // order and from where user language should be detected
  order: ["customLocalStorage"],
  //
  // // cache user language on
  caches: ["customLocalStorage"],

  // optional htmlTag with lang attribute, the default is:
  htmlTag: document.documentElement,

  // optional set cookie options, reference:[MDN Set-Cookie docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
};
const languageDetector = new LanguageDetector(null, options);
languageDetector.addDetector(customLocalstorageDetection);

const fallbackLng = countries.reduce(
  (acc, country) => {
    country.languages.forEach((language) => {
      acc[formatLanguageCode(language, country.code)] = [
        formatLanguageCode(defaultLanguageCode, country.code),
      ];
    });
    return acc;
  },
  { default: [formatLanguageCode(defaultLanguageCode, "EU")] } as Record<
    string,
    string[]
  >,
);

// Custom backend is needed to get Locize plugin working. Can't use the default backend as such.
const customHttpBackend: BackendModule = {
  type: "backend",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  init() {},
  async read(language, namespace, callback) {
    try {
      const url = await getTranslationUrl(language, namespace);
      const response = await fetch(url);
      return callback(null, await response.json());
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      return callback(
        new Error(
          `Failed to load translation for language ${language} and namespace ${namespace}`,
        ),
        null,
      );
    }
  },
};

export function initI18Next() {
  i18next
    .use(locizePlugin)
    .use(languageDetector)
    .use(customHttpBackend)
    .use(initReactI18next)
    .init({
      load: "currentOnly", // load only eg. en-GB, not en, en-GB and dev, avoiding unnecessary requests
      ns: [...commonNamespaces, ...regionalNamespaces],
      defaultNS: "common",
      fallbackLng,
      supportedLngs: countryLanguages,
      interpolation: {
        escapeValue: false, // not needed for react as it escapes by default
      },
      react: {
        // "Using react-i18next you might want to bind the editorSaved event to trigger a rerender"
        bindI18n: "languageChanged editorSaved",
        useSuspense: true,
      },
    });
}

export { i18next };
