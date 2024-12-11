/* eslint-disable @typescript-eslint/no-explicit-any,camelcase */
// Connects to a Google Sheets document specified in object "opt" and retrieves the specified range.
// The Sheets doc needs to be shared to the service account email.
import { countries } from "../../../../common/src/models/countries";
import { returnHeadersWithIndices } from "../../utils/helpers";
import { ConstantsPerCountry } from "../../utils/models";
import { createGoogleSheetsFetchSettings } from "../Factory/createGoogleSheetsFetchSettings";
import { sheets_v4 } from "googleapis";

import Sheets = sheets_v4.Sheets;

type ConstantType = {
  constantName?: string;
  defaultValue?: number;
  EU?: number;
};

export async function fetchAndParseConstants(googleSheetsApiClient: Sheets) {
  const results = await googleSheetsApiClient.spreadsheets.values.get(
    createGoogleSheetsFetchSettings("Constants"),
  );
  const data = results.data.values;
  const constants = {} as ConstantsPerCountry;
  if (data === undefined || data === null) return constants;

  // Log a slice of the data to see that it is correct
  console.log("Snapshot of fetched data in original form: ", data.slice(1, 5));

  // take the first row to store all original headers
  const headerArray = data[0];

  // store constant "groups" (default, fi, gr, ee, etc..) in an array for sorting them later
  const constantGroups = data[0].slice(1);

  // keys are used to hand-pick the desired headers and values to replace them with camelCasing
  const keysMap: Record<string, string> = {
    "Constant name": "constantName",
    DEFAULT: "DEFAULT",
  };
  countries.forEach((country) => {
    keysMap[country.code] = country.code;
  });

  const headersWithIndices = returnHeadersWithIndices(headerArray, keysMap);

  // create objects with new headers as keys and cell contents as values
  // picking only the columns that hold the desired data
  const rows: ConstantType[] = data.slice(1).map((row) => {
    const obj = {} as any;
    row.forEach((cell, i) => {
      headersWithIndices.forEach(([header, index]) => {
        // index for header and corresponding cell at any row is the same
        if (i === index && cell !== "") {
          obj[header] = cell;
        }
      });
    });
    return obj as ConstantType;
  });

  // Create an object for each country's constants and sort the values properly to those from each row
  constantGroups.forEach((country) => {
    constants[country] = {};
    rows.forEach((row, index) => {
      const languageKey = country as keyof ConstantType;
      // Check if the constant has value for current country
      if (row.constantName && row[languageKey]) {
        const value: any = row[languageKey];
        let valueToSet: any;
        // Check if the constant value contains any letters and skip them
        if (/[a-zA-Z]/g.test(value)) {
          console.log(
            "The following value at index",
            index,
            "is not a number or convertible to a number so it is skipped, see the source data for the value: ",
            value,
          );
        } else {
          // Check if the constant value came from Sheets as a percentage. Using the Number() method
          // on a string percentage makes it a NaN so it is "re-converted" to percentage (60 % => 0.6)
          if (isNaN(Number(value))) {
            valueToSet = parseFloat(value) / 100;
            constants[country][row.constantName] = valueToSet;
            // Regular numbers
          } else {
            valueToSet = Number(row[languageKey]);
            constants[country][row.constantName] = valueToSet;
          }
        }
      }
    });
  });

  return constants;
}
