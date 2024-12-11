import { createAnswersBuilder } from "../../../../common/src/dataBuilders/answersBuilder";
import { QuestionType } from "../../../../common/src/schemas";
import {
  CalculatedAnswer,
  CategorizedFootprint,
  NewAnswerSet,
} from "../../../../common/src/types/questionnaireTypes";
import { collections } from "../../constants";
import { fetchConstants } from "../Repository/constants";
import * as admin from "firebase-admin";

export const calculateAnswers = async (
  answerSet: NewAnswerSet,
): Promise<{
  calculatedAnswers: CalculatedAnswer[];
  categorizedFootprint: CategorizedFootprint;
}> => {
  const { answers, metadata } = answerSet;
  const [questions, constants] = await Promise.all([
    admin
      .firestore()
      .collection(collections.importedQuestions)
      .doc(metadata.questionnaireVersion)
      .collection(metadata.countryCode)
      .get(),
    fetchConstants(metadata.countryCode, metadata.constantsVersion),
  ]);

  const calculator = createAnswersBuilder(
    questions.docs.map((doc) => doc.data()) as QuestionType[],
    constants,
  );

  const { calculatedAnswers, categorizedFootprint } =
    calculator.buildAnswers(answers);

  return {
    calculatedAnswers,
    categorizedFootprint,
  };
};
