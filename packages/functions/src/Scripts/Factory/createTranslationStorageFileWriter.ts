import TranslationFileWriter from "./translationFileWriter";
import { Storage } from "firebase-admin/storage";

/**
 * Create a translation storage file writer.
 *
 * Translations will be written to file with following path:
 * i18n/<countryCode>/<languageCode>/<fileName>
 *
 * Country code is optional and will be omitted from the path if undefined.
 *
 * @param {string} fileName Translation file name
 * @param {Storage} storage Google storage instance
 * @param {string} countryCode Country code of translations
 * @return {TranslationFileWriter} Storage writer
 */
export const createTranslationStorageFileWriter = (
  fileName: string,
  storage: Storage,
  countryCode?: string,
): TranslationFileWriter => {
  return {
    persist: async (data: { [localeCode: string]: Record<string, string> }) => {
      const fileNameWithExtension = `${fileName}`;
      for (const languageCode of Object.keys(data)) {
        const directory = countryCode
          ? `i18n/${countryCode}/${languageCode}`
          : `i18n/${languageCode}`;

        const currentFileFullPath = `${directory}/${fileNameWithExtension}`;

        // Add translation keys and values to the contents object
        const contentsJSON = JSON.stringify(data[languageCode]);
        await storage.bucket().file(currentFileFullPath).save(contentsJSON);
        console.log(`Translations for ${languageCode} written in the files.`);
      }
    },
  };
};
