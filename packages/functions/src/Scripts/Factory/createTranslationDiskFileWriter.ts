import TranslationFileWriter from "./translationFileWriter";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  unlinkSync,
  writeFileSync,
} from "fs";

export const createTranslationDiskFileWriter = (
  fileName: string,
  targetLocation: string,
): TranslationFileWriter => {
  return {
    persist: async (data: { [localeCode: string]: Record<string, string> }) => {
      const fileNameWithExtension = `${fileName}.json`;
      const currentFileFullPath = `${targetLocation}/${fileNameWithExtension}`;
      const backupLocation = `${targetLocation}_backup`;

      if (existsSync(currentFileFullPath)) {
        // Create backup
        try {
          if (!existsSync(backupLocation)) {
            mkdirSync(backupLocation);
          }
          copyFileSync(
            currentFileFullPath,
            `${backupLocation}/${fileNameWithExtension}`,
          );
          unlinkSync(currentFileFullPath); // deleting the file

          // Create translations
          if (!existsSync(targetLocation)) {
            mkdirSync(targetLocation, { recursive: true });
          }

          writeFileSync(currentFileFullPath, JSON.stringify(data));
          console.log("Translations for emails written in the files.");
        } catch (err) {
          console.log(
            "Something went wrong when copying or deleting the previous translation file.",
          );
          throw err;
        }
      }
    },
  };
};
