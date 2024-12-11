/* eslint-disable camelcase */
import { QuestionType } from "../../../../common/src/schemas";
import { queryLatestImportedEntityVersion } from "../../CloudFunctions/Repository/utils";
import { collections } from "../../constants";
import { QuestionsPerCountry } from "../../utils/models";
import { validateQuestions } from "../../utils/validators";
import { allQuestionData } from "../ImportParsers/questionsFetchAndParse";
import { createFirestoreBatchUpdater } from "../createFirestoreBatchUpdater";
import { Firestore } from "firebase-admin/firestore";
import { sheets_v4 } from "googleapis";

import Sheets = sheets_v4.Sheets;

export async function handleQuestionData(
  data: QuestionsPerCountry,
  firestoreApiClient: Firestore,
  update?: boolean,
) {
  const date = new Date();
  const version = update
    ? await queryLatestImportedEntityVersion(collections.importedQuestions)
    : date.toISOString();
  console.log(`${update ? "Updating" : "Creating"} ${version}`);
  if (data) {
    for (const key of Object.keys(data)) {
      const countryQuestions = data[key as keyof QuestionsPerCountry];
      const validatedRows = validateQuestions(countryQuestions, key);
      if (validatedRows.length !== countryQuestions.length) {
        throw new Error(
          "Not all questions were validated correctly. No questions imported to database.",
        );
      }
    }

    try {
      await firestoreApiClient
        .collection(collections.importedQuestions)
        .doc(version)
        .set({ importDate: date });
      const firestoreBatchUpdater =
        createFirestoreBatchUpdater(firestoreApiClient);

      for (const key of Object.keys(data)) {
        const countryQuestions: QuestionType[] =
          data[key as keyof QuestionsPerCountry];
        for (const question of countryQuestions) {
          await firestoreBatchUpdater.addItem({
            documentReference: firestoreApiClient
              .collection(collections.importedQuestions)
              .doc(version)
              .collection(key)
              .doc(question.id),
            data: question,
          });
        }
      }
      await firestoreBatchUpdater.flushStorage();
      console.log("Successfully parsed questions taken to database.");
    } catch (error) {
      console.log(error);
      if (!update) {
        await firestoreApiClient
          .collection(collections.importedQuestions)
          .doc(version)
          .delete();
      }
      throw error;
    }
  } else {
    console.log("questionImport.ts could not fetch question data");
  }
}

export async function questionExport(
  firestoreApiClient: Firestore,
  googleSheetApiClient: Sheets,
) {
  console.log("Running questionExport.ts");
  const data = await allQuestionData(googleSheetApiClient);
  return handleQuestionData(data, firestoreApiClient);
}
