/* eslint-disable camelcase */

/* eslint-disable @typescript-eslint/no-explicit-any */
// Connects to a Google Sheets document specified in object "opt" and retrieves the specified range.
// The Sheets doc needs to be shared to the service account email.
import { footprintCategoryMap } from "../../../../common/src/models/categoryMap";
import { countryCodes } from "../../../../common/src/models/countries";
import { QuestionType } from "../../../../common/src/schemas";
import {
  assignIdToChoiceRows,
  choicesToQuestions,
  operators,
  returnHeadersWithIndices,
} from "../../utils/helpers";
import { EntireQuestion, QuestionsPerCountry } from "../../utils/models";
import { createGoogleSheetsFetchSettings } from "../Factory/createGoogleSheetsFetchSettings";
import { sheets_v4 } from "googleapis";

async function fetchCountryQuestionData(
  gsapi: sheets_v4.Sheets,
  countryCode: string,
): Promise<QuestionType[]> {
  console.log(`\nFetching questions for ${countryCode}`);

  function parseRowObjects(
    data: any,
    headersWithIndices: [string, number][],
  ): EntireQuestion[] {
    const rows: EntireQuestion[] = data.slice(1).map((row: any) => {
      const obj = {} as any;
      row.forEach((cell: any, i: number) => {
        headersWithIndices.forEach(([header, index]) => {
          // index for header and corresponding cell at any row is the same
          if (i === index) {
            switch (header) {
              case "tags": {
                obj[header as keyof EntireQuestion] = [];
                if (cell.length < 2) break;
                const trimmedTags = cell.toLowerCase().trim();
                if (trimmedTags.includes(";")) {
                  obj[header as keyof EntireQuestion] = trimmedTags.split(";");
                } else {
                  obj[header as keyof EntireQuestion] = [trimmedTags];
                }
                break;
              }
              case "skipFromDataFeed": {
                obj[header as keyof EntireQuestion] = !!cell.trim().length;
                break;
              }
              case "displayCondition": {
                if (cell.length < 2) break;
                let conditionStrings: string[] = [];
                const parsedConditions: any[] = [];
                if (cell.includes(";")) {
                  // multiple conditions
                  conditionStrings = cell
                    .replace("\n", "")
                    .split(";")
                    .filter(Boolean);
                } else {
                  conditionStrings.push(cell);
                }
                conditionStrings.forEach((condition: string) => {
                  // make an object from every condition
                  // such as { variableName: ANSWER_VAR, operator: '>', value: 5 }
                  operators.every((operator) => {
                    const operatorStartIndex = condition.indexOf(operator);
                    if (operatorStartIndex >= 0) {
                      const variableName = condition
                        .substring(0, operatorStartIndex)
                        .trim();
                      const value = condition
                        .substring(operatorStartIndex + operator.length)
                        .trim();
                      const obj = { variableName, operator, value };
                      parsedConditions.push(obj);
                      return false;
                    }
                    return true;
                  });
                });
                obj[header as keyof EntireQuestion] = parsedConditions;
                break;
              }
              case "label":
                obj[header as keyof EntireQuestion] = cell
                  .trim()
                  .replaceAll("&", "")
                  .replaceAll("  ", " ")
                  .replaceAll(" ", "_")
                  .replaceAll(/\(|\)|,/g, "")
                  .toLowerCase();
                break;
              case "category":
                for (const [key, value] of Object.entries(
                  footprintCategoryMap,
                )) {
                  if (cell.toLowerCase() === value) {
                    obj[header as keyof EntireQuestion] = key;
                    obj["categoryString"] = cell;
                  }
                }
                break;
              case "orderNumber": {
                const orderNumberString = cell.toString();
                if (orderNumberString.length == 1) {
                  obj[header as keyof EntireQuestion] = `0${orderNumberString}`;
                } else {
                  obj[header as keyof EntireQuestion] = orderNumberString;
                }
                break;
              }
              default:
                obj[header as keyof EntireQuestion] = cell;
                break;
            }
          }
        });
      });
      return obj;
    });

    return rows.filter((row) => !row.skipFromDataFeed);
  }

  function createTranslationKeysForChoicesAndDescriptions(
    rows: EntireQuestion[],
  ) {
    let currentQuestion: string;
    let currentChoiceIndex: number;
    rows.forEach((row: any) => {
      // First row check
      if (!currentQuestion) {
        currentQuestion = row.id;
        currentChoiceIndex = 0;
        if (row.descriptionText?.length) {
          row["descriptionTranslationKey"] = `${row.id}_description`;
        }
      }
      // If current row is a choice row belonging to a previous question
      if (row.id === currentQuestion) {
        currentChoiceIndex += 1;
        row["choiceTranslationKey"] = `${row.id}_choice${currentChoiceIndex}`;
      }
      // If current row is a question row
      if (row.id !== currentQuestion) {
        currentQuestion = row.id;
        currentChoiceIndex = 1;
        if (row.descriptionText?.length) {
          row["descriptionTranslationKey"] = `${row.id}_description`;
        }
        if (row.actionDescriptionText?.length) {
          row["actionDescriptionTranslationKey"] =
            `${row.id}_actionDescription`;
        }
        row["choiceTranslationKey"] = `${row.id}_choice${currentChoiceIndex}`;
      }
    });
    return rows.map((row) => {
      const newQuestion = { ...row };
      delete newQuestion.skipFromDataFeed;

      return newQuestion;
    });
  }

  try {
    const results = await gsapi.spreadsheets.values.get(
      createGoogleSheetsFetchSettings(countryCode),
    );
    const data = results.data.values;

    console.log("Content (question & action data per country) - fetched.");

    if (data === undefined || data === null) {
      return Promise.reject(new Error(`Data is undefined for ${countryCode}`));
    }

    // take the first row to store all original headers
    const headerArray = data[0];

    // keys are used to hand-pick the desired headers and values to replace them with camelCasing
    const keysMap: Record<string, string> = {
      "Q/A identifier": "variableName",
      ID: "id",
      Category: "category",
      Tags: "tags",
      "Skip from data feed": "skipFromDataFeed",
      "Order number": "orderNumber",
      "Text (English)": "questionText",
      "Description/explanation text (English)": "descriptionText",
      "Math.js formula": "formula",
      "Choice text": "choiceText",
      "Choice value": "choiceValue",
      "Question display condition": "displayCondition",
      "Related variable name": "relatedVariableName",
      "Related variable value": "relatedVariableValue",
      Label: "label",
    };

    const headersWithIndices: [string, number][] = returnHeadersWithIndices(
      headerArray,
      keysMap,
    );

    const parsedRows = parseRowObjects(data, headersWithIndices);
    console.log(
      `Parsed a total of ${parsedRows.length} question/action rows for ${countryCode}`,
    );

    // checkForPropertyDuplicates(rows, 'id');
    // checkForPropertyDuplicates(rows, 'sortKey');

    const rowsWithIds = assignIdToChoiceRows(parsedRows);
    const rowsWithTranslationKeys =
      createTranslationKeysForChoicesAndDescriptions(rowsWithIds);
    const rowsWithChoices = choicesToQuestions(rowsWithTranslationKeys);

    const filteredRows = rowsWithChoices
      .filter((row) => row.questionText !== "")
      .map((row) => {
        return {
          id: row.id,
          choices: row.choices,
          questionText: row.questionText,
          variableName: row.variableName,
          formula: row.formula,
          sortKey: `${row.category}-${row.orderNumber}`,
          label: row.label,
          ...(row.displayCondition && {
            displayCondition: row.displayCondition,
          }),
          ...(row.descriptionText && { descriptionText: row.descriptionText }),
          ...(row.descriptionTranslationKey && {
            descriptionTranslationKey: row.descriptionTranslationKey,
          }),
          ...(row.relatedVariableName && {
            relatedVariableName: row.relatedVariableName,
          }),
        } as QuestionType;
      });

    console.log(
      `Returning ${filteredRows.length} questions for ${countryCode}\n`,
    );

    return filteredRows;
  } catch (err) {
    console.log("Caught an error fetching question & action data for", {
      countryCode,
    });
    console.log("err", err);
  }
  throw new Error(
    `Uncaught error occurred when fetching question & action data for ${countryCode}`,
  );
}

export async function allQuestionData(gsapi: sheets_v4.Sheets) {
  console.log(
    "\n-----\nFetching question and action data from country tabs\n-----\n",
  );
  const questionsPerCountry = {} as QuestionsPerCountry;
  for (const countryCode of countryCodes) {
    questionsPerCountry[countryCode as keyof QuestionsPerCountry] =
      await fetchCountryQuestionData(gsapi, countryCode);
  }
  return questionsPerCountry;
}
