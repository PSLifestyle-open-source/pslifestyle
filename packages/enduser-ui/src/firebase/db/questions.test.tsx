/* eslint-disable import/first */
import { buildQuery, getDocs } from "../FirestoreClient";
import { fetchQuestionsForCountry } from "./questions";
import { Country } from "@pslifestyle/common/src/models/countries";
import { vi } from "vitest";

vi.mock("../FirestoreClient");

import Mock = jest.Mock;

describe("fetchQuestionsForCountry", () => {
  const country: Country = {
    code: "FI",
    name: "Finland",
    languages: ["suomi", "English"],
  };
  const buildQuerySpy = buildQuery as Mock;
  const getDocsSpy = getDocs as Mock;

  const collectionName = "questions";
  const questionsVersion = "2023-04-03T14:10:46.456Z";
  const question1 = {
    questionText: "How many people live in your household? (including you)",
    label: "building_and_electricity",
    variableName: "ANSWER_HOU_NO_OF_PEOPLE",
    descriptionText:
      "More people per m2 means less emissions per person. We proportion the energy consumption of your home to all household members.",
    choices: [
      {
        choiceValue: 1,
        choiceTranslationKey: "995AD4BCA440115C_choice1",
        choiceText: "1",
      },
      {
        choiceTranslationKey: "995AD4BCA440115C_choice2",
        choiceText: "2",
        choiceValue: 2,
      },
      {
        choiceText: "3",
        choiceValue: 3,
        choiceTranslationKey: "995AD4BCA440115C_choice3",
      },
      {
        choiceTranslationKey: "995AD4BCA440115C_choice4",
        choiceText: "4",
        choiceValue: 4,
      },
      {
        choiceTranslationKey: "995AD4BCA440115C_choice5",
        choiceText: "5",
        choiceValue: 5,
      },
      {
        choiceTranslationKey: "995AD4BCA440115C_choice6",
        choiceValue: 6,
        choiceText: "6 or more",
      },
    ],
    id: "995AD4BCA440115C",
    formula: "0",
    descriptionTranslationKey: "995AD4BCA440115C_description",
    sortKey: "01-01",
  };
  const question2 = {
    formula: "0",
    label: "cottage",
    id: "DE103A9540021D72",
    choices: [
      {
        choiceText: "No",
        choiceValue: "0",
        choiceTranslationKey: "DE103A9540021D72_choice1",
      },
      {
        choiceTranslationKey: "DE103A9540021D72_choice2",
        choiceValue: "ANSWER_CON_COTTAGE_SUMMER",
        choiceText: "I use it in summer",
      },
      {
        choiceTranslationKey: "DE103A9540021D72_choice3",
        choiceValue: "ANSWER_CON_COTTAGE_YEARAROUND",
        choiceText: "I use it throughout the year",
      },
    ],
    questionText: "Do you have a summer cottage?",
    variableName: "ANSWER_CON_COTTAGE",
    sortKey: "04-03",
  };
  it("Verify query for questions is requested correctly", async () => {
    getDocsSpy
      .mockReturnValueOnce({ docs: [{ id: questionsVersion }] })
      .mockReturnValueOnce({ docs: [{ data: () => null }] });
    await fetchQuestionsForCountry(country);
    expect(buildQuerySpy.mock.calls[1][0]).toEqual(
      `${collectionName}/${questionsVersion}/${country.code}/`,
    );
  });
  it("When no questions returned from the database, expect an error to be thrown", async () => {
    getDocsSpy
      .mockReturnValueOnce({ docs: [{ id: questionsVersion }] })
      .mockReturnValueOnce({ docs: [] });
    await expect(() => fetchQuestionsForCountry(country)).rejects.toThrow(
      "Problem with fetching questions",
    );
  });
  it("When questions are returned from the database, expect version of questions and questions list to be returned", async () => {
    const expectedResult = [questionsVersion, [question1, question2]];
    getDocsSpy
      .mockReturnValueOnce({ docs: [{ id: questionsVersion }] })
      .mockReturnValueOnce({
        docs: [{ data: () => question1 }, { data: () => question2 }],
      });
    expect(await fetchQuestionsForCountry(country)).toEqual(expectedResult);
  });
});
