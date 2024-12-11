import { NewAnswerSet } from "../../../../common/src/types/questionnaireTypes";
import { CalculatedAnswerSet } from "../Types/answers";
import { calculateAnswers } from "./calculateAnswers";

export const prepareCalculatedAnswerSet = async (
  answerSet: NewAnswerSet,
): Promise<CalculatedAnswerSet> => {
  const { calculatedAnswers, categorizedFootprint } =
    await calculateAnswers(answerSet);

  return {
    ordinaryAnswers: calculatedAnswers.filter(
      (calculatedAnswer) => calculatedAnswer.category !== "demographic",
    ),
    demographicAnswers: calculatedAnswers.filter(
      (calculatedAnswer) => calculatedAnswer.category === "demographic",
    ),
    categorizedFootprint,
  };
};
