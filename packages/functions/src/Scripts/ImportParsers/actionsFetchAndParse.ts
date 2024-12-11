/* eslint-disable camelcase */

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
Connects to a Google Sheets document specified in object "opt" and retrieves the specified range.
The Sheets doc needs to be shared to the service account email.
*/
import { countryCodes } from "../../../../common/src/models/countries";
import { Action } from "../../../../common/src/schemas";
import {
  parseConditionStrings,
  returnHeadersWithIndices,
} from "../../utils/helpers";
import { ActionsPerCountry } from "../../utils/models";
import { createGoogleSheetsFetchSettings } from "../Factory/createGoogleSheetsFetchSettings";
import * as dotenv from "dotenv";
import { sheets_v4 } from "googleapis";

dotenv.config({ path: `${__dirname}/../../../.env` });

function parseCountryActions(
  data: any,
  headersWithIndices: [string, number][],
): Action[] {
  const rows: Array<Action & { skipFromDataFeed?: boolean }> = data
    .slice(1)
    .map((row: any) => {
      const obj = {} as any;
      for (const [header, index] of headersWithIndices) {
        const cell = row[index] ?? "";

        // index for header and corresponding cell at any row is the same
        switch (header) {
          case "impactFormulas": {
            if (cell.trim().length === 0) {
              obj[header as keyof Action] = [{ conditions: [], formula: "0" }];
              break;
            }
            obj[header as keyof Action] = cell
              .replace("\n", "")
              .split(",")
              .map((formulas: string) => {
                const formulaWithConditions = formulas.split("|");
                if (formulaWithConditions.length === 1) {
                  return {
                    conditions: [],
                    formula: formulaWithConditions[0].trim(),
                  };
                } else {
                  return {
                    conditions: parseConditionStrings(
                      formulaWithConditions[0]
                        .split(";")
                        .map((condition) => condition.trim()),
                    ),
                    formula: formulaWithConditions[1].trim(),
                  };
                }
              });
            break;
          }
          case "skipFromDataFeed": {
            obj[header as keyof Action] = !!cell.trim().length;
            break;
          }
          case "tags": {
            obj[header as keyof Action] = [];
            if (cell.length < 2) break;
            const trimmedTags = cell.toLowerCase().trim();
            if (trimmedTags.includes(";")) {
              obj[header as keyof Action] = trimmedTags
                .replace(" ", "")
                .split(";");
            } else {
              obj[header as keyof Action] = [trimmedTags];
            }
            break;
          }
          case "displayCondition": {
            if (cell.length < 2) break;
            let conditionStrings: string[] = [];
            if (cell.includes(";")) {
              conditionStrings = cell
                .replace("\n", "")
                .split(";")
                .filter(Boolean);
            } else {
              conditionStrings.push(cell);
            }
            obj[header as keyof Action] =
              parseConditionStrings(conditionStrings);
            break;
          }
          case "skipIdsIfSelected": {
            if (cell.trim().length === 0) {
              obj[header as keyof Action] = [];
              break;
            }
            obj[header as keyof Action] = cell
              .split(",")
              .map((id: string) => id.trim());
            break;
          }
          default:
            if (cell) obj[header as keyof Action] = cell;
            break;
        }
      }

      return obj;
    });
  // filtering with decided criteria
  return rows
    .filter((row) => {
      if (!row.category || row.category === "") return false; // must have a category
      if (!row.id || row.id === "") return false; // must have an ID
      if (row.skipFromDataFeed) return false; // must not be skipped
      return true;
    })
    .map((row) => {
      const newAction = { ...row };
      delete newAction.skipFromDataFeed;

      return newAction;
    });
}

async function fetchCountryActions(
  googleSheetsApiClient: sheets_v4.Sheets,
  countryCode: string,
): Promise<Action[]> {
  try {
    console.log("Attempting to fetch actions for", { countryCode });
    const results = await googleSheetsApiClient.spreadsheets.values.get(
      createGoogleSheetsFetchSettings(`${countryCode}_ACT_2`),
    );
    const data = results.data.values;

    if (results.status === 200) {
      console.log("Content (challengeIdeaList) fetched with 200 OK", {
        countryCode,
      });
    } else {
      console.log(
        "Content (challengeIdeaList) fetched with something other than 200 OK",
        { countryCode },
      );
    }

    if (data === undefined || data === null) {
      console.log("results.data.values === undefined for", { countryCode });
      throw new Error("Data is undefined");
    }

    const headerArray = data[0];

    // keys are used to hand-pick the desired headers and values to replace them with desired ones
    const keysMap: Record<string, string> = {
      ID: "id",
      "Action identifier (automatic)": "variableName",
      Category: "category",
      Type: "type",
      "Impact formulas": "impactFormulas",
      "Skip from data feed": "skipFromDataFeed",
      "Display condition": "displayCondition",
      "Action suggestion": "actionSuggestion",
      Tags: "tags",
      "Action title (English)": "title",
      "Skip IDs if selected": "skipIdsIfSelected",
    };

    const headersWithIndices: [string, number][] = returnHeadersWithIndices(
      headerArray,
      keysMap,
    );
    const countryActions = parseCountryActions(data, headersWithIndices);

    console.log("Returning actions for", { countryCode }, "\n");
    return countryActions;
  } catch (err) {
    console.log("Caught an error fetching content for", { countryCode }, err);
    throw err;
  }
}

export async function fetchActionsPerCountry(
  googleSheetsApiClient: sheets_v4.Sheets,
) {
  console.log("\n-----\nFetching actions from country tabs\n-----\n");

  const actionsPerCountry = {} as ActionsPerCountry;

  for (const countryCode of countryCodes) {
    try {
      actionsPerCountry[countryCode as keyof ActionsPerCountry] =
        await fetchCountryActions(googleSheetsApiClient, countryCode);
    } catch {
      console.log("Fetching failed for", countryCode);
    }
  }

  return actionsPerCountry;
}
