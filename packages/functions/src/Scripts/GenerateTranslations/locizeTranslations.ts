/* eslint-disable @typescript-eslint/no-explicit-any,camelcase */
// Connects to a Google Sheets document specified in object "opt" and retrieves the specified range.
// The Sheets doc needs to be shared to the service account email.
import { languagesList } from "../../../../common/src/models/languages";
import TranslationFileWriter from "../Factory/translationFileWriter";
import { Storage } from "firebase-admin/lib/storage";
import { readdir, readFile } from "node:fs/promises";

export const locizeTranslations = async (
  storageFileWriter: (
    fileName: string,
    storage: Storage,
  ) => TranslationFileWriter,
  storage: Storage,
) => {
  for (const languageCode of languagesList) {
    const translationsSource = `./locales/${languageCode}`;
    console.log(await readdir("."));
    const fileNames = await readdir(translationsSource);

    for (const fileName of fileNames) {
      const fileContent = await readFile(
        `${translationsSource}/${fileName}`,
        "utf-8",
      );

      const fileWriter = storageFileWriter(fileName, storage);
      fileWriter.persist({ [languageCode]: JSON.parse(fileContent) });
    }
  }
};
