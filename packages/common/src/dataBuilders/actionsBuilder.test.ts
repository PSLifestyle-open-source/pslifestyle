import { MathScopes } from "../types/genericTypes";
import { RawRecommendedAction } from "../types/planTypes";
import { createActionsBuilder } from "./actionsBuilder";

const actions: RawRecommendedAction[] = [
  {
    skipIdsIfSelected: [],
    id: "123",
    impactFormulas: [
      {
        conditions: [
          {
            operator: ">",
            variableName: "TEST_FORMULA_CONDITION_1",
            value: "60",
          },
        ],
        formula: "QUESTION_1234_FORMULA_VARIABLE * NO_PEOPLE + 5",
      },
      {
        conditions: [
          {
            operator: "===",
            variableName: "TEST_FORMULA_CONDITION_1",
            value: "50",
          },
          {
            operator: "===",
            variableName: "TEST_FORMULA_CONDITION_2",
            value: "40",
          },
        ],
        formula: "QUESTION_1234_FORMULA_VARIABLE * NO_PEOPLE + 3",
      },
      { conditions: [], formula: "30" },
    ],
    category: "housing",
    type: "Action",
    title: "Complex formula",
    tags: ["saveenergy", "fast"],
    displayCondition: [
      { operator: ">=", value: "30", variableName: "TEST_COND_123" },
    ],
  },
  {
    skipIdsIfSelected: [],
    id: "123",
    impactFormulas: [{ conditions: [], formula: "50" }],
    category: "housing",
    type: "Action",
    title: "Simple formula",
    tags: ["saveenergy", "fast"],
    displayCondition: [],
  },
  {
    skipIdsIfSelected: [],
    id: "123",
    impactFormulas: [],
    category: "housing",
    type: "Action",
    title: "Missing formula",
    tags: ["saveenergy", "fast"],
    displayCondition: [],
  },
];

const baseFullMathScope: MathScopes = {
  TEST_COND_123: 20,
  NO_PEOPLE: 5,
  QUESTION_1234_FORMULA_VARIABLE: 100,
};
describe("Test Action Builder", () => {
  describe("Test function to prepare list of applicable actions based on conditions", () => {
    it("When passed actions, expect to return only those matching the condition", () => {
      const actionsBuilder = createActionsBuilder(
        "2023-01-01",
        baseFullMathScope,
        10000,
      );
      expect(actionsBuilder.prepareApplicableActions(actions)).toEqual([
        {
          id: "123",
          impactFormulas: [{ conditions: [], formula: "50" }],
          category: "housing",
          type: "Action",
          title: "Simple formula",
          tags: ["saveenergy", "fast"],
          displayCondition: [],
          skipIdsIfSelected: [],
        },
        {
          id: "123",
          impactFormulas: [],
          category: "housing",
          type: "Action",
          title: "Missing formula",
          tags: ["saveenergy", "fast"],
          displayCondition: [],
          skipIdsIfSelected: [],
        },
      ]);
    });
  });
  describe("Test function to calculate impact of actions", () => {
    it("When TEST_FORMULA_CONDITION_1 is above 60, expect the impact to be equal to 505 for complex action", () => {
      const actionsBuilder = createActionsBuilder(
        "2023-01-01",
        {
          ...baseFullMathScope,
          TEST_FORMULA_CONDITION_1: 65,
        },
        10000,
      );

      expect(
        actionsBuilder.calculateApplicableActionsImpact([actions[0]]),
      ).toEqual([
        {
          skipIdsIfSelected: [],
          actionsVersion: "2023-01-01",
          calculatedImpact: 505,
          category: "housing",
          id: "123",
          percentReduction: 5.050000000000001,
          state: "new",
          tags: ["saveenergy", "fast"],
          title: "Complex formula",
          type: "Action",
        },
      ]);
    });
    it("When TEST_FORMULA_CONDITION_1 is equal to 50 and TEST_FORMULA_CONDITION_2 is equal to 40, expect the impact to be equal to 503 for complex action", () => {
      const actionsBuilder = createActionsBuilder(
        "2023-01-01",
        {
          ...baseFullMathScope,
          TEST_FORMULA_CONDITION_1: 50,
          TEST_FORMULA_CONDITION_2: 40,
        },
        10000,
      );

      expect(
        actionsBuilder.calculateApplicableActionsImpact([actions[0]]),
      ).toEqual([
        {
          skipIdsIfSelected: [],
          actionsVersion: "2023-01-01",
          calculatedImpact: 503,
          category: "housing",
          id: "123",
          percentReduction: 5.029999999999999,
          state: "new",
          tags: ["saveenergy", "fast"],
          title: "Complex formula",
          type: "Action",
        },
      ]);
    });
    it("When TEST_FORMULA_CONDITION_1 is below or equal 30, expect default formula to be used and impact be equal to 30", () => {
      const actionsBuilder = createActionsBuilder(
        "2023-01-01",
        {
          ...baseFullMathScope,
          TEST_FORMULA_CONDITION_1: 5,
        },
        10000,
      );

      expect(
        actionsBuilder.calculateApplicableActionsImpact([actions[0]]),
      ).toEqual([
        {
          skipIdsIfSelected: [],
          actionsVersion: "2023-01-01",
          calculatedImpact: 30,
          category: "housing",
          id: "123",
          percentReduction: 0.3,
          state: "new",
          tags: ["saveenergy", "fast"],
          title: "Complex formula",
          type: "Action",
        },
      ]);
    });
    it("When many actions are provided, expect the impact to be calculated for each of them", () => {
      const actionsBuilder = createActionsBuilder(
        "2023-01-01",
        {
          ...baseFullMathScope,
          TEST_FORMULA_CONDITION_1: 5,
        },
        10000,
      );

      expect(actionsBuilder.calculateApplicableActionsImpact(actions)).toEqual([
        {
          skipIdsIfSelected: [],
          actionsVersion: "2023-01-01",
          calculatedImpact: 30,
          category: "housing",
          id: "123",
          percentReduction: 0.3,
          state: "new",
          tags: ["saveenergy", "fast"],
          title: "Complex formula",
          type: "Action",
        },
        {
          skipIdsIfSelected: [],
          actionsVersion: "2023-01-01",
          calculatedImpact: 50,
          category: "housing",
          id: "123",
          percentReduction: 0.5,
          state: "new",
          tags: ["saveenergy", "fast"],
          title: "Simple formula",
          type: "Action",
        },
        {
          skipIdsIfSelected: [],
          actionsVersion: "2023-01-01",
          calculatedImpact: 0,
          category: "housing",
          id: "123",
          percentReduction: 0,
          state: "new",
          tags: ["saveenergy", "fast"],
          title: "Missing formula",
          type: "Action",
        },
      ]);
    });
  });
});
