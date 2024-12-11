import {
  actionSchema,
  questionSchema,
  QuestionType,
} from "../../../common/src/schemas";
import { EntireQuestion } from "./models";

function validateQuestions(countryData: QuestionType[], countryCode: string) {
  const validatedRows: QuestionType[] = [];
  const unValidatedRows: QuestionType[] = [];
  countryData.forEach((row: QuestionType, index: number) => {
    const rowCheck = questionSchema.safeParse(row);
    if (rowCheck.success) {
      validatedRows.push(row);
    } else {
      unValidatedRows.push(row);
      console.log(
        "Row at index ",
        index,
        " failed schema validation. Contents of the row: ",
        row,
      );
      console.log("Zod error: ", rowCheck);
    }
  });

  // Return the results array only if all rows passed the schema parsing
  if (!unValidatedRows.length) {
    console.log(
      countryCode,
      ": All ",
      validatedRows.length,
      "question rows were properly validated.",
    );
  } else {
    console.log(
      countryCode,
      ": Out of",
      unValidatedRows.length,
      "question rows failed validation. No objects taken to database. See above for logged errors.",
    );
  }
  return validatedRows;
}

function validateActions(
  countryData: EntireQuestion[],
  countryCode: string,
): EntireQuestion[] {
  const validatedRows: EntireQuestion[] = [];
  const unValidatedRows: EntireQuestion[] = [];
  countryData.forEach((row: EntireQuestion, index: number) => {
    const rowCheck = actionSchema.safeParse(row);
    if (rowCheck.success) {
      validatedRows.push(row);
    } else {
      unValidatedRows.push(row);
      console.log(
        "Row at index ",
        index,
        " failed schema validation. Contents of the row: ",
        row,
      );
      console.log("Zod error: ", rowCheck);
    }
  });

  // Return the results array only if all rows passed the schema parsing
  if (!unValidatedRows.length) {
    console.log(
      "All",
      validatedRows.length,
      "action rows were properly validated for ",
      { countryCode },
    );
  } else {
    console.log(
      countryCode,
      " : ",
      unValidatedRows.length,
      "action rows failed validation. See above for logged errors.",
    );
  }
  return validatedRows;
}

export { validateQuestions, validateActions };
