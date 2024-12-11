import { MathScopes } from "../types/genericTypes";
import { evaluate } from "./securedMathjs";

const getChoiceNumericalValue = (
  choiceValue: string | number | undefined,
  mathScope: MathScopes,
) => {
  if (typeof choiceValue === "string") {
    return evaluate(choiceValue, mathScope);
  }
  if (typeof choiceValue === "number") {
    return choiceValue;
  }
  return undefined;
};

export default getChoiceNumericalValue;
