import * as QuestionnaireUtils from "./QuestionnaireUtils";
import { QuestionType } from "@pslifestyle/common/src/schemas";
import { NewAnswer } from "@pslifestyle/common/src/types/questionnaireTypes";

describe("QuestionnaireUtils", () => {
  describe("questionnaireProgress", () => {
    it("should return questionnaire progress", () => {
      const questions = [
        { id: "1", sortKey: "01-1234-12" },
        { id: "2", sortKey: "02-1234-12" },
        { id: "3", sortKey: "03-1234-12" },
      ];
      const answers: NewAnswer[] = [
        { questionId: "1", sortKey: "01-01", choiceText: "Test label" },
      ];

      const expected = {
        1: { theme: "housing", done: true },
        2: { theme: "transport", done: false },
        3: { theme: "food", done: false },
      };

      expect(
        QuestionnaireUtils.calculateQuestionnaireProgress(
          questions as QuestionType[],
          answers,
        ),
      ).toEqual(expected);
    });
  });

  describe("progressForTheme", () => {
    it("should return progress for theme", () => {
      const progress = {
        1: { theme: "housing", done: true },
        2: { theme: "transport", done: false },
        3: { theme: "food", done: false },
        4: { theme: "housing", done: false },
      };
      const expected = { complete: 1, total: 2 };

      expect(QuestionnaireUtils.progressForTheme("housing", progress)).toEqual(
        expected,
      );
    });
  });
});
