import { filterQuestions } from "./filters";
import { QuestionType } from "@pslifestyle/common/src/schemas";

describe("filterQuestions", () => {
  const emptyAvailableQuestions: QuestionType[] = [];

  const mathScope = { variable1: 5 };

  it("when passed an empty question array, return empty array", () => {
    const result = filterQuestions(mathScope, emptyAvailableQuestions);
    expect(result).toEqual([]);
  });
});
