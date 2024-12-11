import * as helpers from "./helpers";
import { CalculatedAnswer } from "@pslifestyle/common/src/types/questionnaireTypes";

describe("getValueAsNumber", () => {
  it("returns 5 when 5 is passed", () => {
    expect(helpers.getValueAsNumber(5, { variable1: 500 })).toEqual(5);
  });

  it("returns 5 when 5 is passed with empty mathScope object", () => {
    expect(helpers.getValueAsNumber(5, {})).toBe(5);
  });

  it("returns 5.5 when 5.5 is passed", () => {
    expect(helpers.getValueAsNumber(5.5, { variable1: 500 })).toBe(5.5);
  });

  it("returns 5.5 when 5.5 is passed with empty mathScope object", () => {
    expect(helpers.getValueAsNumber(5.5, {})).toBe(5.5);
  });

  it("returns correct value for variable in mathScope object when correct variable name is passed", () => {
    const mathScope = {
      variable1: 500,
      variable2: 1500,
    };

    const result = helpers.getValueAsNumber("variable1", mathScope);
    expect(result).toBe(500);
  });
});

describe("parseLabelSums", () => {
  it("calculates & parses label sums correctly", () => {
    const calculatedAnswers: CalculatedAnswer[] = [
      {
        choiceText: "answer1",
        choiceValue: "answer1",
        questionId: "1",
        category: "housing",
        sortKey: "sortKey2",
        questionText: "question1",
        footprint: 10,
        label: "label1",
        variables: {
          variableName1: 10,
        },
      },
      {
        choiceText: "answer2",
        choiceValue: "answer2",
        questionId: "2",
        category: "purchases",
        sortKey: "sortKey2",
        questionText: "question2",
        footprint: 20,
        label: "label2",
        variables: {
          variableName2: 20,
        },
      },
      {
        choiceText: "answer3",
        choiceValue: "answer3",
        questionId: "3",
        category: "purchases",
        sortKey: "sortKey3",
        questionText: "question3",
        footprint: 15.5,
        label: "label2",
        variables: {
          variableName3: 15.5,
        },
      },
      {
        choiceText: "answer4",
        choiceValue: "answer4",
        questionId: "4",
        category: "food",
        sortKey: "sortKey4",
        questionText: "question4",
        footprint: 50,
        label: "label1",
        variables: {
          variableName4: 50,
        },
      },
      {
        choiceText: "answer5",
        choiceValue: "answer5",
        questionId: "5",
        category: "transport",
        sortKey: "sortKey5",
        questionText: "question5",
        footprint: 1,
        label: "label3",
        variables: {
          variableName5: 1,
        },
      },
    ];

    const result = helpers.parseLabelSums(calculatedAnswers);
    expect(result).toEqual({
      label1: 60,
      label2: 35.5,
      label3: 1,
    });
  });
});

describe("generic utilities", () => {
  type TestType = { a: number; b: number; c?: number };
  const obj: TestType = { a: 1, b: 0 };
  const arr: number[] = [1, 2, 3, 4, 5];

  describe("assoc", () => {
    it("should associate prop with value", () => {
      const expected: TestType = { a: 1, b: 0, c: 3 };

      expect(helpers.assoc(obj, "c", 3)).toEqual(expected);
    });
    it("should change value in prop", () => {
      const expected: TestType = { a: 5, b: 0 };

      expect(helpers.assoc(obj, "a", 5)).toEqual(expected);
    });
    it("should not mutate original object", () => {
      expect(helpers.assoc(obj, "a", 1) === obj).toBeFalsy();
    });
  });
  describe("assocWith", () => {
    it("should associate prop with proper value type", () => {
      const expected: TestType = { a: 5, b: 0 };
      expect(helpers.assocWith(obj, "a", Number, "5")).toEqual(expected);
    });
  });
  describe("append", () => {
    it("should append", () => {
      const expected = [1, 2, 3, 4, 5, 6];
      expect(helpers.append(arr, 6)).toEqual(expected);
    });
    it("should not mutate original array", () => {
      expect(helpers.append(arr, 6) === arr).toBeFalsy();
    });
  });
  describe("appendIf", () => {
    it("should append if predicate is true", () => {
      const expected = [1, 2, 3, 4, 5, 6];
      expect(helpers.appendIf(arr, (item) => item % 2 === 0, 6)).toEqual(
        expected,
      );
    });
    it("should not append when predicate is false", () => {
      const expected = [1, 2, 3, 4, 5];
      expect(helpers.appendIf(arr, (item) => item % 2 === 1, 6)).toEqual(
        expected,
      );
    });
    it("should not mutate", () => {
      expect(
        helpers.appendIf(arr, (item) => item % 2 === 1, 6) === arr,
      ).toBeFalsy();
    });
  });
  describe("mergeLeft", () => {
    it("should merge", () => {
      const expected: TestType = { a: 1, b: 2 };
      expect(helpers.mergeLeft(obj, { b: 2 })).toEqual(expected);
    });
    it("should not mutate", () => {
      expect(helpers.mergeLeft(obj, { b: 2 }) === obj).toBeFalsy();
    });
  });
  describe("update", () => {
    it("should update a value in index", () => {
      const expected = [1, 2, 3, 3, 5];
      expect(helpers.update(arr, 3, 3)).toEqual(expected);
    });
    it("should not mutate", () => {
      expect(helpers.update(arr, 3, 3) === arr).toBeFalsy();
    });
  });
  describe("pick", () => {
    const pickTestObj = { a: 1, b: 2, c: 3 };

    it("should return wanted props", () => {
      const expected = { a: 1, c: 3 };

      expect(helpers.pick(pickTestObj, ["a", "c"])).toEqual(expected);
    });

    it("should return empty with no props", () => {
      expect(helpers.pick(pickTestObj, [])).toEqual({});
    });
  });
});
